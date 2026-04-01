import { useState, useMemo, useEffect, useRef } from 'react';
import { Contact } from '../lib/types';
import { classifyContact } from '../lib/scoring';
import { TYPE_COLORS, FLAGS } from '../lib/data';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Search, FileSpreadsheet, Download, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { parseExcelFile, EXCEL_TEMPLATE_HEADERS } from '../lib/excelUtils';

interface Props {
  contacts: Contact[];
  selectedId: number | null;
  selectedEvent: string;
  isAuthenticated: boolean;
  onSelectContact: (id: number) => void;
  onContactsChange: (contacts: Contact[]) => void;
  onOpenWeightEditor: () => void;
  onOpenScoringModal: () => void;
  onRequireLogin: () => void;
  onVisibleIdsChange?: (ids: number[]) => void;
}

type SortKey = 'priority' | 'name' | 'country' | 'type';

export function ContactList({
  contacts,
  selectedId,
  selectedEvent,
  isAuthenticated,
  onSelectContact,
  onContactsChange,
  onOpenWeightEditor,
  onOpenScoringModal,
  onRequireLogin,
  onVisibleIdsChange,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('전체');
  const [filterCountry, setFilterCountry] = useState('전체');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 점수 계산 및 우선순위 적용
  const contactsWithScores = useMemo(() => {
    return contacts.map((contact) => {
      const result = classifyContact(contact, selectedEvent);
      return { ...contact, score: result.score, grade: result.grade, priority: result.score };
    });
  }, [contacts, selectedEvent]);

  // 필터링
  const filteredContacts = useMemo(() => {
    return contactsWithScores.filter((contact) => {
      // 검색
      const query = searchQuery.toLowerCase();
      if (query) {
        const matchName = contact.name.toLowerCase().includes(query);
        const matchCompany = contact.company.toLowerCase().includes(query);
        const matchIndustry = contact.industry.toLowerCase().includes(query);
        if (!matchName && !matchCompany && !matchIndustry) return false;
      }

      // 유형 필터
      if (filterType !== '전체' && contact.type !== filterType) return false;

      // 국가 필터
      if (filterCountry !== '전체' && contact.country !== filterCountry) return false;

      // 등급 필터
      if (gradeFilter !== 'all') {
        const grade = contact.score >= 70 ? 'high' : contact.score >= 40 ? 'mid' : 'low';
        if (grade !== gradeFilter) return false;
      }

      return true;
    });
  }, [contactsWithScores, searchQuery, filterType, filterCountry, gradeFilter]);

  // 정렬
  const sortedContacts = useMemo(() => {
    const sorted = [...filteredContacts];
    sorted.sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'priority') {
        comparison = (b.priority || 0) - (a.priority || 0);
      } else if (sortKey === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === 'country') {
        comparison = a.country.localeCompare(b.country);
      } else if (sortKey === 'type') {
        comparison = a.type.localeCompare(b.type);
      }
      return comparison * sortDir;
    });
    return sorted;
  }, [filteredContacts, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 1 ? -1 : 1) as 1 | -1);
    } else {
      setSortKey(key);
      setSortDir(1);
    }
    setFilterOpen(false);
  };

  const handleDownloadTemplate = () => {
    const sampleRow = ['홍길동', '(주)샘플회사', 'Sample Corp', '대표이사', 'CEO', 'sample@email.com', '010-1234-5678', '한국어', '한국', '유통/무역', '특이사항 메모'];
    const csv = [EXCEL_TEMPLATE_HEADERS.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '명함DB_업로드_템플릿.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (file: File) => {
    const loaded = await parseExcelFile(file);
    if (loaded.length === 0) {
      toast.error('데이터를 읽지 못했습니다', { description: '파일 형식 또는 컬럼명을 확인해주세요' });
      return;
    }
    onContactsChange(loaded);
    setShowExcelModal(false);
    toast.success(`${loaded.length}건 불러왔습니다`, { description: '엑셀 데이터가 적용되었습니다' });
  };

  // 국가 목록
  const countries = useMemo(() => {
    const unique = Array.from(new Set(contacts.map((c) => c.country)));
    return ['전체', ...unique.sort()];
  }, [contacts]);

  // 등급별 개수
  const gradeCounts = useMemo(() => {
    const counts = { high: 0, mid: 0, low: 0 };
    contactsWithScores.forEach((c) => {
      const grade = c.score >= 70 ? 'high' : c.score >= 40 ? 'mid' : 'low';
      counts[grade]++;
    });
    return counts;
  }, [contactsWithScores]);

  const sortOptions = [
    { key: 'priority' as SortKey, label: '섭외 우선순위' },
    { key: 'name' as SortKey, label: '이름' },
    { key: 'country' as SortKey, label: '국가' },
    { key: 'type' as SortKey, label: '유형' },
  ];

  // 전시 변경 또는 정렬 변경 시 선택된 연락처로 스크롤
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    if (!selectedId || !listRef.current) return;
    const el = cardRefs.current.get(selectedId);
    if (!el) return;
    const list = listRef.current;
    const elRect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (elRect.top < listRect.top) {
      list.scrollBy({ top: elRect.top - listRect.top, behavior: 'smooth' });
    } else if (elRect.bottom > listRect.bottom) {
      list.scrollBy({ top: elRect.bottom - listRect.bottom, behavior: 'smooth' });
    }
  }, [selectedEvent, sortedContacts, selectedId]);

  useEffect(() => {
    onVisibleIdsChange?.(sortedContacts.map(c => c.id));
  }, [sortedContacts, onVisibleIdsChange]);

  return (
    <div className="w-full md:w-[520px] border-r border-gray-200 bg-white flex flex-col flex-shrink-0 shadow-sm">
      {/* 필터 토글 헤더 */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
        <button
          onClick={() => setFilterOpen(o => !o)}
          className="flex items-center gap-2 hover:opacity-70 transition-opacity"
        >
          <span className="text-sm font-bold text-gray-700">필터</span>
          {!filterOpen && (gradeFilter !== 'all' || filterType !== '전체' || filterCountry !== '전체') && (
            <span className="text-xs text-[#E8470A] font-semibold">필터 적용 중</span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={() => setShowExcelModal(true)}
          className="text-xs text-gray-400 underline hover:text-[#E8470A] transition-colors"
        >
          엑셀업로드
        </button>
      </div>

      {/* 필터 영역 */}
      {filterOpen && (
        <>
      {/* 검색 및 필터 */}
      <div className="p-3 border-b border-gray-100 bg-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            id="search-input"
            type="text"
            placeholder="🔍  이름 · 회사 · 업종"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm border-gray-300 focus:border-[#E8470A] h-10 bg-white"
          />
        </div>

        {/* 반응형 필터 (모바일/작은 화면) */}
        <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters} className="lg:hidden">
          <CollapsibleContent>
            {/* 유형 및 국가 필터 */}
            <div className="mt-3 flex gap-2">
              <Select value={filterType} onValueChange={(v) => { setFilterType(v); setFilterOpen(false); }}>
                <SelectTrigger className="flex-1 text-sm h-9 border-gray-300 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="전체">전체 유형</SelectItem>
                  <SelectItem value="부스">부스</SelectItem>
                  <SelectItem value="바이어">바이어</SelectItem>
                  <SelectItem value="미디어">미디어</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCountry} onValueChange={(v) => { setFilterCountry(v); setFilterOpen(false); }}>
                <SelectTrigger className="flex-1 text-sm h-9 border-gray-300 bg-white">
                  <SelectValue placeholder="전체 국가" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {FLAGS[country] || ''} {country === '전체' ? '전체 국가' : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                정렬
              </span>
              {sortOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSort(opt.key)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${ 
                    sortKey === opt.key
                      ? 'text-white font-bold shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8470A] hover:text-[#E8470A]'
                  }`}
                  style={{
                    backgroundColor: sortKey === opt.key ? '#1A1A1A' : undefined,
                    borderColor: sortKey === opt.key ? '#1A1A1A' : undefined,
                  }}
                >
                  {opt.label}
                  {sortKey === opt.key && (
                    <span className="ml-1 text-[11px] opacity-70">{sortDir === 1 ? '↑' : '↓'}</span>
                  )}
                </button>
              ))}
            </div>
          </CollapsibleContent>

          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3 text-xs text-gray-600 hover:text-gray-800 h-8 border border-gray-300 hover:border-gray-400 bg-white font-semibold"
            >
              필터 {showAdvancedFilters ? '접기' : '펼치기'}
              <ChevronDown className={`ml-1 h-3.5 w-3.5 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* 큰 화면에서는 항상 표시 */}
        <div className="hidden lg:block">
          {/* 유형 및 국가 필터 */}
          <div className="mt-3 flex gap-2">
            <Select value={filterType} onValueChange={(v) => { setFilterType(v); setFilterOpen(false); }}>
              <SelectTrigger className="flex-1 text-sm h-9 border-gray-300 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 유형</SelectItem>
                <SelectItem value="부스">부스</SelectItem>
                <SelectItem value="바이어">바이어</SelectItem>
                <SelectItem value="미디어">미디어</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCountry} onValueChange={(v) => { setFilterCountry(v); setFilterOpen(false); }}>
              <SelectTrigger className="flex-1 text-sm h-9 border-gray-300 bg-white">
                <SelectValue placeholder="전체 국가" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {FLAGS[country] || ''} {country === '전체' ? '전체 국가' : country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 정렬 */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
              정렬
            </span>
            {sortOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handleSort(opt.key)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${ 
                  sortKey === opt.key
                    ? 'text-white font-bold shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#E8470A] hover:text-[#E8470A]'
                }`}
                style={{
                  backgroundColor: sortKey === opt.key ? '#1A1A1A' : undefined,
                  borderColor: sortKey === opt.key ? '#1A1A1A' : undefined,
                }}
              >
                {opt.label}
                {sortKey === opt.key && (
                  <span className="ml-1 text-[11px] opacity-70">{sortDir === 1 ? '↑' : '↓'}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 등급 필터 */}
      <div className="px-3 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">📊 전시 적합도 필터</span>
          <button
            onClick={onOpenScoringModal}
            className="text-xs text-[#E8470A] bg-white border border-[#E8470A33] rounded-lg px-2 py-1 cursor-pointer transition-all hover:bg-[#FFF4EE] shadow-sm"
          >
            📊 채점기준표
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => { setGradeFilter('all'); setFilterOpen(false); }}
            className={`text-sm px-3 py-2 rounded-lg border-[1.5px] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm ${
              gradeFilter === 'all'
                ? 'text-white'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
            style={{
              backgroundColor: gradeFilter === 'all' ? '#1A1A1A' : undefined,
              borderColor: gradeFilter === 'all' ? '#1A1A1A' : undefined,
            }}
          >
            전체 보기
            <span className="text-xs opacity-75 font-bold">({contactsWithScores.length})</span>
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => { setGradeFilter('high'); setFilterOpen(false); }}
              className={`flex-1 text-sm px-3 py-2 rounded-lg border-[1.5px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm ${
                gradeFilter === 'high'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-600'
              }`}
            >
              높음
              <span className="text-xs opacity-75 font-bold">({gradeCounts.high})</span>
            </button>
            <button
              onClick={() => { setGradeFilter('mid'); setFilterOpen(false); }}
              className={`flex-1 text-sm px-3 py-2 rounded-lg border-[1.5px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm ${
                gradeFilter === 'mid'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-amber-600'
              }`}
            >
              보통
              <span className="text-xs opacity-75 font-bold">({gradeCounts.mid})</span>
            </button>
            <button
              onClick={() => { setGradeFilter('low'); setFilterOpen(false); }}
              className={`flex-1 text-sm px-3 py-2 rounded-lg border-[1.5px] font-semibold transition-all flex items-center justify-center gap-1 shadow-sm ${
                gradeFilter === 'low'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-red-600'
              }`}
            >
              낮음
              <span className="text-xs opacity-75 font-bold">({gradeCounts.low})</span>
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {/* 엑셀 업로드 모달 */}
      {showExcelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h2 className="font-bold text-base text-gray-800">📂 엑셀 업로드</h2>
                <p className="text-xs text-gray-500 mt-0.5">.xlsx / .xls / .csv 파일을 업로드하세요</p>
              </div>
              <button onClick={() => setShowExcelModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <button
                onClick={handleDownloadTemplate}
                className="w-full flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#E8470A] hover:text-[#E8470A] hover:bg-orange-50 transition-colors"
              >
                <Download className="w-5 h-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-bold">엑셀 양식 다운로드</div>
                  <div className="text-xs opacity-70 mt-0.5">명함DB_업로드_템플릿.csv</div>
                </div>
              </button>

              <label
                className={`block w-full border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#E8470A] bg-orange-50'
                    : 'border-gray-300 hover:border-[#E8470A] hover:bg-orange-50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              >
                <FileSpreadsheet className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                <div className="font-bold text-sm text-gray-700">파일을 여기에 드래그하거나 클릭하여 선택</div>
                <div className="text-xs text-gray-400 mt-1">.xlsx / .xls / .csv 지원</div>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) await handleFileUpload(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setShowExcelModal(false)} className="w-full px-4 py-2 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 연락처 리스트 */}
      <div className="flex-1 overflow-y-auto" ref={listRef}>
        {sortedContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-base text-gray-700 mb-2">검색 결과 없음</h3>
            <p className="text-sm text-gray-500">필터 조건을 변경해보세요</p>
          </div>
        ) : (
          sortedContacts.map((contact) => {
            const grade = contact.score >= 70 ? 'high' : contact.score >= 40 ? 'mid' : 'low';
            const gradeColor = grade === 'high' ? 'bg-emerald-500' : grade === 'mid' ? 'bg-amber-500' : 'bg-red-500';
            const tc = TYPE_COLORS[contact.type] || TYPE_COLORS['부스'];

            return (
              <TooltipProvider key={contact.id} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      ref={el => {
                        if (el) cardRefs.current.set(contact.id, el);
                        else cardRefs.current.delete(contact.id);
                      }}
                      onClick={() => { onSelectContact(contact.id); setFilterOpen(false); }}
                      className={`px-4 py-3 border-b border-gray-50 cursor-pointer border-l-[3px] transition-all hover:shadow-sm ${
                        selectedId === contact.id
                          ? 'bg-[#FFF4EE] border-l-[#E8470A] shadow-sm'
                          : 'border-l-transparent hover:bg-[#FFF9F7]'
                      }`}
                    >
                      <div className="flex justify-between gap-2 items-start">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base text-gray-800 truncate">{contact.name}</div>
                          <div className="text-sm text-gray-600 truncate mt-1">{contact.company}</div>
                          <div className="text-sm text-gray-500 truncate mt-0.5">{contact.title}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full ${gradeColor} mt-0.5`}></div>
                          <span className="text-sm font-extrabold text-gray-600">{contact.score}pt</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className="text-xs rounded px-1.5 py-0.5 whitespace-nowrap border font-medium"
                          style={{
                            background: tc.bg,
                            color: tc.text,
                            borderColor: tc.border,
                          }}
                        >
                          {tc.label}
                        </span>
                        <span className="text-xs text-gray-500">{FLAGS[contact.country] || ''}</span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#1A1A1A] text-white border-none">
                    <div className="text-xs text-gray-300 mb-1">섭외 우선순위 점수</div>
                    <div className="text-base font-bold text-[#F97316]">{contact.score}pt</div>
                    <div className="text-xs text-gray-400 mt-1">클릭하여 상세보기</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })
        )}
      </div>
    </div>
  );
}