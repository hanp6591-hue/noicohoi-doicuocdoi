import React, { useState } from 'react';
import { Industry } from '../types';
import { 
  Search, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  Sparkles, 
  Filter, 
  X, 
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  GraduationCap
} from 'lucide-react';

interface GlassmorphicSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  experienceTab: 'all' | 'no-experience' | 'has-experience';
  onExperienceTabChange: (tab: 'all' | 'no-experience' | 'has-experience') => void;
  selectedIndustry: string;
  onIndustryChange: (ind: string) => void;
  selectedSubIndustry: string;
  onSubIndustryChange: (sub: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedSalaryBand: string;
  onSalaryBandChange: (band: string) => void;
  selectedJobType: string;
  onJobTypeChange: (type: string) => void;
  industries: Industry[];
  onReset: () => void;
  totalFilteredCount: number;
  totalNoExpCount: number;
}

export const GlassmorphicSearchBar: React.FC<GlassmorphicSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  experienceTab,
  onExperienceTabChange,
  selectedIndustry,
  onIndustryChange,
  selectedSubIndustry,
  onSubIndustryChange,
  selectedCity,
  onCityChange,
  selectedSalaryBand,
  onSalaryBandChange,
  selectedJobType,
  onJobTypeChange,
  industries,
  onReset,
  totalFilteredCount,
  totalNoExpCount
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Available sub-industries based on selected industry or all
  const currentIndustryObj = industries.find(i => i.code === selectedIndustry);
  const availableSubIndustries = currentIndustryObj 
    ? currentIndustryObj.subIndustries 
    : industries.flatMap(i => i.subIndustries.slice(0, 2));

  const hasActiveFilters = 
    searchTerm.trim() !== '' ||
    experienceTab !== 'all' ||
    selectedIndustry !== 'all' ||
    selectedSubIndustry !== 'all' ||
    selectedCity !== 'all' ||
    selectedSalaryBand !== 'all' ||
    selectedJobType !== 'all';

  return (
    <div className="w-full relative select-none">
      {/* Soft Gradient Ambient Glow */}
      <div 
        className="absolute -inset-1 rounded-[24px] opacity-70 blur-xl pointer-events-none transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(199, 215, 251, 0.7) 0%, rgba(241, 142, 144, 0.4) 40%, rgba(255, 211, 182, 0.5) 70%, rgba(173, 194, 65, 0.3) 100%)'
        }}
      />

      {/* Main Glassmorphism Container with 20px corners */}
      <div 
        className="relative z-10 rounded-[20px] p-3 sm:p-4 backdrop-blur-xl transition-all duration-300 border border-white/80"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          boxShadow: '0 12px 35px -8px rgba(191, 174, 227, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.8) inset'
        }}
      >
        {/* Top Search Input Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Primary Input with Elegant Icon */}
          <div className="relative flex-1 group">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
              <div 
                className="w-8 h-8 rounded-[12px] flex items-center justify-center shadow-xs transition-colors"
                style={{ backgroundColor: 'rgba(191, 174, 227, 0.45)', color: '#1E293B' }}
              >
                <Search className="w-4 h-4 stroke-[2.2] text-slate-800" />
              </div>
            </div>

            <input
              id="glassmorphic-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              placeholder="Tìm vị trí, kỹ năng, doanh nghiệp..."
              className="w-full pl-12 pr-9 py-3 sm:py-3.5 min-h-[44px] rounded-[16px] text-base sm:text-sm font-medium tracking-tight text-slate-800 placeholder-slate-400 bg-white/70 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-[#BFAEE3] focus:outline-hidden transition-all shadow-inner"
              style={{
                fontFamily: "'Be Vietnam Pro', 'Plus Jakarta Sans', sans-serif"
              }}
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchTermChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action Buttons: Filter Expand & Search Stats */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-toggle-advanced-filters"
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-[16px] text-xs font-bold transition-all cursor-pointer shadow-xs border"
              style={
                isFiltersExpanded || hasActiveFilters
                  ? {
                      backgroundColor: '#FFD273',
                      borderColor: '#e6bd67',
                      color: '#1E293B'
                    }
                  : {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: '#BFAEE3',
                      color: '#1E293B'
                    }
              }
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Bộ lọc nâng cao</span>
              {hasActiveFilters && (
                <span 
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{ backgroundColor: '#FFD273' }}
                />
              )}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFiltersExpanded ? 'rotate-180' : ''}`} />
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                id="btn-reset-filters"
                onClick={onReset}
                title="Xóa bộ lọc"
                className="p-3 rounded-[16px] text-slate-500 hover:text-rose-700 bg-white/70 hover:bg-white border border-slate-200/80 transition-all cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Section: Mục Kinh nghiệm gộp gọn (Segmented Control) & Ngành con chi tiết */}
        <div className="mt-3 pt-3 border-t border-slate-100/90 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase shrink-0 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#8d427d]" />
                Kinh nghiệm:
              </span>

              {/* Gộp gọn 3 lựa chọn kinh nghiệm vào một cụm điều khiển thống nhất */}
              <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/90 shadow-2xs gap-0.5">
                {/* Tab: Tất cả */}
                <button
                  type="button"
                  id="pill-exp-all"
                  onClick={() => onExperienceTabChange('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    experienceTab === 'all'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả
                </button>

                {/* Tab: Chưa có kinh nghiệm / Đào tạo từ đầu */}
                <button
                  type="button"
                  id="pill-no-experience"
                  onClick={() => onExperienceTabChange('no-experience')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    experienceTab === 'no-experience'
                      ? 'shadow-xs border border-[#e6bd67]'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  style={
                    experienceTab === 'no-experience'
                      ? { backgroundColor: '#FFD273', color: '#3d2b02' }
                      : undefined
                  }
                >
                  <Sparkles className="w-3 h-3 text-amber-900" />
                  <span>Chưa có kinh nghiệm</span>
                  <span 
                    className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold"
                    style={{ backgroundColor: '#FEE686', color: '#4a3b05' }}
                  >
                    {totalNoExpCount}
                  </span>
                </button>

                {/* Tab: Có kinh nghiệm */}
                <button
                  type="button"
                  id="pill-has-experience"
                  onClick={() => onExperienceTabChange('has-experience')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    experienceTab === 'has-experience'
                      ? 'shadow-xs border border-[#DEB5D7]'
                      : 'text-slate-700 hover:text-slate-900'
                  }`}
                  style={
                    experienceTab === 'has-experience'
                      ? { backgroundColor: '#FEC5E6', color: '#1E293B' }
                      : undefined
                  }
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-800" />
                  <span>Đã có kinh nghiệm</span>
                </button>
              </div>

              {/* Ngành con chi tiết dạng dropdown gọn gàng cạnh mục kinh nghiệm */}
              <div className="relative inline-flex items-center">
                <select
                  id="select-sub-industry-beside-exp"
                  value={selectedSubIndustry}
                  onChange={(e) => onSubIndustryChange(e.target.value)}
                  className="pl-2.5 pr-7 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs hover:border-[#DEB5D7] focus:outline-hidden cursor-pointer appearance-none"
                  style={
                    selectedSubIndustry !== 'all'
                      ? { backgroundColor: '#FFD273', borderColor: '#e6bd67', color: '#1E293B', fontWeight: 'bold' }
                      : undefined
                  }
                >
                  <option value="all">Ngành con chi tiết ({availableSubIndustries.length})</option>
                  {availableSubIndustries.map((sub, idx) => (
                    <option key={idx} value={sub}>{sub}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
              </div>

              {selectedSubIndustry !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSubIndustryChange('all')}
                  className="text-[11px] font-bold text-rose-600 hover:underline px-1 shrink-0 cursor-pointer"
                >
                  Xóa lọc ({selectedSubIndustry})
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-500 font-medium shrink-0 pt-0.5 sm:pt-0">
              Tìm thấy <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong> việc làm
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filters: Industry, Sub-industry, City, Salary, Job Type */}
        {isFiltersExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-200/80 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* 1. Khối ngành chính (CNKT, DVVT...) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" /> Khối ngành chính:
                </label>
                <select
                  id="filter-select-industry"
                  value={selectedIndustry}
                  onChange={(e) => {
                    onIndustryChange(e.target.value);
                    onSubIndustryChange('all');
                  }}
                  className="w-full px-3 py-2.5 sm:py-2 min-h-[42px] sm:min-h-0 rounded-[12px] border border-slate-300 text-xs sm:text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300 cursor-pointer"
                >
                  <option value="all">Tất cả khối ngành</option>
                  {industries.map((ind) => (
                    <option key={ind.code} value={ind.code}>
                      {ind.code} - {ind.shortName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Ngành con (Requirement: "Danh sách các ngành con") */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-slate-400" /> Ngành con chi tiết:
                </label>
                <select
                  id="filter-select-subindustry"
                  value={selectedSubIndustry}
                  onChange={(e) => onSubIndustryChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-[12px] border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300 cursor-pointer"
                >
                  <option value="all">Tất cả ngành con</option>
                  {availableSubIndustries.map((sub, idx) => (
                    <option key={idx} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Địa điểm */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> Địa điểm làm việc:
                </label>
                <select
                  id="filter-select-city"
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-[12px] border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300 cursor-pointer"
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

              {/* 4. Mức lương */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-slate-400" /> Mức lương:
                </label>
                <select
                  id="filter-select-salary"
                  value={selectedSalaryBand}
                  onChange={(e) => onSalaryBandChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-[12px] border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300 cursor-pointer"
                >
                  <option value="all">Tất cả mức lương</option>
                  <option value="under-7">Dưới 7 triệu / tháng</option>
                  <option value="7-10">7 - 10 triệu / tháng</option>
                  <option value="10-15">10 - 15 triệu / tháng</option>
                  <option value="above-15">Trên 15 triệu / tháng</option>
                </select>
              </div>

              {/* 5. Hình thức (Full time, Part time, Lâu dài, Thực tập) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Hình thức làm việc:
                </label>
                <select
                  id="filter-select-jobtype"
                  value={selectedJobType}
                  onChange={(e) => onJobTypeChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-[12px] border border-slate-300 text-xs bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-300 cursor-pointer"
                >
                  <option value="all">Tất cả hình thức</option>
                  <option value="full-time">Toàn thời gian (Full-time)</option>
                  <option value="part-time">Bán thời gian (Part-time)</option>
                  <option value="internship">Thực tập sinh (Internship)</option>
                </select>
              </div>
            </div>

            {/* Quick Industry Shortcuts */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-500 font-semibold">Khối ngành phổ biến:</span>
              {industries.map((ind) => (
                <button
                  type="button"
                  key={ind.code}
                  onClick={() => {
                    onIndustryChange(selectedIndustry === ind.code ? 'all' : ind.code);
                    onSubIndustryChange('all');
                  }}
                  className={`px-2 py-0.5 rounded-[8px] border transition-all cursor-pointer ${
                    selectedIndustry === ind.code
                      ? 'font-bold text-white shadow-2xs'
                      : 'bg-white/80 text-slate-600 hover:bg-white border-slate-200'
                  }`}
                  style={selectedIndustry === ind.code ? { backgroundColor: '#BFAEE3', borderColor: '#a592d4', color: '#1E293B' } : undefined}
                >
                  {ind.code} ({ind.shortName})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
