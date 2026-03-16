-- Add campaign_recipients table
CREATE TABLE IF NOT EXISTS "campaign_recipients" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "campaign_id" TEXT NOT NULL REFERENCES "campaigns"("id") ON DELETE CASCADE,
  "contact_id" TEXT NOT NULL REFERENCES "contacts"("id") ON DELETE CASCADE,
  "sent_at" TIMESTAMPTZ,
  "delivered" BOOLEAN DEFAULT FALSE,
  "opened" BOOLEAN DEFAULT FALSE,
  "clicked" BOOLEAN DEFAULT FALSE,
  "open_tracking_id" TEXT,
  "click_tracking_id" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now() NOT NULL
);