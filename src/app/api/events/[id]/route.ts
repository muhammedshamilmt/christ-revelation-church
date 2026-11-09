import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToAdminEvent, mapAdminEventToDbRow } from "@/lib/eventUtils";
import type { AdminEvent } from "@/components/admin/events/EventForm";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .or(`id.eq."${id}",id.eq."${decodedId}"`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET event error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = mapDbRowToAdminEvent(data);
    return NextResponse.json(event, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET event error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch event" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patch: Partial<AdminEvent> = await request.json();
    const row = mapAdminEventToDbRow(patch);

    const { data, error } = await supabase
      .from("events")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH event error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToAdminEvent(data));
  } catch (err: any) {
    console.error("API PATCH event error:", err);
    return NextResponse.json({ error: err.message || "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Supabase DELETE event error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("API DELETE event error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete event" }, { status: 500 });
  }
}
