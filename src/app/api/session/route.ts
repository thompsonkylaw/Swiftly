import { NextResponse } from 'next/server';
import { createSession, getSessionByCode, getAllSessions } from '@/lib/store';
import { Session } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, perimeter } = body;

  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const newSession: Session = {
    id: Date.now().toString(),
    schoolId: '1', // mock
    teacherId: 'teacher-1', // mock
    inviteCode,
    perimeter: `${topic}: ${perimeter}`,
    active: true,
  };

  createSession(newSession);

  return NextResponse.json(newSession);
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (code) {
        const session = getSessionByCode(code);
        if (session) return NextResponse.json(session);
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(getAllSessions());
}
