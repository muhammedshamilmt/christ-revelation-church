import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToPrayerRequest, mapPrayerRequestToDbRow } from "@/lib/prayerUtils";
import type { PrayerRequestItem } from "@/lib/usePrayerRequests";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET prayer_request error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Prayer request not found" }, { status: 404 });
    }

    return NextResponse.json(mapDbRowToPrayerRequest(data));
  } catch (err: any) {
    console.error("API GET prayer_request error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch prayer request" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patch: Partial<PrayerRequestItem> = await request.json();
    const row = mapPrayerRequestToDbRow(patch);

    const { data, error } = await supabase
      .from("prayer_requests")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH prayer_request error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToPrayerRequest(data));
  } catch (err: any) {
    console.error("API PATCH prayer_request error:", err);
    return NextResponse.json({ error: err.message || "Failed to update prayer request" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("prayer_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase DELETE prayer_request error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("API DELETE prayer_request error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete prayer request" }, { status: 500 });
  }
}
