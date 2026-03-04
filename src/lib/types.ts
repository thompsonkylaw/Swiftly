export interface School {
  id: string;
  name: string;
  location: string;
  district?: string;
}

export interface Syllabus {
  id: string;
  schoolId: string;
  title: string;
  content: string; // URL or text content
  verified: boolean;
}

export type LearningMethod = 'ai_tutor' | 'quiz_mode' | 'summary_check' | 'socratic_dialogue';

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  teacherId: string;
  inviteCode: string; // Code for students to join
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  fileUrl?: string; // Mocked file url
  fileName?: string;
  learningMethod: LearningMethod;
  deadline: string; // ISO Date string
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  joinedClasses: string[]; // classIds
}

export interface Session {
  id: string;
  classId: string;
  code: string;
  status: 'active' | 'ended';
  startedAt: string;
}

