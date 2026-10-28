import React, { useState } from 'react';
import { Job, Company } from '../types';
import { calcTransparencyScore } from '../utils/transparency';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Send,
  Building2,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Phone,
  ExternalLink,
  Users
} from 'lucide-react';

interface JobDetailModalProps {
  job: Job | null;
  company?: Company;
  isSaved: boolean;
  isOpen: boolean;
  onClose: () => void;
  onToggleSave: (jobId: string) => void;
  onOpenApply: (job: Job) => void;
  onReportJob?: (job: Job) => void;
  previewMode?: boolean;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  company,
  isSaved,
  isOpen,
  onClose,
  onToggleSave,
  onOpenApply,
  onReportJob,
  previewMode = false
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReport = () => {
    setReportSuccess(true);
    if (onReportJob) onReportJob(job);
    setTimeout(() => setReportSuccess(false), 4000);
  };

  const trans = calcTransparencyScore(job);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Modal Top Header */}
        <div 
          className="text-white p-5 sm:p-6 relative flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #29384E 100%)',
            borderBottom: '2px solid #DEB5D7'
          }}
        >
          {/* Mobile Handle indicator */}
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto -mt-2 mb-3 sm:hidden" />

          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Đóng chi tiết"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl pr-8 sm:pr-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
              <span 
                className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                style={{
                  backgroundColor: '#FEE686',
                  color: '#1E293B',
                  borderColor: '#FFD273'
                }}
              >
                {job.industryName}
              </span>
              {job.experienceRequired === 'no-experience' ? (
                <span 
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: '#FFD273',
                    color: '#453202',
                    borderColor: '#e6bd67'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                  Không cần kinh nghiệm
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                  {job.experienceText}
                </span>
              )}
              {job.isVerifiedCompany && (
                <span 
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: '#BFAEE3',
                    color: '#1e1635'
                  }}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-900" />
                  Xác thực 100%
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1.5 leading-snug">
              {job.title}
            </h2>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-rose-100">
              <Building2 className="w-4 h-4 text-rose-200 flex-shrink-0" />
              <span className="font-semibold text-white">{job.companyName}</span>
            </div>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
          {previewMode && (
            <div role="status" className="rounded-xl border border-amber-300 bg-amber-50 text-amber-950 text-xs font-bold px-3 py-2">
              Chế độ xem trước. Ứng viên sẽ thấy tin đúng như bên dưới.
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Mức lương</span>
              <span className="text-sm font-bold text-emerald-700 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> {job.salaryText}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Địa điểm</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" /> {job.city}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Hình thức</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1 capitalize">
                <Clock className="w-4 h-4 text-slate-400" /> {job.jobType}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Hạn nộp hồ sơ</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-400" /> {job.deadline}
              </span>
            </div>
          </div>

          {/* Anti-Scam Direct Commitment */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Cam kết tuyển dụng minh bạch - Không trung gian
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Tin tuyển dụng này được xác minh trực tiếp từ <strong>{job.companyName}</strong>. Theo quy định, doanh nghiệp <strong>tuyệt đối không thu tiền ứng viên</strong> dưới bất kỳ hình thức nào (phí đồng phục, thẻ ra vào, tài liệu đào tạo hay nạp tiền làm nhiệm vụ).
              </p>
            </div>
          </div>

          {/* Điểm minh bạch */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Điểm minh bạch của tin
              </h4>
              <div className="flex flex-wrap items-center gap-2">
                {job.responseSlaHours ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
                    Cam kết phản hồi trong {job.responseSlaHours} giờ
                  </span>
                ) : null}
                <span 
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    trans.level === 'high' 
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                      : trans.level === 'medium' 
                      ? 'bg-amber-50 text-amber-900 border-amber-200' 
                      : 'bg-rose-50 text-rose-900 border-rose-200'
                  }`}
                >
                  {trans.score}/100 · {trans.levelLabel}
                </span>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {trans.checks.map(c => (
                <li key={c.key} className={`flex items-start gap-1.5 text-xs ${c.ok ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${c.ok ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span>{c.label}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-slate-400">
              Điểm được tính từ thông tin doanh nghiệp khai trên tin này, không phải đánh giá của nền tảng về chất lượng công ty.
            </p>
          </div>

          {/* Headcount, Level, Education, Locations, Skills */}
          {(job.headcount || job.level || job.educationLevel || (job.skills && job.skills.length > 0) || (job.locations && job.locations.length > 1)) && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {job.headcount ? (
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Số lượng tuyển</span>
                    <span className="font-bold text-slate-800">{job.headcount} người</span>
                  </div>
                ) : null}
                {job.level ? (
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Cấp bậc</span>
                    <span className="font-bold text-slate-800">{job.level}</span>
                  </div>
                ) : null}
                {job.educationLevel ? (
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-semibold mb-0.5">Học vấn</span>
                    <span className="font-bold text-slate-800">{job.educationLevel}</span>
                  </div>
                ) : null}
              </div>

              {job.locations && job.locations.length > 1 && (
                <ul className="space-y-1">
                  {job.locations.map((loc, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                      <span><strong>{loc.city}</strong>: {loc.address}</span>
                    </li>
                  ))}
                </ul>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detailed Job Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              Mô tả công việc chi tiết
            </h3>
            <ul className="space-y-2">
              {job.description.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidate Requirements */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              Yêu cầu ứng viên
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              Quyền lợi & Đãi ngộ
            </h3>
            <ul className="space-y-2">
              {job.benefits.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Information card if available */}
          {company && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Thông tin doanh nghiệp tuyển dụng</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{company.description}</p>
              <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {company.address}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {company.phone}
                </span>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline">
                    <Globe className="w-3.5 h-3.5" /> {company.website} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {job.companyDescription && !company && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Về công ty</h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{job.companyDescription}</p>
            </div>
          )}

          {/* Report Button */}
          {!previewMode && (
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>Mã tin việc làm: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{job.id}</code></span>
              <button
                onClick={handleReport}
                className="text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer font-medium"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {reportSuccess ? "Đã tiếp nhận báo cáo!" : "Báo cáo tin vi phạm / có dấu hiệu lừa đảo"}
              </button>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Footer */}
        {previewMode ? (
          <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 sm:px-6 flex items-center justify-between gap-3 flex-shrink-0">
            <span className="text-xs text-slate-600">
              Chế độ xem trước: đây là cách ứng viên nhìn thấy tin của bạn. Các nút lưu, chia sẻ và ứng tuyển được ẩn.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(job.id)}
                className={`flex-1 sm:flex-initial px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  isSaved 
                    ? 'border-[#DEB5D7]' 
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                style={isSaved ? { backgroundColor: '#FEC5E6', color: '#542045' } : undefined}
                title={isSaved ? "Đã lưu - Nhấn để bỏ lưu khỏi Việc làm đã lưu" : "Nhấn để lưu vào Việc làm đã lưu"}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 fill-current text-purple-700" />
                    Đã lưu việc làm
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Lưu việc làm
                  </>
                )}
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">{copiedLink ? "Đã sao chép link!" : "Chia sẻ"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="hidden sm:inline-flex px-4 py-2.5 min-h-[44px] rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold text-xs items-center justify-center transition-colors cursor-pointer"
              >
                Đóng
              </button>
              
              <button
                onClick={() => {
                  onClose();
                  onOpenApply(job);
                }}
                className="flex-1 sm:flex-initial px-6 py-2.5 min-h-[44px] rounded-xl text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer border border-[#FFD273]"
                style={{ backgroundColor: '#FFD273' }}
              >
                <Send className="w-4 h-4" />
                <span>Ứng tuyển ngay</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
