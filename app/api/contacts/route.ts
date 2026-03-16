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
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.set(key, value.join(","));
    } else if (key === "tags" && typeof value === "string") {
      formData.set(key, value);
    } else {
      formData.set(key, value);
    }
  });
  const result = await addContact(formData);
  // Only send plain primitives/arrays via new response objects
  if (result && result.success) {
    return NextResponse.json({ success: true });
  } else if (result && result.error) {
    if (
      typeof result.error === "string" ||
      Array.isArray(result.error)
    ) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    // If error is an object, shallow clone its contents
    return NextResponse.json({ error: { ...result.error } }, { status: 400 });
  } else {
    // fallback: generic error
    return NextResponse.json({ error: "Unknown error" }, { status: 400 });
  }
}