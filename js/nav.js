import { state } from "./state.js";
import { $, reduceMotion } from "./utils.js";
import { zonesEl } from "./dom.js";

const ZONE_NAMES = ["소개", "이야기", "좋아하는 것", "갤러리", "방명록"];
const ARROW_SCROLL_RATIO = 0.45;
const STORY_ZONE = 1;
const SNAP_DELAY_MS = 140;
const SNAP_EPSILON_PX = 2;
let navBtns = [];
let snapTimer;

function snapToStory() {
  const { camMin, camMax, zs, VW } = state;
  const xs = [...zonesEl[STORY_ZONE].querySelectorAll(".sign")].map(
    (s) => zs[STORY_ZONE] + parseFloat(s.style.left),
  );
  if (!xs.length) return;
  const center = camMin + window.scrollY + VW / 2;
  const half = (xs.length > 1 ? xs[1] - xs[0] : VW) / 2;
  if (center < xs[0] - half || center > xs[xs.length - 1] + half) return;
  const nearest = xs.reduce((a, b) =>
    Math.abs(b - center) < Math.abs(a - center) ? b : a,
  );
  const top = Math.min(camMax, Math.max(camMin, nearest - VW / 2)) - camMin;
  if (Math.abs(top - window.scrollY) < SNAP_EPSILON_PX) return;
  window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
}

export function goToZone(i) {
  const { camMin, camMax, zs, zw, VW } = state;
  const target = Math.min(camMax, Math.max(camMin, zs[i] + zw[i] / 2 - VW / 2));
  window.scrollTo({
    top: target - camMin,
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
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        window.scrollBy(0, e.deltaX);
        e.preventDefault();
      }
    },
    { passive: false },
  );
  addEventListener(
    "scroll",
    () => {
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snapToStory, SNAP_DELAY_MS);
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
      window.scrollBy({ top: step, behavior: "smooth" });
      e.preventDefault();
    }
    if (e.key === "ArrowLeft") {
      window.scrollBy({ top: -step, behavior: "smooth" });
      e.preventDefault();
    }
  });
}
