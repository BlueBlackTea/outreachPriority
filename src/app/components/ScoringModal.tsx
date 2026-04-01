import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { TITLE_WEIGHTS, CONTACT_WEIGHTS, SHOW_WEIGHTS, INDUSTRY_LABELS, GRADE_THRESHOLDS } from '../lib/data';
import { Settings2, X, Check, Info } from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { classifyContact } from '../lib/scoring';
import type { Contact } from '../lib/types';

interface Props {
  selectedEvent: string;
  contacts: Contact[];
  onClose: () => void;
  onSave?: () => void;
  onOpenWeightEditor?: () => void;
}

function useDragNumber(value: number, onChange: (v: number) => void, min = 0, max = 100) {
  const drag = useRef<{ startY: number; startVal: number } | null>(null);
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    drag.current = { startY: e.clientY, startVal: value };
    const onMove = (ev: MouseEvent) => {
      if (!drag.current) return;
      const delta = Math.round((drag.current.startY - ev.clientY) / 10);
      onChange(Math.min(max, Math.max(min, drag.current.startVal + delta)));
    };
    const onUp = () => {
      drag.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };
  return { onMouseDown, style: { cursor: 'ns-resize', userSelect: 'none' as const } };
}

export function ScoringModal({ selectedEvent, contacts, onClose, onSave }: Props) {
  const industryWeights = SHOW_WEIGHTS[selectedEvent];
  
  // 편집 상태 관리
  const [editingSection, setEditingSection] = useState<'grade' | 'title' | 'industry' | 'contact' | null>(null);
  
  // 편집 중인 가중치 값들
  const [titleWeights, setTitleWeights] = useState({ ...TITLE_WEIGHTS });
  const [contactWeights, setContactWeights] = useState({ ...CONTACT_WEIGHTS });
  const [industryWeightsEdited, setIndustryWeightsEdited] = useState({ ...industryWeights });
  
  // 등급 기준 점수
  const [gradeThresholds, setGradeThresholds] = useState({ high: GRADE_THRESHOLDS.high, low: GRADE_THRESHOLDS.low });

  const highDrag = useDragNumber(gradeThresholds.high, (v) =>
    setGradeThresholds(prev => ({ high: v, low: v <= prev.low ? Math.max(0, v - 1) : prev.low }))
  );
  const lowDrag = useDragNumber(gradeThresholds.low, (v) =>
    setGradeThresholds(prev => ({ low: v, high: v >= prev.high ? Math.min(100, v + 1) : prev.high }))
  );

  // 현재 선택 전시 기준으로 모든 연락처 점수 동적 계산 (정적 score 필드 대신 사용)
  const eventScores = useMemo(
    () => contacts.map(c => classifyContact(c, selectedEvent).score),
    [contacts, selectedEvent]
  );

  const highCount = eventScores.filter(s => s >= gradeThresholds.high).length;
  const midCount  = eventScores.filter(s => s >= gradeThresholds.low && s < gradeThresholds.high).length;
  const lowCount  = eventScores.filter(s => s < gradeThresholds.low).length;

  const handleSave = (section: 'grade' | 'title' | 'industry' | 'contact') => {
    if (section === 'grade') {
      Object.assign(GRADE_THRESHOLDS, gradeThresholds);
      localStorage.setItem('grade_thresholds', JSON.stringify(gradeThresholds));
    }
    if (section === 'title') {
      Object.assign(TITLE_WEIGHTS, titleWeights);
      localStorage.setItem('title_weights', JSON.stringify(titleWeights));
    }
    if (section === 'contact') {
      Object.assign(CONTACT_WEIGHTS, contactWeights);
      localStorage.setItem('contact_weights', JSON.stringify(contactWeights));
    }
    if (section === 'industry') {
      SHOW_WEIGHTS[selectedEvent] = industryWeightsEdited;
      localStorage.setItem('show_weights', JSON.stringify(SHOW_WEIGHTS));
    }
    toast.success('저장되었습니다', { description: '점수가 재계산됩니다' });
    onSave?.();
    setEditingSection(null);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-w-md max-h-[85vh] shadow-lg [&>button]:hidden flex flex-col p-0 overflow-hidden">
        {/* 고정 헤더 */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex justify-between items-center gap-3">
            <DialogTitle className="text-lg m-0">📊 섭외 우선순위 채점 기준표</DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1.5"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

        {/* 스크롤 가능한 콘텐츠 영역 */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* 서브텍스트 */}
          <p className="text-sm text-gray-500 mt-2 mb-4">
            선택 전시의 업종 가중치 기반 자동 채점 → 섭외 우선순위 산정
          </p>

          <div className="space-y-2">
            {/* 등급 기준 - 최상단으로 이동하고 편집 가능하게 */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 shadow-md">
              <div className="text-xs font-extrabold text-gray-700 uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>🎯 적합도 등급 기준</span>
                <div className="flex items-center gap-2">
                  {editingSection === 'grade' ? (
                    <button
                      onClick={() => handleSave('grade')}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 text-xs border border-emerald-600 rounded-lg px-2 py-1 hover:bg-emerald-50"
                    >
                      <Check className="w-3 h-3" />
                      <span className="font-semibold">수정완료</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingSection('grade')}
                      className="text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1 text-xs border border-gray-300 rounded-lg px-2 py-1 hover:border-gray-500 hover:bg-gray-200"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span className="font-semibold">기준 편집</span>
                    </button>
                  )}
                </div>
              </div>
              
              {editingSection === 'grade' ? (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-700">🔥 높은 적합도</span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '1px 7px', marginLeft: 'auto' }}>{highCount}명</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeThresholds.high}
                          onChange={(e) => {
                            const newHigh = Math.min(100, Math.max(0, Number(e.target.value)));
                            setGradeThresholds(prev => ({
                              high: newHigh,
                              low: newHigh <= prev.low ? Math.max(0, newHigh - 1) : prev.low,
                            }));
                          }}
                          {...highDrag}
                          className="w-16 text-xs font-bold text-emerald-600 text-right bg-emerald-50 border border-emerald-300 rounded px-2 py-1 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs text-emerald-600">점 이상</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-700">⚡ 보통 적합도</span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '1px 7px', marginLeft: 'auto' }}>{midCount}명</span>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={gradeThresholds.low}
                          onChange={(e) => {
                            const newLow = Math.min(100, Math.max(0, Number(e.target.value)));
                            setGradeThresholds(prev => ({
                              low: newLow,
                              high: newLow >= prev.high ? Math.min(100, newLow + 1) : prev.high,
                            }));
                          }}
                          {...lowDrag}
                          className="w-16 text-xs font-bold text-amber-600 text-right bg-amber-50 border border-amber-300 rounded px-2 py-1 focus:outline-none focus:border-amber-500"
                        />
                        <span className="text-xs text-amber-600">–</span>
                        <span className="text-xs font-bold text-amber-600">{gradeThresholds.high - 1}점</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-red-700">❌ 낮은 적합도</span>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '999px', padding: '1px 7px', marginLeft: 'auto' }}>{lowCount}명</span>
                        <span className="text-xs font-bold text-red-600">{gradeThresholds.low - 1}점 이하</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-emerald-50 border-[1.5px] border-emerald-200 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-emerald-800 mb-1">🔥 높은 적합도</div>
                    <div className="text-sm font-extrabold text-emerald-600">{gradeThresholds.high}점 이상</div>
                    <div style={{ fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '1px 7px', display: 'inline-block', marginTop: '4px' }}>{highCount}명</div>
                  </div>
                  <div className="bg-amber-50 border-[1.5px] border-amber-200 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-amber-800 mb-1">⚡ 보통 적합도</div>
                    <div className="text-sm font-extrabold text-amber-600">{gradeThresholds.low} – {gradeThresholds.high - 1}점</div>
                    <div style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '1px 7px', display: 'inline-block', marginTop: '4px' }}>{midCount}명</div>
                  </div>
                  <div className="bg-red-50 border-[1.5px] border-red-200 rounded-lg p-2.5 text-center">
                    <div className="text-xs font-bold text-red-800 mb-1">❌ 낮은 적합도</div>
                    <div className="text-sm font-extrabold text-red-600">{gradeThresholds.low - 1}점 이하</div>
                    <div style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#991b1b', borderRadius: '999px', padding: '1px 7px', display: 'inline-block', marginTop: '4px' }}>{lowCount}명</div>
                  </div>
                </div>
              )}
            </div>

            {/* 연락처 - 직함 앞으로 이동 */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 shadow-md">
              <div className="text-xs font-extrabold text-[#E8470A] uppercase tracking-wider mb-3 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  📬 연락처
                  <span className="relative group/tip">
                    <Info className="w-3 h-3 text-gray-500 cursor-help" />
                    <span className="pointer-events-none absolute left-0 top-full mt-1.5 z-50 hidden group-hover/tip:block w-64 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg p-3 shadow-xl">
                      <strong className="text-orange-300">초기 세팅값의 근거:</strong><br />
                      이메일+전화가 모두 있는 연락처는 데이터 완성도가 높아 즉시 접근 가능한 양질의 리드입니다. 연락처 정보가 없으면 실제 섭외 시도 자체가 어렵습니다.
                    </span>
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <span>MAX 20pt</span>
                  {editingSection === 'contact' ? (
                    <button
                      onClick={() => handleSave('contact')}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs border border-emerald-500 rounded-lg px-2 py-1 hover:bg-emerald-950"
                    >
                      <Check className="w-3 h-3" />
                      <span className="font-semibold">수정완료</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingSection('contact')}
                      className="text-gray-400 hover:text-[#E8470A] transition-colors flex items-center gap-1 text-xs border border-gray-600 rounded-lg px-2 py-1 hover:border-[#E8470A] hover:bg-[#2A1A10]"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span className="font-semibold">가중치 편집</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <ScoringLine
                  label="이메일 보유"
                  pts={contactWeights.emailOnly}
                  max={20}
                  isEditing={editingSection === 'contact'}
                  onPtsChange={(val) => setContactWeights({ ...contactWeights, emailOnly: val })}
                />
                <ScoringLine
                  label="전화번호 보유"
                  pts={contactWeights.phoneOnly}
                  max={20}
                  isEditing={editingSection === 'contact'}
                  onPtsChange={(val) => setContactWeights({ ...contactWeights, phoneOnly: val })}
                />
              </div>
            </div>

            {/* 직함 */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 shadow-md">
              <div className="text-xs font-extrabold text-[#E8470A] uppercase tracking-wider mb-3 flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  👤 직함
                  <span className="relative group/tip">
                    <Info className="w-3 h-3 text-gray-500 cursor-help" />
                    <span className="pointer-events-none absolute left-0 top-full mt-1.5 z-50 hidden group-hover/tip:block w-64 bg-gray-900 text-white text-[11px] leading-relaxed rounded-lg p-3 shadow-xl">
                      <strong className="text-orange-300">초기 세팅값의 근거:</strong><br />
                      대표·CEO 등 의사결정권자는 최종 수락까지 단계가 짧아 높은 점수를 부여합니다. 실무 담당자는 내부 검토가 필요해 리드타임이 길어집니다.
                    </span>
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <span>MAX 35pt</span>
                  {editingSection === 'title' ? (
                    <button
                      onClick={() => handleSave('title')}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs border border-emerald-500 rounded-lg px-2 py-1 hover:bg-emerald-950"
                    >
                      <Check className="w-3 h-3" />
                      <span className="font-semibold">수정완료</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingSection('title')}
                      className="text-gray-400 hover:text-[#E8470A] transition-colors flex items-center gap-1 text-xs border border-gray-600 rounded-lg px-2 py-1 hover:border-[#E8470A] hover:bg-[#2A1A10]"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span className="font-semibold">가중치 편집</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <ScoringLine 
                  label="대표 / CEO / Founder" 
                  pts={titleWeights.ceo} 
                  max={35}
                  isEditing={editingSection === 'title'}
                  onPtsChange={(val) => setTitleWeights({ ...titleWeights, ceo: val })}
                />
                <ScoringLine 
                  label="이사 / Director / Manager" 
                  pts={titleWeights.director} 
                  max={35}
                  isEditing={editingSection === 'title'}
                  onPtsChange={(val) => setTitleWeights({ ...titleWeights, director: val })}
                />
                <ScoringLine 
                  label="담당 / Specialist" 
                  pts={titleWeights.specialist} 
                  max={35}
                  isEditing={editingSection === 'title'}
                  onPtsChange={(val) => setTitleWeights({ ...titleWeights, specialist: val })}
                />
                <ScoringLine 
                  label="기타" 
                  pts={titleWeights.other} 
                  max={35}
                  isEditing={editingSection === 'title'}
                  onPtsChange={(val) => setTitleWeights({ ...titleWeights, other: val })}
                />
              </div>
            </div>

            {/* 업종 - 모든 업종 표시 */}
            <div className="bg-[#1A1A1A] rounded-lg p-4 shadow-md">
              <div className="text-xs font-extrabold text-[#E8470A] uppercase tracking-wider mb-3 flex justify-between items-center">
                <span>🏢 업종</span>
                <div className="flex items-center gap-2">
                  <span>MAX 45pt</span>
                  {editingSection === 'industry' ? (
                    <button
                      onClick={() => handleSave('industry')}
                      className="text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-xs border border-emerald-500 rounded-lg px-2 py-1 hover:bg-emerald-950"
                    >
                      <Check className="w-3 h-3" />
                      <span className="font-semibold">수정완료</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingSection('industry')}
                      className="text-gray-400 hover:text-[#E8470A] transition-colors flex items-center gap-1 text-xs border border-gray-600 rounded-lg px-2 py-1 hover:border-[#E8470A] hover:bg-[#2A1A10]"
                    >
                      <Settings2 className="w-3 h-3" />
                      <span className="font-semibold">가중치 편집</span>
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                  <ScoringLine 
                    key={key}
                    label={label} 
                    pts={industryWeightsEdited[key as keyof typeof industryWeightsEdited]} 
                    max={45}
                    isEditing={editingSection === 'industry'}
                    onPtsChange={(val) => setIndustryWeightsEdited({ ...industryWeightsEdited, [key]: val })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScoringLine({ label, pts, max, isEditing, onPtsChange }: { label: string; pts: number; max: number; isEditing?: boolean; onPtsChange?: (val: number) => void }) {
  const percentage = (pts / max) * 100;
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-[#2e2e2e] last:border-b-0">
      <span className="text-xs text-gray-300 flex-1">{label}</span>
      {isEditing && onPtsChange ? (
        <input
          type="range"
          min="0"
          max={max}
          value={pts}
          onChange={(e) => onPtsChange(Number(e.target.value))}
          className="w-20 h-1.5 bg-[#333] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#E8470A] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#E8470A] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #E8470A 0%, #E8470A ${percentage}%, #333 ${percentage}%, #333 100%)`
          }}
        />
      ) : (
        <div className="w-20 h-1.5 bg-[#333] rounded-full overflow-hidden">
          <div className="h-full bg-[#E8470A] rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
        </div>
      )}
      {isEditing && onPtsChange ? (
        <input
          type="number"
          min="0"
          max={max}
          value={pts}
          onChange={(e) => onPtsChange(Number(e.target.value))}
          className="text-xs font-bold text-[#E8470A] min-w-9 text-right w-12 bg-[#2A2A2A] border border-[#444] rounded px-1 py-0.5 focus:outline-none focus:border-[#E8470A]"
        />
      ) : (
        <span className="text-xs font-bold text-[#E8470A] min-w-9 text-right">+{pts}</span>
      )}
    </div>
  );
}