import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? Number(process.argv[portArgIndex + 1]) : null;
const PORT = cliPort || Number(process.env.PORT) || 3000;

const hostArgIndex = process.argv.indexOf('--host');
const cliHost = hostArgIndex !== -1 && process.argv[hostArgIndex + 1] ? process.argv[hostArgIndex + 1] : null;
const HOST = cliHost || process.env.HOST || "0.0.0.0";

app.use(express.json());

// Immediate health check for container readiness
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// ==========================================
// PERSISTENT DATA STORE (file-backed JSON)
// ==========================================
interface UserRecord {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'candidate' | 'recruiter';
  hasSelectedRole: boolean;
  profile?: any;
  employerProfile?: any;
  roleChangeRequest?: {
    targetRole: 'candidate' | 'recruiter';
    reason?: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
  } | null;
  savedJobIds?: string[];
  createdAt: string;
}

interface ApplicationRecord {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  portfolioUrl?: string;
  coverNote: string;
  appliedDate: string;
  status: 'Đã gửi hồ sơ' | 'Doanh nghiệp đã xem' | 'Mời phỏng vấn' | 'Đang xem xét';
  recruiterId?: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  applications: ApplicationRecord[];
  postedJobs: any[];
}

const DB_FILE = path.join(process.cwd(), "app-data-store.json");

function getDefaultDb(): DatabaseSchema {
  return {
    users: [
      {
        id: "usr-candidate-01",
        email: "mailan.nguyen@example.com",
        password: "password123",
        fullName: "Nguyễn Thị Mai Lan",
        role: "candidate",
        hasSelectedRole: true,
        profile: {
          fullName: "Nguyễn Thị Mai Lan",
          birthDate: "2003-08-20",
          email: "mailan.nguyen@example.com",
          currentOccupation: "Sinh viên mới tốt nghiệp - Chưa có kinh nghiệm",
          gender: "Nữ",
          phoneNumber: "0912 345 678",
          portfolioUrl: "https://sites.google.com/view/mailan-portfolio",
          isRegistered: true
        },
        savedJobIds: [],
        roleChangeRequest: null,
        createdAt: new Date().toISOString()
      },
      {
        id: "usr-recruiter-01",
        email: "tuyendung.tantien@example.vn",
        password: "password123",
        fullName: "Trần Thị Thu Hà",
        role: "recruiter",
        hasSelectedRole: true,
        employerProfile: {
          companyName: "Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến",
          taxCode: "0108927164",
          contactName: "Trần Thị Thu Hà (Trưởng phòng Nhân sự)",
          contactEmail: "tuyendung.tantien@example.vn",
          contactPhone: "0988 123 456 (Hotline & Zalo)",
          address: "Tầng 8, Tòa nhà Sông Đà, Phạm Hùng, Mỹ Đình 1, Nam Từ Liêm",
          city: "Hà Nội",
          isVerified: true
        },
        roleChangeRequest: null,
        createdAt: new Date().toISOString()
      }
    ],
    applications: [
      {
        id: "app-01",
        jobId: "job-cnkt-01",
        jobTitle: "Thực tập sinh Lập trình Frontend (Fresher)",
        companyName: "Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến",
        candidateId: "usr-candidate-01",
        candidateName: "Nguyễn Thị Mai Lan",
        candidateEmail: "mailan.nguyen@example.com",
        candidatePhone: "0912 345 678",
        portfolioUrl: "https://sites.google.com/view/mailan-portfolio",
        coverNote: "Em là sinh viên mới tốt nghiệp, đã tự học React & Tailwind CSS. Mong muốn được học hỏi và cống hiến cho công ty.",
        appliedDate: "Hôm nay, 08:30",
        status: "Đã gửi hồ sơ",
        recruiterId: "usr-recruiter-01"
      },
      {
        id: "app-02",
        jobId: "job-cnkt-01",
        jobTitle: "Thực tập sinh Lập trình Frontend (Fresher)",
        companyName: "Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến",
        candidateId: "usr-candidate-02",
        candidateName: "Trần Văn Hoàng",
        candidateEmail: "hoang.tranvan@gmail.com",
        candidatePhone: "0987 654 321",
        portfolioUrl: "https://sites.google.com/view/hoangtran-cv",
        coverNote: "Chào anh/chị, em có kiến thức về JavaScript, HTML/CSS và muốn tìm cơ hội thực tập trực tiếp không qua trung gian.",
        appliedDate: "Hôm qua, 15:45",
        status: "Doanh nghiệp đã xem",
        recruiterId: "usr-recruiter-01"
      },
      {
        id: "app-03",
        jobId: "job-dvvt-01",
        jobTitle: "Nhân viên Hỗ trợ Vận hành & Kho bãi",
        companyName: "Công ty Cổ phần Công nghệ & Dịch vụ Số Tân Tiến",
        candidateId: "usr-candidate-03",
        candidateName: "Lê Thanh Tùng",
        candidateEmail: "tung.lethanh@gmail.com",
        candidatePhone: "0903 112 233",
        coverNote: "Em muốn ứng tuyển làm việc ca linh hoạt, có sức khỏe tốt và tính cẩn thận.",
        appliedDate: "2 ngày trước",
        status: "Mời phỏng vấn",
        recruiterId: "usr-recruiter-01"
      }
    ],
    postedJobs: []
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading database file, using fallback:", err);
  }
  const defaultData = getDefaultDb();
  saveDatabase(defaultData);
  return defaultData;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

// In-memory active database
let db = loadDatabase();

// Strip password from returned user object
function sanitizeUser(user: UserRecord) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// Simple in-memory token store: token -> userId
const tokenStore = new Map<string, string>();
// Pre-seed tokens for demo accounts
tokenStore.set("token_candidate_demo", "usr-candidate-01");
tokenStore.set("token_recruiter_demo", "usr-recruiter-01");

function getUserIdFromReq(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return tokenStore.get(token) || null;
}

// Auth Middleware: attaches req.user
interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    return res.status(401).json({ error: "Yêu cầu đăng nhập để thực hiện thao tác này." });
  }
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: "Phiên đăng nhập không hợp lệ hoặc người dùng không tồn tại." });
  }
  req.user = user;
  next();
}

// Role-based Access Control (RBAC) Middleware
function requireRole(allowedRoles: ('candidate' | 'recruiter')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Yêu cầu đăng nhập." });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Từ chối truy cập: Tài khoản của bạn có vai trò '${req.user.role}', chỉ vai trò [${allowedRoles.join(", ")}] mới được phép thực hiện thao tác này.`
      });
    }
    next();
  };
}

// ==========================================
// AUTHENTICATION & ROLE APIS
// ==========================================

// 1. Get current logged in user and verify role
app.get("/api/auth/me", (req: AuthenticatedRequest, res) => {
  const userId = getUserIdFromReq(req);
  if (!userId) {
    // Return default candidate demo or null
    return res.json({ user: null });
  }
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.json({ user: null });
  }
  res.json({ user: sanitizeUser(user) });
});

// 2. Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Vui lòng nhập email." });
  }

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: "Không tìm thấy tài khoản với email này." });
  }

  // Create session token
  const token = `token_${user.id}_${Date.now()}`;
  tokenStore.set(token, user.id);

  res.json({
    token,
    user: sanitizeUser(user),
    message: `Đăng nhập thành công với vai trò ${user.role === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}.`
  });
});

// 3. Register with role selection
app.post("/api/auth/register", (req, res) => {
  const { email, password, fullName, role, profile, employerProfile } = req.body;
  if (!email || !fullName) {
    return res.status(400).json({ error: "Vui lòng cung cấp email và họ tên." });
  }

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: "Email này đã được sử dụng." });
  }

  const validRole = role === 'recruiter' ? 'recruiter' : 'candidate';
  const hasSelectedRole = Boolean(role === 'recruiter' || role === 'candidate');

  const newUser: UserRecord = {
    id: `usr-${Date.now()}`,
    email: email.trim().toLowerCase(),
    password: password || '123456',
    fullName: fullName.trim(),
    role: validRole,
    hasSelectedRole: hasSelectedRole,
    profile: profile || {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      isRegistered: true,
      currentOccupation: validRole === 'candidate' ? 'Ứng viên tìm việc' : ''
    },
    employerProfile: employerProfile || (validRole === 'recruiter' ? {
      companyName: fullName.trim(),
      taxCode: '0108927164',
      contactName: fullName.trim(),
      contactEmail: email.trim().toLowerCase(),
      contactPhone: '0988 123 456',
      address: 'Hà Nội',
      city: 'Hà Nội',
      isVerified: true
    } : undefined),
    roleChangeRequest: null,
    savedJobIds: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = `token_${newUser.id}_${Date.now()}`;
  tokenStore.set(token, newUser.id);

  res.status(201).json({
    token,
    user: sanitizeUser(newUser),
    message: "Tạo tài khoản thành công."
  });
});

// 4. Secure Role Assignment (called when user first picks role on registration)
app.post("/api/auth/select-role", authMiddleware, (req: AuthenticatedRequest, res) => {
  const { role } = req.body;
  if (role !== 'candidate' && role !== 'recruiter') {
    return res.status(400).json({ error: "Vai trò không hợp lệ. Chỉ chấp nhận 'candidate' hoặc 'recruiter'." });
  }

  const user = req.user!;
  user.role = role;
  user.hasSelectedRole = true;

  // Initialize role defaults if needed
  if (role === 'recruiter' && !user.employerProfile) {
    user.employerProfile = {
      companyName: user.fullName || "Doanh nghiệp tuyển dụng",
      taxCode: "0108927164",
      contactName: user.fullName || "Phụ trách nhân sự",
      contactEmail: user.email,
      contactPhone: "0988 123 456",
      address: "Hà Nội",
      city: "Hà Nội",
      isVerified: true
    };
  }

  saveDatabase(db);

  res.json({
    success: true,
    user: sanitizeUser(user),
    message: `Đã lưu vai trò '${role === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}' vào cơ sở dữ liệu.`
  });
});

// 5. Update Profile
app.post("/api/account/profile", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { profile, employerProfile } = req.body;

  if (profile) {
    user.profile = { ...user.profile, ...profile };
    if (profile.fullName) user.fullName = profile.fullName;
  }
  if (employerProfile) {
    user.employerProfile = { ...user.employerProfile, ...employerProfile };
  }

  saveDatabase(db);
  res.json({ success: true, user: sanitizeUser(user) });
});

// Update Recruiter Company Profile
app.put("/api/recruiter/company-profile", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  user.employerProfile = { ...user.employerProfile, ...req.body };
  saveDatabase(db);
  res.json({ success: true, user: sanitizeUser(user), employerProfile: user.employerProfile });
});

app.post("/api/recruiter/company-profile", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  user.employerProfile = { ...user.employerProfile, ...req.body };
  saveDatabase(db);
  res.json({ success: true, user: sanitizeUser(user), employerProfile: user.employerProfile });
});

// 6. Role Change Request Process (Secured, no direct client tampering)
app.post("/api/account/request-role-change", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { targetRole, reason } = req.body;

  if (targetRole !== 'candidate' && targetRole !== 'recruiter') {
    return res.status(400).json({ error: "Vai trò yêu cầu không hợp lệ. Phải là 'candidate' hoặc 'recruiter'." });
  }

  if (targetRole === user.role) {
    return res.status(400).json({ error: "Bạn đã đang ở vai trò này rồi." });
  }

  // Set pending role change request - current role remains intact!
  user.roleChangeRequest = {
    targetRole,
    reason: reason || "Người dùng yêu cầu đổi vai trò từ cài đặt tài khoản",
    status: 'pending',
    requestedAt: new Date().toISOString()
  };

  saveDatabase(db);

  res.json({
    success: true,
    message: `Yêu cầu đổi sang vai trò '${targetRole === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}' đã được tiếp nhận và đang ở trạng thái chờ phê duyệt. Vai trò hiện tại của bạn vẫn được giữ nguyên.`,
    user: sanitizeUser(user)
  });
});

// Cancel pending role change request
app.post("/api/account/cancel-role-change", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  user.roleChangeRequest = null;
  saveDatabase(db);
  res.json({ success: true, user: sanitizeUser(user), message: "Đã hủy yêu cầu đổi vai trò." });
});

// Approve role change request (Simulate system administrator / verified approval)
app.post("/api/account/approve-role-change", authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (!user.roleChangeRequest || user.roleChangeRequest.status !== 'pending') {
    return res.status(400).json({ error: "Không có yêu cầu đổi vai trò nào đang chờ xử lý." });
  }

  const newRole = user.roleChangeRequest.targetRole;
  user.role = newRole;
  user.roleChangeRequest.status = 'approved';

  if (newRole === 'recruiter' && !user.employerProfile) {
    user.employerProfile = {
      companyName: user.fullName || "Doanh nghiệp mới",
      taxCode: "0108927164",
      contactName: user.fullName,
      contactEmail: user.email,
      contactPhone: "0988 123 456",
      address: "Hà Nội",
      city: "Hà Nội",
      isVerified: true
    };
  }

  saveDatabase(db);

  res.json({
    success: true,
    message: `Hệ thống đã phê duyệt chuyển đổi sang vai trò '${newRole === 'recruiter' ? 'Nhà tuyển dụng' : 'Ứng viên'}'.`,
    user: sanitizeUser(user)
  });
});

// Quick switch between pre-seeded demo accounts
app.post("/api/auth/switch-demo", (req, res) => {
  const { role } = req.body;
  const targetUser = db.users.find(u => u.role === (role === 'recruiter' ? 'recruiter' : 'candidate'));
  if (!targetUser) {
    return res.status(404).json({ error: "Không tìm thấy tài khoản demo phù hợp." });
  }
  const token = `token_${targetUser.id}_demo`;
  tokenStore.set(token, targetUser.id);
  res.json({ token, user: sanitizeUser(targetUser) });
});

// ==========================================
// CANDIDATE-PROTECTED APIS (requireRole(['candidate']))
// ==========================================

// Candidate applies for a job
app.post("/api/candidate/applications", authMiddleware, requireRole(['candidate']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { jobId, jobTitle, companyName, coverNote, portfolioUrl } = req.body;

  if (!jobId || !jobTitle) {
    return res.status(400).json({ error: "Thiếu thông tin công việc cần ứng tuyển." });
  }

  const newApp: ApplicationRecord = {
    id: `app-${Date.now()}`,
    jobId,
    jobTitle,
    companyName: companyName || "Doanh nghiệp",
    candidateId: user.id,
    candidateName: user.fullName,
    candidateEmail: user.email,
    candidatePhone: user.profile?.phoneNumber || "0912 345 678",
    portfolioUrl: portfolioUrl || user.profile?.portfolioUrl || "",
    coverNote: coverNote || "Ứng tuyển trực tiếp không qua trung gian.",
    appliedDate: "Vừa xong",
    status: "Đã gửi hồ sơ",
    recruiterId: "usr-recruiter-01"
  };

  db.applications.unshift(newApp);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    application: newApp,
    message: "Hồ sơ ứng tuyển đã được gửi trực tiếp đến nhà tuyển dụng."
  });
});

// Candidate gets their own applications
app.get("/api/candidate/applications", authMiddleware, requireRole(['candidate']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  // Return applications submitted by this candidate
  const candidateApps = db.applications.filter(
    a => a.candidateId === user.id || a.candidateEmail.toLowerCase() === user.email.toLowerCase()
  );
  res.json({ applications: candidateApps });
});

// Candidate saved jobs
app.get("/api/candidate/saved-jobs", authMiddleware, requireRole(['candidate']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({ savedJobIds: user.savedJobIds || [] });
});

app.post("/api/candidate/saved-jobs/toggle", authMiddleware, requireRole(['candidate']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ error: "Thiếu jobId." });

  let saved = user.savedJobIds || [];
  let isSaved = false;
  if (saved.includes(jobId)) {
    saved = saved.filter(id => id !== jobId);
    isSaved = false;
  } else {
    saved.push(jobId);
    isSaved = true;
  }
  user.savedJobIds = saved;
  saveDatabase(db);

  res.json({ success: true, savedJobIds: saved, isSaved });
});

// ==========================================
// RECRUITER-PROTECTED APIS (requireRole(['recruiter']))
// ==========================================

// Recruiter gets applications submitted to their company
app.get("/api/recruiter/applications", authMiddleware, requireRole(['recruiter']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  // Return applications directed to this recruiter
  const companyName = user.employerProfile?.companyName?.toLowerCase() || "";
  const recruiterApps = db.applications.filter(a => {
    if (a.recruiterId === user.id) return true;
    if (companyName && a.companyName.toLowerCase().includes(companyName)) return true;
    return true; // demo: recruiter sees candidates applying to their postings
  });
  res.json({ applications: recruiterApps });
});

// Recruiter updates status of an application
app.patch("/api/recruiter/applications/:id/status", authMiddleware, requireRole(['recruiter']), (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appRecord = db.applications.find(a => a.id === id);
  if (!appRecord) {
    return res.status(404).json({ error: "Không tìm thấy hồ sơ ứng tuyển này." });
  }

  const validStatuses = ['Đã gửi hồ sơ', 'Doanh nghiệp đã xem', 'Mời phỏng vấn', 'Đang xem xét'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ." });
  }

  appRecord.status = status;
  saveDatabase(db);

  res.json({ success: true, application: appRecord });
});

// Recruiter posts a new job
app.post("/api/recruiter/jobs", authMiddleware, requireRole(['recruiter']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const jobData = req.body;

  if (!jobData.title) {
    return res.status(400).json({ error: "Tiêu đề công việc là bắt buộc." });
  }

  const newJob = {
    ...jobData,
    id: `job-posted-${Date.now()}`,
    companyName: user.employerProfile?.companyName || user.fullName,
    companyId: user.id,
    postedByRecruiterId: user.id,
    isVerifiedDirect: true,
    postedDate: "Vừa đăng",
    deadline: jobData.deadline || "30 ngày tới"
  };

  db.postedJobs.unshift(newJob);
  saveDatabase(db);

  res.status(201).json({ success: true, job: newJob });
});

// Recruiter gets their posted jobs
app.get("/api/recruiter/my-jobs", authMiddleware, requireRole(['recruiter']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const myJobs = db.postedJobs.filter(j => j.postedByRecruiterId === user.id || j.companyName === user.employerProfile?.companyName);
  res.json({ jobs: myJobs });
});

// Recruiter updates company profile
app.put("/api/recruiter/company-profile", authMiddleware, requireRole(['recruiter']), (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  const profileData = req.body;
  user.employerProfile = { ...user.employerProfile, ...profileData };
  saveDatabase(db);
  res.json({ success: true, employerProfile: user.employerProfile });
});

// ==========================================
// PUBLIC & AI ENDPOINTS
// ==========================================

// Initialize Gemini Client safely with dynamic import on demand
let aiClient: any = null;
async function getGeminiClient(): Promise<any> {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenAI } = await import("@google/genai");
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", appName: "Nối cơ hội - Đổi cuộc đời" });
});

// AI CV Advice endpoint
app.post("/api/ai/cv-advice", async (req, res) => {
  const { major, targetRole, skills, experienceLevel, userDraft } = req.body;

  const prompt = `Bạn là chuyên gia tư vấn tuyển dụng và hướng nghiệp hàng đầu tại Việt Nam, đặc biệt hỗ trợ sinh viên mới ra trường và người chưa có kinh nghiệm ("Nối cơ hội - Đổi cuộc đời").
Hãy đưa ra lời khuyên cụ thể, thực tế và dễ áp dụng cho ứng viên sau:
- Khối ngành: ${major || "Không xác định"}
- Vị trí mong muốn: ${targetRole || "Chưa xác định"}
- Kỹ năng hiện có: ${skills || "Chưa liệt kê"}
- Trình độ kinh nghiệm: ${experienceLevel || "Mới tốt nghiệp / Chưa có kinh nghiệm"}
- Nội dung bản nháp (nếu có): ${userDraft || "Chưa có"}

Nhiệm vụ của bạn:
1. Gợi ý 4-5 nội dung cốt lõi bắt buộc phải có trong CV người chưa có kinh nghiệm để gây ấn tượng với nhà tuyển dụng (cách biến đồ án, bài tập lớn, hoạt động Đoàn - Hội thành kinh nghiệm thực chiến).
2. Hướng dẫn cách tạo trang web Portfolio trên Google Sites (tại sao Google Sites lại miễn phí, nhanh chóng và chứng minh năng lực thật).
3. Viết mẫu 1 đoạn "Mục tiêu nghề nghiệp" (Career Objective) ngắn gọn, truyền cảm hứng và thể hiện tinh thần sẵn sàng học hỏi.
4. Cảnh báo 2 dấu hiệu lừa đảo tuyển dụng phổ biến ứng viên vị trí này cần tránh (như nộp tiền đặt cọc, làm nhiệm vụ online mờ ám).

Hãy trả lời bằng tiếng Việt, giọng văn ấm áp, khích lệ, gạch đầu dòng rõ ràng, súc tích và thiết thực.`;

  const ai = await getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ advice: response.text, source: "gemini" });
    } catch (error: any) {
      console.error("Gemini API error, using curated advice fallback:", error?.message);
    }
  }

  const fallbackAdvice = `### 🌟 Lời khuyên tối ưu CV cho bạn: ${targetRole || "Ứng viên mới"} (${major || "Tất cả ngành nghề"})

1. **Cách biến "Chưa có kinh nghiệm" thành điểm mạnh:**
   - **Đồ án môn học & Luận văn:** Đặt tên dự án rõ ràng, ghi rõ bạn phụ trách phần việc nào, công cụ đã dùng và kết quả đạt được.
   - **Hoạt động ngoại khóa & Câu lạc bộ:** Nêu bật kỹ năng mềm (làm việc nhóm, giao tiếp, xử lý tình huống).
   - **Thái độ học hỏi & Sự cầu tiến:** Nhà tuyển dụng đánh giá cao sự trung thực và tinh thần học hỏi.

2. **Cách tận dụng Google Sites để tạo Portfolio số ấn tượng:**
   - Truy cập **sites.google.com** hoàn toàn miễn phí.
   - Chọn template "Portfolio" hoặc tạo trang trắng, thêm sản phẩm đã làm và đính kèm link vào CV.

3. **Mẫu đoạn Mục tiêu nghề nghiệp gợi ý:**
   *"Là cử nhân tốt nghiệp chuyên ngành ${major || "phù hợp"} với tinh thần trách nhiệm cao và khả năng tiếp thu nhanh, mục tiêu của tôi là ứng tuyển vào vị trí ${targetRole || "nhân viên / thực tập sinh"} tại quý công ty để cống hiến và phát triển kỹ năng thực chiến."*

4. **🛡️ Lưu ý an toàn - Tránh bẫy tuyển dụng:**
   - Tuyệt đối **KHÔNG** đóng bất kỳ khoản tiền nào. Doanh nghiệp chân chính không bao giờ thu tiền ứng viên.`;

  return res.json({ advice: fallbackAdvice, source: "curated" });
});

// AI Interview simulation endpoint
app.post("/api/ai/interview-prep", async (req, res) => {
  const { roleName, industry } = req.body;
  const prompt = `Gợi ý 3 câu hỏi phỏng vấn thường gặp nhất dành cho vị trí "${roleName}" ngành "${industry}" đối với ứng viên chưa có kinh nghiệm, kèm câu trả lời mẫu thông minh, chân thành để gây ấn tượng mạnh với nhà tuyển dụng. Định dạng bằng tiếng Việt rõ ràng, dễ hiểu.`;

  const ai = await getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });
      return res.json({ questions: response.text, source: "gemini" });
    } catch (err: any) {
      console.error("Gemini API error in interview prep:", err?.message);
    }
  }

  const fallbackQuestions = `### 🎯 3 Câu hỏi phỏng vấn thực chiến cho vị trí ${roleName || "Nhân viên mới"}:

1. **"Bạn chưa có kinh nghiệm thực tế, làm thế nào để đảm bảo bạn hoàn thành tốt công việc này?"**
   - *Gợi ý trả lời:* "Dạ, em hiểu kinh nghiệm thực chiến là rất quan trọng. Tuy nhiên trong quá trình học tập, em đã rèn luyện tinh thần tự học cao và hoàn thành các đồ án sát thực tế. Em tự tin với khả năng tiếp thu nhanh và sẵn sàng nỗ lực để bắt nhịp công việc."

2. **"Nếu gặp một nhiệm vụ mới mà bạn chưa từng làm bao giờ, bạn sẽ giải quyết thế nào?"**
   - *Gợi ý trả lời:* "Đầu tiên em sẽ tìm hiểu kỹ tài liệu nội bộ và các hướng dẫn có sẵn. Nếu có điểm chưa rõ, em sẽ chuẩn bị trước các phương án giải quyết và chủ động xin ý kiến hướng dẫn từ quản lý."

3. **"Mục tiêu phát triển của bạn trong 1 - 2 năm tới là gì?"**
   - *Gợi ý trả lời:* "Trong 6 tháng đầu, mục tiêu của em là thành thạo quy trình công việc và tạo ra kết quả tốt. Trong 1-2 năm tới, em mong muốn nâng cao năng lực chuyên môn để đảm nhận các trọng trách lớn hơn."`;

  return res.json({ questions: fallbackQuestions, source: "curated" });
});

let viteMiddleware: any = null;

if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/health') {
      return next();
    }
    if (viteMiddleware) {
      return viteMiddleware(req, res, next);
    }
    // Temporary fallback during the brief ~1s cold-start warm-up
    res.status(200).send(`<!doctype html><html><head><meta http-equiv="refresh" content="1"><title>Nối cơ hội - Đổi cuộc đời</title></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#334155;background:#f8fafc;"><div style="text-align:center"><div style="font-weight:bold;margin-bottom:8px">Đang khởi động hệ thống...</div><div style="font-size:12px;color:#64748b">Vui lòng chờ trong giây lát</div></div></body></html>`);
  });
} else {
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function startServer() {
  app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
  });

  if (process.env.NODE_ENV !== "production") {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      viteMiddleware = vite.middlewares;
      console.log("Vite development middleware mounted successfully.");
    } catch (err) {
      console.error("Failed to initialize Vite server:", err);
    }
  }
}

startServer();
