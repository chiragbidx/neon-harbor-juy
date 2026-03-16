import { NextRequest, NextResponse } from "next/server";
import { getCampaignAnalytics } from "@/app/dashboard/campaigns/[campaignId]/actions";

// Next.js 16: context.params must be sync object { id: string }
export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const data = await getCampaignAnalytics(id);
  if (data) return NextResponse.json(data);
  return NextResponse.json({ error: "No analytics found" }, { status: 404 });
}