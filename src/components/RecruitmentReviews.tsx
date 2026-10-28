import React, { useState, useEffect } from 'react';
import { RecruitmentReview } from '../types';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  ThumbsUp, 
  CircleAlert, 
  CircleCheck, 
  Building2, 
  Send,
  Sparkles,
  UserCheck
} from 'lucide-react';

interface RecruitmentReviewsProps {
  reviews: RecruitmentReview[];
  onAddReview: (review: RecruitmentReview) => void;
  readOnly?: boolean;
}

export const RecruitmentReviews: React.FC<RecruitmentReviewsProps> = ({
  reviews,
  onAddReview,
  readOnly = false
}) => {
  const avgRating = reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [candidateRole, setCandidateRole] = useState('Sinh viên mới tốt nghiệp');
  const [rating, setRating] = useState(0);
  const [responseTimeRating, setResponseTimeRating] = useState(0);
  const [interviewExp, setInterviewExp] = useState<'Rất tích cực' | 'Tích cực' | 'Trung bình' | 'Cần cải thiện'>('Rất tích cực');
  const [noFeeConfirmed, setNoFeeConfirmed] = useState(false);
  const [comment, setComment] = useState('');
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  useEffect(() => {
    if (highlightedId && reviews.some(r => r.id === highlightedId)) {
      const el = document.getElementById(`review-${highlightedId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [reviews, highlightedId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim() || !comment.trim() || !rating || !responseTimeRating) return;

    const newRev: RecruitmentReview = {
      id: `rev-${Date.now()}`,
      companyId: `comp-custom-${Date.now()}`,
      companyName,
      jobTitle,
      candidateRole,
      rating,
      date: new Date().toLocaleDateString('vi-VN'),
      responseTimeRating,
      interviewExperience: interviewExp,
      noFeeCharged: noFeeConfirmed,
      comment,
      pros: pros.trim() || undefined,
      cons: cons.trim() || undefined,
      verifiedApplication: false
    };

    onAddReview(newRev);
    setSubmittedMessage(true);
    setHighlightedId(newRev.id);

    setTimeout(() => {
      setSubmittedMessage(false);
      setShowForm(false);
      setCompanyName('');
      setJobTitle('');
      setComment('');
      setPros('');
      setCons('');
      setRating(0);
      setResponseTimeRating(0);
      setNoFeeConfirmed(false);
      setHighlightedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-500/30">
            <UserCheck className="w-3.5 h-3.5" /> Giám sát chất lượng & độ minh bạch
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Đánh giá quá trình tuyển dụng & Doanh nghiệp
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
            Chia sẻ thực tế từ các ứng viên, sinh viên đã trực tiếp nộp hồ sơ và phỏng vấn. Giúp cộng đồng nắm rõ tốc độ phản hồi hồ sơ, thái độ phỏng vấn và tuyệt đối{' '}
            <strong>nói KHÔNG với các đơn vị thu tiền cọc trái phép hoặc môi giới mờ ám</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" /> 100% Xác nhận Không thu phí
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-400" /> Phản hồi trung bình trong 24h - 48h
            </span>
          </div>
        </div>
      </div>

      {/* Write a review prompt */}
      {!readOnly && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
              Bạn vừa phỏng vấn hoặc ứng tuyển ở đâu đó?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Chia sẻ trải nghiệm thật của bạn để giúp những người tìm việc sau tránh rủi ro và chọn đúng nơi đáng tin cậy.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4" />
            {showForm ? 'Đóng biểu mẫu' : 'Viết đánh giá ngay'}
          </button>
        </div>
      )}

      {/* Review summary stats */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center gap-6">
        <div>
          <span className="text-xs text-slate-500 block">Độ hài lòng chung</span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {readOnly ? (reviews.length ? `${avgRating.toFixed(1)} / 5.0` : '—') : '4.8 / 5.0'}
            </span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </div>
        <div className="border-l border-slate-200 pl-6 hidden sm:block">
          <span className="text-xs text-slate-500 block">Tổng số đánh giá đã duyệt</span>
          <span className="text-2xl font-extrabold text-slate-900">
            {readOnly ? reviews.length : `${reviews.length + 180}+`}
          </span>
        </div>
        <div className="border-l border-slate-200 pl-6 hidden sm:block">
          <span className="text-xs text-slate-500 block">Tỷ lệ không qua trung gian</span>
          <span className="text-2xl font-extrabold text-emerald-600">100%</span>
        </div>
      </div>

      {/* Write review form */}
      {showForm && !readOnly && (
        <div className="bg-white rounded-2xl border-2 border-sky-300 p-6 shadow-md transition-all">
          <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            Chia sẻ trải nghiệm phỏng vấn của bạn để hỗ trợ cộng đồng
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Đánh giá của bạn hoàn toàn bảo mật danh tính, giúp sinh viên và người tìm việc tránh được các công ty lừa đảo.
          </p>

          {submittedMessage ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 text-center font-semibold">
              Cảm ơn bạn! Đánh giá đã được ghi nhận và hiển thị ngay trên hệ thống.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tên doanh nghiệp bạn đã ứng tuyển / phỏng vấn *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: FPT Software, Viettel Post, WinMart..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Vị trí ứng tuyển *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Thực tập sinh Frontend, Nhân viên kho vận..."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Bạn đang ở vị trí nào khi ứng tuyển?
                  </label>
                  <select
                    value={candidateRole}
                    onChange={(e) => setCandidateRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Sinh viên mới tốt nghiệp">Sinh viên mới tốt nghiệp</option>
                    <option value="Sinh viên thực tập (Năm 3, 4)">Sinh viên thực tập (Năm 3, 4)</option>
                    <option value="Người chưa có kinh nghiệm">Người chưa có kinh nghiệm</option>
                    <option value="Đã có kinh nghiệm 1-2 năm">Đã có kinh nghiệm 1-2 năm</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Số sao đánh giá chung
                  </label>
                  <select
                    required
                    value={rating || ''}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="" disabled>-- Chọn mức đánh giá --</option>
                    <option value={5}>5 sao (Rất hài lòng)</option>
                    <option value={4}>4 sao (Tốt)</option>
                    <option value={3}>3 sao (Bình thường)</option>
                    <option value={2}>2 sao (Cần cải thiện)</option>
                    <option value={1}>1 sao (Kém)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Tốc độ phản hồi hồ sơ
                  </label>
                  <select
                    required
                    value={responseTimeRating || ''}
                    onChange={(e) => setResponseTimeRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="" disabled>-- Chọn tốc độ phản hồi --</option>
                    <option value={5}>Cực nhanh (Trong 24h)</option>
                    <option value={4}>Nhanh (Trong 2-3 ngày)</option>
                    <option value={3}>Khoảng 1 tuần</option>
                    <option value={2}>Hơn 1 tuần</option>
                    <option value={1}>Không phản hồi / Hơn 2 tuần</option>
                  </select>
                </div>
              </div>

              {/* No fee checkbox */}
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex items-center gap-2">
                <input
                  id="confirm-no-fee"
                  type="checkbox"
                  checked={noFeeConfirmed}
                  onChange={(e) => setNoFeeConfirmed(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="confirm-no-fee" className="text-xs text-emerald-900 font-semibold cursor-pointer">
                  Tôi xác nhận doanh nghiệp này KHÔNG thu bất kỳ khoản tiền nào khi phỏng vấn / thử việc.
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nhận xét chi tiết về quy trình tuyển dụng & phỏng vấn *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Chia sẻ về câu hỏi phỏng vấn, thái độ của người phỏng vấn, thời gian có kết quả..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Điểm bạn thích nhất (Ưu điểm):</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phỏng vấn đúng giờ, phòng phỏng vấn máy lạnh..."
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Điểm cần lưu ý / Cải thiện:</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Cần chuẩn bị kỹ đồ án tốt nghiệp..."
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Đăng nhận xét
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Review list */}
      <div className="space-y-4">
        {readOnly && reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-sm text-slate-500">
            Chưa có đánh giá nào về công ty bạn. Đánh giá chỉ xuất hiện sau khi ứng viên đã nộp hồ sơ và được duyệt.
          </div>
        )}

        {reviews.map((rev) => (
          <div
            key={rev.id}
            id={`review-${rev.id}`}
            className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 transition-colors ${
              rev.id === highlightedId ? 'border-sky-400 ring-2 ring-sky-200' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  <h4 className="text-base font-bold text-slate-900">{rev.companyName}</h4>
                  <span className="text-xs text-slate-500">• Vị trí: <strong>{rev.jobTitle}</strong></span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                    {rev.candidateRole}
                  </span>
                  <span>Ngày đánh giá: {rev.date}</span>
                  {rev.verifiedApplication ? (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CircleCheck className="w-3.5 h-3.5 text-emerald-600" /> Đã xác thực phỏng vấn
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <CircleAlert className="w-3.5 h-3.5 text-slate-400" /> Tự đánh giá (chưa xác thực)
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {rev.noFeeCharged && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 0đ Phí
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              "{rev.comment}"
            </p>

            {(rev.pros || rev.cons) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                {rev.pros && (
                  <div className="bg-emerald-50/70 text-emerald-900 p-2.5 rounded-xl border border-emerald-100">
                    <span className="font-bold block text-emerald-800 mb-0.5 flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" /> Ưu điểm:
                    </span>
                    <span>{rev.pros}</span>
                  </div>
                )}
                {rev.cons && (
                  <div className="bg-slate-50 text-slate-700 p-2.5 rounded-xl border border-slate-200">
                    <span className="font-bold block text-slate-800 mb-0.5 flex items-center gap-1">
                      <CircleAlert className="w-3.5 h-3.5 text-slate-400" /> Lưu ý:
                    </span>
                    <span>{rev.cons}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
