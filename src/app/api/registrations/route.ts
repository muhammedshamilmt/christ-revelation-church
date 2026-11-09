import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { RegistrationData } from "@/lib/useRegistrations";
import { applyRateLimit, submitLimiter, adminLimiter, generalLimiter } from "@/lib/rateLimit";
import { sanitizeText } from "@/lib/validation";
import { z } from "zod";

export const dynamic = "force-dynamic";

const registrationInputSchema = z.object({
  eventId: z.string().min(1, "Event ID is required").max(100),
  name: z.string().min(1, "Name is required").max(100).transform(sanitizeText),
  email: z.string().email("Invalid email").max(254).transform(v => v.trim().toLowerCase()),
  phone: z.string().max(35).optional().transform(v => (v ? sanitizeText(v) : "")),
  dietary: z.string().max(100).optional().default("None").transform(sanitizeText),
  guests: z.union([z.string(), z.number()]).optional().default("1").transform(v => String(v)),
  message: z.string().max(1500).optional().transform(v => (v ? sanitizeText(v) : "")),
});

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "registrations:get");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("event_id");

    let query = supabase
      .from("event_registrations")
      .select("*")
      .order("applied_at", { ascending: false });

    if (eventId) {
      query = query.eq("event_id", eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET registrations error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const registrations: RegistrationData[] = (data || []).map((row) => ({
      _id: row.id,
      event_id: row.event_id,
      name: row.name,
      email: row.email,
      phone: row.phone || "",
      dietary: row.dietary || "None",
      guests: row.guests || "1",
      appliedAt: row.applied_at || row.created_at,
      message: row.message || "",
      status: row.status as RegistrationData["status"],
    }));

    return NextResponse.json(registrations, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET registrations error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch registrations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, submitLimiter, "registrations:submit");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody = await request.json();
    const resolvedName = (rawBody.name || `${rawBody.firstName || ""} ${rawBody.lastName || ""}`).trim();

    const parsed = registrationInputSchema.safeParse({
      ...rawBody,
      name: resolvedName,
      message: rawBody.notes || rawBody.message || "",
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid registration form data" },
        { status: 400 }
      );
    }

    const validated = parsed.data;
    const newId = `reg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const row = {
      id: newId,
      event_id: validated.eventId,
      name: validated.name,
      email: validated.email,
      phone: validated.phone || "",
      dietary: validated.dietary || "None",
      guests: validated.guests || "1",
      message: validated.message || "",
      status: "pending",
      applied_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("event_registrations")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST registration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const registration: RegistrationData = {
      _id: data.id,
      event_id: data.event_id,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      dietary: data.dietary || "None",
      guests: data.guests || "1",
      appliedAt: data.applied_at,
      message: data.message || "",
      status: data.status,
    };

    return NextResponse.json(registration, { status: 201 });
  } catch (err: any) {
    console.error("API POST registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to submit registration" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "registrations:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const { regId, status } = body;

    if (!regId || !status) {
      return NextResponse.json({ error: "regId and status are required" }, { status: 400 });
    }

    const allowedStatuses = ["confirmed", "pending", "waitlist", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("event_registrations")
      .update({ status })
      .eq("id", regId)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH registration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, registration: data });
  } catch (err: any) {
    console.error("API PATCH registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to update registration" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "registrations:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const regId = searchParams.get("id");

    if (!regId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("id", regId);

    if (error) {
      console.error("Supabase DELETE registration error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: regId });
  } catch (err: any) {
    console.error("API DELETE registration error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete registration" }, { status: 500 });
  }
}
