import { createClient } from '@supabase/supabase-js';

// ──────────────────────────────────────────────────────────────────────────────
// Supabase 설정
// .env.local 파일에 아래 두 값을 넣어주세요 (SUPABASE_SETUP_GUIDE.md 참고)
// ──────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
