import { NextRequest, NextResponse } from "next/server";
import { updateCampaign, deleteCampaign } from "@/app/dashboard/campaigns/actions";

// PUT: /api/campaigns/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.set(key, value);
  });
  formData.set("id", params.id);
  const result = await updateCampaign(formData);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}

// DELETE: /api/campaigns/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await deleteCampaign(params.id);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}