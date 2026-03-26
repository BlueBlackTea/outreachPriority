import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { parseExcelFile } from '../lib/excelUtils';
import { Contact } from '../lib/types';
import { Upload, LogIn, FileSpreadsheet, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

interface LandingScreenProps {
  onContactsLoaded: (contacts: Contact[], source: 'excel' | 'supabase') => void;
}

type Step = 'select' | 'login' | 'excel';

export function LandingScreen({ onContactsLoaded }: LandingScreenProps) {
  const [step, setStep] = useState<Step>('select');

  // 로그인 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // 엑셀 상태
  const [excelLoading, setExcelLoading] = useState(false);
  const [excelError, setExcelError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── 로그인 → Supabase에서 contacts fetch ─────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setLoginError('이메일 또는 비밀번호가 올바르지 않습니다.');
      setLoginLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .order('id');

    if (fetchError) {
      setLoginError(`데이터 불러오기 실패: ${fetchError.message}`);
      setLoginLoading(false);
      return;
    }

    const contacts: Contact[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name ?? '',
      company: row.company ?? '',
      company_en: row.company_en ?? '',
      title: row.title ?? '',
      title_en: row.title_en ?? '',
      email: row.email ?? '',
      phone: row.phone ?? '',
      lang: row.lang ?? '한국어',
      country: row.country ?? '한국',
      industry: row.industry ?? '기타',
      type: row.type ?? '부스',
      score: row.score ?? 0,
      note: row.note ?? '',
    }));

    setLoginLoading(false);
    onContactsLoaded(contacts, 'supabase');
  }

  // ── 엑셀 파일 처리 ────────────────────────────────────────────────────────
  async function handleFile(file: File) {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setExcelError('.xlsx, .xls, .csv 파일만 지원합니다.');
      return;
    }
    setExcelLoading(true);
    setExcelError('');
    try {
      const contacts = await parseExcelFile(file);
      if (contacts.length === 0) {
        setExcelError('데이터를 찾을 수 없습니다. 엑셀 템플릿 형식을 확인해주세요.');
        setExcelLoading(false);
        return;
      }
      onContactsLoaded(contacts, 'excel');
    } catch (err: any) {
      setExcelError(`파일 파싱 오류: ${err.message}`);
    }
    setExcelLoading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  // ── 엑셀 템플릿 다운로드 ─────────────────────────────────────────────────
  function downloadTemplate() {
    const header = ['이름', '회사', '영문회사명', '직함', '영문직함', '이메일', '전화번호', '언어', '국가', '산업', '유형', '점수', '메모'];
    const example = ['홍길동', '(주)예시기업', 'Example Corp', '부장', 'Manager', 'hong@example.com', '010-1234-5678', '한국어/영어', '한국', '기타', '부스', '0', '메모 예시'];
    const csvContent = [header, example].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '명함DB_템플릿.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4">
      {/* 헤더 */}
      <div className="mb-10 text-center">
        <div className="text-[#E8470A] font-black text-3xl tracking-wide mb-2">섭외 DB 관리</div>
        <div className="text-gray-500 text-sm">전시별 섭외 적합도 분석 · 이메일 생성</div>
      </div>

      {/* 카드 */}
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] shadow-2xl overflow-hidden">

        {/* ─── 소스 선택 화면 ─────────────────────────────────────────────── */}
        {step === 'select' && (
          <div className="p-8 space-y-4">
            {/* 엑셀 업로드 */}
            <button
              onClick={() => setStep('excel')}
              className="w-full flex items-center gap-4 p-5 rounded-xl border border-[#2A2A2A] hover:border-[#E8470A]/50 hover:bg-[#E8470A]/5 transition-all group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E8470A]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8470A]/20 transition-colors">
                <FileSpreadsheet className="w-6 h-6 text-[#E8470A]" />
              </div>
              <div>
                <div className="text-white font-semibold">엑셀 파일 업로드</div>
                <div className="text-gray-500 text-xs mt-0.5">.xlsx / .xls / .csv 파일을 불러와 분석</div>
              </div>
            </button>

            {/* 관리자 로그인 */}
            <button
              onClick={() => setStep('login')}
              className="w-full text-center text-gray-600 hover:text-gray-400 text-xs transition-colors mt-2"
            >
              관리자 로그인
            </button>
          </div>
        )}

        {/* ─── 엑셀 업로드 화면 ───────────────────────────────────────────── */}
        {step === 'excel' && (
          <div className="p-8">
            <button onClick={() => { setStep('select'); setExcelError(''); }} className="text-gray-500 hover:text-gray-300 text-sm mb-6 flex items-center gap-1 transition-colors">
              ← 돌아가기
            </button>

            {/* 드래그 앤 드롭 영역 */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[#E8470A] bg-[#E8470A]/10'
                  : 'border-[#2A2A2A] hover:border-[#E8470A]/50 hover:bg-[#E8470A]/5'
              }`}
            >
              {excelLoading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-[#E8470A] animate-spin" />
                  <div className="text-gray-400 text-sm">파일 파싱 중...</div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-10 h-10 text-gray-600" />
                  <div className="text-gray-300 font-medium">파일을 드래그하거나 클릭하여 업로드</div>
                  <div className="text-gray-600 text-xs">.xlsx, .xls, .csv 지원</div>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileInput} />

            {excelError && (
              <div className="mt-4 flex items-start gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{excelError}</span>
              </div>
            )}

            {/* 템플릿 다운로드 */}
            <div className="mt-4 text-center">
              <button onClick={downloadTemplate} className="text-xs text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2">
                엑셀 템플릿 다운로드 (.csv)
              </button>
            </div>
          </div>
        )}

        {/* ─── 로그인 화면 ────────────────────────────────────────────────── */}
        {step === 'login' && (
          <div className="p-8">
            <button onClick={() => { setStep('select'); setLoginError(''); }} className="text-gray-500 hover:text-gray-300 text-sm mb-6 flex items-center gap-1 transition-colors">
              ← 돌아가기
            </button>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs mb-1.5">이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="이메일 입력"
                  required
                  className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-1.5">비밀번호</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="비밀번호 입력"
                    required
                    className="w-full bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-start gap-2 text-red-400 text-sm bg-red-400/10 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                {loginLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> 로그인 중...</>
                ) : (
                  <><LogIn className="w-4 h-4" /> 로그인하여 내 DB 불러오기</>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-700 text-xs text-center">
        데이터는 안전하게 보호됩니다
      </div>
    </div>
  );
}
