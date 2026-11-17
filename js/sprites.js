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
  lol: {
    rows: [
      "..gggggg..",
      ".gkkkkkkg.",
      "gkLLLkkkkg",
      "gkkLLkkkkg",
      "gkkLLkkkkg",
      "gkkLLkkkkg",
      "gkkLLkkkkg",
      "gkkLLLLLkg",
      ".gkkkkkkg.",
      "..gggggg..",
    ],
    pal: { g: "#c89b3c", k: "#0a1428", L: "#f0e6d2" },
  },
  shoes: {
    rows: [
      "..........",
      "..........",
      "..rrr.....",
      ".rrwrr....",
      ".rrrwrr...",
      ".rrrrwrrr.",
      ".rrrrrrrrr",
      ".sssssssss",
      "..ggggggg.",
      "..........",
    ],
    pal: { r: "#3fa7ff", w: "#ffffff", s: "#f2f2f2", g: "#8f99ad" },
  },
  beer: {
    rows: [
      "..........",
      "..wwwww...",
      ".wwwwwww..",
      ".yyyyyyy..",
      ".yyyyyyhh.",
      ".yybyyy.h.",
      ".yyyyyy.h.",
      ".yyyybyhh.",
      ".yyyyyy...",
      ".gggggg...",
    ],
    pal: { w: "#fffaf0", y: "#f4b63f", b: "#ffe08a", h: "#d9e2ec", g: "#d9e2ec" },
  },
  burger: {
    rows: [
      "..........",
      "...bbbb...",
      ".bbsbbsbb.",
      "bbbbbbbbbb",
      "llllllllll",
      "ccccccccc.",
      "pppppppppp",
      ".pppppppp.",
      "bbbbbbbbbb",
      ".bbbbbbbb.",
    ],
    pal: {
      b: "#e8a04c",
      s: "#fff7ea",
      l: "#5fbf4a",
      c: "#ffd23f",
      p: "#6b3e26",
    },
  },
  bat: {
    rows: [
      "........bb",
      ".......blb",
      "......blb.",
      ".....bbb..",
      "....bbb...",
      "...bb.....",
      "..bb......",
      ".hh.......",
      "kh........",
      "..........",
    ],
    pal: { b: "#c8894a", l: "#e0b07a", h: "#8a5a2b", k: "#6b3e26" },
  },
  t1: {
    rows: [
      "..........",
      "rrrrrrrr.r",
      ".rrrrrr.rr",
      "......r.r.",
      ".rrrr.r.r.",
      ".....r.r..",
      "..rr.r.r..",
      "....r.r...",
      "....r.r...",
      "..........",
    ],
    pal: { r: "#d1323a" },
  },
  brazil: {
    rows: [
      "..........",
      "..........",
      "gggggggggg",
      "gggyyyyggg",
      "ggyybbyygg",
      "gyybwwbbyg",
      "ggyybbyygg",
      "gggyyyyggg",
      "gggggggggg",
      "..........",
    ],
    pal: { g: "#009c3b", y: "#ffdf00", b: "#002776", w: "#ffffff" },
  },
  bungeoppang: {
    rows: [
      "..........",
      "..........",
      "..bbbbb..t",
      ".bbbbbbbtt",
      "bkbbdbdbtt",
      "bbbdbdbbbt",
      ".bbbbbbbtt",
      "..bbbbb..t",
      "..........",
      "..........",
    ],
    pal: { b: "#e0a24a", d: "#b8732c", t: "#c98a3a", k: "#5a3415" },
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
