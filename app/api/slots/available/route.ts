import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const date = req.nextUrl.searchParams.get('date');
  const endDate = new Date(date || new Date())
  endDate.setDate(endDate.getDate() + 7)
  const { data, error } = await supabase.from('time_slots').select('*').gte('start', date).lte('end', endDate.toISOString()).eq('is_booked', false);
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const { timeSlotId, studentId } = await req.json();
  const { data, error } = await supabase.from('time_slots').update({ is_booked: true }).eq('id', timeSlotId).select();
  if (!!data?.length && !error) {
    const { data: callData, error: callError } = await supabase.from('calls').insert([{ coach_id: 'ed6bb8a0-22f6-4dc5-83e5-fbeae0e6870f', student_id: studentId, time_slot_id: timeSlotId }]);
    if (callError) return NextResponse.json(callError, { status: 500 });
    return NextResponse.json(callData, { status: 200 });
  }
  if (error) return NextResponse.json(error, { status: 500 });
  return NextResponse.json(data, { status: 200 });
}
