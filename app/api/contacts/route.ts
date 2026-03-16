import { NextRequest, NextResponse } from "next/server";
import { getContacts, addContact } from "@/app/dashboard/contacts/actions";

// GET: /api/contacts
export async function GET(req: NextRequest) {
  // Support filtering by ?filter=name&tag=tag1
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
  // Always spread result to produce a plain new object for response
  if (result && result.success) return NextResponse.json({ ...result });
  return NextResponse.json({ error: typeof result?.error === "object" ? { ...result.error } : result.error }, { status: 400 });
}