import React, { useState, useEffect } from 'react';
import { UserProfile, EmployerProfile, AppUserRole, RoleChangeRequest } from '../types';
import { 
  X, 
  User, 
  Mail, 
  Calendar, 
  Briefcase, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Building2,
  Phone,
  Lock,
  ArrowRightLeft,
  Clock,
  AlertTriangle,
  LogOut,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface LoginProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
  employerProfile?: EmployerProfile;
  currentRole: AppUserRole;
  onSaveProfile: (profile: UserProfile) => void;
  onSaveEmployerProfile?: (profile: EmployerProfile) => void;
  roleChangeRequest?: RoleChangeRequest | null;
  onRequestRoleChange: (targetRole: AppUserRole, reason: string) => Promise<void>;
  onCancelRoleChange?: () => Promise<void>;
  onApproveRoleChangeDemo?: () => Promise<void>;
  onSwitchDemoAccount?: (role: AppUserRole) => void;
  onLogout?: () => void;
  isFirstVisit?: boolean;
}

export const LoginProfileModal: React.FC<LoginProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  employerProfile,
  currentRole,
  onSaveProfile,
  onSaveEmployerProfile,
  roleChangeRequest,
  onRequestRoleChange,
  onCancelRoleChange,
  onApproveRoleChangeDemo,
  onSwitchDemoAccount,
  onLogout,
  isFirstVisit = false
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'role-settings' | 'switch-account'>('profile');

  // Candidate Profile State
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [birthDate, setBirthDate] = useState(userProfile?.birthDate || '2002-05-15');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [currentOccupation, setCurrentOccupation] = useState(
    userProfile?.currentOccupation || 'Sinh viên năm cuối / Mới tốt nghiệp'
  );
  const [gender, setGender] = useState<'Nam' | 'Nữ' | 'Khác'>(userProfile?.gender || 'Nam');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [portfolioUrl, setPortfolioUrl] = useState(userProfile?.portfolioUrl || '');

  // Recruiter Profile State
  const [companyName, setCompanyName] = useState(employerProfile?.companyName || '');
  const [taxCode, setTaxCode] = useState(employerProfile?.taxCode || '');
  const [contactName, setContactName] = useState(employerProfile?.contactName || '');
  const [contactEmail, setContactEmail] = useState(employerProfile?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(employerProfile?.contactPhone || '');
  const [address, setAddress] = useState(employerProfile?.address || '');

  // Role change request form state
  const [confirmingRoleChange, setConfirmingRoleChange] = useState(false);
  const [roleChangeReason, setRoleChangeReason] = useState('');
  const [isSubmittingRoleChange, setIsSubmittingRoleChange] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.fullName || '');
      setBirthDate(userProfile.birthDate || '2002-05-15');
      setEmail(userProfile.email || '');
      setCurrentOccupation(userProfile.currentOccupation || 'Sinh viên năm cuối / Mới tốt nghiệp');
      setGender(userProfile.gender || 'Nam');
      setPhoneNumber(userProfile.phoneNumber || '');
      setPortfolioUrl(userProfile.portfolioUrl || '');
    }
    if (employerProfile) {
      setCompanyName(employerProfile.companyName || '');
      setTaxCode(employerProfile.taxCode || '');
      setContactName(employerProfile.contactName || '');
      setContactEmail(employerProfile.contactEmail || '');
      setContactPhone(employerProfile.contactPhone || '');
      setAddress(employerProfile.address || '');
    }
  }, [userProfile, employerProfile, isOpen]);

  if (!isOpen) return null;

  const handleCandidateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    const profile: UserProfile = {
      fullName: fullName.trim(),
      birthDate,
      email: email.trim(),
      currentOccupation,
      gender,
      phoneNumber: phoneNumber.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
      isRegistered: true
    };

    onSaveProfile(profile);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contactEmail.trim()) return;

    if (onSaveEmployerProfile && employerProfile) {
      onSaveEmployerProfile({
        ...employerProfile,
        companyName: companyName.trim(),
        taxCode: taxCode.trim(),
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        address: address.trim()
      });
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const handleRequestRoleChange = async () => {
    const targetRole: AppUserRole = currentRole === 'candidate' ? 'recruiter' : 'candidate';
    setIsSubmittingRoleChange(true);
    try {
      await onRequestRoleChange(targetRole, roleChangeReason);
      setConfirmingRoleChange(false);
      setRoleChangeReason('');
      setActionMessage("Yêu cầu đổi vai trò đã được gửi lên hệ thống và đang chờ xử lý.");
      setTimeout(() => setActionMessage(null), 4000);
    } catch {
      setActionMessage("Có lỗi xảy ra khi gửi yêu cầu.");
    } finally {
      setIsSubmittingRoleChange(false);
    }
  };

  const handleCancelRoleChange = async () => {
    if (onCancelRoleChange) {
      await onCancelRoleChange();
      setActionMessage("Đã hủy yêu cầu đổi vai trò.");
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const handleApproveDemo = async () => {
    if (onApproveRoleChangeDemo) {
      await onApproveRoleChangeDemo();
      setActionMessage("Đã mô phỏng phê duyệt vai trò thành công!");
      setTimeout(() => setActionMessage(null), 3000);
    }
  };

  const targetRoleName = currentRole === 'candidate' ? 'Nhà tuyển dụng (Recruiter)' : 'Ứng viên (Candidate)';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-white/60 overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-[85vh] flex flex-col transition-all transform animate-in fade-in duration-200"
      >
        {/* Modal Top Header */}
        <div 
          className="p-5 sm:p-6 text-white relative overflow-hidden flex-shrink-0 bg-slate-900 border-b border-slate-800"
        >
          {/* Mobile pull indicator */}
          <div className="w-12 h-1 bg-white/40 rounded-full mx-auto -mt-2 mb-3 sm:hidden" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold mb-2 bg-blue-900/80 text-blue-200 border border-blue-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  {currentRole === 'recruiter' ? 'Tài khoản Doanh nghiệp' : 'Tài khoản Ứng viên'}
                </span>
              </div>
              <h3 className="text-base sm:text-xl font-extrabold tracking-tight">
                {currentRole === 'recruiter' ? 'Thông Tin Doanh Nghiệp & Tuyển Dụng' : 'Hồ Sơ Cá Nhân Ứng Viên'}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
                {currentRole === 'recruiter'
                  ? 'Quản lý thông tin xác thực đơn vị tuyển dụng trực tiếp không qua trung gian.'
                  : 'Cập nhật thông tin ứng tuyển và đường dẫn Portfolio Google Sites của bạn.'}
              </p>
            </div>

            <button
              id="btn-close-login-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {actionMessage && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{actionMessage}</span>
            </div>
          )}

          {/* TAB 1: THÔNG TIN HỒ SƠ */}
          {activeTab === 'profile' && (
            <>
              {saveSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center text-white bg-emerald-600 shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Cập nhật thông tin thành công!
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Dữ liệu đã được lưu an toàn vào cơ sở dữ liệu hệ thống.
                  </p>
                </div>
              ) : currentRole === 'candidate' ? (
                /* FORM ỨNG VIÊN */
                <form onSubmit={handleCandidateSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Thị Mai Lan"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Giới tính</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      >
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        Email liên hệ
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@cuaban.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        Số điện thoại / Zalo
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="0912 345 678"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Công việc / Tình trạng hiện tại
                    </label>
                    <select
                      value={currentOccupation}
                      onChange={(e) => setCurrentOccupation(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    >
                      <option value="Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm">Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm</option>
                      <option value="Sinh viên năm cuối cần tìm việc / thực tập">Sinh viên năm cuối cần tìm việc / thực tập</option>
                      <option value="Học sinh / Sinh viên cao đẳng nghề">Học sinh / Sinh viên cao đẳng nghề</option>
                      <option value="Người chưa có kinh nghiệm thực tế">Người chưa có kinh nghiệm thực tế</option>
                      <option value="Đã có 1-2 năm kinh nghiệm">Đã có 1-2 năm kinh nghiệm</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Link Portfolio Google Sites (Khuyến nghị)
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                      placeholder="https://sites.google.com/view/ten-ban-portfolio"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-purple-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md"
                    >
                      Lưu thông tin hồ sơ
                    </button>
                  </div>
                </form>
              ) : (
                /* FORM NHÀ TUYỂN DỤNG */
                <form onSubmit={handleRecruiterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      Tên doanh nghiệp / Đơn vị tuyển dụng
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Mã số thuế / Giấy phép</label>
                      <input
                        type="text"
                        value={taxCode}
                        onChange={(e) => setTaxCode(e.target.value)}
                        placeholder="0108927164"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Người phụ trách nhân sự</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Trần Thị Thu Hà"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Email nhận CV</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Hotline / Zalo tiếp nhận</label>
                      <input
                        type="text"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="0988 123 456"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Địa chỉ nơi làm việc</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Hà Nội"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md"
                    >
                      Lưu thông tin doanh nghiệp
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* TAB 2: CÀI ĐẶT & QUY TRÌNH ĐỔI VAI TRÒ */}
          {activeTab === 'role-settings' && (
            <div className="space-y-4">
              {/* Current Role Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Vai trò hiện tại của tài khoản
                  </div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
                    {currentRole === 'recruiter' ? (
                      <>
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span>Nhà tuyển dụng (Recruiter)</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-5 h-5 text-emerald-600" />
                        <span>Ứng viên (Candidate)</span>
                      </>
                    )}
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Đã xác thực
                </span>
              </div>

              {/* Notice regarding Role change security */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Bảo mật phân quyền & Không đổi vai trò tự do ở trình duyệt</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Để bảo vệ hồ sơ ứng tuyển và tránh tranh chấp tin tuyển dụng doanh nghiệp, vai trò được xác thực trên máy chủ và cơ sở dữ liệu. Khi bạn gửi yêu cầu đổi vai trò, hệ thống sẽ lưu trạng thái chờ xử lý và giữ nguyên vai trò hiện tại cho đến khi được duyệt.
                </p>
              </div>

              {/* Role Change Request Status */}
              {roleChangeRequest?.status === 'pending' ? (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                    <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>Yêu cầu đổi vai trò đang chờ xử lý</span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1 pl-6">
                    <p>• Vai trò mong muốn: <strong className="text-blue-700">{roleChangeRequest.targetRole === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}</strong></p>
                    {roleChangeRequest.reason && (
                      <p>• Lý do: <span className="italic text-slate-600">{roleChangeRequest.reason}</span></p>
                    )}
                    <p className="text-[11px] text-slate-500">• Trạng thái: <strong>Đang chờ phê duyệt từ hệ thống</strong> (Vai trò hiện tại vẫn hoạt động bình thường).</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60">
                    <button
                      type="button"
                      onClick={handleCancelRoleChange}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                    >
                      Hủy yêu cầu đổi vai trò
                    </button>

                    <button
                      type="button"
                      onClick={handleApproveDemo}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer ml-auto flex items-center gap-1"
                      title="Mô phỏng phê duyệt ngay cho kiểm thử"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phê duyệt ngay (Demo)</span>
                    </button>
                  </div>
                </div>
              ) : confirmingRoleChange ? (
                /* Confirmation Step before Submitting */
                <div className="p-4 rounded-2xl border-2 border-blue-300 bg-blue-50/40 space-y-3 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900">
                        Xác nhận gửi yêu cầu chuyển sang: {targetRoleName}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        Bạn có chắc chắn muốn chuyển đổi sang vai trò <strong>{targetRoleName}</strong>? Giao diện và các chức năng sẽ được điều chỉnh đúng với vai trò mới sau khi được hệ thống phê duyệt.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700">Lý do đổi vai trò (tùy chọn):</label>
                    <textarea
                      rows={2}
                      value={roleChangeReason}
                      onChange={(e) => setRoleChangeReason(e.target.value)}
                      placeholder="Ví dụ: Tôi chuyển từ tìm việc sang đăng tin tuyển dụng cho công ty..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingRoleChange(false)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                    >
                      Hủy bỏ
                    </button>

                    <button
                      type="button"
                      disabled={isSubmittingRoleChange}
                      onClick={handleRequestRoleChange}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      {isSubmittingRoleChange ? (
                        <span>Đang gửi...</span>
                      ) : (
                        <span>Gửi yêu cầu đổi vai trò</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Button to Trigger Role Change Confirmation */
                <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Bạn muốn chuyển đổi vai trò?</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gửi yêu cầu để chuyển đổi không gian làm việc sang <strong>{targetRoleName}</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirmingRoleChange(true)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs border border-blue-600 text-blue-700 bg-blue-50/50 hover:bg-blue-100 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Yêu cầu chuyển sang: {targetRoleName}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TÀI KHOẢN MẪU & ĐĂNG XUẤT */}
          {activeTab === 'switch-account' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500">
                Bạn có thể chuyển nhanh giữa hai tài khoản demo đã được xác thực vai trò sẵn trong cơ sở dữ liệu:
              </div>

              {/* Demo Candidate Account */}
              <button
                type="button"
                onClick={() => {
                  onSwitchDemoAccount?.('candidate');
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'candidate'
                    ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Nguyễn Thị Mai Lan (Ứng viên)</div>
                    <div className="text-[11px] text-slate-500">mailan.nguyen@example.com • Vai trò: candidate</div>
                  </div>
                </div>

                {currentRole === 'candidate' ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="text-xs font-bold text-blue-600 hover:underline">Chuyển sang →</span>
                )}
              </button>

              {/* Demo Recruiter Account */}
              <button
                type="button"
                onClick={() => {
                  onSwitchDemoAccount?.('recruiter');
                  onClose();
                }}
                className={`w-full p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'recruiter'
                    ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Trần Thị Thu Hà (Công ty Tân Tiến)</div>
                    <div className="text-[11px] text-slate-500">tuyendung.tantien@example.vn • Vai trò: recruiter</div>
                  </div>
                </div>

                {currentRole === 'recruiter' ? (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                    Đang hoạt động
                  </span>
                ) : (
                  <span className="text-xs font-bold text-blue-600 hover:underline">Chuyển sang →</span>
                )}
              </button>

              {/* Logout Option */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100 transition-all font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
