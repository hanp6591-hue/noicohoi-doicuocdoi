import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Job, Industry, ApplicationRecord, EmployerProfile, ApplicationStatus, RecruitmentReview } from '../types';
import { EmployerPostJob } from './EmployerPostJob';
import { 
  calcTransparencyScore, 
  calcSlaInfo, 
  calcEmployerMetrics,
  daysUntilDeadline,
  formatIsoDate,
  isJobOpen,
  SlaInfo 
} from '../utils/transparency';

const formatDisplayDate = (isoStr?: string): string => {
  if (!isoStr) return '';
  const parts = isoStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoStr;
};
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
  Bell, 
  ExternalLink, 
  Check, 
  Clock, 
  Search,
  PlusCircle,
  Calendar,
  MessageSquare,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Eye,
  Pencil,
  Copy,
  Lock,
  LockOpen,
  CalendarPlus,
  Rocket,
  CircleX,
  CircleAlert,
  FolderGit2,
  StickyNote,
  BadgeCheck,
  CheckCheck
} from 'lucide-react';

const REJECT_REASONS = [
  {
    code: 'skill',
    label: 'Kỹ năng chưa khớp vị trí',
    feedback: 'Cảm ơn bạn đã quan tâm. Ở thời điểm này kỹ năng của bạn chưa khớp với yêu cầu chính của vị trí. Bạn có thể bổ sung thêm dự án thực tế và ứng tuyển lại khi có tin phù hợp.'
  },
  {
    code: 'experience',
    label: 'Cần thêm kinh nghiệm thực tế',
    feedback: 'Cảm ơn bạn đã ứng tuyển. Vị trí này đang cần người có thêm kinh nghiệm thực tế. Bạn hãy tiếp tục tích lũy dự án và thử lại với các vị trí dành cho người mới.'
  },
  {
    code: 'filled',
    label: 'Vị trí đã đủ người',
    feedback: 'Cảm ơn bạn đã ứng tuyển. Vị trí này đã tuyển đủ người. Hồ sơ của bạn không có vấn đề gì, mong bạn tiếp tục theo dõi các tin tuyển dụng khác của chúng tôi.'
  },
  {
    code: 'other',
    label: 'Lý do khác',
    feedback: 'Cảm ơn bạn đã dành thời gian ứng tuyển. Sau khi cân nhắc, chúng tôi chưa thể tiến hành tiếp với hồ sơ của bạn lần này. Chúc bạn sớm tìm được công việc phù hợp.'
  }
];

const ALL_STATUSES: ApplicationStatus[] = [
  'Đã gửi hồ sơ',
  'Doanh nghiệp đã xem',
  'Mời phỏng vấn',
  'Đang xem xét',
  'Đã tuyển',
  'Không phù hợp'
];

const TERMINAL_STATUSES: ApplicationStatus[] = ['Đã tuyển', 'Không phù hợp'];

const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  'Đã gửi hồ sơ': 'bg-amber-100 text-amber-800 border-amber-300',
  'Doanh nghiệp đã xem': 'bg-sky-100 text-sky-800 border-sky-300',
  'Mời phỏng vấn': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  'Đang xem xét': 'bg-violet-100 text-violet-800 border-violet-300',
  'Đã tuyển': 'bg-green-600 text-white border-green-700',
  'Không phù hợp': 'bg-slate-200 text-slate-700 border-slate-300'
};

// ==========================================
// 1. APPLICATION MANAGEMENT COMPONENT (V0)
// ==========================================
interface ApplicationManagementProps {
  applications: ApplicationRecord[];
  jobs: Job[];
  onUpdateStatus: (
    appId: string, 
    status: ApplicationStatus, 
    meta?: { rejectReason?: string; feedbackMessage?: string }
  ) => void;
  onSaveNote: (appId: string, notes: string) => void;
  embedded?: boolean;
}

export const ApplicationManagement: React.FC<ApplicationManagementProps> = ({
  applications,
  jobs,
  onUpdateStatus,
  onSaveNote,
  embedded = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [sortMode, setSortMode] = useState<'priority' | 'newest'>('priority');
  const [filterNeedAttentionOnly, setFilterNeedAttentionOnly] = useState(false);

  const [confirmTerminal, setConfirmTerminal] = useState<{ id: string; status: ApplicationStatus } | null>(null);
  const [selectedRejectCode, setSelectedRejectCode] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState(false);

  const [openNoteId, setOpenNoteId] = useState<Record<string, boolean>>({});
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({});

  const slaMap = useMemo(() => {
    const now = Date.now();
    const map = new Map<string, SlaInfo>();
    applications.forEach(app => {
      map.set(app.id, calcSlaInfo(app, jobs, now));
    });
    return map;
  }, [applications, jobs]);

  const getPriorityWeight = (app: ApplicationRecord): number => {
    if (TERMINAL_STATUSES.includes(app.status)) return 5;
    const sla = slaMap.get(app.id)?.state;
    if (sla === 'overdue') return 0;
    if (sla === 'due-soon') return 1;
    if (sla === 'ok') return 2;
    if (sla === 'unknown') return 3;
    return 4;
  };

  const getAppTime = (app: ApplicationRecord) =>
    app.appliedAt ? new Date(app.appliedAt).getTime() : 0;

  const filteredApps = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = [
      ...applications.filter(app => {
        if (statusFilter !== 'all' && app.status !== statusFilter) return false;
        if (jobFilter !== 'all' && app.jobId !== jobFilter) return false;
        if (filterNeedAttentionOnly) {
          const s = slaMap.get(app.id)?.state;
          if (s !== 'overdue' && s !== 'due-soon') return false;
        }
        if (!q) return true;
        return (
          app.candidateName.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q) ||
          app.candidateEmail.toLowerCase().includes(q)
        );
      })
    ];

    if (sortMode === 'priority') {
      list.sort((a, b) => {
        const diff = getPriorityWeight(a) - getPriorityWeight(b);
        if (diff !== 0) return diff;
        const leftA = slaMap.get(a.id)?.hoursLeft ?? 9999;
        const leftB = slaMap.get(b.id)?.hoursLeft ?? 9999;
        if (leftA !== leftB) return leftA - leftB;
        return getAppTime(b) - getAppTime(a);
      });
    } else {
      list.sort((a, b) => getAppTime(b) - getAppTime(a));
    }

    return list;
  }, [applications, searchTerm, statusFilter, jobFilter, sortMode, filterNeedAttentionOnly, slaMap]);

  const appsPerJob = useMemo(() => {
    const counts = new Map<string, number>();
    applications.forEach(a => counts.set(a.jobId, (counts.get(a.jobId) || 0) + 1));
    return counts;
  }, [applications]);

  const needAttentionCount = applications.filter(a => {
    const s = slaMap.get(a.id)?.state;
    return s === 'overdue' || s === 'due-soon';
  }).length;

  const handleSelectStatus = (app: ApplicationRecord, newStatus: ApplicationStatus) => {
    if (newStatus === app.status) return;

    if (TERMINAL_STATUSES.includes(newStatus)) {
      setConfirmTerminal({ id: app.id, status: newStatus });
      setSelectedRejectCode('');
      setRejectReasonError(false);
      return;
    }

    setConfirmTerminal(null);
    onUpdateStatus(app.id, newStatus);
  };

  const handleConfirmTerminal = () => {
    if (!confirmTerminal) return;
    if (confirmTerminal.status === 'Không phù hợp') {
      const preset = REJECT_REASONS.find(r => r.code === selectedRejectCode);
      if (!preset) {
        setRejectReasonError(true);
        return;
      }
      onUpdateStatus(confirmTerminal.id, 'Không phù hợp', {
        rejectReason: preset.label,
        feedbackMessage: preset.feedback
      });
    } else {
      onUpdateStatus(confirmTerminal.id, confirmTerminal.status);
    }
    setConfirmTerminal(null);
  };

  const selectedRejectPreset = REJECT_REASONS.find(r => r.code === selectedRejectCode);

  return (
    <div className={embedded ? 'space-y-4' : 'bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-6'}>
      <div className={`space-y-4 ${embedded ? '' : 'border-b border-slate-100 pb-4'}`}>
        {!embedded && (
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-700" />
              Hồ sơ ứng viên ({applications.length})
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Hồ sơ nộp vào các tin của doanh nghiệp. Dự án và portfolio hiển thị trước. Mặc định hồ sơ sắp hoặc đã quá hạn cam kết phản hồi được đưa lên đầu.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              aria-label="Tìm ứng viên"
              placeholder="Tìm ứng viên, vị trí, email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white w-56"
            />
          </div>

          {!embedded && (
            <select
              aria-label="Lọc theo tin đăng"
              value={jobFilter}
              onChange={e => setJobFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold max-w-[260px]"
            >
              <option value="all">Tất cả tin đăng</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({appsPerJob.get(j.id) || 0})
                </option>
              ))}
            </select>
          )}

          <select
            aria-label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
          >
            <option value="all">Tất cả trạng thái</option>
            {ALL_STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            aria-label="Sắp xếp"
            value={sortMode}
            onChange={e => setSortMode(e.target.value as 'priority' | 'newest')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
          >
            <option value="priority">Sắp xếp: Cần xử lý trước</option>
            <option value="newest">Sắp xếp: Mới nộp nhất</option>
          </select>

          <button
            type="button"
            aria-pressed={filterNeedAttentionOnly}
            onClick={() => setFilterNeedAttentionOnly(v => !v)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-colors ${
              filterNeedAttentionOnly
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
            }`}
          >
            Chỉ hiện hồ sơ cần xử lý ({needAttentionCount})
          </button>
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div
            className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 210, 115, 0.25)' }}
          >
            <Users className="w-8 h-8 text-amber-800" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            {applications.length === 0 ? 'Chưa có hồ sơ nào nộp vào tin của bạn' : 'Không có hồ sơ nào phù hợp bộ lọc'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {applications.length === 0
              ? 'Hồ sơ ứng viên nộp qua nền tảng sẽ xuất hiện tại đây.'
              : 'Thử bỏ bớt bộ lọc hoặc đổi từ khóa tìm kiếm.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => {
            const sla = slaMap.get(app.id);
            const isTerminal = TERMINAL_STATUSES.includes(app.status);
            const isConfirming = confirmTerminal?.id === app.id ? confirmTerminal : null;
            const isOpenNote = !!openNoteId[app.id];
            const currentNote = draftNotes[app.id] ?? app.notes ?? '';
            const isDirtyNote = currentNote !== (app.notes ?? '');

            return (
              <div
                key={app.id}
                className={`p-4 sm:p-5 rounded-2xl border bg-white transition-all shadow-xs space-y-3 ${
                  isTerminal
                    ? 'border-slate-200 opacity-90'
                    : 'border-slate-200 hover:border-[#DEB5D7] hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-black text-slate-900">{app.candidateName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${STATUS_CLASSES[app.status]}`}>
                        ● {app.status}
                      </span>
                      {sla && sla.state !== 'responded' && sla.state !== 'unknown' && !isTerminal && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            sla.state === 'overdue'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : sla.state === 'due-soon'
                              ? 'bg-amber-50 text-amber-900 border-amber-200'
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {sla.label}
                        </span>
                      )}
                      {app.notes && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200">
                          Có ghi chú
                        </span>
                      )}
                    </div>
                    {!embedded && (
                      <div className="text-xs text-purple-900 font-bold flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">Vị trí ứng tuyển: {app.jobTitle}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500">Ngày nộp: {app.appliedDate}</div>
                  </div>

                  {/* Actions / status update */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isTerminal ? (
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(app.id, 'Đang xem xét')}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Mở lại hồ sơ
                      </button>
                    ) : (
                      <>
                        <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">Cập nhật:</span>
                        <select
                          aria-label={`Trạng thái hồ sơ ${app.candidateName}`}
                          value={app.status}
                          onChange={e => handleSelectStatus(app, e.target.value as ApplicationStatus)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-slate-50 cursor-pointer"
                        >
                          {ALL_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>

                {/* Confirm dialog for terminal status */}
                {isConfirming && (
                  <div
                    role="group"
                    aria-label="Xác nhận trạng thái cuối"
                    className={`p-3 rounded-xl border space-y-2.5 ${
                      isConfirming.status === 'Đã tuyển' ? 'border-green-200 bg-green-50' : 'border-slate-300 bg-slate-50'
                    }`}
                  >
                    {isConfirming.status === 'Đã tuyển' ? (
                      <p className="text-xs font-bold text-green-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Xác nhận chuyển {app.candidateName} sang "Đã tuyển"?
                      </p>
                    ) : (
                      <>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CircleX className="w-4 h-4" /> Chuyển {app.candidateName} sang "Không phù hợp". Chọn lý do để gửi phản hồi lịch sự tới ứng viên:
                        </p>
                        <select
                          aria-label="Lý do không phù hợp"
                          value={selectedRejectCode}
                          onChange={e => {
                            setSelectedRejectCode(e.target.value);
                            setRejectReasonError(false);
                          }}
                          aria-invalid={rejectReasonError}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold bg-white cursor-pointer w-full sm:w-auto ${
                            rejectReasonError ? 'border-rose-400' : 'border-slate-300'
                          }`}
                        >
                          <option value="">Chọn lý do...</option>
                          {REJECT_REASONS.map(r => (
                            <option key={r.code} value={r.code}>{r.label}</option>
                          ))}
                        </select>
                        {rejectReasonError && (
                          <p role="alert" className="text-[11px] font-semibold text-rose-600">
                            Cần chọn lý do trước khi xác nhận.
                          </p>
                        )}
                        {selectedRejectPreset && (
                          <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700">
                            <span className="font-bold block mb-0.5">Câu phản hồi dành cho ứng viên:</span>
                            <p className="italic leading-relaxed">{selectedRejectPreset.feedback}</p>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmTerminal}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold cursor-pointer hover:bg-slate-700"
                      >
                        Xác nhận
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmTerminal(null)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {/* Show reject reason if rejected */}
                {app.status === 'Không phù hợp' && app.rejectReason && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-800">Lý do: {app.rejectReason}</span>
                    {app.feedbackMessage && (
                      <p className="italic leading-relaxed mt-1 text-slate-600">
                        Phản hồi dành cho ứng viên: {app.feedbackMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* Candidate Projects & Portfolio */}
                {((app.projects && app.projects.length > 0) || app.portfolioUrl) && (
                  <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-slate-700 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-black text-slate-900 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-purple-700" />
                        {app.projects && app.projects.length > 0
                          ? `Dự án / sản phẩm nổi bật (${app.projects.length})`
                          : 'Portfolio'}
                      </span>
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-purple-800 hover:underline flex items-center gap-1"
                        >
                          Xem portfolio <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    {app.projects?.map((proj, idx) => (
                      <div key={idx} className="border-t border-purple-100 pt-2 first:border-t-0 first:pt-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-900">{proj.name}</span>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 font-bold text-purple-800 hover:underline"
                            >
                              Xem dự án <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {proj.note && <p className="leading-relaxed text-slate-600 mt-0.5">{proj.note}</p>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Cover note */}
                {app.coverNote && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-slate-800 block mb-0.5">Thư giới thiệu từ ứng viên:</span>
                    <p className="italic leading-relaxed">{app.coverNote}</p>
                  </div>
                )}

                {/* Contact Links */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs">
                  <a href={`mailto:${app.candidateEmail}`} className="flex items-center gap-1.5 text-slate-700 hover:underline font-semibold">
                    <Mail className="w-3.5 h-3.5 text-rose-500 shrink-0" /> {app.candidateEmail}
                  </a>
                  <a href={`tel:${app.candidatePhone}`} className="flex items-center gap-1.5 text-slate-700 hover:underline font-semibold">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {app.candidatePhone} (Gọi / Zalo)
                  </a>
                </div>

                {/* Internal Note */}
                <div className="border-t border-slate-100 pt-2.5">
                  <button
                    type="button"
                    aria-expanded={isOpenNote}
                    onClick={() => setOpenNoteId(p => ({ ...p, [app.id]: !p[app.id] }))}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
                  >
                    <StickyNote className="w-3.5 h-3.5 text-yellow-600" />
                    Ghi chú nội bộ
                    {isOpenNote ? <Clock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  </button>

                  {isOpenNote && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        aria-label={`Ghi chú nội bộ cho ${app.candidateName}`}
                        rows={3}
                        maxLength={2000}
                        value={currentNote}
                        onChange={e => setDraftNotes(p => ({ ...p, [app.id]: e.target.value }))}
                        placeholder="Ví dụ: Portfolio tốt, cần hỏi thêm về đồ án React. Hẹn phỏng vấn thứ Sáu."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-yellow-50/40 focus:bg-white resize-y"
                      />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">
                          Chỉ nhà tuyển dụng thấy. Ứng viên không xem được. {currentNote.length}/2000
                        </span>
                        <button
                          type="button"
                          disabled={!isDirtyNote}
                          onClick={() => {
                            onSaveNote(app.id, currentNote.trim());
                            setDraftNotes(p => {
                              const next = { ...p };
                              delete next[app.id];
                              return next;
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold cursor-pointer hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Lưu ghi chú
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. EMPLOYER VIEW COMPONENT (Nv)
// ==========================================
interface EmployerViewProps {
  industries: Industry[];
  onAddNewJob: (job: Job) => void;
  onUpdateJob: (job: Job) => void;
  applications: ApplicationRecord[];
  onUpdateApplicationStatus: (
    appId: string, 
    status: ApplicationStatus, 
    meta?: { rejectReason?: string; feedbackMessage?: string }
  ) => void;
  onSaveApplicationNote: (appId: string, notes: string) => void;
  employerId: string;
  onApproveJob: (jobId: string) => void;
  onRejectJob: (jobId: string) => void;
  employerProfile: EmployerProfile;
  onUpdateEmployerProfile: (profile: EmployerProfile) => void;
  jobs: Job[];
  externalActiveTab?: string;
  onSyncActiveTab?: (tab: string) => void;
  onOpenRoleModal?: () => void;
  reviews?: RecruitmentReview[];
  onOpenTool?: (toolId: string) => void;
  onPreviewJob?: (job: Job) => void;
  onOpenCompanyProfile?: () => void;
}

export const EmployerView: React.FC<EmployerViewProps> = ({
  industries,
  onAddNewJob,
  onUpdateJob,
  applications,
  onUpdateApplicationStatus,
  onSaveApplicationNote,
  employerId,
  onApproveJob,
  onRejectJob,
  employerProfile,
  onUpdateEmployerProfile,
  jobs,
  externalActiveTab,
  onSyncActiveTab,
  onOpenRoleModal,
  reviews = [],
  onOpenTool,
  onPreviewJob,
  onOpenCompanyProfile
}) => {
  const getSubTabFromExternal = () => {
    const raw = (externalActiveTab || '').replace('employer-', '');
    if (raw === 'candidates' || raw === 'my-jobs' || raw === 'post') return raw;
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'post' | 'candidates' | 'my-jobs'>(getSubTabFromExternal);
  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    onSyncActiveTab?.(`employer-${activeTab}`);
  }, [activeTab]);

  useEffect(() => {
    if (!externalActiveTab) return;
    if (externalActiveTab === 'employer-post') {
      if (activeTabRef.current !== 'post') {
        clearFormState();
        setActiveTab('post');
      }
    } else if (externalActiveTab === 'employer-candidates') {
      setActiveTab('candidates');
    } else if (externalActiveTab === 'employer-my-jobs') {
      setActiveTab('my-jobs');
    } else if (externalActiveTab === 'employer-overview') {
      setActiveTab('overview');
    }
  }, [externalActiveTab]);

  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [cloningJob, setCloningJob] = useState<Job | null>(null);
  const [draftingJobId, setDraftingJobId] = useState<string | null>(null);

  function clearFormState() {
    setEditingJob(null);
    setCloningJob(null);
  }

  const [postNotice, setPostNotice] = useState('');
  const [closingJobId, setClosingJobId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [titleSearch, setTitleSearch] = useState('');
  const [sortJobsBy, setSortJobsBy] = useState('newest');
  const [viewJobModalId, setViewJobModalId] = useState<string | null>(null);

  useEffect(() => {
    if (!viewJobModalId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setViewJobModalId(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewJobModalId]);

  const companyName = employerProfile.companyName || '';
  const todayStr = formatIsoDate();

  const getSnapshotSignature = (j: Job) =>
    JSON.stringify([
      j.title,
      j.companyName,
      j.companyDescription,
      j.description,
      j.requirements,
      j.benefits,
      j.salaryText
    ]);

  const handlePostSubmit = (jobData: Job, updatedProfile?: Partial<EmployerProfile>) => {
    const isEdit = !!editingJob;
    let notice = '';

    if (isEdit && editingJob && editingJob.status === 'draft') {
      onUpdateJob({ ...jobData, ownerId: editingJob.ownerId || employerId, status: 'draft' });
      notice = 'Đã lưu bản nháp. Bấm "Gửi duyệt" ở mục Quản lý tin đăng khi bạn sẵn sàng.';
    } else if (isEdit && editingJob && editingJob.status === 'rejected') {
      onUpdateJob({ ...jobData, ownerId: editingJob.ownerId || employerId, status: 'pending', moderationNote: undefined });
      notice = 'Đã gửi lại tin để duyệt. Tin quay về trạng thái chờ duyệt.';
    } else if (isEdit && editingJob) {
      const contentChanged = getSnapshotSignature(jobData) !== getSnapshotSignature(editingJob) && editingJob.status !== 'closed';
      onUpdateJob({
        ...jobData,
        ownerId: editingJob.ownerId || employerId,
        status: contentChanged ? 'pending' : editingJob.status
      });
      notice = contentChanged
        ? 'Đã lưu thay đổi. Vì nội dung tin có thay đổi, tin quay về trạng thái chờ duyệt và tạm ẩn với ứng viên cho đến khi được duyệt lại.'
        : 'Đã lưu thay đổi tin tuyển dụng.';
    } else {
      onAddNewJob({
        ...jobData,
        ownerId: employerId,
        status: 'pending'
      });
      notice = 'Đã gửi tin tuyển dụng. Tin sẽ hiển thị với ứng viên sau khi được duyệt. Bạn theo dõi trạng thái ở mục "Quản lý tin đăng".';
    }

    onUpdateEmployerProfile({ ...employerProfile, ...updatedProfile });
    setPostNotice(notice);
    setTimeout(() => {
      setPostNotice('');
      clearFormState();
      setActiveTab('my-jobs');
    }, 2200);
  };

  const getJobDisplayStatus = (job: Job): 'open' | 'closed' | 'pending' | 'rejected' | 'draft' | 'expired' => {
    if (job.status === 'closed') return 'closed';
    if (job.status === 'draft') return 'draft';
    if (job.status === 'pending') return 'pending';
    if (job.status === 'rejected') return 'rejected';
    if (job.deadlineDate && job.deadlineDate < todayStr) return 'expired';
    return 'open';
  };

  const extendDeadlineIso = (currentDeadline?: string, days = 30): string => {
    const base = currentDeadline && currentDeadline > todayStr ? new Date(currentDeadline) : new Date(todayStr);
    base.setDate(base.getDate() + days);
    return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, '0')}-${String(base.getDate()).padStart(2, '0')}`;
  };

  const handleExtendJob = (job: Job) => {
    const nextDate = extendDeadlineIso(job.deadlineDate, 30);
    onUpdateJob({
      ...job,
      deadlineDate: nextDate,
      deadline: formatDisplayDate(nextDate),
      status: 'open'
    });
  };

  const handleCloseJob = (job: Job) => {
    onUpdateJob({ ...job, status: 'closed' });
    setClosingJobId(null);
  };

  const handleReopenJob = (job: Job) => {
    const nextDate = job.deadlineDate && job.deadlineDate >= todayStr ? job.deadlineDate : extendDeadlineIso(undefined, 30);
    onUpdateJob({ ...job, status: 'open', deadlineDate: nextDate, deadline: formatDisplayDate(nextDate) });
  };

  const myJobs = jobs.filter(j => j.ownerId === employerId);
  const openCount = myJobs.filter(j => getJobDisplayStatus(j) === 'open').length;

  const enrichedApps = applications.map(app => ({ app, info: calcSlaInfo(app, jobs) }));
  const unrepliedApps = enrichedApps.filter(e => e.info.state !== 'responded');

  const getSlaForApp = (appId: string) => enrichedApps.find(e => e.app.id === appId)?.info;

  const handleCloneJob = (job: Job) => {
    const newDeadline = extendDeadlineIso(undefined, 30);
    setEditingJob(null);
    setCloningJob({ ...job, status: undefined, moderationNote: undefined, deadlineDate: newDeadline, deadline: formatDisplayDate(newDeadline) });
    setActiveTab('post');
  };

  const handleDraftJob = (job: Job) => {
    onUpdateJob({ ...job, status: 'draft' });
    setDraftingJobId(null);
  };

  const handlePublishJob = (job: Job) => {
    onUpdateJob({ ...job, status: 'pending' });
  };

  const getJobMetrics = (job: Job) => {
    const jobApps = applications.filter(a => a.jobId === job.id);
    const unreplied = jobApps.filter(a => a.status === 'Đã gửi hồ sơ');
    const overdue = unreplied.filter(a => getSlaForApp(a.id)?.state === 'overdue').length;
    return { total: jobApps.length, unreplied: unreplied.length, overdue };
  };

  const statusCounts = myJobs.reduce(
    (acc, job) => {
      acc[getJobDisplayStatus(job)] += 1;
      return acc;
    },
    { draft: 0, pending: 0, rejected: 0, open: 0, expired: 0, closed: 0 }
  );

  const filteredJobs = (() => {
    const q = titleSearch.trim().toLowerCase();
    const list = myJobs.filter(job => {
      const s = getJobDisplayStatus(job);
      if (statusFilter !== 'all' && s !== statusFilter) return false;
      if (q && !job.title.toLowerCase().includes(q)) return false;
      return true;
    });

    if (sortJobsBy === 'deadline') {
      list.sort((a, b) => (a.deadlineDate || '9999').localeCompare(b.deadlineDate || '9999'));
    } else if (sortJobsBy === 'cv') {
      list.sort((a, b) => getJobMetrics(b).total - getJobMetrics(a).total);
    } else if (sortJobsBy === 'unreplied') {
      list.sort((a, b) => getJobMetrics(b).unreplied - getJobMetrics(a).unreplied);
    }
    return list;
  })();

  const filterTabs = [
    { key: 'all', label: 'Tất cả', count: myJobs.length },
    { key: 'draft', label: 'Nháp', count: statusCounts.draft },
    { key: 'pending', label: 'Chờ duyệt', count: statusCounts.pending },
    { key: 'open', label: 'Đang mở', count: statusCounts.open },
    { key: 'expired', label: 'Hết hạn', count: statusCounts.expired },
    { key: 'closed', label: 'Đã đóng', count: statusCounts.closed },
    { key: 'rejected', label: 'Bị từ chối duyệt', count: statusCounts.rejected }
  ];

  const metrics = calcEmployerMetrics(applications, myJobs);
  const contactShort = (employerProfile.contactName || '').split('(')[0].trim();

  const handleGoToMyJobsWithFilter = (status: string, sort = 'newest') => {
    setStatusFilter(status);
    setSortJobsBy(sort);
    setActiveTab('my-jobs');
  };

  const handleEditJob = (job: Job) => {
    setCloningJob(null);
    setEditingJob(job);
    setActiveTab('post');
  };

  const getRemainingDaysLabel = (job: Job) => {
    const days = daysUntilDeadline(job.deadlineDate);
    if (days === null) return '';
    if (days <= 0) return 'hết hạn hôm nay';
    return `còn ${days} ngày`;
  };

  const expiredUnrepliedJobs = myJobs.filter(j => getJobDisplayStatus(j) === 'expired');
  const lowTransJobs = myJobs.filter(j => ['open', 'pending', 'draft'].includes(getJobDisplayStatus(j)) && calcTransparencyScore(j).score < 70);

  const profileChecks = [
    { label: 'tên công ty', ok: !!employerProfile.companyName?.trim() },
    { label: 'mã số thuế', ok: !!employerProfile.taxCode?.trim() },
    { label: 'người phụ trách', ok: !!employerProfile.contactName?.trim() },
    { label: 'email', ok: !!employerProfile.contactEmail?.trim() },
    { label: 'số điện thoại', ok: !!employerProfile.contactPhone?.trim() },
    { label: 'địa chỉ', ok: !!employerProfile.address?.trim() },
    { label: 'tỉnh/thành', ok: !!employerProfile.city?.trim() },
    { label: 'xác minh doanh nghiệp', ok: !!employerProfile.isVerified }
  ];
  const profileScore = Math.round((profileChecks.filter(c => c.ok).length / profileChecks.length) * 100);
  const missingProfileFields = profileChecks.filter(c => !c.ok).map(c => c.label);

  const isBrandNewEmployer = myJobs.length === 0 && applications.length === 0;

  const toneClass = {
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    warn: 'bg-amber-50 text-amber-900 border-amber-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200'
  };

  const attentionGroups = [
    {
      key: 'apps',
      n: metrics.needAttention.length,
      text: metrics.overdueApps.length > 0
        ? `hồ sơ quá hạn hoặc sắp quá hạn trả lời (${metrics.overdueApps.length} đã quá hạn)`
        : 'hồ sơ sắp quá hạn trả lời',
      tone: metrics.overdueApps.length > 0 ? ('danger' as const) : ('warn' as const),
      viewAll: () => setActiveTab('candidates'),
      items: metrics.needAttention.slice(0, 3).map(({ app, info }) => ({
        key: app.id,
        title: app.candidateName,
        sub: app.jobTitle,
        badge: {
          text: info.label,
          cls: info.state === 'overdue' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-900 border-amber-200'
        },
        actions: [
          { label: 'Đánh dấu đã xem', onClick: () => onUpdateApplicationStatus(app.id, 'Doanh nghiệp đã xem') },
          { label: 'Xem hồ sơ', onClick: () => setViewJobModalId(app.jobId), primary: true }
        ]
      }))
    },
    {
      key: 'rejected',
      n: metrics.rejectedJobs.length,
      text: 'tin bị từ chối duyệt, cần sửa và gửi lại',
      tone: 'danger' as const,
      viewAll: () => handleGoToMyJobsWithFilter('rejected'),
      items: metrics.rejectedJobs.slice(0, 3).map(j => ({
        key: j.id,
        title: j.title,
        sub: j.moderationNote ? `Lý do: ${j.moderationNote}` : undefined,
        actions: [
          { label: 'Sửa và gửi lại', onClick: () => handleEditJob(j), primary: true }
        ]
      }))
    },
    {
      key: 'expiring',
      n: metrics.expiringJobs.length,
      text: 'tin còn tối đa 7 ngày nhận hồ sơ',
      tone: 'warn' as const,
      viewAll: () => handleGoToMyJobsWithFilter('open', 'deadline'),
      items: metrics.expiringJobs.slice(0, 3).map(j => ({
        key: j.id,
        title: j.title,
        badge: { text: getRemainingDaysLabel(j), cls: 'bg-amber-50 text-amber-900 border-amber-200' },
        actions: [
          { label: 'Gia hạn 30 ngày', onClick: () => handleExtendJob(j), primary: true }
        ]
      }))
    },
    {
      key: 'expired',
      n: expiredUnrepliedJobs.length,
      text: 'tin đã hết hạn, ứng viên không còn thấy',
      tone: 'warn' as const,
      viewAll: () => handleGoToMyJobsWithFilter('expired'),
      items: expiredUnrepliedJobs.slice(0, 3).map(j => ({
        key: j.id,
        title: j.title,
        badge: { text: 'Đã hết hạn', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
        actions: [
          { label: 'Gia hạn 30 ngày', onClick: () => handleExtendJob(j), primary: true }
        ]
      }))
    },
    {
      key: 'draft',
      n: metrics.draftJobs.length,
      text: 'tin nháp chưa gửi duyệt',
      tone: 'info' as const,
      viewAll: () => handleGoToMyJobsWithFilter('draft'),
      items: metrics.draftJobs.slice(0, 3).map(j => ({
        key: j.id,
        title: j.title,
        actions: [
          { label: 'Sửa', onClick: () => handleEditJob(j) },
          { label: 'Gửi duyệt', onClick: () => handlePublishJob(j), primary: true }
        ]
      }))
    },
    {
      key: 'lowtrans',
      n: lowTransJobs.length,
      text: 'tin có điểm minh bạch dưới 70, nên bổ sung',
      tone: 'warn' as const,
      viewAll: () => handleGoToMyJobsWithFilter('all'),
      items: lowTransJobs.slice(0, 3).map(j => ({
        key: j.id,
        title: j.title,
        badge: { text: `Minh bạch ${calcTransparencyScore(j).score}/100`, cls: 'bg-amber-50 text-amber-900 border-amber-200' },
        actions: [
          { label: 'Sửa tin', onClick: () => handleEditJob(j), primary: true }
        ]
      }))
    },
    {
      key: 'pending',
      n: metrics.pendingJobs.length,
      text: 'tin đang chờ duyệt, chưa hiển thị với ứng viên',
      tone: 'info' as const,
      viewAll: () => handleGoToMyJobsWithFilter('pending'),
      items: []
    },
    {
      key: 'profile',
      n: missingProfileFields.length > 0 ? 1 : 0,
      text: `hồ sơ doanh nghiệp còn thiếu: ${missingProfileFields.join(', ')}`,
      tone: 'warn' as const,
      viewAll: () => onOpenCompanyProfile?.(),
      items: []
    }
  ].filter(g => g.n > 0);

  const recentJobs = [...myJobs].sort((a, b) => {
    const scoreMap = { rejected: 0, expired: 1, open: 2, pending: 3, draft: 4, closed: 5 };
    return scoreMap[getJobDisplayStatus(a)] - scoreMap[getJobDisplayStatus(b)];
  }).slice(0, 3);

  const statusDisplayMap = {
    open: { text: 'Đang mở', cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    pending: { text: 'Chờ duyệt', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    draft: { text: 'Nháp', cls: 'bg-slate-100 text-slate-700 border-slate-200' },
    rejected: { text: 'Bị từ chối', cls: 'bg-rose-50 text-rose-800 border-rose-200' },
    expired: { text: 'Hết hạn', cls: 'bg-amber-50 text-amber-900 border-amber-200' },
    closed: { text: 'Đã đóng', cls: 'bg-slate-100 text-slate-600 border-slate-200' }
  };

  return (
    <div className="space-y-6">

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Header Banner: Cân đối tỉ lệ 1376x768, hiển thị trọn vẹn 100% nội dung và chữ, không bị cắt xén trên mọi thiết bị */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-gradient-to-br from-[#F1F6FD] via-white to-[#EFF5FD]">
            <img
              src="/Banner.jpg"
              alt="Nối cơ hội - Đổi cuộc đời - Cổng Doanh Nghiệp Tuyển Dụng Trực Tiếp"
              className="w-full h-auto aspect-[1376/768] block object-contain select-none"
              loading="eager"
              onError={e => {
                e.currentTarget.src = '/hero_banner.jpg';
              }}
            />
          </div>

          <h1 className="text-lg sm:text-xl font-black text-slate-900">
            Xin chào{contactShort ? `, ${contactShort}` : ''}.{' '}
            {isBrandNewEmployer
              ? 'Bắt đầu đăng tin tuyển dụng đầu tiên của bạn.'
              : attentionGroups.length > 0
              ? `Hôm nay có ${attentionGroups.length} nhóm việc cần xử lý.`
              : 'Hôm nay không có việc tồn đọng.'}
          </h1>

          {/* New Employer Onboarding Card */}
          {isBrandNewEmployer && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DEB5D7]/60 shadow-2xs">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 mb-1">
                <Rocket className="w-4 h-4 text-amber-700" /> Bắt đầu trong 3 bước
              </h2>
              <ol className="text-xs text-slate-600 space-y-1 mb-4 list-decimal pl-5">
                <li>Hoàn thiện hồ sơ doanh nghiệp (hiện đạt {profileScore}%).</li>
                <li>Đăng tin đầu tiên, nêu rõ lương và cam kết không thu phí.</li>
                <li>Theo dõi hồ sơ và trả lời ứng viên đúng hạn cam kết.</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearFormState();
                    setActiveTab('post');
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-xs border flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }}
                >
                  <PlusCircle className="w-4 h-4" /> Đăng tin đầu tiên
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCompanyProfile?.()}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-bold text-xs hover:bg-slate-50 cursor-pointer"
                >
                  Hoàn thiện hồ sơ doanh nghiệp
                </button>
              </div>
            </div>
          )}

          {/* Action Items for Today */}
          {!isBrandNewEmployer && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Cần xử lý hôm nay
              </h2>

              {attentionGroups.length === 0 ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-1">
                  <p className="text-xs text-slate-500">
                    Không có việc tồn đọng. Bạn có thể đăng thêm vị trí để nhận thêm hồ sơ.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      clearFormState();
                      setActiveTab('post');
                    }}
                    className="shrink-0 px-4 py-2 rounded-xl font-bold text-xs border flex items-center gap-1.5 cursor-pointer"
                    style={{ backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }}
                  >
                    <PlusCircle className="w-4 h-4" /> Đăng tin mới
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {attentionGroups.map(grp => (
                    <div key={grp.key}>
                      <button
                        type="button"
                        onClick={grp.viewAll}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer hover:brightness-95 transition ${
                          toneClass[grp.tone]
                        }`}
                      >
                        <span className="shrink-0 min-w-[28px] h-7 px-2 rounded-full bg-white/80 border border-current/20 text-xs font-black flex items-center justify-center">
                          {grp.n}
                        </span>
                        <span className="flex-1 text-xs font-bold">{grp.text}</span>
                        <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
                      </button>

                      {grp.items.length > 0 && (
                        <div className="mt-2 ml-4 sm:ml-10 space-y-2">
                          {grp.items.map(item => (
                            <div
                              key={item.key}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-200 bg-white"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-xs font-black text-slate-900">{item.title}</span>
                                  {item.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badge.cls}`}>
                                      {item.badge.text}
                                    </span>
                                  )}
                                </div>
                                {item.sub && <p className="text-[11px] text-slate-500 truncate">{item.sub}</p>}
                              </div>

                              <div className="shrink-0 flex items-center gap-2">
                                {item.actions.map(act => (
                                  <button
                                    key={act.label}
                                    type="button"
                                    onClick={act.onClick}
                                    className={
                                      act.primary
                                        ? 'px-3 py-1.5 rounded-lg border border-[#e6bd67] text-[11px] font-bold cursor-pointer'
                                        : 'px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold hover:bg-slate-50 cursor-pointer'
                                    }
                                    style={act.primary ? { backgroundColor: '#FFD273', color: '#3d2b02' } : undefined}
                                  >
                                    {act.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          {grp.n > grp.items.length && (
                            <button
                              type="button"
                              onClick={grp.viewAll}
                              className="text-[11px] font-bold text-purple-800 hover:underline cursor-pointer"
                            >
                              Xem thêm {grp.n - grp.items.length} mục
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4 Stat Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleGoToMyJobsWithFilter('open')}
              className="flex flex-col items-stretch justify-start h-full text-left bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#DEB5D7] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">Tin đang mở</span>
                <Briefcase className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{openCount}</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('candidates')}
              className="flex flex-col items-stretch justify-start h-full text-left bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#DEB5D7] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">Hồ sơ mới 7 ngày</span>
                <Users className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.newApps7}</div>
              <div className="text-[11px] text-slate-500 mt-1">Tổng {applications.length} hồ sơ</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('candidates')}
              className="flex flex-col items-stretch justify-start h-full text-left bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-[#DEB5D7] transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">Chờ trả lời</span>
                <Clock className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{metrics.pendingReply.length}</div>
            </button>

            <div className="flex flex-col justify-start h-full bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">Trả lời đúng hạn, 30 ngày</span>
                <CheckCircle2 className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {metrics.onTime30.pct === null ? '—' : `${metrics.onTime30.pct}%`}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {metrics.onTime30.total > 0
                  ? `${metrics.onTime30.done}/${metrics.onTime30.total} hồ sơ`
                  : 'Chưa đủ dữ liệu'}
              </div>
            </div>
          </div>

          {/* Your Jobs Block */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-700" /> Tin của bạn
              </h2>
              {recentJobs.length > 0 && (
                <button
                  type="button"
                  onClick={() => handleGoToMyJobsWithFilter('all')}
                  className="text-xs font-bold text-purple-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Quản lý tin đăng</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {recentJobs.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs space-y-3">
                <p>Doanh nghiệp chưa có tin tuyển dụng nào.</p>
                <button
                  type="button"
                  onClick={() => {
                    clearFormState();
                    setActiveTab('post');
                  }}
                  className="px-4 py-2 rounded-xl font-bold text-xs border inline-flex items-center gap-1.5 cursor-pointer"
                  style={{ backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }}
                >
                  <PlusCircle className="w-4 h-4" /> Đăng tin mới
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentJobs.map(job => {
                  const s = getJobDisplayStatus(job);
                  const m = getJobMetrics(job);
                  const statusInfo = statusDisplayMap[s];
                  return (
                    <div
                      key={job.id}
                      className="p-3 sm:p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">{job.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.cls}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          {m.total} hồ sơ
                          {m.unreplied > 0 ? `, ${m.unreplied} chưa trả lời` : ''}
                          {s === 'open' && getRemainingDaysLabel(job) ? `, ${getRemainingDaysLabel(job)}` : ''}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {m.total > 0 && (
                          <button
                            type="button"
                            onClick={() => setViewJobModalId(job.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                          >
                            Xem hồ sơ
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => onPreviewJob?.(job)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> Xem như ứng viên
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POST TAB */}
      {activeTab === 'post' && (
        <div className="space-y-4">
          {postNotice && (
            <div
              role="status"
              className="p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-3 animate-in fade-in"
              style={{ backgroundColor: '#FEE686', borderColor: '#FFD273', color: '#3d2b02' }}
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-800 shrink-0" />
              <span>{postNotice}</span>
            </div>
          )}

          <EmployerPostJob
            key={editingJob?.id || (cloningJob ? `clone-${cloningJob.id}` : 'new')}
            industries={industries}
            employerProfile={employerProfile}
            initialJob={editingJob || cloningJob}
            cloneMode={!editingJob && !!cloningJob}
            onSubmit={handlePostSubmit}
            onCancelEdit={() => {
              clearFormState();
              setActiveTab('my-jobs');
            }}
          />
        </div>
      )}

      {/* CANDIDATES TAB */}
      {activeTab === 'candidates' && (
        <ApplicationManagement
          applications={applications}
          jobs={myJobs}
          onUpdateStatus={onUpdateApplicationStatus}
          onSaveNote={onSaveApplicationNote}
        />
      )}

      {/* MY JOBS TAB */}
      {activeTab === 'my-jobs' && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-700" />
                Quản lý tin đăng ({myJobs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Theo dõi trạng thái duyệt, số hồ sơ và độ minh bạch của từng tin. Tin hết hạn hoặc đã đóng không còn hiển thị với ứng viên.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearFormState();
                setActiveTab('post');
              }}
              className="px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 border self-start"
              style={{ backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Đăng vị trí mới</span>
            </button>
          </div>

          <div className="space-y-3">
            <div role="tablist" aria-label="Lọc theo trạng thái tin" className="flex flex-wrap gap-2">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer transition-colors ${
                    statusFilter === tab.key
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  aria-label="Tìm tin đăng"
                  placeholder="Tìm theo tên tin..."
                  value={titleSearch}
                  onChange={e => setTitleSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white w-56"
                />
              </div>

              <select
                aria-label="Sắp xếp tin"
                value={sortJobsBy}
                onChange={e => setSortJobsBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 font-bold"
              >
                <option value="newest">Sắp xếp: Mới nhất</option>
                <option value="deadline">Sắp xếp: Hạn nộp gần nhất</option>
                <option value="cv">Sắp xếp: Nhiều hồ sơ nhất</option>
                <option value="unreplied">Sắp xếp: Nhiều hồ sơ chưa phản hồi nhất</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.length === 0 && (
              <p className="md:col-span-2 text-sm text-slate-500 py-6 text-center">
                {myJobs.length === 0
                  ? 'Doanh nghiệp chưa có tin tuyển dụng nào. Bấm "Đăng vị trí mới" để bắt đầu.'
                  : 'Không có tin nào phù hợp bộ lọc hiện tại.'}
              </p>
            )}

            {filteredJobs.map(job => {
              const status = getJobDisplayStatus(job);
              const m = getJobMetrics(job);
              const trans = calcTransparencyScore(job);
              const topFix = trans.checks.filter(c => !c.ok).sort((a, b) => b.weight - a.weight)[0];

              const badgeColors = {
                high: 'bg-emerald-50 text-emerald-800 border-emerald-200',
                medium: 'bg-amber-50 text-amber-900 border-amber-200',
                low: 'bg-rose-50 text-rose-800 border-rose-200'
              };

              return (
                <div
                  key={job.id}
                  className={`p-4 sm:p-5 rounded-2xl border bg-white transition-all shadow-xs space-y-3 flex flex-col ${
                    status === 'rejected' ? 'border-rose-200' : 'border-slate-200/90 hover:border-[#DEB5D7]'
                  } ${status === 'closed' || status === 'expired' ? 'opacity-90' : ''}`}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {job.industryCode}
                      </span>
                      {job.experienceRequired === 'no-experience' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: '#FFD273', color: '#3d2b02' }}>
                          🌱 Không cần KN
                        </span>
                      )}
                      {status === 'draft' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">● Bản nháp</span>}
                      {status === 'pending' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-900">● Chờ duyệt</span>}
                      {status === 'rejected' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800">● Bị từ chối duyệt</span>}
                      {status === 'open' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">● Đang nhận hồ sơ</span>}
                      {status === 'expired' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800">● Đã hết hạn</span>}
                      {status === 'closed' && <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">● Đã đóng</span>}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColors[trans.level]}`}>
                        Minh bạch {trans.score}/100
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-2">{job.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1 text-amber-800 font-bold">
                      <DollarSign className="w-3.5 h-3.5" /> {job.salaryText}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.city}
                    </span>
                    {job.headcount ? (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" /> Cần tuyển {job.headcount}
                      </span>
                    ) : null}
                  </div>

                  {topFix && trans.score < 100 && (
                    <p className="text-[11px] text-slate-500">
                      +{topFix.weight} điểm: {topFix.hint}
                    </p>
                  )}

                  {status === 'rejected' && (
                    <div role="alert" className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-[11px] text-rose-900">
                      <span className="font-bold block mb-0.5">Lý do kiểm duyệt:</span>
                      {job.moderationNote || 'Tin chưa đạt yêu cầu kiểm duyệt.'}
                    </div>
                  )}

                  <div className="pt-2 mt-auto border-t border-slate-100 space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-500">Hạn nộp: {job.deadline || 'Đang mở'}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          {m.total} hồ sơ
                        </span>
                        {m.unreplied > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-amber-50 text-amber-900 border-amber-200">
                            {m.unreplied} chờ trả lời
                          </span>
                        )}
                        {m.overdue > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-800 border-rose-200">
                            {m.overdue} quá hạn
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setViewJobModalId(job.id)}
                        className="px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-900 font-bold text-[11px] hover:bg-purple-100 flex items-center gap-1 cursor-pointer"
                      >
                        <Users className="w-3 h-3" /> Xem hồ sơ
                      </button>
                    </div>

                    {/* Deadline warning banner */}
                    {(() => {
                      const days = daysUntilDeadline(job.deadlineDate);
                      if (status === 'open' && days !== null && days <= 7) {
                        return (
                          <div
                            className={`p-2.5 rounded-xl border text-[11px] flex flex-wrap items-center gap-2 ${
                              days <= 2 ? 'border-rose-200 bg-rose-50 text-rose-900' : 'border-amber-200 bg-amber-50 text-amber-900'
                            }`}
                          >
                            <span className="flex-1 min-w-[120px] font-bold">
                              {days <= 0 ? 'Hôm nay là ngày cuối nhận hồ sơ' : `Còn ${days} ngày nhận hồ sơ`}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleExtendJob(job)}
                              className="px-2.5 py-1 rounded-lg border border-current bg-white font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1"
                            >
                              <CalendarPlus className="w-3 h-3" /> Gia hạn 30 ngày
                            </button>
                          </div>
                        );
                      }
                      if (status === 'expired' && m.unreplied > 0) {
                        return (
                          <div className="p-2.5 rounded-xl border border-rose-200 bg-rose-50 text-[11px] font-bold text-rose-900">
                            Đã hết hạn, còn {m.unreplied} hồ sơ chờ trả lời
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {/* Pending moderation banner */}
                    {status === 'pending' && (
                      <div className="p-2.5 rounded-xl border border-dashed border-yellow-300 bg-yellow-50 text-[11px] text-yellow-900 flex flex-wrap items-center gap-2">
                        <span className="flex-1 min-w-[160px]">Tin đang chờ duyệt, ứng viên chưa nhìn thấy tin này.</span>
                        <button
                          type="button"
                          onClick={() => onApproveJob(job.id)}
                          className="px-2.5 py-1 rounded-lg border border-yellow-400 bg-white text-yellow-900 font-bold cursor-pointer hover:bg-yellow-100"
                          title="Chỉ có trong bản demo: giả lập bộ phận kiểm duyệt"
                        >
                          Demo: giả lập duyệt tin
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectJob(job.id)}
                          className="px-2.5 py-1 rounded-lg border border-yellow-400 bg-white text-rose-800 font-bold cursor-pointer hover:bg-rose-50"
                          title="Chỉ có trong bản demo: giả lập bộ phận kiểm duyệt"
                        >
                          Demo: giả lập từ chối
                        </button>
                      </div>
                    )}

                    {/* Confirm withdraw draft */}
                    {draftingJobId === job.id ? (
                      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-slate-300 bg-slate-50">
                        <span className="text-[11px] font-bold text-slate-800 flex-1 min-w-[140px]">
                          Rút tin về bản nháp? Tin sẽ rời hàng chờ duyệt, bạn gửi duyệt lại khi sẵn sàng.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDraftJob(job)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold cursor-pointer hover:bg-slate-700"
                        >
                          Rút tin
                        </button>
                        <button
                          type="button"
                          onClick={() => setDraftingJobId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : closingJobId === job.id ? (
                      <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl border border-rose-200 bg-rose-50">
                        <span className="text-[11px] font-bold text-rose-800 flex-1 min-w-[140px]">
                          Đóng tin này? Ứng viên sẽ không thấy tin nữa.
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCloseJob(job)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-bold cursor-pointer hover:bg-rose-700"
                        >
                          Đóng tin
                        </button>
                        <button
                          type="button"
                          onClick={() => setClosingJobId(null)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCloningJob(null);
                            setEditingJob(job);
                            setActiveTab('post');
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> {status === 'rejected' ? 'Sửa và gửi lại' : 'Sửa tin'}
                        </button>

                        {(status === 'expired' || (status === 'open' && !(daysUntilDeadline(job.deadlineDate) !== null && daysUntilDeadline(job.deadlineDate)! <= 7))) && (
                          <button
                            type="button"
                            onClick={() => handleExtendJob(job)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1"
                          >
                            <CalendarPlus className="w-3 h-3" /> Gia hạn 30 ngày
                          </button>
                        )}

                        {status === 'draft' && (
                          <button
                            type="button"
                            onClick={() => handlePublishJob(job)}
                            className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 text-[11px] font-bold cursor-pointer hover:bg-emerald-100 flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Gửi duyệt
                          </button>
                        )}

                        {status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => setDraftingJobId(job.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Rút tin
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCloneJob(job)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-[11px] font-bold cursor-pointer hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Nhân bản
                        </button>

                        {status === 'closed' ? (
                          <button
                            type="button"
                            onClick={() => handleReopenJob(job)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-emerald-700 text-[11px] font-bold cursor-pointer hover:bg-emerald-50 flex items-center gap-1"
                          >
                            <LockOpen className="w-3 h-3" /> Mở lại tin
                          </button>
                        ) : (status === 'open' || status === 'expired') && (
                          <button
                            type="button"
                            onClick={() => setClosingJobId(job.id)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-rose-700 text-[11px] font-bold cursor-pointer hover:bg-rose-50 flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" /> Đóng tin
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: VIEW APPLICATIONS FOR SPECIFIC JOB */}
      {viewJobModalId && (() => {
        const targetJob = myJobs.find(j => j.id === viewJobModalId);
        if (!targetJob) return null;
        const jobApps = applications.filter(a => a.jobId === targetJob.id);
        return (
          <div
            className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-3 sm:p-6 bg-slate-900/50"
            onClick={() => setViewJobModalId(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Hồ sơ của tin ${targetJob.title}`}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-3 px-5 sm:px-7 py-4 bg-white/95 backdrop-blur border-b border-slate-100">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-black text-slate-900 line-clamp-2">{targetJob.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{jobApps.length} hồ sơ</p>
                </div>
                <button
                  type="button"
                  aria-label="Đóng"
                  onClick={() => setViewJobModalId(null)}
                  className="shrink-0 w-8 h-8 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-5 sm:p-7">
                <ApplicationManagement
                  embedded
                  applications={jobApps}
                  jobs={[targetJob]}
                  onUpdateStatus={onUpdateApplicationStatus}
                  onSaveNote={onSaveApplicationNote}
                />
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
