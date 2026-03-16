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
  const data = await req.json();
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value);
  });
  const result = await addCampaign(formData);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}