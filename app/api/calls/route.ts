import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const supabase = createClient();
  
  const studentId = req.nextUrl.searchParams.get('student_id');
  const coachId = req.nextUrl.searchParams.get('coach_id');
  if (!studentId && !coachId) return NextResponse.json({ error: 'missing params' }, { status: 505 });
  else if (studentId) {
    const { data, error } = await supabase.from('calls').select('*').eq('student_id', studentId);
    if (error) return NextResponse.json(error, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  } else {
    const { data, error } = await supabase.from('calls').select('*').eq('coach_id', coachId);
    if (error) return NextResponse.json(error, { status: 500 });
    return NextResponse.json(data, { status: 200 });
  }
}
