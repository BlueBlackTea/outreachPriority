import * as XLSX from 'xlsx';
import { Contact } from './types';

// 엑셀 컬럼명 → Contact 필드 매핑
// 컬럼명이 다양하게 올 수 있으므로 유연하게 처리합니다
const COLUMN_MAP: Record<string, keyof Contact> = {
  // 이름
  '이름': 'name', 'name': 'name', 'Name': 'name',
  // 회사
  '회사': 'company', 'company': 'company', 'Company': 'company', '회사명': 'company',
  // 영문회사명
  '영문회사명': 'company_en', 'company_en': 'company_en', '영문회사': 'company_en',
  // 직함
  '직함': 'title', 'title': 'title', 'Title': 'title', '직위': 'title',
  // 영문직함
  '영문직함': 'title_en', 'title_en': 'title_en', '영문직위': 'title_en',
  // 이메일
  '이메일': 'email', 'email': 'email', 'Email': 'email', 'e-mail': 'email',
  // 전화번호
  '전화번호': 'phone', 'phone': 'phone', 'Phone': 'phone', '연락처': 'phone', '전화': 'phone',
  // 언어
  '언어': 'lang', 'lang': 'lang', 'Lang': 'lang', '사용언어': 'lang',
  // 국가
  '국가': 'country', 'country': 'country', 'Country': 'country',
  // 산업
  '산업': 'industry', 'industry': 'industry', '업종': 'industry',
  // 유형
  '유형': 'type', 'type': 'type', 'Type': 'type',
  // 점수
  '점수': 'score', 'score': 'score', 'Score': 'score',
  // 메모
  '메모': 'note', 'note': 'note', 'Note': 'note', '비고': 'note',
};

const VALID_TYPES = new Set(['부스', '바이어', '미디어', '']);

export async function parseExcelFile(file: File): Promise<Contact[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  if (rows.length === 0) return [];

  const contacts: Contact[] = rows
    .map((row, index) => {
      const contact: Partial<Contact> = {
        id: index + 1,
        name: '',
        company: '',
        company_en: '',
        title: '',
        title_en: '',
        email: '',
        phone: '',
        lang: '한국어',
        country: '한국',
        industry: '기타',
        type: '부스',
        score: 0,
        note: '',
      };

      // 각 컬럼을 매핑
      for (const [colName, value] of Object.entries(row)) {
        const field = COLUMN_MAP[colName.trim()];
        if (!field) continue;

        if (field === 'score') {
          contact.score = Number(value) || 0;
        } else if (field === 'type') {
          const t = String(value).trim();
          contact.type = VALID_TYPES.has(t) ? (t as Contact['type']) : '부스';
        } else {
          (contact as any)[field] = String(value).trim();
        }
      }

      return contact as Contact;
    })
    .filter(c => c.name && c.name.trim() !== ''); // 이름이 없는 행 제외

  return contacts;
}

// 엑셀 템플릿 헤더 설명 (CSV 다운로드용)
// 유형·점수는 앱이 자동 처리하므로 템플릿에서 제외
export const EXCEL_TEMPLATE_HEADERS = [
  '이름', '회사', '영문회사명', '직함', '영문직함',
  '이메일', '전화번호', '언어', '국가', '산업', '메모',
];

// 언어 유효값: 한국어 / 영어 / 중국어 / 일본어
// 국가 유효값: 한국 / 중국 / 일본 / 대만 / 태국 / 베트남 / 인도네시아 / 필리핀 / 싱가포르 / 홍콩 / 미국
// 산업 키워드: 펫/반려동물 · 유통/무역 · 의료/헬스케어 · 화장품/뷰티 · IT/기술 · 미디어/언론 · 식품/농업 · 교육/연구 · 제조/건설 · 캠핑/아웃도어
