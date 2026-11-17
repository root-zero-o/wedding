import { state } from "./state.js";
import { stage, track, bg, hero, spacer, zonesEl } from "./dom.js";
import { buildScenery } from "./scenery.js";
import {
  placeStory,
  placeGallery,
  galleryGroups,
  GALLERY_TITLE_PX,
} from "./content.js";
import { placeGuest } from "./guestbook.js";

const ZONE_WIDTHS = [1, 2.6, 1.15, 1.9, 1.5];
const GALLERY_ZONE = 3;
const GUEST_ZONE = 4;
const GUEST_MIN_W = 1000;
const GALLERY_CHROME_PX = 110;
const FRAME_MAX_W = 640;
const FRAME_VW_RATIO = 0.72;
const FRAME_PAIR_VW_RATIO = 0.34;
const GALLERY_PAIR_MIN_VW = 1024;

export function layout() {
  const prog =
    state.camMax > state.camMin
      ? (state.cam - state.camMin) / (state.camMax - state.camMin)
      : 0;
  const VW = innerWidth,
    VH = innerHeight;
  const P = VW < 600 ? 3 : 4,
    S = VW < 600 ? 4 : VH < 700 ? 5 : 6;
  const base = Math.max(VW * 1.3, 900);
  const galleryPaired = VW >= GALLERY_PAIR_MIN_VW;
  const zw = ZONE_WIDTHS.map((m) => Math.round((base * m) / P) * P);
  zw[GALLERY_ZONE] = Math.max(
    zw[GALLERY_ZONE],
    Math.round((galleryGroups(galleryPaired).length * VW) / P) * P,
  );
  zw[GUEST_ZONE] = Math.round(Math.max(VW, GUEST_MIN_W) / P) * P;
  const zs = zw.map((_, i) => zw.slice(0, i).reduce((a, b) => a + b, 0));
  const total = zw.reduce((a, b) => a + b, 0);
  const groundY = Math.round((VH - Math.max(80, VH * 0.15)) / P) * P;
  const safeTop =
    parseFloat(getComputedStyle(document.documentElement).paddingTop) || 0;
  const areaTop = safeTop + 74;
  const areaH = Math.max(220, groundY - 20 * S - 14 - areaTop);
  const camMin = zw[0] / 2 - VW / 2,
    camMax = zs[GUEST_ZONE] + zw[GUEST_ZONE] - VW;
  const WA = Math.ceil(VW / P) + 1,
    HA = Math.ceil(VH / P) + 1,
    G = groundY / P;
  Object.assign(state, {
    VW,
    VH,
    P,
    S,
    WA,
    HA,
    G,
    groundY,
    zw,
    zs,
    total,
    camMin,
    camMax,
    areaTop,
    areaH,
    galleryPaired,
  });

  spacer.style.height = camMax - camMin + VH + "px";
  bg.width = WA;
  bg.height = HA;
  bg.style.width = WA * P + "px";
  bg.style.height = HA * P + "px";
  hero.width = 30;
  hero.height = 22;
  hero.style.width = 30 * S + "px";
  hero.style.height = 22 * S + "px";
  hero.style.left = Math.round(VW / 2 - 15 * S) + "px";
  hero.style.top = groundY - 22 * S + S + "px";
  track.style.width = total + "px";
  stage.style.setProperty("--areaTop", areaTop + "px");
  stage.style.setProperty("--areaH", areaH + "px");
  stage.style.setProperty("--groundFromBottom", VH - groundY + "px");
  stage.style.setProperty("--itemSize", (areaH < 430 ? 44 : 60) + "px");
  stage.style.setProperty(
    "--frameW",
    Math.round(
      Math.min(
        FRAME_MAX_W,
        VW * (galleryPaired ? FRAME_PAIR_VW_RATIO : FRAME_VW_RATIO),
        (areaH - GALLERY_TITLE_PX - GALLERY_CHROME_PX) / 0.75,
      ),
    ) + "px",
  );
  stage.style.setProperty(
    "--frameH",
    Math.round(areaH - GALLERY_TITLE_PX - GALLERY_CHROME_PX) + "px",
  );
  zonesEl.forEach((z, i) => {
    z.style.left = zs[i] + "px";
    z.style.width = zw[i] + "px";
  });

  buildScenery();
  placeStory();
  placeGallery();
  placeGuest();
  const top = prog * (camMax - camMin);
  window.scrollTo(0, top);
  state.camTarget = state.cam = camMin + top;
}
