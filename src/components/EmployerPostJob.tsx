import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Job, Industry, EmployerProfile, JobLocation } from '../types';
import { 
  calcTransparencyScore, 
  detectRisks, 
  formatIsoDate, 
  formatDisplayDate,
  TransparencyScore,
  DetectedRisk 
} from '../utils/transparency';
import { 
  Building2, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  DollarSign, 
  Phone, 
  Mail, 
  Layers, 
  GraduationCap, 
  AlertTriangle, 
  Briefcase, 
  Users, 
  Calendar, 
  Eye, 
  Save, 
  Trash2, 
  ImagePlus, 
  PlusCircle, 
  Clock, 
  BadgeCheck, 
  RotateCcw,
  X
} from 'lucide-react';

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Hải Phòng', 'Cần Thơ', 'Toàn quốc'];
const LEVELS = ['Thực tập sinh', 'Nhân viên', 'Chuyên viên', 'Trưởng nhóm', 'Trưởng phòng trở lên'];
const EDUCATIONS = ['Không yêu cầu', 'Trung cấp / Nghề', 'Cao đẳng', 'Đại học trở lên'];
const MAX_SKILLS = 10;
const MAX_EXTRA_LOCATIONS = 4;
const MAX_LOGO_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_DEADLINE_DAYS = 90;
const DRAFT_KEY = 'employer_job_draft_v1';

interface EmployerPostJobProps {
  industries: Industry[];
  employerProfile: EmployerProfile;
  initialJob?: Job | null;
  cloneMode?: boolean;
  onSubmit: (jobData: Job, updatedProfile?: Partial<EmployerProfile>) => void;
  onCancelEdit?: () => void;
}

interface FormState {
  companyName: string;
  taxCode: string;
  companyDescription: string;
  logo: string;
  title: string;
  industryCode: string;
  subIndustry: string;
  level: string;
  headcount: string;
  education: string;
  experienceRequired: 'no-experience' | 'under-1-year' | '1-2-years' | 'above-2-years';
  jobType: 'full-time' | 'part-time' | 'internship' | 'long-term';
  skills: string[];
  city: string;
  address: string;
  extraLocations: JobLocation[];
  salaryType: 'fixed' | 'negotiable';
  salaryMin: string;
  salaryMax: string;
  deadlineDate: string;
  description: string;
  requirements: string;
  benefits: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  responseSla: string;
  agreedNoFee: boolean;
  agreedDirectRecruitment: boolean;
}

const addDays = (d: Date, days: number): Date => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

const mapExpRequired = (exp?: string): FormState['experienceRequired'] => {
  if (exp === 'under-1-year' || exp === '1-2-years' || exp === 'above-2-years') return exp;
  return 'no-experience';
};

const mapJobType = (jt?: string): FormState['jobType'] => {
  if (jt === 'part-time' || jt === 'internship' || jt === 'long-term') return jt;
  return 'full-time';
};

const getInitialFormState = (job: Job | null, profile: EmployerProfile, industries: Industry[]): FormState => {
  if (job) {
    const locs = job.locations || [];
    return {
      companyName: job.companyName,
      taxCode: profile.taxCode || '',
      companyDescription: job.companyDescription || '',
      logo: job.companyLogo || '',
      title: job.title,
      industryCode: job.industryCode,
      subIndustry: job.tags?.[1] || '',
      level: job.level || 'Nhân viên',
      headcount: String(job.headcount ?? 1),
      education: job.educationLevel || 'Không yêu cầu',
      experienceRequired: mapExpRequired(job.experienceRequired),
      jobType: mapJobType(job.jobType),
      skills: job.skills || [],
      city: locs[0]?.city || job.city,
      address: locs[0]?.address || job.address || '',
      extraLocations: locs.slice(1),
      salaryType: job.salaryMin === 0 && job.salaryMax === 0 ? 'negotiable' : 'fixed',
      salaryMin: String(job.salaryMin || 8),
      salaryMax: String(job.salaryMax || 15),
      deadlineDate: job.deadlineDate || formatIsoDate(addDays(new Date(), 30)),
      description: (job.description || []).join('\n'),
      requirements: (job.requirements || []).join('\n'),
      benefits: (job.benefits || []).join('\n'),
      contactName: profile.contactName || '',
      contactEmail: job.contactEmail || profile.contactEmail || '',
      contactPhone: job.contactPhone || profile.contactPhone || '',
      responseSla: String(job.responseSlaHours || 48),
      agreedNoFee: true,
      agreedDirectRecruitment: true
    };
  }

  return {
    companyName: profile.companyName || '',
    taxCode: profile.taxCode || '',
    companyDescription: '',
    logo: '',
    title: '',
    industryCode: industries[0]?.code || 'CNKT',
    subIndustry: industries[0]?.subIndustries?.[0] || '',
    level: 'Nhân viên',
    headcount: '1',
    education: 'Không yêu cầu',
    experienceRequired: 'no-experience',
    jobType: 'full-time',
    skills: [],
    city: profile.city || 'Hà Nội',
    address: profile.address || '',
    extraLocations: [],
    salaryType: 'fixed',
    salaryMin: '8',
    salaryMax: '15',
    deadlineDate: formatIsoDate(addDays(new Date(), 30)),
    description: '',
    requirements: '',
    benefits: '',
    contactName: profile.contactName || '',
    contactEmail: profile.contactEmail || '',
    contactPhone: profile.contactPhone || '',
    responseSla: '48',
    agreedNoFee: true,
    agreedDirectRecruitment: true
  };
};

const validateEmployerJobForm = (f: FormState): Record<string, string> => {
  const errs: Record<string, string> = {};

  if (!f.companyName.trim()) {
    errs.companyName = 'Nhập tên công ty.';
  }

  const cleanTax = f.taxCode.replace(/[\s-]/g, '');
  if (!cleanTax) {
    errs.taxCode = 'Nhập mã số thuế.';
  } else if (!/^\d{10}(\d{3})?$/.test(cleanTax)) {
    errs.taxCode = 'Mã số thuế gồm 10 hoặc 13 chữ số.';
  }

  if (f.companyDescription.length > 1000) {
    errs.companyDescription = 'Mô tả công ty tối đa 1000 ký tự.';
  }

  const titleTrim = f.title.trim();
  if (!titleTrim) {
    errs.title = 'Nhập chức danh tuyển dụng.';
  } else if (titleTrim.length < 5) {
    errs.title = 'Chức danh tối thiểu 5 ký tự.';
  } else if (titleTrim.length > 100) {
    errs.title = 'Chức danh tối đa 100 ký tự.';
  }

  const hcNum = Number(f.headcount);
  if (!f.headcount.trim() || !Number.isInteger(hcNum) || hcNum < 1 || hcNum > 999) {
    errs.headcount = 'Số lượng tuyển từ 1 đến 999.';
  }

  if (!f.description.split('\n').some(l => l.trim())) {
    errs.description = 'Nhập mô tả công việc (ít nhất 1 ý).';
  }
  if (!f.requirements.split('\n').some(l => l.trim())) {
    errs.requirements = 'Nhập yêu cầu ứng viên (ít nhất 1 ý).';
  }
  if (!f.benefits.split('\n').some(l => l.trim())) {
    errs.benefits = 'Nhập quyền lợi (ít nhất 1 ý).';
  }

  if (!f.address.trim()) {
    errs.address = 'Nhập địa chỉ làm việc.';
  }

  f.extraLocations.forEach((loc, idx) => {
    if (!loc.address.trim()) {
      errs[`extraLoc${idx}`] = 'Nhập địa chỉ cho địa điểm này.';
    }
  });

  if (f.salaryType === 'fixed') {
    const smin = Number(f.salaryMin);
    const smax = Number(f.salaryMax);
    if (!f.salaryMin.trim() || !Number.isFinite(smin) || smin < 1 || smin > 200) {
      errs.salaryMin = 'Từ 1 đến 200 triệu.';
    }
    if (!f.salaryMax.trim() || !Number.isFinite(smax) || smax < 1 || smax > 200) {
      errs.salaryMax = 'Từ 1 đến 200 triệu.';
    }
    if (!errs.salaryMin && !errs.salaryMax && smin > smax) {
      errs.salaryMax = 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu.';
    }
  }

  const today = formatIsoDate();
  const maxDate = formatIsoDate(addDays(new Date(), MAX_DEADLINE_DAYS));
  if (!f.deadlineDate) {
    errs.deadlineDate = 'Chọn hạn nộp hồ sơ.';
  } else if (f.deadlineDate < today) {
    errs.deadlineDate = 'Hạn nộp không được là ngày trong quá khứ.';
  } else if (f.deadlineDate > maxDate) {
    errs.deadlineDate = `Hạn nộp tối đa ${MAX_DEADLINE_DAYS} ngày kể từ hôm nay.`;
  }

  if (!f.contactName.trim()) {
    errs.contactName = 'Nhập người phụ trách.';
  }

  if (!f.contactEmail.trim()) {
    errs.contactEmail = 'Nhập email nhận CV.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactEmail.trim())) {
    errs.contactEmail = 'Email chưa đúng định dạng.';
  }

  const phoneDigits = f.contactPhone.replace(/[^\d+]/g, '');
  if (!f.contactPhone.trim()) {
    errs.contactPhone = 'Nhập số điện thoại.';
  } else if (!/^(\+84|84|0)\d{9}$/.test(phoneDigits)) {
    errs.contactPhone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0 hoặc +84.';
  }

  const textFields = [
    { field: 'Chức danh', text: f.title },
    { field: 'Mô tả công ty', text: f.companyDescription },
    { field: 'Mô tả công việc', text: f.description },
    { field: 'Yêu cầu ứng viên', text: f.requirements },
    { field: 'Quyền lợi', text: f.benefits },
    { field: 'Kỹ năng', text: f.skills.join(', ') }
  ];
  const blocked = detectRisks(textFields).filter(r => r.severity === 'block');
  if (blocked.length) {
    errs.safety = `Tin có ${blocked.length} nội dung yêu cầu ứng viên trả phí hoặc chuyển tiền. Hãy sửa trước khi đăng.`;
  }

  if (!f.agreedNoFee) {
    errs.agreedNoFee = 'Cần xác nhận cam kết không thu phí ứng viên.';
  }
  if (!f.agreedDirectRecruitment) {
    errs.agreedDirectRecruitment = 'Cần xác nhận cam kết tuyển trực tiếp.';
  }

  return errs;
};

const assembleJob = (f: FormState, industries: Industry[], id: string, baseJob?: Job | null): Job => {
  const ind = industries.find(i => i.code === f.industryCode);
  const parseLines = (text: string) =>
    text.split('\n').map(l => l.replace(/^[-•]\s*/, '').trim()).filter(Boolean);

  const expText =
    f.experienceRequired === 'no-experience'
      ? 'Không cần kinh nghiệm (Được đào tạo từ đầu)'
      : f.experienceRequired === 'under-1-year'
      ? 'Dưới 1 năm kinh nghiệm'
      : f.experienceRequired === '1-2-years'
      ? '1 - 2 năm kinh nghiệm'
      : 'Trên 2 năm kinh nghiệm';

  const isNeg = f.salaryType === 'negotiable';
  const allLocs: JobLocation[] = [
    { city: f.city, address: f.address.trim() },
    ...f.extraLocations.map(l => ({ city: l.city, address: l.address.trim() }))
  ];
  const distinctCities = Array.from(new Set(allLocs.map(l => l.city)));

  return {
    ...(baseJob || {}),
    id,
    title: f.title.trim(),
    companyName: f.companyName.trim(),
    companyLogo: f.logo,
    companyDescription: f.companyDescription.trim(),
    industryCode: f.industryCode,
    industryName: ind ? ind.name : 'Khối ngành kỹ thuật',
    city: distinctCities.length > 1 ? `${distinctCities[0]} +${distinctCities.length - 1} tỉnh/thành` : distinctCities[0],
    address: f.address.trim(),
    locations: allLocs,
    salaryMin: isNeg ? 0 : Number(f.salaryMin),
    salaryMax: isNeg ? 0 : Number(f.salaryMax),
    salaryText: isNeg ? 'Lương thỏa thuận theo năng lực' : `${f.salaryMin} - ${f.salaryMax} triệu/tháng`,
    experienceRequired: f.experienceRequired,
    experienceText: expText,
    jobType: f.jobType,
    level: f.level,
    headcount: Number(f.headcount),
    educationLevel: f.education,
    skills: f.skills,
    isVerifiedDirect: true,
    isVerifiedCompany: true,
    responseSlaHours: Number(f.responseSla),
    postedDate: baseJob?.postedDate || 'Vừa đăng',
    deadlineDate: f.deadlineDate,
    deadline: formatDisplayDate(f.deadlineDate),
    status: baseJob?.status || 'open',
    description: parseLines(f.description),
    requirements: parseLines(f.requirements),
    benefits: parseLines(f.benefits),
    tags: [
      f.industryCode,
      f.subIndustry || (ind ? ind.name : ''),
      f.experienceRequired === 'no-experience' ? 'Không cần KN' : 'Có kinh nghiệm',
      isNeg ? 'Thỏa thuận' : `${f.salaryMin}-${f.salaryMax}tr`,
      'Tuyển trực tiếp 100%',
      ...f.skills
    ],
    contactEmail: f.contactEmail.trim(),
    contactPhone: f.contactPhone.trim(),
    directEmployerCommitment: 'Cam kết 100% không thu bất kỳ chi phí nào của ứng viên.'
  };
};

const ErrorMessage: React.FC<{ id: string; msg?: string }> = ({ id, msg }) => {
  if (!msg) return null;
  return (
    <p id={`err-${id}`} role="alert" className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-600">
      <AlertTriangle className="w-3 h-3 shrink-0" />
      {msg}
    </p>
  );
};

export const EmployerPostJob: React.FC<EmployerPostJobProps> = ({
  industries,
  employerProfile,
  initialJob,
  cloneMode,
  onSubmit,
  onCancelEdit
}) => {
  const isEditing = !!initialJob && !cloneMode;
  const baseJob = isEditing ? initialJob : null;

  const [form, setForm] = useState<FormState>(() =>
    getInitialFormState(initialJob || null, employerProfile, industries)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [savedDraft, setSavedDraft] = useState<{ savedAt: string; data: FormState } | null>(null);
  const [draftNotice, setDraftNotice] = useState('');
  const [logoError, setLogoError] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);

  const updateField = <K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: val }));
  };

  useEffect(() => {
    if (!isEditing && !cloneMode) {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (raw) setSavedDraft(JSON.parse(raw));
      } catch {}
    }
  }, [isEditing, cloneMode]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      setErrors(validateEmployerJobForm(form));
    }
  }, [form, hasAttemptedSubmit]);

  const subIndustries = useMemo(() => {
    return industries.find(i => i.code === form.industryCode)?.subIndustries || [];
  }, [industries, form.industryCode]);

  const OTHER_VAL = '__other__';
  const [subMode, setSubMode] = useState<string>(() =>
    subIndustries.length > 0 && subIndustries.includes(form.subIndustry) ? 'list' : 'other'
  );

  const handleIndustryChange = (code: string) => {
    const ind = industries.find(i => i.code === code);
    const firstSub = ind?.subIndustries?.[0] || '';
    setForm(prev => ({ ...prev, industryCode: code, subIndustry: firstSub }));
    setSubMode(firstSub ? 'list' : 'other');
  };

  const addSkills = (raw: string) => {
    const tokens = raw.split(',').map(s => s.trim()).filter(Boolean);
    if (!tokens.length) return;
    setForm(prev => {
      const nextSkills = [...prev.skills];
      for (const tok of tokens) {
        const trimmed = tok.slice(0, 30);
        if (nextSkills.length >= MAX_SKILLS) break;
        if (!nextSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
          nextSkills.push(trimmed);
        }
      }
      return { ...prev, skills: nextSkills };
    });
    setSkillInput('');
  };

  const handleLogoFile = (file?: File) => {
    setLogoError('');
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
      setLogoError('Chỉ nhận ảnh PNG, JPG hoặc WEBP.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError('Logo tối đa 2MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => updateField('logo', String(reader.result));
    reader.readAsDataURL(file);
  };

  const saveDraft = () => {
    const nowIso = new Date().toISOString();
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ savedAt: nowIso, data: form }));
      const d = new Date(nowIso);
      setDraftNotice(`Đã lưu nháp lúc ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    } catch {
      setDraftNotice('Không lưu được nháp trên trình duyệt này.');
    }
  };

  const restoreDraft = () => {
    if (savedDraft) {
      setForm(savedDraft.data);
      setDraftNotice('Đã khôi phục bản nháp.');
    }
  };

  const discardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
    setSavedDraft(null);
    setDraftNotice('Đã xóa bản nháp.');
  };

  const scrollToFirstError = (errs: Record<string, string>) => {
    const order = [
      'companyName', 'taxCode', 'companyDescription', 'title', 'headcount',
      'address', 'salaryMin', 'salaryMax', 'deadlineDate', 'description',
      'requirements', 'benefits', 'contactName', 'contactEmail', 'contactPhone',
      'safety', 'agreedNoFee', 'agreedDirectRecruitment'
    ];
    const firstKey = order.find(k => errs[k]) || Object.keys(errs)[0];
    if (!firstKey) return;
    const el = formRef.current?.querySelector(`[data-field="${firstKey}"]`) as HTMLElement | null;
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el?.focus({ preventScroll: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    const errs = validateEmployerJobForm(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      scrollToFirstError(errs);
      return;
    }

    const job = assembleJob(form, industries, baseJob?.id || `job-emp-${Date.now()}`, baseJob);
    onSubmit(job, {
      companyName: form.companyName.trim(),
      taxCode: form.taxCode.trim(),
      contactName: form.contactName.trim(),
      contactEmail: form.contactEmail.trim(),
      contactPhone: form.contactPhone.trim(),
      address: form.address.trim(),
      city: form.city
    });

    if (!isEditing) {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      setSavedDraft(null);
    }
  };

  const risks: DetectedRisk[] = useMemo(() => {
    const textFields = [
      { field: 'Chức danh', text: form.title },
      { field: 'Mô tả công ty', text: form.companyDescription },
      { field: 'Mô tả công việc', text: form.description },
      { field: 'Yêu cầu ứng viên', text: form.requirements },
      { field: 'Quyền lợi', text: form.benefits },
      { field: 'Kỹ năng', text: form.skills.join(', ') }
    ];
    return detectRisks(textFields);
  }, [form]);

  const transScore: TransparencyScore = useMemo(() => {
    const previewJob = assembleJob(form, industries, 'live', baseJob);
    const cleanTax = form.taxCode.replace(/[\s-]/g, '');
    const validTax = /^\d{10}(\d{3})?$/.test(cleanTax);
    return calcTransparencyScore({
      ...previewJob,
      isVerifiedCompany: validTax,
      isVerifiedDirect: form.agreedDirectRecruitment,
      directEmployerCommitment: form.agreedNoFee ? previewJob.directEmployerCommitment : undefined
    });
  }, [form, industries, baseJob]);

  const previewJobData = useMemo(() => {
    return showPreview ? assembleJob(form, industries, 'preview', baseJob) : null;
  }, [showPreview, form, industries, baseJob]);

  const errorCount = Object.keys(errors).length;
  const todayStr = formatIsoDate();
  const maxDateStr = formatIsoDate(addDays(new Date(), MAX_DEADLINE_DAYS));

  const inputClass = (hasErr?: boolean, extra = '') =>
    `w-full px-3.5 py-2.5 rounded-xl border bg-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FFD273] ${
      hasErr ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-300'
    } ${extra}`;

  const labelClass = 'flex items-center gap-1 min-h-5 text-xs font-bold text-slate-700 mb-1';
  const sectionClass = 'bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 space-y-4';
  const sectionTitleClass = 'text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-7">
      
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-700" />
            {isEditing ? 'Sửa tin tuyển dụng' : cloneMode ? 'Đăng tin mới từ bản sao' : 'Đăng tin tuyển dụng trực tiếp (Chuẩn hóa vị trí & khối ngành)'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isEditing 
              ? 'Cập nhật thông tin tin đã đăng. Nếu đổi nội dung chính (tiêu đề, mô tả, yêu cầu, quyền lợi, lương), tin sẽ quay về chờ duyệt.'
              : cloneMode
              ? 'Thông tin được lấy từ tin cũ. Sửa phần khác biệt rồi đăng, tin mới sẽ qua duyệt như tin thường.'
              : 'Điền đầy đủ thông tin để kết nối trực tiếp với ứng viên phù hợp. Tuyệt đối không qua trung gian.'}
          </p>
        </div>
        {(isEditing || cloneMode) && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {cloneMode ? 'Hủy' : 'Hủy sửa'}
          </button>
        )}
      </div>

      {/* Draft restore banner */}
      {!isEditing && savedDraft && (
        <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-500" />
            Có bản nháp lưu lúc {new Date(savedDraft.savedAt).toLocaleString('vi-VN')}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              onClick={restoreDraft}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 hover:bg-slate-100 cursor-pointer"
            >
              Khôi phục
            </button>
            <button
              type="button"
              onClick={discardDraft}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-rose-700 hover:bg-rose-50 cursor-pointer"
            >
              Xóa nháp
            </button>
          </span>
        </div>
      )}

      {/* Error alert banner */}
      {hasAttemptedSubmit && errorCount > 0 && (
        <div role="alert" className="p-3.5 rounded-2xl border border-rose-300 bg-rose-50 text-xs font-bold text-rose-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Còn {errorCount} mục cần sửa trước khi đăng tin. Các ô lỗi được đánh dấu màu đỏ.
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* 1. THÔNG TIN DOANH NGHIỆP */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-purple-800" />
            <h3 className={sectionTitleClass}>1. Thông tin doanh nghiệp tuyển dụng</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-company" className={labelClass}>
                Tên công ty / Doanh nghiệp <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-company"
                data-field="companyName"
                type="text"
                placeholder="Ví dụ: Công ty Cổ phần Công nghệ VN Tech"
                value={form.companyName}
                onChange={e => updateField('companyName', e.target.value)}
                aria-invalid={!!errors.companyName}
                className={inputClass(!!errors.companyName)}
              />
              <ErrorMessage id="companyName" msg={errors.companyName} />
            </div>

            <div>
              <label htmlFor="f-tax" className={labelClass}>
                Mã số thuế / Giấy phép kinh doanh <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-tax"
                data-field="taxCode"
                type="text"
                inputMode="numeric"
                placeholder="Ví dụ: 0108927164 (10 hoặc 13 số)"
                value={form.taxCode}
                onChange={e => updateField('taxCode', e.target.value)}
                aria-invalid={!!errors.taxCode}
                className={inputClass(!!errors.taxCode)}
              />
              {errors.taxCode ? (
                <ErrorMessage id="taxCode" msg={errors.taxCode} />
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Dùng để xác thực doanh nghiệp 100% minh bạch.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="f-company-desc" className={labelClass}>Mô tả công ty:</label>
              <textarea
                id="f-company-desc"
                data-field="companyDescription"
                rows={4}
                maxLength={1100}
                placeholder="Giới thiệu ngắn về lĩnh vực hoạt động, quy mô và văn hóa của công ty..."
                value={form.companyDescription}
                onChange={e => updateField('companyDescription', e.target.value)}
                aria-invalid={!!errors.companyDescription}
                className={inputClass(!!errors.companyDescription, 'resize-y')}
              />
              <div className="flex items-start justify-between gap-2">
                <ErrorMessage id="companyDescription" msg={errors.companyDescription} />
                <span className="ml-auto text-[10px] text-slate-400 mt-1">{form.companyDescription.length}/1000</span>
              </div>
            </div>

            <div>
              <span className={labelClass}>
                <ImagePlus className="w-3.5 h-3.5 text-purple-700" /> Logo công ty:
              </span>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 shrink-0 rounded-xl border border-slate-300 bg-white flex items-center justify-center overflow-hidden">
                  {form.logo ? (
                    <img src={form.logo} alt="Logo công ty" className="w-full h-full object-contain" />
                  ) : (
                    <ImagePlus className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="space-y-1.5 min-w-0">
                  <label htmlFor="f-logo" className="inline-block px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer">
                    {form.logo ? 'Đổi logo' : 'Tải logo lên'}
                  </label>
                  <input
                    id="f-logo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                    onChange={e => {
                      handleLogoFile(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                  {form.logo && (
                    <button
                      type="button"
                      onClick={() => updateField('logo', '')}
                      className="flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa logo
                    </button>
                  )}
                  <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, tối đa 2MB.</p>
                </div>
              </div>
              {logoError && <ErrorMessage id="logo" msg={logoError} />}
            </div>
          </div>
        </div>

        {/* 2. CHI TIẾT VỊ TRÍ */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-800" />
            <h3 className={sectionTitleClass}>2. Chi tiết vị trí tuyển dụng</h3>
          </div>

          <div>
            <label htmlFor="f-title" className={labelClass}>
              Chức danh / Tiêu đề công việc <span className="text-rose-500">*</span>:
            </label>
            <input
              id="f-title"
              data-field="title"
              type="text"
              placeholder="Ví dụ: Thực tập sinh Lập trình Web Frontend / Nhân viên điều phối kho vận"
              value={form.title}
              onChange={e => updateField('title', e.target.value)}
              aria-invalid={!!errors.title}
              className={inputClass(!!errors.title)}
            />
            <ErrorMessage id="title" msg={errors.title} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-industry" className={labelClass}>
                <Layers className="w-3.5 h-3.5 text-purple-700" /> Khối ngành chính:
              </label>
              <select
                id="f-industry"
                value={form.industryCode}
                onChange={e => handleIndustryChange(e.target.value)}
                className={inputClass(false, 'cursor-pointer')}
              >
                {industries.map(ind => (
                  <option key={ind.code} value={ind.code}>
                    {ind.code} - {ind.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="f-sub" className={labelClass}>
                <Sparkles className="w-3.5 h-3.5 text-amber-700" /> Khối ngành con / Chuyên môn cụ thể:
              </label>
              <div className="space-y-1.5">
                {subIndustries.length > 0 && (
                  <select
                    id="f-sub"
                    value={subMode === 'list' ? form.subIndustry : OTHER_VAL}
                    onChange={e => {
                      if (e.target.value === OTHER_VAL) {
                        setSubMode('other');
                        updateField('subIndustry', '');
                      } else {
                        setSubMode('list');
                        updateField('subIndustry', e.target.value);
                      }
                    }}
                    className={inputClass(false, 'cursor-pointer')}
                  >
                    {subIndustries.map((sub, i) => (
                      <option key={i} value={sub}>{sub}</option>
                    ))}
                    <option value={OTHER_VAL}>Khác (tự nhập)</option>
                  </select>
                )}
                {(subMode === 'other' || subIndustries.length === 0) && (
                  <input
                    id="f-sub-other"
                    type="text"
                    aria-label="Chuyên ngành con khác"
                    placeholder="Nhập chuyên ngành con..."
                    value={form.subIndustry}
                    onChange={e => updateField('subIndustry', e.target.value)}
                    className={inputClass()}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="f-level" className={labelClass}>
                <Users className="w-3.5 h-3.5 text-purple-700" /> Cấp bậc:
              </label>
              <select
                id="f-level"
                value={form.level}
                onChange={e => updateField('level', e.target.value)}
                className={inputClass(false, 'cursor-pointer')}
              >
                {LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="f-headcount" className={labelClass}>
                Số lượng tuyển <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-headcount"
                data-field="headcount"
                type="number"
                min={1}
                max={999}
                value={form.headcount}
                onChange={e => updateField('headcount', e.target.value)}
                aria-invalid={!!errors.headcount}
                className={inputClass(!!errors.headcount)}
              />
              <ErrorMessage id="headcount" msg={errors.headcount} />
            </div>

            <div>
              <label htmlFor="f-edu" className={labelClass}>
                <GraduationCap className="w-3.5 h-3.5 text-pink-700" /> Học vấn:
              </label>
              <select
                id="f-edu"
                value={form.education}
                onChange={e => updateField('education', e.target.value)}
                className={inputClass(false, 'cursor-pointer')}
              >
                {EDUCATIONS.map(edu => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="f-exp" className={labelClass}>
                <GraduationCap className="w-3.5 h-3.5 text-pink-700" /> Yêu cầu kinh nghiệm:
              </label>
              <select
                id="f-exp"
                value={form.experienceRequired}
                onChange={e => updateField('experienceRequired', e.target.value as FormState['experienceRequired'])}
                className={inputClass(false, 'cursor-pointer')}
              >
                <option value="no-experience">🌱 Không cần kinh nghiệm (Được công ty đào tạo từ đầu)</option>
                <option value="under-1-year">Dưới 1 năm kinh nghiệm</option>
                <option value="1-2-years">1 - 2 năm kinh nghiệm</option>
                <option value="above-2-years">Trên 2 năm kinh nghiệm</option>
              </select>
            </div>

            <div>
              <label htmlFor="f-jobtype" className={labelClass}>Hình thức làm việc:</label>
              <select
                id="f-jobtype"
                value={form.jobType}
                onChange={e => updateField('jobType', e.target.value as FormState['jobType'])}
                className={inputClass(false, 'cursor-pointer')}
              >
                <option value="full-time">Toàn thời gian (Full-time)</option>
                <option value="part-time">Bán thời gian (Part-time)</option>
                <option value="internship">Thực tập sinh (Internship)</option>
                <option value="long-term">Làm việc lâu dài</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label htmlFor="f-skill" className={labelClass}>
              Kỹ năng yêu cầu (tối đa {MAX_SKILLS}, nhấn Enter hoặc dấu phẩy để thêm):
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2 empty:hidden">
              {form.skills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-white border border-slate-300 text-xs font-semibold text-slate-700">
                  {s}
                  <button
                    type="button"
                    aria-label={`Xóa kỹ năng ${s}`}
                    onClick={() => updateField('skills', form.skills.filter(x => x !== s))}
                    className="p-0.5 rounded-full hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              id="f-skill"
              type="text"
              placeholder={form.skills.length >= MAX_SKILLS ? 'Đã đạt tối đa số kỹ năng' : 'Ví dụ: React, Excel, Giao tiếp'}
              value={skillInput}
              disabled={form.skills.length >= MAX_SKILLS}
              onChange={e => {
                const val = e.target.value;
                if (val.includes(',')) {
                  addSkills(val);
                } else {
                  setSkillInput(val);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkills(skillInput);
                }
              }}
              onBlur={() => addSkills(skillInput)}
              className={inputClass(false, 'disabled:bg-slate-100 disabled:cursor-not-allowed')}
            />
          </div>

          {/* Locations */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="f-city" className={labelClass}>Tỉnh / Thành phố:</label>
                <select
                  id="f-city"
                  value={form.city}
                  onChange={e => updateField('city', e.target.value)}
                  className={inputClass(false, 'cursor-pointer')}
                >
                  {CITIES.map(c => (
                    <option key={c} value={c}>{c === 'Toàn quốc' ? 'Toàn quốc (Remote/Linh hoạt)' : c}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="f-address" className={labelClass}>
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Địa chỉ cụ thể nơi làm việc <span className="text-rose-500">*</span>:
                </label>
                <input
                  id="f-address"
                  data-field="address"
                  type="text"
                  placeholder="Ví dụ: Tầng 5, Tòa nhà Landmark, 123 Đường Cầu Giấy, Quận Cầu Giấy"
                  value={form.address}
                  onChange={e => updateField('address', e.target.value)}
                  aria-invalid={!!errors.address}
                  className={inputClass(!!errors.address)}
                />
                <ErrorMessage id="address" msg={errors.address} />
              </div>
            </div>

            {form.extraLocations.map((loc, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div>
                  <label htmlFor={`f-xcity-${idx}`} className={labelClass}>Tỉnh / Thành phố (địa điểm {idx + 2}):</label>
                  <select
                    id={`f-xcity-${idx}`}
                    value={loc.city}
                    onChange={e => {
                      const next = form.extraLocations.map((l, i) => i === idx ? { ...l, city: e.target.value } : l);
                      updateField('extraLocations', next);
                    }}
                    className={inputClass(false, 'cursor-pointer')}
                  >
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`f-xaddr-${idx}`} className={labelClass}>Địa chỉ cụ thể (địa điểm {idx + 2}):</label>
                  <div className="flex gap-2">
                    <input
                      id={`f-xaddr-${idx}`}
                      data-field={`extraLoc${idx}`}
                      type="text"
                      placeholder="Nhập địa chỉ làm việc"
                      value={loc.address}
                      onChange={e => {
                        const next = form.extraLocations.map((l, i) => i === idx ? { ...l, address: e.target.value } : l);
                        updateField('extraLocations', next);
                      }}
                      aria-invalid={!!errors[`extraLoc${idx}`]}
                      className={inputClass(!!errors[`extraLoc${idx}`])}
                    />
                    <button
                      type="button"
                      aria-label={`Xóa địa điểm ${idx + 2}`}
                      onClick={() => updateField('extraLocations', form.extraLocations.filter((_, i) => i !== idx))}
                      className="shrink-0 px-3 rounded-xl border border-slate-300 bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <ErrorMessage id={`extraLoc${idx}`} msg={errors[`extraLoc${idx}`]} />
                </div>
              </div>
            ))}

            {form.extraLocations.length < MAX_EXTRA_LOCATIONS && (
              <button
                type="button"
                onClick={() => updateField('extraLocations', [...form.extraLocations, { city: form.city, address: '' }])}
                className="flex items-center gap-1.5 text-xs font-bold text-purple-800 hover:underline cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" /> Thêm địa điểm làm việc
              </button>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-3">
            <span className={labelClass}>
              <DollarSign className="w-4 h-4 text-emerald-700" /> Hình thức mức lương:
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="radio"
                  name="salaryType"
                  checked={form.salaryType === 'fixed'}
                  onChange={() => updateField('salaryType', 'fixed')}
                  className="w-4 h-4 text-amber-600 focus:ring-[#FFD273]"
                />
                <span>Lương cụ thể (Nhập tối thiểu và tối đa)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="radio"
                  name="salaryType"
                  checked={form.salaryType === 'negotiable'}
                  onChange={() => updateField('salaryType', 'negotiable')}
                  className="w-4 h-4 text-amber-600 focus:ring-[#FFD273]"
                />
                <span>Lương thỏa thuận (Theo năng lực phỏng vấn)</span>
              </label>
            </div>

            {form.salaryType === 'fixed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="f-smin" className={labelClass}>Lương tối thiểu (Triệu VNĐ/tháng):</label>
                  <input
                    id="f-smin"
                    data-field="salaryMin"
                    type="number"
                    min={1}
                    max={200}
                    value={form.salaryMin}
                    onChange={e => updateField('salaryMin', e.target.value)}
                    aria-invalid={!!errors.salaryMin}
                    className={inputClass(!!errors.salaryMin)}
                  />
                  <ErrorMessage id="salaryMin" msg={errors.salaryMin} />
                </div>
                <div>
                  <label htmlFor="f-smax" className={labelClass}>Lương tối đa (Triệu VNĐ/tháng):</label>
                  <input
                    id="f-smax"
                    data-field="salaryMax"
                    type="number"
                    min={1}
                    max={200}
                    value={form.salaryMax}
                    onChange={e => updateField('salaryMax', e.target.value)}
                    aria-invalid={!!errors.salaryMax}
                    className={inputClass(!!errors.salaryMax)}
                  />
                  <ErrorMessage id="salaryMax" msg={errors.salaryMax} />
                </div>
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="sm:w-1/2 sm:pr-2">
            <label htmlFor="f-deadline" className={labelClass}>
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Hạn nộp hồ sơ <span className="text-rose-500">*</span>:
            </label>
            <input
              id="f-deadline"
              data-field="deadlineDate"
              type="date"
              min={todayStr}
              max={maxDateStr}
              value={form.deadlineDate}
              onChange={e => updateField('deadlineDate', e.target.value)}
              aria-invalid={!!errors.deadlineDate}
              className={inputClass(!!errors.deadlineDate)}
            />
            {errors.deadlineDate ? (
              <ErrorMessage id="deadlineDate" msg={errors.deadlineDate} />
            ) : (
              <p className="text-[10px] text-slate-400 mt-1">Mặc định 30 ngày kể từ hôm nay, tối đa {MAX_DEADLINE_DAYS} ngày.</p>
            )}
          </div>
        </div>

        {/* 3. MÔ TẢ & YÊU CẦU */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <h3 className={sectionTitleClass}>3. Mô tả công việc và quyền lợi ứng viên</h3>
          </div>

          <div>
            <label htmlFor="f-desc" className={labelClass}>
              Mô tả công việc (Mỗi ý xuống một dòng): <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="f-desc"
              rows={3}
              data-field="description"
              aria-invalid={!!errors.description}
              placeholder={`- Tiếp nhận và triển khai công việc theo quy trình công ty\n- Phối hợp cùng các thành viên trong nhóm hoàn thành mục tiêu\n- Được hướng dẫn chi tiết từng bước cho người mới`}
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              className={inputClass(!!errors.description, 'resize-y')}
            />
            <ErrorMessage id="description" msg={errors.description} />
          </div>

          <div>
            <label htmlFor="f-req" className={labelClass}>
              Yêu cầu ứng viên (Kỹ năng, thái độ, bằng cấp nếu có): <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="f-req"
              rows={3}
              data-field="requirements"
              aria-invalid={!!errors.requirements}
              placeholder={`- Chăm chỉ, có tinh thần trách nhiệm và cầu tiến\n- Biết sử dụng máy tính văn phòng cơ bản\n- Chấp nhận ứng viên chưa có kinh nghiệm, ưu tiên thái độ ham học hỏi`}
              value={form.requirements}
              onChange={e => updateField('requirements', e.target.value)}
              className={inputClass(!!errors.requirements, 'resize-y')}
            />
            <ErrorMessage id="requirements" msg={errors.requirements} />
          </div>

          <div>
            <label htmlFor="f-ben" className={labelClass}>
              Quyền lợi và phúc lợi: <span className="text-rose-600">*</span>
            </label>
            <textarea
              id="f-ben"
              rows={3}
              data-field="benefits"
              aria-invalid={!!errors.benefits}
              placeholder={`- Mức thu nhập ổn định, thưởng hiệu suất hàng tháng\n- Đóng BHXH, BHYT đầy đủ\n- Được đào tạo kỹ năng chuyên môn từ số 0, lộ trình thăng tiến rõ ràng`}
              value={form.benefits}
              onChange={e => updateField('benefits', e.target.value)}
              className={inputClass(!!errors.benefits, 'resize-y')}
            />
            <ErrorMessage id="benefits" msg={errors.benefits} />
          </div>
        </div>

        {/* 4. TIẾP NHẬN HỒ SƠ */}
        <div className={sectionClass}>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <h3 className={sectionTitleClass}>4. Thông tin tiếp nhận hồ sơ trực tiếp</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="f-cname" className={labelClass}>
                Người phụ trách tuyển dụng <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-cname"
                data-field="contactName"
                type="text"
                placeholder="Ví dụ: Trần Minh Quang (HR)"
                value={form.contactName}
                onChange={e => updateField('contactName', e.target.value)}
                aria-invalid={!!errors.contactName}
                className={inputClass(!!errors.contactName)}
              />
              <ErrorMessage id="contactName" msg={errors.contactName} />
            </div>

            <div>
              <label htmlFor="f-cemail" className={labelClass}>
                <Mail className="w-3.5 h-3.5 text-rose-500" /> Email nhận CV trực tiếp <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-cemail"
                data-field="contactEmail"
                type="email"
                placeholder="tuyendung@doanhnghiep.vn"
                value={form.contactEmail}
                onChange={e => updateField('contactEmail', e.target.value)}
                aria-invalid={!!errors.contactEmail}
                className={inputClass(!!errors.contactEmail)}
              />
              <ErrorMessage id="contactEmail" msg={errors.contactEmail} />
            </div>

            <div>
              <label htmlFor="f-cphone" className={labelClass}>
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> SĐT hotline / Zalo <span className="text-rose-500">*</span>:
              </label>
              <input
                id="f-cphone"
                data-field="contactPhone"
                type="tel"
                placeholder="0988 123 456 (Zalo)"
                value={form.contactPhone}
                onChange={e => updateField('contactPhone', e.target.value)}
                aria-invalid={!!errors.contactPhone}
                className={inputClass(!!errors.contactPhone)}
              />
              <ErrorMessage id="contactPhone" msg={errors.contactPhone} />
            </div>
          </div>

          <div className="sm:w-1/3 sm:pr-3">
            <label htmlFor="f-sla" className={labelClass}>
              <Clock className="w-3.5 h-3.5 text-purple-700" /> Cam kết phản hồi hồ sơ:
            </label>
            <select
              id="f-sla"
              value={form.responseSla}
              onChange={e => updateField('responseSla', e.target.value)}
              className={inputClass(false, 'cursor-pointer')}
            >
              <option value="24">Trong 24 giờ</option>
              <option value="48">Trong 48 giờ</option>
              <option value="72">Trong 72 giờ</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1">Hiển thị cho ứng viên. Hệ thống nhắc bạn khi hồ sơ sắp quá hạn.</p>
          </div>
        </div>

        {/* 5. KIỂM TRA TRƯỚC KHI ĐĂNG (TRANSPARENCY & RISKS) */}
        <div
          data-field="safety"
          tabIndex={-1}
          className={`rounded-2xl p-4 sm:p-5 border space-y-4 focus:outline-hidden ${
            errors.safety ? 'border-rose-400 bg-rose-50/60' : 'border-slate-200/90 bg-slate-50/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-700" />
            <h3 className={sectionTitleClass}>Kiểm tra trước khi đăng</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Transparency Score */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700">Điểm minh bạch của tin</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  transScore.level === 'high' ? 'bg-emerald-100 text-emerald-800' :
                  transScore.level === 'medium' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                }`}>
                  {transScore.score}/100 · {transScore.levelLabel}
                </span>
              </div>
              <div
                className="h-2 rounded-full bg-slate-100 overflow-hidden"
                role="progressbar"
                aria-valuenow={transScore.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Điểm minh bạch"
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    transScore.level === 'high' ? 'bg-emerald-500' :
                    transScore.level === 'medium' ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${transScore.score}%` }}
                />
              </div>
              <ul className="space-y-1">
                {transScore.checks.map(c => (
                  <li key={c.key} className={`flex items-start gap-1.5 text-[11px] ${c.ok ? 'text-slate-600' : 'text-slate-800 font-semibold'}`}>
                    {c.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-px shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-px shrink-0" />
                    )}
                    <span>
                      {c.label}
                      {!c.ok && <span className="font-normal text-slate-500"> · {c.hint}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Warnings */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Quét rủi ro lừa đảo trong nội dung tin</span>
              {risks.length === 0 ? (
                <p className="flex items-start gap-1.5 text-[11px] text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-px shrink-0" />
                  Chưa phát hiện dấu hiệu rủi ro trong chức danh, mô tả, yêu cầu và quyền lợi.
                </p>
              ) : (
                <ul className="space-y-2">
                  {risks.map((r, i) => (
                    <li
                      key={i}
                      className={`text-[11px] rounded-lg border p-2 ${
                        r.severity === 'block'
                          ? 'border-rose-300 bg-rose-50 text-rose-900'
                          : 'border-amber-300 bg-amber-50 text-amber-950'
                      }`}
                    >
                      <span className="font-bold">
                        {r.severity === 'block' ? 'Cần sửa' : 'Nên xem lại'} · {r.field}:
                      </span>{' '}
                      "{r.phrase}"
                      <span className="block font-normal mt-0.5">{r.advice}</span>
                    </li>
                  ))}
                </ul>
              )}
              <ErrorMessage id="safety" msg={errors.safety} />
              <p className="text-[10px] text-slate-400">
                Hệ thống chỉ gợi ý dựa trên từ khóa. Câu phủ định như "không thu phí đồng phục" không bị tính là lỗi.
              </p>
            </div>
          </div>
        </div>

        {/* 6. CAM KẾT PHÁP LÝ */}
        <div
          className="p-4 sm:p-5 rounded-2xl border space-y-3"
          style={{ backgroundColor: 'rgba(255, 210, 115, 0.15)', borderColor: '#FFD273' }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-900" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-950">
              5. Cam kết pháp lý & Tính minh bạch (Bắt buộc)
            </h3>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-slate-800">
              <input
                data-field="agreedNoFee"
                type="checkbox"
                checked={form.agreedNoFee}
                onChange={e => updateField('agreedNoFee', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-[#FFD273]"
              />
              <span>
                Doanh nghiệp chúng tôi cam kết tuyệt đối{' '}
                <strong className="text-rose-700">KHÔNG THU BẤT KỲ KHOẢN PHÍ NÀO CỦA ỨNG VIÊN</strong> dưới mọi hình thức (phí nộp hồ sơ, tiền cọc, phí đồng phục, phí đào tạo hay phí tài liệu).
              </span>
            </label>
            <ErrorMessage id="agreedNoFee" msg={errors.agreedNoFee} />

            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                data-field="agreedDirectRecruitment"
                type="checkbox"
                checked={form.agreedDirectRecruitment}
                onChange={e => updateField('agreedDirectRecruitment', e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-[#FFD273]"
              />
              <span>
                Cam kết là tin tuyển dụng trực tiếp của chính doanh nghiệp, không thông qua trung gian môi giới, chịu trách nhiệm hoàn toàn trước pháp luật về tính chính xác của thông tin tuyển dụng.
              </span>
            </label>
            <ErrorMessage id="agreedDirectRecruitment" msg={errors.agreedDirectRecruitment} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-3">
          <span className="text-[11px] text-slate-500">
            {draftNotice || 'Tin tuyển dụng sẽ được kiểm duyệt nhanh tự động và xuất bản trực tiếp ngay sau khi gửi.'}
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={saveDraft}
                className="px-5 py-3 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Lưu nháp</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-5 py-3 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Xem trước tin</span>
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-[#e6bd67]"
              style={{ backgroundColor: '#FFD273', color: '#3d2b02' }}
            >
              <Send className="w-4 h-4" />
              <span>{isEditing ? 'Lưu thay đổi' : 'Đăng tin tuyển dụng ngay'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* PREVIEW MODAL */}
      {previewJobData && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Xem trước tin tuyển dụng"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col">
            <div
              className="text-white p-5 sm:p-6 relative flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #1E293B 0%, #29384E 100%)',
                borderBottom: '2px solid #DEB5D7'
              }}
            >
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                aria-label="Đóng xem trước"
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/15 text-white">
                Xem trước theo góc nhìn ứng viên
              </span>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                  style={{
                    backgroundColor: '#FEE686',
                    color: '#1E293B',
                    borderColor: '#FFD273'
                  }}
                >
                  {previewJobData.industryName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                  {previewJobData.level}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {previewJobData.companyLogo && (
                  <img src={previewJobData.companyLogo} alt="" className="w-12 h-12 rounded-lg bg-white object-contain p-1" />
                )}
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight leading-snug break-words">
                    {previewJobData.title || 'Chưa có chức danh'}
                  </h2>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-rose-100">
                    <Building2 className="w-4 h-4 text-rose-200 shrink-0" />
                    <span className="font-semibold text-white">{previewJobData.companyName || 'Chưa có tên công ty'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {[
                  ['Mức lương', previewJobData.salaryText],
                  ['Số lượng tuyển', `${previewJobData.headcount} người`],
                  ['Học vấn', previewJobData.educationLevel],
                  ['Hạn nộp hồ sơ', previewJobData.deadline]
                ].map(([lbl, val]) => (
                  <div key={lbl}>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">{lbl}</span>
                    <span className="text-sm font-bold text-slate-800">{val}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Địa điểm làm việc</h3>
                <ul className="space-y-1.5">
                  {(previewJobData.locations || []).map((loc, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <span><strong>{loc.city}</strong>: {loc.address}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {((previewJobData.skills?.length ?? 0) > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {previewJobData.skills!.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {[
                ['Mô tả công việc', previewJobData.description],
                ['Yêu cầu ứng viên', previewJobData.requirements],
                ['Quyền lợi & Đãi ngộ', previewJobData.benefits]
              ].map(([t, arr]) => (
                <div key={t}>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{t}</h3>
                  <ul className="space-y-1.5">
                    {(arr as string[]).map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {previewJobData.companyDescription && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Về công ty</h4>
                  <p className="text-slate-700 whitespace-pre-line">{previewJobData.companyDescription}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  Điểm minh bạch {transScore.score}/100
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                  Cam kết phản hồi trong {previewJobData.responseSlaHours} giờ
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Đây là bản xem trước. Tin chưa được đăng. Phần xem trước chưa kiểm tra lỗi nhập liệu; lỗi sẽ được báo khi bấm đăng.
              </p>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Quay lại chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
