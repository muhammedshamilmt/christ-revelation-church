import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { applyRateLimit, adminLimiter, generalLimiter } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "transactions:get");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const designation = searchParams.get("designation");
    const limit = searchParams.get("limit");

    let query = supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (status && status !== "All") {
      query = query.ilike("status", status);
    }
    if (designation && designation !== "All") {
      query = query.ilike("designation", designation);
    }
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET transactions error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = (data || []).map((row: any) => {
      const numAmount = typeof row.amount === "number" ? row.amount : parseFloat(row.amount || "0");
      const symbol = row.currency_symbol || "£";
      return {
        id: row.id,
        name: row.is_anonymous ? "Anonymous Donor" : (row.name || "Supporter"),
        email: row.is_anonymous ? "donor-hidden@crc.org" : (row.email || ""),
        amount: `${symbol}${numAmount.toFixed(2)}`,
        rawAmount: numAmount,
        currency: row.currency || "GBP",
        currencySymbol: symbol,
        designation: row.designation || "General Ministry",
        status: row.status || "Completed",
        date: row.date || row.created_at,
        avatar: row.avatar || (row.name ? row.name.charAt(0).toUpperCase() : "A"),
        color: row.color || "bg-blue-500",
        isAnonymous: Boolean(row.is_anonymous),
        campaign_id: row.campaign_id || null,
        created_at: row.created_at,
      };
    });

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET transactions error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "transactions:post");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const avatar = body.name ? body.name.charAt(0).toUpperCase() : (body.isAnonymous ? "A" : "U");
    const colors = ["bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    const numAmount = typeof body.amount === "number" 
      ? body.amount 
      : parseFloat(String(body.amount || "0").replace(/[^0-9.-]+/g, "")) || 0;

    const row = {
      id: body.id || `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: body.isAnonymous ? "Anonymous Donor" : (body.name || "Supporter"),
      email: body.email || "donor@crc.org",
      amount: numAmount,
      currency: body.currency || "GBP",
      currency_symbol: body.currencySymbol || "£",
      designation: body.designation || "General Ministry",
      status: body.status || "Completed",
      date: body.date || new Date().toISOString(),
      avatar,
      color,
      is_anonymous: Boolean(body.isAnonymous),
      campaign_id: body.campaignId || body.campaign_id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(row)
      .select()
      .single();

    if (error) {
      console.error("Supabase POST transactions error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const symbol = data.currency_symbol || "£";
    return NextResponse.json({
      id: data.id,
      name: data.name,
      email: data.email,
      amount: `${symbol}${Number(data.amount).toFixed(2)}`,
      rawAmount: Number(data.amount),
      currency: data.currency,
      currencySymbol: symbol,
      designation: data.designation,
      status: data.status,
      date: data.date,
      avatar: data.avatar,
      color: data.color,
      isAnonymous: data.is_anonymous,
      campaign_id: data.campaign_id,
      created_at: data.created_at,
    }, { status: 201 });
  } catch (err: any) {
    console.error("API POST transactions error:", err);
    return NextResponse.json({ error: err.message || "Failed to create transaction" }, { status: 500 });
  }
}
