import { state } from './state.js';
import { track } from './dom.js';
import { reduceMotion } from './utils.js';
import { buildIntro, buildStory, buildLikes, buildGallery, bindLightbox } from './content.js';
import { layout } from './layout.js';
import { placeGuest, initGuestbook } from './guestbook.js';
import { initNav, setActiveNav } from './nav.js';
import { drawBg } from './scenery.js';
import { updateHero } from './hero.js';

const CAM_EASE=.38, CAM_SNAP=.3, RESIZE_DEBOUNCE_MS=120;
let prevCam=0, curNav=-1, resizeTimer;

function zoneAt(cx){ let z=0; state.zs.forEach((s,i)=>{ if(cx>=s) z=i; }); return z; }

function frame(now){
  state.camTarget = state.camMin + window.scrollX;
  state.cam = reduceMotion ? state.camTarget : state.cam + (state.camTarget-state.cam)*CAM_EASE;
  if(Math.abs(state.camTarget-state.cam)<CAM_SNAP) state.cam=state.camTarget;
  const d=state.cam-prevCam; prevCam=state.cam;
  track.style.transform=`translate3d(${-state.cam}px,0,0)`;
  const z=zoneAt(state.cam+state.VW/2);
  if(z!==curNav){curNav=z;setActiveNav(z)}
  drawBg(); updateHero(now,d,z);
  requestAnimationFrame(frame);
}

buildIntro(); buildStory(); buildLikes(); buildGallery(); bindLightbox(); initNav();
layout();
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(layout,RESIZE_DEBOUNCE_MS)});
document.fonts?.ready.then(()=>placeGuest());
requestAnimationFrame(frame);
initGuestbook();

const LOADER_MAX_MS=3000;
const FONTS=['40px "Do Hyeon"','16px "Gowun Dodum"','16px "Silkscreen"'];

function loadFonts(){
  if(!document.fonts) return Promise.resolve();
  return Promise.all(FONTS.map(f=>document.fonts.load(f))).catch(()=>{});
}

function hideLoader(){
  const loader=document.getElementById('loader');
  if(!loader) return;
  layout(); placeGuest();
  requestAnimationFrame(()=>{
    if(reduceMotion){loader.remove();return}
    loader.addEventListener('transitionend',()=>loader.remove(),{once:true});
    loader.classList.add('done');
  });
}

Promise.race([loadFonts(),new Promise(r=>setTimeout(r,LOADER_MAX_MS))]).then(hideLoader);
