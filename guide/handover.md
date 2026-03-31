# 세션 인수인계 로그

> 커밋할 때마다 상단에 1~2줄 간략 추가. 오래된 항목은 압축 유지.

---

## 2026-03-31
- `ContactDetail.tsx` 두 컬럼 레이아웃 + 이미지 표시 (GDrive 경로 미커밋 상태였던 것 반영)
- `types.ts` image_url 필드 추가, `LandingScreen.tsx` Supabase image_url 매핑 추가
- `email-generator.ts` 신규 추가 (다국어 이메일 초안)
- 채점 가중치 재설계: title 35pt / industry 45pt / contact 20pt
- guide/ 문서 정비: start.md(세션 시작점), deploy.md(배포 가이드), handover.md(이 파일) 역할 분리

## 2026-03-26 — Session 1
- v2 프로젝트 셋업 (Desktop shell/ → GDrive outreachPriority/)
- GitHub Actions 자동 배포 설정
- 칩바 UI: 선택 분야 chip[0]으로
- ContactDetail 레이아웃 개편, Supabase 이미지 연동
