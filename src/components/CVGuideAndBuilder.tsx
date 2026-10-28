import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Download, 
  Printer, 
  BookOpen, 
  Cpu, 
  Truck, 
  Send,
  HelpCircle,
  FolderGit2,
  Award,
  User
} from 'lucide-react';

export const CVGuideAndBuilder: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'content-guide' | 'google-sites' | 'builder' | 'ai-mentor'>('content-guide');

  // Interactive CV Builder state
  const [cvFullName, setCvFullName] = useState('Nguyễn Văn An');
  const [cvRole, setCvRole] = useState('Thực tập sinh / Nhân viên mới tốt nghiệp');
  const [cvEmail, setCvEmail] = useState('nguyenvanan.career@gmail.com');
  const [cvPhone, setCvPhone] = useState('0987 654 321');
  const [cvSitesUrl, setCvSitesUrl] = useState('https://sites.google.com/view/portfolio-nguyenvanan');
  const [cvObjective, setCvObjective] = useState(
    'Cử nhân mới tốt nghiệp với tinh thần ham học hỏi, trách nhiệm cao và khả năng tiếp thu nhanh. Mong muốn đem kiến thức nền tảng và nhiệt huyết tuổi trẻ để đóng góp vào sự phát triển của công ty, đồng thời rèn luyện kỹ năng thực chiến cùng các anh chị đi trước.'
  );
  const [cvEducation, setCvEducation] = useState(
    'Cử nhân / Kỹ sư - Chuyên ngành Công nghệ kỹ thuật / Kinh tế (Tốt nghiệp loại Khá/Giỏi - GPA 3.2/4.0)'
  );
  const [cvProjects, setCvProjects] = useState(
    '1. Đồ án tốt nghiệp / Bài tập lớn: Đảm nhiệm vai trò trưởng nhóm, hoàn thành đề tài đúng hạn, đạt điểm A.\n2. Dự án thực hành cá nhân: Tự xây dựng sản phẩm mẫu được trình bày chi tiết trên Google Sites.'
  );
  const [cvSkills, setCvSkills] = useState(
    'Kỹ năng chuyên môn nền tảng, Sử dụng thành thạo Google Sites & Tin học văn phòng, Giao tiếp tốt, Làm việc nhóm, Tinh thần kỷ luật.'
  );
  const [copiedCv, setCopiedCv] = useState(false);

  // AI Mentor state
  const [aiIndustry, setAiIndustry] = useState('CNKT');
  const [aiRole, setAiRole] = useState('Thực tập sinh Web / Kỹ thuật');
  const [aiSkills, setAiSkills] = useState('HTML, CSS, JavaScript, Tiếng Anh cơ bản');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleRunAiAdvice = async () => {
    setAiLoading(true);
    setAiResponse(null);
    try {
      const res = await fetch('/api/ai/cv-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          major: aiIndustry,
          targetRole: aiRole,
          skills: aiSkills,
          experienceLevel: 'Chưa có kinh nghiệm / Mới tốt nghiệp'
        })
      });
      const data = await res.json();
      setAiResponse(data.advice || 'Đã tạo lời khuyên thành công.');
    } catch (err) {
      setAiResponse('Không thể kết nối máy chủ AI, vui lòng thử lại sau.');
    } finally {
      setAiLoading(false);
    }
  };

  const copyCvText = () => {
    const text = `HỌ VÀ TÊN: ${cvFullName}
VỊ TRÍ: ${cvRole}
LIÊN HỆ: ${cvPhone} | ${cvEmail}
PORTFOLIO WEBSITE: ${cvSitesUrl}

MỤC TIÊU NGHỀ NGHIỆP:
${cvObjective}

HỌC VẤN:
${cvEducation}

DỰ ÁN & ĐỒ ÁN TIÊU BIỂU:
${cvProjects}

KỸ NĂNG:
${cvSkills}
`;
    navigator.clipboard.writeText(text);
    setCopiedCv(true);
    setTimeout(() => setCopiedCv(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3 border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" /> Hướng dẫn toàn diện cho người mới bắt đầu
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Gợi ý viết CV & Hướng dẫn tạo Portfolio Google Sites
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
            Đừng để cụm từ &quot;chưa có kinh nghiệm&quot; cản bước bạn! Học cách làm nổi bật đồ án, 
            kỹ năng và tận dụng trang web cá nhân <strong>Google Sites hoàn toàn miễn phí</strong> để chứng minh 
            năng lực thật với nhà tuyển dụng.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Chuẩn nội dung được các HR khuyên dùng
            </span>
            <span className="flex items-center gap-1.5 text-sky-400">
              <Globe className="w-4 h-4" /> Mẫu Google Sites miễn phí 100%
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          <button
            onClick={() => setActiveSubTab('content-guide')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'content-guide'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Cấu trúc CV chuẩn
          </button>

          <button
            onClick={() => setActiveSubTab('google-sites')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'google-sites'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-700 bg-sky-50/70 hover:bg-sky-100/80 border border-sky-200'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-400" />
            2. Mẫu Google Sites
          </button>

          <button
            onClick={() => setActiveSubTab('builder')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'builder'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200'
            }`}
          >
            <User className="w-4 h-4 text-emerald-400" />
            3. Tạo & Xuất CV nhanh
          </button>

          <button
            onClick={() => setActiveSubTab('ai-mentor')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'ai-mentor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            4. Trợ lý AI Hướng nghiệp
          </button>
        </div>
      </div>

      {/* Tab 1: Cấu trúc CV chuẩn cho người chưa có kinh nghiệm */}
      {activeSubTab === 'content-guide' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 6 Essential CV Sections */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <FileText className="w-5 h-5 text-sky-600" />
                6 Yêu cầu nội dung cần thiết trong CV người chưa có kinh nghiệm
              </h3>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">1</span>
                    Thông tin liên hệ trang trọng
                  </div>
                  <p className="leading-relaxed">
                    Họ và tên đầy đủ, Số điện thoại chính, Địa chỉ email nghiêm túc (ví dụ <code>nguyenvanan.career@gmail.com</code>). 
                    Đặc biệt: <strong>Đính kèm đường link Google Sites / Portfolio cá nhân</strong> ngay dưới thông tin liên hệ.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">2</span>
                    Mục tiêu nghề nghiệp (Career Objective)
                  </div>
                  <p className="leading-relaxed">
                    Viết 2 - 3 câu súc tích. Đừng chỉ nói &quot;muốn kiếm nhiều tiền&quot;, hãy thể hiện bạn muốn đóng góp giá trị gì 
                    cho công ty, sự sẵn sàng học hỏi quy trình và phát triển lên nhân viên chính thức.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">3</span>
                    Học vấn & Đề tài nghiên cứu
                  </div>
                  <p className="leading-relaxed">
                    Tên trường Đại học/Cao đẳng/Trung cấp, chuyên ngành đào tạo, năm tốt nghiệp. 
                    Nếu điểm GPA tốt (từ 2.8/4.0 hoặc 7.0/10 trở lên) hãy ghi vào, kèm các chứng chỉ ngắn hạn liên quan.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">4</span>
                    Đồ án môn học & Dự án thực tế (Quan trọng nhất!)
                  </div>
                  <p className="leading-relaxed">
                    Đây là thứ thay thế cho kinh nghiệm làm việc! Hãy ghi rõ tên đồ án tốt nghiệp, bài tập lớn, phần mềm mẫu, 
                    kế hoạch marketing hoặc bài viết bạn đã làm, vai trò của bạn và kết quả đạt được.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">5</span>
                    Kỹ năng cứng & Kỹ năng mềm
                  </div>
                  <p className="leading-relaxed">
                    Kỹ năng cứng: Sử dụng máy tính, Word, Excel, phần mềm chuyên ngành (AutoCAD, Photoshop, VS Code...).<br />
                    Kỹ năng mềm: Giao tiếp, làm việc nhóm, quản lý thời gian, tư duy giải quyết vấn đề.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">6</span>
                    Hoạt động ngoại khóa & Câu lạc bộ
                  </div>
                  <p className="leading-relaxed">
                    Tham gia các hoạt động tình nguyện Mùa hè xanh, câu lạc bộ sở thích, hỗ trợ tổ chức sự kiện khoa/trường. 
                    Nhà tuyển dụng rất thích ứng viên năng động, có tinh thần tập thể.
                  </p>
                </div>
              </div>
            </div>

            {/* Dos and Don'ts / Red Flags */}
            <div className="space-y-5">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 
                  Bí quyết giúp CV của bạn lọt vào mắt xanh HR
                </h3>
                <ul className="text-xs text-emerald-800 space-y-2 leading-relaxed">
                  <li>• <strong>Độ dài lý tưởng:</strong> Đúng 1 trang A4 duy nhất. Đừng viết dài dòng lan man.</li>
                  <li>• <strong>Chân thành và trung thực:</strong> Không bịa đặt kinh nghiệm 2-3 năm tại các công ty lớn khi thực chất chưa từng làm. HR có thể phát hiện chỉ qua 1 câu hỏi kiểm tra.</li>
                  <li>• <strong>Định dạng file xuất:</strong> Luôn lưu file dưới dạng PDF (tên file chuẩn: <code>CV_NguyenVanAn_ViTriUngTuyen.pdf</code>).</li>
                  <li>• <strong>Số hóa sản phẩm:</strong> Tạo 1 trang Google Sites chứa hình ảnh đồ án để chứng minh năng lực thực tế.</li>
                </ul>
              </div>

              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" /> 
                  Những lỗi sai tai hại khiến CV bị loại ngay lập tức
                </h3>
                <ul className="text-xs text-rose-800 space-y-2 leading-relaxed">
                  <li>• <strong>Email thiếu chuyên nghiệp:</strong> Tuyệt đối không dùng email kiểu <code>traidepnongbong@...</code> hay <code>girl_ngox@...</code>.</li>
                  <li>• <strong>Lỗi chính tả & ngữ pháp:</strong> Thể hiện sự cẩu thả. Hãy đọc lại ít nhất 3 lần trước khi gửi.</li>
                  <li>• <strong>Ảnh thẻ không phù hợp:</strong> Tránh dùng ảnh selfie góc nghiêng, ảnh đi chơi quán bar, ảnh đeo kính đen hoặc ảnh mờ vỡ nét.</li>
                  <li>• <strong>Nội dung copy y nguyên trên mạng:</strong> Tránh các câu văn sáo rỗng vô thưởng vô phạt.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hướng dẫn tạo Portfolio Google Sites */}
      {activeSubTab === 'google-sites' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold mb-2 border border-sky-200">
                <Globe className="w-3.5 h-3.5" /> Giải pháp Portfolio cá nhân số 1 hiện nay
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
                Tại sao sinh viên & người chưa có kinh nghiệm NÊN dùng Google Sites?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Google Sites (<strong>sites.google.com</strong>) là công cụ tạo trang web miễn phí của Google. 
                Bạn không cần biết lập trình web hay mua tên miền phức tạp. Chỉ cần kéo thả trong 15 phút, bạn đã có một 
                trang web hồ sơ năng lực trực tuyến, đính kèm được ảnh đồ án, slide thuyết trình, video thực tế và chứng chỉ. 
                Khi đính kèm link này vào CV, bạn nổi bật hơn 95% các ứng viên khác!
              </p>
            </div>

            {/* 4 Step Guide to create Google Sites */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Truy cập Google Sites
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Dùng trình duyệt vào <strong>sites.google.com</strong> bằng tài khoản Gmail của bạn, chọn mẫu có sẵn &quot;Portfolio&quot; hoặc &quot;Trang trống&quot;.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Thiết kế Trang chủ & Giới thiệu
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tải lên ảnh đại diện nghiêm túc, viết đoạn tự giới thiệu bản thân, chuyên ngành học và mục tiêu nghề nghiệp.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Đăng tải Đồ án & Sản phẩm
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Chèn hình ảnh sản phẩm, slide PowerPoint, link video hoặc tài liệu đồ án từ Google Drive của bạn sang.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center mb-2.5">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  Xuất bản & Lấy Link
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Nhấn nút &quot;Công bố&quot; (Publish), sao chép đường link công khai (ví dụ <code>sites.google.com/view/ten-ban</code>) dán vào hồ sơ xin việc.
                </p>
              </div>
            </div>

            {/* Simulated Google Sites Portfolio Mockup */}
            <div className="border-2 border-slate-300 rounded-2xl overflow-hidden shadow-md">
              {/* Browser chrome bar */}
              <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="bg-white border border-slate-200 rounded-lg px-4 py-1 text-slate-600 text-[11px] font-mono flex items-center gap-1.5 shadow-2xs">
                  <Globe className="w-3 h-3 text-slate-400" />
                  https://sites.google.com/view/portfolio-nguyenvanan
                </div>
                <div className="text-[11px] font-semibold text-emerald-600">
                  ● Trực tuyến
                </div>
              </div>

              {/* Website content simulation */}
              <div className="p-6 bg-white space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-bold text-sky-600 tracking-wider uppercase block mb-1">
                      Hồ sơ năng lực cá nhân
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900">
                      Nguyễn Văn An • Cử nhân mới tốt nghiệp
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Chuyên ngành Công nghệ Kỹ thuật / Logistics • Sẵn sàng học việc và làm việc toàn thời gian
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium">
                      SĐT: 0987 654 321
                    </span>
                  </div>
                </div>

                {/* Projects Showcase inside simulation */}
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-sky-600" /> 
                    Dự án & Đồ án tiêu biểu đã hoàn thành
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="h-20 bg-sky-100 rounded-lg mb-2 flex items-center justify-center text-sky-700 text-xs font-semibold">
                        Ảnh chụp Đồ án 01
                      </div>
                      <span className="text-xs font-bold text-slate-900 block">Hệ thống quản lý kho mini</span>
                      <span className="text-[11px] text-slate-500">Đạt điểm A môn Đồ án chuyên ngành</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="h-20 bg-emerald-100 rounded-lg mb-2 flex items-center justify-center text-emerald-700 text-xs font-semibold">
                        Ảnh Báo cáo thực tập
                      </div>
                      <span className="text-xs font-bold text-slate-900 block">Quy trình điều phối hàng hóa</span>
                      <span className="text-[11px] text-slate-500">Phân tích thực tế lộ trình giao nhận</span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="h-20 bg-amber-100 rounded-lg mb-2 flex items-center justify-center text-amber-700 text-xs font-semibold">
                        Chứng chỉ & Bằng khen
                      </div>
                      <span className="text-xs font-bold text-slate-900 block">Chứng chỉ Tin học & Ngoại ngữ</span>
                      <span className="text-[11px] text-slate-500">TOEIC 650 + Khen thưởng Đoàn thanh niên</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action: Open Google Sites directly */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500">
                Công cụ của Google hoàn toàn bảo mật và không tốn phí lưu trữ.
              </span>
              <a
                href="https://sites.google.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Mở Google Sites để tạo Portfolio ngay <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Tạo & Xuất CV nhanh (Interactive CV Builder) */}
      {activeSubTab === 'builder' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" />
                Điền thông tin hồ sơ của bạn
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên:</label>
                <input
                  type="text"
                  value={cvFullName}
                  onChange={(e) => setCvFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại:</label>
                  <input
                    type="text"
                    value={cvPhone}
                    onChange={(e) => setCvPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email liên hệ:</label>
                  <input
                    type="email"
                    value={cvEmail}
                    onChange={(e) => setCvEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Đường link Google Sites / Portfolio:
                </label>
                <input
                  type="url"
                  value={cvSitesUrl}
                  onChange={(e) => setCvSitesUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mục tiêu nghề nghiệp:</label>
                <textarea
                  rows={3}
                  value={cvObjective}
                  onChange={(e) => setCvObjective(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trình độ học vấn & Chuyên ngành:</label>
                <input
                  type="text"
                  value={cvEducation}
                  onChange={(e) => setCvEducation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Dự án / Đồ án tiêu biểu:</label>
                <textarea
                  rows={3}
                  value={cvProjects}
                  onChange={(e) => setCvProjects(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kỹ năng cốt lõi:</label>
                <input
                  type="text"
                  value={cvSkills}
                  onChange={(e) => setCvSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            {/* Live CV Preview (A4 styled layout) */}
            <div className="bg-slate-50 rounded-2xl border border-slate-300 p-6 shadow-xs flex flex-col justify-between">
              <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xs border border-slate-200 font-sans space-y-4 text-xs">
                {/* CV Header */}
                <div className="border-b-2 border-slate-900 pb-4">
                  <h2 className="text-xl font-bold uppercase tracking-wide text-slate-900">
                    {cvFullName || 'HỌ VÀ TÊN'}
                  </h2>
                  <p className="text-xs font-semibold text-sky-700 uppercase mt-0.5">
                    {cvRole || 'VỊ TRÍ ỨNG TUYỂN'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2">
                    <span>📞 {cvPhone}</span>
                    <span>✉️ {cvEmail}</span>
                    {cvSitesUrl && (
                      <span className="text-sky-700 font-semibold underline">
                        🌐 {cvSitesUrl}
                      </span>
                    )}
                  </div>
                </div>

                {/* Objective */}
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1 text-[11px]">
                    Mục tiêu nghề nghiệp
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {cvObjective}
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1 text-[11px]">
                    Trình độ học vấn
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {cvEducation}
                  </p>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1 text-[11px]">
                    Đồ án & Dự án thực tế tiêu biểu
                  </h3>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-line text-[11px]">
                    {cvProjects}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1 text-[11px]">
                    Kỹ năng
                  </h3>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    {cvSkills}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={copyCvText}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copiedCv ? 'Đã sao chép văn bản!' : 'Sao chép văn bản CV'}
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  In hoặc Lưu dưới dạng PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Trợ lý AI Hướng nghiệp & Tối ưu CV */}
      {activeSubTab === 'ai-mentor' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="max-w-2xl mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-200">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Trợ lý AI Hướng nghiệp thông minh
              </span>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Tư vấn viết CV & Gợi ý câu hỏi phỏng vấn theo ngành
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nhập khối ngành và vị trí bạn muốn nộp đơn, AI sẽ phân tích các yêu cầu cần thiết nhất để biến 
                hồ sơ chưa có kinh nghiệm thành một bản ứng tuyển đầy sức thuyết phục.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Khối ngành:</label>
                <select
                  value={aiIndustry}
                  onChange={(e) => setAiIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="CNKT">CNKT - Công nghệ - Kỹ thuật</option>
                  <option value="DVVT">DVVT - Dịch vụ - Vận tải & Logistics</option>
                  <option value="KTTM">KTTM - Kinh tế - Thương mại - Bán lẻ</option>
                  <option value="MKT">MKT - Marketing - Truyền thông</option>
                  <option value="GDDT">GDĐT - Giáo dục - Đào tạo</option>
                  <option value="NHDD">NHDD - Nhà hàng - Khách sạn</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vị trí mong muốn:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Thực tập sinh Kho vận, Frontend Fresher..."
                  value={aiRole}
                  onChange={(e) => setAiRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kỹ năng hiện có:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Excel, tiếng Anh cơ bản, Canva..."
                  value={aiSkills}
                  onChange={(e) => setAiSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleRunAiAdvice}
              disabled={aiLoading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang phân tích và tạo lời khuyên...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Nhận phân tích & Gợi ý từ Trợ lý AI
                </>
              )}
            </button>

            {aiResponse && (
              <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line space-y-3">
                {aiResponse}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
