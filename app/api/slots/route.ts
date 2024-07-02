import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const date = req.nextUrl.searchParams.get('date');
  const endDate = new Date(date || new Date())
  endDate.setDate(endDate.getDate() + 7)
  const coachId = req.nextUrl.searchParams.get('coachId');
  const { data, error } = await supabase.from('time_slots').select('*').gte('start', date).lte('end', endDate.toISOString()).eq('coach_id', coachId);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { date, coachId } = await req.json();
  const endDate = new Date(date || new Date())
  endDate.setHours(endDate.getHours() + 2)
  const { data, error } = await supabase.from('time_slots').insert([{ start: date, end: endDate.toISOString(), coach_id: coachId, is_booked: false }]);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
