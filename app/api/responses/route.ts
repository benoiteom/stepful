import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { ticket_id, response } = await req.json();
  const { data, error } = await supabase.from('responses').insert([{ ticket_id, description: response }]);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
