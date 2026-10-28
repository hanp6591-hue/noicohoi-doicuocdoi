import React from 'react';
import { Job } from '../types';
import { JobCard } from './JobCard';
import { 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  GraduationCap,
  Search
} from 'lucide-react';

interface JobListProps {
  jobs: Job[];
  savedJobIds: string[];
  onToggleSave: (jobId: string) => void;
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job) => void;
  onNavigateToEmployerPost?: () => void;
  experienceTab: 'all' | 'no-experience' | 'has-experience';
  onSelectExperienceTab: (tab: 'all' | 'no-experience' | 'has-experience') => void;
  noExpJobsCount: number;
  hasExpJobsCount: number;
  onResetFilters: () => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  savedJobIds,
  onToggleSave,
  onSelectJob,
  onQuickApply,
  experienceTab,
  onSelectExperienceTab,
  noExpJobsCount,
  hasExpJobsCount,
  onResetFilters
}) => {
  return (
    <div className="space-y-6">
      {/* Khung Hero Banner: Cân đối tỉ lệ 1376x768, hiển thị trọn vẹn 100% nội dung và chữ, không bị cắt xén */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-gradient-to-br from-[#F1F6FD] via-white to-[#EFF5FD]">
        <img 
          src="/Banner.jpg" 
          alt="Banner Nối cơ hội - Đổi cuộc đời" 
          className="w-full h-auto aspect-[1376/768] block object-contain select-none"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = '/hero_banner.jpg';
          }}
        />
      </div>

      {/* Quick Action Badges (Đã xóa nút đăng tuyển ở trang chủ theo yêu cầu, giữ lại ở menu ba gạch) */}
      <div className="flex flex-wrap items-center gap-2 pt-0.5">
        <button
          type="button"
          id="btn-hero-no-exp-filter"
          onClick={() => onSelectExperienceTab(experienceTab === 'no-experience' ? 'all' : 'no-experience')}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98 cursor-pointer border ${
            experienceTab === 'no-experience' 
              ? 'border-[#e6bd67] ring-2 ring-[#FFD273] shadow-md' 
              : 'border-amber-200/80 hover:bg-amber-50/60 text-slate-800'
          }`}
          style={{
            backgroundColor: experienceTab === 'no-experience' ? '#FFD273' : '#FFFDF5',
            color: '#3d2b02'
          }}
        >
          <Sparkles className="w-4 h-4 text-amber-950" />
          <span>Chưa có kinh nghiệm ({noExpJobsCount} việc)</span>
        </button>

        <button
          type="button"
          id="btn-hero-has-exp-filter"
          onClick={() => onSelectExperienceTab(experienceTab === 'has-experience' ? 'all' : 'has-experience')}
          className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl text-slate-900 text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-98 cursor-pointer border border-[#DEB5D7] ${
            experienceTab === 'has-experience' 
              ? 'border-[#f2a8d4] ring-2 ring-[#FEC5E6] shadow-md' 
              : 'border-pink-200/80 hover:bg-pink-50/60 text-slate-800'
          }`}
          style={{
            backgroundColor: experienceTab === 'has-experience' ? '#FEC5E6' : '#FFFDFD',
            color: '#1E293B'
          }}
        >
          <GraduationCap className="w-4 h-4 text-pink-700" />
          <span className="text-slate-900">Đã có kinh nghiệm ({hasExpJobsCount})</span>
        </button>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {experienceTab === 'no-experience' 
              ? 'Mục việc làm: Chưa có kinh nghiệm & Đào tạo từ đầu' 
              : experienceTab === 'has-experience' 
                ? 'Mục việc làm: Đã có kinh nghiệm' 
                : 'Tất cả vị trí việc làm tuyển dụng trực tiếp'}
          </h2>
          <span 
            className="px-2.5 py-0.5 rounded-full text-xs font-extrabold"
            style={{ backgroundColor: '#FEE686', color: '#1E293B' }}
          >
            {jobs.length} việc làm
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#3d2b02' }}>
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Cam kết trực tiếp • Tuyệt đối không thu phí</span>
        </div>
      </div>

      {/* Job Cards Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-dashed border-slate-300 p-12 text-center shadow-xs">
          <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            Không tìm thấy công việc phù hợp với tiêu chí lọc
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Bạn có thể thử đặt lại bộ lọc nâng cao trên thanh tiêu đề để tiếp cận thêm cơ hội việc làm.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl text-slate-900 text-xs font-bold cursor-pointer shadow-xs border border-[#FFD273]"
            style={{ backgroundColor: '#FFD273' }}
          >
            Xem lại tất cả việc làm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobIds.includes(job.id)}
              onToggleSave={onToggleSave}
              onSelectJob={onSelectJob}
              onQuickApply={onQuickApply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;
