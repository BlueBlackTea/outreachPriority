# 커밋 로그

> 이 파일은 평소에 읽지 않음. 에이전트가 맥락 없이 행동하거나 같은 실수를 반복할 때만 참고.

---

### 2026-04-01
- 빔 프로젝터 대응: --font-size 32px→24px→20px 순차 조정, ContactList 너비 520→780→624px
- 분야별 적합도 비교 스크롤 클리핑 버그 수정(py-4), bg-gray-100 배경 추가
- 드롭다운 min-w 340px, 채점근거 항목 라운드 박스, 아코디언 py-4·bg-gray-50
- 빈 상태 스크롤 유도(sticky gradient+bounce arrow, 바닥 감지 시 사라짐)
- 명함 카드 툴팁 제거, 필터 명함 클릭 시에만 자동 접힘
- guide 문서 구조 개편: handover→status+log 분리, start.md→CLAUDE.md 통합

### 2026-03-31
- guide/ 문서 구조 정비 (start·handover·deploy 역할 분리, CLAUDE.md 루트 이동)
- ContactDetail 두 컬럼 레이아웃 + 이미지 표시
- types.ts image_url 필드, LandingScreen.tsx Supabase 매핑 추가
- email-generator.ts 신규, 채점 가중치 재설계 (title 35 / industry 45 / contact 20)

### 2026-03-26
- v2 프로젝트 셋업, GitHub Actions 배포 설정
- 칩바 UI 개편, ContactDetail 레이아웃, Supabase 이미지 연동
