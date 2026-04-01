# outreachPriority — 프로젝트 개요

## 세션 시작 순서
1. `guide/status.md` 읽기 — 현재 상태 파악
2. `guide/agents.md` 읽기 — 역할에 맞는 추가 파일 확인 후 읽기
3. 사용자 요청 수행
4. 커밋 전 `guide/status.md` 업데이트 + `guide/log.md`에 로그 1~2줄 추가

> 맥락 없이 행동하거나 같은 실수를 반복할 경우에만 `guide/log.md` 읽기

---

## 목적
전시회 섭외 대상 명함 데이터를 관리하고, 전시별/분야별 AI 적합도 채점을 제공하는 웹앱.

## 작업 경로
```
C:\Users\PC-ENS-N0289\Documents\Google Drive\ObsidianVault\03 Ideas\esangCampus2604\outreachPriority
```

## 파일 구조
```
outreachPriority/
├── src/
│   └── app/
│       ├── components/   # React UI 컴포넌트
│       ├── lib/          # scoring.ts, data.ts, types.ts 등 핵심 로직
│       └── App.tsx       # 루트 컴포넌트
├── guide/
│   ├── status.md         # 현재 상태 (매 세션 필독)
│   ├── log.md            # 커밋 로그 누적 (문제 시에만 읽기)
│   ├── agents.md         # 에이전트 역할 분담
│   ├── deploy.md         # 배포 가이드
│   └── scoring-policy.md # 채점 정책
├── package.json
└── vite.config.ts
```

## 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Supabase (auth + DB + Storage) — .env.local에만 키 저장, 절대 커밋 금지
- recharts (점수 분포 차트)

## 배포
- GitHub repo: https://github.com/BlueBlackTea/outreachPriority
- GitHub Pages: https://BlueBlackTea.github.io/outreachPriority/
- push to main → GitHub Actions 자동 빌드 → gh-pages

## 주의사항
- `.env.local` 절대 커밋 금지 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- Hook 규칙: useEffect 등은 반드시 early return 위에 위치
- `vite.config.ts` base = `/outreachPriority/`
