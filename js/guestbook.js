import { state } from "./state.js";
import { $, rng, hash } from "./utils.js";
import { spriteCanvas, HOLD_SHAPES, HOLD_COLORS } from "./sprites.js";
import { goToZone } from "./nav.js";

const API = "/api/messages";
const ADMIN_STORAGE_KEY = "wedding-admin-key";
const MAX_NAME = 20,
  MAX_MSG = 160;

let entries = [],
  isAdmin = false,
  adminKey = "",
  firstSnap = true;
const seen = new Set();
let slots = [];

export function placeGuest() {
  const { zw, VW, areaTop, areaH } = state;
  const sign = $("#gbSign");
  sign.style.left = zw[4] / 2 + "px";
  sign.style.top = areaTop + 8 + "px";
  // build slot grid avoiding the sign
  const signW = Math.min(340, VW * 0.84) + 40,
    signH = sign.offsetHeight + 30;
  const r = rng(7);
  slots = [];
  const stepX = 66,
    stepY = 58,
    x0 = 50,
    x1 = zw[4] - 50,
    y0 = areaTop + 20,
    y1 = areaTop + areaH - 20;
  for (let y = y0; y <= y1; y += stepY)
    for (let x = x0; x <= x1; x += stepX) {
      const jx = x + (r() - 0.5) * 26,
        jy = y + (r() - 0.5) * 22;
      if (Math.abs(jx - zw[4] / 2) < signW / 2 + 20 && jy < areaTop + 8 + signH)
        continue;
      slots.push([jx, jy, r()]);
    }
  // order: start near the bottom-center, spread outwards
  slots.sort(
    (a, b) =>
      Math.abs(a[0] - zw[4] / 2) * 0.6 +
      (y1 - a[1]) * 1.4 +
      a[2] * 520 -
      (Math.abs(b[0] - zw[4] / 2) * 0.6 + (y1 - b[1]) * 1.4 + b[2] * 520),
  );
  renderHolds(false);
}

function holdCanvas(id) {
  const h = hash(id),
    sh = HOLD_SHAPES[h % HOLD_SHAPES.length],
    col = HOLD_COLORS[(h >>> 4) % HOLD_COLORS.length];
  return spriteCanvas(sh, { x: col[0], d: col[1], b: "#3a3a48" });
}

function startTape(left, top) {
  const t = document.createElement("div");
  t.className = "tape";
  t.textContent = "START";
  t.style.left = left + "px";
  t.style.top = top + "px";
  return t;
}

function renderHolds(animate = true) {
  const wrap = $("#holds");
  wrap.replaceChildren();
  $("#gbCount").textContent = entries.length + " HOLDS";
  if (!slots.length) return;
  if (!entries.length) wrap.append(startTape(slots[0][0], slots[0][1]));
  entries.forEach((e, i) => {
    const s = slots[i % slots.length],
      lap = Math.floor(i / slots.length);
    const b = document.createElement("button");
    b.className = "hold";
    b.style.left = s[0] + lap * 14 + "px";
    b.style.top = s[1] + lap * 10 + "px";
    b.setAttribute("aria-label", (e.name || "익명") + "님의 축하 메시지");
    b.append(holdCanvas(e.id));
    if (animate && !seen.has(e.id) && !firstSnap) b.classList.add("new");
    b.addEventListener("click", (ev) => {
      ev.stopPropagation();
      showBubble(e, b);
    });
    wrap.append(b);
  });
  if (entries.length === 1)
    wrap.append(startTape(slots[0][0], slots[0][1] + 28));
  entries.forEach((e) => seen.add(e.id));
  firstSnap = false;
}

function fmtTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function showBubble(e, btn) {
  const { zw, areaTop } = state;
  const bb = $("#bubble");
  bb.replaceChildren();
  const n = document.createElement("div");
  n.className = "n";
  n.textContent = e.name || "익명";
  const m = document.createElement("div");
  m.className = "m";
  m.textContent = e.msg || "";
  const t = document.createElement("div");
  t.className = "t";
  const ts = document.createElement("span");
  ts.textContent = fmtTime(e.ts);
  t.append(ts);
  if (isAdmin) {
    const d = document.createElement("button");
    d.className = "del";
    d.textContent = "삭제";
    d.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      if (!confirm("이 메시지를 지울까요?")) return;
      try {
        await api("DELETE", { query: "?id=" + encodeURIComponent(e.id) });
        await loadEntries();
      } catch (err) {
        console.error("guestbook delete failed", err);
        alert("삭제하지 못했어요.");
      }
      hideBubble();
    });
    t.append(d);
  }
  bb.append(n, m, t);
  bb.style.left =
    Math.min(Math.max(parseFloat(btn.style.left), 150), zw[4] - 150) + "px";
  bb.style.top = btn.style.top;
  if (parseFloat(btn.style.top) < areaTop + 170)
    bb.setAttribute("data-below", "");
  else bb.removeAttribute("data-below");
  bb.style.display = "block";
}
function hideBubble() {
  $("#bubble").style.display = "none";
}

function setNote(msg) {
  const n = $("#gbNote");
  n.textContent = msg || "";
  n.hidden = !msg;
}

function readAdminKey() {
  const params = new URLSearchParams(location.search);
  const fromUrl = params.get("admin");
  if (fromUrl) {
    params.delete("admin");
    const qs = params.toString();
    history.replaceState(
      null,
      "",
      location.pathname + (qs ? "?" + qs : "") + location.hash,
    );
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, fromUrl);
    } catch (e) {}
    return fromUrl;
  }
  try {
    return localStorage.getItem(ADMIN_STORAGE_KEY) || "";
  } catch (e) {
    return "";
  }
}

async function api(method, { body, query = "" } = {}) {
  const headers = {};
  if (body) headers["content-type"] = "application/json";
  if (adminKey) headers["x-admin-key"] = adminKey;
  const res = await fetch(API + query, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "HTTP " + res.status);
    err.code = data.error;
    throw err;
  }
  return data;
}

async function loadEntries() {
  try {
    const data = await api("GET");
    entries = Array.isArray(data.entries) ? data.entries : [];
    isAdmin = !!data.isAdmin;
    setNote("");
    renderHolds(true);
  } catch (err) {
    console.error("guestbook load failed", err);
    setNote("메시지를 불러오지 못했어요. 잠시 뒤에 새로고침해 주세요.");
  }
}

async function submit() {
  const name = $("#gbName").value.trim().slice(0, MAX_NAME),
    msg = $("#gbMsg").value.trim().slice(0, MAX_MSG);
  if (!name) {
    $("#gbErr").textContent = "이름을 적어 주세요.";
    return;
  }
  if (!msg) {
    $("#gbErr").textContent = "축하 메시지를 적어 주세요.";
    return;
  }
  const btn = $("#gbSend");
  btn.disabled = true;
  btn.textContent = "다는 중…";
  try {
    await api("POST", { body: { name, msg } });
    await loadEntries();
    $("#gbMsg").value = "";
    $("#gbLen").textContent = `0 / ${MAX_MSG}`;
    $("#gbDialog").close();
    goToZone(4);
  } catch (err) {
    console.error("guestbook submit failed", err);
    $("#gbErr").textContent =
      err.code === "full"
        ? "방명록이 가득 찼어요."
        : "저장하지 못했어요. 잠시 뒤에 다시 눌러 주세요.";
  } finally {
    btn.disabled = false;
    btn.textContent = "홀드 달기";
  }
}

function bindEvents() {
  const dlg = $("#gbDialog");
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#bubble")) hideBubble();
  });
  $("#gbOpen").addEventListener("click", () => {
    $("#gbErr").textContent = "";
    dlg.showModal();
    $("#gbName").focus();
  });
  $("#gbCancel").addEventListener("click", () => dlg.close());
  $("#gbMsg").addEventListener("input", (e) => {
    $("#gbLen").textContent = `${e.target.value.length} / ${MAX_MSG}`;
  });
  $("#gbSend").addEventListener("click", submit);
}

export function initGuestbook() {
  bindEvents();
  adminKey = readAdminKey();
  loadEntries();
}
