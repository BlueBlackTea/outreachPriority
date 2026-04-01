# 채점 가중치 설계 근거

> 실제 수치는 `src/app/lib/data.ts`의 상수값이 기준. localStorage에 저장된 커스텀값이 있으면 그쪽이 우선.

---

## 기본 구조 (100pt 상한)

`classifyContact(contact, eventId)` → `ClassifyResult` 반환

| 항목 | 최대 점수 | 상수 |
|------|----------|------|
| 직함 | 35pt | `TITLE_WEIGHTS` |
| 업종 | 45pt | `SHOW_WEIGHTS[eventId]` |
| 연락처 | 20pt | `CONTACT_WEIGHTS` |

- 합산이 100pt 초과 시 100pt로 클램프
- `breakdown[]`: 항목별 점수 기여
- `reasons[]`: 점수 이유 텍스트
- `typeReason`: 유형(부스/바이어/미디어) 분류 근거

---

## 직함 가중치 (TITLE_WEIGHTS)

| 직함 유형 | 기본값 | 판정 키워드 |
|----------|--------|------------|
| 대표/CEO/Founder | 35pt | 대표, ceo, 사장, 회장, president, founder, owner |
| 이사/Director/Manager | 23pt | 이사, director, manager, 본부장, 부장, 팀장, head, officer |
| 담당/Specialist | 14pt | 담당, coordinator, executive, specialist, lecturer, professor |
| 기타 | 9pt | 위 외 전체 |

---

## 업종 가중치 (SHOW_WEIGHTS)

- 전시별로 다른 가중치 테이블 사용 (`SHOW_WEIGHTS[eventId]`)
- 핵심 업종 최대 **45pt** 상한 (51pt·56pt 초과값 전체 캡 처리됨)
- 가중치 0인 업종은 점수 미부여

---

## 연락처 가중치 (CONTACT_WEIGHTS)

| 보유 정보 | 기본값 |
|----------|--------|
| 이메일 + 전화 모두 | 20pt |
| 이메일만 | 12pt |
| 전화만 | 12pt |
| 없음 | 0pt |

---

## 등급 기준 (GRADE_THRESHOLDS)

| 등급 | 기본 기준 |
|------|----------|
| 높은 적합도 (high) | 70pt 이상 |
| 보통 적합도 (mid) | 40 – 69pt |
| 낮은 적합도 (low) | 39pt 이하 |

---

## localStorage 커스터마이징

ScoringModal / WeightEditorModal에서 저장 시 아래 키로 localStorage에 기록됨.
앱 재시작 시 자동 복원.

| localStorage 키 | 대상 |
|----------------|------|
| `grade_thresholds` | 등급 기준 점수 |
| `title_weights` | 직함 가중치 |
| `contact_weights` | 연락처 가중치 |
| `show_weights` | 전시별 업종 가중치 전체 |
