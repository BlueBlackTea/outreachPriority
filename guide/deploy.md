# 배포 가이드

> 작업 경로·파일 구조·GitHub 정보는 CLAUDE.md 참조 (매 세션 자동 로드됨)

---

## 배포 흐름

```
1. git status                        ← modified 파일 확인
2. guide/status.md 업데이트 + guide/log.md에 로그 추가  ← 필수!
3. git add <파일들> guide/status.md guide/log.md
4. git commit -m "..."
5. git push origin main              → GitHub Actions 자동 빌드 → gh-pages 배포
```

> 로컬 `npm run build` 불필요. push하면 GitHub Actions가 빌드함.

---

## 로컬 dev 서버 검증 기준

단순 수치·클래스 변경(CSS 변수, px 너비, 패딩 등)은 코드 리뷰만으로 충분하며 `npm run dev` 실행 불필요.
조건부 렌더링·인터랙션 버그 등 코드만으로 결과 예측이 어려운 경우에만 로컬 서버를 띄워 확인.

---

## 자주 커밋 누락되는 파일

| 파일 | 수정되는 상황 |
|------|-------------|
| `src/app/components/ContactDetail.tsx` | 레이아웃·이미지·점수 UI |
| `src/app/components/LandingScreen.tsx` | Supabase fetch 매핑 |
| `src/app/App.tsx` | 상태·props 변경 |
| `src/app/lib/types.ts` | 타입 추가 |
| `src/app/lib/supabase.ts` | Supabase 연결 수정 |
| `package.json` / `package-lock.json` | 패키지 변경 |
