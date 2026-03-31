# 에이전트 역할 분담

## data-logic
- 채점 로직, 산업 카테고리, 엑셀 파싱, 전시 데이터 등 백엔드 로직
- 담당 파일: `src/app/lib/scoring.ts`, `data.ts`, `types.ts`

## ui-dev
- 화면 컴포넌트 수정 (레이아웃, 버튼, 모달, 리스트, 필터 등)
- 담당 파일: `src/app/components/*.tsx`, `src/app/App.tsx`

## deploy
- 빌드 및 GitHub Pages 배포
- npm run build → gh-pages 브랜치 푸시
- **커밋 전 `guide/handover.md` 업데이트 필수**
- **배포 전 `guide/deploy.md` 필독**

## general-purpose
- 파일 시스템 작업, GitHub CLI, 복합 작업
