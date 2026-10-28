import React from 'react';
import { Job } from '../types';
import { COMPANIES_DATA } from '../data/mockData';
import { calcTransparencyScore } from '../utils/transparency';
import { 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onQuickApply?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  isSaved,
  onToggleSave,
  onSelectJob
}) => {
  const trans = calcTransparencyScore(job);

  const companyLogo = 
    job.companyLogo || 
    COMPANIES_DATA.find(c => c.id === job.companyId)?.logo || 
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80';

  return (
    <div 
      id={`job-card-${job.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-lg relative group select-none"
    >
      {/* Top Section: Photo + Tên nhà tuyển dụng (trên đầu, font to hơn) & Vị trí ứng tuyển (bên dưới) */}
      <div className="flex items-start justify-between gap-3">
        <div 
          onClick={() => onSelectJob(job)}
          className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
        >
          {/* Ảnh của nhà tuyển dụng phía trước tên */}
          <div className="relative shrink-0">
            <img 
              src={companyLogo} 
              alt={job.companyName} 
              className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-200/90 shadow-2xs group-hover:scale-105 transition-transform"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          {/* Cụm thông tin: Tên nhà tuyển dụng lên đầu (phông to hơn), vị trí cần ứng tuyển ở dưới */}
          <div className="min-w-0 flex-1">
            <h3 
              className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-1"
              title={job.companyName}
            >
              {job.companyName}
            </h3>

            <p 
              className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 line-clamp-2 leading-relaxed"
              title={job.title}
            >
              {job.title}
            </p>
          </div>
        </div>

        {/* Nút lưu tin */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(job.id);
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title={isSaved ? "Đã lưu - Nhấn để bỏ lưu" : "Nhấn để lưu việc làm"}
          aria-label={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 fill-current text-purple-700" />
          ) : (
            <Bookmark className="w-5 h-5 hover:text-purple-700" />
          )}
        </button>
      </div>

      {/* Badges: Điểm minh bạch + SLA */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <span 
          title="Điểm minh bạch tính từ thông tin tin đăng"
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            trans.level === 'high' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : trans.level === 'medium' 
              ? 'bg-amber-50 text-amber-900 border-amber-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          Minh bạch {trans.score}/100
        </span>
        {job.responseSlaHours ? (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
            Phản hồi trong {job.responseSlaHours} giờ
          </span>
        ) : null}
      </div>

      {/* Nút hành động duy nhất: Xem chi tiết */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        <button
          type="button"
          onClick={() => onSelectJob(job)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 active:scale-98 text-white transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
