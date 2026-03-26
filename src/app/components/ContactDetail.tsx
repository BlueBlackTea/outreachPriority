import { useState, useMemo, useEffect } from 'react';
import { Contact } from '../lib/types';
import { classifyContact } from '../lib/scoring';
import { TYPE_COLORS, FLAGS, SHOWS, SHOW_GROUPS } from '../lib/data';
import { Mail, Globe, Phone } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  contact: Contact | null;
  selectedEvent: string;
  selectedSeason: string;
  onSeasonChange: (season: string) => void;
}

export function ContactDetail({ contact, selectedEvent, selectedSeason, onSeasonChange }: Props) {
  // 분야(cat_*) 선택 시 내부 시리즈 선택 상태
  const [localSeries, setLocalSeries] = useState('');

  // selectedEvent가 cat_* 로 바뀌면 해당 분야 첫 번째 전시로 초기화
  useEffect(() => {
    if (selectedEvent.startsWith('cat_')) {
      const g = SHOW_GROUPS.find(gr => gr.key === selectedEvent);
      const first = g?.shows.find(k => SHOWS[k]) ?? '';
      setLocalSeries(first);
      onSeasonChange('1');
    }
  }, [selectedEvent]);

  // 실제 시즌에 사용할 전시 ID
  const effectiveEventId = selectedEvent.startsWith('cat_') ? localSeries : selectedEvent;

  // 분류 결과 계산 - 항상 실행 (hook 순서 유지)
  const classifyResult = useMemo(() => {
    if (!contact) return null;
    return classifyContact(contact, selectedEvent);
  }, [contact, selectedEvent]);

  // 빈 상태 - hooks 호출 후에 체크
  if (!contact || !classifyResult) {
    return (
      <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="text-center max-w-lg">
          {/* 메인 아이콘 */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-lg border-4 border-orange-100">
              <Mail className="w-16 h-16 text-orange-500" />
            </div>
          </div>

          {/* 타이틀 */}
          <h3 className="font-bold text-2xl text-gray-800 mb-3">연락처를 선택하세요</h3>
          <p className="text-base text-gray-600 leading-relaxed mb-8">
            좌측 목록에서 연락처를 클릭하면
            <br />
            <span className="text-orange-600 font-semibold">적합도 분석</span>을 확인할 수 있습니다
          </p>

          {/* 기능 카드 */}
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100 text-left">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 rounded-lg p-2 flex-shrink-0">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800 mb-1">AI 기반 적합도 분석</div>
                  <div className="text-xs text-gray-500">전시 유형별 맞춤 점수 및 우선순위 추천</div>
                </div>
              </div>
            </div>
          </div>

          {/* 팁 */}
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-2 text-sm text-amber-800">
            <span className="text-base">💡</span>
            <span><strong>팁:</strong> ↑↓ 화살표 키로 빠르게 탐색할 수 있습니다</span>
          </div>
        </div>
      </div>
    );
  }

  const gradeColor =
    classifyResult.grade === 'high' ? 'bg-emerald-500' : classifyResult.grade === 'mid' ? 'bg-amber-500' : 'bg-red-500';
  const gradeBg =
    classifyResult.grade === 'high'
      ? 'bg-emerald-50 border-emerald-200'
      : classifyResult.grade === 'mid'
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200';
  const gradeText =
    classifyResult.grade === 'high' ? 'text-emerald-700' : classifyResult.grade === 'mid' ? 'text-amber-700' : 'text-red-700';

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* 연락처 카드 - 상단 고정 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-5 shadow-md">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-800">{contact.name}</h2>
            <div className="text-sm text-gray-600 mt-1">{contact.company}</div>
            <div className="text-xs text-gray-500 mt-1">{contact.title}</div>
          </div>
        </div>

        <div className="flex flex-nowrap gap-3 mt-4 items-center overflow-x-auto">
          <div className="text-sm text-gray-600 flex items-center gap-1.5">
            {FLAGS[contact.country] || '🌍'} {contact.country}
          </div>
          {contact.email && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(contact.email!);
                toast.success('이메일 주소가 복사되었습니다', { description: contact.email });
              }}
              className="text-sm text-gray-600 flex items-center gap-1.5 hover:text-[#E8470A] hover:bg-orange-50 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              {contact.email}
            </button>
          )}
          {contact.phone && (
            <div className="text-sm text-gray-600 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              {contact.phone}
            </div>
          )}
          {contact.website && (
            <a
              href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 flex items-center gap-1.5 hover:text-[#E8470A] hover:bg-orange-50 px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              {contact.website}
            </a>
          )}
        </div>

        {contact.note && (
          <div className="mt-3 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
            <span className="text-xs font-bold text-gray-600">메모:</span>
            <span className="text-sm text-gray-700 ml-2">{contact.note}</span>
          </div>
        )}
      </div>

      <div className="p-6 lg:p-8">
        {/* 적합도 분석 */}
        <div className={`border-[1.5px] rounded-lg overflow-hidden mb-8 shadow-sm ${gradeBg}`}>
          <div className="p-4 flex justify-between items-center">
            <div>
              <div className={`font-bold text-base ${gradeText}`}>
                {classifyResult.grade === 'high' ? '🔥 높은 적합도' : classifyResult.grade === 'mid' ? '⚡ 보통 적합도' : '❌ 낮은 적합도'}
              </div>
              <div className="text-xs mt-1 opacity-80">
                {classifyResult.grade === 'high'
                  ? '우선 섭외 대상'
                  : classifyResult.grade === 'mid'
                  ? '관심 타겟'
                  : '낮은 우선순위'}
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-black leading-none ${gradeText}`}>{classifyResult.score}</div>
              <div className="text-xs opacity-70">/ 100pt</div>
            </div>
          </div>

          <div className="bg-white p-4 border-t">
            <div className="mb-3">
              <div className="text-xs font-bold text-gray-500 mb-2">점수 내역</div>
              {classifyResult.breakdown.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1.5 text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className={`font-bold ${item.pts >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {item.pts > 0 ? '+' : ''}
                    {item.pts}pt
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3">
              <div className="text-xs font-bold text-gray-500 mb-2">추천 영업 목적</div>
              <div
                className="rounded-lg p-3 border shadow-sm"
                style={{
                  background: TYPE_COLORS[classifyResult.suggestedType]?.bg || '#F9FAFB',
                  borderColor: TYPE_COLORS[classifyResult.suggestedType]?.border || '#E5E7EB',
                }}
              >
                <div className="font-bold text-base" style={{ color: TYPE_COLORS[classifyResult.suggestedType]?.text || '#6B7280' }}>
                  {TYPE_COLORS[classifyResult.suggestedType]?.label || '🏛 기관 — 특별 접근'}
                </div>
                <div className="text-sm mt-1 opacity-80">{classifyResult.typeReason}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 시리즈 선택 (분야 선택 시) */}
        {selectedEvent.startsWith('cat_') && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">전시 시리즈</div>
            <div className="flex gap-2 flex-wrap">
              {SHOW_GROUPS.find(g => g.key === selectedEvent)?.shows
                .filter(k => SHOWS[k]).map(k => (
                  <button
                    key={k}
                    onClick={() => { setLocalSeries(k); onSeasonChange('1'); }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      localSeries === k
                        ? 'border-[#E8470A] bg-orange-50 text-[#E8470A]'
                        : 'border-gray-300 text-gray-500 hover:border-gray-400'
                    }`}
                  >
                    {SHOWS[k].emoji} {SHOWS[k].name.replace(/\s*\d{4}$/, '')}
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* 시즌 선택 */}
        {(SHOWS[effectiveEventId as keyof typeof SHOWS]?.seasons ?? []).length > 0 && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">전시 시즌</div>
            <div className="flex gap-2 flex-wrap">
              {(SHOWS[effectiveEventId as keyof typeof SHOWS]?.seasons ?? []).map((season) => (
                <button
                  key={season.key}
                  onClick={() => onSeasonChange(season.key)}
                  className={`px-4 py-2 rounded-lg border-[1.5px] text-sm transition-all shadow-sm flex flex-col items-start ${
                    selectedSeason === season.key
                      ? 'border-[#E8470A] bg-orange-50 text-[#E8470A] font-bold'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-bold">{season.label}</div>
                  <div className="text-[11px] opacity-70 mt-0.5">{season.dates}</div>
                  <div className="text-[11px] opacity-70">{season.venue}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
