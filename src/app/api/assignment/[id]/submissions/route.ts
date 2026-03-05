
import { NextResponse } from 'next/server';
import { getSubmissions, getStudent } from '@/lib/store';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const { id } = params;
  const submissions = getSubmissions(id);
  
  if (!submissions) {
    return NextResponse.json([]);
  }

  // Enrich with student data
  const enrichedSubmissions = submissions.map(sub => {
    const student = getStudent(sub.studentId);
    return {
      ...sub,
      studentName: student?.name || 'Unknown Student'
    };
  });

  return NextResponse.json(enrichedSubmissions);
}
