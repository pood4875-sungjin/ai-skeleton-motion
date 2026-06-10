# AI 분석 스켈레톤 모션 (Lottie)

피그마 `온사이트 제품 아이데이션` → 노드 `12089-34238` "✦ AI가 경향을 분석 중..." 블록 기반.

## 파일
| 파일 | 설명 |
|------|------|
| `ai-loading.html` | **메인 결과물** — 헤더+스켈레톤(A) / 회전 그라데이션 테두리 카드(B), 모든 모션 포함 |
| `ai-icon.svg` | AI 스파클 아이콘 (figma node 41784, `currentColor`로 색상 상속) |
| `ai-analysis-skeleton.json` | Lottie 변형 — 스켈레톤 shimmer (HTML 없이 임베드용) |
| `gen.js` | Lottie 생성기 (토큰 수정 후 `node gen.js`로 재생성) |
| `index.html` | 초기 Lottie 데모/검증 페이지 |

## 정확한 컬러 토큰 (figma 재확인)
- **스켈레톤 바(node 41792)**: `linear-gradient(to right, #50c9d8, #1981ef)` + **opacity 20%**, h23 · gap5 · radius4, 너비 [100%, 505px, 458px, 409px]
- **타이틀 텍스트**: Emerald Blue-50 `#1bb9cd` (Pretendard SemiBold 16, ls -0.031px)
- **캡션**: Blue Gray-55 `#7a808d` (Pretendard Regular 12)
- **아이콘 / 그라데이션 시작**: Emerald Blue-60 `#50c9d8` · **끝**: Blue `#1981ef`
- **카드 B**: bg `#eef2f7`, (정적 테두리 `#9fd8df` → 모션 버전은 emerald→blue 회전 그라데이션)

## 모션 목록 (ai-loading.html)
- **AI 아이콘 펄스**: scale 0.86 ↔ 1.18, 1.5s ease-in-out 루프
- **`...` 반복**: 1→2→3개 순환(1.4s) — AI 작동 중 표현
- **타이틀 텍스트 교체**: 3.2s마다 페이드 전환 (예: 경향 분석 → 이상 패턴 탐지 → 추이 비교 → 리포트 작성)
- **회전 그라데이션 테두리**: `@property --angle` conic-gradient 3.2s 회전
- **스켈레톤 shimmer**(Lottie 변형): 60fps · 루프 1.6s · ease-in-out

> 설계 근거: 단조로운 회색 깜빡임 대신 브랜드 시안 스윕으로 "AI가 스트리밍하며 분석 중"이라는 로딩 맥락을 전달. 루프 후 짧은 정지로 반복 피로를 완화.

## 사용법
```js
import lottie from "lottie-web";
lottie.loadAnimation({
  container: document.getElementById("ai-skeleton"),
  renderer: "svg", loop: true, autoplay: true,
  path: "/ai-analysis-skeleton.json",
});
```
- 컨테이너 폭은 자유(SVG라 반응형). 권장 비율 560×132.
- 헤더 텍스트(✦ AI가 …중 / 🕐 N분 전 업데이트)는 **라이브 텍스트로 별도 배치** 권장 — i18n·접근성·실시간 갱신에 유리. `index.html` 참고.

## 접근성
- 로딩 영역에 `role="status"` + `aria-label`("AI가 분석 중입니다…") 부여.
- `prefers-reduced-motion: reduce` 사용자: `lottie.setSpeed(0)` 또는 정적 프레임으로 정지 (데모에 적용됨).

## 커스터마이즈 (gen.js 상단 토큰)
- `WIDTHS` — 줄 수·길이, `BAR_H`/`GAP`/`RADIUS` — 바 형태
- `WAVE` — 물결 색, `BASE_L`/`BASE_R` — 바 그라데이션
- `OP`/`SWEEP_END` — 루프 길이·스윕 속도
