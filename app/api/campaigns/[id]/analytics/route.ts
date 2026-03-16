import { NextRequest, NextResponse } from "next/server";
import { getCampaignAnalytics } from "@/app/dashboard/campaigns/[campaignId]/actions";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = await getCampaignAnalytics(params.id);
  if (data) return NextResponse.json(data);
  return NextResponse.json({ error: "No analytics found" }, { status: 404 });
}