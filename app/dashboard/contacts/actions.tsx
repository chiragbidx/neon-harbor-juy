"use server";

import { z } from "zod";
import { db } from "@/lib/db/client";
import { contacts } from "@/lib/db/schema";
import { eq, and, ilike, sql } from "drizzle-orm";
import { getAuthSession } from "@/lib/auth/session";

const contactInputSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  tags: z.array(z.string()).optional(),
  id: z.string().optional(),
});

export async function getContacts({ filter = "", tag = "" } = {}) {
  const session = await getAuthSession();
  if (!session?.userId) throw new Error("Not authenticated");

  const result = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!result?.teamId) throw new Error("No team found");

  let whereClause = eq(contacts.teamId, result.teamId);
  if (filter) {
    whereClause = and(
      whereClause,
      ilike(contacts.name, `%${filter}%`)
    );
  }
  if (tag) {
    whereClause = and(
      whereClause,
      sql`${contacts.tags} ? ${tag}`
    );
  }

  const data = await db.query.contacts.findMany({
    where: whereClause,
    orderBy: (ct) => [ct.createdAt.desc()],
  });

  return data;
}

export async function addContact(inputData: any) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const teamResult = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!teamResult?.teamId) return { error: "No team found for user" };

  // Ensure tags is always array
  let tags: string[] = [];
  if (Array.isArray(inputData.tags)) {
    tags = inputData.tags.map((t: any) => (typeof t === "string" ? t.trim() : "")).filter(Boolean);
  } else if (typeof inputData.tags === "string" && inputData.tags.length > 0) {
    tags = inputData.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  const input = contactInputSchema.safeParse({
    name: inputData.name,
    email: inputData.email,
    tags,
  });

  if (!input.success) {
    return { error: input.error.flatten().fieldErrors };
  }

  // Prevent duplicate email on team
  const exists = await db.query.contacts.findFirst({
    where: (c) => and(eq(c.teamId, teamResult.teamId), eq(c.email, input.data.email)),
    columns: { id: true },
  });
  if (exists) {
    return { error: { email: ["This email already exists for your team."] } };
  }

  await db.insert(contacts).values({
    teamId: teamResult.teamId,
    name: input.data.name,
    email: input.data.email,
    tags: input.data.tags ?? [],
  });

  return { success: true };
}

export async function updateContact(inputData: any) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const teamResult = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!teamResult?.teamId) return { error: "No team found" };

  // Ensure tags is always array
  let tags: string[] = [];
  if (Array.isArray(inputData.tags)) {
    tags = inputData.tags.map((t: any) => (typeof t === "string" ? t.trim() : "")).filter(Boolean);
  } else if (typeof inputData.tags === "string" && inputData.tags.length > 0) {
    tags = inputData.tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }
  const id = inputData.id;
  const input = contactInputSchema.partial().safeParse({
    name: inputData.name,
    email: inputData.email,
    tags,
    id,
  });

  if (!input.success) {
    return { error: input.error.flatten().fieldErrors };
  }
  // Ensure contact belongs to team
  const existing = await db.query.contacts.findFirst({
    where: (c) => and(eq(c.teamId, teamResult.teamId), eq(c.id, id)),
    columns: { id: true },
  });
  if (!existing) return { error: "Contact not found for your team" };

  await db
    .update(contacts)
    .set({
      ...input.data,
      updatedAt: new Date(),
    })
    .where(and(eq(contacts.id, id), eq(contacts.teamId, teamResult.teamId)));

  return { success: true };
}

export async function deleteContact(id: string) {
  const session = await getAuthSession();
  if (!session?.userId) return { error: "Not authenticated" };
  const teamResult = await db.query.teamMembers.findFirst({
    where: (tm) => eq(tm.userId, session.userId),
    columns: { teamId: true },
  });
  if (!teamResult?.teamId) return { error: "No team found" };

  await db
    .delete(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.teamId, teamResult.teamId)));

  return { success: true };
}