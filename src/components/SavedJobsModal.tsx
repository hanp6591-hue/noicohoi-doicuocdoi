import React from 'react';
import { Job } from '../types';
import { 
  X, 
  Bookmark, 
  Trash2, 
  Building2, 
  MapPin, 
  DollarSign,
  Briefcase
} from 'lucide-react';

export interface SavedJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedJobs: Job[];
  onRemoveSavedJob: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job) => void;
}

export const SavedJobsModal: React.FC<SavedJobsModalProps> = ({
  isOpen,
  onClose,
  savedJobs,
  onRemoveSavedJob,
  onSelectJob,
  onQuickApply
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-t-[28px] sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-0 sm:my-6 max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="saved-jobs-title"
      >
        {/* Modal Header: Độc lập chỉ dành riêng cho Việc làm đã lưu */}
        <div 
          className="text-white p-4 sm:p-5 sm:px-6 flex items-center justify-between flex-shrink-0"
          style={{ 
            background: 'linear-gradient(135deg, #1E293B 0%, #28374D 100%)',
            borderBottom: '2px solid #DEB5D7'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: '#FFD273', color: '#1E293B' }}
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 id="saved-jobs-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Việc làm đã lưu</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-black shadow-2xs"
                  style={{ backgroundColor: '#FFD273', color: '#3d2b02' }}
                >
                  {savedJobs.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                Các vị trí việc làm bạn đã đánh dấu để theo dõi và ứng tuyển
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
            aria-label="Đóng cửa sổ việc làm đã lưu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Chỉ hiển thị danh sách việc làm đã lưu */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {savedJobs.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 210, 115, 0.25)' }}
              >
                <Bookmark className="w-8 h-8 text-amber-800" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Chưa có việc làm nào được lưu
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Nhấn vào biểu tượng dấu trang trên bất kỳ tin tuyển dụng nào bạn quan tâm để lưu lại và xem lại bất cứ lúc nào.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-slate-900 text-xs font-bold shadow-xs transition-all hover:opacity-90 cursor-pointer border border-[#FFD273]"
                style={{ backgroundColor: '#FFD273' }}
              >
                Khám phá danh sách việc làm ngay
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div 
                className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs"
                style={{
                  backgroundColor: 'rgba(255, 210, 115, 0.18)',
                  borderColor: 'rgba(255, 210, 115, 0.7)',
                  color: '#3d2b02'
                }}
              >
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>
                    Hiện có <strong>{savedJobs.length}</strong> công việc trong danh sách đã lưu. Bạn có thể xem chi tiết hoặc ứng tuyển trực tiếp bất kỳ lúc nào.
                  </span>
                </div>
                <span className="hidden sm:inline-block font-bold text-[11px] text-amber-900 bg-[#FFD273] px-2 py-0.5 rounded-md">
                  100% 0đ phí
                </span>
              </div>

              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/90 hover:border-[#DEB5D7] rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:shadow-md group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {job.industryCode}
                      </span>
                      {job.experienceRequired === 'no-experience' && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-[10px] font-extrabold border"
                          style={{ backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#3d2b02' }}
                        >
                          🌱 Không cần kinh nghiệm
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ Tuyển trực tiếp
                      </span>
                    </div>

                    <h4 
                      onClick={() => {
                        onClose();
                        onSelectJob(job);
                      }}
                      className="text-sm font-bold text-slate-900 hover:text-purple-800 cursor-pointer transition-colors line-clamp-2"
                      title={job.title}
                    >
                      {job.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.companyName}
                      </span>
                      <span className="flex items-center gap-1 text-amber-700 font-bold">
                        <DollarSign className="w-3.5 h-3.5 text-amber-600" /> {job.salaryText}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectJob(job);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Chi tiết
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onQuickApply(job);
                      }}
                      className="px-3.5 py-2 rounded-xl text-slate-900 font-bold text-xs shadow-xs transition-all hover:opacity-90 cursor-pointer border border-[#FFD273]"
                      style={{ backgroundColor: '#FFD273' }}
                    >
                      Ứng tuyển ngay
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveSavedJob(job.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Bỏ lưu việc làm này"
                      aria-label="Bỏ lưu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3.5 sm:px-6 flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] text-slate-500">
            Hồ sơ được gửi trực tiếp đến phòng nhân sự doanh nghiệp
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

export default SavedJobsModal;
