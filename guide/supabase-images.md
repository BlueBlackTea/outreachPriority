# Supabase 이미지 업로드 가이드

## 개요
명함 연락처에 이미지를 추가하면 ContactDetail 왼쪽 카드에 자동 표시됩니다.
`image_url` 컬럼이 비어있으면 이름 이니셜 아바타가 대신 표시됩니다.

---

## 1단계 — Storage 버킷 만들기

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. 프로젝트(`mycard-db`) 선택
3. 왼쪽 메뉴 **Storage** 클릭
4. **New bucket** 클릭
   - Name: `contact-images`
   - **Public bucket: ✅ 체크** ← 반드시 public으로 설정
5. **Save** 클릭

---

## 2단계 — 이미지 업로드

1. `contact-images` 버킷 클릭
2. **Upload files** 버튼 클릭
3. 이미지 파일 선택 후 업로드

### 파일명 권장 규칙
```
박성용.jpg
jacky-chen.jpg
choe-jong-kwon.jpg
```
- 한글 파일명 사용 가능
- 중복 방지를 위해 이름 기반으로 통일 추천
- JPG / PNG / WEBP 모두 지원

---

## 3단계 — Public URL 복사

업로드 후 파일 클릭 → 우측 패널에서 **Copy URL** 클릭

URL 형식:
```
https://vhzshvrgbxdihmzkfbgi.supabase.co/storage/v1/object/public/contact-images/박성용.jpg
```

---

## 4단계 — contacts 테이블에 저장

### 방법 A — Table Editor (UI)
1. 왼쪽 메뉴 **Table Editor** → `contacts` 테이블
2. 해당 연락처 행 클릭
3. `image_url` 컬럼에 URL 붙여넣기 후 저장

### 방법 B — SQL Editor
```sql
UPDATE contacts
SET image_url = 'https://vhzshvrgbxdihmzkfbgi.supabase.co/storage/v1/object/public/contact-images/박성용.jpg'
WHERE name = '박성용';
```

---

## contacts 테이블에 image_url 컬럼이 없는 경우

SQL Editor에서 실행:
```sql
ALTER TABLE contacts
ADD COLUMN image_url TEXT;
```

---

## 이미지 표시 조건

| 상태 | 표시 |
|------|------|
| `image_url` 있음 | 이미지 전체 표시 (object-cover) |
| `image_url` 없음 | 이름 이니셜 아바타 (색상 자동 지정) |

---

## 주의사항

- **버킷은 반드시 Public**으로 설정해야 앱에서 이미지 URL에 접근 가능
- `service_role` 키 노출 금지 — 이미지 조회는 `anon` 키로 가능
- 무료 플랜 Storage 용량: **1GB** (87MB 업로드 시 약 9% 사용)
- 이미지 삭제 시 DB의 `image_url` 값도 함께 비워야 깨진 이미지 방지
