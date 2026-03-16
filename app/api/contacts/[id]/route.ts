import { NextRequest, NextResponse } from "next/server";
import { updateContact, deleteContact } from "@/app/dashboard/contacts/actions";

// PUT: /api/contacts/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  let data: any = {};
  try {
    data = await req.json();
  } catch {}
  data.id = params.id;
  const result = await updateContact(data);
  if (result && result.success) {
    return NextResponse.json({ success: true });
  } else if (result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 400 });
}

// DELETE: /api/contacts/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await deleteContact(params.id);
  if (result.success) return NextResponse.json({ success: true });
  return NextResponse.json({ error: result.error }, { status: 400 });
}