import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { SHOW_WEIGHTS, DEFAULT_SHOW_WEIGHTS, INDUSTRY_LABELS } from '../lib/data';
import { IndustryWeights } from '../lib/types';
import { RotateCcw, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  selectedEvent: string;
  onClose: () => void;
  onSave: () => void;
}

export function WeightEditorModal({ selectedEvent, onClose, onSave }: Props) {
  const [weights, setWeights] = useState<IndustryWeights>(SHOW_WEIGHTS[selectedEvent]);

  useEffect(() => {
    setWeights(SHOW_WEIGHTS[selectedEvent]);
  }, [selectedEvent]);

  const handleWeightChange = (key: keyof IndustryWeights, value: number) => {
    setWeights({ ...weights, [key]: value });
  };

  const handleReset = () => {
    setWeights(DEFAULT_SHOW_WEIGHTS[selectedEvent]);
    toast.info('기본값으로 초기화되었습니다');
  };

  const handleSave = () => {
    SHOW_WEIGHTS[selectedEvent] = weights;
    localStorage.setItem('show_weights', JSON.stringify(SHOW_WEIGHTS));
    toast.success('가중치가 저장되었습니다', { description: '점수가 재계산됩니다' });
    onSave();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">업종 가중치 편집</DialogTitle>
          <DialogDescription className="text-sm">전시별 업종 중요도를 0–50점 사이에서 직접 설정하세요</DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-3">🏢 업종 가중치</div>
          {(Object.keys(INDUSTRY_LABELS) as Array<keyof IndustryWeights>).map((key) => (
            <div key={key} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-b-0">
              <Label className="text-sm text-gray-700 font-semibold w-36 flex-shrink-0">{INDUSTRY_LABELS[key]}</Label>
              <div className="flex-1 flex items-center gap-3">
                <Slider
                  value={[weights[key]]}
                  onValueChange={(vals) => handleWeightChange(key, vals[0])}
                  min={0}
                  max={50}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={weights[key]}
                  onChange={(e) => handleWeightChange(key, parseInt(e.target.value) || 0)}
                  min={0}
                  max={50}
                  className="w-16 text-sm text-center font-bold text-[#E8470A] border-[#E8470A33]"
                />
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="text-sm shadow-sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            기본값으로
          </Button>
          <Button onClick={handleSave} className="text-sm font-bold bg-[#E8470A] hover:bg-[#D93F09] shadow-sm">
            <Save className="w-3.5 h-3.5 mr-1.5" />
            저장 및 재산정
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}