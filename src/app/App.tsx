import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Toaster } from './components/ui/sonner';
import { ContactList } from './components/ContactList';
import { ContactDetail } from './components/ContactDetail';
import { WeightEditorModal } from './components/WeightEditorModal';
import { ScoringModal } from './components/ScoringModal';
import { LandingScreen } from './components/LandingScreen';
import { LoginModal } from './components/LoginModal';
import { SHOWS, SHOW_GROUPS } from './lib/data';
import { classifyContact } from './lib/scoring';
import { Contact } from './lib/types';
import { supabase } from './lib/supabase';
import { parseExcelFile } from './lib/excelUtils';
import { LogOut, Database, FileSpreadsheet, ChevronDown, ChevronRight } from 'lucide-react';

type DataSource = 'none' | 'excel' | 'supabase';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [dataSource, setDataSource] = useState<DataSource>('none');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedEvent, setSelectedEvent] = useState('cat_pet');
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showScoringModal, setShowScoringModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [visibleContactIds, setVisibleContactIds] = useState<number[]>([]);
  const [scoreVersion, setScoreVersion] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const forceRescore = useCallback(() => {
    setContacts(c => [...c]);
    setScoreVersion(v => v + 1);
  }, []);

  const top3Categories = useMemo(() => {
    return SHOW_GROUPS
      .map(g => ({
        ...g,
        cnt: contacts.filter(c => classifyContact(c, g.key).grade === 'high').length,
      }))
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 3);
  }, [contacts]);

  const displayChips = useMemo(() => {
    const selected = SHOW_GROUPS.find(g => g.key === selectedEvent);
    if (!selected) return top3Categories;
    const cnt = contacts.filter(c => classifyContact(c, selected.key).grade === 'high').length;
    const selectedWithCnt = { ...selected, cnt };
    const rest = top3Categories.filter(g => g.key !== selectedEvent).slice(0, 2);
    return [selectedWithCnt, ...rest];
  }, [selectedEvent, top3Categories, contacts]);

  // selectedEvent가 바뀔 때 선택된 연락처 초기화
  useEffect(() => {
    setSelectedId(null);
  }, [selectedEvent]);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // 세션 복원
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserEmail(session.user.email ?? null);
    });
  }, []);

  function handleContactsLoaded(loaded: Contact[], source: 'excel' | 'supabase') {
    setContacts(loaded);
    setDataSource(source);
    setSelectedId(null);
    if (source === 'supabase') {
      supabase.auth.getUser().then(({ data }) => {
        setUserEmail(data.user?.email ?? null);
      });
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setContacts([]);
    setDataSource('none');
    setUserEmail(null);
    setSelectedId(null);
  }

  async function handleExcelReload(file: File) {
    const loaded = await parseExcelFile(file);
    if (loaded.length > 0) {
      setContacts(loaded);
      setDataSource('excel');
      setSelectedId(null);
    }
  }

  // 키보드 네비게이션
  useEffect(() => {
    if (dataSource === 'none') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape: 모달 닫기
      if (e.key === 'Escape') {
        if (showWeightModal) setShowWeightModal(false);
        if (showScoringModal) setShowScoringModal(false);
      }

      // Cmd/Ctrl + F: 검색 포커스
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }

      // 모달이 열려있으면 리스트 네비게이션 비활성화
      if (showWeightModal || showScoringModal) return;

      // 화살표 키: 리스트 네비게이션
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = visibleContactIds.indexOf(selectedId ?? -1);
        let nextIndex = -1;

        if (e.key === 'ArrowDown') {
          nextIndex = currentIndex < visibleContactIds.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : visibleContactIds.length - 1;
        }

        if (visibleContactIds[nextIndex] != null) {
          setSelectedId(visibleContactIds[nextIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dataSource, contacts, selectedId, showWeightModal, showScoringModal, visibleContactIds]);

  // 랜딩 화면 표시 조건
  if (dataSource === 'none') {
    return <LandingScreen onContactsLoaded={handleContactsLoaded} />;
  }

  const selectedContact = contacts.find(c => c.id === selectedId) || null;
  const currentShow = SHOWS[selectedEvent as keyof typeof SHOWS];

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toaster position="top-right" richColors />

      {/* Tier 1: 제목부 */}
      <div className="bg-[#1A1A1A] px-6 flex items-center gap-3 flex-shrink-0 shadow-md min-h-[80px] py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="font-black text-lg text-[#E8470A] tracking-wide">섭외 DB 관리</span>
            <span className="text-[#444] mx-1 hidden md:inline">|</span>
            {/* 데이터 소스 배지 */}
            {dataSource === 'supabase' ? (
              <span className="hidden md:flex items-center gap-1.5 text-blue-400 text-xs bg-blue-400/10 border border-blue-400/20 px-2.5 py-1 rounded-full">
                <Database className="w-3 h-3" />
                {userEmail ? userEmail.split('@')[0] : '내 DB'}
              </span>
            ) : (
              <span className="hidden md:flex items-center gap-1.5 text-[#E8470A] text-xs bg-[#E8470A]/10 border border-[#E8470A]/20 px-2.5 py-1 rounded-full">
                <FileSpreadsheet className="w-3 h-3" />
                엑셀 {contacts.length}건
              </span>
            )}
          </div>

          {/* 분야 칩 + 드롭다운 */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {displayChips.map(g => (
              <button
                key={g.key}
                onClick={() => setSelectedEvent(g.key)}
                className={`px-3 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedEvent === g.key
                    ? 'bg-[#E8470A] text-white shadow-[0_0_16px_rgba(232,71,10,0.55)] scale-105 border-[1.5px] border-[#ff6a35]'
                    : 'bg-transparent text-gray-400 border-[1.5px] border-[#444] hover:border-[#E8470A] hover:text-[#E8470A]'
                }`}
              >
                {g.emoji} {g.label}
                <span className={`font-normal text-[10px] ml-0.5 ${selectedEvent === g.key ? 'opacity-80' : 'opacity-55'}`}>{g.cnt}명</span>
              </button>
            ))}

            {/* 구분선 */}
            <div className="w-px h-4 bg-[#333] mx-1 flex-shrink-0" />

            {/* 분야 드롭다운 — 시각적으로 칩과 구분되는 박스형 */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#252525] border border-[#3a3a3a] text-gray-400 text-xs whitespace-nowrap transition-all hover:border-[#555] hover:text-gray-200 font-medium"
              >
                <span className="text-gray-400 text-xs font-medium">분야 전체보기</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-2xl z-50 min-w-[340px] py-1">
                  {SHOW_GROUPS.map(g => (
                    <div
                      key={g.key}
                      className={`relative flex items-center justify-between px-3 py-2 text-xs cursor-pointer transition-colors ${
                        selectedEvent === g.key
                          ? 'bg-[#E8470A]/15 text-[#ff6a35]'
                          : 'text-gray-300 hover:bg-[#2a2a2a] hover:text-white'
                      }`}
                      onMouseEnter={() => setHoveredGroup(g.key)}
                      onMouseLeave={() => setHoveredGroup(null)}
                      onClick={() => { setSelectedEvent(g.key); setDropdownOpen(false); }}
                    >
                      <span className="flex items-center gap-1.5">
                        {g.emoji} {g.label}
                      </span>
                      {g.shows.filter(k => SHOWS[k]).length > 0 && (
                        <ChevronRight className="w-3 h-3 text-gray-500 flex-shrink-0 ml-2" />
                      )}

                      {/* 서브메뉴: 전시 목록 (읽기 전용 표시) */}
                      {hoveredGroup === g.key && g.shows.filter(k => SHOWS[k]).length > 0 && (
                        <div
                          className="absolute right-full top-0 mr-1 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-2xl min-w-[180px] py-1"
                          onMouseEnter={() => setHoveredGroup(g.key)}
                        >
                          <div className="px-3 py-1.5 text-[10px] text-gray-500 border-b border-[#2a2a2a] mb-1 font-medium tracking-wide">소속 전시</div>
                          {g.shows.filter(k => SHOWS[k]).map(k => (
                            <div
                              key={k}
                              className="px-3 py-1.5 text-xs text-gray-400 whitespace-nowrap cursor-default select-none"
                            >
                              {SHOWS[k as keyof typeof SHOWS].emoji} {SHOWS[k as keyof typeof SHOWS].name.replace(/\s*\d{4}$/, '')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 로그아웃 (supabase 모드에서만) */}
            {dataSource === 'supabase' && (
              <div className="ml-2 flex items-center flex-shrink-0">
                <button
                  onClick={() => { setContacts([]); setDataSource('none'); setUserEmail(null); setSelectedId(null); supabase.auth.signOut(); }}
                  className="px-3 py-1.5 rounded-full border border-[#333] text-gray-500 text-xs hover:border-gray-500 hover:text-gray-300 transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <LogOut className="w-3 h-3" /> 로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 메인 */}
      <div className="flex flex-1 min-h-0 overflow-hidden bg-gray-50">
        {/* 왼쪽 패널 */}
        <ContactList
          contacts={contacts}
          selectedId={selectedId}
          selectedEvent={selectedEvent}
          isAuthenticated={dataSource === 'supabase'}
          onRequireLogin={() => setShowLoginModal(true)}
          onSelectContact={(id) => {
            // 이미 선택된 연락처를 다시 클릭하면 선택 취소
            if (id === selectedId) {
              setSelectedId(null);
            } else {
              setSelectedId(id);
            }
          }}
          onContactsChange={(loaded) => { setContacts(loaded); setSelectedId(null); }}
          onOpenWeightEditor={() => setShowWeightModal(true)}
          onOpenScoringModal={() => setShowScoringModal(true)}
          onVisibleIdsChange={setVisibleContactIds}
        />

        {/* 오른쪽 패널 */}
        <ContactDetail
          contact={selectedContact}
          selectedEvent={selectedEvent}
          contacts={contacts}
          scoreVersion={scoreVersion}
        />
      </div>

      {/* 모달들 */}
      {showWeightModal && (
        <WeightEditorModal
          selectedEvent={selectedEvent}
          onClose={() => setShowWeightModal(false)}
          onSave={forceRescore}
        />
      )}

      {showScoringModal && (
        <ScoringModal
          selectedEvent={selectedEvent}
          contacts={contacts}
          onClose={() => setShowScoringModal(false)}
          onSave={forceRescore}
          onOpenWeightEditor={() => {
            setShowScoringModal(false);
            setShowWeightModal(true);
          }}
        />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            supabase.auth.getUser().then(({ data }) => {
              setUserEmail(data.user?.email ?? null);
            });
            setDataSource('supabase');
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
}