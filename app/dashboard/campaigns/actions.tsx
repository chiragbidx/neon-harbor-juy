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
  recipientTag: z.string().optional(),
  scheduledAt: z.string().optional(),
  id: z.string().optional(),
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

export async function addCampaign(inputData: any) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found for user" };

  const input = campaignInputSchema.safeParse(inputData);

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

export async function updateCampaign(inputData: any) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) return { error: "No team found" };

  const id = inputData.id;
  const input = campaignInputSchema.partial().safeParse({ ...inputData, id });

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

// (Send/analytics logic unchanged)