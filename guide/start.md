# 새 세션 시작 가이드

## 첫 메시지 (복붙용)

```
guide/start.md 읽고 상태 파악한 뒤, 아래 작업 진행해줘:

[작업 내용]
```

---

## 이 파일을 읽는 에이전트에게

1. 아래 **현재 상태** 섹션으로 프로젝트 상황 파악
2. 배포 작업이면 `guide/deploy.md` 추가 필독
3. 작업 완료 후 커밋 전 **이 파일의 현재 상태 섹션 업데이트** 필수

---

## 현재 상태 (2026-03-31 기준)

### 완료된 주요 기능
- Supabase 로그인 + contacts 불러오기
- 엑셀 업로드로 contacts 로드
- 분야 칩 3개 + 전시 드롭다운 칩바 (선택된 분야 chip[0]으로)
- 선택 전시/분야 기준 적합도 채점 (100pt 만점)
- ContactDetail 두 컬럼 레이아웃 (좌: 명함정보+이미지 / 우: 점수·채점근거·추천목적·전시별비교)
- Supabase Storage 명함 이미지 → image_url 컬럼 연결 (157개)
- GitHub Actions 자동 배포 (push to main → gh-pages)
- 채점 가중치 편집 모달 (title 35pt / industry 45pt / contact 20pt)

### 현재 배포 상태
- URL: https://BlueBlackTea.github.io/outreachPriority/
- 최근 커밋: docs: require handover.md update before every commit (2026-03-31)

### 미완료 / 다음 작업 후보
- ContactDetail 폰트 크기 업사이징 (좌우 카드 높이 맞추기 포함)

---

## 가이드 파일 목록

| 파일 | 용도 |
|------|------|
| `start.md` | 이 파일. 세션 시작점 + 현재 상태 |
| `deploy.md` | 배포 경로, 커밋 체크리스트, 파일 구조 |
| `agents.md` | 에이전트 역할 분담 |
| `scoring-policy.md` | 채점 가중치 설계 원칙 |
| `supabase-images.md` | Supabase 이미지 업로드 방법 |

> CLAUDE.md(프로젝트 개요·경로·기술스택)는 매 세션 자동 로드됨
