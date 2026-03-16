import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, addCampaign } from "@/app/dashboard/campaigns/actions";

// GET: /api/campaigns
export async function GET() {
  try {
    const campaigns = await getCampaigns();
    return NextResponse.json(campaigns);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Internal Error" }, { status: 400 });
  }
}

// POST: /api/campaigns
export async function POST(req: NextRequest) {
  let data: any;
  try {
    data = await req.json();
  } catch {
    data = {};
  }
  const result = await addCampaign(data);

  if (result && result.success) {
    return NextResponse.json({ success: true });
  } else if (result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 400 });
}