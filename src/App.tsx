import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { JobList } from './components/JobList';
import { IndustryDirectory } from './components/IndustryDirectory';
import { IndustryCompaniesView } from './components/IndustryCompaniesView';
import { SalaryComparison } from './components/SalaryComparison';
import { RecruitmentReviews } from './components/RecruitmentReviews';
import { CVGuideAndBuilder } from './components/CVGuideAndBuilder';
import { AntiScamGuide } from './components/AntiScamGuide';
import { JobDetailModal } from './components/JobDetailModal';
import { ApplyModal } from './components/ApplyModal';
import { SavedJobsModal } from './components/SavedJobsModal';
import { JobAlertsModal } from './components/JobAlertsModal';
import { LoginProfileModal } from './components/LoginProfileModal';
import { EmployerView } from './components/EmployerView';
import { SeekerView } from './components/SeekerView';
import { RoleSelectionModal } from './components/RoleSelectionModal';

import { 
  MOCK_INDUSTRIES, 
  MOCK_COMPANIES, 
  MOCK_JOBS, 
  MOCK_SALARY_BENCHMARKS, 
  MOCK_RECRUITMENT_REVIEWS, 
  MOCK_INITIAL_ALERTS 
} from './data/mockData';
import { 
  Job, 
  RecruitmentReview, 
  JobAlert, 
  ApplicationRecord, 
  NavigationTab, 
  UserProfile, 
  AppUserRole, 
  EmployerProfile,
  AuthUser
} from './types';
import { 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2,
  FileText,
  UserCheck,
  Bookmark,
  BookmarkCheck,
  X
} from 'lucide-react';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<NavigationTab>('jobs');
  const [selectedIndustryCode, setSelectedIndustryCode] = useState<string>('CNKT');

  // Authenticated User State from Server
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // Role Confirmation State (Bắt buộc xác nhận vai trò trước khi vào giao diện chính)
  const [isRoleConfirmed, setIsRoleConfirmed] = useState<boolean>(() => {
    try {
      const savedRole = localStorage.getItem('app_user_role');
      const isConfirmed = localStorage.getItem('role_confirmed') === 'true';
      return Boolean((savedRole === 'recruiter' || savedRole === 'candidate') && isConfirmed);
    } catch {
      return false;
    }
  });

  // User Role State: 'candidate' | 'recruiter'
  const [userRole, setUserRole] = useState<AppUserRole>(() => {
    try {
      const saved = localStorage.getItem('app_user_role');
      if (saved === 'recruiter' || saved === 'candidate') {
        return saved as AppUserRole;
      }
    } catch {}
    return 'candidate';
  });

  // Target role for modal when switching roles
  const [modalTargetRole, setModalTargetRole] = useState<AppUserRole>(() => {
    try {
      const saved = localStorage.getItem('app_user_role');
      if (saved === 'recruiter' || saved === 'candidate') return saved as AppUserRole;
    } catch {}
    return 'candidate';
  });

  // Modal chọn vai trò trước khi vào app (bắt buộc nếu chưa xác nhận vai trò)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('app_user_role');
      const isConfirmed = localStorage.getItem('role_confirmed') === 'true';
      return !(saved && isConfirmed);
    } catch {
      return true;
    }
  });

  // User Profile State (for candidate)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('user_profile_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: 'Nguyễn Thị Mai Lan',
      birthDate: '2003-08-20',
      email: 'mailan.nguyen@example.com',
      currentOccupation: 'Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm',
      gender: 'Nữ',
      phoneNumber: '0912 345 678',
      portfolioUrl: 'https://sites.google.com/view/mailan-portfolio',
      isRegistered: true
    };
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Core Data State
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [companies] = useState(MOCK_COMPANIES);
  const [industries] = useState(MOCK_INDUSTRIES);
  const [salaryBenchmarks] = useState(MOCK_SALARY_BENCHMARKS);
  const [reviews, setReviews] = useState<RecruitmentReview[]>(MOCK_RECRUITMENT_REVIEWS);
  const [alerts, setAlerts] = useState<JobAlert[]>(MOCK_INITIAL_ALERTS);
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('candidate_saved_job_ids');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((id): id is string => typeof id === 'string' && MOCK_JOBS.some(j => j.id === id));
        }
      }
    } catch {}
    return [];
  });

  // Thông tin hồ sơ Nhà tuyển dụng (Tên công ty, MST, SĐT, Email, Địa chỉ)
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile>(() => {
    try {
      const saved = localStorage.getItem('employer_profile_data');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      companyName: 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến',
      taxCode: '0108927164',
      contactName: 'Trần Thị Thu Hà (Trưởng phòng Nhân sự)',
      contactEmail: 'tuyendung.tantien@example.vn',
      contactPhone: '0988 123 456 (Hotline & Zalo)',
      address: 'Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1, Nam Từ Liêm',
      city: 'Hà Nội',
      isVerified: true
    };
  });

  // Danh sách hồ sơ ứng viên
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'app-01',
      jobId: 'job-cnkt-01',
      jobTitle: 'Thực tập sinh Lập trình Frontend (Fresher)',
      companyName: 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến',
      candidateName: 'Nguyễn Thị Mai Lan',
      candidateEmail: 'mailan.nguyen@example.com',
      candidatePhone: '0912 345 678',
      portfolioUrl: 'https://sites.google.com/view/mailan-portfolio',
      coverNote: 'Em là sinh viên mới tốt nghiệp, đã tự học React & Tailwind CSS. Mong muốn được học hỏi và cống hiến cho công ty.',
      appliedDate: 'Hôm nay, 08:30',
      status: 'Đã gửi hồ sơ'
    },
    {
      id: 'app-02',
      jobId: 'job-cnkt-01',
      jobTitle: 'Thực tập sinh Lập trình Frontend (Fresher)',
      companyName: 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến',
      candidateName: 'Trần Văn Hoàng',
      candidateEmail: 'hoang.tranvan@gmail.com',
      candidatePhone: '0987 654 321',
      portfolioUrl: 'https://sites.google.com/view/hoangtran-cv',
      coverNote: 'Chào anh/chị, em có kiến thức về JavaScript, HTML/CSS và muốn tìm cơ hội thực tập trực tiếp không qua trung gian.',
      appliedDate: 'Hôm qua, 15:45',
      status: 'Doanh nghiệp đã xem'
    },
    {
      id: 'app-03',
      jobId: 'job-dvvt-01',
      jobTitle: 'Nhân viên Hỗ trợ Vận hành & Kho bãi',
      companyName: 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến',
      candidateName: 'Lê Thanh Tùng',
      candidateEmail: 'tung.lethanh@gmail.com',
      candidatePhone: '0903 112 233',
      coverNote: 'Em muốn ứng tuyển làm việc ca linh hoạt, có sức khỏe tốt và tính cẩn thận.',
      appliedDate: '2 ngày trước',
      status: 'Mời phỏng vấn'
    }
  ]);

  // Modals state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isSavedJobsOpen, setIsSavedJobsOpen] = useState(false);
  const [isJobAlertsOpen, setIsJobAlertsOpen] = useState(false);

  // Toast Notification State
  const [toastAlert, setToastAlert] = useState<{
    id: string;
    message: string;
    type: 'save' | 'unsave' | 'info';
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const triggerToast = (
    message: string, 
    type: 'save' | 'unsave' | 'info' = 'save', 
    actionLabel?: string, 
    onAction?: () => void
  ) => {
    const id = Date.now().toString();
    setToastAlert({ id, message, type, actionLabel, onAction });
    setTimeout(() => {
      setToastAlert(current => (current?.id === id ? null : current));
    }, 4500);
  };

  // Sync auth session and verified role with backend
  useEffect(() => {
    const initAuth = async () => {
      const savedRole = localStorage.getItem('app_user_role') as AppUserRole | null;
      const isConfirmed = localStorage.getItem('role_confirmed') === 'true';

      // Nếu chưa xác nhận vai trò, bắt buộc hiển thị màn hình chọn vai trò
      if (!savedRole || !isConfirmed) {
        setIsRoleConfirmed(false);
        setIsRoleModalOpen(true);
        return;
      }

      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
            setUserRole(data.user.role);
            if (data.user.profile) setUserProfile(data.user.profile);
            if (data.user.employerProfile) setEmployerProfile(data.user.employerProfile);
            if (Array.isArray(data.user.savedJobIds)) {
              const validIds = data.user.savedJobIds.filter((id: unknown) => typeof id === 'string' && MOCK_JOBS.some(j => j.id === id));
              setSavedJobIds(validIds);
              localStorage.setItem('candidate_saved_job_ids', JSON.stringify(validIds));
            }
            setIsRoleConfirmed(true);
            setIsRoleModalOpen(false);
            return;
          }
        } catch (e) {
          console.error("Auth check failed:", e);
        }
      }

      // User already confirmed role previously: keep role and load data
      if (savedRole === 'candidate' || savedRole === 'recruiter') {
        try {
          const res = await fetch('/api/auth/switch-demo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: savedRole })
          });
          const data = await res.json();
          if (data.token && data.user) {
            localStorage.setItem('auth_token', data.token);
            setCurrentUser(data.user);
            setUserRole(data.user.role);
            if (data.user.profile) setUserProfile(data.user.profile);
            if (data.user.employerProfile) setEmployerProfile(data.user.employerProfile);
            if (Array.isArray(data.user.savedJobIds)) {
              const validIds = data.user.savedJobIds.filter((id: unknown) => typeof id === 'string' && MOCK_JOBS.some(j => j.id === id));
              setSavedJobIds(validIds);
              localStorage.setItem('candidate_saved_job_ids', JSON.stringify(validIds));
            }
            setIsRoleConfirmed(true);
            setIsRoleModalOpen(false);
            return;
          }
        } catch (e) {
          console.error("Switch demo failed:", e);
        }
      } else {
        setIsRoleConfirmed(false);
        setIsRoleModalOpen(true);
      }
    };

    initAuth();
  }, []);

  // Global Search & Filter State for Header Search Bar
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceTab, setExperienceTab] = useState<'all' | 'no-experience' | 'has-experience'>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedSalaryBand, setSelectedSalaryBand] = useState<string>('all');
  const [selectedJobType, setSelectedJobType] = useState<string>('all');

  // Filter computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Experience Filter
      if (experienceTab === 'no-experience') {
        if (job.experienceRequired !== 'no-experience') return false;
      } else if (experienceTab === 'has-experience') {
        if (job.experienceRequired === 'no-experience') return false;
      }

      // 2. Keyword Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.companyName.toLowerCase().includes(query);
        const matchesTags = job.tags.some(t => t.toLowerCase().includes(query));
        const matchesIndustry = job.industryName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesTags && !matchesIndustry) {
          return false;
        }
      }

      // 3. Khối ngành chính
      if (selectedIndustry !== 'all' && job.industryCode !== selectedIndustry) {
        return false;
      }

      // 4. Location / City
      if (selectedCity !== 'all') {
        const cityNorm = selectedCity.toLowerCase();
        const jobCityNorm = (job.city || '').toLowerCase();
        const jobLocNorm = (job.location || '').toLowerCase();

        if (cityNorm === 'toàn quốc') {
          const isNationwide = jobCityNorm.includes('toàn quốc') || 
                               jobLocNorm.includes('toàn quốc') || 
                               jobLocNorm.includes('nhiều') || 
                               jobLocNorm.includes('gần nhà');
          if (!isNationwide) return false;
        } else {
          let matchesCity = false;
          if (cityNorm.includes('hồ chí minh')) {
            matchesCity = jobCityNorm.includes('hồ chí minh') || jobCityNorm.includes('hcm') ||
                          jobLocNorm.includes('hồ chí minh') || jobLocNorm.includes('hcm');
          } else if (cityNorm.includes('hà nội')) {
            matchesCity = jobCityNorm.includes('hà nội') || jobLocNorm.includes('hà nội');
          } else if (cityNorm.includes('đà nẵng')) {
            matchesCity = jobCityNorm.includes('đà nẵng') || jobLocNorm.includes('đà nẵng');
          } else {
            matchesCity = jobCityNorm.includes(cityNorm) || jobLocNorm.includes(cityNorm);
          }

          if (jobCityNorm.includes('toàn quốc') || jobLocNorm.includes('toàn quốc')) {
            matchesCity = true;
          }

          if (!matchesCity) return false;
        }
      }

      // 5. Salary Band
      if (selectedSalaryBand !== 'all') {
        if (selectedSalaryBand === 'under-7') {
          if (job.salaryMin >= 7 && job.salaryMax > 7) return false;
        } else if (selectedSalaryBand === '7-10') {
          if (job.salaryMin > 10 || job.salaryMax < 7) return false;
        } else if (selectedSalaryBand === '10-15') {
          if (job.salaryMin > 15 || job.salaryMax < 10) return false;
        } else if (selectedSalaryBand === 'above-15') {
          if (job.salaryMax < 15) return false;
        }
      }

      // 6. Job Type
      if (selectedJobType !== 'all') {
        if (selectedJobType === 'full-time') {
          if (job.jobType !== 'full-time' && job.jobType !== 'long-term') return false;
        } else if (job.jobType !== selectedJobType) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, experienceTab, searchTerm, selectedIndustry, selectedCity, selectedSalaryBand, selectedJobType]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setExperienceTab('all');
    setSelectedIndustry('all');
    setSelectedCity('all');
    setSelectedSalaryBand('all');
    setSelectedJobType('all');
  };

  const noExpJobsCount = jobs.filter(j => j.experienceRequired === 'no-experience').length;
  const hasExpJobsCount = jobs.filter(j => j.experienceRequired !== 'no-experience').length;

  // Handlers
  const handleAddNewJob = async (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
    // Save to server if recruiter
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch('/api/recruiter/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newJob)
        });
      } catch (err) {
        console.error("Save job to server failed:", err);
      }
    }
    triggerToast(`Đã đăng tin tuyển dụng "${newJob.title}" thành công!`, 'info');
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('user_profile_data', JSON.stringify(profile));
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/account/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ profile })
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateEmployerProfile = async (profile: EmployerProfile) => {
    setEmployerProfile(profile);
    try {
      localStorage.setItem('employer_profile_data', JSON.stringify(profile));
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/recruiter/company-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(profile)
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleSaveJob = (jobId: string) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const jobTitle = targetJob ? `"${targetJob.title}"` : 'công việc';

    setSavedJobIds(prev => {
      const isAlreadySaved = prev.includes(jobId);
      const nextIds = isAlreadySaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      try {
        localStorage.setItem('candidate_saved_job_ids', JSON.stringify(nextIds));
      } catch (e) {
        console.error('Failed to save savedJobIds to localStorage:', e);
      }

      if (isAlreadySaved) {
        triggerToast(
          `Đã bỏ lưu ${jobTitle} khỏi danh sách Việc làm đã lưu.`,
          'unsave'
        );
      } else {
        triggerToast(
          `Đã lưu ${jobTitle} vào danh sách Việc làm đã lưu thành công!`,
          'save',
          'Xem danh sách',
          () => setIsSavedJobsOpen(true)
        );
      }
      return nextIds;
    });

    // Background sync with server if logged in
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetch('/api/candidate/saved-jobs/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId })
      }).catch(err => console.error("Toggle saved job server sync error:", err));
    }
  };

  const handleSelectJobForDetail = (job: Job) => {
    setSelectedJob(job);
    setIsDetailOpen(true);
  };

  const handleQuickApply = (job: Job) => {
    setApplyJob(job);
    setIsApplyOpen(true);
  };

  const handleSubmitApplication = async (appRecord: ApplicationRecord) => {
    setApplications(prev => [appRecord, ...prev]);
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch('/api/candidate/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(appRecord)
        });
      } catch (err) {
        console.error("Save app to server failed:", err);
      }
    }
    triggerToast("Hồ sơ đã được gửi trực tiếp đến nhà tuyển dụng!", 'info');
  };

  const handleOpenSavedJobs = () => {
    setIsSavedJobsOpen(true);
  };

  const handleCloseSavedJobs = () => {
    setIsSavedJobsOpen(false);
  };

  const handleOpenJobAlerts = () => {
    setIsJobAlertsOpen(true);
  };

  const handleCloseJobAlerts = () => {
    setIsJobAlertsOpen(false);
  };

  // Secure Role Selection (persists role to server & local storage)
  const handleRoleSelection = async (newRole: AppUserRole) => {
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('app_user_role', data.user.role);
        setCurrentUser(data.user);
        setUserRole(data.user.role);
        if (data.user.profile) setUserProfile(data.user.profile);
        if (data.user.employerProfile) setEmployerProfile(data.user.employerProfile);
      } else {
        setUserRole(newRole);
        localStorage.setItem('app_user_role', newRole);
      }
    } catch {
      setUserRole(newRole);
      localStorage.setItem('app_user_role', newRole);
    }
    setIsRoleModalOpen(false);
    if (newRole === 'candidate') {
      setActiveTab('jobs');
      triggerToast('Đã chuyển đổi sang không gian làm việc của Ứng viên!', 'info');
    } else {
      setActiveTab('employer-overview');
      triggerToast('Đã chuyển đổi sang không gian làm việc của Nhà tuyển dụng!', 'info');
    }
  };

  // Handle Confirm Role And Profile from Modal
  const handleConfirmRoleAndProfile = async (
    role: AppUserRole,
    candidateData?: UserProfile,
    employerData?: EmployerProfile
  ) => {
    // 1. Immediately update localStorage and React state to instantly enter the chosen interface
    localStorage.setItem('role_confirmed', 'true');
    localStorage.setItem('app_user_role', role);
    setIsRoleConfirmed(true);
    setUserRole(role);
    setModalTargetRole(role);
    setIsRoleModalOpen(false);

    if (role === 'candidate') {
      const candidateToSave = candidateData || userProfile;
      if (candidateToSave) {
        setUserProfile(candidateToSave);
        localStorage.setItem('user_profile_data', JSON.stringify(candidateToSave));
      }
      setActiveTab('jobs');
      triggerToast('Chào mừng bạn! Đã xác nhận thông tin và vào giao diện Ứng viên.', 'info');
    } else {
      const employerToSave = employerData || employerProfile;
      if (employerToSave) {
        setEmployerProfile(employerToSave);
        localStorage.setItem('employer_profile_data', JSON.stringify(employerToSave));
      }
      setActiveTab('employer-overview');
      triggerToast('Chào mừng Quý Doanh nghiệp! Đã xác nhận thông tin và vào giao diện Nhà tuyển dụng.', 'info');
    }

    // 2. Perform server sync in background without blocking the UI
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      const token = data.token || localStorage.getItem('auth_token');
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      if (data.user) {
        setCurrentUser(data.user);
      }

      if (token) {
        if (role === 'candidate' && candidateData) {
          await fetch('/api/account/profile', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ profile: candidateData })
          });
        } else if (role === 'recruiter' && employerData) {
          await fetch('/api/recruiter/company-profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(employerData)
          });
        }
      }
    } catch (err) {
      console.warn('Server sync completed with local fallback:', err);
    }
  };

  // Role change request process (Server validated, no client-side tampering)
  const handleRequestRoleChange = async (targetRole: AppUserRole, reason: string) => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/account/request-role-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ targetRole, reason })
    });
    const data = await res.json();
    if (data.user) {
      setCurrentUser(data.user);
      // Note: userRole remains untouched until approved!
    }
  };

  const handleCancelRoleChange = async () => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/account/cancel-role-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const data = await res.json();
    if (data.user) {
      setCurrentUser(data.user);
    }
  };

  const handleApproveRoleChangeDemo = async () => {
    const token = localStorage.getItem('auth_token');
    const res = await fetch('/api/account/approve-role-change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    const data = await res.json();
    if (data.user) {
      setCurrentUser(data.user);
      setUserRole(data.user.role);
      localStorage.setItem('app_user_role', data.user.role);
      if (data.user.role === 'recruiter') {
        setActiveTab('employer-overview');
      } else {
        setActiveTab('jobs');
      }
    }
  };

  const handleSwitchDemoAccount = async (role: AppUserRole) => {
    try {
      const res = await fetch('/api/auth/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('app_user_role', data.user.role);
        setCurrentUser(data.user);
        setUserRole(data.user.role);
        if (data.user.profile) setUserProfile(data.user.profile);
        if (data.user.employerProfile) setEmployerProfile(data.user.employerProfile);
        if (data.user.role === 'recruiter') {
          setActiveTab('employer-overview');
        } else {
          setActiveTab('jobs');
        }
      }
    } catch (e) {
      console.error("Switch demo account error:", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('app_user_role');
    localStorage.removeItem('role_confirmed');
    setCurrentUser(null);
    setIsRoleConfirmed(false);
    setIsRoleModalOpen(true);
  };

  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationRecord['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        await fetch(`/api/recruiter/applications/${appId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ status })
        });
      } catch (err) {
        console.error("Update status failed:", err);
      }
    }
    triggerToast('Đã cập nhật trạng thái ứng viên thành công!', 'info');
  };

  const handleNavigationChange = (tab: NavigationTab) => {
    if (userRole === 'candidate') {
      // Candidate allowed tabs
      const candidateTabs = ['jobs', 'salary', 'reviews', 'cv-guide', 'anti-scam', 'industries', 'industry-companies', 'saved-jobs', 'job-alerts'];
      if (!candidateTabs.includes(tab)) {
        setActiveTab('jobs');
        return;
      }
      if (tab === 'saved-jobs') {
        handleOpenSavedJobs();
      } else if (tab === 'job-alerts') {
        handleOpenJobAlerts();
      } else {
        setActiveTab(tab);
      }
    } else {
      // Recruiter allowed tabs
      setActiveTab(tab);
    }
  };

  const handleSelectIndustryFromDirectory = (industryCode: string) => {
    setSelectedIndustryCode(industryCode);
    setActiveTab('industry-companies');
  };

  const handleAddReview = (newReview: RecruitmentReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  const handleAddAlert = (newAlert: JobAlert) => {
    setAlerts(prev => [newAlert, ...prev]);
  };

  const handleRemoveAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const currentIndustry = industries.find(i => i.code === selectedIndustryCode) || industries[0];
  const savedJobsList = useMemo(() => {
    return jobs.filter(j => savedJobIds.includes(j.id));
  }, [jobs, savedJobIds]);
  const selectedJobCompany = selectedJob ? companies.find(c => c.id === selectedJob.companyId) : undefined;

  return (
    <div className="min-h-screen bg-slate-50/80 flex flex-col text-slate-800 font-sans antialiased">
      {/* Top Application Header */}
      <Header
        currentRole={userRole}
        onRoleChange={(targetRole) => {
          setModalTargetRole(targetRole);
          setIsRoleModalOpen(true);
        }}
        onOpenRoleModal={() => {
          setModalTargetRole(userRole);
          setIsRoleModalOpen(true);
        }}
        onLogoClick={() => {
          setIsDetailOpen(false);
          setIsApplyOpen(false);
          setIsSavedJobsOpen(false);
          setIsJobAlertsOpen(false);
          setIsLoginModalOpen(false);
          if (userRole === 'recruiter') {
            setActiveTab('employer-overview');
          } else {
            setActiveTab('jobs');
          }
        }}
        applicationsCount={applications.length}
        employerProfile={employerProfile}
        activeTab={activeTab}
        onTabChange={handleNavigationChange}
        savedCount={savedJobsList.length}
        alertsCount={alerts.length}
        onOpenSaved={handleOpenSavedJobs}
        onOpenAlerts={handleOpenJobAlerts}
        userProfile={userProfile}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        experienceTab={experienceTab}
        onExperienceTabChange={setExperienceTab}
        selectedIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        selectedSalaryBand={selectedSalaryBand}
        onSalaryBandChange={setSelectedSalaryBand}
        selectedJobType={selectedJobType}
        onJobTypeChange={setSelectedJobType}
        industries={industries}
        onResetFilters={handleResetFilters}
        totalFilteredCount={filteredJobs.length}
        totalNoExpCount={noExpJobsCount}
      />

      {/* Main Container - Strictly Role-Guarded */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {!isRoleConfirmed ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              Chào mừng bạn đến với Nối cơ hội - Đổi cuộc đời
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mb-5 leading-relaxed">
              Vui lòng xác nhận bạn là Ứng viên hay Nhà tuyển dụng và hoàn tất thông tin để vào giao diện tương ứng.
            </p>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-[#FFD273] hover:bg-[#FEE686] border border-[#e6bd67] shadow-md cursor-pointer transition-all active:scale-95"
            >
              Chọn vai trò & Xác nhận ngay
            </button>
          </div>
        ) : (
          <>
            {/* 1. GIAO DIỆN DÀNH CHO NHÀ TUYỂN DỤNG (role === 'recruiter') */}
            {userRole === 'recruiter' && (
              <EmployerView
                industries={industries}
                onAddNewJob={handleAddNewJob}
                applications={applications}
                onUpdateApplicationStatus={handleUpdateApplicationStatus}
                employerProfile={employerProfile}
                onUpdateEmployerProfile={handleUpdateEmployerProfile}
                jobs={jobs}
                externalActiveTab={activeTab}
              />
            )}

            {/* 2. GIAO DIỆN DÀNH CHO ỨNG VIÊN (role === 'candidate') */}
            {userRole === 'candidate' && (
              <>
            {/* Candidate Primary Home & Management Space */}
            {activeTab === 'jobs' && (
              <SeekerView
                userProfile={userProfile}
                onOpenProfileModal={() => setIsLoginModalOpen(true)}
                applications={applications}
                savedJobs={savedJobsList}
                onToggleSaveJob={handleToggleSaveJob}
                onSelectJobForDetail={handleSelectJobForDetail}
                onQuickApply={handleQuickApply}
                alerts={alerts}
                onOpenAlertsModal={handleOpenJobAlerts}
                allJobs={jobs}
                displayJobs={filteredJobs}
                industries={industries}
                onOpenRoleModal={() => setIsRoleModalOpen(true)}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                experienceTab={experienceTab}
                selectedIndustry={selectedIndustry}
                selectedCity={selectedCity}
                selectedSalaryBand={selectedSalaryBand}
                selectedJobType={selectedJobType}
                onResetFilters={handleResetFilters}
              />
            )}

            {/* Candidate Informational Views (Accessed via hamburger menu) */}
            {activeTab === 'industries' && (
              <IndustryDirectory
                industries={industries}
                onSelectIndustry={handleSelectIndustryFromDirectory}
                onBrowseJobsByIndustry={(indCode) => {
                  setSelectedIndustryCode(indCode);
                  setActiveTab('industry-companies');
                }}
              />
            )}

            {activeTab === 'industry-companies' && (
              <IndustryCompaniesView
                industry={currentIndustry}
                companies={companies}
                jobs={jobs}
                onBack={() => setActiveTab('industries')}
                onSelectJob={handleSelectJobForDetail}
                onQuickApply={handleQuickApply}
              />
            )}

            {activeTab === 'salary' && (
              <SalaryComparison
                benchmarks={salaryBenchmarks}
                onSelectIndustryJobs={(indCode) => {
                  setSelectedIndustryCode(indCode);
                  setActiveTab('industry-companies');
                }}
              />
            )}

            {activeTab === 'reviews' && (
              <RecruitmentReviews
                reviews={reviews}
                onAddReview={handleAddReview}
              />
            )}

            {activeTab === 'cv-guide' && (
              <CVGuideAndBuilder />
            )}

            {activeTab === 'anti-scam' && (
              <AntiScamGuide />
            )}
          </>
        )}
      </>
    )}
  </main>

      {/* Application Modals */}
      <LoginProfileModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        employerProfile={employerProfile}
        currentRole={userRole}
        onSaveProfile={handleSaveProfile}
        onSaveEmployerProfile={handleUpdateEmployerProfile}
        roleChangeRequest={currentUser?.roleChangeRequest}
        onRequestRoleChange={handleRequestRoleChange}
        onCancelRoleChange={handleCancelRoleChange}
        onApproveRoleChangeDemo={handleApproveRoleChangeDemo}
        onSwitchDemoAccount={handleSwitchDemoAccount}
        onLogout={handleLogout}
      />

      <JobDetailModal
        job={selectedJob}
        company={selectedJobCompany}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onToggleSave={handleToggleSaveJob}
        onOpenApply={handleQuickApply}
      />

      <ApplyModal
        job={applyJob}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSubmitApplication={handleSubmitApplication}
        userProfile={userProfile}
        onOpenLoginProfile={() => setIsLoginModalOpen(true)}
      />

      {/* Modal Việc làm đã lưu - Dành cho Ứng viên */}
      <SavedJobsModal
        isOpen={isSavedJobsOpen}
        onClose={handleCloseSavedJobs}
        savedJobs={savedJobsList}
        onRemoveSavedJob={handleToggleSaveJob}
        onSelectJob={handleSelectJobForDetail}
        onQuickApply={handleQuickApply}
      />

      {/* Modal Thông báo việc làm - Dành cho Ứng viên */}
      <JobAlertsModal
        isOpen={isJobAlertsOpen}
        onClose={handleCloseJobAlerts}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
        industries={industries}
      />

      {/* Modal chọn vai trò tài khoản lần đầu (Bắt buộc xác nhận trước khi vào app) */}
      <RoleSelectionModal
        isOpen={!isRoleConfirmed || isRoleModalOpen}
        onClose={isRoleConfirmed ? () => setIsRoleModalOpen(false) : undefined}
        currentRole={modalTargetRole || userRole}
        userProfile={userProfile}
        employerProfile={employerProfile}
        industries={industries}
        onConfirmRoleAndProfile={handleConfirmRoleAndProfile}
        onSelectRole={handleRoleSelection}
        isInitialPrompt={!isRoleConfirmed}
      />

      {/* Footer */}
      <footer 
        className="text-slate-300 text-xs border-t mt-12 pt-10 pb-10"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #28374D 50%, #172335 100%)',
          borderColor: 'rgba(222, 181, 215, 0.4)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/app_logo.png" 
                  alt="Logo Nối cơ hội - Đổi cuộc đời" 
                  className="w-10 h-10 object-contain drop-shadow-md"
                />
                <span className="text-white font-extrabold text-base tracking-tight">
                  Nối cơ hội - Đổi cuộc đời
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs max-w-md">
                Nền tảng việc làm và phát triển năng lực nghề nghiệp dành cho <strong>mọi lứa tuổi</strong>, 
                đặc biệt là <strong>sinh viên năm cuối, mới tốt nghiệp, học sinh & người chưa có kinh nghiệm</strong>. 
                Rút ngắn thời gian tìm việc, kết nối trực tiếp 100% với doanh nghiệp, bảo vệ thông tin cá nhân và đẩy lùi lừa đảo môi giới.
              </p>
              <div className="flex items-center gap-2 font-bold text-xs" style={{ color: '#FFD273' }}>
                <ShieldCheck className="w-4 h-4 text-[#FFD273]" />
                <span>Cam kết 100% doanh nghiệp xác thực • Tuyệt đối không thu phí ứng viên</span>
              </div>
            </div>

            <div>
              <h4 
                className="font-bold text-xs uppercase tracking-wider mb-3"
                style={{ color: '#FEE686' }}
              >
                Khối ngành trọng điểm
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• CNKT - Công nghệ & Kỹ thuật số</li>
                <li>• DVVT - Dịch vụ, Vận tải & Chuỗi cung ứng</li>
                <li>• KTTM - Kinh tế, Thương mại & Bán lẻ</li>
                <li>• MKT - Marketing, Sáng tạo & Truyền thông</li>
                <li>• GDĐT - Giáo dục, Khóa học & Đào tạo</li>
                <li>• YTHC - Y tế, Chăm sóc sức khỏe & Hành chính</li>
              </ul>
            </div>

            <div>
              <h4 
                className="font-bold text-xs uppercase tracking-wider mb-3"
                style={{ color: '#FEC5E6' }}
              >
                Hỗ trợ & Bảo vệ
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                <li>• Hướng dẫn làm Portfolio Google Sites</li>
                <li>• Bảng so sánh mức lương thị trường chuẩn</li>
                <li>• Đánh giá phỏng vấn thực tế từ cộng đồng</li>
                <li>• Cẩm nang nhận biết & phòng chống lừa đảo</li>
                <li>• Tổng đài bảo vệ người tìm việc: 156 / 113</li>
              </ul>
            </div>
          </div>

          <div 
            className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <span>
              © 2026 Nối cơ hội - Đổi cuộc đời. Dự án kết nối việc làm minh bạch, không qua trung gian.
            </span>
            <div className="flex items-center gap-4 font-semibold text-slate-200">
              <span style={{ color: '#FFD273' }}>✓ Không qua trung gian</span>
              <span style={{ color: '#BFAEE3' }}>✓ Bảo mật thông tin</span>
              <span style={{ color: '#FEE686' }}>✓ 0đ phí ứng tuyển</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Thông báo nổi (Toast Notification) */}
      {toastAlert && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-2rem)] bg-white rounded-2xl shadow-2xl border p-4 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
          style={{
            borderColor: toastAlert.type === 'save' ? '#DEB5D7' : '#e2e8f0',
            boxShadow: toastAlert.type === 'save' 
              ? '0 10px 25px -5px rgba(222, 181, 215, 0.5)' 
              : '0 10px 25px -5px rgba(0, 0, 0, 0.12)'
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
              style={{
                backgroundColor: toastAlert.type === 'save' ? '#FFD273' : '#F1F5F9',
                color: toastAlert.type === 'save' ? '#3d2b02' : '#475569'
              }}
            >
              {toastAlert.type === 'save' ? (
                <BookmarkCheck className="w-5 h-5 text-amber-950" />
              ) : (
                <Bookmark className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                {toastAlert.message}
              </p>
              {toastAlert.type === 'save' && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Đã lưu vào danh sách. Bạn có thể xem lại bất cứ lúc nào.
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {toastAlert.actionLabel && toastAlert.onAction && (
              <button
                type="button"
                onClick={() => {
                  toastAlert.onAction?.();
                  setToastAlert(null);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs whitespace-nowrap border"
                style={{
                  backgroundColor: '#FFD273',
                  borderColor: '#e6bd67',
                  color: '#3d2b02'
                }}
              >
                {toastAlert.actionLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setToastAlert(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

export default App;
