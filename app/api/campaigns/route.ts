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
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value);
  });
  const result = await addCampaign(formData);

  // Only send primitives/arrays via new response objects
  if (result && result.success) {
    return NextResponse.json({ success: true });
  } else if (result && result.error) {
    if (
      typeof result.error === "string" ||
      Array.isArray(result.error)
    ) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ error: { ...result.error } }, { status: 400 });
  } else {
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}