# 인수인계

> 커밋마다 상단 **현재 상태** 업데이트 + 하단 로그에 1~2줄 추가.

---

## 현재 상태 (2026-03-31)

### 완료된 주요 기능
- Supabase 로그인 + contacts 불러오기 / 엑셀 업로드 로드
- 분야 칩 3개 + 전시 드롭다운 (선택 분야 chip[0])
- 적합도 채점 100pt (title 35 / industry 45 / contact 20)
- ContactDetail 두 컬럼 (좌: 명함+이미지 / 우: 점수·채점근거·추천목적·전시별비교)
- Supabase Storage 이미지 연동 (157개 image_url 세팅)
- 채점 가중치 편집 모달
- GitHub Actions 자동 배포

### 미완료 / 다음 후보
- ContactDetail 폰트 크기 업사이징 + 좌우 카드 높이 맞추기

---

## 커밋 로그

### 2026-03-31
- guide/ 문서 구조 정비 (start·handover·deploy 역할 분리, CLAUDE.md 루트 이동)
- ContactDetail 두 컬럼 레이아웃 + 이미지 표시 (GDrive 미커밋분 반영)
- types.ts image_url 필드, LandingScreen.tsx Supabase 매핑 추가
- email-generator.ts 신규, 채점 가중치 재설계 (title 35 / industry 45 / contact 20)

### 2026-03-26
- v2 프로젝트 셋업, GitHub Actions 배포 설정
- 칩바 UI 개편, ContactDetail 레이아웃, Supabase 이미지 연동
