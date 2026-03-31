import { createClient } from '@supabase/supabase-js';

// ──────────────────────────────────────────────────────────────────────────────
// Supabase 설정
// .env.local 파일에 아래 두 값을 넣어주세요 (SUPABASE_SETUP_GUIDE.md 참고)
// ──────────────────────────────────────────────────────────────────────────────
// 환경변수 미설정 시 앱 크래시 방지 (GitHub Pages 배포 등)
// 실제 사용 시 .env.local에 VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY 설정 필요
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'placeholder-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

export type SupabaseContact = {
  id: number;
  user_id: string;
  name: string;
  company: string;
  company_en: string;
  title: string;
  title_en: string;
  email: string;
  phone: string;
  lang: string;
  country: string;
  industry: string;
  type: string;
  score: number;
  note: string;
};
