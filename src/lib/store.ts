import { Class, Assignment, Student } from './types';

// Simple in-memory store for demonstration purposes
// In production, use a database (Postgres/Redis)

declare global {
  var _classes: Class[] | undefined;
  var _assignments: Assignment[] | undefined;
  var _students: Student[] | undefined;
}

const classes = global._classes || (global._classes = []);
const assignments = global._assignments || (global._assignments = []);
const students = global._students || (global._students = []);

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

