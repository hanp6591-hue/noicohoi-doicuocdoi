import React, { useState, useMemo } from 'react';
import { JobAlert, Industry } from '../types';
import { 
  X, 
  Bell, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Building2,
  DollarSign,
  GraduationCap,
  ShieldAlert,
  Briefcase,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

export interface JobAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: JobAlert[];
  onAddAlert: (alert: JobAlert) => void;
  onRemoveAlert: (alertId: string) => void;
  onMarkAsRead?: (alertId: string) => void;
  onMarkAllAsRead?: () => void;
  onSelectJobById?: (jobId: string) => void;
  onNavigateToTab?: (tab: 'jobs' | 'anti-scam') => void;
  industries: Industry[];
}

export const JobAlertsModal: React.FC<JobAlertsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onAddAlert,
  onRemoveAlert,
  onMarkAsRead,
  onMarkAllAsRead,
  onSelectJobById,
  onNavigateToTab,
  industries
}) => {
  // Navigation inside notifications: 'list' or 'settings'
  const [activeView, setActiveView] = useState<'notifications' | 'create-alert'>('notifications');
  const [notificationCategory, setNotificationCategory] = useState<'all' | 'unread' | 'job' | 'security'>('all');

  // New alert form state
  const [alertKeyword, setAlertKeyword] = useState('');
  const [alertIndustry, setAlertIndustry] = useState('CNKT');
  const [alertCity, setAlertCity] = useState('Hà Nội');
  const [alertSalary, setAlertSalary] = useState('7-10 triệu');
  const [alertExp, setAlertExp] = useState('Không cần kinh nghiệm');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertAddedSuccess, setAlertAddedSuccess] = useState(false);

  // Derived counts
  const unreadCount = useMemo(() => {
    return alerts.filter(a => !a.isRead).length;
  }, [alerts]);

  const jobAlertsCount = useMemo(() => {
    return alerts.filter(a => a.type === 'job').length;
  }, [alerts]);

  const securityAlertsCount = useMemo(() => {
    return alerts.filter(a => a.type === 'security').length;
  }, [alerts]);

  // Filtered notifications
  const filteredAlerts = useMemo(() => {
    return alerts.filter((al) => {
      if (notificationCategory === 'unread') {
        return !al.isRead;
      }
      if (notificationCategory === 'job') {
        return al.type === 'job';
      }
      if (notificationCategory === 'security') {
        return al.type === 'security';
      }
      return true;
    });
  }, [alerts, notificationCategory]);

  if (!isOpen) return null;

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;

    const newAlert: JobAlert = {
      id: `alert-${Date.now()}`,
      type: 'job',
      title: `Việc làm mới phù hợp: ${alertKeyword.trim() || 'Vị trí mới'}`,
      message: `Hệ thống vừa tìm thấy cơ hội tuyển dụng mới trong ngành ${alertIndustry} tại ${alertCity}, yêu cầu: ${alertExp}.`,
      companyName: `Doanh nghiệp khối ${alertIndustry}`,
      industryCode: alertIndustry,
      city: alertCity,
      salaryText: alertSalary,
      salaryRange: alertSalary,
      experienceRequired: alertExp,
      userEmail: alertEmail.trim(),
      frequency: 'Tức thì',
      timestamp: 'Vừa xong',
      active: true,
      isRead: false,
      createdDate: new Date().toLocaleDateString('vi-VN')
    };

    onAddAlert(newAlert);
    setAlertAddedSuccess(true);
    setTimeout(() => {
      setAlertAddedSuccess(false);
      setAlertKeyword('');
      setAlertEmail('');
      setActiveView('notifications');
      setNotificationCategory('all');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-alerts-title"
      >
        {/* Modal Header: Độc lập chỉ dành riêng cho Thông báo */}
        <div 
          className="text-white p-4 sm:p-5 sm:px-6 flex items-center justify-between flex-shrink-0"
          style={{ 
            background: 'linear-gradient(135deg, #1E293B 0%, #28374D 100%)',
            borderBottom: '2px solid #FEC5E6'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: '#FEC5E6', color: '#1E293B' }}
            >
              <Bell className="w-5 h-5 fill-current text-slate-900" />
            </div>
            <div>
              <h2 id="job-alerts-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Thông báo</span>
                {unreadCount > 0 ? (
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-black shadow-2xs"
                    style={{ backgroundColor: '#FEC5E6', color: '#1E293B' }}
                  >
                    {unreadCount} chưa đọc
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                    {alerts.length} thông báo
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-300">
                Cập nhật việc làm mới, phản hồi ứng tuyển và cảnh báo an toàn việc làm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Đánh dấu tất cả thông báo là đã đọc"
              >
                <CheckCheck className="w-4 h-4 text-[#FFD273]" />
                <span>Đã đọc tất cả</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
              aria-label="Đóng cửa sổ thông báo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher: Danh sách thông báo vs Cài đặt nhận tin */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/90 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveView('notifications')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeView === 'notifications'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Hộp thư thông báo ({alerts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveView('create-alert')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                activeView === 'create-alert'
                  ? 'border-[#DEB5D7] text-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              style={activeView === 'create-alert' ? { backgroundColor: '#FFD273' } : undefined}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Cài đặt nhận tin mới</span>
            </button>
          </div>

          {activeView === 'notifications' && unreadCount > 0 && onMarkAllAsRead && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              className="sm:hidden text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3 h-3" />
              Đã đọc hết
            </button>
          )}
        </div>

        {/* Categories Bar when viewing notifications */}
        {activeView === 'notifications' && alerts.length > 0 && (
          <div className="px-4 sm:px-6 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setNotificationCategory('all')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                notificationCategory === 'all'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất cả ({alerts.length})
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setNotificationCategory('unread')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                  notificationCategory === 'unread'
                    ? 'border-[#f2a8d4] text-slate-900 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                style={notificationCategory === 'unread' ? { backgroundColor: '#FEC5E6' } : undefined}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                <span>Chưa đọc ({unreadCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setNotificationCategory('job')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                notificationCategory === 'job'
                  ? 'border-[#e6bd67] text-[#3d2b02] shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
              style={notificationCategory === 'job' ? { backgroundColor: '#FFD273' } : undefined}
            >
              <Briefcase className="w-3 h-3 text-amber-900" />
              <span>Việc làm mới ({jobAlertsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setNotificationCategory('security')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border shrink-0 cursor-pointer ${
                notificationCategory === 'security'
                  ? 'border-rose-300 bg-rose-100 text-rose-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Cảnh báo an toàn ({securityAlertsCount})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* VIEW 1: NOTIFICATION INBOX */}
          {activeView === 'notifications' && (
            <div>
              {alerts.length === 0 ? (
                <div className="text-center py-12 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-50" />
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    Hộp thư thông báo đang trống
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    Bạn chưa có thông báo nào. Khi doanh nghiệp đăng việc làm mới hoặc có cảnh báo tuyển dụng, hệ thống sẽ gửi thông báo tại đây.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveView('create-alert')}
                    className="px-4 py-2 rounded-xl text-slate-900 text-xs font-bold shadow-xs transition-all hover:opacity-90 cursor-pointer border border-[#FFD273]"
                    style={{ backgroundColor: '#FFD273' }}
                  >
                    Thiết lập nhận thông báo việc làm mới
                  </button>
                </div>
              ) : filteredAlerts.length === 0 ? (
                <div className="text-center py-10 px-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
                  <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-slate-600 font-bold mb-1">
                    Không có thông báo nào trong mục này
                  </p>
                  <button
                    type="button"
                    onClick={() => setNotificationCategory('all')}
                    className="text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                  >
                    Xem tất cả thông báo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAlerts.map((al) => {
                    const isSecurity = al.type === 'security';
                    const isApplication = al.type === 'application';
                    const isJob = al.type === 'job' || (!isSecurity && !isApplication);

                    return (
                      <div
                        key={al.id}
                        className={`p-4 rounded-2xl border transition-all shadow-2xs hover:shadow-md flex flex-col sm:flex-row items-start justify-between gap-3 ${
                          !al.isRead 
                            ? 'bg-amber-50/40 border-amber-200/90' 
                            : 'bg-white border-slate-200/90 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Type Icon Badge */}
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs mt-0.5"
                            style={{
                              backgroundColor: isSecurity 
                                ? '#FFE4E6' 
                                : isApplication 
                                ? '#E0F2FE' 
                                : '#FFD273',
                              color: isSecurity 
                                ? '#BE123C' 
                                : isApplication 
                                ? '#0369A1' 
                                : '#3D2B02'
                            }}
                          >
                            {isSecurity ? (
                              <ShieldAlert className="w-5 h-5 text-rose-600" />
                            ) : isApplication ? (
                              <CheckCircle2 className="w-5 h-5 text-sky-700" />
                            ) : (
                              <Briefcase className="w-5 h-5 text-amber-950" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {!al.isRead && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                                  MỚI
                                </span>
                              )}

                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                                {al.companyName || 'Hệ thống'}
                              </span>

                              {al.industryCode && al.industryCode !== 'ALL' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                                  Khối {al.industryCode}
                                </span>
                              )}

                              <span className="text-[11px] text-slate-400 ml-auto">
                                {al.timestamp || 'Gần đây'}
                              </span>
                            </div>

                            <h3 
                              className={`text-sm tracking-tight ${
                                !al.isRead 
                                  ? 'font-bold text-slate-900' 
                                  : 'font-semibold text-slate-800'
                              }`}
                            >
                              {al.title}
                            </h3>

                            {al.message && (
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {al.message}
                              </p>
                            )}

                            {/* Job Meta Tag Row if Job Alert */}
                            {isJob && (al.salaryText || al.city) && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px] text-slate-500">
                                {al.salaryText && (
                                  <span className="font-bold text-amber-700 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 text-amber-600" />
                                    {al.salaryText}
                                  </span>
                                )}
                                {al.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-400" />
                                    {al.city}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Action Links */}
                            <div className="pt-2 flex flex-wrap items-center gap-2">
                              {al.jobId && onSelectJobById && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onMarkAsRead) onMarkAsRead(al.id);
                                    onClose();
                                    onSelectJobById(al.jobId!);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-900 shadow-2xs hover:opacity-90 transition-all cursor-pointer border border-[#FFD273]"
                                  style={{ backgroundColor: '#FFD273' }}
                                >
                                  <span>Xem chi tiết việc làm</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {isSecurity && onNavigateToTab && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (onMarkAsRead) onMarkAsRead(al.id);
                                    onClose();
                                    onNavigateToTab('anti-scam');
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors cursor-pointer"
                                >
                                  <span>Xem cẩm nang an toàn & phòng tránh lừa đảo</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {onMarkAsRead && (
                                <button
                                  type="button"
                                  onClick={() => onMarkAsRead(al.id)}
                                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1"
                                >
                                  {al.isRead ? 'Đánh dấu chưa đọc' : 'Đánh dấu đã đọc'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Actions: Delete */}
                        <div className="flex items-center gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                          <button
                            type="button"
                            onClick={() => onRemoveAlert(al.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Xóa thông báo này"
                            aria-label="Xóa thông báo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: FORM CÀI ĐẶT CHUÔNG BÁO VIỆC LÀM MỚI */}
          {activeView === 'create-alert' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Cài đặt chuông báo việc làm mới tức thì
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập tiêu chí mong muốn. Hệ thống sẽ quét liên tục và tạo thông báo ngay khi doanh nghiệp đăng tuyển vị trí phù hợp (100% doanh nghiệp xác thực, 0đ chi phí).
                </p>

                {alertAddedSuccess ? (
                  <div 
                    className="p-3.5 border rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in"
                    style={{ backgroundColor: '#FEE686', borderColor: '#FFD273', color: '#3d2b02' }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Đã tạo thông báo việc làm mới thành công! Bạn có thể xem ngay trong hộp thư.</span>
                  </div>
                ) : (
                  <form onSubmit={handleCreateAlert} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Từ khóa vị trí mong muốn:
                        </label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Kho vận, Thực tập sinh, Kế toán, Lập trình..."
                          value={alertKeyword}
                          onChange={(e) => setAlertKeyword(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-purple-700" />
                          Khối ngành ưu tiên:
                        </label>
                        <select
                          value={alertIndustry}
                          onChange={(e) => setAlertIndustry(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                        >
                          {industries.map((ind) => (
                            <option key={ind.code} value={ind.code}>
                              {ind.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          Khu vực:
                        </label>
                        <select
                          value={alertCity}
                          onChange={(e) => setAlertCity(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                        >
                          <option value="Hà Nội">Hà Nội</option>
                          <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                          <option value="Đà Nẵng">Đà Nẵng</option>
                          <option value="Bình Dương">Bình Dương</option>
                          <option value="Cần Thơ">Cần Thơ</option>
                          <option value="Hải Phòng">Hải Phòng</option>
                          <option value="Toàn quốc">Toàn quốc</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                          <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                          Yêu cầu kinh nghiệm:
                        </label>
                        <select
                          value={alertExp}
                          onChange={(e) => setAlertExp(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                        >
                          <option value="Không cần kinh nghiệm">🌱 Không cần kinh nghiệm</option>
                          <option value="Có kinh nghiệm">Có kinh nghiệm</option>
                          <option value="Tất cả">Tất cả mức kinh nghiệm</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Email nhận tin <span className="text-rose-500">*</span>:
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="email@cuaban.com"
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#BFAEE3]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveView('notifications')}
                        className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Quay lại danh sách
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-slate-900 font-bold text-xs shadow-xs transition-all hover:opacity-90 cursor-pointer flex items-center gap-1.5 border border-[#DEB5D7]"
                        style={{ backgroundColor: '#FEC5E6' }}
                      >
                        <Plus className="w-3.5 h-3.5" /> Kích hoạt nhận thông báo ngay
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 sm:px-6 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Thông báo bảo mật, không chứa quảng cáo hay thư rác môi giới
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobAlertsModal;
