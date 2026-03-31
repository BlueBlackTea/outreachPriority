# 배포 가이드

## 작업 경로 (필수)
```
C:\Users\PC-ENS-N0289\Documents\Google Drive\ObsidianVault\03 Ideas\esangCampus2604\outreachPriority
```
> ⚠️ `Desktop\WSK\Claude\2026\명함\작업용\html\shell\` 는 구버전 — 절대 사용 금지

---

## 배포 흐름

```
1. git status                  ← 수정된 파일 확인 (필수!)
2. guide/handover.md 업데이트  ← 이번 작업 내용 기록 (필수!)
3. git add <파일들> guide/handover.md
4. git commit -m "..."
5. git push origin main
   → GitHub Actions 자동 빌드 → gh-pages 배포
```

> 로컬 `npm run build` 불필요. push하면 GitHub Actions가 알아서 빌드함.

---

## 커밋 전 필수 체크

**`git status`에서 modified 파일이 있으면 반드시 커밋 후 push.**
커밋 없이 push만 해도 GitHub Actions는 커밋된 파일 기준으로 빌드함 → 수정사항 미반영!

---

## 프로젝트 주요 파일 구조

```
outreachPriority/
├── src/
│   └── app/
│       ├── App.tsx                    # 전체 상태 관리, 컴포넌트 조합
│       ├── components/
│       │   ├── ContactDetail.tsx      # 연락처 선택 시 오른쪽 상세 화면 (레이아웃·이미지·점수)
│       │   ├── ContactList.tsx        # 왼쪽 목록 패널
│       │   ├── LandingScreen.tsx      # 로그인 / 엑셀 업로드 초기 화면
│       │   ├── AddContactModal.tsx    # 연락처 추가 모달
│       │   ├── ScoringModal.tsx       # 채점 가중치 편집 모달
│       │   └── WeightEditorModal.tsx  # 가중치 시각화 편집
│       └── lib/
│           ├── types.ts               # Contact, Show 등 타입 정의
│           ├── scoring.ts             # classifyContact() 채점 로직
│           ├── data.ts                # TITLE_WEIGHTS, SHOW_WEIGHTS, SHOWS 데이터
│           ├── email-generator.ts     # 다국어 이메일 초안 생성
│           ├── excelUtils.ts          # 엑셀 파싱 유틸
│           └── supabase.ts            # Supabase 클라이언트
├── guide/                             # 세션 간 인수인계 문서 (이 파일 포함)
├── .github/workflows/deploy.yml       # GitHub Actions 자동 배포
├── .env.local                         # Supabase 키 (커밋 금지!)
└── vite.config.ts                     # base: '/outreachPriority/'
```

---

## 자주 커밋 누락되는 파일

| 파일 | 이유 |
|------|------|
| `src/app/components/ContactDetail.tsx` | 레이아웃·이미지·점수 UI — 가장 자주 수정됨 |
| `src/app/components/LandingScreen.tsx` | Supabase fetch 매핑 수정 시 |
| `src/app/App.tsx` | 상태·props 변경 시 |
| `src/app/lib/types.ts` | 타입 추가 시 (image_url 등) |
| `src/app/lib/supabase.ts` | Supabase 연결 수정 시 |
| `package.json` / `package-lock.json` | 패키지 추가·변경 시 |

---

## GitHub 정보

- Repo: https://github.com/BlueBlackTea/outreachPriority
- Pages URL: https://BlueBlackTea.github.io/outreachPriority/
- 배포 브랜치: gh-pages (GitHub Actions가 자동 관리)
- Secrets 필요: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
