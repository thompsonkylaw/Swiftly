import { NextResponse } from 'next/server';
import { createClass, getAllClasses } from '@/lib/store';
import { Class } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newClass: Class = {
      id: Date.now().toString(),
      schoolId: '1', // mock
      teacherId: 'teacher-1', // mock
      inviteCode,
      name,
    };
    
    createClass(newClass);
    return NextResponse.json(newClass);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(getAllClasses());
}
