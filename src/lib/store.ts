import { Class, Assignment, Student, Session, School, BulletinPost } from './types';

// Simple in-memory store for demonstration purposes
// In production, use a database (Postgres/Redis)

declare global {
  var _classes: Class[] | undefined;
  var _assignments: Assignment[] | undefined;
  var _students: Student[] | undefined;
  var _sessions: Session[] | undefined;
  var _schools: School[] | undefined;
}

const classes = global._classes || (global._classes = []);
const assignments = global._assignments || (global._assignments = []);
const students = global._students || (global._students = []);
const sessions = global._sessions || (global._sessions = []);
const schools = global._schools || (global._schools = []);

// --- Schools ---
export function addSchool(school: School) {
  if (!schools.find(s => s.name === school.name)) {
      schools.push(school);
  }
}

export function getSchoolByName(name: string): School | undefined {
  return schools.find(s => s.name === name);
}

export function updateSchoolBulletin(schoolName: string, post: BulletinPost) {
  const school = schools.find(s => s.name === schoolName);
  if (school) {
    if (!school.bulletin) school.bulletin = [];
    school.bulletin.unshift(post);
  }
}

// --- Classes ---
export function createClass(cls: Class) {
  classes.push(cls);
}

export function getClassByCode(code: string): Class | undefined {
  return classes.find(c => c.inviteCode.toUpperCase() === code.toUpperCase());
}

export function getAllClasses() {
  return classes;
}

// --- Sessions ---
export function createSession(session: Session) {
  sessions.push(session);
}

export function getSessionByCode(code: string): Session | undefined {
  return sessions.find(s => s.code.toUpperCase() === code.toUpperCase());
}

export function getAllSessions() {
  return sessions;
}

// --- Assignments ---
export function createAssignment(assignment: Assignment) {
  assignments.push(assignment);
}

export function getAssignmentsByClass(classId: string): Assignment[] {
  return assignments.filter(a => a.classId === classId);
}

export function getAssignmentById(id: string): Assignment | undefined {
  return assignments.find(a => a.id === id);
}

// --- Students ---
export function registerStudent(student: Student) {
  const existing = students.find(s => s.id === student.id);
  if (!existing) {
    students.push(student);
  }
}

export function enrollStudentInClass(studentId: string, classId: string) {
  const student = students.find(s => s.id === studentId);
  if (student && !student.joinedClasses.includes(classId)) {
    student.joinedClasses.push(classId);
  }
}

