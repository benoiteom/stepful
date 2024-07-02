import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  const { username } = await req.json();
  const { data, error } = await supabase.auth.signInWithPassword({ email: username + '@stepful.com', password: "123456" });
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json({ data: data.user }, { status: 200 });
}
