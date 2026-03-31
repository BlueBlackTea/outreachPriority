# 새 세션 시작

## 첫 메시지 (복붙용)
```
guide/start.md 읽고 상태 파악한 뒤, 아래 작업 진행해줘:

[작업 내용]
```

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

## 가이드 파일
| 파일 | 용도 |
|------|------|
| `handover.md` | 커밋별 변경 로그 |
| `deploy.md` | 배포 절차 + 커밋 체크리스트 |
| `agents.md` | 에이전트 역할 분담 |
| `scoring-policy.md` | 채점 가중치 설계 원칙 |
| `supabase-images.md` | Supabase 이미지 업로드 방법 |
