"use server";

import { db } from "@/lib/db/client";
import { campaigns, campaignRecipients, contacts } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

export async function getCampaignAnalytics(campaignId: string) {
  const session = await getAuthSession();
  if (!session?.userId) throw new Error("Not authenticated");
  const tm = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!tm?.teamId) throw new Error("No team found for user");

  const campaign = await db.query.campaigns.findFirst({
    where: (cmp) => and(eq(cmp.teamId, tm.teamId), eq(cmp.id, campaignId)),
  });
  if (!campaign) return null;

  const recipients = await db.query.campaignRecipients.findMany({
    where: (cr) => eq(cr.campaignId, campaignId),
  });

  // Fetch contact names/emails for each recipient for richer analytics.
  let recipientDetails: any[] = [];
  if (recipients.length) {
    const contactIds = recipients.map((r) => r.contactId);
    const contactMap = new Map<string, { name: string; email: string }>();
    const contactRows = await db.query.contacts.findMany({
      where: (c) => c.id.in(contactIds),
      columns: { id: true, name: true, email: true },
    });
    for (const c of contactRows) {
      contactMap.set(c.id, { name: c.name, email: c.email });
    }
    recipientDetails = recipients.map((r) => ({
      ...r,
      contactName: contactMap.get(r.contactId)?.name ?? "",
      contactEmail: contactMap.get(r.contactId)?.email ?? "",
    }));
  }

  return {
    campaign,
    delivered: recipients.filter((r) => r.delivered).length,
    opened: recipients.filter((r) => r.opened).length,
    clicked: recipients.filter((r) => r.clicked).length,
    recipients: recipientDetails,
  };
}