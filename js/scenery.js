import { state } from './state.js';
import { bg } from './dom.js';
import { rng } from './utils.js';
const MOBILE_MAX_VW=600;

const ctx=bg.getContext('2d');

function R(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function disc(cx,cy,r,c){ctx.fillStyle=c;for(let y=-r;y<=r;y++){const w=Math.floor(Math.sqrt(r*r-y*y));ctx.fillRect(Math.round(cx-w),Math.round(cy+y),w*2+1,1)}}
function sky(cols,x0,x1,top,bottom){
  const n=cols.length, h=(bottom-top)/n;
  for(let k=0;k<n;k++){R(x0,top+Math.floor(k*h),x1-x0,Math.ceil(h)+1,cols[k]);
    if(k<n-1){ctx.fillStyle=cols[k+1];const yy=Math.round(top+(k+1)*h)-1;for(let x=Math.floor(x0)+(yy%2);x<x1;x+=2)ctx.fillRect(x,yy,1,1)}}
}

export function buildScenery(){
  const {zw,P,WA,G}=state;
  const r=rng(42), A=i=>zw[i]/P;
  const span=(i,extra)=>[-extra, A(i)+extra];
  const sc={clouds:[],houses:[],city:[],trees:[],lamps:[]};
  { const [a,b]=span(0,WA); for(let x=a;x<b;x+=40+r()*50) sc.clouds.push({x,y:6+r()*G*.3,w:12+r()*16}); }
  { const [a,b]=span(0,WA*.4); for(let x=a;x<b;x+=26+r()*18) sc.houses.push({x,w:18+Math.floor(r()*12),h:14+Math.floor(r()*12),body:["#f7d6a8","#f4b6b6","#c9e4ff","#ffe9a8","#d9c7f2"][Math.floor(r()*5)],roof:["#d6574f","#5a6fb5","#4f9d69","#8b5a3c"][Math.floor(r()*4)]}); }
  { const [a,b]=span(1,WA); for(let x=a;x<b;x+=6+r()*14) sc.city.push({x,w:8+Math.floor(r()*12),h:12+Math.floor(r()*Math.min(40,G*.45)),win:Math.floor(r()*1e6)}); }
  { const [a,b]=span(1,WA*.3); for(let x=a;x<b;x+=34+r()*40) sc.trees.push({x,r:6+Math.floor(r()*4),h:8+Math.floor(r()*6)}); }
  for(let x=20;x<A(1);x+=70) sc.lamps.push({x});
  state.scenery=sc;
}

/* zone-local art x → screen art x with parallax factor p (1 = moves with ground) */
function px(i,lx,p){const {zs,zw,P,cam,WA}=state;const zsA=zs[i]/P,zwA=zw[i]/P,camA=cam/P,cc=zsA+zwA/2-WA/2;return Math.round(zsA+lx-camA+(camA-cc)*(1-p))}

function drawZ0(i,x0,x1){
  const {G,HA,zw,P,scenery}=state;
  sky(["#7cc6ff","#93d0ff","#abdbff","#c4e6ff","#ddf1ff"],x0,x1,0,G);
  const sx=px(i,zw[i]/P*.72,.06); disc(sx,Math.round(G*.2),7,"#fff3b0"); disc(sx,Math.round(G*.2),5,"#ffe066");
  for(const c of scenery.clouds){const x=px(i,c.x,.22); if(x+c.w<x0||x-c.w>x1)continue; R(x,c.y,c.w,3,"#ffffff");R(x+3,c.y-2,c.w-7,2,"#ffffff");R(x+2,c.y+3,c.w-2,1,"#e2f2ff")}
  const u0=px(i,0,.35), u1=px(i,0,.55);
  for(let x=Math.floor(x0);x<x1;x++){
    const u=x-u0, h=G*.3+Math.sin(u*.03)*6+Math.sin(u*.011+1)*9; R(x,G-h,1,h,"#a6d98f");
    const v=x-u1, h2=G*.17+Math.sin(v*.05+2)*4+Math.sin(v*.017)*5; R(x,G-h2,1,h2,"#86c96f");
  }
  for(const h of scenery.houses){const x=px(i,h.x,.8); if(x+h.w+2<x0||x-2>x1)continue; const top=G-h.h;
    R(x,top,h.w,h.h,h.body); const rows=Math.floor((h.w+2)/4); for(let k=0;k<=rows;k++)R(x-1+2*k,top-1-k,h.w+2-4*k,1,h.roof);
    for(let wx=x+3;wx<x+h.w-4;wx+=7){R(wx,top+3,3,3,"#fff7d6");R(wx,top+3,3,1,"#8aa2c8")}
    R(x+Math.floor(h.w/2)-2,G-6,4,6,"#6b4a3a")}
  R(x0,G,x1-x0,HA-G,"#7a5a3e"); R(x0,G,x1-x0,3,"#5fbf4a"); R(x0,G+3,x1-x0,1,"#3f8f35");
  const o=px(i,0,1); for(let x=Math.floor(x0);x<x1;x++){const u=x-o; if(((u%10)+10)%10<6)R(x,G+7,1,2,"#9c7b5a")}
}

function drawZ1(i,x0,x1){
  const {G,HA,zw,P,scenery}=state;
  sky(["#3a2160","#5a2a6e","#8a3470","#c2445b","#e8694f","#f79a4f","#ffc46b"],x0,x1,0,G);
  const sx=px(i,zw[i]/P*.5,.05); disc(sx,Math.round(G*.64),13,"#ffe39a");
  for(let y=Math.round(G*.64)+2;y<G*.64+14;y+=3) R(sx-14,y,29,1,"#f79a4f");
  for(const b of scenery.city){const x=px(i,b.x,.3); if(x+b.w<x0||x>x1)continue; R(x,G-b.h,b.w,b.h,"#43275e");
    const rr=rng(b.win); for(let wy=G-b.h+3;wy<G-3;wy+=4)for(let wx=x+2;wx<x+b.w-2;wx+=3) if(rr()<.3)R(wx,wy,1,2,"#ffd86b")}
  for(const t of scenery.trees){const x=px(i,t.x,.75); if(x+12<x0||x-12>x1)continue; R(x-1,G-t.h-2,3,t.h+2,"#5b3a29");disc(x,G-t.h-t.r,t.r,"#3f6b4a");disc(x-2,G-t.h-t.r-2,Math.max(2,t.r-4),"#558c5c")}
  for(const l of scenery.lamps){const x=px(i,l.x,1); if(x+12<x0||x-12>x1)continue; ctx.globalAlpha=.22;disc(x,G-27,9,"#ffb347");ctx.globalAlpha=1;R(x,G-26,2,26,"#2b2340");R(x-2,G-29,6,3,"#2b2340");R(x-1,G-26,4,2,"#ffe9a3")}
  R(x0,G,x1-x0,HA-G,"#8a4630"); R(x0,G,x1-x0,2,"#e0915c");
  const o=px(i,0,1); for(let y=G+2;y<HA;y+=4){R(x0,y+3,x1-x0,1,"#6e3826"); for(let x=Math.floor(x0);x<x1;x++){const u=x-o+((y/4)%2?4:0); if(((u%8)+8)%8===0)R(x,y,1,3,"#6e3826")}}
}

function drawZ2(i,x0,x1){
  const {G,HA,zw,P,VW}=state;
  const o=px(i,0,1), cols=["#9a6440","#8d5a39","#a36c46"];
  for(let x=Math.floor(x0);x<x1;x++){const u=x-o, k=Math.floor(u/9); R(x,0,1,G,cols[((k%3)+3)%3]); if(((u%9)+9)%9===0)R(x,0,1,G,"#5e3a24")}
  R(x0,0,x1-x0,6,"#5e3a24"); R(x0,6,x1-x0,1,"#3f2718"); R(x0,G-18,x1-x0,2,"#5e3a24"); R(x0,G-16,x1-x0,16,"#7a4c30");
  const A=zw[i]/P;
  for(const fx of VW<MOBILE_MAX_VW?[]:[A*.1,A*.9]){const x=px(i,fx,1); R(x-18,G*.45,36,2,"#3f2718"); const jc=["#7ae582","#ff9f1c","#5db8ff","#ff5d8f","#f2c14e"]; for(let k=0;k<5;k++){R(x-16+k*7,G*.45-6-(k%2)*2,5,6+(k%2)*2,jc[k]);R(x-16+k*7,G*.45-7-(k%2)*2,5,1,"#efe8d6")}
    R(x-18,G*.62,36,2,"#3f2718"); for(let k=0;k<4;k++)R(x-14+k*8,G*.62-8,6,8,["#c49a6c","#e8d8c0","#b07850","#d9b38c"][k])}
  for(const fx of [A*.3,A*.7]){const x=px(i,fx,1); R(x,6,1,12,"#2b2340"); ctx.globalAlpha=.2;disc(x,24,11,"#ffb347");ctx.globalAlpha=1; R(x-4,18,9,4,"#2b2340"); R(x-2,22,5,1,"#ffe9a3")}
  R(x0,G,x1-x0,HA-G,"#6b4630"); R(x0,G,x1-x0,2,"#8a5a3c"); for(let y=G+6;y<HA;y+=6)R(x0,y,x1-x0,1,"#4f3322");
}

function drawZ3(i,x0,x1){
  const {G,HA}=state;
  R(x0,0,x1-x0,G,"#efe8f7"); R(x0,0,x1-x0,6,"#d8cbea"); R(x0,6,x1-x0,1,"#b8a6d6");
  R(x0,G-20,x1-x0,20,"#c6b5e2"); R(x0,G-21,x1-x0,1,"#a690cc");
  const o=px(i,0,1);
  for(let x=Math.floor(x0);x<x1;x++){const u=((x-o)%150+150)%150; if(u<12){R(x,7,1,G-28,u<3?"#cbbde3":"#e2d8f0"); if(u===0||u===11)R(x,7,1,G-28,"#b8a6d6"); R(x,7,1,4,"#b8a6d6"); R(x,G-25,1,4,"#b8a6d6")}}
  R(x0,G,x1-x0,HA-G,"#b8324f"); R(x0,G,x1-x0,2,"#f2c14e");
  for(let y=G+5;y<HA;y+=6)for(let x=Math.floor(x0);x<x1;x++){if(((x-o+(y%12?3:0))%6+6)%6===0)R(x,y,1,1,"#9e2842")}
}

function drawZ4(i,x0,x1){
  const {G,HA,zw,P}=state;
  const o=px(i,0,1);
  for(let x=Math.floor(x0);x<x1;x++){const u=x-o, k=Math.floor(u/36); R(x,0,1,G,((k%2)+2)%2?"#d4cdbf":"#c8c0b0"); if(((u%36)+36)%36===0)R(x,0,1,G,"#a8a090")}
  ctx.fillStyle="#a39b8b"; for(let y=12;y<G-4;y+=6)for(let x=Math.floor(x0);x<x1;x++){if(((x-o)%6+6)%6===3)ctx.fillRect(x,y,1,1)}
  const A=zw[i]/P;
  const vol=(fx,c1,c2,w,h,y)=>{const x=px(i,fx,1); for(let k=0;k<h;k++){const ww=Math.round(w*(1-k/h)); R(x,y+k,ww,1,c1); R(x+ww-1,y+k,1,1,c2)}};
  vol(A*.06,"#7a8bb5","#56658f",30,26,G*.25); vol(A*.88,"#e8a33d","#b97a20",26,22,G*.5);
  R(x0,0,x1-x0,8,"#3b3a4a"); for(let x=Math.floor(x0);x<x1;x++){if(((x-o)%44+44)%44<14)R(x,6,1,2,"#fff7d6")}
  R(x0,G,x1-x0,HA-G,"#2f5fb8"); R(x0,G,x1-x0,3,"#4b7fe0");
  for(let x=Math.floor(x0);x<x1;x++){if(((x-o)%30+30)%30===0)R(x,G+3,1,HA-G,"#244a90")}
}

const DRAW=[drawZ0,drawZ1,drawZ2,drawZ3,drawZ4];

export function drawBg(){
  const {zs,zw,P,cam,WA,HA,G}=state;
  const camA=cam/P;
  for(let i=0;i<5;i++){
    const a=zs[i]/P-camA, b=a+zw[i]/P;
    const x0=Math.max(0,Math.floor(a)), x1=Math.min(WA,Math.ceil(b)); if(x1<=x0)continue;
    ctx.save(); ctx.beginPath(); ctx.rect(x0,0,x1-x0,HA); ctx.clip(); DRAW[i](i,x0,x1); ctx.restore();
  }
  for(let i=1;i<5;i++){const x=Math.round(zs[i]/P-camA); if(x<-6||x>WA+6)continue; R(x-3,0,6,HA,"#26213a"); R(x-2,0,2,HA,"#3a3352"); R(x-4,G-2,8,3,"#120e20")}
}
