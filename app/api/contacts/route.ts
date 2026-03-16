import { NextRequest, NextResponse } from "next/server";
import { getContacts, addContact } from "@/app/dashboard/contacts/actions";

// GET: /api/contacts
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const filter = searchParams.get("filter") ?? "";
  const tag = searchParams.get("tag") ?? "";

  try {
    const contacts = await getContacts({ filter, tag });
    return NextResponse.json(contacts);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Internal Error" }, { status: 400 });
  }
}

// POST: /api/contacts
export async function POST(req: NextRequest) {
  let data: any;
  try {
    data = await req.json();
  } catch {
    data = {};
  }
  // Hand payload straight to action (array tags accepted)
  const result = await addContact(data);
  if (result && result.success) {
    return NextResponse.json({ success: true });
  } else if (result && result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ error: "Unknown error" }, { status: 400 });
}