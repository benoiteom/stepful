import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { data, error } = await supabase.from('tickets').select('*, responses(id, description)');
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { name, email, message } = await req.json();
  const { data, error } = await supabase.from('tickets').insert([{ name, email, message, status: 'new' }]);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { ticket_id } = await req.json();
  const { data, error } = await supabase.from('tickets').delete().eq('id', ticket_id);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
