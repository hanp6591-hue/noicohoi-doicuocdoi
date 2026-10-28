import React, { useState } from 'react';
import { SalaryBenchmark } from '../types';
import { 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  HelpCircle, 
  Building2, 
  Calculator, 
  Info,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface SalaryComparisonProps {
  benchmarks: SalaryBenchmark[];
  onSelectIndustryJobs: (industryCode: string) => void;
}

export const SalaryComparison: React.FC<SalaryComparisonProps> = ({
  benchmarks,
  onSelectIndustryJobs
}) => {
  const [selectedIndustryCode, setSelectedIndustryCode] = useState<string>('CNKT');
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);

  // Gross to Net calculator state
  const [grossInput, setGrossInput] = useState<number>(10);
  const [dependents, setDependents] = useState<number>(0);

  // Filter benchmarks for selected industry
  const availableBenchmarks = benchmarks.filter(b => b.industryCode === selectedIndustryCode);
  const currentBenchmark = availableBenchmarks[selectedRoleIndex] || availableBenchmarks[0] || benchmarks[0];

  // Quick gross to net calculation in Vietnam (8% BHXH + 1.5% BHYT + 1% BHTN = 10.5%)
  const calculateNetSalary = (grossMil: number) => {
    const grossVND = grossMil * 1000000;
    const insurance = grossVND * 0.105; // 10.5%
    const taxableIncome = Math.max(0, grossVND - insurance - 11000000 - (dependents * 4400000));
    
    // Progressive PIT approximation
    let pit = 0;
    if (taxableIncome > 0) {
      if (taxableIncome <= 5000000) {
        pit = taxableIncome * 0.05;
      } else if (taxableIncome <= 10000000) {
        pit = 250000 + (taxableIncome - 5000000) * 0.1;
      } else {
        pit = 750000 + (taxableIncome - 10000000) * 0.15;
      }
    }
    const netVND = grossVND - insurance - pit;
    return (netVND / 1000000).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-sky-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-teal-500/30">
            <TrendingUp className="w-3.5 h-3.5" /> Khảo sát thị trường lao động 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Mục so sánh mức lương theo khối ngành & vị trí
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Tra cứu dải lương chuẩn của từng vị trí từ <strong>Mới tốt nghiệp / Chưa có kinh nghiệm</strong> đến 
            cấp bậc 1-2 năm kinh nghiệm. Nắm vững dữ liệu để tự tin đàm phán lương (deal lương) mà không sợ bị ép giá.
          </p>
        </div>
      </div>

      {/* Selectors Bar: Choose Industry & Role */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-600" /> Chọn Khối ngành khảo sát:
            </label>
            <select
              value={selectedIndustryCode}
              onChange={(e) => {
                setSelectedIndustryCode(e.target.value);
                setSelectedRoleIndex(0);
              }}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              <option value="CNKT">CNKT - Công nghệ - Kỹ thuật</option>
              <option value="DVVT">DVVT - Dịch vụ - Vận tải & Logistics</option>
              <option value="KTTM">KTTM - Kinh tế - Tài chính - Thương mại</option>
              <option value="MKT">MKT - Marketing - Truyền thông</option>
              <option value="GDDT">GDĐT - Giáo dục - Đào tạo</option>
              <option value="NHDD">NHDD - Nhà hàng - Khách sạn - Dịch vụ</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Chọn Vị trí công việc:
            </label>
            <select
              value={selectedRoleIndex}
              onChange={(e) => setSelectedRoleIndex(Number(e.target.value))}
              className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            >
              {availableBenchmarks.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.roleName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Salary Comparison Metrics Visualizer */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
              {currentBenchmark.industryName}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">
              {currentBenchmark.roleName}
            </h3>
          </div>
          <button
            onClick={() => onSelectIndustryJobs(currentBenchmark.industryCode)}
            className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs transition-colors cursor-pointer border border-sky-200"
          >
            Tìm việc vị trí này ngay
          </button>
        </div>

        {/* 3 Tier Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tier 1: No Experience / Fresh Graduate */}
          <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/40 p-5 relative shadow-xs flex flex-col justify-between">
            <div className="absolute -top-3 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              ★ Dành cho người chưa có kinh nghiệm
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-emerald-800 block mb-1">
                Mới tốt nghiệp / Chưa có KN
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mb-1">
                {currentBenchmark.noExpAvg} <span className="text-base font-normal text-emerald-700">triệu/tháng</span>
              </div>
              <span className="text-xs text-emerald-700 block mb-4">
                Dải lương phổ biến: <strong>{currentBenchmark.noExpMin} - {currentBenchmark.noExpMax} triệu</strong>
              </span>

              <div className="w-full bg-emerald-200/80 rounded-full h-2.5 overflow-hidden mb-3">
                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '40%' }} />
              </div>

              <ul className="text-xs text-emerald-900/80 space-y-1.5">
                <li>• Tiếp nhận đào tạo bài bản từ đầu</li>
                <li>• Có người hướng dẫn (Mentor 1-1)</li>
                <li>• Phù hợp sinh viên năm cuối / mới ra trường</li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/80 text-[11px] text-emerald-800 font-medium">
              Mức lương khởi điểm phù hợp để tích lũy kinh nghiệm
            </div>
          </div>

          {/* Tier 2: Junior 1 - 2 Years */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Junior (1 - 2 năm kinh nghiệm)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                {currentBenchmark.juniorAvg} <span className="text-base font-normal text-slate-500">triệu/tháng</span>
              </div>
              <span className="text-xs text-slate-600 block mb-4">
                Dải lương phổ biến: <strong>{currentBenchmark.juniorMin} - {currentBenchmark.juniorMax} triệu</strong>
              </span>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-3">
                <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: '65%' }} />
              </div>

              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• Có khả năng xử lý công việc độc lập</li>
                <li>• Đã qua thử thách với các dự án thực tế</li>
                <li>• Đóng góp trực tiếp vào hiệu suất nhóm</li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Tăng trưởng trung bình 40% - 60% so với lương khởi điểm
            </div>
          </div>

          {/* Tier 3: Mid-level 3+ Years */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-1">
                Mid-level (Trên 3 năm kinh nghiệm)
              </span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                {currentBenchmark.midAvg} <span className="text-base font-normal text-slate-500">triệu/tháng</span>
              </div>
              <span className="text-xs text-slate-600 block mb-4">
                Dải lương phổ biến: <strong>{currentBenchmark.midMin} - {currentBenchmark.midMax} triệu</strong>
              </span>

              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden mb-3">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '90%' }} />
              </div>

              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• Nắm vững chuyên môn sâu & giải pháp</li>
                <li>• Hướng dẫn tân binh và sinh viên thực tập</li>
                <li>• Đảm nhận các hạng mục phức tạp</li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
              Mức thu nhập mở rộng theo năng lực và thâm niên
            </div>
          </div>
        </div>

        {/* Advice Box for Non-experienced Seekers */}
        <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
              Lời khuyên đàm phán lương (Deal lương) cho người mới ra trường
            </h4>
            <p className="text-xs text-sky-800 leading-relaxed">
              {currentBenchmark.advice}
            </p>
          </div>
        </div>
      </div>

      {/* Gross to Net Salary Quick Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-teal-600" />
          <h3 className="text-base font-bold text-slate-900">
            Công cụ ước tính Lương Gross sang Lương Net (Thực nhận)
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4 max-w-2xl leading-relaxed">
          Khi phỏng vấn, doanh nghiệp thường trao đổi mức lương Gross (tổng thu nhập trước khi trừ bảo hiểm và thuế). 
          Công cụ dưới đây giúp bạn biết chính xác số tiền thực nhận (Net) chuyển vào tài khoản ngân hàng của bạn.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Mức lương Gross (triệu VNĐ/tháng):
            </label>
            <input
              type="number"
              min="3"
              max="100"
              step="0.5"
              value={grossInput}
              onChange={(e) => setGrossInput(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Số người phụ thuộc (giảm trừ):
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={dependents}
              onChange={(e) => setDependents(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 bg-white"
            />
          </div>

          <div className="bg-white p-3 rounded-xl border border-teal-200 shadow-xs">
            <span className="text-[11px] text-teal-700 font-bold block uppercase tracking-wider">
              Lương Net thực nhận ước tính:
            </span>
            <div className="text-xl font-extrabold text-teal-800">
              ~ {calculateNetSalary(grossInput)} <span className="text-xs font-medium text-slate-500">triệu VNĐ/tháng</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Áp dụng mức giảm trừ gia cảnh 11 triệu/tháng và 10.5% các khoản BHXH, BHYT, BHTN bắt buộc theo luật lao động Việt Nam.</span>
        </div>
      </div>
    </div>
  );
};
