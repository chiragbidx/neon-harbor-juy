import { NextRequest, NextResponse } from "next/server";
import { updateContact, deleteContact } from "@/app/dashboard/contacts/actions";

// PUT: /api/contacts/:id
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const data = await req.json();
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.set(key, value.join(","));
    } else {
      formData.set(key, value);
    }
  });
  formData.set("id", params.id);
  const result = await updateContact(formData);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}

// DELETE: /api/contacts/:id
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const result = await deleteContact(params.id);
  if (result.success) return NextResponse.json(result);
  return NextResponse.json({ error: result.error }, { status: 400 });
}