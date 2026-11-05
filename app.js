const appRuntimeStore = Object.create(null);
function readStoredJson(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(appRuntimeStore, key))
    return appRuntimeStore[key];
  let value = fallback;
  try {
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        value = JSON.parse(stored);
      }
    }
  } catch {
    value = fallback;
  }
  appRuntimeStore[key] = value;
  return value;
}
function writeStoredJson(key, value) {
  appRuntimeStore[key] = value;
  try {
    if (typeof localStorage !== "undefined")
      localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the in-memory cache available when browser storage is blocked.
  }
  return value;
}
function readStoredArray(key) {
  const value = readStoredJson(key, []);
  return Array.isArray(value) ? value : [];
}
function getApplications() {
  return readStoredArray("jobhub-applications");
}
function saveApplications(value) {
  return writeStoredJson(
    "jobhub-applications",
    Array.isArray(value) ? value : [],
  );
}
function getInterviews() {
  return readStoredArray("jobhub-interviews");
}
function saveInterviews(value) {
  return writeStoredJson(
    "jobhub-interviews",
    Array.isArray(value) ? value : [],
  );
}
function getTalentPool() {
  return readStoredArray("jobhub-talent-pool");
}
function saveTalentPool(value) {
  return writeStoredJson(
    "jobhub-talent-pool",
    Array.isArray(value) ? value : [],
  );
}
function getSubscriptions() {
  return readStoredArray("jobhub-company-subscriptions");
}
function saveSubscriptions(value) {
  return writeStoredJson(
    "jobhub-company-subscriptions",
    Array.isArray(value) ? value : [],
  );
}
function getCurrentSubscription() {
  const companyId = billingCompanyId();
  if (!companyId) return null;
  return (
    getSubscriptions().find(
      (item) =>
        String(item.companyId || "") === String(companyId) &&
        item.status === "active" &&
        new Date(item.expiredDate) > new Date(),
    ) || null
  );
}
function getTalentCategories() {
  const categories = readStoredArray("jobhub-talent-categories");
  return categories.length ? categories : DEFAULT_TALENT_CATEGORIES;
}
function saveTalentCategories(value) {
  return writeStoredJson(
    "jobhub-talent-categories",
    Array.isArray(value) ? value : DEFAULT_TALENT_CATEGORIES,
  );
}
function getCompanyVerifications() {
  return readStoredArray(COMPANY_VERIFICATION_KEY);
}
function saveCompanyVerifications(value) {
  return writeStoredJson(
    COMPANY_VERIFICATION_KEY,
    Array.isArray(value) ? value : [],
  );
}
function getVerifiedCompanyProfiles() {
  return readStoredArray(COMPANY_PROFILE_KEY);
}
function saveVerifiedCompanyProfiles(value) {
  return writeStoredJson(
    COMPANY_PROFILE_KEY,
    Array.isArray(value) ? value : [],
  );
}
const jobs = readStoredArray("jobhub-company-jobs");
const categories = [
  [
    "IT",
    '<i class="fa-solid fa-code" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Marketing",
    '<i class="fa-solid fa-bullhorn" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Finance",
    '<i class="fa-solid fa-coins" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Design",
    '<i class="fa-solid fa-pen-nib" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Manufacturing",
    '<i class="fa-solid fa-industry" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Customer Service",
    '<i class="fa-solid fa-headset" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Security",
    '<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Presenter",
    '<i class="fa-solid fa-microphone-lines" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Logistics",
    '<i class="fa-solid fa-truck-fast" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Office Boy (OB)",
    '<i class="fa-solid fa-broom" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Pekerja Serabutan",
    '<i class="fa-solid fa-person-digging" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Pergudangan",
    '<i class="fa-solid fa-warehouse" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "ART (Asisten Rumah Tangga)",
    '<i class="fa-solid fa-house-user" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Konstruksi & Infrastruktur",
    '<i class="fa-solid fa-helmet-safety" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Perumahan & Properti",
    '<i class="fa-solid fa-house" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Interior",
    '<i class="fa-solid fa-couch" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Penerjemah",
    '<i class="fa-solid fa-language" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Editor Video",
    '<i class="fa-solid fa-video" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Fotografer",
    '<i class="fa-solid fa-camera" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Editor Foto",
    '<i class="fa-solid fa-image" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Jasa Lainnya",
    '<i class="fa-solid fa-screwdriver-wrench" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
];
categories.push(
  [
    "Kesehatan & Medis",
    '<i class="fa-solid fa-heart-pulse" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Pendidikan",
    '<i class="fa-solid fa-graduation-cap" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Perhotelan & Pariwisata",
    '<i class="fa-solid fa-hotel" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Sumber Daya Manusia",
    '<i class="fa-solid fa-people-group" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Hukum",
    '<i class="fa-solid fa-scale-balanced" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
  [
    "Pertanian & Peternakan",
    '<i class="fa-solid fa-wheat-awn" aria-hidden="true"></i>',
    "Jelajahi kategori",
  ],
);
const COMPANY_PACKAGE_CATALOG = [
  {
    name: "JOBHUB Starter",
    price: 99000,
    priceLabel: "Rp99.000",
    note: "Mulai dengan paket bisnis ringan untuk rekrutmen terbatas.",
    durationDays: 30,
    activeJobs: 1,
    postedJobs: 1,
    candidateLimit: 10,
    features: { talentPool: true, cvAnalyzer: false, analytics: false },
    items: [
      "1 lowongan aktif",
      "Maksimal 10 kandidat",
      "ATS dasar",
      "Talent Pool",
      "Masa aktif 30 hari",
    ],
    freeTrial: false,
  },
  {
    name: "JOBHUB Professional",
    price: 299000,
    priceLabel: "Rp299.000",
    note: "Untuk tim yang ingin mengelola lamaran dan kandidat lebih teratur.",
    durationDays: 30,
    activeJobs: 10,
    candidateLimit: 500,
    features: { talentPool: true, cvAnalyzer: true, analytics: true },
    items: [
      "10 lowongan aktif",
      "Maksimal 500 kandidat",
      "Talent Pool & CV Analyzer",
      "Analitik rekrutmen",
      "Masa aktif 30 hari",
    ],
    featured: true,
  },
  {
    name: "JOBHUB Business",
    price: 799000,
    priceLabel: "Rp799.000",
    note: "Solusi untuk perusahaan yang tumbuh cepat dan butuh kapasitas lebih besar.",
    durationDays: 30,
    activeJobs: Infinity,
    candidateLimit: Infinity,
    features: { talentPool: true, cvAnalyzer: true, analytics: true },
    items: [
      "Lowongan & kandidat tanpa batas",
      "Semua fitur Professional",
      "Dukungan prioritas",
      "Masa aktif 30 hari",
    ],
  },
  {
    name: "JOBHUB Enterprise",
    price: 0,
    priceLabel: "Custom",
    note: "Dirancang sesuai kebutuhan perusahaan besar dengan SLA dan fitur khusus.",
    durationDays: 30,
    activeJobs: Infinity,
    candidateLimit: Infinity,
    features: { talentPool: true, cvAnalyzer: true, analytics: true },
    items: [
      "Kustomisasi kebutuhan",
      "Tim HR & admin khusus",
      "SLA & onboarding prioritas",
      "Masa aktif sesuai kesepakatan",
    ],
    custom: true,
  },
];
const plans = COMPANY_PACKAGE_CATALOG.map((plan) => ({
  ...plan,
  features: { ...plan.features },
}));
function normalizeSubscription(subscription) {
  return {
    ...subscription,
    companyId: subscription.companyId || subscription.company_id || "",
    package: subscription.package || "",
    startDate: subscription.startDate || subscription.start_date || "",
    expiredDate: subscription.expiredDate || subscription.expired_date || "",
    status: subscription.status || "",
  };
}
function getCompanyPlan() {
  const subscription = getCurrentSubscription();
  return plans.find((plan) => plan.name === subscription?.package) || null;
}
function normalizeCompanyPackageCatalog(catalog) {
  if (!Array.isArray(catalog)) return null;
  const updated = COMPANY_PACKAGE_CATALOG.map((defaultPlan) => {
    const saved = catalog.find((item) => item?.name === defaultPlan.name);
    if (!saved)
      return {
        ...defaultPlan,
        features: { ...defaultPlan.features },
        items: [...defaultPlan.items],
      };
    const numericLimit = (value) =>
      value === null || value === "" || value === undefined
        ? Infinity
        : Math.max(1, Math.floor(Number(value) || 1));
    const price = Math.max(0, Math.floor(Number(saved.price) || 0));
    return {
      ...defaultPlan,
      price,
      priceLabel: defaultPlan.custom
        ? "Custom"
        : `Rp${new Intl.NumberFormat("id-ID").format(price)}`,
      note: String(saved.note || defaultPlan.note).slice(0, 300),
      durationDays: Math.min(
        3650,
        Math.max(
          1,
          Math.floor(
            Number(saved.durationDays) || defaultPlan.durationDays || 30,
          ),
        ),
      ),
      activeJobs: numericLimit(saved.activeJobs),
      postedJobs: numericLimit(saved.postedJobs ?? saved.activeJobs),
      candidateLimit: numericLimit(saved.candidateLimit),
      features: {
        ...defaultPlan.features,
        ...Object.fromEntries(
          Object.keys(defaultPlan.features).map((key) => [
            key,
            saved.features?.[key] === true,
          ]),
        ),
      },
      items: Array.isArray(saved.items)
        ? saved.items
            .map((item) => String(item).slice(0, 160))
            .filter(Boolean)
            .slice(0, 12)
        : defaultPlan.items,
      featured: saved.featured === true,
    };
  });
  plans.splice(0, plans.length, ...updated);
  return plans;
}
function renderPricing() {
  const grid = $("#pricingGrid");
  if (!grid) return;
  const subscription = isCompanyAccount() ? getCurrentSubscription() : null;
  const activePlan = subscription?.package || "";
  const trialUsed = getSubscriptions().some(
    (item) =>
      item.companyId === billingCompanyId() &&
      item.package === "Gratis 21 Hari",
  );
  const trialActive = activePlan === "Gratis 21 Hari";
  const trialCard = `<article class="price-card free-trial ${trialActive ? "is-active" : ""}"><span class="popular">TRIAL</span><h3>Gratis 21 Hari</h3><div class="price">Rp0 <small>/ 21 hari</small></div><p>Coba fitur rekrutmen sebelum memilih paket berbayar.</p><ul><li>1 lowongan aktif</li><li>Masa aktif 21 hari</li><li>Untuk perusahaan terverifikasi</li></ul><button class="btn" type="button" data-activate-free-trial ${trialActive || trialUsed ? "disabled" : ""}>${trialActive ? "Paket aktif" : trialUsed ? "Trial sudah digunakan" : "Aktifkan trial gratis"}</button></article>`;
  const packageCards = plans
    .map((plan) => {
      const isActive = activePlan === plan.name;
      const price = plan.custom
        ? "Custom"
        : `Rp${new Intl.NumberFormat("id-ID").format(plan.price)}`;
      const duration = `${plan.durationDays} hari`;
      const items = Array.isArray(plan.items) ? plan.items : [];
      const action = isActive
        ? "Paket aktif"
        : plan.custom
          ? "Hubungi tim JobHub"
          : "Pilih paket";
      return `<article class="price-card ${plan.featured ? "featured" : ""} ${isActive ? "is-active" : ""}">${plan.featured ? '<span class="popular">PALING POPULER</span>' : ""}<h3>${escapeHtml(plan.name)}</h3><div class="price">${escapeHtml(price)} <small>${plan.custom ? "" : "/ " + duration}</small></div><p>${escapeHtml(plan.note || "Paket rekrutmen perusahaan.")}</p><ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><button class="btn" type="button" data-pay="${escapeHtml(plan.name)}" ${isActive ? "disabled" : ""}>${action}</button></article>`;
    })
    .join("");
  grid.innerHTML = trialCard + packageCards;
}
function startSubscriptionCheckout(packageName) {
  const plan = plans.find((item) => item.name === packageName);
  if (!plan)
    return toast("Paket tidak ditemukan. Muat ulang halaman dan coba lagi.");
  if (!isCompanyAccount())
    return toast("Masuk sebagai akun perusahaan untuk memilih paket.");
  toast(
    plan.custom
      ? "Paket Enterprise memerlukan penawaran khusus dari tim JobHub."
      : "Checkout paket berbayar belum tersedia. Trial gratis 21 hari dapat diaktifkan setelah perusahaan terverifikasi.",
  );
}
async function activateCompanyFreeTrial(button) {
  if (!supabaseClient || !supabaseSession || !isCompanyAccount()) {
    toast("Masuk ke akun perusahaan untuk mengaktifkan trial.");
    openAuthModal(false);
    return;
  }
  button.disabled = true;
  try {
    const { error } = await supabaseClient.rpc("activate_company_free_trial");
    if (error) throw error;
    const { data, error: refreshError } =
      await supabaseClient.auth.refreshSession();
    if (refreshError) throw refreshError;
    if (!data.session)
      throw new Error("Sesi perlu dimuat ulang. Keluar lalu masuk kembali.");
    supabaseSession = data.session;
    await loadCompanySubscription();
    renderDashboard();
    renderPricing();
    toast("Trial perusahaan aktif selama 21 hari.");
  } catch (error) {
    toast(
      `Trial belum dapat diaktifkan: ${error.message || "periksa verifikasi perusahaan dan migrasi company-free-trial.sql."}`,
    );
  } finally {
    if (button.isConnected) button.disabled = false;
  }
}
let activeRoute = "home",
  currentJob = null,
  activeCanvaApplyJobId = "",
  activeJobDetailId = "",
  searchState = {
    keyword: "",
    location: "",
    category: "",
  };
let pendingAuthRoute = "";
let activeTalentCategory = "all";
let adminVerificationCache = null,
  activeCompanyDocumentUrls = [],
  companyVerificationUploads = new Set();
let adminJobsCache = [],
  adminCompaniesCache = [],
  adminCandidatesCache = [];
let adminUsersCache = [],
  adminUserPage = 1,
  adminUserTotal = 0;
let adminAnalyticsData = null,
  adminAnalyticsPeriod = "day",
  adminClockTimer = 0,
  companyDashboardClockTimer = 0,
  websiteBrandingCache = null,
  websiteBrandingChannel = null;
let companyRecruitmentAnalytics = null,
  companyRecruitmentDays = 30,
  companyRecruitmentRequest = 0,
  recentApplicantProfiles = new Map(),
  recentApplicantProfilesRequest = 0;
let currentSubscriptionCache = null,
  subscriptionChannel = null,
  subscriptionOwnerId = "";
let jobMessageChannel = null,
  jobMessageChannelKey = "",
  jobMessageApplications = [],
  jobMessages = [],
  activeMessageApplicationId = "",
  jobMessageSearchTimer = 0,
  activeMessageJobId = "",
  dashboardMessageCountCache = 0;
let candidateChatPopupOpen = false,
  candidateChatViewPosition = null,
  candidateUnreadMessageCount = 0;
let activeDashboardSection = "overview";
const dashboardInlineViewPositions = new Map();
let invitePasswordPromptedFor = "";
let googleOAuthProcessingUserId = "";
let companyProfileCache = null,
  companyProfileOwnerId = "",
  companyProfileLoadPromise = null,
  companyProfileLoadCompanyId = "",
  companyProfileLoadErrorMessage = "",
  companyProfileLoadErrorAt = 0,
  currentCompanyVerification = null,
  companyVerificationOwnerId = "",
  companyOnboardingChannel = null,
  companyOnboardingChannelKey = "",
  companyProfileAddressDraftHandler = null;
let candidateProfilesCache = [],
  candidateProfilesLoaded = false,
  candidateProfilesPromise = null;
let jobRenderTimer = 0;
const ATS_STATUSES = [
  "New Applicant",
  "CV Review",
  "Interview",
  "Technical Test",
  "Final Interview",
  "Accepted",
  "Rejected",
];
const INTERVIEW_TYPES = ["Interview", "Final Interview", "Technical Test"];
const DEFAULT_TALENT_CATEGORIES = [
  "Umum",
  "Teknologi",
  "Leadership",
  "Potensial",
];
const CV_DATABASE_NAME = "jobhub-cv-files";
const CV_STORE_NAME = "files";
const COMPANY_DOCUMENT_STORE = "company-documents";
const COMPANY_VERIFICATION_KEY = "jobhub-company-verifications";
const COMPANY_PROFILE_KEY = "jobhub-verified-company-profiles";
const COMPANY_PROFILE_DRAFT_KEY = "jobhub-company-profile-draft:";
const ADMIN_EMAIL_ALLOWLIST = new Set(["aprhyzsilla49@gmail.com"]);
const DEMO_COMPANY_INVITES_KEY = "jobhub-demo-company-invites";
const COMPANY_DOCUMENT_TYPES = [
  ["nib", "NIB"],
  ["npwp", "NPWP"],
  ["legal", "Dokumen legal"],
];
const ADMIN_SITE_IMAGE_ASSETS = [
  {
    key: "rantauCandidateBanner",
    label: "Banner JobHub Rantau di Pencari Kerja",
    group: "JobHub Rantau",
    folder: "rantau",
  },
  {
    key: "rantauHero",
    label: "Hero pencarian JobHub Rantau",
    group: "JobHub Rantau",
    folder: "rantau",
  },
  {
    key: "companyDashboardHeader",
    label: "Header merah-putih dashboard perusahaan",
    group: "Header website",
    folder: "dashboard-header",
  },
  {
    key: "partnerTelkomsel",
    label: "Logo Telkomsel",
    group: "Logo partner beranda",
    folder: "partner-logos",
  },
  {
    key: "partnerGojek",
    label: "Logo Gojek",
    group: "Logo partner beranda",
    folder: "partner-logos",
  },
  {
    key: "partnerBlibli",
    label: "Logo Blibli",
    group: "Logo partner beranda",
    folder: "partner-logos",
  },
  {
    key: "partnerHalodoc",
    label: "Logo Halodoc",
    group: "Logo partner beranda",
    folder: "partner-logos",
  },
  {
    key: "spotlightPortrait1",
    label: "Potret Spotlight 1",
    group: "Talent Spotlight",
    folder: "talent-spotlight",
  },
  {
    key: "spotlightPortrait2",
    label: "Potret Spotlight 2",
    group: "Talent Spotlight",
    folder: "talent-spotlight",
  },
  {
    key: "spotlightPortrait3",
    label: "Potret Spotlight 3",
    group: "Talent Spotlight",
    folder: "talent-spotlight",
  },
  {
    key: "spotlightPortrait4",
    label: "Potret Spotlight 4",
    group: "Talent Spotlight",
    folder: "talent-spotlight",
  },
  {
    key: "spotlightPortrait5",
    label: "Potret Spotlight 5",
    group: "Talent Spotlight",
    folder: "talent-spotlight",
  },
  {
    key: "newsCoverCoverLetter",
    label: "Panduan: CV dan surat lamaran",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverPromotion",
    label: "Panduan: promosi karier",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverSalary",
    label: "Panduan: gaji",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverInterview",
    label: "Panduan: wawancara",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverContract",
    label: "Panduan: kontrak kerja",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverSearch",
    label: "Panduan: mencari kerja dan sumber resmi",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverCv",
    label: "Panduan: CV",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverRegulations",
    label: "Panduan: peraturan kerja",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
  {
    key: "newsCoverScam",
    label: "Panduan: penipuan lowongan",
    group: "Cover panduan karier",
    folder: "career-guides",
  },
];
let supabaseClient = null,
  supabaseSession = null,
  supabaseSessionReady = false,
  atsChannel = null,
  interviewChannel = null,
  talentChannel = null,
  jobsChannel = null,
  publicJobsChannel = null,
  activeCvObjectUrl = null,
  candidateInterviewCache = null;
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
function escapeHtml(value = "") {
  return String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
function loadingIndicator(label = "Memuat...") {
  return `<div class="loading-indicator" role="status" aria-live="polite">${escapeHtml(label)}</div>`;
}
async function syncCompanyJob(job) {
  if (!supabaseClient || !isHrdSession())
    throw new Error("Sesi HRD tidak tersedia. Silakan masuk kembali.");
  const { error } = await supabaseClient.from("jobhub_jobs").upsert({
    id: job.id,
    company_id: billingCompanyId(),
    status: job.status || "active",
    urgent: Boolean(job.urgent),
    posted_at: job.postedAt || job.posted_at || new Date().toISOString(),
    data: job,
  });
  if (error) throw error;
  const cachedIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
  cachedIds.add(job.id);
  writeStoredJson("jobhub-cloud-job-ids", [...cachedIds]);
}
async function deleteCompanyJob(jobId) {
  const job = jobs.find((item) => item.id === jobId);
  if (
    !job ||
    !companyJobs().some((item) => item.id === jobId) ||
    !canDeleteCompanyJobs()
  ) {
    toast("Lowongan ini tidak dapat dihapus dari akun Anda.");
    return;
  }
  if (supabaseClient && isHrdSession()) {
    const { error } = await supabaseClient
      .from("jobhub_jobs")
      .delete()
      .eq("id", jobId)
      .eq("company_id", billingCompanyId());
    if (error) {
      toast(`Lowongan tidak dapat dihapus: ${error.message}`);
      return;
    }
  }
  const cachedIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
  cachedIds.delete(jobId);
  writeStoredJson("jobhub-cloud-job-ids", [...cachedIds]);
  const index = jobs.findIndex((item) => item.id === jobId);
  if (index >= 0) jobs.splice(index, 1);
  writeStoredJson("jobhub-company-jobs", jobs);
  renderHome();
  renderJobs();
  renderDashboard();
  if (currentJob?.id === jobId) go("jobs");
  toast("Lowongan berhasil dihapus.");
}
async function loadCompanyJobs() {
  if (!supabaseClient || !isHrdSession()) return;
  let { data, error } = await supabaseClient
    .from("jobhub_jobs")
    .select("id,status,urgent,posted_at,data")
    .eq("company_id", billingCompanyId())
    .order("posted_at", { ascending: false });
  if (error) throw error;
  const remoteIds = new Set(data.map((row) => row.id));
  const isCurrentCompanyJob = (job) =>
    job.companyId === billingCompanyId() ||
    (!job.companyId && job.company === getCurrentCompanyName());
  const localOnly = jobs.filter(
    (job) => isCurrentCompanyJob(job) && !remoteIds.has(job.id),
  );
  if (localOnly.length && canManageCandidates()) {
    await Promise.all(localOnly.map(syncCompanyJob));
    const refreshed = await supabaseClient
      .from("jobhub_jobs")
      .select("id,status,urgent,posted_at,data")
      .eq("company_id", billingCompanyId())
      .order("posted_at", { ascending: false });
    if (refreshed.error) throw refreshed.error;
    data = refreshed.data;
  }
  const ids = new Set(data.map((row) => row.id));
  const otherJobs = jobs.filter(
    (job) => !isCurrentCompanyJob(job) && !ids.has(job.id),
  );
  jobs.splice(
    0,
    jobs.length,
    ...otherJobs,
    ...data.map((row) => ({
      ...row.data,
      id: row.id,
      companyId: billingCompanyId(),
      status: row.status,
      urgent: row.urgent,
      postedAt: row.posted_at,
    })),
  );
  writeStoredJson("jobhub-company-jobs", jobs);
  const cachedIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
  data.forEach((row) => cachedIds.add(row.id));
  writeStoredJson("jobhub-cloud-job-ids", [...cachedIds]);
}
async function loadPublishedCompanyJobs() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("jobhub_jobs")
    .select("id,company_id,status,urgent,posted_at,data")
    .eq("status", "active")
    .order("posted_at", { ascending: false });
  if (error) throw error;
  const previousIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
  const remoteIds = new Set(data.map((row) => row.id));
  const localOnly = jobs.filter(
    (job) => !previousIds.has(job.id) && !remoteIds.has(job.id),
  );
  const remote = data.map((row) => ({
    ...row.data,
    id: row.id,
    companyId: row.company_id,
    status: row.status,
    urgent: row.urgent,
    postedAt: row.posted_at,
  }));
  jobs.splice(0, jobs.length, ...localOnly, ...remote);
  writeStoredJson(
    "jobhub-cloud-job-ids",
    data.map((row) => row.id),
  );
  writeStoredJson("jobhub-company-jobs", jobs);
  renderHome();
  if (activeRoute === "jobs") renderJobs();
}
function applyPublishedJobChange(payload, companyFeed = false) {
  const changed = payload.eventType === "DELETE" ? payload.old : payload.new;
  if (!changed?.id) return;
  const index = jobs.findIndex((job) => job.id === changed.id);
  const keepOwnNonPublished = Boolean(
    !companyFeed && isHrdSession() && changed.company_id === billingCompanyId(),
  );
  if (
    payload.eventType === "DELETE" ||
    (!companyFeed && changed.status !== "active" && !keepOwnNonPublished)
  ) {
    if (index >= 0) jobs.splice(index, 1);
    const cachedIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
    cachedIds.delete(changed.id);
    writeStoredJson("jobhub-cloud-job-ids", [...cachedIds]);
  } else {
    const updated = {
      ...changed.data,
      id: changed.id,
      companyId: changed.company_id,
      status: changed.status,
      urgent: changed.urgent,
      postedAt: changed.posted_at,
    };
    if (index >= 0) jobs[index] = updated;
    else jobs.unshift(updated);
    const cachedIds = new Set(readStoredArray("jobhub-cloud-job-ids"));
    cachedIds.add(changed.id);
    writeStoredJson("jobhub-cloud-job-ids", [...cachedIds]);
  }
  writeStoredJson("jobhub-company-jobs", jobs);
  renderHome();
  if (activeRoute === "jobs") renderJobs();
}
async function connectPublishedJobsRealtime() {
  if (!supabaseClient) return;
  if (publicJobsChannel) await supabaseClient.removeChannel(publicJobsChannel);
  publicJobsChannel = supabaseClient
    .channel("published-jobs-feed")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "jobhub_jobs" },
      applyPublishedJobChange,
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setAtsSyncStatus("error", "Realtime lowongan terputus");
        toast(
          `Daftar lowongan tidak dapat diperbarui realtime: ${error?.message || status}`,
        );
      }
    });
}
function removeRealtimeChannelSafely(channel) {
  if (!channel || typeof channel.unsubscribe !== "function") return;
  try {
    const removal = supabaseClient?.removeChannel(channel);
    removal?.catch((error) =>
      console.warn("Realtime channel cleanup failed:", error.message || error),
    );
  } catch (error) {
    console.warn("Realtime channel cleanup failed:", error.message || error);
  }
}
function countActiveCompanyJobs() {
  return companyJobs().filter(
    (job) => job.status !== "closed" && job.status !== "draft",
  ).length;
}
function countCompanyPublishedJobs() {
  return companyJobs().filter((job) => job.status !== "draft").length;
}
function countCompanyCandidates() {
  const candidateKeys = new Set();
  const addCandidate = (candidate, id = "") => {
    const email = String(candidate.candidateEmail || candidate.email || "")
      .trim()
      .toLowerCase();
    const key = email || candidate.candidateId || id;
    if (key) candidateKeys.add(String(key).toLowerCase());
  };
  const ownJobIds = new Set(companyJobs().map((job) => job.id));
  getApplications()
    .filter(
      (application) =>
        application.companyId === billingCompanyId() ||
        ownJobIds.has(application.jobId),
    )
    .forEach((application) => addCandidate(application, application.id));
  getTalentPool().forEach((candidate) => addCandidate(candidate, candidate.id));
  return candidateKeys.size;
}
function renderSubscriptionStatus() {
  const panel = $("#subscriptionStatus");
  if (!panel) return;
  const subscription = getCurrentSubscription();
  const plan = plans.find((item) => item.name === subscription?.package);
  if (!subscription || !plan) {
    panel.innerHTML =
      '<strong>Belum ada paket aktif</strong><span>Pilih paket untuk membuka batas lowongan dan fitur HRD.</span><button class="text-link" type="button" data-route="pricing">Lihat paket perusahaan</button>';
    renderCompanyDashboardOnboarding();
    return;
  }
  const expires = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeZone: "Asia/Jakarta",
  }).format(new Date(subscription.expiredDate));
  panel.innerHTML = `<strong>Paket ${escapeHtml(plan.name)} aktif <span class="subscription-active-badge">Aktif</span></strong><span>Berlaku sampai ${escapeHtml(expires)} · ${countActiveCompanyJobs()} / ${plan.activeJobs === Infinity ? "∞" : plan.activeJobs} lowongan aktif${plan.candidateLimit !== Infinity ? ` · Maks. ${plan.candidateLimit} kandidat` : ""}</span><button class="text-link" type="button" data-route="pricing">Kelola paket</button>`;
  renderCompanyDashboardOnboarding();
}
async function loadCompanySubscription() {
  if (!supabaseClient || !isHrdSession()) {
    currentSubscriptionCache = null;
    subscriptionOwnerId = "";
    renderSubscriptionStatus();
    return;
  }
  const { data, error } = await supabaseClient
    .from("subscriptions")
    .select("id,company_id,package,start_date,expired_date,status")
    .eq("company_id", billingCompanyId())
    .eq("status", "active")
    .gt("expired_date", new Date().toISOString())
    .order("expired_date", { ascending: false })
    .limit(1);
  if (error) throw error;
  const local = getSubscriptions().filter(
    (item) => item.companyId !== billingCompanyId(),
  );
  saveSubscriptions([...local, ...data.map(normalizeSubscription)]);
  currentSubscriptionCache = getCurrentSubscription();
  subscriptionOwnerId = billingCompanyId();
  renderSubscriptionStatus();
  if (subscriptionChannel)
    await supabaseClient.removeChannel(subscriptionChannel);
  subscriptionChannel = supabaseClient
    .channel(`company-subscription-${billingCompanyId()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "subscriptions",
        filter: `company_id=eq.${billingCompanyId()}`,
      },
      (payload) => {
        const subs = getSubscriptions(),
          changed = payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.id) return;
        const index = subs.findIndex((item) => item.id === changed.id);
        if (payload.eventType === "DELETE") {
          if (index >= 0) subs.splice(index, 1);
        } else {
          const updated = normalizeSubscription(changed);
          if (index >= 0) subs[index] = updated;
          else subs.push(updated);
        }
        saveSubscriptions(subs);
        currentSubscriptionCache = getCurrentSubscription();
        subscriptionOwnerId = billingCompanyId();
        renderSubscriptionStatus();
        renderDashboard();
      },
    )
    .subscribe();
}
function requirePlanFeature(feature, label) {
  if (hasPlanFeature(feature)) return true;
  toast(
    `${label} tersedia di paket Professional dan Enterprise. Silakan upgrade paket.`,
  );
  go("pricing");
  if (
    state.verification?.status === "pending" &&
    !state.verification?.uploadPending
  )
    panel.insertAdjacentHTML(
      "afterbegin",
      '<aside class="company-verification-waiting" role="status"><span class="company-verification-waiting-icon" aria-hidden="true"><i class="fa-solid fa-clock"></i></span><div><strong>Pengajuan diterima</strong><p>Dokumen Anda sudah tercatat di dashboard admin JobHub. Tim kami akan meninjau dalam maksimal 1 hari kerja.</p></div><span class="company-verification-waiting-badge">Dalam peninjauan</span></aside>',
    );
  return false;
}
async function saveCompanyDocument(ownerId, type, file) {
  const database = await openCvDatabase();
  const id = `${ownerId}:${type}`;
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(
        COMPANY_DOCUMENT_STORE,
        "readwrite",
      );
      transaction
        .objectStore(COMPANY_DOCUMENT_STORE)
        .put({
          id,
          ownerId,
          type,
          name: file.name,
          mimeType: file.type,
          blob: file,
          savedAt: new Date().toISOString(),
        });
      transaction.oncomplete = resolve;
      transaction.onerror = () =>
        reject(
          transaction.error ||
            new Error("Tidak dapat menyimpan dokumen legal."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ||
            new Error("Penyimpanan dokumen legal dibatalkan."),
        );
    });
  } finally {
    database.close();
  }
  return id;
}
async function getCompanyDocument(ownerId, type) {
  const database = await openCvDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database
        .transaction(COMPANY_DOCUMENT_STORE, "readonly")
        .objectStore(COMPANY_DOCUMENT_STORE)
        .get(`${ownerId}:${type}`);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () =>
        reject(
          request.error || new Error("Tidak dapat membaca dokumen legal."),
        );
    });
  } finally {
    database.close();
  }
}
function normalizeCompanyVerification(row) {
  return {
    companyId: row.company_id || row.user_id,
    userId: row.user_id,
    companyName: row.company_name,
    email: row.email,
    status: row.status || "pending",
    documents: row.documents || {},
    submittedAt: row.submitted_at || new Date().toISOString(),
    reviewedAt: row.reviewed_at || "",
    reviewNote: row.review_note || "",
    adminNotifiedAt: row.admin_notified_at || "",
    notificationError: row.notification_error || "",
    notificationPending: Boolean(row.notification_error),
  };
}
function toSupabaseCompanyVerification(item, documents) {
  return {
    company_id: item.companyId,
    user_id: item.userId,
    company_name: item.companyName,
    email: item.email,
    status: "pending",
    documents,
    submitted_at: item.submittedAt,
    reviewed_at: null,
    review_note: "",
    admin_notified_at: null,
    notification_error: null,
  };
}
function isAdminEmail(session = supabaseSession) {
  const email = String(session?.user?.email || "")
    .trim()
    .toLowerCase();
  return ADMIN_EMAIL_ALLOWLIST.has(email);
}
function isAdminSession(session = supabaseSession) {
  return isAdminEmail(session) && session?.user?.app_metadata?.role === "admin";
}
function isCompanyVerified(companyName) {
  return getVerifiedCompanyProfiles().some(
    (item) =>
      item.is_verified &&
      item.company_name?.toLowerCase() ===
        String(companyName || "").toLowerCase(),
  );
}
function getCurrentCompanyName() {
  return (
    supabaseSession?.user?.app_metadata?.company_name ||
    currentCompanyProfile()?.company_name ||
    supabaseSession?.user?.user_metadata?.company_name ||
    getCompanyVerifications().find(
      (item) => item.userId === supabaseSession?.user?.id,
    )?.companyName ||
    "Profil Perusahaan"
  );
}
function companyProfileId(session = supabaseSession) {
  return session?.user?.app_metadata?.company_id || session?.user?.id || "";
}
function currentCompanyProfile(session = supabaseSession) {
  if (
    companyProfileId(session) === companyProfileOwnerId &&
    companyProfileCache
  )
    return companyProfileCache;
  return session?.user?.user_metadata?.company_profile || {};
}
function notifyCompanyProfileLoadError(error) {
  const message =
    error?.message || "Periksa koneksi dan kebijakan akses profil Supabase.";
  const now = Date.now();
  if (
    message === companyProfileLoadErrorMessage &&
    now - companyProfileLoadErrorAt < 5000
  )
    return;
  companyProfileLoadErrorMessage = message;
  companyProfileLoadErrorAt = now;
  toast(`Profil perusahaan tidak dapat dimuat: ${message}`);
}
async function loadCurrentCompanyProfile(session = supabaseSession) {
  if (!supabaseClient || !session?.user?.id || !isCompanyAccount(session))
    return;
  const companyId = companyProfileId(session);
  if (companyProfileOwnerId === companyId && companyProfileCache)
    return companyProfileCache;
  if (companyProfileLoadPromise && companyProfileLoadCompanyId === companyId)
    return companyProfileLoadPromise;
  companyProfileLoadCompanyId = companyId;
  const request = supabaseClient
    .from("jobhub_company_profile_details")
    .select(
      "company_id,company_name,logo_url,cover_image_url,address,industry,description,hr_contact,public_email,show_public_email,website,company_size,company_type,founded_year,linkedin_url,benefits,culture,is_public,province_id,province_name,regency_id,regency_name,district_id,district_name,village_id,village_name,postal_code,rt,rw",
    )
    .eq("company_id", companyId)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) throw error;
      const profile = {
        ...session.user.user_metadata?.company_profile,
        ...Object.fromEntries(
          Object.entries(data || {}).filter(([, value]) => value !== null),
        ),
      };
      if (companyProfileId() === companyId) {
        companyProfileOwnerId = companyId;
        companyProfileCache = profile;
      }
      return profile;
    });
  companyProfileLoadPromise = request;
  try {
    return await request;
  } finally {
    if (companyProfileLoadPromise === request) {
      companyProfileLoadPromise = null;
      companyProfileLoadCompanyId = "";
    }
  }
}
function companyProfileCompletionState(profile = currentCompanyProfile()) {
  profile = profile && typeof profile === "object" ? profile : {};
  const checks = [
    { label: "Logo perusahaan", complete: Boolean(profile.logo_url) },
    { label: "Foto sampul", complete: Boolean(profile.cover_image_url) },
    {
      label: "Alamat",
      complete: Boolean(String(profile.address || "").trim()),
    },
    {
      label: "Bidang usaha",
      complete: Boolean(String(profile.industry || "").trim()),
    },
    {
      label: "Deskripsi perusahaan",
      complete: Boolean(String(profile.description || "").trim()),
    },
    {
      label: "Kontak HR",
      complete: Boolean(String(profile.hr_contact || "").trim()),
    },
  ];
  const completed = checks.filter((item) => item.complete).length;
  return {
    checks,
    percent: Math.round((completed / checks.length) * 100),
    complete: completed === checks.length,
  };
}
function renderCompanyCompletionPanel() {
  const panel = $("#companyCompletionPanel");
  if (!panel) return;
  if (!isCompanyAccount()) {
    panel.hidden = true;
    return;
  }
  const profile = currentCompanyProfile() || {};
  const state = companyProfileCompletionState(profile);
  panel.hidden = false;
  panel.innerHTML = `<div class="section-head"><div><span class="eyebrow">Profil perusahaan</span><h2>Kelengkapan profil ${state.percent}%</h2><p>${state.complete ? "Profil perusahaan sudah lengkap." : "Profil perusahaan belum lengkap."}</p></div><button class="btn btn-outline btn-small" type="button" data-complete-company-profile>Lengkapi profil</button></div><div class="candidate-wizard-progress-track"><span style="width:${state.percent}%"></span></div><ul class="profile-completion-checklist">${state.checks.map((item) => `<li class="${item.complete ? "complete" : ""}"><i class="fa-solid ${item.complete ? "fa-circle-check" : "fa-circle"}" aria-hidden="true"></i>${escapeHtml(item.label)}</li>`).join("")}</ul>${state.complete ? '<p class="form-note">Profil perusahaan sudah siap.</p>' : '<p class="form-note">Profil perusahaan belum lengkap.</p>'}`;
}
function renderCompanyProfilePage() {
  const profile = currentCompanyProfile();
  const companyAccount = isCompanyAccount();
  const companyName =
    profile.company_name ||
    supabaseSession?.user?.user_metadata?.company_name ||
    supabaseSession?.user?.email ||
    "Profil Perusahaan";
  const meta = [
    profile.industry,
    [
      profile.regency_name || profile.regencyName,
      profile.province_name || profile.provinceName,
    ]
      .filter(Boolean)
      .join(", "),
  ]
    .filter(Boolean)
    .join(" · ");
  $("#companyProfileName").textContent = companyName;
  $("#companyProfileMeta").textContent =
    meta ||
    (companyAccount
      ? "Lengkapi profil perusahaan Anda."
      : "Informasi profil perusahaan.");
  $("#companyProfileDescription").textContent =
    profile.description || "Deskripsi perusahaan belum dilengkapi.";
  $("#companyProfileCulture").textContent =
    profile.culture || "Belum dilengkapi";
  $("#companyProfileBenefits").textContent =
    profile.benefits || "Belum dilengkapi";
  $("#companyProfileAddress").textContent =
    profile.address || "Belum dilengkapi";
  $("#companyProfileHrContact").textContent =
    profile.show_public_email && profile.public_email
      ? profile.public_email
      : companyAccount
        ? profile.public_email
          ? "Email disimpan; belum dibagikan ke publik."
          : "Belum dilengkapi"
        : "Perusahaan belum membagikan email.";
  $("#companyProfileIndustry").textContent =
    profile.industry || "Belum dilengkapi";
  $("#companyProfileWebsite").textContent =
    profile.website || "Belum dilengkapi";
  $("#companyProfileLinkedin").textContent =
    profile.linkedin_url || "Belum dilengkapi";
  $("#companyProfileSize").textContent =
    profile.company_size || "Belum dilengkapi";
  $("#companyProfileType").textContent =
    profile.company_type || "Belum dilengkapi";
  $("#companyProfileFounded").textContent =
    profile.founded_year || "Belum dilengkapi";
  $("#companyProfileEdit").hidden = !companyAccount;
  const cover = $("#companyProfileCover");
  cover.replaceChildren();
  if (profile.cover_image_url) {
    const coverImage = new Image();
    coverImage.alt = `Sampul ${companyName}`;
    coverImage.src = profile.cover_image_url;
    coverImage.onerror = () =>
      cover.classList.add("company-public-cover-default");
    cover.append(coverImage);
  }
  cover.classList.toggle(
    "company-public-cover-default",
    !profile.cover_image_url,
  );
  const logo = $("#companyProfileLogo");
  const initials =
    companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "HR";
  logo.replaceChildren();
  if (profile.logo_url) {
    const image = new Image();
    image.alt = `Logo ${companyName}`;
    image.src = profile.logo_url;
    image.onerror = () => {
      logo.textContent = initials;
    };
    logo.append(image);
  } else {
    logo.textContent = initials;
  }
}
async function saveCompanyProfile(data, profile = currentCompanyProfile()) {
  const logo = data.get("logo");
  let logoUrl = profile.logo_url || "";
  const cover = data.get("cover");
  let coverUrl = profile.cover_image_url || "";
  const uploadCompanyImage = async (file, fileName, label) => {
    if (!(file instanceof File) || !file.size) return "";
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    )
      throw new Error(`${label} harus JPG, PNG, atau WEBP dan maksimal 5 MB.`);
    const extension =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `${companyProfileId()}/${fileName}.${extension}`;
    const { error: uploadError } = await supabaseClient.storage
      .from("company-profile-media")
      .upload(objectPath, file, { contentType: file.type, upsert: true });
    if (uploadError) throw uploadError;
    return supabaseClient.storage
      .from("company-profile-media")
      .getPublicUrl(objectPath).data.publicUrl;
  };
  logoUrl = (await uploadCompanyImage(logo, "logo", "Logo")) || logoUrl;
  coverUrl =
    (await uploadCompanyImage(cover, "cover", "Foto sampul")) || coverUrl;
  if (!logoUrl) throw new Error("Unggah logo perusahaan terlebih dahulu.");
  const companyName = String(data.get("companyName") || "").trim();
  const addressData = window.JobHubAddress?.getValue() || {};
  if (!addressData.address) throw new Error("Isi alamat lengkap perusahaan.");
  const companyProfile = {
    company_name: companyName,
    logo_url: logoUrl,
    cover_image_url: coverUrl,
    address: addressData.address,
    industry: String(data.get("industry") || "").trim(),
    description: String(data.get("description") || "").trim(),
    hr_contact: String(data.get("hrContact") || "").trim(),
    public_email: String(data.get("publicEmail") || "").trim() || null,
    show_public_email: data.get("showPublicEmail") === "on",
    website: String(data.get("website") || "").trim() || null,
    company_size: String(data.get("companySize") || "").trim() || null,
    company_type: String(data.get("companyType") || "").trim() || null,
    founded_year: Number(data.get("foundedYear")) || null,
    linkedin_url: String(data.get("linkedinUrl") || "").trim() || null,
    benefits: String(data.get("benefits") || "").trim() || null,
    culture: String(data.get("culture") || "").trim() || null,
    province_id: addressData.provinceId || null,
    province_name: addressData.provinceName || null,
    regency_id: addressData.regencyId || null,
    regency_name: addressData.regencyName || null,
    district_id: addressData.districtId || null,
    district_name: addressData.districtName || null,
    village_id: addressData.villageId || null,
    village_name: addressData.villageName || null,
    postal_code: addressData.postalCode || null,
    rt: addressData.rt || null,
    rw: addressData.rw || null,
  };
  const { data: updated, error } = await supabaseClient
    .from("jobhub_company_profile_details")
    .upsert(
      {
        company_id: companyProfileId(),
        ...companyProfile,
        is_public: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "company_id" },
    )
    .select(
      "company_id,company_name,logo_url,cover_image_url,address,industry,description,hr_contact,public_email,show_public_email,website,company_size,company_type,founded_year,linkedin_url,benefits,culture,is_public,province_id,province_name,regency_id,regency_name,district_id,district_name,village_id,village_name,postal_code,rt,rw",
    )
    .single();
  if (error) throw error;
  companyProfileCache = updated;
  companyProfileOwnerId = companyProfileId();
  localStorage.removeItem(
    `${COMPANY_PROFILE_DRAFT_KEY}${supabaseSession.user.id}`,
  );
  renderCompanyProfilePage();
  renderCompanyCompletionPanel();
  toast("Profil perusahaan berhasil disimpan.");
  go("dashboard");
}
function renderCompanyProfileCompletionPage() {
  const form = $("#companyProfileCompletionForm");
  if (!form) return;
  if (!isCompanyAccount()) {
    form.innerHTML =
      '<p class="form-note">Masuk sebagai perusahaan untuk mengelola profil.</p>';
    return;
  }
  const profile = currentCompanyProfile() || {};
  const field = (label, name, value = "", type = "text", extra = "") =>
    `<label class="form-row">${name === "linkedinUrl" ? '<i class="fa-brands fa-linkedin" aria-hidden="true"></i> ' : ""}${label}<input name="${name}" type="${type}" value="${escapeHtml(value ?? "")}" ${extra}></label>`;
  form.innerHTML = `<p class="form-note">Lengkapi profil perusahaan yang tampil pada lowongan dan direktori perusahaan.</p><div class="company-form-grid">${field("Nama resmi perusahaan", "companyName", profile.company_name, "text", 'required maxlength="160"')}${field("Bidang usaha", "industry", profile.industry, "text", 'required maxlength="120"')}${field("Kontak HR internal (opsional)", "hrContact", profile.hr_contact, "text", 'maxlength="254"')}${field("Email perusahaan", "publicEmail", profile.public_email || "", "email", 'maxlength="254"')}<label class="candidate-consent company-contact-consent"><input name="showPublicEmail" type="checkbox" ${profile.show_public_email ? "checked" : ""}> Izinkan email ini tampil pada profil perusahaan dan popup lowongan</label>${field("Situs web", "website", profile.website || "", "url", 'maxlength="300" placeholder="https://perusahaan.co.id"')}${field("Jenis perusahaan", "companyType", profile.company_type || "")}${field("Jumlah karyawan", "companySize", profile.company_size || "")}${field("Tahun berdiri", "foundedYear", profile.founded_year || "", "number", `min="1800" max="${new Date().getFullYear()}"`)}${field("LinkedIn perusahaan", "linkedinUrl", profile.linkedin_url || "", "url", 'maxlength="300" placeholder="https://www.linkedin.com/company/..."')}<label class="form-row">Deskripsi perusahaan<textarea name="description" data-bullet-list rows="5" maxlength="3000" required>${escapeHtml(profile.description || "")}</textarea></label><label class="form-row">Budaya dan nilai<textarea name="culture" data-bullet-list rows="3" maxlength="2000">${escapeHtml(profile.culture || "")}</textarea></label><label class="form-row">Benefit<textarea name="benefits" data-bullet-list rows="3" maxlength="2000">${escapeHtml(profile.benefits || "")}</textarea></label><div class="form-row company-profile-address-row"><strong>Alamat perusahaan</strong><div id="companyAddressForm"></div></div>${field("Logo perusahaan", "logo", "", "file", 'accept="image/jpeg,image/png,image/webp"')}${field("Foto sampul", "cover", "", "file", 'accept="image/jpeg,image/png,image/webp"')}</div><button class="btn" type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan profil perusahaan</button>`;
  if (window.JobHubAddress)
    window.JobHubAddress.mount($("#companyAddressForm"), profile);
  form.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      if (button) button.disabled = true;
      saveCompanyProfile(new FormData(form), profile)
        .catch((error) =>
          toast(
            `Profil perusahaan gagal disimpan: ${error.message || "periksa koneksi dan kebijakan Supabase."}`,
          ),
        )
        .finally(() => {
          if (button?.isConnected) button.disabled = false;
        });
    },
    { once: true },
  );
}
function openCompanyProfileForm() {
  go("company-complete");
}
function renderCompanyDirectoryCards() {
  const grid = $("#companyDirectoryGrid");
  if (!grid) return;
  const query = String($("#companyDirectorySearch")?.value || "").trim();
  const companies = companyDirectoryCache;
  grid.innerHTML = companies.length
    ? companies
        .map((company) => {
          const logo = accountSafePhoto(company.logo_url);
          const initials =
            String(company.company_name || "")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "CO";
          const location = [company.regency_name, company.province_name]
            .filter(Boolean)
            .join(", ");
          return `<article class="company-directory-card ${company.is_featured_directory ? "is-featured" : ""}"><div class="company-directory-card-brand">${logo ? `<img src="${escapeHtml(logo)}" alt="Logo ${escapeHtml(company.company_name)}" loading="lazy">` : `<span aria-hidden="true">${escapeHtml(initials)}</span>`}<div><h2>${escapeHtml(company.company_name || "Perusahaan")}</h2><p>${escapeHtml(company.industry || "Bidang usaha belum dicantumkan")}</p></div>${company.is_featured_directory ? '<span class="company-directory-featured"><i class="fa-solid fa-star" aria-hidden="true"></i> Pilihan JobHub</span>' : ""}</div><p class="company-directory-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(location || "Lokasi belum dicantumkan")}</p><p class="company-directory-description">${escapeHtml(company.description || "Profil perusahaan belum dilengkapi.")}</p><button class="btn btn-outline btn-small" type="button" data-company-profile-view="${escapeHtml(company.company_id)}"><i class="fa-regular fa-building" aria-hidden="true"></i> Lihat profil perusahaan</button></article>`;
        })
        .join("")
    : '<div class="empty-state"><strong>Tidak ada perusahaan yang cocok</strong>Ubah kata kunci pencarian perusahaan.</div>';
  grid.querySelectorAll(".company-directory-card").forEach((card) => {
    const profileButton = card.querySelector("[data-company-profile-view]");
    if (!profileButton) return;
    card.dataset.companyProfileView = profileButton.dataset.companyProfileView;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute(
      "aria-label",
      `Buka profil ${card.querySelector("h2")?.textContent || "perusahaan"}`,
    );
    profileButton.remove();
    card.addEventListener("keydown", (event) => {
      if (
        (event.key === "Enter" || event.key === " ") &&
        !event.target.closest("a,button,input,textarea,select")
      ) {
        event.preventDefault();
        openCompanyDirectoryProfile(card.dataset.companyProfileView).catch(
          (error) =>
            toast(
              `Profil perusahaan gagal dibuka: ${error.message || "periksa direktori perusahaan."}`,
            ),
        );
      }
    });
  });
  if (!companies.length && !query) {
    const emptyState = grid.querySelector(".empty-state");
    if (emptyState)
      emptyState.innerHTML =
        "<strong>Belum ada perusahaan pilihan admin</strong>Perusahaan publik lainnya dapat ditemukan melalui pencarian.";
  }
}
async function renderCompanyDirectory() {
  const grid = $("#companyDirectoryGrid");
  const status = $("#companyDirectoryStatus");
  if (!grid) return;
  if (!supabaseClient) {
    grid.innerHTML =
      '<div class="empty-state"><strong>Direktori memerlukan koneksi</strong>Hubungkan Supabase untuk melihat profil perusahaan.</div>';
    return;
  }
  grid.innerHTML = loadingIndicator("Memuat perusahaan...");
  try {
    const { data, error } = await supabaseClient
      .from("jobhub_public_company_directory")
      .select("*")
      .order("is_featured_directory", { ascending: false })
      .order("company_name", { ascending: true })
      .limit(500);
    if (error) throw error;
    companyDirectoryFeaturedCache = data || [];
    companyDirectoryCache = companyDirectoryFeaturedCache;
    if (status)
      status.textContent = `${companyDirectoryCache.length} perusahaan pilihan admin`;
    renderCompanyDirectoryCards();
    const query = $("#companyDirectorySearch")?.value.trim();
    if (query) await searchCompanyDirectory(query);
  } catch (error) {
    grid.innerHTML = `<div class="empty-state"><strong>Direktori perusahaan belum dapat dimuat</strong>${escapeHtml(error.message || "Jalankan migration supabase/company-directory-public.sql dan periksa koneksi.")}</div>`;
  }
}
async function searchCompanyDirectory(query) {
  const normalized = String(query || "").trim();
  const status = $("#companyDirectoryStatus");
  if (!normalized) {
    companyDirectoryCache = companyDirectoryFeaturedCache;
    if (status)
      status.textContent = `${companyDirectoryCache.length} perusahaan pilihan admin`;
    renderCompanyDirectoryCards();
    return;
  }
  if (!supabaseClient) {
    const needle = normalized.toLocaleLowerCase("id-ID");
    companyDirectoryCache = companyDirectoryFeaturedCache.filter((company) =>
      `${company.company_name || ""} ${company.industry || ""} ${company.regency_name || ""} ${company.province_name || ""}`
        .toLocaleLowerCase("id-ID")
        .includes(needle),
    );
    renderCompanyDirectoryCards();
    return;
  }
  const requestId = ++companyDirectorySearchRequest;
  if (status) status.textContent = "Mencari perusahaan...";
  const columns = ["company_name", "industry", "regency_name", "province_name"];
  const responses = await Promise.all(
    columns.map((column) =>
      supabaseClient
        .from("jobhub_company_directory_search")
        .select("*")
        .ilike(column, `%${normalized}%`)
        .limit(100),
    ),
  );
  const failed = responses.find((response) => response.error);
  if (failed?.error) throw failed.error;
  if (requestId !== companyDirectorySearchRequest) return;
  const companies = new Map(
    responses
      .flatMap((response) => response.data || [])
      .map((company) => [company.company_id, company]),
  );
  companyDirectoryCache = [...companies.values()].sort(
    (left, right) =>
      Number(Boolean(right.is_directory_visible)) -
        Number(Boolean(left.is_directory_visible)) ||
      String(left.company_name || "").localeCompare(
        String(right.company_name || ""),
        "id",
      ),
  );
  if (status)
    status.textContent = `${companyDirectoryCache.length} hasil pencarian perusahaan`;
  renderCompanyDirectoryCards();
}
async function getPublicCompanyDirectoryProfile(companyId) {
  let company = companyDirectoryCache.find(
    (item) => String(item.company_id) === String(companyId),
  );
  if (company || !supabaseClient) return company || null;
  const { data, error } = await supabaseClient
    .from("jobhub_company_directory_search")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();
  if (error) throw error;
  if (data)
    companyDirectoryCache = [
      data,
      ...companyDirectoryCache.filter(
        (item) => String(item.company_id) !== String(companyId),
      ),
    ];
  return data || null;
}
async function openCompanyFromJob(companyId) {
  const company = await getPublicCompanyDirectoryProfile(companyId);
  if (!company) return toast("Profil perusahaan belum dipublikasikan.");
  const input = $("#companyDirectorySearch");
  if (input) input.value = company.company_name || "";
  go("companies");
  await searchCompanyDirectory(company.company_name || "");
  await openCompanyDirectoryProfile(companyId);
}
async function openCompanyDirectoryProfile(companyId) {
  const company = await getPublicCompanyDirectoryProfile(companyId);
  if (!company)
    return toast("Profil perusahaan belum dipublikasikan di direktori JobHub.");
  const cover = accountSafePhoto(company.cover_image_url);
  const logo = accountSafePhoto(company.logo_url);
  const location = [company.regency_name, company.province_name]
    .filter(Boolean)
    .join(", ");
  const website = safeNewsUrl(company.website);
  const linkedin = safeNewsUrl(company.linkedin_url);
  openModal(
    company.company_name || "Profil perusahaan",
    `<article class="company-directory-profile">${cover ? `<img class="company-directory-profile-cover" src="${escapeHtml(cover)}" alt="Sampul ${escapeHtml(company.company_name)}">` : ""}<header>${
      logo
        ? `<img src="${escapeHtml(logo)}" alt="Logo ${escapeHtml(company.company_name)}">`
        : `<span class="company-directory-profile-initials">${escapeHtml(
            String(company.company_name || "")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() || "CO",
          )}</span>`
    }<div><h2>${escapeHtml(company.company_name || "Perusahaan")} ${company.is_verified ? '<span class="verified-company-badge is-verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Verified Company</span>' : ""}</h2><p>${escapeHtml([company.industry, location].filter(Boolean).join(" · ") || "Profil perusahaan")}</p></div></header><section><h3><i class="fa-regular fa-file-lines" aria-hidden="true"></i> Tentang perusahaan</h3><p>${escapeHtml(company.description || "Deskripsi perusahaan belum dilengkapi.")}</p></section><div class="company-directory-profile-facts">${location ? `<p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(location)}</p>` : ""}${company.public_email ? `<p><i class="fa-regular fa-envelope" aria-hidden="true"></i> <a href="mailto:${encodeURIComponent(company.public_email)}">${escapeHtml(company.public_email)}</a></p>` : ""}${company.company_size ? `<p><i class="fa-solid fa-users" aria-hidden="true"></i> ${escapeHtml(company.company_size)} karyawan</p>` : ""}${company.company_type ? `<p><i class="fa-solid fa-building" aria-hidden="true"></i> ${escapeHtml(company.company_type)}</p>` : ""}${company.founded_year ? `<p><i class="fa-regular fa-calendar" aria-hidden="true"></i> Berdiri ${escapeHtml(company.founded_year)}</p>` : ""}${website ? `<p><i class="fa-solid fa-globe" aria-hidden="true"></i> <a href="${escapeHtml(website)}" target="_blank" rel="noopener">Situs web</a></p>` : ""}${linkedin ? `<p><i class="fa-brands fa-linkedin" aria-hidden="true"></i> <a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener">LinkedIn</a></p>` : ""}</div>${company.culture ? `<section><h3><i class="fa-solid fa-people-group" aria-hidden="true"></i> Budaya dan nilai</h3><p>${escapeHtml(company.culture)}</p></section>` : ""}${company.benefits ? `<section><h3><i class="fa-solid fa-gift" aria-hidden="true"></i> Benefit</h3><p>${escapeHtml(company.benefits)}</p></section>` : ""}<button class="btn btn-outline" type="button" data-company-jobs="${escapeHtml(company.company_name || "")}"><i class="fa-solid fa-briefcase" aria-hidden="true"></i> Lihat lowongan perusahaan</button></article>`,
  );
  $("#modalBackdrop").classList.add("company-directory-drawer-backdrop");
  $("#modalBackdrop .modal")?.classList.add("company-directory-profile-modal");
}
async function setCompanyDirectoryFeatured(companyId, featured) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const { error } = await supabaseClient
    .from("jobhub_company_profiles")
    .update({ is_featured_directory: featured })
    .eq("company_id", companyId);
  if (error) throw error;
  await loadAdminCompaniesDirectory();
  toast(
    featured
      ? "Perusahaan ditambahkan ke pilihan unggulan."
      : "Perusahaan dihapus dari pilihan unggulan.",
  );
}
async function setCompanyDirectoryVisibility(companyId, visible) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const { error } = await supabaseClient
    .from("jobhub_company_profiles")
    .update({ is_directory_visible: visible })
    .eq("company_id", companyId);
  if (error) throw error;
  await loadAdminCompaniesDirectory();
  toast(
    visible
      ? "Profil perusahaan ditampilkan di direktori."
      : "Profil perusahaan disembunyikan dari direktori.",
  );
}
function renderCompanyVerificationBadge(companyName) {
  return isCompanyVerified(companyName)
    ? '<span class="verified-company-badge is-verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Verified Company</span>'
    : "";
}
async function uploadCompanyVerification(item) {
  if (
    !supabaseClient ||
    !supabaseSession ||
    supabaseSession.user.id !== item.userId
  )
    return false;
  if (companyVerificationUploads.has(item.userId)) return false;
  companyVerificationUploads.add(item.userId);
  try {
    const documentPaths = {};
    for (const [type, label] of COMPANY_DOCUMENT_TYPES) {
      const saved = await getCompanyDocument(item.userId, type);
      if (!saved)
        throw new Error(
          `Dokumen ${label} tidak tersedia. Unggah ulang dokumen tersebut.`,
        );
      const safeName =
        saved.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) ||
        `${type}.pdf`;
      const path = `${item.userId}/${type}/${Date.now()}-${safeName}`;
      const extension = saved.name.toLowerCase().split(".").pop();
      const contentType =
        extension === "pdf"
          ? "application/pdf"
          : ["jpg", "jpeg"].includes(extension)
            ? "image/jpeg"
            : extension === "png"
              ? "image/png"
              : saved.mimeType;
      const { error } = await supabaseClient.storage
        .from("company-verification-documents")
        .upload(path, saved.blob, { contentType, upsert: false });
      if (error) throw error;
      documentPaths[type] = { path, name: saved.name };
    }
    const verification = toSupabaseCompanyVerification(item, documentPaths);
    const { data: savedVerification, error: verificationError } =
      await supabaseClient
        .from("jobhub_company_verifications")
        .upsert(verification, { onConflict: "user_id" })
        .select("user_id,status,submitted_at,documents")
        .single();
    if (verificationError) throw verificationError;
    if (
      savedVerification?.user_id !== item.userId ||
      savedVerification.status !== "pending"
    ) {
      throw new Error(
        "Pengajuan belum terkonfirmasi di sistem. Silakan coba kirim kembali.",
      );
    }
    item.documents = documentPaths;
    item.status = "pending";
    item.uploadPending = false;
    item.persisted = true;
    currentCompanyVerification = { ...item };
    companyVerificationOwnerId = item.userId;
    saveCompanyVerifications(
      getCompanyVerifications().map((existing) =>
        existing.userId === item.userId ? item : existing,
      ),
    );
    try {
      await notifyCompanyVerificationAdmin(item);
    } catch (error) {
      item.notificationPending = true;
      item.notificationError =
        error.message || "Email pemberitahuan admin gagal dikirim.";
      saveCompanyVerifications(
        getCompanyVerifications().map((existing) =>
          existing.userId === item.userId ? item : existing,
        ),
      );
    }
    return true;
  } finally {
    companyVerificationUploads.delete(item.userId);
  }
}
async function syncPendingCompanyVerifications(session = supabaseSession) {
  if (!supabaseClient || !session?.user?.id) return;
  const pending = getCompanyVerifications().filter(
    (item) =>
      (item.uploadPending ||
        (!item.adminNotifiedAt && item.status === "pending")) &&
      (item.userId === session.user.id ||
        item.email.toLowerCase() === session.user.email?.toLowerCase()),
  );
  for (const item of pending) {
    item.userId = session.user.id;
    item.companyId = session.user.id;
    if (item.uploadPending) await uploadCompanyVerification(item);
    else {
      try {
        await notifyCompanyVerificationAdmin(item);
      } catch (error) {
        item.notificationPending = true;
        item.notificationError =
          error.message || "Email pemberitahuan admin gagal dikirim.";
        saveCompanyVerifications(
          getCompanyVerifications().map((existing) =>
            existing.userId === item.userId ? item : existing,
          ),
        );
      }
    }
  }
}
async function notifyCompanyVerificationAdmin(item) {
  if (
    !supabaseClient ||
    !supabaseSession ||
    supabaseSession.user.id !== item.userId
  )
    throw new Error("Masuk kembali ke akun perusahaan yang mengirim dokumen.");
  const { data, error } = await supabaseClient.functions.invoke(
    "notify-company-verification",
    { body: {} },
  );
  if (error) throw error;
  if (data?.status === "email_confirmation_required")
    throw new Error(
      "Konfirmasi email perusahaan terlebih dahulu, lalu masuk kembali untuk mengirim pemberitahuan verifikasi.",
    );
  if (!["sent", "already_sent"].includes(data?.status))
    throw new Error(
      data?.error || "Fungsi email tidak mengonfirmasi pengiriman.",
    );
  item.adminNotifiedAt =
    data.admin_notified_at || item.adminNotifiedAt || new Date().toISOString();
  item.notificationPending = false;
  item.notificationError = "";
  saveCompanyVerifications(
    getCompanyVerifications().map((existing) =>
      existing.userId === item.userId ? item : existing,
    ),
  );
  return true;
}
async function loadCompanyVerifications() {
  if (!supabaseClient || !isAdminSession()) return;
  const { data, error } = await supabaseClient
    .from("jobhub_company_verifications")
    .select("*")
    .order("submitted_at", { ascending: true });
  if (error) throw error;
  adminVerificationCache = data.map(normalizeCompanyVerification);
  const local = getCompanyVerifications().filter(
    (item) =>
      !adminVerificationCache.some((remote) => remote.userId === item.userId),
  );
  saveCompanyVerifications([...adminVerificationCache, ...local]);
  renderAdminCompanies();
}
async function loadCompanyVerificationForUser(session = supabaseSession) {
  if (!supabaseClient || !session?.user?.id) return;
  const { data, error } = await supabaseClient
    .from("jobhub_company_verifications")
    .select("*")
    .eq("user_id", session.user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    currentCompanyVerification = null;
    companyVerificationOwnerId = session.user.id;
    renderCompanyDashboardOnboarding();
    return;
  }
  const item = normalizeCompanyVerification(data);
  currentCompanyVerification = item;
  companyVerificationOwnerId = session.user.id;
  const local = getCompanyVerifications().filter(
    (record) => record.userId !== item.userId,
  );
  local.push(item);
  saveCompanyVerifications(local);
  renderCompanyVerificationState(item);
}
async function connectCompanyOnboardingRealtime(session = supabaseSession) {
  if (!supabaseClient || !session?.user?.id || !isCompanyAccount(session))
    return;
  if (
    companyOnboardingChannelKey === companyProfileId(session) &&
    companyOnboardingChannel
  )
    return;
  if (companyOnboardingChannel)
    await supabaseClient.removeChannel(companyOnboardingChannel);
  const userId = session.user.id;
  const companyId = companyProfileId(session);
  companyOnboardingChannelKey = companyId;
  companyOnboardingChannel = supabaseClient
    .channel(`company-onboarding-${companyId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_company_profile_details",
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        if (payload.eventType === "DELETE")
          companyProfileCache = {
            ...session.user.user_metadata?.company_profile,
          };
        else
          companyProfileCache = {
            ...session.user.user_metadata?.company_profile,
            ...payload.new,
          };
        companyProfileOwnerId = companyId;
        renderCompanyProfilePage();
        renderCompanyDashboard();
        if (activeRoute === "dashboard" && !isHrdSession())
          renderCompanyDashboardOnboarding();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_company_verifications",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        if (payload.eventType === "DELETE") {
          currentCompanyVerification = null;
          saveCompanyVerifications(
            getCompanyVerifications().filter((item) => item.userId !== userId),
          );
        } else {
          currentCompanyVerification = normalizeCompanyVerification(
            payload.new,
          );
          companyVerificationOwnerId = userId;
          saveCompanyVerifications([
            currentCompanyVerification,
            ...getCompanyVerifications().filter(
              (item) => item.userId !== userId,
            ),
          ]);
          if (
            currentCompanyVerification.status === "verified" &&
            !isHrdSession()
          ) {
            const { data, error } = await supabaseClient.auth.refreshSession();
            if (error)
              toast(
                `Role HRD belum dapat diperbarui: ${error.message || "keluar lalu masuk kembali."}`,
              );
            else if (data.session) supabaseSession = data.session;
          }
        }
        renderCompanyVerificationState(currentCompanyVerification);
        renderCompanyDashboard();
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        toast(
          `Sinkronisasi profil perusahaan terputus: ${error?.message || status}`,
        );
    });
}
async function loadVerifiedCompanyProfiles() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("jobhub_company_profiles")
    .select("company_id,company_name,is_verified")
    .eq("is_verified", true);
  if (error) throw error;
  const remote = data || [];
  const local = getVerifiedCompanyProfiles().filter(
    (profile) => !remote.some((item) => item.company_id === profile.company_id),
  );
  saveVerifiedCompanyProfiles([...remote, ...local]);
  renderHome();
  if (activeRoute === "jobs") renderJobs();
  renderDashboard();
}
function fromSupabaseTalent(row) {
  return {
    id: row.id,
    candidateId: row.candidate_id || "",
    candidateName: row.candidate_name,
    candidateEmail: row.candidate_email,
    skills: row.skills || [],
    experienceYears: Number(row.experience_years) || 0,
    education: row.education || "",
    category: row.category || "Umum",
    notes: row.notes || "",
    addedAt: row.created_at,
  };
}
function toSupabaseTalent(candidate) {
  return {
    id: candidate.id,
    company_id: billingCompanyId(),
    candidate_id: candidate.candidateId || null,
    candidate_name: candidate.candidateName,
    candidate_email: candidate.candidateEmail || null,
    skills: candidate.skills || [],
    experience_years: Number(candidate.experienceYears) || 0,
    education: candidate.education || "",
    category: candidate.category || "Umum",
    notes: candidate.notes || "",
  };
}
async function syncTalentPoolToSupabase(candidate) {
  if (!supabaseClient || !isHrdSession()) return;
  const { error } = await supabaseClient
    .from("jobhub_talent_pool")
    .upsert(toSupabaseTalent(candidate));
  if (error) throw error;
}
async function syncTalentCategoriesToSupabase() {
  if (!supabaseClient || !isHrdSession()) return;
  const rows = getTalentCategories().map((name) => ({
    company_id: billingCompanyId(),
    name,
  }));
  const { error } = await supabaseClient
    .from("jobhub_talent_categories")
    .upsert(rows, { onConflict: "company_id,name" });
  if (error) throw error;
}
async function loadTalentPoolFromSupabase() {
  const [
    { data: candidates, error: candidateError },
    { data: categories, error: categoryError },
  ] = await Promise.all([
    supabaseClient
      .from("jobhub_talent_pool")
      .select("*")
      .eq("company_id", billingCompanyId()),
    supabaseClient
      .from("jobhub_talent_categories")
      .select("name")
      .eq("company_id", billingCompanyId()),
  ]);
  if (candidateError) throw candidateError;
  if (categoryError) throw categoryError;
  saveTalentPool(candidates.map(fromSupabaseTalent));
  saveTalentCategories([
    ...DEFAULT_TALENT_CATEGORIES,
    ...categories.map((item) => item.name),
  ]);
  renderTalentPool();
  if (talentChannel) await supabaseClient.removeChannel(talentChannel);
  talentChannel = supabaseClient
    .channel(`talent-pool-${billingCompanyId()}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_talent_pool",
        filter: `company_id=eq.${billingCompanyId()}`,
      },
      (payload) => {
        const candidates = getTalentPool();
        const changed =
          payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.id) return;
        const index = candidates.findIndex((item) => item.id === changed.id);
        if (payload.eventType === "DELETE") {
          if (index >= 0) candidates.splice(index, 1);
        } else {
          const updated = fromSupabaseTalent(changed);
          if (index >= 0) candidates[index] = updated;
          else candidates.unshift(updated);
        }
        saveTalentPool(candidates);
        renderTalentPool();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_talent_categories",
        filter: `company_id=eq.${billingCompanyId()}`,
      },
      (payload) => {
        const changed =
          payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.name) return;
        const categories = getTalentCategories().filter(
          (item) => item !== changed.name,
        );
        if (payload.eventType !== "DELETE") categories.push(changed.name);
        saveTalentCategories(categories);
        renderTalentPool();
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        toast(
          `Talent Pool tidak dapat diperbarui realtime: ${error?.message || status}`,
        );
    });
}
function clearTalentPoolForNonHrd() {
  saveTalentPool([]);
  saveTalentCategories(DEFAULT_TALENT_CATEGORIES);
  renderTalentPool();
}
function fromSupabaseInterview(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    applicationId: row.application_id,
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    candidateEmail: row.candidate_email,
    jobTitle: row.job_title,
    interviewType: row.interview_type,
    startsAt: row.starts_at,
    meetingUrl: row.meeting_url || "",
    notes: row.notes || "",
    emailStatus: row.email_status || "pending",
    createdAt: row.created_at,
  };
}
function toSupabaseInterview(interview) {
  return {
    id: interview.id,
    company_id: billingCompanyId(),
    application_id: interview.applicationId,
    candidate_id: interview.candidateId || null,
    candidate_name: interview.candidateName,
    candidate_email: interview.candidateEmail,
    job_title: interview.jobTitle,
    interview_type: interview.interviewType,
    starts_at: interview.startsAt,
    meeting_url: interview.meetingUrl || null,
    notes: interview.notes || "",
    email_status: interview.emailStatus || "pending",
  };
}
function openCvDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("Penyimpanan CV tidak tersedia di browser ini."));
      return;
    }
    const request = indexedDB.open(CV_DATABASE_NAME, 2);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(CV_STORE_NAME))
        request.result.createObjectStore(CV_STORE_NAME, { keyPath: "id" });
      if (!request.result.objectStoreNames.contains(COMPANY_DOCUMENT_STORE))
        request.result.createObjectStore(COMPANY_DOCUMENT_STORE, {
          keyPath: "id",
        });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error || new Error("Tidak dapat membuka penyimpanan CV."));
  });
}
async function saveCvFile(file) {
  const id = `CV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const database = await openCvDatabase();
  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction(CV_STORE_NAME, "readwrite");
      transaction
        .objectStore(CV_STORE_NAME)
        .put({
          id,
          name: file.name,
          type: file.type,
          blob: file,
          savedAt: new Date().toISOString(),
        });
      transaction.oncomplete = resolve;
      transaction.onerror = () =>
        reject(transaction.error || new Error("Tidak dapat menyimpan CV."));
      transaction.onabort = () =>
        reject(transaction.error || new Error("Penyimpanan CV dibatalkan."));
    });
  } finally {
    database.close();
  }
  return id;
}
async function getCvFile(id) {
  if (!id) return null;
  const database = await openCvDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database
        .transaction(CV_STORE_NAME, "readonly")
        .objectStore(CV_STORE_NAME)
        .get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () =>
        reject(request.error || new Error("Tidak dapat membaca file CV."));
    });
  } finally {
    database.close();
  }
}
function normalizeApplicationStatus(status) {
  if (ATS_STATUSES.includes(status)) return status;
  if (status === "Diterima") return "Accepted";
  if (status === "Ditolak") return "Rejected";
  return "New Applicant";
}
function getCandidateProfileStrengthState(profile = {}) {
  const data = profile.publicData || profile.public_data || {};
  const education = Array.isArray(data.education) ? data.education : [];
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : Array.isArray(data.skills)
      ? data.skills
      : [];
  const checks = [
    { label: "Nama lengkap", complete: Boolean(profile.full_name) },
    {
      label: "Foto profil",
      complete: Boolean(profile.profile_image_url || data.profileImageUrl),
    },
    { label: "Posisi yang dicari", complete: Boolean(profile.main_position) },
    {
      label: "Ringkasan profesional",
      complete: String(profile.about || "").trim().length >= 80,
    },
    {
      label: "Minimal 3 keahlian",
      complete: skills.filter(Boolean).length >= 3,
    },
    {
      label: "Pendidikan",
      complete: Boolean(
        profile.education_level ||
          education.some((item) => item?.school && item?.level),
      ),
    },
    {
      label: "Pengalaman kerja",
      complete:
        experience.some((item) => item?.company && item?.position) ||
        profile.work_status === "Fresh Graduate" ||
        data.workStatus === "Fresh Graduate",
    },
  ];
  const completed = checks.filter((check) => check.complete).length;
  return {
    checks,
    completed,
    total: checks.length,
    percent: Math.round((completed / checks.length) * 100),
    complete: completed === checks.length,
  };
}
function toSupabaseApplication(application) {
  return {
    id: application.id,
    company_id: application.companyId || billingCompanyId(),
    job_id: application.jobId,
    job_title:
      application.jobTitle ||
      jobs.find((job) => job.id === application.jobId)?.title ||
      "Lowongan",
    candidate_id: application.candidateId || null,
    candidate_name: application.candidateName || "Kandidat",
    candidate_email: application.candidateEmail || null,
    cv_id: application.cvId || null,
    cv_url: application.cvUrl || null,
    message: application.message || "",
    answers: application.answers || {},
    skills: application.skills || [],
    experience_years: Number(application.experienceYears) || 0,
    education: application.education || "",
    expected_salary: Number(application.expectedSalary) || 0,
    status: normalizeApplicationStatus(application.status),
    viewed_at: application.viewedAt || null,
    match: application.match || null,
    created_at: application.createdAt || new Date().toISOString(),
  };
}
function fromSupabaseApplication(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    jobId: row.job_id,
    jobTitle: row.job_title,
    cvFileId: getCvAttachments()[row.id] || "",
    candidateId: row.candidate_id,
    candidateName: row.candidate_name,
    candidateEmail: row.candidate_email || "",
    cvId: row.cv_id || (row.cv_url ? "CV kandidat" : ""),
    cvUrl: "",
    message: row.message || "",
    answers: row.answers || {},
    skills: row.skills || [],
    experienceYears: Number(row.experience_years) || 0,
    education: row.education || "",
    expectedSalary: Number(row.expected_salary) || 0,
    status: normalizeApplicationStatus(row.status),
    viewedAt: row.viewed_at || "",
    match: row.match || null,
    createdAt: row.created_at,
  };
}
function setAtsSyncStatus(state, message) {
  const status = $("#atsSyncStatus");
  status.dataset.state = state;
  status.textContent = message;
  $("#atsSignOut").hidden = !supabaseSession;
  renderAccountMenu();
}
function accountSafePhoto(value) {
  const source = String(value || "").trim();
  if (/^data:image\/(?:jpeg|png|webp);base64,/i.test(source)) return source;
  try {
    const url = new URL(source);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
async function refreshAccountCandidateIdentity(user) {
  const userId = user.id;
  const metadata = user.user_metadata || {};
  let name = String(
    metadata.full_name || metadata.name || "Profil kandidat",
  ).trim();
  let photo = accountSafePhoto(metadata.avatar_url || metadata.picture || "");
  try {
    const profiles = JSON.parse(
      localStorage.getItem("jobhub-candidate-public-profiles") || "[]",
    );
    const profile = Array.isArray(profiles)
      ? profiles.find((item) => item.userId === userId)
      : null;
    if (profile) {
      name = profile.full_name || name;
      photo = accountSafePhoto(
        profile.profile_image_url ||
          profile.publicData?.profileImageUrl ||
          profile.public_data?.profileImageUrl ||
          photo,
      );
    }
  } catch {}
  const localPhoto = accountSafePhoto(
    localStorage.getItem("jobhub-profile-photo") || "",
  );
  if (!photo && localPhoto) photo = localPhoto;
  if (supabaseClient && isCandidateSession({ user })) {
    const { data, error } = await supabaseClient
      .from("candidate_posts")
      .select("full_name,profile_image_url,public_data")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      name = data.full_name || name;
      photo = accountSafePhoto(
        data.profile_image_url || data.public_data?.profileImageUrl || photo,
      );
    }
  }
  if (supabaseSession?.user?.id !== userId) return;
  $("#accountMenuEmail").textContent = name;
  $("#accountMenuUserEmail").textContent = name;
  $("#accountMenuLabel").textContent = isCompanyAccount({ user })
    ? "Profil kandidat & perusahaan"
    : "Profil kandidat";
  $("#accountMenuAvatar").innerHTML = photo
    ? `<img src="${escapeHtml(photo)}" alt="">`
    : '<i class="fa-solid fa-user" aria-hidden="true"></i>';
}
function isRantauRoute(route = activeRoute) {
  return route === "rantau" || route.startsWith("rantau-");
}
function updateCandidateChatLauncherVisibility(route = activeRoute) {
  const launcher = $("#candidateChatLauncher");
  if (launcher)
    launcher.hidden =
      !isCandidateSession() || isHrdSession() || isRantauRoute(route);
  if (isRantauRoute(route) && candidateChatPopupOpen) closeCandidateChatPopup();
}
function updateRantauChatLauncherVisibility(route = activeRoute) {
  const launcher = $("#rantauChatLauncher");
  const renterAccount = isCandidateSession() || isHrdSession();
  const inboxAlreadyOpen =
    route === "rantau-inbox" || route === "rantau-dashboard";
  if (launcher)
    launcher.hidden =
      !isRantauRoute(route) || !renterAccount || inboxAlreadyOpen;
}
function renderAccountMenu() {
  const menu = $("#accountMenu");
  if (!menu) return;
  renderHomeAudience();
  const user = supabaseSession?.user;
  const loggedIn = Boolean(user?.email);
  menu.hidden = !loggedIn;
  $("#headerLogin").hidden = loggedIn;
  $("#headerSignup").hidden = loggedIn;
  if (!loggedIn) {
    if (candidateChatPopupOpen) closeCandidateChatPopup();
    $("#candidateChatLauncher").hidden = true;
    $("#rantauChatLauncher").hidden = true;
    updateCandidateUnreadMessageCount(0);
    updateRantauUnreadCount(0);
    closeAccountMenu();
    return;
  }
  const email = user.email.trim();
  const isAdmin = isAdminSession();
  const isAdminAllowed = isAdminEmail();
  const accountTypes = accountTypesForSession(supabaseSession);
  const isCandidate = !isAdminAllowed && accountTypes.has("candidate");
  const isCompany = !isAdminAllowed && accountTypes.has("company");
  const isRantau = !isAdminAllowed && accountTypes.has("marketplace");
  const type = isAdmin
    ? "Administrator"
    : isAdminAllowed
      ? "Admin · aktivasi diperlukan"
      : isCandidate && isCompany
        ? "Pencari kerja & Perusahaan"
        : isRantau
          ? "Pengguna JobHub Rantau"
          : isCompany
            ? "Perusahaan / HRD"
            : "Pencari kerja";
  const name = String(
    user.user_metadata?.full_name || user.user_metadata?.name || "",
  ).trim();
  $("#accountMenuEmail").textContent = isCandidate
    ? name || "Profil kandidat"
    : email;
  $("#accountMenuUserEmail").textContent = isCandidate
    ? name || "Profil kandidat"
    : email;
  $("#accountMenuLabel").textContent =
    isCandidate && isCompany
      ? "Profil kandidat & perusahaan"
      : isCandidate
        ? "Profil kandidat"
        : "Masuk sebagai";
  $("#accountMenuRole").textContent = type;
  $("#accountCandidateProfile").hidden = !isCandidate;
  $("#accountEditCandidateProfile").hidden = !isCandidate;
  $("#accountCandidateApplications").hidden = !isCandidate;
  $("#accountCandidateFavorites").hidden = !isCandidate;
  $("#accountAddCandidate").hidden = true;
  $("#accountAddCompany").hidden = true;
  $("#accountAddRantau").hidden = true;
  $("#accountCompanyDashboard").hidden = !isCompany;
  $("#accountRantauDashboard").hidden = !isRantau;
  $("#accountAdminPanel").hidden = !isAdminAllowed;
  updateCandidateChatLauncherVisibility(activeRoute);
  updateRantauChatLauncherVisibility(activeRoute);
  if (!isCandidate || isHrdSession()) {
    if (candidateChatPopupOpen) closeCandidateChatPopup();
    updateCandidateUnreadMessageCount(0);
  }
  if (isCandidate && !isHrdSession()) {
    connectJobMessagesRealtime();
    loadCandidateUnreadMessageCount().catch((error) =>
      console.warn("Candidate unread messages could not load:", error.message),
    );
  }
  if (isCandidate || isHrdSession()) {
    connectRantauMessagesRealtime();
    loadRantauUnreadCount().catch((error) =>
      console.warn("Rantau unread messages could not load:", error.message),
    );
  }
  if (isAdminAllowed) {
    $("#accountMenuEmail").textContent = email;
    $("#accountMenuUserEmail").textContent = email;
    $("#accountMenuLabel").textContent = isAdmin
      ? "Administrator"
      : "Aktivasi Admin diperlukan";
  }
  if (isCompany && !isCandidate) {
    const companyName = getCurrentCompanyName();
    $("#accountMenuEmail").textContent = companyName;
    $("#accountMenuUserEmail").textContent = companyName;
    $("#accountMenuLabel").textContent = "Profil perusahaan";
  }
  const avatar = $("#accountMenuAvatar");
  if (isCandidate) {
    avatar.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i>';
    refreshAccountCandidateIdentity(user).catch((error) =>
      console.warn(
        "Candidate profile image could not be loaded:",
        error.message,
      ),
    );
  } else
    avatar.innerHTML = '<i class="fa-solid fa-user" aria-hidden="true"></i>';
}
function closeAccountMenu() {
  const dropdown = $("#accountMenuDropdown");
  const trigger = $("#accountMenuTrigger");
  if (dropdown) dropdown.hidden = true;
  if (trigger) trigger.setAttribute("aria-expanded", "false");
}
function isHrdSession(session = supabaseSession) {
  return (
    session?.user?.app_metadata?.role === "hrd" &&
    typeof session.user.app_metadata.company_id === "string" &&
    Boolean(session.user.app_metadata.company_id)
  );
}
function billingCompanyId() {
  return (
    supabaseSession?.user?.app_metadata?.company_id ||
    supabaseSession?.user?.id ||
    ""
  );
}
function companyJobs() {
  const companyId = billingCompanyId();
  if (!companyId) return [];
  const companyName = getCurrentCompanyName();
  return jobs.filter(
    (job) =>
      String(job.companyId || "") === String(companyId) ||
      (!job.companyId && job.company === companyName),
  );
}
function canManageCandidates() {
  return Boolean(supabaseClient && isHrdSession());
}
function canDeleteCompanyJobs() {
  return canManageCandidates();
}
function getLines(value) {
  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}
function createScreeningQuestion(question = {}) {
  const id =
    question.id ||
    `question-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const type = question.type || "multiple_choice";
  return `<div class="screening-question" data-question-id="${id}">
    <div class="question-heading"><strong>Pertanyaan screening</strong><button type="button" class="text-link remove-question" aria-label="Hapus pertanyaan"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div>
    <div class="form-row"><label>Pertanyaan</label><input data-question-prompt required placeholder="Contoh: Berapa tahun pengalaman Anda?" value="${escapeHtml(question.prompt || "")}"></div>
    <div class="form-row"><label>Jenis jawaban</label><select data-question-type><option value="multiple_choice" ${type === "multiple_choice" ? "selected" : ""}>Pilihan ganda</option><option value="yes_no" ${type === "yes_no" ? "selected" : ""}>Ya/Tidak</option><option value="short_answer" ${type === "short_answer" ? "selected" : ""}>Jawaban singkat</option><option value="number" ${type === "number" ? "selected" : ""}>Angka</option></select></div>
    <div class="form-row choices-row" ${type === "multiple_choice" ? "" : "hidden"}><label>Pilihan, pisahkan dengan koma</label><input data-question-options placeholder="Ya, Tidak" value="${escapeHtml(question.options?.join(", ") || "")}"></div>
    <div class="form-row"><label>Jawaban yang dinilai sesuai</label><input data-question-answer required placeholder="Masukkan jawaban yang benar" value="${escapeHtml(question.correctAnswer || "")}"></div>
    <div class="form-row"><label>Poin jika sesuai</label><input data-question-points type="number" min="0" value="${Number(question.points) || 10}"></div>
  </div>`;
}
function calculateCandidateMatch(job, application) {
  const candidateSkills = (application.skills || []).map((skill) =>
    skill.trim().toLowerCase(),
  );
  const requiredSkills = (job.skills || []).map((skill) =>
    skill.trim().toLowerCase(),
  );
  const skillScore = requiredSkills.length
    ? Math.round(
        (requiredSkills.filter((skill) => candidateSkills.includes(skill))
          .length /
          requiredSkills.length) *
          100,
      )
    : 100;
  const candidateYears = Number(application.experienceYears) || 0;
  const experienceText = String(job.experience || "").toLowerCase();
  const requiredYears = experienceText.includes("senior")
    ? 5
    : experienceText.match(/\d+/)
      ? Number(experienceText.match(/\d+/)[0])
      : 0;
  const experienceScore = requiredYears
    ? Math.min(100, Math.round((candidateYears / requiredYears) * 100))
    : 100;
  const educationLevels = {
    "Tidak bersekolah": 0,
    SD: 1,
    SMP: 2,
    SMK: 3,
    SMA: 3,
    D3: 4,
    S1: 5,
    S2: 6,
    S3: 7,
  };
  const requiredEducation = educationLevels[job.minimumEducation] || 0;
  const candidateEducation = educationLevels[application.education] || 0;
  const educationScore = requiredEducation
    ? Math.min(100, Math.round((candidateEducation / requiredEducation) * 100))
    : 100;
  const pointsAvailable = (job.screeningQuestions || []).reduce(
    (total, question) => total + (Number(question.points) || 10),
    0,
  );
  const pointsEarned = (job.screeningQuestions || []).reduce(
    (total, question) => {
      const answer = String(application.answers?.[question.id] || "")
        .trim()
        .toLowerCase();
      return (
        total +
        (answer &&
        answer ===
          String(question.correctAnswer || "")
            .trim()
            .toLowerCase()
          ? Number(question.points) || 10
          : 0)
      );
    },
    0,
  );
  const screeningScore = pointsAvailable
    ? Math.round((pointsEarned / pointsAvailable) * 100)
    : 100;
  const matchPercentage = Math.round(
    skillScore * 0.4 +
      experienceScore * 0.25 +
      educationScore * 0.15 +
      screeningScore * 0.2,
  );
  return {
    skillScore,
    experienceScore,
    educationScore,
    screeningScore,
    pointsEarned,
    pointsAvailable,
    matchPercentage,
  };
}
function companyLogo(job) {
  return `<span class="company-logo ${escapeHtml(job.tone || "")}">${escapeHtml(job.logo || "")}</span>`;
}
function parseSalaryAmount(value, context = "") {
  const token = String(value || "")
    .trim()
    .toLowerCase();
  const raw = `${token} ${context}`.trim().toLowerCase();
  const match = token.match(/\d[\d.,]*/);
  if (!match) return 0;
  let amount;
  if (/\.\d{3}(?:\.\d{3})*$/.test(match[0]) || /,/.test(match[0]))
    amount = Number(match[0].replace(/[.,]/g, ""));
  else amount = Number(match[0]);
  if (!Number.isFinite(amount)) return 0;
  if (/\bmiliar\b|\bm\b/.test(raw)) amount *= 1_000_000_000;
  else if (/\bjuta\b/.test(raw)) amount *= 1_000_000;
  else if (/\bribu\b/.test(raw)) amount *= 1_000;
  return Math.round(amount);
}
function getJobSalaryCeiling(job) {
  if (Number(job.salaryMax) > 0) return Number(job.salaryMax);
  const values = (String(job.salaryText || "").match(/\d[\d.,]*/g) || []).map(
    (value) => parseSalaryAmount(value, job.salaryText),
  );
  return values.length
    ? values[values.length - 1]
    : Number(job.salary) > 0
      ? Number(job.salary)
      : null;
}
function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
function readFavoriteItems(type) {
  const key = type === "job" ? "jobhub-saved" : "jobhub-saved-companies";
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}
function writeFavoriteItems(type, items) {
  writeStoredJson(
    type === "job" ? "jobhub-saved" : "jobhub-saved-companies",
    items,
  );
}
function isJobSaved(jobId) {
  return readFavoriteItems("job").some(
    (item) => String(item) === String(jobId),
  );
}
function isCompanySaved(companyName) {
  return readFavoriteItems("company").some(
    (item) =>
      String(item).toLocaleLowerCase("id-ID") ===
      String(companyName).toLocaleLowerCase("id-ID"),
  );
}
function isRecentlyPosted(job) {
  const timestamp = Date.parse(
    job.postedAt || job.posted_at || job.createdAt || "",
  );
  const age = Date.now() - timestamp;
  return (
    Number.isFinite(timestamp) && age >= 0 && age < 7 * 24 * 60 * 60 * 1000
  );
}
async function syncFavoriteItems() {
  if (!supabaseClient || !isCandidateSession()) return;
  const userId = supabaseSession.user.id;
  const { data, error } = await supabaseClient
    .from("candidate_favorites")
    .select("item_type,item_key")
    .eq("user_id", userId);
  if (error) throw error;
  for (const type of ["job", "company"]) {
    const local = readFavoriteItems(type);
    const remote = (data || [])
      .filter((item) => item.item_type === type)
      .map((item) => item.item_key);
    const remoteKeys = new Set(
      remote.map((item) => String(item).toLocaleLowerCase("id-ID")),
    );
    const localOnly = local.filter(
      (item) => !remoteKeys.has(String(item).toLocaleLowerCase("id-ID")),
    );
    if (localOnly.length) {
      const { error: syncError } = await supabaseClient
        .from("candidate_favorites")
        .upsert(
          localOnly.map((item) => ({
            user_id: userId,
            item_type: type,
            item_key: String(item),
          })),
          { onConflict: "user_id,item_type,item_key" },
        );
      if (syncError) throw syncError;
    }
    writeFavoriteItems(type, [...new Set([...local, ...remote])]);
  }
}
async function toggleFavoriteItem(type, itemKey) {
  if (!supabaseSession || !isCandidateSession()) {
    toast("Masuk sebagai pencari kerja untuk menyimpan favorit.");
    openAuthModal(false);
    return;
  }
  const items = readFavoriteItems(type);
  const existing = items.find(
    (item) =>
      String(item).toLocaleLowerCase("id-ID") ===
      String(itemKey).toLocaleLowerCase("id-ID"),
  );
  const next = existing
    ? items.filter(
        (item) =>
          String(item).toLocaleLowerCase("id-ID") !==
          String(itemKey).toLocaleLowerCase("id-ID"),
      )
    : [...items, itemKey];
  writeFavoriteItems(type, next);
  if (supabaseClient) {
    const query = supabaseClient.from("candidate_favorites");
    const result = existing
      ? await query
          .delete()
          .eq("user_id", supabaseSession.user.id)
          .eq("item_type", type)
          .eq("item_key", String(existing))
      : await query.upsert(
          {
            user_id: supabaseSession.user.id,
            item_type: type,
            item_key: String(itemKey),
          },
          { onConflict: "user_id,item_type,item_key" },
        );
    if (result.error) throw result.error;
  }
  toast(existing ? "Dihapus dari favorit." : "Ditambahkan ke favorit.");
  if (activeRoute === "favorites") await renderFavorites(false);
  else if (activeRoute === "detail") go("detail", currentJob?.id);
  else if (activeRoute === "jobs") renderJobs();
  else renderHome();
}
async function renderFavorites(syncCloud = true) {
  const jobsList = $("#savedJobsList"),
    companiesList = $("#savedCompaniesList");
  jobsList.setAttribute("aria-busy", "true");
  companiesList.setAttribute("aria-busy", "true");
  jobsList.innerHTML = loadingIndicator("Memuat lowongan favorit...");
  companiesList.innerHTML = loadingIndicator("Memuat perusahaan favorit...");
  try {
    if (syncCloud) {
      try {
        await syncFavoriteItems();
      } catch (error) {
        toast(
          `Favorit tersimpan di perangkat ini. Sinkronisasi akun gagal: ${error.message || "periksa tabel candidate_favorites."}`,
        );
      }
    }
    const savedJobs = readFavoriteItems("job")
      .map((id) => jobs.find((job) => String(job.id) === String(id)))
      .filter(Boolean);
    const companies = readFavoriteItems("company");
    $("#savedJobsCount").textContent = savedJobs.length;
    $("#savedCompaniesCount").textContent = companies.length;
    jobsList.innerHTML = savedJobs.length
      ? savedJobs.map(jobCard).join("")
      : '<div class="empty-state"><strong>Belum ada lowongan favorit</strong>Simpan lowongan untuk kembali melihatnya di sini.</div>';
    companiesList.innerHTML = companies.length
      ? companies
          .map((name) => {
            const companyJobs = jobs.filter(
              (job) =>
                String(job.company || "").toLocaleLowerCase("id-ID") ===
                String(name).toLocaleLowerCase("id-ID"),
            );
            return `<article class="favorite-company-card"><div><strong>${escapeHtml(name)}</strong><p>${companyJobs.length} lowongan tersedia</p></div><div class="favorite-company-actions"><button class="btn btn-outline btn-small" type="button" data-company-open="${escapeHtml(name)}">Lihat lowongan</button><button class="save-btn saved" type="button" data-company-save="${escapeHtml(name)}" aria-label="Hapus ${escapeHtml(name)} dari favorit"><i class="fa-solid fa-heart" aria-hidden="true"></i></button></div></article>`;
          })
          .join("")
      : '<div class="empty-state"><strong>Belum ada perusahaan favorit</strong>Simpan perusahaan dari halaman detail lowongan untuk melihatnya di sini.</div>';
  } finally {
    jobsList.setAttribute("aria-busy", "false");
    companiesList.setAttribute("aria-busy", "false");
  }
}
function jobCard(job) {
  const saved = isJobSaved(job.id);
  const companySaved = isCompanySaved(job.company);
  const badge = job.urgent
    ? '<span class="job-priority urgent"><span class="job-priority-dot" aria-hidden="true"></span>Segera</span>'
    : isRecentlyPosted(job)
      ? '<span class="job-priority new"><span class="job-priority-dot" aria-hidden="true"></span>Baru diposting</span>'
      : "";
  return `<article class="job-card ${String(job.id) === activeJobDetailId ? "is-selected" : ""}" data-open-job="${escapeHtml(job.id)}" tabindex="0" aria-label="Buka detail ${escapeHtml(job.title)}"><div class="job-card-top">${companyLogo(job)}<div class="job-card-tools">${badge}<button class="save-btn ${companySaved ? "saved" : ""}" type="button" data-company-save="${escapeHtml(job.company)}" aria-label="${companySaved ? "Hapus" : "Simpan"} perusahaan ${escapeHtml(job.company)}" title="${companySaved ? "Hapus" : "Simpan"} perusahaan favorit"><i class="fa-${companySaved ? "solid" : "regular"} fa-building" aria-hidden="true"></i></button><button class="save-btn ${saved ? "saved" : ""}" type="button" data-save="${escapeHtml(job.id)}" aria-label="${saved ? "Hapus dari" : "Simpan"} lowongan" title="${saved ? "Hapus dari" : "Simpan"} favorit"><i class="fa-${saved ? "solid" : "regular"} fa-heart" aria-hidden="true"></i></button></div></div><h3>${escapeHtml(job.title)}</h3><div class="company-name">${escapeHtml(job.company)} ${renderCompanyVerificationBadge(job.company)} &middot; ${escapeHtml(job.loc)}</div><div class="job-meta"><span><i class="fa-solid fa-briefcase" aria-hidden="true"></i> ${escapeHtml(job.type)}</span><span><i class="fa-regular fa-clock" aria-hidden="true"></i> ${escapeHtml(job.experience)}</span></div><div class="salary">${escapeHtml(job.salaryText)}</div><div class="card-bottom"><span class="posted">${escapeHtml(job.posted)}</span><button class="btn btn-outline btn-small" type="button" data-job="${escapeHtml(job.id)}"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Lihat detail</button></div>${activeRoute === "favorites" ? `<button class="text-link favorite-remove-job" type="button" data-remove-saved-job="${escapeHtml(job.id)}"><i class="fa-solid fa-trash" aria-hidden="true"></i> Hapus dari daftar tersimpan</button>` : ""}</article>`;
}
function formatInterviewDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}
function getApplicationInterviews(applicationId) {
  return getInterviews()
    .filter((interview) => interview.applicationId === applicationId)
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
}
function renderCandidateNotifications() {
  const container = $("#candidateInterviewNotifications");
  if (!container) return;
  const email = (supabaseSession?.user?.email || "").trim().toLowerCase();
  const source = candidateInterviewCache ?? getInterviews();
  const notifications = source
    .filter(
      (interview) => interview.candidateEmail?.trim().toLowerCase() === email,
    )
    .sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  $("#candidateInterviewCount").textContent = notifications.length;
  container.innerHTML = notifications.length
    ? notifications
        .map(
          (interview) => `<article class="interview-notification">
    <div class="interview-notification-icon"><i class="fa-regular fa-calendar-check" aria-hidden="true"></i></div>
    <div class="interview-notification-content">
      <strong>${escapeHtml(interview.interviewType)} · ${escapeHtml(interview.jobTitle)}</strong>
      <time datetime="${escapeHtml(interview.startsAt)}">${escapeHtml(formatInterviewDate(interview.startsAt))}</time>
      ${interview.notes ? `<p>${escapeHtml(interview.notes)}</p>` : ""}
      ${interview.meetingUrl ? `<a class="btn btn-outline btn-small" href="${escapeHtml(interview.meetingUrl)}" target="_blank" rel="noopener">Buka link meeting</a>` : ""}
    </div>
  </article>`,
        )
        .join("")
    : '<div class="interview-notification-empty">Belum ada jadwal interview. Jika mendapat undangan, detailnya akan muncul di sini.</div>';
}
async function renderCandidateApplications() {
  const container = $("#candidateApplicationsList");
  if (!container) return;
  container.setAttribute("aria-busy", "true");
  container.innerHTML = loadingIndicator("Memuat riwayat lamaran...");
  try {
    const candidateId = supabaseSession?.user?.id || "demo-candidate";
    let applications = getApplications().filter(
      (item) => item.candidateId === candidateId,
    );
    if (supabaseClient && isCandidateSession()) {
      const { data, error } = await supabaseClient
        .from("jobhub_applications")
        .select("*")
        .eq("candidate_id", supabaseSession.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      applications = (data || []).map(fromSupabaseApplication);
    }
    saveApplications(applications);
    container.innerHTML = applications.length
      ? applications
          .map((application) => {
            const job = jobs.find(
              (item) => String(item.id) === String(application.jobId),
            );
            const submitted = application.createdAt
              ? new Intl.DateTimeFormat("id-ID", {
                  dateStyle: "medium",
                }).format(new Date(application.createdAt))
              : "Tanggal tidak tersedia";
            const statusLabel =
              application.status === "New Applicant"
                ? "Lamaran terkirim"
                : application.status;
            return `<article class="candidate-application-card"><div class="candidate-application-main"><span class="candidate-status-badge">${escapeHtml(statusLabel)}</span><h2>${escapeHtml(application.jobTitle || job?.title || "Lowongan")}</h2><p>${escapeHtml(job?.company || "Perusahaan")} · Dikirim ${escapeHtml(submitted)}</p><div class="candidate-application-viewed ${application.viewedAt ? "is-viewed" : ""}"><i class="fa-${application.viewedAt ? "solid" : "regular"} fa-eye" aria-hidden="true"></i> ${application.viewedAt ? "Dilihat perusahaan" : "Menunggu ditinjau perusahaan"}</div></div><div class="candidate-application-actions"><button class="btn btn-outline btn-small" type="button" data-message-application="${escapeHtml(application.id)}"><i class="fa-regular fa-message" aria-hidden="true"></i> Pesan perusahaan</button>${job ? `<button class="btn btn-outline btn-small" type="button" data-job="${escapeHtml(job.id)}">Lihat lowongan</button>` : ""}</div></article>`;
          })
          .join("")
      : '<div class="empty-state"><strong>Belum ada lamaran</strong>Lamaran yang Anda kirim akan tercatat dan dapat dipantau di sini.<br><button class="btn btn-small" type="button" data-route="jobs">Cari lowongan</button></div>';
  } catch (error) {
    container.innerHTML = `<p class="cv-analysis-error">Riwayat lamaran gagal dimuat: ${escapeHtml(error.message || "periksa koneksi.")}</p>`;
    throw error;
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}
function formatChatTime(value) {
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? new Intl.DateTimeFormat("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    : "";
}
const chatAttachmentBucket = "jobhub-message-attachments";
const chatAttachmentMaxBytes = 10 * 1024 * 1024;
const chatAttachmentMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);
function parseJobMessageAttachment(body) {
  try {
    const parsed = JSON.parse(String(body || ""));
    return parsed?.type === "attachment" &&
      typeof parsed.path === "string" &&
      typeof parsed.name === "string"
      ? parsed
      : null;
  } catch {
    return null;
  }
}
function jobMessagePreview(body) {
  const attachment = parseJobMessageAttachment(body);
  return attachment ? `Lampiran: ${attachment.name}` : String(body || "");
}
async function renderJobMessageBubbles(messages) {
  const attachments = messages
    .map((message, index) => ({
      index,
      attachment: parseJobMessageAttachment(message.body),
    }))
    .filter((item) => item.attachment);
  const signedUrls = new Map();
  if (attachments.length) {
    const { data, error } = await supabaseClient.storage
      .from(chatAttachmentBucket)
      .createSignedUrls(
        attachments.map((item) => item.attachment.path),
        3600,
      );
    if (error)
      console.warn("Chat attachments could not be opened:", error.message);
    attachments.forEach((item, index) =>
      signedUrls.set(item.index, error ? "" : data?.[index]?.signedUrl || ""),
    );
  }
  return messages
    .map((message, index) => {
      const attachment = parseJobMessageAttachment(message.body);
      const mine = message.sender_id === supabaseSession.user.id;
      const bubbleClass = `bubble${mine ? " mine" : ""}`;
      const messageAttrs = `data-job-message-id="${escapeHtml(message.id || "")}" data-job-message-owner="${mine ? "true" : "false"}" data-job-application-id="${escapeHtml(message.application_id || "")}"`;
      const time = `<small>${escapeHtml(formatChatTime(message.created_at))}${message.edited_at ? " · diedit" : ""}</small>`;
      if (!attachment)
        return `<div class="${bubbleClass}" ${messageAttrs}>${escapeHtml(message.body)}${time}</div>`;
      const signedUrl = signedUrls.get(index) || "";
      const isImage = String(attachment.mimeType || "").startsWith("image/");
      const icon =
        attachment.mimeType === "application/pdf"
          ? "fa-file-pdf"
          : "fa-file-lines";
      const imagePreview =
        isImage && signedUrl
          ? `<a class="chat-file-image" href="${escapeHtml(signedUrl)}" target="_blank" rel="noopener"><img src="${escapeHtml(signedUrl)}" alt="${escapeHtml(attachment.name)}" loading="lazy"></a>`
          : "";
      const fileLink = signedUrl
        ? `<a class="chat-file-link" href="${escapeHtml(signedUrl)}" target="_blank" rel="noopener" download="${escapeHtml(attachment.name)}"><i class="fa-regular ${icon}" aria-hidden="true"></i><span>${escapeHtml(attachment.name)}</span><i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a>`
        : `<span class="chat-file-unavailable"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Lampiran tidak tersedia</span>`;
      const caption = attachment.caption
        ? `<p class="chat-file-caption">${escapeHtml(attachment.caption)}</p>`
        : "";
      return `<div class="${bubbleClass}" ${messageAttrs}><div class="chat-file-attachment">${imagePreview}${fileLink}</div>${caption}${time}</div>`;
    })
    .join("");
}
function connectJobMessagesRealtime() {
  if (!supabaseClient || !supabaseSession) return;
  const companyMode = isHrdSession();
  const key = `${supabaseSession.user.id}:${companyMode ? billingCompanyId() : "candidate"}`;
  if (jobMessageChannel && jobMessageChannelKey === key) return;
  if (jobMessageChannel) supabaseClient.removeChannel(jobMessageChannel);
  jobMessageChannelKey = key;
  const filter = companyMode
    ? `company_id=eq.${billingCompanyId()}`
    : `candidate_id=eq.${supabaseSession.user.id}`;
  jobMessageChannel = supabaseClient
    .channel(`jobhub-messages-${key}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "jobhub_messages", filter },
      async () => {
        const messagesVisible =
          activeRoute === "messages" ||
          (activeRoute === "dashboard" &&
            activeDashboardSection === "messages");
        if (messagesVisible || candidateChatPopupOpen) {
          try {
            await renderJobMessages(activeMessageApplicationId);
            if (companyMode) await loadDashboardMessageCount();
            else await loadCandidateUnreadMessageCount();
          } catch (error) {
            console.warn("Messages could not refresh:", error.message);
          }
        } else if (companyMode)
          loadDashboardMessageCount().catch((error) =>
            console.warn(
              "Unread message count could not refresh:",
              error.message,
            ),
          );
        else if (isCandidateSession())
          loadCandidateUnreadMessageCount().catch((error) =>
            console.warn(
              "Candidate unread message count could not refresh:",
              error.message,
            ),
          );
      },
    )
    .subscribe();
}
function updateDashboardMessageCount(count) {
  dashboardMessageCountCache = Number(count) || 0;
  const countElement = $("#dashboardMessageCount");
  const badge = $("#dashboardUnreadMessageCount");
  if (countElement)
    countElement.textContent = String(dashboardMessageCountCache);
  if (badge) {
    badge.textContent = String(dashboardMessageCountCache);
    badge.hidden = dashboardMessageCountCache === 0;
    badge.classList.toggle("is-unread", dashboardMessageCountCache > 0);
  }
}
function updateCandidateUnreadMessageCount(count) {
  candidateUnreadMessageCount = Number(count) || 0;
  const badge = $("#candidateChatUnread");
  const launcher = $("#candidateChatLauncher");
  if (badge) {
    badge.textContent =
      candidateUnreadMessageCount > 99
        ? "99+"
        : String(candidateUnreadMessageCount);
    badge.hidden = candidateUnreadMessageCount === 0;
  }
  if (launcher)
    launcher.setAttribute(
      "aria-label",
      candidateUnreadMessageCount
        ? `Buka pesan perusahaan, ${candidateUnreadMessageCount} belum dibaca`
        : "Buka pesan perusahaan",
    );
}
async function loadCandidateUnreadMessageCount() {
  if (
    !supabaseClient ||
    !supabaseSession ||
    !isCandidateSession() ||
    isHrdSession()
  ) {
    updateCandidateUnreadMessageCount(0);
    return;
  }
  const { count, error } = await supabaseClient
    .from("jobhub_messages")
    .select("id", { count: "exact", head: true })
    .eq("candidate_id", supabaseSession.user.id)
    .eq("sender_role", "company")
    .is("candidate_read_at", null);
  if (error) throw error;
  updateCandidateUnreadMessageCount(count || 0);
}
async function markCandidateConversationRead(applicationId) {
  if (
    !supabaseClient ||
    !isCandidateSession() ||
    isHrdSession() ||
    !applicationId
  )
    return;
  const { error } = await supabaseClient
    .from("jobhub_messages")
    .update({ candidate_read_at: new Date().toISOString() })
    .eq("candidate_id", supabaseSession.user.id)
    .eq("application_id", applicationId)
    .eq("sender_role", "company")
    .is("candidate_read_at", null);
  if (error) throw error;
  await loadCandidateUnreadMessageCount();
}
function openCandidateChatPopup(applicationId = "") {
  if (!isCandidateSession() || isHrdSession()) return;
  const view = $("#messagesView");
  const popup = $("#candidateChatPopup");
  const popupBody = $("#candidateChatPopupBody");
  if (!view || !popup || !popupBody) return;
  if (!candidateChatViewPosition)
    candidateChatViewPosition = {
      parent: view.parentNode,
      nextSibling: view.nextSibling,
      wasActive: view.classList.contains("active"),
      display: view.style.display,
    };
  popupBody.append(view);
  view.classList.add("active");
  view.style.display = "block";
  popup.hidden = false;
  candidateChatPopupOpen = true;
  document.body.classList.add("candidate-chat-popup-open");
  $("#candidateChatLauncher")?.setAttribute("aria-expanded", "true");
  sessionStorage.removeItem("jobhub-message-job-filter");
  sessionStorage.removeItem("jobhub-open-message-application");
  activeMessageApplicationId = applicationId ? String(applicationId) : "";
  $("#candidateChatPopupTitle").textContent = "Pesan Perusahaan";
  $("#candidateChatPopupClose")?.focus({ preventScroll: true });
  renderJobMessages(applicationId)
    .then(loadCandidateUnreadMessageCount)
    .catch((error) =>
      toast(
        `Pesan perusahaan belum dapat dimuat: ${error.message || "periksa koneksi dan migration jobhub-messaging.sql."}`,
      ),
    );
}
function closeCandidateChatPopup() {
  if (!candidateChatPopupOpen) return;
  const view = $("#messagesView");
  const popup = $("#candidateChatPopup");
  const position = candidateChatViewPosition;
  if (view && position?.parent) {
    const reference =
      position.nextSibling?.parentNode === position.parent
        ? position.nextSibling
        : null;
    position.parent.insertBefore(view, reference);
    view.classList.toggle("active", position.wasActive);
    view.style.display = position.display;
  }
  if (popup) popup.hidden = true;
  candidateChatPopupOpen = false;
  candidateChatViewPosition = null;
  document.body.classList.remove("candidate-chat-popup-open");
  $("#candidateChatLauncher")?.setAttribute("aria-expanded", "false");
  $("#candidateChatLauncher")?.focus({ preventScroll: true });
}
async function loadDashboardMessageCount() {
  if (!$("#dashboardMessageCount")) return;
  if (!supabaseClient || !isHrdSession()) {
    updateDashboardMessageCount(0);
    return;
  }
  const { count, error } = await supabaseClient
    .from("jobhub_messages")
    .select("id", { count: "exact", head: true })
    .eq("company_id", billingCompanyId())
    .eq("sender_role", "candidate")
    .is("company_read_at", null);
  if (error) throw error;
  updateDashboardMessageCount(count || 0);
}
async function markCompanyConversationRead(applicationId) {
  if (!supabaseClient || !isHrdSession() || !applicationId) return;
  const { error } = await supabaseClient
    .from("jobhub_messages")
    .update({ company_read_at: new Date().toISOString() })
    .eq("company_id", billingCompanyId())
    .eq("application_id", applicationId)
    .eq("sender_role", "candidate")
    .is("company_read_at", null);
  if (error) throw error;
  await loadDashboardMessageCount();
}
async function renderJobMessages(requestedApplicationId = "") {
  const conversationList = $("#conversationList");
  const chatName = $("#chatName");
  const chatMessages = $("#chatMessages");
  const chatForm = $("#chatForm");
  if (!conversationList || !chatName || !chatMessages || !chatForm) return;
  if (
    !supabaseClient ||
    !supabaseSession ||
    (!isHrdSession() && !isCandidateSession())
  ) {
    conversationList.innerHTML =
      '<div class="conversation-empty"><i class="fa-regular fa-comments" aria-hidden="true"></i><strong>Masuk untuk melihat pesan</strong><span>Percakapan tersimpan berdasarkan lamaran.</span></div>';
    chatName.innerHTML =
      '<span class="chat-placeholder-avatar"><i class="fa-regular fa-comments" aria-hidden="true"></i></span><span><strong>Pesan JobHub</strong><small>Percakapan tersimpan per lamaran.</small></span>';
    chatMessages.innerHTML =
      '<div class="chat-empty"><i class="fa-regular fa-paper-plane" aria-hidden="true"></i><strong>Belum ada percakapan</strong></div>';
    chatForm.hidden = false;
    chatForm.dataset.applicationId = "";
    $("#chatInput").disabled = true;
    $("#chatInput").placeholder = "Masuk untuk menulis pesan...";
    $('#chatForm [type="submit"]').disabled = true;
    return;
  }
  const companyMode = isHrdSession();
  const searchInput = $("#conversationSearch");
  if (searchInput) {
    searchInput.placeholder = companyMode
      ? "Cari kandidat atau lowongan"
      : "Cari perusahaan atau lowongan";
    searchInput.setAttribute("aria-label", searchInput.placeholder);
  }
  const breadcrumb = $("#messagesView .breadcrumb");
  if (breadcrumb)
    breadcrumb.textContent = companyMode
      ? "Perusahaan / Pesan"
      : "Lamaran Saya / Pesan";
  const pageIntro = $("#messagesView .page-intro");
  if (pageIntro)
    pageIntro.textContent = companyMode
      ? "Diskusikan proses rekrutmen langsung dari lamaran kandidat."
      : "Lihat balasan perusahaan pada setiap lamaran.";
  const guide = $("#messagesView .messages-guide");
  if (guide) guide.hidden = !companyMode;
  const applicationQuery = supabaseClient
    .from("jobhub_applications")
    .select("*")
    .eq(
      companyMode ? "company_id" : "candidate_id",
      companyMode ? billingCompanyId() : supabaseSession.user.id,
    )
    .order("created_at", { ascending: false })
    .limit(500);
  const [
    { data: applicationRows, error: applicationError },
    { data: messageRows, error: messageError },
  ] = await Promise.all([
    applicationQuery,
    supabaseClient
      .from("jobhub_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
  ]);
  if (applicationError) throw applicationError;
  if (messageError) throw messageError;
  jobMessageApplications = (applicationRows || []).map(fromSupabaseApplication);
  saveApplications(jobMessageApplications);
  const storedJobFilter =
    sessionStorage.getItem("jobhub-message-job-filter") || "";
  if (storedJobFilter) sessionStorage.removeItem("jobhub-message-job-filter");
  if (storedJobFilter) activeMessageJobId = storedJobFilter;
  else activeMessageJobId = "";
  if (activeMessageJobId)
    jobMessageApplications = jobMessageApplications.filter(
      (application) => String(application.jobId) === String(activeMessageJobId),
    );
  const applicationIds = new Set(
    jobMessageApplications.map((application) => String(application.id)),
  );
  jobMessages = (messageRows || [])
    .filter((message) => applicationIds.has(String(message.application_id)))
    .reverse();
  connectJobMessagesRealtime();

  const storedSelection =
    sessionStorage.getItem("jobhub-open-message-application") || "";
  const selection = requestedApplicationId || storedSelection;
  if (storedSelection)
    sessionStorage.removeItem("jobhub-open-message-application");
  if (selection && applicationIds.has(String(selection)))
    activeMessageApplicationId = String(selection);
  else if (!applicationIds.has(String(activeMessageApplicationId)))
    activeMessageApplicationId = "";

  const grouped = new Map();
  for (const message of jobMessages) {
    const key = String(message.application_id);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(message);
  }
  const search = String($("#conversationSearch")?.value || "")
    .trim()
    .toLowerCase();
  const conversations = jobMessageApplications
    .map((application) => ({
      application,
      messages: grouped.get(String(application.id)) || [],
    }))
    .filter(({ application, messages }) => {
      const contact = companyMode
        ? application.candidateName
        : jobs.find((job) => String(job.id) === String(application.jobId))
            ?.company || "Perusahaan";
      const latest = jobMessagePreview(messages.at(-1)?.body || "");
      return (
        !search ||
        `${contact} ${application.jobTitle} ${latest}`
          .toLowerCase()
          .includes(search)
      );
    })
    .sort(
      (left, right) =>
        new Date(
          right.messages.at(-1)?.created_at || right.application.createdAt || 0,
        ) -
        new Date(
          left.messages.at(-1)?.created_at || left.application.createdAt || 0,
        ),
    );
  if (
    !conversations.some(
      (item) => String(item.application.id) === activeMessageApplicationId,
    ) &&
    conversations.length
  ) {
    activeMessageApplicationId = String(conversations[0].application.id);
  }
  conversationList.innerHTML = conversations.length
    ? conversations
        .map(({ application, messages }) => {
          const contact = companyMode
            ? application.candidateName
            : jobs.find((job) => String(job.id) === String(application.jobId))
                ?.company || "Perusahaan";
          const initials = String(contact || "?")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();
          const latest = messages.at(-1);
          return `<button class="conversation ${String(application.id) === activeMessageApplicationId ? "active" : ""}" type="button" data-open-chat="${escapeHtml(application.id)}" data-job-contact-id="${escapeHtml(application.id)}"><span class="avatar">${escapeHtml(initials)}</span><span class="conversation-copy"><strong>${escapeHtml(contact || "Perusahaan")}</strong><small>${escapeHtml(application.jobTitle || "Lowongan")}</small><small class="conversation-preview">${escapeHtml(latest ? jobMessagePreview(latest.body) : "Mulai percakapan")}</small></span><time>${latest ? escapeHtml(formatChatTime(latest.created_at)) : ""}</time></button>`;
        })
        .join("")
    : `<div class="conversation-empty"><i class="fa-regular fa-comments" aria-hidden="true"></i><strong>${activeMessageJobId ? (companyMode ? "Belum ada pesan untuk lowongan ini" : "Belum ada pesan untuk lamaran ini") : companyMode ? "Belum ada pesan kandidat" : "Belum ada percakapan"}</strong><span>${companyMode ? "Percakapan akan muncul di sini saat kandidat mengirim pesan." : "Pesan dari perusahaan akan muncul di sini setelah ada balasan untuk lamaranmu."}</span></div>`;

  const activeApplication = jobMessageApplications.find(
    (application) => String(application.id) === activeMessageApplicationId,
  );
  if (!activeApplication) {
    chatName.innerHTML = `<span class="chat-placeholder-avatar"><i class="fa-regular fa-comments" aria-hidden="true"></i></span><span><strong>Pilih percakapan</strong><small>${companyMode ? "Pilih pesan kandidat untuk melihat lowongan dan riwayat chat." : "Pilih lamaran untuk melihat pesan dari perusahaan."}</small></span>`;
    chatMessages.innerHTML = `<div class="chat-empty"><i class="fa-regular fa-paper-plane" aria-hidden="true"></i><strong>Ruang pesan</strong><span>${companyMode ? "Percakapan yang terkait lamaran akan tampil di sini." : "Pesan terkait lamaranmu akan tampil di sini."}</span></div>`;
    chatForm.hidden = false;
    chatForm.dataset.applicationId = "";
    $("#chatInput").disabled = true;
    $("#chatInput").placeholder = "Pilih lamaran untuk menulis pesan...";
    $('#chatForm [type="submit"]').disabled = true;
    return;
  }
  const activeMessages = grouped.get(activeMessageApplicationId) || [];
  const contact = companyMode
    ? activeApplication.candidateName
    : jobs.find((job) => String(job.id) === String(activeApplication.jobId))
        ?.company || "Perusahaan";
  chatName.innerHTML = `<span class="chat-placeholder-avatar">${escapeHtml(
    String(contact || "?")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase(),
  )}</span><span><strong>${escapeHtml(contact || "Kandidat")}</strong><small>${escapeHtml(activeApplication.jobTitle || "Lowongan")}</small></span><button class="chat-clear-contact" type="button" data-delete-job-contact="${escapeHtml(activeMessageApplicationId)}" title="Hapus seluruh chat dan kontak" aria-label="Hapus seluruh chat dan kontak"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>`;
  chatMessages.innerHTML = activeMessages.length
    ? await renderJobMessageBubbles(activeMessages)
    : `<div class="chat-empty"><i class="fa-regular fa-message" aria-hidden="true"></i><strong>Mulai percakapan</strong><span>Pesan ini terkait lamaran untuk ${escapeHtml(activeApplication.jobTitle || "lowongan")}.</span></div>`;
  chatForm.hidden = false;
  chatForm.dataset.applicationId = activeMessageApplicationId;
  $("#chatInput").disabled = false;
  const selectedAttachment = $("#chatAttachment")?.files?.[0];
  $("#chatInput").placeholder = selectedAttachment
    ? `Lampiran: ${selectedAttachment.name}`
    : "Ketik pesan...";
  $('#chatForm [type="submit"]').disabled = false;
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (
    companyMode &&
    activeMessages.some(
      (message) =>
        message.sender_role === "candidate" && !message.company_read_at,
    )
  ) {
    try {
      await markCompanyConversationRead(activeMessageApplicationId);
      const readAt = new Date().toISOString();
      jobMessages = jobMessages.map((message) =>
        message.application_id === activeMessageApplicationId &&
        message.sender_role === "candidate" &&
        !message.company_read_at
          ? { ...message, company_read_at: readAt }
          : message,
      );
    } catch (error) {
      console.warn("Messages could not be marked as read:", error.message);
    }
  } else if (
    !companyMode &&
    activeMessages.some(
      (message) =>
        message.sender_role === "company" && !message.candidate_read_at,
    )
  ) {
    try {
      await markCandidateConversationRead(activeMessageApplicationId);
      const readAt = new Date().toISOString();
      jobMessages = jobMessages.map((message) =>
        message.application_id === activeMessageApplicationId &&
        message.sender_role === "company" &&
        !message.candidate_read_at
          ? { ...message, candidate_read_at: readAt }
          : message,
      );
    } catch (error) {
      console.warn(
        "Candidate messages could not be marked as read:",
        error.message,
      );
    }
  }
}
async function sendJobMessage(event) {
  event.preventDefault();
  const input = $("#chatInput");
  const body = String(input?.value || "").trim();
  const attachmentInput = $("#chatAttachment");
  const file = attachmentInput?.files?.[0] || null;
  const application = jobMessageApplications.find(
    (item) => String(item.id) === String(activeMessageApplicationId),
  );
  if ((!body && !file) || !application || !supabaseClient || !supabaseSession)
    return;
  if (body.length > 5000) {
    toast("Pesan maksimal 5.000 karakter.");
    return;
  }
  if (
    file &&
    (!chatAttachmentMimeTypes.has(file.type) ||
      file.size > chatAttachmentMaxBytes)
  ) {
    toast(
      file.size > chatAttachmentMaxBytes
        ? "Ukuran lampiran maksimal 10 MB."
        : "Format lampiran tidak didukung. Pilih gambar atau dokumen yang diizinkan.",
    );
    return;
  }
  const button = $('#chatForm [type="submit"]');
  if (button) button.disabled = true;
  let uploadedPath = "";
  try {
    const companyMode = isHrdSession();
    let messageBody = body;
    if (file) {
      if (attachmentInput.dataset.applicationId !== String(application.id))
        throw new Error("Pilih ulang lampiran untuk percakapan ini.");
      const safeFileName =
        String(file.name || "lampiran")
          .normalize("NFKC")
          .replace(/[^a-zA-Z0-9._-]+/g, "_")
          .replace(/^\.+/, "")
          .slice(-100) || "lampiran";
      uploadedPath = `${application.id}/${supabaseSession.user.id}/${crypto.randomUUID()}-${safeFileName}`;
      const { error: uploadError } = await supabaseClient.storage
        .from(chatAttachmentBucket)
        .upload(uploadedPath, file, { contentType: file.type, upsert: false });
      if (uploadError) throw uploadError;
      messageBody = JSON.stringify({
        type: "attachment",
        name: file.name,
        mimeType: file.type,
        path: uploadedPath,
        caption: body,
      });
      if (messageBody.length > 5000)
        throw new Error("Nama lampiran atau keterangan terlalu panjang.");
    }
    const payload = {
      application_id: String(application.id),
      job_id: String(application.jobId),
      company_id: application.companyId || billingCompanyId(),
      candidate_id: application.candidateId,
      sender_id: supabaseSession.user.id,
      sender_role: companyMode ? "company" : "candidate",
      body: messageBody,
    };
    const { error } = await supabaseClient
      .from("jobhub_messages")
      .insert(payload);
    if (error) throw error;
    input.value = "";
    input.placeholder = "Ketik pesan...";
    if (attachmentInput) {
      attachmentInput.value = "";
      delete attachmentInput.dataset.applicationId;
    }
    await renderJobMessages(application.id);
  } catch (error) {
    if (uploadedPath) {
      try {
        const { error: cleanupError } = await supabaseClient.storage
          .from(chatAttachmentBucket)
          .remove([uploadedPath]);
        if (cleanupError)
          console.warn(
            "Unsent chat attachment could not be removed:",
            cleanupError.message,
          );
      } catch (cleanupError) {
        console.warn(
          "Unsent chat attachment cleanup failed:",
          cleanupError.message,
        );
      }
    }
    toast(
      `Pesan belum terkirim: ${error.message || "pastikan migration supabase/jobhub-messaging.sql sudah dijalankan."}`,
    );
  } finally {
    if (button?.isConnected) button.disabled = false;
  }
}
async function markApplicationsViewedByHrd() {
  if (!supabaseClient || !isHrdSession() || activeRoute !== "dashboard") return;
  const unread = getApplications().filter(
    (application) => !application.viewedAt,
  );
  if (!unread.length) return;
  const viewedAt = new Date().toISOString();
  const { error } = await supabaseClient
    .from("jobhub_applications")
    .update({ viewed_at: viewedAt })
    .in(
      "id",
      unread.map((application) => application.id),
    )
    .eq("company_id", billingCompanyId());
  if (error) throw error;
  const ids = new Set(unread.map((application) => application.id));
  saveApplications(
    getApplications().map((application) =>
      ids.has(application.id) ? { ...application, viewedAt } : application,
    ),
  );
  renderDashboard();
}
function renderCompanyVerificationState(record = null) {
  const current =
    record ||
    getCompanyVerifications().find(
      (item) =>
        item.userId === supabaseSession?.user?.id ||
        item.email?.toLowerCase() ===
          supabaseSession?.user?.email?.toLowerCase() ||
        !supabaseSession,
    );
  const status = $("#companyVerificationStatus"),
    badge = $("#companyVerifiedBadge"),
    feedback = $("#companyVerificationFeedback");
  if (!status || !badge || !feedback) return;
  const companyName = current?.companyName || getCurrentCompanyName();
  $("#companyProfileName").textContent = companyName;
  const verified =
    current?.status === "verified" || isCompanyVerified(companyName);
  const noticeRecord = current
    ? { ...current, status: verified ? "verified" : current.status }
    : verified
      ? { status: "verified" }
      : null;
  status.hidden = verified;
  status.className = `status ${current?.status === "rejected" ? "rejected" : "pending"}`;
  status.textContent =
    current?.status === "pending"
      ? "Sedang diproses"
      : current?.status === "rejected"
        ? "Perlu perbaikan"
        : "Belum diverifikasi";
  badge.hidden = !verified;
  badge.classList.toggle("is-verified", verified);
  feedback.hidden = !noticeRecord;
  feedback.innerHTML = companyVerificationNoticeMarkup(noticeRecord);
  const retryNotification = $("#retryCompanyVerificationNotification");
  if (retryNotification)
    retryNotification.hidden =
      !current?.notificationPending || !isCompanyAccount();
  renderCompanyDashboardOnboarding();
}
function companyVerificationNoticeMarkup(record) {
  if (!record) return "";
  const uploadPending = Boolean(record.uploadPending);
  const state = uploadPending ? "error" : record.status;
  const variants = {
    verified: {
      icon: "fa-circle-check",
      title: "Verified Company",
      badge: "TERVERIFIKASI",
      message:
        "Perusahaan telah diverifikasi admin. Badge hijau aktif dan Anda dapat melanjutkan persiapan untuk memposting lowongan.",
    },
    pending: {
      icon: "fa-clock",
      title: "Pengajuan sedang diperiksa",
      badge: "IN PROGRESS",
      message:
        "Dokumen legal sedang diperiksa admin. Fitur posting lowongan belum tersedia sampai verifikasi disetujui.",
    },
    rejected: {
      icon: "fa-circle-exclamation",
      title: "Pengajuan perlu diperbaiki",
      badge: "DITOLAK",
      message:
        "Dokumen belum dapat disetujui. Periksa catatan admin, perbaiki dokumen, lalu ajukan kembali.",
    },
    error: {
      icon: "fa-triangle-exclamation",
      title: "Pengajuan belum terkirim",
      badge: "PERLU TINDAKAN",
      message:
        "Dokumen masih tersimpan di perangkat ini. Periksa koneksi, lalu kirim ulang pengajuan.",
    },
  };
  const variant = variants[state];
  if (!variant) return "";
  const reviewNote =
    state === "rejected" && record.reviewNote
      ? `<p class="company-verification-notice-note"><strong>Catatan admin:</strong> ${escapeHtml(record.reviewNote)}</p>`
      : "";
  const notificationWarning =
    state === "pending" && record.notificationPending
      ? "<small>Email pemberitahuan admin masih tertunda; pengajuan Anda tetap tercatat.</small>"
      : "";
  const uploadError =
    state === "error" && record.uploadError
      ? `<small class="company-verification-notice-error">Detail: ${escapeHtml(record.uploadError)}</small>`
      : "";
  const action =
    state === "verified"
      ? '<button class="btn btn-small company-verification-notice-action" type="button" data-route="dashboard"><i class="fa-solid fa-gauge-high" aria-hidden="true"></i> Masuk ke Dashboard Perusahaan</button>'
      : state === "rejected" || uploadPending
        ? `<button class="btn btn-small company-verification-notice-action" type="button" data-resubmit-company-verification><i class="fa-solid fa-arrow-rotate-right" aria-hidden="true"></i> ${uploadPending ? "Kirim ulang pengajuan" : "Ajukan ulang dokumen"}</button>`
        : "";
  return `<aside class="company-verification-notice is-${variant === variants.error ? "error" : state}" role="status" aria-live="polite"><span class="company-verification-notice-icon" aria-hidden="true"><i class="fa-solid ${variant.icon}"></i></span><div class="company-verification-notice-copy"><strong>${variant.title}</strong><p>${variant.message}</p>${reviewNote}${notificationWarning}${uploadError}${action}</div><span class="company-verification-notice-badge">${variant.badge}</span></aside>`;
}
async function retryCompanyVerificationNotification() {
  const item = getCompanyVerifications().find(
    (record) => record.userId === supabaseSession?.user?.id,
  );
  if (!item)
    throw new Error("Pengajuan verifikasi perusahaan tidak ditemukan.");
  if (item.uploadPending) await uploadCompanyVerification(item);
  else await notifyCompanyVerificationAdmin(item);
  renderCompanyVerificationState(item);
  if (item.notificationPending)
    throw new Error(
      item.notificationError || "Email notifikasi masih tertunda.",
    );
  toast("Email pemberitahuan pengajuan berhasil dikirim ke admin.");
}
function openCompanyVerificationResubmission() {
  if (!supabaseClient || !supabaseSession || !isCompanyAccount()) {
    toast("Masuk ke akun perusahaan untuk mengajukan verifikasi legal.");
    return;
  }
  if (!companyProfileCompletionState().complete) {
    toast("Lengkapi profil perusahaan terlebih dahulu.");
    go("company-complete");
    return;
  }
  if (!supabaseSession.user.email_confirmed_at) {
    toast("Konfirmasi email sebelum mengajukan verifikasi perusahaan.");
    return;
  }
  const current = getCompanyVerifications().find(
    (item) => item.userId === supabaseSession.user.id,
  ) || {
    companyId: supabaseSession.user.id,
    userId: supabaseSession.user.id,
    companyName: getCurrentCompanyName(),
    email: supabaseSession.user.email,
    status: "pending",
    documents: {},
    submittedAt: "",
    reviewedAt: "",
    reviewNote: "",
    uploadPending: true,
  };
  if (current.status === "verified") {
    toast("Perusahaan sudah terverifikasi.");
    return;
  }
  if (current.status === "pending" && !current.uploadPending) {
    toast("Dokumen perusahaan sedang menunggu pemeriksaan admin.");
    return;
  }
  const documentDetails = {
    nib: {
      icon: "fa-file-lines",
      description: "Nomor Induk Berusaha perusahaan Anda.",
    },
    npwp: {
      icon: "fa-receipt",
      description: "Nomor Pokok Wajib Pajak perusahaan Anda.",
    },
    legal: {
      icon: "fa-file-shield",
      description: "Dokumen pendukung legalitas perusahaan Anda.",
    },
  };
  openModal(
    current.status === "rejected"
      ? "Perbaiki dokumen verifikasi"
      : "Ajukan verifikasi perusahaan",
    `<form id="companyResubmissionForm">
    <p class="company-verification-intro">Unggah dokumen perusahaan untuk diperiksa admin verifikasi. Format PDF, JPG, atau PNG; maksimal 5 MB per file.</p>
    <div class="company-verification-documents">${COMPANY_DOCUMENT_TYPES.map(
      ([
        type,
        label,
      ]) => `<section class="company-verification-doc-card" data-verification-card="${type}">
      <div class="company-verification-doc-heading"><span class="company-verification-doc-icon" aria-hidden="true"><i class="fa-solid ${documentDetails[type].icon}"></i></span><div class="company-verification-doc-copy"><strong>${label}</strong><p>${documentDetails[type].description}</p></div><span class="company-verification-file-rules"><i class="fa-regular fa-file-lines" aria-hidden="true"></i> PDF, JPG, PNG <span></span> Maks. 5 MB</span></div>
      <label class="company-verification-dropzone" data-file-drop-zone="${type}" for="resubmit-${type}"><input id="resubmit-${type}" name="${type}" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" required><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i><span class="company-verification-drop-copy"><strong>Pilih file</strong><span data-file-name="${type}">atau seret dan lepas file di sini</span></span></label>
      <small class="company-verification-file-status" data-file-status="${type}" role="status"></small>
    </section>`,
    ).join("")}</div>
    <div class="company-verification-assurances"><span><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Data aman dan terpercaya</span><span><i class="fa-solid fa-lock" aria-hidden="true"></i> Hanya untuk proses verifikasi</span><span><i class="fa-solid fa-bolt" aria-hidden="true"></i> Proses cepat dan mudah</span></div>
    <button class="btn company-verification-submit" type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim untuk diverifikasi <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
  </form>`,
    async (data) => {
      const files = {};
      for (const [type, label] of COMPANY_DOCUMENT_TYPES) {
        const file = data.get(type);
        if (!(file instanceof File) || !file.size) {
          toast(`Pilih dokumen ${label}.`);
          return;
        }
        if (
          !["application/pdf", "image/jpeg", "image/png"].includes(file.type) &&
          !/\.pdf$|\.jpe?g$|\.png$/i.test(file.name)
        ) {
          toast(`Dokumen ${label} harus berformat PDF, JPG, atau PNG.`);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast(`Ukuran dokumen ${label} maksimal 5 MB.`);
          return;
        }
        files[type] = file;
      }
      try {
        for (const [type] of COMPANY_DOCUMENT_TYPES)
          await saveCompanyDocument(current.userId, type, files[type]);
        current.status = "pending";
        current.reviewNote = "";
        current.reviewedAt = "";
        current.uploadError = "";
        current.submittedAt = new Date().toISOString();
        current.documents = Object.fromEntries(
          COMPANY_DOCUMENT_TYPES.map(([type]) => [
            type,
            { name: files[type].name },
          ]),
        );
        current.uploadPending = Boolean(supabaseClient);
        saveCompanyVerifications([
          current,
          ...getCompanyVerifications().filter(
            (item) => item.userId !== current.userId,
          ),
        ]);
        const uploaded = await uploadCompanyVerification(current);
        if (!uploaded || current.uploadPending)
          throw new Error(
            "Pengajuan belum terkonfirmasi tersimpan di sistem. Dokumen masih tersimpan di perangkat ini.",
          );
        closeModal();
        renderAdminCompanies();
        renderCompanyVerificationState(current);
        renderCompanyDashboardOnboarding();
        toast(
          "Pengajuan diterima. Tim JobHub akan meninjau dalam 1 hari kerja.",
        );
      } catch (error) {
        current.uploadPending = true;
        current.uploadError =
          error.message ||
          "Periksa koneksi, konfigurasi bucket, dan kebijakan akses Supabase.";
        saveCompanyVerifications([
          current,
          ...getCompanyVerifications().filter(
            (item) => item.userId !== current.userId,
          ),
        ]);
        renderCompanyVerificationState(current);
        renderCompanyDashboardOnboarding();
        toast(
          `Dokumen tersimpan, tetapi pengajuan belum terkirim: ${error.message || "periksa koneksi dan coba lagi."}`,
        );
      }
    },
  );
  const modal = $("#modalBackdrop .modal");
  modal.classList.add("company-verification-modal");
  modal
    .querySelector(".modal-head")
    ?.insertAdjacentHTML(
      "afterbegin",
      '<span class="company-verification-hero-icon" aria-hidden="true"><i class="fa-solid fa-file-circle-check"></i></span>',
    );
  for (const [type] of COMPANY_DOCUMENT_TYPES) {
    const input = $(`#resubmit-${type}`);
    const card = input.closest("[data-verification-card]");
    const dropzone = card.querySelector("[data-file-drop-zone]");
    const filename = card.querySelector("[data-file-name]");
    const status = card.querySelector("[data-file-status]");
    const setFile = (file) => {
      if (!file) {
        input.setCustomValidity("");
        card.classList.remove("has-error");
        filename.textContent = "atau seret dan lepas file di sini";
        status.textContent = "";
        return;
      }
      const validType =
        ["application/pdf", "image/jpeg", "image/png"].includes(file.type) ||
        /\.(pdf|jpe?g|png)$/i.test(file.name);
      const validSize = file.size <= 5 * 1024 * 1024;
      const error = !validType
        ? "Format file harus PDF, JPG, atau PNG."
        : !validSize
          ? "Ukuran file maksimal 5 MB."
          : "";
      input.setCustomValidity(error);
      card.classList.toggle("has-error", Boolean(error));
      filename.textContent = file.name;
      status.textContent =
        error || `${(file.size / 1024 / 1024).toFixed(2)} MB · siap dikirim`;
    };
    input.addEventListener("change", () => setFile(input.files?.[0]));
    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
    dropzone.addEventListener("dragleave", (event) => {
      if (!dropzone.contains(event.relatedTarget))
        dropzone.classList.remove("is-dragging");
    });
    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
      const file = event.dataTransfer?.files?.[0];
      if (!file) return;
      const transfer = new DataTransfer();
      transfer.items.add(file);
      input.files = transfer.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  }
}
function renderAdminCompanies() {
  const table = $("#adminCompanies");
  if (!table) return;
  if (supabaseClient && !isAdminSession()) {
    table.innerHTML =
      '<tr><td colspan="5"><div class="empty-state"><strong>Akses admin diperlukan</strong>Masuk dengan akun yang memiliki role admin untuk melihat data pengajuan dan dokumen perusahaan.</div></td></tr>';
    return;
  }
  const source = adminVerificationCache ?? getCompanyVerifications();
  const records = source.filter((item) => item.status !== "verified");
  const pendingCount = records.filter(
    (item) => item.status === "pending",
  ).length;
  const verificationCount = $("#adminVerificationCount");
  const pendingBadge = $("#adminPendingCount");
  const verificationSummary = $("#adminVerificationSummary");
  if (verificationCount && (!supabaseClient || adminVerificationCache))
    verificationCount.textContent = String(pendingCount);
  if (pendingBadge) pendingBadge.textContent = String(pendingCount);
  if (verificationSummary)
    verificationSummary.textContent = `${pendingCount} menunggu · ${source.length} total · target tinjauan maksimal 1 hari kerja (akhir pekan dikecualikan)`;
  table.innerHTML = records.length
    ? records
        .map(
          (item) => `<tr>
    <td><strong>${escapeHtml(item.companyName)}</strong></td>
    <td>${escapeHtml(item.email)}</td>
    <td>${COMPANY_DOCUMENT_TYPES.map(([type, label]) => `<span class="document-status">${escapeHtml(label)} ${item.documents?.[type] ? "✓" : "—"}</span>`).join(" ")}</td>
    <td><span class="status ${item.status === "rejected" ? "rejected" : "pending"}">${item.status === "rejected" ? "Perlu perbaikan" : "Menunggu"}</span></td>
    <td>${escapeHtml(new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.submittedAt)))}</td>
    <td>${item.status === "pending" ? `<span class="${Date.now() > companyVerificationReviewDeadline(item.submittedAt).getTime() ? "status rejected" : "form-note"}">${Date.now() > companyVerificationReviewDeadline(item.submittedAt).getTime() ? "Lewat target" : "Maks. " + escapeHtml(new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(companyVerificationReviewDeadline(item.submittedAt)))}</span>` : "Selesai"}</td>
    <td><button class="text-link" type="button" data-review-company="${escapeHtml(item.userId)}">Tinjau dokumen</button></td>
  </tr>`,
        )
        .join("")
    : '<tr><td colspan="7"><div class="empty-state"><strong>Tidak ada pengajuan verifikasi</strong>Pengajuan perusahaan akan muncul setelah tiga dokumen dikirim.</div></td></tr>';
}
function companyVerificationReviewDeadline(submittedAt) {
  const deadline = new Date(submittedAt);
  deadline.setDate(deadline.getDate() + 1);
  while (deadline.getDay() === 0 || deadline.getDay() === 6)
    deadline.setDate(deadline.getDate() + 1);
  return deadline;
}
function formatDatabaseSize(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value,
    index = 0;
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }
  return `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(size)} ${units[index]}`;
}
function updateAdminClock() {
  const now = new Date();
  const time = $("#adminClockTime");
  const date = $("#adminDashboardDate");
  if (time)
    time.textContent = `${new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Jakarta" }).format(now)} WIB`;
  if (date)
    date.textContent = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(now);
}
function startAdminClock() {
  window.clearInterval(adminClockTimer);
  updateAdminClock();
  adminClockTimer = window.setInterval(updateAdminClock, 1000);
}
function renderAdminAnalytics() {
  const container = $("#adminAnalyticsChart");
  if (!container) return;
  const analytics = adminAnalyticsData;
  const period = analytics?.periods?.[adminAnalyticsPeriod];
  const series = analytics?.series?.[adminAnalyticsPeriod] || [];
  const caption = $("#adminAnalyticsCaption");
  const databaseSize = $("#adminDatabaseSize");
  if (databaseSize)
    databaseSize.textContent = formatDatabaseSize(
      analytics?.database_size_bytes,
    );
  if (!period || !series.length) {
    container.innerHTML =
      '<div class="empty-state"><strong>Statistik belum tersedia</strong>Jalankan migrasi admin-website-analytics.sql dan pastikan RPC admin dapat diakses.</div>';
    if (caption) caption.textContent = "Data analytics belum dimuat.";
    return;
  }
  const periodLabel =
    adminAnalyticsPeriod === "day"
      ? "Per jam hari ini"
      : adminAnalyticsPeriod === "month"
        ? "Per hari bulan ini"
        : "Per bulan tahun ini";
  if (caption)
    caption.textContent = `${periodLabel}: ${period.users} pengguna baru · ${period.jobs} lowongan · ${period.transactions} transaksi paket · Rp${new Intl.NumberFormat("id-ID").format(period.revenue || 0)}`;
  const maxValue = Math.max(
    1,
    ...series.flatMap((item) => [
      Number(item.users) || 0,
      Number(item.jobs) || 0,
      Number(item.sales) || 0,
    ]),
  );
  container.innerHTML = series
    .map((item) => {
      const bars = [
        ["users", item.users, "Pengguna", "bar-users"],
        ["jobs", item.jobs, "Lowongan", "bar-jobs"],
        ["sales", item.sales, "Transaksi", "bar-sales"],
      ];
      return `<div class="admin-chart-column" title="${escapeHtml(item.label)}"><div class="admin-chart-bars">${bars.map(([key, value, label, className]) => `<span class="${className}" style="height:${Math.max(Number(value) > 0 ? 3 : 0, ((Number(value) || 0) / maxValue) * 100)}%" aria-label="${label}: ${Number(value) || 0}"></span>`).join("")}</div><small>${escapeHtml(item.label)}</small></div>`;
    })
    .join("");
}
function renderAdminSiteImageLibrary(siteImages = {}) {
  const panel = $("#adminMediaPanel");
  const container = $("#adminSiteImageLibrary");
  if (!panel || !container) return;
  const groups = [
    ...new Set(ADMIN_SITE_IMAGE_ASSETS.map((asset) => asset.group)),
  ];
  container.innerHTML = `<form id="adminSiteImageForm"><div class="admin-site-image-groups">${groups
    .map((group) => {
      const assets = ADMIN_SITE_IMAGE_ASSETS.filter(
        (asset) => asset.group === group,
      );
      const folder = assets[0]?.folder || "site-images";
      return `<fieldset class="admin-site-image-group"><legend>${escapeHtml(group)}<small>Folder: <code>site-images/${escapeHtml(folder)}/</code></small></legend><div class="admin-site-image-grid">${assets
        .map((asset) => {
          const url = String(siteImages?.[asset.key] || "");
          const objectPath = `site-images/${escapeHtml(asset.folder)}/${escapeHtml(asset.key)}.{jpg|png|webp}`;
          return `<label class="admin-site-image-slot"><strong>${escapeHtml(asset.label)}</strong><img data-site-image-preview="${asset.key}" src="${escapeHtml(url)}" alt="Pratinjau ${escapeHtml(asset.label)}" ${url ? "" : "hidden"}><span class="admin-site-image-empty" data-site-image-empty="${asset.key}" ${url ? "hidden" : ""}>Belum diatur</span><input type="file" name="${asset.key}" data-site-image-upload="${asset.key}" accept="image/jpeg,image/png,image/webp"><small>Path: <code>${objectPath}</code> · maks. 8 MB</small></label>`;
        })
        .join("")}</div></fieldset>`;
    })
    .join(
      "",
    )}</div><div class="admin-branding-submit"><p id="adminSiteImageStatus" role="status">Aset gambar disimpan di Supabase, bukan local storage.</p><button class="btn" type="submit"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Simpan gambar website</button></div></form>`;
}
function applyWebsiteBranding(settings = {}) {
  websiteBrandingCache = settings;
  const logoUrl = settings.logo_url || "";
  const bannerUrl = settings.banner_url || "";
  $$("[data-site-brand-logo]").forEach((image) => {
    image.hidden = !logoUrl;
    if (logoUrl) image.src = logoUrl;
    else image.removeAttribute("src");
  });
  $$("[data-site-home-banner]").forEach((image) => {
    image.hidden = !bannerUrl;
    if (bannerUrl) image.src = bannerUrl;
    else image.removeAttribute("src");
  });
  const dashboardHeader = settings.site_images?.companyDashboardHeader || "";
  if (dashboardHeader)
    document.documentElement.style.setProperty(
      "--company-dashboard-header-image",
      `url("${dashboardHeader.replace(/["\\]/g, "")}")`,
    );
  else
    document.documentElement.style.removeProperty(
      "--company-dashboard-header-image",
    );
  const rantauHero =
    settings.site_images?.rantauHero || "assets/jobhub-rantau-illustration.svg";
  document.documentElement.style.setProperty(
    "--rantau-hero-image",
    `url("${rantauHero.replace(/["\\]/g, "")}")`,
  );
  $$("[data-site-image]").forEach((image) => {
    const url = String(
      settings.site_images?.[image.dataset.siteImage] ||
        image.dataset.siteImageFallback ||
        "",
    );
    image.hidden = !url;
    if (url) image.src = url;
    else image.removeAttribute("src");
  });
  const logoPreview = $("#adminLogoPreview");
  const bannerPreview = $("#adminBannerPreview");
  const companyDirectoryBannerUrl = settings.company_directory_banner_url || "";
  const companyDirectoryBanner = $("#companyDirectoryBannerImage");
  const companyDirectoryBannerPreview = $(
    "#adminCompanyDirectoryBannerPreview",
  );
  const companyDirectoryBannerEmpty = $("#adminCompanyDirectoryBannerEmpty");
  if (logoPreview) {
    logoPreview.hidden = !logoUrl;
    if (logoUrl) logoPreview.src = logoUrl;
    else logoPreview.removeAttribute("src");
  }
  if (bannerPreview) {
    bannerPreview.hidden = !bannerUrl;
    if (bannerUrl) bannerPreview.src = bannerUrl;
    else bannerPreview.removeAttribute("src");
  }
  if (companyDirectoryBanner) {
    companyDirectoryBanner.hidden = !companyDirectoryBannerUrl;
    if (companyDirectoryBannerUrl)
      companyDirectoryBanner.src = companyDirectoryBannerUrl;
    else companyDirectoryBanner.removeAttribute("src");
  }
  if (companyDirectoryBannerPreview) {
    companyDirectoryBannerPreview.hidden = !companyDirectoryBannerUrl;
    if (companyDirectoryBannerUrl)
      companyDirectoryBannerPreview.src = companyDirectoryBannerUrl;
    else companyDirectoryBannerPreview.removeAttribute("src");
  }
  if (companyDirectoryBannerEmpty)
    companyDirectoryBannerEmpty.hidden = Boolean(companyDirectoryBannerUrl);
  if (isAdminSession()) renderAdminSiteImageLibrary(settings.site_images || {});
}
async function loadWebsiteBranding() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("website_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();
  if (error) {
    console.warn("Website branding settings unavailable:", error.message);
    return;
  }
  applyWebsiteBranding(data || {});
  if (websiteBrandingChannel)
    await supabaseClient.removeChannel(websiteBrandingChannel);
  websiteBrandingChannel = supabaseClient
    .channel("website-settings-live")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "website_settings",
        filter: "id=eq.main",
      },
      (payload) => {
        if (payload.eventType === "DELETE") applyWebsiteBranding({});
        else applyWebsiteBranding(payload.new || {});
      },
    )
    .subscribe();
  async function loadCompanyPackageCatalog() {
    if (!supabaseClient) return;
    const { data, error } = await supabaseClient
      .from("website_settings")
      .select("package_catalog")
      .eq("id", "main")
      .maybeSingle();
    if (error) {
      console.warn("Company package catalog unavailable:", error.message);
      return;
    }
    if (Array.isArray(data?.package_catalog))
      normalizeCompanyPackageCatalog(data.package_catalog);
    renderPricing();
  }
  function renderAdminPackageEditor() {
    const container = $("#adminPackageEditor");
    if (!container) return;
    container.innerHTML = `<form id="adminPackageForm" class="admin-package-form"><div class="admin-package-grid">${plans
      .map(
        (plan, index) =>
          `<fieldset class="admin-package-config" data-package-index="${index}"><legend>${escapeHtml(plan.name)}</legend><label>Harga (Rupiah)<input name="price-${index}" type="number" min="0" step="1000" value="${plan.price}" required></label><label>Masa aktif (hari)<input name="duration-${index}" type="number" min="1" max="3650" value="${plan.durationDays}" required></label><label>Lowongan aktif<input name="jobs-${index}" type="number" min="1" value="${Number.isFinite(plan.activeJobs) ? plan.activeJobs : ""}" placeholder="Tanpa batas"></label><label>Batas kandidat<input name="candidates-${index}" type="number" min="1" value="${Number.isFinite(plan.candidateLimit) ? plan.candidateLimit : ""}" placeholder="Tanpa batas"></label><label class="admin-package-wide">Deskripsi<textarea name="note-${index}" maxlength="300" rows="2" required>${escapeHtml(plan.note)}</textarea></label><label class="admin-package-wide">Rincian paket<textarea name="items-${index}" maxlength="2000" rows="4" required>${escapeHtml(plan.items.join("\n"))}</textarea></label><div class="admin-package-features">${Object.entries(
            plan.features,
          )
            .map(
              ([feature, enabled]) =>
                `<label><input name="${feature}-${index}" type="checkbox" ${enabled ? "checked" : ""}> ${feature === "talentPool" ? "Talent Pool" : feature === "cvAnalyzer" ? "CV Analyzer" : "Analitik rekrutmen"}</label>`,
            )
            .join(
              "",
            )}</div><label class="admin-package-featured"><input name="featured-${index}" type="checkbox" ${plan.featured ? "checked" : ""}> Tandai sebagai paket unggulan</label></fieldset>`,
      )
      .join(
        "",
      )}</div><div class="admin-package-actions"><p id="adminPackageStatus" role="status">Paket dibaca dari katalog Supabase. Kunci nama paket tetap agar subscription dan checkout yang sudah ada tidak terputus.</p><button class="btn" type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan konfigurasi paket</button></div></form>`;
  }
  async function loadAdminPackages() {
    const container = $("#adminPackageEditor");
    if (!container || !isAdminSession()) return;
    container.innerHTML = loadingIndicator("Memuat konfigurasi paket...");
    const { data, error } = await supabaseClient
      .from("website_settings")
      .select("package_catalog")
      .eq("id", "main")
      .single();
    if (error) throw error;
    if (Array.isArray(data?.package_catalog))
      normalizeCompanyPackageCatalog(data.package_catalog);
    renderAdminPackageEditor();
  }
  async function saveAdminPackages(form) {
    if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
    const updated = plans.map((plan, index) => {
      const value = (name) => form.elements.namedItem(`${name}-${index}`);
      const unlimitedLimit = (field) =>
        String(value(field).value).trim()
          ? Math.max(1, Math.floor(Number(value(field).value) || 1))
          : Infinity;
      return {
        ...plan,
        price: Math.max(0, Math.floor(Number(value("price").value) || 0)),
        durationDays: Math.min(
          3650,
          Math.max(1, Math.floor(Number(value("duration").value) || 30)),
        ),
        activeJobs: unlimitedLimit("jobs"),
        postedJobs: unlimitedLimit("jobs"),
        candidateLimit: unlimitedLimit("candidates"),
        note: String(value("note").value).trim().slice(0, 300),
        items: String(value("items").value)
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean)
          .slice(0, 12),
        features: Object.fromEntries(
          Object.keys(plan.features).map((feature) => [
            feature,
            value(feature).checked,
          ]),
        ),
        featured: value("featured").checked,
      };
    });
    const packageCatalog = updated.map((plan) => ({
      ...plan,
      activeJobs: Number.isFinite(plan.activeJobs) ? plan.activeJobs : null,
      postedJobs: Number.isFinite(plan.postedJobs) ? plan.postedJobs : null,
      candidateLimit: Number.isFinite(plan.candidateLimit)
        ? plan.candidateLimit
        : null,
    }));
    const { error } = await supabaseClient
      .from("website_settings")
      .update({
        package_catalog: packageCatalog,
        updated_at: new Date().toISOString(),
        updated_by: supabaseSession.user.id,
      })
      .eq("id", "main");
    if (error) throw error;
    normalizeCompanyPackageCatalog(packageCatalog);
    renderAdminPackageEditor();
    renderPricing();
    const status = $("#adminPackageStatus");
    if (status) status.textContent = "Konfigurasi paket berhasil disimpan.";
  }
}
async function saveAdminWebsiteBranding(form) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const status = $("#adminBrandingStatus");
  const data = new FormData(form);
  const updates = {};
  for (const [field, fieldName, maxSize] of [
    ["logo", "logo", 5 * 1024 * 1024],
    ["banner", "banner", 8 * 1024 * 1024],
    ["companyDirectoryBanner", "banner fitur perusahaan", 8 * 1024 * 1024],
  ]) {
    const file = data.get(field);
    if (!(file instanceof File) || !file.size) continue;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      throw new Error(`${fieldName} harus JPG, PNG, atau WEBP.`);
    if (file.size > maxSize)
      throw new Error(
        `${fieldName} melebihi batas ukuran ${maxSize / 1024 / 1024} MB.`,
      );
    const extension =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `branding/${field}.${extension}`;
    const { error: uploadError } = await supabaseClient.storage
      .from("website-assets")
      .upload(objectPath, file, { contentType: file.type, upsert: true });
    if (uploadError) throw uploadError;
    const url = supabaseClient.storage
      .from("website-assets")
      .getPublicUrl(objectPath).data.publicUrl;
    const settingName =
      field === "logo"
        ? "logo_url"
        : field === "banner"
          ? "banner_url"
          : "company_directory_banner_url";
    updates[settingName] = `${url}?v=${Date.now()}`;
  }
  if (!Object.keys(updates).length)
    throw new Error("Pilih logo atau banner baru sebelum menyimpan.");
  const { data: updated, error } = await supabaseClient
    .from("website_settings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: supabaseSession.user.id,
    })
    .eq("id", "main")
    .select("*")
    .single();
  if (error) throw error;
  applyWebsiteBranding({ ...websiteBrandingCache, ...updated });
  if (status)
    status.textContent = "Logo dan banner berhasil disimpan ke Supabase.";
}
async function saveAdminSiteImages(form) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const status = $("#adminSiteImageStatus");
  if (status)
    status.textContent = "Memeriksa koneksi dan pengaturan Supabase...";
  const { data: adminAllowed, error: adminCheckError } =
    await supabaseClient.rpc("is_jobhub_admin");
  if (adminCheckError)
    throw new Error(
      `Role admin Supabase belum dapat diverifikasi. Pastikan migration admin aktif. Detail: ${adminCheckError.message}`,
    );
  if (!adminAllowed)
    throw new Error(
      "Sesi Supabase belum memiliki role admin. Jalankan supabase/admin-email-role.sql, lalu keluar dan masuk kembali.",
    );
  const { error: schemaError } = await supabaseClient
    .from("website_settings")
    .select("site_images")
    .eq("id", "main")
    .maybeSingle();
  if (schemaError)
    throw new Error(
      `Kolom site_images belum tersedia. Jalankan migration supabase/admin-site-image-library.sql. Detail: ${schemaError.message}`,
    );
  const formData = new FormData(form);
  const uploads = ADMIN_SITE_IMAGE_ASSETS.map(async (asset) => {
    const file = formData.get(asset.key);
    if (!(file instanceof File) || !file.size) return null;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
      throw new Error(`${asset.label} harus JPG, PNG, atau WEBP.`);
    if (file.size > 8 * 1024 * 1024)
      throw new Error(`${asset.label} melebihi batas ukuran 8 MB.`);
    const extension =
      file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const objectPath = `site-images/${asset.folder}/${asset.key}.${extension}`;
    const { error } = await supabaseClient.storage
      .from("website-assets")
      .upload(objectPath, file, { contentType: file.type, upsert: true });
    if (error) throw error;
    return [
      asset.key,
      `${supabaseClient.storage.from("website-assets").getPublicUrl(objectPath).data.publicUrl}?v=${Date.now()}`,
    ];
  });
  const uploaded = (await Promise.all(uploads)).filter(Boolean);
  if (!uploaded.length)
    throw new Error("Pilih setidaknya satu gambar untuk diunggah.");
  if (status)
    status.textContent = `${uploaded.length} file terunggah. Menyimpan pengaturan gambar...`;
  const siteImages = {
    ...(websiteBrandingCache?.site_images || {}),
    ...Object.fromEntries(uploaded),
  };
  const { data, error } = await supabaseClient
    .from("website_settings")
    .update({
      site_images: siteImages,
      updated_at: new Date().toISOString(),
      updated_by: supabaseSession.user.id,
    })
    .eq("id", "main")
    .select("*")
    .single();
  if (error) throw error;
  applyWebsiteBranding({ ...websiteBrandingCache, ...data });
  const savedStatus = $("#adminSiteImageStatus");
  if (savedStatus)
    savedStatus.textContent = `${uploaded.length} gambar berhasil disimpan dan siap dipublikasikan.`;
}
async function loadAdminSiteImages() {
  if (!supabaseClient || !isAdminSession()) return;
  const container = $("#adminSiteImageLibrary");
  if (container)
    container.innerHTML = loadingIndicator("Memuat folder media...");
  const { data, error } = await supabaseClient
    .from("website_settings")
    .select("site_images")
    .eq("id", "main")
    .maybeSingle();
  if (error) throw error;
  renderAdminSiteImageLibrary(data?.site_images || {});
}
async function loadAdminDashboardStats() {
  if (!supabaseClient || !isAdminSession()) return;
  const signedInEmail = $("#adminSignedInEmail");
  if (signedInEmail)
    signedInEmail.textContent = supabaseSession?.user?.email || "Admin";
  startAdminClock();
  const metrics = [
    ["adminCandidateCount", "candidate_posts"],
    ["adminCompanyCount", "jobhub_company_profile_details"],
    ["adminJobCount", "jobhub_jobs"],
  ];
  await Promise.all(
    metrics.map(async ([id, table]) => {
      const element = $(`#${id}`);
      if (!element) return;
      const { count, error } = await supabaseClient
        .from(table)
        .select(table === "candidate_posts" ? "id" : "*", {
          count: "exact",
          head: true,
        });
      element.textContent = error
        ? "—"
        : new Intl.NumberFormat("id-ID").format(count || 0);
    }),
  );
  const { count, error } = await supabaseClient
    .from("jobhub_company_verifications")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");
  const value = error ? "—" : new Intl.NumberFormat("id-ID").format(count || 0);
  const verificationCount = $("#adminVerificationCount");
  if (verificationCount) verificationCount.textContent = value;
  const pendingBadge = $("#adminPendingCount");
  if (pendingBadge) pendingBadge.textContent = value;
  const verificationSummary = $("#adminVerificationSummary");
  if (verificationSummary)
    verificationSummary.textContent = error
      ? "Jumlah pengajuan belum dapat dimuat."
      : `${value} pengajuan menunggu pemeriksaan admin.`;
  const { data: analytics, error: analyticsError } = await supabaseClient.rpc(
    "admin_dashboard_analytics",
  );
  adminAnalyticsData = analyticsError ? null : analytics;
  const adminUserCount = $("#adminUserCount");
  if (adminUserCount)
    adminUserCount.textContent = analyticsError
      ? "—"
      : new Intl.NumberFormat("id-ID").format(
          Number(analytics?.registered_users) || 0,
        );
  renderAdminAnalytics();
}
function renderAdminJobs() {
  const table = $("#adminJobsTable");
  if (!table) return;
  const query = String($("#adminJobsSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const status = $("#adminJobsStatus")?.value || "all";
  const rows = adminJobsCache.filter((row) => {
    const job = row.data || {};
    const matchesQuery =
      !query ||
      `${job.title || ""} ${job.company || ""}`
        .toLocaleLowerCase("id-ID")
        .includes(query);
    return matchesQuery && (status === "all" || row.status === status);
  });
  table.innerHTML = rows.length
    ? rows
        .map((row) => {
          const job = row.data || {};
          const title = job.title || "Lowongan tanpa judul";
          const company = job.company || row.company_id || "Perusahaan";
          const posted = row.posted_at
            ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                new Date(row.posted_at),
              )
            : "—";
          const nextStatus = row.status === "active" ? "closed" : "active";
          const actionLabel = row.status === "active" ? "Tutup" : "Aktifkan";
          return `<tr><td><strong>${escapeHtml(title)}</strong></td><td>${escapeHtml(company)}</td><td><span class="status ${row.status === "active" ? "" : "pending"}">${escapeHtml(row.status || "draft")}</span></td><td>${escapeHtml(posted)}</td><td><div class="admin-row-actions"><button class="btn btn-outline btn-small" type="button" data-admin-job-action="${nextStatus}" data-admin-job-id="${escapeHtml(row.id)}">${actionLabel}</button><button class="btn btn-outline btn-small" type="button" data-admin-job-action="delete" data-admin-job-id="${escapeHtml(row.id)}" aria-label="Hapus ${escapeHtml(title)}"><i class="fa-solid fa-trash" aria-hidden="true"></i></button></div></td></tr>`;
        })
        .join("")
    : '<tr><td colspan="5"><div class="empty-state"><strong>Tidak ada lowongan</strong>Belum ada data lowongan yang cocok dengan filter.</div></td></tr>';
}
async function loadAdminJobs() {
  const table = $("#adminJobsTable");
  if (!table || !isAdminSession()) return;
  table.innerHTML = '<tr><td colspan="5">Memuat lowongan...</td></tr>';
  const { data, error } = await supabaseClient
    .from("jobhub_jobs")
    .select("id,company_id,status,urgent,posted_at,data")
    .order("posted_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  adminJobsCache = data || [];
  renderAdminJobs();
}
async function loadAdminCompaniesDirectory() {
  const table = $("#adminCompaniesDirectory");
  if (!table || !isAdminSession()) return;
  table.innerHTML = '<tr><td colspan="5">Memuat perusahaan...</td></tr>';
  const [registered, details, verifications] = await Promise.all([
    supabaseClient
      .from("jobhub_company_profiles")
      .select(
        "company_id,company_name,is_verified,is_featured_directory,is_directory_visible",
      )
      .limit(500),
    supabaseClient
      .from("jobhub_company_profile_details")
      .select("company_id,company_name,industry,regency_name,province_name")
      .limit(500),
    supabaseClient
      .from("jobhub_company_verifications")
      .select("company_id,company_name,status")
      .limit(500),
  ]);
  const queryError = registered.error || details.error || verifications.error;
  if (queryError) throw queryError;
  const companies = new Map();
  (details.data || []).forEach((company) =>
    companies.set(company.company_id, { ...company, is_verified: false }),
  );
  (registered.data || []).forEach((company) =>
    companies.set(company.company_id, {
      ...companies.get(company.company_id),
      ...company,
    }),
  );
  (verifications.data || []).forEach((company) => {
    const existing = companies.get(company.company_id) || {
      company_id: company.company_id,
      company_name: company.company_name,
      is_verified: false,
    };
    companies.set(company.company_id, {
      ...existing,
      verification_status: company.status,
    });
  });
  adminCompaniesCache = [...companies.values()].sort(
    (a, b) =>
      Number(Boolean(b.is_directory_visible)) -
        Number(Boolean(a.is_directory_visible)) ||
      Number(Boolean(b.is_featured_directory)) -
        Number(Boolean(a.is_featured_directory)) ||
      String(a.company_name || "").localeCompare(
        String(b.company_name || ""),
        "id",
      ),
  );
  table.innerHTML = adminCompaniesCache.length
    ? adminCompaniesCache
        .map(
          (company) =>
            `<tr><td><strong>${escapeHtml(company.company_name || "Perusahaan")}</strong></td><td>${escapeHtml(company.company_id || "")}</td><td><span class="status ${company.is_verified ? "" : "pending"}">${company.is_verified ? "Terverifikasi" : "Belum terverifikasi"}</span></td><td><button class="btn btn-outline btn-small" type="button" data-company-directory-featured="${escapeHtml(company.company_id)}" data-featured="${company.is_featured_directory ? "true" : "false"}"><i class="fa-${company.is_featured_directory ? "solid" : "regular"} fa-star" aria-hidden="true"></i> ${company.is_featured_directory ? "Unggulan" : "Jadikan unggulan"}</button><button class="btn btn-outline btn-small" type="button" data-company-directory-visibility="${escapeHtml(company.company_id)}" data-visible="${company.is_directory_visible ? "true" : "false"}"><i class="fa-solid ${company.is_directory_visible ? "fa-eye-slash" : "fa-eye"}" aria-hidden="true"></i> ${company.is_directory_visible ? "Sembunyikan" : "Tampilkan"}</button></td><td><button class="text-link" type="button" data-admin-section="verifications">Lihat pengajuan</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5"><div class="empty-state"><strong>Belum ada perusahaan</strong>Profil perusahaan akan tampil setelah terdaftar.</div></td></tr>';
}
async function migrateCandidateCvBatch(button) {
  if (!isAdminSession()) {
    toast("Hanya admin yang dapat memindahkan CV lama.");
    return;
  }
  const status = $("#adminCandidateCvMigrationStatus");
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  if (status) status.textContent = "Memindahkan CV lama ke bucket privat...";
  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "candidate-cv-migration",
      { body: { batchSize: 5 } },
    );
    if (error) throw error;
    const pendingDeletes = Array.isArray(data?.legacyObjectsPendingDeletion)
      ? data.legacyObjectsPendingDeletion
      : [];
    if (status)
      status.textContent = `${Number(data?.migrated) || 0} CV dipindahkan; ${Number(data?.failed) || 0} gagal${pendingDeletes.length ? `; file publik belum terhapus: ${pendingDeletes.join(", ")}` : ""}${data?.hasMore ? ". Tekan tombol lagi untuk batch berikutnya." : ". Tidak ada CV publik tersisa."}`;
    if (!data?.hasMore) {
      button.disabled = true;
      button.textContent = "Migrasi selesai";
      return;
    }
  } catch (error) {
    if (status)
      status.textContent = `Migrasi belum selesai: ${error.message || "periksa Edge Function dan izin admin."}`;
    toast(
      `CV lama belum dapat diamankan: ${error.message || "deploy Edge Function candidate-cv-migration."}`,
    );
  } finally {
    if (button.isConnected && button.textContent !== "Migrasi selesai") {
      button.disabled = false;
      button.removeAttribute("aria-busy");
    }
  }
}
function renderAdminCandidates() {
  const table = $("#adminCandidatesTable");
  if (!table) return;
  const toolbar = $("#adminCandidatesPanel .admin-table-toolbar");
  if (toolbar && !toolbar.querySelector("[data-migrate-candidate-cvs]")) {
    toolbar.insertAdjacentHTML(
      "beforeend",
      '<button class="btn btn-outline btn-small" type="button" data-migrate-candidate-cvs><i class="fa-solid fa-lock" aria-hidden="true"></i> Amankan CV lama</button><span class="form-note" id="adminCandidateCvMigrationStatus" role="status" aria-live="polite"></span>',
    );
  }
  const query = String($("#adminCandidatesSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const visibility = $("#adminCandidatesVisibility")?.value || "all";
  const rows = adminCandidatesCache.filter((candidate) => {
    const matchesQuery =
      !query ||
      `${candidate.full_name || ""} ${candidate.main_position || ""} ${candidate.location || ""}`
        .toLocaleLowerCase("id-ID")
        .includes(query);
    const matchesVisibility =
      visibility === "all" ||
      (visibility === "published" && candidate.is_published) ||
      (visibility === "hidden" && !candidate.is_published);
    return matchesQuery && matchesVisibility;
  });
  table.innerHTML = rows.length
    ? rows
        .map(
          (candidate) =>
            `<tr><td><strong>${escapeHtml(candidate.full_name || "Kandidat")}</strong></td><td>${escapeHtml(candidate.main_position || "—")}</td><td>${escapeHtml(candidate.location || "—")}</td><td><span class="status ${candidate.is_published ? "" : "pending"}">${candidate.is_published ? "Publik" : "Disembunyikan"}</span></td><td><button class="btn btn-outline btn-small" type="button" data-admin-candidate-toggle="${escapeHtml(candidate.id)}" data-published="${candidate.is_published ? "true" : "false"}">${candidate.is_published ? "Sembunyikan" : "Publikasikan"}</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5"><div class="empty-state"><strong>Tidak ada kandidat</strong>Tidak ada profil yang cocok dengan filter.</div></td></tr>';
}
async function loadAdminCandidates() {
  const table = $("#adminCandidatesTable");
  if (!table || !isAdminSession()) return;
  table.innerHTML = '<tr><td colspan="5">Memuat kandidat...</td></tr>';
  const { data, error } = await supabaseClient
    .from("candidate_posts")
    .select(
      "id,user_id,full_name,main_position,location,is_published,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  adminCandidatesCache = data || [];
  renderAdminCandidates();
}
async function loadAdminCertifications() {
  const container = $("#adminCandidateCertifications");
  if (!container || !isAdminSession()) return;
  container.innerHTML =
    '<p class="form-note">Memuat pengajuan sertifikat...</p>';
  const { data, error } = await supabaseClient
    .from("candidate_certifications")
    .select("id,candidate_post_id,user_id,certificate_type,created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!data?.length) {
    container.innerHTML =
      '<div class="empty-state"><strong>Tidak ada pengajuan sertifikat</strong>Pengajuan baru akan muncul di sini.</div>';
    return;
  }
  const ids = [...new Set(data.map((item) => item.candidate_post_id))];
  const { data: profiles, error: profileError } = await supabaseClient
    .from("candidate_posts")
    .select("id,full_name,main_position")
    .in("id", ids);
  if (profileError) throw profileError;
  const names = new Map(
    (profiles || []).map((profile) => [profile.id, profile]),
  );
  container.innerHTML = data
    .map((item) => {
      const profile = names.get(item.candidate_post_id) || {};
      return `<article class="admin-certification-row"><div><strong>${escapeHtml(profile.full_name || "Kandidat")}</strong><p>${escapeHtml(item.certificate_type || "Sertifikat")} · ${escapeHtml(profile.main_position || "")}</p></div><div class="admin-row-actions"><button class="btn btn-outline btn-small" type="button" data-cert-review="view" data-cert-id="${escapeHtml(item.id)}">Lihat dokumen</button><button class="btn btn-small" type="button" data-cert-review="approve" data-cert-id="${escapeHtml(item.id)}" data-post-id="${escapeHtml(item.candidate_post_id)}">Setujui</button><button class="btn btn-outline btn-small" type="button" data-cert-review="reject" data-cert-id="${escapeHtml(item.id)}">Tolak</button></div></article>`;
    })
    .join("");
}
async function loadAdminSpotlightPosts() {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const container = $("#adminSpotlightPosts");
  if (!container) return;
  container.innerHTML =
    '<p class="form-note">Memuat pengajuan Spotlight...</p>';
  const { data, error } = await supabaseClient
    .from("featured_candidates")
    .select("candidate_post_id,user_id,created_at,status")
    .eq("status", "pending_verification")
    .order("created_at", { ascending: true });
  if (error) throw error;
  if (!data?.length) {
    container.innerHTML =
      '<div class="empty-state"><strong>Tidak ada pengajuan Spotlight</strong>Pengajuan baru akan muncul di sini untuk ditinjau.</div>';
    return;
  }
  const postIds = [...new Set(data.map((item) => item.candidate_post_id))];
  const { data: profiles, error: profileError } = await supabaseClient
    .from("candidate_posts")
    .select("id,full_name,main_position,category,public_data")
    .in("id", postIds);
  if (profileError) throw profileError;
  const profileById = new Map(
    (profiles || []).map((profile) => [String(profile.id), profile]),
  );
  container.innerHTML = data
    .map((item) => {
      const profile = profileById.get(String(item.candidate_post_id)) || {};
      const spotlight = profile.public_data?.spotlight || {};
      return `<article class="admin-certification-row"><div><strong>${escapeHtml(profile.full_name || "Kandidat")}</strong><p>${escapeHtml(spotlight.title || profile.main_position || "Profil talent")} · ${escapeHtml(profile.category || "Kategori belum dipilih")} · ${escapeHtml(new Date(item.created_at).toLocaleDateString("id-ID"))}</p><small>${escapeHtml(spotlight.summary || "")}</small></div><div class="admin-row-actions"><button class="btn btn-small" type="button" data-featured-review="approve" data-post-id="${escapeHtml(item.candidate_post_id)}">Setujui &amp; publikasikan</button><button class="btn btn-outline btn-small" type="button" data-featured-review="reject" data-post-id="${escapeHtml(item.candidate_post_id)}">Tolak</button></div></article>`;
    })
    .join("");
}
async function loadAdminBilling() {
  const table = $("#adminBillingTable");
  if (!table || !isAdminSession()) return;
  table.innerHTML = '<tr><td colspan="5">Memuat subscription...</td></tr>';
  const { data, error } = await supabaseClient
    .from("subscriptions")
    .select("id,company_id,package,status,start_date,expired_date")
    .order("start_date", { ascending: false })
    .limit(500);
  if (error) throw error;
  const companyIds = [
    ...new Set((data || []).map((item) => item.company_id).filter(Boolean)),
  ];
  let companyNames = new Map();
  if (companyIds.length) {
    const { data: companies, error: companyError } = await supabaseClient
      .from("jobhub_company_profiles")
      .select("company_id,company_name")
      .in("company_id", companyIds);
    if (companyError) throw companyError;
    companyNames = new Map(
      (companies || []).map((company) => [
        company.company_id,
        company.company_name,
      ]),
    );
  }
  table.innerHTML = data?.length
    ? data
        .map(
          (item) =>
            `<tr><td>${escapeHtml(companyNames.get(item.company_id) || item.company_id)}</td><td>${escapeHtml(item.package || "—")}</td><td><span class="status ${item.status === "active" ? "" : "pending"}">${escapeHtml(item.status || "—")}</span></td><td>${escapeHtml(item.start_date ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.start_date)) : "—")}</td><td>${escapeHtml(item.expired_date ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(new Date(item.expired_date)) : "—")}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5"><div class="empty-state"><strong>Belum ada pembayaran</strong>Subscription yang dikonfirmasi server akan tampil di sini.</div></td></tr>';
}
function renderAdminUsers() {
  const table = $("#adminUsersTable");
  if (!table) return;
  const query = String($("#adminUsersSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const users = adminUsersCache.filter((user) =>
    String(user.email || "")
      .toLocaleLowerCase("id-ID")
      .includes(query),
  );
  table.innerHTML = users.length
    ? users
        .map((user) => {
          const banned = Boolean(
            user.banned_until && new Date(user.banned_until) > new Date(),
          );
          const created = user.created_at
            ? new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
                new Date(user.created_at),
              )
            : "—";
          const accountType =
            user.account_type === "company"
              ? "Perusahaan"
              : user.account_type === "candidate"
                ? "Kandidat"
                : "—";
          const isAdmin = user.role === "admin";
          return `<tr><td><strong>${escapeHtml(user.email || "Email tidak tersedia")}</strong>${user.email_confirmed_at ? "" : '<small class="admin-user-unconfirmed">Email belum dikonfirmasi</small>'}</td><td>${accountType}</td><td>${escapeHtml(user.role || "user")}</td><td>${escapeHtml(created)}</td><td><span class="status ${banned ? "rejected" : ""}">${banned ? "Diblokir" : "Aktif"}</span></td><td>${isAdmin ? '<span class="form-note">Admin dilindungi</span>' : `<button class="btn btn-outline btn-small" type="button" data-admin-user-toggle="${escapeHtml(user.id)}" data-banned="${banned ? "true" : "false"}">${banned ? "Buka blokir" : "Blokir"}</button>`}</td></tr>`;
        })
        .join("")
    : '<tr><td colspan="6"><div class="empty-state"><strong>Tidak ada pengguna</strong>Tidak ada akun yang cocok dengan pencarian ini.</div></td></tr>';
  const first = adminUserTotal ? (adminUserPage - 1) * 50 + 1 : 0;
  const last = Math.min(adminUserPage * 50, adminUserTotal);
  $("#adminUsersSummary").textContent =
    `Menampilkan ${first}–${last} dari ${adminUserTotal} akun`;
  $("#adminUsersPageLabel").textContent = `Halaman ${adminUserPage}`;
  $("#adminUsersPrevious").disabled = adminUserPage <= 1;
  $("#adminUsersNext").disabled = last >= adminUserTotal;
}
async function loadAdminUsers(page = adminUserPage) {
  const table = $("#adminUsersTable");
  if (!table || !isAdminSession()) return;
  table.innerHTML = '<tr><td colspan="6">Memuat pengguna...</td></tr>';
  const { data, error } = await supabaseClient.functions.invoke(
    "admin-user-management",
    { body: { action: "list", page, perPage: 50 } },
  );
  if (error) throw error;
  adminUserPage = Number(data?.page) || page;
  adminUserTotal = Number(data?.total) || 0;
  adminUsersCache = data?.users || [];
  renderAdminUsers();
}
async function setAdminUserBlocked(userId, banned) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const { error } = await supabaseClient.functions.invoke(
    "admin-user-management",
    { body: { action: "set-ban", userId, banned } },
  );
  if (error) throw error;
  await loadAdminUsers();
  toast(banned ? "Akun pengguna diblokir." : "Blokir akun pengguna dibuka.");
}
async function loadAdminSection(section) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  if (section === "dashboard") return loadAdminDashboardStats();
  if (section === "media") return loadAdminSiteImages();
  if (section === "verifications") return loadCompanyVerifications();
  if (section === "jobs") return loadAdminJobs();
  if (section === "companies") return loadAdminCompaniesDirectory();
  if (section === "candidates") return loadAdminCandidates();
  if (section === "certifications")
    return Promise.all([loadAdminCertifications(), loadAdminSpotlightPosts()]);
  if (section === "billing")
    return Promise.all([loadAdminBilling(), loadAdminPackages()]);
  if (section === "users") return loadAdminUsers();
}
async function handleAdminJobAction(jobId, action) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  if (
    action === "delete" &&
    !window.confirm("Hapus lowongan ini secara permanen?")
  )
    return;
  const result =
    action === "delete"
      ? await supabaseClient.from("jobhub_jobs").delete().eq("id", jobId)
      : await supabaseClient
          .from("jobhub_jobs")
          .update({ status: action })
          .eq("id", jobId);
  if (result.error) throw result.error;
  await Promise.all([
    loadAdminJobs(),
    loadAdminDashboardStats(),
    loadPublishedCompanyJobs(),
  ]);
  toast(
    action === "delete"
      ? "Lowongan dihapus."
      : `Status lowongan diubah menjadi ${action}.`,
  );
}
async function handleAdminCandidateToggle(postId, published) {
  if (!isAdminSession()) throw new Error("Role admin aktif diperlukan.");
  const { error } = await supabaseClient
    .from("candidate_posts")
    .update({ is_published: !published })
    .eq("id", postId);
  if (error) throw error;
  await Promise.all([
    loadAdminCandidates(),
    loadAdminDashboardStats(),
    loadPublishedCandidateProfiles(),
  ]);
  toast(
    published
      ? "Profil kandidat disembunyikan."
      : "Profil kandidat dipublikasikan.",
  );
}
async function reviewCompanyVerification(userId) {
  const source = adminVerificationCache ?? getCompanyVerifications();
  const item = source.find((record) => record.userId === userId);
  if (!item) {
    toast("Pengajuan verifikasi tidak ditemukan.");
    return;
  }
  const documentLinks = [];
  for (const [type, label] of COMPANY_DOCUMENT_TYPES) {
    const document = item.documents?.[type];
    if (!document) {
      documentLinks.push(
        `<li>${label}: <span class="form-note">Dokumen belum tersedia</span></li>`,
      );
      continue;
    }
    let url = "";
    if (document.path && supabaseClient && isAdminSession()) {
      const { data, error } = await supabaseClient.storage
        .from("company-verification-documents")
        .createSignedUrl(document.path, 300);
      if (error) throw error;
      url = data.signedUrl;
    } else {
      const saved = await getCompanyDocument(item.userId, type);
      if (saved) {
        url = URL.createObjectURL(saved.blob);
        activeCompanyDocumentUrls.push(url);
      }
    }
    documentLinks.push(
      url
        ? `<li><strong>${label}:</strong> <a class="text-link" href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(document.name || label)} <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></li>`
        : `<li>${label}: <span class="form-note">File tidak tersedia</span></li>`,
    );
  }
  openModal(
    "Tinjau verifikasi · " + item.companyName,
    `<div class="company-review"><p class="form-note">Dokumen legal bersifat rahasia dan hanya ditampilkan kepada admin berwenang.</p><ul>${documentLinks.join("")}</ul><div class="form-row"><label for="verificationReviewNote">Catatan untuk perusahaan</label><textarea id="verificationReviewNote" maxlength="1000" placeholder="Alasan penolakan atau catatan persetujuan">${escapeHtml(item.reviewNote || "")}</textarea></div><div class="company-review-actions"><button class="btn btn-outline" type="button" data-verification-action="rejected" data-verification-user="${escapeHtml(item.userId)}">Minta perbaikan</button><button class="btn" type="button" data-verification-action="verified" data-verification-user="${escapeHtml(item.userId)}"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Setujui & beri badge</button></div></div>`,
  );
}
async function setCompanyVerificationStatus(userId, status, note = "") {
  const records = getCompanyVerifications(),
    item = records.find((record) => record.userId === userId);
  if (!item) {
    toast("Pengajuan verifikasi tidak ditemukan.");
    return;
  }
  if (supabaseClient && isAdminSession()) {
    const { data, error } = await supabaseClient.rpc(
      "review_company_verification",
      {
        p_user_id: userId,
        p_status: status,
        p_review_note: note.trim(),
      },
    );
    if (error) throw error;
    if (data?.status !== status)
      throw new Error("Keputusan verifikasi belum terkonfirmasi tersimpan.");
  }
  item.status = status;
  item.reviewNote = note.trim();
  item.reviewedAt = new Date().toISOString();
  currentCompanyVerification = { ...item };
  companyVerificationOwnerId = item.userId;
  if (adminVerificationCache) {
    const index = adminVerificationCache.findIndex(
      (record) => record.userId === userId,
    );
    if (index >= 0)
      adminVerificationCache[index] = {
        ...adminVerificationCache[index],
        status,
        reviewNote: item.reviewNote,
        reviewedAt: item.reviewedAt,
      };
  }
  const profiles = getVerifiedCompanyProfiles().filter(
    (profile) => profile.company_id !== item.companyId,
  );
  if (status === "verified")
    profiles.push({
      company_id: item.companyId,
      company_name: item.companyName,
      is_verified: true,
    });
  saveVerifiedCompanyProfiles(profiles);
  saveCompanyVerifications(records);
  renderAdminCompanies();
  renderCompanyVerificationState(item);
  renderHome();
  if (activeRoute === "jobs") renderJobs();
  closeModal();
  toast(
    status === "verified"
      ? `${item.companyName} terverifikasi dan mendapat badge Verified Company.`
      : `Pengajuan ${item.companyName} dikembalikan untuk perbaikan.`,
  );
}
function accountTypesForSession(session = supabaseSession) {
  const user = session?.user;
  const metadata = user?.user_metadata || {};
  const role = user?.app_metadata?.role;
  if (role === "admin") return new Set();
  let primaryType = String(
    metadata.account_type || metadata.account_types?.[0] || "",
  ).trim();
  if (["company", "hrd"].includes(role)) primaryType = "company";
  else if (role === "candidate") primaryType = "candidate";
  if (!["candidate", "company", "marketplace"].includes(primaryType))
    return new Set();
  return new Set([primaryType]);
}
function isCandidateSession(session = supabaseSession) {
  return (
    Boolean(session?.user?.email) &&
    accountTypesForSession(session).has("candidate")
  );
}
function isCompanyAccount(session = supabaseSession) {
  return (
    Boolean(session?.user?.email) &&
    accountTypesForSession(session).has("company")
  );
}
function isRantauAccount(session = supabaseSession) {
  return (
    Boolean(session?.user?.email) &&
    accountTypesForSession(session).has("marketplace")
  );
}
function isCompanyOwner(session = supabaseSession) {
  const user = session?.user;
  const role = user?.app_metadata?.role;
  return (
    isCompanyAccount(session) &&
    (role === "company" ||
      (role === "hrd" && user.app_metadata.company_id === user.id))
  );
}
function accountTypeForSession(session = supabaseSession) {
  const role = session?.user?.app_metadata?.role;
  if (role === "admin") return "admin";
  if (role === "hrd") return "company";
  if (role === "company") return "company";
  if (role === "candidate") return "candidate";
  return session?.user?.user_metadata?.account_type || "";
}
function openAdditionalAccountForm(type) {
  if (!supabaseClient || !supabaseSession?.user) {
    openAuthModal(false);
    return;
  }
  const activeTypes = accountTypesForSession();
  const activeLabel = activeTypes.has("marketplace")
    ? "JobHub Rantau"
    : activeTypes.has("company")
      ? "Perusahaan / HRD"
      : "Pencari kerja";
  if (
    !["candidate", "company", "marketplace"].includes(type) ||
    activeTypes.size > 0
  ) {
    toast(
      `Role ${activeLabel} sudah aktif untuk email ini. Untuk membuat role baru, daftar atau masuk menggunakan email baru.`,
    );
    return;
  }
  const isCompany = type === "company";
  const isMarketplace = type === "marketplace";
  const fields = isCompany
    ? '<div class="form-row"><label for="additionalAccountName">Nama resmi perusahaan</label><input id="additionalAccountName" name="companyName" required maxlength="160"></div><div class="form-row"><label for="additionalAccountContact">Kontak HR (email atau WhatsApp)</label><input id="additionalAccountContact" name="hrContact" required maxlength="254"></div>'
    : `<div class="form-row"><label for="additionalAccountName">Nama lengkap</label><input id="additionalAccountName" name="fullName" required maxlength="120"></div><div class="form-row"><label for="additionalAccountContact">Nomor WhatsApp</label><input id="additionalAccountContact" name="whatsapp" type="tel" required maxlength="30"></div>${isMarketplace ? '<div class="form-row"><label for="additionalAccountCity">Kota domisili</label><input id="additionalAccountCity" name="city" required maxlength="120"></div>' : ""}`;
  openModal(
    isCompany
      ? "Tambahkan profil perusahaan"
      : isMarketplace
        ? "Aktifkan profil JobHub Rantau"
        : "Tambahkan profil kandidat",
    `<form><p class="form-note">Role baru wajib didaftarkan dengan email baru. Akun ini hanya dapat memakai satu role.</p>${fields}<button class="btn" type="submit">Gunakan email baru</button></form>`,
    async (data) => {
      const user = supabaseSession.user;
      const metadata = user.user_metadata || {};
      const name = String(
        data.get(isCompany ? "companyName" : "fullName") || "",
      ).trim();
      const contact = String(
        data.get(isCompany ? "hrContact" : "whatsapp") || "",
      ).trim();
      const accountTypes = [...new Set([...accountTypesForSession(), type])];
      const nextMetadata = { ...metadata, account_types: accountTypes };
      if (isCompany) {
        nextMetadata.company_name = name;
        nextMetadata.company_profile = {
          ...metadata.company_profile,
          company_name: name,
          hr_contact: contact,
        };
      } else if (isMarketplace) {
        nextMetadata.marketplace_profile = {
          full_name: name,
          whatsapp: contact,
          city: String(data.get("city") || "").trim(),
          intent: "owner",
        };
      } else {
        nextMetadata.full_name = name;
        nextMetadata.whatsapp = contact;
      }
      const { data: updated, error } = await supabaseClient.auth.updateUser({
        data: nextMetadata,
      });
      if (error) throw error;
      if (!updated.user)
        throw new Error(
          "Jenis profil belum dapat ditambahkan. Masuk kembali dan coba lagi.",
        );
      supabaseSession = { ...supabaseSession, user: updated.user };
      if (!isCompany && !isMarketplace) {
        sessionStorage.setItem(
          "jobhub-candidate-profile-draft",
          JSON.stringify({
            fullName: name,
            whatsapp: contact,
            email: user.email,
          }),
        );
      }
      renderAccountMenu();
      closeModal();
      go(
        isCompany
          ? "company-complete"
          : isMarketplace
            ? "rantau-dashboard"
            : "candidate-create-profile",
      );
      toast(
        isCompany
          ? "Profil perusahaan ditambahkan. Lengkapi profil dan dokumen verifikasi."
          : isMarketplace
            ? "Profil JobHub Rantau siap. Lengkapi detail pemilik hunian."
            : "Profil kandidat ditambahkan. Lengkapi data profil Anda.",
      );
    },
  );
}
function authenticatedHomeRoute(session = supabaseSession) {
  // A logged-in user's role must not replace the website's public home route.
  // Their dashboard remains available explicitly from the account menu.
  return "home";
}
function redirectAuthenticatedUser(session = supabaseSession) {
  if (!session?.user) return;
  const target = pendingAuthRoute || authenticatedHomeRoute(session);
  pendingAuthRoute = "";
  go(target);
}
async function completeGoogleOAuth(session) {
  const user = session?.user;
  if (
    !user ||
    user.app_metadata?.provider !== "google" ||
    googleOAuthProcessingUserId === user.id
  )
    return;
  const intendedType = localStorage.getItem("jobhub-google-account-intent");
  const actualType = accountTypeForSession(session);
  if (!intendedType) {
    if (actualType) return;
    try {
      await supabaseClient.auth.signOut();
    } catch (error) {
      toast(
        `Akun Google belum memiliki jenis akun dan gagal keluar: ${error.message || "coba lagi."}`,
      );
      return;
    }
    toast(
      "Akun Google belum terdaftar. Pilih jenis akun melalui menu Daftar terlebih dahulu.",
    );
    return;
  }
  googleOAuthProcessingUserId = user.id;
  try {
    if (actualType && actualType !== intendedType) {
      localStorage.removeItem("jobhub-google-account-intent");
      localStorage.removeItem("jobhub-google-signup");
      localStorage.removeItem("jobhub-google-address-data");
      await supabaseClient.auth.signOut();
      toast(
        `Akun Google ini terdaftar sebagai ${actualType === "company" ? "Perusahaan / HRD" : "Pencari kerja"}. Pilih jenis akun yang sesuai.`,
      );
      return;
    }
    const isSignup = localStorage.getItem("jobhub-google-signup") === "true";
    if (isSignup || !actualType) {
      const fullName =
        user.user_metadata?.full_name || user.user_metadata?.name || "";
      let addressData = {};
      try {
        addressData = JSON.parse(
          localStorage.getItem("jobhub-google-address-data") || "{}",
        );
      } catch (error) {
        throw new Error(`Alamat Google tidak dapat dibaca: ${error.message}`);
      }
      let signupProfile = {};
      try {
        signupProfile = JSON.parse(
          localStorage.getItem("jobhub-google-signup-profile") || "{}",
        );
      } catch (error) {
        throw new Error(
          `Data pendaftaran Google tidak dapat dibaca: ${error.message}`,
        );
      }
      const metadata = {
        ...signupProfile,
        account_type: intendedType,
        account_types: [intendedType],
        full_name: fullName,
        address_data: addressData,
      };
      if (intendedType === "marketplace")
        metadata.marketplace_profile = {
          full_name: fullName,
          whatsapp: signupProfile.whatsapp || "",
          city: signupProfile.marketplace_city || "",
          intent: signupProfile.marketplace_intent || "renter",
        };
      if (intendedType === "company") {
        metadata.company_name = user.user_metadata?.company_name || "";
        metadata.company_profile = {
          ...(user.user_metadata?.company_profile || {}),
          ...addressData,
        };
      }
      const { data, error } = await supabaseClient.auth.updateUser({
        data: metadata,
      });
      if (error) throw error;
      supabaseSession = { ...session, user: data.user };
      if (isSignup && intendedType === "candidate") {
        sessionStorage.setItem(
          "jobhub-candidate-profile-draft",
          JSON.stringify({
            ...signupProfile,
            ...addressData,
            fullName,
            email: user.email,
            province: addressData.provinceName || "",
            city: addressData.regencyName || "",
            district: addressData.districtName || "",
            village: addressData.villageName || "",
          }),
        );
      }
    }
    localStorage.setItem("jobhub-account-intent", intendedType);
    localStorage.removeItem("jobhub-google-account-intent");
    localStorage.removeItem("jobhub-google-signup");
    localStorage.removeItem("jobhub-google-address-data");
    localStorage.removeItem("jobhub-google-signup-profile");
    if (isSignup && intendedType === "candidate") {
      go("candidate-create-profile");
      toast("Akun Google siap. Silakan lengkapi profil pencari kerja Anda.");
    } else if (isSignup && intendedType === "company") {
      go("dashboard");
      openCompanyProfileForm();
      toast(
        "Akun perusahaan siap. Lengkapi profil dan tunggu aktivasi role HRD oleh admin.",
      );
    } else if (isSignup && intendedType === "marketplace") {
      go("home");
      toast("Akun JobHub Rantau siap. Buka menu akun untuk masuk ke dashboard pemilik hunian.");
    } else toast("Berhasil masuk dengan Google.");
  } catch (error) {
    localStorage.removeItem("jobhub-google-account-intent");
    localStorage.removeItem("jobhub-google-signup");
    localStorage.removeItem("jobhub-google-address-data");
    localStorage.removeItem("jobhub-google-signup-profile");
    toast(
      `Akun Google berhasil masuk, tetapi jenis akun gagal disimpan: ${error.message || "coba perbarui profil."}`,
    );
  } finally {
    googleOAuthProcessingUserId = "";
  }
}
async function loadCandidateInterviews(session = supabaseSession) {
  if (!supabaseClient || !isCandidateSession(session)) {
    candidateInterviewCache = null;
    renderCandidateNotifications();
    return;
  }
  const email = session.user.email.trim().toLowerCase();
  const { data, error } = await supabaseClient
    .from("jobhub_interviews")
    .select("*")
    .eq("candidate_email", email)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  candidateInterviewCache = data.map(fromSupabaseInterview);
  renderCandidateNotifications();
  if (interviewChannel) await supabaseClient.removeChannel(interviewChannel);
  interviewChannel = supabaseClient
    .channel(`candidate-interviews-${email}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_interviews",
        filter: `candidate_email=eq.${email}`,
      },
      (payload) => {
        const changed =
          payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.id) return;
        const index = candidateInterviewCache.findIndex(
          (item) => item.id === changed.id,
        );
        if (payload.eventType === "DELETE") {
          if (index >= 0) candidateInterviewCache.splice(index, 1);
        } else {
          const updated = fromSupabaseInterview(changed);
          if (index >= 0) candidateInterviewCache[index] = updated;
          else candidateInterviewCache.push(updated);
        }
        renderCandidateNotifications();
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        toast(
          `Notifikasi interview tidak dapat diperbarui realtime: ${error?.message || status}`,
        );
    });
}
function scheduleInterview(applicationId) {
  if (!canManageCandidates()) {
    toast("Role Recruiter hanya dapat melihat jadwal interview.");
    return;
  }
  const application = getApplications().find(
    (item) => item.id === applicationId,
  );
  if (!application) {
    toast("Data lamaran kandidat tidak ditemukan.");
    return;
  }
  const localNow = new Date();
  const localDate = new Date(
    localNow.getTime() - localNow.getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 10);
  const email = application.candidateEmail || "";
  openModal(
    "Jadwalkan interview",
    `<form class="interview-scheduler-form">
    <p class="form-note">Kandidat: <strong>${escapeHtml(application.candidateName || "Kandidat")}</strong> · ${escapeHtml(application.jobTitle || "Lowongan")}</p>
    <div class="form-row"><label for="interviewType">Tahap interview</label><select id="interviewType" name="interviewType">${INTERVIEW_TYPES.map((type) => `<option>${type}</option>`).join("")}</select></div>
    <div class="form-row"><label for="interviewDate">Tanggal</label><input id="interviewDate" name="date" type="date" min="${localDate}" required></div>
    <div class="form-row"><label for="interviewTime">Waktu (WIB / UTC+7)</label><input id="interviewTime" name="time" type="time" required></div>
    <div class="form-row"><label for="candidateEmail">Email kandidat</label><input id="candidateEmail" name="candidateEmail" type="email" value="${escapeHtml(email)}" autocomplete="email" required placeholder="kandidat@email.com"><small class="form-note">Email dipakai untuk mengirim undangan interview.</small></div>
    <div class="form-row"><label for="interviewMeetingUrl">Link meeting (opsional)</label><input id="interviewMeetingUrl" name="meetingUrl" type="url" placeholder="https://meet.google.com/..."></div>
    <div class="form-row"><label for="interviewNotes">Catatan untuk kandidat (opsional)</label><textarea id="interviewNotes" name="notes" maxlength="2000" placeholder="Persiapan atau informasi yang perlu diketahui kandidat"></textarea></div>
    <button class="btn" type="submit">Simpan jadwal & kirim undangan</button>
  </form>`,
    async (data) => {
      const date = data.get("date"),
        time = data.get("time"),
        startsAt = new Date(`${date}T${time}:00+07:00`);
      if (
        !date ||
        !time ||
        !Number.isFinite(startsAt.getTime()) ||
        startsAt <= new Date()
      ) {
        toast("Pilih tanggal dan waktu interview yang akan datang.");
        return;
      }
      const candidateEmail = String(data.get("candidateEmail") || "")
        .trim()
        .toLowerCase();
      const meetingUrl = String(data.get("meetingUrl") || "").trim();
      if (meetingUrl) {
        try {
          const url = new URL(meetingUrl);
          if (!["http:", "https:"].includes(url.protocol)) throw new Error();
        } catch {
          toast(
            "Link meeting harus menggunakan URL HTTP atau HTTPS yang valid.",
          );
          return;
        }
      }
      const interview = {
        id: crypto.randomUUID(),
        companyId: billingCompanyId(),
        applicationId: application.id,
        candidateId: application.candidateId || null,
        candidateName: application.candidateName || "Kandidat",
        candidateEmail,
        jobTitle:
          application.jobTitle ||
          jobs.find((job) => job.id === application.jobId)?.title ||
          "Lowongan",
        interviewType: String(data.get("interviewType")),
        startsAt: startsAt.toISOString(),
        meetingUrl,
        notes: String(data.get("notes") || "").trim(),
        emailStatus:
          supabaseClient && isHrdSession() ? "pending" : "not_configured",
        createdAt: new Date().toISOString(),
      };
      const interviews = getInterviews();
      interviews.push(interview);
      saveInterviews(interviews);
      application.candidateEmail = candidateEmail;
      const applications = getApplications();
      const applicationIndex = applications.findIndex(
        (item) => item.id === application.id,
      );
      if (applicationIndex >= 0) applications[applicationIndex] = application;
      saveApplications(applications);
      renderDashboard();
      renderCandidateNotifications();
      closeModal();
      if (!supabaseClient || !isHrdSession()) {
        toast(
          "Jadwal tersimpan lokal. Email akan dikirim setelah Supabase Auth dan Edge Function dikonfigurasi.",
        );
        return;
      }
      try {
        const { error: saveError } = await supabaseClient
          .from("jobhub_interviews")
          .insert(toSupabaseInterview(interview));
        if (saveError) throw saveError;
        const { data: emailResult, error: emailError } =
          await supabaseClient.functions.invoke("send-interview-notification", {
            body: { interviewId: interview.id },
          });
        if (emailError) throw emailError;
        interview.emailStatus = emailResult?.status || "sent";
        saveInterviews(
          getInterviews().map((item) =>
            item.id === interview.id ? interview : item,
          ),
        );
        renderDashboard();
        toast("Jadwal tersimpan dan undangan email berhasil dikirim.");
      } catch (error) {
        interview.emailStatus = "failed";
        saveInterviews(
          getInterviews().map((item) =>
            item.id === interview.id ? interview : item,
          ),
        );
        const { error: statusError } = await supabaseClient
          .from("jobhub_interviews")
          .update({ email_status: "failed" })
          .eq("id", interview.id)
          .eq("company_id", billingCompanyId());
        if (statusError)
          console.error(
            "Unable to update interview email status:",
            statusError.message,
          );
        renderDashboard();
        toast(
          `Jadwal tersimpan, tetapi email gagal dikirim: ${error.message || "periksa Edge Function dan konfigurasi Resend."}`,
        );
      }
    },
  );
}
async function retryInterviewEmail(interviewId) {
  const interview = getInterviews().find((item) => item.id === interviewId);
  if (!interview || !supabaseClient || !canManageCandidates()) {
    toast(
      "Masuk sebagai HRD dan konfigurasi Supabase untuk mengirim ulang email.",
    );
    return;
  }
  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "send-interview-notification",
      { body: { interviewId } },
    );
    if (error) throw error;
    interview.emailStatus = data?.status || "sent";
    saveInterviews(
      getInterviews().map((item) =>
        item.id === interviewId ? interview : item,
      ),
    );
    renderDashboard();
    toast("Undangan email berhasil dikirim.");
  } catch (error) {
    toast(
      `Email belum terkirim: ${error.message || "periksa konfigurasi Resend."}`,
    );
  }
}
function renderATSBoard(applications = getApplications()) {
  const canManage = canManageCandidates();
  ATS_STATUSES.forEach((status) => {
    const column = $(`[data-kanban-status="${status}"]`);
    const candidates = applications.filter(
      (application) =>
        normalizeApplicationStatus(application.status) === status,
    );
    column.querySelector("[data-kanban-count]").textContent = candidates.length;
    const container = column.querySelector("[data-kanban-cards]");
    container.innerHTML = candidates.length
      ? candidates
          .map((application) => {
            const job = jobs.find((item) => item.id === application.jobId);
            const match = application.match?.matchPercentage;
            const savedTalent = getTalentPool().some(
              (candidate) =>
                candidate.candidateId &&
                candidate.candidateId === application.candidateId,
            );
            const interviews = getApplicationInterviews(application.id);
            const nextInterview = interviews.find(
              (interview) => new Date(interview.startsAt) >= new Date(),
            );
            return `<article class="kanban-card" draggable="${canManage}" role="listitem" tabindex="0" data-candidate-id="${escapeHtml(application.id)}" aria-label="${escapeHtml(application.candidateName || "Kandidat")} — ${escapeHtml(job?.title || "Lowongan")}">
        <h4>${escapeHtml(application.candidateName || "Kandidat")}</h4>
        <p>${escapeHtml(job?.title || application.jobTitle || "Lowongan tidak tersedia")}</p>
        <p>${escapeHtml(application.education || "Pendidikan belum diisi")}${application.experienceYears ? ` · ${application.experienceYears} th pengalaman` : ""}</p>
        ${Number(application.expectedSalary) > 0 ? `<p>Ekspektasi gaji: ${escapeHtml(formatRupiah(Number(application.expectedSalary)))}/bulan</p>` : ""}
        ${Number.isFinite(Number(match)) ? `<span class="candidate-match">${Number(match)}% Match</span>` : ""}
        ${canManage ? `<button class="btn btn-outline btn-small candidate-pool-button" type="button" data-add-to-talent-pool="${escapeHtml(application.id)}"><i class="fa-${savedTalent ? "solid" : "regular"} fa-heart" aria-hidden="true"></i> ${savedTalent ? "Perbarui Talent Pool" : "Simpan ke Talent Pool"}</button>` : ""}
        ${isHrdSession() ? `<button class="text-link candidate-message-button" type="button" data-message-application="${escapeHtml(application.id)}"><i class="fa-regular fa-message" aria-hidden="true"></i> Pesan kandidat</button>` : ""}
        <button class="btn btn-outline btn-small candidate-cv-button" type="button" data-analyze-cv="${escapeHtml(application.id)}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Buka CV & ringkasan AI</button>
        ${application.cvId || application.cvFileId || application.cvUrl ? `<button class="text-link candidate-cv-download" type="button" data-candidate-application-cv="${escapeHtml(application.id)}">Download CV terbaru</button>` : ""}
        ${canManage ? `<button class="btn btn-outline btn-small candidate-schedule-button" type="button" data-schedule-interview="${escapeHtml(application.id)}"><i class="fa-regular fa-calendar-plus" aria-hidden="true"></i> Jadwalkan interview</button>` : ""}
        ${nextInterview ? `<p class="scheduled-interview-summary"><strong>${escapeHtml(nextInterview.interviewType)}</strong><br>${escapeHtml(formatInterviewDate(nextInterview.startsAt))}<br><span class="email-delivery-status ${nextInterview.emailStatus === "sent" ? "sent" : nextInterview.emailStatus === "failed" ? "failed" : "pending"}">${nextInterview.emailStatus === "sent" ? "Email terkirim" : nextInterview.emailStatus === "failed" ? "Email gagal" : nextInterview.emailStatus === "not_configured" ? "Email belum dikonfigurasi" : "Email menunggu"}</span>${canManage && nextInterview.emailStatus === "failed" ? ` <button class="text-link" type="button" data-retry-interview-email="${escapeHtml(nextInterview.id)}">Kirim ulang</button>` : ""}</p>` : ""}
        ${
          canManage
            ? `<select class="kanban-move-select" aria-label="Ubah status ${escapeHtml(application.candidateName || "kandidat")}">
          ${ATS_STATUSES.map((option) => `<option value="${option}" ${option === status ? "selected" : ""}>Pindah ke ${option}</option>`).join("")}
        </select>`
            : ""
        }
      </article>`;
          })
          .join("")
      : '<div class="kanban-empty">Lepaskan kandidat di sini</div>';
  });
}
async function saveCandidateStatus(id, status) {
  if (!canManageCandidates()) {
    toast("Role Recruiter hanya dapat melihat kandidat.");
    renderDashboard();
    return;
  }
  if (!ATS_STATUSES.includes(status)) return;
  const applications = getApplications();
  const application = applications.find((item) => item.id === id);
  if (!application || application.status === status) return;
  application.status = status;
  saveApplications(applications);
  renderDashboard();
  if (isHrdSession()) await syncApplicationToSupabase(application);
  else toast(`Status kandidat diperbarui ke ${status}.`);
}
async function syncApplicationToSupabase(application) {
  if (!supabaseClient) return;
  if (isCandidateSession()) {
    const { data: job, error: jobError } = await supabaseClient
      .from("jobhub_jobs")
      .select("company_id,status")
      .eq("id", application.jobId)
      .eq("status", "active")
      .maybeSingle();
    if (jobError) throw jobError;
    if (!job)
      throw new Error("Lowongan tidak aktif atau tidak ditemukan di Supabase.");
    application.companyId = job.company_id;
    const { data: existing, error: existingError } = await supabaseClient
      .from("jobhub_applications")
      .select("id")
      .eq("job_id", application.jobId)
      .eq("candidate_id", supabaseSession.user.id)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing)
      throw new Error("Anda sudah mengirim lamaran untuk lowongan ini.");
    const { error } = await supabaseClient
      .from("jobhub_applications")
      .insert(toSupabaseApplication(application));
    if (error) throw error;
    return;
  }
  if (!isHrdSession()) return;
  try {
    const { error } = await supabaseClient
      .from("jobhub_applications")
      .upsert(toSupabaseApplication(application));
    if (error) throw error;
    setAtsSyncStatus("connected", "Realtime aktif");
  } catch (error) {
    setAtsSyncStatus("error", "Gagal menyimpan ke Supabase");
    toast(
      `Status tersimpan di perangkat, tetapi sinkronisasi gagal: ${error.message || "periksa koneksi dan kebijakan RLS."}`,
    );
  }
}
function renderTalentPool() {
  const grid = $("#talentPoolGrid");
  if (!grid) return;
  const canManage = canManageCandidates();
  const talent = getTalentPool();
  const categories = getTalentCategories();
  $$(
    "#talentPoolPanel [data-add-talent],#talentPoolPanel [data-manage-talent-categories]",
  ).forEach((button) => (button.hidden = !canManage));
  const visible =
    activeTalentCategory === "all"
      ? talent
      : talent.filter(
          (candidate) => candidate.category === activeTalentCategory,
        );
  $("#talentPoolCount").textContent = talent.length;
  $("#talentCategoryFilters").innerHTML =
    `<button class="talent-category-chip ${activeTalentCategory === "all" ? "active" : ""}" type="button" data-talent-category="all">Semua <span>${talent.length}</span></button>${categories.map((category) => `<button class="talent-category-chip ${activeTalentCategory === category ? "active" : ""}" type="button" data-talent-category="${escapeHtml(category)}">${escapeHtml(category)} <span>${talent.filter((candidate) => candidate.category === category).length}</span></button>`).join("")}`;
  grid.innerHTML = visible.length
    ? visible
        .map(
          (
            candidate,
          ) => `<article class="talent-card" data-talent-id="${escapeHtml(candidate.id)}">
    <div class="talent-card-head"><div class="talent-avatar" aria-hidden="true">${escapeHtml((candidate.candidateName || "?").trim().slice(0, 1).toUpperCase())}</div><div class="talent-card-title"><h3>${escapeHtml(candidate.candidateName)}</h3><a href="mailto:${escapeHtml(candidate.candidateEmail)}">${escapeHtml(candidate.candidateEmail)}</a></div><span class="talent-card-category">${escapeHtml(candidate.category || "Umum")}</span></div>
    <div class="talent-card-meta">${candidate.education ? `<span>${escapeHtml(candidate.education)}</span>` : ""}${candidate.experienceYears ? `<span>${candidate.experienceYears} th pengalaman</span>` : ""}</div>
    ${
      candidate.skills?.length
        ? `<div class="talent-card-skills">${candidate.skills
            .slice(0, 5)
            .map((skill) => `<span>${escapeHtml(skill)}</span>`)
            .join("")}</div>`
        : ""
    }
    <div class="talent-private-note"><strong><i class="fa-solid fa-lock" aria-hidden="true"></i> Catatan pribadi</strong><p>${candidate.notes ? escapeHtml(candidate.notes) : '<span class="form-note">Belum ada catatan.</span>'}</p></div>
    ${canManage ? `<div class="talent-card-actions"><button class="btn btn-outline btn-small" type="button" data-edit-talent="${escapeHtml(candidate.id)}"><i class="fa-solid fa-pen" aria-hidden="true"></i> Edit</button><button class="btn btn-small" type="button" data-invite-talent="${escapeHtml(candidate.id)}"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Undang ke lowongan</button><button class="text-link" type="button" data-remove-talent="${escapeHtml(candidate.id)}">Hapus</button></div>` : ""}
  </article>`,
        )
        .join("")
    : '<div class="empty-state"><strong>Talent Pool masih kosong</strong>Simpan kandidat dari pipeline atau tambahkan kandidat secara manual untuk mulai membangun talent pool.</div>';
}
function openTalentForm(candidateId = "", applicationId = "") {
  if (!canManageCandidates()) {
    toast("Role Recruiter hanya dapat melihat kandidat.");
    return;
  }
  if (!requirePlanFeature("talentPool", "Talent Pool")) return;
  const saved = getTalentPool().find((item) => item.id === candidateId);
  const application = getApplications().find(
    (item) => item.id === applicationId,
  );
  const current = saved || {
    candidateId: application?.candidateId || "",
    candidateName: application?.candidateName || "",
    candidateEmail: application?.candidateEmail || "",
    skills: application?.skills || [],
    experienceYears: application?.experienceYears || 0,
    education: application?.education || "",
    category: "Umum",
    notes: "",
  };
  openModal(
    saved ? "Edit kandidat Talent Pool" : "Tambah ke Talent Pool",
    `<form class="talent-form">
    <div class="form-row"><label for="talentName">Nama kandidat</label><input id="talentName" name="candidateName" value="${escapeHtml(current.candidateName)}" required maxlength="120"></div>
    <div class="form-row"><label for="talentEmail">Email kandidat</label><input id="talentEmail" name="candidateEmail" type="email" value="${escapeHtml(current.candidateEmail)}" required maxlength="254" placeholder="kandidat@email.com"></div>
    <div class="form-row"><label for="talentCategory">Kategori talent</label><select id="talentCategory" name="category">${getTalentCategories()
      .map(
        (category) =>
          `<option value="${escapeHtml(category)}" ${current.category === category ? "selected" : ""}>${escapeHtml(category)}</option>`,
      )
      .join("")}</select></div>
    <div class="form-row"><label for="talentSkills">Skill (pisahkan dengan koma)</label><input id="talentSkills" name="skills" value="${escapeHtml((current.skills || []).join(", "))}" placeholder="React, komunikasi, SQL"></div>
    <div class="form-row"><label for="talentEducation">Pendidikan</label><input id="talentEducation" name="education" value="${escapeHtml(current.education)}" placeholder="S1 Informatika"></div>
    <div class="form-row"><label for="talentExperience">Pengalaman (tahun)</label><input id="talentExperience" name="experienceYears" type="number" min="0" max="60" value="${Number(current.experienceYears) || 0}"></div>
    <div class="form-row"><label for="talentNotes">Catatan pribadi HRD</label><textarea id="talentNotes" name="notes" maxlength="3000" placeholder="Catatan ini hanya terlihat oleh HRD perusahaan Anda.">${escapeHtml(current.notes || "")}</textarea></div>
    <button class="btn" type="submit">${saved ? "Simpan perubahan" : "Simpan kandidat"}</button>
  </form>`,
    async (data) => {
      const candidate = {
        id: saved?.id || crypto.randomUUID(),
        candidateId: saved?.candidateId || current.candidateId || "",
        candidateName: String(data.get("candidateName") || "").trim(),
        candidateEmail: String(data.get("candidateEmail") || "")
          .trim()
          .toLowerCase(),
        category: String(data.get("category") || "Umum").trim(),
        skills: getLines(data.get("skills")),
        education: String(data.get("education") || "").trim(),
        experienceYears: Number(data.get("experienceYears")) || 0,
        notes: String(data.get("notes") || "").trim(),
        addedAt: saved?.addedAt || new Date().toISOString(),
      };
      const candidates = getTalentPool();
      const duplicate = candidates.find(
        (item) =>
          item.id !== candidate.id &&
          item.candidateEmail.toLowerCase() === candidate.candidateEmail,
      );
      if (duplicate) {
        toast(
          "Email kandidat sudah ada di Talent Pool. Buka data yang sudah tersimpan untuk memperbaruinya.",
        );
        return;
      }
      const existingIndex = candidates.findIndex(
        (item) => item.id === candidate.id,
      );
      const plan = getCompanyPlan();
      const ownJobIds = new Set(companyJobs().map((job) => job.id));
      const alreadyCounted = getApplications().some(
        (item) =>
          (item.companyId === billingCompanyId() ||
            ownJobIds.has(item.jobId)) &&
          (item.candidateId === candidate.candidateId ||
            item.candidateEmail?.toLowerCase() === candidate.candidateEmail),
      );
      if (
        existingIndex < 0 &&
        !alreadyCounted &&
        plan &&
        countCompanyCandidates() >= plan.candidateLimit
      ) {
        toast(
          `Batas paket ${plan.name} tercapai (${plan.candidateLimit} kandidat). Upgrade paket untuk menambah kandidat.`,
        );
        closeModal();
        go("pricing");
        return;
      }
      if (existingIndex >= 0) candidates[existingIndex] = candidate;
      else candidates.unshift(candidate);
      saveTalentPool(candidates);
      closeModal();
      renderDashboard();
      try {
        await syncTalentPoolToSupabase(candidate);
        toast(
          saved
            ? "Data kandidat diperbarui."
            : "Kandidat ditambahkan ke Talent Pool.",
        );
      } catch (error) {
        toast(
          `Data tersimpan lokal, tetapi sinkronisasi Talent Pool gagal: ${error.message || "periksa tabel dan kebijakan RLS."}`,
        );
      }
    },
  );
}
function manageTalentCategories() {
  if (!canManageCandidates()) {
    toast("Role Recruiter tidak dapat mengubah kategori kandidat.");
    return;
  }
  const custom = getTalentCategories().filter(
    (category) => !DEFAULT_TALENT_CATEGORIES.includes(category),
  );
  openModal(
    "Kelola kategori talent",
    `<form class="talent-category-form">
    <div class="form-row"><label for="newTalentCategory">Nama kategori baru</label><input id="newTalentCategory" name="category" maxlength="40" placeholder="Contoh: Data & Analytics" required></div>
    <button class="btn" type="submit">Tambah kategori</button>
    <div class="talent-category-list">${custom.length ? custom.map((category) => `<span class="talent-category-chip">${escapeHtml(category)} <button type="button" aria-label="Hapus kategori ${escapeHtml(category)}" data-delete-talent-category="${escapeHtml(category)}">&times;</button></span>`).join("") : '<p class="form-note">Belum ada kategori kustom.</p>'}</div>
  </form>`,
    (data) => {
      const category = String(data.get("category") || "").trim();
      if (!category) return;
      if (
        getTalentCategories().some(
          (item) => item.toLowerCase() === category.toLowerCase(),
        )
      ) {
        toast("Kategori tersebut sudah tersedia.");
        return;
      }
      const next = [...getTalentCategories(), category];
      saveTalentCategories(next);
      if (supabaseClient && isHrdSession())
        syncTalentCategoriesToSupabase()
          .then(() => toast("Kategori talent ditambahkan."))
          .catch((error) =>
            toast(
              `Kategori tersimpan lokal, tetapi sinkronisasi gagal: ${error.message}`,
            ),
          );
      else toast("Kategori talent ditambahkan.");
      closeModal();
      renderTalentPool();
    },
  );
  $("#modalBody").addEventListener("click", (event) => {
    const remove = event.target.closest("[data-delete-talent-category]");
    if (!remove) return;
    const category = remove.dataset.deleteTalentCategory;
    saveTalentCategories(
      getTalentCategories().filter((item) => item !== category),
    );
    const candidates = getTalentPool().map((candidate) =>
      candidate.category === category
        ? { ...candidate, category: "Umum" }
        : candidate,
    );
    saveTalentPool(candidates);
    activeTalentCategory = "all";
    Promise.all(
      candidates
        .filter((candidate) => candidate.category === "Umum")
        .map(syncTalentPoolToSupabase),
    )
      .then(async () => {
        if (supabaseClient && isHrdSession()) {
          const { error } = await supabaseClient
            .from("jobhub_talent_categories")
            .delete()
            .eq("company_id", billingCompanyId())
            .eq("name", category);
          if (error) throw error;
        }
      })
      .catch((error) =>
        toast(
          `Kategori diperbarui lokal, tetapi sinkronisasi gagal: ${error.message}`,
        ),
      );
    manageTalentCategories();
    renderTalentPool();
  });
}
function inviteTalentToJob(candidateId) {
  if (!canManageCandidates()) {
    toast("Role Recruiter hanya dapat melihat kandidat.");
    return;
  }
  if (!requirePlanFeature("talentPool", "Undang kandidat dari Talent Pool"))
    return;
  const candidate = getTalentPool().find((item) => item.id === candidateId);
  if (!candidate) return;
  if (!jobs.length) {
    toast("Buat lowongan aktif sebelum mengundang kandidat.");
    return;
  }
  openModal(
    "Undang kandidat ke lowongan",
    `<form class="talent-invite-form">
    <p class="form-note">Undangan akan menambahkan <strong>${escapeHtml(candidate.candidateName)}</strong> ke pipeline kandidat pada tahap New Applicant.</p>
    <div class="form-row"><label for="talentInviteJob">Lowongan</label><select id="talentInviteJob" name="jobId" required>${jobs.map((job) => `<option value="${escapeHtml(job.id)}">${escapeHtml(job.title)} · ${escapeHtml(job.loc)}</option>`).join("")}</select></div>
    <div class="form-row"><label for="talentInviteEmail">Email kandidat</label><input id="talentInviteEmail" name="email" type="email" required value="${escapeHtml(candidate.candidateEmail)}"></div>
    <div class="form-row"><label for="talentInviteNote">Pesan undangan</label><textarea id="talentInviteNote" name="message" maxlength="1500" placeholder="Kami ingin mengundang Anda untuk mempertimbangkan posisi ini."></textarea></div>
    <button class="btn" type="submit">Kirim undangan</button>
  </form>`,
    async (data) => {
      const job = jobs.find((item) => item.id === data.get("jobId"));
      if (!job) return;
      const candidateEmail = String(data.get("email") || "")
        .trim()
        .toLowerCase();
      const candidateId = candidate.candidateId || `talent-${candidate.id}`;
      const applications = getApplications();
      const existingApplication = applications.find(
        (item) =>
          item.jobId === job.id &&
          (item.candidateId === candidateId ||
            item.candidateEmail?.toLowerCase() === candidateEmail),
      );
      if (existingApplication) {
        closeModal();
        if (supabaseClient && isHrdSession()) {
          try {
            const { error } = await supabaseClient.functions.invoke(
              "send-job-invitation",
              { body: { applicationId: existingApplication.id } },
            );
            if (error) throw error;
            toast(
              "Kandidat sudah ada di pipeline; undangan email dikirim ulang.",
            );
          } catch (error) {
            toast(
              `Kandidat sudah ada di pipeline, tetapi email gagal dikirim: ${error.message || "periksa konfigurasi fungsi email."}`,
            );
          }
        } else {
          toast("Kandidat ini sudah tercatat pada lowongan tersebut.");
        }
        return;
      }
      const plan = getCompanyPlan();
      const alreadyCounted =
        getTalentPool().some(
          (item) =>
            item.candidateId === candidateId ||
            item.candidateEmail?.toLowerCase() === candidateEmail,
        ) ||
        getApplications().some(
          (item) =>
            (item.companyId === billingCompanyId() ||
              companyJobs().some(
                (companyJob) => companyJob.id === item.jobId,
              )) &&
            (item.candidateId === candidateId ||
              item.candidateEmail?.toLowerCase() === candidateEmail),
        );
      if (
        plan &&
        countCompanyCandidates() >= plan.candidateLimit &&
        !alreadyCounted
      ) {
        toast(
          `Batas paket ${plan.name} tercapai (${plan.candidateLimit} kandidat). Upgrade paket untuk menambah kandidat.`,
        );
        closeModal();
        go("pricing");
        return;
      }
      const application = {
        id: `APP-${crypto.randomUUID()}`,
        jobId: job.id,
        jobTitle: job.title,
        candidateId,
        candidateName: candidate.candidateName,
        candidateEmail,
        cvId: "",
        cvFileId: "",
        message: String(data.get("message") || "").trim(),
        answers: {},
        skills: candidate.skills || [],
        experienceYears: Number(candidate.experienceYears) || 0,
        education: candidate.education || "",
        status: "New Applicant",
        createdAt: new Date().toISOString(),
      };
      application.match = calculateCandidateMatch(job, application);
      applications.unshift(application);
      saveApplications(applications);
      closeModal();
      renderDashboard();
      if (isHrdSession()) {
        await syncApplicationToSupabase(application);
        try {
          const { error } = await supabaseClient.functions.invoke(
            "send-job-invitation",
            { body: { applicationId: application.id } },
          );
          if (error) throw error;
          toast(
            `Undangan untuk ${candidate.candidateName} dikirim melalui email dan kandidat masuk ke pipeline.`,
          );
        } catch (error) {
          toast(
            `Kandidat masuk ke pipeline, tetapi email undangan gagal: ${error.message || "periksa konfigurasi fungsi email."}`,
          );
        }
      } else {
        toast(
          `Kandidat ditambahkan ke pipeline ${job.title}. Email undangan memerlukan konfigurasi Supabase.`,
        );
      }
    },
  );
}
function renderHome() {
  renderHomeAudience();
  $("#categoryGrid").innerHTML = categories
    .map(
      ([name, icon, count]) =>
        `<button class="category-item" data-category="${name}"><span class="category-icon">${icon}</span><strong>${name}</strong><small>${count}</small></button>`,
    )
    .join("");
  const searchCategory = $("#searchCategory");
  if (searchCategory)
    searchCategory.innerHTML =
      '<option value="">Semua kategori</option>' +
      categories
        .map(
          ([name]) =>
            `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`,
        )
        .join("");
}
function renderHomeAudience() {
  const band = $("#homeAudienceBand");
  if (!band) return;
  const candidate =
    isCandidateSession() ||
    (!supabaseClient &&
      localStorage.getItem("jobhub-account-intent") === "candidate");
  band.dataset.audience = candidate ? "candidate" : "company";
  $("#homeAudienceEyebrow").textContent = candidate
    ? "Untuk pencari kerja"
    : "Untuk perusahaan";
  $("#homeAudienceHeading").textContent = candidate
    ? "Temukan pekerjaan yang sesuai dengan skill Anda."
    : "Temukan orang hebat untuk pekerjaan yang penting.";
  $("#homeAudienceDescription").textContent = candidate
    ? "Jelajahi peluang kerja yang sesuai dengan keahlian dan tujuan karier Anda."
    : "Jangkau kandidat relevan dan kelola rekrutmen dalam satu tempat.";
  $("#homeAudienceStepOne").textContent = candidate
    ? "Kenali keahlian Anda"
    : "Pasang lowongan";
  $("#homeAudienceStepTwo").textContent = candidate
    ? "Temukan pekerjaan"
    : "Temukan kandidat";
  $("#homeAudienceStepThree").textContent = candidate
    ? "Mulai karier baru"
    : "Bangun tim";
  const action = $("#homeAudienceAction");
  action.dataset.route = candidate ? "candidate-create-profile" : "dashboard";
  $("#homeAudienceActionLabel").textContent = candidate
    ? "Posting profil pencari kerja"
    : "Mulai rekrutmen";
  const jobsAction = $("#homeAudienceJobsAction");
  jobsAction.hidden = !candidate;
  jobsAction.dataset.route = "jobs";
}
function loadPublishedCandidateProfiles() {
  if (candidateProfilesLoaded) return Promise.resolve(candidateProfilesCache);
  if (candidateProfilesPromise) return candidateProfilesPromise;
  if (!supabaseClient && window.JOBHUB_SUPABASE_CONFIG?.url)
    return Promise.resolve(candidateProfilesCache);
  if (!supabaseClient && typeof getLocalCandidateProfiles !== "function")
    return Promise.resolve(candidateProfilesCache);
  candidateProfilesPromise = (async () => {
    if (supabaseClient) {
      const { data, error } = await supabaseClient
        .from("candidate_posts")
        .select(
          "id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,is_published,verified_candidate,created_at,updated_at",
        )
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      candidateProfilesCache = data || [];
    } else if (typeof getLocalCandidateProfiles === "function") {
      candidateProfilesCache = getLocalCandidateProfiles()
        .filter((profile) => profile.is_published)
        .slice(0, 24);
    }
    candidateProfilesLoaded = true;
    return candidateProfilesCache;
  })().finally(() => {
    candidateProfilesPromise = null;
  });
  return candidateProfilesPromise;
}
function candidateFrontendCategory(profile) {
  const normalize = (value) =>
    String(value || "")
      .toLocaleLowerCase("id-ID")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/^(bidang|kategori|pekerjaan) /, "");
  return (
    categories.find(
      ([name]) => normalize(name) === normalize(profile.category),
    )?.[0] || ""
  );
}
async function renderCandidateFeed() {
  const results = $("#candidateFeedResults");
  const form = $("#candidateFeedForm");
  if (!results || !form) return;
  const categorySelect = form.elements.category;
  if (categorySelect.options.length === 1)
    categorySelect.innerHTML =
      '<option value="">Semua bidang</option>' +
      categories
        .map(
          ([name]) =>
            `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`,
        )
        .join("");
  results.setAttribute("aria-busy", "true");
  results.innerHTML = loadingIndicator("Memuat profil pencari kerja...");
  let profiles = [];
  try {
    profiles = await loadPublishedCandidateProfiles();
  } catch (error) {
    results.innerHTML = `<p class="cv-analysis-error">Profil kandidat gagal dimuat: ${escapeHtml(error.message || "periksa koneksi.")}</p>`;
    results.setAttribute("aria-busy", "false");
    return;
  }
  const query = String(form.elements.query.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const location = String(form.elements.location.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const category = form.elements.category.value;
  const filtered = profiles.filter((profile) => {
    const data = profile.public_data || profile.publicData || {};
    if (category && candidateFrontendCategory(profile) !== category)
      return false;
    const searchable = [
      profile.full_name,
      profile.main_position,
      profile.category,
      profile.location,
      profile.about,
      ...(profile.skills || []),
      ...(data.languages || []).map((item) => item.language),
    ]
      .join(" ")
      .toLocaleLowerCase("id-ID");
    if (query && !searchable.includes(query)) return false;
    if (
      location &&
      !String(profile.location || "")
        .toLocaleLowerCase("id-ID")
        .includes(location)
    )
      return false;
    return true;
  });
  if ($("#candidateFeedSort")?.value === "name")
    filtered.sort((left, right) =>
      String(left.full_name || "").localeCompare(
        String(right.full_name || ""),
        "id",
      ),
    );
  else
    filtered.sort(
      (left, right) =>
        new Date(right.updated_at || 0) - new Date(left.updated_at || 0),
    );
  $("#candidateFeedCount").innerHTML =
    `Menampilkan <strong>${filtered.length} profil pencari kerja</strong>`;
  results.innerHTML = filtered.length
    ? filtered.map(renderCandidateInlineCard).join("")
    : '<div class="empty-state"><strong>Belum ada profil yang cocok</strong>Coba ubah kata kunci, lokasi, atau bidang pencarian.</div>';
  results.setAttribute("aria-busy", "false");
}
const RANTAU_LOCAL_KEY = "jobhub-rantau-listings";
const RANTAU_LOCATION_CACHE_KEY = "jobhub-rantau-location-index-v1";
const RANTAU_PLANS = [
  {
    id: "free",
    name: "Gratis 14 Hari",
    price: "Gratis",
    listingLimit: 1,
    durationDays: 14,
    features: ["1 listing aktif", "Masa coba 14 hari", "Galeri hingga 6 foto"],
  },
  {
    id: "starter",
    name: "Rantau Starter",
    price: "Rp100.000",
    listingLimit: 5,
    durationDays: 30,
    features: [
      "5 listing aktif",
      "Galeri hingga 6 foto",
      "Pesan calon penyewa",
    ],
  },
  {
    id: "pro",
    name: "Rantau Pro",
    price: "Rp250.000",
    listingLimit: 20,
    durationDays: 30,
    features: [
      "20 listing aktif",
      "Prioritas tampil",
      "Statistik minat & pesan",
    ],
  },
];
let rantauBackendAvailable = true;
let rantauMessagesBackendAvailable = true;
let rantauListingsCache = [];
let rantauOwnerListingsCache = [];
let rantauLocationIndex = [];
let rantauProvinceNames = [];
let rantauLocationLoadPromise = null;
let rantauListingStatsChannel = null;
const RANTAU_VIEWER_KEY_STORAGE = "jobhub-rantau-viewer-key";
let RANTAU_VIEWER_KEY = "";
try {
  RANTAU_VIEWER_KEY = localStorage.getItem(RANTAU_VIEWER_KEY_STORAGE) || "";
} catch (error) {
  RANTAU_VIEWER_KEY = "";
}
if (!RANTAU_VIEWER_KEY) {
  RANTAU_VIEWER_KEY = `rantau-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
  try {
    localStorage.setItem(RANTAU_VIEWER_KEY_STORAGE, RANTAU_VIEWER_KEY);
  } catch (error) {}
}
const RANTAU_NEW_PROVINCE_REGIONS = [
  {
    name: "Papua Selatan",
    regions: ["Merauke", "Boven Digoel", "Mappi", "Asmat"],
  },
  {
    name: "Papua Tengah",
    regions: [
      "Nabire",
      "Paniai",
      "Mimika",
      "Puncak Jaya",
      "Puncak",
      "Dogiyai",
      "Intan Jaya",
      "Deiyai",
    ],
  },
  {
    name: "Papua Pegunungan",
    regions: [
      "Jayawijaya",
      "Pegunungan Bintang",
      "Yahukimo",
      "Tolikara",
      "Mamberamo Tengah",
      "Yalimo",
      "Lanny Jaya",
      "Nduga",
    ],
  },
  {
    name: "Papua Barat Daya",
    regions: [
      "Sorong",
      "Raja Ampat",
      "Sorong Selatan",
      "Maybrat",
      "Tambrauw",
      "Kota Sorong",
    ],
  },
];
function normalizeRantauLocation(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("id-ID")
    .replace(
      /^(kabupaten administrasi|kota administrasi|kabupaten|kota|kab\.)\s*/,
      "",
    )
    .trim();
}
function formatRantauRegionName(value) {
  return String(value || "")
    .trim()
    .toLocaleLowerCase("id-ID")
    .split(/\s+/)
    .map((word, index) => {
      if (word === "dki") return "DKI";
      if (word === "di" && index === 0) return "DI";
      return word.charAt(0).toLocaleUpperCase("id-ID") + word.slice(1);
    })
    .join(" ");
}
function currentProvinceForRantauRegion(region) {
  const regionName = normalizeRantauLocation(region.name);
  const provinceOverride = RANTAU_NEW_PROVINCE_REGIONS.find((item) =>
    item.regions.some((name) => regionName === normalizeRantauLocation(name)),
  );
  return provinceOverride?.name || formatRantauRegionName(region.provinceName);
}
function renderRantauLocationOptions(locations) {
  const datalist = $("#rantauLocationOptions");
  if (!datalist) return;
  datalist.innerHTML = locations
    .map((location) => {
      const shortName = formatRantauRegionName(
        String(location.name || "")
          .replace(
            /^(kabupaten administrasi|kota administrasi|kabupaten|kota|kab\.)\s*/i,
            "",
          )
          .trim(),
      );
      const provinceName = currentProvinceForRantauRegion(location);
      return `<option value="${escapeHtml(shortName)}, ${escapeHtml(provinceName)}" label="${escapeHtml(formatRantauRegionName(location.name))}, ${escapeHtml(provinceName)}"></option>`;
    })
    .join("");
}
function renderRantauProvinceLinks() {
  const container = $("#rantauProvinceLinks");
  if (!container) return;
  container.innerHTML = rantauProvinceNames
    .map(
      (province) =>
        `<button type="button" class="rantau-province-link" data-rantau-province="${escapeHtml(province)}"><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHtml(province)}</button>`,
    )
    .join("");
  const count = $("#rantauProvinceCount");
  if (count) count.textContent = `${rantauProvinceNames.length} provinsi`;
}
function provinceForRantauListing(listing) {
  const listingLocation = normalizeRantauLocation(
    `${listing.location || ""} ${listing.owner_city || ""}`,
  );
  const matchedRegion = rantauLocationIndex
    .filter((region) =>
      listingLocation.includes(normalizeRantauLocation(region.name)),
    )
    .sort(
      (left, right) =>
        normalizeRantauLocation(right.name).length -
        normalizeRantauLocation(left.name).length,
    )[0];
  if (matchedRegion) return currentProvinceForRantauRegion(matchedRegion) || "";
  const latestProvince = RANTAU_NEW_PROVINCE_REGIONS.find((province) =>
    province.regions.some((region) =>
      listingLocation.includes(normalizeRantauLocation(region)),
    ),
  );
  return latestProvince?.name || "";
}
async function loadRantauLocationIndex() {
  if (rantauLocationLoadPromise) return rantauLocationLoadPromise;
  const status = $("#rantauLocationStatus");
  if (status)
    status.textContent = "Memuat daftar kabupaten dan kota Indonesia...";
  rantauLocationLoadPromise = (async () => {
    try {
      const locations = await window.JobHubAddress?.getAllRegencies();
      if (Array.isArray(locations) && locations.length) {
        rantauLocationIndex = locations;
        writeStoredJson(RANTAU_LOCATION_CACHE_KEY, {
          savedAt: new Date().toISOString(),
          locations,
        });
      } else throw new Error("Data wilayah nasional belum tersedia.");
    } catch (error) {
      const cached = readStoredJson(RANTAU_LOCATION_CACHE_KEY, {});
      rantauLocationIndex = Array.isArray(cached.locations)
        ? cached.locations
        : [];
      if (status)
        status.textContent = rantauLocationIndex.length
          ? "Memakai cache lokasi Indonesia. Anda juga dapat mengetik lokasi secara manual."
          : "Daftar lokasi belum dapat dimuat. Anda tetap dapat mengetik nama kabupaten atau kota.";
    }
    renderRantauLocationOptions(rantauLocationIndex);
    rantauProvinceNames = [
      ...new Set(
        [
          ...rantauLocationIndex.map(currentProvinceForRantauRegion),
          ...RANTAU_NEW_PROVINCE_REGIONS.map((province) => province.name),
        ].filter(Boolean),
      ),
    ].sort((left, right) => left.localeCompare(right, "id"));
    renderRantauProvinceLinks();
    if (status && rantauLocationIndex.length)
      status.textContent = `${rantauLocationIndex.length} kabupaten/kota tersedia di seluruh Indonesia.`;
    return rantauLocationIndex;
  })().finally(() => {
    rantauLocationLoadPromise = null;
  });
  return rantauLocationLoadPromise;
}
function saveLocalRantauListings(listings) {
  writeStoredJson(RANTAU_LOCAL_KEY, Array.isArray(listings) ? listings : []);
}
function isMissingRantauTable(error) {
  return (
    ["42P01", "PGRST205"].includes(error?.code) ||
    /jobhub_rantau_listings.*(not found|does not exist)|schema cache/i.test(
      error?.message || "",
    )
  );
}
async function loadRantauListings(ownOnly = false) {
  if (supabaseClient && rantauBackendAvailable) {
    let request = supabaseClient
      .from("jobhub_rantau_listings")
      .select("*")
      .order("created_at", { ascending: false });
    if (ownOnly)
      request = request.eq("owner_id", supabaseSession?.user?.id || "");
    else request = request.eq("status", "active");
    const { data, error } = await request;
    if (error) {
      if (!isMissingRantauTable(error)) throw error;
      rantauBackendAvailable = false;
    } else
      return (data || []).map((listing) =>
        applyRantauProfileToListing(listing),
      );
  }
  const listings = readStoredArray(RANTAU_LOCAL_KEY).map((listing) =>
    applyRantauProfileToListing(listing),
  );
  if (ownOnly)
    return listings.filter(
      (item) => item.owner_id === supabaseSession?.user?.id,
    );
  return listings.filter((item) => item.status === "active");
}
function safeRantauPhotoUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch (error) {
    return "";
  }
}
function rantauPhotos(listing) {
  const photos = Array.isArray(listing.photo_urls) ? listing.photo_urls : [];
  return [
    ...new Set(
      [...photos, listing.photo_url].map(safeRantauPhotoUrl).filter(Boolean),
    ),
  ].slice(0, 6);
}
function mergeRantauListingPhotos(existingPhotos, newPhotos) {
  return [
    ...new Set(
      [
        ...(Array.isArray(existingPhotos) ? existingPhotos : []),
        ...(Array.isArray(newPhotos) ? newPhotos : []),
      ]
        .map(safeRantauPhotoUrl)
        .filter(Boolean),
    ),
  ].slice(0, 6);
}
function formatRantauPrice(value) {
  return `Rp${new Intl.NumberFormat("id-ID").format(Number(value) || 0)}`;
}
function formatRantauCount(value) {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  if (count >= 1000000)
    return `${(count / 1000000).toFixed(count >= 10000000 ? 0 : 1)} jt`;
  if (count >= 1000)
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)} rb`;
  return String(count);
}
function rantauViewerKey() {
  const userId = supabaseSession?.user?.id || "";
  return userId ? `user-${userId}` : RANTAU_VIEWER_KEY;
}
async function recordRantauListingInteraction(listingId, eventType) {
  if (!listingId) return;
  const applyLocal = () => {
    const key = `${eventType}:${listingId}`;
    const recorded = readStoredArray("jobhub-rantau-interactions");
    if (recorded.includes(key)) return;
    writeStoredJson("jobhub-rantau-interactions", [...recorded, key]);
    const field = eventType === "view" ? "view_count" : "offer_count";
    const listings = readStoredArray(RANTAU_LOCAL_KEY).map((item) =>
      String(item.id) === String(listingId)
        ? { ...item, [field]: Math.max(0, Number(item[field]) || 0) + 1 }
        : item,
    );
    saveLocalRantauListings(listings);
    const listing = listings.find(
      (item) => String(item.id) === String(listingId),
    );
    if (listing)
      applyRantauListingStats(
        listingId,
        listing.view_count,
        listing.offer_count,
      );
  };
  if (supabaseClient && rantauBackendAvailable) {
    try {
      const { data, error } = await supabaseClient.rpc(
        "increment_jobhub_rantau_listing_interaction",
        {
          p_listing_id: listingId,
          p_viewer_key: rantauViewerKey(),
          p_event_type: eventType,
        },
      );
      if (error) {
        applyLocal();
        return;
      }
      if (data?.[0])
        applyRantauListingStats(
          listingId,
          data[0].view_count,
          data[0].offer_count,
        );
    } catch (error) {
      applyLocal();
      console.warn(
        "Rantau interaction could not use Supabase:",
        error.message || error,
      );
    }
  } else applyLocal();
}
function applyRantauListingStats(listingId, viewCount, offerCount) {
  [rantauListingsCache, rantauOwnerListingsCache].forEach((cache) => {
    const index = cache.findIndex(
      (item) => String(item.id) === String(listingId),
    );
    if (index >= 0)
      cache[index] = {
        ...cache[index],
        view_count: Number(viewCount) || 0,
        offer_count: Number(offerCount) || 0,
      };
  });
  document
    .querySelectorAll(`[data-rantau-stats="${CSS.escape(String(listingId))}"]`)
    .forEach((stats) => {
      stats.querySelector("[data-rantau-view-count]").textContent =
        formatRantauCount(viewCount);
      stats.querySelector("[data-rantau-offer-count]").textContent =
        formatRantauCount(offerCount);
    });
}
function connectRantauListingStatsRealtime() {
  if (!supabaseClient || rantauListingStatsChannel) return;
  rantauListingStatsChannel = supabaseClient
    .channel("jobhub-rantau-listing-stats")
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "jobhub_rantau_listings" },
      (payload) => {
        const listing = payload.new || {};
        applyRantauListingStats(
          listing.id,
          listing.view_count,
          listing.offer_count,
        );
      },
    )
    .subscribe();
}
function rantauPaymentPeriod(propertyType) {
  return String(propertyType || "Kos").toLocaleLowerCase("id-ID") ===
    "kontrakan"
    ? "tahun"
    : "bulan";
}
function rantauPricePeriodLabel(propertyType) {
  return rantauPaymentPeriod(propertyType) === "tahun" ? "/ tahun" : "/ bulan";
}
function rantauCountOptions(selected = 0) {
  const current = Math.max(0, Math.min(20, Math.floor(Number(selected) || 0)));
  return `<option value="0" ${current === 0 ? "selected" : ""}>Tidak ada</option>${Array.from(
    { length: 20 },
    (_, index) => {
      const value = index + 1;
      return `<option value="${value}" ${current === value ? "selected" : ""}>${value}</option>`;
    },
  ).join("")}`;
}
function updateRantauFormPaymentLabel(propertyType) {
  const period = rantauPaymentPeriod(propertyType);
  const priceLabel = $("[data-rantau-price-label]");
  if (priceLabel) priceLabel.textContent = `Harga per ${period} (Rp)`;
  const sharing = $("[data-rantau-sharing-option]");
  if (sharing) sharing.hidden = String(propertyType || "Kos") !== "Kos";
}
function rantauFacilityIcon(label = "") {
  const text = String(label || "").toLocaleLowerCase("id-ID");
  const rules = [
    [/wifi|wi-fi|internet|jaring/, "fa-wifi"],
    [/ac|air conditioner/, "fa-snowflake"],
    [/tempat tidur|kasur|spring bed/, "fa-bed"],
    [/lemari|almari/, "fa-shirt"],
    [/meja|kursi/, "fa-chair"],
    [/kamar mandi|wc|bath/, "fa-bath"],
    [/kamar tidur|bedroom/, "fa-bed"],
    [/ruang tamu|living/, "fa-couch"],
    [/dapur|kitchen/, "fa-kitchen-set"],
    [/parkir|garasi|carport/, "fa-car"],
    [/tv|televisi/, "fa-tv"],
    [/kulkas|lemari es|refrigerator/, "fa-temperature-low"],
    [/mesin cuci|laundry/, "fa-shirt"],
    [/water heater|pemanas air/, "fa-temperature-high"],
    [/listrik|token/, "fa-bolt"],
    [/keamanan|cctv|satpam/, "fa-shield-halved"],
    [/lift|elevator/, "fa-elevator"],
    [/gym|fitness/, "fa-dumbbell"],
    [/kolam|pool/, "fa-person-swimming"],
    [/balkon/, "fa-house"],
    [/taman|garden/, "fa-tree"],
    [/setrika/, "fa-shirt"],
    [/dispenser|galon/, "fa-faucet-drip"],
    [/keluarga/, "fa-users"],
  ];
  return (
    rules.find(([pattern]) => pattern.test(text))?.[1] || "fa-circle-check"
  );
}
function rantauFacilityItems(listing) {
  const items = [];
  const add = (count, label, icon) => {
    if (Number(count) > 0)
      items.push({ icon, label: `${Number(count)} ${label}` });
  };
  add(listing.room_count, "Kamar", "fa-bed");
  add(listing.bedroom_count, "Kamar Tidur", "fa-bed");
  add(listing.living_room_count, "Ruang Tamu", "fa-couch");
  add(listing.kitchen_count, "Dapur", "fa-kitchen-set");
  add(listing.bathroom_count, "Kamar Mandi", "fa-bath");
  add(listing.parking_capacity, "Tempat Parkir", "fa-car");
  add(listing.guest_capacity, "Orang Bisa Tinggal", "fa-users");
  if (listing.property_type === "Kos" && listing.sharing_allowed)
    items.push({
      icon: "fa-user-group",
      label:
        listing.sharing_allowed === "yes"
          ? "Boleh bersama teman"
          : "Tidak boleh bersama teman",
    });
  (Array.isArray(listing.facilities) ? listing.facilities : []).forEach(
    (item) => {
      if (item && item.trim())
        items.push({ icon: rantauFacilityIcon(item), label: item.trim() });
    },
  );
  return items;
}
function renderRantauListingCard(listing, owner = false) {
  const photo = rantauPhotos(listing)[0];
  const photoMarkup = photo
    ? `<img src="${escapeHtml(photo)}" alt="Foto ${escapeHtml(listing.title)}" loading="lazy">`
    : '<div class="rantau-listing-placeholder"><i class="fa-solid fa-house" aria-hidden="true"></i><span>Hunian JobHub Rantau</span></div>';
  const ownerName = listing.owner_name || "Pemilik terdaftar";
  const ownerAvatar = safeRantauPhotoUrl(listing.owner_avatar_url);
  const ownerMarkup = `<span class="rantau-card-owner">${ownerAvatar ? `<img src="${escapeHtml(ownerAvatar)}" alt="">` : '<i class="fa-solid fa-user" aria-hidden="true"></i>'}<span>${escapeHtml(ownerName)}</span></span>`;
  const stats = `<span class="rantau-listing-stats" data-rantau-stats="${escapeHtml(listing.id)}"><span><i class="fa-solid fa-eye" aria-hidden="true"></i><strong data-rantau-view-count>${formatRantauCount(listing.view_count)}</strong> dilihat</span><span><i class="fa-solid fa-handshake" aria-hidden="true"></i><strong data-rantau-offer-count>${formatRantauCount(listing.offer_count)}</strong> tawaran</span></span>`;
  const detail = `<article class="rantau-listing-card"><button class="rantau-card-photo" type="button" data-rantau-detail="${escapeHtml(listing.id)}" aria-label="Lihat foto dan detail ${escapeHtml(listing.title)}">${photoMarkup}<span class="rantau-photo-count"><i class="fa-solid fa-images" aria-hidden="true"></i> ${rantauPhotos(listing).length || 1} foto</span></button><div class="rantau-listing-body"><div class="rantau-listing-meta"><span><i class="fa-solid fa-house" aria-hidden="true"></i> ${escapeHtml(listing.property_type || "Hunian")}</span><span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(listing.location || "")}</span></div><button class="rantau-card-title" type="button" data-rantau-detail="${escapeHtml(listing.id)}">${escapeHtml(listing.title || "Hunian")}</button><p class="rantau-listing-description">${escapeHtml(listing.description || "")}</p>${ownerMarkup}${stats}<div class="rantau-listing-footer"><strong><i class="fa-solid fa-wallet" aria-hidden="true"></i> ${formatRantauPrice(listing.price_monthly)}<small> ${rantauPricePeriodLabel(listing.property_type)}</small></strong>${owner ? `<div class="rantau-listing-actions"><button type="button" class="btn btn-outline btn-small" data-rantau-toggle="${escapeHtml(listing.id)}" data-next-status="${listing.status === "active" ? "hidden" : "active"}">${listing.status === "active" ? "Sembunyikan" : "Tampilkan"}</button><button type="button" class="btn btn-outline btn-small rantau-edit-button" data-rantau-edit="${escapeHtml(listing.id)}" aria-label="Edit ${escapeHtml(listing.title)}"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Edit</button><button type="button" class="btn btn-outline btn-small rantau-delete-button" data-rantau-delete="${escapeHtml(listing.id)}" aria-label="Hapus ${escapeHtml(listing.title)}"><i class="fa-solid fa-trash" aria-hidden="true"></i> Hapus</button></div>` : `<button type="button" class="btn btn-small rantau-contact-button" data-rantau-message="${escapeHtml(listing.id)}"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Chat pemilik</button>`}</div></div></article>`;
  return detail;
}
function renderRantauListingResults() {
  const results = $("#rantauListingResults");
  if (!results) return;
  const query = String($("#rantauQuery").value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const locationQuery = String($("#rantauLocation")?.value || "").trim();
  const locationTokens = locationQuery
    .split(",")
    .map(normalizeRantauLocation)
    .filter(Boolean);
  const type = $("#rantauType").value;
  const filtered = rantauListingsCache.filter((listing) => {
    if (type && listing.property_type !== type) return false;
    if (
      query &&
      !`${listing.title || ""} ${listing.location || ""} ${listing.description || ""} ${(listing.facilities || []).join(" ")}`
        .toLocaleLowerCase("id-ID")
        .includes(query)
    )
      return false;
    if (locationTokens.length) {
      const listingLocation = normalizeRantauLocation(
        `${listing.location || ""} ${listing.owner_city || ""}`,
      );
      const province = normalizeRantauLocation(
        provinceForRantauListing(listing),
      );
      const searchableLocation = `${listingLocation} ${province}`;
      if (!locationTokens.every((token) => searchableLocation.includes(token)))
        return false;
    }
    return true;
  });
  const sort = $("#rantauSort");
  if (sort?.value === "price-low")
    filtered.sort(
      (left, right) => Number(left.price_monthly) - Number(right.price_monthly),
    );
  else if (sort?.value === "price-high")
    filtered.sort(
      (left, right) => Number(right.price_monthly) - Number(left.price_monthly),
    );
  $("#rantauResultsCount").textContent = `${filtered.length} hunian tersedia`;
  results.innerHTML = filtered.length
    ? filtered.map((listing) => renderRantauListingCard(listing)).join("")
    : '<div class="empty-state rantau-empty-state"><strong>Belum ada hunian yang cocok</strong>Ubah kata pencarian atau kembali lagi nanti untuk melihat listing baru.</div>';
}
function updateRantauHeroHeight() {
  const header = $(".topbar");
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;
  const headerHeight = header?.getBoundingClientRect().height || 76;
  document.documentElement.style.setProperty(
    "--rantau-hero-height",
    `${Math.max(320, viewportHeight - headerHeight)}px`,
  );
}
window.addEventListener("resize", () => {
  if (activeRoute === "rantau") updateRantauHeroHeight();
});
async function renderRantauMarketplace() {
  const results = $("#rantauListingResults");
  if (!results) return;
  updateRantauHeroHeight();
  results.setAttribute("aria-busy", "true");
  results.innerHTML = loadingIndicator("Memuat hunian...");
  try {
    rantauListingsCache = await loadRantauListings();
    connectRantauListingStatsRealtime();
    renderRantauListingResults();
  } catch (error) {
    results.innerHTML = `<div class="empty-state"><strong>Hunian belum dapat dimuat</strong>${escapeHtml(error.message || "Periksa koneksi dan kebijakan tabel JobHub Rantau.")}</div>`;
  }
  results.setAttribute("aria-busy", "false");
  const form = $("#rantauSearchForm");
  if (form && !form.dataset.bound) {
    form.dataset.bound = "true";
    form.addEventListener("input", renderRantauListingResults);
    form.addEventListener("change", renderRantauListingResults);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();
      searchRantauListings(event);
    });
  }
  const searchButton = form?.querySelector(".rantau-hero-search-button");
  if (searchButton && !searchButton.dataset.bound) {
    searchButton.dataset.bound = "true";
    searchButton.addEventListener("click", (event) => {
      event.preventDefault();
      searchRantauListings(event);
    });
  }
  loadRantauLocationIndex();
}
async function searchRantauListings(event) {
  if (event) event.preventDefault();
  const results = $("#rantauListingResults");
  if (results) results.setAttribute("aria-busy", "true");
  try {
    rantauListingsCache = await loadRantauListings();
    renderRantauListingResults();
  } catch (error) {
    if (results)
      results.innerHTML = `<div class="empty-state"><strong>Pencarian belum dapat dimuat</strong>${escapeHtml(error.message || "Periksa koneksi dan coba lagi.")}</div>`;
  } finally {
    if (results) {
      results.setAttribute("aria-busy", "false");
      results.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
document.addEventListener("submit", (event) => {
  if (event.target?.id === "rantauSearchForm") {
    event.preventDefault();
    searchRantauListings(event);
  }
});
function rantauPlanForUser() {
  const key = `jobhub-rantau-plan:${supabaseSession?.user?.id || "guest"}`;
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(key) || "{}");
  } catch (error) {
    state = {};
  }
  if (!state.planId) {
    state = {
      planId: "free",
      startedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(state));
  }
  const plan =
    RANTAU_PLANS.find((item) => item.id === state.planId) || RANTAU_PLANS[0];
  return plan.id === "free" && new Date(state.expiresAt) <= new Date()
    ? { ...plan, name: "Masa gratis berakhir", listingLimit: 0, expired: true }
    : plan;
}
function renderRantauPackages() {
  const grid = $("#rantauPackageGrid");
  if (!grid) return;
  const activePlan = rantauPlanForUser();
  grid.innerHTML = RANTAU_PLANS.map(
    (plan) =>
      `<article class="rantau-package-card${plan.id === activePlan.id ? " is-selected" : ""}"><div><span>${plan.id === "free" ? "COBA 14 HARI" : plan.id === "pro" ? "UNTUK PEMILIK AKTIF" : "UNTUK PEMILIK BERKEMBANG"}</span><h3>${plan.name}</h3><strong>${plan.price}<small>${plan.id === "free" ? " / 14 hari" : " / 30 hari"}</small></strong></div><ul>${plan.features.map((feature) => `<li><i class="fa-solid fa-check" aria-hidden="true"></i>${feature}</li>`).join("")}</ul><button class="btn ${plan.id === activePlan.id ? "btn-outline" : ""}" type="button" data-rantau-plan="${plan.id}" ${plan.id === activePlan.id ? "disabled" : ""}>${plan.id === activePlan.id ? "Paket aktif" : plan.id === "free" ? "Mulai gratis" : "Pilih paket"}</button></article>`,
  ).join("");
}
function rantauProfile() {
  const user = supabaseSession?.user;
  const profile = user?.user_metadata?.marketplace_profile || {};
  return {
    fullName: String(
      profile.full_name ||
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        "",
    ).trim(),
    whatsapp: String(
      profile.whatsapp || user?.user_metadata?.whatsapp || "",
    ).trim(),
    city: String(profile.city || "").trim(),
    avatarUrl: String(profile.avatar_url || "").trim(),
    coverUrl: String(profile.cover_url || "").trim(),
    about: String(profile.about || "").trim(),
  };
}
function normalizeRantauWhatsApp(value = "") {
  let digits = String(value || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  else if (digits.startsWith("8")) digits = `62${digits}`;
  return /^62\d{8,13}$/.test(digits) ? digits : "";
}
function rantauProfileIsComplete(profile = rantauProfile()) {
  return Boolean(
    profile.fullName &&
      normalizeRantauWhatsApp(profile.whatsapp) &&
      profile.city,
  );
}
function fillRantauProfileForm() {
  const profile = rantauProfile();
  const form = $("#rantauProfileForm");
  if (!form) return;
  form.elements.fullName.value = profile.fullName;
  form.elements.whatsapp.value = profile.whatsapp;
  form.elements.city.value = profile.city;
  form.elements.about.value = profile.about;
  const avatarUrl = safeRantauPhotoUrl(profile.avatarUrl);
  const coverUrl = safeRantauPhotoUrl(profile.coverUrl);
  $("#rantauSidebarProfile").innerHTML =
    `${avatarUrl ? `<img src="${escapeHtml(avatarUrl)}" alt="">` : '<i class="fa-solid fa-user" aria-hidden="true"></i>'}<span><strong>${escapeHtml(profile.fullName || "Lengkapi profil")}</strong><small>${escapeHtml(profile.city || supabaseSession?.user?.email || "Pemilik hunian")}</small></span>`;
  const avatarPreview = $("#rantauAvatarPreview");
  if (avatarPreview)
    avatarPreview.innerHTML = avatarUrl
      ? `<img src="${escapeHtml(avatarUrl)}" alt="Foto profil ${escapeHtml(profile.fullName)}">`
      : '<i class="fa-solid fa-user" aria-hidden="true"></i>';
  const coverPreview = $("#rantauCoverPreview");
  if (coverPreview)
    coverPreview.innerHTML = coverUrl
      ? `<img src="${escapeHtml(coverUrl)}" alt="Pratinjau foto sampul">`
      : '<i class="fa-solid fa-image" aria-hidden="true"></i>';
  const dashboardCover = $("#rantauDashboardCover");
  const dashboardCoverImage = $("#rantauDashboardCoverImage");
  if (dashboardCover && dashboardCoverImage) {
    dashboardCover.hidden = !coverUrl;
    if (coverUrl) dashboardCoverImage.src = coverUrl;
    else dashboardCoverImage.removeAttribute("src");
  }
}
function renderRantauEmptyListings() {
  return '<div class="rantau-listing-empty"><span><i class="fa-solid fa-clipboard-list" aria-hidden="true"></i><i class="fa-solid fa-circle-plus" aria-hidden="true"></i></span><div><strong>Mulai dari hunian pertama</strong><p>Pasang hunian Anda dan mulai terima pertanyaan calon penyewa.</p><button class="btn btn-small" type="button" data-open-rantau-form><i class="fa-solid fa-house" aria-hidden="true"></i> Pasang hunian</button></div></div>';
}
function compressRantauImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const scale = Math.min(
        1,
        1400 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas
        .getContext("2d")
        .drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.76));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Foto ${file.name} tidak dapat dibaca.`));
    };
    image.src = objectUrl;
  });
}
async function uploadRantauProfileImage(file, kind) {
  if (!(file instanceof File) || !file.size) return "";
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > 5 * 1024 * 1024
  )
    throw new Error("Gunakan foto JPG, PNG, atau WebP maksimal 5 MB.");
  if (supabaseClient && supabaseSession?.user?.id) {
    const extension =
      file.type === "image/png"
        ? "png"
        : file.type === "image/webp"
          ? "webp"
          : "jpg";
    const path = `${supabaseSession.user.id}/profile/${kind}-${Date.now()}.${extension}`;
    const { error } = await supabaseClient.storage
      .from("rantau-listing-photos")
      .upload(path, file, { contentType: file.type, upsert: true });
    if (error) throw error;
    return supabaseClient.storage
      .from("rantau-listing-photos")
      .getPublicUrl(path).data.publicUrl;
  }
  return compressRantauImage(file);
}
function applyRantauProfileToListing(listing, profile = rantauProfile()) {
  if (!listing || listing.owner_id !== supabaseSession?.user?.id)
    return listing;
  return {
    ...listing,
    owner_name: profile.fullName || listing.owner_name || "",
    owner_avatar_url:
      safeRantauPhotoUrl(profile.avatarUrl) || listing.owner_avatar_url || "",
    owner_city: profile.city || listing.owner_city || "",
    owner_about: profile.about || listing.owner_about || "",
  };
}
async function syncRantauProfileToListings(profile) {
  const userId = supabaseSession?.user?.id;
  if (!userId) return;
  const changes = {
    owner_name: profile.full_name,
    owner_avatar_url: safeRantauPhotoUrl(profile.avatar_url),
    owner_city: profile.city,
    owner_about: profile.about,
    contact_whatsapp: normalizeRantauWhatsApp(profile.whatsapp) || "",
    updated_at: new Date().toISOString(),
  };
  if (supabaseClient && rantauBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_listings")
      .update(changes)
      .eq("owner_id", userId);
    if (error) throw error;
  } else {
    const listings = readStoredArray(RANTAU_LOCAL_KEY).map((listing) =>
      listing.owner_id === userId
        ? { ...listing, ...changes, updated_at: changes.updated_at }
        : listing,
    );
    writeStoredJson(RANTAU_LOCAL_KEY, listings);
  }
  rantauOwnerListingsCache = rantauOwnerListingsCache.map((listing) =>
    applyRantauProfileToListing(listing, {
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      city: profile.city,
      about: profile.about,
    }),
  );
  rantauListingsCache = rantauListingsCache.map((listing) =>
    applyRantauProfileToListing(listing, {
      fullName: profile.full_name,
      avatarUrl: profile.avatar_url,
      city: profile.city,
      about: profile.about,
    }),
  );
}
async function uploadRantauPhotos(files) {
  const selected = Array.from(files || []).filter(
    (file) => file instanceof File && file.name && file.size > 0,
  );
  if (selected.length > 6)
    throw new Error("Maksimal 6 foto untuk setiap hunian.");
  if (
    selected.some(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    )
  )
    throw new Error(
      "Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 5 MB per file.",
    );
  const urls = [];
  for (const [index, file] of selected.entries()) {
    if (supabaseClient && rantauBackendAvailable) {
      const extension =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";
      const path = `${supabaseSession.user.id}/${Date.now()}-${index}.${extension}`;
      const { error } = await supabaseClient.storage
        .from("rantau-listing-photos")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      urls.push(
        supabaseClient.storage.from("rantau-listing-photos").getPublicUrl(path)
          .data.publicUrl,
      );
    } else urls.push(await compressRantauImage(file));
  }
  return urls;
}
async function renderRantauDashboard() {
  if (!isRantauAccount()) return;
  connectRantauMessagesRealtime();
  connectRantauListingStatsRealtime();
  loadRantauUnreadCount().catch((error) =>
    console.warn("Rantau unread count could not load:", error.message || error),
  );
  fillRantauProfileForm();
  const listings = $("#rantauOwnerListings");
  if (!listings) return;
  listings.innerHTML = loadingIndicator("Memuat listing Anda...");
  try {
    rantauOwnerListingsCache = await loadRantauListings(true);
    const activeCount = rantauOwnerListingsCache.filter(
      (item) => item.status === "active",
    ).length;
    const plan = rantauPlanForUser();
    $("#rantauOwnerSummary").innerHTML =
      `<div class="rantau-stat-card is-blue"><span class="rantau-stat-icon"><i class="fa-solid fa-house" aria-hidden="true"></i></span><div><span>Listing aktif</span><strong>${activeCount} <small>/ ${plan.listingLimit}</small></strong></div><i class="fa-solid fa-chevron-right rantau-stat-chevron" aria-hidden="true"></i></div><div class="rantau-stat-card is-green"><span class="rantau-stat-icon"><i class="fa-solid fa-calendar-days" aria-hidden="true"></i></span><div><span>Paket saat ini</span><strong>${escapeHtml(plan.name)}</strong></div><i class="fa-solid fa-chevron-right rantau-stat-chevron" aria-hidden="true"></i></div><div class="rantau-stat-card is-purple"><span class="rantau-stat-icon"><i class="fa-solid fa-shield-halved" aria-hidden="true"></i></span><div><span>Profil pemilik</span><strong>${rantauProfileIsComplete() ? "Terverifikasi" : "Perlu dilengkapi"}</strong></div><i class="fa-solid fa-chevron-right rantau-stat-chevron" aria-hidden="true"></i></div>`;
    $("#rantauOwnerListingCount").textContent =
      `${rantauOwnerListingsCache.length} listing`;
    listings.innerHTML = rantauOwnerListingsCache.length
      ? rantauOwnerListingsCache
          .map((item) => renderRantauListingCard(item, true))
          .join("")
      : renderRantauEmptyListings();
    const recentListings = $("#rantauRecentListings");
    if (recentListings)
      recentListings.innerHTML = rantauOwnerListingsCache.length
        ? rantauOwnerListingsCache
            .slice(0, 2)
            .map((item) => renderRantauListingCard(item, true))
            .join("")
        : renderRantauEmptyListings();
    if (plan.expired)
      toast(
        "Masa gratis JobHub Rantau sudah berakhir. Pilih paket untuk mengaktifkan listing kembali.",
      );
    renderRantauPackages();
  } catch (error) {
    listings.innerHTML = `<div class="empty-state"><strong>Dashboard belum dapat dimuat</strong>${escapeHtml(error.message || "Periksa koneksi dan kebijakan tabel JobHub Rantau.")}</div>`;
  }
}
function openRantauEditForm(listingId) {
  const listing = rantauOwnerListingsCache.find(
    (item) => String(item.id) === String(listingId),
  );
  if (!listing || listing.owner_id !== supabaseSession?.user?.id) return;
  const oldPhotos = rantauPhotos(listing);
  openModal(
    "Edit hunian di JobHub Rantau",
    `<form><div class="form-row"><label for="rantauListingTitle">Nama hunian</label><input id="rantauListingTitle" name="title" required maxlength="120" value="${escapeHtml(listing.title || "")}"></div><div class="form-row"><label for="rantauListingType">Jenis hunian</label><select id="rantauListingType" name="propertyType" required><option value="Kos" ${listing.property_type === "Kos" ? "selected" : ""}>Kos</option><option value="Kontrakan" ${listing.property_type === "Kontrakan" ? "selected" : ""}>Kontrakan</option></select></div><div class="form-row"><label for="rantauListingLocation">Kota dan area</label><input id="rantauListingLocation" name="location" required maxlength="120" value="${escapeHtml(listing.location || "")}"></div><div class="rantau-form-grid"><div class="form-row"><label for="rantauListingPrice"><span data-rantau-price-label>${listing.property_type === "Kontrakan" ? "Harga per tahun (Rp)" : "Harga per bulan (Rp)"}</span></label><input id="rantauListingPrice" name="price" type="number" min="100000" max="100000000" required value="${Number(listing.price_monthly) || ""}"></div></div><div class="rantau-form-grid"><div class="form-row"><label for="rantauListingRooms">Jumlah kamar</label><select id="rantauListingRooms" name="roomCount">${rantauCountOptions(listing.room_count)}</select></div><div class="form-row"><label for="rantauListingBedrooms">Jumlah kamar tidur</label><select id="rantauListingBedrooms" name="bedroomCount">${rantauCountOptions(listing.bedroom_count)}</select></div><div class="form-row"><label for="rantauListingLivingRooms">Jumlah ruang tamu</label><select id="rantauListingLivingRooms" name="livingRoomCount">${rantauCountOptions(listing.living_room_count)}</select></div><div class="form-row"><label for="rantauListingKitchens">Jumlah dapur</label><select id="rantauListingKitchens" name="kitchenCount">${rantauCountOptions(listing.kitchen_count)}</select></div><div class="form-row"><label for="rantauListingBathrooms">Jumlah kamar mandi</label><select id="rantauListingBathrooms" name="bathroomCount">${rantauCountOptions(listing.bathroom_count)}</select></div><div class="form-row"><label for="rantauListingParking">Kapasitas parkiran</label><select id="rantauListingParking" name="parkingCapacity">${rantauCountOptions(listing.parking_capacity)}</select></div><div class="form-row"><label for="rantauListingGuestCapacity">Muatan penghuni</label><select id="rantauListingGuestCapacity" name="guestCapacity">${rantauCountOptions(listing.guest_capacity)}</select></div></div><div class="form-row" data-rantau-sharing-option ${listing.property_type === "Kos" ? "" : "hidden"}><label for="rantauListingSharing">Boleh bersama teman untuk kos?</label><select id="rantauListingSharing" name="sharingAllowed"><option value="yes" ${listing.sharing_allowed === "yes" ? "selected" : ""}>Boleh bersama teman</option><option value="no" ${listing.sharing_allowed === "no" ? "selected" : ""}>Tidak boleh bersama teman</option></select></div><div class="form-row"><label for="rantauListingAddress">Alamat detail</label><input id="rantauListingAddress" name="address" required maxlength="240" value="${escapeHtml(listing.address_detail || "")}"></div><div class="form-row"><label for="rantauListingWhatsapp">Nomor WhatsApp pemilik</label><input id="rantauListingWhatsapp" name="whatsapp" type="tel" required maxlength="30" value="${escapeHtml(listing.contact_whatsapp || rantauProfile().whatsapp || "")}" placeholder="Contoh: 081234567890 atau 6281234567890"><small class="form-note">Nomor ini digunakan untuk tombol Chat WhatsApp pada profil postingan.</small></div><div class="form-row"><label for="rantauListingAvailability">Status hunian</label><select id="rantauListingAvailability" name="availability"><option value="Tersedia" ${listing.availability === "Tersedia" ? "selected" : ""}>Tersedia sekarang</option><option value="Segera tersedia" ${listing.availability === "Segera tersedia" ? "selected" : ""}>Segera tersedia</option></select></div><div class="form-row"><label for="rantauListingPhotos">Foto hunian baru (maksimal 6)</label><input id="rantauListingPhotos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple><small class="form-note">Kosongkan jika foto lama tidak ingin diganti. Foto lama saat ini: ${oldPhotos.length} foto. Maksimal total 6 foto.</small><div data-rantau-photo-preview><span>Belum ada foto baru dipilih</span></div></div><div class="form-row"><label for="rantauListingFacilities">Fasilitas (pisahkan dengan koma)</label><input id="rantauListingFacilities" name="facilities" value="${escapeHtml((listing.facilities || []).join(", "))}"></div><div class="form-row"><label for="rantauListingDescription">Deskripsi</label><textarea id="rantauListingDescription" name="description" required minlength="8" maxlength="1200" rows="4">${escapeHtml(listing.description || "")}</textarea></div><div class="form-row"><label for="rantauListingRules">Aturan hunian</label><textarea id="rantauListingRules" name="rules" rows="3" maxlength="600">${escapeHtml(listing.rental_rules || "")}</textarea></div><button class="btn" type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan perubahan</button></form>`,
    async (data) => {
      const photoFiles = data.getAll("photos");
      const selectedNewFiles = photoFiles.filter(
        (file) => file instanceof File && file.size > 0,
      );
      if (oldPhotos.length + selectedNewFiles.length > 6)
        throw new Error(
          `Foto lama ${oldPhotos.length} ditambah foto baru ${selectedNewFiles.length}. Maksimal total 6 foto untuk setiap hunian.`,
        );
      const uploadedPhotos = selectedNewFiles.length
        ? await uploadRantauPhotos(selectedNewFiles)
        : [];
      const newPhotoUrls = mergeRantauListingPhotos(oldPhotos, uploadedPhotos);
      const changes = {
        title: String(data.get("title") || "").trim(),
        property_type: String(data.get("propertyType") || "Kos"),
        location: String(data.get("location") || "").trim(),
        price_monthly: Number(data.get("price")),
        deposit_monthly: 0,
        address_detail: String(data.get("address") || "").trim(),
        room_count: Number(data.get("roomCount")) || 0,
        bedroom_count: Number(data.get("bedroomCount")) || 0,
        living_room_count: Number(data.get("livingRoomCount")) || 0,
        kitchen_count: Number(data.get("kitchenCount")) || 0,
        bathroom_count: Number(data.get("bathroomCount")) || 0,
        parking_capacity: Number(data.get("parkingCapacity")) || 0,
        guest_capacity: Number(data.get("guestCapacity")) || 0,
        sharing_allowed:
          String(data.get("propertyType") || "Kos") === "Kos"
            ? String(data.get("sharingAllowed") || "no")
            : "",
        availability: String(data.get("availability") || "Tersedia"),
        facilities: [
          ...new Set(
            String(data.get("facilities") || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
        ],
        rental_rules: String(data.get("rules") || "").trim(),
        description: String(data.get("description") || "").trim(),
        contact_whatsapp:
          normalizeRantauWhatsApp(data.get("whatsapp")) ||
          normalizeRantauWhatsApp(
            listing.contact_whatsapp || rantauProfile().whatsapp,
          ),
        photo_urls: newPhotoUrls,
        photo_url: newPhotoUrls[0] || "",
      };
      if (!changes.contact_whatsapp)
        throw new Error(
          "Masukkan nomor WhatsApp aktif Indonesia, misalnya 0812xxxx atau 62812xxxx.",
        );
      await updateRantauListing(listingId, changes);
      const updatedListing = {
        ...listing,
        ...changes,
        owner_id: supabaseSession.user.id,
      };
      rantauOwnerListingsCache = rantauOwnerListingsCache.map((item) =>
        String(item.id) === String(listingId) ? updatedListing : item,
      );
      rantauListingsCache = rantauListingsCache.map((item) =>
        String(item.id) === String(listingId) ? updatedListing : item,
      );
      closeModal();
      await renderRantauDashboard();
      toast("Postingan hunian berhasil diperbarui.");
    },
  );
}
function openRantauListingForm() {
  if (!isRantauAccount()) {
    toast("Masuk dengan akun Pengguna JobHub Rantau untuk memasang hunian.");
    openAuthModal(false);
    return;
  }
  if (!rantauProfileIsComplete()) {
    selectRantauDashboardPanel("profile");
    toast(
      "Lengkapi nama, WhatsApp, dan kota domisili sebelum mengunggah hunian.",
    );
    return;
  }
  openModal(
    "Pasang hunian di JobHub Rantau",
    `<form><div class="form-row"><label for="rantauListingTitle">Nama hunian</label><input id="rantauListingTitle" name="title" required maxlength="120" placeholder="Contoh: Kos Melati dekat Stasiun"></div><div class="form-row"><label for="rantauListingType">Jenis hunian</label><select id="rantauListingType" name="propertyType" required><option value="Kos">Kos</option><option value="Kontrakan">Kontrakan</option></select></div><div class="form-row"><label for="rantauListingLocation">Kota dan area</label><input id="rantauListingLocation" name="location" required maxlength="120" placeholder="Contoh: Bandung, Dago"></div><div class="rantau-form-grid"><div class="form-row"><label for="rantauListingPrice"><span data-rantau-price-label>Harga per bulan (Rp)</span></label><input id="rantauListingPrice" name="price" type="number" min="100000" max="100000000" required></div></div><div class="rantau-form-grid"><div class="form-row"><label for="rantauListingRooms">Jumlah kamar</label><select id="rantauListingRooms" name="roomCount">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingBedrooms">Jumlah kamar tidur</label><select id="rantauListingBedrooms" name="bedroomCount">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingLivingRooms">Jumlah ruang tamu</label><select id="rantauListingLivingRooms" name="livingRoomCount">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingKitchens">Jumlah dapur</label><select id="rantauListingKitchens" name="kitchenCount">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingBathrooms">Jumlah kamar mandi</label><select id="rantauListingBathrooms" name="bathroomCount">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingParking">Kapasitas parkiran</label><select id="rantauListingParking" name="parkingCapacity">${rantauCountOptions(0)}</select></div><div class="form-row"><label for="rantauListingGuestCapacity">Muatan penghuni</label><select id="rantauListingGuestCapacity" name="guestCapacity">${rantauCountOptions(0)}</select></div></div><div class="form-row" data-rantau-sharing-option><label for="rantauListingSharing">Boleh bersama teman untuk kos?</label><select id="rantauListingSharing" name="sharingAllowed"><option value="yes">Boleh bersama teman</option><option value="no">Tidak boleh bersama teman</option></select></div><div class="form-row"><label for="rantauListingAddress">Alamat detail</label><input id="rantauListingAddress" name="address" required maxlength="240" placeholder="Jalan, kelurahan, dan patokan terdekat"></div><div class="form-row"><label for="rantauListingAvailability">Status hunian</label><select id="rantauListingAvailability" name="availability"><option value="Tersedia">Tersedia sekarang</option><option value="Segera tersedia">Segera tersedia</option></select></div><div class="form-row"><label for="rantauListingPhotos">Foto hunian (maksimal 6, 5 MB/foto)</label><input id="rantauListingPhotos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple><small class="form-note">Pilih hingga 6 foto sekaligus: kamar, kamar mandi, area bersama, dan tampak luar.</small><div data-rantau-photo-preview><span>Belum ada foto dipilih</span></div></div><div class="form-row"><label for="rantauListingFacilities">Fasilitas (pisahkan dengan koma)</label><input id="rantauListingFacilities" name="facilities" maxlength="500" placeholder="Wi-Fi, kamar mandi dalam, parkir"></div><div class="form-row"><label for="rantauListingDescription">Deskripsi hunian</label><textarea id="rantauListingDescription" name="description" required minlength="8" maxlength="1200" rows="4" placeholder="Jelaskan kondisi, aturan, dan keunggulan hunian."></textarea></div><div class="form-row"><label for="rantauListingRules">Ketentuan sewa</label><textarea id="rantauListingRules" name="rules" maxlength="600" rows="3" placeholder="Contoh: minimum sewa 3 bulan, tidak termasuk listrik"></textarea></div><button class="btn" type="submit"><i class="fa-solid fa-cloud-arrow-up" aria-hidden="true"></i> Terbitkan listing</button></form>`,
    async (data) => {
      const activeCount = rantauOwnerListingsCache.filter(
        (item) => item.status === "active",
      ).length;
      const plan = rantauPlanForUser();
      if (activeCount >= plan.listingLimit)
        throw new Error(
          `Paket ${plan.name} sudah mencapai batas ${plan.listingLimit} listing aktif.`,
        );
      const profile = rantauProfile();
      const photoUrls = await uploadRantauPhotos(data.getAll("photos"));
      const listing = {
        owner_id: supabaseSession.user.id,
        owner_name: profile.fullName,
        owner_avatar_url: safeRantauPhotoUrl(profile.avatarUrl),
        owner_city: profile.city,
        owner_about: profile.about,
        title: String(data.get("title") || "").trim(),
        property_type: String(data.get("propertyType") || "Kos"),
        location: String(data.get("location") || "").trim(),
        price_monthly: Number(data.get("price")),
        deposit_monthly: 0,
        address_detail: String(data.get("address") || "").trim(),
        room_count: Number(data.get("roomCount")) || 0,
        bedroom_count: Number(data.get("bedroomCount")) || 0,
        living_room_count: Number(data.get("livingRoomCount")) || 0,
        kitchen_count: Number(data.get("kitchenCount")) || 0,
        bathroom_count: Number(data.get("bathroomCount")) || 0,
        parking_capacity: Number(data.get("parkingCapacity")) || 0,
        guest_capacity: Number(data.get("guestCapacity")) || 0,
        sharing_allowed:
          String(data.get("propertyType") || "Kos") === "Kos"
            ? String(data.get("sharingAllowed") || "no")
            : "",
        availability: String(data.get("availability") || "Tersedia"),
        facilities: [
          ...new Set(
            String(data.get("facilities") || "")
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          ),
        ],
        rental_rules: String(data.get("rules") || "").trim(),
        contact_whatsapp: profile.whatsapp,
        photo_urls: photoUrls,
        photo_url: photoUrls[0] || "",
        description: String(data.get("description") || "").trim(),
        status: "active",
      };
      if (supabaseClient && rantauBackendAvailable) {
        const { error } = await supabaseClient
          .from("jobhub_rantau_listings")
          .insert(listing);
        if (error) {
          if (!isMissingRantauTable(error)) throw error;
          rantauBackendAvailable = false;
        } else {
          closeModal();
          await renderRantauDashboard();
          toast("Hunian berhasil dipublikasikan di JobHub Rantau.");
          return;
        }
      }
      listing.id = `rantau-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      listing.created_at = new Date().toISOString();
      saveLocalRantauListings([...readStoredArray(RANTAU_LOCAL_KEY), listing]);
      closeModal();
      await renderRantauDashboard();
      toast(
        "Listing demo tersimpan di browser ini. Terapkan migration agar dapat dilihat pengguna lain.",
      );
    },
  );
}
async function loadRantauListingById(id) {
  if (supabaseClient && rantauBackendAvailable) {
    const { data, error } = await supabaseClient
      .from("jobhub_rantau_listings")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) {
      if (!isMissingRantauTable(error)) throw error;
      rantauBackendAvailable = false;
    } else if (data) {
      const fresh = applyRantauProfileToListing(data);
      rantauOwnerListingsCache = rantauOwnerListingsCache.map((item) =>
        String(item.id) === String(id) ? fresh : item,
      );
      rantauListingsCache = rantauListingsCache.map((item) =>
        String(item.id) === String(id) ? fresh : item,
      );
      return fresh;
    }
  }
  const cached = [...rantauListingsCache, ...rantauOwnerListingsCache].find(
    (item) => String(item.id) === String(id),
  );
  if (cached) return cached;
  return (
    readStoredArray(RANTAU_LOCAL_KEY).find(
      (item) => String(item.id) === String(id),
    ) || null
  );
}
function showRantauGalleryIndex(index) {
  const main = $("#rantauGalleryMain");
  const buttons = [
    ...document.querySelectorAll("[data-rantau-gallery-select]"),
  ];
  let photos = [];
  try {
    photos = JSON.parse(main?.dataset.photos || "[]");
  } catch (error) {
    photos = [];
  }
  if (!photos.length)
    photos = buttons
      .map((button) => button.querySelector("img")?.src || "")
      .filter(Boolean);
  if (!photos.length && main?.querySelector("img")?.src)
    photos = [main.querySelector("img").src];
  if (!main || !photos.length) return;
  main.dataset.photos = JSON.stringify(photos);
  const current = ((index % photos.length) + photos.length) % photos.length;
  const title = $(".rantau-detail-info h1")?.textContent?.trim() || "Hunian";
  main.innerHTML = `<img src="${escapeHtml(photos[current])}" alt="${escapeHtml(title)} - foto ${current + 1}"><button type="button" class="rantau-gallery-arrow is-prev" data-rantau-gallery-prev aria-label="Foto sebelumnya"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i></button><button type="button" class="rantau-gallery-arrow is-next" data-rantau-gallery-next aria-label="Foto berikutnya"><i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button><button type="button" class="rantau-gallery-expand" data-rantau-gallery-expand aria-label="Tampilkan layar penuh"><i class="fa-solid fa-expand" aria-hidden="true"></i></button><span class="rantau-gallery-counter"><i class="fa-solid fa-camera" aria-hidden="true"></i> ${current + 1} / ${photos.length}</span>`;
  buttons.forEach((button, photoIndex) =>
    button.classList.toggle("active", photoIndex === current),
  );
}
function styleRantauDetailContent(listing) {
  const info = $(".rantau-detail-info");
  if (!info) return;
  info.classList.add("is-professional");
  const address = (listing.address_detail || listing.location || "").trim();
  info
    .querySelectorAll(".rantau-detail-facts>span")
    .forEach((fact) => fact.classList.add("rantau-detail-stat-card"));
  const facts = info.querySelector(".rantau-detail-facts");
  const addressFact =
    facts?.querySelector("span:first-child") ||
    facts?.querySelector("span:last-child");
  if (addressFact) {
    addressFact.innerHTML = `<i class="fa-solid fa-location-dot" aria-hidden="true"></i><strong>Alamat</strong><span class="rantau-detail-address">${escapeHtml(address || "Hubungi pemilik")}</span>`;
  }
  info.querySelectorAll("section").forEach((section) => {
    const heading = section.querySelector("h2");
    if (!heading) return;
    const text = heading.textContent.toLocaleLowerCase("id-ID");
    heading.querySelector(":scope>i")?.remove();
    const icon = document.createElement("i");
    icon.setAttribute("aria-hidden", "true");
    if (text.includes("deskripsi")) {
      heading.classList.add("rantau-section-description");
      icon.className = "fa-solid fa-align-left";
    } else if (text.includes("fasilitas")) {
      heading.classList.add("rantau-section-facility");
      icon.className = "fa-solid fa-star";
    } else if (text.includes("ketentuan")) {
      heading.classList.add("rantau-section-rules");
      icon.className = "fa-solid fa-circle-info";
    } else {
      icon.className = "fa-solid fa-circle-info";
    }
    heading.prepend(icon);
  });
  info.querySelectorAll(".rantau-map-link").forEach((link) => link.remove());
  if (!info.querySelector(".rantau-map-button")) {
    const mapButton = document.createElement("a");
    mapButton.className = "rantau-map-button";
    mapButton.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || listing.location || "Indonesia")}`;
    mapButton.target = "_blank";
    mapButton.rel = "noopener noreferrer";
    mapButton.setAttribute("aria-label", "Buka lokasi hunian di Google Maps");
    mapButton.innerHTML =
      '<i class="fa-solid fa-map-location-dot" aria-hidden="true"></i><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>';
    info.appendChild(mapButton);
  }
}
function renderRantauDetail(listing) {
  const owner = $("#rantauDetailOwner");
  const content = $("#rantauDetailContent");
  const photos = rantauPhotos(listing);
  const ownerName = listing.owner_name || "Pemilik terdaftar";
  const ownerAvatar = safeRantauPhotoUrl(listing.owner_avatar_url);
  const phone = normalizeRantauWhatsApp(
    listing.contact_whatsapp || rantauProfile().whatsapp,
  );
  const whatsappMessage = encodeURIComponent(
    `Halo ${ownerName}, saya tertarik dengan hunian "${listing.title || ""}" di JobHub Rantau. Saya ingin berdiskusi lebih lanjut.`,
  );
  owner.innerHTML = `<div class="rantau-owner-profile-photo">${ownerAvatar ? `<img src="${escapeHtml(ownerAvatar)}" alt="Foto ${escapeHtml(ownerName)}">` : '<i class="fa-solid fa-user" aria-hidden="true"></i>'}</div><span class="rantau-owner-overline">PEMILIK HUNIAN</span><h2>${escapeHtml(ownerName)}</h2><p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(listing.owner_city || listing.location || "Indonesia")}</p><p class="rantau-owner-about">${escapeHtml(listing.owner_about || "Pemilik terdaftar di JobHub Rantau.")}</p><div class="rantau-owner-contact"><button class="btn" type="button" data-rantau-message="${escapeHtml(listing.id)}"><i class="fa-solid fa-comment-dots" aria-hidden="true"></i> Kirim pesan</button>${phone ? `<a class="btn btn-outline" data-rantau-whatsapp="${escapeHtml(listing.id)}" href="https://wa.me/${phone}?text=${whatsappMessage}" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Chat WhatsApp</a>` : ""}</div><div class="rantau-owner-stats" data-rantau-stats="${escapeHtml(listing.id)}"><span><i class="fa-solid fa-eye" aria-hidden="true"></i><strong data-rantau-view-count>${formatRantauCount(listing.view_count)}</strong><small>Dilihat</small></span><span><i class="fa-solid fa-handshake" aria-hidden="true"></i><strong data-rantau-offer-count>${formatRantauCount(listing.offer_count)}</strong><small>Tawaran</small></span></div>`;
  const summaryItems = rantauFacilityItems(listing).slice(0, 7);
  const heroFacilities = summaryItems
    .map(
      (item) =>
        `<span><i class="fa-solid ${escapeHtml(item.icon)}" aria-hidden="true"></i>${escapeHtml(item.label)}</span>`,
    )
    .join("");
  content.innerHTML = `<div class="rantau-detail-gallery"><div class="rantau-gallery-main" id="rantauGalleryMain">${photos.length ? `<img src="${escapeHtml(photos[0])}" alt="${escapeHtml(listing.title)} - foto 1">` : '<div class="rantau-listing-placeholder"><i class="fa-solid fa-house" aria-hidden="true"></i><span>Foto hunian belum tersedia</span></div>'}</div>${photos.length > 1 ? `<div class="rantau-gallery-thumbnails" role="group" aria-label="Galeri foto hunian">${photos.map((photo, index) => `<button type="button" data-rantau-gallery-select="${index}" class="${index === 0 ? "active" : ""}" aria-label="Lihat foto ${index + 1}"><img src="${escapeHtml(photo)}" alt=""></button>`).join("")}</div>` : ""}</div><article class="rantau-detail-info"><div class="rantau-detail-hero"><div class="rantau-detail-hero-copy"><div class="rantau-detail-tags"><span>Rantau Home</span><span>Rumah</span></div><h1>${escapeHtml(listing.title || "Hunian")}</h1><p class="rantau-detail-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(listing.location || "")}</p><div class="rantau-detail-hero-facilities">${heroFacilities}</div><strong class="rantau-detail-price"><i class="fa-solid fa-tag" aria-hidden="true"></i><span>${formatRantauPrice(listing.price_monthly)} <small>${rantauPricePeriodLabel(listing.property_type)}</small></span></strong></div>${photos[0] ? `<div class="rantau-detail-hero-media"><img src="${escapeHtml(photos[0])}" alt="${escapeHtml(listing.title || "Hunian")}"></div>` : ""}</div><div class="rantau-detail-facts"><span><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i><strong>Alamat</strong>${escapeHtml(listing.address_detail || listing.location || "Hubungi pemilik")}</span></div><section><h2>Deskripsi hunian</h2><p>${escapeHtml(listing.description || "Belum ada deskripsi.")}</p></section>${(() => {
    const facilityItems = rantauFacilityItems(listing);
    return facilityItems.length
      ? `<section><h2>Fasilitas</h2><ul class="rantau-facility-list">${facilityItems.map((item) => `<li><i class="fa-solid ${escapeHtml(item.icon)}" aria-hidden="true"></i>${escapeHtml(item.label)}</li>`).join("")}</ul></section>`
      : "";
  })()}${listing.rental_rules ? `<section><h2>Ketentuan sewa</h2><p>${escapeHtml(listing.rental_rules)}</p></section>` : ""}<a class="rantau-map-link" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address_detail || listing.location || "Indonesia")}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i></a></article>`;
  styleRantauDetailContent(listing);
  if (photos.length) showRantauGalleryIndex(0);
  $("#rantauDetailTitle")?.focus();
}
async function renderRantauDetailPage(id) {
  const content = $("#rantauDetailContent");
  if (!content) return;
  content.innerHTML = loadingIndicator("Memuat detail hunian...");
  try {
    const listing = await loadRantauListingById(id);
    if (
      !listing ||
      (listing.status !== "active" &&
        listing.owner_id !== supabaseSession?.user?.id)
    ) {
      content.innerHTML =
        '<div class="empty-state"><strong>Hunian tidak tersedia</strong>Listing mungkin sudah disembunyikan atau dihapus oleh pemiliknya.</div>';
      return;
    }
    if (
      !rantauListingsCache.some(
        (item) => String(item.id) === String(listing.id),
      )
    )
      rantauListingsCache.push(listing);
    if (
      listing.owner_id === supabaseSession?.user?.id &&
      !rantauOwnerListingsCache.some(
        (item) => String(item.id) === String(listing.id),
      )
    )
      rantauOwnerListingsCache.push(listing);
    renderRantauDetail(listing);
    connectRantauListingStatsRealtime();
    recordRantauListingInteraction(listing.id, "view");
  } catch (error) {
    content.innerHTML = `<div class="empty-state"><strong>Detail hunian gagal dimuat</strong>${escapeHtml(error.message || "Periksa koneksi dan coba lagi.")}</div>`;
  }
}
const RANTAU_MESSAGES_LOCAL_KEY = "jobhub-rantau-messages";
const RANTAU_MESSAGE_ATTACHMENT_BUCKET = "rantau-message-attachments";
const RANTAU_READ_STATE_LOCAL_KEY = "jobhub-rantau-read-state";
const RANTAU_MESSAGE_ATTACHMENT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain,text/csv,.jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv";
let activeRantauThreadKey = "";
let rantauUnreadMessageCount = 0;
let rantauReadReceiptsBackendAvailable = true;
let rantauMessagesRealtimeChannel = null;
let rantauMessagesRealtimeUserId = "";
function isMissingRantauMessagesTable(error) {
  return (
    ["42P01", "PGRST205"].includes(error?.code) ||
    /jobhub_rantau_messages.*(not found|does not exist)|schema cache/i.test(
      error?.message || "",
    )
  );
}
function isMissingRantauReadReceiptSchema(error) {
  return (
    ["42703", "PGRST204", "PGRST202", "42883"].includes(error?.code) &&
    /(owner_read_at|customer_read_at|mark_jobhub_rantau_thread_read)/i.test(
      error?.message || "",
    )
  );
}
function rantauReadStateKey(userId, listingId, customerId) {
  return `${userId}:${listingId}:${customerId}`;
}
function rantauLocalReadAt(userId, listingId, customerId) {
  const state = readStoredJson(RANTAU_READ_STATE_LOCAL_KEY, {});
  return state?.[rantauReadStateKey(userId, listingId, customerId)] || "";
}
function markRantauThreadReadLocally(thread, userId) {
  const state = readStoredJson(RANTAU_READ_STATE_LOCAL_KEY, {});
  state[
    rantauReadStateKey(
      userId,
      thread.latest.listing_id,
      thread.latest.customer_id,
    )
  ] = new Date().toISOString();
  writeStoredJson(RANTAU_READ_STATE_LOCAL_KEY, state);
}
function countRantauUnreadLocally(messages, userId) {
  const state = readStoredJson(RANTAU_READ_STATE_LOCAL_KEY, {});
  return messages.filter((message) => {
    if (message.sender_id === userId) return false;
    const readAt =
      state[
        rantauReadStateKey(userId, message.listing_id, message.customer_id)
      ];
    return !readAt || new Date(message.created_at) > new Date(readAt);
  }).length;
}
async function loadRantauMessagesForUnreadFallback(userId) {
  if (supabaseClient && rantauMessagesBackendAvailable) {
    const { data, error } = await supabaseClient
      .from("jobhub_rantau_messages")
      .select("listing_id,owner_id,customer_id,sender_id,created_at")
      .or(`owner_id.eq.${userId},customer_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      if (!isMissingRantauMessagesTable(error)) throw error;
      rantauMessagesBackendAvailable = false;
    } else return data || [];
  }
  return readStoredArray(RANTAU_MESSAGES_LOCAL_KEY).filter(
    (message) => message.owner_id === userId || message.customer_id === userId,
  );
}
function updateRantauUnreadCount(count) {
  rantauUnreadMessageCount = Math.max(0, Number(count) || 0);
  [
    "#rantauOwnerUnreadCount",
    "#rantauCustomerUnreadCount",
    "#rantauChatLauncherUnread",
  ].forEach((selector) => {
    const badge = $(selector);
    if (!badge) return;
    badge.textContent =
      rantauUnreadMessageCount > 99 ? "99+" : String(rantauUnreadMessageCount);
    badge.hidden = rantauUnreadMessageCount === 0;
    badge.setAttribute(
      "aria-label",
      `${rantauUnreadMessageCount} pesan belum dibaca`,
    );
  });
  const launcher = $("#rantauChatLauncher");
  if (launcher)
    launcher.setAttribute(
      "aria-label",
      rantauUnreadMessageCount
        ? `Buka Pesan Hunian, ${rantauUnreadMessageCount} belum dibaca`
        : "Buka Pesan Hunian",
    );
}
async function loadRantauUnreadCount() {
  const userId = supabaseSession?.user?.id;
  if (!userId) {
    updateRantauUnreadCount(0);
    return;
  }
  if (
    !supabaseClient ||
    !rantauMessagesBackendAvailable ||
    !rantauReadReceiptsBackendAvailable
  ) {
    const messages = await loadRantauMessagesForUnreadFallback(userId);
    updateRantauUnreadCount(countRantauUnreadLocally(messages, userId));
    return;
  }
  const [ownerResult, customerResult] = await Promise.all([
    supabaseClient
      .from("jobhub_rantau_messages")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", userId)
      .neq("sender_id", userId)
      .is("owner_read_at", null),
    supabaseClient
      .from("jobhub_rantau_messages")
      .select("id", { count: "exact", head: true })
      .eq("customer_id", userId)
      .neq("sender_id", userId)
      .is("customer_read_at", null),
  ]);
  const receiptError = ownerResult.error || customerResult.error;
  if (receiptError) {
    if (!isMissingRantauReadReceiptSchema(receiptError)) throw receiptError;
    rantauReadReceiptsBackendAvailable = false;
    const messages = await loadRantauMessagesForUnreadFallback(userId);
    updateRantauUnreadCount(countRantauUnreadLocally(messages, userId));
    return;
  }
  updateRantauUnreadCount(
    (ownerResult.count || 0) + (customerResult.count || 0),
  );
}
async function markRantauThreadRead(
  thread,
  userId = supabaseSession?.user?.id,
) {
  if (!thread || !userId) return;
  if (
    supabaseClient &&
    rantauMessagesBackendAvailable &&
    rantauReadReceiptsBackendAvailable
  ) {
    const { error } = await supabaseClient.rpc(
      "mark_jobhub_rantau_thread_read",
      {
        p_listing_id: thread.latest.listing_id,
        p_customer_id: thread.latest.customer_id,
      },
    );
    if (error && !isMissingRantauReadReceiptSchema(error)) throw error;
    if (!error) return;
    rantauReadReceiptsBackendAvailable = false;
  }
  markRantauThreadReadLocally(thread, userId);
}
function connectRantauMessagesRealtime() {
  const userId = supabaseSession?.user?.id;
  if (!supabaseClient || !userId) return;
  if (rantauMessagesRealtimeChannel && rantauMessagesRealtimeUserId === userId)
    return;
  removeRealtimeChannelSafely(rantauMessagesRealtimeChannel);
  rantauMessagesRealtimeUserId = userId;
  const refreshRantauInboxRealtime = async (payload) => {
    const message = payload.new || payload.old || {};
    if (message.owner_id !== userId && message.customer_id !== userId) return;
    try {
      if (activeRoute === "rantau-inbox")
        await renderRantauMessages("#rantauCustomerMessages", true);
      else if (
        activeRoute === "rantau-dashboard" &&
        !document.querySelector('[data-rantau-panel-view="messages"]')?.hidden
      )
        await renderRantauMessages("#rantauMessages", true);
    } catch (error) {
      console.warn(
        "Rantau conversation could not refresh:",
        error.message || error,
      );
    }
    try {
      await loadRantauUnreadCount();
    } catch (error) {
      console.warn(
        "Rantau unread messages could not refresh:",
        error.message || error,
      );
    }
    if (payload.eventType === "INSERT" && message.sender_id !== userId)
      toast("Pesan baru masuk di JobHub Rantau.");
  };
  rantauMessagesRealtimeChannel = supabaseClient
    .channel(`jobhub-rantau-inbox-${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "jobhub_rantau_messages" },
      (payload) =>
        refreshRantauInboxRealtime({ ...payload, eventType: "INSERT" }),
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "jobhub_rantau_messages" },
      (payload) =>
        refreshRantauInboxRealtime({ ...payload, eventType: "UPDATE" }),
    )
    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "jobhub_rantau_messages" },
      (payload) =>
        refreshRantauInboxRealtime({ ...payload, eventType: "DELETE" }),
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        console.warn(
          "Rantau realtime channel unavailable:",
          error?.message || status,
        );
    });
}
async function loadRantauMessages() {
  const userId = supabaseSession?.user?.id;
  if (supabaseClient && rantauMessagesBackendAvailable && userId) {
    const { data, error } = await supabaseClient
      .from("jobhub_rantau_messages")
      .select("*")
      .or(`owner_id.eq.${userId},customer_id.eq.${userId}`)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) {
      if (!isMissingRantauMessagesTable(error)) throw error;
      rantauMessagesBackendAvailable = false;
    } else return data || [];
  }
  return readStoredArray(RANTAU_MESSAGES_LOCAL_KEY)
    .filter(
      (message) =>
        message.owner_id === userId || message.customer_id === userId,
    )
    .sort(
      (left, right) => new Date(right.created_at) - new Date(left.created_at),
    );
}
async function renderRantauMessages(targetSelector, preserveDraft = false) {
  const list = $(
    targetSelector ||
      (activeRoute === "rantau-inbox"
        ? "#rantauCustomerMessages"
        : "#rantauMessages"),
  );
  if (!list) return;
  const existingForm = preserveDraft
    ? list.querySelector("[data-rantau-thread-form]")
    : null;
  const draftBody =
    existingForm?.querySelector('textarea[name="body"]')?.value || "";
  const draftFile =
    existingForm?.querySelector("[data-rantau-attachment-input]")?.files?.[0] ||
    null;
  const draftThreadKey = existingForm
    ? `${existingForm.dataset.listingId}:${existingForm.dataset.customerId}`
    : "";
  connectRantauMessagesRealtime();
  if (!preserveDraft || !list.querySelector(".rantau-inbox-layout"))
    list.innerHTML = loadingIndicator("Memuat pesan...");
  try {
    const messages = await loadRantauMessages();
    const userId = supabaseSession.user.id;
    const threads = new Map();
    messages.forEach((message) => {
      const threadKey = `${message.listing_id}:${message.customer_id}`;
      if (!threads.has(threadKey)) threads.set(threadKey, []);
      threads.get(threadKey).push(message);
    });
    const threadList = [...threads.entries()]
      .map(([key, thread]) => {
        thread.sort(
          (left, right) =>
            new Date(left.created_at) - new Date(right.created_at),
        );
        const latest = thread.at(-1);
        const peer =
          latest.owner_id === userId
            ? thread.find((message) => message.sender_id === latest.customer_id)
                ?.sender_name || "Calon penyewa"
            : thread.find((message) => message.sender_id === latest.owner_id)
                ?.sender_name || "Pemilik hunian";
        const peerMessage = thread
          .slice()
          .reverse()
          .find((message) => message.sender_id !== userId);
        const readColumn =
          latest.owner_id === userId ? "owner_read_at" : "customer_read_at";
        const localReadAt = rantauLocalReadAt(
          userId,
          latest.listing_id,
          latest.customer_id,
        );
        const unreadCount = thread.filter((message) => {
          if (message.sender_id === userId) return false;
          if (Object.prototype.hasOwnProperty.call(message, readColumn))
            return !message[readColumn];
          return (
            !localReadAt || new Date(message.created_at) > new Date(localReadAt)
          );
        }).length;
        return {
          key,
          thread,
          latest,
          peer,
          peerMessage,
          preview: latest.body || "",
          unreadCount,
        };
      })
      .sort(
        (left, right) =>
          new Date(right.latest.created_at) - new Date(left.latest.created_at),
      );
    if (!threadList.some((thread) => thread.key === activeRantauThreadKey))
      activeRantauThreadKey = threadList[0]?.key || "";
    const ownerInbox =
      targetSelector !== "#rantauCustomerMessages" && isRantauAccount();
    const hasActiveListing =
      ownerInbox &&
      rantauOwnerListingsCache.some((listing) => listing.status === "active");
    const emptyTitle = ownerInbox
      ? hasActiveListing
        ? "Belum ada percakapan"
        : "Belum ada listing aktif"
      : "Belum ada percakapan";
    const emptyDescription = ownerInbox
      ? hasActiveListing
        ? "Pesan calon penyewa akan muncul di sini setelah mereka menghubungi listing aktif Anda."
        : "Listing aktif diperlukan agar calon penyewa dapat menghubungi Anda."
      : "Pesan yang Anda kirim ke pemilik hunian dan balasannya akan tersimpan di sini.";
    const emptyAction = ownerInbox
      ? ""
      : '<button class="btn btn-small" type="button" data-route="rantau"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> Cari hunian</button>';
    let startChatListings = [];
    if (!threadList.length && !ownerInbox) {
      try {
        startChatListings = (await loadRantauListings()).filter(
          (listing) =>
            listing.owner_id !== userId && listing.status === "active",
        );
      } catch (error) {
        startChatListings = [];
      }
    }
    list.innerHTML = `<div class="rantau-inbox-layout"><aside class="rantau-inbox-sidebar"><header><div><h3>Kotak masuk</h3><p>${threadList.length} percakapan</p></div><i class="fa-solid fa-comments" aria-hidden="true"></i></header>${threadList.length ? `<label class="rantau-inbox-search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span class="sr-only">Cari percakapan</span><input id="rantauThreadSearch" type="search" placeholder="Cari nama atau hunian"></label><div class="rantau-inbox-thread-list">${threadList.map((thread) => `<button type="button" class="rantau-inbox-thread${thread.key === activeRantauThreadKey ? " active" : ""}" data-rantau-thread-select="${escapeHtml(thread.key)}" data-rantau-thread-search="${escapeHtml(`${thread.peer} ${thread.latest.listing_title || ""} ${thread.preview}`.toLocaleLowerCase("id-ID"))}"><span class="rantau-inbox-avatar"><i class="fa-solid fa-user" aria-hidden="true"></i></span><span class="rantau-inbox-thread-copy"><strong>${escapeHtml(thread.peer)}</strong><small>${escapeHtml(thread.latest.listing_title || "Hunian JobHub Rantau")}</small><span>${escapeHtml(thread.preview)}</span>${thread.unreadCount ? `<span class="rantau-inbox-thread-unread" aria-label="${thread.unreadCount} pesan belum dibaca">${thread.unreadCount > 99 ? "99+" : thread.unreadCount}</span>` : ""}</span><time>${new Date(thread.latest.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</time></button>`).join("")}</div>` : `<div class="rantau-inbox-no-threads"><i class="fa-regular fa-comments" aria-hidden="true"></i><strong>${emptyTitle}</strong><p>${emptyDescription}</p>${emptyAction}</div>`}</aside><section class="rantau-chat-pane" id="rantauChatPane" aria-live="polite"></section></div>`;
    const activeThread = threadList.find(
      (thread) => thread.key === activeRantauThreadKey,
    );
    const chatPane = list.querySelector("#rantauChatPane");
    chatPane.classList.toggle("is-empty", !activeThread && ownerInbox);
    if (activeThread) {
      await renderRantauChatThread(chatPane, activeThread, userId);
      if (preserveDraft && activeThread.key === draftThreadKey) {
        const form = chatPane.querySelector("[data-rantau-thread-form]");
        const textarea = form?.querySelector('textarea[name="body"]');
        const attachmentInput = form?.querySelector(
          "[data-rantau-attachment-input]",
        );
        if (textarea) textarea.value = draftBody;
        if (draftFile && attachmentInput) {
          try {
            const transfer = new DataTransfer();
            transfer.items.add(draftFile);
            attachmentInput.files = transfer.files;
            attachmentInput.dispatchEvent(
              new Event("change", { bubbles: true }),
            );
          } catch (error) {
            console.warn(
              "Rantau draft attachment could not be restored:",
              error.message || error,
            );
          }
        }
      }
      try {
        await markRantauThreadRead(activeThread, userId);
        const selectedThread = [
          ...list.querySelectorAll("[data-rantau-thread-select]"),
        ].find(
          (button) => button.dataset.rantauThreadSelect === activeThread.key,
        );
        selectedThread?.querySelector(".rantau-inbox-thread-unread")?.remove();
      } catch (error) {
        console.warn(
          "Rantau messages could not be marked as read:",
          error.message || error,
        );
      }
    } else
      chatPane.innerHTML = `<div class="rantau-chat-empty"><span><i class="fa-solid fa-comments" aria-hidden="true"></i></span><h3>${emptyTitle}</h3><p>${emptyDescription}</p>${emptyAction}</div>${ownerInbox ? renderRantauIdleComposer() : renderRantauNewChatComposer(startChatListings)}`;
    try {
      await loadRantauUnreadCount();
    } catch (error) {
      console.warn(
        "Rantau unread count could not load:",
        error.message || error,
      );
    }
  } catch (error) {
    list.innerHTML = `<div class="empty-state"><strong>Pesan gagal dimuat</strong>${escapeHtml(error.message || "Terapkan migration JobHub Rantau terbaru lalu coba lagi.")}</div>`;
  }
}
function renderRantauNewChatComposer(listings) {
  return `<form class="rantau-chat-composer rantau-new-chat-composer" data-rantau-new-chat-form><label class="sr-only" for="rantauNewChatListing">Pilih hunian tujuan pesan</label><select id="rantauNewChatListing" name="listingId" data-rantau-new-listing-select required><option value="">Pilih hunian untuk memulai chat...</option>${listings.map((listing) => `<option value="${escapeHtml(listing.id)}">${escapeHtml(listing.title || "Hunian")} · ${escapeHtml(listing.location || "")}</option>`).join("")}</select>${renderRantauAttachmentPicker("rantauNewChatAttachment")}<div class="rantau-chat-compose-row"><label class="sr-only" for="rantauNewChatBody">Tulis pesan</label><textarea id="rantauNewChatBody" name="body" maxlength="1200" rows="2" placeholder="Tulis pesan kepada pemilik hunian..."></textarea><button class="btn btn-small" type="submit" disabled><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim</button></div></form>`;
}
function renderRantauIdleComposer() {
  return `<form class="rantau-chat-composer rantau-chat-composer-idle" aria-label="Tulis pesan"><div class="rantau-chat-tools">${renderRantauAttachmentPicker("rantauIdleAttachment", true)}<span>Pilih percakapan untuk mulai mengetik.</span></div><div class="rantau-chat-compose-row"><label class="sr-only" for="rantauIdleBody">Tulis pesan</label><textarea id="rantauIdleBody" disabled rows="2" placeholder="Pilih percakapan terlebih dahulu..."></textarea><button class="btn btn-small" type="button" disabled aria-label="Kirim pesan"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim</button></div></form>`;
}
function renderRantauAttachmentPicker(inputId, disabled = false) {
  return `<div class="rantau-chat-tools"><label class="rantau-chat-file-button${disabled ? " is-disabled" : ""}" for="${escapeHtml(inputId)}" aria-label="Lampirkan gambar atau dokumen"><i class="fa-solid fa-paperclip" aria-hidden="true"></i><span>Lampirkan file</span><input id="${escapeHtml(inputId)}" name="attachment" type="file" accept="${RANTAU_MESSAGE_ATTACHMENT_ACCEPT}" data-rantau-attachment-input hidden ${disabled ? "disabled" : ""}></label><span class="rantau-chat-attachment-selection" data-rantau-attachment-selection hidden></span></div>`;
}
function renderRantauMessageBody(body) {
  const text = String(body || "");
  const urlPattern = /https?:\/\/[^\s<]+/gi;
  let markup = "";
  let cursor = 0;
  for (const match of text.matchAll(urlPattern)) {
    const rawUrl = match[0];
    let url = rawUrl;
    let punctuation = "";
    while (/[),.!?;:]$/.test(url)) {
      punctuation = url.slice(-1) + punctuation;
      url = url.slice(0, -1);
    }
    let isGoogleMapsUrl = false;
    try {
      const parsedUrl = new URL(url);
      isGoogleMapsUrl =
        parsedUrl.protocol === "https:" &&
        ((["google.com", "www.google.com", "maps.google.com"].includes(
          parsedUrl.hostname,
        ) &&
          parsedUrl.pathname.startsWith("/maps")) ||
          parsedUrl.hostname === "maps.app.goo.gl");
    } catch (error) {}
    markup += escapeHtml(text.slice(cursor, match.index));
    markup += isGoogleMapsUrl
      ? `<a class="rantau-chat-map-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i> Buka lokasi di Google Maps</a>`
      : escapeHtml(url);
    markup += escapeHtml(punctuation);
    cursor = match.index + rawUrl.length;
  }
  return markup + escapeHtml(text.slice(cursor));
}
function renderRantauMessageAttachment(attachment, signedUrl) {
  if (!attachment) return "";
  const imagePreview =
    String(attachment.mimeType || "").startsWith("image/") && signedUrl
      ? `<a class="rantau-chat-file-image" href="${escapeHtml(signedUrl)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(signedUrl)}" alt="${escapeHtml(attachment.name)}" loading="lazy"></a>`
      : "";
  const icon =
    attachment.mimeType === "application/pdf" ? "fa-file-pdf" : "fa-file-lines";
  const fileLink = signedUrl
    ? `<a class="rantau-chat-file-link" href="${escapeHtml(signedUrl)}" target="_blank" rel="noopener noreferrer" download="${escapeHtml(attachment.name)}"><i class="fa-regular ${icon}" aria-hidden="true"></i><span>${escapeHtml(attachment.name)}</span><i class="fa-solid fa-arrow-down" aria-hidden="true"></i></a>`
    : '<span class="rantau-chat-file-unavailable"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Lampiran tidak tersedia</span>';
  const size =
    Number(attachment.size) > 0
      ? `<small>${(Number(attachment.size) / 1024 / 1024).toFixed(attachment.size < 1048576 ? 2 : 1)} MB</small>`
      : "";
  return `<div class="rantau-chat-file-attachment">${imagePreview}${fileLink}${size}</div>`;
}
async function renderRantauChatThread(pane, thread, userId) {
  if (!pane) return;
  const { latest, peer, thread: messages } = thread;
  const attachments = messages
    .map((message, index) => ({ index, attachment: message.attachment }))
    .filter((item) => item.attachment?.path);
  const signedUrls = new Map();
  if (attachments.length && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.storage
        .from(RANTAU_MESSAGE_ATTACHMENT_BUCKET)
        .createSignedUrls(
          attachments.map((item) => item.attachment.path),
          3600,
        );
      if (error)
        console.warn(
          "Rantau chat attachments could not be opened:",
          error.message,
        );
      attachments.forEach((item, index) =>
        signedUrls.set(item.index, error ? "" : data?.[index]?.signedUrl || ""),
      );
    } catch (error) {
      console.warn(
        "Rantau chat attachments could not be opened:",
        error.message || error,
      );
    }
  }
  pane.innerHTML = `<header class="rantau-chat-pane-header"><span class="rantau-inbox-avatar"><i class="fa-solid fa-user" aria-hidden="true"></i></span><div><strong>${escapeHtml(peer)}</strong><small><i class="fa-solid fa-house" aria-hidden="true"></i> ${escapeHtml(latest.listing_title || "Hunian JobHub Rantau")}</small></div><button class="icon-btn" type="button" title="Detail hunian" data-rantau-detail="${escapeHtml(latest.listing_id)}" aria-label="Buka detail hunian"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></button><button class="icon-btn rantau-clear-contact" type="button" data-delete-rantau-contact="${escapeHtml(latest.listing_id)}" data-delete-rantau-customer="${escapeHtml(latest.customer_id)}" title="Hapus seluruh chat dan kontak" aria-label="Hapus seluruh chat dan kontak"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button></header><div class="rantau-chat-history">${messages.map((message, index) => `<div class="rantau-chat-bubble${message.sender_id === userId ? " is-own" : ""}" data-rantau-message-id="${escapeHtml(message.id || "")}" data-rantau-message-owner="${message.sender_id === userId ? "true" : "false"}" data-rantau-listing-id="${escapeHtml(latest.listing_id)}" data-rantau-customer-id="${escapeHtml(latest.customer_id)}">${renderRantauMessageBody(message.body)}${renderRantauMessageAttachment(message.attachment, signedUrls.get(index))}<small>${escapeHtml(message.sender_name || "Pengguna")} · ${new Date(message.created_at).toLocaleString("id-ID")}${message.edited_at ? " · diedit" : ""}</small></div>`).join("")}</div><form class="rantau-chat-composer" data-rantau-thread-form data-listing-id="${escapeHtml(latest.listing_id)}" data-listing-title="${escapeHtml(latest.listing_title || "Hunian JobHub Rantau")}" data-owner-id="${escapeHtml(latest.owner_id)}" data-customer-id="${escapeHtml(latest.customer_id)}"><button type="button" class="rantau-share-map" data-rantau-share-map data-listing-id="${escapeHtml(latest.listing_id)}"><i class="fa-solid fa-map-location-dot" aria-hidden="true"></i> Bagikan lokasi hunian</button>${renderRantauAttachmentPicker(`rantauAttachment-${latest.listing_id}-${latest.customer_id}`)}<div class="rantau-chat-compose-row"><label class="sr-only" for="rantauReply-${escapeHtml(latest.listing_id)}-${escapeHtml(latest.customer_id)}">Tulis balasan</label><textarea id="rantauReply-${escapeHtml(latest.listing_id)}-${escapeHtml(latest.customer_id)}" name="body" maxlength="1200" rows="2" placeholder="Tulis pesan atau balasan..."></textarea><button class="btn btn-small" type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim</button></div></form>`;
  const history = pane.querySelector(".rantau-chat-history");
  history.scrollTop = history.scrollHeight;
}
let rantauChatMenuTimer = 0;
function hideRantauChatMenu() {
  document.querySelector(".rantau-chat-context-menu")?.remove();
}
function showRantauChatMenu(x, y, options) {
  hideRantauChatMenu();
  const menu = document.createElement("div");
  menu.className = "rantau-chat-context-menu";
  menu.style.left = `${Math.max(8, Math.min(window.innerWidth - 190, x))}px`;
  menu.style.top = `${Math.max(8, Math.min(window.innerHeight - 120, y))}px`;
  menu.innerHTML = options
    .map(
      (option) =>
        `<button type="button" data-rantau-chat-action="${option.action}"${option.messageId ? ` data-message-id="${escapeHtml(option.messageId)}"` : ""}${option.applicationId ? ` data-application-id="${escapeHtml(option.applicationId)}"` : ""}${option.listingId ? ` data-listing-id="${escapeHtml(option.listingId)}"` : ""}${option.customerId ? ` data-customer-id="${escapeHtml(option.customerId)}"` : ""}><i class="fa-solid ${option.action === "edit" || option.action === "edit-job-message" ? "fa-pen" : option.action.includes("delete") ? "fa-trash" : "fa-user-xmark"}" aria-hidden="true"></i>${escapeHtml(option.label)}</button>`,
    )
    .join("");
  document.body.appendChild(menu);
}
async function editRantauChatMessage(messageId) {
  const messages = await loadRantauMessages();
  const message = messages.find(
    (item) =>
      String(item.id || "") === String(messageId) &&
      item.sender_id === supabaseSession?.user?.id,
  );
  if (!message) return toast("Pesan ini tidak dapat diedit.");
  const edited = window.prompt("Edit pesan:", message.body || "");
  if (edited === null) return;
  const body = edited.trim();
  if (body.length < 2 || body.length > 1200)
    return toast("Pesan harus berisi 2 sampai 1.200 karakter.");
  if (supabaseClient && rantauMessagesBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_messages")
      .update({ body, edited_at: new Date().toISOString() })
      .eq("id", messageId)
      .eq("sender_id", supabaseSession.user.id);
    if (error) throw error;
  } else {
    writeStoredJson(
      RANTAU_MESSAGES_LOCAL_KEY,
      readStoredArray(RANTAU_MESSAGES_LOCAL_KEY).map((item) =>
        String(item.id || "") === String(messageId) &&
        item.sender_id === supabaseSession.user.id
          ? { ...item, body, edited_at: new Date().toISOString() }
          : item,
      ),
    );
  }
  await renderRantauMessages(undefined, true);
  toast("Pesan berhasil diedit.");
}
async function deleteRantauChatMessage(messageId) {
  const message = (await loadRantauMessages()).find(
    (item) =>
      String(item.id || "") === String(messageId) &&
      item.sender_id === supabaseSession?.user?.id,
  );
  if (!message)
    return toast("Pesan ini bukan milik akun Anda dan tidak dapat dihapus.");
  if (supabaseClient && rantauMessagesBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_messages")
      .delete()
      .eq("id", messageId)
      .eq("sender_id", supabaseSession.user.id);
    if (error) throw error;
  } else {
    writeStoredJson(
      RANTAU_MESSAGES_LOCAL_KEY,
      readStoredArray(RANTAU_MESSAGES_LOCAL_KEY).filter(
        (item) =>
          String(item.id || "") !== String(messageId) ||
          item.sender_id !== supabaseSession.user.id,
      ),
    );
  }
  if (message.attachment?.path && supabaseClient)
    await supabaseClient.storage
      .from(RANTAU_MESSAGE_ATTACHMENT_BUCKET)
      .remove([message.attachment.path])
      .catch(() => {});
  await renderRantauMessages(undefined, true);
  toast("Pesan berhasil dihapus.");
}
async function deleteRantauChatContact(listingId, customerId) {
  const userId = supabaseSession?.user?.id;
  if (!userId) return;
  if (supabaseClient && rantauMessagesBackendAvailable) {
    const threadMessages = (await loadRantauMessages()).filter(
      (item) =>
        String(item.listing_id) === String(listingId) &&
        String(item.customer_id) === String(customerId),
    );
    const attachmentPaths = threadMessages
      .map((item) => item.attachment?.path)
      .filter(Boolean);
    if (attachmentPaths.length)
      await supabaseClient.storage
        .from(RANTAU_MESSAGE_ATTACHMENT_BUCKET)
        .remove([...new Set(attachmentPaths)])
        .catch(() => {});
    const query = supabaseClient
      .from("jobhub_rantau_messages")
      .delete()
      .eq("listing_id", listingId)
      .eq("customer_id", customerId);
    const { error } = await query;
    if (error) throw error;
  }
  writeStoredJson(
    RANTAU_MESSAGES_LOCAL_KEY,
    readStoredArray(RANTAU_MESSAGES_LOCAL_KEY).filter(
      (item) =>
        !(
          String(item.listing_id) === String(listingId) &&
          String(item.customer_id) === String(customerId) &&
          (item.owner_id === userId || item.customer_id === userId)
        ),
    ),
  );
  activeRantauThreadKey = "";
  await renderRantauMessages(undefined, true);
  toast("Kontak dan percakapan berhasil dihapus.");
}
document.addEventListener("click", (event) => {
  const whatsapp = event.target.closest("[data-rantau-whatsapp]");
  if (whatsapp)
    recordRantauListingInteraction(whatsapp.dataset.rantauWhatsapp, "offer");
});
document.addEventListener("contextmenu", (event) => {
  const jobBubble = event.target.closest("[data-job-message-id]");
  if (jobBubble && jobBubble.dataset.jobMessageOwner === "true") {
    event.preventDefault();
    showRantauChatMenu(event.clientX, event.clientY, [
      {
        action: "edit-job-message",
        label: "Edit pesan",
        messageId: jobBubble.dataset.jobMessageId,
      },
      {
        action: "delete-job-message",
        label: "Hapus pesan",
        messageId: jobBubble.dataset.jobMessageId,
      },
    ]);
    return;
  }
  const jobContact = event.target.closest("[data-job-contact-id]");
  if (jobContact) {
    event.preventDefault();
    showRantauChatMenu(event.clientX, event.clientY, [
      {
        action: "delete-job-contact",
        label: "Hapus kontak",
        applicationId: jobContact.dataset.jobContactId,
      },
    ]);
    return;
  }
  const bubble = event.target.closest("[data-rantau-message-id]");
  if (bubble && bubble.dataset.rantauMessageOwner === "true") {
    event.preventDefault();
    showRantauChatMenu(event.clientX, event.clientY, [
      {
        action: "edit",
        label: "Edit pesan",
        messageId: bubble.dataset.rantauMessageId,
      },
      {
        action: "delete-message",
        label: "Hapus pesan",
        messageId: bubble.dataset.rantauMessageId,
      },
    ]);
    return;
  }
  const thread = event.target.closest("[data-rantau-thread-select]");
  if (thread) {
    event.preventDefault();
    const [listingId, customerId] = String(
      thread.dataset.rantauThreadSelect || "",
    ).split(":");
    if (listingId && customerId)
      showRantauChatMenu(event.clientX, event.clientY, [
        {
          action: "delete-contact",
          label: "Hapus kontak",
          listingId,
          customerId,
        },
      ]);
  }
});
document.addEventListener(
  "touchstart",
  (event) => {
    const target = event.target.closest(
      "[data-job-message-id],[data-job-contact-id],[data-rantau-message-id],[data-rantau-thread-select]",
    );
    if (!target) return;
    clearTimeout(rantauChatMenuTimer);
    rantauChatMenuTimer = setTimeout(() => {
      const rect = target.getBoundingClientRect();
      if (
        target.matches("[data-job-message-id]") &&
        target.dataset.jobMessageOwner === "true"
      ) {
        showRantauChatMenu(rect.left + rect.width / 2, rect.top + 20, [
          {
            action: "edit-job-message",
            label: "Edit pesan",
            messageId: target.dataset.jobMessageId,
          },
          {
            action: "delete-job-message",
            label: "Hapus pesan",
            messageId: target.dataset.jobMessageId,
          },
        ]);
      } else if (target.matches("[data-job-contact-id]")) {
        showRantauChatMenu(rect.left + rect.width / 2, rect.top + 20, [
          {
            action: "delete-job-contact",
            label: "Hapus kontak",
            applicationId: target.dataset.jobContactId,
          },
        ]);
      } else if (
        target.matches("[data-rantau-message-id]") &&
        target.dataset.rantauMessageOwner === "true"
      ) {
        showRantauChatMenu(rect.left + rect.width / 2, rect.top + 20, [
          {
            action: "edit",
            label: "Edit pesan",
            messageId: target.dataset.rantauMessageId,
          },
          {
            action: "delete-message",
            label: "Hapus pesan",
            messageId: target.dataset.rantauMessageId,
          },
        ]);
      } else if (target.matches("[data-rantau-thread-select]")) {
        const [listingId, customerId] = String(
          target.dataset.rantauThreadSelect || "",
        ).split(":");
        if (listingId && customerId)
          showRantauChatMenu(rect.left + rect.width / 2, rect.top + 20, [
            {
              action: "delete-contact",
              label: "Hapus kontak",
              listingId,
              customerId,
            },
          ]);
      }
    }, 550);
  },
  { passive: true },
);
document.addEventListener("touchend", () => clearTimeout(rantauChatMenuTimer));
document.addEventListener("touchmove", () => clearTimeout(rantauChatMenuTimer));
document.addEventListener("click", async (event) => {
  const actionButton = event.target.closest("[data-rantau-chat-action]");
  if (!actionButton) return;
  const action = actionButton.dataset.rantauChatAction;
  hideRantauChatMenu();
  try {
    if (action === "edit-job-message")
      await editJobChatMessage(actionButton.dataset.messageId);
    else if (action === "delete-job-message")
      await deleteJobChatMessage(actionButton.dataset.messageId);
    else if (action === "delete-job-contact")
      await deleteJobChatContact(actionButton.dataset.applicationId);
    else if (action === "edit")
      await editRantauChatMessage(actionButton.dataset.messageId);
    else if (action === "delete-message")
      await deleteRantauChatMessage(actionButton.dataset.messageId);
    else if (action === "delete-contact")
      await deleteRantauChatContact(
        actionButton.dataset.listingId,
        actionButton.dataset.customerId,
      );
  } catch (error) {
    toast(
      `Tindakan chat gagal: ${error.message || "periksa koneksi dan migration Supabase."}`,
    );
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".rantau-chat-context-menu")) hideRantauChatMenu();
});
document.addEventListener("click", async (event) => {
  const rantauClear = event.target.closest("[data-delete-rantau-contact]");
  if (rantauClear) {
    try {
      await deleteRantauChatContact(
        rantauClear.dataset.deleteRantauContact,
        rantauClear.dataset.deleteRantauCustomer,
      );
    } catch (error) {
      toast(`Chat gagal dihapus: ${error.message || "periksa koneksi."}`);
    }
    return;
  }
  const jobClear = event.target.closest("[data-delete-job-contact]");
  if (jobClear) {
    try {
      await deleteJobChatContact(jobClear.dataset.deleteJobContact);
    } catch (error) {
      toast(`Chat gagal dihapus: ${error.message || "periksa koneksi."}`);
    }
  }
});
async function editJobChatMessage(messageId) {
  const message = jobMessages.find(
    (item) => String(item.id || "") === String(messageId),
  );
  if (!message || message.sender_id !== supabaseSession?.user?.id)
    return toast("Pesan ini bukan milik akun Anda dan tidak dapat diedit.");
  const attachment = parseJobMessageAttachment(message.body);
  const current = attachment ? attachment.caption || "" : message.body || "";
  const edited = window.prompt("Edit pesan:", current);
  if (edited === null) return;
  const body = edited.trim();
  if (body.length > 5000) return toast("Pesan maksimal 5.000 karakter.");
  if (!attachment && body.length < 1) return toast("Pesan tidak boleh kosong.");
  const nextBody = attachment
    ? JSON.stringify({ ...attachment, caption: body })
    : body;
  const { error } = await supabaseClient
    .from("jobhub_messages")
    .update({ body: nextBody, edited_at: new Date().toISOString() })
    .eq("id", messageId)
    .eq("sender_id", supabaseSession.user.id);
  if (error) throw error;
  await renderJobMessages(message.application_id);
  toast("Pesan berhasil diedit.");
}
async function deleteJobChatMessage(messageId) {
  const message = jobMessages.find(
    (item) => String(item.id || "") === String(messageId),
  );
  if (!message || message.sender_id !== supabaseSession?.user?.id)
    return toast("Pesan ini bukan milik akun Anda dan tidak dapat dihapus.");
  const attachment = parseJobMessageAttachment(message.body);
  const { error } = await supabaseClient
    .from("jobhub_messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", supabaseSession.user.id);
  if (error) throw error;
  if (attachment?.path) {
    await supabaseClient.storage
      .from(chatAttachmentBucket)
      .remove([attachment.path])
      .catch(() => {});
  }
  await renderJobMessages(message.application_id);
  toast("Pesan berhasil dihapus.");
}
async function deleteJobChatContact(applicationId) {
  const attachmentPaths = jobMessages
    .filter((item) => String(item.application_id) === String(applicationId))
    .map((item) => parseJobMessageAttachment(item.body)?.path)
    .filter(Boolean);
  const { error } = await supabaseClient
    .from("jobhub_messages")
    .delete()
    .eq("application_id", applicationId);
  if (error) throw error;
  if (attachmentPaths.length)
    await supabaseClient.storage
      .from(chatAttachmentBucket)
      .remove([...new Set(attachmentPaths)])
      .catch(() => {});
  jobMessages = jobMessages.filter(
    (item) => String(item.application_id) !== String(applicationId),
  );
  jobMessageApplications = jobMessageApplications.filter(
    (item) => String(item.id) !== String(applicationId),
  );
  saveApplications(jobMessageApplications);
  if (String(activeMessageApplicationId) === String(applicationId))
    activeMessageApplicationId = "";
  await renderJobMessages("");
  toast("Kontak dan seluruh percakapan berhasil dihapus.");
}
async function uploadRantauMessageAttachment(file, listingId, userId) {
  if (!supabaseClient || !rantauMessagesBackendAvailable)
    throw new Error(
      "Lampiran memerlukan koneksi Supabase dan migration JobHub Rantau terbaru.",
    );
  if (
    !chatAttachmentMimeTypes.has(file.type) ||
    file.size > chatAttachmentMaxBytes
  ) {
    throw new Error(
      file.size > chatAttachmentMaxBytes
        ? "Ukuran lampiran maksimal 10 MB."
        : "Format lampiran tidak didukung. Pilih gambar atau dokumen.",
    );
  }
  const safeFileName =
    String(file.name || "lampiran")
      .normalize("NFKC")
      .replace(/[^a-zA-Z0-9._-]+/g, "_")
      .replace(/^\.+/, "")
      .slice(-100) || "lampiran";
  const path = `${listingId}/${userId}/${crypto.randomUUID()}-${safeFileName}`;
  const { error } = await supabaseClient.storage
    .from(RANTAU_MESSAGE_ATTACHMENT_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return {
    path,
    name: file.name || safeFileName,
    mimeType: file.type,
    size: file.size,
  };
}
async function sendRantauChatMessage(message, file = null) {
  const body = String(message.body || "").trim();
  if (!body && !file)
    throw new Error("Tulis pesan atau lampirkan file terlebih dahulu.");
  if (body && body.length < 2) throw new Error("Pesan minimal 2 karakter.");
  if (body.length > 1200) throw new Error("Pesan maksimal 1.200 karakter.");
  let attachment = null;
  try {
    if (file)
      attachment = await uploadRantauMessageAttachment(
        file,
        message.listing_id,
        supabaseSession.user.id,
      );
    const savedRemotely = await saveRantauMessage({
      ...message,
      body: body || `Lampiran: ${attachment.name}`,
      ...(attachment ? { attachment } : {}),
    });
    if (attachment && !savedRemotely)
      throw new Error(
        "Terapkan migration JobHub Rantau terbaru sebelum mengirim lampiran.",
      );
    recordRantauListingInteraction(message.listing_id, "offer");
    return savedRemotely;
  } catch (error) {
    if (attachment?.path) {
      try {
        const { error: cleanupError } = await supabaseClient.storage
          .from(RANTAU_MESSAGE_ATTACHMENT_BUCKET)
          .remove([attachment.path]);
        if (cleanupError)
          console.warn(
            "Unsent Rantau attachment could not be removed:",
            cleanupError.message,
          );
      } catch (cleanupError) {
        console.warn(
          "Unsent Rantau attachment cleanup failed:",
          cleanupError.message,
        );
      }
    }
    throw error;
  }
}
async function saveRantauMessage(message) {
  if (supabaseClient && rantauMessagesBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_messages")
      .insert(message);
    if (error) {
      if (!isMissingRantauMessagesTable(error)) throw error;
      rantauMessagesBackendAvailable = false;
      if (message.attachment)
        throw new Error(
          "Terapkan migration JobHub Rantau terbaru sebelum mengirim lampiran.",
        );
    } else return true;
  }
  if (message.attachment)
    throw new Error("Lampiran chat hanya tersedia saat terhubung ke Supabase.");
  writeStoredJson(RANTAU_MESSAGES_LOCAL_KEY, [
    ...readStoredArray(RANTAU_MESSAGES_LOCAL_KEY),
    {
      ...message,
      id: `message-${Date.now()}`,
      created_at: new Date().toISOString(),
    },
  ]);
  return false;
}
async function openRantauMessageForm(listingId, replyMessage = null) {
  if (!supabaseSession?.user?.id) {
    pendingAuthRoute = "rantau-inbox";
    toast("Masuk atau daftar untuk mengirim pesan kepada pemilik hunian.");
    openAuthModal(false);
    return;
  }
  const listing = await loadRantauListingById(listingId);
  if (!listing) {
    toast("Hunian ini tidak lagi tersedia.");
    return;
  }
  const userId = supabaseSession.user.id;
  const ownerId = replyMessage?.owner_id || listing.owner_id;
  const customerId = replyMessage?.customer_id || userId;
  if (ownerId === userId && !replyMessage) {
    toast("Anda tidak dapat mengirim pesan ke listing sendiri.");
    return;
  }
  const profile = rantauProfile();
  openModal(
    replyMessage ? "Balas pesan" : "Tanya pemilik hunian",
    `<form><p class="form-note"><strong>${escapeHtml(listing.title)}</strong> · ${escapeHtml(listing.location)}</p><div class="form-row"><label for="rantauMessageBody">Pesan</label><textarea id="rantauMessageBody" name="body" required minlength="2" maxlength="1200" rows="5" placeholder="Tanyakan ketersediaan, fasilitas, atau jadwal survei."></textarea></div><button class="btn" type="submit"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim pesan</button></form>`,
    async (data) => {
      const message = {
        listing_id: listing.id,
        listing_title: listing.title,
        owner_id: ownerId,
        customer_id: customerId,
        sender_id: userId,
        sender_name: profile.fullName || supabaseSession.user.email,
        body: String(data.get("body") || "").trim(),
      };
      await saveRantauMessage(message);
      closeModal();
      activeRantauThreadKey = `${listing.id}:${customerId}`;
      if (activeRoute === "rantau-dashboard")
        await renderRantauMessages("#rantauMessages");
      else if (activeRoute === "rantau-inbox")
        await renderRantauMessages("#rantauCustomerMessages");
      else go("rantau-inbox");
      toast(
        supabaseClient && rantauMessagesBackendAvailable
          ? "Pesan berhasil dikirim."
          : "Pesan demo tersimpan di browser ini.",
      );
    },
  );
}
function selectRantauDashboardPanel(panelName) {
  const titles = {
    overview: ["Ringkasan", "Kelola listing dan permintaan calon penyewa."],
    listings: ["Listing saya", "Atur hunian yang tampil di marketplace."],
    messages: ["Pesan", "Percakapan dengan calon penyewa."],
    plans: ["Paket pembayaran", "Pilih paket dan kapasitas listing."],
    profile: ["Profil saya", "Lengkapi profil publik pemilik hunian."],
  };
  if (!titles[panelName]) return;
  document.querySelectorAll("[data-rantau-panel-view]").forEach((panel) => {
    panel.hidden = panel.dataset.rantauPanelView !== panelName;
  });
  document
    .querySelectorAll(".rantau-sidebar-nav [data-rantau-panel]")
    .forEach((button) =>
      button.classList.toggle(
        "active",
        button.dataset.rantauPanel === panelName,
      ),
    );
  const addListingButton = $("[data-rantau-dashboard-listing-action]");
  if (addListingButton) addListingButton.hidden = panelName === "messages";
  $("#rantauDashboardTitle").textContent = titles[panelName][0];
  $("#rantauDashboardDescription").textContent = titles[panelName][1];
  if (panelName === "messages") renderRantauMessages();
  if (panelName === "profile") fillRantauProfileForm();
}
document.addEventListener("click", (event) => {
  const clearAttachment = event.target.closest(
    "[data-rantau-clear-attachment]",
  );
  if (clearAttachment) {
    const form = clearAttachment.closest(".rantau-chat-composer");
    const input = form?.querySelector("[data-rantau-attachment-input]");
    const selection = form?.querySelector("[data-rantau-attachment-selection]");
    if (input) input.value = "";
    if (selection) {
      selection.hidden = true;
      selection.innerHTML = "";
    }
    return;
  }
  const shareMapButton = event.target.closest("[data-rantau-share-map]");
  if (shareMapButton) {
    const composer = shareMapButton.closest("[data-rantau-thread-form]");
    if (!composer || !supabaseSession?.user?.id) {
      toast("Masuk kembali untuk mengirim lokasi melalui chat.");
      return;
    }
    const listingId = shareMapButton.dataset.listingId;
    shareMapButton.disabled = true;
    loadRantauListingById(listingId)
      .then(async (listing) => {
        if (!listing) throw new Error("Hunian tidak ditemukan.");
        const address = [listing.address_detail, listing.location]
          .filter(Boolean)
          .join(", ");
        if (!address)
          throw new Error("Alamat hunian belum dilengkapi oleh pemilik.");
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        const profile = rantauProfile();
        const savedRemotely = await saveRantauMessage({
          listing_id: listing.id,
          listing_title: listing.title,
          owner_id: composer.dataset.ownerId,
          customer_id: composer.dataset.customerId,
          sender_id: supabaseSession.user.id,
          sender_name: profile.fullName || supabaseSession.user.email,
          body: `Lokasi ${listing.title} untuk kunjungan: ${mapUrl}`,
        });
        if (activeRoute === "rantau-dashboard")
          await renderRantauMessages("#rantauMessages");
        else if (activeRoute === "rantau-inbox")
          await renderRantauMessages("#rantauCustomerMessages");
        toast(
          savedRemotely
            ? "Lokasi Google Maps dikirim ke percakapan."
            : "Link lokasi demo tersimpan di browser ini.",
        );
      })
      .catch((error) =>
        toast(`Lokasi belum dapat dikirim: ${error.message || "coba lagi."}`),
      )
      .finally(() => {
        if (shareMapButton.isConnected) shareMapButton.disabled = false;
      });
    return;
  }
  const threadButton = event.target.closest("[data-rantau-thread-select]");
  if (threadButton) {
    activeRantauThreadKey = threadButton.dataset.rantauThreadSelect;
    renderRantauMessages();
    return;
  }
  const provinceButton = event.target.closest("[data-rantau-province]");
  if (provinceButton) {
    const locationInput = $("#rantauLocation");
    if (locationInput)
      locationInput.value = provinceButton.dataset.rantauProvince;
    renderRantauListingResults();
    $("#rantauListingResults")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    return;
  }
  const focusSearch = event.target.closest("[data-rantau-focus-search]");
  if (focusSearch) {
    $("#rantauLocation")?.focus();
    $("#rantauSearchForm")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    return;
  }
  const detailButton = event.target.closest("[data-rantau-detail]");
  if (detailButton) {
    go("rantau-detail", detailButton.dataset.rantauDetail);
    return;
  }
  const messageButton = event.target.closest("[data-rantau-message]");
  if (messageButton) {
    openRantauMessageForm(messageButton.dataset.rantauMessage).catch((error) =>
      toast(`Form pesan gagal dibuka: ${error.message || "coba lagi."}`),
    );
    return;
  }
  const galleryPrev = event.target.closest("[data-rantau-gallery-prev]");
  if (galleryPrev) {
    const active = document.querySelector(
      "[data-rantau-gallery-select].active",
    );
    showRantauGalleryIndex(
      Number(active?.dataset.rantauGallerySelect || 0) - 1,
    );
    return;
  }
  const galleryNext = event.target.closest("[data-rantau-gallery-next]");
  if (galleryNext) {
    const active = document.querySelector(
      "[data-rantau-gallery-select].active",
    );
    showRantauGalleryIndex(
      Number(active?.dataset.rantauGallerySelect || 0) + 1,
    );
    return;
  }
  const galleryExpand = event.target.closest("[data-rantau-gallery-expand]");
  if (galleryExpand) {
    const gallery = $("#rantauGalleryMain");
    if (document.fullscreenElement) document.exitFullscreen?.();
    else gallery?.requestFullscreen?.();
    return;
  }
  const galleryButton = event.target.closest("[data-rantau-gallery-select]");
  if (galleryButton) {
    showRantauGalleryIndex(
      Number(galleryButton.dataset.rantauGallerySelect || 0),
    );
    return;
  }
  const replyButton = event.target.closest("[data-rantau-reply]");
  if (replyButton) {
    loadRantauMessages().then((messages) => {
      const message = messages.find(
        (item) => String(item.id) === String(replyButton.dataset.rantauReply),
      );
      if (message)
        openRantauMessageForm(message.listing_id, message).catch((error) =>
          toast(`Balasan gagal dibuka: ${error.message || "coba lagi."}`),
        );
    });
    return;
  }
  const panelButton = event.target.closest("[data-rantau-panel]");
  if (panelButton) selectRantauDashboardPanel(panelButton.dataset.rantauPanel);
});
document.addEventListener("input", (event) => {
  const search = event.target.closest("#rantauThreadSearch");
  if (!search) return;
  const query = search.value.trim().toLocaleLowerCase("id-ID");
  document.querySelectorAll("[data-rantau-thread-search]").forEach((thread) => {
    thread.hidden = query && !thread.dataset.rantauThreadSearch.includes(query);
  });
});
document.addEventListener("keydown", (event) => {
  const description = event.target.closest("#rantauListingDescription");
  if (!description || event.key !== "Enter" || event.shiftKey) return;
  event.preventDefault();
  const start = description.selectionStart;
  const end = description.selectionEnd;
  const lineStart = description.value.lastIndexOf("\n", start - 1) + 1;
  const currentLine = description.value.slice(lineStart, start);
  if (/^\s*\u2022\s*$/.test(currentLine))
    description.setRangeText("\n", lineStart, end, "end");
  else description.setRangeText("\n\u2022 ", start, end, "end");
  description.dispatchEvent(new Event("input", { bubbles: true }));
});
document.addEventListener("change", (event) => {
  const rantauPhotoInput = event.target.closest("#rantauListingPhotos");
  if (rantauPhotoInput) {
    const files = Array.from(rantauPhotoInput.files || []);
    const preview = rantauPhotoInput.parentElement?.querySelector(
      "[data-rantau-photo-preview]",
    );
    if (files.length > 6) {
      rantauPhotoInput.value = "";
      if (preview)
        preview.innerHTML =
          '<small class="rantau-photo-limit-error">Pilih maksimal 6 foto saja.</small>';
      toast("Maksimal 6 foto untuk setiap hunian.");
      return;
    }
    const invalid = files.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024,
    );
    if (invalid) {
      rantauPhotoInput.value = "";
      if (preview)
        preview.innerHTML =
          '<small class="rantau-photo-limit-error">Gunakan JPG, PNG, atau WebP maksimal 5 MB/foto.</small>';
      toast(
        "Foto tidak valid. Gunakan JPG, PNG, atau WebP maksimal 5 MB/foto.",
      );
      return;
    }
    if (preview)
      preview.innerHTML = files.length
        ? `<strong>${files.length} foto dipilih</strong><div>${files.map((file) => `<span>${escapeHtml(file.name)}</span>`).join("")}</div>`
        : "<span>Belum ada foto baru dipilih</span>";
    return;
  }
  const propertyTypeSelect = event.target.closest("#rantauListingType");
  if (propertyTypeSelect) {
    updateRantauFormPaymentLabel(propertyTypeSelect.value);
    return;
  }
  const rantauAttachmentInput = event.target.closest(
    "[data-rantau-attachment-input]",
  );
  if (rantauAttachmentInput) {
    const file = rantauAttachmentInput.files?.[0];
    const selection = rantauAttachmentInput
      .closest(".rantau-chat-composer")
      ?.querySelector("[data-rantau-attachment-selection]");
    if (
      file &&
      (!chatAttachmentMimeTypes.has(file.type) ||
        file.size > chatAttachmentMaxBytes)
    ) {
      rantauAttachmentInput.value = "";
      if (selection) {
        selection.hidden = true;
        selection.innerHTML = "";
      }
      toast(
        file.size > chatAttachmentMaxBytes
          ? "Ukuran lampiran maksimal 10 MB."
          : "Format lampiran tidak didukung. Pilih gambar atau dokumen.",
      );
      return;
    }
    if (selection) {
      selection.hidden = !file;
      selection.innerHTML = file
        ? `<span><i class="fa-solid fa-paperclip" aria-hidden="true"></i> ${escapeHtml(file.name)} · ${(file.size / 1024 / 1024).toFixed(file.size < 1048576 ? 2 : 1)} MB</span><button type="button" data-rantau-clear-attachment aria-label="Hapus lampiran"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`
        : "";
    }
    return;
  }
  const listingSelect = event.target.closest(
    "[data-rantau-new-listing-select]",
  );
  if (listingSelect) {
    const sendButton = listingSelect
      .closest("form")
      ?.querySelector('button[type="submit"]');
    if (sendButton) sendButton.disabled = !listingSelect.value;
    return;
  }
  const imageInput = event.target.closest(
    '#rantauProfileForm input[type="file"]',
  );
  if (!imageInput?.files?.[0]) return;
  const previewId =
    imageInput.name === "avatarFile"
      ? "rantauAvatarPreview"
      : "rantauCoverPreview";
  const preview = $(`#${previewId}`);
  if (!preview) return;
  const oldImage = preview.querySelector("img");
  if (oldImage?.src.startsWith("blob:")) URL.revokeObjectURL(oldImage.src);
  const previewUrl = URL.createObjectURL(imageInput.files[0]);
  preview.innerHTML = `<img src="${previewUrl}" alt="Pratinjau ${imageInput.name === "avatarFile" ? "foto profil" : "foto sampul"}">`;
});
document.addEventListener("submit", async (event) => {
  const newChatForm = event.target.closest("[data-rantau-new-chat-form]");
  if (newChatForm) {
    event.preventDefault();
    if (!newChatForm.checkValidity()) {
      newChatForm.reportValidity();
      return;
    }
    const sendButton = newChatForm.querySelector('button[type="submit"]');
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Mengirim';
    }
    try {
      const listing = await loadRantauListingById(
        newChatForm.elements.listingId.value,
      );
      if (!listing || listing.status !== "active")
        throw new Error("Hunian ini tidak lagi tersedia.");
      if (listing.owner_id === supabaseSession.user.id)
        throw new Error(
          "Pilih hunian milik pengguna lain untuk memulai percakapan.",
        );
      const profile = rantauProfile();
      const messageBody = String(
        new FormData(newChatForm).get("body") || "",
      ).trim();
      const attachment =
        newChatForm.querySelector("[data-rantau-attachment-input]")
          ?.files?.[0] || null;
      const savedRemotely = await sendRantauChatMessage(
        {
          listing_id: listing.id,
          listing_title: listing.title,
          owner_id: listing.owner_id,
          customer_id: supabaseSession.user.id,
          sender_id: supabaseSession.user.id,
          sender_name: profile.fullName || supabaseSession.user.email,
          body: messageBody,
        },
        attachment,
      );
      activeRantauThreadKey = `${listing.id}:${supabaseSession.user.id}`;
      await renderRantauMessages(
        activeRoute === "rantau-dashboard"
          ? "#rantauMessages"
          : "#rantauCustomerMessages",
      );
      toast(
        savedRemotely
          ? "Pesan berhasil dikirim ke pemilik hunian."
          : "Pesan demo tersimpan di browser ini.",
      );
    } catch (error) {
      toast(
        `Pesan belum dapat dikirim: ${error.message || "periksa koneksi dan migration JobHub Rantau."}`,
      );
    } finally {
      if (sendButton?.isConnected) {
        sendButton.disabled = false;
        sendButton.innerHTML =
          '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim';
      }
    }
    return;
  }
  const chatForm = event.target.closest("[data-rantau-thread-form]");
  if (chatForm) {
    event.preventDefault();
    if (!chatForm.checkValidity()) {
      chatForm.reportValidity();
      return;
    }
    const sendButton = chatForm.querySelector('button[type="submit"]');
    if (sendButton) {
      sendButton.disabled = true;
      sendButton.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Mengirim';
    }
    try {
      const profile = rantauProfile();
      const messageBody = String(
        new FormData(chatForm).get("body") || "",
      ).trim();
      const attachment =
        chatForm.querySelector("[data-rantau-attachment-input]")?.files?.[0] ||
        null;
      const savedRemotely = await sendRantauChatMessage(
        {
          listing_id: chatForm.dataset.listingId,
          listing_title: chatForm.dataset.listingTitle,
          owner_id: chatForm.dataset.ownerId,
          customer_id: chatForm.dataset.customerId,
          sender_id: supabaseSession.user.id,
          sender_name: profile.fullName || supabaseSession.user.email,
          body: messageBody,
        },
        attachment,
      );
      await renderRantauMessages();
      toast(
        savedRemotely
          ? "Pesan berhasil dikirim."
          : "Pesan demo tersimpan di browser ini.",
      );
    } catch (error) {
      toast(
        `Pesan belum dapat dikirim: ${error.message || "periksa koneksi dan migration pesan JobHub Rantau."}`,
      );
    } finally {
      if (sendButton?.isConnected) {
        sendButton.disabled = false;
        sendButton.innerHTML =
          '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Kirim';
      }
    }
    return;
  }
  const form = event.target.closest("#rantauProfileForm");
  if (!form) return;
  event.preventDefault();
  const saveButton = form.querySelector('button[type="submit"]');
  if (saveButton) {
    saveButton.disabled = true;
    saveButton.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Menyimpan';
  }
  const currentProfile = rantauProfile();
  const user = supabaseSession.user;
  try {
    const avatarUrl =
      (await uploadRantauProfileImage(
        form.elements.avatarFile.files[0],
        "avatar",
      )) || currentProfile.avatarUrl;
    const coverUrl =
      (await uploadRantauProfileImage(
        form.elements.coverFile.files[0],
        "cover",
      )) || currentProfile.coverUrl;
    const whatsapp = normalizeRantauWhatsApp(form.elements.whatsapp.value);
    if (!whatsapp)
      throw new Error(
        "Masukkan nomor WhatsApp aktif Indonesia, misalnya 0812xxxx atau 62812xxxx.",
      );
    const profile = {
      full_name: String(form.elements.fullName.value || "").trim(),
      whatsapp,
      city: String(form.elements.city.value || "").trim(),
      avatar_url: avatarUrl,
      cover_url: coverUrl,
      about: String(form.elements.about.value || "").trim(),
    };
    const { data, error } = await supabaseClient.auth.updateUser({
      data: {
        ...user.user_metadata,
        full_name: profile.full_name,
        whatsapp: profile.whatsapp,
        marketplace_profile: profile,
      },
    });
    if (error) throw error;
    supabaseSession = { ...supabaseSession, user: data.user };
    await syncRantauProfileToListings(profile);
    renderAccountMenu();
    renderRantauDashboard();
    toast(
      supabaseClient
        ? "Profil marketplace berhasil disimpan."
        : "Profil demo tersimpan di browser ini.",
    );
  } catch (error) {
    toast(
      `Profil belum dapat disimpan: ${error.message || "periksa koneksi dan ukuran foto."}`,
    );
  } finally {
    if (saveButton?.isConnected) {
      saveButton.disabled = false;
      saveButton.innerHTML =
        '<i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan profil';
    }
  }
});
async function updateRantauListing(id, changes) {
  if (supabaseClient && rantauBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_listings")
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("owner_id", supabaseSession.user.id);
    if (error) {
      if (!isMissingRantauTable(error)) throw error;
      rantauBackendAvailable = false;
    } else return;
  }
  saveLocalRantauListings(
    readStoredArray(RANTAU_LOCAL_KEY).map((item) =>
      item.id === id && item.owner_id === supabaseSession.user.id
        ? { ...item, ...changes }
        : item,
    ),
  );
}
async function deleteRantauListing(id) {
  if (supabaseClient && rantauBackendAvailable) {
    const { error } = await supabaseClient
      .from("jobhub_rantau_listings")
      .delete()
      .eq("id", id)
      .eq("owner_id", supabaseSession.user.id);
    if (error) {
      if (!isMissingRantauTable(error)) throw error;
      rantauBackendAvailable = false;
    } else return;
  }
  saveLocalRantauListings(
    readStoredArray(RANTAU_LOCAL_KEY).filter(
      (item) => !(item.id === id && item.owner_id === supabaseSession.user.id),
    ),
  );
}
document.addEventListener("click", (event) => {
  const openForm = event.target.closest("[data-open-rantau-form]");
  if (openForm) {
    openRantauListingForm();
    return;
  }
  const choosePlan = event.target.closest("[data-rantau-plan]");
  if (choosePlan) {
    if (choosePlan.dataset.rantauPlan !== "free") {
      toast(
        "Paket berbayar akan tersedia setelah pembayaran online terhubung.",
      );
      return;
    }
    localStorage.setItem(
      `jobhub-rantau-plan:${supabaseSession?.user?.id || "guest"}`,
      JSON.stringify({
        planId: "free",
        startedAt: new Date().toISOString(),
        expiresAt: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }),
    );
    renderRantauDashboard();
    return;
  }
  const toggleListing = event.target.closest("[data-rantau-toggle]");
  if (toggleListing) {
    updateRantauListing(toggleListing.dataset.rantauToggle, {
      status: toggleListing.dataset.nextStatus,
    })
      .then(renderRantauDashboard)
      .catch((error) =>
        toast(
          `Status listing gagal diperbarui: ${error.message || "coba lagi."}`,
        ),
      );
    return;
  }
  const editListing = event.target.closest("[data-rantau-edit]");
  if (editListing) {
    openRantauEditForm(editListing.dataset.rantauEdit);
    return;
  }
  const removeListing = event.target.closest("[data-rantau-delete]");
  if (removeListing && window.confirm("Hapus listing hunian ini?")) {
    deleteRantauListing(removeListing.dataset.rantauDelete)
      .then(renderRantauDashboard)
      .catch((error) =>
        toast(`Listing gagal dihapus: ${error.message || "coba lagi."}`),
      );
  }
});
const filterGroups = [
  ["Lokasi", ["Jakarta", "Surabaya", "Bandung", "Bali", "Remote"]],
  ["Kategori", categories.map(([name]) => name)],
  ["Tipe pekerjaan", ["Full Time", "Part Time", "Freelance", "Remote"]],
  ["Pengalaman", ["Fresh Graduate", "1 Tahun", "2 Tahun", "Senior"]],
  ["Gaji", ["0-5 juta", "5-10 juta", "10 juta+"]],
];
function isJobInCategory(job, category) {
  const normalize = (value) =>
    String(value || "")
      .toLocaleLowerCase("id-ID")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return normalize(job.category) === normalize(category);
}
function renderFilters() {
  $("#jobFilters").innerHTML = filterGroups
    .map(
      ([title, opts]) =>
        `<div class="filter-group"><strong class="filter-title">${title}</strong>${opts
          .map(
            (
              opt,
            ) => `<label class="filter-option"><input type="checkbox" data-filter-group="${title}" value="${opt}"> ${
              opt
            }
  </label>`,
          )
          .join("")}</div>`,
    )
    .join("");
  $$("#jobFilters input").forEach((input) =>
    input.addEventListener("change", renderJobs),
  );
}
function renderJobs() {
  window.clearTimeout(jobRenderTimer);
  const results = $("#jobsResultContent");
  results?.setAttribute("aria-busy", "true");
  $("#resultsCount").innerHTML =
    '<span class="jobs-loading"><i class="fa-solid fa-circle-notch" aria-hidden="true"></i> Memuat lowongan yang sesuai...</span>';
  jobRenderTimer = window.setTimeout(() => {
    let list = jobs.filter((job) => {
      const key = searchState.keyword.toLocaleLowerCase("id-ID"),
        location = searchState.location.toLocaleLowerCase("id-ID");
      const searchable =
        `${job.title || ""} ${job.company || ""} ${job.category || ""} ${(job.skills || []).join(" ")}`.toLocaleLowerCase(
          "id-ID",
        );
      if (key && !searchable.includes(key)) return false;
      if (
        location &&
        !String(job.loc || "")
          .toLocaleLowerCase("id-ID")
          .includes(location)
      )
        return false;
      if (searchState.category && !isJobInCategory(job, searchState.category))
        return false;
      for (const [title] of filterGroups) {
        const picked = $$(
          `#jobFilters input[data-filter-group="${title}"]:checked`,
        ).map((input) => input.value);
        if (!picked.length) continue;
        if (
          title === "Lokasi" &&
          !picked.some((value) =>
            String(job.loc || "")
              .toLowerCase()
              .includes(value.toLowerCase()),
          )
        )
          return false;
        if (
          title === "Kategori" &&
          !picked.some((category) => isJobInCategory(job, category))
        )
          return false;
        if (title === "Tipe pekerjaan" && !picked.includes(job.type))
          return false;
        if (title === "Pengalaman" && !picked.includes(job.experience))
          return false;
        if (title === "Gaji") {
          const salary =
            Number(job.salaryMax || job.salary || job.salaryMin) || 0;
          const band =
            salary < 5000000
              ? "0-5 juta"
              : salary < 10000000
                ? "5-10 juta"
                : "10 juta+";
          if (!picked.includes(band)) return false;
        }
      }
      return true;
    });
    const postedTime = (job) =>
      Date.parse(job.postedAt || job.posted_at || job.createdAt || "") || 0;
    const sort = $("#sortJobs")?.value;
    if (sort === "salary")
      list.sort(
        (left, right) =>
          (Number(right.salaryMax || right.salary || right.salaryMin) || 0) -
          (Number(left.salaryMax || left.salary || left.salaryMin) || 0),
      );
    else if (sort === "relevance" && searchState.keyword) {
      const keyword = searchState.keyword.toLocaleLowerCase("id-ID");
      const score = (job) =>
        [job.title, job.category, job.company, ...(job.skills || [])].reduce(
          (total, value) =>
            total +
            (String(value || "")
              .toLocaleLowerCase("id-ID")
              .includes(keyword)
              ? 1
              : 0),
          0,
        );
      list.sort(
        (left, right) =>
          score(right) - score(left) || postedTime(right) - postedTime(left),
      );
    } else list.sort((left, right) => postedTime(right) - postedTime(left));
    $("#resultsCount").innerHTML =
      `Menampilkan <strong>${list.length} lowongan</strong>`;
    $("#allJobs").innerHTML = list.length
      ? list.map(jobCard).join("")
      : `<div class="empty-state"><strong>${jobs.length ? "Belum ada lowongan yang cocok" : "Belum ada lowongan tersedia"}</strong>${jobs.length ? "Coba ubah kata kunci atau hapus beberapa filter." : "Perusahaan belum memposting lowongan."}</div>`;
    results?.setAttribute("aria-busy", "false");
  }, 80);
}
async function refreshPublishedCandidateProfiles() {
  if (candidateProfilesPromise) await candidateProfilesPromise.catch(() => {});
  candidateProfilesLoaded = false;
  candidateProfilesCache = [];
  await loadPublishedCandidateProfiles();
  if (activeRoute === "candidate-feed") await renderCandidateFeed();
}
function renderJobDescription(description) {
  const lines = String(description || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return "<p>Belum ditambahkan.</p>";
  const output = [];
  let bullets = [];
  const flushBullets = () => {
    if (bullets.length)
      output.push(
        `<ul>${bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
      );
    bullets = [];
  };
  for (const line of lines) {
    const bullet = line.match(/^[•*-]\s+(.+)$/);
    if (bullet) bullets.push(bullet[1]);
    else bullets.push(line);
  }
  flushBullets();
  return output.join("");
}
function renderDetail(id, container = $("#detailContent")) {
  const storedJob = jobs.find((item) => String(item.id) === String(id));
  const job = storedJob
    ? {
        ...storedJob,
        screeningQuestions: storedJob.screeningEnabled
          ? storedJob.screeningQuestions || []
          : [],
      }
    : null;
  if (!container) return;
  if (!job) {
    container.innerHTML =
      '<div class="empty-state"><strong>Lowongan tidak ditemukan</strong>Lowongan yang dipilih tidak tersedia atau telah dihapus.</div>';
    return;
  }
  const responsibilities =
    Array.isArray(job.responsibilities) && job.responsibilities.length
      ? job.responsibilities
      : ["Bertanggung jawab sesuai kebutuhan posisi."];
  const requirements =
    Array.isArray(job.requirements) && job.requirements.length
      ? job.requirements
      : ["Memiliki kemampuan yang relevan dengan posisi."];
  const benefits =
    Array.isArray(job.benefits) && job.benefits.length
      ? job.benefits
      : ["Kesempatan berkembang dan lingkungan kerja yang sehat."];
  const skills =
    Array.isArray(job.skills) && job.skills.length
      ? job.skills
      : ["Komunikasi", "Kerja tim"];
  const deadlineText = job.deadline
    ? new Date(`${job.deadline}T12:00:00`).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Batas waktu belum diatur";
  const companyTag = renderCompanyVerificationBadge(job.company);
  const attributes = [
    ["Kategori pekerjaan", job.category],
    ["Bidang industri", job.industry],
    ["Level karier", job.careerLevel],
    ["Jumlah kebutuhan", job.quantity ? `${job.quantity} orang` : ""],
    ["Pendidikan minimal", job.minimumEducation],
    ["Jurusan", job.major],
    ["Pengalaman", job.experience],
    [
      "Rentang usia",
      job.ageMin || job.ageMax
        ? [`${job.ageMin || "—"}–${job.ageMax || "—"} tahun`]
        : "",
    ],
    ["Jenis kelamin", job.gender],
    ["Sertifikat", job.certificate],
    ["Bahasa", job.language],
    ["SIM", job.sim],
  ].filter(([, value]) => String(value || "").trim());
  const publicCompany = companyDirectoryCache.find(
    (company) => String(company.company_id) === String(job.companyId),
  );
  container.innerHTML = `<article class="job-detail-card">
    <div class="job-detail-header">
      <div class="job-detail-company-logo">${companyLogo(job)}</div>
      <div>
        <div class="job-detail-company">${escapeHtml(job.company)} ${companyTag}</div>
        <h1>${escapeHtml(job.title)}</h1>
        <div class="job-detail-meta">
          <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(job.loc)}</span>
          <span><i class="fa-solid fa-briefcase" aria-hidden="true"></i> ${escapeHtml(job.type)}</span>
          <span><i class="fa-solid fa-clock" aria-hidden="true"></i> ${escapeHtml(job.experience || "Semua pengalaman")}</span>
        </div>
        ${job.companyId ? `<button class="company-profile-detail-link" type="button" data-company-profile-view="${escapeHtml(job.companyId)}"><i class="fa-regular fa-building" aria-hidden="true"></i> Lihat profil perusahaan <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>` : ""}
        <p class="job-public-company-email" data-job-public-email ${publicCompany?.public_email ? `data-email="${escapeHtml(publicCompany.public_email)}"` : ""} ${publicCompany?.public_email ? "" : "hidden"}></p>
      </div>
    </div>
    <div class="job-detail-actions">
      <button class="btn" type="button" data-job-apply="${escapeHtml(job.id)}">Lamar sekarang</button>
      <button class="btn btn-outline" type="button" data-save="${escapeHtml(job.id)}">${isJobSaved(job.id) ? "Hapus dari favorit" : "Simpan lowongan"}</button>
      <button class="btn btn-outline" type="button" data-job-chat="${escapeHtml(job.id)}"><i class="fa-regular fa-comments" aria-hidden="true"></i> Chat HRD</button>
    </div>
    <div class="job-detail-summary">
      <div><i class="fa-solid fa-circle-dollar-to-slot" aria-hidden="true"></i> ${escapeHtml(job.salaryText || (job.salaryHidden ? "Gaji dirahasiakan" : "Gaji sesuai pasar"))}</div>
      <div><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> Deadline: ${escapeHtml(deadlineText)}</div>
      <div><i class="fa-solid fa-user-tie" aria-hidden="true"></i> ${escapeHtml(job.department || "Departemen umum")}</div>
    </div>
    ${attributes.length ? `<div class="detail-section job-detail-attributes"><h3><i class="fa-solid fa-list-check" aria-hidden="true"></i> Persyaratan dan detail posisi</h3><dl>${attributes.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl></div>` : ""}
    <div class="detail-section">
      <h3><i class="fa-regular fa-file-lines" aria-hidden="true"></i> Deskripsi pekerjaan</h3>
      <div>${renderJobDescription(job.description || job.requirements?.join("\n") || "Belum ada deskripsi.")}</div>
    </div>
    <div class="detail-section">
      <h3><i class="fa-solid fa-list-check" aria-hidden="true"></i> Tanggung jawab</h3>
      <ul>${responsibilities.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="detail-section">
      <h3><i class="fa-solid fa-user-check" aria-hidden="true"></i> Kualifikasi</h3>
      <ul>${requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="detail-section">
      <h3><i class="fa-solid fa-gift" aria-hidden="true"></i> Benefit</h3>
      <ul>${benefits.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
    <div class="detail-section">
      <h3><i class="fa-solid fa-tags" aria-hidden="true"></i> Skill yang dibutuhkan</h3>
      <div class="job-tags">${skills.map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("")}</div>
    </div>
    ${job.screeningQuestions?.length ? `<div class="detail-section"><h3><i class="fa-regular fa-circle-question" aria-hidden="true"></i> Pertanyaan screening</h3>${job.screeningQuestions.map((question, index) => `<article class="job-screening-preview"><strong>${index + 1}. ${escapeHtml(question.prompt || "")}</strong><span>${question.required === false ? "Opsional" : "Wajib dijawab"}</span>${question.options?.length ? `<p>Pilihan: ${question.options.map(escapeHtml).join(" · ")}</p>` : ""}</article>`).join("")}</div>` : ""}
  </article>`;
}
async function openJobDetailDrawer(jobId) {
  const job = jobs.find((item) => String(item.id) === String(jobId));
  const backdrop = $("#jobDetailBackdrop"),
    content = $("#jobDetailDrawerContent"),
    title = $("#jobDetailDrawerTitle");
  if (!job || !backdrop || !content) return;
  activeJobDetailId = String(job.id);
  renderDetail(job.id, content);
  if (title) title.textContent = job.title || "Detail lowongan";
  backdrop.hidden = false;
  document.body.classList.add("job-detail-open");
  $("#jobDetailDrawer")?.focus({ preventScroll: true });
  if (!(isHrdSession() && job.companyId === billingCompanyId()))
    recordJobView(job.id);
  if (job.companyId) {
    try {
      const company = await getPublicCompanyDirectoryProfile(job.companyId);
      if (activeJobDetailId !== String(job.id) || !company?.public_email)
        return;
      const contact = content.querySelector("[data-job-public-email]");
      if (contact) {
        contact.hidden = false;
        contact.innerHTML = `<i class="fa-regular fa-envelope" aria-hidden="true"></i><a href="mailto:${encodeURIComponent(company.public_email)}">${escapeHtml(company.public_email)}</a>`;
      }
    } catch (error) {
      console.warn("Public company contact unavailable:", error.message);
    }
  }
}
function closeJobDetailDrawer() {
  const backdrop = $("#jobDetailBackdrop");
  if (!backdrop || backdrop.hidden) return;
  backdrop.hidden = true;
  document.body.classList.remove("job-detail-open");
  activeJobDetailId = "";
  $("#jobDetailDrawerContent")?.replaceChildren();
}
function renderCompanyTeam() {
  const panel = $("#companyTeamPanel");
  if (!panel) return;
  panel.hidden = !isCompanyOwner();
  if (!panel.hidden && !supabaseClient) {
    const invites = getDemoCompanyInvites().filter(
      (invite) => invite.companyId === billingCompanyId(),
    );
    panel.innerHTML = `<div class="section-head"><div><h2 id="companyTeamHeading">Tim HR perusahaan</h2><p>Demo: siapkan undangan staf dengan alamat email tanpa login atau akun Supabase.</p></div><button class="btn btn-outline btn-small" type="button" data-manage-team>Undang dengan email</button></div><p class="form-note">Mode demo lokal: undangan hanya tersimpan di browser ini dan belum dikirim. Pengiriman email dan sinkronisasi real-time akan diaktifkan setelah API tersedia.</p>${invites.length ? `<div class="company-team-list">${invites.map((invite) => `<article class="company-team-member"><span class="team-member-avatar" aria-hidden="true">${escapeHtml(invite.email.slice(0, 1).toUpperCase())}</span><span><strong>${escapeHtml(invite.email)}</strong><small>${escapeHtml(roleLabel(invite.role))} · Demo</small></span><span class="team-member-status">Belum dikirim</span><button class="text-link" type="button" data-remove-demo-invite="${escapeHtml(invite.id)}" aria-label="Hapus undangan demo untuk ${escapeHtml(invite.email)}">Hapus</button></article>`).join("")}</div>` : '<p class="form-note">Belum ada undangan demo.</p>'}`;
  }
}
function getDemoCompanyInvites() {
  try {
    const invites = JSON.parse(
      localStorage.getItem(DEMO_COMPANY_INVITES_KEY) || "[]",
    );
    return Array.isArray(invites) ? invites : [];
  } catch {
    return [];
  }
}
async function loadCompanyTeam() {
  const panel = $("#companyTeamPanel");
  if (!panel || !isCompanyOwner() || !supabaseClient) return;
  const { data, error } = await supabaseClient
    .from("jobhub_company_members")
    .select("user_id,email,role,status,created_at")
    .eq("company_id", billingCompanyId())
    .order("created_at", { ascending: true });
  if (error) throw error;
  const ownerEmail = supabaseSession.user.email || "Akun perusahaan";
  const members = [
    {
      user_id: supabaseSession.user.id,
      email: ownerEmail,
      role: "owner",
      status: "active",
    },
    ...data.filter((member) => member.user_id !== supabaseSession.user.id),
  ];
  panel.innerHTML = `<div class="section-head"><div><h2 id="companyTeamHeading">Tim HR perusahaan</h2><p>Kelola akun Owner, HR Manager, dan Recruiter.</p></div><button class="btn btn-outline btn-small" type="button" data-manage-team>Undang anggota</button></div><div class="company-team-list">${members.map((member) => `<article class="company-team-member"><span class="team-member-avatar" aria-hidden="true">${escapeHtml((member.email || "?").slice(0, 1).toUpperCase())}</span><span><strong>${escapeHtml(member.email)}</strong><small>${escapeHtml(roleLabel(member.role))}</small></span><span class="team-member-status">${member.role === "owner" ? "Pemilik" : "Anggota tim"}</span></article>`).join("")}</div>`;
}
function openInviteCompanyHr() {
  if (!isCompanyOwner()) {
    toast("Hanya Owner perusahaan yang dapat mengundang staf.");
    return;
  }
  const demoMode = !supabaseClient;
  openModal(
    "Undang akun HR perusahaan",
    `<form class="company-team-invite-form"><p class="form-note">${demoMode ? "Mode demo: masukkan email staf untuk mencatat undangan di browser ini. Email belum akan dikirim." : "Undangan akses perusahaan akan dikirim melalui email."} HR Manager dapat mengelola kandidat; Recruiter hanya dapat melihat kandidat dan jadwal interview.</p><div class="form-row"><label for="teamMemberEmail">Email staf</label><input id="teamMemberEmail" name="email" type="email" required maxlength="254" placeholder="staf@perusahaan.co.id"></div><div class="form-row"><label for="teamMemberRole">Role</label><select id="teamMemberRole" name="role" required><option value="hr_manager">HR Manager · Kelola kandidat</option><option value="recruiter">Recruiter · Lihat kandidat & interview</option></select></div><button class="btn" type="submit">${demoMode ? "Simpan undangan demo" : "Kirim undangan"}</button></form>`,
    async (data) => {
      const email = String(data.get("email") || "")
        .trim()
        .toLowerCase();
      const role = String(data.get("role") || "");
      if (demoMode) {
        const invites = getDemoCompanyInvites();
        if (
          invites.some(
            (invite) =>
              invite.companyId === billingCompanyId() && invite.email === email,
          )
        ) {
          toast("Email tersebut sudah ada dalam daftar undangan demo.");
          return;
        }
        invites.push({
          id: `DEMO-INVITE-${Date.now()}`,
          companyId: billingCompanyId(),
          email,
          role,
          status: "demo_pending",
          createdAt: new Date().toISOString(),
        });
        writeStoredJson(DEMO_COMPANY_INVITES_KEY, invites);
        closeModal();
        renderCompanyTeam();
        toast(`Undangan demo untuk ${email} disimpan. Email belum dikirim.`);
        return;
      }
      if (!supabaseClient) {
        toast("Layanan undangan belum tersedia.");
        return;
      }
      const { data: result, error } = await supabaseClient.functions.invoke(
        "invite-company-hr",
        { body: { email, role } },
      );
      if (error) {
        toast(
          `Undangan staf gagal dikirim: ${error.message || "periksa Edge Function dan konfigurasi email Supabase."}`,
        );
        return;
      }
      if (!result?.invited) {
        toast(
          "Undangan staf belum terkonfirmasi. Periksa status Edge Function.",
        );
        return;
      }
      closeModal();
      toast(`Undangan ${roleLabel(role)} dikirim ke ${email}.`);
      await loadCompanyTeam();
    },
  );
}
function confirmDeleteCompanyJob(jobId) {
  if (!canDeleteCompanyJobs()) {
    toast("Akun ini tidak memiliki akses menghapus lowongan.");
    return;
  }
  const job = jobs.find((item) => item.id === jobId);
  if (!job || !companyJobs().some((item) => item.id === jobId)) {
    toast("Lowongan tidak ditemukan atau bukan milik perusahaan Anda.");
    return;
  }
  openModal(
    "Hapus lowongan?",
    `<form><p>Lowongan <strong>${escapeHtml(job.title)}</strong> akan dihapus dari workspace perusahaan dan tidak lagi dapat dilamar.</p><button class="btn" type="submit">Ya, hapus lowongan</button></form>`,
    async () => {
      closeModal();
      await deleteCompanyJob(jobId);
    },
  );
}
function companyTimeGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Jakarta",
    }).format(new Date()),
  );
  const greeting =
    hour >= 5 && hour < 11
      ? "pagi"
      : hour >= 11 && hour < 15
        ? "siang"
        : hour >= 15 && hour < 19
          ? "sore"
          : "malam";
  return `Halo, selamat ${greeting}, ${getCurrentCompanyName()}`;
}
function updateCompanyDashboardClock() {
  const now = new Date();
  const greeting = $("#companyDashboardGreeting");
  const clock = $("#companyDashboardClock");
  if (greeting) greeting.textContent = companyTimeGreeting();
  if (clock) {
    const date = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    }).format(now);
    const time = new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZone: "Asia/Jakarta",
    }).format(now);
    clock.textContent = `${date} · ${time} WIB`;
  }
}
function startCompanyDashboardClock() {
  window.clearInterval(companyDashboardClockTimer);
  updateCompanyDashboardClock();
  companyDashboardClockTimer = window.setInterval(
    updateCompanyDashboardClock,
    1000,
  );
}
function renderCompanyDashboardBrand() {
  const panel = $("#companyDashboardBrand");
  if (!panel) return;
  const profile = currentCompanyProfile();
  const companyName = profile.company_name || getCurrentCompanyName();
  panel.classList.toggle("has-cover-image", Boolean(profile.cover_image_url));
  const cover = document.createElement("div");
  cover.className = "company-dashboard-cover";
  cover.classList.toggle("has-image", Boolean(profile.cover_image_url));
  if (profile.cover_image_url) {
    const coverImage = new Image();
    coverImage.alt = `Sampul ${companyName}`;
    coverImage.src = profile.cover_image_url;
    cover.append(coverImage);
  }
  const identity = document.createElement("div");
  identity.className = "company-dashboard-identity";
  const brandInfo = document.createElement("div");
  brandInfo.className = "company-dashboard-brand-info";
  const logo = document.createElement("div");
  logo.className = "company-dashboard-logo";
  if (profile.logo_url) {
    const logoImage = new Image();
    logoImage.alt = `Logo ${companyName}`;
    logoImage.src = profile.logo_url;
    logo.append(logoImage);
  } else
    logo.textContent = companyName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  const details = document.createElement("div");
  details.className = "company-dashboard-copy";
  const name = document.createElement("h2");
  name.textContent = companyName;
  const meta = document.createElement("p");
  meta.textContent =
    [
      profile.industry,
      profile.company_size && `${profile.company_size} karyawan`,
    ]
      .filter(Boolean)
      .join(" · ") || "Lengkapi profil dan foto perusahaan";
  const verified = Boolean(
    currentCompanyVerification?.status === "verified" &&
      companyVerificationOwnerId === supabaseSession?.user?.id,
  );
  const badge = document.createElement("span");
  badge.className = `company-dashboard-status${verified ? " is-verified" : ""}`;
  badge.innerHTML = `<i class="fa-solid ${verified ? "fa-circle-check" : "fa-building"}" aria-hidden="true"></i> ${verified ? "Perusahaan terverifikasi" : "Profil perusahaan"}`;
  details.append(name, meta, badge);
  brandInfo.append(logo, details);
  const completion = companyProfileCompletionState(profile);
  const completed = completion.checks.filter((check) => check.complete).length;
  const total = completion.checks.length;
  const profileProgress = document.createElement("div");
  profileProgress.className = "company-dashboard-progress";
  profileProgress.innerHTML = `<span class="company-dashboard-progress-icon"><i class="fa-solid ${completion.complete ? "fa-circle-check" : "fa-user-pen"}" aria-hidden="true"></i></span><span><strong>${completion.complete ? "Profil perusahaan lengkap" : "Lengkapi profil dan foto perusahaan"}</strong><small>${completed} dari ${total} informasi profil sudah lengkap</small></span><i class="fa-solid fa-chevron-right company-dashboard-progress-arrow" aria-hidden="true"></i>`;
  const edit = document.createElement("button");
  edit.className = "btn company-dashboard-edit";
  edit.type = "button";
  edit.dataset.completeCompanyProfile = "";
  edit.innerHTML = `<i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> ${completion.complete ? "Edit profil perusahaan" : "Lengkapi profil"}`;
  identity.append(brandInfo, profileProgress, edit);
  panel.replaceChildren(cover, identity);
}
function getCompanyOnboardingState() {
  const session = supabaseSession;
  const verification = getCompanyVerifications().find(
    (item) => item.userId === session?.user?.id,
  );
  const profileComplete = companyProfileCompletionState().complete;
  const emailConfirmed = Boolean(session?.user?.email_confirmed_at);
  const verified =
    companyVerificationOwnerId === session?.user?.id &&
    currentCompanyVerification?.status === "verified";
  const hrdActive = isHrdSession(session);
  const paymentActive = Boolean(
    hrdActive &&
      subscriptionOwnerId === billingCompanyId() &&
      currentSubscriptionCache &&
      new Date(currentSubscriptionCache.expiredDate) > new Date(),
  );
  return {
    verification,
    profileComplete,
    emailConfirmed,
    verified,
    hrdActive,
    paymentActive,
    ready:
      profileComplete &&
      emailConfirmed &&
      verified &&
      hrdActive &&
      paymentActive,
  };
}
function renderCompanyDashboardOnboarding() {
  const panel = $("#companyDashboardOnboarding");
  const workspace = $("#companyDashboardWorkspace");
  if (!panel || !workspace) return true;
  const isCompany = Boolean(supabaseClient && isCompanyAccount());
  panel.hidden = !isCompany;
  workspace.hidden = isCompany;
  if (!isCompany) return true;
  const state = getCompanyOnboardingState();
  panel.classList.toggle("is-hrd-pending", state.verified && !state.hrdActive);
  workspace.hidden = !state.verified;
  panel.hidden = state.ready;
  if (state.ready) return true;
  const verificationLabel = state.verified
    ? "Terverifikasi"
    : state.verification?.status === "rejected"
      ? "Perlu perbaikan"
      : state.verification?.status === "pending"
        ? "Menunggu pemeriksaan"
        : "Belum diajukan";
  const canSubmitVerification =
    state.profileComplete &&
    state.emailConfirmed &&
    !state.verified &&
    (!state.verification ||
      state.verification.status === "rejected" ||
      state.verification.uploadPending);
  const steps = [
    {
      label: "Lengkapi profil perusahaan",
      description:
        "Tambahkan informasi dan foto perusahaan untuk meningkatkan kepercayaan pelamar.",
      icon: "fa-building",
      done: state.profileComplete,
      active: !state.profileComplete,
      action: !state.profileComplete
        ? '<button class="btn" type="button" data-complete-company-profile><i class="fa-solid fa-arrow-right" aria-hidden="true"></i> Lengkapi profil</button>'
        : "",
    },
    {
      label: "Konfirmasi email",
      description:
        "Konfirmasi alamat email perusahaan satu kali agar proses persiapan dapat dilanjutkan.",
      icon: "fa-envelope-circle-check",
      done: state.emailConfirmed,
      active: state.profileComplete && !state.emailConfirmed,
      action: !state.emailConfirmed
        ? '<button class="btn" type="button" data-company-resend-confirmation><i class="fa-solid fa-envelope" aria-hidden="true"></i> Kirim ulang email</button>'
        : "",
    },
    {
      label: `Verifikasi legal perusahaan · ${verificationLabel}`,
      description:
        state.verification?.status === "pending" &&
        !state.verification?.uploadPending
          ? "Pengajuan telah diterima dan tercatat di dashboard admin. Tim JobHub akan meninjau dalam 1 hari kerja."
          : state.verification?.uploadPending
            ? "Pengajuan belum diterima server. Periksa koneksi atau konfigurasi sebelum mengirim ulang."
            : "Ajukan dokumen legal perusahaan untuk ditinjau tim JobHub.",
      icon: "fa-shield-halved",
      done: state.verified,
      active: state.profileComplete && state.emailConfirmed && !state.verified,
      action: canSubmitVerification
        ? '<button class="btn" type="button" data-submit-company-verification><i class="fa-solid fa-file-circle-check" aria-hidden="true"></i> Ajukan verifikasi</button>'
        : "",
    },
    {
      label: "Aktifkan paket perusahaan",
      description: state.hrdActive
        ? "Pilih paket untuk membuka fitur rekrutmen perusahaan."
        : "Paket dapat dipilih setelah akses HRD perusahaan aktif.",
      icon: "fa-credit-card",
      done: state.paymentActive,
      active: state.verified && !state.paymentActive,
      action:
        state.verified && state.hrdActive && !state.paymentActive
          ? '<button class="btn" type="button" data-route="pricing"><i class="fa-solid fa-arrow-right" aria-hidden="true"></i> Pilih paket</button>'
          : "",
    },
  ];
  const waitingMessage = state.verification?.uploadPending
    ? "Dokumen belum tersinkron. Ajukan ulang dan unggah dokumen dari akun ini."
    : state.verification?.status === "pending"
      ? "Pengajuan sudah tercatat di dashboard admin. Tim JobHub akan meninjau dalam 1 hari kerja."
      : state.verified && !state.hrdActive
        ? "Verifikasi legal selesai. Paket tersedia setelah akses HRD perusahaan aktif."
        : state.verified && state.hrdActive && !state.paymentActive
          ? "Paket aktif diperlukan sebelum fitur rekrutmen dibuka."
          : "Selesaikan langkah berikut untuk membuka dashboard rekrutmen.";
  const completedSteps = steps.filter((step) => step.done).length;
  const currentStep =
    steps.find((step) => step.active) ||
    steps.find((step) => !step.done) ||
    steps[steps.length - 1];
  const currentStepNumber = steps.indexOf(currentStep) + 1;
  const progressPercent = Math.round((completedSteps / steps.length) * 100);
  const verificationNotice = companyVerificationNoticeMarkup(
    state.verified && state.verification?.status !== "verified"
      ? { ...state.verification, status: "verified" }
      : state.verification,
  );
  panel.innerHTML = `${verificationNotice}<header class="company-onboarding-heading"><span class="company-onboarding-heading-icon" aria-hidden="true"><i class="fa-solid fa-list-check"></i></span><div class="company-onboarding-heading-copy"><span class="eyebrow">PERSIAPAN AKUN PERUSAHAAN</span><h2>Siapkan ruang rekrutmen</h2><p>${escapeHtml(waitingMessage)}</p><div class="company-onboarding-progress"><span>${completedSteps} dari ${steps.length} tahap selesai</span><span class="company-onboarding-progress-track" aria-label="${progressPercent}% selesai"><span style="width:${progressPercent}%"></span></span></div></div></header><section class="company-onboarding-current"><span class="company-onboarding-current-icon" aria-hidden="true"><i class="fa-solid ${currentStep.icon}"></i></span><div class="company-onboarding-current-copy"><span class="company-onboarding-current-label">TAHAP ${currentStepNumber} DARI ${steps.length}</span><h3>${escapeHtml(currentStep.label)}</h3><p>${escapeHtml(currentStep.description)}</p></div>${currentStep.action ? `<div class="company-onboarding-current-action">${currentStep.action}</div>` : '<span class="company-onboarding-waiting"><i class="fa-solid fa-clock" aria-hidden="true"></i> Sedang diproses</span>'}</section><details class="company-onboarding-details"><summary><i class="fa-solid fa-list-ol" aria-hidden="true"></i> Lihat semua tahapan <i class="fa-solid fa-chevron-down" aria-hidden="true"></i></summary><ol class="company-onboarding-steps">${steps.map((step, index) => `<li class="${step.done ? "is-complete" : step.active ? "is-current" : ""}"><span class="company-onboarding-check" aria-hidden="true"><i class="fa-solid ${step.done ? "fa-check" : step.icon}"></i></span><span class="company-onboarding-step-copy"><strong>${escapeHtml(step.label)}</strong><small>${step.done ? "Selesai" : step.active ? "Sedang dikerjakan" : `Tahap ${index + 1}`}</small></span></li>`).join("")}</ol></details>`;
  return false;
}
function renderCompanyRecruitmentAnalytics() {
  const data = companyRecruitmentAnalytics;
  const chart = $("#companyRecruitmentChart");
  const format = (value) =>
    new Intl.NumberFormat("id-ID").format(Number(value) || 0);
  const totals = data?.totals;
  if (!data || !chart) {
    if (chart)
      chart.innerHTML =
        '<div class="empty-state"><strong>Statistik belum tersedia</strong>Hubungkan Supabase dan jalankan migrasi statistik rekrutmen.</div>';
    return;
  }
  $("#companyViewsTotal").textContent = format(totals.views);
  $("#companyApplicationsTotal").textContent = format(totals.applications);
  $("#companyInterviewsTotal").textContent = format(totals.interviews);
  $("#companyAcceptedTotal").textContent = format(totals.accepted);
  const conversionRate = Number(totals.views)
    ? (Number(totals.applications) / Number(totals.views)) * 100
    : 0;
  $("#companyApplicationRate").textContent =
    `${new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 }).format(conversionRate)}% konversi dari tayangan`;
  $("#companyAnalyticsCaption").textContent =
    `Performa lowongan dan lamaran selama ${companyRecruitmentDays} hari terakhir.`;
  const series = Array.isArray(data.series) ? data.series : [];
  const maxValue = Math.max(
    1,
    ...series.flatMap((item) => [
      Number(item.views) || 0,
      Number(item.applications) || 0,
    ]),
  );
  chart.innerHTML = series.length
    ? series
        .map(
          (item) =>
            `<div class="company-chart-column" title="${escapeHtml(item.label)} · ${format(item.views)} tayangan · ${format(item.applications)} lamaran"><div class="company-chart-bars"><span class="company-chart-views" style="height:${Math.max(Number(item.views) > 0 ? 3 : 0, ((Number(item.views) || 0) / maxValue) * 100)}%"></span><span class="company-chart-applications" style="height:${Math.max(Number(item.applications) > 0 ? 3 : 0, ((Number(item.applications) || 0) / maxValue) * 100)}%"></span></div><small>${escapeHtml(item.label)}</small></div>`,
        )
        .join("")
    : '<div class="empty-state"><strong>Belum ada aktivitas</strong>Tayangan dan lamaran akan terlihat setelah lowongan mendapat pengunjung.</div>';
  const table = $("#companyJobAnalytics");
  if (table)
    table.innerHTML = data.jobs?.length
      ? data.jobs
          .map(
            (job) =>
              `<tr><td><strong>${escapeHtml(job.title || "Lowongan")}</strong></td><td>${format(job.views)}</td><td>${format(job.applications)}</td></tr>`,
          )
          .join("")
      : '<tr><td colspan="3"><div class="empty-state"><strong>Belum ada lowongan aktif</strong>Lowongan aktif perusahaan akan muncul di sini.</div></td></tr>';
}
async function loadCompanyRecruitmentAnalytics(days = companyRecruitmentDays) {
  if (!supabaseClient || !isHrdSession()) return;
  const requestedDays = [30, 60, 90].includes(Number(days)) ? Number(days) : 30;
  const requestId = ++companyRecruitmentRequest;
  const { data, error } = await supabaseClient.rpc(
    "company_recruitment_dashboard",
    { p_days: requestedDays },
  );
  if (error) throw error;
  if (requestId !== companyRecruitmentRequest) return;
  companyRecruitmentDays = requestedDays;
  companyRecruitmentAnalytics = data;
  renderCompanyRecruitmentAnalytics();
}
async function recordJobView(jobId) {
  if (!supabaseClient || !jobId) return;
  let viewerKey = "";
  try {
    viewerKey = sessionStorage.getItem("jobhub-job-viewer-key") || "";
    if (!viewerKey) {
      viewerKey = crypto.randomUUID();
      sessionStorage.setItem("jobhub-job-viewer-key", viewerKey);
    }
  } catch {
    return;
  }
  const { error } = await supabaseClient.rpc("record_job_view", {
    p_job_id: String(jobId),
    p_viewer_key: viewerKey,
  });
  if (error) console.warn("Job view was not recorded:", error.message);
}
function renderRecentApplicants() {
  const container = $("#recentApplicantsGrid");
  if (!container) return;
  const applications = getApplications()
    .slice()
    .sort(
      (left, right) =>
        (Date.parse(right.createdAt) || 0) - (Date.parse(left.createdAt) || 0),
    )
    .slice(0, 8);
  if (!applications.length) {
    container.innerHTML =
      '<div class="empty-state"><strong>Belum ada pelamar</strong>Pelamar terbaru akan muncul di sini setelah lowongan menerima lamaran.</div>';
    return;
  }
  container.innerHTML = applications
    .map((application) => {
      const profile = recentApplicantProfiles.get(application.candidateId);
      const job = jobs.find((item) => item.id === application.jobId);
      const match = job
        ? calculateCandidateMatch(job, application).matchPercentage
        : null;
      const strength = profile
        ? getCandidateProfileStrengthState(profile)
        : null;
      const image = accountSafePhoto(profile?.profile_image_url || "");
      const date = application.createdAt
        ? new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
          }).format(new Date(application.createdAt))
        : "Baru";
      return `<article class="recent-applicant-card"><div class="recent-applicant-identity">${image ? `<img src="${escapeHtml(image)}" alt="Foto ${escapeHtml(profile?.full_name || application.candidateName)}" loading="lazy">` : '<span class="recent-applicant-avatar" aria-hidden="true"><i class="fa-solid fa-user"></i></span>'}<div><strong>${escapeHtml(profile?.full_name || application.candidateName || "Kandidat")}</strong><span>${escapeHtml(profile?.main_position || application.jobTitle || "Posisi belum dicantumkan")}</span><small>${escapeHtml(job?.title || application.jobTitle || "Lowongan")} · ${escapeHtml(date)}</small></div></div><div class="recent-applicant-metrics"><span class="candidate-status-badge">${escapeHtml(normalizeApplicationStatus(application.status))}</span>${match !== null ? `<span class="recent-applicant-match">${match}% cocok</span>` : ""}${strength ? `<span class="candidate-strength-badge ${strength.complete ? "is-complete" : "is-incomplete"}">Profil ${strength.percent}%</span>` : '<span class="candidate-strength-badge is-incomplete">Profil belum dipublikasikan</span>'}</div>${profile?.username ? `<button class="btn btn-outline btn-small" type="button" data-candidate-profile="${escapeHtml(profile.username)}"><i class="fa-regular fa-id-card" aria-hidden="true"></i> Lihat profil</button>` : '<span class="form-note">Profil publik belum tersedia</span>'}</article>`;
    })
    .join("");
}
async function loadRecentApplicantProfiles() {
  if (!supabaseClient || !isHrdSession()) return;
  const requestId = ++recentApplicantProfilesRequest;
  const ids = [
    ...new Set(
      getApplications()
        .slice()
        .sort(
          (left, right) =>
            (Date.parse(right.createdAt) || 0) -
            (Date.parse(left.createdAt) || 0),
        )
        .slice(0, 8)
        .map((item) => item.candidateId)
        .filter(Boolean),
    ),
  ];
  if (!ids.length) {
    recentApplicantProfiles = new Map();
    renderRecentApplicants();
    return;
  }
  const { data, error } = await supabaseClient
    .from("candidate_posts")
    .select(
      "user_id,username,full_name,main_position,location,education_level,skills,about,experience_years,profile_image_url,work_status,job_types,public_data,is_published",
    )
    .in("user_id", ids)
    .eq("is_published", true);
  if (error) throw error;
  if (requestId !== recentApplicantProfilesRequest) return;
  recentApplicantProfiles = new Map(
    (data || []).map((profile) => [
      profile.user_id,
      { ...profile, publicData: profile.public_data || {} },
    ]),
  );
  renderRecentApplicants();
}
function renderDashboard() {
  const ownedJobs = companyJobs();
  const tableJobs = ownedJobs;
  const applications =
    supabaseClient && !isHrdSession() ? [] : getApplications();
  $("#companyDashboardGreeting").textContent = companyTimeGreeting();
  renderCompanyDashboardBrand();
  $("#activeJobCount").textContent = ownedJobs.filter(
    (job) => job.status !== "closed" && job.status !== "draft",
  ).length;
  $("#dashboardMessageCount").textContent = String(dashboardMessageCountCache);
  $("#dashboardApplications").textContent = applications.length;
  $("#dashboardAccepted").textContent = applications.filter(
    (application) =>
      normalizeApplicationStatus(application.status) === "Accepted",
  ).length;
  $("#dashboardInterviewCount").textContent = applications.filter(
    (application) =>
      ["Interview", "Technical Test", "Final Interview"].includes(
        normalizeApplicationStatus(application.status),
      ),
  ).length;
  renderCompanyRecruitmentAnalytics();
  renderRecentApplicants();
  const companyReady = renderCompanyDashboardOnboarding();
  renderSubscriptionStatus();
  renderCompanyTeam();
  const canManageJobs = canManageCandidates();
  const candidateAccount =
    isCandidateSession() ||
    (!supabaseClient &&
      localStorage.getItem("jobhub-account-intent") === "candidate");
  $$("[data-dashboard-entry]").forEach((button) => {
    button.textContent = candidateAccount
      ? "Posting profil untuk cari loker"
      : "Mulai rekrutmen";
    button.dataset.route = candidateAccount
      ? "candidate-create-profile"
      : "dashboard";
  });
  $$('#dashboardView .company-dashboard-welcome [data-modal="newJob"]').forEach(
    (button) =>
      (button.hidden =
        !canManageJobs ||
        (supabaseClient && isCompanyAccount() && !companyReady)),
  );
  renderATSBoard(applications);
  renderTalentPool();
  renderCandidateNotifications();
  $("#dashboardJobs").innerHTML = tableJobs.length
    ? tableJobs
        .map(
          (job) =>
            `<tr><td><strong>${escapeHtml(job.title)}</strong><br><span style="color:var(--muted);font-size:10px">${escapeHtml(job.loc)}</span></td><td>${applications.filter((application) => application.jobId === job.id).length} kandidat</td><td><span class="status">${job.status === "draft" ? "Draft" : job.urgent ? "Butuh segera" : "Aktif"}</span></td><td>${escapeHtml(job.posted)}</td><td>${canManageCandidates() ? `<button class="btn btn-outline btn-small" type="button" data-edit-job="${escapeHtml(job.id)}" aria-label="Edit lowongan ${escapeHtml(job.title)}">Edit</button> <button class="text-link" type="button" data-job-messages="${escapeHtml(job.id)}" aria-label="Pesan kandidat untuk ${escapeHtml(job.title)}">Pesan kandidat</button> ` : ""}${canDeleteCompanyJobs() ? `<button class="btn btn-outline btn-small" type="button" data-delete-job="${escapeHtml(job.id)}" aria-label="Hapus lowongan ${escapeHtml(job.title)}">Hapus</button>` : "—"}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5"><div class="empty-state"><strong>Belum ada lowongan perusahaan</strong>Lowongan yang diposting perusahaan akan tampil di sini.</div></td></tr>';
  const ranked = applications
    .map((application) => {
      const job = jobs.find((item) => item.id === application.jobId);
      return job
        ? { application, job, score: calculateCandidateMatch(job, application) }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.score.matchPercentage - a.score.matchPercentage);
  $("#candidateRanking").innerHTML = ranked.length
    ? ranked
        .map(
          ({ application, job, score }, index) =>
            `<tr><td>#${index + 1}</td><td><strong>${escapeHtml(application.candidateName)}</strong><br><span style="color:var(--muted)">${escapeHtml(application.education || "")}</span></td><td>${escapeHtml(job.title)}</td><td><span class="match-score">${score.matchPercentage}% Match</span></td><td>${score.pointsEarned}/${score.pointsAvailable} poin (${score.screeningScore}%)</td><td>${isHrdSession() ? `<button class="text-link" type="button" data-message-application="${escapeHtml(application.id)}">Pesan</button>` : "—"}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="6"><div class="empty-state"><strong>Belum ada kandidat</strong>Pelamar akan muncul dan diurutkan setelah mengirim lamaran.</div></td></tr>';
  renderAdminCompanies();
  renderCompanyVerificationState();
}
async function connectATSRealtime(session) {
  if (!isHrdSession(session)) {
    setAtsSyncStatus("offline", "Masuk sebagai HRD untuk sinkronisasi");
    return;
  }
  setAtsSyncStatus("pending", "Menghubungkan ke Supabase...");
  const companyId = billingCompanyId();
  companyRecruitmentAnalytics = null;
  companyRecruitmentRequest++;
  recentApplicantProfiles = new Map();
  recentApplicantProfilesRequest++;
  saveApplications([]);
  renderDashboard();
  const [applicationsResult, interviewsResult] = await Promise.all([
    supabaseClient
      .from("jobhub_applications")
      .select("*")
      .eq("company_id", companyId),
    supabaseClient
      .from("jobhub_interviews")
      .select("*")
      .eq("company_id", companyId)
      .order("starts_at", { ascending: true }),
    loadCompanySubscription(),
    loadCompanyTeam(),
    loadCompanyJobs(),
    loadTalentPoolFromSupabase(),
  ]);
  if (applicationsResult.error) throw applicationsResult.error;
  if (interviewsResult.error) throw interviewsResult.error;
  const remoteApplications = applicationsResult.data.map(
    fromSupabaseApplication,
  );
  saveApplications(remoteApplications);
  loadRecentApplicantProfiles().catch((error) =>
    console.warn("Recent applicant profiles unavailable:", error.message),
  );
  loadCompanyRecruitmentAnalytics().catch((error) =>
    console.warn("Company recruitment analytics unavailable:", error.message),
  );
  saveInterviews(interviewsResult.data.map(fromSupabaseInterview));
  renderDashboard();
  if (atsChannel) await supabaseClient.removeChannel(atsChannel);
  if (interviewChannel) await supabaseClient.removeChannel(interviewChannel);
  interviewChannel = supabaseClient
    .channel(`hrd-interviews-${companyId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_interviews",
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        const interviews = getInterviews();
        const changed =
          payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.id) return;
        const index = interviews.findIndex(
          (interview) => interview.id === changed.id,
        );
        if (payload.eventType === "DELETE") {
          if (index >= 0) interviews.splice(index, 1);
        } else {
          const updated = fromSupabaseInterview(changed);
          if (index >= 0) interviews[index] = updated;
          else interviews.push(updated);
        }
        saveInterviews(interviews);
        renderDashboard();
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        toast(
          `Jadwal interview tidak dapat diperbarui realtime: ${error?.message || status}`,
        );
    });
  atsChannel = supabaseClient
    .channel(`ats-${companyId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_applications",
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        const applications = getApplications();
        const changed =
          payload.eventType === "DELETE" ? payload.old : payload.new;
        if (!changed?.id) return;
        const index = applications.findIndex(
          (application) => application.id === changed.id,
        );
        if (payload.eventType === "DELETE") {
          if (index >= 0) applications.splice(index, 1);
          saveCvAttachment(changed.id, "");
        } else {
          const updated = fromSupabaseApplication(changed);
          if (index >= 0) applications[index] = updated;
          else applications.push(updated);
        }
        saveApplications(applications);
        renderDashboard();
        loadRecentApplicantProfiles().catch((error) =>
          console.warn(
            "Recent applicant profiles could not refresh:",
            error.message,
          ),
        );
        loadCompanyRecruitmentAnalytics().catch((error) =>
          console.warn(
            "Company recruitment analytics could not refresh:",
            error.message,
          ),
        );
        if (activeRoute === "dashboard")
          markApplicationsViewedByHrd().catch((error) =>
            toast(
              `Status dilihat HRD gagal disimpan: ${error.message || "periksa kolom viewed_at."}`,
            ),
          );
      },
    )
    .subscribe((status, subscriptionError) => {
      if (status === "SUBSCRIBED")
        setAtsSyncStatus("connected", "Realtime aktif");
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setAtsSyncStatus("error", "Realtime terputus");
        toast(
          `Koneksi realtime gagal: ${subscriptionError?.message || status}`,
        );
      }
    });
  if (jobsChannel) await supabaseClient.removeChannel(jobsChannel);
  jobsChannel = supabaseClient
    .channel(`company-jobs-${companyId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "jobhub_jobs",
        filter: `company_id=eq.${companyId}`,
      },
      (payload) => {
        applyPublishedJobChange(payload, true);
        renderDashboard();
        loadCompanyRecruitmentAnalytics().catch((error) =>
          console.warn(
            "Company recruitment analytics could not refresh:",
            error.message,
          ),
        );
      },
    )
    .subscribe((status, error) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT")
        toast(
          `Lowongan tidak dapat diperbarui realtime: ${error?.message || status}`,
        );
    });
}
function promptCompanyInvitePassword() {
  const user = supabaseSession?.user;
  if (
    !user?.user_metadata?.company_invite_pending ||
    invitePasswordPromptedFor === user.id
  )
    return;
  invitePasswordPromptedFor = user.id;
  openModal(
    "Aktifkan akun perusahaan",
    `<form class="company-invite-password-form"><p class="form-note">Buat kata sandi untuk menyelesaikan aktivasi akun ${escapeHtml(roleLabel())} Anda.</p><div class="form-row"><label for="invitePassword">Kata sandi baru</label><input id="invitePassword" name="password" type="password" minlength="8" autocomplete="new-password" required></div><div class="form-row"><label for="confirmInvitePassword">Ulangi kata sandi</label><input id="confirmInvitePassword" name="confirmPassword" type="password" minlength="8" autocomplete="new-password" required></div><button class="btn" type="submit">Aktifkan akun</button></form>`,
    async (data) => {
      const password = String(data.get("password") || "");
      if (password !== String(data.get("confirmPassword") || "")) {
        toast("Konfirmasi kata sandi tidak sama.");
        return;
      }
      const { data: updated, error } = await supabaseClient.auth.updateUser({
        password,
        data: { company_invite_pending: false },
      });
      if (error) {
        toast(`Kata sandi akun belum dapat disimpan: ${error.message}`);
        return;
      }
      supabaseSession = { ...supabaseSession, user: updated.user };
      closeModal();
      toast("Akun perusahaan berhasil diaktifkan.");
    },
  );
}
window.addEventListener("jobhub-address-change", (event) => {
  if (
    event.detail?.rootId !== "jobAddressForm" ||
    !$("#jobAddressForm")?.isConnected
  )
    return;
  const address = event.detail || {};
  const locationInput = $('#modalBody [name="location"]');
  if (locationInput)
    locationInput.value = [address.regencyName, address.provinceName]
      .filter(Boolean)
      .join(", ");
});
const pendingSignupConfirmationKey = "jobhub-pending-signup-confirmation";
const authEmailResendCooldownSeconds = Math.max(
  30,
  Number(
    window.JOBHUB_SUPABASE_CONFIG?.companyEmailVerification?.resendSeconds,
  ) || 60,
);
const authEmailResendLimit = 5;
const authEmailResendWindowMs = 24 * 60 * 60 * 1000;
let authEmailResendTimer = 0;
function authEmailResendKey(email) {
  return `jobhub-auth-email-resend:${String(email || "")
    .trim()
    .toLowerCase()}`;
}
function getAuthEmailResendState(email) {
  const key = authEmailResendKey(email);
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(key) || "{}");
  } catch (error) {
    state = {};
  }
  if (typeof state === "number" && Number.isFinite(state)) {
    const lastAttemptAt = Math.max(
      0,
      state - authEmailResendCooldownSeconds * 1000,
    );
    state = {
      count:
        lastAttemptAt && Date.now() - lastAttemptAt < authEmailResendWindowMs
          ? 1
          : 0,
      windowStartedAt: lastAttemptAt,
      lastAttemptAt,
    };
    localStorage.setItem(key, JSON.stringify(state));
  }
  if (
    !state ||
    typeof state !== "object" ||
    !Number.isFinite(Number(state.windowStartedAt)) ||
    Date.now() - Number(state.windowStartedAt) >= authEmailResendWindowMs
  ) {
    state = { count: 0, windowStartedAt: 0, lastAttemptAt: 0 };
    localStorage.removeItem(key);
  }
  return {
    count: Number(state.count) || 0,
    windowStartedAt: Number(state.windowStartedAt) || 0,
    lastAttemptAt: Number(state.lastAttemptAt) || 0,
  };
}
function authEmailResendFreezeText(remainingMs) {
  const totalMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `Batas 5 email per 24 jam tercapai. Pengiriman dibekukan${hours ? ` selama ${hours} jam` : ""}${minutes ? ` ${minutes} menit` : ""}.`;
}
function updateAuthResendCountdown(button, email, status, originalLabel) {
  if (authEmailResendTimer) window.clearInterval(authEmailResendTimer);
  const update = () => {
    if (!button.isConnected) {
      window.clearInterval(authEmailResendTimer);
      authEmailResendTimer = 0;
      return;
    }
    const state = getAuthEmailResendState(email);
    const freezeRemaining =
      state.count >= authEmailResendLimit
        ? state.windowStartedAt + authEmailResendWindowMs - Date.now()
        : 0;
    if (freezeRemaining > 0) {
      button.disabled = true;
      button.textContent = "Batas 5 email tercapai";
      if (status)
        status.textContent = authEmailResendFreezeText(freezeRemaining);
      return;
    }
    const cooldownRemaining = Math.ceil(
      (state.lastAttemptAt +
        authEmailResendCooldownSeconds * 1000 -
        Date.now()) /
        1000,
    );
    if (cooldownRemaining <= 0) {
      window.clearInterval(authEmailResendTimer);
      authEmailResendTimer = 0;
      button.disabled = false;
      button.textContent = originalLabel;
      return;
    }
    button.disabled = true;
    button.textContent = `Kirim ulang (${cooldownRemaining} dtk)`;
    if (status)
      status.textContent = `Jeda ${cooldownRemaining} detik sebelum permintaan berikutnya.`;
  };
  update();
  if (button.disabled) {
    const interval =
      getAuthEmailResendState(email).count >= authEmailResendLimit
        ? 60_000
        : 1000;
    authEmailResendTimer = window.setInterval(update, interval);
  }
}
async function requestAuthEmailResend(email, button, status) {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  const originalLabel =
    button.dataset.originalLabel ||
    button.textContent.trim() ||
    "Kirim ulang email";
  button.dataset.originalLabel = originalLabel;
  const state = getAuthEmailResendState(normalizedEmail);
  if (state.count >= authEmailResendLimit) {
    const freezeRemaining =
      state.windowStartedAt + authEmailResendWindowMs - Date.now();
    if (status) status.textContent = authEmailResendFreezeText(freezeRemaining);
    else toast(authEmailResendFreezeText(freezeRemaining));
    updateAuthResendCountdown(button, normalizedEmail, status, originalLabel);
    return;
  }
  const cooldownRemaining = Math.ceil(
    (state.lastAttemptAt + authEmailResendCooldownSeconds * 1000 - Date.now()) /
      1000,
  );
  if (cooldownRemaining > 0) {
    if (status)
      status.textContent = `Tunggu ${cooldownRemaining} detik sebelum meminta email verifikasi lagi.`;
    updateAuthResendCountdown(button, normalizedEmail, status, originalLabel);
    return;
  }
  const nextState = {
    count: state.count + 1,
    windowStartedAt: state.windowStartedAt || Date.now(),
    lastAttemptAt: Date.now(),
  };
  localStorage.setItem(
    authEmailResendKey(normalizedEmail),
    JSON.stringify(nextState),
  );
  button.disabled = true;
  button.textContent = "Meminta email...";
  if (status)
    status.textContent = `Menghubungi layanan email JobHub (${nextState.count}/${authEmailResendLimit})...`;
  try {
    if (!ensureSupabaseClient()) throw new Error(supabaseUnavailableMessage());
    const redirectUrl = new URL(window.location.href);
    redirectUrl.search = "";
    redirectUrl.hash = "";
    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email: normalizedEmail,
      options: { emailRedirectTo: redirectUrl.toString() },
    });
    if (error) throw error;
    const successMessage =
      "Permintaan email verifikasi diterima. Email mungkin tertunda; periksa Spam, Promosi, dan alamat email Anda.";
    if (status) status.textContent = successMessage;
    else toast(successMessage);
    updateAuthResendCountdown(button, normalizedEmail, status, originalLabel);
  } catch (error) {
    const message = String(error?.message || "Coba lagi beberapa saat.");
    const failureMessage = /rate limit|too many|429/i.test(message)
      ? "Supabase membatasi pengiriman sementara. Tunggu sekitar satu menit, lalu coba lagi."
      : `Permintaan gagal: ${message}`;
    const failedState = getAuthEmailResendState(normalizedEmail);
    if (status)
      status.textContent =
        failedState.count >= authEmailResendLimit
          ? `${failureMessage} ${authEmailResendFreezeText(failedState.windowStartedAt + authEmailResendWindowMs - Date.now())}`
          : `${failureMessage} Percobaan tetap dihitung dalam batas harian.`;
    else toast(`Permintaan email verifikasi gagal: ${message}`);
    updateAuthResendCountdown(button, normalizedEmail, null, originalLabel);
  }
}
function notifyConfirmedSignup(session) {
  if (!session?.user?.email_confirmed_at) return;
  let pending;
  try {
    pending = JSON.parse(
      localStorage.getItem(pendingSignupConfirmationKey) || "null",
    );
  } catch {
    localStorage.removeItem(pendingSignupConfirmationKey);
    return;
  }
  if (pending?.userId !== session.user.id) return;
  localStorage.removeItem(pendingSignupConfirmationKey);
  toast(
    pending.accountType === "company"
      ? "Email perusahaan terverifikasi. Dashboard perusahaan dibuka."
      : "Email berhasil dikonfirmasi. Akun Anda siap digunakan.",
  );
}
function openEmailVerificationModal(email, accountType) {
  const safeEmail = escapeHtml(email);
  const accountLabels = {
    company: "perusahaan",
    candidate: "pencari kerja",
    marketplace: "JobHub Rantau",
  };
  const accountLabel = accountLabels[accountType] || "JobHub";
  const nextStep =
    accountType === "company"
      ? "Setelah berhasil, Anda dapat melanjutkan ke dashboard perusahaan."
      : accountType === "marketplace"
        ? "Setelah berhasil, Anda dapat mengelola profil dan hunian di dashboard JobHub Rantau."
        : accountType === "candidate"
          ? "Setelah berhasil, Anda dapat melanjutkan ke profil pencari kerja."
          : "Setelah berhasil, akun JobHub Anda siap digunakan.";
  openModal(
    "Verifikasi email",
    `<section class="email-verification-notice">
    <span class="email-verification-icon" aria-hidden="true"><i class="fa-regular fa-envelope"></i></span>
    <h2>Periksa email Anda</h2>
    <p>Kami mengirim tautan verifikasi akun ${accountLabel} ke <strong>${safeEmail}</strong>.</p>
    <p>Klik tombol verifikasi pada email tersebut. ${nextStep} Jika belum terlihat, periksa folder Spam atau Promosi.</p>
    <button class="btn btn-outline" id="resendVerificationEmail" type="button"><i class="fa-solid fa-rotate" aria-hidden="true"></i> Kirim ulang email</button>
    <p class="auth-email-resend-status" id="verificationResendStatus" role="status" aria-live="polite"></p>
  </section>`,
  );
  const resendButton = $("#resendVerificationEmail");
  if (resendButton) {
    const resendStatus = $("#verificationResendStatus");
    const originalLabel = resendButton.textContent.trim();
    resendButton.dataset.originalLabel = originalLabel;
    updateAuthResendCountdown(resendButton, email, resendStatus, originalLabel);
    resendButton.addEventListener("click", () =>
      requestAuthEmailResend(email, resendButton, resendStatus),
    );
  }
}
function addPasswordVisibilityControls(form) {
  form.querySelectorAll('input[type="password"]').forEach((input) => {
    const wrapper = document.createElement("div");
    wrapper.className = "auth-password-input";
    input.before(wrapper);
    wrapper.append(input);
    const toggle = document.createElement("button");
    toggle.className = "auth-password-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Tampilkan kata sandi");
    toggle.title = "Tampilkan kata sandi";
    toggle.innerHTML = '<i class="fa-regular fa-eye" aria-hidden="true"></i>';
    toggle.addEventListener("click", () => {
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      toggle.setAttribute(
        "aria-label",
        show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi",
      );
      toggle.title = show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi";
      toggle.innerHTML = `<i class="fa-regular ${show ? "fa-eye-slash" : "fa-eye"}" aria-hidden="true"></i>`;
    });
    wrapper.append(toggle);
  });
}
function ensureSupabaseClient() {
  if (supabaseClient) return true;
  const config = window.JOBHUB_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey || !window.supabase?.createClient)
    return false;
  supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  return true;
}
function resumePendingAuthRoute() {
  if (!supabaseSessionReady || !pendingAuthRoute) return;
  if (supabaseSession) {
    const route = pendingAuthRoute;
    pendingAuthRoute = "";
    go(route);
  } else openAuthModal(false);
}
function supabaseUnavailableMessage() {
  const config = window.JOBHUB_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey)
    return "Konfigurasi URL atau publishable/anon key Supabase belum tersedia.";
  if (!window.supabase?.createClient)
    return "Supabase SDK belum termuat. Periksa koneksi internet lalu muat ulang halaman.";
  return "Supabase belum dapat diinisialisasi. Muat ulang halaman lalu coba lagi.";
}
async function initSupabaseATS() {
  const config = window.JOBHUB_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey) {
    supabaseSessionReady = true;
    resumePendingAuthRoute();
    setAtsSyncStatus("offline", "Mode lokal · Supabase belum dikonfigurasi");
    return;
  }
  if (!window.supabase?.createClient) {
    supabaseSessionReady = true;
    resumePendingAuthRoute();
    setAtsSyncStatus("error", "Supabase SDK gagal dimuat");
    return;
  }
  try {
    ensureSupabaseClient();
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    supabaseSession = data.session;
    await completeGoogleOAuth(supabaseSession);
    const { data: currentSession, error: currentSessionError } =
      await supabaseClient.auth.getSession();
    if (currentSessionError) throw currentSessionError;
    supabaseSession = currentSession.session;
    supabaseSessionReady = true;
    resumePendingAuthRoute();
    renderAccountMenu();
    promptCompanyInvitePassword();
    // Keep existing sessions on the public beranda. Explicit dashboard links
    // still navigate through the role-aware account menu.
    await Promise.all([
      loadWebsiteBranding(),
      typeof loadCompanyPackageCatalog === "function"
        ? loadCompanyPackageCatalog()
        : Promise.resolve(),
      isCompanyAccount(supabaseSession)
        ? loadCurrentCompanyProfile(supabaseSession)
        : Promise.resolve(),
    ]);
    if (isCompanyAccount(supabaseSession)) {
      try {
        await connectCompanyOnboardingRealtime(supabaseSession);
      } catch (error) {
        notifyCompanyProfileLoadError(error);
      }
    }
    await Promise.all([
      loadPublishedCompanyJobs(),
      loadPublishedCandidateProfiles(),
      connectPublishedJobsRealtime(),
      loadVerifiedCompanyProfiles(),
    ]);
    if (activeRoute === "candidate-feed") renderCandidateFeed();
    if (isHrdSession()) {
      await connectATSRealtime(supabaseSession);
    } else {
      clearTalentPoolForNonHrd();
      if (isCandidateSession()) await loadCandidateInterviews(supabaseSession);
      else setAtsSyncStatus("offline", "Masuk sebagai HRD untuk sinkronisasi");
    }
    if (isAdminSession()) await loadCompanyVerifications();
    if (supabaseSession) {
      await Promise.all([
        syncPendingCompanyVerifications(supabaseSession),
        loadCompanyVerificationForUser(supabaseSession),
      ]);
    }
    if (activeRoute === "messages") await renderJobMessages();
  } catch (error) {
    supabaseSessionReady = true;
    setAtsSyncStatus("error", "Gagal menghubungkan Supabase");
    toast(
      `Supabase tidak dapat dihubungkan: ${error.message || "periksa konfigurasi."}`,
    );
  }
  supabaseClient.auth.onAuthStateChange((event, session) => {
    supabaseSession = session;
    supabaseSessionReady = true;
    if (
      !session ||
      (jobMessageChannelKey &&
        !jobMessageChannelKey.startsWith(`${session.user.id}:`))
    ) {
      removeRealtimeChannelSafely(jobMessageChannel);
      jobMessageChannel = null;
      jobMessageChannelKey = "";
      jobMessageApplications = [];
      jobMessages = [];
      activeMessageApplicationId = "";
    }
    notifyConfirmedSignup(session);
    if (companyProfileId(session) !== companyProfileOwnerId) {
      companyProfileCache = null;
      companyProfileOwnerId = "";
      companyProfileLoadPromise = null;
      companyProfileLoadCompanyId = "";
      currentCompanyVerification = null;
      companyVerificationOwnerId = "";
      currentSubscriptionCache = null;
      subscriptionOwnerId = "";
    }
    renderAccountMenu();
    if (session?.user?.app_metadata?.provider === "google") {
      window.setTimeout(() => completeGoogleOAuth(session), 0);
    }
    window.setTimeout(() => {
      promptCompanyInvitePassword();
      removeRealtimeChannelSafely(atsChannel);
      removeRealtimeChannelSafely(interviewChannel);
      removeRealtimeChannelSafely(talentChannel);
      removeRealtimeChannelSafely(jobsChannel);
      removeRealtimeChannelSafely(publicJobsChannel);
      atsChannel = null;
      interviewChannel = null;
      talentChannel = null;
      jobsChannel = null;
      publicJobsChannel = null;
      connectPublishedJobsRealtime().catch((error) => {
        setAtsSyncStatus("error", "Realtime lowongan terputus");
        toast(
          `Koneksi realtime lowongan gagal: ${error.message || "periksa konfigurasi publikasi Supabase."}`,
        );
      });
      if (!session) {
        if (event === "SIGNED_OUT") go("home");
        saveApplications([]);
        clearTalentPoolForNonHrd();
        candidateInterviewCache = null;
        saveInterviews([]);
        renderDashboard();
        saveSubscriptions([]);
        currentSubscriptionCache = null;
        removeRealtimeChannelSafely(subscriptionChannel);
        subscriptionChannel = null;
        removeRealtimeChannelSafely(companyOnboardingChannel);
        companyOnboardingChannel = null;
        companyOnboardingChannelKey = "";
        renderCompanyVerificationState();
        setAtsSyncStatus("offline", "Masuk sebagai HRD untuk sinkronisasi");
        return;
      }
      if (activeRoute === "candidate-search") renderCandidateSearch();
      if (isCompanyAccount(session))
        loadCurrentCompanyProfile(session)
          .then(() => connectCompanyOnboardingRealtime(session))
          .then(() => renderCompanyCompletionPanel())
          .catch(notifyCompanyProfileLoadError);
      const task = isHrdSession(session)
        ? connectATSRealtime(session)
        : isCandidateSession(session)
          ? loadCandidateInterviews(session)
          : Promise.resolve();
      if (pendingAuthRoute)
        window.setTimeout(() => redirectAuthenticatedUser(session), 0);
      else if (event === "SIGNED_IN" && activeRoute === "home")
        window.setTimeout(() => go("home"), 0);
      syncPendingCompanyVerifications(session).catch((error) =>
        toast(
          `Dokumen verifikasi belum tersinkron: ${error.message || "masuk kembali setelah jaringan tersedia."}`,
        ),
      );
      if (isAdminSession(session))
        loadCompanyVerifications().catch((error) =>
          toast(
            `Pengajuan verifikasi tidak dapat dimuat: ${error.message || "periksa kebijakan admin."}`,
          ),
        );
      loadVerifiedCompanyProfiles().catch((error) =>
        toast(
          `Badge perusahaan tidak dapat dimuat: ${error.message || "periksa koneksi."}`,
        ),
      );
      if (!isHrdSession(session)) {
        saveApplications([]);
        saveSubscriptions([]);
        currentSubscriptionCache = null;
        renderSubscriptionStatus();
        clearTalentPoolForNonHrd();
        candidateInterviewCache = isCandidateSession(session)
          ? candidateInterviewCache
          : null;
        saveInterviews([]);
        renderDashboard();
      }
      task.catch((error) => {
        setAtsSyncStatus("error", "Gagal memuat jadwal");
        toast(
          `Sinkronisasi jadwal interview gagal: ${error.message || "periksa tabel dan kebijakan RLS."}`,
        );
      });
    }, 0);
  });
  notifyConfirmedSignup(supabaseSession);
}
const routes = {
  home: "homeView",
  jobs: "jobsView",
  detail: "detailView",
  "candidate-feed": "candidateFeedView",
  rantau: "rantauMarketplaceView",
  "rantau-dashboard": "rantauDashboardView",
  "rantau-detail": "rantauDetailView",
  "rantau-inbox": "rantauInboxView",
  favorites: "favoritesView",
  "candidate-applications": "candidateApplicationsView",
  candidate: "candidateView",
  company: "companyView",
  "company-complete": "companyCompletionView",
  companies: "companiesView",
  dashboard: "dashboardView",
  pricing: "pricingView",
  messages: "messagesView",
  admin: "adminView",
  "candidate-create-profile": "candidateWizardView",
  "candidate-public": "candidatePublicView",
  "candidate-resume-studio": "candidateResumeStudioView",
  "candidate-search": "candidateSearchView",
  "talent-spotlight": "talentSpotlightView",
  "candidate-talent-post": "candidateTalentPostView",
  news: "newsView",
};
let companyDirectoryCache = [],
  companyDirectoryFeaturedCache = [],
  companyDirectorySearchRequest = 0,
  companyDirectorySearchTimer = 0;
let activeNewsFilter = "all";
let newsSearchTimer = 0,
  newsRequestId = 0;
const newsCacheKey = "jobhub-news-cache";
const newsCacheTtl = 15 * 60 * 1000;
const newsCacheMaxAge = 24 * 60 * 60 * 1000;
let spotlightProfiles = [];
const spotlightSkills = [
  "Leadership",
  "Communication",
  "React",
  "Next.js",
  "Marketing",
  "Accounting",
  "UI/UX",
  "Public Speaking",
];
function spotlightBadges(profile, featured) {
  const badges = [];
  if (featured?.status === "featured")
    badges.push(
      '<span class="spotlight-badge"><i class="fa-solid fa-star" aria-hidden="true"></i> Featured Candidate</span>',
    );
  if (featured?.verified_talent)
    badges.push(
      '<span class="spotlight-badge verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Verified Talent</span>',
    );
  if (Number(featured?.endorsement_count) >= 5)
    badges.push(
      '<span class="spotlight-badge top"><i class="fa-solid fa-award" aria-hidden="true"></i> Top Performer</span>',
    );
  if (featured?.certified_professional)
    badges.push(
      '<span class="spotlight-badge verified">Certified Professional</span>',
    );
  const data = profile.public_data || {};
  if (data.spotlight?.openToWork || profile.work_status === "Open To Work")
    badges.push('<span class="spotlight-badge">Open To Work</span>');
  return badges.join("");
}
async function loadTalentSpotlight() {
  const feed = $("#spotlightFeed");
  if (!feed) return;
  feed.innerHTML = '<p class="form-note">Memuat kandidat unggulan...</p>';
  try {
    if (supabaseClient) {
      await supabaseClient.rpc("expire_featured_candidates");
      const { data: featured, error: featuredError } = await supabaseClient
        .from("featured_candidates")
        .select("*")
        .eq("status", "featured")
        .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
        .order("started_at", { ascending: false })
        .limit(200);
      if (featuredError) throw featuredError;
      if (!featured?.length) spotlightProfiles = [];
      else {
        const { data: posts, error: postsError } = await supabaseClient
          .from("candidate_posts")
          .select(
            "id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,is_published,verified_candidate,created_at,updated_at",
          )
          .in(
            "id",
            featured.map((item) => item.candidate_post_id),
          )
          .eq("is_published", true);
        if (postsError) throw postsError;
        const { data: endorsements, error: endorsementError } =
          await supabaseClient
            .from("candidate_endorsements")
            .select("candidate_post_id,skill");
        if (endorsementError) throw endorsementError;
        spotlightProfiles = (posts || []).map((profile) => ({
          ...profile,
          spotlight:
            featured.find((item) => item.candidate_post_id === profile.id) ||
            {},
          endorsements: (endorsements || []).filter(
            (item) => item.candidate_post_id === profile.id,
          ),
        }));
      }
    } else {
      spotlightProfiles = getLocalCandidateProfiles()
        .filter(
          (item) =>
            item.featuredUntil && new Date(item.featuredUntil) > new Date(),
        )
        .map((item) => ({
          ...item,
          spotlight: item.spotlight || { status: "featured" },
        }));
    }
    if (!candidateProfilesLoaded) await loadPublishedCandidateProfiles();
    renderTalentSpotlight();
    renderSpotlightAdmin();
  } catch (error) {
    feed.innerHTML = `<div class="empty-state"><strong>Spotlight belum dapat dimuat</strong>${escapeHtml(error.message || "Periksa koneksi Supabase dan terapkan skema terbaru.")}</div>`;
  }
}
function renderTalentSpotlight() {
  const feed = $("#spotlightFeed");
  if (!feed) return;
  const keyword = String($("#spotlightSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  let entries = spotlightProfiles.filter((profile) =>
    `${profile.full_name} ${profile.main_position} ${(profile.skills || []).join(" ")} ${profile.location || ""}`
      .toLocaleLowerCase("id-ID")
      .includes(keyword),
  );
  const sort = $("#spotlightSort")?.value || "featured";
  if (sort === "featured")
    entries.sort(
      (a, b) =>
        new Date(
          b.spotlight.started_at || b.spotlight.created_at || b.created_at,
        ) -
        new Date(
          a.spotlight.started_at || a.spotlight.created_at || a.created_at,
        ),
    );
  if (sort === "newest")
    entries.sort(
      (a, b) =>
        new Date(
          b.spotlight.started_at || b.spotlight.created_at || b.created_at,
        ) -
        new Date(
          a.spotlight.started_at || a.spotlight.created_at || a.created_at,
        ),
    );
  if (sort === "views")
    entries.sort(
      (a, b) => Number(b.spotlight.view_count) - Number(a.spotlight.view_count),
    );
  if (sort === "contacts")
    entries.sort(
      (a, b) =>
        Number(b.spotlight.contact_count) - Number(a.spotlight.contact_count),
    );
  $("#spotlightResultCount").textContent =
    `${entries.length} kandidat unggulan`;
  feed.innerHTML = entries.length
    ? entries
        .map((profile) => {
          const extra = profile.public_data?.spotlight || {};
          const cover = candidateSafeImageUrl(
            extra.coverUrl ||
              profile.profile_image_url ||
              profile.public_data?.profileImageUrl,
          );
          const skills = (profile.skills || []).slice(0, 6);
          const date = new Date(
            profile.spotlight.started_at ||
              profile.spotlight.created_at ||
              profile.created_at ||
              Date.now(),
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          return `<article class="spotlight-card"><img class="spotlight-cover" src="${escapeHtml(cover || "")}" alt="Cover ${escapeHtml(profile.full_name)}" ${cover ? "" : "hidden"}><div class="spotlight-card-body"><div class="spotlight-card-head"><h2>${escapeHtml(profile.full_name)}</h2><div class="spotlight-badges">${spotlightBadges(profile, profile.spotlight)}</div></div><p class="spotlight-position">${escapeHtml(extra.title || profile.main_position)}</p><p class="spotlight-meta"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(profile.location || "Lokasi tidak dicantumkan")} <span>·</span> ${Number(profile.experience_years) || 0} tahun pengalaman</p><p class="spotlight-summary">${escapeHtml(extra.summary || profile.about || "")}</p><div class="spotlight-skills">${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div><div class="spotlight-metrics"><span><i class="fa-regular fa-calendar" aria-hidden="true"></i> ${escapeHtml(date)}</span><span><i class="fa-regular fa-eye" aria-hidden="true"></i> ${Number(profile.spotlight.view_count) || 0} dilihat</span><span><i class="fa-solid fa-thumbs-up" aria-hidden="true"></i> ${profile.endorsements.length} endorsement</span><span><i class="fa-regular fa-comment" aria-hidden="true"></i> ${Number(profile.spotlight.contact_count) || 0} HRD</span></div><div class="spotlight-card-actions"><button class="btn btn-outline btn-small" type="button" data-spotlight-action="view" data-post-id="${escapeHtml(profile.id)}">Lihat Profil</button><button class="btn btn-outline btn-small" type="button" data-spotlight-action="certificates" data-post-id="${escapeHtml(profile.id)}">Lihat Sertifikat</button><button class="btn btn-outline btn-small" type="button" data-spotlight-action="endorse" data-post-id="${escapeHtml(profile.id)}">Endorse</button><button class="btn btn-outline btn-small" type="button" data-spotlight-action="save" data-post-id="${escapeHtml(profile.id)}">Simpan</button><button class="btn btn-outline btn-small" type="button" data-spotlight-action="contact" data-post-id="${escapeHtml(profile.id)}">Chat Kandidat</button><button class="btn btn-small" type="button" data-spotlight-action="invite" data-post-id="${escapeHtml(profile.id)}">Undang Interview</button></div></div></article>`;
        })
        .join("")
    : '<div class="empty-state"><strong>Belum ada kandidat unggulan</strong>Kandidat yang membayar atau lolos verifikasi admin akan tampil di sini.</div>';
}
function renderSpotlightAdmin() {
  const section = $("#spotlightAdmin");
  if (!section || !isAdminSession() || !supabaseClient) return;
  section.hidden = false;
  section.innerHTML =
    '<h2>Pengajuan verifikasi sertifikat</h2><div class="spotlight-admin-list" id="spotlightAdminList">Memuat pengajuan...</div>';
  supabaseClient
    .from("candidate_certifications")
    .select(
      "id,candidate_post_id,user_id,certificate_type,document_path,created_at",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .then(async ({ data, error }) => {
      const list = $("#spotlightAdminList");
      if (!list) return;
      if (error) throw error;
      if (!data?.length) {
        list.innerHTML =
          '<p class="form-note">Tidak ada pengajuan yang menunggu verifikasi.</p>';
        return;
      }
      const ids = [...new Set(data.map((item) => item.candidate_post_id))];
      const { data: profiles, error: profileError } = await supabaseClient
        .from("candidate_posts")
        .select("id,full_name,main_position")
        .in("id", ids);
      if (profileError) throw profileError;
      list.innerHTML = data
        .map(
          (item) =>
            `<div class="spotlight-admin-row"><div><strong>${escapeHtml(profiles.find((profile) => profile.id === item.candidate_post_id)?.full_name || "Kandidat")}</strong><div>${escapeHtml(item.certificate_type)} · ${escapeHtml(new Date(item.created_at).toLocaleDateString("id-ID"))}</div></div><div class="talent-card-actions"><button class="btn btn-outline btn-small" type="button" data-cert-review="view" data-cert-id="${escapeHtml(item.id)}">Lihat dokumen</button><button class="btn btn-small" type="button" data-cert-review="approve" data-cert-id="${escapeHtml(item.id)}" data-post-id="${escapeHtml(item.candidate_post_id)}">Setujui</button><button class="btn btn-outline btn-small" type="button" data-cert-review="reject" data-cert-id="${escapeHtml(item.id)}">Tolak</button></div></div>`,
        )
        .join("");
    })
    .catch((error) => {
      const list = $("#spotlightAdminList");
      if (list)
        list.textContent = `Pengajuan tidak dapat dimuat: ${error.message || "periksa tabel."}`;
    });
}
function filterCareerNews() {
  const keyword = String($("#newsSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("id-ID");
  const articles = $$("#newsGrid .news-article");
  let visible = 0;
  articles.forEach((article) => {
    const matchesCategory =
      activeNewsFilter === "all" ||
      article.dataset.newsCategory === activeNewsFilter;
    const matchesKeyword =
      !keyword ||
      article.textContent.toLocaleLowerCase("id-ID").includes(keyword);
    article.hidden = !(matchesCategory && matchesKeyword);
    if (!article.hidden) visible++;
  });
  $("#newsResultCount").textContent = `${visible} panduan karier`;
  $("#newsEmpty").hidden = visible > 0;
}
function newsFallbackImage(category) {
  const images = {
    lamaran: "career-cv.jpg",
    "cari-kerja": "career-search.jpg",
    wawancara: "career-interview.jpg",
    aturan: "career-contract.jpg",
    umr: "career-regulations.jpg",
    "saran-gaji": "career-salary.jpg",
    "tempat-kerja": "career-interview.jpg",
    kepemimpinan: "career-promotion.jpg",
    "etos-kerja": "career-contract.jpg",
  };
  return `assets/news/${images[category] || images["cari-kerja"]}`;
}
function renderCareerHeadlineCards(articles, category) {
  const grid = $("#newsLiveGrid");
  const categoryLabel =
    category === "all"
      ? "Berita terbaru"
      : $(`[data-news-filter="${category}"]`)?.textContent || "Berita terbaru";
  grid.innerHTML = articles
    .map((article) => {
      const title = String(article.title || "Berita ketenagakerjaan");
      const source = String(article.source || "Sumber berita");
      const description = String(
        article.description ||
          "Buka berita untuk membaca informasi selengkapnya.",
      );
      const url = safeNewsUrl(article.url);
      const image = safeNewsUrl(article.image) || newsFallbackImage(category);
      const publishedAt = new Date(article.publishedAt);
      const date = Number.isNaN(publishedAt.getTime())
        ? ""
        : publishedAt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
      if (!url) return "";
      return `<article class="news-article"><img class="news-article-cover" src="${escapeHtml(image)}" alt="" loading="lazy" onerror="this.onerror=null;this.src='${escapeHtml(newsFallbackImage(category))}'"><div class="news-article-meta"><span class="news-category-tag">${escapeHtml(categoryLabel)}</span><span>${escapeHtml(source)}${date ? ` · ${escapeHtml(date)}` : ""}</span></div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p><a class="news-article-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Baca berita <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a></article>`;
    })
    .join("");
  if (!grid.querySelector(".news-article"))
    grid.innerHTML =
      '<p class="form-note">Belum ada berita yang cocok. Coba topik lain atau lihat panduan karier di bawah.</p>';
}
async function loadCareerHeadlines(forceRefresh = false) {
  const grid = $("#newsLiveGrid");
  const status = $("#newsLiveStatus");
  if (!grid || !status) return;
  const requestId = ++newsRequestId;
  const category = activeNewsFilter;
  const query =
    category === "umr" ? String($("#newsSearch")?.value || "").trim() : "";
  const cacheIdentity = `${category}:${query.toLocaleLowerCase("id-ID")}`;
  let cached = null;
  try {
    const saved = JSON.parse(localStorage.getItem(newsCacheKey) || "null");
    if (
      saved?.identity === cacheIdentity &&
      Array.isArray(saved.articles) &&
      Date.now() - saved.savedAt < newsCacheMaxAge
    )
      cached = saved;
  } catch {}
  if (cached) renderCareerHeadlineCards(cached.articles, category);
  if (cached && !forceRefresh && Date.now() - cached.savedAt < newsCacheTtl) {
    status.hidden = true;
    return;
  }
  if (!supabaseClient) {
    if (!cached) grid.innerHTML = "";
    status.hidden = false;
    status.textContent = cached
      ? "Tidak tersambung ke Supabase. Menampilkan berita yang terakhir dimuat."
      : "Berita terkini memerlukan koneksi Supabase. Panduan karier tetap tersedia di bawah.";
    return;
  }
  if (!cached)
    grid.innerHTML = '<p class="form-note">Memuat berita terbaru...</p>';
  else {
    status.hidden = false;
    status.textContent = "Memperbarui berita terbaru...";
  }
  try {
    const { data, error } = await supabaseClient.functions.invoke("news-feed", {
      body: { query, category },
    });
    if (error) throw error;
    if (requestId !== newsRequestId) return;
    const articles = Array.isArray(data?.articles) ? data.articles : [];
    if (!articles.length) {
      if (!cached)
        grid.innerHTML =
          '<p class="form-note">Belum ada berita yang cocok. Coba topik lain atau lihat panduan karier di bawah.</p>';
      return;
    }
    renderCareerHeadlineCards(articles, category);
    try {
      writeStoredJson(newsCacheKey, {
        identity: cacheIdentity,
        savedAt: Date.now(),
        articles,
      });
    } catch {}
    status.hidden = true;
  } catch (error) {
    if (requestId !== newsRequestId) return;
    status.hidden = false;
    let message =
      "Berita terbaru belum dapat dimuat. Panduan karier tetap tersedia di bawah.";
    try {
      const response = error?.context;
      const details =
        response instanceof Response ? await response.clone().json() : null;
      if (details?.upstreamStatus === 401 || details?.upstreamStatus === 403)
        message =
          "GNews menolak API key. Pastikan secret news_api berisi key GNews yang valid.";
      else if (details?.upstreamStatus === 429)
        message = "Kuota GNews sedang habis. Coba lagi setelah kuota tersedia.";
      else if (details?.upstreamStatus)
        message = `GNews belum dapat memuat berita (HTTP ${Number(details.upstreamStatus)}).`;
      else if (response?.status === 503)
        message = "Secret news_api belum tersedia pada fungsi Supabase.";
    } catch {
      message =
        "Berita terbaru belum dapat dimuat. Periksa koneksi dan deployment fungsi news-feed.";
    }
    status.textContent = cached
      ? `${message} Menampilkan berita terakhir yang berhasil dimuat.`
      : `${message} Panduan karier tetap tersedia di bawah.`;
  }
}
function safeNewsUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}
async function loadSpotlightInbox() {
  const section = $("#spotlightInbox");
  const list = $("#spotlightInboxList");
  if (!section || !list || !supabaseClient || !isCandidateSession()) return;
  const { data: post, error: postError } = await supabaseClient
    .from("candidate_posts")
    .select("id")
    .eq("user_id", supabaseSession.user.id)
    .maybeSingle();
  if (postError) throw postError;
  section.hidden = false;
  if (!post) {
    list.innerHTML =
      '<p class="form-note">Pesan dari perusahaan akan muncul setelah profilmu dipublikasikan.</p>';
    return;
  }
  const { data: messages, error } = await supabaseClient
    .from("candidate_post_contacts")
    .select("id,company_name,message,created_at")
    .eq("candidate_post_id", post.id)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  list.innerHTML = messages?.length
    ? messages
        .map(
          (item) =>
            `<article class="spotlight-contact-message"><strong>${escapeHtml(item.company_name || "Perusahaan")}</strong><time>${escapeHtml(new Date(item.created_at).toLocaleString("id-ID"))}</time><p>${escapeHtml(item.message)}</p></article>`,
        )
        .join("")
    : '<p class="form-note">Belum ada pesan dari perusahaan.</p>';
}
async function loadTalentPostCategory() {
  if (!supabaseClient || !isCandidateSession()) return;
  const select = $('#talentPostForm [name="category"]');
  if (!select) return;
  const { data, error } = await supabaseClient
    .from("candidate_posts")
    .select("category")
    .eq("user_id", supabaseSession.user.id)
    .maybeSingle();
  if (error) throw error;
  if (data?.category) select.value = data.category;
}
async function saveTalentPost(form) {
  if (!supabaseClient || !isCandidateSession())
    throw new Error(
      "Masuk sebagai kandidat dengan Supabase untuk memublikasikan profil.",
    );
  const owner = supabaseSession.user.id;
  const cover = form.elements.cover.files[0];
  const photos = [...form.elements.photos.files];
  const video = form.elements.video.files[0];
  const certificate = form.elements.certificate.files[0];
  if (
    !cover ||
    !cover.type.startsWith("image/") ||
    cover.size > 5 * 1024 * 1024
  )
    throw new Error("Pilih foto cover JPG, PNG, atau WEBP maksimal 5 MB.");
  if (
    photos.length > 10 ||
    photos.some(
      (file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024,
    )
  )
    throw new Error(
      "Foto tambahan maksimal 10 file dan setiap file maksimal 5 MB.",
    );
  if (
    video &&
    (!["video/mp4", "video/webm"].includes(video.type) ||
      video.size > 25 * 1024 * 1024)
  )
    throw new Error("Video harus MP4/WEBM dan maksimal 25 MB.");
  if (
    certificate &&
    (!["application/pdf", "image/jpeg", "image/png"].includes(
      certificate.type,
    ) ||
      certificate.size > 5 * 1024 * 1024)
  )
    throw new Error("Sertifikat harus PDF, JPG, atau PNG maksimal 5 MB.");
  const upload = async (file, bucket, path) => {
    const { error } = await supabaseClient.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type, upsert: true });
    if (error) throw error;
    return bucket === "candidate-profile-media"
      ? supabaseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl
      : path;
  };
  const coverUrl = await upload(
    cover,
    "candidate-profile-media",
    `${owner}/spotlight-cover.${cover.name.split(".").pop().toLowerCase()}`,
  );
  const media = [];
  for (let index = 0; index < photos.length; index++)
    media.push(
      await upload(
        photos[index],
        "candidate-profile-media",
        `${owner}/spotlight-photo-${index + 1}.${photos[index].name.split(".").pop().toLowerCase()}`,
      ),
    );
  const videoUrl = video
    ? await upload(
        video,
        "candidate-profile-media",
        `${owner}/spotlight-intro.${video.name.split(".").pop().toLowerCase()}`,
      )
    : "";
  const current = await supabaseClient
    .from("candidate_posts")
    .select("id,username,category,public_data")
    .eq("user_id", owner)
    .maybeSingle();
  if (current.error) throw current.error;
  const { data: privateProfile, error: privateProfileError } =
    await supabaseClient
      .from("candidate_post_private")
      .select("private_data")
      .eq("user_id", owner)
      .maybeSingle();
  if (privateProfileError) throw privateProfileError;
  const privateData = privateProfile?.private_data || {};
  const metadata = supabaseSession.user.user_metadata || {};
  const name = String(
    metadata.full_name ||
      metadata.name ||
      supabaseSession.user.email?.split("@")[0] ||
      "Kandidat",
  ).trim();
  const title = String(form.elements.title.value).trim();
  const summary = String(form.elements.summary.value).trim();
  const selectedCategory = String(form.elements.category.value || "").trim();
  const profileCategory = String(current.data?.category || "").trim();
  const category = profileCategory || selectedCategory;
  if (profileCategory && selectedCategory !== profileCategory)
    throw new Error(
      "Kategori Spotlight harus sama dengan kategori yang dipilih pada profil kandidat.",
    );
  if (!categories.some(([name]) => name === category))
    throw new Error(
      "Pilih kategori yang sama dengan bidang pekerjaan pada profil kandidat.",
    );
  const skills = String(form.elements.skills.value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 30);
  if (!skills.length) throw new Error("Tambahkan minimal satu keahlian.");
  const spotlight = {
    title,
    summary,
    experience: String(form.elements.experience.value).trim(),
    achievements: String(form.elements.achievements.value).trim(),
    portfolio: String(form.elements.portfolio.value)
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    salary: Number(form.elements.salary.value) || null,
    openToWork: form.elements.openToWork.checked,
    interviewReady: form.elements.interviewReady.checked,
    relocation: form.elements.relocation.checked,
    coverUrl,
    mediaUrls: media,
    videoUrl,
  };
  const publicData = { ...(current.data?.public_data || {}), spotlight };
  delete publicData.cvUrl;
  delete publicData.cv_url;
  delete publicData.cvName;
  delete publicData.cv_name;
  const post = {
    user_id: owner,
    username:
      current.data?.username ||
      `${name
        .toLocaleLowerCase("id-ID")
        .normalize("NFKD")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")}-${owner.slice(0, 8)}`,
    full_name: name,
    main_position: String(form.elements.position.value).trim(),
    category,
    location: String(metadata.city || metadata.regency_name || ""),
    work_status: spotlight.openToWork ? "Open To Work" : "Actively Looking",
    job_types: [],
    salary_min: spotlight.salary,
    salary_max: spotlight.salary,
    skills,
    education_level: "",
    experience_years: Number(metadata.experience_years) || 0,
    about: summary,
    profile_image_url: coverUrl,
    cv_url: privateData.cv_path || "",
    public_data: publicData,
    is_published: true,
    updated_at: new Date().toISOString(),
  };
  const { error: postError } = await supabaseClient
    .from("candidate_posts")
    .upsert(post, { onConflict: "user_id" });
  if (postError) throw postError;
  const { data: saved, error: readError } = await supabaseClient
    .from("candidate_posts")
    .select("id")
    .eq("user_id", owner)
    .single();
  if (readError) throw readError;
  const { error: featureError } = await supabaseClient
    .from("featured_candidates")
    .upsert(
      {
        candidate_post_id: saved.id,
        user_id: owner,
        status: "pending_verification",
      },
      { onConflict: "candidate_post_id" },
    );
  if (featureError) throw featureError;
  await supabaseClient
    .from("candidate_post_media")
    .delete()
    .eq("candidate_post_id", saved.id)
    .eq("user_id", owner);
  const mediaRows = [
    { media_type: "cover", media_url: coverUrl, sort_order: 0 },
    ...media.map((mediaUrl, index) => ({
      media_type: "photo",
      media_url: mediaUrl,
      sort_order: index + 1,
    })),
    ...(videoUrl
      ? [
          {
            media_type: "video",
            media_url: videoUrl,
            sort_order: media.length + 1,
          },
        ]
      : []),
  ].map((item) => ({ ...item, candidate_post_id: saved.id, user_id: owner }));
  const { error: mediaError } = await supabaseClient
    .from("candidate_post_media")
    .insert(mediaRows);
  if (mediaError) throw mediaError;
  if (certificate) {
    const kind = String(form.elements.certificationType.value || "").trim();
    if (!kind) throw new Error("Pilih jenis sertifikat yang diajukan.");
    const path = `${owner}/spotlight-cert-${crypto.randomUUID()}.${certificate.name.split(".").pop().toLowerCase()}`;
    await upload(certificate, "candidate-private-documents", path);
    const { error } = await supabaseClient
      .from("candidate_certifications")
      .insert({
        candidate_post_id: saved.id,
        user_id: owner,
        certificate_type: kind,
        document_path: path,
        status: "pending",
      });
    if (error) throw error;
  }
  $("#talentPostStatus").textContent =
    "Profil Spotlight terkirim dan menunggu verifikasi admin sebelum ditampilkan.";
  loadSpotlightInbox();
  toast("Pengajuan Talent Spotlight terkirim untuk ditinjau admin.");
}
async function startFeaturedCheckout() {
  if (!supabaseClient || !isCandidateSession()) return openAuthModal(false);
  const { data, error } = await supabaseClient.functions.invoke(
    "create-featured-transaction",
    { body: {} },
  );
  if (error) throw error;
  if (
    !data?.redirect_url ||
    !/^https:\/\/(app|app\.sandbox)\.midtrans\.com\//.test(data.redirect_url)
  )
    throw new Error("URL checkout Midtrans tidak valid.");
  window.location.assign(data.redirect_url);
}
async function handleSpotlightAction(action, postId, element) {
  const profile = spotlightProfiles.find((item) => item.id === postId);
  if (!profile) return;
  if (action === "view") {
    if (supabaseClient)
      await supabaseClient
        .from("candidate_post_views")
        .insert({
          candidate_post_id: postId,
          viewer_id: supabaseSession?.user?.id || null,
        });
    const extra = profile.public_data?.spotlight || {};
    const links = (extra.portfolio || [])
      .map((url) => {
        const safe = candidateSafeHttpUrl(url);
        return safe
          ? `<p><a href="${escapeHtml(safe)}" target="_blank" rel="noopener">${escapeHtml(url)}</a></p>`
          : "";
      })
      .join("");
    const media = (extra.mediaUrls || [])
      .map(
        (url, index) =>
          `<img src="${escapeHtml(candidateSafeImageUrl(url))}" alt="Foto tambahan ${index + 1}" loading="lazy">`,
      )
      .join("");
    const videos = extra.videoUrl
      ? `<video controls playsinline src="${escapeHtml(extra.videoUrl)}"></video>`
      : "";
    openModal(
      profile.full_name,
      `<article class="spotlight-profile-detail"><p><strong>${escapeHtml(extra.title || profile.main_position)}</strong></p><p>${escapeHtml(extra.summary || profile.about || "")}</p><p class="spotlight-meta">${escapeHtml(profile.location || "Lokasi tidak dicantumkan")} · ${Number(profile.experience_years) || 0} tahun pengalaman</p><h3>Keahlian</h3><div class="spotlight-skills">${(profile.skills || []).map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div><h3>Pengalaman</h3><p>${escapeHtml(extra.experience || "Belum dicantumkan")}</p><h3>Prestasi</h3><p>${escapeHtml(extra.achievements || "Belum dicantumkan")}</p><h3>Portfolio</h3>${links || "<p>Belum dicantumkan</p>"}<div class="spotlight-gallery">${media}${videos}</div>${isHrdSession() ? `<button class="btn btn-outline btn-small" type="button" data-candidate-cv="${escapeHtml(postId)}"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Lihat / unduh CV</button>` : '<p class="form-note">CV hanya tersedia untuk HRD berwenang.</p>'}<p><a class="text-link" href="#/candidate/${encodeURIComponent(profile.username)}">Buka profil lengkap</a></p></article>`,
    );
    return;
  }
  if (action === "certificates") {
    if (!supabaseClient || !isHrdSession())
      return toast("Masuk sebagai HRD untuk melihat sertifikat kandidat.");
    const { data: certificates, error } = await supabaseClient
      .from("candidate_certifications")
      .select("id,certificate_type,document_path")
      .eq("candidate_post_id", postId)
      .eq("status", "approved");
    if (error) throw error;
    if (!certificates?.length)
      return toast("Belum ada sertifikat terverifikasi.");
    const { data: signed, error: signError } = await supabaseClient.storage
      .from("candidate-private-documents")
      .createSignedUrls(
        certificates.map((item) => item.document_path),
        300,
      );
    if (signError) throw signError;
    openModal(
      `Sertifikat ${profile.full_name}`,
      `<div class="spotlight-certificate-list">${certificates.map((item, index) => `<p><a href="${escapeHtml(signed[index]?.signedUrl || "#")}" target="_blank" rel="noopener">${escapeHtml(item.certificate_type)} · Lihat dokumen</a></p>`).join("")}</div>`,
    );
    return;
  }
  if (!supabaseClient || !isHrdSession())
    return toast("Masuk sebagai HRD untuk berinteraksi dengan kandidat.");
  if (action === "save") {
    openModal(
      "Simpan kandidat",
      `<form><div class="form-row"><label for="spotlightBookmarkNotes">Catatan internal</label><textarea id="spotlightBookmarkNotes" name="notes" maxlength="1000" placeholder="Catatan privat untuk tim rekrutmen"></textarea></div><button class="btn" type="submit">Simpan kandidat</button></form>`,
      async (data) => {
        const { error } = await supabaseClient
          .from("candidate_bookmarks")
          .upsert(
            {
              candidate_post_id: postId,
              company_user_id: supabaseSession.user.id,
              notes: String(data.get("notes") || "").trim(),
            },
            { onConflict: "candidate_post_id,company_user_id" },
          );
        if (error) throw error;
        closeModal();
        toast("Kandidat tersimpan.");
      },
    );
    return;
  }
  if (action === "endorse") {
    if (!canManageCandidates())
      return toast("Role Recruiter hanya dapat melihat kandidat.");
    openModal(
      "Endorse keahlian",
      `<form><p class="form-note">Pilih skill ${escapeHtml(profile.full_name)} yang ingin Anda endorse.</p><div class="form-row"><label for="spotlightEndorseSkill">Keahlian</label><select name="skill" id="spotlightEndorseSkill" required>${[...new Set([...(profile.skills || []), ...spotlightSkills])].map((skill) => `<option>${escapeHtml(skill)}</option>`).join("")}</select></div><button class="btn" type="submit">Endorse skill</button></form>`,
      async (data) => {
        const { error } = await supabaseClient
          .from("candidate_endorsements")
          .insert({
            candidate_post_id: postId,
            company_user_id: supabaseSession.user.id,
            skill: String(data.get("skill")),
          });
        if (error) throw error;
        closeModal();
        toast("Endorsement berhasil dicatat.");
        loadTalentSpotlight();
      },
    );
    return;
  }
  if (action === "invite") {
    const minimum = new Date().toISOString().slice(0, 10);
    openModal(
      "Undang interview kandidat",
      `<form><p class="form-note">Kandidat: <strong>${escapeHtml(profile.full_name)}</strong></p><div class="form-row"><label for="spotlightInterviewType">Tahap interview</label><select id="spotlightInterviewType" name="type"><option>Interview</option><option>Final Interview</option><option>Technical Test</option></select></div><div class="candidate-form-grid"><div class="form-row"><label for="spotlightInterviewDate">Tanggal</label><input id="spotlightInterviewDate" name="date" type="date" min="${minimum}" required></div><div class="form-row"><label for="spotlightInterviewTime">Waktu</label><input id="spotlightInterviewTime" name="time" type="time" required></div></div><div class="form-row"><label for="spotlightInterviewUrl">Link meeting</label><input id="spotlightInterviewUrl" name="url" type="url" placeholder="https://meet.google.com/"></div><div class="form-row"><label for="spotlightInterviewNotes">Catatan</label><textarea id="spotlightInterviewNotes" name="notes" maxlength="1000"></textarea></div><button class="btn" type="submit">Kirim undangan</button></form>`,
      async (data) => {
        const startsAt = new Date(`${data.get("date")}T${data.get("time")}:00`);
        if (Number.isNaN(startsAt.getTime()) || startsAt <= new Date())
          throw new Error("Pilih jadwal interview yang akan datang.");
        const meetingUrl = String(data.get("url") || "").trim();
        if (meetingUrl && !candidateSafeHttpUrl(meetingUrl))
          throw new Error("Link meeting harus menggunakan HTTP atau HTTPS.");
        const companyName =
          currentCompanyProfile()?.company_name ||
          supabaseSession.user.user_metadata?.company_name ||
          supabaseSession.user.email;
        const { error } = await supabaseClient
          .from("candidate_interview_invites")
          .insert({
            candidate_post_id: postId,
            company_user_id: supabaseSession.user.id,
            company_name: companyName,
            interview_type: String(data.get("type")),
            starts_at: startsAt.toISOString(),
            meeting_url: meetingUrl || null,
            notes: String(data.get("notes") || "").trim(),
          });
        if (error) throw error;
        closeModal();
        toast(`Undangan interview untuk ${profile.full_name} terkirim.`);
      },
    );
    return;
  }
  if (action === "contact") {
    openModal(
      `Hubungi ${profile.full_name}`,
      `<form><div class="form-row"><label for="spotlightContactMessage">Pesan untuk kandidat</label><textarea id="spotlightContactMessage" name="message" rows="4" maxlength="1500" required placeholder="Ceritakan kesempatan yang ingin Anda tawarkan"></textarea></div><button class="btn" type="submit">Kirim pesan</button></form>`,
      async (data) => {
        const companyName =
          currentCompanyProfile()?.company_name ||
          supabaseSession.user.user_metadata?.company_name ||
          supabaseSession.user.email;
        const { error } = await supabaseClient
          .from("candidate_post_contacts")
          .insert({
            candidate_post_id: postId,
            company_user_id: supabaseSession.user.id,
            company_name: companyName,
            message: String(data.get("message")).trim(),
          });
        if (error) throw error;
        closeModal();
        toast("Pesan terkirim ke kotak Talent Spotlight kandidat.");
        loadTalentSpotlight();
      },
    );
  }
}
async function handleSpotlightReview(action, certId, postId) {
  if (!supabaseClient || !isAdminSession()) return;
  const { data: cert, error } = await supabaseClient
    .from("candidate_certifications")
    .select("*")
    .eq("id", certId)
    .single();
  if (error) throw error;
  if (action === "view") {
    const { data, error: signError } = await supabaseClient.storage
      .from("candidate-private-documents")
      .createSignedUrl(cert.document_path, 300);
    if (signError) throw signError;
    window.open(data.signedUrl, "_blank", "noopener");
    return;
  }
  const status = action === "approve" ? "approved" : "rejected";
  const { error: updateError } = await supabaseClient
    .from("candidate_certifications")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: supabaseSession.user.id,
    })
    .eq("id", certId);
  if (updateError) throw updateError;
  if (action === "approve") {
    const { error: featureError } = await supabaseClient
      .from("featured_candidates")
      .update({
        status: "featured",
        verified_talent: true,
        certified_professional: true,
        started_at: new Date().toISOString(),
        ends_at: null,
      })
      .eq("candidate_post_id", postId);
    if (featureError) throw featureError;
  }
  toast(
    action === "approve"
      ? "Sertifikat disetujui. Kandidat tampil sebagai Verified Talent selama 30 hari."
      : "Pengajuan sertifikat ditolak.",
  );
  renderSpotlightAdmin();
  loadTalentSpotlight();
  if (
    activeRoute === "admin" &&
    $("#adminCertificationsPanel")?.classList.contains("is-active")
  )
    loadAdminCertifications();
}
async function handleFeaturedSubmissionReview(action, postId) {
  if (!supabaseClient || !isAdminSession())
    throw new Error("Role admin aktif diperlukan.");
  const update =
    action === "approve"
      ? {
          status: "featured",
          started_at: new Date().toISOString(),
          ends_at: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        }
      : { status: "rejected" };
  const { data, error } = await supabaseClient
    .from("featured_candidates")
    .update(update)
    .eq("candidate_post_id", postId)
    .eq("status", "pending_verification")
    .select("candidate_post_id")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Pengajuan tidak ditemukan atau sudah ditinjau.");
  await loadAdminSpotlightPosts();
  await loadTalentSpotlight();
  toast(
    action === "approve"
      ? "Profil Talent Spotlight disetujui dan dipublikasikan selama 30 hari."
      : "Pengajuan Talent Spotlight ditolak.",
  );
}
function setupCandidatePhotoUpload() {
  const avatar = $("#candidateView .profile-head .avatar");
  const column = $("#candidateView .profile-columns > div");
  column.insertAdjacentHTML(
    "afterbegin",
    '<div class="profile-block"><h3>Foto profil</h3><p>Tambahkan foto agar perusahaan lebih mudah mengenali profilmu.</p><div class="upload-area"><label class="btn btn-outline btn-small" for="photoUpload">Pilih foto</label><input id="photoUpload" type="file" accept="image/*" style="display:none"><div id="photoInfo" style="margin-top:8px">JPG, PNG, atau WEBP (maksimal 2 MB)</div></div></div>',
  );
  const savedPhoto = localStorage.getItem("jobhub-profile-photo");
  if (savedPhoto)
    avatar.innerHTML = `<img src="${savedPhoto}" alt="Foto profil kandidat">`;
  $("#photoUpload").addEventListener("change", (event) => {
    if (!isCandidateSession()) {
      event.target.value = "";
      toast("Masuk sebagai pencari kerja sebelum mengunggah foto profil.");
      openAuthModal(false);
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Pilih file gambar untuk foto profil.");
      event.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast("Ukuran foto maksimal 2 MB.");
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      try {
        writeStoredJson("jobhub-profile-photo", image);
      } catch {
        toast("Penyimpanan browser penuh. Coba gunakan foto lebih kecil.");
        return;
      }
      avatar.innerHTML = `<img src="${image}" alt="Foto profil kandidat">`;
      $("#photoInfo").textContent =
        `${file.name} berhasil dipasang sebagai foto profil.`;
      renderAccountMenu();
      toast("Foto profil berhasil diperbarui.");
    };
    reader.readAsDataURL(file);
  });
}
function setupCandidateCvUpload() {
  const input = $("#cvUpload");
  const showSavedCv = (name, file) => {
    $("#cvInfo").textContent =
      `${name} (${(file.size / 1024 / 1024).toFixed(2)} MB) tersimpan di perangkat ini.`;
    $("#savedCV").style.display = "block";
    $("#savedCV").innerHTML =
      `<strong>${escapeHtml(name)}</strong><br><button class="text-link" id="previewCV" type="button">Preview PDF</button>`;
    $("#previewCV").onclick = () => {
      const url = URL.createObjectURL(file);
      window.open(url, "_blank", "noopener");
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    };
  };
  const savedId = localStorage.getItem("jobhub-cv-file-id");
  if (savedId) {
    getCvFile(savedId)
      .then((saved) => {
        if (saved) showSavedCv(saved.name, saved.blob);
      })
      .catch((error) =>
        toast(
          `CV tersimpan tidak dapat dibaca: ${error.message || "unggah ulang CV."}`,
        ),
      );
  }
  input.addEventListener("change", async (event) => {
    if (!isCandidateSession()) {
      event.target.value = "";
      toast("Masuk sebagai pencari kerja sebelum mengunggah CV.");
      openAuthModal(false);
      return;
    }
    const file = event.target.files[0];
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast("File CV harus berformat PDF.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast("Ukuran CV maksimal 5 MB.");
      event.target.value = "";
      return;
    }
    try {
      const id = await saveCvFile(file);
      writeStoredJson("jobhub-cv-file-id", id);
      writeStoredJson("jobhub-cv-name", file.name);
      showSavedCv(file.name, file);
      toast("CV berhasil disimpan di perangkat ini dan siap dilampirkan.");
    } catch (error) {
      toast(
        `CV tidak dapat disimpan: ${error.message || "penyimpanan browser tidak tersedia."}`,
      );
    }
  });
}
function showDashboardPanel(section = "overview") {
  const overview = $("#dashboardOverviewPanels");
  const inline = $("#dashboardInlinePanel");
  if (!overview || !inline) return;
  const visiblePanels =
    {
      overview: [
        "dashboardStatsPanel",
        "companyAnalyticsPanel",
        "recentApplicantsPanel",
      ],
      jobs: ["companyJobsPanel"],
      candidates: ["atsPanel"],
      ranking: ["candidateRankingPanel"],
      "talent-pool": ["talentPoolPanel"],
      guide: ["dashboardGuidePanel"],
    }[section] || null;
  overview.hidden = false;
  overview.dataset.dashboardSection = section;
  Array.from(overview.children).forEach((panel) => {
    panel.hidden = Boolean(visiblePanels && !visiblePanels.includes(panel.id));
  });
  inline.hidden = true;
  activeDashboardSection = section;
  updateDashboardOverviewChrome(section === "overview", section);
  $$("#dashboardView .dash-nav [data-dash]").forEach((button) =>
    button.classList.toggle("active", button.dataset.dash === section),
  );
  $$("#dashboardView .dash-nav [data-route]").forEach((button) =>
    button.classList.remove("active"),
  );
}
function updateDashboardOverviewChrome(showOverview, section = "overview") {
  $("#dashboardView")?.classList.toggle("is-dashboard-subpage", !showOverview);
  const heading = $("#dashboardSectionHeading");
  const title = $("#dashboardSectionTitle");
  if (heading && title) {
    const labels = {
      jobs: "Lowongan Saya",
      candidates: "Pipeline Kandidat",
      ranking: "Peringkat Kandidat",
      "talent-pool": "Talent Pool",
      guide: "Panduan",
      messages: "Pesan",
      "candidate-search": "Cari Kandidat",
      pricing: "Paket & Pembayaran",
      company: "Profil Perusahaan",
    };
    heading.hidden = showOverview;
    title.textContent = labels[section] || "Dashboard";
  }
}
function restoreDashboardInlineViews() {
  const positions = Array.from(dashboardInlineViewPositions.values()).sort(
    (left, right) => right.index - left.index,
  );
  for (const position of positions) {
    const reference = position.parent.children[position.index] || null;
    position.parent.insertBefore(position.view, reference);
    position.view.classList.remove("active");
  }
  dashboardInlineViewPositions.clear();
  const inline = $("#dashboardInlinePanel");
  if (inline) {
    inline.hidden = true;
    inline.replaceChildren();
  }
  activeDashboardSection = "overview";
}
function openDashboardInlineRoute(route, extra = "") {
  const view = document.getElementById(routes[route]);
  const inline = $("#dashboardInlinePanel");
  const overview = $("#dashboardOverviewPanels");
  if (!view || !inline || !overview) return;
  if (!dashboardInlineViewPositions.has(route)) {
    const parent = view.parentElement;
    dashboardInlineViewPositions.set(route, {
      view,
      parent,
      index: Array.prototype.indexOf.call(parent.children, view),
    });
  }
  inline.append(view);
  overview.hidden = true;
  inline.hidden = false;
  updateDashboardOverviewChrome(false, route);
  inline
    .querySelectorAll(".page-view")
    .forEach((page) => page.classList.toggle("active", page === view));
  activeDashboardSection = route;
  window.dispatchEvent(
    new CustomEvent("jobhub-route-change", { detail: { route } }),
  );
  $$("#dashboardView .dash-nav [data-dash]").forEach((button) =>
    button.classList.remove("active"),
  );
  $$("#dashboardView .dash-nav [data-route]").forEach((button) =>
    button.classList.toggle("active", button.dataset.route === route),
  );
  if (route === "messages") {
    renderJobMessages(extra)
      .then(loadDashboardMessageCount)
      .catch((error) => {
        $("#conversationList").innerHTML =
          `<div class="conversation-empty is-error"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><strong>Pesan gagal dimuat</strong><span>${escapeHtml(error.message || "Jalankan migration jobhub-messaging.sql lalu coba lagi.")}</span></div>`;
        toast(
          `Inbox gagal dimuat: ${error.message || "terapkan migration jobhub-messaging.sql."}`,
        );
      });
  } else if (route === "candidate-search") renderCandidateSearch();
  else if (route === "pricing") renderPricing();
  else if (route === "company") {
    const renderProfile = () => {
      renderCompanyProfilePage();
      renderCompanyVerificationState();
    };
    if (isCompanyAccount())
      loadCurrentCompanyProfile()
        .then(renderProfile)
        .catch((error) => {
          renderProfile();
          notifyCompanyProfileLoadError(error);
        });
    else renderProfile();
  }
}
function go(route, extra) {
  if (candidateChatPopupOpen) closeCandidateChatPopup();
  const stayingInCompanyDashboard =
    isCompanyAccount() &&
    activeRoute === "dashboard" &&
    [
      "dashboard",
      "messages",
      "candidate-search",
      "pricing",
      "company",
    ].includes(route);
  const keepCandidateMessageRealtime = isCandidateSession() && !isHrdSession();
  if (
    route !== "messages" &&
    !stayingInCompanyDashboard &&
    !keepCandidateMessageRealtime &&
    jobMessageChannel
  ) {
    supabaseClient?.removeChannel(jobMessageChannel);
    jobMessageChannel = null;
    jobMessageChannelKey = "";
  }
  if (
    route !== "dashboard" &&
    !stayingInCompanyDashboard &&
    companyDashboardClockTimer
  ) {
    window.clearInterval(companyDashboardClockTimer);
    companyDashboardClockTimer = 0;
  }
  if (route !== "admin" && adminClockTimer) {
    window.clearInterval(adminClockTimer);
    adminClockTimer = 0;
  }
  const loginRequiredRoutes = [
    "candidate",
    "candidate-create-profile",
    "candidate-talent-post",
    "candidate-own-profile",
    "candidate-resume-studio",
    "favorites",
    "candidate-applications",
    "dashboard",
    "company-complete",
    "messages",
    "admin",
    "candidate-search",
    "pricing",
    "rantau-dashboard",
    "rantau-inbox",
  ];
  if (!supabaseSession && loginRequiredRoutes.includes(route)) {
    pendingAuthRoute = route;
    if (supabaseSessionReady) {
      openAuthModal(false);
      toast("Masuk untuk melanjutkan.");
    }
    return;
  }
  if (supabaseSession) {
    const candidateRoutes = [
      "candidate",
      "candidate-create-profile",
      "candidate-talent-post",
      "candidate-own-profile",
      "candidate-resume-studio",
      "favorites",
      "candidate-applications",
    ];
    if (candidateRoutes.includes(route) && !isCandidateSession()) {
      toast("Halaman ini hanya tersedia untuk akun pencari kerja.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "dashboard" && !isCompanyAccount()) {
      toast("Halaman ini hanya tersedia untuk akun perusahaan.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "rantau-dashboard" && !isRantauAccount()) {
      toast("Dashboard ini khusus untuk akun Pengguna JobHub Rantau.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "messages" && !isCompanyAccount() && !isCandidateSession()) {
      toast("Pesan hanya tersedia untuk akun kandidat dan perusahaan.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "company-complete" && !isCompanyAccount()) {
      toast("Halaman ini hanya tersedia untuk akun perusahaan.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "pricing" && !isCompanyAccount()) {
      toast("Paket perusahaan hanya tersedia untuk akun perusahaan atau HRD.");
      go(authenticatedHomeRoute());
      return;
    }
    if (route === "candidate-search" && !isHrdSession()) {
      toast(
        "Pencarian kandidat hanya tersedia untuk HRD yang telah diaktifkan admin.",
      );
      go(authenticatedHomeRoute());
      return;
    }
    if (
      route === "candidate-search" &&
      isCompanyAccount() &&
      !getCompanyOnboardingState().ready
    ) {
      toast(
        "Selesaikan persiapan perusahaan sebelum mengakses fitur rekrutmen.",
      );
      go("dashboard");
      return;
    }
    if (route === "admin" && !isAdminEmail()) {
      toast("Panel admin hanya tersedia untuk email yang diizinkan.");
      go(authenticatedHomeRoute());
      return;
    }
  }
  if (isCompanyAccount() && activeRoute === "dashboard") {
    if (route === "dashboard") {
      showDashboardPanel("overview");
      return;
    }
    if (
      ["messages", "candidate-search", "pricing", "company"].includes(route)
    ) {
      openDashboardInlineRoute(route, extra);
      return;
    }
    restoreDashboardInlineViews();
  }
  if (route === "candidate-own-profile") {
    (async () => {
      try {
        const ownerId = supabaseSession?.user?.id;
        const local =
          typeof getLocalCandidateProfiles === "function"
            ? getLocalCandidateProfiles().find(
                (profile) => profile.userId === ownerId && profile.is_published,
              )
            : null;
        let profile = local || null;
        if (supabaseClient && ownerId) {
          const { data, error } = await supabaseClient
            .from("candidate_posts")
            .select("username,is_published")
            .eq("user_id", ownerId)
            .maybeSingle();
          if (error) throw error;
          profile = data?.is_published ? data : null;
        }
        if (profile?.username) go("candidate-public", profile.username);
        else {
          toast("Publikasikan profil kandidat terlebih dahulu.");
          go("candidate-create-profile");
        }
      } catch (error) {
        toast(
          `Profil kandidat tidak dapat dibuka: ${error.message || "periksa koneksi."}`,
        );
      }
    })();
    return;
  }
  if (route === "candidate" && isCandidateSession()) {
    go("candidate-own-profile");
    return;
  }
  document.body.classList.toggle("is-company-dashboard", route === "dashboard");
  activeRoute = route;
  updateCandidateChatLauncherVisibility(route);
  updateRantauChatLauncherVisibility(route);
  window.dispatchEvent(
    new CustomEvent("jobhub-route-change", { detail: { route } }),
  );
  $$(".page-view").forEach((v) => v.classList.remove("active"));
  $("#homeView").style.display = route === "home" ? "block" : "none";
  if (route !== "home") {
    $(`#${routes[route] || "jobsView"}`).classList.add("active");
  }
  if (route === "jobs") {
    renderJobs();
  }
  if (route === "companies") renderCompanyDirectory();
  if (route === "company") {
    const renderProfile = () => {
      renderCompanyProfilePage();
      renderCompanyVerificationState();
    };
    if (isCompanyAccount())
      loadCurrentCompanyProfile()
        .then(renderProfile)
        .catch((error) => {
          renderProfile();
          notifyCompanyProfileLoadError(error);
        });
    else renderProfile();
  }
  if (route === "company-complete") {
    const renderForm = () => renderCompanyProfileCompletionPage();
    if (isCompanyAccount())
      loadCurrentCompanyProfile()
        .then(renderForm)
        .catch((error) => {
          renderForm();
          notifyCompanyProfileLoadError(error);
        });
    else renderForm();
  }
  if (route === "candidate-feed" && typeof renderCandidateFeed === "function")
    renderCandidateFeed();
  if (route === "rantau" && typeof renderRantauMarketplace === "function")
    renderRantauMarketplace();
  if (
    route === "rantau-dashboard" &&
    typeof renderRantauDashboard === "function"
  )
    renderRantauDashboard();
  if (route === "rantau-inbox" && typeof renderRantauMessages === "function")
    renderRantauMessages("#rantauCustomerMessages");
  if (route === "rantau-detail" && typeof renderRantauDetailPage === "function")
    renderRantauDetailPage(extra);
  if (route === "favorites" && typeof renderFavorites === "function")
    renderFavorites().catch((error) =>
      toast(`Favorit tidak dapat dimuat: ${error.message || "coba lagi."}`),
    );
  if (
    route === "candidate-applications" &&
    typeof renderCandidateApplications === "function"
  )
    renderCandidateApplications().catch((error) =>
      toast(
        `Lamaran kandidat tidak dapat dimuat: ${error.message || "periksa koneksi dan kebijakan Supabase."}`,
      ),
    );
  if (route === "news") loadCareerHeadlines();
  if (route === "detail") {
    renderDetail(extra);
    const job = jobs.find((item) => item.id === extra);
    if (job && !(isHrdSession() && job.companyId === billingCompanyId()))
      recordJobView(job.id);
    const benefits = $$("#detailContent .detail-section p").at(-1);
    if (job && benefits)
      benefits.textContent = (
        job.benefits?.length
          ? job.benefits
          : ["Asuransi kesehatan", "Pengembangan diri", "Cuti tahunan"]
      ).join(" · ");
  }
  if (route === "dashboard" || route === "admin") renderDashboard();
  if (route === "dashboard") showDashboardPanel("overview");
  if (route === "dashboard" && isCompanyAccount()) startCompanyDashboardClock();
  if (route === "admin") {
    const adminReady = isAdminSession();
    $("#adminRoleSetupNotice").hidden = adminReady;
    $(".admin-layout").hidden = !adminReady;
    if (adminReady) {
      loadAdminDashboardStats().catch((error) =>
        toast(
          `Statistik admin gagal dimuat: ${error.message || "periksa akses tabel."}`,
        ),
      );
      loadCompanyVerifications().catch((error) =>
        toast(
          `Pengajuan perusahaan gagal dimuat: ${error.message || "periksa akses tabel verifikasi."}`,
        ),
      );
    }
  }
  if (route === "dashboard" && isCompanyAccount())
    Promise.all([
      loadCurrentCompanyProfile().catch(notifyCompanyProfileLoadError),
      loadCompanyVerificationForUser().catch((error) =>
        toast(
          `Status verifikasi perusahaan gagal dimuat: ${error.message || "periksa koneksi."}`,
        ),
      ),
    ]).then(() => {
      if (activeRoute !== "dashboard") return;
      renderCompanyCompletionPanel();
      renderDashboard();
    });
  if (route === "dashboard" && isHrdSession()) {
    connectJobMessagesRealtime();
    loadDashboardMessageCount().catch((error) =>
      console.warn("Unread message count could not load:", error.message),
    );
  }
  if (route === "messages")
    renderJobMessages().catch((error) => {
      $("#conversationList").innerHTML =
        `<div class="conversation-empty is-error"><i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><strong>Pesan gagal dimuat</strong><span>${escapeHtml(error.message || "Jalankan migration jobhub-messaging.sql lalu coba lagi.")}</span></div>`;
      toast(
        `Inbox gagal dimuat: ${error.message || "terapkan migration jobhub-messaging.sql."}`,
      );
    });
  if (route === "dashboard" && isHrdSession())
    markApplicationsViewedByHrd().catch((error) =>
      toast(
        `Status dilihat HRD gagal disimpan: ${error.message || "periksa kolom viewed_at."}`,
      ),
    );
  if (
    route === "candidate-create-profile" &&
    typeof renderCandidateWizard === "function"
  )
    renderCandidateWizard();
  if (
    route === "candidate-resume-studio" &&
    typeof renderCandidateResumeStudio === "function"
  )
    renderCandidateResumeStudio().catch((error) =>
      toast(
        `Studio resume tidak dapat dibuka: ${error.message || "muat ulang profil kandidat."}`,
      ),
    );
  if (
    route === "candidate-search" &&
    typeof renderCandidateSearch === "function"
  )
    renderCandidateSearch();
  if (
    route === "candidate-public" &&
    typeof renderCandidatePublicProfile === "function"
  )
    renderCandidatePublicProfile(extra);
  if (route === "talent-spotlight") loadTalentSpotlight();
  if (route === "candidate-talent-post")
    Promise.all([loadSpotlightInbox(), loadTalentPostCategory()]).catch(
      (error) =>
        toast(
          `Data Talent Spotlight tidak dapat dimuat: ${error.message || "periksa izin Supabase."}`,
        ),
    );
  if (route === "candidate") {
    renderCandidateNotifications();
    if (typeof renderCandidateCompletionPanel === "function")
      renderCandidateCompletionPanel().catch((error) =>
        toast(
          `Kelengkapan profil gagal dimuat: ${error.message || "periksa koneksi dan kebijakan Supabase."}`,
        ),
      );
    if (typeof renderCandidateProfileInvites === "function")
      renderCandidateProfileInvites();
    if (isCandidateSession())
      loadCandidateInterviews().catch((error) =>
        toast(
          `Notifikasi interview gagal dimuat: ${error.message || "coba lagi."}`,
        ),
      );
  }
  if (route === "company") renderCompanyVerificationState();
  if (route === "pricing") renderPricing();
  const hashRoute =
    route === "home"
      ? ""
      : route === "detail"
        ? `jobs/${extra}`
        : route === "rantau-detail"
          ? `rantau/${extra}`
          : route === "candidate-create-profile"
            ? "candidate/create-profile"
            : route === "candidate-search"
              ? "candidate/search"
              : route === "candidate-public"
                ? `candidate/${extra}`
                : route === "candidate-talent-post"
                  ? "candidate/talent-post"
                  : route === "candidate-resume-studio"
                    ? "candidate/resume-studio"
                    : route;
  history.replaceState(null, "", `#/${hashRoute}`);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
function toast(message) {
  if (window.Swal) {
    window.Swal.fire({
      title: message,
      icon: "success",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2200,
      timerProgressBar: true,
    });
    return;
  }
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 2600);
}
function openModal(title, html, onSubmit) {
  const modal = $("#modalBackdrop .modal");
  modal?.classList.remove(
    "auth-modal",
    "company-verification-modal",
    "company-directory-profile-modal",
    "rantau-listing-modal",
  );
  modal?.querySelector(".company-verification-hero-icon")?.remove();
  $("#modalBackdrop").classList.remove(
    "auth-modal-backdrop",
    "company-directory-drawer-backdrop",
  );
  $("#modalTitle").textContent = title;
  $("#modalBody").innerHTML = html;
  if (
    title === "Pasang hunian di JobHub Rantau" ||
    title === "Edit hunian di JobHub Rantau"
  ) {
    modal?.classList.add("rantau-listing-modal");
    $("#modalTitle")?.insertAdjacentHTML(
      "afterbegin",
      '<i class="fa-solid fa-house-circle-check" aria-hidden="true"></i>',
    );
    const uploadIcons = [
      ["rantauListingTitle", "fa-house"],
      ["rantauListingType", "fa-list"],
      ["rantauListingLocation", "fa-location-dot"],
      ["rantauListingPrice", "fa-wallet"],
      ["rantauListingAddress", "fa-map-location-dot"],
      ["rantauListingAvailability", "fa-calendar-check"],
      ["rantauListingPhotos", "fa-images"],
      ["rantauListingFacilities", "fa-list-check"],
      ["rantauListingDescription", "fa-align-left"],
      ["rantauListingRules", "fa-clipboard-list"],
    ];
    uploadIcons.forEach(([fieldId, icon]) =>
      document
        .querySelector(`label[for="${fieldId}"]`)
        ?.insertAdjacentHTML(
          "afterbegin",
          `<i class="fa-solid ${icon}" aria-hidden="true"></i>`,
        ),
    );
    updateRantauFormPaymentLabel($("#rantauListingType")?.value || "Kos");
  }
  if (title === "Kirim lamaran") {
    const cvField = $('#modalBody input[name="cvUpload"]')?.closest(
      ".form-row",
    );
    cvField?.insertAdjacentHTML(
      "beforeend",
      '<button class="btn btn-outline btn-small" id="editCvWithCanva" type="button"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Edit CV di Canva</button>',
    );
    const cvSelect = $('#modalBody select[name="cvFileId"]');
    const profile =
      typeof getCurrentCandidateProfile === "function"
        ? getCurrentCandidateProfile()
        : null;
    const profileCvPath =
      profile?.cvPath || profile?.privateData?.cv_path || "";
    if (
      cvSelect &&
      profileCvPath &&
      !cvSelect.querySelector('option[value="profile-private"]')
    ) {
      cvSelect.insertAdjacentHTML(
        "beforeend",
        '<option value="profile-private">CV terbaru dari profil (privat)</option>',
      );
      if (!cvSelect.value) cvSelect.value = "profile-url";
    }
  }
  $("#modalBackdrop").classList.add("open");
  const form = $("#modalBody form");
  if (form)
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const button = form.querySelector('button[type="submit"]');
      const originalText = button?.textContent || "";
      if (button) {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        button.textContent = "Memproses...";
      }
      Promise.resolve(onSubmit?.(new FormData(form)))
        .catch((error) => {
          toast(
            `Tidak dapat memproses permintaan: ${error.message || "periksa data dan koneksi."}`,
          );
        })
        .finally(() => {
          if (button && button.isConnected) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            button.textContent = originalText;
          }
        });
    });
}
function closeModal() {
  if (activeCvObjectUrl) {
    URL.revokeObjectURL(activeCvObjectUrl);
    activeCvObjectUrl = null;
  }
  activeCompanyDocumentUrls.forEach((url) => URL.revokeObjectURL(url));
  activeCompanyDocumentUrls = [];
  $("#modalBackdrop").classList.remove("open");
  $("#modalBackdrop").classList.remove("company-directory-drawer-backdrop");
  $("#modalBackdrop .modal")?.classList.remove(
    "company-directory-profile-modal",
  );
}
function decorateAuthModal(form, isSignup) {
  if (!form) return;
  const modal = $("#modalBackdrop .modal");
  const backdrop = $("#modalBackdrop");
  modal.classList.add("auth-modal");
  backdrop.classList.add("auth-modal-backdrop");
  const aside = document.createElement("aside");
  aside.className = "auth-modal-aside";
  const brand = document.createElement("div");
  brand.className = "auth-modal-brand";
  const logo = document.createElement("img");
  logo.src = "logo.png";
  logo.alt = "";
  const brandText = document.createElement("span");
  brandText.append(document.createTextNode("JOBHUB "));
  const country = document.createElement("strong");
  country.textContent = "INDONESIA";
  brandText.append(country);
  brand.append(logo, brandText);
  const title = document.createElement("h2");
  title.textContent = isSignup ? "Buat Akun JobHub" : "Selamat Datang Kembali";
  const description = document.createElement("p");
  description.textContent = isSignup
    ? "Bergabunglah untuk menemukan peluang karier terbaik dan mengembangkan masa depan Anda."
    : "Masuk untuk melanjutkan perjalanan dan aktivitas Anda bersama JobHub.";
  const benefits = document.createElement("ul");
  benefits.className = "auth-modal-benefits";
  const benefitItems = isSignup
    ? [
        ["fa-briefcase", "Akses ribuan lowongan pekerjaan"],
        ["fa-shield-halved", "Perusahaan terpercaya di seluruh Indonesia"],
        ["fa-chart-line", "Langkah mudah menuju karier impian"],
      ]
    : [
        ["fa-user-shield", "Akun dan profil tetap aman"],
        ["fa-briefcase", "Kelola aktivitas JobHub Anda"],
        ["fa-arrow-trend-up", "Lanjutkan langkah karier Anda"],
      ];
  for (const [icon, label] of benefitItems) {
    const item = document.createElement("li");
    const iconNode = document.createElement("i");
    iconNode.className = `fa-solid ${icon}`;
    iconNode.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = label;
    item.append(iconNode, text);
    benefits.append(item);
  }
  const visual = document.createElement("img");
  visual.className = "auth-modal-visual";
  visual.src = "c.jpg";
  visual.alt = "Ruang kerja profesional dengan laptop";
  aside.append(brand, title, description, benefits, visual);
  const fields = document.createElement("div");
  fields.className = "auth-modal-fields";
  while (form.firstChild) fields.append(form.firstChild);
  form.classList.add("auth-modal-layout");
  form.append(aside, fields);
}
async function startGoogleOAuth(isSignup) {
  if (!ensureSupabaseClient()) {
    toast(supabaseUnavailableMessage());
    return;
  }
  const accountType = isSignup ? String($("#accountType")?.value || "") : "";
  if (isSignup && !accountType) {
    toast("Pilih jenis akun terlebih dahulu.");
    return;
  }
  if (isSignup && accountType === "company") {
    toast(
      "Pendaftaran perusahaan melalui Google belum tersedia karena dokumen NIB, NPWP, dan legal harus diverifikasi. Daftar dengan email dan kata sandi.",
    );
    return;
  }
  if (
    isSignup &&
    accountType === "marketplace" &&
    (!$("#registrationMarketplaceCity")?.value.trim() ||
      !$("#registrationMarketplaceIntent")?.value)
  ) {
    toast(
      "Isi kota domisili dan kebutuhan JobHub Rantau sebelum melanjutkan dengan Google.",
    );
    return;
  }
  const redirectUrl = new URL(window.location.href);
  redirectUrl.search = "";
  redirectUrl.hash = "";
  if (accountType)
    localStorage.setItem("jobhub-google-account-intent", accountType);
  else localStorage.removeItem("jobhub-google-account-intent");
  localStorage.setItem("jobhub-google-signup", String(isSignup));
  if (isSignup) {
    try {
      localStorage.setItem(
        "jobhub-google-address-data",
        JSON.stringify(window.JobHubAddress?.getValue() || {}),
      );
      localStorage.setItem(
        "jobhub-google-signup-profile",
        JSON.stringify({
          full_name: $("#registrationName")?.value.trim() || "",
          whatsapp: $("#registrationWhatsapp")?.value.trim() || "",
          marketplace_city:
            $("#registrationMarketplaceCity")?.value.trim() || "",
          marketplace_intent: $("#registrationMarketplaceIntent")?.value || "",
          gender: $("#registrationGender")?.value || "",
          birthDate: $("#registrationBirthDate")?.value || "",
          maritalStatus: $("#registrationMaritalStatus")?.value || "",
          religion: $("#registrationReligion")?.value || "",
          nationality: $("#registrationNationality")?.value || "Indonesia",
          nationalityOther: $("#registrationNationalityOther")?.value || "",
        }),
      );
    } catch (error) {
      toast(
        `Data profil belum dapat disimpan untuk pendaftaran Google: ${error.message || "periksa penyimpanan browser."}`,
      );
      return;
    }
  } else {
    localStorage.removeItem("jobhub-google-address-data");
    localStorage.removeItem("jobhub-google-signup-profile");
  }
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) throw error;
  } catch (error) {
    localStorage.removeItem("jobhub-google-account-intent");
    localStorage.removeItem("jobhub-google-signup");
    localStorage.removeItem("jobhub-google-address-data");
    localStorage.removeItem("jobhub-google-signup-profile");
    toast(
      `Login Google gagal: ${error.message || "periksa konfigurasi Google OAuth di Supabase."}`,
    );
  }
}
function openCandidateLoginAfterSignup(email, requiresConfirmation) {
  openAuthModal(false);
  $("#authEmail").value = email;
  const notice = document.createElement("p");
  notice.className = "form-note";
  notice.textContent = requiresConfirmation
    ? "Akun kandidat sudah dibuat. Konfirmasi email terlebih dahulu, lalu masuk dengan email dan kata sandi. Periksa juga Spam."
    : "Akun kandidat sudah dibuat. Masukkan kata sandi lalu klik Masuk.";
  $("#authForm .auth-modal-fields")?.prepend(notice);
}
function openAuthModal(isSignup) {
  ensureSupabaseClient();
  const accountTypeField = isSignup
    ? `<div class="form-row"><label for="accountType">Jenis akun</label><select id="accountType" name="accountType" required><option value="">Pilih jenis akun</option><option value="candidate">Saya Pencari Kerja</option><option value="company">Saya Perusahaan / HRD</option><option value="marketplace">Saya Pengguna JobHub Rantau</option></select><small class="form-note">Gunakan JobHub Rantau untuk mencari atau menawarkan kos dan kontrakan.</small></div>`
    : "";
  const companyRegistrationFields = isSignup
    ? `<section class="company-registration-fields" id="companyRegistrationFields" aria-labelledby="companyRegistrationDocumentsTitle" hidden><h3 id="companyRegistrationDocumentsTitle">Informasi dan verifikasi perusahaan</h3><div class="company-form-grid"><div class="form-row"><label for="registrationIndustry">Bidang usaha</label><input id="registrationIndustry" name="companyIndustry" maxlength="120" placeholder="Contoh: Teknologi informasi"></div><div class="form-row"><label for="registrationCompanyType">Jenis perusahaan</label><select id="registrationCompanyType" name="companyType"><option value="">Pilih jenis perusahaan</option><option>Perusahaan publik</option><option>Perusahaan swasta</option><option>BUMN</option><option>Startup</option><option>Organisasi nirlaba</option><option>Instansi pemerintah</option><option>Kepemilikan perseorangan</option><option>Lainnya</option></select></div><div class="form-row"><label for="registrationCompanySize">Jumlah karyawan</label><select id="registrationCompanySize" name="companySize"><option value="">Pilih rentang</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option><option>501-1.000</option><option>1.001-5.000</option><option>5.001-10.000</option><option>10.001+</option></select></div><div class="form-row"><label for="registrationFoundedYear">Tahun berdiri</label><input id="registrationFoundedYear" name="foundedYear" type="number" min="1800" max="${new Date().getFullYear()}"></div><div class="form-row"><label for="registrationWebsite">Situs web</label><input id="registrationWebsite" name="website" type="url" maxlength="300" placeholder="https://perusahaan.co.id"></div><div class="form-row"><label for="registrationLinkedin">LinkedIn perusahaan</label><input id="registrationLinkedin" name="linkedinUrl" type="url" maxlength="300" placeholder="https://www.linkedin.com/company/..."></div></div><h4>Dokumen verifikasi perusahaan</h4><p class="form-note">Dokumen dikirim secara privat untuk ditinjau admin dan tidak ditampilkan ke pencari kerja. Format PDF, JPG, atau PNG; maksimal 5 MB per berkas.${supabaseClient ? " Jika konfirmasi email diwajibkan, berkas tersimpan sementara di browser ini dan otomatis dikirim setelah Anda masuk kembali dari browser yang sama." : ""}</p>${COMPANY_DOCUMENT_TYPES.map(([type, label]) => `<div class="form-row"><label for="registration-${type}">${label} <span aria-hidden="true">*</span></label><input id="registration-${type}" name="${type}" type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><small class="form-note">Wajib diisi · PDF, JPG, atau PNG · maksimal 5 MB</small></div>`).join("")}</section>`
    : "";
  const signupFields = isSignup
    ? `<div class="form-row"><label for="registrationName" id="registrationNameLabel">Nama lengkap</label><input id="registrationName" name="fullName" autocomplete="name" maxlength="120" required></div><div class="form-row"><label for="registrationWhatsapp">Nomor WhatsApp</label><input id="registrationWhatsapp" name="whatsapp" type="tel" autocomplete="tel" inputmode="tel" pattern="[+0-9() .-]{8,20}" required placeholder="+62 812 3456 7890"><small class="form-note">Gunakan nomor aktif agar perusahaan dapat menghubungi Anda.</small></div><div class="candidate-registration-personal-data" id="candidateRegistrationPersonalData" hidden><div class="form-row"><label for="registrationGender">Jenis kelamin</label><select id="registrationGender" name="gender"><option value="">Pilih jenis kelamin</option><option>Laki-laki</option><option>Perempuan</option></select></div><div class="form-row"><label for="registrationBirthDate">Tanggal lahir</label><input id="registrationBirthDate" name="birthDate" type="date"></div><div class="form-row"><label for="registrationMaritalStatus">Status pernikahan</label><select id="registrationMaritalStatus" name="maritalStatus"><option value="">Pilih status</option><option>Belum Menikah</option><option>Menikah</option><option>Cerai Hidup</option><option>Cerai Mati</option></select></div><div class="form-row"><label for="registrationReligion">Agama (opsional)</label><select id="registrationReligion" name="religion"><option value="">Pilih agama</option><option>Islam</option><option>Kristen</option><option>Katolik</option><option>Hindu</option><option>Buddha</option><option>Konghucu</option><option>Kepercayaan Terhadap Tuhan Yang Maha Esa</option></select></div><div class="form-row"><label for="registrationNationality">Kewarganegaraan</label><select id="registrationNationality" name="nationality"><option selected>Indonesia</option><option>Australia</option><option>Brunei Darussalam</option><option>Filipina</option><option>India</option><option>Jepang</option><option>Malaysia</option><option>Singapura</option><option>Thailand</option><option>Timor-Leste</option><option>Tiongkok</option><option>United Kingdom</option><option>United States</option><option>Vietnam</option><option>Lainnya</option></select></div></div><div class="form-row"><strong>Alamat (opsional)</strong><div class="form-note">Pilih wilayah bertingkat; detail alamat dapat dilengkapi nanti.</div></div><div class="registration-address-container" id="registrationAddressForm"></div>`
    : "";
  const passwordFields = `<div class="form-row"><label for="authPassword">Kata sandi</label><input id="authPassword" name="password" type="password" minlength="8" required autocomplete="${isSignup ? "new-password" : "current-password"}" placeholder="Minimal 8 karakter"></div>${isSignup ? '<div class="form-row"><label for="authPasswordConfirm">Konfirmasi kata sandi</label><input id="authPasswordConfirm" name="confirmPassword" type="password" minlength="8" required autocomplete="new-password" placeholder="Ulangi kata sandi"></div>' : ""}`;
  const terms = isSignup
    ? '<label class="auth-terms"><input name="terms" type="checkbox" required><span>Saya menyetujui Syarat &amp; Ketentuan.</span></label>'
    : "";
  openModal(
    isSignup ? "Buat akun JobHub" : "Masuk ke JobHub",
    `<form id="authForm" novalidate>${accountTypeField}${signupFields}<div class="form-row"><label for="authEmail">${isSignup ? "Email" : "Email"}</label><input id="authEmail" name="email" type="email" required autocomplete="email" maxlength="254" placeholder="nama@email.com"></div>${passwordFields}${terms}<p class="auth-validation-message" id="authValidationMessage" role="alert" hidden></p><button class="btn auth-submit-button" type="submit">${isSignup ? "Buat akun" : "Masuk"}</button>${isSignup ? "" : '<button class="text-link auth-resend-confirmation" id="resendSignupConfirmation" type="button">Kirim ulang email verifikasi</button>'}<div class="auth-divider"><span>atau</span></div><button class="btn btn-outline google-auth-button" id="googleAuthButton" type="button"><svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.66 5.94c4.47-4.13 7.11-10.2 7.11-17.59z"/><path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 0 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.86l-7.66-5.94c-2.13 1.43-4.87 2.28-8.24 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"/></svg>Lanjutkan dengan Google</button><p class="form-note auth-provider-note">${supabaseClient ? "Akun Anda disimpan dengan aman melalui Supabase Authentication." : supabaseUnavailableMessage()}</p></form>`,
    async (data) => {
      const email = String(data.get("email") || "")
        .trim()
        .toLowerCase();
      const password = String(data.get("password") || "");
      const accountType = isSignup ? String(data.get("accountType") || "") : "";
      if (!ensureSupabaseClient())
        throw new Error(supabaseUnavailableMessage());
      if (isSignup) {
        if (!["candidate", "company", "marketplace"].includes(accountType))
          throw new Error("Pilih jenis akun terlebih dahulu.");
        if (password !== String(data.get("confirmPassword") || ""))
          throw new Error("Konfirmasi kata sandi tidak sama.");
        if (!data.get("terms"))
          throw new Error("Setujui Syarat & Ketentuan untuk membuat akun.");
      }
      const fullName = String(data.get("fullName") || "").trim();
      const whatsapp = String(data.get("whatsapp") || "").trim();
      const marketplaceProfile =
        isSignup && accountType === "marketplace"
          ? {
              full_name: fullName,
              whatsapp,
              city: String(data.get("marketplaceCity") || "").trim(),
              intent: String(data.get("marketplaceIntent") || "renter"),
            }
          : null;
      const addressData = isSignup
        ? window.JobHubAddress?.getValue() || {}
        : {};
      const candidateDetails = isSignup
        ? {
            gender: String(data.get("gender") || ""),
            birthDate: String(data.get("birthDate") || ""),
            maritalStatus: String(data.get("maritalStatus") || ""),
            religion: String(data.get("religion") || ""),
            nationality: String(data.get("nationality") || "Indonesia"),
            nationalityOther: String(data.get("nationalityOther") || ""),
          }
        : {};
      const emailRedirectUrl = new URL(window.location.href);
      emailRedirectUrl.search = "";
      emailRedirectUrl.hash = "";
      if (isSignup) {
        const metadata = {
          account_type: accountType,
          account_types: [accountType],
          full_name: fullName,
          whatsapp,
          ...(accountType === "candidate"
            ? { ...candidateDetails, address_data: addressData }
            : {}),
          ...(accountType === "company"
            ? {
                company_name: fullName,
                company_profile: { hr_contact: whatsapp },
              }
            : {}),
          ...(accountType === "marketplace"
            ? { marketplace_profile: marketplaceProfile }
            : {}),
        };
        const { data: signupData, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: emailRedirectUrl.toString(),
            data: metadata,
          },
        });
        if (error) {
          if (/already registered|already exists/i.test(error.message || ""))
            throw new Error(
              "Email ini sudah memiliki akun dengan satu role. Gunakan email baru untuk mendaftarkan role kandidat, perusahaan/HRD, atau JobHub Rantau lainnya.",
            );
          throw error;
        }
        if (!signupData.user?.id)
          throw new Error(
            "Akun belum berhasil dibuat. Periksa data lalu coba lagi.",
          );
        if (accountType === "company" && signupData.session) {
          await supabaseClient.auth.signOut();
          throw new Error(
            "Supabase langsung membuat sesi tanpa meminta konfirmasi email. Aktifkan Confirm email di pengaturan Authentication Supabase dan pastikan template Confirm signup memakai {{ .ConfirmationURL }}.",
          );
        }
        localStorage.setItem("jobhub-account-intent", accountType);
        if (!signupData.session) {
          localStorage.setItem(
            pendingSignupConfirmationKey,
            JSON.stringify({ userId: signupData.user.id, accountType, email }),
          );
        }
        if (accountType === "candidate") {
          sessionStorage.setItem(
            "jobhub-candidate-profile-draft",
            JSON.stringify({
              fullName,
              whatsapp,
              email,
              ...candidateDetails,
              ...addressData,
              province: addressData.provinceName || "",
              city: addressData.regencyName || "",
              district: addressData.districtName || "",
              village: addressData.villageName || "",
            }),
          );
        }
        closeModal();
        if (accountType === "candidate") {
          const requiresConfirmation = !signupData.session;
          if (signupData.session) {
            const { error: signOutError } = await supabaseClient.auth.signOut();
            if (signOutError) throw signOutError;
          }
          openCandidateLoginAfterSignup(email, requiresConfirmation);
          return;
        }
        if (!signupData.session) {
          openEmailVerificationModal(email, accountType);
          return;
        }
        supabaseSession = signupData.session;
        renderAccountMenu();
        toast(
          accountType === "company"
            ? "Akun perusahaan dibuat. Lengkapi profil dan verifikasi dari dashboard."
            : "Akun berhasil dibuat.",
        );
        redirectAuthenticatedUser(signupData.session);
        return;
      }
      const { data: loginData, error } =
        await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        if (
          error.code === "email_not_confirmed" ||
          /email not confirmed/i.test(error.message || "")
        ) {
          throw new Error(
            "Email belum dikonfirmasi. Konfirmasi hanya diperlukan satu kali saat pendaftaran; setelah itu masuk dengan email dan kata sandi.",
          );
        }
        throw error;
      }
      const session = loginData.session;
      if (!session?.user)
        throw new Error(
          "Login belum selesai. Periksa verifikasi email dan coba lagi.",
        );
      if (ADMIN_EMAIL_ALLOWLIST.has(email) && !isAdminSession(session)) {
        await supabaseClient.auth.signOut();
        throw new Error(
          "Email admin sudah diizinkan, tetapi role admin Supabase belum aktif. Jalankan supabase/admin-email-role.sql, lalu masuk kembali.",
        );
      }
      const actualType = accountTypeForSession(session);
      if (
        !["candidate", "company", "marketplace"].includes(actualType) &&
        !isAdminSession(session)
      ) {
        await supabaseClient.auth.signOut();
        throw new Error(
          "Jenis akun belum disiapkan. Daftar ulang atau hubungi administrator.",
        );
      }
      if (actualType) localStorage.setItem("jobhub-account-intent", actualType);
      closeModal();
      toast("Berhasil masuk.");
      redirectAuthenticatedUser(session);
    },
  );
  const form = $("#authForm");
  decorateAuthModal(form, isSignup);
  addPasswordVisibilityControls(form);
  if (isSignup) {
    const marketplaceFields = document.createElement("section");
    marketplaceFields.className = "rantau-registration-fields";
    marketplaceFields.id = "marketplaceRegistrationFields";
    marketplaceFields.hidden = true;
    marketplaceFields.innerHTML =
      '<div class="form-row"><label for="registrationMarketplaceCity">Kota domisili</label><input id="registrationMarketplaceCity" name="marketplaceCity" maxlength="120" placeholder="Contoh: Bandung"></div><div class="form-row"><label for="registrationMarketplaceIntent">Saya menggunakan JobHub Rantau untuk</label><select id="registrationMarketplaceIntent" name="marketplaceIntent"><option value="">Pilih kebutuhan</option><option value="renter">Mencari kos atau kontrakan</option><option value="owner">Menawarkan kos atau kontrakan</option></select></div>';
    $("#authEmail")?.closest(".form-row")?.before(marketplaceFields);
  }
  const accountType = $("#accountType");
  const nameLabel = $("#registrationNameLabel");
  const nameInput = $("#registrationName");
  $("#registrationWhatsapp")?.setAttribute(
    "pattern",
    "[0-9+\\s.\\(\\)\\-]{8,20}",
  );
  const password = $("#authPassword");
  const confirmPassword = $("#authPasswordConfirm");
  const registrationNationality = $("#registrationNationality");
  if (registrationNationality)
    registrationNationality
      .closest(".form-row")
      .insertAdjacentHTML(
        "afterend",
        '<div class="form-row" id="registrationNationalityOtherWrap" hidden><label for="registrationNationalityOther">Sebutkan kewarganegaraan</label><input id="registrationNationalityOther" name="nationalityOther" maxlength="80"></div>',
      );
  const validate = () => {
    if (confirmPassword)
      confirmPassword.setCustomValidity(
        confirmPassword.value && confirmPassword.value !== password.value
          ? "Konfirmasi kata sandi tidak sama."
          : "",
      );
    if (accountType && nameLabel && nameInput) {
      const company = accountType.value === "company";
      const marketplace = accountType.value === "marketplace";
      nameLabel.textContent = company ? "Nama perusahaan" : "Nama lengkap";
      nameInput.placeholder = company
        ? "Nama resmi perusahaan"
        : "Nama lengkap Anda";
      $("#candidateRegistrationPersonalData").hidden =
        company || accountType.value !== "candidate";
      const companyFields = $("#companyRegistrationFields");
      if (companyFields) companyFields.hidden = !company;
      const marketplaceFields = $("#marketplaceRegistrationFields");
      const marketplaceCity = $("#registrationMarketplaceCity");
      const marketplaceIntent = $("#registrationMarketplaceIntent");
      if (marketplaceFields) marketplaceFields.hidden = !marketplace;
      if (marketplaceCity) marketplaceCity.required = marketplace;
      if (marketplaceIntent) marketplaceIntent.required = marketplace;
      const addressForm = $("#registrationAddressForm");
      if (addressForm) {
        const addressHidden = company || accountType.value === "marketplace";
        addressForm.hidden = addressHidden;
        if (addressForm.previousElementSibling)
          addressForm.previousElementSibling.hidden = addressHidden;
      }
    }
    const nationalityOther = $("#registrationNationalityOtherWrap");
    if (nationalityOther)
      nationalityOther.hidden = registrationNationality?.value !== "Lainnya";
    const message = $("#authValidationMessage");
    if (message && form.dataset.submitted === "true") {
      const invalid = form.querySelector(":invalid");
      message.hidden = !invalid;
      message.textContent = invalid?.validationMessage || "";
    }
  };
  form.addEventListener("input", validate);
  form.addEventListener("change", (event) => {
    validate();
  });
  if (confirmPassword) confirmPassword.addEventListener("input", validate);
  if (accountType) accountType.addEventListener("change", validate);
  form.addEventListener(
    "submit",
    (event) => {
      form.dataset.submitted = "true";
      validate();
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const invalid = form.querySelector(":invalid");
        invalid?.reportValidity();
      }
    },
    { capture: true },
  );
  $("#googleAuthButton").addEventListener("click", () =>
    startGoogleOAuth(isSignup),
  );
  const resendConfirmation = $("#resendSignupConfirmation");
  if (resendConfirmation) {
    const resendStatus = document.createElement("p");
    resendStatus.className = "auth-email-resend-status";
    resendStatus.id = "loginResendStatus";
    resendStatus.setAttribute("role", "status");
    resendStatus.setAttribute("aria-live", "polite");
    resendConfirmation.after(resendStatus);
    const originalLabel = resendConfirmation.textContent.trim();
    resendConfirmation.dataset.originalLabel = originalLabel;
    resendConfirmation.addEventListener("click", async () => {
      const emailInput = $("#authEmail");
      const email = String(emailInput?.value || "")
        .trim()
        .toLowerCase();
      if (!emailInput?.checkValidity()) {
        emailInput?.reportValidity();
        return;
      }
      await requestAuthEmailResend(email, resendConfirmation, resendStatus);
    });
    const currentEmail = String($("#authEmail")?.value || "")
      .trim()
      .toLowerCase();
    if (currentEmail)
      updateAuthResendCountdown(
        resendConfirmation,
        currentEmail,
        resendStatus,
        originalLabel,
      );
  }
  if (isSignup && window.JobHubAddress)
    window.JobHubAddress.mount($("#registrationAddressForm"));
}
function extractCvSections(text) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const headingPattern =
    /^(summary|profile|objective|about me|ringkasan|profil|tujuan|skills?|technical skills|keahlian|kompetensi|education|pendidikan|academic background|pengalaman|experience|professional experience|work experience|work history|employment history|riwayat kerja|certifications?|sertifikasi|projects?|proyek|contact|kontak)\b/i;
  const sections = {};
  let current = "";
  lines.forEach((line) => {
    const key = line.toLowerCase().replace(/[:\s]+$/, "");
    if (headingPattern.test(line) && line.length < 50) {
      current = key;
      sections[current] = sections[current] || [];
    } else if (current) {
      sections[current].push(line);
    }
  });
  return { lines, sections };
}
function extractCandidateName(lines, fallback) {
  const labeled = lines
    .join("\n")
    .match(
      /(?:full\s+name|candidate\s+name|nama\s+lengkap|nama)\s*[:\-]\s*([^\n|]{2,70})/i,
    );
  if (labeled) return labeled[1].trim();
  const excluded =
    /@|https?:|www\.|resume|curriculum vitae|curriculum|linkedin|github|phone|telepon|alamat|contact|kontak|\+?\d[\d\s().-]{7,}/i;
  const candidate = lines
    .slice(0, 12)
    .find(
      (line) =>
        line.length >= 3 &&
        line.length <= 55 &&
        !excluded.test(line) &&
        !/^([A-Z\s.]+:|curriculum|resume|cv\b|summary\b|profile\b|skills?\b|education\b|experience\b|keahlian\b|pendidikan\b|pengalaman\b)/i.test(
          line,
        ),
    );
  return candidate || fallback || "Tidak terdeteksi dari CV";
}
function extractCandidateSkills(sections, text, application) {
  const knownSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "Java",
    "PHP",
    "Laravel",
    "SQL",
    "PostgreSQL",
    "MySQL",
    "HTML",
    "CSS",
    "Figma",
    "UI/UX",
    "Machine Learning",
    "Data Analysis",
    "Excel",
    "Power BI",
    "Project Management",
    "Agile",
    "Scrum",
    "Communication",
    "Leadership",
    "Public Speaking",
    "Marketing",
    "SEO",
    "Copywriting",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "AutoCAD",
    "AWS",
    "Docker",
    "Git",
  ];
  const skillSection = Object.entries(sections)
    .filter(([heading]) => /skill|keahlian|kompetensi/.test(heading))
    .flatMap(([, items]) => items)
    .join(" ");
  const source = `${skillSection} ${text}`;
  const detected = knownSkills.filter((skill) =>
    new RegExp(
      `(^|[^a-z0-9+#])${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9+#])`,
      "i",
    ).test(source),
  );
  const explicit = skillSection
    .split(/[,;|•·\n]/)
    .map((skill) => skill.replace(/^[-*]\s*/, "").trim())
    .filter((skill) => skill.length > 1 && skill.length < 40);
  return [
    ...new Set([...explicit, ...detected, ...(application.skills || [])]),
  ].slice(0, 18);
}
function extractCandidateEducation(lines, sections, application) {
  const educationLines = Object.entries(sections)
    .filter(([heading]) => /education|pendidikan|academic/.test(heading))
    .flatMap(([, items]) => items);
  const matches = lines.filter((line) =>
    /\b(SMA|SMK|D[1-4]|S[1-3]|sarjana|diploma|magister|doktor|bachelor|master|ph\.?d|universit(?:y|as)|institute|institut|college|politeknik)\b/i.test(
      line,
    ),
  );
  const result = [...new Set([...educationLines, ...matches])].slice(0, 5);
  return result.length
    ? result
    : [application.education || "Tidak terdeteksi dari CV"];
}
function extractCandidateExperience(lines, sections, application) {
  const experienceLines = Object.entries(sections)
    .filter(([heading]) =>
      /experience|pengalaman|employment|work history|riwayat kerja/.test(
        heading,
      ),
    )
    .flatMap(([, items]) => items);
  const dateLines = lines.filter((line) =>
    /\b(19|20)\d{2}\b|present|sekarang|current|hingga kini/i.test(line),
  );
  const result = [...new Set([...experienceLines, ...dateLines])].slice(0, 6);
  if (application.experienceYears)
    result.push(
      `${application.experienceYears} tahun pengalaman (dari profil kandidat)`,
    );
  return result.length ? result : ["Tidak terdeteksi dari CV"];
}
function buildCandidateSummary(profile) {
  const skills = profile.skills.length
    ? profile.skills.slice(0, 6).join(", ")
    : "belum terdeteksi";
  const education = profile.education[0] || "belum terdeteksi";
  const experience =
    profile.experience.filter((item) =>
      /\d+\s*tahun pengalaman \(dari profil/i.test(item),
    )[0] ||
    profile.experience[0] ||
    "belum terdeteksi";
  return `${profile.name} memiliki latar pendidikan ${education}. Skill yang teridentifikasi: ${skills}. Pengalaman: ${experience}. Periksa kembali informasi ini dengan membaca CV lengkap sebelum mengambil keputusan.`;
}
async function analyzeCvFile(file, application) {
  if (!window.pdfjsLib?.getDocument)
    throw new Error(
      "PDF.js tidak berhasil dimuat. Periksa koneksi internet lalu coba lagi.",
    );
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
  const document = await window.pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise;
  const pageTexts = [];
  for (
    let pageNumber = 1;
    pageNumber <= Math.min(document.numPages, 40);
    pageNumber++
  ) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pageTexts.push(
      content.items
        .map((item) => `${item.str}${item.hasEOL ? "\n" : " "}`)
        .join(" "),
    );
  }
  const text = pageTexts
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
  if (!text)
    throw new Error(
      "Teks tidak ditemukan. CV mungkin hasil scan; gunakan PDF yang memiliki teks atau OCR terlebih dahulu.",
    );
  const { lines, sections } = extractCvSections(text);
  const profile = {
    name: extractCandidateName(lines, application.candidateName),
    skills: extractCandidateSkills(sections, text, application),
    education: extractCandidateEducation(lines, sections, application),
    experience: extractCandidateExperience(lines, sections, application),
    pageCount: document.numPages,
    truncated: document.numPages > 40,
  };
  return profile;
}
function renderCandidateAnalysis(application, profile, fileName) {
  const list = (items) =>
    items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  $("#cvAnalysisContent").innerHTML =
    `<div class="cv-analysis-file"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i><span>${escapeHtml(fileName)}</span><a href="${activeCvObjectUrl}" target="_blank" rel="noopener">Buka PDF</a></div>
    <section class="ai-summary-card"><span class="eyebrow">AI Candidate Summary</span><p>${escapeHtml(buildCandidateSummary(profile))}</p><small>Ringkasan otomatis lokal dari teks PDF; bukan penilaian AI eksternal. Verifikasi informasi terhadap CV lengkap.</small></section>
    <div class="cv-extracted-grid">
      <section class="cv-extracted-item"><h3>Nama</h3><p>${escapeHtml(profile.name)}</p></section>
      <section class="cv-extracted-item"><h3>Pendidikan</h3><ul>${list(profile.education)}</ul></section>
      <section class="cv-extracted-item"><h3>Pengalaman</h3><ul>${list(profile.experience)}</ul></section>
      <section class="cv-extracted-item"><h3>Skill</h3>${profile.skills.length ? `<div class="skill-list">${profile.skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>` : "<p>Tidak terdeteksi dari CV</p>"}</section>
    </div>${profile.truncated ? '<p class="form-note">Analisis dibatasi hingga 40 halaman pertama.</p>' : ""}
    <p class="cv-privacy-note">CV diproses di browser ini dan disimpan secara lokal pada perangkat ini.</p>`;
}
async function openCandidateCv(applicationId) {
  if (!requirePlanFeature("cvAnalyzer", "CV Analyzer")) return;
  const application = getApplications().find(
    (item) => item.id === applicationId,
  );
  if (!application) {
    toast("Data lamaran kandidat tidak ditemukan.");
    return;
  }
  openModal(
    "CV Analyzer",
    `<div class="cv-analyzer"><p class="form-note">Kandidat: <strong>${escapeHtml(application.candidateName || "Kandidat")}</strong></p><div id="cvAnalysisContent" aria-live="polite"><p class="form-note" id="cvAnalysisStatus">Memuat CV...</p></div><div class="form-row cv-upload-picker"><label for="cvAnalyzerUpload">Pilih atau ganti CV kandidat (PDF, maksimal 5 MB)</label><input id="cvAnalyzerUpload" type="file" accept="application/pdf,.pdf"></div></div>`,
  );
  const runAnalysis = async (file) => {
    const content = $("#cvAnalysisContent");
    content.innerHTML =
      '<p class="form-note">Membaca dan menganalisis CV...</p>';
    try {
      let fileName = file?.name || "";
      if (!file) {
        const saved = await getCvFile(application.cvFileId);
        if (saved) {
          file = saved.blob;
          fileName = saved.name;
        } else if (supabaseClient) {
          const access = await requestCandidateCv("", application.id);
          const response = await fetch(access.signedUrl);
          if (!response.ok) throw new Error("CV kandidat tidak dapat diunduh.");
          file = new File(
            [await response.blob()],
            application.cvId || "CV-kandidat.pdf",
            { type: "application/pdf" },
          );
          fileName = file.name;
        } else
          throw new Error(
            application.cvFileId
              ? "File CV tidak ditemukan di perangkat ini. Unggah ulang CV kandidat untuk menganalisisnya."
              : "Kandidat belum melampirkan file PDF. Unggah CV kandidat untuk memulai analisis.",
          );
      } else {
        if (
          file.type !== "application/pdf" &&
          !file.name.toLowerCase().endsWith(".pdf")
        )
          throw new Error("File CV harus berformat PDF.");
        if (file.size > 5 * 1024 * 1024)
          throw new Error("Ukuran CV maksimal 5 MB.");
        application.cvFileId = await saveCvFile(file);
        application.cvId = file.name;
        saveCvAttachment(application.id, application.cvFileId);
        fileName = file.name;
        const applications = getApplications();
        const index = applications.findIndex(
          (item) => item.id === application.id,
        );
        if (index >= 0) applications[index] = application;
        saveApplications(applications);
        if (isHrdSession()) syncApplicationToSupabase(application);
      }
      const profile = await analyzeCvFile(file, application);
      if (activeCvObjectUrl) URL.revokeObjectURL(activeCvObjectUrl);
      activeCvObjectUrl = URL.createObjectURL(file);
      renderCandidateAnalysis(application, profile, fileName);
    } catch (error) {
      content.innerHTML = `<p class="cv-analysis-error" role="alert">${escapeHtml(error.message || "CV tidak dapat dianalisis.")}</p>`;
    }
  };
  $("#cvAnalyzerUpload").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) runAnalysis(file);
  });
  runAnalysis();
}
async function openApplicationCvLink(applicationId, button) {
  if (!supabaseClient || !isHrdSession())
    return toast("Masuk sebagai HRD untuk mengakses CV kandidat.");
  button.disabled = true;
  const tab = window.open("about:blank", "_blank");
  if (tab) tab.opener = null;
  try {
    const access = await requestCandidateCv("", applicationId);
    if (!tab) throw new Error("Izinkan pop-up untuk membuka CV privat.");
    tab.location.replace(access.signedUrl);
  } catch (error) {
    tab?.close();
    toast(
      `CV tidak dapat diakses: ${error.message || "periksa hak akses perusahaan."}`,
    );
  } finally {
    if (button.isConnected) button.disabled = false;
  }
}
async function openApply(id) {
  const job = jobs.find((j) => j.id === id) || currentJob;
  if (!job) {
    toast("Lowongan tidak tersedia.");
    return;
  }
  if (!supabaseSession) {
    pendingAuthRoute = "candidate";
    toast("Masuk sebagai pencari kerja sebelum melamar.");
    localStorage.setItem("jobhub-account-intent", "candidate");
    openAuthModal(false);
    return;
  }
  if (!isCandidateSession()) {
    toast("Lamaran hanya tersedia untuk akun pencari kerja.");
    return;
  }
  const completion = await getCandidateProfileCompletion();
  if (!completion.complete || !completion.profile?.is_published) {
    toast(
      "Lengkapi foto, tentang saya, pendidikan, skill, pengalaman atau status Fresh Graduate, dan CV sebelum melamar.",
    );
    go("candidate-create-profile");
    return;
  }
  const cv = localStorage.getItem("jobhub-cv-name");
  activeCanvaApplyJobId = id;
  const cvFileId = localStorage.getItem("jobhub-cv-file-id") || "";
  const questions = job.screeningEnabled ? job.screeningQuestions || [] : [];
  const questionsHtml = questions.length
    ? questions
        .map((question, index) => {
          const required = question.required !== false;
          const label = `<label>${index + 1}. ${escapeHtml(question.prompt)}${required ? " (wajib)" : " (opsional)"}</label>`;
          const requiredAttribute = required ? "required" : "";
          if (
            question.type === "multiple_choice" ||
            question.type === "dropdown"
          )
            return `<div class="form-row">${label}<select name="answer-${question.id}" ${requiredAttribute}><option value="">Pilih jawaban</option>${(question.options || []).map((option) => `<option>${escapeHtml(option)}</option>`).join("")}</select></div>`;
          if (question.type === "yes_no")
            return `<div class="form-row">${label}<select name="answer-${question.id}" ${requiredAttribute}><option value="">Pilih jawaban</option><option>Ya</option><option>Tidak</option></select></div>`;
          if (question.type === "number")
            return `<div class="form-row">${label}<input name="answer-${question.id}" type="number" ${requiredAttribute}></div>`;
          if (question.type === "long_answer")
            return `<div class="form-row">${label}<textarea name="answer-${question.id}" ${requiredAttribute} placeholder="Tulis jawaban"></textarea></div>`;
          return `<div class="form-row">${label}<input name="answer-${question.id}" ${requiredAttribute} placeholder="Tulis jawaban singkat"></div>`;
        })
        .join("")
    : '<p class="form-note">Pertanyaan screening tidak diwajibkan untuk lowongan ini.</p>';
  const publishedProfile =
    typeof getCurrentCandidateProfile === "function"
      ? getCurrentCandidateProfile()
      : null;
  const profileSkills =
    publishedProfile?.skills ||
    publishedProfile?.publicData?.skills ||
    $$("#candidateView .skill-list span")
      .map((item) => item.textContent.trim())
      .filter(Boolean);
  const requiredSkills = [
    ...new Map(
      (job.skills || [])
        .map((skill) => [
          String(skill).trim().toLowerCase(),
          String(skill).trim(),
        ])
        .filter(([key, value]) => key && value),
    ).values(),
  ];
  const applicationSkillOptions = requiredSkills.length
    ? requiredSkills
    : profileSkills;
  const profileSkillNames = new Set(
    profileSkills.map((skill) => skill.toLowerCase()),
  );
  const skillsHtml = applicationSkillOptions.length
    ? `<div class="application-skill-options">${applicationSkillOptions.map((skill) => `<label class="application-skill-option"><input type="checkbox" name="candidateSkills" value="${escapeHtml(skill)}" ${profileSkillNames.has(skill.toLowerCase()) ? "checked" : ""}><span>${escapeHtml(skill)}</span></label>`).join("")}</div><small class="form-note">${requiredSkills.length ? "Pilih skill dari lowongan yang benar-benar Anda kuasai. Skill profil yang cocok sudah dipilih otomatis." : "Lowongan belum mencantumkan skill khusus. Pilih skill profil yang relevan dengan posisi ini."}</small>`
    : '<p class="form-note">Belum ada skill pada profil atau lowongan ini.</p>';
  const salaryCeiling = getJobSalaryCeiling(job);
  const educationOptions = [
    "Tidak bersekolah",
    "SD",
    "SMP",
    "SMK",
    "SMA",
    "D3",
    "S1",
    "S2",
    "S3",
  ];
  const profileEducation =
    publishedProfile?.education_level ||
    publishedProfile?.publicData?.education?.filter((item) => item.level).at(-1)
      ?.level ||
    "Tidak bersekolah";
  const educationOptionsHtml = educationOptions
    .map(
      (level) =>
        `<option ${level === profileEducation ? "selected" : ""}>${level}</option>`,
    )
    .join("");
  const profileExperience = Number(publishedProfile?.experience_years) || 0;
  openModal(
    "Kirim lamaran",
    `<form><p class="form-note">Lamaran untuk <strong>${escapeHtml(job.title)}</strong> di ${escapeHtml(job.company)}.</p><p class="form-note">CV dan dokumen tambahan tidak wajib dilampirkan untuk mengirim lamaran. Pesan perkenalan akan menjadi awal percakapan dengan HRD.</p><div class="form-row"><label>CV (opsional)</label><select name="cvFileId"><option value="">Tidak melampirkan CV</option>${cvFileId ? `<option value="${escapeHtml(cvFileId)}" selected>${escapeHtml(cv || "CV tersimpan")}</option>` : ""}</select><small class="form-note">Kamu dapat memilih CV tersimpan atau mengunggah PDF jika tersedia.</small><input name="cvUpload" type="file" accept="application/pdf,.pdf"></div><div class="form-row"><label>Pengalaman kerja (tahun, opsional)</label><input name="candidateExperience" type="number" min="0" value="${profileExperience}"></div><div class="form-row"><label>Pendidikan terakhir (opsional)</label><select name="candidateEducation">${educationOptionsHtml}</select></div><div class="form-row"><label>Skill relevan dengan lowongan (opsional)</label>${skillsHtml}</div><div class="screening-form"><h3>Pertanyaan screening</h3>${questionsHtml}</div><div class="form-row"><label>Gaji yang dibutuhkan per bulan (Rp)</label><input name="expectedSalary" type="number" min="1" step="1" required placeholder="${salaryCeiling ? escapeHtml(String(salaryCeiling)) : "Contoh: 7000000"}"><small class="form-note">${salaryCeiling ? `Batas gaji lowongan: ${escapeHtml(formatRupiah(salaryCeiling))}. Ekspektasi tidak boleh melebihi batas ini.` : "Gaji lowongan belum ditentukan; masukkan ekspektasi gaji Anda."}</small></div><div class="form-row"><label>Pesan untuk HRD</label><textarea name="message" required maxlength="5000" placeholder="Perkenalkan diri dan jelaskan minat Anda pada posisi ini..."></textarea></div><button class="btn" type="submit">Kirim lamaran</button></form>`,
    async (data) => {
      const expectedSalary = Number(data.get("expectedSalary"));
      if (!Number.isSafeInteger(expectedSalary) || expectedSalary < 1) {
        toast(
          "Masukkan ekspektasi gaji bulanan berupa angka rupiah yang valid.",
        );
        return;
      }
      if (salaryCeiling && expectedSalary > salaryCeiling) {
        toast(
          `Ekspektasi gaji tidak boleh melebihi ${formatRupiah(salaryCeiling)}.`,
        );
        return;
      }
      let selectedCvFileId = data.get("cvFileId") || "";
      let selectedCvPath =
        selectedCvFileId === "profile-private"
          ? publishedProfile?.cvPath ||
            publishedProfile?.privateData?.cv_path ||
            ""
          : "";
      if (selectedCvFileId === "profile-private") selectedCvFileId = "";
      const uploadedCv = data.get("cvUpload");
      if (uploadedCv?.size) {
        if (
          uploadedCv.type !== "application/pdf" &&
          !uploadedCv.name.toLowerCase().endsWith(".pdf")
        ) {
          toast("File CV harus berformat PDF.");
          return;
        }
        if (uploadedCv.size > 5 * 1024 * 1024) {
          toast("Ukuran CV maksimal 5 MB.");
          return;
        }
        try {
          selectedCvFileId = await saveCvFile(uploadedCv);
        } catch (error) {
          toast(
            `CV tidak dapat disimpan: ${error.message || "penyimpanan browser tidak tersedia."}`,
          );
          return;
        }
        localStorage.setItem("jobhub-cv-file-id", selectedCvFileId);
        localStorage.setItem("jobhub-cv-name", uploadedCv.name);
        selectedCvPath = "";
      }
      const answers = Object.fromEntries(
        questions.map((question) => [
          question.id,
          data.get(`answer-${question.id}`) || "",
        ]),
      );
      let cvName = uploadedCv?.size
        ? uploadedCv.name
        : selectedCvPath
          ? publishedProfile?.cvName || "CV terbaru dari profil"
          : "";
      let cvFileForCloud = uploadedCv?.size ? uploadedCv : null;
      if (selectedCvFileId && !cvName) {
        try {
          const stored = await getCvFile(selectedCvFileId);
          if (!stored)
            throw new Error("File CV tidak ditemukan. Unggah ulang CV.");
          cvName = stored.name || cv || "";
          cvFileForCloud = stored.blob;
        } catch (error) {
          toast(
            `CV tidak dapat dibaca: ${error.message || "coba unggah ulang."}`,
          );
          return;
        }
      }
      if (selectedCvFileId && !cvFileForCloud) {
        try {
          cvFileForCloud = (await getCvFile(selectedCvFileId))?.blob || null;
        } catch {}
      }
      const candidateProfile = publishedProfile;
      let cvUrl = selectedCvPath;
      if (cvFileForCloud && supabaseClient) {
        cvUrl = await saveCandidateCvFile(cvFileForCloud);
      }
      const applicationMessage = String(data.get("message") || "").trim();
      if (!applicationMessage) {
        toast("Tulis pesan perkenalan untuk membuka percakapan dengan HRD.");
        return;
      }
      const application = {
        id: `APP-${Date.now()}`,
        jobId: job.id,
        jobTitle: job.title,
        candidateId:
          candidateProfile?.userId ||
          supabaseSession?.user?.id ||
          "demo-candidate",
        candidateName:
          candidateProfile?.full_name ||
          candidateProfile?.fullName ||
          $("#candidateView .profile-head h1")?.textContent.trim() ||
          "Kandidat",
        candidateEmail:
          candidateProfile?.publicData?.contact?.email ||
          supabaseSession?.user?.email ||
          "",
        cvId: cvName,
        cvFileId: selectedCvFileId,
        cvUrl,
        message: applicationMessage,
        answers,
        skills: data
          .getAll("candidateSkills")
          .map((skill) => String(skill).trim())
          .filter(Boolean),
        experienceYears: Number(data.get("candidateExperience")) || 0,
        education: data.get("candidateEducation") || "SMA",
        expectedSalary,
        status: "New Applicant",
        createdAt: new Date().toISOString(),
      };
      application.match = calculateCandidateMatch(job, application);
      if (supabaseClient) {
        try {
          await syncApplicationToSupabase(application);
        } catch (error) {
          toast(
            `Lamaran belum terkirim ke perusahaan: ${error.message || "periksa koneksi dan coba lagi."}`,
          );
          return;
        }
      }
      saveCvAttachment(application.id, selectedCvFileId);
      const applications = getApplications();
      const existing = applications.findIndex(
        (item) =>
          item.jobId === job.id && item.candidateId === application.candidateId,
      );
      if (existing >= 0) applications[existing] = application;
      else applications.push(application);
      saveApplications(applications);
      closeModal();
      renderDashboard();
      toast(
        supabaseClient
          ? `Lamaran terkirim ke perusahaan. Kecocokan: ${application.match.matchPercentage}%.`
          : `Lamaran dicatat secara lokal. Kecocokan: ${application.match.matchPercentage}%.`,
      );
    },
  );
  if (!job.screeningEnabled) $("#modalBody .screening-form")?.remove();
}
async function startCanvaCvEdit(jobId = activeCanvaApplyJobId) {
  if (!supabaseClient || !isCandidateSession())
    throw new Error("Masuk sebagai kandidat untuk menghubungkan Canva.");
  if (
    activeRoute === "candidate-create-profile" &&
    typeof collectCandidateWizardStep === "function"
  )
    collectCandidateWizardStep();
  const input = $('#modalBody input[name="cvUpload"]');
  const wizardInput = $("#candidateCvFile");
  let cvFile =
    input?.files?.[0] ||
    wizardInput?.files?.[0] ||
    candidateWizardFiles?.cv ||
    null;
  if (!cvFile) {
    const stored = await getCvFile(
      localStorage.getItem("jobhub-cv-file-id") || "",
    );
    cvFile = stored?.blob || null;
  }
  if (!cvFile) {
    const profileState = await getCandidateProfileCompletion();
    const cvPath =
      profileState.profile?.cvPath ||
      profileState.profile?.privateData?.cv_path ||
      "";
    if (cvPath) {
      const access = await requestCandidateCv(profileState.profile.id);
      const response = await fetch(access.signedUrl);
      if (response.ok) cvFile = await response.blob();
    }
  }
  if (!cvFile) throw new Error("Pilih atau unggah CV PDF terlebih dahulu.");
  if (
    cvFile.type !== "application/pdf" &&
    !(cvFile.name || "").toLowerCase().endsWith(".pdf")
  )
    throw new Error("File CV harus berformat PDF.");
  if (cvFile.size > 5 * 1024 * 1024)
    throw new Error("Ukuran CV maksimal 5 MB.");
  const path = `${supabaseSession.user.id}/canva-input/${crypto.randomUUID()}.pdf`;
  const { error: uploadError } = await supabaseClient.storage
    .from("candidate-private-documents")
    .upload(path, cvFile, { contentType: "application/pdf", upsert: false });
  if (uploadError) throw uploadError;
  sessionStorage.setItem("jobhub-canva-pending-job", jobId || "");
  if (activeRoute === "candidate-create-profile")
    sessionStorage.setItem("jobhub-canva-return-to", "candidate-wizard");
  else sessionStorage.removeItem("jobhub-canva-return-to");
  const { data, error } = await supabaseClient.functions.invoke(
    "canva-connect",
    { body: { action: "start", cvPath: path, jobId: jobId || null } },
  );
  if (error) throw error;
  try {
    const destination = new URL(data?.redirect_url);
    if (
      destination.protocol !== "https:" ||
      destination.hostname !== "www.canva.com"
    )
      throw new Error();
    window.location.assign(destination.href);
  } catch {
    throw new Error(
      "URL Canva tidak valid atau redirect belum terkonfigurasi.",
    );
  }
}
async function finishCanvaCvReturn(correlationJwt) {
  const { data, error } = await supabaseClient.functions.invoke(
    "canva-connect",
    { body: { action: "finish", correlationJwt } },
  );
  if (error) throw error;
  const cvResponse = await fetch(data.cv_url);
  if (!cvResponse.ok)
    throw new Error(
      "CV hasil Canva berhasil diekspor, tetapi belum dapat dimuat.",
    );
  const cvBlob = await cvResponse.blob();
  const cvFile = new File([cvBlob], data.cv_name || "CV-JobHub-Canva.pdf", {
    type: "application/pdf",
  });
  const fileId = await saveCvFile(cvFile);
  localStorage.setItem("jobhub-cv-file-id", fileId);
  localStorage.setItem("jobhub-cv-name", cvFile.name);
  const ownerId = supabaseSession.user.id;
  const { data: existingPost, error: postError } = await supabaseClient
    .from("candidate_posts")
    .select("id")
    .eq("user_id", ownerId)
    .maybeSingle();
  if (postError) throw postError;
  const cvPath = existingPost ? await saveCandidateCvFile(cvFile) : "";
  const localProfiles = getLocalCandidateProfiles().map((profile) => {
    if (profile.userId !== ownerId) return profile;
    const publicData = { ...(profile.publicData || profile.public_data || {}) };
    delete publicData.cvUrl;
    delete publicData.cv_url;
    return {
      ...profile,
      cv_url: cvPath,
      cvPath,
      cvName: cvFile.name,
      publicData,
      public_data: publicData,
    };
  });
  saveLocalCandidateProfiles(localProfiles);
  if (currentCandidateProfile?.userId === ownerId) {
    const publicData = {
      ...(currentCandidateProfile.publicData ||
        currentCandidateProfile.public_data ||
        {}),
    };
    delete publicData.cvUrl;
    delete publicData.cv_url;
    currentCandidateProfile = {
      ...currentCandidateProfile,
      cv_url: cvPath,
      cvPath,
      cvName: cvFile.name,
      public_data: publicData,
      publicData,
    };
  }
  const returnToWizard =
    sessionStorage.getItem("jobhub-canva-return-to") === "candidate-wizard";
  sessionStorage.removeItem("jobhub-canva-return-to");
  const jobId =
    data.job_id || sessionStorage.getItem("jobhub-canva-pending-job") || "";
  sessionStorage.removeItem("jobhub-canva-pending-job");
  const returnUrl = new URL(window.location.href);
  returnUrl.search = "";
  history.replaceState(null, "", returnUrl.toString());
  if (jobId) {
    go("detail", jobId);
    await openApply(jobId);
    toast(
      "CV dari Canva siap dilampirkan. Periksa kembali jawaban sebelum mengirim lamaran.",
    );
  } else if (returnToWizard && typeof candidateWizardData !== "undefined") {
    candidateWizardData.cvId = cvPath ? "" : fileId;
    candidateWizardData.cvPath = cvPath;
    candidateWizardData.cvName = cvFile.name;
    delete candidateWizardData.cvUrl;
    candidateWizardStep = 9;
    sessionStorage.setItem(
      CANDIDATE_DRAFT_KEY,
      JSON.stringify(candidateWizardData),
    );
    go("candidate-create-profile");
    toast(
      "CV dari Canva siap. Lanjutkan dan simpan perubahan profil kandidat.",
    );
  } else {
    toast("CV dari Canva berhasil diperbarui di profil kandidat.");
    go("candidate");
  }
}
function openNewJob(editJobId = "") {
  openJobUploadWizard(editJobId);
  return;
}
function openJobUploadWizard(editJobId = "") {
  if (
    supabaseClient &&
    isCompanyAccount() &&
    !getCompanyOnboardingState().ready
  ) {
    toast(
      "Selesaikan profil, verifikasi perusahaan, aktivasi HRD, dan pembayaran sebelum mengelola lowongan.",
    );
    go("dashboard");
    return;
  }
  if (!supabaseClient || !supabaseSession || !isHrdSession()) {
    if (isCompanyAccount() && !companyProfileCompletionState().complete)
      openCompanyProfileForm();
    else
      toast(
        "Posting lowongan hanya tersedia untuk akun perusahaan yang role HRD-nya telah diaktifkan admin.",
      );
    return;
  }
  if (!companyProfileCompletionState().complete) {
    toast("Lengkapi profil perusahaan sebelum posting lowongan.");
    openCompanyProfileForm();
    return;
  }
  if (!canManageCandidates()) {
    toast("Role Recruiter tidak dapat mengelola lowongan.");
    return;
  }
  const existingJob = editJobId
    ? companyJobs().find((job) => job.id === editJobId)
    : null;
  if (editJobId && !existingJob) {
    toast("Lowongan tidak ditemukan atau bukan milik perusahaan Anda.");
    return;
  }
  const plan = getCompanyPlan(),
    activeCount = countActiveCompanyJobs();
  if (!existingJob && !plan) {
    toast("Aktifkan paket perusahaan sebelum memposting lowongan.");
    go("pricing");
    return;
  }
  if (!existingJob && activeCount >= plan.activeJobs) {
    toast(
      `Batas paket ${plan.name} tercapai (${plan.activeJobs} lowongan aktif). Upgrade paket untuk menambah lowongan.`,
    );
    go("pricing");
    return;
  }
  if (
    !existingJob &&
    plan.freeTrial &&
    countCompanyPublishedJobs() >= plan.postedJobs
  ) {
    toast(
      "Paket Gratis 21 Hari hanya mencakup 1 lowongan selama masa trial. Upgrade paket untuk memposting lagi.",
    );
    go("pricing");
    return;
  }
  const wizardState = { step: 0 };
  const stepTitles = [
    "Detail Lowongan",
    "Deskripsi Lowongan",
    "Skill & Persyaratan",
    "Screening Question",
    "Preview",
    "Publish",
  ];
  const draft = JSON.parse(
    localStorage.getItem("jobhub-company-job-draft") || "{}",
  );
  const companyName = getCurrentCompanyName();
  const baseData = {
    title: existingJob?.title || draft.title || "",
    position: existingJob?.title || draft.position || "",
    department: existingJob?.department || draft.department || "",
    category:
      existingJob?.category || draft.category || categories[0]?.[0] || "",
    industry: existingJob?.industry || draft.industry || "",
    type: existingJob?.type || draft.type || "Full Time",
    careerLevel: existingJob?.careerLevel || draft.careerLevel || "Staff",
    quantity: existingJob?.quantity || draft.quantity || 1,
    location: existingJob?.loc || draft.location || "",
    salaryMin: existingJob?.salaryMin || draft.salaryMin || "",
    salaryMax: existingJob?.salaryMax || draft.salaryMax || "",
    salaryHidden: Boolean(
      existingJob?.salaryHidden ?? draft.salaryHidden ?? false,
    ),
    deadline: existingJob?.deadline || draft.deadline || "",
    skills: Array.isArray(existingJob?.skills)
      ? existingJob.skills
      : Array.isArray(draft.skills)
        ? draft.skills
        : String(draft.skills || "")
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    education: existingJob?.minimumEducation || draft.education || "",
    major: existingJob?.major || draft.major || "",
    experience: existingJob?.experience || draft.experience || "",
    ageMin: existingJob?.ageMin || draft.ageMin || "",
    ageMax: existingJob?.ageMax || draft.ageMax || "",
    gender: existingJob?.gender || draft.gender || "",
    certificate: existingJob?.certificate || draft.certificate || "",
    language: existingJob?.language || draft.language || "",
    sim: existingJob?.sim || draft.sim || "",
    description: existingJob?.description || draft.description || "",
    responsibilities:
      existingJob?.responsibilities?.join("\n") || draft.responsibilities || "",
    requirements:
      existingJob?.requirements?.join("\n") || draft.requirements || "",
    benefits: existingJob?.benefits?.join("\n") || draft.benefits || "",
    screeningEnabled: Boolean(
      existingJob?.screeningEnabled ??
        draft.screeningEnabled ??
        existingJob?.screeningQuestions?.length,
    ),
    screeningQuestions:
      Array.isArray(existingJob?.screeningQuestions) &&
      existingJob.screeningQuestions.length
        ? existingJob.screeningQuestions
        : Array.isArray(draft.screeningQuestions)
          ? draft.screeningQuestions
          : [
              {
                id: "q1",
                prompt: "Apakah Anda siap bekerja dengan target yang jelas?",
                type: "yes_no",
                options: ["Ya", "Tidak"],
                required: true,
              },
            ],
  };
  const renderTitle = () => {
    const title = $("#jobWizardTitle");
    if (title) title.textContent = stepTitles[wizardState.step];
    const counter = $("#jobWizardCounter");
    if (counter)
      counter.textContent = `${wizardState.step + 1}/${stepTitles.length}`;
    const fill = $("#jobWizardProgressFill");
    if (fill)
      fill.style.width = `${((wizardState.step + 1) / stepTitles.length) * 100}%`;
    const back = $("#jobWizardBack");
    if (back) back.hidden = wizardState.step === 0;
    const next = $("#jobWizardNext");
    if (next) next.hidden = wizardState.step === stepTitles.length - 1;
    const publish = $("#jobWizardPublish");
    if (publish) publish.hidden = wizardState.step !== stepTitles.length - 1;
    const draftBtn = $("#jobWizardDraft");
    if (draftBtn) draftBtn.hidden = wizardState.step === stepTitles.length - 1;
  };
  const getEditorValue = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return "";
    return String(el.innerHTML || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<div>/gi, "\n")
      .replace(/<\/div>/gi, "")
      .replace(/<p>/gi, "")
      .replace(/<\/p>/gi, "\n")
      .replace(/<li>/gi, "• ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .trim();
  };
  const saveDraftState = () => {
    const form = $("#jobWizardForm");
    if (!form) return;
    const payload = {
      companyId: billingCompanyId(),
      title: form.querySelector('[name="title"]').value.trim(),
      position: form.querySelector('[name="position"]').value.trim(),
      department: form.querySelector('[name="department"]').value.trim(),
      category: form.querySelector('[name="category"]').value,
      industry: form.querySelector('[name="industry"]').value.trim(),
      type: form.querySelector('[name="type"]').value,
      careerLevel: form.querySelector('[name="careerLevel"]').value,
      quantity: Number(form.querySelector('[name="quantity"]').value || 1),
      location: form.querySelector('[name="location"]').value.trim(),
      salaryMin: form.querySelector('[name="salaryMin"]').value,
      salaryMax: form.querySelector('[name="salaryMax"]').value,
      salaryHidden: form.querySelector('[name="salaryHidden"]').checked,
      deadline: form.querySelector('[name="deadline"]').value,
      skills: [...form.querySelectorAll(".tag-pill")]
        .map((tag) => tag.dataset.tagValue || tag.textContent.trim())
        .filter(Boolean),
      education: form.querySelector('[name="education"]').value,
      major: form.querySelector('[name="major"]').value.trim(),
      experience: form.querySelector('[name="experienceYears"]').value.trim(),
      ageMin: form.querySelector('[name="ageMin"]').value,
      ageMax: form.querySelector('[name="ageMax"]').value,
      gender: form.querySelector('[name="gender"]').value,
      certificate: form.querySelector('[name="certificate"]').value.trim(),
      language: form.querySelector('[name="language"]').value.trim(),
      sim: form.querySelector('[name="sim"]').value,
      description: getEditorValue('[data-editor="description"]'),
      responsibilities: getEditorValue('[data-editor="responsibilities"]'),
      requirements: getEditorValue('[data-editor="requirements"]'),
      benefits: getEditorValue('[data-editor="benefits"]'),
      screeningEnabled: form.querySelector('[name="screeningEnabled"]').checked,
      screeningQuestions: [...form.querySelectorAll(".job-screening-card")]
        .map((card) => ({
          id: card.dataset.questionId || crypto.randomUUID(),
          prompt:
            card.querySelector("[data-question-prompt]")?.value.trim() || "",
          type:
            card.querySelector("[data-question-type]")?.value || "short_answer",
          options: (card.querySelector("[data-question-options]")?.value || "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
          required:
            card.querySelector("[data-question-required]")?.checked || false,
        }))
        .filter((item) => item.prompt),
    };
    localStorage.setItem("jobhub-company-job-draft", JSON.stringify(payload));
  };
  const validateStep = (step) => {
    const form = $("#jobWizardForm");
    if (!form) return true;
    if (step === 0) {
      const title = form.querySelector('[name="title"]').value.trim();
      const position = form.querySelector('[name="position"]').value.trim();
      const category = form.querySelector('[name="category"]').value;
      const industry = form.querySelector('[name="industry"]').value.trim();
      const type = form.querySelector('[name="type"]').value;
      const location = form.querySelector('[name="location"]').value.trim();
      const quantity = Number(
        form.querySelector('[name="quantity"]').value || 0,
      );
      const deadline = form.querySelector('[name="deadline"]').value;
      if (
        !title ||
        !position ||
        !category ||
        !industry ||
        !type ||
        !location ||
        !quantity ||
        !deadline
      ) {
        toast("Semua field wajib diisi di step 1.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      const fields = [
        "description",
        "responsibilities",
        "requirements",
        "benefits",
      ];
      for (const field of fields) {
        const value = getEditorValue(`[data-editor="${field}"]`);
        if (!value) {
          toast(
            "Deskripsi, tanggung jawab, kualifikasi, dan benefit harus diisi.",
          );
          return false;
        }
      }
      return true;
    }
    if (step === 2) {
      const skills = [...form.querySelectorAll(".tag-pill")]
        .map((tag) => tag.dataset.tagValue || tag.textContent.trim())
        .filter(Boolean);
      if (!skills.length) {
        toast("Tambahkan minimal satu skill yang dibutuhkan.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!form.querySelector('[name="screeningEnabled"]').checked) return true;
      const cards = [...form.querySelectorAll(".job-screening-card")];
      for (const card of cards) {
        const question = card
          .querySelector("[data-question-prompt]")
          ?.value.trim();
        const kind = card.querySelector("[data-question-type]")?.value;
        if (!question) {
          toast("Semua pertanyaan screening harus ada pertanyaannya.");
          return false;
        }
        if (
          (kind === "multiple_choice" || kind === "dropdown") &&
          !(card.querySelector("[data-question-options]")?.value || "").trim()
        ) {
          toast(
            "Opsi pilihan wajib diisi untuk jenis pertanyaan pilihan ganda atau dropdown.",
          );
          return false;
        }
      }
      return true;
    }
    return true;
  };
  const renderTags = (items = []) => {
    const list = $("#jobWizardTags");
    if (!list) return;
    const normalized = [
      ...new Set(
        (items || []).map((item) => String(item).trim()).filter(Boolean),
      ),
    ];
    list.innerHTML =
      normalized
        .map(
          (skill) =>
            `<span class="tag-pill" data-tag-value="${escapeHtml(skill)}" style="display:inline-flex;align-items:center;gap:.45rem;padding:.45rem .7rem;border-radius:999px;background:#edf3ff;color:#163d7d;font-size:12px;font-weight:600;">${escapeHtml(skill)} <button type="button" class="tag-remove" aria-label="Hapus ${escapeHtml(skill)}" style="border:none;background:transparent;color:inherit;padding:0;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button></span>`,
        )
        .join("") ||
      '<span style="color:var(--muted);">Belum ada skill.</span>';
  };
  const addTag = (value) => {
    const list = $("#jobWizardTags");
    if (!list) return;
    const skill = String(value || "").trim();
    if (!skill) return;
    const existing = [...list.querySelectorAll(".tag-pill")].map(
      (tag) => tag.dataset.tagValue || tag.textContent.trim(),
    );
    if (existing.includes(skill)) return;
    const span = document.createElement("span");
    span.className = "tag-pill";
    span.dataset.tagValue = skill;
    span.style.display = "inline-flex";
    span.style.alignItems = "center";
    span.style.gap = ".45rem";
    span.style.padding = ".45rem .7rem";
    span.style.borderRadius = "999px";
    span.style.background = "#edf3ff";
    span.style.color = "#163d7d";
    span.style.fontSize = "12px";
    span.style.fontWeight = "600";
    span.innerHTML = `${escapeHtml(skill)} <button type="button" class="tag-remove" aria-label="Hapus ${escapeHtml(skill)}" style="border:none;background:transparent;color:inherit;padding:0;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>`;
    list.appendChild(span);
  };
  const buildWizardHtml = () => `<div class="job-wizard-shell">
    <div class="job-wizard-progress" style="display:grid;gap:.75rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--muted);">
        <span>Langkah <strong id="jobWizardCounter">1/6</strong></span>
        <span id="jobWizardTitle">${stepTitles[0]}</span>
      </div>
      <div style="height:8px;border-radius:999px;background:#ebf1ee;overflow:hidden;">
        <div id="jobWizardProgressFill" style="height:100%;width:${100 / stepTitles.length}%;background:linear-gradient(90deg,#113f91,#1d5bd3);border-radius:inherit;transition:width .2s ease;"></div>
      </div>
    </div>
    <form id="jobWizardForm" novalidate>
      <div class="job-wizard-step" data-step="0" ${wizardState.step === 0 ? 'style="display:block"' : 'style="display:none"'}>
        <div class="form-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
          <div class="form-row" style="grid-column:1/-1;"><label>Judul lowongan <span style="color:#d92d20">*</span></label><input name="title" value="${escapeHtml(baseData.title)}" placeholder="Contoh: Product Designer"></div>
          <div class="form-row"><label>Posisi / Jabatan <span style="color:#d92d20">*</span></label><input name="position" value="${escapeHtml(baseData.position)}" placeholder="Contoh: UI/UX Designer"></div>
          <div class="form-row"><label>Kategori pekerjaan <span style="color:#d92d20">*</span></label><select name="category">${categories.map(([name]) => `<option value="${escapeHtml(name)}" ${baseData.category === name ? "selected" : ""}>${escapeHtml(name)}</option>`).join("")}</select></div>
          <div class="form-row"><label>Bidang industri <span style="color:#d92d20">*</span></label><input name="industry" value="${escapeHtml(baseData.industry)}" placeholder="Contoh: Teknologi Informasi"></div>
          <div class="form-row"><label>Tipe pekerjaan <span style="color:#d92d20">*</span></label><select name="type"><option ${baseData.type === "Full Time" ? "selected" : ""}>Full Time</option><option ${baseData.type === "Part Time" ? "selected" : ""}>Part Time</option><option ${baseData.type === "Contract" ? "selected" : ""}>Contract</option><option ${baseData.type === "Freelance" ? "selected" : ""}>Freelance</option><option ${baseData.type === "Internship" ? "selected" : ""}>Internship</option><option ${baseData.type === "Remote" ? "selected" : ""}>Remote</option><option ${baseData.type === "Hybrid" ? "selected" : ""}>Hybrid</option></select></div>
          <div class="form-row"><label>Level karier <span style="color:#d92d20">*</span></label><select name="careerLevel"><option ${baseData.careerLevel === "Staff" ? "selected" : ""}>Staff</option><option ${baseData.careerLevel === "Supervisor" ? "selected" : ""}>Supervisor</option><option ${baseData.careerLevel === "Manager" ? "selected" : ""}>Manager</option><option ${baseData.careerLevel === "Senior" ? "selected" : ""}>Senior</option><option ${baseData.careerLevel === "Lead" ? "selected" : ""}>Lead</option><option ${baseData.careerLevel === "Executive" ? "selected" : ""}>Executive</option></select></div>
          <div class="form-row"><label>Jumlah kebutuhan <span style="color:#d92d20">*</span></label><input type="number" min="1" name="quantity" value="${Number(baseData.quantity || 1)}" placeholder="1"></div>
          <div class="form-row"><label>Lokasi kerja <span style="color:#d92d20">*</span></label><input name="location" value="${escapeHtml(baseData.location)}" placeholder="Jakarta Selatan / Remote"></div>
          <div class="form-row"><label>Gaji minimum</label><input type="number" min="0" name="salaryMin" value="${escapeHtml(String(baseData.salaryMin || ""))}" placeholder="8000000"></div>
          <div class="form-row"><label>Gaji maksimum</label><input type="number" min="0" name="salaryMax" value="${escapeHtml(String(baseData.salaryMax || ""))}" placeholder="12000000"></div>
          <div class="form-row" style="display:flex;align-items:center;gap:.5rem;"><label><input type="checkbox" name="salaryHidden" ${baseData.salaryHidden ? "checked" : ""}> Gaji dirahasiakan</label></div>
          <div class="form-row"><label>Deadline lamaran <span style="color:#d92d20">*</span></label><input type="date" name="deadline" value="${escapeHtml(String(baseData.deadline || ""))}"></div>
        </div>
      </div>
      <div class="job-wizard-step" data-step="1" ${wizardState.step === 1 ? 'style="display:block"' : 'style="display:none"'}>
        <div class="form-row"><label>Deskripsi pekerjaan</label><div class="job-editor-toolbar" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;"><button type="button" class="btn btn-outline btn-small" data-rich-action="bold"><i class="fa-solid fa-bold"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="italic"><i class="fa-solid fa-italic"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="underline"><i class="fa-solid fa-underline"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertUnorderedList"><i class="fa-solid fa-list-ul"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertOrderedList"><i class="fa-solid fa-list-ol"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="createLink"><i class="fa-solid fa-link"></i></button></div><div class="job-editor" data-editor="description" contenteditable="true" data-placeholder="Tulis deskripsi pekerjaan..." style="min-height:140px;border:1px solid #dfe7e1;border-radius:12px;padding:.8rem;background:#fff;">${escapeHtml(baseData.description).replace(/\n/g, "<br>")}</div></div>
        <div class="form-row"><label>Tanggung jawab</label><div class="job-editor-toolbar" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;"><button type="button" class="btn btn-outline btn-small" data-rich-action="bold"><i class="fa-solid fa-bold"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="italic"><i class="fa-solid fa-italic"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="underline"><i class="fa-solid fa-underline"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertUnorderedList"><i class="fa-solid fa-list-ul"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertOrderedList"><i class="fa-solid fa-list-ol"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="createLink"><i class="fa-solid fa-link"></i></button></div><div class="job-editor" data-editor="responsibilities" contenteditable="true" style="min-height:140px;border:1px solid #dfe7e1;border-radius:12px;padding:.8rem;background:#fff;">${escapeHtml(baseData.responsibilities).replace(/\n/g, "<br>")}</div></div>
        <div class="form-row"><label>Kualifikasi</label><div class="job-editor-toolbar" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;"><button type="button" class="btn btn-outline btn-small" data-rich-action="bold"><i class="fa-solid fa-bold"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="italic"><i class="fa-solid fa-italic"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="underline"><i class="fa-solid fa-underline"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertUnorderedList"><i class="fa-solid fa-list-ul"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertOrderedList"><i class="fa-solid fa-list-ol"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="createLink"><i class="fa-solid fa-link"></i></button></div><div class="job-editor" data-editor="requirements" contenteditable="true" style="min-height:140px;border:1px solid #dfe7e1;border-radius:12px;padding:.8rem;background:#fff;">${escapeHtml(baseData.requirements).replace(/\n/g, "<br>")}</div></div>
        <div class="form-row"><label>Benefit perusahaan</label><div class="job-editor-toolbar" style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.5rem;"><button type="button" class="btn btn-outline btn-small" data-rich-action="bold"><i class="fa-solid fa-bold"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="italic"><i class="fa-solid fa-italic"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="underline"><i class="fa-solid fa-underline"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertUnorderedList"><i class="fa-solid fa-list-ul"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="insertOrderedList"><i class="fa-solid fa-list-ol"></i></button><button type="button" class="btn btn-outline btn-small" data-rich-action="createLink"><i class="fa-solid fa-link"></i></button></div><div class="job-editor" data-editor="benefits" contenteditable="true" style="min-height:140px;border:1px solid #dfe7e1;border-radius:12px;padding:.8rem;background:#fff;">${escapeHtml(baseData.benefits).replace(/\n/g, "<br>")}</div></div>
      </div>
      <div class="job-wizard-step" data-step="2" ${wizardState.step === 2 ? 'style="display:block"' : 'style="display:none"'}>
        <div class="form-row"><label>Skill <span style="color:#d92d20">*</span></label><div id="jobWizardTags" style="display:flex;flex-wrap:wrap;gap:.5rem;min-height:44px;padding:.5rem;border:1px solid #dfe7e1;border-radius:12px;background:#fff;">${(baseData.skills || []).map((skill) => `<span class="tag-pill" data-tag-value="${escapeHtml(skill)}" style="display:inline-flex;align-items:center;gap:.45rem;padding:.45rem .7rem;border-radius:999px;background:#edf3ff;color:#163d7d;font-size:12px;font-weight:600;">${escapeHtml(skill)} <button type="button" class="tag-remove" aria-label="Hapus ${escapeHtml(skill)}" style="border:none;background:transparent;color:inherit;padding:0;cursor:pointer;"><i class="fa-solid fa-xmark"></i></button></span>`).join("")}</div><input id="jobSkillInput" type="text" placeholder="Tambah skill lalu tekan Enter" style="margin-top:.75rem;width:100%;"></div>
        <div class="form-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;">
          <div class="form-row"><label>Pendidikan minimal</label><select name="education"><option value="">Tidak ditentukan</option><option ${baseData.education === "SMA" ? "selected" : ""}>SMA</option><option ${baseData.education === "SMK" ? "selected" : ""}>SMK</option><option ${baseData.education === "D3" ? "selected" : ""}>D3</option><option ${baseData.education === "S1" ? "selected" : ""}>S1</option><option ${baseData.education === "S2" ? "selected" : ""}>S2</option><option ${baseData.education === "S3" ? "selected" : ""}>S3</option></select></div>
          <div class="form-row"><label>Jurusan</label><input name="major" value="${escapeHtml(baseData.major)}" placeholder="Teknik Informatika"></div>
          <div class="form-row"><label>Pengalaman kerja</label><input name="experienceYears" value="${escapeHtml(baseData.experience)}" placeholder="2 tahun / Fresh Graduate"></div>
          <div class="form-row"><label>Usia minimum</label><input type="number" min="17" name="ageMin" value="${escapeHtml(String(baseData.ageMin || ""))}" placeholder="18"></div>
          <div class="form-row"><label>Usia maksimum</label><input type="number" min="17" name="ageMax" value="${escapeHtml(String(baseData.ageMax || ""))}" placeholder="35"></div>
          <div class="form-row"><label>Jenis kelamin</label><select name="gender"><option value="">Opsional</option><option ${baseData.gender === "Laki-laki" ? "selected" : ""}>Laki-laki</option><option ${baseData.gender === "Perempuan" ? "selected" : ""}>Perempuan</option><option ${baseData.gender === "Tidak perlu" ? "selected" : ""}>Tidak perlu</option></select></div>
          <div class="form-row"><label>Sertifikat</label><input name="certificate" value="${escapeHtml(baseData.certificate)}" placeholder="Opsional"></div>
          <div class="form-row"><label>Bahasa yang dikuasai</label><input name="language" value="${escapeHtml(baseData.language)}" placeholder="Bahasa Indonesia, Inggris"></div>
          <div class="form-row"><label>SIM</label><select name="sim"><option value="">Opsional</option><option ${baseData.sim === "A" ? "selected" : ""}>A</option><option ${baseData.sim === "C" ? "selected" : ""}>C</option><option ${baseData.sim === "A / C" ? "selected" : ""}>A / C</option></select></div>
        </div>
      </div>
      <div class="job-wizard-step" data-step="3" ${wizardState.step === 3 ? 'style="display:block"' : 'style="display:none"'}>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;">
          <label><input type="checkbox" name="screeningEnabled" ${baseData.screeningEnabled ? "checked" : ""}> Aktifkan pertanyaan screening untuk pelamar</label>
          <button type="button" class="btn btn-outline btn-small" id="jobAddScreeningQuestion"><i class="fa-solid fa-plus"></i> Tambah pertanyaan</button>
        </div>
        <div id="jobScreeningList" style="display:grid;gap:1rem;">${
          (baseData.screeningQuestions || [])
            .map(
              (
                question,
                index,
              ) => `<div class="job-screening-card" data-question-id="${escapeHtml(question.id || `q${index + 1}`)}" draggable="true" style="padding:1rem;border:1px solid #dfe7e1;border-radius:12px;background:#f8faf9;display:grid;gap:.8rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
            <strong>Pertanyaan ${index + 1}</strong>
            <button type="button" class="btn btn-outline btn-small" data-remove-question><i class="fa-solid fa-trash"></i></button>
          </div>
          <div class="form-row"><label>Pertanyaan</label><input data-question-prompt value="${escapeHtml(question.prompt || "")}" placeholder="Contoh: Apakah Anda bersedia kerja remote?"></div>
          <div class="form-row"><label>Jenis pertanyaan</label><select data-question-type><option value="yes_no" ${question.type === "yes_no" ? "selected" : ""}>Ya / Tidak</option><option value="multiple_choice" ${question.type === "multiple_choice" ? "selected" : ""}>Pilihan Ganda</option><option value="dropdown" ${question.type === "dropdown" ? "selected" : ""}>Dropdown</option><option value="short_answer" ${question.type === "short_answer" ? "selected" : ""}>Jawaban Singkat</option><option value="long_answer" ${question.type === "long_answer" ? "selected" : ""}>Jawaban Panjang</option><option value="number" ${question.type === "number" ? "selected" : ""}>Angka</option></select></div>
          <div class="form-row" ${question.type === "multiple_choice" || question.type === "dropdown" ? "" : "hidden"}><label>Opsi pilihan</label><input data-question-options value="${escapeHtml((question.options || []).join(", "))}" placeholder="Ya, Tidak"></div>
          <div class="form-row"><label>Wajib dijawab</label><input type="checkbox" data-question-required ${question.required ? "checked" : ""}></div>
        </div>`,
            )
            .join("") ||
          `<div class="job-screening-card" data-question-id="q1" draggable="true" style="padding:1rem;border:1px solid #dfe7e1;border-radius:12px;background:#f8faf9;display:grid;gap:.8rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;">
            <strong>Pertanyaan 1</strong>
            <button type="button" class="btn btn-outline btn-small" data-remove-question><i class="fa-solid fa-trash"></i></button>
          </div>
          <div class="form-row"><label>Pertanyaan</label><input data-question-prompt value="" placeholder="Contoh: Apakah Anda siap bekerja remote?"></div>
          <div class="form-row"><label>Jenis pertanyaan</label><select data-question-type><option value="yes_no">Ya / Tidak</option><option value="multiple_choice">Pilihan Ganda</option><option value="dropdown">Dropdown</option><option value="short_answer">Jawaban Singkat</option><option value="long_answer">Jawaban Panjang</option><option value="number">Angka</option></select></div>
          <div class="form-row" hidden><label>Opsi pilihan</label><input data-question-options value="" placeholder="Ya, Tidak"></div>
          <div class="form-row"><label>Wajib dijawab</label><input type="checkbox" data-question-required checked></div>
        </div>`
        }</div>
      </div>
      <div class="job-wizard-step" data-step="4" ${wizardState.step === 4 ? 'style="display:block"' : 'style="display:none"'}>
        <div class="job-preview-card" style="padding:1.2rem;border:1px solid #dfe7e1;border-radius:18px;background:#fff;display:grid;gap:1rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:.7rem;">
              <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,#113f91,#1d5bd3);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">${escapeHtml((companyName || "JH").slice(0, 2).toUpperCase())}</div>
              <div><div style="font-size:12px;color:var(--muted);">${escapeHtml(companyName || "Perusahaan")}</div><strong id="jobPreviewTitle">${escapeHtml(baseData.title || "Judul lowongan")}</strong></div>
            </div>
            <span style="padding:.45rem .8rem;border-radius:999px;background:#effaf5;color:#0d7f47;font-weight:700;font-size:12px;">Pending Review</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:.75rem;color:var(--muted);font-size:13px;">
            <span><i class="fa-solid fa-location-dot"></i> <span id="jobPreviewLocation">${escapeHtml(baseData.location || "Lokasi")}</span></span>
            <span><i class="fa-solid fa-circle-dollar-to-slot"></i> <span id="jobPreviewSalary">${baseData.salaryHidden ? "Gaji dirahasiakan" : baseData.salaryMin || baseData.salaryMax ? `${baseData.salaryMin ? `Rp${new Intl.NumberFormat("id-ID").format(Number(baseData.salaryMin))}` : ""}${baseData.salaryMin && baseData.salaryMax ? " - " : ""}${baseData.salaryMax ? `Rp${new Intl.NumberFormat("id-ID").format(Number(baseData.salaryMax))}` : ""}` : "Gaji sesuai pasar"}</span></span>
            <span><i class="fa-solid fa-clock"></i> <span id="jobPreviewDeadline">${baseData.deadline ? new Date(`${baseData.deadline}T12:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "Deadline belum diisi"}</span></span>
          </div>
          <div><h4 style="margin:0 0 .5rem;">Deskripsi</h4><div id="jobPreviewDescription" style="color:var(--text);line-height:1.7;">${escapeHtml(baseData.description || "Belum ada deskripsi.").replace(/\n/g, "<br>")}</div></div>
          <div><h4 style="margin:0 0 .5rem;">Kualifikasi</h4><div id="jobPreviewRequirements" style="color:var(--text);line-height:1.7;">${escapeHtml(baseData.requirements || "Belum ada kualifikasi.").replace(/\n/g, "<br>")}</div></div>
          <div><h4 style="margin:0 0 .5rem;">Benefit</h4><div id="jobPreviewBenefits" style="color:var(--text);line-height:1.7;">${escapeHtml(baseData.benefits || "Belum ada benefit.").replace(/\n/g, "<br>")}</div></div>
          <div><h4 style="margin:0 0 .5rem;">Skill</h4><div id="jobPreviewSkills" style="display:flex;flex-wrap:wrap;gap:.5rem;">${(baseData.skills || []).map((skill) => `<span style="padding:.4rem .65rem;border-radius:999px;background:#edf3ff;color:#163d7d;font-size:12px;font-weight:600;">${escapeHtml(skill)}</span>`).join("") || '<span style="color:var(--muted);">Belum ada skill.</span>'}</div></div>
        </div>
      </div>
      <div class="job-wizard-step" data-step="5" ${wizardState.step === 5 ? 'style="display:block"' : 'style="display:none"'}>
        <div style="padding:1.2rem;border:1px solid #dfe7e1;border-radius:18px;background:#fff;display:grid;gap:.75rem;">
          <h3 style="margin:0;">Konfirmasi publikasi</h3>
          <p style="margin:0;color:var(--muted);">Lowongan akan disimpan dengan status <strong>Pending Review</strong> dan muncul di dashboard perusahaan setelah divalidasi.</p>
          <ul style="margin:0;padding-left:1.2rem;display:grid;gap:.4rem;color:var(--muted);">
            <li>Data lowongan akan dikirim ke Supabase.</li>
            <li>Publish date dan expired date akan otomatis tersimpan.</li>
            <li>Anda bisa edit atau tutup lowongan dari dashboard.</li>
          </ul>
        </div>
      </div>
      <div class="job-wizard-actions" style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-top:1rem;">
        <button type="button" class="btn btn-outline" id="jobWizardBack" hidden>Kembali</button>
        <div style="margin-left:auto;display:flex;gap:.75rem;flex-wrap:wrap;justify-content:flex-end;">
          <button type="button" class="btn btn-outline" id="jobWizardDraft">Simpan Draft</button>
          <button type="button" class="btn" id="jobWizardNext">Selanjutnya</button>
          <button type="button" class="btn" id="jobWizardPublish" hidden>Publikasikan</button>
        </div>
      </div>
    </form>
  </div>`;
  openModal(existingJob ? "Edit lowongan" : "Buat lowongan", buildWizardHtml());
  const form = $("#jobWizardForm");
  if (!form) return;
  const resetPreview = () => {
    const title =
      form.querySelector('[name="title"]').value.trim() || "Judul lowongan";
    const location =
      form.querySelector('[name="location"]').value.trim() || "Lokasi";
    const salaryHidden = form.querySelector('[name="salaryHidden"]').checked;
    const salaryMin = Number(
      form.querySelector('[name="salaryMin"]').value || 0,
    );
    const salaryMax = Number(
      form.querySelector('[name="salaryMax"]').value || 0,
    );
    const previewTitle = form.querySelector("#jobPreviewTitle");
    const previewLocation = form.querySelector("#jobPreviewLocation");
    const previewSalary = form.querySelector("#jobPreviewSalary");
    const previewDeadline = form.querySelector("#jobPreviewDeadline");
    if (previewTitle) previewTitle.textContent = title;
    if (previewLocation) previewLocation.textContent = location;
    if (previewSalary)
      previewSalary.textContent = salaryHidden
        ? "Gaji dirahasiakan"
        : salaryMin || salaryMax
          ? `${salaryMin ? `Rp${new Intl.NumberFormat("id-ID").format(salaryMin)}` : ""}${salaryMin && salaryMax ? " - " : ""}${salaryMax ? `Rp${new Intl.NumberFormat("id-ID").format(salaryMax)}` : ""}`
          : "Gaji sesuai pasar";
    const deadline = form.querySelector('[name="deadline"]').value;
    if (previewDeadline)
      previewDeadline.textContent = deadline
        ? new Date(`${deadline}T12:00:00`).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Deadline belum diisi";
    const description = getEditorValue('[data-editor="description"]');
    const requirements = getEditorValue('[data-editor="requirements"]');
    const benefits = getEditorValue('[data-editor="benefits"]');
    const previewDescription = form.querySelector("#jobPreviewDescription");
    const previewRequirements = form.querySelector("#jobPreviewRequirements");
    const previewBenefits = form.querySelector("#jobPreviewBenefits");
    if (previewDescription)
      previewDescription.innerHTML = renderJobDescription(
        description || "Belum ada deskripsi.",
      );
    if (previewRequirements)
      previewRequirements.innerHTML = renderJobDescription(
        requirements || "Belum ada kualifikasi.",
      );
    if (previewBenefits)
      previewBenefits.innerHTML = renderJobDescription(
        benefits || "Belum ada benefit.",
      );
    const tags = [...form.querySelectorAll(".tag-pill")]
      .map((tag) => tag.dataset.tagValue || tag.textContent.trim())
      .filter(Boolean);
    const previewSkills = form.querySelector("#jobPreviewSkills");
    if (previewSkills) {
      previewSkills.innerHTML = tags.length
        ? tags
            .map(
              (skill) =>
                `<span style="padding:.4rem .65rem;border-radius:999px;background:#edf3ff;color:#163d7d;font-size:12px;font-weight:600;">${escapeHtml(skill)}</span>`,
            )
            .join("")
        : '<span style="color:var(--muted);">Belum ada skill.</span>';
    }
  };
  const activateEditorButtons = () => {
    form.querySelectorAll("[data-rich-action]").forEach((button) => {
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", (event) => {
        const editor = button.closest(
          ".job-editor-toolbar",
        )?.nextElementSibling;
        const action = button.dataset.richAction;
        if (!editor) return;
        editor.focus();
        if (action === "createLink") {
          const url = window.prompt("Masukkan URL link:", "https://");
          if (url) document.execCommand("createLink", false, url);
        } else if (action === "insertUnorderedList") {
          document.execCommand("insertUnorderedList", false, null);
        } else if (action === "insertOrderedList") {
          document.execCommand("insertOrderedList", false, null);
        } else {
          document.execCommand(action, false, null);
        }
        saveDraftState();
        resetPreview();
      });
    });
  };
  const addQuestionCard = () => {
    const list = form.querySelector("#jobScreeningList");
    const count = list.querySelectorAll(".job-screening-card").length + 1;
    const card = document.createElement("div");
    card.className = "job-screening-card";
    card.draggable = true;
    card.dataset.questionId = `q${Date.now()}`;
    card.style.padding = "1rem";
    card.style.border = "1px solid #dfe7e1";
    card.style.borderRadius = "12px";
    card.style.background = "#f8faf9";
    card.style.display = "grid";
    card.style.gap = ".8rem";
    card.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;"><strong>Pertanyaan ${count}</strong><button type="button" class="btn btn-outline btn-small" data-remove-question><i class="fa-solid fa-trash"></i></button></div><div class="form-row"><label>Pertanyaan</label><input data-question-prompt placeholder="Contoh: Apakah Anda bersedia bekerja shift malam?"></div><div class="form-row"><label>Jenis pertanyaan</label><select data-question-type><option value="yes_no">Ya / Tidak</option><option value="multiple_choice">Pilihan Ganda</option><option value="dropdown">Dropdown</option><option value="short_answer">Jawaban Singkat</option><option value="long_answer">Jawaban Panjang</option><option value="number">Angka</option></select></div><div class="form-row" hidden><label>Opsi pilihan</label><input data-question-options></div><div class="form-row"><label>Wajib dijawab</label><input type="checkbox" data-question-required checked></div>`;
    list.appendChild(card);
    saveDraftState();
  };
  form.addEventListener("input", () => {
    saveDraftState();
    resetPreview();
  });
  form.addEventListener("change", (event) => {
    if (event.target.matches("[data-question-type]")) {
      const card = event.target.closest(".job-screening-card");
      const row = card
        ?.querySelector("[data-question-options]")
        ?.closest(".form-row");
      if (row)
        row.hidden = !["multiple_choice", "dropdown"].includes(
          event.target.value,
        );
    }
    saveDraftState();
    resetPreview();
  });
  form.addEventListener("click", (event) => {
    const removeQuestion = event.target.closest("[data-remove-question]");
    if (removeQuestion) {
      removeQuestion.closest(".job-screening-card")?.remove();
      saveDraftState();
      return;
    }
    const tagRemove = event.target.closest(".tag-remove");
    if (tagRemove) {
      tagRemove.closest(".tag-pill")?.remove();
      saveDraftState();
      resetPreview();
      return;
    }
    const addQuestionButton = event.target.closest("#jobAddScreeningQuestion");
    if (addQuestionButton) {
      addQuestionCard();
      return;
    }
    if (event.target.closest("#jobWizardBack")) {
      wizardState.step = Math.max(0, wizardState.step - 1);
      renderTitle();
      form.querySelectorAll(".job-wizard-step").forEach((step, index) => {
        step.style.display = index === wizardState.step ? "block" : "none";
      });
      return;
    }
    if (event.target.closest("#jobWizardNext")) {
      if (!validateStep(wizardState.step)) return;
      wizardState.step = Math.min(stepTitles.length - 1, wizardState.step + 1);
      renderTitle();
      form.querySelectorAll(".job-wizard-step").forEach((step, index) => {
        step.style.display = index === wizardState.step ? "block" : "none";
      });
      resetPreview();
      return;
    }
    if (event.target.closest("#jobWizardDraft")) {
      saveDraftState();
      closeModal();
      Swal.fire({
        icon: "success",
        title: "Draft lowongan tersimpan",
        text: "Lowongan masih dalam bentuk draft dan siap diedit kembali.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    if (event.target.closest("#jobWizardPublish")) {
      const onboarding = getCompanyOnboardingState();
      if (!onboarding.hrdActive || !onboarding.ready || !getCompanyPlan()) {
        toast(
          onboarding.hrdActive
            ? "Paket aktif dan seluruh tahap onboarding wajib selesai sebelum lowongan dipublikasikan."
            : "Publikasi lowongan hanya tersedia untuk akun perusahaan dengan role HRD aktif.",
        );
        closeModal();
        go(
          onboarding.hrdActive && onboarding.verified ? "pricing" : "dashboard",
        );
        return;
      }
      if (!validateStep(wizardState.step)) return;
      const data = {
        title: form.querySelector('[name="title"]').value.trim(),
        position: form.querySelector('[name="position"]').value.trim(),
        category: form.querySelector('[name="category"]').value,
        location:
          form.querySelector('[name="location"]').value.trim() || companyName,
        deadline: form.querySelector('[name="deadline"]').value,
      };
      if (
        !data.title ||
        !data.position ||
        !data.category ||
        !data.location ||
        !data.deadline
      ) {
        toast(
          "Semua data utama lowongan harus lengkap sebelum dipublikasikan.",
        );
        return;
      }
      const skillValues = [...form.querySelectorAll(".tag-pill")]
        .map((tag) => tag.dataset.tagValue || tag.textContent.trim())
        .filter(Boolean);
      const jobSalaryMin = Number(
        form.querySelector('[name="salaryMin"]').value || 0,
      );
      const jobSalaryMax = Number(
        form.querySelector('[name="salaryMax"]').value || 0,
      );
      const jobSalaryText = form.querySelector('[name="salaryHidden"]').checked
        ? "Gaji dirahasiakan"
        : [jobSalaryMin, jobSalaryMax]
            .filter(Boolean)
            .map((value) => `Rp${new Intl.NumberFormat("id-ID").format(value)}`)
            .join(" - ") || "Gaji sesuai pasar";
      const job = {
        id: existingJob?.id || `JH-${Date.now()}`,
        companyId: existingJob?.companyId || billingCompanyId(),
        company: existingJob?.company || companyName,
        title: data.title,
        department: form.querySelector('[name="department"]').value.trim(),
        category: data.category,
        industry: form.querySelector('[name="industry"]').value.trim(),
        loc: data.location,
        type: form.querySelector('[name="type"]').value,
        experience:
          form.querySelector('[name="experienceYears"]').value.trim() ||
          "Semua pengalaman",
        minimumEducation: form.querySelector('[name="education"]').value,
        salaryMin: jobSalaryMin,
        salaryMax: jobSalaryMax,
        salaryText: jobSalaryText,
        skills: skillValues,
        description: getEditorValue('[data-editor="description"]'),
        responsibilities: getEditorValue('[data-editor="responsibilities"]')
          .split(/\n|•\s*/)
          .map((item) => item.trim())
          .filter(Boolean),
        requirements: getEditorValue('[data-editor="requirements"]')
          .split(/\n|•\s*/)
          .map((item) => item.trim())
          .filter(Boolean),
        benefits: getEditorValue('[data-editor="benefits"]')
          .split(/\n|•\s*/)
          .map((item) => item.trim())
          .filter(Boolean),
        screeningEnabled: form.querySelector('[name="screeningEnabled"]')
          .checked,
        deadline: data.deadline,
        expiresAt: new Date(`${data.deadline}T23:59:59`).toISOString(),
        status: "pending_review",
        urgent: Boolean(false),
        posted: "Baru saja",
        postedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
        screeningQuestions: [...form.querySelectorAll(".job-screening-card")]
          .map((card) => ({
            id: card.dataset.questionId || crypto.randomUUID(),
            prompt:
              card.querySelector("[data-question-prompt]")?.value.trim() || "",
            type:
              card.querySelector("[data-question-type]")?.value ||
              "short_answer",
            options: (
              card.querySelector("[data-question-options]")?.value || ""
            )
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            required:
              card.querySelector("[data-question-required]")?.checked || false,
          }))
          .filter((item) => item.prompt),
        quantity: Number(form.querySelector('[name="quantity"]').value || 1),
        careerLevel: form.querySelector('[name="careerLevel"]').value,
        industry: form.querySelector('[name="industry"]').value.trim(),
        salaryHidden: form.querySelector('[name="salaryHidden"]').checked,
        ageMin: form.querySelector('[name="ageMin"]').value,
        ageMax: form.querySelector('[name="ageMax"]').value,
        gender: form.querySelector('[name="gender"]').value,
        certificate: form.querySelector('[name="certificate"]').value.trim(),
        language: form.querySelector('[name="language"]').value.trim(),
        sim: form.querySelector('[name="sim"]').value,
        major: form.querySelector('[name="major"]').value.trim(),
        logo: existingJob?.logo || companyName.slice(0, 2).toUpperCase(),
        tone: existingJob?.tone || "",
        address_data: window.JobHubAddress?.getValue?.() || {},
      };
      Promise.resolve(syncCompanyJob(job))
        .then(async () => {
          const index = jobs.findIndex(
            (item) => String(item.id) === String(job.id),
          );
          if (index >= 0) jobs[index] = job;
          else jobs.unshift(job);
          writeStoredJson("jobhub-company-jobs", jobs);
          localStorage.removeItem("jobhub-company-job-draft");
          closeModal();
          renderHome();
          renderDashboard();
          await Swal.fire({
            icon: "success",
            title: "Lowongan berhasil dipublikasikan",
            text: "Status lowongan menjadi Pending Review dan akan tampil di dashboard perusahaan.",
            confirmButtonText: "Lanjut ke dashboard",
          });
          go("dashboard");
        })
        .catch((error) => {
          toast(
            `Lowongan gagal dipublikasikan: ${error.message || "periksa koneksi Supabase."}`,
          );
        });
      return;
    }
    if (event.target.closest("#jobSkillInput")) return;
  });
  const skillInput = form.querySelector("#jobSkillInput");
  if (skillInput) {
    skillInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addTag(skillInput.value);
        skillInput.value = "";
        saveDraftState();
      }
    });
  }
  form.querySelectorAll(".job-editor").forEach((editor) => {
    editor.addEventListener("input", () => {
      saveDraftState();
      resetPreview();
    });
    editor.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" || event.shiftKey) return;
      const anchor = window.getSelection()?.anchorNode;
      const listItem =
        anchor?.nodeType === Node.ELEMENT_NODE
          ? anchor.closest("li")
          : anchor?.parentElement?.closest("li");
      if (listItem) return;
      event.preventDefault();
      document.execCommand("insertUnorderedList");
      saveDraftState();
      resetPreview();
    });
  });
  if (window.JobHubAddress) {
    const holder = form.querySelector("#jobWizardAddressHolder");
    if (holder)
      window.JobHubAddress.mount(holder, existingJob?.address_data || {});
  }
  renderTitle();
  resetPreview();
  activateEditorButtons();
  form.querySelectorAll(".job-screening-card").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.questionId);
    });
    card.addEventListener("dragover", (event) => event.preventDefault());
    card.addEventListener("drop", (event) => {
      event.preventDefault();
      const sourceId = event.dataTransfer.getData("text/plain");
      const source = form.querySelector(`[data-question-id="${sourceId}"]`);
      if (!source || source === card) return;
      const list = form.querySelector("#jobScreeningList");
      list.insertBefore(source, card.nextSibling);
      saveDraftState();
    });
  });
}
function legacyOpenNewJob(editJobId = "") {
  return;
  const existingJob = editJobId
    ? companyJobs().find((job) => job.id === editJobId)
    : null;
  if (editJobId && !existingJob) {
    toast("Lowongan tidak ditemukan atau bukan milik perusahaan Anda.");
    return;
  }
  const plan = getCompanyPlan(),
    activeCount = countActiveCompanyJobs();
  if (!existingJob && !plan) {
    toast("Aktifkan paket perusahaan sebelum memposting lowongan.");
    go("pricing");
    return;
  }
  if (!existingJob && activeCount >= plan.activeJobs) {
    toast(
      `Batas paket ${plan.name} tercapai (${plan.activeJobs} lowongan aktif). Upgrade paket untuk menambah lowongan.`,
    );
    go("pricing");
    return;
  }
  if (
    !existingJob &&
    plan.freeTrial &&
    countCompanyPublishedJobs() >= plan.postedJobs
  ) {
    toast(
      "Paket Gratis 21 Hari hanya mencakup 1 lowongan selama masa trial. Upgrade paket untuk memposting lagi.",
    );
    go("pricing");
    return;
  }
  openModal(
    existingJob ? "Edit lowongan" : "Buat lowongan",
    `<form><div class="form-row"><label>Judul pekerjaan</label><input required name="title" id="jobTitle" placeholder="Contoh: Product Designer"></div><div class="form-row"><label>Departemen</label><input name="department" id="jobDepartment" placeholder="Contoh: Produk atau Operasional"></div><div class="form-row"><label>Kategori</label><select name="category"></select></div><div class="form-row"><label>Lokasi</label><input required name="location" placeholder="Kota atau remote"></div><div class="form-row"><label>Jenis pekerjaan</label><select name="type"><option>Full Time</option><option>Part Time</option><option>Freelance</option><option>Remote</option></select></div><div class="form-row"><label>Pengalaman minimum</label><input name="experience" id="jobExperience" placeholder="Contoh: 2 tahun atau Fresh Graduate"></div><div class="form-row"><label>Pendidikan minimum</label><select name="minimumEducation"><option value="">Tidak ditentukan</option><option>Tidak bersekolah</option><option>SD</option><option>SMP</option><option>SMK</option><option>SMA</option><option>D3</option><option>S1</option><option>S2</option><option>S3</option></select></div><div class="form-row"><label>Rentang gaji</label><input name="salaryText" placeholder="Rp7.000.000 sampai Rp10.000.000"></div><div class="form-row"><label>Skill yang dibutuhkan</label><input name="skills" id="jobSkills" placeholder="React, komunikasi, perencanaan"></div><div class="form-row"><label>Tanggung jawab utama</label><textarea name="responsibilitiesInput" id="jobResponsibilities" placeholder="Satu tanggung jawab per baris"></textarea></div><div class="generator-panel"><div class="generator-heading"><div><strong>AI Job Description Generator</strong><p>Draf dibuat dari posisi, departemen, skill, pengalaman, dan tanggung jawab.</p></div><button class="btn btn-outline btn-small" type="button" id="generateJobDescription"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Generate Deskripsi Dengan AI</button></div><p class="form-note">Mode demo lokal. AI sungguhan memerlukan API backend.</p></div><div class="form-row"><label>Job description</label><textarea required name="description" id="jobDescription" placeholder="Deskripsi pekerjaan"></textarea></div><div class="form-row"><label>Qualification</label><textarea name="requirements" id="jobQualifications" placeholder="Kualifikasi kandidat"></textarea></div><div class="form-row"><label>Benefit</label><textarea name="benefits" id="jobBenefits" placeholder="Benefit posisi"></textarea></div><section class="screening-builder"><div class="section-head"><div><h3>Pertanyaan screening</h3><p>Jawaban benar mendapat poin untuk scoring kandidat.</p></div><button class="btn btn-outline btn-small" type="button" id="addScreeningQuestion"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah pertanyaan</button></div><div id="screeningQuestions"></div></section><button class="btn btn-outline" type="button" id="saveDraft">Simpan draft</button> <button class="btn" type="submit">${existingJob ? "Simpan perubahan" : "Posting lowongan"}</button></form>`,
    async (data) => {
      const salaryText = (
        data.get("salaryText") || "Gaji dapat dinegosiasikan"
      ).replace(/\s*[-–—−]\s*/g, " sampai ");
      const screeningQuestions = $$("#screeningQuestions .screening-question")
        .map((card) => ({
          id: card.dataset.questionId,
          prompt: card.querySelector("[data-question-prompt]").value.trim(),
          type: card.querySelector("[data-question-type]").value,
          options: getLines(
            card.querySelector("[data-question-options]").value,
          ),
          correctAnswer: card
            .querySelector("[data-question-answer]")
            .value.trim(),
          points:
            Number(card.querySelector("[data-question-points]").value) || 10,
        }))
        .filter((question) => question.prompt && question.correctAnswer);
      const companyName = getCurrentCompanyName();
      if (!existingJob && countActiveCompanyJobs() >= plan.activeJobs) {
        closeModal();
        toast(
          `Batas paket ${plan.name} tercapai. Upgrade paket untuk memposting lowongan tambahan.`,
        );
        go("pricing");
        return;
      }
      if (
        !existingJob &&
        plan.freeTrial &&
        countCompanyPublishedJobs() >= plan.postedJobs
      ) {
        closeModal();
        toast(
          "Paket Gratis 21 Hari hanya mencakup 1 lowongan selama masa trial. Upgrade paket untuk memposting lagi.",
        );
        go("pricing");
        return;
      }
      const salaryAmounts = (salaryText.match(/\d[\d.,]*/g) || []).map(
        (value) => parseSalaryAmount(value, salaryText),
      );
      const addressData = window.JobHubAddress?.getValue() || {};
      const jobLocation =
        data.get("type") === "Remote"
          ? "Remote"
          : [addressData.regencyName, addressData.provinceName]
              .filter(Boolean)
              .join(", ") || String(data.get("location") || "").trim();
      if (!jobLocation)
        throw new Error(
          "Pilih kabupaten/kota untuk menentukan lokasi lowongan.",
        );
      const postedAt =
        existingJob?.postedAt ||
        existingJob?.posted_at ||
        new Date().toISOString();
      const job = {
        ...existingJob,
        id: existingJob?.id || `JH-${Date.now()}`,
        companyId: existingJob?.companyId || billingCompanyId(),
        title: data.get("title"),
        company: existingJob?.company || companyName,
        department: data.get("department"),
        loc: jobLocation,
        address_data: addressData,
        category: data.get("category"),
        salary: salaryAmounts[0] || 0,
        salaryMax: salaryAmounts[salaryAmounts.length - 1] || 0,
        salaryText,
        type: data.get("type"),
        experience: data.get("experience") || "Semua pengalaman",
        minimumEducation: data.get("minimumEducation"),
        posted: existingJob?.posted || "Baru saja",
        postedAt,
        urgent: data.get("urgent") === "on",
        status: existingJob?.status || "active",
        logo:
          existingJob?.logo ||
          companyName
            .split(/\s+/)
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
        tone: existingJob?.tone || "",
        skills: getLines(data.get("skills")),
        description: data.get("description"),
        responsibilities: getLines(data.get("responsibilitiesInput")),
        requirements: getLines(data.get("requirements")),
        benefits: getLines(data.get("benefits")),
        screeningQuestions,
      };
      try {
        await syncCompanyJob(job);
      } catch (error) {
        toast(
          `Lowongan gagal disimpan ke workspace perusahaan: ${error.message || "periksa kebijakan RLS dan tabel jobhub_jobs."}`,
        );
        return;
      }
      if (existingJob)
        jobs[jobs.findIndex((item) => item.id === existingJob.id)] = job;
      else jobs.unshift(job);
      writeStoredJson("jobhub-company-jobs", jobs);
      closeModal();
      renderHome();
      renderDashboard();
      searchState = { keyword: "", location: "", category: job.category || "" };
      go("jobs");
      toast(
        existingJob
          ? "Perubahan lowongan berhasil disimpan dan tampil di daftar."
          : "Lowongan berhasil diposting dan tampil di daftar.",
      );
    },
  );
  $("#modalBackdrop .modal")?.classList.add("job-description-modal");
  const descriptionField = $("#jobDescription");
  if (descriptionField) {
    descriptionField.rows = 9;
    descriptionField.classList.add("job-description-input");
    descriptionField.insertAdjacentHTML(
      "beforebegin",
      '<div class="job-description-toolbar"><span>Jelaskan peran dan tujuan posisi. Gunakan daftar untuk poin-poin.</span><button class="btn btn-outline btn-small" type="button" id="jobDescriptionBullets"><i class="fa-solid fa-list-ul" aria-hidden="true"></i> Tambah bullet</button></div>',
    );
    $("#jobDescriptionBullets").addEventListener("click", () => {
      const text = descriptionField.value;
      const start = descriptionField.selectionStart,
        end = descriptionField.selectionEnd;
      const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const lineBreak = text.indexOf("\n", Math.max(start, end));
      const from = start === end ? lineStart : start;
      const to =
        start === end ? (lineBreak < 0 ? text.length : lineBreak) : end;
      const formatted = text
        .slice(from, to)
        .split(/\r?\n/)
        .map((line) =>
          line.trim() ? `• ${line.replace(/^\s*(?:[•*-]\s*)+/, "")}` : line,
        )
        .join("\n");
      descriptionField.setRangeText(formatted, from, to, "select");
      descriptionField.focus();
    });
  }
  const oldLocationField = $('#modalBody [name="location"]');
  if (oldLocationField) {
    const previousLocation = oldLocationField.value;
    oldLocationField.closest(".form-row").outerHTML =
      '<div class="form-row"><strong>Lokasi pekerjaan</strong><div id="jobAddressForm" class="job-address-container"></div><input type="hidden" name="location"></div>';
    const locationInput = $('#modalBody [name="location"]');
    locationInput.value = previousLocation;
    window.JobHubAddress?.mount(
      $("#jobAddressForm"),
      existingJob?.address_data || {},
    );
  }
  $('#modalBody select[name="category"]').innerHTML = categories
    .map(([name]) => `<option>${name}</option>`)
    .join("");
  if (existingJob) {
    const form = $("#modalBody form");
    for (const [name, value] of Object.entries({
      title: existingJob.title,
      department: existingJob.department || "",
      category: existingJob.category,
      location: existingJob.loc,
      type: existingJob.type,
      experience: existingJob.experience,
      minimumEducation: existingJob.minimumEducation || "",
      salaryText: existingJob.salaryText,
      skills: (existingJob.skills || []).join(", "),
      responsibilitiesInput: (existingJob.responsibilities || []).join("\n"),
      description: existingJob.description,
      requirements: (existingJob.requirements || []).join("\n"),
      benefits: (existingJob.benefits || []).join("\n"),
    })) {
      if (form.elements.namedItem(name))
        form.elements.namedItem(name).value = value || "";
    }
  }
  $("#saveDraft").insertAdjacentHTML(
    "beforebegin",
    '<div class="form-row job-urgent-option"><label><input type="checkbox" name="urgent"> Tandai lowongan ini butuh segera</label><small class="form-note">Lowongan baru dan prioritas segera ditandai titik hijau berkedip di daftar.</small></div>',
  );
  $('#modalBody [name="urgent"]').checked = Boolean(existingJob?.urgent);
  const screeningSet = existingJob
    ? existingJob.screeningQuestions || []
    : [{}];
  $("#screeningQuestions").insertAdjacentHTML(
    "beforeend",
    screeningSet.map(createScreeningQuestion).join(""),
  );
  $("#addScreeningQuestion").addEventListener("click", () =>
    $("#screeningQuestions").insertAdjacentHTML(
      "beforeend",
      createScreeningQuestion(),
    ),
  );
  $("#screeningQuestions").addEventListener("change", (event) => {
    if (event.target.matches("[data-question-type]"))
      event.target
        .closest(".screening-question")
        .querySelector(".choices-row").hidden =
        event.target.value !== "multiple_choice";
  });
  $("#screeningQuestions").addEventListener("click", (event) => {
    if (event.target.closest(".remove-question"))
      event.target.closest(".screening-question").remove();
  });
  $("#generateJobDescription").addEventListener("click", () => {
    const title = $("#jobTitle").value.trim();
    const department = $("#jobDepartment").value.trim();
    const skills = getLines($("#jobSkills").value);
    const experience =
      $("#jobExperience").value.trim() || "pengalaman yang relevan";
    const responsibilities = getLines($("#jobResponsibilities").value);
    if (!title) {
      toast("Isi nama posisi terlebih dahulu.");
      $("#jobTitle").focus();
      return;
    }
    const skillText = skills.length
      ? skills.join(", ")
      : "keahlian yang relevan";
    $("#jobDescription").value =
      `Kami mencari ${title}${department ? ` untuk tim ${department}` : ""}. Kandidat akan berkontribusi pada tujuan tim melalui pekerjaan berkualitas, kolaborasi lintas fungsi, dan perbaikan berkelanjutan. Posisi ini sesuai bagi kandidat dengan ${experience} serta minat pada ${skillText}.`;
    if (!responsibilities.length)
      $("#jobResponsibilities").value =
        `Mengelola pekerjaan sebagai ${title}.\nBerkolaborasi dengan tim ${department || "terkait"} untuk mencapai target.\nMenjaga kualitas hasil kerja dan melaporkan perkembangan secara berkala.`;
    $("#jobQualifications").value =
      `Memiliki ${experience} di bidang terkait.\nMenguasai ${skillText}.\nMampu berkomunikasi dan bekerja sama dengan baik.`;
    $("#jobBenefits").value =
      "Gaji kompetitif sesuai pengalaman.\nKesempatan belajar dan pengembangan karier.\nLingkungan kerja yang kolaboratif.";
    toast("Draf deskripsi berhasil dibuat dari input lowongan.");
  });
  $("#saveDraft").onclick = () => {
    closeModal();
    toast("Draft lowongan tersimpan untuk sesi demo.");
  };
}
document.addEventListener("click", (e) => {
  const migrateCandidateCvs = e.target.closest("[data-migrate-candidate-cvs]");
  if (migrateCandidateCvs) {
    migrateCandidateCvBatch(migrateCandidateCvs);
    return;
  }
  const dashboardSignOut = e.target.closest("[data-dashboard-signout]");
  if (dashboardSignOut) {
    supabaseClient.auth
      .signOut()
      .then(({ error }) => {
        if (error) throw error;
        go("home");
        toast("Anda telah keluar dari dashboard perusahaan.");
      })
      .catch((error) =>
        toast(`Logout gagal: ${error.message || "coba lagi."}`),
      );
    return;
  }
  const adminSectionButton = e.target.closest("[data-admin-section]");
  if (adminSectionButton) {
    const section = adminSectionButton.dataset.adminSection;
    const panelIds = {
      dashboard: "adminDashboardPanel",
      media: "adminMediaPanel",
      verifications: "adminVerificationsPanel",
      jobs: "adminJobsPanel",
      companies: "adminCompaniesPanel",
      candidates: "adminCandidatesPanel",
      certifications: "adminCertificationsPanel",
      billing: "adminBillingPanel",
      users: "adminUsersPanel",
    };
    const activeNavButton = $$(".admin-sidebar [data-admin-section]").find(
      (button) => button.dataset.adminSection === section,
    );
    $$(".admin-sidebar [data-admin-section]").forEach((button) =>
      button.classList.toggle("is-active", button === activeNavButton),
    );
    $$(".admin-panel-view").forEach((panel) =>
      panel.classList.toggle("is-active", panel.id === panelIds[section]),
    );
    loadAdminSection(section).catch((error) =>
      toast(
        `Bagian admin gagal dimuat: ${error.message || "periksa akses Supabase."}`,
      ),
    );
    return;
  }
  const adminPeriod = e.target.closest("[data-admin-period]");
  if (adminPeriod) {
    adminAnalyticsPeriod = adminPeriod.dataset.adminPeriod;
    $$("[data-admin-period]").forEach((button) =>
      button.classList.toggle("is-active", button === adminPeriod),
    );
    renderAdminAnalytics();
    return;
  }
  const adminRefresh = e.target.closest("[data-admin-refresh]");
  if (adminRefresh) {
    loadAdminSection(adminRefresh.dataset.adminRefresh).catch((error) =>
      toast(
        `Data admin gagal dimuat: ${error.message || "periksa akses Supabase."}`,
      ),
    );
    return;
  }
  const adminJobAction = e.target.closest("[data-admin-job-action]");
  if (adminJobAction) {
    adminJobAction.disabled = true;
    handleAdminJobAction(
      adminJobAction.dataset.adminJobId,
      adminJobAction.dataset.adminJobAction,
    )
      .catch((error) =>
        toast(
          `Lowongan gagal diperbarui: ${error.message || "periksa kebijakan RLS."}`,
        ),
      )
      .finally(() => {
        if (adminJobAction.isConnected) adminJobAction.disabled = false;
      });
    return;
  }
  const adminCandidateToggle = e.target.closest(
    "[data-admin-candidate-toggle]",
  );
  if (adminCandidateToggle) {
    adminCandidateToggle.disabled = true;
    handleAdminCandidateToggle(
      adminCandidateToggle.dataset.adminCandidateToggle,
      adminCandidateToggle.dataset.published === "true",
    )
      .catch((error) =>
        toast(
          `Profil kandidat gagal diperbarui: ${error.message || "periksa kebijakan RLS."}`,
        ),
      )
      .finally(() => {
        if (adminCandidateToggle.isConnected)
          adminCandidateToggle.disabled = false;
      });
    return;
  }
  const adminUserToggle = e.target.closest("[data-admin-user-toggle]");
  if (adminUserToggle) {
    adminUserToggle.disabled = true;
    setAdminUserBlocked(
      adminUserToggle.dataset.adminUserToggle,
      adminUserToggle.dataset.banned !== "true",
    )
      .catch((error) =>
        toast(
          `Status pengguna gagal diubah: ${error.message || "pastikan Edge Function admin-user-management sudah dideploy."}`,
        ),
      )
      .finally(() => {
        if (adminUserToggle.isConnected) adminUserToggle.disabled = false;
      });
    return;
  }
  if (e.target.closest("#adminUsersPrevious")) {
    if (adminUserPage > 1)
      loadAdminUsers(adminUserPage - 1).catch((error) =>
        toast(
          `Daftar pengguna gagal dimuat: ${error.message || "periksa Edge Function."}`,
        ),
      );
    return;
  }
  if (e.target.closest("#adminUsersNext")) {
    if (adminUserPage * 50 < adminUserTotal)
      loadAdminUsers(adminUserPage + 1).catch((error) =>
        toast(
          `Daftar pengguna gagal dimuat: ${error.message || "periksa Edge Function."}`,
        ),
      );
    return;
  }
  if (
    e.target.closest("#adminSignOut,#adminSignOutSecondary,#adminSetupSignOut")
  ) {
    if (!supabaseClient) return;
    supabaseClient.auth
      .signOut()
      .then(({ error }) => {
        if (error) throw error;
        go("home");
        toast("Anda telah keluar dari panel admin.");
      })
      .catch((error) =>
        toast(`Logout gagal: ${error.message || "coba lagi."}`),
      );
    return;
  }
  const spotlightAction = e.target.closest("[data-spotlight-action]");
  if (spotlightAction) {
    handleSpotlightAction(
      spotlightAction.dataset.spotlightAction,
      spotlightAction.dataset.postId,
      spotlightAction,
    ).catch((error) =>
      toast(
        `Aksi kandidat gagal: ${error.message || "periksa izin akun dan koneksi."}`,
      ),
    );
    return;
  }
  const certificationReview = e.target.closest("[data-cert-review]");
  if (certificationReview) {
    handleSpotlightReview(
      certificationReview.dataset.certReview,
      certificationReview.dataset.certId,
      certificationReview.dataset.postId,
    ).catch((error) =>
      toast(
        `Verifikasi sertifikat gagal: ${error.message || "periksa izin admin."}`,
      ),
    );
    return;
  }
  const featuredReview = e.target.closest("[data-featured-review]");
  if (featuredReview) {
    handleFeaturedSubmissionReview(
      featuredReview.dataset.featuredReview,
      featuredReview.dataset.postId,
    ).catch((error) =>
      toast(
        `Review Talent Spotlight gagal: ${error.message || "periksa izin admin."}`,
      ),
    );
    return;
  }
  const editCvWithCanva = e.target.closest("#editCvWithCanva");
  if (editCvWithCanva) {
    editCvWithCanva.disabled = true;
    startCanvaCvEdit(activeCanvaApplyJobId)
      .catch((error) =>
        toast(
          `Canva tidak dapat dibuka: ${error.message || "periksa konfigurasi Canva."}`,
        ),
      )
      .finally(() => {
        if (editCvWithCanva.isConnected) editCvWithCanva.disabled = false;
      });
    return;
  }
  const editCvFromProfile = e.target.closest("#editCvWithCanvaProfile");
  if (editCvFromProfile) {
    go("candidate-resume-studio");
    return;
  }
  const editCvFromWizard = e.target.closest("#editCvWithCanvaWizard");
  if (editCvFromWizard) {
    editCvFromWizard.disabled = true;
    startCanvaCvEdit("")
      .catch((error) =>
        toast(
          `Canva tidak dapat dibuka: ${error.message || "periksa konfigurasi Canva."}`,
        ),
      )
      .finally(() => {
        if (editCvFromWizard.isConnected) editCvFromWizard.disabled = false;
      });
    return;
  }
  if (e.target.closest("#spotlightPremiumPay")) {
    startFeaturedCheckout().catch((error) =>
      toast(
        `Checkout Featured gagal: ${error.message || "periksa konfigurasi Midtrans."}`,
      ),
    );
    return;
  }
  const submitCompanyVerification = e.target.closest(
    "[data-submit-company-verification]",
  );
  if (submitCompanyVerification) {
    openCompanyVerificationResubmission();
    return;
  }
  const resendCompanyConfirmation = e.target.closest(
    "[data-company-resend-confirmation]",
  );
  if (resendCompanyConfirmation) {
    const email = supabaseSession?.user?.email;
    if (email) requestAuthEmailResend(email, resendCompanyConfirmation, null);
    return;
  }
  const companyProfileButton = e.target.closest(
    "[data-complete-company-profile]",
  );
  if (companyProfileButton) {
    openCompanyProfileForm();
    return;
  }
  const accountTrigger = e.target.closest("#accountMenuTrigger");
  if (accountTrigger) {
    const dropdown = $("#accountMenuDropdown");
    const opening = dropdown.hidden;
    dropdown.hidden = !opening;
    accountTrigger.setAttribute("aria-expanded", String(opening));
    return;
  }
  if (!e.target.closest("#accountMenu")) closeAccountMenu();
  const inviteMember = e.target.closest("[data-manage-team]");
  if (inviteMember) {
    openInviteCompanyHr();
    return;
  }
  const removeDemoInvite = e.target.closest("[data-remove-demo-invite]");
  if (removeDemoInvite) {
    if (supabaseClient || !isCompanyOwner()) {
      toast("Undangan demo tidak dapat dikelola pada akun cloud.");
      return;
    }
    const invites = getDemoCompanyInvites().filter(
      (invite) =>
        invite.id !== removeDemoInvite.dataset.removeDemoInvite ||
        invite.companyId !== billingCompanyId(),
    );
    localStorage.setItem(DEMO_COMPANY_INVITES_KEY, JSON.stringify(invites));
    renderCompanyTeam();
    toast("Undangan demo dihapus.");
    return;
  }
  const deleteJob = e.target.closest("[data-delete-job]");
  if (deleteJob) {
    confirmDeleteCompanyJob(deleteJob.dataset.deleteJob);
    return;
  }
  const editJob = e.target.closest("[data-edit-job]");
  if (editJob) {
    openNewJob(editJob.dataset.editJob);
    return;
  }
  const schedule = e.target.closest("[data-schedule-interview]");
  if (schedule) {
    scheduleInterview(schedule.dataset.scheduleInterview);
    return;
  }
  const retryEmail = e.target.closest("[data-retry-interview-email]");
  if (retryEmail) {
    retryInterviewEmail(retryEmail.dataset.retryInterviewEmail);
    return;
  }
  const downloadCandidateCv = e.target.closest(
    "[data-candidate-application-cv]",
  );
  if (downloadCandidateCv) {
    openApplicationCvLink(
      downloadCandidateCv.dataset.candidateApplicationCv,
      downloadCandidateCv,
    );
    return;
  }
  const analyzeCv = e.target.closest("[data-analyze-cv]");
  if (analyzeCv) {
    openCandidateCv(analyzeCv.dataset.analyzeCv);
    return;
  }
  const signOut = e.target.closest("#atsSignOut, #headerSignOut");
  if (signOut && supabaseClient) {
    (async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        toast("Berhasil keluar.");
      } catch (error) {
        toast(`Tidak dapat keluar: ${error.message || "coba lagi."}`);
      }
    })();
    return;
  }
  const addAccountType = e.target.closest("[data-add-account-type]");
  if (addAccountType) {
    openAdditionalAccountForm(addAccountType.dataset.addAccountType);
    return;
  }
  const routeEl = e.target.closest("[data-route]");
  if (routeEl) {
    if (routeEl.dataset.route === "jobs" && !routeEl.dataset.category) {
      searchState = { keyword: "", location: "", category: "" };
      $$('#jobFilters input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
      if ($("#sortJobs")) $("#sortJobs").value = "newest";
    }
    e.preventDefault();
    closeAccountMenu();
    go(routeEl.dataset.route, routeEl.dataset.category);
    if (routeEl.dataset.category) {
      searchState.category = routeEl.dataset.category;
      renderJobs();
    }
    return;
  }
  const cat = e.target.closest("[data-category]");
  if (cat) {
    searchState = {
      keyword: "",
      location: "",
      category: cat.dataset.category,
    };
    go("jobs");
    return;
  }
  const jobEl = e.target.closest("[data-job]");
  if (jobEl) {
    go("detail", jobEl.dataset.job);
    return;
  }
  const companyProfileView = e.target.closest("[data-company-profile-view]");
  if (companyProfileView) {
    if (companyProfileView.closest(".job-detail-card"))
      openCompanyFromJob(companyProfileView.dataset.companyProfileView).catch(
        (error) =>
          toast(
            `Profil perusahaan gagal dibuka: ${error.message || "periksa direktori perusahaan."}`,
          ),
      );
    else
      openCompanyDirectoryProfile(
        companyProfileView.dataset.companyProfileView,
      );
    return;
  }
  const companyDirectoryJobs = e.target.closest("[data-company-jobs]");
  if (companyDirectoryJobs) {
    searchState = {
      keyword: companyDirectoryJobs.dataset.companyJobs,
      location: "",
      category: "",
    };
    go("jobs");
    return;
  }
  const companyFeaturedToggle = e.target.closest(
    "[data-company-directory-featured]",
  );
  if (companyFeaturedToggle) {
    companyFeaturedToggle.disabled = true;
    setCompanyDirectoryFeatured(
      companyFeaturedToggle.dataset.companyDirectoryFeatured,
      companyFeaturedToggle.dataset.featured !== "true",
    )
      .catch((error) =>
        toast(
          `Pilihan unggulan perusahaan gagal disimpan: ${error.message || "terapkan migration supabase/company-directory-public.sql."}`,
        ),
      )
      .finally(() => {
        if (companyFeaturedToggle.isConnected)
          companyFeaturedToggle.disabled = false;
      });
    return;
  }
  const companyVisibilityToggle = e.target.closest(
    "[data-company-directory-visibility]",
  );
  if (companyVisibilityToggle) {
    companyVisibilityToggle.disabled = true;
    setCompanyDirectoryVisibility(
      companyVisibilityToggle.dataset.companyDirectoryVisibility,
      companyVisibilityToggle.dataset.visible !== "true",
    )
      .catch((error) =>
        toast(
          `Visibilitas direktori perusahaan gagal disimpan: ${error.message || "terapkan migration supabase/company-directory-public.sql."}`,
        ),
      )
      .finally(() => {
        if (companyVisibilityToggle.isConnected)
          companyVisibilityToggle.disabled = false;
      });
    return;
  }
  const companySave = e.target.closest("[data-company-save]");
  if (companySave) {
    toggleFavoriteItem("company", companySave.dataset.companySave).catch(
      (error) =>
        toast(
          `Perusahaan tersimpan di perangkat, sinkronisasi akun gagal: ${error.message || "periksa tabel candidate_favorites."}`,
        ),
    );
    return;
  }
  const companyOpen = e.target.closest("[data-company-open]");
  if (companyOpen) {
    searchState = {
      keyword: companyOpen.dataset.companyOpen,
      location: "",
      category: "",
    };
    go("jobs");
    return;
  }
  const save = e.target.closest("[data-save]");
  if (save) {
    toggleFavoriteItem("job", save.dataset.save).catch((error) =>
      toast(
        `Lowongan tersimpan di perangkat, sinkronisasi akun gagal: ${error.message || "periksa tabel candidate_favorites."}`,
      ),
    );
    return;
  }
  const removeSavedJob = e.target.closest("[data-remove-saved-job]");
  if (removeSavedJob) {
    toggleFavoriteItem("job", removeSavedJob.dataset.removeSavedJob).catch(
      (error) =>
        toast(
          `Lowongan tidak dapat dihapus dari daftar: ${error.message || "periksa koneksi."}`,
        ),
    );
    return;
  }
  const apply = e.target.closest("[data-apply]");
  if (apply) {
    openApply(apply.dataset.apply).catch((error) =>
      toast(
        `Lamaran tidak dapat dibuka: ${error.message || "periksa koneksi."}`,
      ),
    );
    return;
  }
  const modal = e.target.closest("[data-modal]");
  if (modal) {
    const type = modal.dataset.modal;
    if (type === "newJob") {
      openNewJob();
      return;
    }
    if (type === "login" || type === "signup") {
      openAuthModal(type === "signup");
      return;
    }
    const titles = {
      editProfile: "Edit profil",
      addEducation: "Tambah pendidikan",
      addExperience: "Tambah pengalaman",
      addSkill: "Tambah keahlian",
      addPortfolio: "Tambah portfolio",
      editCompany: "Edit profil perusahaan",
    };
    openModal(
      titles[type] || "Perbarui informasi",
      `<form><div class="form-row"><label>Informasi</label><input required placeholder="Masukkan informasi"></div><button class="btn" type="submit">Simpan perubahan</button></form>`,
      () => {
        closeModal();
        toast("Perubahan tersimpan untuk sesi demo.");
      },
    );
    return;
  }
  const pay = e.target.closest("[data-pay]");
  if (pay) {
    startSubscriptionCheckout(pay.dataset.pay);
    return;
  }
  const activateTrial = e.target.closest("[data-activate-free-trial]");
  if (activateTrial) {
    activateCompanyFreeTrial(activateTrial);
    return;
  }
  const approve = e.target.closest("[data-approve]");
  if (approve) {
    approve.closest("tr").remove();
    toast(approve.dataset.approve + " disetujui.");
    return;
  }
  const reviewCompany = e.target.closest("[data-review-company]");
  if (reviewCompany) {
    reviewCompanyVerification(reviewCompany.dataset.reviewCompany).catch(
      (error) =>
        toast(
          `Dokumen tidak dapat dibuka: ${error.message || "periksa akses admin dan koneksi."}`,
        ),
    );
    return;
  }
  const retryCompanyNotification = e.target.closest(
    "[data-retry-company-notification]",
  );
  if (retryCompanyNotification) {
    retryCompanyNotification.disabled = true;
    retryCompanyVerificationNotification()
      .catch((error) =>
        toast(
          `Email admin belum terkirim: ${error.message || "periksa Edge Function dan konfigurasi email."}`,
        ),
      )
      .finally(() => {
        if (retryCompanyNotification.isConnected)
          retryCompanyNotification.disabled = false;
      });
    return;
  }
  const resubmitCompany = e.target.closest(
    "[data-resubmit-company-verification]",
  );
  if (resubmitCompany) {
    openCompanyVerificationResubmission();
    return;
  }
  const verificationAction = e.target.closest("[data-verification-action]");
  if (verificationAction) {
    if (supabaseClient && !isAdminSession()) {
      toast(
        "Hanya admin terautentikasi yang dapat menyetujui atau menolak verifikasi.",
      );
      return;
    }
    const note = $("#verificationReviewNote")?.value || "";
    setCompanyVerificationStatus(
      verificationAction.dataset.verificationUser,
      verificationAction.dataset.verificationAction,
      note,
    ).catch((error) =>
      toast(
        `Status verifikasi gagal disimpan: ${error.message || "periksa akses admin dan koneksi."}`,
      ),
    );
    return;
  }
  const messageApplication = e.target.closest("[data-message-application]");
  if (messageApplication) {
    if (isCandidateSession() && !isHrdSession()) {
      openCandidateChatPopup(messageApplication.dataset.messageApplication);
      return;
    }
    sessionStorage.setItem(
      "jobhub-open-message-application",
      messageApplication.dataset.messageApplication,
    );
    sessionStorage.removeItem("jobhub-message-job-filter");
    go("messages");
    return;
  }
  const jobMessagesButton = e.target.closest("[data-job-messages]");
  if (jobMessagesButton) {
    sessionStorage.setItem(
      "jobhub-message-job-filter",
      jobMessagesButton.dataset.jobMessages,
    );
    sessionStorage.removeItem("jobhub-open-message-application");
    go("messages");
    return;
  }
  const openChat = e.target.closest("[data-open-chat]");
  if (openChat) {
    const attachmentInput = $("#chatAttachment");
    if (attachmentInput?.files?.length) {
      attachmentInput.value = "";
      delete attachmentInput.dataset.applicationId;
    }
    activeMessageApplicationId = String(openChat.dataset.openChat);
    renderJobMessages(activeMessageApplicationId).catch((error) =>
      toast(`Percakapan gagal dibuka: ${error.message || "periksa koneksi."}`),
    );
    return;
  }
  const addTalent = e.target.closest("[data-add-talent]");
  if (addTalent) {
    openTalentForm();
    return;
  }
  const addFromPipeline = e.target.closest("[data-add-to-talent-pool]");
  if (addFromPipeline) {
    const application = getApplications().find(
      (item) => item.id === addFromPipeline.dataset.addToTalentPool,
    );
    if (!application) return;
    const existing = getTalentPool().find(
      (item) =>
        item.candidateId && item.candidateId === application.candidateId,
    );
    openTalentForm(existing?.id || "", application.id);
    return;
  }
  const editTalent = e.target.closest("[data-edit-talent]");
  if (editTalent) {
    openTalentForm(editTalent.dataset.editTalent);
    return;
  }
  const inviteTalent = e.target.closest("[data-invite-talent]");
  if (inviteTalent) {
    inviteTalentToJob(inviteTalent.dataset.inviteTalent);
    return;
  }
  const removeTalent = e.target.closest("[data-remove-talent]");
  if (removeTalent) {
    const candidate = getTalentPool().find(
      (item) => item.id === removeTalent.dataset.removeTalent,
    );
    if (!candidate) return;
    const candidates = getTalentPool().filter(
      (item) => item.id !== candidate.id,
    );
    saveTalentPool(candidates);
    renderDashboard();
    if (supabaseClient && isHrdSession()) {
      supabaseClient
        .from("jobhub_talent_pool")
        .delete()
        .eq("id", candidate.id)
        .eq("company_id", billingCompanyId())
        .then(({ error }) => {
          if (error)
            toast(
              `Kandidat dihapus lokal, tetapi sinkronisasi gagal: ${error.message}`,
            );
        });
    }
    toast(`${candidate.candidateName} dihapus dari Talent Pool.`);
    return;
  }
  const manageCategories = e.target.closest("[data-manage-talent-categories]");
  if (manageCategories) {
    manageTalentCategories();
    return;
  }
  const refreshCompanyAnalytics = e.target.closest(
    "[data-refresh-company-analytics]",
  );
  if (refreshCompanyAnalytics) {
    refreshCompanyAnalytics.disabled = true;
    loadCompanyRecruitmentAnalytics()
      .catch((error) =>
        toast(
          `Statistik rekrutmen gagal dimuat: ${error.message || "periksa migrasi Supabase."}`,
        ),
      )
      .finally(() => {
        if (refreshCompanyAnalytics.isConnected)
          refreshCompanyAnalytics.disabled = false;
      });
    return;
  }
  const analyticsPeriod = e.target.closest("[data-company-analytics-days]");
  if (analyticsPeriod) {
    companyRecruitmentDays =
      Number(analyticsPeriod.dataset.companyAnalyticsDays) || 30;
    $$("[data-company-analytics-days]").forEach((button) =>
      button.classList.toggle("is-active", button === analyticsPeriod),
    );
    loadCompanyRecruitmentAnalytics(companyRecruitmentDays).catch((error) =>
      toast(
        `Statistik rekrutmen gagal dimuat: ${error.message || "periksa migrasi Supabase."}`,
      ),
    );
    return;
  }
  const talentCategory = e.target.closest("[data-talent-category]");
  if (talentCategory) {
    activeTalentCategory = talentCategory.dataset.talentCategory;
    renderTalentPool();
    return;
  }
  const dash = e.target.closest("[data-dash]");
  if (dash) {
    showDashboardPanel(dash.dataset.dash);
  }
});
$("#heroSearch").addEventListener("submit", (e) => {
  e.preventDefault();
  searchState = {
    keyword: $("#searchKeyword").value.trim(),
    location: $("#searchLocation").value.trim(),
    category: $("#searchCategory").value,
  };
  go("jobs");
});
$("#sortJobs").addEventListener("change", renderJobs);
$("#candidateFeedForm").addEventListener("input", renderCandidateFeed);
$("#candidateFeedForm").addEventListener("change", renderCandidateFeed);
$("#candidateFeedForm").addEventListener("reset", () =>
  window.setTimeout(renderCandidateFeed, 0),
);
$("#candidateFeedSort").addEventListener("change", renderCandidateFeed);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (supabaseClient)
    loadPublishedCompanyJobs().catch((error) =>
      console.error("Published jobs could not refresh:", error),
    );
});
document.addEventListener("input", (event) => {
  if (event.target.id === "companyDirectorySearch") {
    window.clearTimeout(companyDirectorySearchTimer);
    companyDirectorySearchTimer = window.setTimeout(
      () =>
        searchCompanyDirectory(event.target.value).catch((error) =>
          toast(
            `Pencarian perusahaan gagal: ${error.message || "terapkan migration supabase/company-directory-public.sql."}`,
          ),
        ),
      250,
    );
  }
  if (event.target.matches("#adminJobsSearch,#adminJobsStatus"))
    renderAdminJobs();
  if (event.target.matches("#adminCandidatesSearch,#adminCandidatesVisibility"))
    renderAdminCandidates();
  if (event.target.matches("#adminUsersSearch")) renderAdminUsers();
});
document.addEventListener("change", (event) => {
  if (event.target.matches("#adminJobsStatus")) renderAdminJobs();
  if (event.target.matches("#adminCandidatesVisibility"))
    renderAdminCandidates();
  if (event.target.matches('#adminBrandingForm input[type="file"]')) {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewId =
      event.target.name === "logo"
        ? "#adminLogoPreview"
        : event.target.name === "banner"
          ? "#adminBannerPreview"
          : "#adminCompanyDirectoryBannerPreview";
    const preview = $(previewId);
    if (preview) {
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
      preview.parentElement
        .querySelector(".admin-branding-empty")
        ?.setAttribute("hidden", "");
    }
  }
  if (event.target.matches("[data-site-image-upload]")) {
    const file = event.target.files?.[0];
    if (!file) return;
    const key = event.target.dataset.siteImageUpload;
    const preview = $(`[data-site-image-preview="${key}"]`);
    if (preview) {
      preview.src = URL.createObjectURL(file);
      preview.hidden = false;
    }
    $(`[data-site-image-empty="${key}"]`)?.setAttribute("hidden", "");
  }
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "companyDirectorySearchForm") {
    event.preventDefault();
    searchCompanyDirectory($("#companyDirectorySearch")?.value).catch((error) =>
      toast(
        `Pencarian perusahaan gagal: ${error.message || "terapkan migration supabase/company-directory-public.sql."}`,
      ),
    );
    return;
  }
  if (event.target.id === "adminSiteImageForm") {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('[type="submit"]');
    const status = $("#adminSiteImageStatus");
    if (button) button.disabled = true;
    if (status) status.textContent = "Mengunggah gambar ke Supabase...";
    saveAdminSiteImages(form)
      .catch((error) => {
        const message = `Gambar gagal disimpan: ${error.message || "periksa migration dan kebijakan website-assets."}`;
        if (status) status.textContent = message;
        toast(message);
      })
      .finally(() => {
        if (button?.isConnected) button.disabled = false;
      });
    return;
  }
  if (event.target.id === "adminPackageForm") {
    event.preventDefault();
    const form = event.target;
    const button = form.querySelector('[type="submit"]');
    const status = $("#adminPackageStatus");
    if (button) button.disabled = true;
    if (status) status.textContent = "Menyimpan konfigurasi paket...";
    saveAdminPackages(form)
      .catch((error) => {
        if (status)
          status.textContent = `Gagal menyimpan paket: ${error.message || "periksa migrasi dan kebijakan admin Supabase."}`;
      })
      .finally(() => {
        if (button?.isConnected) button.disabled = false;
      });
    return;
  }
  if (event.target.id !== "adminBrandingForm") return;
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector('[type="submit"]');
  const status = $("#adminBrandingStatus");
  if (button) button.disabled = true;
  if (status) status.textContent = "Mengunggah aset website...";
  saveAdminWebsiteBranding(form)
    .catch((error) => {
      if (status)
        status.textContent = `Gagal menyimpan aset: ${error.message || "periksa bucket website-assets."}`;
    })
    .finally(() => {
      if (button?.isConnected) button.disabled = false;
    });
});
$("#closeModal").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", (e) => {
  if (e.target.id === "modalBackdrop" && !$("#authForm")) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !$("#authForm")) closeModal();
});
$("#chatForm").addEventListener("submit", sendJobMessage);
$("#candidateChatLauncher").addEventListener("click", () =>
  openCandidateChatPopup(),
);
$("#candidateChatPopupClose").addEventListener(
  "click",
  closeCandidateChatPopup,
);
$("#candidateChatPopup").addEventListener("click", (event) => {
  if (event.target.id === "candidateChatPopup") closeCandidateChatPopup();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && candidateChatPopupOpen)
    closeCandidateChatPopup();
});
$("#chatAttachment").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if ($("#chatInput").disabled) {
    toast("Pilih percakapan sebelum melampirkan file.");
    event.target.value = "";
    return;
  }
  if (
    !chatAttachmentMimeTypes.has(file.type) ||
    file.size > chatAttachmentMaxBytes
  ) {
    toast(
      file.size > chatAttachmentMaxBytes
        ? "Ukuran lampiran maksimal 10 MB."
        : "Format lampiran tidak didukung. Pilih gambar atau dokumen yang diizinkan.",
    );
    event.target.value = "";
    return;
  }
  event.target.dataset.applicationId = String(activeMessageApplicationId);
  $("#chatInput").placeholder = `Lampiran: ${file.name}`;
});
$("#conversationSearch").addEventListener("input", () => {
  window.clearTimeout(jobMessageSearchTimer);
  jobMessageSearchTimer = window.setTimeout(
    () =>
      renderJobMessages(activeMessageApplicationId).catch((error) =>
        console.warn("Conversation search failed:", error.message),
      ),
    250,
  );
});
$("#mobileMenu").addEventListener("click", () => {
  const nav = $(".nav-links");
  const open = nav.style.display === "flex";
  nav.style.display = open ? "none" : "flex";
  if (!open) {
    nav.style.position = "absolute";
    nav.style.top = "63px";
    nav.style.left = "15px";
    nav.style.right = "15px";
    nav.style.padding = "14px";
    nav.style.background = "#fff";
    nav.style.border = "1px solid var(--line)";
    nav.style.borderRadius = "7px";
    nav.style.zIndex = "5";
    nav.style.flexDirection = "column";
    nav.style.alignItems = "stretch";
  }
});
$(".nav-links").addEventListener("click", (event) => {
  if (window.innerWidth <= 760 && event.target.closest("button[data-route]"))
    $(".nav-links").removeAttribute("style");
});
window.addEventListener("resize", () => {
  $(".nav-links").removeAttribute("style");
});
setupCandidatePhotoUpload();
setupCandidateCvUpload();
if (typeof setupATSBoard === "function") setupATSBoard();
$("#spotlightSearch").addEventListener("input", renderTalentSpotlight);
$("#spotlightSort").addEventListener("change", renderTalentSpotlight);
$("#newsSearch").addEventListener("input", filterCareerNews);
$$(".news-filter").forEach((button) =>
  button.addEventListener("click", () => {
    activeNewsFilter = button.dataset.newsFilter || "all";
    $$(".news-filter").forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    filterCareerNews();
    $("#newsSearch").placeholder =
      activeNewsFilter === "umr"
        ? "Cari UMR / UMK menurut kota (contoh: Bandung)..."
        : "Cari panduan atau kata kunci topik...";
    loadCareerHeadlines();
  }),
);
filterCareerNews();
$("#newsSearch").placeholder = "Cari panduan atau kata kunci topik...";
$("#newsRefresh").addEventListener("click", () => loadCareerHeadlines(true));
$("#newsSearch").addEventListener("input", () => {
  filterCareerNews();
  window.clearTimeout(newsSearchTimer);
  if (activeNewsFilter !== "umr") return;
  const query = String($("#newsSearch").value || "").trim();
  if (query.length === 1) return;
  newsSearchTimer = window.setTimeout(() => loadCareerHeadlines(true), 900);
});
$("#spotlightSearchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderTalentSpotlight();
  $("#spotlightResultCount").scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
});
const talentPostCategory = $('#talentPostForm [name="category"]');
if (talentPostCategory)
  talentPostCategory.insertAdjacentHTML(
    "beforeend",
    categories
      .map(
        ([name]) =>
          `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`,
      )
      .join(""),
  );
$("#talentPostForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  submit.disabled = true;
  saveTalentPost(event.currentTarget)
    .catch((error) =>
      toast(
        `Posting talent gagal: ${error.message || "periksa data dan koneksi."}`,
      ),
    )
    .finally(() => {
      submit.disabled = false;
    });
});
const canvaReturnJwt = new URL(window.location.href).searchParams.get(
  "correlation_jwt",
);
const canvaError = new URL(window.location.href).searchParams.get(
  "canva_error",
);
const supabaseReady = initSupabaseATS();
renderHome();
renderFilters();
renderDashboard();
if (typeof renderPricing === "function") renderPricing();
if (location.hash.startsWith("#/jobs/"))
  go("detail", location.hash.split("/")[2]);
else if (location.hash.startsWith("#/rantau/"))
  go(
    "rantau-detail",
    decodeURIComponent(location.hash.slice("#/rantau/".length)),
  );
else if (
  location.pathname.replace(/\/+$/, "") === "/talent-spotlight" ||
  location.hash === "#/talent-spotlight"
)
  go("talent-spotlight");
else if (
  location.pathname.replace(/\/+$/, "") === "/candidate/talent-post" ||
  location.hash === "#/candidate/talent-post"
)
  go("candidate-talent-post");
else if (location.hash === "#/candidate/create-profile")
  go("candidate-create-profile");
else if (location.hash === "#/candidate/search") go("candidate-search");
else if (location.hash === "#/candidate/resume-studio")
  go("candidate-resume-studio");
else if (location.hash.startsWith("#/candidate/"))
  go(
    "candidate-public",
    decodeURIComponent(location.hash.slice("#/candidate/".length)),
  );
else if (location.hash.length > 2) {
  const route = location.hash.replace("#/", "");
  go(routes[route] ? route : "home");
}
if (canvaReturnJwt) {
  supabaseReady
    .then(() => finishCanvaCvReturn(canvaReturnJwt))
    .catch(async (error) => {
      toast(
        `CV dari Canva belum dapat diproses: ${error.message || "coba kembali dari Canva."}`,
      );
      const jobId = sessionStorage.getItem("jobhub-canva-pending-job");
      if (jobId) {
        go("detail", jobId);
        await openApply(jobId);
      }
    });
} else if (canvaError) {
  toast("Koneksi Canva belum selesai. Periksa izin Canva lalu coba lagi.");
  const jobId = sessionStorage.getItem("jobhub-canva-pending-job");
  if (jobId)
    window.setTimeout(() => {
      go("detail", jobId);
      openApply(jobId).catch((error) =>
        toast(`Lamaran gagal dibuka: ${error.message || "coba lagi."}`),
      );
    }, 0);
}

const splash = $("#jobhubSplash");
if (splash) {
  document.body.style.overflow = "hidden";
  window.setTimeout(() => {
    splash.classList.add("is-leaving");
    window.setTimeout(() => {
      splash.remove();
      document.body.style.removeProperty("overflow");
    }, 520);
  }, 2800);
}
