export function spriteCanvas(rows, pal) {
  const c = document.createElement("canvas");
  c.width = rows[0].length;
  c.height = rows.length;
  const x = c.getContext("2d");
  rows.forEach((r, y) =>
    [...r].forEach((ch, i) => {
      if (ch !== "." && pal[ch]) {
        x.fillStyle = pal[ch];
        x.fillRect(i, y, 1, 1);
      }
    }),
  );
  return c;
}

export const ITEM_SPRITES = {
  coffee: {
    rows: [
      "..........",
      "...w.w....",
      "....w.w...",
      ".cccccc...",
      ".cmmmmccc.",
      ".cccccc.c.",
      ".cccccc.c.",
      ".ccccccc..",
      "..cccc....",
      "..........",
    ],
    pal: { c: "#efe8d6", m: "#6b3e26", w: "#b9c3d6" },
  },
  carabiner: {
    rows: [
      "..oooo....",
      ".o....o...",
      ".o.....o..",
      ".o.....o..",
      ".o....g.o.",
      ".o...g..o.",
      ".o..g...o.",
      ".o.....o..",
      "..ooooo...",
      "..........",
    ],
    pal: { o: "#ff9f1c", g: "#8f99ad" },
  },
  pad: {
    rows: [
      "..........",
      "..........",
      ".kkkkkkkk.",
      "kkwkkkkrkk",
      "kwwwkkrkbk",
      "kkwkkkkgkk",
      "kkkk..kkkk",
      ".kk....kk.",
      "..........",
      "..........",
    ],
    pal: {
      k: "#4b4e6d",
      w: "#ffffff",
      r: "#ff5d8f",
      b: "#5db8ff",
      g: "#7ae582",
    },
  },
  ramen: {
    rows: [
      "..........",
      "........d.",
      ".......d..",
      "......d...",
      "yyeeyyfyy.",
      "rrrrrrrrrr",
      ".rrrrrrrr.",
      "..rrrrrr..",
      "...rrrr...",
      "..........",
    ],
    pal: {
      y: "#f2c14e",
      e: "#fff7ea",
      f: "#5fbf4a",
      r: "#d64545",
      d: "#c49a6c",
    },
  },
  cat: {
    rows: [
      "..........",
      ".k....k...",
      ".kk..kk...",
      ".kkkkkk...",
      ".kgkkgk...",
      ".kkpkkk..k",
      "..kkkk..k.",
      ".kkkkkkkk.",
      ".kkkkkkk..",
      ".k.k.k.k..",
    ],
    pal: { k: "#f5a65b", g: "#2a2a2a", p: "#ff8fa3" },
  },
  camera: {
    rows: [
      "..........",
      ".kk....rr.",
      "kkkkkkkkkk",
      "kssskkkssk",
      "kkkkbbkkkk",
      "kkkbwwbkkk",
      "kkkbwbbkkk",
      "kkkkbbkkkk",
      "kkkkkkkkkk",
      "..........",
    ],
    pal: {
      k: "#3a3a48",
      s: "#c9c9d6",
      b: "#5db8ff",
      w: "#e0f4ff",
      r: "#ff5d8f",
    },
  },
  tent: {
    rows: [
      "..........",
      "....f.....",
      "....tt....",
      "...tttt...",
      "..ttdttt..",
      "..tdddtt..",
      ".ttdddttt.",
      ".tddddttt.",
      "tttttttttt",
      "gggggggggg",
    ],
    pal: { t: "#3ec7b0", d: "#1f6f63", f: "#ff5d8f", g: "#5fbf4a" },
  },
  ticket: {
    rows: [
      "..........",
      "..........",
      "pppppppppp",
      "pwwwwpwwwp",
      "pwbbbpwkwp",
      "pwwwwpwwwp",
      "pwkkwpwkwp",
      "pppppppppp",
      "..........",
      "..........",
    ],
    pal: { p: "#ff7a3d", w: "#fff7ea", b: "#5db8ff", k: "#7a6f86" },
  },
};

export const HOLD_SHAPES = [
  [
    "..xxxxx..",
    ".xxxxxxx.",
    "xxxxxxxxx",
    "xxxxbxxxx",
    "xxxxxxxxx",
    "xxxxxxxxd",
    ".xxxxxxd.",
    "..ddddd..",
    ".........",
  ],
  [
    ".........",
    ".........",
    ".xxxxxxx.",
    "xxxxbxxxx",
    "xxxxxxxxx",
    "ddddddddd",
    ".........",
    ".........",
    ".........",
  ],
  [
    ".xxxxxxx.",
    "xx.....xx",
    "xx.....xx",
    "xxxxbxxxx",
    "xxxxxxxxx",
    ".xxxxxxd.",
    "..ddddd..",
    ".........",
    ".........",
  ],
  [
    "....x....",
    "...xxx...",
    "..xxxxx..",
    "..xxbxx..",
    ".xxxxxxx.",
    ".xxxxxxxd",
    "xxxxxxxdd",
    "ddddddddd",
    ".........",
  ],
];
export const HOLD_COLORS = [
  ["#ff5d8f", "#c93a68"],
  ["#ff9f1c", "#c46f00"],
  ["#f2c14e", "#b8891e"],
  ["#7ae582", "#3fa64c"],
  ["#3ec7b0", "#21877a"],
  ["#5db8ff", "#2f7fc4"],
  ["#a78bfa", "#7556d6"],
  ["#ff6b6b", "#c43f3f"],
];

/* characters: 10 x 15 */
export const GROOM_TOP = [
  "...hhhh...",
  "..hhhhhh..",
  "..hssssh..",
  "..sesses..",
  "..ssssss..",
  "...ssss...",
  "..tttttt..",
  ".tttaattt.",
  ".tttttttt.",
  ".s.tttt.s.",
  "...tttt...",
];
export const GROOM_LEGS = [
  ["...bbbb...", "...b..b...", "...b..b...", "..oo..oo.."],
  ["...bbbb...", "..bb..b...", ".bb....b..", ".oo....oo."],
  ["...bbbb...", "...b..bb..", "..b....bb.", ".oo.....oo"],
];
export const BRIDE_TOP = [
  "...hhhh...",
  "..hhhhhh..",
  ".hhsssshh.",
  ".hsesseshh",
  ".hssssssh.",
  ".hhsssshh.",
  ".htttttth.",
  ".tttaattt.",
  ".tttttttt.",
  ".s.tttt.s.",
  "..tttttt..",
  "..tttttt..",
  ".tttttttt.",
];
export const BRIDE_LEGS = [
  ["...s..s...", "..oo..oo.."],
  ["..s....s..", ".oo....oo."],
  ["...s..s...", "..oo..oo.."],
];
export const SKIN = "#f1c7a1",
  EYE = "#2a1d1d";
export const OUTFITS = [
  {
    g: { h: "#2b1d14", t: "#4a7bd0", a: "#2f5aa8", b: "#3b3f58", o: "#f2f2f2" },
    b: { h: "#5a3420", t: "#f2c14e", a: "#e07a5f", o: "#ffffff" },
  },
  {
    g: { h: "#2b1d14", t: "#8b5a3c", a: "#e8d8c0", b: "#2d2d3a", o: "#1d1a22" },
    b: { h: "#5a3420", t: "#b23a48", a: "#ffd6a5", o: "#2d2d3a" },
  },
  {
    g: { h: "#2b1d14", t: "#5a8f4e", a: "#f4e9d8", b: "#4a3a2c", o: "#2d2d3a" },
    b: { h: "#5a3420", t: "#e58fb1", a: "#fff3e0", o: "#6b3e26" },
  },
  {
    g: { h: "#2b1d14", t: "#20233a", a: "#ffffff", b: "#20233a", o: "#111111" },
    b: { h: "#5a3420", t: "#fffdf6", a: "#f4a7bb", o: "#fffdf6" },
  },
  {
    g: { h: "#2b1d14", t: "#ff7a3d", a: "#222233", b: "#4b5d7a", o: "#ffd23f" },
    b: { h: "#5a3420", t: "#3ec7b0", a: "#222233", o: "#ff5d8f" },
  },
];
