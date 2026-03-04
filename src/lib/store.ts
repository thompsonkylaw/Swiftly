import { Session } from './types';

// Simple in-memory store for demonstration purposes
// In production, use a database (Postgres/Redis)

declare global {
  var _sessions: Session[] | undefined;
}

const sessions = global._sessions || (global._sessions = []);

export function createSession(session: Session) {
  sessions.push(session);
}

export function getSession(id: string) {
  return sessions.find(s => s.id === id);
}

export function getSessionByCode(code: string) {
  return sessions.find(s => s.inviteCode === code);
}

export function getAllSessions() {
  return sessions;
}
