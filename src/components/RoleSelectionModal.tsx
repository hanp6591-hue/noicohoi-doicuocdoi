import React, { useState, useEffect } from 'react';
import { AppUserRole, UserProfile, EmployerProfile, Industry } from '../types';
import { 
  Briefcase, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  ShieldCheck, 
  Check, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Globe, 
  Sparkles, 
  Layers, 
  AlertCircle,
  Zap
} from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  currentRole?: AppUserRole;
  userProfile?: UserProfile | null;
  employerProfile?: EmployerProfile;
  industries?: Industry[];
  onConfirmRoleAndProfile?: (
    role: AppUserRole,
    candidateData?: UserProfile,
    employerData?: EmployerProfile
  ) => void;
  onSelectRole?: (role: AppUserRole) => void;
  onClose?: () => void;
  isInitialPrompt?: boolean;
}

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Bình Dương', 'Hải Phòng', 'Cần Thơ', 'Toàn quốc'];

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  currentRole = 'candidate',
  userProfile,
  employerProfile,
  industries = [],
  onConfirmRoleAndProfile,
  onSelectRole,
  onClose,
  isInitialPrompt = false
}) => {
  const [selectedRole, setSelectedRole] = useState<AppUserRole>(currentRole || 'candidate');

  // Candidate form state
  const [fullName, setFullName] = useState(userProfile?.fullName || 'Nguyễn Thị Mai Lan');
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || '2003-08-20');
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(userProfile?.gender || 'Nữ');
  const [candidateEmail, setCandidateEmail] = useState(userProfile?.email || 'mailan.nguyen@example.com');
  const [candidatePhone, setCandidatePhone] = useState(userProfile?.phoneNumber || '0912 345 678');
  const [currentOccupation, setCurrentOccupation] = useState(
    userProfile?.currentOccupation || 'Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm'
  );
  const [desiredIndustry, setDesiredIndustry] = useState(userProfile?.desiredIndustry || 'CNKT');
  const [portfolioUrl, setPortfolioUrl] = useState(
    userProfile?.portfolioUrl || 'https://sites.google.com/view/mailan-portfolio'
  );
  const [candidateAgreed, setCandidateAgreed] = useState(true);

  // Recruiter form state
  const [companyName, setCompanyName] = useState(
    employerProfile?.companyName || 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến'
  );
  const [taxCode, setTaxCode] = useState(employerProfile?.taxCode || '0108927164');
  const [contactName, setContactName] = useState(
    employerProfile?.contactName || 'Trần Thị Thu Hà (Trưởng phòng Nhân sự)'
  );
  const [contactEmail, setContactEmail] = useState(
    employerProfile?.contactEmail || 'tuyendung.tantien@example.vn'
  );
  const [contactPhone, setContactPhone] = useState(employerProfile?.contactPhone || '0988 123 456');
  const [city, setCity] = useState(employerProfile?.city || 'Hà Nội');
  const [address, setAddress] = useState(
    employerProfile?.address || 'Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1, Nam Từ Liêm'
  );
  const [employerAgreed, setEmployerAgreed] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  // Sync state when modal opens or currentRole changes
  useEffect(() => {
    if (isOpen) {
      setSelectedRole(currentRole || 'candidate');
      setErrorMsg('');

      if (userProfile) {
        setFullName(userProfile.fullName || 'Nguyễn Thị Mai Lan');
        setBirthDate(userProfile.birthDate || '2003-08-20');
        setGender(userProfile.gender || 'Nữ');
        setCandidateEmail(userProfile.email || 'mailan.nguyen@example.com');
        setCandidatePhone(userProfile.phoneNumber || '0912 345 678');
        setCurrentOccupation(userProfile.currentOccupation || 'Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm');
        setDesiredIndustry(userProfile.desiredIndustry || 'CNKT');
        setPortfolioUrl(userProfile.portfolioUrl || 'https://sites.google.com/view/mailan-portfolio');
      }

      if (employerProfile) {
        setCompanyName(employerProfile.companyName || 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến');
        setTaxCode(employerProfile.taxCode || '0108927164');
        setContactName(employerProfile.contactName || 'Trần Thị Thu Hà (Trưởng phòng Nhân sự)');
        setContactEmail(employerProfile.contactEmail || 'tuyendung.tantien@example.vn');
        setContactPhone(employerProfile.contactPhone || '0988 123 456');
        setCity(employerProfile.city || 'Hà Nội');
        setAddress(employerProfile.address || 'Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1, Nam Từ Liêm');
      }
    }
  }, [isOpen, currentRole, userProfile, employerProfile]);

  if (!isOpen) return null;

  // Quick confirm without changing details
  const handleQuickConfirm = (roleToConfirm: AppUserRole) => {
    setErrorMsg('');
    if (roleToConfirm === 'candidate') {
      const candidate: UserProfile = {
        fullName: fullName.trim() || 'Nguyễn Thị Mai Lan',
        birthDate: birthDate || '2003-08-20',
        gender,
        email: candidateEmail.trim() || 'mailan.nguyen@example.com',
        phoneNumber: candidatePhone.trim() || '0912 345 678',
        currentOccupation,
        desiredIndustry,
        portfolioUrl: portfolioUrl.trim() || undefined,
        isRegistered: true
      };
      if (onConfirmRoleAndProfile) {
        onConfirmRoleAndProfile('candidate', candidate, undefined);
      } else if (onSelectRole) {
        onSelectRole('candidate');
      }
    } else {
      const employer: EmployerProfile = {
        companyName: companyName.trim() || 'Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến',
        taxCode: (taxCode.trim() || '0108927164').replace(/[\s-]/g, ''),
        contactName: contactName.trim() || 'Trần Thị Thu Hà (Trưởng phòng Nhân sự)',
        contactEmail: contactEmail.trim() || 'tuyendung.tantien@example.vn',
        contactPhone: contactPhone.trim() || '0988 123 456',
        city: city || 'Hà Nội',
        address: address.trim() || 'Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1, Nam Từ Liêm',
        isVerified: true
      };
      if (onConfirmRoleAndProfile) {
        onConfirmRoleAndProfile('recruiter', undefined, employer);
      } else if (onSelectRole) {
        onSelectRole('recruiter');
      }
    }
  };

  // Form submission handler: Validates required inputs, then enters interface
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'candidate') {
      if (!fullName.trim()) {
        setErrorMsg('Vui lòng nhập Họ và tên ứng viên.');
        return;
      }
      if (!candidateEmail.trim()) {
        setErrorMsg('Vui lòng nhập Email để nhận phản hồi hồ sơ tuyển dụng.');
        return;
      }
      if (!candidatePhone.trim()) {
        setErrorMsg('Vui lòng nhập Số điện thoại hoặc Zalo để doanh nghiệp liên hệ.');
        return;
      }

      const updatedCandidate: UserProfile = {
        fullName: fullName.trim(),
        birthDate,
        gender,
        email: candidateEmail.trim(),
        phoneNumber: candidatePhone.trim(),
        currentOccupation,
        desiredIndustry,
        portfolioUrl: portfolioUrl.trim() || undefined,
        isRegistered: true
      };

      if (onConfirmRoleAndProfile) {
        onConfirmRoleAndProfile('candidate', updatedCandidate, undefined);
      } else if (onSelectRole) {
        onSelectRole('candidate');
      }
    } else {
      if (!companyName.trim()) {
        setErrorMsg('Vui lòng nhập Tên công ty / Doanh nghiệp tuyển dụng.');
        return;
      }
      const cleanTax = taxCode.replace(/[\s-]/g, '');
      if (!cleanTax) {
        setErrorMsg('Vui lòng nhập Mã số thuế để xác thực doanh nghiệp 100% minh bạch.');
        return;
      }
      if (!contactName.trim()) {
        setErrorMsg('Vui lòng nhập Họ tên người phụ trách tuyển dụng.');
        return;
      }
      if (!contactEmail.trim()) {
        setErrorMsg('Vui lòng nhập Email chính thức tiếp nhận CV.');
        return;
      }
      if (!contactPhone.trim()) {
        setErrorMsg('Vui lòng nhập Số điện thoại hotline / Zalo tiếp nhận.');
        return;
      }
      if (!address.trim()) {
        setErrorMsg('Vui lòng nhập Địa chỉ nơi làm việc cụ thể.');
        return;
      }

      const updatedEmployer: EmployerProfile = {
        companyName: companyName.trim(),
        taxCode: cleanTax,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        city,
        address: address.trim(),
        isVerified: true
      };

      if (onConfirmRoleAndProfile) {
        onConfirmRoleAndProfile('recruiter', undefined, updatedEmployer);
      } else if (onSelectRole) {
        onSelectRole('recruiter');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-6 max-h-[94vh] sm:max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-onboarding-title"
      >
        {/* Top Close button if available and not mandatory first onboarding */}
        {!isInitialPrompt && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div 
          className="text-white p-5 sm:p-6 relative flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #29384E 100%)',
            borderBottom: '2px solid #DEB5D7'
          }}
        >
          {/* Mobile Drag Indicator */}
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto -mt-2 mb-3 sm:hidden" />

          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Nối cơ hội - Đổi cuộc đời • 100% Tuyển trực tiếp
            </span>
          </div>

          <h2 id="role-onboarding-title" className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Chọn vai trò & Điền thông tin xác nhận
          </h2>
          <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
            Chọn bạn là <strong>Ứng viên</strong> hay <strong>Nhà tuyển dụng</strong>, hoàn tất thông tin cần thiết và nhấn <strong>Xác nhận</strong> để vào ngay giao diện làm việc.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {errorMsg && (
            <div role="alert" className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. CHỌN VAI TRÒ: ỨNG VIÊN HOẶC NHÀ TUYỂN DỤNG */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Bước 1: Chọn bạn là ai
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Card Ứng viên */}
              <button
                type="button"
                id="modal-select-candidate"
                onClick={() => {
                  setSelectedRole('candidate');
                  setErrorMsg('');
                }}
                className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between text-left select-none group ${
                  selectedRole === 'candidate'
                    ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-3 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2 w-full">
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      selectedRole === 'candidate'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all shrink-0 mt-0.5 ${
                      selectedRole === 'candidate'
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedRole === 'candidate' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Tôi là Ứng viên
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">
                    Tìm việc, nộp CV trực tiếp 0đ phí, tra cứu bảng lương và tạo Portfolio Google Sites.
                  </p>
                </div>
              </button>

              {/* Card Nhà tuyển dụng */}
              <button
                type="button"
                id="modal-select-recruiter"
                onClick={() => {
                  setSelectedRole('recruiter');
                  setErrorMsg('');
                }}
                className={`relative rounded-2xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between text-left select-none group ${
                  selectedRole === 'recruiter'
                    ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-3 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2 w-full">
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      selectedRole === 'recruiter'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div 
                    className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all shrink-0 mt-0.5 ${
                      selectedRole === 'recruiter'
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {selectedRole === 'recruiter' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                    Tôi là Nhà tuyển dụng
                  </h3>
                  <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">
                    Đăng tin tuyển dụng theo ngành, tiếp nhận CV trực tiếp và quản lý hồ sơ ứng viên.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* 2. FORM ĐIỀN THÔNG TIN TƯƠNG ỨNG VỚI VAI TRÒ ĐÃ CHỌN */}
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                Bước 2: Điền thông tin {selectedRole === 'candidate' ? 'Ứng viên' : 'Doanh nghiệp'}
              </label>
              <span className="text-[11px] text-slate-400">
                <span className="text-rose-500">*</span> là thông tin bắt buộc
              </span>
            </div>

            {/* FORM ỨNG VIÊN */}
            {selectedRole === 'candidate' ? (
              <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hồ sơ này sẽ được lưu để tự động điền nhanh khi bạn ứng tuyển vào các vị trí việc làm.</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Họ và tên ứng viên <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Thị Mai Lan"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ngày sinh:
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={e => setBirthDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Giới tính:</label>
                    <select
                      value={gender}
                      onChange={e => setGender(e.target.value as 'Nam' | 'Nữ' | 'Khác')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-rose-500" /> Email nhận thông báo tuyển dụng <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="mailan.nguyen@example.com"
                      value={candidateEmail}
                      onChange={e => setCandidateEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Số điện thoại / Zalo <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0912 345 678"
                      value={candidatePhone}
                      onChange={e => setCandidatePhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Tình trạng nghề nghiệp:
                    </label>
                    <select
                      value={currentOccupation}
                      onChange={e => setCurrentOccupation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm">
                        Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm
                      </option>
                      <option value="Sinh viên năm cuối cần tìm việc / thực tập">
                        Sinh viên năm cuối cần tìm việc / thực tập
                      </option>
                      <option value="Học sinh / Sinh viên cao đẳng nghề">
                        Học sinh / Sinh viên cao đẳng nghề
                      </option>
                      <option value="Người chưa có kinh nghiệm thực tế">
                        Người chưa có kinh nghiệm thực tế
                      </option>
                      <option value="Đã có 1 - 2 năm kinh nghiệm">
                        Đã có 1 - 2 năm kinh nghiệm
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-purple-700" /> Khối ngành quan tâm:
                    </label>
                    <select
                      value={desiredIndustry}
                      onChange={e => setDesiredIndustry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      {industries.map(ind => (
                        <option key={ind.code} value={ind.code}>
                          {ind.code} - {ind.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-600" /> Đường dẫn Portfolio Google Sites / CV online:
                  </label>
                  <input
                    type="url"
                    placeholder="https://sites.google.com/view/ten-ban-portfolio"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    💡 Khuyên dùng Portfolio Google Sites để nhà tuyển dụng xem đồ án, chứng chỉ trực tiếp.
                  </p>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={candidateAgreed}
                      onChange={e => setCandidateAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>
                      Tôi cam kết tìm việc minh bạch, nộp hồ sơ trực tiếp và hiểu rằng doanh nghiệp <strong>tuyệt đối không thu bất kỳ khoản phí nào</strong>.
                    </span>
                  </label>
                </div>
              </div>
            ) : (
              /* FORM DOANH NGHIỆP / NHÀ TUYỂN DỤNG */
              <div className="space-y-3.5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/90">
                <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Thông tin doanh nghiệp dùng để xác thực pháp nhân minh bạch và gán vào các tin tuyển dụng trực tiếp.</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" /> Tên công ty / Doanh nghiệp <span className="text-rose-500">*</span>:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Mã số thuế doanh nghiệp <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="0108927164"
                      value={taxCode}
                      onChange={e => setTaxCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Người phụ trách tuyển dụng <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Trần Thị Thu Hà (Trưởng phòng Nhân sự)"
                      value={contactName}
                      onChange={e => setContactName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-blue-600" /> Email chính thức tiếp nhận CV <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tuyendung.tantien@example.vn"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" /> Số điện thoại hotline / Zalo <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0988 123 456"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Tỉnh / Thành phố:
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Địa chỉ văn phòng / nơi làm việc cụ thể <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={employerAgreed}
                      onChange={e => setEmployerAgreed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      Doanh nghiệp cam kết 100% tuyển dụng trực tiếp, <strong>tuyệt đối KHÔNG thu bất kỳ chi phí nào</strong> của ứng viên.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS: XÁC NHẬN ĐỂ VÀO GIAO DIỆN */}
            <div className="pt-3 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {!isInitialPrompt && onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Đóng
                  </button>
                )}

                <button
                  type="button"
                  id="btn-quick-confirm-role"
                  onClick={() => handleQuickConfirm(selectedRole)}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Vào ngay với thông tin sẵn có"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Vào nhanh</span>
                </button>
              </div>

              <button
                type="submit"
                id="btn-confirm-role-and-enter"
                disabled={selectedRole === 'candidate' ? !candidateAgreed : !employerAgreed}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl font-black text-xs sm:text-sm text-slate-900 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 border border-[#e6bd67] disabled:opacity-50"
                style={{ backgroundColor: '#FFD273' }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                <span>
                  Xác nhận thông tin & Vào giao diện {selectedRole === 'candidate' ? 'Ứng viên' : 'Doanh nghiệp'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

        {/* Footer info note */}
        <div className="bg-slate-50 border-t border-slate-100 py-2.5 px-6 text-center text-[11px] text-slate-500">
          💡 Bạn luôn có thể chuyển đổi vai trò bất cứ lúc nào qua nút chuyển đổi vai trò ở đầu trang hoặc trong phần cài đặt tài khoản.
        </div>
      </div>
    </div>
  );
};
