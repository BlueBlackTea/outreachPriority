export interface Contact {
  id: number;
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
  type: '부스' | '바이어' | '미디어' | '';
  score: number;
  note: string;
  priority?: number;
  image_url?: string;
}

export interface Show {
  id: string;
  name: string;
  name_en?: string;
  emoji: string;
  color: string;
  seasons: Season[];
  stats: Stats;
  booth: Booth;
  contact: ContactInfo;
  market: Market;
}

export interface Season {
  key: string;
  label: string;
  dates: string;
  venue: string;
}

export interface Stats {
  visitors2025: string;
  exhibitors2025: string;
  booths2025: string;
  matchMeetings: string;
  matchCompanies: string;
  buyerCompanies: string;
  consultationUSD: string;
  database: string;
  growthYoY: string;
  overseasGrowth: string;
  overseasVisitors2025: string;
  countries2025: string;
}

export interface Booth {
  spaceOnly: string;
  shellScheme: string;
}

export interface ContactInfo {
  tel: string;
  email: string;
  web: string;
}

export interface Market {
  size2027: string;
  importUSD: string;
  importCountries: string;
}

export interface ClassifyResult {
  score: number;
  grade: 'high' | 'mid' | 'low';
  reasons: string[];
  breakdown: { label: string; pts: number }[];
  suggestedType: '부스' | '바이어' | '미디어' | '';
  typeReason: string;
}

export interface EmailContent {
  subject: string;
  body: string;
}

export interface IndustryWeights {
  pet: number;
  trade: number;
  health: number;
  it: number;
  food: number;
  beauty: number;
  edu: number;
  mfg: number;
  media: number;
  camping: number;
  other: number;
  coffee: number;
  baby: number;
  interior: number;
  construction: number;
  handmade: number;
  defense: number;
  environment: number;
  mechanical: number;
  surface: number;
  vr: number;
  hotel: number;
  security: number;
  special: number;
}

export interface ShowGroup {
  key: string;
  emoji: string;
  label: string;
  shows: string[];
}

export interface TitleWeights {
  ceo: number;
  director: number;
  specialist: number;
  other: number;
}

export interface ContactWeights {
  both: number;
  emailOnly: number;
  phoneOnly: number;
}
