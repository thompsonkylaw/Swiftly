import { School } from './types';

export const VALID_SCHOOLS: School[] = [
  { id: '1', name: 'Lincoln High School', location: 'Lincoln, NE', district: 'Lincoln Public Schools', bulletin: [] },
  { id: '2', name: 'Roosevelt Elementary', location: 'Omaha, NE', district: 'Omaha Public Schools', bulletin: [] },
  { id: '3', name: 'Washington Middle School', location: 'Seattle, WA', district: 'Seattle Public Schools', bulletin: [] },
  { id: '4', name: 'Ling Gang Gu', location: 'Test City', district: 'Test District', bulletin: [] },
];

export async function verifySchoolCredential(schoolName: string): Promise<School | null> {
  // scalable to API call
  const school = VALID_SCHOOLS.find(s => s.name.toLowerCase() === schoolName.toLowerCase());
  return school || null;
}
