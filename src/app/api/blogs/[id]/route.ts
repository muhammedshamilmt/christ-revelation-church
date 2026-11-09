import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToBlogPost, mapBlogPostToDbRow } from "@/lib/blogUtils";
import type { BlogPost } from "@/lib/useBlogPosts";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const aliasMap: Record<string, string> = {
      "blog-1": "worship-opens-doors",
      "1": "worship-opens-doors",
      "blog-2": "prayer-is-the-key",
      "2": "prayer-is-the-key",
      "blog-3": "christmas-music-festival",
      "3": "christmas-music-festival",
      "blog-4": "our-story-and-mission",
      "4": "our-story-and-mission",
    };
    const mappedId = aliasMap[decodedId] || decodedId;
    const altId = id.startsWith("blog-") ? id.replace(/^blog-/, "") : `blog-${id}`;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .or(`id.eq."${id}",id.eq."${decodedId}",id.eq."${mappedId}",id.eq."${altId}"`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Supabase GET blog error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(mapDbRowToBlogPost(data), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET blog error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch blog post" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const patch: Partial<BlogPost> = await request.json();
    const row = mapBlogPostToDbRow(patch);

    const { data, error } = await supabase
      .from("blogs")
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase PATCH blog error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToBlogPost(data));
  } catch (err: any) {
    console.error("API PATCH blog error:", err);
    return NextResponse.json({ error: err.message || "Failed to update blog post" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      console.error("Supabase DELETE blog error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: any) {
    console.error("API DELETE blog error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete blog post" }, { status: 500 });
  }
}

