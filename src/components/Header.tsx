import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, NavigationTab, Industry, AppUserRole, EmployerProfile } from '../types';
import { 
  Building2, 
  DollarSign, 
  Star, 
  FileText, 
  ShieldCheck, 
  Bell, 
  Bookmark, 
  Sparkles,
  Menu,
  X,
  User,
  GraduationCap,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Check,
  RotateCcw,
  MapPin,
  Clock,
  UserCheck,
  PlusCircle,
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowRightLeft
} from 'lucide-react';

export interface HeaderProps {
  currentRole: AppUserRole;
  onRoleChange?: (role: AppUserRole) => void;
  onOpenRoleModal?: () => void;
  onLogoClick?: () => void;
  applicationsCount: number;
  pendingReplyCount?: number;
  overdueReplyCount?: number;
  jobAttentionCount?: number;
  employerProfile: EmployerProfile;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  savedCount: number;
  alertsCount: number;
  onOpenSaved: () => void;
  onOpenAlerts: () => void;
  userProfile: UserProfile | null;
  onOpenLogin: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  experienceTab: 'all' | 'no-experience' | 'has-experience';
  onExperienceTabChange: (tab: 'all' | 'no-experience' | 'has-experience') => void;
  selectedIndustry: string;
  onIndustryChange: (ind: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedSalaryBand: string;
  onSalaryBandChange: (band: string) => void;
  selectedJobType: string;
  onJobTypeChange: (type: string) => void;
  industries: Industry[];
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalNoExpCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenRoleModal,
  onLogoClick,
  applicationsCount,
  pendingReplyCount = 0,
  overdueReplyCount = 0,
  jobAttentionCount = 0,
  employerProfile,
  activeTab,
  onTabChange,
  savedCount,
  alertsCount,
  onOpenSaved,
  onOpenAlerts,
  userProfile,
  onOpenLogin,
  searchTerm,
  onSearchTermChange,
  experienceTab,
  onExperienceTabChange,
  selectedIndustry,
  onIndustryChange,
  selectedCity,
  onCityChange,
  selectedSalaryBand,
  onSalaryBandChange,
  selectedJobType,
  onJobTypeChange,
  industries,
  onResetFilters,
  totalFilteredCount,
  totalNoExpCount
}) => {
  const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [facebookMenuOpen, setFacebookMenuOpen] = useState(false);

  const experienceDropdownRef = useRef<HTMLDivElement>(null);
  const mobileExperienceDropdownRef = useRef<HTMLDivElement>(null);
  const facebookMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const notDesktopExp = !experienceDropdownRef.current || !experienceDropdownRef.current.contains(target);
      const notMobileExp = !mobileExperienceDropdownRef.current || !mobileExperienceDropdownRef.current.contains(target);

      if (notDesktopExp && notMobileExp) {
        setIsExperienceDropdownOpen(false);
      }
      if (facebookMenuRef.current && !facebookMenuRef.current.contains(target)) {
        setFacebookMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFacebookMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const hasActiveFilters = 
    searchTerm.trim() !== '' ||
    experienceTab !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedCity !== 'all' ||
    selectedSalaryBand !== 'all' ||
    selectedJobType !== 'all';

  const recruiterMenuItems = [
    { id: 'employer-overview' as NavigationTab, label: 'Tổng quan', desc: 'Việc cần xử lý hôm nay', icon: LayoutDashboard },
    { id: 'employer-post' as NavigationTab, label: 'Đăng tin mới', desc: 'Tạo tin tuyển dụng', icon: PlusCircle },
    { id: 'employer-candidates' as NavigationTab, label: 'Hồ sơ ứng viên', desc: 'Xem và xử lý hồ sơ', icon: Users },
    { id: 'employer-my-jobs' as NavigationTab, label: 'Quản lý tin đăng', desc: 'Trạng thái, hạn nộp, số hồ sơ', icon: Briefcase }
  ];

  const candidateMenuItems = [
    { id: 'jobs' as NavigationTab, label: 'Việc làm phù hợp', desc: 'Tìm kiếm, lọc việc làm & xem chi tiết tuyển dụng', icon: Briefcase },
    { id: 'salary' as NavigationTab, label: 'Mức lương thị trường', desc: 'So sánh mức lương thị trường & bí quyết deal lương', icon: DollarSign },
    { id: 'reviews' as NavigationTab, label: 'Đánh giá tuyển dụng', desc: 'Review phỏng vấn & quy trình tuyển dụng thực tế', icon: Star },
    { id: 'cv-guide' as NavigationTab, label: 'Gợi ý CV & Portfolio', desc: 'Hướng dẫn viết CV & tạo Portfolio Google Sites miễn phí', icon: FileText },
    { id: 'anti-scam' as NavigationTab, label: 'Phòng tránh lừa đảo', desc: 'Cẩm nang nhận biết bẫy lừa đảo & việc làm trung gian', icon: ShieldCheck }
  ];

  const menuItems = currentRole === 'recruiter' ? recruiterMenuItems : candidateMenuItems;

  const handleSelectMenuTab = (tab: NavigationTab) => {
    onTabChange(tab);
    setFacebookMenuOpen(false);
  };

  const handleRoleSwitchClick = (targetRole: AppUserRole) => {
    if (onRoleChange) {
      onRoleChange(targetRole);
    } else if (onOpenRoleModal) {
      onOpenRoleModal();
    }
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    } else {
      onTabChange(currentRole === 'recruiter' ? 'employer-overview' : 'jobs');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2 font-bold shrink-0">
            <span className="font-extrabold text-white inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              100% Tuyển Trực Tiếp Không Qua Trung Gian
            </span>
            <span className="hidden sm:inline text-slate-400 font-medium">• Tuyệt đối 0đ phí ứng viên</span>
          </div>

          {/* Current Role Badge & Quick Switch Button in Banner */}
          <div className="flex items-center gap-2 text-xs">
            <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold border shadow-xs ${
              currentRole === 'recruiter'
                ? 'bg-blue-900/80 text-blue-200 border-blue-700/60'
                : 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60'
            }`}>
              {currentRole === 'recruiter' ? (
                <>
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Vai trò: Nhà tuyển dụng</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vai trò: Ứng viên</span>
                </>
              )}
            </span>

            <button
              type="button"
              id="btn-switch-role-top-banner"
              onClick={() => handleRoleSwitchClick(currentRole === 'recruiter' ? 'candidate' : 'recruiter')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border border-white/20 transition-all cursor-pointer"
              title="Đổi sang vai trò khác"
            >
              <ArrowRightLeft className="w-3 h-3 text-[#FFD273]" />
              <span>Chuyển sang {currentRole === 'recruiter' ? 'Ứng viên' : 'Nhà tuyển dụng'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {/* Logo - Hoạt động chính xác trên cả máy tính và điện thoại, luôn về trang chủ tương ứng */}
            <button 
              type="button"
              id="btn-header-logo"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0 transition-transform active:scale-95"
              title="Về trang chủ Nối cơ hội - Đổi cuộc đời"
              aria-label="Về trang chủ"
            >
              <img 
                src="/app_logo.png" 
                alt="Logo Nối cơ hội - Đổi cuộc đời" 
                referrerPolicy="no-referrer"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-sm group-hover:scale-105 group-hover:drop-shadow-md transition-all"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-800 transition-colors">
                  Nối cơ hội
                </span>
                <span className="text-[10px] font-extrabold text-amber-600 tracking-tight leading-tight mt-0.5">
                  Đổi cuộc đời
                </span>
              </div>
            </button>
          </div>

          {/* Center Content: Recruiter Company Info OR Candidate Search Bar */}
          {currentRole === 'recruiter' ? (
            <div className="hidden md:flex flex-1 max-w-2xl mx-2 items-center gap-3 px-4 py-2 bg-blue-50/70 border border-blue-200/90 rounded-2xl shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-slate-900 truncate flex items-center gap-2">
                  <span>{employerProfile.companyName || 'Doanh nghiệp tuyển trực tiếp'}</span>
                  <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-emerald-100 text-emerald-800">
                    Xác thực 100%
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  MST: {employerProfile.taxCode || '0108927164'} • {employerProfile.address || 'Hà Nội'}
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 max-w-2xl mx-2">
              <div className="w-full relative flex items-center bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white rounded-2xl border border-slate-200/90 focus-within:border-[#BFAEE3] focus-within:ring-2 focus-within:ring-[#BFAEE3]/40 transition-all shadow-inner px-2.5 py-1">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  id="header-search-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    onSearchTermChange(e.target.value);
                    if (activeTab !== 'jobs') onTabChange('jobs');
                  }}
                  placeholder="Tìm việc làm, vị trí, kỹ năng..."
                  className="w-full pl-2 pr-2 py-1 text-xs sm:text-sm font-medium bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => onSearchTermChange('')}
                    className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Xóa từ khóa"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className="h-5 w-px bg-slate-300/80 mx-1 shrink-0" />

                {/* Experience Dropdown */}
                <div className="relative shrink-0" ref={experienceDropdownRef}>
                  <button
                    type="button"
                    id="btn-header-exp-dropdown"
                    onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs"
                    style={
                      experienceTab === 'no-experience'
                        ? { backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }
                        : experienceTab === 'has-experience'
                        ? { backgroundColor: '#FEC5E6', borderColor: '#f2a8d4', color: '#1E293B' }
                        : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#475569' }
                    }
                    title="Lọc theo mức độ kinh nghiệm"
                  >
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">
                      {experienceTab === 'no-experience' 
                        ? 'Chưa có KN' 
                        : experienceTab === 'has-experience' 
                        ? 'Đã có KN' 
                        : 'Kinh nghiệm'}
                    </span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isExperienceDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Chọn mức kinh nghiệm
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onExperienceTabChange('all');
                          setIsExperienceDropdownOpen(false);
                          if (activeTab !== 'jobs') onTabChange('jobs');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                          experienceTab === 'all' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'
                        }`}
                      >
                        <span>Tất cả kinh nghiệm</span>
                        {experienceTab === 'all' && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </button>

                      <button
                        type="button"
                        id="opt-exp-no-experience"
                        onClick={() => {
                          onExperienceTabChange('no-experience');
                          setIsExperienceDropdownOpen(false);
                          if (activeTab !== 'jobs') onTabChange('jobs');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                          experienceTab === 'no-experience' ? 'text-amber-900 bg-amber-50/70' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                          <span>Chưa có kinh nghiệm</span>
                        </div>
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFD273] text-[#3d2b02]">
                          {totalNoExpCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        id="opt-exp-has-experience"
                        onClick={() => {
                          onExperienceTabChange('has-experience');
                          setIsExperienceDropdownOpen(false);
                          if (activeTab !== 'jobs') onTabChange('jobs');
                        }}
                        className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-pink-50 cursor-pointer ${
                          experienceTab === 'has-experience' ? 'text-pink-900 bg-pink-50/70' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-pink-700" />
                          <span>Đã có kinh nghiệm</span>
                        </div>
                        {experienceTab === 'has-experience' && <Check className="w-3.5 h-3.5 text-pink-900" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter toggle */}
                <button
                  type="button"
                  id="btn-header-advanced-filters"
                  onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                  className={`ml-1 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border shrink-0 shadow-2xs ${
                    isAdvancedFiltersOpen || hasActiveFilters
                      ? 'bg-[#FFD273] border-[#e6bd67] text-[#1E293B]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Mở bộ lọc nâng cao (Khối ngành, Địa điểm, Mức lương, Hình thức)"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Bộ lọc</span>
                  {hasActiveFilters && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                  )}
                </button>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="ml-1 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white cursor-pointer transition-colors"
                    title="Đặt lại bộ lọc"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {currentRole === 'recruiter' ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  id="btn-header-recruiter-candidates"
                  onClick={() => onTabChange('employer-candidates')}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-95"
                  style={{
                    backgroundColor: applicationsCount > 0 ? '#FFD273' : '#ffffff',
                    borderColor: applicationsCount > 0 ? '#e6bd67' : '#e2e8f0',
                    color: applicationsCount > 0 ? '#3d2b02' : '#334155'
                  }}
                  title={`Hiện có ${applicationsCount} hồ sơ CV ứng tuyển`}
                >
                  <Users className="w-3.5 h-3.5 shrink-0" />
                  <span>{applicationsCount} hồ sơ CV</span>
                </button>

                <button
                  type="button"
                  id="btn-header-recruiter-profile"
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-2xs active:scale-95"
                  title="Cài đặt tài khoản & Doanh nghiệp"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-black">
                    <Building2 className="w-3 h-3 text-amber-800" />
                  </div>
                  <span className="hidden md:inline max-w-[120px] truncate">
                    {(employerProfile.contactName || '').split('(')[0].trim() || 'Tài khoản'}
                  </span>
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  id="btn-header-saved-direct"
                  onClick={onOpenSaved}
                  className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#DEB5D7] bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-2xs active:scale-95"
                  title="Việc làm đã lưu"
                >
                  <Bookmark className="w-4 h-4 text-purple-700 shrink-0" />
                  <span className="hidden sm:inline">Việc làm đã lưu</span>
                  <span 
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-black shadow-2xs border border-white"
                    style={{
                      backgroundColor: savedCount > 0 ? '#FFD273' : '#F1F5F9',
                      color: savedCount > 0 ? '#3d2b02' : '#64748b'
                    }}
                  >
                    {savedCount}
                  </span>
                </button>

                <button
                  type="button"
                  id="btn-header-alerts-direct"
                  onClick={onOpenAlerts}
                  className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#DEB5D7] bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-2xs active:scale-95"
                  title="Thông báo việc làm"
                >
                  <Bell className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="hidden sm:inline">Thông báo</span>
                  {alertsCount > 0 && (
                    <span 
                      className="px-1.5 py-0.2 rounded-full text-[10px] font-black shadow-2xs border border-white"
                      style={{ backgroundColor: '#FEC5E6', color: '#1E293B' }}
                    >
                      {alertsCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  id="btn-header-user-profile"
                  onClick={onOpenLogin}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  style={
                    userProfile?.isRegistered
                      ? {
                          backgroundColor: 'rgba(255, 210, 115, 0.25)',
                          borderColor: '#FFD273'
                        }
                      : {
                          backgroundColor: '#FEE686',
                          borderColor: '#FFD273'
                        }
                  }
                  title={userProfile?.isRegistered ? 'Hồ sơ người dùng' : 'Đăng nhập thông tin cá nhân'}
                >
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center text-slate-900 text-[10px] font-black"
                    style={{ backgroundColor: userProfile?.isRegistered ? '#FFD273' : '#FEC5E6' }}
                  >
                    {userProfile?.isRegistered ? userProfile.fullName.charAt(0) : <User className="w-3 h-3 text-slate-800" />}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">
                    {userProfile?.isRegistered ? userProfile.fullName : 'Đăng nhập'}
                  </span>
                </button>
              </>
            )}

            {/* Hamburger Menu */}
            <div className="relative" ref={facebookMenuRef}>
              <button
                type="button"
                id="btn-facebook-hamburger-menu"
                onClick={() => setFacebookMenuOpen(!facebookMenuOpen)}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl border transition-all cursor-pointer shadow-2xs hover:bg-slate-50 active:scale-95"
                style={{
                  backgroundColor: facebookMenuOpen ? 'rgba(255, 210, 115, 0.4)' : '#ffffff',
                  borderColor: facebookMenuOpen ? '#FFD273' : '#e2e8f0'
                }}
                title="Menu"
                aria-label="Menu"
                aria-haspopup="menu"
                aria-expanded={facebookMenuOpen}
              >
                <div className="w-4 h-3.5 flex flex-col justify-between items-center pointer-events-none">
                  <span className={`w-full h-[2.5px] rounded-full bg-slate-800 transition-all ${facebookMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
                  <span className={`w-full h-[2.5px] rounded-full bg-slate-800 transition-all ${facebookMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-[2.5px] rounded-full bg-slate-800 transition-all ${facebookMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
                </div>
              </button>

              {facebookMenuOpen && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-[min(21rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="space-y-0.5">
                    {menuItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      const badgeInfo =
                        item.id === 'employer-candidates'
                          ? { n: pendingReplyCount, danger: overdueReplyCount > 0 }
                          : item.id === 'employer-my-jobs'
                          ? { n: jobAttentionCount, danger: false }
                          : { n: 0, danger: false };

                      return (
                        <button
                          key={item.id}
                          id={`menu-item-${item.id}`}
                          type="button"
                          role="menuitem"
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => handleSelectMenuTab(item.id)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer border focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#FFD273] ${
                            isActive
                              ? 'bg-amber-50 border-amber-200 shadow-[inset_3px_0_0_#FFD273]'
                              : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive ? 'bg-[#FFD273] text-[#3d2b02]' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            <Icon className="w-4 h-4 stroke-[2.2]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-900">{item.label}</div>
                            <div className="text-[11px] text-slate-500 leading-snug">{item.desc}</div>
                          </div>
                          {badgeInfo.n > 0 && (
                            <span
                              className={`shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black flex items-center justify-center ${
                                badgeInfo.danger ? 'bg-rose-600 text-white' : 'bg-amber-200 text-amber-950'
                              }`}
                            >
                              {badgeInfo.n}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar for Candidate */}
        {currentRole === 'candidate' && (
          <div className="md:hidden mt-2 pt-2 border-t border-slate-100">
            <div className="relative flex items-center bg-slate-100/90 rounded-2xl border border-slate-200/90 px-2.5 py-1">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  onSearchTermChange(e.target.value);
                  if (activeTab !== 'jobs') onTabChange('jobs');
                }}
                placeholder="Tìm việc làm, vị trí, công ty..."
                className="w-full pl-2 pr-1 py-1 text-xs font-medium bg-transparent focus:outline-hidden text-slate-800 placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => onSearchTermChange('')}
                  className="p-1 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Mobile Experience Selector */}
              <div className="relative shrink-0 ml-1" ref={mobileExperienceDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold border"
                  style={
                    experienceTab === 'no-experience'
                      ? { backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }
                      : experienceTab === 'has-experience'
                      ? { backgroundColor: '#FEC5E6', borderColor: '#f2a8d4', color: '#1E293B' }
                      : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#475569' }
                  }
                >
                  <span>
                    {experienceTab === 'no-experience' 
                      ? 'Chưa KN' 
                      : experienceTab === 'has-experience' 
                      ? 'Đã KN' 
                      : 'Kinh nghiệm'}
                  </span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isExperienceDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-[min(14rem,calc(100vw-1.5rem))] bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn mức kinh nghiệm
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onExperienceTabChange('all');
                        setIsExperienceDropdownOpen(false);
                        if (activeTab !== 'jobs') onTabChange('jobs');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                        experienceTab === 'all' ? 'text-slate-900 font-bold bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <span>Tất cả kinh nghiệm</span>
                      {experienceTab === 'all' && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onExperienceTabChange('no-experience');
                        setIsExperienceDropdownOpen(false);
                        if (activeTab !== 'jobs') onTabChange('jobs');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-amber-50 cursor-pointer ${
                        experienceTab === 'no-experience' ? 'text-amber-900 bg-amber-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                        <span>Chưa có kinh nghiệm</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#FFD273] text-[#3d2b02]">
                        {totalNoExpCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onExperienceTabChange('has-experience');
                        setIsExperienceDropdownOpen(false);
                        if (activeTab !== 'jobs') onTabChange('jobs');
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-bold flex items-center justify-between hover:bg-pink-50 cursor-pointer ${
                        experienceTab === 'has-experience' ? 'text-pink-900 bg-pink-50/70' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-pink-700" />
                        <span>Đã có kinh nghiệm</span>
                      </div>
                      {experienceTab === 'has-experience' && <Check className="w-3.5 h-3.5 text-pink-900" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold border shrink-0 ${
                  isAdvancedFiltersOpen || hasActiveFilters
                    ? 'bg-[#FFD273] border-[#e6bd67] text-[#1E293B]'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Candidate Advanced Filters Drawer */}
        {currentRole === 'candidate' && isAdvancedFiltersOpen && (
          <div className="mt-2.5 pt-2.5 border-t border-slate-200/90 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="bg-slate-50/90 rounded-2xl p-3 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-700">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8d427d]" />
                  Bộ lọc nâng cao
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-normal">
                    Tìm thấy <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong> việc làm
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Xóa lọc
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-purple-700" />
                    Khối ngành tuyển dụng:
                  </label>
                  <select
                    id="filter-select-industry-header"
                    value={selectedIndustry}
                    onChange={(e) => {
                      onIndustryChange(e.target.value);
                      if (activeTab !== 'jobs') onTabChange('jobs');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3] cursor-pointer"
                  >
                    <option value="all">Tất cả các ngành</option>
                    {industries.map((ind) => (
                      <option key={ind.code} value={ind.code}>
                        {ind.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    Địa điểm làm việc:
                  </label>
                  <select
                    id="filter-select-city-header"
                    value={selectedCity}
                    onChange={(e) => {
                      onCityChange(e.target.value);
                      if (activeTab !== 'jobs') onTabChange('jobs');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3] cursor-pointer"
                  >
                    <option value="all">Tất cả địa điểm</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Toàn quốc">Toàn quốc / Nhiều chi nhánh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-700" />
                    Mức lương:
                  </label>
                  <select
                    id="filter-select-salary-header"
                    value={selectedSalaryBand}
                    onChange={(e) => {
                      onSalaryBandChange(e.target.value);
                      if (activeTab !== 'jobs') onTabChange('jobs');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3] cursor-pointer"
                  >
                    <option value="all">Tất cả mức lương</option>
                    <option value="under-7">Dưới 7 triệu / tháng</option>
                    <option value="7-10">7 - 10 triệu / tháng</option>
                    <option value="10-15">10 - 15 triệu / tháng</option>
                    <option value="above-15">Trên 15 triệu / tháng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-700" />
                    Hình thức làm việc:
                  </label>
                  <select
                    id="filter-select-jobtype-header"
                    value={selectedJobType}
                    onChange={(e) => {
                      onJobTypeChange(e.target.value);
                      if (activeTab !== 'jobs') onTabChange('jobs');
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3] cursor-pointer"
                  >
                    <option value="all">Tất cả hình thức</option>
                    <option value="full-time">Toàn thời gian (Full-time)</option>
                    <option value="part-time">Bán thời gian (Part-time)</option>
                    <option value="internship">Thực tập sinh (Internship)</option>
                  </select>
                </div>
              </div>

              {/* Industry Tags */}
              <div className="pt-2.5 border-t border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
                    <Building2 className="w-3.5 h-3.5 text-purple-700" />
                    Tất cả các ngành (Tên đầy đủ rõ ràng):
                  </span>
                  {selectedIndustry !== 'all' && (
                    <button
                      type="button"
                      onClick={() => onIndustryChange('all')}
                      className="text-rose-600 hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Xem tất cả ngành
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onIndustryChange('all');
                      if (activeTab !== 'jobs') onTabChange('jobs');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      selectedIndustry === 'all'
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    Tất cả các ngành
                  </button>

                  {industries.map((ind) => {
                    const isSelected = selectedIndustry === ind.code;
                    return (
                      <button
                        key={ind.code}
                        type="button"
                        onClick={() => {
                          onIndustryChange(isSelected ? 'all' : ind.code);
                          if (activeTab !== 'jobs') onTabChange('jobs');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1.5 ${
                          isSelected
                            ? 'shadow-xs font-bold text-slate-900 border-[#e6bd67]'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                        style={isSelected ? { backgroundColor: '#FFD273' } : undefined}
                      >
                        <span>{ind.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
