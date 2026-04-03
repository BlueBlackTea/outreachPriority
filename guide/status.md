# 현재 상태

> 커밋마다 이 파일 업데이트. 로그는 `guide/log.md`에 추가.

---

## 완료된 주요 기능 (2026-04-01)
- Supabase 로그인 + contacts 불러오기 / 엑셀 업로드
- 분야 칩 3개 + 전시 드롭다운 (선택 분야 chip[0])
- 적합도 채점 100pt (title 35 / industry 45 / contact 20)
- ContactDetail 두 컬럼 (좌: 명함+이미지 / 우: 점수·채점근거·추천목적·전시별비교)
- Supabase Storage 이미지 연동
- 채점 가중치 편집 모달
- GitHub Actions 자동 배포
- 빔 프로젝터 대응 UI: --font-size 20px, ContactList 624px, 스크롤 유도 (바닥 감지)
- 분야별 적합도 비교: 스크롤 클리핑 수정, bg-gray-100 배경
- 드롭다운 너비 340px, 채점근거 라운드 박스, 아코디언 bg-gray-50
- 명함 카드 툴팁 제거, 필터 명함 클릭 시에만 자동 접힘
- ScoringModal handleSave 실구현: 가중치 localStorage 저장 + 즉시 재채점 반영
- GRADE_THRESHOLDS loadWeights 기반 (localStorage 세션 유지)
- 핵심 업종 가중치 45pt 상한 캡 (51→45, 56→45)
- 전화번호 클릭 복사 (email과 동일)
- WeightEditorModal 슬라이더 max 45pt

## 완료된 주요 기능 (2026-04-02 추가)
- 점수 분포 차트 Y축 제거 + 타이틀 "등록된 연락처 점수 분포"로 변경
- 우측 패널 스크롤 유도 absolute+opacity transition (덜걱 수정)

## 미완료 / 다음 후보
- 없음
