import { state } from "./state.js";
import { $, reduceMotion } from "./utils.js";

const ZONE_NAMES = ["소개", "이야기", "좋아하는 것", "갤러리", "방명록"];
const ARROW_SCROLL_RATIO = 0.45;
let navBtns = [];

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
