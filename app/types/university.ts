// crm-frontend-next\app\types\university.ts
export type UniversityStatus = "active" | "inactive" | "archived";

export type DegreeType =
  | "diploma"
  | "bachelors"
  | "masters"
  | "phd"
  | "mba"
  | "certificate";

export interface UniversityCourse {
  id: string;

  name: string;
  courseCode?: string;

  degree: DegreeType;

  durationMonths?: number;

  annualTuitionFee?: number | string;

  totalTuitionFee?: number | string;

  currency?: string;

  intake?: string;

  minimumPercentage?: number;

  backlogLimit?: number;

  ieltsOverall?: number;

  applicationDeadline?: string;

  description?: string;
}

export interface UniversityScholarship {
  id: string;

  name: string;

  amount?: number | string;

  percentage?: number;

  description?: string;

  courseId?: string;
}

export interface University {
  id: string;

  name: string;

  country: string;

  city?: string;

  state?: string;

  postalCode?: string;

  website?: string;

  logo?: string;

  ranking?: number;

  establishedYear?: number;

  applicationFee?: number | string;

  currency?: string;

  description?: string;

  contactPerson?: string;

  contactEmail?: string;

  contactPhone?: string;

  intakeNotes?: string;

  status: UniversityStatus;

  courses: UniversityCourse[];

  scholarships: UniversityScholarship[];

  createdAt: string;

  updatedAt: string;
}
