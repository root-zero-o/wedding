import { hero } from './dom.js';
import { reduceMotion } from './utils.js';
import { GROOM_TOP, GROOM_LEGS, BRIDE_TOP, BRIDE_LEGS, SKIN, EYE, OUTFITS } from './sprites.js';

const hctx=hero.getContext('2d');
const WALK_GRACE_MS=140, IDLE_HEART_MS=2200, HEART_INTERVAL_MS=1600;

let zoneNow=0, walkDist=0, lastMove=0, facing=1, particles=[], hearts=[], lastHeart=0, blinkUntil=0, nextBlink=performance.now()+2500;

function drawSprite(top,legs,pal,ox,oy,blink){
  const rows=top.concat(legs);
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{ if(ch==='.')return; const c = ch==='s'?SKIN : ch==='e'?(blink?SKIN:EYE) : pal[ch]; if(!c)return; hctx.fillStyle=c; hctx.fillRect(ox+x,oy+y,1,1) }));
}

function drawHero(now,walking){
  hctx.clearRect(0,0,30,22);
  const o=OUTFITS[zoneNow], blink=now<blinkUntil;
  if(now>nextBlink){blinkUntil=now+130;nextBlink=now+2500+Math.random()*2500}
  const f = walking ? 1+(Math.floor(walkDist/22)%2) : 0;
  const bob = walking && f===1 ? 1 : 0;
  drawSprite(GROOM_TOP,GROOM_LEGS[f],o.g,5,7-bob,blink);
  drawSprite(BRIDE_TOP,BRIDE_LEGS[f===0?0:3-f],o.b,14,7-(walking&&f===2?1:0),blink);
  // hand-holding pixel
  hctx.fillStyle=SKIN; hctx.fillRect(14,16,1,1);
  particles=particles.filter(p=>p.life>0);
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=.02;p.life--; hctx.fillStyle=p.life>8?"#ffffff":"#d8d2e6"; hctx.fillRect(Math.round(p.x),Math.round(p.y),p.s,p.s)}
  hearts=hearts.filter(h=>h.life>0);
  for(const h of hearts){h.y-=.06;h.life--; const x=Math.round(h.x),y=Math.round(h.y); hctx.fillStyle="#ff5d8f"; hctx.fillRect(x,y,1,1);hctx.fillRect(x+2,y,1,1);hctx.fillRect(x,y+1,3,1);hctx.fillRect(x+1,y+2,1,1)}
  hero.style.transform = facing<0?'scaleX(-1)':'none';
}

function poof(){
  if(reduceMotion)return;
  for(const cx of [10,19]) for(let k=0;k<12;k++){const a=Math.random()*Math.PI*2,sp=.25+Math.random()*.4;particles.push({x:cx,y:13,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-.15,life:14+Math.floor(Math.random()*10),s:Math.random()<.4?2:1})}
}

/** per-frame: d = camera delta (px), zone = current zone index */
export function updateHero(now,d,zone){
  if(Math.abs(d)>.25){walkDist+=Math.abs(d);lastMove=now;facing=d>0?1:-1}
  const walking = now-lastMove<WALK_GRACE_MS;
  if(zone!==zoneNow){zoneNow=zone;poof()}
  if(!walking && !reduceMotion && now-lastMove>IDLE_HEART_MS && now-lastHeart>HEART_INTERVAL_MS){lastHeart=now;hearts.push({x:14+(Math.random()-.5)*2,y:4,life:60})}
  drawHero(now,walking);
}
