import { NextRequest, NextResponse } from "next/server";
import { sendCampaign } from "@/app/dashboard/campaigns/actions";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await sendCampaign(params.id);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}