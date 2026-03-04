import { School } from './types';

export const VALID_SCHOOLS: School[] = [
  { id: '1', name: 'Lincoln High School', location: 'Lincoln, NE', district: 'Lincoln Public Schools' },
  { id: '2', name: 'Roosevelt Elementary', location: 'Omaha, NE', district: 'Omaha Public Schools' },
  { id: '3', name: 'Washington Middle School', location: 'Seattle, WA', district: 'Seattle Public Schools' },
  { id: '4', name: 'Ling Gang Gu', location: 'Test City', district: 'Test District' },
];

export async function verifySchoolCredential(schoolName: string): Promise<School | null> {
  // scalable to API call
  const school = VALID_SCHOOLS.find(s => s.name.toLowerCase() === schoolName.toLowerCase());
  return school || null;
}
