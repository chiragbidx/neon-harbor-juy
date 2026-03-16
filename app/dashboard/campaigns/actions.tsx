"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { campaigns, contacts, campaignRecipients } from "@/lib/db/schema";
import { eq, and, ilike, sql, inArray } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";
import sgMail from "@sendgrid/mail";

const CAMPAIGN_STATUS = [
  "draft",
  "scheduled",
  "sending",
  "sent",
  "failed",
] as const;
type CampaignStatus = typeof CAMPAIGN_STATUS[number];

const campaignInputSchema = z.object({
  name: z.string().min(2, "Campaign name is required"),
  subject: z.string().min(2, "Subject is required"),
  body: z.string().min(2, "Body is required"),
  recipientTag: z.string().optional(), // send to all if blank, or contacts with this tag
  scheduledAt: z.string().optional(),
});

export async function getCampaigns({ filter = "" } = {}) {
  const session = await getAuthSession();
  if (!session?.userId) throw new Error("Not authenticated");

  // Get teamId
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) throw new Error("No team found for user");

  let whereClause = eq(campaigns.teamId, tm.teamId);
  if (filter) {
    whereClause = and(whereClause, ilike(campaigns.name, `%${filter}%`));
  }

  const data = await db.query.campaigns.findMany({
    where: whereClause,
    orderBy: (cmp) => [cmp.createdAt.desc()],
  });
  return data;
}

export async function addCampaign(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found for user" };

  const input = campaignInputSchema.safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    recipientTag: formData.get("recipientTag"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!input.success) {
    return { error: input.error.flatten().fieldErrors };
  }

  const inserted = await db
    .insert(campaigns)
    .values({
      teamId: tm.teamId,
      name: input.data.name,
      subject: input.data.subject,
      body: input.data.body,
      status: input.data.scheduledAt ? "scheduled" : "draft",
      scheduledAt: input.data.scheduledAt ? new Date(input.data.scheduledAt) : undefined,
    })
    .returning();

  return { success: true, campaign: inserted[0] };
}

export async function updateCampaign(formData: FormData) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found" };

  const id = formData.get("id");
  const input = campaignInputSchema.partial().safeParse({
    name: formData.get("name"),
    subject: formData.get("subject"),
    body: formData.get("body"),
    recipientTag: formData.get("recipientTag"),
    scheduledAt: formData.get("scheduledAt"),
  });

  if (!input.success) {
    return { error: input.error.flatten().fieldErrors };
  }

  // Authorization
  const campaign = await db.query.campaigns.findFirst({
    where: (cmp) => and(eq(cmp.teamId, tm.teamId), eq(cmp.id, id as string)),
    columns: { id: true },
  });
  if (!campaign) return { error: "Campaign not found" };

  await db
    .update(campaigns)
    .set({
      ...input.data,
      updatedAt: new Date(),
    })
    .where(and(eq(campaigns.id, id as string), eq(campaigns.teamId, tm.teamId)));

  return { success: true };
}

export async function deleteCampaign(id: string) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found" };

  await db
    .delete(campaigns)
    .where(and(eq(campaigns.id, id), eq(campaigns.teamId, tm.teamId)));

  return { success: true };
}

// --- Send Campaign ---
async function getRecipientList(teamId: string, recipientTag?: string) {
  let whereClause = eq(contacts.teamId, teamId);
  if (recipientTag) {
    whereClause = and(whereClause, sql`${contacts.tags} ? ${recipientTag}`);
  }
  const cnt = await db.query.contacts.findMany({
    where: whereClause,
    columns: { id: true, name: true, email: true, tags: true },
  });
  return cnt;
}

export async function sendCampaign(id: string) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found" };

  const campaign = await db.query.campaigns.findFirst({
    where: (cmp) => and(eq(cmp.teamId, tm.teamId), eq(cmp.id, id)),
  });

  if (!campaign) return { error: "Campaign not found" };
  if (campaign.status === "sent" || campaign.status === "sending") {
    return { error: "Campaign already sent or in progress" };
  }

  const recipients = await getRecipientList(tm.teamId, null); // TODO: add tag filter if campaign stores it
  if (!recipients.length) return { error: "No contacts to send to." };

  // Prepare mail client
  if (!process.env.SENDGRID_API_KEY) {
    return { error: "Sending not configured; contact admin." };
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  await db.update(campaigns).set({ status: "sending" }).where(eq(campaigns.id, id));

  let sentCount = 0;
  try {
    for (const recipient of recipients) {
      const msg = {
        to: recipient.email,
        from: process.env.SENDGRID_FROM_EMAIL ?? "hi@chirag.co",
        subject: campaign.subject,
        html: campaign.body,
        // Could add open/click tracking params here
      };
      try {
        await sgMail.send(msg);
        sentCount++;
        await db.insert(campaignRecipients).values({
          campaignId: id,
          contactId: recipient.id,
          sentAt: new Date(),
          delivered: true,
        });
      } catch (mailError) {
        await db.insert(campaignRecipients).values({
          campaignId: id,
          contactId: recipient.id,
          sentAt: new Date(),
          delivered: false,
        });
      }
    }
    await db.update(campaigns).set({
      status: "sent",
      sentAt: new Date(),
    }).where(eq(campaigns.id, id));
    return { success: true, sentCount };
  } catch (e) {
    await db.update(campaigns).set({ status: "failed" }).where(eq(campaigns.id, id));
    return { error: "Campaign failed with error", detail: e?.toString?.() ?? "" };
  }
}