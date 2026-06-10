// AI 분석 스켈레톤(shimmer) Lottie 생성기
// 피그마 노드 12089-34238 "✦ AI가 경향을 분석 중..." 블록 기반
// 출력: ai-analysis-skeleton.json
const fs = require("fs");
const path = require("path");

// ---- 설계 토큰 (피그마 기반) ----
const W = 560;            // 컨테이너 폭
const BAR_H = 24;         // 바 높이
const RADIUS = 6;         // 모서리
const GAP = 12;           // 바 간격
const WIDTHS = [560, 496, 452, 408]; // 줄별 길이 (100% → 72.8%)
const FR = 60;            // fps
const OP = 96;            // 1.6s 루프
const SWEEP_END = 60;     // 스윕 종료 프레임(1.0s) → 이후 0.6s 정지

const N = WIDTHS.length;
const H = N * BAR_H + (N - 1) * GAP; // 132

const hex = (h) => {
  h = h.replace("#", "");
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
};
// 스켈레톤 톤: 좌(시안)→우(흰색). 브랜드 emerald-60(#50c9d8) 계열을 연하게.
// figma 41792: emerald(#50c9d8)→blue(#1981ef) 그라데이션 @ opacity 20% (흰 배경 위 유효색)
const BASE_L = hex("#dcf4f7"); // #50c9d8 @20% on white
const BASE_R = hex("#d1e6fc"); // #1981ef @20% on white
const WAVE = hex("#50c9d8");   // 흐르는 물결(브랜드 emerald-60)

// 그라데이션 fill (2 color stop)
function baseGradFill(cx, w) {
  return {
    ty: "gf", o: { a: 0, k: 100 }, r: 1, bm: 0, t: 1,
    s: { a: 0, k: [cx - w / 2, 0] },   // 좌
    e: { a: 0, k: [cx + w / 2, 0] },   // 우
    g: { p: 2, k: { a: 0, k: [0, ...BASE_L, 1, ...BASE_R] } },
    nm: "base-grad"
  };
}

// 바 1줄 = 그룹(rect + grad fill)
function barGroup(i) {
  const w = WIDTHS[i];
  const cy = i * (BAR_H + GAP) + BAR_H / 2;
  const cx = w / 2; // 좌측 정렬
  return {
    ty: "gr",
    it: [
      { ty: "rc", d: 1, s: { a: 0, k: [w, BAR_H] }, p: { a: 0, k: [cx, cy] }, r: { a: 0, k: RADIUS }, nm: "rect" },
      baseGradFill(cx, w),
      { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
    ],
    nm: `bar-${i + 1}`
  };
}

// ---- 레이어 ----
// 1) 베이스 바 (하단)
const baseBarsLayer = {
  ddd: 0, ind: 2, ty: 4, nm: "base-bars", sr: 1,
  ks: {
    o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [0, 0] },
    a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }
  },
  ao: 0, ip: 0, op: OP, st: 0, bm: 0,
  shapes: WIDTHS.map((_, i) => barGroup(i))
};

// 2) shimmer 밴드 (상단) — 흰색 알파 그라데이션, 회전, 좌→우 이동
const BAND_W = 150;
const BAND_H = 240; // 회전해도 아트보드 덮도록
const shimmerLayer = {
  ddd: 0, ind: 1, ty: 4, nm: "shimmer", sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: 14 }, // 살짝 기울인 빛줄기
    p: {
      a: 1,
      k: [
        { t: 0,         s: [-150, H / 2], o: { x: [0.4], y: [0] },  i: { x: [0.6], y: [1] } },
        { t: SWEEP_END, s: [710, H / 2] },
        { t: OP,        s: [710, H / 2] }   // 정지(우측 밖, 비가시) → 루프
      ]
    },
    a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }
  },
  ao: 0, ip: 0, op: OP, st: 0, bm: 0,
  shapes: [
    {
      ty: "gr",
      it: [
        { ty: "rc", d: 1, s: { a: 0, k: [BAND_W, BAND_H] }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, nm: "band-rect" },
        {
          ty: "gf", o: { a: 0, k: 100 }, r: 1, bm: 0, t: 1,
          s: { a: 0, k: [-BAND_W / 2, 0] }, e: { a: 0, k: [BAND_W / 2, 0] },
          // 시안 물결: 3 color stop + 3 alpha stop(0 → 0.5 → 0). 가장자리 부드럽게.
          // 흰색 대신 시안이라 바의 흰색 우측 영역에서도 물결이 보임.
          g: { p: 3, k: { a: 0, k: [
            0, ...WAVE,
            0.5, ...WAVE,
            1, ...WAVE,
            0, 0,
            0.5, 0.5,
            1, 0
          ] } },
          nm: "band-grad"
        },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
      ],
      nm: "band"
    }
  ]
};

const anim = {
  v: "5.7.0", fr: FR, ip: 0, op: OP, w: W, h: H, nm: "ai-analysis-skeleton", ddd: 0,
  assets: [],
  layers: [shimmerLayer, baseBarsLayer]
};

const out = path.join(__dirname, "ai-analysis-skeleton.json");
fs.writeFileSync(out, JSON.stringify(anim));
console.log("wrote", out, "(", fs.statSync(out).size, "bytes )");
