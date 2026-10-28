import React from 'react';
import { Industry } from '../types';
import { 
  Cpu, 
  Truck, 
  TrendingUp, 
  Megaphone, 
  GraduationCap, 
  HeartPulse, 
  Utensils, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  Sparkles, 
  CheckCircle2,
  Users,
  Layers
} from 'lucide-react';

interface IndustryDirectoryProps {
  industries: Industry[];
  onSelectIndustry: (industryCode: string) => void;
  onBrowseJobsByIndustry: (industryCode: string) => void;
}

export const IndustryDirectory: React.FC<IndustryDirectoryProps> = ({
  industries,
  onSelectIndustry,
  onBrowseJobsByIndustry
}) => {
  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-[#9a4d87]" />;
      case 'Truck':
        return <Truck className="w-6 h-6 text-[#9a4d87]" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#9a4d87]" />;
      case 'Megaphone':
        return <Megaphone className="w-6 h-6 text-[#9a4d87]" />;
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-[#9a4d87]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-[#9a4d87]" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6 text-[#9a4d87]" />;
      default:
        return <Building2 className="w-6 h-6 text-[#9a4d87]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Intro Banner */}
      <div 
        className="text-white rounded-[24px] p-6 sm:p-8 shadow-lg relative overflow-hidden border"
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #28374D 50%, #1E293B 100%)',
          borderColor: 'rgba(191, 174, 227, 0.4)'
        }}
      >
        <div 
          className="absolute -top-10 -right-10 w-52 h-52 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: '#DEB5D7' }}
        />
        <div 
          className="absolute -bottom-10 left-1/3 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: '#FFD273' }}
        />

        <div className="relative z-10 max-w-3xl">
          <div 
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs"
            style={{ backgroundColor: '#FEE686', color: '#4a3b05' }}
          >
            <Building2 className="w-3.5 h-3.5" /> Danh mục khối ngành trọng điểm: CNKT, DVVT, KTTM...
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            Danh sách khối ngành & mạng lưới doanh nghiệp tuyển dụng
          </h2>

          <p className="text-pink-100 text-xs sm:text-sm leading-relaxed mb-4">
            Nhấp vào bất kỳ khối ngành nào bên dưới để chuyển tiếp trực tiếp sang danh sách 
            <strong> các công ty, doanh nghiệp đang tuyển dụng nhân viên hoặc sinh viên thực tập</strong> thuộc khối ngành đó. 
            Mọi doanh nghiệp đều được xác minh mã số thuế, cam kết tiếp nhận hồ sơ trực tiếp và <strong>tuyệt đối không thu phí</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-pink-100">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FFD273]" /> 100% Doanh nghiệp xác thực pháp nhân
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FFD273]" /> Nhận đào tạo sinh viên thực tập & mới tốt nghiệp
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#FFD273]" /> Không qua bất kỳ trung gian cò mồi nào
            </div>
          </div>
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {industries.map((ind) => {
          return (
            <div
              key={ind.id}
              id={`industry-card-${ind.code}`}
              className="rounded-[20px] border p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-xs hover:shadow-xl bg-white hover:-translate-y-1"
              style={{
                borderColor: 'rgba(222, 181, 215, 0.45)',
                boxShadow: '0 6px 20px -4px rgba(191, 174, 227, 0.12)'
              }}
              onClick={() => onSelectIndustry(ind.code)}
            >
              <div>
                {/* Header with Code Badge and Icon */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-[14px] flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs"
                    style={{ backgroundColor: 'rgba(254, 197, 230, 0.35)' }}
                  >
                    {getIndustryIcon(ind.iconName)}
                  </div>
                  <span 
                    className="px-2.5 py-1 rounded-xl text-xs font-black tracking-wider border shadow-2xs"
                    style={{
                      backgroundColor: '#FEE686',
                      borderColor: '#f0d768',
                      color: '#1E293B'
                    }}
                  >
                    Khối {ind.code}
                  </span>
                </div>

                {/* Name & Description */}
                <h3 
                  className="text-lg font-bold text-slate-900 group-hover:text-[#9a4d87] transition-colors mb-2"
                >
                  {ind.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {ind.description}
                </p>

                {/* Sub-industries tags (Requirement: "Danh sách các ngành con") */}
                <div className="mb-5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <Layers className="w-3 h-3 text-[#9a4d87]" /> Danh sách các ngành con:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ind.subIndustries.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-[8px] border transition-colors"
                        style={{
                          backgroundColor: 'rgba(254, 197, 230, 0.25)',
                          borderColor: 'rgba(222, 181, 215, 0.6)',
                          color: '#1E293B'
                        }}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats & Navigation Trigger */}
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Doanh nghiệp</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" /> {ind.totalCompanies}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                    <span className="text-[10px] text-slate-500 block">Việc làm</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                      <Briefcase className="w-3 h-3 text-slate-400" /> {ind.totalJobs}
                    </span>
                  </div>
                  <div 
                    className="rounded-xl p-2 border"
                    style={{
                      backgroundColor: 'rgba(255, 210, 115, 0.2)',
                      borderColor: 'rgba(255, 210, 115, 0.5)'
                    }}
                  >
                    <span className="text-[10px] block font-bold text-amber-900">Không cần KN</span>
                    <span className="text-xs sm:text-sm font-black text-amber-900 flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-700" /> {ind.noExpJobsCount}
                    </span>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between text-xs font-bold pt-1 text-slate-800"
                >
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#9a4d87]" /> Xem các công ty & vị trí tuyển dụng
                  </span>
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-xs text-slate-900"
                    style={{ backgroundColor: '#FFD273' }}
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
