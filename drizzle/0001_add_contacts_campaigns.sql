-- Add contacts table
CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" TEXT NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "tags" JSONB NOT NULL DEFAULT '[]',
  "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "contacts_team_email_idx" ON "contacts"("team_id", "email");

-- Add campaigns table
CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "team_id" TEXT NOT NULL REFERENCES "teams"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'draft',
  "scheduled_at" TIMESTAMPTZ,
  "sent_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "updated_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);