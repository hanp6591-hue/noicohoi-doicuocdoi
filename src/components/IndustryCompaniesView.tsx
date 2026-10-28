import React, { useState } from 'react';
import { Industry, Company, Job } from '../types';
import { 
  ArrowLeft, 
  Building2, 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  Globe, 
  Phone, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface IndustryCompaniesViewProps {
  industry: Industry;
  companies: Company[];
  jobs: Job[];
  onBack: () => void;
  onSelectJob: (job: Job) => void;
  onQuickApply: (job: Job) => void;
}

export const IndustryCompaniesView: React.FC<IndustryCompaniesViewProps> = ({
  industry,
  companies,
  jobs,
  onBack,
  onSelectJob,
  onQuickApply
}) => {
  const [filterType, setFilterType] = useState<'all' | 'intern' | 'no-exp'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');

  // Filter companies that belong to this industry
  const industryCompanies = companies.filter(c => c.industryCode === industry.code);

  // Apply sub-filters
  const filteredCompanies = industryCompanies.filter(comp => {
    if (filterType === 'intern' && comp.internPositionsCount === 0) return false;
    if (filterType === 'no-exp' && comp.noExpPositionsCount === 0) return false;
    if (selectedCity !== 'all' && !comp.city.toLowerCase().includes(selectedCity.toLowerCase()) && comp.city !== 'Toàn quốc') {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Back Button & Industry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          id="btn-back-to-industries"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-sky-700 hover:border-sky-300 font-medium text-sm transition-colors cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục khối ngành
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="px-2 py-0.5 rounded-full bg-slate-100 font-medium">Khối ngành</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-900">{industry.name}</span>
        </div>
      </div>

      {/* Banner for the Selected Industry */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-3 py-1 rounded-md bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
              Mã khối ngành: {industry.code}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" /> Doanh nghiệp tuyển dụng trực tiếp 100%
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            {industry.name}
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
            Danh sách các công ty, doanh nghiệp đang tích cực tuyển dụng nhân viên chính thức hoặc tiếp nhận 
            <strong> sinh viên thực tập, ứng viên chưa có kinh nghiệm</strong> thuộc khối ngành {industry.shortName}. 
            Hồ sơ của bạn được gửi thẳng đến bộ phận nhân sự, không qua bất kỳ trung gian môi giới nào.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-xs text-slate-300 block">Doanh nghiệp tuyển dụng</span>
              <span className="text-xl font-bold text-white">{industryCompanies.length} công ty</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-xs text-slate-300 block">Vị trí đang mở</span>
              <span className="text-xl font-bold text-white">{industry.totalJobs} việc làm</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-emerald-400/30">
              <span className="text-xs text-emerald-300 block font-medium">Không cần kinh nghiệm</span>
              <span className="text-xl font-bold text-emerald-300">{industry.noExpJobsCount} vị trí</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3">
              <span className="text-xs text-slate-300 block">Thời gian phản hồi</span>
              <span className="text-xl font-bold text-white">{'< 48 giờ'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Lọc theo loại hình:
          </span>
          <button
            id="filter-all-companies"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả doanh nghiệp ({industryCompanies.length})
          </button>
          <button
            id="filter-intern-companies"
            onClick={() => setFilterType('intern')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'intern'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Tuyển sinh viên thực tập
          </button>
          <button
            id="filter-no-exp-companies"
            onClick={() => setFilterType('no-exp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              filterType === 'no-exp'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Tuyển không cần kinh nghiệm
          </button>
        </div>

        {/* Location select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Khu vực:</span>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
          >
            <option value="all">Tất cả địa điểm</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Toàn quốc">Toàn quốc / Nhiều chi nhánh</option>
          </select>
        </div>
      </div>

      {/* Companies List */}
      <div className="space-y-6">
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800 mb-1">
              Không tìm thấy doanh nghiệp phù hợp với bộ lọc
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Vui lòng thử chọn lại khu vực hoặc chuyển sang chế độ &quot;Tất cả doanh nghiệp&quot; để xem đầy đủ danh sách.
            </p>
            <button
              onClick={() => {
                setFilterType('all');
                setSelectedCity('all');
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 cursor-pointer"
            >
              Xem tất cả doanh nghiệp
            </button>
          </div>
        ) : (
          filteredCompanies.map((comp) => {
            // Find active jobs for this company
            const compJobs = jobs.filter(j => j.companyId === comp.id);

            return (
              <div
                key={comp.id}
                id={`company-detail-card-${comp.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all"
              >
                <div className="p-6">
                  {/* Top Company Info */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-5 border-b border-slate-100">
                    <div className="flex items-start gap-4">
                      <img
                        src={comp.logo}
                        alt={comp.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-slate-900">
                            {comp.name}
                          </h3>
                          {comp.isVerified && (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Doanh nghiệp xác thực
                            </span>
                          )}
                          {comp.directRecruitment && (
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> Tuyển trực tiếp
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl mb-3">
                          {comp.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {comp.address}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            MST: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{comp.taxId}</code>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 font-medium">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" /> Phản hồi: {comp.responseTime}
                          </span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {comp.rating} ({comp.reviewCount} đánh giá)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Direct Contact Links */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:min-w-[140px] w-full sm:w-auto pt-2 sm:pt-0">
                      {comp.website && (
                        <a
                          href={comp.website}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" /> Website công ty <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" /> {comp.phone}
                      </span>
                    </div>
                  </div>

                  {/* Active Positions / Internships Offered by this Company */}
                  <div className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-sky-600" /> 
                        Vị trí đang tuyển dụng tại khối {industry.shortName} ({compJobs.length})
                      </h4>
                      <div className="flex items-center gap-2">
                        {comp.internPositionsCount > 0 && (
                          <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                            {comp.internPositionsCount} vị trí thực tập
                          </span>
                        )}
                        {comp.noExpPositionsCount > 0 && (
                          <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-medium">
                            {comp.noExpPositionsCount} vị trí không cần kinh nghiệm
                          </span>
                        )}
                      </div>
                    </div>

                    {compJobs.length === 0 ? (
                      <div className="bg-slate-50 rounded-xl p-4 text-center text-xs text-slate-500">
                        Doanh nghiệp đang cập nhật các đợt tuyển dụng tiếp theo. Bạn có thể gửi CV trực tiếp qua email: <strong>{comp.email}</strong>.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {compJobs.map((job) => (
                          <div
                            key={job.id}
                            className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h5 
                                  onClick={() => onSelectJob(job)}
                                  className="text-sm font-bold text-slate-900 group-hover:text-sky-600 cursor-pointer transition-colors line-clamp-2"
                                >
                                  {job.title}
                                </h5>
                                {job.urgency && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 flex-shrink-0">
                                    Tuyển gấp
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
                                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                                  {job.salaryText}
                                </span>
                                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {job.city}
                                </span>
                                <span className={`px-2 py-0.5 rounded-md font-medium ${
                                  job.experienceRequired === 'no-experience' 
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200/60' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {job.experienceRequired === 'no-experience' ? '🌱 Không cần kinh nghiệm' : job.experienceText}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 mt-2">
                              <button
                                onClick={() => onSelectJob(job)}
                                className="text-xs font-semibold text-slate-600 hover:text-sky-600 cursor-pointer flex items-center gap-1"
                              >
                                Xem chi tiết công việc <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onQuickApply(job)}
                                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              >
                                Ứng tuyển ngay
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
