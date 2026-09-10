export type Role = "user" | "company" | "admin";

export type JobStatus =
  | "draft"
  | "pending_review"
  | "published"
  | "closed"
  | "rejected";

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "selected"
  | "scheduling"
  | "confirmed"
  | "completed"
  | "rejected"
  | "cancelled";

export type QuestionType = "single" | "multi" | "text";

export interface ScreeningQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: Role;
  companyName?: string;
  gender?: string;
  age?: number;
  prefecture?: string;
  occupation?: string;
  bio?: string;
  createdAt: string;
}

export interface InterviewJob {
  id: string;
  companyId: string;
  companyName: string;
  title: string;
  description: string;
  conditions: string[];
  reward: number;
  durationMin: number;
  recruitCount: number;
  method: "online" | "offline";
  tool: "Zoom" | "Google Meet" | "Microsoft Teams";
  recording: boolean;
  status: JobStatus;
  deadline: string;
  screeningQuestions: ScreeningQuestion[];
  createdAt: string;
  applicantCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userAge?: number;
  userPrefecture?: string;
  userOccupation?: string;
  status: ApplicationStatus;
  answers: Record<string, string | string[]>;
  proposedSlots: string[];
  confirmedSlot?: string;
  meetingUrl?: string;
  createdAt: string;
  updatedAt: string;
}
