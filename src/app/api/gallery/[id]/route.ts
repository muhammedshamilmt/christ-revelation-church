import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToGalleryItem, mapGalleryItemToDbRow } from "@/lib/galleryUtils";
import type { GalleryItem } from "@/lib/gallery";
import { applyRateLimit, adminLimiter, generalLimiter } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "gallery:get-one");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .or(`id.eq."${id}",id.eq."${decodedId}"`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET gallery item error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    const item = mapDbRowToGalleryItem(data);
    return NextResponse.json(item, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET gallery item error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch gallery item" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "gallery:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;
    const patch: Partial<GalleryItem> = await request.json();
    const row = mapGalleryItemToDbRow(patch);

    const { data, error } = await supabase
      .from("gallery")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH gallery error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToGalleryItem(data));
  } catch (err: any) {
    console.error("API PATCH gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to update gallery item" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "gallery:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { id } = await params;

    // Fetch the item first to check if there are storage files to clean up
    const { data: existing } = await supabase
      .from("gallery")
      .select("image_url, video_url")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      const filesToRemove: string[] = [];
      const extractStoragePath = (url?: string | null) => {
        if (!url) return null;
        const marker = "/storage/v1/object/public/gallery/";
        const idx = url.indexOf(marker);
        if (idx !== -1) {
          return url.substring(idx + marker.length);
        }
        return null;
      };

      const imgPath = extractStoragePath(existing.image_url);
      if (imgPath) filesToRemove.push(imgPath);
      const vidPath = extractStoragePath(existing.video_url);
      if (vidPath) filesToRemove.push(vidPath);

      if (filesToRemove.length > 0) {
        await supabase.storage.from("gallery").remove(filesToRemove).catch(() => {});
      }
    }

    const { error } = await supabase.from("gallery").delete().eq("id", id);

    if (error) {
      console.error("Supabase DELETE gallery error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("API DELETE gallery error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete gallery item" }, { status: 500 });
  }
}

