# outreachPriority v2 — 프로젝트 개요

## 목적
전시회 섭외 대상 명함 데이터를 관리하고, 전시별/분야별 AI 적합도 채점을 제공하는 웹앱.

## 파일 구조
```
outreachPriority/
├── src/
│   └── app/
│       ├── components/   # React UI 컴포넌트
│       ├── lib/          # scoring.ts, data.ts, types.ts 등 핵심 로직
│       └── App.tsx       # 루트 컴포넌트
├── public/
├── guide/                # 이 폴더 — 프로젝트 문서
├── package.json
└── vite.config.ts
```

## 기술 스택
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI)
- Supabase (auth + DB) — .env.local에만 키 저장, 절대 커밋 금지
- recharts (점수 분포 차트용, 이미 설치됨)

## 주의사항
- `.env.local`은 절대 커밋하지 말 것 (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- `sampleData.ts`에 실제 명함 데이터 0건 유지
- Hook 규칙: useEffect 등은 반드시 early return 위에 위치
- GitHub Pages 배포: `vite.config.ts`의 base = `/outreachPriority/`

## 배포
- GitHub repo: https://github.com/BlueBlackTea/outreachPriority
- GitHub Pages: https://BlueBlackTea.github.io/outreachPriority/
- 배포 브랜치: gh-pages
