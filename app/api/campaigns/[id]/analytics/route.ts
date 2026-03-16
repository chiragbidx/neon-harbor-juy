import { NextRequest, NextResponse } from "next/server";
import { getCampaignAnalytics } from "@/app/dashboard/campaigns/[campaignId]/actions";

// Next.js 16: context.params may be a Promise in RouteHandlerConfig
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const data = await getCampaignAnalytics(id);
  if (data) return NextResponse.json(data);
  return NextResponse.json({ error: "No analytics found" }, { status: 404 });
}