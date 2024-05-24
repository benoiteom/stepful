import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  const { email, password } = await req.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json({ data: data.user }, { status: 200 });
}
