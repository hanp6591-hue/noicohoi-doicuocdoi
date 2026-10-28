import { Industry, Company, Job, SalaryBenchmark, RecruitmentReview, JobAlert } from '../types';

export const INDUSTRIES_DATA: Industry[] = [
  {
    id: 'ind-cnkt',
    code: 'CNKT',
    name: 'Công nghệ thông tin & Kỹ thuật số',
    shortName: 'Công nghệ thông tin & Kỹ thuật số',
    description: 'Bao gồm Công nghệ thông tin, Phần mềm, Cơ khí, Điện - Điện tử, Tự động hóa, Viễn thông & Kỹ thuật số.',
    iconName: 'Cpu',
    totalCompanies: 28,
    totalJobs: 142,
    noExpJobsCount: 76,
    subIndustries: [
      'Lập trình Web & Mobile',
      'Kiểm thử phần mềm (QA/QC)',
      'Hỗ trợ kỹ thuật IT (Helpdesk)',
      'Kỹ thuật Điện - Tự động hóa',
      'Thiết kế Cơ khí (AutoCAD/SolidWorks)',
      'Bảo trì thiết bị công nghiệp'
    ]
  },
  {
    id: 'ind-dvvt',
    code: 'DVVT',
    name: 'Dịch vụ, Vận tải & Logistics kho vận',
    shortName: 'Dịch vụ, Vận tải & Logistics kho vận',
    description: 'Bao gồm Logistics, Giao nhận, Quản lý kho bãi, Chăm sóc khách hàng, Vận tải hàng hóa & Điều phối phương tiện.',
    iconName: 'Truck',
    totalCompanies: 24,
    totalJobs: 118,
    noExpJobsCount: 65,
    subIndustries: [
      'Nhân viên điều phối giao nhận',
      'Quản lý chứng từ xuất nhập khẩu (Fresher)',
      'Nhân viên kho vận & kiểm kê',
      'Chăm sóc khách hàng dịch vụ vận chuyển',
      'Khai báo hải quan cơ bản',
      'Kinh doanh dịch vụ chuyển phát'
    ]
  },
  {
    id: 'ind-kttm',
    code: 'KTTM',
    name: 'Kinh tế, Tài chính, Thương mại & Bán lẻ',
    shortName: 'Kinh tế, Tài chính, Thương mại & Bán lẻ',
    description: 'Kế toán doanh nghiệp, Thu ngân, Kiểm toán sơ cấp, Tư vấn tài chính, Bán lẻ & Quản trị kinh doanh.',
    iconName: 'TrendingUp',
    totalCompanies: 32,
    totalJobs: 156,
    noExpJobsCount: 84,
    subIndustries: [
      'Kế toán nội bộ / Kế toán kho (Mới ra trường)',
      'Tư vấn sản phẩm tài chính',
      'Nhân viên bán lẻ / Thu ngân',
      'Hỗ trợ thẩm định hồ sơ',
      'Thực tập sinh Kiểm toán'
    ]
  },
  {
    id: 'ind-mkt',
    code: 'MKT',
    name: 'Marketing, Truyền thông & Sáng tạo nội dung',
    shortName: 'Marketing, Truyền thông & Sáng tạo nội dung',
    description: 'Sáng tạo nội dung (Content Creator), Quản lý Fanpage/TikTok, Thiết kế đồ họa cơ bản, Chạy quảng cáo số & Sự kiện.',
    iconName: 'Megaphone',
    totalCompanies: 26,
    totalJobs: 110,
    noExpJobsCount: 62,
    subIndustries: [
      'Thực tập sinh Content Marketing',
      'Chăm sóc kênh mạng xã hội (Social Media)',
      'Thiết kế banner/Canva cơ bản',
      'Hỗ trợ tổ chức sự kiện & Activation',
      'Seeding & Cộng đồng'
    ]
  },
  {
    id: 'ind-gddt',
    code: 'GDDT',
    name: 'Giáo dục, Giảng dạy & Đào tạo phát triển',
    shortName: 'Giáo dục, Giảng dạy & Đào tạo',
    description: 'Trợ giảng tiếng Anh, Giáo viên mầm non/tiểu học, Tư vấn tuyển sinh, Biên soạn tài liệu học tập & Quản lý lớp học.',
    iconName: 'GraduationCap',
    totalCompanies: 19,
    totalJobs: 88,
    noExpJobsCount: 49,
    subIndustries: [
      'Trợ giảng tiếng Anh (Part-time / Full-time)',
      'Chuyên viên tư vấn khóa học',
      'Quản lý học viên & Điều phối lớp học',
      'Gia sư bộ môn văn hóa',
      'Thực tập sinh giáo dục mầm non'
    ]
  },
  {
    id: 'ind-ythc',
    code: 'YTHC',
    name: 'Y tế, Chăm sóc sức khỏe & Hành chính nhân sự',
    shortName: 'Y tế, Chăm sóc sức khỏe & Hành chính nhân sự',
    description: 'Lễ tân phòng khám, Dược tá, Điều dưỡng mới tốt nghiệp, Hành chính nhân sự, Quản lý hồ sơ bệnh án.',
    iconName: 'HeartPulse',
    totalCompanies: 16,
    totalJobs: 64,
    noExpJobsCount: 35,
    subIndustries: [
      'Lễ tân nha khoa & phòng khám',
      'Dược sĩ tư vấn tại quầy (Đào tạo từ đầu)',
      'Thực tập sinh Hành chính nhân sự',
      'Nhân viên nhập liệu hồ sơ y tế'
    ]
  },
  {
    id: 'ind-nhdd',
    code: 'NHDD',
    name: 'Nhà hàng, Khách sạn, Ẩm thực & Du lịch',
    shortName: 'Nhà hàng, Khách sạn, Ẩm thực & Du lịch',
    description: 'Pha chế (Barista), Phục vụ bàn, Lễ tân khách sạn, Phụ bếp, Chăm sóc khách hàng dịch vụ lữ hành.',
    iconName: 'Utensils',
    totalCompanies: 22,
    totalJobs: 95,
    noExpJobsCount: 70,
    subIndustries: [
      'Nhân viên pha chế đồ uống (Đào tạo nghề)',
      'Phục vụ chuỗi nhà hàng (Linh hoạt ca)',
      'Lễ tân ca đêm / ca ngày',
      'Thực tập sinh F&B'
    ]
  }
];

export const COMPANIES_DATA: Company[] = [
  // CNKT Companies
  {
    id: 'comp-fpt-soft',
    name: 'Tập đoàn Công nghệ FPT Software',
    industryCode: 'CNKT',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
    taxId: '0101248141',
    isVerified: true,
    directRecruitment: true,
    address: 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội & Khu Công nghệ cao TP. Thủ Đức',
    city: 'Hà Nội & TP. HCM',
    website: 'https://fptsoftware.com',
    phone: '024 7300 7300',
    email: 'recruitment@fpt-software.vn',
    rating: 4.8,
    reviewCount: 312,
    responseTime: 'Trong vòng 24h',
    description: 'Doanh nghiệp công nghệ hàng đầu Việt Nam cam kết đào tạo tân kỹ sư, cử nhân mới tốt nghiệp không yêu cầu kinh nghiệm, phụ cấp thực tập từ 5-10 triệu/tháng.',
    openPositionsCount: 18,
    internPositionsCount: 8,
    noExpPositionsCount: 10
  },
  {
    id: 'comp-viettel-cnkt',
    name: 'Tổng công ty Công nghệ & Kỹ thuật Viettel',
    industryCode: 'CNKT',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=80',
    taxId: '0100109106',
    isVerified: true,
    directRecruitment: true,
    address: 'Số 1 Trần Hữu Dực, Nam Từ Liêm, Hà Nội',
    city: 'Hà Nội',
    website: 'https://viettel.vn',
    phone: '024 6255 6789',
    email: 'hr-tech@viettel.com.vn',
    rating: 4.9,
    reviewCount: 245,
    responseTime: 'Trong vòng 48h',
    description: 'Môi trường kỹ thuật chuyên sâu, hỗ trợ sinh viên trường kỹ thuật thực tập làm việc thực tế với hệ thống điện tử viễn thông, mạng và giải pháp số.',
    openPositionsCount: 12,
    internPositionsCount: 6,
    noExpPositionsCount: 6
  },
  {
    id: 'comp-vng-tech',
    name: 'VNG Corporation - Khối Công nghệ số',
    industryCode: 'CNKT',
    logo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=150&auto=format&fit=crop&q=80',
    taxId: '0303538466',
    isVerified: true,
    directRecruitment: true,
    address: 'Z06 Đường số 13, KCX Tân Thuận, Quận 7, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    website: 'https://vng.com.vn',
    phone: '028 3962 3888',
    email: 'career-tech@vng.com.vn',
    rating: 4.7,
    reviewCount: 180,
    responseTime: 'Trong vòng 24h',
    description: 'Chương trình VNG Fresher dành riêng cho sinh viên năm cuối và mới tốt nghiệp, đào tạo bài bản 3 tháng có lương đầy đủ.',
    openPositionsCount: 14,
    internPositionsCount: 5,
    noExpPositionsCount: 9
  },
  {
    id: 'comp-auto-mech',
    name: 'Công ty Cơ điện & Tự động hóa Tân Phát',
    industryCode: 'CNKT',
    logo: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=150&auto=format&fit=crop&q=80',
    taxId: '0102834571',
    isVerified: true,
    directRecruitment: true,
    address: 'Lô A2 Cụm công nghiệp Nam Thăng Long, Bắc Từ Liêm, Hà Nội',
    city: 'Hà Nội',
    website: 'https://tanphatauto.vn',
    phone: '024 3752 8899',
    email: 'tuyendung@tanphat-mech.vn',
    rating: 4.6,
    reviewCount: 94,
    responseTime: 'Trong vòng 24h',
    description: 'Chuyên sản xuất tủ điện và thiết kế mạch tự động hóa. Tuyển sinh viên cao đẳng, trung cấp, đại học cơ điện, nhận học việc có trợ cấp xăng xe ăn trưa.',
    openPositionsCount: 8,
    internPositionsCount: 4,
    noExpPositionsCount: 4
  },

  // DVVT Companies
  {
    id: 'comp-viettel-post',
    name: 'Tổng công ty Bưu chính Viettel (Viettel Post)',
    industryCode: 'DVVT',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    taxId: '0104093672',
    isVerified: true,
    directRecruitment: true,
    address: 'Tòa nhà N1 Đại lộ Thăng Long, Mễ Trì, Nam Từ Liêm, Hà Nội',
    city: 'Toàn quốc',
    website: 'https://viettelpost.com.vn',
    phone: '1900 8095',
    email: 'tuyendung@viettelpost.com.vn',
    rating: 4.6,
    reviewCount: 410,
    responseTime: 'Trong vòng 24h',
    description: 'Hệ thống vận tải và chuyển phát phủ sóng toàn quốc. Liên tục tuyển dụng nhân viên điều phối kho, xử lý bưu phẩm, chăm sóc khách hàng không cần kinh nghiệm.',
    openPositionsCount: 22,
    internPositionsCount: 6,
    noExpPositionsCount: 16
  },
  {
    id: 'comp-ghn-logistics',
    name: 'Giao Hàng Nhanh (GHN Logistics)',
    industryCode: 'DVVT',
    logo: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=150&auto=format&fit=crop&q=80',
    taxId: '0311907295',
    isVerified: true,
    directRecruitment: true,
    address: 'Tầng 3 Tòa nhà Rivera Park, 7/28 Thành Thái, Quận 10, TP. HCM',
    city: 'TP. Hồ Chí Minh & Hà Nội',
    website: 'https://ghn.vn',
    phone: '1900 636677',
    email: 'jobs@ghn.vn',
    rating: 4.5,
    reviewCount: 350,
    responseTime: 'Trong vòng 24h',
    description: 'Môi trường làm việc trẻ trung, năng động, chế độ bảo hiểm rõ ràng, hỗ trợ sinh viên làm thêm theo ca linh hoạt và tạo điều kiện lên vị trí chính thức.',
    openPositionsCount: 16,
    internPositionsCount: 4,
    noExpPositionsCount: 12
  },
  {
    id: 'comp-dhl-vn',
    name: 'DHL Global Forwarding Vietnam',
    industryCode: 'DVVT',
    logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=80',
    taxId: '0304383921',
    isVerified: true,
    directRecruitment: true,
    address: 'Tòa nhà CentrePoint, 106 Nguyễn Văn Trỗi, Phú Nhuận, TP. HCM',
    city: 'TP. Hồ Chí Minh & Hải Phòng',
    website: 'https://dhl.com.vn',
    phone: '028 3844 6203',
    email: 'careers.vietnam@dhl.com',
    rating: 4.9,
    reviewCount: 120,
    responseTime: 'Trong vòng 48h',
    description: 'Tập đoàn vận tải logistics toàn cầu. Tuyển thực tập sinh chứng từ xuất nhập khẩu (Air/Ocean freight), đào tạo phần mềm SAP và nghiệp vụ quốc tế.',
    openPositionsCount: 9,
    internPositionsCount: 5,
    noExpPositionsCount: 4
  },

  // KTTM Companies
  {
    id: 'comp-vincommerce',
    name: 'Chuỗi Bán lẻ WinCommerce (Masan Group)',
    industryCode: 'KTTM',
    logo: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=150&auto=format&fit=crop&q=80',
    taxId: '0104918404',
    isVerified: true,
    directRecruitment: true,
    address: 'Tòa nhà Mplaza Saigon, 39 Lê Duẩn, Bến Nghé, Quận 1, TP. HCM',
    city: 'Toàn quốc',
    website: 'https://winmart.vn',
    phone: '028 7108 1368',
    email: 'tuyendung@winmart.masangroup.com',
    rating: 4.5,
    reviewCount: 520,
    responseTime: 'Trong vòng 24h',
    description: 'Hệ sinh thái bán lẻ lớn nhất Việt Nam. Tuyển dụng thu ngân, kế toán cửa hàng, nhân viên bán hàng mọi lứa tuổi, đào tạo nghiệp vụ từ đầu miễn phí.',
    openPositionsCount: 30,
    internPositionsCount: 8,
    noExpPositionsCount: 22
  },
  {
    id: 'comp-mb-bank',
    name: 'Ngân hàng Quân đội (MBBank) - Trung tâm Dịch vụ KH',
    industryCode: 'KTTM',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
    taxId: '0100283873',
    isVerified: true,
    directRecruitment: true,
    address: '63 Lê Văn Lương, Trung Hòa, Cầu Giấy, Hà Nội',
    city: 'Hà Nội & Đà Nẵng',
    website: 'https://mbbank.com.vn',
    phone: '1900 545426',
    email: 'hr.contactcenter@mbbank.com.vn',
    rating: 4.8,
    reviewCount: 280,
    responseTime: 'Trong vòng 24h',
    description: 'Tuyển nhân viên tư vấn dịch vụ ngân hàng số, chăm sóc khách hàng ưu tiên, chấp nhận sinh viên mới tốt nghiệp khối ngành kinh tế/ngân hàng.',
    openPositionsCount: 15,
    internPositionsCount: 5,
    noExpPositionsCount: 10
  },

  // MKT Companies
  {
    id: 'comp-viet-buzz',
    name: 'VietBuzz Media & Creative Agency',
    industryCode: 'MKT',
    logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&auto=format&fit=crop&q=80',
    taxId: '0314829102',
    isVerified: true,
    directRecruitment: true,
    address: 'Tầng 6 Tòa nhà Golden Bee, Nguyễn Kiệm, Gò Vấp, TP. HCM',
    city: 'TP. Hồ Chí Minh',
    website: 'https://vietbuzzmedia.vn',
    phone: '028 6290 1122',
    email: 'talent@vietbuzz.vn',
    rating: 4.7,
    reviewCount: 98,
    responseTime: 'Trong vòng 24h',
    description: 'Môi trường sáng tạo mở, hỗ trợ bạn trẻ đam mê viết lách, thiết kế, dựng video ngắn TikTok xây dựng portfolio thực chiến từ con số 0.',
    openPositionsCount: 11,
    internPositionsCount: 5,
    noExpPositionsCount: 6
  },

  // GDDT Companies
  {
    id: 'comp-ila-vietnam',
    name: 'Hệ thống Anh ngữ Quốc tế ILA Vietnam',
    industryCode: 'GDDT',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=150&auto=format&fit=crop&q=80',
    taxId: '0302482711',
    isVerified: true,
    directRecruitment: true,
    address: '146 Nguyễn Đình Chiểu, Phường 6, Quận 3, TP. HCM',
    city: 'TP. HCM, Hà Nội, Đà Nẵng',
    website: 'https://ila.edu.vn',
    phone: '028 7300 5588',
    email: 'ta-recruitment@ila.edu.vn',
    rating: 4.8,
    reviewCount: 310,
    responseTime: 'Trong vòng 24h',
    description: 'Cơ hội vàng cho sinh viên nâng cao trình độ tiếng Anh với vai trò Trợ giảng (Teaching Assistant), làm việc cùng 100% giáo viên bản ngữ.',
    openPositionsCount: 18,
    internPositionsCount: 12,
    noExpPositionsCount: 15
  },

  // NHDD Companies
  {
    id: 'comp-highlands-coffee',
    name: 'Highlands Coffee (Việt Thái Quốc Tế)',
    industryCode: 'NHDD',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=150&auto=format&fit=crop&q=80',
    taxId: '0302638841',
    isVerified: true,
    directRecruitment: true,
    address: '135 Hai Bà Trưng, Bến Nghé, Quận 1, TP. HCM',
    city: 'Toàn quốc',
    website: 'https://highlandscoffee.com.vn',
    phone: '1900 1755',
    email: 'career@highlandscoffee.com.vn',
    rating: 4.6,
    reviewCount: 620,
    responseTime: 'Trong vòng 24h',
    description: 'Chuỗi cà phê hàng đầu. Cam kết không thu phí tuyển dụng, hỗ trợ đăng ký ca làm linh hoạt theo lịch học của sinh viên, đào tạo pha chế chuẩn quốc tế.',
    openPositionsCount: 25,
    internPositionsCount: 8,
    noExpPositionsCount: 20
  }
];

export const JOBS_DATA: Job[] = [
  // --- CNKT Jobs (No Experience / Fresh Graduate) ---
  {
    id: 'job-cnkt-01',
    title: 'Thực tập sinh Lập trình Web Frontend (Đào tạo từ đầu - Có lương)',
    companyId: 'comp-fpt-soft',
    companyName: 'Tập đoàn Công nghệ FPT Software',
    industryCode: 'CNKT',
    industryName: 'Công nghệ - Kỹ thuật (CNKT)',
    location: 'Cầu Giấy, Hà Nội & Quận 9, TP. HCM',
    city: 'Hà Nội',
    salaryMin: 6,
    salaryMax: 9,
    salaryText: '6 - 9 triệu / tháng',
    jobType: 'internship',
    experienceRequired: 'no-experience',
    experienceText: 'Không cần kinh nghiệm / Sinh viên năm cuối hoặc mới tốt nghiệp',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm nay',
    deadline: '30 ngày tới',
    description: [
      'Tham gia chương trình đào tạo Fresher Academy 2 tháng về React, TypeScript, HTML/CSS hiện đại có người hướng dẫn (Mentor 1-1).',
      'Được thực hành trực tiếp trên các dự án phần mềm cho khách hàng quốc tế sau khi hoàn thành khóa đào tạo cơ bản.',
      'Rèn luyện kỹ năng làm việc nhóm theo mô hình Agile/Scrum và quy trình bảo mật chuẩn CMMI cấp 5.'
    ],
    requirements: [
      'Sinh viên năm cuối hoặc mới tốt nghiệp ngành CNTT, Điện tử viễn thông, Toán tin hoặc tương đương.',
      'Nắm vững kiến thức nền tảng về lập trình (HTML, CSS, JavaScript cơ bản).',
      'Có tinh thần ham học hỏi, kỷ luật và thái độ cầu tiến.',
      'Ưu tiên ứng viên có Portfolio hoặc đồ án tốt nghiệp đính kèm link (Google Sites, GitHub...).'
    ],
    benefits: [
      'Trợ cấp thực tập từ 6 - 9 triệu/tháng ngay từ tháng đầu tiên.',
      'Cam kết ký hợp đồng nhân viên chính thức (Lương 10 - 15 triệu) ngay khi tốt nghiệp khóa đào tạo.',
      'Xe bus đưa đón miễn phí, căn tin phục vụ bữa trưa tiêu chuẩn, phòng gym và khu thể thao hiện đại.',
      'Doanh nghiệp tuyển dụng trực tiếp 100% - Tuyệt đối không thu bất kỳ chi phí đào tạo nào.'
    ],
    tags: ['React', 'TypeScript', 'Đào tạo có lương', 'Mentor 1-1', 'Không cần kinh nghiệm'],
    urgency: true
  },
  {
    id: 'job-cnkt-02',
    title: 'Kỹ thuật viên Bảo trì & Lắp ráp Tủ điện (Học việc có phụ cấp)',
    companyId: 'comp-auto-mech',
    companyName: 'Công ty Cơ điện & Tự động hóa Tân Phát',
    industryCode: 'CNKT',
    industryName: 'Công nghệ - Kỹ thuật (CNKT)',
    location: 'Khu CN Nam Thăng Long, Bắc Từ Liêm, Hà Nội',
    city: 'Hà Nội',
    salaryMin: 7,
    salaryMax: 10,
    salaryText: '7 - 10 triệu / tháng',
    jobType: 'full-time',
    experienceRequired: 'no-experience',
    experienceText: 'Không yêu cầu kinh nghiệm - Đào tạo tay nghề thực tế',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: '1 ngày trước',
    deadline: '15 ngày tới',
    description: [
      'Đọc bản vẽ kỹ thuật cơ bản và lắp ráp các linh kiện tủ điện công nghiệp (aptomat, relay, khởi động từ).',
      'Được các kỹ sư trưởng nhiều năm kinh nghiệm cầm tay chỉ việc, hướng dẫn an toàn lao động và kỹ thuật đấu nối.',
      'Hỗ trợ kiểm tra thông mạch, test thử nghiệm tủ điện trước khi xuất xưởng.'
    ],
    requirements: [
      'Tốt nghiệp Trung cấp, Cao đẳng hoặc Đại học chuyên ngành Điện, Cơ điện tử, Tự động hóa.',
      'Chăm chỉ, cẩn thận, có tính kiên nhẫn và tuân thủ tuyệt đối quy định an toàn.',
      'Chưa có kinh nghiệm thực tế sẽ được đào tạo toàn diện trong 1 tháng đầu.'
    ],
    benefits: [
      'Lương khởi điểm 7 - 10 triệu/tháng + Thưởng năng suất theo từng lô tủ hoàn thành.',
      'Hỗ trợ ăn trưa tại bếp ăn công ty, cung cấp miễn phí toàn bộ đồ bảo hộ lao động.',
      'Được đóng BHXH, BHYT đầy đủ theo quy định pháp luật sau thời gian thử việc 1 tháng.'
    ],
    tags: ['Điện công nghiệp', 'Cơ điện tử', 'Học việc có lương', 'Lâu dài'],
    urgency: false
  },
  {
    id: 'job-cnkt-03',
    title: 'Kỹ sư Phần mềm Java/Golang Backend (Fresher / Junior)',
    companyId: 'comp-vng-tech',
    companyName: 'VNG Corporation - Khối Công nghệ số',
    industryCode: 'CNKT',
    industryName: 'Công nghệ - Kỹ thuật (CNKT)',
    location: 'Quận 7, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    salaryMin: 12,
    salaryMax: 18,
    salaryText: '12 - 18 triệu / tháng',
    jobType: 'full-time',
    experienceRequired: 'fresh-grad',
    experienceText: 'Sinh viên mới tốt nghiệp hoặc dưới 1 năm kinh nghiệm',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: '2 ngày trước',
    deadline: '20 ngày tới',
    description: [
      'Xây dựng các module dịch vụ backend xử lý hàng triệu người dùng cho các ứng dụng nội dung số.',
      'Thiết kế RESTful APIs, tối ưu hóa câu truy vấn cơ sở dữ liệu MySQL/PostgreSQL và Redis.',
      'Tham gia code review và học hỏi các kiến trúc vi dịch vụ (Microservices) tiên tiến.'
    ],
    requirements: [
      'Tốt nghiệp Đại học khối ngành CNTT, Khoa học Máy tính hoặc Kỹ thuật Phần mềm.',
      'Thành thạo cấu trúc dữ liệu, giải thuật và một ngôn ngữ lập trình (Java, Go, C++ hoặc Python).',
      'Có khả năng đọc hiểu tài liệu kỹ thuật tiếng Anh tốt.'
    ],
    benefits: [
      'Mức lương cạnh tranh 12 - 18 triệu/tháng tùy theo năng lực kiểm tra đầu vào.',
      'Thưởng tháng 13 + thưởng hiệu quả kinh doanh hàng quý.',
      'Gói bảo hiểm sức khỏe cao cấp VNG Care dành cho bản thân và người thân.'
    ],
    tags: ['Java', 'Golang', 'Backend', 'Fresher', 'TP.HCM']
  },

  // --- DVVT Jobs (No Experience / Transport - Logistics) ---
  {
    id: 'job-dvvt-01',
    title: 'Nhân viên Điều phối Đơn hàng & Kho bãi (Không cần kinh nghiệm - Có ca sinh viên)',
    companyId: 'comp-viettel-post',
    companyName: 'Tổng công ty Bưu chính Viettel (Viettel Post)',
    industryCode: 'DVVT',
    industryName: 'Dịch vụ - Vận tải (DVVT)',
    location: 'Kho trung chuyển Bắc Từ Liêm, Hà Nội & Kho Tân Bình, TP. HCM',
    city: 'Hà Nội',
    salaryMin: 8,
    salaryMax: 12,
    salaryText: '8 - 12 triệu / tháng',
    jobType: 'full-time',
    experienceRequired: 'no-experience',
    experienceText: 'Không cần kinh nghiệm - Nhận cả lao động phổ thông & sinh viên',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm nay',
    deadline: '25 ngày tới',
    description: [
      'Sử dụng máy quét mã vạch và phần mềm kho để phân loại, kiểm đếm bưu phẩm theo từng tuyến đường.',
      'Điều phối số lượng đơn hàng cho tài xế giao nhận, cập nhật trạng thái đơn hàng trên hệ thống bưu chính.',
      'Giải quyết các trường hợp bưu phẩm chậm trễ hoặc sai địa chỉ theo quy trình được hướng dẫn chi tiết.'
    ],
    requirements: [
      'Độ tuổi từ 18 - 35 tuổi, không yêu cầu bằng cấp chuyên sâu hay kinh nghiệm trước đó.',
      'Sử dụng được điện thoại thông minh và máy tính văn phòng cơ bản.',
      'Có trách nhiệm, trung thực và nhanh nhẹn trong công việc.'
    ],
    benefits: [
      'Thu nhập ổn định 8 - 12 triệu/tháng (Lương cứng + Phụ cấp chuyên cần + Thưởng sản lượng).',
      'Được ký hợp đồng lao động trực tiếp với Viettel Post, bảo hiểm đầy đủ 100%.',
      'Có hỗ trợ ca làm việc linh động (Ca sáng / Ca chiều / Ca đêm với phụ cấp đêm cao).'
    ],
    tags: ['Kho vận', 'Điều phối', 'Không yêu cầu bằng cấp', 'Làm việc lâu dài'],
    urgency: true
  },
  {
    id: 'job-dvvt-02',
    title: 'Thực tập sinh Chứng từ Xuất Nhập Khẩu & Logistics (Đào tạo thực tế)',
    companyId: 'comp-dhl-vn',
    companyName: 'DHL Global Forwarding Vietnam',
    industryCode: 'DVVT',
    industryName: 'Dịch vụ - Vận tải (DVVT)',
    location: 'Phú Nhuận, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    salaryMin: 5,
    salaryMax: 7,
    salaryText: '5 - 7 triệu / tháng (Trợ cấp)',
    jobType: 'internship',
    experienceRequired: 'no-experience',
    experienceText: 'Chấp nhận sinh viên năm 3, 4 hoặc mới tốt nghiệp',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm qua',
    deadline: '20 ngày tới',
    description: [
      'Hỗ trợ lập và xử lý bộ chứng từ vận tải quốc tế: Vận đơn (B/L), Hóa đơn thương mại (Commercial Invoice), Phiếu đóng gói (Packing List).',
      'Liên hệ các hãng tàu, đại lý vận tải và khách hàng để cập nhật lộ trình hàng hóa.',
      'Nhập liệu dữ liệu vận đơn vào hệ thống quản lý logistics toàn cầu của DHL.'
    ],
    requirements: [
      'Sinh viên chuyên ngành Logistics, Kinh tế đối ngoại, Xuất nhập khẩu, Thương mại quốc tế.',
      'Tiếng Anh giao tiếp và đọc hiểu văn bản khá (tương đương TOEIC 600+).',
      'Thành thạo tin học văn phòng (Word, Excel) và tỉ mỉ trong xử lý giấy tờ.'
    ],
    benefits: [
      'Trợ cấp thực tập hàng tháng 5 - 7 triệu + Hỗ trợ đóng mộc thực tập và số liệu làm khóa luận.',
      'Chứng chỉ thực tập quốc tế do Giám đốc DHL Vietnam cấp.',
      'Cơ hội ưu tiên tuyển thẳng vào vị trí Chuyên viên Chứng từ chính thức sau kỳ thực tập.'
    ],
    tags: ['Logistics', 'Xuất nhập khẩu', 'Thực tập sinh', 'DHL', 'Tiếng Anh']
  },
  {
    id: 'job-dvvt-03',
    title: 'Nhân viên Chăm Sóc Khách Hàng Dịch Vụ Vận Chuyển (Full-time / Part-time)',
    companyId: 'comp-ghn-logistics',
    companyName: 'Giao Hàng Nhanh (GHN Logistics)',
    industryCode: 'DVVT',
    industryName: 'Dịch vụ - Vận tải (DVVT)',
    location: 'Quận 10, TP. Hồ Chí Minh',
    city: 'TP. Hồ Chí Minh',
    salaryMin: 8,
    salaryMax: 11,
    salaryText: '8 - 11 triệu / tháng',
    jobType: 'full-time',
    experienceRequired: 'no-experience',
    experienceText: 'Được đào tạo kỹ năng giao tiếp & xử lý tình huống từ đầu',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: '3 ngày trước',
    deadline: '25 ngày tới',
    description: [
      'Tiếp nhận cuộc gọi và tin nhắn từ khách hàng giải đáp về tình trạng đơn hàng giao trễ hoặc thay đổi địa chỉ.',
      'Phối hợp với bộ phận kho vận để đẩy nhanh tiến độ giao nhận.',
      'Ghi nhận phản hồi của người dùng lên hệ thống CRM.'
    ],
    requirements: [
      'Giọng nói dễ nghe, không nói ngọng hoặc nói lắp.',
      'Kỹ năng lắng nghe tốt, bình tĩnh và nhẫn nại khi trao đổi với khách hàng.',
      'Không yêu cầu kinh nghiệm, công ty tổ chức đào tạo bài bản 5 ngày có phụ cấp.'
    ],
    benefits: [
      'Thu nhập 8 - 11 triệu/tháng bao gồm lương cứng + KPIs chất lượng dịch vụ.',
      'Môi trường làm việc văn phòng máy lạnh 100%, trang bị đầy đủ tai nghe và máy tính.',
      'Bảo hiểm xã hội, thưởng lễ tết và khám sức khỏe định kỳ hàng năm.'
    ],
    tags: ['CSKH', 'Văn phòng', 'Giao tiếp', 'Không áp doanh số']
  },

  // --- KTTM Jobs ---
  {
    id: 'job-kttm-01',
    title: 'Nhân viên Thu Ngân & Bán Làng Chuỗi WinMart (Linh hoạt ca - Nhận mọi lứa tuổi)',
    companyId: 'comp-vincommerce',
    companyName: 'Chuỗi Bán lẻ WinCommerce (Masan Group)',
    industryCode: 'KTTM',
    industryName: 'Kinh tế - Tài chính - Thương mại',
    location: 'Hà Nội, TP. HCM, Đà Nẵng, Bình Dương (Sắp xếp gần nhà)',
    city: 'Toàn quốc',
    salaryMin: 7,
    salaryMax: 10,
    salaryText: '7 - 10 triệu / tháng',
    jobType: 'full-time',
    experienceRequired: 'no-experience',
    experienceText: 'Không cần kinh nghiệm - Độ tuổi từ 18 đến 50 tuổi',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm nay',
    deadline: '45 ngày tới',
    description: [
      'Thực hiện thanh toán tiền hàng cho khách qua máy quét POS và các ví điện tử.',
      'Sắp xếp hàng hóa ngăn nắp lên kệ, kiểm tra hạn sử dụng và dán tem giá.',
      'Hỗ trợ khách hàng tìm kiếm sản phẩm trong siêu thị với thái độ niềm nở.'
    ],
    requirements: [
      'Nam/Nữ từ 18 tuổi trở lên, sức khỏe tốt, chăm chỉ, thật thà.',
      'Không đòi hỏi bằng cấp chuyên ngành, được hướng dẫn thao tác máy tính trong 2 ngày.',
      'Có thể làm theo ca (Ca 8 tiếng hoặc ca xoay linh hoạt).'
    ],
    benefits: [
      'Lương 7 - 10 triệu/tháng + Thưởng doanh số cửa hàng + Phụ cấp ca đêm nếu có.',
      'Được ưu tiên bố trí làm việc tại siêu thị gần khu vực cư trú nhất.',
      'Mua hàng giảm giá nội bộ nhân viên tập đoàn Masan.'
    ],
    tags: ['Bán lẻ', 'Thu ngân', 'Gần nhà', 'Mọi lứa tuổi', 'Masan'],
    urgency: true
  },
  {
    id: 'job-kttm-02',
    title: 'Thực tập sinh Hỗ trợ Thẩm định Tín dụng & Dịch vụ KH Ngân hàng',
    companyId: 'comp-mb-bank',
    companyName: 'Ngân hàng Quân đội (MBBank)',
    industryCode: 'KTTM',
    industryName: 'Kinh tế - Tài chính - Thương mại',
    location: 'Cầu Giấy, Hà Nội & Hải Châu, Đà Nẵng',
    city: 'Hà Nội',
    salaryMin: 5,
    salaryMax: 8,
    salaryText: '5 - 8 triệu / tháng (Trợ cấp)',
    jobType: 'internship',
    experienceRequired: 'fresh-grad',
    experienceText: 'Sinh viên mới tốt nghiệp hoặc năm cuối khối ngành Kinh tế/Tài chính',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: '2 ngày trước',
    deadline: '30 ngày tới',
    description: [
      'Hỗ trợ cán bộ tín dụng rà soát tính đầy đủ của hồ sơ vay vốn khách hàng cá nhân.',
      'Nhập liệu thông tin khách hàng lên phần mềm lõi Core Banking của MBBank.',
      'Hướng dẫn khách hàng cài đặt và trải nghiệm App MBBank tại quầy giao dịch.'
    ],
    requirements: [
      'Sinh viên các trường Đại học/Cao đẳng khối ngành Tài chính Ngân hàng, Kế toán, Quản trị Kinh doanh.',
      'Ngoại hình sáng sủa, tác phong chỉn chu, giao tiếp tự tin.',
      'Cẩn thận và có tính bảo mật thông tin tài chính cao.'
    ],
    benefits: [
      'Môi trường ngân hàng chuẩn mực, cơ hội học hỏi quy trình tín dụng thực tế.',
      'Trợ cấp 5 - 8 triệu/tháng + Cơ hội tuyển thẳng vị trí Chuyên viên Quản lý Quan hệ Khách hàng.',
      'Nhận giấy xác nhận thực tập chính thức có dấu tròn của Hội sở Ngân hàng.'
    ],
    tags: ['Ngân hàng', 'MBBank', 'Tài chính', 'Thực tập sinh']
  },

  // --- MKT Jobs ---
  {
    id: 'job-mkt-01',
    title: 'Thực tập sinh Sáng tạo Nội dung (Content Creator) & Quản lý Fanpage/TikTok',
    companyId: 'comp-viet-buzz',
    companyName: 'VietBuzz Media & Creative Agency',
    industryCode: 'MKT',
    industryName: 'Marketing - Truyền thông',
    location: 'Gò Vấp, TP. Hồ Chí Minh (Có hỗ trợ Hybrid)',
    city: 'TP. Hồ Chí Minh',
    salaryMin: 4,
    salaryMax: 7,
    salaryText: '4 - 7 triệu / tháng',
    jobType: 'internship',
    experienceRequired: 'no-experience',
    experienceText: 'Không cần kinh nghiệm - Chỉ cần yêu thích sáng tạo nội dung mạng xã hội',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm nay',
    deadline: '18 ngày tới',
    description: [
      'Viết bài viết ngắn (caption), lên kịch bản video ngắn 30-60 giây cho TikTok và Facebook Reels.',
      'Phối hợp cùng team media để quay video đơn giản bằng điện thoại, bắt trend xu hướng mới.',
      'Được hướng dẫn cách đo lường tương tác và tối ưu hóa bài viết bằng công cụ Meta Business Suite.'
    ],
    requirements: [
      'Sinh viên hoặc các bạn trẻ yêu thích mạng xã hội, văn phong tự nhiên, bắt trend nhanh.',
      'Biết sử dụng cơ bản ứng dụng CapCut trên điện thoại hoặc Canva là một lợi thế lớn.',
      'Đính kèm link tài khoản mạng xã hội hoặc link Google Sites portfolio bài viết đã từng làm.'
    ],
    benefits: [
      'Trợ cấp từ 4 - 7 triệu/tháng + Thưởng nóng khi video đạt triệu view (Viral bonus).',
      'Được trang bị máy móc, đèn quay studio và trà sữa miễn phí hàng tuần.',
      'Đào tạo 1-1 từ Content Leader có kinh nghiệm quản lý các kênh triệu follow.'
    ],
    tags: ['Content', 'TikTok', 'Canva', 'Agency', 'Sáng tạo']
  },

  // --- GDDT Jobs ---
  {
    id: 'job-gddt-01',
    title: 'Trợ Giảng Tiếng Anh (Teaching Assistant) - Ca tối & Cuối tuần',
    companyId: 'comp-ila-vietnam',
    companyName: 'Hệ thống Anh ngữ Quốc tế ILA Vietnam',
    industryCode: 'GDDT',
    industryName: 'Giáo dục - Đào tạo',
    location: 'Hà Nội, TP. HCM & Đà Nẵng',
    city: 'TP. Hồ Chí Minh',
    salaryMin: 5,
    salaryMax: 9,
    salaryText: '5 - 9 triệu / tháng (35.000 - 50.000đ / giờ)',
    jobType: 'part-time',
    experienceRequired: 'no-experience',
    experienceText: 'Chấp nhận sinh viên năm 1, 2, 3 muốn tích lũy kinh nghiệm sư phạm',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: '1 ngày trước',
    deadline: '30 ngày tới',
    description: [
      'Hỗ trợ giáo viên nước ngoài quản lý lớp học và tổ chức các trò chơi tiếng Anh cho học viên nhí (4-12 tuổi).',
      'Giải thích từ vựng hoặc hướng dẫn bài tập cho các bé tiếp thu chậm hơn.',
      'Báo cáo tình hình học tập và tương tác của học viên cho phụ huynh sau mỗi buổi học.'
    ],
    requirements: [
      'Sinh viên các trường đại học/cao đẳng có khả năng giao tiếp tiếng Anh tốt (IELTS 6.0+ hoặc tương đương).',
      'Yêu quý trẻ em, năng động, hòa đồng và kiên nhẫn.',
      'Lịch làm việc linh hoạt sắp xếp theo buổi rảnh của sinh viên (chủ yếu tối thứ 2-4-6 hoặc thứ 7-CN).'
    ],
    benefits: [
      'Môi trường 100% tiếng Anh giúp nâng cao phản xạ giao tiếp quốc tế nhanh chóng.',
      'Thu nhập bán thời gian lý tưởng từ 5 - 9 triệu/tháng không ảnh hưởng lịch học trên trường.',
      'Được cấp giấy chứng nhận kinh nghiệm giảng dạy từ tổ chức giáo dục quốc tế uy tín.'
    ],
    tags: ['Trợ giảng', 'Tiếng Anh', 'Part-time', 'Sinh viên', 'Giáo dục']
  },

  // --- NHDD Jobs ---
  {
    id: 'job-nhdd-01',
    title: 'Nhân viên Pha Chế (Barista) & Phục vụ chuỗi Highlands Coffee',
    companyId: 'comp-highlands-coffee',
    companyName: 'Highlands Coffee (Việt Thái Quốc Tế)',
    industryCode: 'NHDD',
    industryName: 'Nhà hàng - Khách sạn - Dịch vụ',
    location: 'Nhiều quận huyện tại Hà Nội, TP. HCM, Cần Thơ, Hải Phòng',
    city: 'Toàn quốc',
    salaryMin: 6,
    salaryMax: 9,
    salaryText: '6 - 9 triệu / tháng (Part-time / Full-time)',
    jobType: 'part-time',
    experienceRequired: 'no-experience',
    experienceText: 'Không cần kinh nghiệm - Đào tạo công thức pha chế chuẩn',
    acceptsFreshGrad: true,
    trainingProvided: true,
    isDirectHire: true,
    isVerifiedCompany: true,
    postedDate: 'Hôm nay',
    deadline: '30 ngày tới',
    description: [
      'Thực hiện pha chế cà phê truyền thống, cà phê máy và các loại trà/freeze theo công thức độc quyền.',
      'Đón tiếp khách hàng tại quầy thu ngân, giới thiệu món và giải đáp thắc mắc của khách.',
      'Giữ gìn vệ sinh khu vực pha chế và sảnh phục vụ sạch sẽ, đạt chuẩn vệ sinh an toàn thực phẩm.'
    ],
    requirements: [
      'Độ tuổi từ 18 tuổi trở lên, trung thực, nhanh nhẹn, gương mặt tươi tắn.',
      'Không yêu cầu kinh nghiệm pha chế trước đó, công ty đào tạo miễn phí 100%.',
      'Đăng ký tối thiểu 4-5 ca/tuần (Mỗi ca 4 - 6 tiếng).'
    ],
    benefits: [
      'Lương giờ hấp dẫn + Thưởng doanh thu tháng + Tiền tips trực tiếp.',
      'Giảm giá 50% đồ uống cho nhân viên khi sử dụng dịch vụ tại quán.',
      'Cơ hội thăng tiến lên Trưởng ca (Shift Leader) hoặc Quản lý cửa hàng sau 6 tháng.'
    ],
    tags: ['Barista', 'Highlands', 'Không cần kinh nghiệm', 'Ca linh hoạt']
  }
];

export const SALARY_BENCHMARKS: SalaryBenchmark[] = [
  {
    industryCode: 'CNKT',
    industryName: 'Công nghệ - Kỹ thuật (CNKT)',
    roleName: 'Lập trình viên Web / Mobile (Frontend/Backend)',
    noExpMin: 6,
    noExpAvg: 8.5,
    noExpMax: 12,
    juniorMin: 12,
    juniorAvg: 16,
    juniorMax: 22,
    midMin: 22,
    midAvg: 30,
    midMax: 45,
    advice: 'Với vị trí lập trình viên mới ra trường, hãy tự tin đề xuất dải lương 7 - 10 triệu nếu bạn có Portfolio cụ thể (link Google Sites hoặc GitHub) minh chứng cho các đồ án môn học hoặc sản phẩm cá nhân.'
  },
  {
    industryCode: 'CNKT',
    industryName: 'Công nghệ - Kỹ thuật (CNKT)',
    roleName: 'Kỹ sư Cơ điện / Tự động hóa / Bảo trì',
    noExpMin: 7,
    noExpAvg: 8.5,
    noExpMax: 11,
    juniorMin: 11,
    juniorAvg: 14.5,
    juniorMax: 18,
    midMin: 18,
    midAvg: 25,
    midMax: 35,
    advice: 'Người mới tốt nghiệp cơ điện nên chú trọng đến phụ cấp ăn trưa, bảo hộ, bảo hiểm và cơ hội được kỹ sư bậc cao trực tiếp hướng dẫn thay vì chỉ nhìn vào lương cứng ban đầu.'
  },
  {
    industryCode: 'DVVT',
    industryName: 'Dịch vụ - Vận tải (DVVT)',
    roleName: 'Nhân viên Điều phối Vận tải & Quản lý Kho',
    noExpMin: 7,
    noExpAvg: 9,
    noExpMax: 12,
    juniorMin: 11,
    juniorAvg: 13.5,
    juniorMax: 16,
    midMin: 16,
    midAvg: 20,
    midMax: 28,
    advice: 'Ngành vận tải kho vận có lương sản lượng và phụ cấp ca đêm rất cao. Người chưa có kinh nghiệm dễ đạt mức 9 - 11 triệu nếu chăm chỉ và thành thạo thao tác ứng dụng quản lý kho.'
  },
  {
    industryCode: 'DVVT',
    industryName: 'Dịch vụ - Vận tải (DVVT)',
    roleName: 'Chuyên viên Chứng từ Xuất Nhập Khẩu (Logistics)',
    noExpMin: 6,
    noExpAvg: 7.5,
    noExpMax: 10,
    juniorMin: 10,
    juniorAvg: 13,
    juniorMax: 17,
    midMin: 17,
    midAvg: 22,
    midMax: 30,
    advice: 'Nếu bạn có tiếng Anh giao tiếp tốt và nắm rõ các điều kiện thương mại quốc tế (Incoterms), mức khởi điểm hoàn toàn có thể đạt 8 - 10 triệu ngay từ khi vừa tốt nghiệp.'
  },
  {
    industryCode: 'KTTM',
    industryName: 'Kinh tế - Tài chính - Thương mại',
    roleName: 'Kế toán nội bộ / Kế toán kho (Mới ra trường)',
    noExpMin: 6.5,
    noExpAvg: 8,
    noExpMax: 10,
    juniorMin: 9.5,
    juniorAvg: 12.5,
    juniorMax: 15,
    midMin: 15,
    midAvg: 19,
    midMax: 26,
    advice: 'Nên chuẩn bị kỹ năng sử dụng hàm Excel thành thạo và nắm vững nguyên lý hạch toán kế toán. Hãy nhấn mạnh tính cẩn thận, trung thực trong buổi phỏng vấn.'
  },
  {
    industryCode: 'MKT',
    industryName: 'Marketing - Truyền thông',
    roleName: 'Content Creator / Chăm sóc Mạng xã hội',
    noExpMin: 6,
    noExpAvg: 7.5,
    noExpMax: 10,
    juniorMin: 9,
    juniorAvg: 12,
    juniorMax: 16,
    midMin: 15,
    midAvg: 20,
    midMax: 28,
    advice: 'Không có kinh nghiệm vẫn có thể deal lương 8 triệu nếu bạn gửi kèm trang Portfolio (Google Sites) chứa 3-5 bài viết mẫu, video ngắn tự dựng hoặc các bài viết đạt lượt tương tác tốt.'
  },
  {
    industryCode: 'GDDT',
    industryName: 'Giáo dục - Đào tạo',
    roleName: 'Trợ giảng tiếng Anh / Tư vấn tuyển sinh',
    noExpMin: 5,
    noExpAvg: 7.5,
    noExpMax: 10,
    juniorMin: 9,
    juniorAvg: 12,
    juniorMax: 15,
    midMin: 14,
    midAvg: 18,
    midMax: 25,
    advice: 'Đối với sinh viên dạy trợ giảng, tính theo giờ dao động từ 35.000đ - 65.000đ/giờ tùy chứng chỉ IELTS/TOEIC và quy mô trung tâm.'
  },
  {
    industryCode: 'NHDD',
    industryName: 'Nhà hàng - Khách sạn - Dịch vụ',
    roleName: 'Nhân viên Pha chế / Phục vụ nhà hàng chuỗi',
    noExpMin: 5.5,
    noExpAvg: 7,
    noExpMax: 9,
    juniorMin: 8,
    juniorAvg: 10,
    juniorMax: 13,
    midMin: 12,
    midAvg: 15,
    midMax: 20,
    advice: 'Hầu hết các chuỗi lớn đào tạo nghề miễn phí. Hãy chú ý các phụ cấp như tiền ăn, tiền tip, thưởng chuyên cần và thưởng doanh số cửa hàng.'
  }
];

export const RECRUITMENT_REVIEWS: RecruitmentReview[] = [
  {
    id: 'rev-01',
    companyId: 'comp-fpt-soft',
    companyName: 'Tập đoàn Công nghệ FPT Software',
    jobTitle: 'Thực tập sinh Frontend Fresher',
    candidateRole: 'Sinh viên mới tốt nghiệp ĐH Bách Khoa',
    rating: 5,
    date: '10/05/2026',
    responseTimeRating: 5,
    interviewExperience: 'Rất tích cực',
    noFeeCharged: true,
    comment: 'Quy trình tuyển dụng rất chuyên nghiệp và minh bạch. Nộp hồ sơ qua hệ thống sau đúng 24h là có bạn HR gọi hẹn phỏng vấn online qua Teams. Buổi phỏng vấn hỏi về đồ án tốt nghiệp và kiến thức JS cơ bản, không hề đánh đố.',
    pros: 'Mentor tận tâm, phụ cấp thực tập đúng ngày, không mất bất kỳ khoản phí nào, môi trường trẻ trung.',
    cons: 'Khu công nghệ cao Hòa Lạc hơi xa trung tâm nhưng có xe buýt công ty đưa đón nên cũng tiện.',
    verifiedApplication: true
  },
  {
    id: 'rev-02',
    companyId: 'comp-viettel-post',
    companyName: 'Tổng công ty Bưu chính Viettel (Viettel Post)',
    jobTitle: 'Nhân viên Điều phối kho vận',
    candidateRole: 'Người tìm việc chưa có kinh nghiệm',
    rating: 5,
    date: '02/05/2026',
    responseTimeRating: 5,
    interviewExperience: 'Rất tích cực',
    noFeeCharged: true,
    comment: 'Tôi từng rất sợ các tin tuyển dụng lừa đảo trên mạng bắt đóng tiền cọc đồng phục 500k. Nhưng khi ứng tuyển tại đây, công ty Viettel Post làm hợp đồng rõ ràng, không thu 1 nghìn nào, cấp phát đồng phục và thẻ nhân viên hoàn toàn miễn phí.',
    pros: 'Tuyệt đối không thu tiền, việc làm thật lương thật, được đào tạo cách dùng máy quét bưu phẩm rất tận tình.',
    cons: 'Các đợt khuyến mãi lớn như 11/11 hay Black Friday hàng nhiều nên cần tăng ca, bù lại lương tăng ca tính đúng luật.',
    verifiedApplication: true
  },
  {
    id: 'rev-03',
    companyId: 'comp-vincommerce',
    companyName: 'Chuỗi Bán lẻ WinCommerce (Masan Group)',
    jobTitle: 'Nhân viên Thu Ngân',
    candidateRole: 'Sinh viên năm 2 ĐH Thương Mại',
    rating: 4,
    date: '18/04/2026',
    responseTimeRating: 4,
    interviewExperience: 'Tích cực',
    noFeeCharged: true,
    comment: 'Phỏng vấn trực tiếp ngay tại siêu thị WinMart gần phòng trọ của mình. Chị Cửa hàng trưởng phỏng vấn rất nhẹ nhàng, chỉ hỏi lịch rảnh và tính cẩn thận trong việc đếm tiền. Sau 2 ngày là được đi học việc.',
    pros: 'Bố trí chỗ làm việc sát nhà, lịch ca linh hoạt theo lịch học, đồng nghiệp thân thiện.',
    cons: 'Thời gian đầu chưa quen đứng nhiều sẽ hơi mỏi chân.',
    verifiedApplication: true
  },
  {
    id: 'rev-04',
    companyId: 'comp-viet-buzz',
    companyName: 'VietBuzz Media & Creative Agency',
    jobTitle: 'Thực tập sinh Content Creator',
    candidateRole: 'Sinh viên Cao đẳng Phát thanh Truyền hình',
    rating: 5,
    date: '25/03/2026',
    responseTimeRating: 5,
    interviewExperience: 'Rất tích cực',
    noFeeCharged: true,
    comment: 'Mình nộp kèm trang Google Sites chứa portfolio các bài viết và clip ngắn đã làm lúc học. Anh Leader xem trực tiếp và khen mình có sự chuẩn bị chu đáo. Được nhận ngay trong tuần!',
    pros: 'Học được cực kỳ nhiều kỹ năng thực tế về viral content, văn phòng có nhiều góc sống ảo và đồ ăn vặt.',
    cons: 'Đôi khi deadline gấp cần lên kịch bản buổi tối nếu có trend hot.',
    verifiedApplication: true
  }
];

export const INITIAL_JOB_ALERTS: JobAlert[] = [
  {
    id: 'alert-01',
    type: 'job',
    title: 'Việc làm mới phù hợp: Thực tập sinh Lập trình Web Frontend',
    message: 'FPT Software đang tuyển dụng thực tập sinh có hỗ trợ đào tạo từ đầu, không yêu cầu kinh nghiệm, trợ cấp 6 - 9 triệu/tháng.',
    companyName: 'FPT Software (CNKT)',
    industryCode: 'CNKT',
    salaryText: '6 - 9 triệu / tháng',
    city: 'Hà Nội & TP. HCM',
    timestamp: '15 phút trước',
    isNoExp: true,
    isRead: false,
    jobId: 'job-cnkt-01'
  },
  {
    id: 'alert-02',
    type: 'job',
    title: 'Việc làm mới phù hợp: Nhân viên Điều phối Đơn hàng & Kho bãi',
    message: 'Viettel Post tuyển dụng trực tiếp tại kho, không qua trung gian, lương 8 - 12 triệu/tháng, chế độ đầy đủ.',
    companyName: 'Viettel Post (DVVT)',
    industryCode: 'DVVT',
    salaryText: '8 - 12 triệu / tháng',
    city: 'Hà Nội & TP. HCM',
    timestamp: '1 giờ trước',
    isNoExp: true,
    isRead: false,
    jobId: 'job-dvvt-01'
  },
  {
    id: 'alert-03',
    type: 'security',
    title: 'Cảnh báo an toàn việc làm: Đề phòng chiêu trò nộp tiền cọc đồng phục',
    message: 'Ban Quản Trị lưu ý: Doanh nghiệp chân chính TUYỆT ĐỐI KHÔNG thu bất kỳ chi phí nào (tiền cọc, giữ chỗ, đồng phục, làm thẻ) khi phỏng vấn.',
    companyName: 'Ban Quản Trị Hệ Thống',
    industryCode: 'ALL',
    salaryText: 'Cảnh báo an toàn 0đ phí',
    city: 'Toàn quốc',
    timestamp: '2 giờ trước',
    isNoExp: true,
    isRead: false
  },
  {
    id: 'alert-04',
    type: 'application',
    title: 'Cập nhật trạng thái: WinMart đã xem hồ sơ ứng tuyển của bạn',
    message: 'Hồ sơ ứng tuyển vị trí Nhân viên Thu Ngân & Bán Hàng của bạn đã được bộ phận nhân sự WinMart tiếp nhận và đang xét duyệt.',
    companyName: 'WinMart (KTTM)',
    industryCode: 'KTTM',
    salaryText: '7 - 10 triệu / tháng',
    city: 'Toàn quốc',
    timestamp: 'Hôm qua',
    isNoExp: true,
    isRead: true,
    jobId: 'job-kttm-01'
  },
  {
    id: 'alert-05',
    type: 'job',
    title: 'Việc làm mới phù hợp: Thực tập sinh Content Creator & Fanpage',
    message: 'VietBuzz Media đang mở tuyển bạn trẻ đam mê mạng xã hội, bắt trend TikTok/Canva, làm việc linh hoạt, trợ cấp 4 - 7 triệu/tháng.',
    companyName: 'VietBuzz Media (MKT)',
    industryCode: 'MKT',
    salaryText: '4 - 7 triệu / tháng',
    city: 'TP. Hồ Chí Minh',
    timestamp: '2 ngày trước',
    isNoExp: true,
    isRead: true,
    jobId: 'job-mkt-01'
  }
];

export const MOCK_INDUSTRIES = INDUSTRIES_DATA;
export const MOCK_COMPANIES = COMPANIES_DATA;
export const MOCK_JOBS = JOBS_DATA;
export const MOCK_SALARY_BENCHMARKS = SALARY_BENCHMARKS;
export const MOCK_RECRUITMENT_REVIEWS = RECRUITMENT_REVIEWS;
export const MOCK_INITIAL_ALERTS = INITIAL_JOB_ALERTS;
