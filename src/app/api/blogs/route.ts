import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { mapDbRowToBlogPost, mapBlogPostToDbRow } from "@/lib/blogUtils";
import type { BlogPost } from "@/lib/useBlogPosts";
import { applyRateLimit, adminLimiter, generalLimiter } from "@/lib/rateLimit";
import { blogPostSchema } from "@/lib/validation";
import { DANGEROUS_EXTENSIONS } from "@/lib/fileSecurity";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const rateLimitResponse = applyRateLimit(request, generalLimiter, "blogs:get");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    let query = supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (status && status !== "All") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase GET blogs error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const posts: BlogPost[] = (data || []).map(mapDbRowToBlogPost);

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err: any) {
    console.error("API GET blogs error:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = applyRateLimit(request, adminLimiter, "blogs:admin");
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const rawBody: BlogPost = await request.json();

    const parsed = blogPostSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid blog post data" },
        { status: 400 }
      );
    }

    const body = parsed.data;

    // Check coverImage if provided
    if (body.coverImage) {
      const lowerCover = body.coverImage.toLowerCase();
      if (DANGEROUS_EXTENSIONS.some(ext => lowerCover.includes(ext))) {
        return NextResponse.json(
          { error: "Cover image file type is strictly forbidden." },
          { status: 400 }
        );
      }
    }

    const id = body.id || rawBody.id || `blog-${Date.now()}`;
    const row = mapBlogPostToDbRow({ ...rawBody, ...body, id } as unknown as BlogPost);

    const { data, error } = await supabase
      .from("blogs")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase POST blog error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mapDbRowToBlogPost(data), { status: 201 });
  } catch (err: any) {
    console.error("API POST blog error:", err);
    return NextResponse.json({ error: err.message || "Failed to save blog post" }, { status: 500 });
  }
}
