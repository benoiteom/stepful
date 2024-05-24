import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json({ status: 200 });
}
