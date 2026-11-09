import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToGalleryItem, mapGalleryItemToDbRow } from "@/lib/galleryUtils";
import { GALLERY_ITEMS, type GalleryItem } from "@/lib/gallery";
import { applyRateLimit, uploadLimiter, generalLimiter } from "@/lib/rateLimit";
import { galleryItemSchema } from "@/lib/validation";
import { DANGEROUS_EXTENSIONS } from "@/lib/fileSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "gallery:get");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const mediaType = searchParams.get("mediaType");
    const search = searchParams.get("search");

    let query = supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.ilike("category", category);
    }

    if (mediaType && mediaType !== "all") {
      query = query.eq("media_type", mediaType);
    }

    if (search && search.trim()) {
      const s = search.trim();
      query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,location.ilike.%${s}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET gallery error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let items: GalleryItem[] = (data || []).map(mapDbRowToGalleryItem);
    if (items.length === 0 && (!category || category === "All") && (!mediaType || mediaType === "all") && !search?.trim()) {
      items = GALLERY_ITEMS;
    }

    return NextResponse.json(items, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch gallery items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Rate limit uploads: 15 / min
  const rateLimitResponse = applyRateLimit(request, uploadLimiter, "gallery:upload");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody: GalleryItem = await request.json();

    // 1. Zod input validation
    const parsed = galleryItemSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid gallery submission data" },
        { status: 400 }
      );
    }

    const body = parsed.data;

    // 2. Security Check: Strict extension check on URLs
    const lowerUrl = body.url.toLowerCase();
    for (const dangerous of DANGEROUS_EXTENSIONS) {
      if (lowerUrl.includes(dangerous)) {
        return NextResponse.json(
          { error: `Security restriction: File type '${dangerous}' is strictly forbidden. Only images and videos are allowed.` },
          { status: 400 }
        );
      }
    }

    const id = body.id || rawBody.id || `gal-${Date.now()}`;
    const row = mapGalleryItemToDbRow({
      ...rawBody,
      ...body,
      id,
      imageUrl: (rawBody as any).imageUrl || (rawBody as any).image_url || body.url,
      videoUrl: (rawBody as any).videoUrl || (rawBody as any).video_url || (body.mediaType === "video" ? body.url : undefined),
    } as unknown as GalleryItem);

    const { data, error } = await supabase
      .from("gallery")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST gallery error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToGalleryItem(data), { status: 201 });
  } catch (err: any) {
    console.error("API POST gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to save gallery item" }, { status: 500 });
  }
}
