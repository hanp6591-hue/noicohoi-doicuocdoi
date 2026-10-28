import React, { useState, useEffect } from 'react';
import { Job, ApplicationRecord, UserProfile, CandidateProject } from '../types';
import { 
  X, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface ApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (appRecord: ApplicationRecord) => void;
  userProfile?: UserProfile | null;
  onOpenLoginProfile?: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({
  job,
  isOpen,
  onClose,
  onSubmitApplication,
  userProfile,
  onOpenLoginProfile
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [projects, setProjects] = useState<CandidateProject[]>([]);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill from user profile when opened
  useEffect(() => {
    if (isOpen && userProfile) {
      if (userProfile.fullName) setCandidateName(userProfile.fullName);
      if (userProfile.email) setCandidateEmail(userProfile.email);
      if (userProfile.phoneNumber) setCandidatePhone(userProfile.phoneNumber);
      if (userProfile.portfolioUrl) setPortfolioUrl(userProfile.portfolioUrl);
    }
  }, [isOpen, userProfile]);

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!candidateName.trim() || !candidatePhone.trim() || !candidateEmail.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email liên hệ.');
      return;
    }

    // Validate projects
    const cleanProjects = projects
      .map(p => ({
        name: p.name.trim(),
        link: (p.link || '').trim(),
        note: (p.note || '').trim()
      }))
      .filter(p => p.name || p.link || p.note);

    for (const proj of cleanProjects) {
      if (!proj.name) {
        setErrorMsg('Mỗi dự án cần có tên dự án.');
        return;
      }
      if (proj.link) {
        try {
          const parsed = new URL(proj.link);
          if (!/^https?:$/.test(parsed.protocol)) {
            throw new Error();
          }
        } catch {
          setErrorMsg(`Link của dự án "${proj.name}" chưa đúng định dạng (bắt đầu bằng http:// hoặc https://).`);
          return;
        }
      }
    }

    const applicationData: ApplicationRecord = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      candidateName: candidateName.trim(),
      candidateEmail: candidateEmail.trim(),
      candidatePhone: candidatePhone.trim(),
      portfolioUrl: portfolioUrl.trim() || undefined,
      coverNote: coverNote.trim() || 'Tôi quan tâm đến vị trí này và sẵn sàng tham gia phỏng vấn trực tiếp.',
      appliedDate: new Date().toLocaleDateString('vi-VN'),
      appliedAt: new Date().toISOString(),
      projects: cleanProjects.length ? cleanProjects : undefined,
      status: 'Đã gửi hồ sơ'
    };

    onSubmitApplication(applicationData);
    setIsSuccess(true);
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setProjects([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-[24px] shadow-2xl border border-white/70 overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-none flex flex-col transition-all animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        style={{
          boxShadow: '0 20px 40px -10px rgba(152, 84, 99, 0.25)'
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-5 sm:p-6 text-white relative overflow-hidden flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #29384E 100%)',
            borderBottom: '2px solid #DEB5D7'
          }}
        >
          {/* Mobile Handle indicator */}
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto -mt-2 mb-2.5 sm:hidden" />
          
          <div 
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl opacity-35 pointer-events-none"
            style={{ backgroundColor: '#BFAEE3' }}
          />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <span 
                className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1"
                style={{ backgroundColor: '#FEE686', color: '#4a3b05' }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-900" />
                Gửi thẳng đến nhà tuyển dụng
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{job.title}</h3>
              <p className="text-xs text-slate-300">Doanh nghiệp: {job.companyName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isSuccess ? (
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div 
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-slate-900 shadow-md animate-bounce"
              style={{ backgroundColor: '#FFD273' }}
            >
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Nộp hồ sơ ứng tuyển thành công!</h4>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Hồ sơ của bạn đã được chuyển thẳng tới phòng nhân sự của <strong>{job.companyName}</strong>. 
              Doanh nghiệp thường phản hồi trong vòng <strong>24 - 48 giờ</strong> qua Email hoặc Số điện thoại bạn đã cung cấp.
            </p>
            
            <div 
              className="border rounded-xl p-3.5 text-xs text-left space-y-1"
              style={{
                backgroundColor: 'rgba(254, 230, 134, 0.35)',
                borderColor: '#FFD273',
                color: '#463704'
              }}
            >
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                Cam kết an toàn tuyệt đối:
              </div>
              <div>• Không nộp bất kỳ khoản tiền nào dưới mọi hình thức (tiền giữ chỗ, thẻ, tài liệu).</div>
              <div>• Không cung cấp mã OTP ngân hàng hay làm theo yêu cầu nạp tiền trực tuyến.</div>
            </div>

            <button
              onClick={handleCloseAndReset}
              className="w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-98 border border-[#FFD273]"
              style={{ backgroundColor: '#FFD273', color: '#1E293B' }}
            >
              Đóng và tiếp tục tìm việc
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Auto-filled Notification */}
            {userProfile?.isRegistered ? (
              <div 
                className="p-2.5 rounded-xl border flex items-center justify-between text-xs"
                style={{
                  backgroundColor: 'rgba(254, 197, 230, 0.35)',
                  borderColor: '#DEB5D7',
                  color: '#1E293B'
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DEB5D7]" />
                  <span>Đã tự động điền từ hồ sơ: <strong>{userProfile.fullName}</strong></span>
                </div>
                {onOpenLoginProfile && (
                  <button 
                    type="button" 
                    onClick={onOpenLoginProfile}
                    className="text-[11px] font-bold underline hover:opacity-80 cursor-pointer"
                  >
                    Sửa thông tin
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Bạn muốn lưu thông tin cho những lần ứng tuyển sau?</span>
                {onOpenLoginProfile && (
                  <button 
                    type="button" 
                    onClick={onOpenLoginProfile}
                    className="text-[11px] font-bold px-2.5 py-1 rounded-md cursor-pointer border border-[#FFD273]"
                    style={{ backgroundColor: '#FFD273', color: '#1E293B' }}
                  >
                    Đăng nhập hồ sơ
                  </button>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Candidate Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Họ và tên của bạn <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                />
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Số điện thoại liên hệ <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="0987xxxxxx"
                    value={candidatePhone}
                    onChange={(e) => setCandidatePhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email nhận phản hồi <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nguyenvanan@gmail.com"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                  />
                </div>
              </div>
            </div>

            {/* Portfolio Link */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-[#8d427d]" />
                  Link Portfolio / Google Sites / CV
                </label>
                <span 
                  className="text-[10px] font-bold px-2 py-0.2 rounded-full"
                  style={{ backgroundColor: '#FEE686', color: '#4a3b05' }}
                >
                  Khuyên dùng
                </span>
              </div>
              <input
                type="url"
                placeholder="https://sites.google.com/view/portfolio hoặc link Canva"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 text-base sm:text-xs focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                💡 <em>Mẹo:</em> Đính kèm link website cá nhân Google Sites giúp nhà tuyển dụng xem ngay bài tập, đồ án và chứng chỉ thực tế của bạn.
              </p>
            </div>

            {/* Projects list */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#8d427d]" />
                  Dự án / sản phẩm nổi bật (tối đa 3)
                </span>
                <span className="text-[10px] text-slate-500">Không bắt buộc</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-2">
                Bạn chưa có nhiều kinh nghiệm? Hãy cho nhà tuyển dụng thấy bạn đã làm được gì: bài tập lớn, sản phẩm cá nhân, hoạt động câu lạc bộ, dự án tình nguyện.
              </p>
              <div className="space-y-2.5">
                {projects.map((proj, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        aria-label={`Tên dự án ${idx + 1}`}
                        placeholder="Tên dự án"
                        value={proj.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProjects(projects.map((p, i) => i === idx ? { ...p, name: val } : p));
                        }}
                        className="flex-1 min-w-0 px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-base sm:text-xs focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                      />
                      <button
                        type="button"
                        aria-label={`Xóa dự án ${idx + 1}`}
                        onClick={() => setProjects(projects.filter((_, i) => i !== idx))}
                        className="shrink-0 px-3 min-h-[44px] rounded-xl border border-slate-300 bg-white text-slate-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer text-xs font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                    <input
                      type="url"
                      aria-label={`Link dự án ${idx + 1}`}
                      placeholder="Link dự án (GitHub, Google Drive, Behance...)"
                      value={proj.link}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjects(projects.map((p, i) => i === idx ? { ...p, link: val } : p));
                      }}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-xl border border-slate-300 bg-white text-base sm:text-xs focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                    />
                    <textarea
                      rows={2}
                      aria-label={`Vai trò và kết quả dự án ${idx + 1}`}
                      placeholder="Vai trò của bạn và kết quả đạt được"
                      value={proj.note}
                      onChange={(e) => {
                        const val = e.target.value;
                        setProjects(projects.map((p, i) => i === idx ? { ...p, note: val } : p));
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-base sm:text-xs focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                    />
                  </div>
                ))}

                {projects.length < 3 && (
                  <button
                    type="button"
                    onClick={() => setProjects([...projects, { name: '', link: '', note: '' }])}
                    className="text-xs font-bold text-[#8d427d] hover:underline cursor-pointer"
                  >
                    + Thêm dự án
                  </button>
                )}
              </div>
            </div>

            {/* Note / Pitch */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Lời giới thiệu & Điểm mạnh (nguyện vọng học hỏi)
              </label>
              <textarea
                rows={3}
                placeholder="Nêu ngắn gọn tinh thần ham học hỏi, khả năng tiếp thu nhanh hoặc kinh nghiệm từ các đồ án thực tế đã hoàn thành..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-base sm:text-xs focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
              />
            </div>

            {/* Anti-fraud / Direct confirmation checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="check-terms"
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#FFD273] focus:ring-[#FFD273] cursor-pointer"
              />
              <label htmlFor="check-terms" className="text-xs text-slate-600 leading-snug cursor-pointer select-none">
                Tôi xác nhận thông tin là chính xác và hiểu rằng doanh nghiệp <strong>tuyệt đối không thu bất kỳ khoản phí nào</strong> khi tuyển dụng.
              </label>
            </div>

            {/* Submit buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 min-h-[44px] rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer order-2 sm:order-1"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!agreedTerms}
                className="px-6 py-3 min-h-[48px] rounded-xl text-slate-900 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:opacity-90 active:scale-98 disabled:opacity-50 order-1 sm:order-2 border border-[#FFD273]"
                style={{ backgroundColor: '#FFD273' }}
              >
                <Send className="w-4 h-4" />
                Gửi hồ sơ trực tiếp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
