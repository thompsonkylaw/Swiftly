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

export interface Session {
  id: string;
  schoolId: string;
  teacherId: string;
  inviteCode: string;
  perimeter: string; // description of the lesson/topic
  active: boolean;
}
