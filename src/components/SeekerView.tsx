import React from 'react';
import { Job, UserProfile, ApplicationRecord, JobAlert, Industry } from '../types';
import { 
  Building2, 
  MapPin, 
  RotateCcw, 
  Briefcase, 
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  DollarSign,
  Clock
} from 'lucide-react';
import { JobCard } from './JobCard';

export interface SeekerViewProps {
  userProfile?: UserProfile | null;
  onOpenProfileModal?: () => void;
  applications?: ApplicationRecord[];
  savedJobs: Job[];
  onToggleSaveJob: (jobId: string) => void;
  onSelectJobForDetail: (job: Job) => void;
  onQuickApply?: (job: Job) => void;
  alerts?: JobAlert[];
  onOpenAlertsModal?: () => void;
  allJobs: Job[];
  displayJobs?: Job[];
  industries?: Industry[];
  onOpenRoleModal?: () => void;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
  experienceTab?: 'all' | 'no-experience' | 'has-experience';
  selectedIndustry?: string;
  selectedCity?: string;
  selectedSalaryBand?: string;
  selectedJobType?: string;
  onResetFilters?: () => void;
}

export const SeekerView: React.FC<SeekerViewProps> = ({
  userProfile,
  savedJobs,
  onToggleSaveJob,
  onSelectJobForDetail,
  onQuickApply,
  allJobs,
  displayJobs,
  industries = [],
  searchTerm = '',
  experienceTab = 'all',
  selectedIndustry = 'all',
  selectedCity = 'all',
  selectedSalaryBand = 'all',
  selectedJobType = 'all',
  onResetFilters
}) => {
  const jobsToRender = displayJobs || allJobs;

  const selectedIndObj = industries.find(i => i.code === selectedIndustry);
  const hasActiveFilters = Boolean(
    searchTerm.trim() ||
    experienceTab !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedCity !== 'all' ||
    selectedSalaryBand !== 'all' ||
    selectedJobType !== 'all'
  );

  const candidateFirstName = userProfile?.isRegistered 
    ? userProfile.fullName.trim().split(' ').pop() || userProfile.fullName 
    : '';

  const userDesiredIndustryObj = userProfile?.desiredIndustry 
    ? industries.find(i => i.code === userProfile.desiredIndustry)
    : undefined;

  const suggestedJobs = (!hasActiveFilters && userDesiredIndustryObj)
    ? allJobs.filter(j => j.industryCode === userDesiredIndustryObj.code).slice(0, 3)
    : [];

  const getSalaryLabel = (band: string) => {
    switch (band) {
      case 'under-7': return 'Dưới 7 triệu';
      case '7-10': return '7 - 10 triệu';
      case '10-15': return '10 - 15 triệu';
      case 'above-15': return 'Trên 15 triệu';
      default: return band;
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'full-time': return 'Toàn thời gian';
      case 'part-time': return 'Bán thời gian';
      case 'internship': return 'Thực tập sinh';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER: Cân đối tỉ lệ 1376x768, hiển thị trọn vẹn 100% nội dung và chữ, không bị cắt xén trên mọi thiết bị */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-gradient-to-br from-[#F1F6FD] via-white to-[#EFF5FD]">
        <img 
          src="/Banner.jpg" 
          alt="Nối cơ hội - Đổi cuộc đời - Cơ hội việc làm đang chờ bạn" 
          className="w-full h-auto aspect-[1376/768] block object-contain select-none"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = '/hero_banner.jpg';
          }}
        />
      </div>

      {/* Greeting if registered */}
      {candidateFirstName && (
        <h2 className="text-base sm:text-lg font-black text-slate-900">
          Chào {candidateFirstName}, đây là việc làm dành cho bạn hôm nay 👋
        </h2>
      )}

      {/* Suggested jobs section */}
      {suggestedJobs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-extrabold text-slate-900">
              Gợi ý phù hợp với ngành bạn quan tâm: {userDesiredIndustryObj?.name}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {suggestedJobs.map(job => (
              <JobCard
                key={`suggested-${job.id}`}
                job={job}
                isSaved={savedJobs.some(s => s.id === job.id)}
                onToggleSave={onToggleSaveJob}
                onSelectJob={onSelectJobForDetail}
                onQuickApply={onQuickApply}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. FILTER SEARCH STATUS SUMMARY */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                Tổng số bài viết nhà tuyển dụng đăng: <strong className="text-blue-900">{allJobs.length} bài đăng</strong>
              </span>

              {hasActiveFilters && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                  Kết quả theo bộ lọc: <strong>{jobsToRender.length} bài đăng phù hợp</strong>
                </span>
              )}
            </div>

            {hasActiveFilters ? (
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 pt-1">
                <span>Yêu cầu tìm kiếm theo bộ lọc hiện tại:</span>
              </h2>
            ) : (
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2 pt-1">
                <span>Danh sách việc làm tuyển dụng trực tiếp (100% không thu phí):</span>
              </h2>
            )}
          </div>

          {hasActiveFilters && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-3.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc (Xem tất cả)</span>
            </button>
          )}
        </div>

        {/* Active Filters list */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Đang lọc theo:</span>

            {searchTerm.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-bold">
                Từ khóa: &quot;{searchTerm}&quot;
              </span>
            )}

            {experienceTab !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
                {experienceTab === 'no-experience' ? 'Chưa có kinh nghiệm' : 'Đã có kinh nghiệm'}
              </span>
            )}

            {selectedIndustry !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                <Building2 className="w-3.5 h-3.5 text-blue-700" />
                Khối ngành: {selectedIndObj ? selectedIndObj.name : selectedIndustry}
              </span>
            )}

            {selectedCity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                Khu vực: {selectedCity}
              </span>
            )}

            {selectedSalaryBand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                <DollarSign className="w-3.5 h-3.5 text-emerald-700" />
                Lương: {getSalaryLabel(selectedSalaryBand)}
              </span>
            )}

            {selectedJobType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 font-bold">
                <Clock className="w-3.5 h-3.5 text-slate-600" />
                Hình thức: {getJobTypeLabel(selectedJobType)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. JOB CARDS GRID */}
      <div>
        {jobsToRender.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-800">
              Không tìm thấy bài viết tuyển dụng nào phù hợp với bộ lọc
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Vui lòng thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh sách {allJobs.length} bài đăng tuyển dụng hiện có.
            </p>
            {onResetFilters && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  Xem toàn bộ {allJobs.length} bài tuyển dụng
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {jobsToRender.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.some(s => s.id === job.id)}
                onToggleSave={onToggleSaveJob}
                onSelectJob={onSelectJobForDetail}
                onQuickApply={onQuickApply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerView;
