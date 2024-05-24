import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { ticket_id, status } = await req.json();
  const { data, error } = await supabase.from('tickets').update({ status }).eq('id', ticket_id);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
