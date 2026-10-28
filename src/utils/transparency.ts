import { Job, ApplicationRecord } from '../types';

export interface TransparencyCheck {
  key: string;
  label: string;
  weight: number;
  ok: boolean;
  hint: string;
}

export interface TransparencyScore {
  score: number;
  level: 'high' | 'medium' | 'low';
  levelLabel: string;
  checks: TransparencyCheck[];
}

export const calcTransparencyScore = (job: Partial<Job>): TransparencyScore => {
  const hasSalaryNumber = /\d/.test(job.salaryText || '') || ((job.salaryMin || 0) > 0 && (job.salaryMax || 0) > 0);

  const checks: TransparencyCheck[] = [
    {
      key: 'mst',
      label: 'Doanh nghiệp đã xác minh mã số thuế',
      weight: 25,
      ok: !!job.isVerifiedCompany,
      hint: 'Cập nhật MST hợp lệ trong hồ sơ doanh nghiệp.'
    },
    {
      key: 'nofee',
      label: 'Cam kết không thu phí ứng viên',
      weight: 20,
      ok: !!job.directEmployerCommitment || !!job.isDirectHire || !!job.isVerifiedDirect,
      hint: 'Tích cam kết không thu phí khi đăng tin.'
    },
    {
      key: 'direct',
      label: 'Tuyển trực tiếp, không qua trung gian',
      weight: 15,
      ok: !!job.isVerifiedDirect || !!job.isDirectHire,
      hint: 'Tích cam kết tuyển trực tiếp khi đăng tin.'
    },
    {
      key: 'salary',
      label: 'Nêu rõ khoảng lương',
      weight: 10,
      ok: hasSalaryNumber,
      hint: 'Điền khoảng lương cụ thể thay vì thỏa thuận.'
    },
    {
      key: 'address',
      label: 'Có địa chỉ làm việc cụ thể',
      weight: 10,
      ok: !!(job.address && job.address.trim().length > 6) || !!(job.location && job.location.trim().length > 6),
      hint: 'Điền địa chỉ làm việc đầy đủ.'
    },
    {
      key: 'contact',
      label: 'Có email và số điện thoại liên hệ',
      weight: 10,
      ok: !!(job.contactEmail && job.contactPhone),
      hint: 'Điền email và số điện thoại nhận hồ sơ.'
    },
    {
      key: 'deadline',
      label: 'Có hạn nộp hồ sơ rõ ràng',
      weight: 5,
      ok: !!job.deadlineDate || !!(job.deadline && job.deadline.trim()),
      hint: 'Chọn ngày hết hạn nộp hồ sơ.'
    },
    {
      key: 'sla',
      label: 'Cam kết thời gian phản hồi hồ sơ',
      weight: 5,
      ok: !!job.responseSlaHours,
      hint: 'Chọn thời gian cam kết phản hồi.'
    }
  ];

  const totalScore = checks.reduce((sum, c) => sum + (c.ok ? c.weight : 0), 0);
  const level: 'high' | 'medium' | 'low' = totalScore >= 80 ? 'high' : totalScore >= 50 ? 'medium' : 'low';
  const levelLabel = level === 'high' ? 'Minh bạch cao' : level === 'medium' ? 'Minh bạch trung bình' : 'Cần bổ sung thông tin';

  return {
    score: totalScore,
    level,
    levelLabel,
    checks
  };
};

export interface RiskRule {
  re: RegExp;
  severity: 'block' | 'warn';
  advice: string;
}

export const RISK_RULES: RiskRule[] = [
  {
    re: /phí\s+(hồ sơ|đào tạo|đồng phục|tài liệu|giữ chỗ|môi giới|làm thẻ|ký quỹ|tuyển dụng|nhập học)/g,
    severity: 'block',
    advice: 'Tin không được yêu cầu ứng viên trả phí. Xóa nội dung này hoặc ghi rõ doanh nghiệp chịu chi phí.'
  },
  {
    re: /(đặt|nộp|đóng)\s+cọc|tiền\s+cọc|ký\s+quỹ/g,
    severity: 'block',
    advice: 'Không yêu cầu đặt cọc hay ký quỹ từ ứng viên.'
  },
  {
    re: /(chuyển khoản|nạp tiền|nộp tiền|ứng trước tiền|đóng tiền)/g,
    severity: 'block',
    advice: 'Không yêu cầu ứng viên chuyển hoặc nạp tiền dưới bất kỳ hình thức nào.'
  },
  {
    re: /việc\s+nhẹ\s+lương\s+cao|lương\s+khủng|thu\s+nhập\s+khủng/g,
    severity: 'warn',
    advice: 'Cụm từ phóng đại dễ bị nhầm với tin lừa đảo. Mô tả mức lương và công việc cụ thể hơn.'
  },
  {
    re: /không\s+cần\s+(phỏng vấn|bằng cấp|kinh nghiệm gì)/g,
    severity: 'warn',
    advice: 'Nên nêu rõ quy trình tuyển chọn để ứng viên yên tâm.'
  },
  {
    re: /(làm\s+nhiệm\s+vụ|nhận\s+tiền\s+ngay|nhận\s+lương\s+ngay\s+trong\s+ngày|hoa\s+hồng\s+(cao|khủng)|cộng\s+tác\s+viên\s+online)/g,
    severity: 'warn',
    advice: 'Mô hình này hay bị lợi dụng để lừa đảo. Cân nhắc diễn đạt rõ bản chất công việc.'
  },
  {
    re: /(telegram|nhắn\s+tin\s+riêng|liên\s+hệ\s+qua\s+inbox)/g,
    severity: 'warn',
    advice: 'Nên dùng email và số điện thoại doanh nghiệp đã khai báo để ứng viên kiểm chứng.'
  },
  {
    re: /đầu\s+tư|góp\s+vốn/g,
    severity: 'warn',
    advice: 'Tin tuyển dụng không nên kêu gọi đầu tư hay góp vốn.'
  }
];

const NEGATIVE_PREFIX_RE = /(không|miễn|chẳng|tuyệt đối không|0\s?đ|không bao giờ|không thu)[^.;\n]{0,25}$/i;

export interface DetectedRisk {
  severity: 'block' | 'warn';
  field: string;
  phrase: string;
  advice: string;
}

export const detectRisks = (fields: { field: string; text: string }[]): DetectedRisk[] => {
  const detected: DetectedRisk[] = [];

  for (const { field, text } of fields) {
    const lower = (text || '').toLowerCase();
    if (!lower.trim()) continue;

    for (const rule of RISK_RULES) {
      rule.re.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = rule.re.exec(lower)) !== null) {
        const preceding = lower.slice(Math.max(0, match.index - 35), match.index);
        if (rule.severity === 'block' && NEGATIVE_PREFIX_RE.test(preceding)) {
          continue;
        }

        detected.push({
          severity: rule.severity,
          field,
          phrase: text.slice(match.index, match.index + match[0].length),
          advice: rule.advice
        });
      }
    }
  }

  const seen = new Set<string>();
  return detected.filter(d => {
    const key = `${d.field}|${d.phrase.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const DEFAULT_SLA_HOURS = 48;

export interface SlaInfo {
  state: 'responded' | 'unknown' | 'overdue' | 'due-soon' | 'ok';
  slaHours: number;
  hoursLeft: number | null;
  label: string;
}

export const calcSlaInfo = (app: ApplicationRecord, jobs: Job[], now = Date.now()): SlaInfo => {
  const job = jobs.find(j => j.id === app.jobId);
  const slaHours = job?.responseSlaHours || DEFAULT_SLA_HOURS;

  if (app.status !== 'Đã gửi hồ sơ') {
    return { state: 'responded', slaHours, hoursLeft: null, label: 'Đã phản hồi' };
  }

  if (!app.appliedAt) {
    return { state: 'unknown', slaHours, hoursLeft: null, label: `Cam kết phản hồi trong ${slaHours} giờ` };
  }

  const deadlineMs = new Date(app.appliedAt).getTime() + slaHours * 36e5;
  const hoursLeft = Math.round((deadlineMs - now) / 36e5);

  if (hoursLeft < 0) {
    return { state: 'overdue', slaHours, hoursLeft, label: `Quá hạn ${Math.abs(hoursLeft)} giờ` };
  }
  if (hoursLeft <= 12) {
    return { state: 'due-soon', slaHours, hoursLeft, label: `Còn ${hoursLeft} giờ` };
  }
  return { state: 'ok', slaHours, hoursLeft, label: `Còn ${hoursLeft} giờ` };
};

export const formatIsoDate = (d = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const formatDisplayDate = (isoStr?: string): string => {
  if (!isoStr) return '30 ngày tới';
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoStr;
};

export const isJobOpen = (job: Job, todayStr = formatIsoDate()): boolean => {
  if (job.status === 'closed' || job.status === 'pending' || job.status === 'rejected' || job.status === 'draft') {
    return false;
  }
  if (job.deadlineDate && job.deadlineDate < todayStr) {
    return false;
  }
  return true;
};

export const daysUntilDeadline = (deadlineDate?: string, todayStr = formatIsoDate()): number | null => {
  if (!deadlineDate) return null;
  const diffMs = Date.parse(deadlineDate) - Date.parse(todayStr);
  return Math.round(diffMs / 864e5);
};

export interface EmployerMetrics {
  pendingReply: ApplicationRecord[];
  overdueApps: ApplicationRecord[];
  needAttention: { app: ApplicationRecord; info: SlaInfo }[];
  rejectedJobs: Job[];
  expiringJobs: Job[];
  pendingJobs: Job[];
  draftJobs: Job[];
  jobAttentionCount: number;
  onTime30: { done: number; total: number; pct: number | null };
  newApps7: number;
}

export const calcEmployerMetrics = (
  apps: ApplicationRecord[],
  jobs: Job[],
  now = Date.now()
): EmployerMetrics => {
  const enriched = apps.map(app => ({ app, info: calcSlaInfo(app, jobs, now) }));
  const pendingReply = apps.filter(a => a.status === 'Đã gửi hồ sơ');
  const needAttention = enriched
    .filter(e => e.app.status === 'Đã gửi hồ sơ' && (e.info.state === 'overdue' || e.info.state === 'due-soon'))
    .sort((a, b) => (a.info.hoursLeft ?? 0) - (b.info.hoursLeft ?? 0));
  const overdueApps = needAttention.filter(e => e.info.state === 'overdue').map(e => e.app);

  const rejectedJobs = jobs.filter(j => j.status === 'rejected');
  const expiringJobs = jobs.filter(j => {
    if (j.status === 'closed' || j.status === 'pending' || j.status === 'rejected' || j.status === 'draft') return false;
    const days = daysUntilDeadline(j.deadlineDate);
    return days !== null && days >= 0 && days <= 7;
  });
  const pendingJobs = jobs.filter(j => j.status === 'pending');
  const draftJobs = jobs.filter(j => j.status === 'draft');

  const thirtyDaysAgo = now - 30 * 864e5;
  let onTimeDone = 0;
  let onTimeTotal = 0;

  enriched.forEach(({ app, info }) => {
    if (!app.appliedAt) return;
    const appTime = new Date(app.appliedAt).getTime();
    if (appTime < thirtyDaysAgo) return;

    if (app.status === 'Đã gửi hồ sơ') {
      if (info.state === 'overdue') onTimeTotal += 1;
    } else if (app.statusUpdatedAt) {
      onTimeTotal += 1;
      const resTime = new Date(app.statusUpdatedAt).getTime() - appTime;
      if (resTime <= info.slaHours * 36e5) {
        onTimeDone += 1;
      }
    }
  });

  const sevenDaysAgo = now - 7 * 864e5;
  const newApps7 = apps.filter(a => a.appliedAt && new Date(a.appliedAt).getTime() >= sevenDaysAgo).length;

  return {
    pendingReply,
    overdueApps,
    needAttention,
    rejectedJobs,
    expiringJobs,
    pendingJobs,
    draftJobs,
    jobAttentionCount: rejectedJobs.length + expiringJobs.length,
    onTime30: {
      done: onTimeDone,
      total: onTimeTotal,
      pct: onTimeTotal > 0 ? Math.round((onTimeDone / onTimeTotal) * 100) : null
    },
    newApps7
  };
};
