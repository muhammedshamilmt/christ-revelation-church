import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Read current views
    const { data } = await supabase
      .from("events")
      .select("views")
      .eq("id", id)
      .single();

    const currentViews = data?.views || 0;
    const { error } = await supabase
      .from("events")
      .update({ views: currentViews + 1 })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ views: currentViews + 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
