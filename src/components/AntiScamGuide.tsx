import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  FileWarning, 
  PhoneCall, 
  CheckCircle2, 
  ExternalLink,
  UserX,
  CreditCard,
  Building2
} from 'lucide-react';

export const AntiScamGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs border border-rose-900/40">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Cẩm nang bảo vệ ứng viên
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Phòng tránh bẫy lừa đảo, lộ thông tin & môi giới trung gian
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Ứng dụng <strong>Nối cơ hội - Đổi cuộc đời</strong> cam kết kết nối trực tiếp 100% tới các doanh nghiệp 
            đã được xác thực MST và địa chỉ pháp lý. Hãy trang bị ngay các nguyên tắc vàng dưới đây để bảo vệ chính mình và người thân.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-rose-200">
            <span className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Nguyên tắc số 1: Tuyệt đối KHÔNG nộp tiền
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-400" /> Không cung cấp OTP & CCCD bừa bãi
            </span>
          </div>
        </div>
      </div>

      {/* 6 Common Recruitment Scams to Watch Out For */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Nhận diện 6 chiêu trò lừa đảo tuyển dụng phổ biến nhất hiện nay
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          {/* Trap 1 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-rose-600 flex-shrink-0" />
              1. Bẫy thu &quot;tiền cọc&quot;, phí hồ sơ, đồng phục, tài liệu
            </div>
            <p className="leading-relaxed text-slate-700">
              <strong>Thủ đoạn:</strong> Yêu cầu đóng từ 200.000đ - 2.000.000đ để giữ chỗ, may đồng phục, làm thẻ nhân viên hoặc mua tài liệu đào tạo.<br />
              <strong>Sự thật:</strong> Luật Lao động Việt Nam quy định nghiêm cấm người sử dụng lao động thu tiền của ứng viên. Mọi yêu cầu thu phí đều là lừa đảo 100%!
            </p>
          </div>

          {/* Trap 2 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <UserX className="w-4 h-4 text-rose-600 flex-shrink-0" />
              2. Bẫy &quot;việc nhẹ lương cao&quot;, giật đơn thương mại ảo
            </div>
            <p className="leading-relaxed text-slate-700">
              <strong>Thủ đoạn:</strong> Tuyển người xem video YouTube, like fanpage, thả tim TikTok, hoặc &quot;chốt đơn hàng Shopee/Lazada&quot; với hoa hồng 20-30% ngay tại nhà.<br />
              <strong>Hậu quả:</strong> Ban đầu trả thưởng vài chục nghìn để tạo lòng tin, sau đó dụ nạp số tiền lớn rồi chặn liên lạc và chiếm đoạt tài sản.
            </p>
          </div>

          {/* Trap 3 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-600 flex-shrink-0" />
              3. Đánh cắp thông tin cá nhân (CCCD, OTP, Quét khuôn mặt)
            </div>
            <p className="leading-relaxed text-slate-700">
              <strong>Thủ đoạn:</strong> Yêu cầu chụp ảnh 2 mặt CCCD kèm ảnh chân dung quay video các góc, hoặc gửi mã xác thực OTP ngân hàng gửi về máy.<br />
              <strong>Nguy hiểm:</strong> Kẻ gian dùng thông tin của bạn để mở tài khoản ngân hàng ảo rửa tiền hoặc làm hồ sơ vay nợ qua các app tín dụng đen.
            </p>
          </div>

          {/* Trap 4 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-rose-600 flex-shrink-0" />
              4. Trung gian môi giới, trung tâm việc làm &quot;ma&quot;
            </div>
            <p className="leading-relaxed text-slate-700">
              <strong>Thủ đoạn:</strong> Dựng văn phòng tạm bợ, tự xưng là đối tác độc quyền của các tập đoàn lớn, bắt người xin việc ký hợp đồng môi giới và trừ 15-30% tháng lương đầu.<br />
              <strong>Giải pháp:</strong> Luôn nộp trực tiếp qua cổng kết nối xác thực như nền tảng này để hồ sơ đến thẳng phòng Nhân sự của doanh nghiệp.
            </p>
          </div>

          {/* Trap 5 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              5. Mời phỏng vấn tại quán cafe, phòng trọ, không có biển hiệu
            </div>
            <p className="leading-relaxed text-slate-700">
              Doanh nghiệp uy tín luôn có trụ sở chính thức, văn phòng làm việc rõ ràng có biển hiệu công ty. 
              Nếu nhà tuyển dụng hẹn bạn ra quán nước vỉa hè hoặc địa điểm hẻo lánh mà không có giấy giới thiệu, hãy từ chối ngay.
            </p>
          </div>

          {/* Trap 6 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
            <div className="font-bold text-rose-900 text-sm flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-rose-600 flex-shrink-0" />
              6. Thư mời phỏng vấn mạo danh gửi từ email lạ
            </div>
            <p className="leading-relaxed text-slate-700">
              Tập đoàn lớn thường dùng email tên miền công ty (ví dụ: <code>hr@fpt.com.vn</code>, <code>tuyendung@viettel.com.vn</code>). 
              Cảnh giác cao độ với các email giả mạo gửi từ đuôi miễn phí như <code>tuyendungfpt123456@gmail.com</code>.
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Safety Checklist Before Applying */}
      <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Quy trình 5 bước kiểm tra an toàn trước khi nộp hồ sơ hoặc đến phỏng vấn
        </h3>

        <div className="space-y-2 text-xs text-emerald-900 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">1</span>
            <span>Kiểm tra Mã số thuế (MST) và địa chỉ đăng ký kinh doanh trên Cổng thông tin quốc gia về đăng ký doanh nghiệp.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">2</span>
            <span>Chỉ ứng tuyển qua các cổng trực tiếp, không đưa tiền cho bất kỳ cá nhân nào xưng là &quot;người giới thiệu nội bộ&quot;.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">3</span>
            <span>Che các thông tin nhạy cảm (như số tài khoản ngân hàng, mã số định danh bí mật) trong CV gửi lần đầu.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">4</span>
            <span>Đọc kỹ mô tả công việc (JD), mức lương thực tế và quyền lợi bảo hiểm, tránh các lời hứa &quot;thu nhập 50 triệu không cần làm gì&quot;.</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[11px]">5</span>
            <span>Thông báo cho người thân hoặc bạn bè địa chỉ công ty và thời gian khi bạn đi phỏng vấn trực tiếp.</span>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            Đường dây nóng hỗ trợ & Phản ánh lừa đảo tuyển dụng
          </h4>
          <p className="text-xs text-slate-300">
            Cục An toàn thông tin (Bộ Thông tin & Truyền thông) & Cục An ninh mạng (A05 - Bộ Công an).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:156"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            Tổng đài 156 (Báo cáo lừa đảo qua mạng)
          </a>
          <a
            href="https://canhbao.khonggianmang.vn"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1"
          >
            Cổng Cảnh báo an toàn không gian mạng <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
