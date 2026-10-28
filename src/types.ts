export type JobType = 'full-time' | 'part-time' | 'internship' | 'long-term' | 'contract';

export type ExperienceLevel = 'no-experience' | 'fresh-grad' | 'under-1-year' | '1-2-years' | 'above-2-years';

export type JobStatus = 'open' | 'closed' | 'pending' | 'rejected' | 'draft';

export interface JobLocation {
  city: string;
  address: string;
}

export interface Industry {
  id: string;
  code: string; // e.g. "CNKT", "DVVT", "KTTM", "MKT", "GDDT", "YTHC", "NHDD"
  name: string; // e.g. "Công nghệ - Kỹ thuật (CNKT)"
  shortName: string;
  description: string;
  iconName: string;
  totalCompanies: number;
  totalJobs: number;
  noExpJobsCount: number;
  subIndustries: string[];
}

export interface Company {
  id: string;
  name: string;
  industryCode: string; // matches Industry.code
  logo: string;
  taxId: string; // Mã số thuế xác minh
  isVerified: boolean; // Doanh nghiệp xác thực 100%
  directRecruitment: boolean; // Tuyển dụng trực tiếp, không qua trung gian
  address: string;
  city: string;
  website: string;
  phone: string;
  email: string;
  rating: number; // 1 to 5
  reviewCount: number;
  responseTime: string; // e.g. "Trong vòng 24h", "Trong vòng 48h"
  description: string;
  openPositionsCount: number;
  internPositionsCount: number;
  noExpPositionsCount: number;
}

export interface Job {
  id: string;
  title: string;
  companyId?: string;
  companyName: string;
  companyLogo?: string;
  companyDescription?: string;
  ownerId?: string;
  industryCode: string;
  industryName: string;
  location?: string;
  address?: string;
  locations?: JobLocation[];
  city: string; // "Hà Nội" | "TP. Hồ Chí Minh" | "Đà Nẵng" | "Toàn quốc" | etc.
  salaryMin: number; // in Millions VND
  salaryMax: number;
  salaryText: string;
  jobType: JobType; // 'full-time' | 'part-time' | 'internship' | 'long-term'
  level?: string;
  headcount?: number;
  educationLevel?: string;
  skills?: string[];
  experienceRequired: ExperienceLevel;
  experienceText: string; // "Không cần kinh nghiệm / Được đào tạo" | "Dưới 1 năm" | etc.
  acceptsFreshGrad?: boolean;
  trainingProvided?: boolean; // Có đào tạo từ đầu
  isDirectHire?: boolean; // Tuyển trực tiếp không trung gian
  isVerifiedCompany?: boolean;
  isVerifiedDirect?: boolean;
  responseSlaHours?: number;
  postedDate: string;
  deadlineDate?: string;
  deadline: string;
  status?: JobStatus;
  moderationNote?: string;
  description: string[];
  requirements: string[];
  benefits: string[];
  tags: string[];
  urgency?: boolean;
  contactEmail?: string;
  contactPhone?: string;
  directEmployerCommitment?: string;
}

export interface SalaryBenchmark {
  industryCode: string;
  industryName: string;
  roleName: string;
  noExpMin: number;
  noExpAvg: number;
  noExpMax: number;
  juniorMin: number;
  juniorAvg: number;
  juniorMax: number;
  midMin: number;
  midAvg: number;
  midMax: number;
  advice: string;
}

export interface RecruitmentReview {
  id: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  candidateRole: string; // e.g. "Sinh viên mới tốt nghiệp", "Thực tập sinh"
  rating: number;
  date: string;
  responseTimeRating: number; // 1 to 5
  interviewExperience: 'Rất tích cực' | 'Tích cực' | 'Trung bình' | 'Cần cải thiện';
  noFeeCharged: boolean; // Xác nhận KHÔNG thu bất kỳ chi phí nào
  comment: string;
  pros?: string;
  cons?: string;
  verifiedApplication: boolean;
}

export type NavigationTab = 
  | 'jobs' 
  | 'industries' 
  | 'industry-companies' 
  | 'salary' 
  | 'reviews' 
  | 'cv-guide' 
  | 'anti-scam' 
  | 'employer-post'
  | 'employer-overview'
  | 'employer-candidates'
  | 'employer-my-jobs'
  | 'employer-company'
  | 'saved-jobs'
  | 'job-alerts';

export type NotificationCategory = 'all' | 'unread' | 'job' | 'security' | 'application';

export interface JobAlert {
  id: string;
  type?: 'job' | 'security' | 'application' | 'system';
  title?: string;
  message?: string;
  companyName?: string;
  industryCode: string;
  salaryText?: string;
  city: string;
  timestamp?: string;
  isNoExp?: boolean;
  isRead?: boolean;
  jobId?: string;
  keyword?: string;
  salaryRange?: string;
  experienceRequired?: string;
  userEmail?: string;
  frequency?: string;
  active?: boolean;
  createdDate?: string;
}

export type ApplicationStatus = 'Đã gửi hồ sơ' | 'Doanh nghiệp đã xem' | 'Mời phỏng vấn' | 'Đang xem xét' | 'Đã tuyển' | 'Không phù hợp';

export interface CandidateProject {
  name: string;
  link?: string;
  note?: string;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  portfolioUrl?: string; // e.g. Google Sites link
  coverNote: string;
  appliedDate: string;
  appliedAt?: string;
  statusUpdatedAt?: string;
  status: ApplicationStatus;
  rejectReason?: string;
  feedbackMessage?: string;
  notes?: string;
  recruiterId?: string;
  projects?: CandidateProject[];
}

export interface UserProfile {
  fullName: string;
  birthDate: string;
  email: string;
  currentOccupation: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  phoneNumber?: string;
  desiredIndustry?: string;
  portfolioUrl?: string;
  isRegistered?: boolean;
}

export type AppUserRole = 'candidate' | 'recruiter';

export interface RoleChangeRequest {
  targetRole: AppUserRole;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: AppUserRole;
  fullName: string;
  profile?: UserProfile;
  employerProfile?: EmployerProfile;
  roleChangeRequest?: RoleChangeRequest | null;
}

export interface EmployerProfile {
  companyName: string;
  taxCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  isVerified: boolean;
}
