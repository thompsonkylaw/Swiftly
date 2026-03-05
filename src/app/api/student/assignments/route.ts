import { NextResponse } from 'next/server';
import { getAssignmentsForStudent } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  // Use the newly exported function
  const assignments = getAssignmentsForStudent(studentId);
  return NextResponse.json(assignments);
}
