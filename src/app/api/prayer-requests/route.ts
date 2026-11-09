import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToPrayerRequest, mapPrayerRequestToDbRow } from "@/lib/prayerUtils";
import type { PrayerRequestItem } from "@/lib/usePrayerRequests";
import { applyRateLimit, submitLimiter, generalLimiter } from "@/lib/rateLimit";
import { prayerRequestSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, 'prayer:get');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query = supabase
      .from("prayer_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.ilike("category", category);
    }
    if (status && status !== "All") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET prayer_requests error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const requests: PrayerRequestItem[] = (data || []).map(mapDbRowToPrayerRequest);

    return NextResponse.json(requests, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET prayer_requests error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch prayer requests" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Rate limit submissions: 8 / min
  const rateLimitResponse = applyRateLimit(request, submitLimiter, 'prayer:submit');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await request.json();

    // Input validation with Zod
    const parsed = prayerRequestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const validated = parsed.data;
    const id = validated.id || `pray-${Date.now()}`;
    const row = mapPrayerRequestToDbRow({
      ...validated,
      id,
      status: (validated.status as any) || "New",
      createdAt: validated.createdAt || new Date().toISOString(),
    });

    const { data, error } = await supabase
      .from("prayer_requests")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST prayer_request error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToPrayerRequest(data), { status: 201 });
  } catch (err: any) {
    console.error("API POST prayer_request error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit prayer request" }, { status: 500 });
  }
}
