# outreachPriority — 프로젝트 개요

## 세션 시작 시 필독
**반드시 `guide/start.md` 읽고 현재 상태 파악 후 작업 시작.**

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
├── guide/                # 세션 간 문서 (start.md, deploy.md 등)
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
