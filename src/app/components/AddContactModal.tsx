import { useState } from 'react';
import { Contact } from '../lib/types';
import { classifyContact } from '../lib/scoring';
import { TYPE_COLORS } from '../lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles } from 'lucide-react';

interface Props {
  selectedEvent: string;
  onClose: () => void;
  onAdd: (contact: Omit<Contact, 'id'>) => void;
}

export function AddContactModal({ selectedEvent, onClose, onAdd }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    title: '',
    email: '',
    phone: '',
    country: '한국',
    industry: '반려동물/펫케어',
    lang: '한국어',
    note: '',
  });

  const [analyzed, setAnalyzed] = useState(false);
  const [classifyResult, setClassifyResult] = useState<ReturnType<typeof classifyContact> | null>(null);
  const [selectedType, setSelectedType] = useState<'' | '부스' | '바이어' | '미디어'>('');

  const canAnalyze = formData.name && formData.company;

  const handleAnalyze = () => {
    const tempContact: Contact = {
      id: 0,
      name: formData.name,
      company: formData.company,
      company_en: formData.company,
      title: formData.title,
      title_en: formData.title,
      email: formData.email,
      phone: formData.phone,
      lang: formData.lang,
      country: formData.country,
      industry: formData.industry,
      type: '부스',
      score: 0,
      note: formData.note,
    };

    const result = classifyContact(tempContact, selectedEvent);
    setClassifyResult(result);
    setSelectedType(result.suggestedType);
    setAnalyzed(true);
  };

  const handleAdd = () => {
    if (!analyzed || !selectedType) return;

    const newContact: Omit<Contact, 'id'> = {
      name: formData.name,
      company: formData.company,
      company_en: formData.company,
      title: formData.title,
      title_en: formData.title,
      email: formData.email,
      phone: formData.phone,
      lang: formData.lang,
      country: formData.country,
      industry: formData.industry,
      type: selectedType,
      score: classifyResult?.score || 0,
      note: formData.note,
    };

    onAdd(newContact);
    onClose();
  };

  const gradeColor =
    classifyResult?.grade === 'high' ? 'bg-emerald-500' : classifyResult?.grade === 'mid' ? 'bg-amber-500' : 'bg-red-500';
  const gradeBg =
    classifyResult?.grade === 'high'
      ? 'bg-emerald-50 border-emerald-200'
      : classifyResult?.grade === 'mid'
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200';
  const gradeText =
    classifyResult?.grade === 'high'
      ? 'text-emerald-700'
      : classifyResult?.grade === 'mid'
      ? 'text-amber-700'
      : 'text-red-700';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">✏️ 신규 연락처 등록</DialogTitle>
          <DialogDescription className="text-sm">정보 입력 후 영업 적합도 분석을 실행해 보세요</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-4">
          <div>
            <Label htmlFor="name" className="text-xs font-bold text-gray-600">
              이름 *
            </Label>
            <Input
              id="name"
              placeholder="홍길동 (Hong Gil Dong)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="company" className="text-xs font-bold text-gray-600">
              회사명 *
            </Label>
            <Input
              id="company"
              placeholder="(주)펫브랜드"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-xs font-bold text-gray-600">
              직함
            </Label>
            <Input
              id="title"
              placeholder="대표이사 / CEO"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-xs font-bold text-gray-600">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-xs font-bold text-gray-600">
              전화번호
            </Label>
            <Input
              id="phone"
              placeholder="010-0000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="country" className="text-xs font-bold text-gray-600">
              국가
            </Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="한국">한국</SelectItem>
                <SelectItem value="중국">중국</SelectItem>
                <SelectItem value="일본">일본</SelectItem>
                <SelectItem value="대만">대만</SelectItem>
                <SelectItem value="태국">태국</SelectItem>
                <SelectItem value="베트남">베트남</SelectItem>
                <SelectItem value="인도네시아">인도네시아</SelectItem>
                <SelectItem value="필리핀">필리핀</SelectItem>
                <SelectItem value="싱가포르">싱가포르</SelectItem>
                <SelectItem value="홍콩">홍콩</SelectItem>
                <SelectItem value="미국">미국</SelectItem>
                <SelectItem value="유럽/기타">유럽/기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="industry" className="text-xs font-bold text-gray-600">
              업종
            </Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="반려동물/펫케어">반려동물/펫케어</SelectItem>
                <SelectItem value="유통/무역">유통/무역</SelectItem>
                <SelectItem value="IT/기술">IT/기술</SelectItem>
                <SelectItem value="미디어/언론">미디어/언론</SelectItem>
                <SelectItem value="제약/의료">제약/의료</SelectItem>
                <SelectItem value="화장품">화장품</SelectItem>
                <SelectItem value="전시/이벤트">전시/이벤트</SelectItem>
                <SelectItem value="물류/로직스">물류/로직스</SelectItem>
                <SelectItem value="식품/F&B">식품/F&B</SelectItem>
                <SelectItem value="교육/연구">교육/연구</SelectItem>
                <SelectItem value="제조업/포장재">제조업/포장재</SelectItem>
                <SelectItem value="관광/숙박">관광/숙박</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="lang" className="text-xs font-bold text-gray-600">
              언어
            </Label>
            <Select value={formData.lang} onValueChange={(value) => setFormData({ ...formData, lang: value })}>
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="한국어">한국어</SelectItem>
                <SelectItem value="영어">영어</SelectItem>
                <SelectItem value="중국어">중국어</SelectItem>
                <SelectItem value="일본어">일본어</SelectItem>
                <SelectItem value="한국어/영어">한국어/영어</SelectItem>
                <SelectItem value="영어/중국어">영어/중국어</SelectItem>
                <SelectItem value="영어/일본어">영어/일본어</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="note" className="text-xs font-bold text-gray-600">
            특이사항 (선택)
          </Label>
          <Input
            id="note"
            placeholder="예: 일본 바이어 네트워크 보유, 동결건조 제품 관심 등"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="mt-1 text-sm"
          />
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`w-full font-bold text-base mb-4 shadow-sm hover:shadow-md ${ 
            canAnalyze ? 'bg-[#1A1A1A] hover:bg-[#E8470A]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          🔍 영업 적합도 분석
        </Button>

        {analyzed && classifyResult && (
          <>
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3 text-sm text-gray-700 shadow-sm">
              <span className="text-base flex-shrink-0">✨</span>
              <span>
                <strong className="text-orange-700">가장 적합한 영업 목적을 추천해 드렸어요!</strong>
                <br />
                원하시는 목적으로 변경도 가능합니다.
              </span>
            </div>

            <div className={`border-[1.5px] rounded-lg overflow-hidden mb-4 shadow-sm ${gradeBg}`}>
              <div className="p-3 flex justify-between items-center">
                <div>
                  <div className={`font-bold text-base ${gradeText}`}>
                    {classifyResult.grade === 'high'
                      ? '🔥 높은 적합도'
                      : classifyResult.grade === 'mid'
                      ? '⚡ 보통 적합도'
                      : '❌ 낮은 적합도'}
                  </div>
                  <div className="text-xs mt-1 opacity-80">
                    {classifyResult.reasons.slice(0, 2).map((r, i) => (
                      <span key={i}>
                        {r}
                        {i < 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-black leading-none ${gradeText}`}>{classifyResult.score}</div>
                  <div className="text-xs opacity-70">/ 100pt</div>
                </div>
              </div>

              <div className="bg-white p-3 border-t">
                <div className="text-xs font-bold text-gray-500 mb-2">추천 영업 목적</div>
                <div
                  className="rounded-lg p-3 border shadow-sm"
                  style={{
                    background: TYPE_COLORS[classifyResult.suggestedType]?.bg || '#F9FAFB',
                    borderColor: TYPE_COLORS[classifyResult.suggestedType]?.border || '#E5E7EB',
                  }}
                >
                  <div className="font-bold text-sm" style={{ color: TYPE_COLORS[classifyResult.suggestedType]?.text || '#6B7280' }}>
                    {TYPE_COLORS[classifyResult.suggestedType]?.label || '🏛 기관 — 특별 접근'}
                  </div>
                  <div className="text-xs mt-1 opacity-80">{classifyResult.typeReason}</div>
                </div>

                <div className="mt-3">
                  <div className="text-xs font-bold text-gray-500 mb-2">영업 목적 선택</div>
                  <div className="flex gap-2">
                    {(['부스', '바이어', '미디어'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex-1 px-3 py-2 rounded-lg border-[1.5px] text-sm transition-all shadow-sm ${ 
                          selectedType === type
                            ? 'border-[#4338CA] bg-indigo-50 text-[#4338CA] font-bold'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {TYPE_COLORS[type].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="text-sm shadow-sm">
            취소
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!analyzed || !selectedType}
            className={`text-sm font-bold shadow-sm ${ 
              analyzed && selectedType ? 'bg-[#E8470A] hover:bg-[#D93F09]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            등록
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}