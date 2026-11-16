import { CONFIG } from "./config.js";
import { state } from "./state.js";
import { zonesEl } from "./dom.js";
import { $, rng } from "./utils.js";
import { spriteCanvas, ITEM_SPRITES, SKIN } from "./sprites.js";

export function buildIntro() {
  $("#i-date").textContent = CONFIG.dateText;
  $("#i-names").textContent = `${CONFIG.groom} ♥ ${CONFIG.bride}`;
  $("#i-lead").textContent = CONFIG.lead;
  const dl = $("#i-info");
  CONFIG.info.forEach(([k, v]) => {
    const dt = document.createElement("dt");
    dt.textContent = k;
    const dd = document.createElement("dd");
    dd.textContent = v;
    dl.append(dt, dd);
  });
  if (matchMedia("(pointer:coarse)").matches)
    $("#i-hint").textContent = "위로 쓸어 올리면 둘이 같이 걸어가요";
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

function photoNode(p, i) {
  if (p.src) {
    const im = new Image();
    im.src = p.src;
    im.alt = p.caption || "";
    return im;
  }
  const c = placeholderPhoto(i);
  c.setAttribute("role", "img");
  c.setAttribute("aria-label", p.caption || "사진");
  return c;
}

export function buildGallery() {
  const z = zonesEl[3];
  const t = document.createElement("div");
  t.className = "room-title";
  t.textContent = "우리 사진 전시회";
  t.id = "roomTitle";
  z.append(t);
  CONFIG.photos.forEach((p, i) => {
    const f = document.createElement("div");
    f.className = "frame";
    const b = document.createElement("button");
    b.setAttribute("aria-label", (p.caption || "사진") + " 크게 보기");
    b.append(photoNode(p, i));
    const pl = document.createElement("div");
    pl.className = "plaque";
    pl.textContent = p.caption || "";
    b.addEventListener("click", () => {
      const m = $("#lbMedia");
      m.replaceChildren(photoNode(p, i));
      $("#lbCap").textContent = p.caption || "";
      $("#lightbox").showModal();
    });
    f.append(b, pl);
    z.append(f);
  });
}

export function placeGallery() {
  const { zw, areaTop, areaH } = state;
  const fr = [...zonesEl[3].querySelectorAll(".frame")],
    n = fr.length;
  const y = areaTop + areaH * 0.55;
  fr.forEach((f, i) => {
    f.style.left = zw[3] * ((i + 0.5) / n) + "px";
    f.style.top = y + "px";
  });
  $("#roomTitle").style.left = zw[3] / 2 + "px";
}

export function bindLightbox() {
  $("#lbClose").addEventListener("click", () => $("#lightbox").close());
  $("#lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") e.target.close();
  });
}
