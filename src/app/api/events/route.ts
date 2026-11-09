import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToAdminEvent, mapAdminEventToDbRow } from "@/lib/eventUtils";
import type { AdminEvent } from "@/components/admin/events/EventForm";
import { applyRateLimit, adminLimiter, generalLimiter } from "@/lib/rateLimit";
import { eventSchema } from "@/lib/validation";
import { DANGEROUS_EXTENSIONS } from "@/lib/fileSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "events:get");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    let query = supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (type && type !== "ALL") {
      query = query.ilike("type", type);
    }
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET events error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const events: AdminEvent[] = (data || []).map(mapDbRowToAdminEvent);

    return NextResponse.json(events, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET events error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "events:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody: AdminEvent = await request.json();

    const parsed = eventSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid event submission data" },
        { status: 400 }
      );
    }

    const body = parsed.data;

    // Check imageUrl if provided
    if (body.imageUrl) {
      const lowerImg = body.imageUrl.toLowerCase();
      if (DANGEROUS_EXTENSIONS.some(ext => lowerImg.includes(ext))) {
        return NextResponse.json(
          { error: "Event banner file type is strictly forbidden." },
          { status: 400 }
        );
      }
    }

    const id = body.id || rawBody.id || `event-${Date.now()}`;
    const row = mapAdminEventToDbRow({ ...rawBody, ...body, id } as unknown as AdminEvent);

    const { data, error } = await supabase
      .from("events")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST event error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToAdminEvent(data), { status: 201 });
  } catch (err: any) {
    console.error("API POST event error:", err);
    return NextResponse.json({ error: err.message || "Failed to create event" }, { status: 500 });
  }
}
