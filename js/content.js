import { CONFIG } from "./config.js";
import { state } from "./state.js";
import { zonesEl } from "./dom.js";
import { $, rng } from "./utils.js";
import { spriteCanvas, ITEM_SPRITES, SKIN } from "./sprites.js";

const DAY_MS = 86400000;

function daysTogether(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((today - start) / DAY_MS) + 1;
}

export function buildIntro() {
  $("#i-names").textContent = `${CONFIG.groom} ♥ ${CONFIG.bride}`;
  $("#i-lead").textContent = CONFIG.lead;
  $("#i-greeting").replaceChildren(
    ...CONFIG.greeting.flatMap((line, i) =>
      i ? [document.createElement("br"), line] : [line],
    ),
  );
  $("#i-days").textContent = daysTogether(CONFIG.together).toLocaleString(
    "ko-KR",
  );
  if (matchMedia("(pointer:coarse)").matches)
    $("#i-hint").textContent = "아래로 스크롤 해보세요";
}

const POSTER_W = 300,
  POSTER_H = 430;

function buildMovies(images) {
  const wrap = document.createElement("div");
  wrap.className = "movies";
  images.forEach(
    ({ src, title, width = POSTER_W, height = POSTER_H, large }) => {
      const fig = document.createElement("figure");
      const img = document.createElement("img");
      if (large) img.className = "large";
      img.src = src;
      img.alt = title;
      img.width = width;
      img.height = height;
      img.loading = "lazy";
      img.decoding = "async";
      const cap = document.createElement("figcaption");
      cap.textContent = title;
      fig.append(img, cap);
      wrap.append(fig);
    },
  );
  return wrap;
}

export function buildStory() {
  const z = zonesEl[1];
  CONFIG.story.forEach((s) => {
    const w = document.createElement("div");
    w.className = "sign";
    const b = document.createElement("div");
    b.className = "board px";
    const a = document.createElement("div");
    a.className = "when";
    a.textContent = s.when;
    const h = document.createElement("h2");
    h.textContent = s.title;
    const p = document.createElement("p");
    p.textContent = s.text;
    b.append(a, h, p);
    if (s.images?.length) b.append(buildMovies(s.images));
    const post = document.createElement("div");
    post.className = "post";
    w.append(b, post);
    z.append(w);
  });
}

export function placeStory() {
  const { zw } = state;
  const signs = [...zonesEl[1].querySelectorAll(".sign")],
    n = signs.length;
  signs.forEach((s, i) => {
    s.style.left = zw[1] * (0.14 + (0.72 * i) / (n - 1)) + "px";
  });
}

export function buildLikes() {
  const grid = $("#items"),
    talk = $("#talk");
  CONFIG.likes.forEach((it) => {
    const btn = document.createElement("button");
    btn.className = "item";
    btn.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-label", it.name);
    const sp = ITEM_SPRITES[it.id];
    const c = sp
      ? spriteCanvas(sp.rows, sp.pal)
      : document.createElement("canvas");
    const pr = document.createElement("span");
    pr.className = "price";
    pr.textContent = it.price;
    btn.append(c, pr);
    btn.addEventListener("click", () => {
      grid
        .querySelectorAll(".item")
        .forEach((b) => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      talk.replaceChildren();
      const h = document.createElement("h3");
      h.textContent = it.name;
      const who = document.createElement("span");
      who.className = "who";
      who.textContent = it.who;
      h.append(who);
      const p = document.createElement("p");
      p.textContent = it.text;
      talk.append(h, p);
    });
    grid.append(btn);
  });
}

function placeholderPhoto(i) {
  const r = rng(31 + i * 7),
    c = document.createElement("canvas");
  c.width = 48;
  c.height = 36;
  const x = c.getContext("2d");
  const skies = [
    ["#ffd6a5", "#ffadad", "#bdb2ff"],
    ["#9bf6ff", "#a0c4ff", "#caffbf"],
    ["#fdffb6", "#ffd6a5", "#ffadad"],
    ["#1d1b3a", "#3a2d6b", "#6b4ea8"],
    ["#e0f4ff", "#c9d6e8", "#f7f7ff"],
    ["#ffc8dd", "#ffafcc", "#cdb4db"],
  ];
  const sk = skies[i % skies.length];
  for (let y = 0; y < 24; y++) {
    x.fillStyle = sk[Math.min(2, Math.floor(y / 8))];
    x.fillRect(0, y, 48, 1);
  }
  x.fillStyle = i % 6 === 3 ? "#fdf5c9" : "#fff3b0";
  x.fillRect(32, 5, 5, 5);
  x.fillRect(31, 6, 7, 3);
  x.fillRect(33, 4, 3, 7);
  const ground = [
    "#7cc56b",
    "#3a86c8",
    "#9a8f80",
    "#4f9d69",
    "#ffffff",
    "#e8c6d8",
  ][i % 6];
  for (let xx = 0; xx < 48; xx++) {
    const h = 22 + Math.round(Math.sin(xx * 0.18 + i) * 2 + r() * 1);
    x.fillStyle = ground;
    x.fillRect(xx, h, 1, 36 - h);
  }
  if (i % 6 === 4) {
    x.fillStyle = "#ffffff";
    for (let k = 0; k < 30; k++)
      x.fillRect(Math.floor(r() * 48), Math.floor(r() * 22), 1, 1);
  }
  if (i % 6 === 3) {
    x.fillStyle = "#ffffff";
    for (let k = 0; k < 14; k++)
      x.fillRect(Math.floor(r() * 48), Math.floor(r() * 14), 1, 1);
  }
  // tiny couple
  const px = (cx, col) => {
    x.fillStyle = "#2b1d14";
    x.fillRect(cx, 25, 2, 1);
    x.fillStyle = SKIN;
    x.fillRect(cx, 26, 2, 1);
    x.fillStyle = col;
    x.fillRect(cx, 27, 2, 3);
    x.fillStyle = "#26213a";
    x.fillRect(cx, 30, 1, 2);
    x.fillRect(cx + 1, 30, 1, 2);
  };
  px(20, "#4a7bd0");
  px(24, "#ff5d8f");
  x.fillStyle = "#ff5d8f";
  x.fillRect(22, 23, 1, 1);
  return c;
}

function photoNode(p, i, isFull = false) {
  if (p.src) {
    const im = new Image();
    im.src = isFull ? p.full || p.src : p.src;
    im.alt = p.caption || `사진 ${i + 1}`;
    if (p.width && p.height) {
      im.width = p.width;
      im.height = p.height;
    }
    im.decoding = "async";
    if (!isFull) im.loading = "lazy";
    return im;
  }
  const c = placeholderPhoto(i);
  c.setAttribute("role", "img");
  c.setAttribute("aria-label", p.caption || "사진");
  return c;
}

export const GALLERY_TITLE_PX = 60;
const PAIR_OFFSET_RATIO = 0.2;
const SWIPE_MIN_PX = 50;
let lbIdx = 0;

function showPhoto(i) {
  const n = CONFIG.photos.length;
  lbIdx = (i + n) % n;
  const p = CONFIG.photos[lbIdx];
  $("#lbMedia").replaceChildren(photoNode(p, lbIdx, true));
  $("#lbCap").textContent = p.caption || "";
  $("#lbCount").textContent = `${lbIdx + 1} / ${n}`;
}

function openLightbox(i) {
  showPhoto(i);
  $("#lightbox").showModal();
}

export function buildGallery() {
  const z = zonesEl[3];
  const t = document.createElement("div");
  t.className = "room-title";
  const sub = document.createElement("span");
  sub.className = "room-sub";
  sub.textContent = "클릭하면 확대돼요";
  t.append("웨딩 사진 전시회", sub);
  t.id = "roomTitle";
  z.append(t);
  CONFIG.photos.forEach((p, i) => {
    const f = document.createElement("div");
    f.className = "frame";
    const b = document.createElement("button");
    b.setAttribute("aria-label", (p.caption || `사진 ${i + 1}`) + " 크게 보기");
    b.append(photoNode(p, i));
    b.addEventListener("click", () => openLightbox(i));
    f.append(b);
    if (p.caption) {
      const pl = document.createElement("div");
      pl.className = "plaque";
      pl.textContent = p.caption;
      f.append(pl);
    }
    z.append(f);
  });
}

export function galleryGroups(isPaired) {
  const idx = CONFIG.photos.map((_, i) => i);
  if (!isPaired || !idx.length) return idx.map((i) => [i]);
  const [first, ...rest] = idx;
  const pairs = [];
  for (let k = 0; k < rest.length; k += 2) pairs.push(rest.slice(k, k + 2));
  return [[first], ...pairs];
}

export function placeGallery() {
  const { zw, VW, areaTop, areaH, galleryPaired } = state;
  const fr = [...zonesEl[3].querySelectorAll(".frame")];
  const groups = galleryGroups(galleryPaired);
  const slot = zw[3] / Math.max(1, groups.length);
  const pairOffset = Math.min(VW, slot) * PAIR_OFFSET_RATIO;
  const y = areaTop + GALLERY_TITLE_PX + (areaH - GALLERY_TITLE_PX) / 2;
  const stops = groups.map((g, gi) => {
    const cx = slot * (gi + 0.5);
    g.forEach((pi, k) => {
      const dx = g.length > 1 ? (k ? pairOffset : -pairOffset) : 0;
      fr[pi].style.left = cx + dx + "px";
      fr[pi].style.top = y + "px";
    });
    return cx;
  });
  state.galleryStops = stops;
  $("#roomTitle").style.left = (stops[0] ?? zw[3] / 2) + "px";
}

export function bindLightbox() {
  const lb = $("#lightbox");
  const multi = CONFIG.photos.length > 1;
  $("#lbPrev").hidden = $("#lbNext").hidden = !multi;
  $("#lbClose").addEventListener("click", () => lb.close());
  $("#lbPrev").addEventListener("click", () => showPhoto(lbIdx - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(lbIdx + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) lb.close();
  });
  lb.addEventListener("keydown", (e) => {
    if (!multi) return;
    if (e.key === "ArrowLeft") showPhoto(lbIdx - 1);
    else if (e.key === "ArrowRight") showPhoto(lbIdx + 1);
    else return;
    e.preventDefault();
  });
  let touchX = null;
  const media = $("#lbMedia");
  media.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), {
    passive: true,
  });
  media.addEventListener("touchend", (e) => {
    if (touchX === null || !multi) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX) showPhoto(lbIdx + (dx < 0 ? 1 : -1));
  });
}
