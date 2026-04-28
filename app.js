const STORAGE_KEY = "migralog_entries_v1";
const THEME_KEY = "migralog_theme";
const MODEL_KEY = "localstorage://migralog-risk-model";
const SETTINGS_KEY = "migralog_settings_v1";
const THEME_PRESET_KEY = "migralog_theme_preset";
const MEDICINE_PREFS_KEY = "migralog_medicine_prefs_v1";

const entryForm = document.getElementById("entryForm");
const entriesList = document.getElementById("entriesList");
const intensityInput = document.getElementById("intensity");
const intensityPreview = document.getElementById("intensityPreview");
const monthlySummary = document.getElementById("monthlySummary");
const reportYearSelect = document.getElementById("reportYear");
const reportMonthSelect = document.getElementById("reportMonthSelect");
const installBtn = document.getElementById("installBtn");
const mlStatus = document.getElementById("mlStatus");
const mlInsight = document.getElementById("mlInsight");
const weatherDataHint = document.getElementById("weatherDataHint");
const locationModeEl = document.getElementById("locationMode");
const prefectureEl = document.getElementById("prefecture");
const cityEl = document.getElementById("city");
const locationSettingStatus = document.getElementById("locationSettingStatus");
const manualLocationFields = document.getElementById("manualLocationFields");
const medicineNameEl = document.getElementById("medicineName");
const medicineQuickPickEl = document.getElementById("medicineQuickPick");
const toggleMedicineFavoriteBtn = document.getElementById("toggleMedicineFavoriteBtn");
const clearMedicineBtn = document.getElementById("clearMedicineBtn");
const medicinePickerPanelEl = document.getElementById("medicinePickerPanel");
const themePresetEl = document.getElementById("themePreset");
const backgroundPatternEl = document.getElementById("backgroundPattern");
const toastEl = document.getElementById("toast");
const loadingOverlayEl = document.getElementById("loadingOverlay");
const loadingTextEl = document.getElementById("loadingText");
const cityCache = new Map();
let loadingCount = 0;

const THEME_PRESETS = [
  { id: "aurora-night", label: "オーロラナイト", bg: "#2a1a14", accent: "#c2532d", accent2: "#f59e0b" },
  { id: "midnight-rose", label: "ミッドナイトローズ", bg: "#220d13", accent: "#e11d48", accent2: "#fb7185" },
  { id: "deep-ocean", label: "ディープオーシャン", bg: "#031422", accent: "#0ea5e9", accent2: "#22d3ee" },
  { id: "forest-glow", label: "フォレストグロウ", bg: "#07160e", accent: "#16a34a", accent2: "#22c55e" },
  { id: "sunset-indigo", label: "サンセットインディゴ", bg: "#2a140f", accent: "#f97316", accent2: "#6366f1" },
  { id: "mint-fog", label: "ミントフォグ", bg: "#071517", accent: "#14b8a6", accent2: "#60a5fa" },
  { id: "violet-mist", label: "バイオレットミスト", bg: "#0f0a1d", accent: "#8b5cf6", accent2: "#a78bfa" },
  { id: "amber-navy", label: "アンバーネイビー", bg: "#1f1510", accent: "#f59e0b", accent2: "#38bdf8" },
  { id: "ruby-sky", label: "ルビースカイ", bg: "#1c0b17", accent: "#f43f5e", accent2: "#0ea5e9" },
  { id: "lunar-silver", label: "ルナーシルバー", bg: "#101827", accent: "#94a3b8", accent2: "#38bdf8" },
  { id: "peach-noir", label: "ピーチノワール", bg: "#1a0f13", accent: "#fb7185", accent2: "#f59e0b" },
  { id: "neon-lagoon", label: "ネオンラグーン", bg: "#04151b", accent: "#06b6d4", accent2: "#2dd4bf" },
  { id: "plum-night", label: "プラムナイト", bg: "#150d20", accent: "#c084fc", accent2: "#818cf8" },
  { id: "graphite-ice", label: "グラファイトアイス", bg: "#0f172a", accent: "#64748b", accent2: "#22d3ee" },
  { id: "sakura-dark", label: "サクラダーク", bg: "#1a0f1a", accent: "#f472b6", accent2: "#a78bfa" },
  { id: "blueprint", label: "ブループリント", bg: "#0b1325", accent: "#3b82f6", accent2: "#06b6d4" },
  { id: "citrus-dusk", label: "シトラスダスク", bg: "#19110c", accent: "#facc15", accent2: "#fb7185" },
  { id: "emerald-night", label: "エメラルドナイト", bg: "#07130f", accent: "#10b981", accent2: "#34d399" },
  { id: "galaxy-pink", label: "ギャラクシーピンク", bg: "#120b1b", accent: "#d946ef", accent2: "#60a5fa" },
  { id: "coffee-cream", label: "コーヒークリーム", bg: "#1a1612", accent: "#a16207", accent2: "#f59e0b" },
];

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];
const PREFECTURE_CODE_MAP = {
  北海道: "01", 青森県: "02", 岩手県: "03", 宮城県: "04", 秋田県: "05", 山形県: "06", 福島県: "07",
  茨城県: "08", 栃木県: "09", 群馬県: "10", 埼玉県: "11", 千葉県: "12", 東京都: "13", 神奈川県: "14",
  新潟県: "15", 富山県: "16", 石川県: "17", 福井県: "18", 山梨県: "19", 長野県: "20", 岐阜県: "21",
  静岡県: "22", 愛知県: "23", 三重県: "24", 滋賀県: "25", 京都府: "26", 大阪府: "27", 兵庫県: "28",
  奈良県: "29", 和歌山県: "30", 鳥取県: "31", 島根県: "32", 岡山県: "33", 広島県: "34", 山口県: "35",
  徳島県: "36", 香川県: "37", 愛媛県: "38", 高知県: "39", 福岡県: "40", 佐賀県: "41", 長崎県: "42",
  熊本県: "43", 大分県: "44", 宮崎県: "45", 鹿児島県: "46", 沖縄県: "47",
};

let entries = loadEntries();
let appSettings = loadSettings();
let medicinePrefs = loadMedicinePrefs();
let weatherCorrelationChart = null;
let intensityTrendChart = null;
let deferredInstallPrompt = null;
let model = null;
const tabScrollState = new Map();

function init() {
  const now = new Date();
  document.getElementById("datetime").value = toDatetimeLocal(now);
  document.getElementById("medicineTime").value = toTimeLocal(now);
  setupReportSelectors(now);
  document.documentElement.classList.toggle("light", false);
  setupViewportSizing();

  setupPrefectureOptions();
  applySettingsToUI();
  setupThemeSelector();
  applyThemePreset(localStorage.getItem(THEME_PRESET_KEY) || THEME_PRESETS[0].id);
  bindEvents();
  updateIntensityPreview();
  setupTabs();
  render();
  setupPwaInstall();
}

function bindEvents() {
  intensityInput.addEventListener("input", updateIntensityPreview);
  entryForm.addEventListener("submit", handleSubmit);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("fillWeatherBtn").addEventListener("click", () => withButtonLoading("fillWeatherBtn", "補完中...", backfillWeatherForEntries));
  document.getElementById("backupBtn").addEventListener("click", backupEntries);
  document.getElementById("restoreInput").addEventListener("change", restoreEntries);
  document.getElementById("generateReportBtn").addEventListener("click", generateMonthlySummary);
  document.getElementById("exportPdfBtn").addEventListener("click", exportMonthlyPdf);
  document.getElementById("analyzeRiskBtn").addEventListener("click", () => withButtonLoading("analyzeRiskBtn", "学習中...", analyzeRisk));
  locationModeEl.addEventListener("change", handleLocationSettingChange);
  prefectureEl.addEventListener("change", handleLocationSettingChange);
  cityEl.addEventListener("change", handleLocationSettingChange);
  themePresetEl.addEventListener("change", () => applyThemePreset(themePresetEl.value));
  toggleMedicineFavoriteBtn?.addEventListener("click", toggleCurrentMedicineFavorite);
  clearMedicineBtn?.addEventListener("click", clearMedicineInput);
  medicineNameEl?.addEventListener("input", () => {
    updateMedicineFavoriteButtonLabel();
    const selected = medicineNameEl.value.trim();
    if (isKnownMedicine(selected)) {
      if (medicinePickerPanelEl) medicinePickerPanelEl.open = false;
      window.setTimeout(() => medicineNameEl.blur(), 0);
    }
  });
  medicineNameEl?.addEventListener("change", () => {
    if (medicinePickerPanelEl) medicinePickerPanelEl.open = false;
    window.setTimeout(() => medicineNameEl.blur(), 0);
  });
  backgroundPatternEl.addEventListener("change", () => {
    appSettings.backgroundPattern = backgroundPatternEl.value;
    saveSettings();
    applyBackgroundPattern(appSettings.backgroundPattern);
  });
  setupButtonToasts();
}

const MEDICINE_CATALOG = [
  "イブプロフェン", "ロキソプロフェン", "アセトアミノフェン", "ロキソニン", "カロナール",
  "タイレノール", "スマトリプタン", "ゾルミトリプタン", "エレトリプタン", "リザトリプタン",
  "ナラトリプタン", "フロバトリプタン", "ナプロキセン", "ジクロフェナク", "セレコキシブ",
  "インドメタシン", "エルゴタミン", "デパケン", "トピラマート", "プレドニゾロン",
  "葛根湯", "五苓散", "呉茱萸湯", "釣藤散", "半夏白朮天麻湯",
];
init();

function setupReportSelectors(baseDate) {
  const currentYear = baseDate.getFullYear();
  const entryYears = entries
    .map((entry) => Number(String(entry.datetime || "").slice(0, 4)))
    .filter((year) => Number.isFinite(year));
  const minYear = entryYears.length ? Math.min(...entryYears, currentYear - 1) : currentYear - 1;
  const maxYear = Math.max(currentYear + 20, ...(entryYears.length ? entryYears : [currentYear]));

  reportYearSelect.innerHTML = "";
  for (let y = minYear; y <= maxYear; y += 1) {
    const option = document.createElement("option");
    option.value = String(y);
    option.textContent = `${y}年`;
    reportYearSelect.appendChild(option);
  }
  reportMonthSelect.innerHTML = "";
  for (let m = 1; m <= 12; m += 1) {
    const option = document.createElement("option");
    option.value = String(m).padStart(2, "0");
    option.textContent = `${m}月`;
    reportMonthSelect.appendChild(option);
  }
  reportYearSelect.value = String(currentYear);
  reportMonthSelect.value = String(baseDate.getMonth() + 1).padStart(2, "0");
}

function getSelectedMonthKey() {
  return `${reportYearSelect.value}-${reportMonthSelect.value}`;
}

function refreshReportSelectors() {
  const prevYear = reportYearSelect.value;
  const prevMonth = reportMonthSelect.value;
  setupReportSelectors(new Date());
  if ([...reportYearSelect.options].some((opt) => opt.value === prevYear)) {
    reportYearSelect.value = prevYear;
  }
  if ([...reportMonthSelect.options].some((opt) => opt.value === prevMonth)) {
    reportMonthSelect.value = prevMonth;
  }
}

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const currentScreen = document.querySelector(".screen.active");
      if (currentScreen?.dataset.tab) {
        tabScrollState.set(currentScreen.dataset.tab, window.scrollY || 0);
      }
      const target = button.dataset.tabTarget;
      document.querySelectorAll(".tab-btn").forEach((el) => el.classList.toggle("active", el === button));
      document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.toggle("active", screen.dataset.tab === target);
      });
      const targetY = tabScrollState.get(target) || 0;
      window.setTimeout(() => window.scrollTo({ top: targetY, behavior: "auto" }), 0);
      if (target === "analysis") {
        drawCharts();
      }
      if (target === "report") {
        generateMonthlySummary();
      }
    });
  });
}

function setupPwaInstall() {
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    installBtn.hidden = true;
    deferredInstallPrompt = null;
  });
}

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveEntries() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false;
  }
}

function loadSettings() {
  try {
    return {
      locationMode: "auto",
      prefecture: "",
      city: "",
      backgroundPattern: "none",
      ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"),
    };
  } catch {
    return { locationMode: "auto", prefecture: "", city: "", backgroundPattern: "none" };
  }
}

function loadMedicinePrefs() {
  try {
    const parsed = JSON.parse(localStorage.getItem(MEDICINE_PREFS_KEY) || "{}");
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      usage: parsed.usage && typeof parsed.usage === "object" ? parsed.usage : {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { favorites: [], usage: {}, history: [] };
  }
}

function saveMedicinePrefs() {
  localStorage.setItem(MEDICINE_PREFS_KEY, JSON.stringify(medicinePrefs));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettings));
}

function applySettingsToUI() {
  locationModeEl.value = appSettings.locationMode;
  prefectureEl.value = appSettings.prefecture || "";
  void updateCityOptions(prefectureEl.value, appSettings.city || "");
  backgroundPatternEl.value = appSettings.backgroundPattern || "none";
  manualLocationFields.hidden = appSettings.locationMode !== "manual";
  updateLocationStatus();
  updateWeatherActionState();
  applyBackgroundPattern(backgroundPatternEl.value);
  updateMedicineFavoriteButtonLabel();
  renderMedicineQuickPick();
}

function handleLocationSettingChange() {
  const previousMode = appSettings.locationMode;
  if (appSettings.prefecture !== prefectureEl.value) {
    void updateCityOptions(prefectureEl.value, "");
  }
  appSettings = {
    ...appSettings,
    locationMode: locationModeEl.value,
    prefecture: prefectureEl.value,
    city: cityEl.value,
  };
  manualLocationFields.hidden = appSettings.locationMode !== "manual";
  saveSettings();
  updateLocationStatus();
  updateWeatherActionState();
  if (previousMode !== "auto" && appSettings.locationMode === "auto") {
    showToast("位置情報の許可ダイアログが表示されます。「このアプリの使用中のみ」などを選択してください。");
    void requestLocationPermission();
  }
}

function setupPrefectureOptions() {
  prefectureEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "都道府県を選択";
  prefectureEl.appendChild(placeholder);
  PREFECTURES.forEach((pref) => {
    const option = document.createElement("option");
    option.value = pref;
    option.textContent = pref;
    prefectureEl.appendChild(option);
  });
}

async function updateCityOptions(prefecture, selectedValue) {
  cityEl.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "市区町村を選択";
  cityEl.appendChild(placeholder);

  const cities = await fetchCitiesByPrefecture(prefecture);
  cities.forEach((cityName) => {
    const option = document.createElement("option");
    option.value = cityName;
    option.textContent = cityName;
    cityEl.appendChild(option);
  });
  cityEl.value = selectedValue || "";
}

async function fetchCitiesByPrefecture(prefecture) {
  if (!prefecture) return [];
  if (cityCache.has(prefecture)) return cityCache.get(prefecture);
  try {
    const code = PREFECTURE_CODE_MAP[prefecture];
    if (!code) return [];
    const url = `https://madefor.github.io/jisx0402/api/v1/${code}.json`;
    const response = await fetch(url);
    const json = await response.json();
    const cities = Object.values(json || {})
      .map((item) => item.city)
      .filter(Boolean)
      .filter((city, idx, arr) => arr.indexOf(city) === idx)
      .sort((a, b) => a.localeCompare(b, "ja"));
    cityCache.set(prefecture, cities);
    if (!cities.length) showToast("市区町村の候補を読み込めませんでした");
    return cities;
  } catch {
    showToast("市区町村の候補を取得できませんでした");
    return [];
  }
}

function updateLocationStatus() {
  if (appSettings.locationMode === "none") {
    locationSettingStatus.textContent = "天気情報の取得は無効です。";
    return;
  }
  if (appSettings.locationMode === "manual") {
    locationSettingStatus.textContent = appSettings.prefecture && appSettings.city
      ? `手動設定: ${appSettings.prefecture} ${appSettings.city}`
      : "都道府県と市区町村を選ぶと、天気の分析が使えます。";
    return;
  }
  locationSettingStatus.textContent = "端末の位置情報を許可すると、緯度経度のみを使って天気を取得します。";
}

function canUseWeatherFeatures() {
  if (appSettings.locationMode === "none") return false;
  if (appSettings.locationMode === "manual") return Boolean(appSettings.prefecture && appSettings.city);
  return true;
}

function updateWeatherActionState() {
  const fillWeatherBtn = document.getElementById("fillWeatherBtn");
  if (!fillWeatherBtn) return;
  fillWeatherBtn.disabled = false;
  fillWeatherBtn.title = "位置情報設定が未完了の場合は補完できません";
}

async function requestLocationPermission() {
  if ("permissions" in navigator && navigator.permissions?.query) {
    try {
      const permission = await navigator.permissions.query({ name: "geolocation" });
      if (permission.state === "denied") {
        showToast("位置情報が拒否されています。ブラウザ/端末設定から許可してください。");
      }
    } catch {
      // Ignore permissions API errors and continue.
    }
  }
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      showToast("この端末では位置情報が利用できません。");
      resolve(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        showToast("位置情報の利用を許可しました。");
        resolve(true);
      },
      () => {
        showToast("位置情報が未許可です。端末の設定画面でこのアプリの位置情報を許可してください。");
        resolve(false);
      },
      { timeout: 8000 }
    );
  });
}

function updateIntensityPreview() {
  const value = Number(intensityInput.value);
  intensityPreview.textContent = value;
}

function setupThemeSelector() {
  THEME_PRESETS.forEach(({ id, label }) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = `${label} (${id})`;
    themePresetEl.appendChild(option);
  });
}

function applyThemePreset(presetId) {
  const selected = THEME_PRESETS.find((theme) => theme.id === presetId) || THEME_PRESETS[0];
  const root = document.documentElement;
  root.style.setProperty("--bg", selected.bg);
  root.style.setProperty("--accent", selected.accent);
  root.style.setProperty("--accent-2", selected.accent2);
  themePresetEl.value = selected.id;
  localStorage.setItem(THEME_PRESET_KEY, selected.id);
}

function applyBackgroundPattern(pattern) {
  document.body.dataset.pattern = pattern || "none";
}

function intensityColor(value) {
  const hue = 120 - value * 10;
  return `hsl(${Math.max(0, hue)}deg 80% 50%)`;
}

function setupButtonToasts() {
  document.querySelectorAll("button").forEach((button) => {
    if (
      button.id === "themeToggle" ||
      button.classList.contains("tab-btn")
    ) return;
    button.addEventListener("click", () => {
      const label = button.textContent?.trim() || "操作";
      showToast(`「${label}」を実行しました`);
    });
  });
}

let toastTimer = null;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 1400);
}

async function withButtonLoading(buttonId, loadingText, action) {
  const button = document.getElementById(buttonId);
  if (!button) {
    showLoading(loadingText);
    try {
      await action();
    } finally {
      hideLoading();
    }
    return;
  }
  const originalText = button.textContent;
  const originalMinWidth = button.style.minWidth;
  const fixedWidth = button.offsetWidth;
  button.style.minWidth = `${fixedWidth}px`;
  button.textContent = loadingText;
  button.disabled = true;
  button.classList.add("btn-loading");
  showLoading(loadingText);
  try {
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
    await action();
  } finally {
    button.textContent = originalText;
    button.disabled = false;
    button.classList.remove("btn-loading");
    button.style.minWidth = originalMinWidth;
    hideLoading();
  }
}

function showLoading(message) {
  loadingCount += 1;
  if (loadingTextEl) {
    loadingTextEl.textContent = message || "処理中...";
  }
  if (loadingOverlayEl) {
    loadingOverlayEl.classList.add("show");
    loadingOverlayEl.setAttribute("aria-hidden", "false");
  }
  document.body.style.overflow = "hidden";
}

function hideLoading() {
  loadingCount = Math.max(0, loadingCount - 1);
  if (loadingCount > 0) return;
  if (loadingOverlayEl) {
    loadingOverlayEl.classList.remove("show");
    loadingOverlayEl.setAttribute("aria-hidden", "true");
  }
  document.body.style.overflow = "";
}

function createEntryId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function setupViewportSizing() {
  const applyViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--app-vh", `${vh}px`);
  };
  applyViewportHeight();
  window.addEventListener("resize", applyViewportHeight);
  window.visualViewport?.addEventListener("resize", applyViewportHeight);
  document.addEventListener("focusout", () => window.setTimeout(applyViewportHeight, 60));
}

async function handleSubmit(event) {
  event.preventDefault();
  try {
    const checkedLocation = document.querySelector("input[name='location']:checked");
    const locationValue = checkedLocation?.value || "left";
    const datetime = document.getElementById("datetime").value;
    const safeDatetime = datetime || toDatetimeLocal(new Date());
    const safeLocation = locationValue || "left";
    const weather = await getWeatherSnapshot(safeDatetime);
    const entry = {
      id: createEntryId(),
      datetime: safeDatetime,
      intensity: Number(document.getElementById("intensity").value),
      location: safeLocation,
      medicineName: document.getElementById("medicineName").value.trim(),
      medicineTime: document.getElementById("medicineTime").value,
      memo: document.getElementById("memo").value.trim(),
      sleepHours: numberOrNull(document.getElementById("sleepHours").value),
      alcoholIntake: numberOrNull(document.getElementById("alcoholIntake").value),
      weather,
    };
    entries.unshift(entry);
    trackMedicineUsage(entry.medicineName);
    const persisted = saveEntries();
    entryForm.reset();
    document.getElementById("datetime").value = toDatetimeLocal(new Date());
    document.getElementById("medicineTime").value = toTimeLocal(new Date());
    const leftLocation = document.querySelector("input[name='location'][value='left']");
    if (leftLocation) leftLocation.checked = true;
    document.getElementById("intensity").value = "5";
    updateMedicineFavoriteButtonLabel();
    renderMedicineQuickPick();
    updateIntensityPreview();
    render();
    const hasWeather = Number.isFinite(weather.pressure)
      || Number.isFinite(weather.temperature)
      || Number.isFinite(weather.humidity)
      || Number.isFinite(weather.weatherCode);
    showToast(
      persisted
        ? hasWeather
          ? `記録を保存しました（合計: ${entries.length}件）`
          : `記録を保存しました（天気は未取得。位置設定を確認してください）`
        : `記録は一時反映しました（保存に失敗。端末容量やブラウザ設定をご確認ください）`
    );
  } catch {
    showToast("記録の保存に失敗しました。もう一度お試しください。");
  }
}

function numberOrNull(value) {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

async function getWeatherSnapshot(datetimeString) {
  try {
    const coords = await resolveCoords();
    if (!coords) return blankWeather();
    const dt = new Date(datetimeString);
    const day = dt.toISOString().slice(0, 10);
    const baseUrl = day <= new Date().toISOString().slice(0, 10)
      ? "https://archive-api.open-meteo.com/v1/archive"
      : "https://api.open-meteo.com/v1/forecast";
    const url = `${baseUrl}?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=temperature_2m,relative_humidity_2m,surface_pressure,weather_code&timezone=auto&start_date=${day}&end_date=${day}`;
    const response = await fetch(url);
    const json = await response.json();
    const idx = nearestTimeIndex(json.hourly?.time || [], dt);
    return {
      latitude: coords.latitude,
      longitude: coords.longitude,
      temperature: json.hourly?.temperature_2m?.[idx] ?? null,
      humidity: json.hourly?.relative_humidity_2m?.[idx] ?? null,
      pressure: json.hourly?.surface_pressure?.[idx] ?? null,
      weatherCode: json.hourly?.weather_code?.[idx] ?? null,
    };
  } catch {
    return blankWeather();
  }
}

function blankWeather() {
  return { latitude: null, longitude: null, temperature: null, humidity: null, pressure: null, weatherCode: null };
}

async function resolveCoords() {
  if (appSettings.locationMode === "none") return null;
  if (appSettings.locationMode === "manual") return resolveManualCoords();
  return getDeviceCoords();
}

function getDeviceCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation unavailable"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      reject,
      { timeout: 10000 }
    );
  });
}

async function resolveManualCoords() {
  if (!appSettings.prefecture || !appSettings.city) return null;
  const queries = [
    `${appSettings.prefecture} ${appSettings.city}`,
    `${appSettings.city} ${appSettings.prefecture}`,
    appSettings.city,
  ];
  for (const q of queries) {
    const query = encodeURIComponent(q);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=10&language=ja&format=json`;
    const response = await fetch(url);
    const json = await response.json();
    const candidates = json.results || [];
    const matched = candidates.find((item) => (
      String(item.admin1 || "").includes(appSettings.prefecture) &&
      String(item.name || "").includes(appSettings.city)
    )) || candidates.find((item) => String(item.admin1 || "").includes(appSettings.prefecture)) || candidates[0];
    if (matched) {
      return { latitude: matched.latitude, longitude: matched.longitude };
    }
  }
  const nominatimQuery = encodeURIComponent(`${appSettings.city} ${appSettings.prefecture}`);
  try {
    const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${nominatimQuery}`);
    const fallbackJson = await fallbackRes.json();
    const fallback = fallbackJson?.[0];
    if (fallback) {
      return { latitude: Number(fallback.lat), longitude: Number(fallback.lon) };
    }
  } catch {
    // Fallback failed.
  }
  return null;
}

function nearestTimeIndex(times, targetDate) {
  let best = 0;
  let bestDistance = Number.MAX_SAFE_INTEGER;
  times.forEach((time, i) => {
    const dist = Math.abs(new Date(time).getTime() - targetDate.getTime());
    if (dist < bestDistance) {
      bestDistance = dist;
      best = i;
    }
  });
  return best;
}

function render() {
  refreshReportSelectors();
  renderEntries();
  drawCharts();
  generateMonthlySummary();
  updateLearningHint();
}

function renderEntries() {
  entriesList.innerHTML = "";
  if (!entries.length) {
    entriesList.textContent = "まだ記録がありません。";
    return;
  }
  entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "entry-card";
    card.innerHTML = `
      <strong>${formatDateTimeWithWeekday(entry.datetime)}</strong>
      <span class="intensity-pill">${entry.intensity}</span>
      <div class="entry-meta">部位: ${locationLabel(entry.location)} / 薬: ${entry.medicineName || "なし"} ${entry.medicineTime ? `(${entry.medicineTime})` : ""}</div>
      <div class="entry-meta">天気: ${weatherLabel(entry.weather?.weatherCode)} / 気圧: ${displayNum(entry.weather?.pressure, "hPa")} / 気温: ${displayNum(entry.weather?.temperature, "°C")} / 湿度: ${displayNum(entry.weather?.humidity, "%")}</div>
      <p>${entry.memo || "メモなし"}</p>
      <div class="actions">
        <button data-action="ics" data-id="${entry.id}">カレンダーに連携</button>
        <button data-action="delete" data-id="${entry.id}">削除</button>
      </div>
    `;
    entriesList.appendChild(card);
  });
  entriesList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      if (button.dataset.action === "delete") removeEntry(id);
      if (button.dataset.action === "ics") downloadICS(id);
    });
  });
}

function drawCharts() {
  if (typeof Chart !== "function") {
    return;
  }
  const ctx1 = document.getElementById("weatherCorrelationChart");
  const ctx2 = document.getElementById("intensityTrendChart");
  if (!ctx1 || !ctx2) return;
  weatherCorrelationChart?.destroy();
  intensityTrendChart?.destroy();

  const intensity = entries.map((e) => e.intensity);
  const pressureValues = entries.map((e) => e.weather?.pressure);
  const tempValues = entries.map((e) => e.weather?.temperature);
  const humidityValues = entries.map((e) => e.weather?.humidity);
  const weatherReadyCount = entries.filter((entry) => (
    Number.isFinite(entry.weather?.pressure) ||
    Number.isFinite(entry.weather?.temperature) ||
    Number.isFinite(entry.weather?.humidity) ||
    Number.isFinite(entry.weather?.weatherCode)
  )).length;
  if (weatherDataHint) {
    weatherDataHint.textContent =
      weatherReadyCount >= 3
        ? `天気データ付き記録: ${weatherReadyCount}件。相関グラフを更新しています。`
        : "天気相関は、天気データ付きの記録が3件以上あると安定して表示されます。設定タブで市区町村を保存後、新規記録を追加してください。";
  }
  weatherCorrelationChart = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: ["気圧", "気温", "湿度"],
      datasets: [{
        label: "頭痛強度との相関係数",
        data: [
          calcPearson(pressureValues, intensity),
          calcPearson(tempValues, intensity),
          calcPearson(humidityValues, intensity),
        ],
        backgroundColor: ["#7c4dff", "#f59e0b", "#00c2ff"],
      }],
    },
    options: { responsive: true, scales: { y: { min: -1, max: 1 } } },
  });

  intensityTrendChart = new Chart(ctx2, {
    type: "line",
    data: {
      labels: entries.map((e) => formatDateWithWeekday(e.datetime)).reverse(),
      datasets: [{
        label: "頭痛強度トレンド",
        data: entries.map((e) => e.intensity).reverse(),
        borderColor: "#f43f5e",
        backgroundColor: "rgba(244,63,94,0.18)",
        fill: true,
        tension: 0.25,
      }],
    },
    options: { responsive: true },
  });
}

function updateLearningHint() {
  if (!mlStatus) return;
  const dailyCount = groupByDay(entries).length;
  const current = mlStatus.textContent || "";
  const isPredictionResult = current.includes("翌日頭痛リスク");
  const isTrainedState = current.includes("予測の準備が完了");
  if (isPredictionResult || isTrainedState) return;
  mlStatus.textContent = `学習待ち（現在: ${dailyCount}日 / 必要: 8日）`;
  if (mlInsight) {
    mlInsight.textContent = "これは医療診断ではなく、記録傾向の説明を表示する補助機能です。";
  }
}

function summarizeRiskFactors(latestDay) {
  const hints = [];
  if (Number.isFinite(latestDay.avgPressure) && latestDay.avgPressure < 1008) {
    hints.push("気圧が低め");
  }
  if (Number.isFinite(latestDay.avgHumidity) && latestDay.avgHumidity > 75) {
    hints.push("湿度が高め");
  }
  if (Number.isFinite(latestDay.sleepHours) && latestDay.sleepHours < 6) {
    hints.push("睡眠時間が短め");
  }
  if (Number.isFinite(latestDay.alcoholIntake) && latestDay.alcoholIntake >= 2) {
    hints.push("飲酒量が多め");
  }
  if (Number.isFinite(latestDay.avgIntensity) && latestDay.avgIntensity >= 7) {
    hints.push("直近の痛み強度が高め");
  }
  if (Number.isFinite(latestDay.weatherCode) && [61, 63, 65, 80, 81, 82].includes(latestDay.weatherCode)) {
    hints.push("雨のタイミング");
  }
  if (!hints.length) {
    return "大きな偏りは少ない日でした。生活リズムと天気の変化を継続確認してください。";
  }
  return `影響候補:\n- ${hints.join("\n- ")}`;
}

function calcPearson(arrX, arrY) {
  const pairs = arrX.map((x, idx) => [x, arrY[idx]]).filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (pairs.length < 2) return 0;
  const x = pairs.map((p) => p[0]);
  const y = pairs.map((p) => p[1]);
  const mx = avg(x);
  const my = avg(y);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < x.length; i += 1) {
    num += (x[i] - mx) * (y[i] - my);
    dx += (x[i] - mx) ** 2;
    dy += (y[i] - my) ** 2;
  }
  return Number((num / Math.sqrt(dx * dy || 1)).toFixed(3));
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function removeEntry(id) {
  if (!window.confirm("この記録を削除しますか？\n削除後は元に戻せません。")) {
    showToast("削除をキャンセルしました");
    return;
  }
  entries = entries.filter((e) => e.id !== id);
  saveEntries();
  render();
  showToast("記録を削除しました");
}

function toggleCurrentMedicineFavorite() {
  const name = medicineNameEl?.value.trim();
  if (!name) {
    showToast("薬名を選択してください");
    return;
  }
  const favorites = new Set(medicinePrefs.favorites);
  if (favorites.has(name)) {
    favorites.delete(name);
    showToast(`お気に入りから外しました: ${name}`);
  } else {
    favorites.add(name);
    showToast(`お気に入りに追加しました: ${name}`);
  }
  medicinePrefs.favorites = [...favorites];
  saveMedicinePrefs();
  updateMedicineFavoriteButtonLabel();
  renderMedicineQuickPick();
}

function clearMedicineInput() {
  if (!medicineNameEl) return;
  medicineNameEl.value = "";
  updateMedicineFavoriteButtonLabel();
  if (medicinePickerPanelEl) medicinePickerPanelEl.open = false;
  window.setTimeout(() => medicineNameEl.blur(), 0);
  showToast("薬名をクリアしました");
}

function toggleMedicineFavoriteByName(name) {
  if (!name) return;
  const favorites = new Set(medicinePrefs.favorites);
  if (favorites.has(name)) {
    favorites.delete(name);
    showToast(`お気に入りから外しました: ${name}`);
  } else {
    favorites.add(name);
    showToast(`お気に入りに追加しました: ${name}`);
  }
  medicinePrefs.favorites = [...favorites];
  saveMedicinePrefs();
  updateMedicineFavoriteButtonLabel();
  renderMedicineQuickPick();
}

function trackMedicineUsage(name) {
  if (!name) return;
  medicinePrefs.usage[name] = (medicinePrefs.usage[name] || 0) + 1;
  medicinePrefs.history = [name, ...(medicinePrefs.history || []).filter((item) => item !== name)].slice(0, 30);
  saveMedicinePrefs();
}

function sortedByUsage(names) {
  return [...new Set(names)]
    .sort((a, b) => (medicinePrefs.usage[b] || 0) - (medicinePrefs.usage[a] || 0))
    .sort((a, b) => {
      const diff = (medicinePrefs.usage[b] || 0) - (medicinePrefs.usage[a] || 0);
      return diff !== 0 ? diff : a.localeCompare(b, "ja");
    });
}

function isKnownMedicine(name) {
  if (!name) return false;
  return [...new Set([
    ...MEDICINE_CATALOG,
    ...(medicinePrefs.history || []),
    ...(medicinePrefs.favorites || []),
    ...Object.keys(medicinePrefs.usage || {}),
  ])].includes(name);
}

function renderMedicineQuickPick() {
  if (!medicineQuickPickEl) return;
  const allNames = [...new Set([
    ...MEDICINE_CATALOG,
    ...Object.keys(medicinePrefs.usage || {}),
    ...(medicinePrefs.history || []),
    ...(medicinePrefs.favorites || []),
  ])];
  const favorites = sortedByUsage((medicinePrefs.favorites || []).filter((name) => allNames.includes(name)));
  const history = (medicinePrefs.history || []).filter((name, idx, arr) => arr.indexOf(name) === idx && !favorites.includes(name)).slice(0, 8);
  const others = sortedByUsage(allNames.filter((name) => !favorites.includes(name) && !history.includes(name))).slice(0, 12);
  medicineQuickPickEl.innerHTML = "";
  medicineQuickPickEl.appendChild(createMedicineGroup("お気に入り", favorites, "未登録"));
  medicineQuickPickEl.appendChild(createMedicineGroup("入力履歴", history, "未登録"));
  medicineQuickPickEl.appendChild(createMedicineGroup("そのほかの薬", others, "候補がありません"));
}

function createMedicineGroup(title, names, emptyLabel) {
  const wrap = document.createElement("section");
  wrap.className = "medicine-group";
  const heading = document.createElement("div");
  heading.className = "medicine-group-title";
  heading.textContent = title;
  wrap.appendChild(heading);
  if (!names.length) {
    const empty = document.createElement("div");
    empty.className = "entry-meta";
    empty.textContent = emptyLabel;
    wrap.appendChild(empty);
    return wrap;
  }
  const row = document.createElement("div");
  row.className = "medicine-chip-row";
  names.forEach((name) => {
    const item = document.createElement("div");
    item.className = "medicine-chip-item";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "medicine-chip";
    button.textContent = name;
    button.addEventListener("click", () => {
      medicineNameEl.value = name;
      updateMedicineFavoriteButtonLabel();
      if (medicinePickerPanelEl) medicinePickerPanelEl.open = false;
      medicineNameEl.blur();
      showToast(`薬名を選択しました: ${name}`);
    });
    const favBtn = document.createElement("button");
    favBtn.type = "button";
    favBtn.className = "medicine-fav-chip";
    const isFavorite = (medicinePrefs.favorites || []).includes(name);
    favBtn.textContent = isFavorite ? "★" : "☆";
    favBtn.title = isFavorite ? `お気に入り解除: ${name}` : `お気に入り追加: ${name}`;
    favBtn.addEventListener("mousedown", (event) => event.preventDefault());
    favBtn.addEventListener("click", () => {
      document.activeElement?.blur?.();
      toggleMedicineFavoriteByName(name);
    });
    item.appendChild(button);
    item.appendChild(favBtn);
    row.appendChild(item);
  });
  wrap.appendChild(row);
  return wrap;
}

function updateMedicineFavoriteButtonLabel() {
  if (!toggleMedicineFavoriteBtn || !medicineNameEl) return;
  const name = medicineNameEl.value.trim();
  if (!name) {
    toggleMedicineFavoriteBtn.textContent = "お気に入り追加/削除";
    return;
  }
  const isFavorite = (medicinePrefs.favorites || []).includes(name);
  toggleMedicineFavoriteBtn.textContent = isFavorite ? "お気に入り削除" : "お気に入り追加";
}

function locationLabel(value) {
  return { left: "左", right: "右", both: "両側", back: "後頭部" }[value] || value;
}

function displayNum(value, unit) {
  return Number.isFinite(value) ? `${Number(value).toFixed(1)} ${unit}` : "未取得";
}

function weatherLabel(code) {
  if (!Number.isFinite(code)) return "未取得";
  if (code === 0) return "快晴";
  if ([1, 2].includes(code)) return "晴れ";
  if (code === 3) return "くもり";
  if ([45, 48].includes(code)) return "霧";
  if ([51, 53, 55, 56, 57].includes(code)) return "霧雨";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "雨";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "雪";
  if ([95, 96, 99].includes(code)) return "雷雨";
  return "その他";
}

function toDatetimeLocal(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function toTimeLocal(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDateWithWeekday(datetimeValue) {
  const dt = new Date(datetimeValue);
  if (Number.isNaN(dt.getTime())) return String(datetimeValue || "");
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(dt);
}

function formatDateTimeWithWeekday(datetimeValue) {
  const dt = new Date(datetimeValue);
  if (Number.isNaN(dt.getTime())) return String(datetimeValue || "");
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dt);
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_PRESET_KEY) || THEME_PRESETS[0].id;
  const index = THEME_PRESETS.findIndex((theme) => theme.id === current);
  const next = THEME_PRESETS[(index + 1) % THEME_PRESETS.length].id;
  applyThemePreset(next);
  localStorage.setItem(THEME_KEY, "preset");
}

async function backupEntries() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const filename = `migralog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  let saved = false;
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
    saved = true;
  } catch {
    saved = false;
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  showToast(saved ? `ダウンロード開始: ${filename}（通常は「ダウンロード」フォルダ）` : "バックアップ保存に失敗しました。");
}

function restoreEntries(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const restored = Array.isArray(parsed) ? parsed : parsed.entries;
      if (!Array.isArray(restored)) throw new Error("Invalid backup format");
      entries = restored;
      saveEntries();
      render();
      showToast(`復元が完了しました（${entries.length}件）`);
      document.getElementById("restoreInput").value = "";
    } catch {
      showToast("復元に失敗しました。バックアップファイルを確認してください。");
    }
  };
  reader.readAsText(file);
}

function groupByDay(data) {
  const map = new Map();
  data.forEach((entry) => {
    const day = entry.datetime.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(entry);
  });
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([day, list]) => ({
      day,
      count: list.length,
      avgIntensity: avg(list.map((e) => e.intensity)),
      avgPressure: avg(list.map((e) => e.weather?.pressure).filter(Number.isFinite)),
      avgTemp: avg(list.map((e) => e.weather?.temperature).filter(Number.isFinite)),
      avgHumidity: avg(list.map((e) => e.weather?.humidity).filter(Number.isFinite)),
      weatherCode: mode(list.map((e) => e.weather?.weatherCode).filter(Number.isFinite)),
      sleepHours: avg(list.map((e) => e.sleepHours).filter(Number.isFinite)),
      alcoholIntake: avg(list.map((e) => e.alcoholIntake).filter(Number.isFinite)),
    }));
}

async function trainModel() {
  const daily = groupByDay(entries);
  if (daily.length < 8) {
    mlStatus.textContent = `学習には「日付が異なる記録」が8日分必要です（現在: ${daily.length}日分）。`;
    return;
  }
  const xs = [];
  const ys = [];
  for (let i = 0; i < daily.length - 1; i += 1) {
    const now = daily[i];
    const tomorrow = daily[i + 1];
    xs.push([
      safeFeature(now.avgIntensity),
      safeFeature(now.avgPressure),
      safeFeature(now.avgTemp),
      safeFeature(now.avgHumidity),
      safeFeature(now.sleepHours),
      safeFeature(now.alcoholIntake / 5),
      safeFeature(now.count / 5),
    ]);
    ys.push([tomorrow.count > 0 ? 1 : 0]);
  }
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, activation: "relu", inputShape: [7] }));
  model.add(tf.layers.dense({ units: 8, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: tf.train.adam(0.01), loss: "binaryCrossentropy", metrics: ["accuracy"] });
  const xTensor = tf.tensor2d(xs);
  const yTensor = tf.tensor2d(ys);
  await model.fit(xTensor, yTensor, { epochs: 60, batchSize: 4, shuffle: true, verbose: 0 });
  await model.save(MODEL_KEY);
  xTensor.dispose();
  yTensor.dispose();
  mlStatus.textContent = `予測の準備が完了しました（データ: ${xs.length}件）。`;
  if (mlInsight) {
    mlInsight.textContent = "予測は医療判断ではなく、記録傾向の参考情報です。";
  }
}

function safeFeature(value) {
  return Number.isFinite(value) ? value : 0;
}

async function predictTomorrowRisk() {
  if (!model) {
    try {
      model = await tf.loadLayersModel(MODEL_KEY);
    } catch {
      mlStatus.textContent = "まだ予測の準備ができていません。先に「モデル学習」を押してください。";
      return;
    }
  }
  const daily = groupByDay(entries);
  if (!daily.length) {
    mlStatus.textContent = "記録が不足しているため予測できません。";
    return;
  }
  const latest = daily[daily.length - 1];
  const input = tf.tensor2d([[
    safeFeature(latest.avgIntensity),
    safeFeature(latest.avgPressure),
    safeFeature(latest.avgTemp),
    safeFeature(latest.avgHumidity),
    safeFeature(latest.sleepHours),
    safeFeature(latest.alcoholIntake / 5),
    safeFeature(latest.count / 5),
  ]]);
  const prediction = model.predict(input);
  const score = (await prediction.data())[0];
  input.dispose();
  prediction.dispose();
  mlStatus.textContent = `翌日頭痛リスク: ${(score * 100).toFixed(1)}%`;
  if (mlInsight) {
    const tendency = score >= 0.7
      ? "天気や生活リズムの影響が重なっている可能性があります。"
      : score >= 0.45
        ? "いくつかの条件が重なると頭痛につながる可能性があります。"
        : "現時点では大きなリスク傾向は強くありません。";
    const factorNote = summarizeRiskFactors(latest);
    mlInsight.textContent = `${tendency}\n${factorNote}\n※本表示は診断ではなく、記録データの傾向説明です。`;
  }
}

async function analyzeRisk() {
  mlStatus.textContent = "学習を開始しています...";
  if (mlInsight) {
    mlInsight.textContent = "学習中です。完了までしばらくお待ちください。";
  }
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  const daily = groupByDay(entries);
  if (daily.length < 8) {
    mlStatus.textContent = `分析には「日付が異なる記録」が8日分必要です（現在: ${daily.length}日分）。`;
    if (mlInsight) {
      mlInsight.textContent = "8日分に達すると、傾向説明と翌日リスクを同時に表示します。";
    }
    return;
  }
  await trainModel();
  await predictTomorrowRisk();
}

async function backfillWeatherForEntries() {
  if (!canUseWeatherFeatures()) {
    showToast("先に位置情報を設定してください（端末許可 or 都道府県/市区町村）。");
    if (appSettings.locationMode === "auto") {
      await requestLocationPermission();
    }
    return;
  }
  if (!entries.length) {
    showToast("補完する記録がありません");
    return;
  }
  let updated = 0;
  for (const entry of entries) {
    const hasWeather = Number.isFinite(entry.weather?.pressure)
      || Number.isFinite(entry.weather?.temperature)
      || Number.isFinite(entry.weather?.humidity)
      || Number.isFinite(entry.weather?.weatherCode);
    if (hasWeather) continue;
    const snapshot = await getWeatherSnapshot(entry.datetime);
    const ok = Number.isFinite(snapshot.pressure)
      || Number.isFinite(snapshot.temperature)
      || Number.isFinite(snapshot.humidity)
      || Number.isFinite(snapshot.weatherCode);
    if (!ok) continue;
    entry.weather = snapshot;
    updated += 1;
  }
  const persisted = saveEntries();
  render();
  if (!persisted) {
    showToast("補完結果の保存に失敗しました");
    return;
  }
  showToast(`天気補完が完了しました（${updated}件更新）`);
}

function generateMonthlySummary() {
  const month = getSelectedMonthKey();
  const monthEntries = entries.filter((e) => e.datetime.startsWith(month));
  if (!monthEntries.length) {
    monthlySummary.textContent = `${month} の記録はありません。`;
    return;
  }
  const avgIntensity = avg(monthEntries.map((e) => e.intensity)).toFixed(2);
  const topLocation = mode(monthEntries.map((e) => locationLabel(e.location)));
  const medRate = ((monthEntries.filter((e) => e.medicineName).length / monthEntries.length) * 100).toFixed(1);
  const pressureCorr = calcPearson(monthEntries.map((e) => e.weather?.pressure), monthEntries.map((e) => e.intensity));
  const hourHeat = mode(monthEntries.map((e) => new Date(e.datetime).getHours()));
  monthlySummary.textContent =
    `対象月: ${month}\n` +
    `頭痛記録回数: ${monthEntries.length} 回\n` +
    `平均強度: ${avgIntensity} / 10\n` +
    `最多部位: ${topLocation}\n` +
    `服薬記録率: ${medRate}%\n` +
    `気圧との相関: ${pressureCorr}\n` +
    `頭痛が多い時間帯: ${hourHeat}時台`;
}

function mode(arr) {
  const counts = new Map();
  arr.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
}

async function exportMonthlyPdf() {
  generateMonthlySummary();
  const month = getSelectedMonthKey();
  const monthEntries = entries.filter((e) => e.datetime.startsWith(month));
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const avgIntensity = monthEntries.length ? avg(monthEntries.map((e) => e.intensity)).toFixed(2) : "0.00";
  const medRate = monthEntries.length ? ((monthEntries.filter((e) => e.medicineName).length / monthEntries.length) * 100).toFixed(1) : "0.0";
  const pressureCorr = monthEntries.length ? calcPearson(monthEntries.map((e) => e.weather?.pressure), monthEntries.map((e) => e.intensity)) : 0;
  const topLocation = monthEntries.length ? mode(monthEntries.map((e) => locationLabel(e.location))) : "N/A";
  const hourHeat = monthEntries.length ? mode(monthEntries.map((e) => new Date(e.datetime).getHours())) : "N/A";
  const lines = [
    `頭痛ログ 振り返りレポート (${month})`,
    `対象月: ${month}`,
    `記録件数: ${monthEntries.length}件`,
    `平均強度: ${avgIntensity} / 10`,
    `最多部位: ${topLocation}`,
    `服薬記録率: ${medRate}%`,
    `気圧との相関: ${pressureCorr}`,
    `頭痛が多い時間帯: ${hourHeat}時台`,
  ];

  // Render Japanese text to canvas first to avoid font issues in jsPDF.
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    showToast("PDFの生成に失敗しました。");
    return;
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111827";
  ctx.font = "bold 46px 'Noto Sans JP', 'Yu Gothic UI', sans-serif";
  ctx.fillText(lines[0], 70, 110);
  ctx.font = "32px 'Noto Sans JP', 'Yu Gothic UI', sans-serif";
  lines.slice(1).forEach((line, idx) => {
    ctx.fillText(line, 70, 190 + idx * 78);
  });
  ctx.fillStyle = "#4b5563";
  ctx.font = "26px 'Noto Sans JP', 'Yu Gothic UI', sans-serif";
  ctx.fillText("プライバシー: 記録データはこの端末内にのみ保存されます。", 70, 860);

  const imageData = canvas.toDataURL("image/png");
  doc.addImage(imageData, "PNG", 8, 8, 194, 178);
  doc.save(`MigraLog-${month}.pdf`);
}

function downloadICS(id) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;
  const start = new Date(entry.datetime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${entry.id}@migralog`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:頭痛ログ 強度${entry.intensity}`,
    `DESCRIPTION:${(entry.memo || "").replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `migralog-${entry.datetime.slice(0, 10)}-calendar-event.ics`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("カレンダーに追加するファイルを作成しました");
}

function toICSDate(date) {
  return date.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
}

function openDeviceCalendar() {
  if (!window.confirm("この端末のカレンダーに取り込める予定ファイルを作成します。よろしいですか？")) return;
  if (entries[0]) {
    downloadICS(entries[0].id);
  } else {
    downloadCustomICS({
      id: createEntryId(),
      datetime: new Date().toISOString(),
      intensity: 5,
      memo: "MigraLogからの連携イベント",
    });
  }
  showToast("端末カレンダー用の予定ファイルを作成しました");
}

function downloadCustomICS(entry) {
  const start = new Date(entry.datetime);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${entry.id}@migralog`,
    `DTSTAMP:${toICSDate(new Date())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:頭痛ログ 強度${entry.intensity}`,
    `DESCRIPTION:${(entry.memo || "").replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `migralog-calendar-event.ics`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("予定ファイルを作成しました");
}
