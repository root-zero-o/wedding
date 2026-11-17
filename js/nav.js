import { state } from "./state.js";
import { $, reduceMotion } from "./utils.js";
import { zonesEl } from "./dom.js";

const ZONE_NAMES = ["소개", "이야기", "좋아하는 것", "갤러리", "방명록"];
const ARROW_SCROLL_RATIO = 0.45;
const STORY_ZONE = 1;
const LIKES_ZONE = 2;
const GALLERY_ZONE = 3;
const GUEST_ZONE = 4;
const SNAP_DELAY_MS = 50;
const SNAP_EPSILON_PX = 2;
const SNAP_FLICK_RATIO = 0.15;
const SNAP_FLICK_MAX_PX = 40;
let navBtns = [];
let snapTimer;
let anchorIdx = null;
let lastStopX = null;

const nearestIdx = (xs, x, ids = xs.map((_, i) => i)) =>
  ids.reduce((a, b) => (Math.abs(xs[b] - x) < Math.abs(xs[a] - x) ? b : a));

function pickSign(xs, center, gap, freeIdx) {
  if (anchorIdx === null) return nearestIdx(xs, center);
  const delta = center - xs[anchorIdx];
  if (Math.abs(delta) < Math.min(SNAP_FLICK_MAX_PX, gap * SNAP_FLICK_RATIO))
    return nearestIdx(xs, center);
  if (anchorIdx === freeIdx) return null;
  const ahead = xs
    .map((_, i) => i)
    .filter((i) => (delta > 0 ? i > anchorIdx : i < anchorIdx));
  return ahead.length ? nearestIdx(xs, center, ahead) : null;
}

function snapTargets() {
  const { zs, zw, VW } = state;
  const xsOf = (z, sel) =>
    [...zonesEl[z].querySelectorAll(sel)].map(
      (el) => zs[z] + parseFloat(el.style.left),
    );
  const signs = xsOf(STORY_ZONE, ".sign");
  const frames = state.galleryStops.map((x) => zs[GALLERY_ZONE] + x);
  const gap = signs.length > 1 ? signs[1] - signs[0] : VW;
  const likesX = zs[LIKES_ZONE] + zw[LIKES_ZONE] / 2;
  const zoneRange = (z) => [zs[z], zs[z] + zw[z]];
  const guestX = zs[GUEST_ZONE] + zw[GUEST_ZONE] / 2;
  const ranges = [
    signs.length ? [signs[0] - gap / 2, signs.at(-1) + gap / 2] : null,
    zoneRange(LIKES_ZONE),
    frames.length ? zoneRange(GALLERY_ZONE) : null,
    [guestX - VW / 2, guestX + VW / 2],
  ].filter(Boolean);
  const inRange = (c) => ranges.some(([a, b]) => c >= a && c <= b);
  const xs = [...signs, likesX, ...frames, guestX];
  return { xs, gap, inRange, freeIdx: xs.length - 1 };
}

function approachIdx(xs, center, prev) {
  const i = nearestIdx(xs, center);
  const dist = Math.abs(center - xs[i]);
  const isApproaching = prev === null || dist < Math.abs(prev - xs[i]);
  return isApproaching || dist < SNAP_FLICK_MAX_PX ? i : null;
}

function snapToStop() {
  const { camMin, camMax, VW } = state;
  const { xs, gap, inRange, freeIdx } = snapTargets();
  const center = camMin + window.scrollX + VW / 2;
  const prev = lastStopX;
  lastStopX = center;
  if (!inRange(center)) {
    anchorIdx = null;
    return;
  }
  anchorIdx =
    anchorIdx === null
      ? approachIdx(xs, center, prev)
      : pickSign(xs, center, gap, freeIdx);
  if (anchorIdx === null) return;
  const top =
    Math.min(camMax, Math.max(camMin, xs[anchorIdx] - VW / 2)) - camMin;
  if (Math.abs(top - window.scrollX) < SNAP_EPSILON_PX) return;
  window.scrollTo({ left: top, behavior: reduceMotion ? "auto" : "smooth" });
}

function zoneEntryX(i) {
  const { zs, zw } = state;
  if (i === STORY_ZONE) {
    const first = zonesEl[STORY_ZONE].querySelector(".sign");
    if (first) return zs[i] + parseFloat(first.style.left);
  }
  if (i === GALLERY_ZONE && state.galleryStops.length)
    return zs[i] + state.galleryStops[0];
  return zs[i] + zw[i] / 2;
}

export function goToZone(i) {
  const { camMin, camMax, VW } = state;
  const target = Math.min(camMax, Math.max(camMin, zoneEntryX(i) - VW / 2));
  anchorIdx = null;
  lastStopX = null;
  window.scrollTo({
    left: target - camMin,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

export function setActiveNav(z) {
  navBtns.forEach((b, i) =>
    b.setAttribute("aria-current", i === z ? "true" : "false"),
  );
}

export function initNav() {
  navBtns = ZONE_NAMES.map((n, i) => {
    const b = document.createElement("button");
    b.textContent = n;
    b.addEventListener("click", () => goToZone(i));
    $("#nav").append(b);
    return b;
  });
  addEventListener(
    "wheel",
    (e) => {
      if (document.querySelector("dialog[open]")) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        window.scrollBy(e.deltaY, 0);
        e.preventDefault();
      }
    },
    { passive: false },
  );
  addEventListener(
    "scroll",
    () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToStop, SNAP_DELAY_MS);
    },
    { passive: true },
  );
  addEventListener("keydown", (e) => {
    if (
      document.querySelector("dialog[open]") ||
      /INPUT|TEXTAREA/.test(document.activeElement?.tagName)
    )
      return;
    const step = state.VW * ARROW_SCROLL_RATIO;
    if (e.key === "ArrowRight") {
      window.scrollBy({ left: step, behavior: "smooth" });
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      window.scrollBy({ left: -step, behavior: "smooth" });
      e.preventDefault();
    }
  });
}
