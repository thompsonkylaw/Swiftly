import { NextResponse } from 'next/server';
import { getAssignmentById } from '@/lib/store';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = getAssignmentById(id);
  
  if (!assignment) {
    return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
  }
  
  return NextResponse.json(assignment);
}
