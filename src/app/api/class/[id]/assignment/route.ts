// src/app/api/class/[id]/assignment/route.ts
import { NextResponse } from 'next/server';
import { createAssignment, getAssignmentsByClass } from '@/lib/store';
import { Assignment } from '@/lib/types';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, learningMethod, deadline, fileName, aiContent } = body;
    
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      classId: id,
      title,
      learningMethod,
      deadline,
      fileName,
      aiContent,
      createdAt: new Date().toISOString(),
    };
    
    createAssignment(newAssignment);
    return NextResponse.json(newAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(getAssignmentsByClass(id));
}
