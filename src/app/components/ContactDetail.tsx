import { useState, useMemo, useEffect } from 'react';
import { Contact } from '../lib/types';
import { classifyContact } from '../lib/scoring';
import { TYPE_COLORS, FLAGS, SHOWS, SHOW_GROUPS, SHOW_WEIGHTS } from '../lib/data';
import { Mail, Globe, Phone, MousePointerClick, TrendingUp, User, Building2, Crosshair, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// ── 업종 라벨 ──────────────────────────────────────────────────────────────
const INDUSTRY_LABELS: Record<string, string> = {
  pet: '반려동물·펫', trade: '유통·무역', health: '헬스케어', beauty: '뷰티·코스메틱',
  it: 'IT·기술', media: '미디어·언론', food: '식품·농업', edu: '교육·연구',
  mfg: '제조', camping: '캠핑·아웃도어', coffee: '커피·디저트', baby: '영유아',
  interior: '인테리어·리빙', construction: '건축·건설', handmade: '핸드메이드·공예',
  defense: '방위산업', environment: '환경·에너지', mechanical: '기계·설비',
  surface: '표면처리·소재', vr: 'VR·AR', hotel: '호텔·관광',
  security: '보안·안전', special: '특산물·지역', other: '기타',
};

// ── 업종 기본 WHY (분야 무관 공통 근거) ────────────────────────────────────
const INDUSTRY_DEFAULT_WHY: Record<string, string> = {
  media:       '언론·방송·콘텐츠 종사자 → 모든 전시에서 공식 미디어 파트너·취재 초청 협업 가능',
  trade:       '유통·무역업체 → 전시 출품사 제품의 국내외 판로 확대 바이어로 연결 가능',
  edu:         '교육·연구기관 → 전시 내 세미나 연사 또는 협력 프로그램 연계 가능',
  it:          'IT·기술 기업 → 전시 운영 솔루션·스마트 장비·디지털 전환 협업 가능',
  health:      '헬스케어 기업 → 전시 제품·서비스의 건강·의료 연계 수요 발굴 가능',
  beauty:      '뷰티·미용 기업 → 전시 관람객 라이프스타일 관심층과 연결 가능',
  food:        '식음료·농업 기업 → 전시 내 F&B 부대 행사 또는 연계 상품 협업 가능',
  mfg:         '제조업체 → OEM·부품 공급 및 전시 장비·인프라 협력 가능',
  hotel:       '호텔·관광 기업 → 전시 참가자 숙박·이벤트 연계 협력 가능',
  security:    '보안·안전 기업 → 전시 장내 보안 시스템 및 안전 솔루션 협력 가능',
  environment: '환경·에너지 기업 → 전시 친환경 운영 및 지속가능성 파트너 연계 가능',
  mechanical:  '기계·설비 기업 → 전시 시설·장비 인프라 공급 협력 가능',
  vr:          'VR·AR 기업 → 전시 체험 부스·홍보 콘텐츠 디지털화 협력 가능',
  defense:     '방위·방산 기업 → 이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  surface:     '표면처리·소재 기업 → 이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  special:     '지역특산물·로컬푸드 기업 → 전시 현장 이벤트 및 부대 행사 연계 가능',
  other:       '전시 주제와 직접 관련성이 낮은 업종',
};

// ── 분야×업종 특화 WHY ─────────────────────────────────────────────────────
const SHOW_IND_WHY: Record<string, Record<string, string>> = {
  cat_pet: {
    pet:          '반려동물 용품·서비스 브랜드 — 이 전시의 핵심 출품 타겟',
    trade:        '반려동물 제품 국내외 유통·수출입 바이어 발굴 가능',
    beauty:       '펫 미용·그루밍 용품 및 케어 제품 브랜드 협업 가능',
    health:       '동물병원·수의 헬스케어 협력사 및 사료·영양제 브랜드',
    edu:          '반려동물 훈련·교육 기관 및 수의학 연구소 참관 연계',
    media:        '반려동물 전문 미디어·인플루언서 취재 및 협찬 협업',
    it:           '펫 IoT·스마트 기기·앱 서비스 기업 출품 가능',
    food:         '반려동물 간식·사료·기능성 식품 브랜드 참가 가능',
    handmade:     '펫 수제 용품·악세서리 크리에이터 직접 출품 가능',
    camping:      '반려동물 동반 아웃도어·캠핑 용품 브랜드 수요 있음',
    mfg:          '펫 용품 OEM 제조사·부품 공급업체 B2B 협력 가능',
    special:      '지역 특산 반려동물 간식·수제 먹거리 브랜드 참가 가능',
    coffee:       '반려동물 동반 카페 콘셉트 브랜드 및 펫 카페 운영사',
    baby:         '반려동물·아기 함께 키우는 가정 대상 복합 제품 가능성',
    hotel:        '펫 동반 숙박·여행 서비스 업체 협업 가능',
    environment:  '친환경 반려동물 용품·생분해 패키지 브랜드 참가 가능',
    interior:     '반려동물 전용 가구·홈인테리어 제품 브랜드 참가 가능',
    construction: '반려동물 친화 시공·공간 설계 업체 협력 가능',
    mechanical:   '펫 용품 생산 기계·설비 공급업체 — 연관성 낮음',
    surface:      '펫 케어 소재·코팅 관련 기업 — 연관성 낮음',
    vr:           '반려동물 AR 체험·앱 서비스 기업 체험 부스 가능',
    security:     '반려동물 GPS·모니터링 기기 기업 일부 참가 가능',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_baby: {
    baby:         '분유·완구·육아 브랜드 — 영유아 전시 핵심 출품 타겟',
    health:       '임산부·신생아 헬스케어 및 이유식·유기농 식품 브랜드',
    beauty:       '유아 스킨케어·무자극 화장품·세정 브랜드 출품 가능',
    edu:          '영유아 교육·발달 교구·유아 영어 기관 참가 가능',
    food:         '유기농 이유식·유아 간식·수입 식품 브랜드 출품 가능',
    trade:        '해외 영유아 제품 수입 바이어 및 국내 유통사 발굴',
    handmade:     '수제 유아용품·패브릭 장난감 크리에이터 출품 가능',
    media:        '육아 전문 미디어·맘 인플루언서 취재 및 협찬 협업',
    it:           '스마트 유아 모니터·육아 앱·에듀테크 서비스 기업',
    vr:           '유아 교육용 AR 콘텐츠·체험 기기 기업 참가 가능',
    interior:     '유아방 인테리어·아동 가구 브랜드 출품 가능',
    coffee:       '수유 카페·키즈 카페 운영사 협업 및 홍보 가능',
    environment:  '친환경 유아용품·생분해 기저귀·세제 브랜드 참가 가능',
    pet:          '반려동물·아기 함께 키우는 가정 복합 솔루션 가능성',
    special:      '지역 유기농 이유식·로컬푸드 브랜드 참가 가능',
    hotel:        '영유아 동반 숙박·여행 패키지 업체 협업 가능',
    mfg:          '유아용품 OEM 제조사·부품 공급업체 B2B 가능',
    camping:      '유아 동반 아웃도어·캠핑 제품 기업 일부 참가 가능',
    construction: '어린이집·유치원 시설 설계·시공 업체 — 연관성 낮음',
    mechanical:   '유아용품 생산 기계·설비 — 연관성 낮음',
    surface:      '유아용 안전 소재·코팅 관련 기업 — 연관성 낮음',
    security:     '유아 안전 모니터링·GPS 기기 기업 일부 참가 가능',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_coffee: {
    coffee:       '카페·로스터리·바리스타 장비 브랜드 — 핵심 출품 타겟',
    food:         '식음료·원료 납품사 및 베이커리·디저트 제조사 연결',
    trade:        '원두·식재료 수입 바이어 및 카페 프랜차이즈 유통사',
    hotel:        '호텔 카페·F&B 운영 브랜드 협업 및 공급 연계 가능',
    special:      '지역 특산 원두·로컬푸드 음료 브랜드 출품 가능',
    health:       '건강 음료·기능성 성분 커피·웰니스 음료 브랜드',
    media:        '푸드·카페 전문 미디어·SNS 인플루언서 협업 가능',
    handmade:     '수제 디저트·아트 케이크·공예 음료 크리에이터 출품 가능',
    it:           '카페 관리 POS·스마트 주문 시스템·로봇 바리스타 기업',
    camping:      '캠핑용 커피 장비·야외 카페 브랜드 참가 가능',
    beauty:       '음료 브랜딩·패키지 디자인 기업 협업 가능',
    edu:          '바리스타 자격증 학원·커피 교육 기관 참가 가능',
    mfg:          '음료 제조 설비·포장재 공급업체 B2B 가능',
    pet:          '반려동물 동반 카페 콘셉트 브랜드 참가 가능성 있음',
    baby:         '어린이용 음료·무카페인 음료 브랜드 일부 가능',
    environment:  '친환경 포장재·컵·빨대 기업 출품 가능',
    interior:     '카페 인테리어·가구·조명 브랜드 출품 가능',
    vr:           '카페 체험 AR·인터랙티브 콘텐츠 기업 가능',
    mechanical:   '카페 장비·제빙기·에스프레소 머신 제조사 B2B 가능',
    construction: '카페 시공·인테리어 전문 업체 — 연관성 낮음',
    surface:      '카페 바 소재·코팅 관련 기업 — 연관성 낮음',
    security:     '카페 보안 시스템·CCTV 기업 — 연관성 낮음',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_farm: {
    food:         '농산물·식품 가공사 — 이 전시의 핵심 출품 타겟',
    it:           '스마트팜·농업 IoT·드론 방제 기술 기업 출품 가능',
    mfg:          '농기계·수확 장비·시설 인프라 공급업체',
    trade:        '농수산물 수출입 바이어 및 국내외 유통사 발굴',
    coffee:       '커피·차·음료용 농산물 원료 공급사 참가 가능',
    special:      '지역 특산물·향토 식품 브랜드 직접 출품 가능',
    edu:          '농업 연구기관·대학 스마트팜 연구소 참관 연계',
    health:       '기능성 식품·건강 농산물·유기농 영양제 브랜드',
    environment:  '친환경 농법·토양 개선·수처리 솔루션 기업 참가',
    mechanical:   '농업용 기계·설비·관개 시스템 공급업체',
    media:        '농업·식품 전문 미디어 취재 및 협업 가능',
    pet:          '반려동물 먹거리·사료 원료 농산물 공급사 가능',
    baby:         '유기농 이유식 원료·친환경 아동 식품 브랜드 일부 가능',
    beauty:       '농산물 기반 내추럴 화장품·식물성 원료 브랜드 일부',
    vr:           '스마트팜 AR 시뮬레이션·교육 콘텐츠 기업 가능',
    hotel:        '농촌 체험 관광·팜스테이 업체 협업 가능',
    construction: '농업 시설 건축·온실 시공 업체 일부 참가 가능',
    surface:      '농업 소재·코팅 관련 기업 — 연관성 낮음',
    handmade:     '수제 농산물·전통 발효식품 크리에이터 참가 가능',
    camping:      '글램핑·농촌 아웃도어 체험 업체 일부 참가 가능',
    security:     '농장 보안·모니터링 시스템 기업 — 연관성 낮음',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    interior:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_camp: {
    camping:      '텐트·장비·아웃도어 의류 브랜드 — 핵심 출품 타겟',
    trade:        '아웃도어 장비 해외 수입·유통 바이어 발굴 가능',
    food:         '캠핑 식품·레토르트·야외 요리 도구 브랜드 출품 가능',
    mfg:          '아웃도어 장비 OEM 제조사·소재 공급업체 B2B 가능',
    pet:          '반려동물 동반 캠핑 트렌드 — 펫 아웃도어 용품 수요 높음',
    it:           '스마트 캠핑 기기·IoT 랜턴·앱 서비스 기업 출품 가능',
    media:        '아웃도어·캠핑 전문 미디어·유튜버 취재 협업 가능',
    special:      '지역 특산물·캠핑 현장 식품 브랜드 참가 가능',
    environment:  '친환경 캠핑 용품·생분해 소재·ESG 아웃도어 브랜드',
    health:       '아웃도어 건강·스포츠 뉴트리션·응급처치 키트 브랜드',
    handmade:     '수제 캠핑 용품·DIY 아웃도어 크리에이터 출품 가능',
    beauty:       '아웃도어 선케어·캠핑 피부 관리 제품 브랜드 일부',
    edu:          '아웃도어 활동·서바이벌 교육 기관 참가 가능',
    hotel:        '글램핑·캠핑장 운영사 홍보·협업 가능',
    coffee:       '캠핑용 커피·드립 장비·야외 음료 브랜드 참가 가능',
    baby:         '유아 동반 캠핑 용품·유아용 아웃도어 브랜드 일부 가능',
    vr:           '아웃도어 AR 내비·트레일 안내 앱 기업 일부 가능',
    interior:     '캠핑 공간 디자인·가구·조명 브랜드 — 연관성 낮음',
    construction: '캠핑장 시설 시공·설치 업체 — 연관성 낮음',
    mechanical:   '캠핑 장비 생산 기계 — 연관성 낮음',
    surface:      '아웃도어 소재·코팅 관련 기업 — 연관성 낮음',
    security:     '캠핑장 보안·CCTV 시스템 기업 — 연관성 낮음',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_build: {
    construction: '건축자재·시공사 — 이 전시의 핵심 B2B 파트너',
    interior:     '인테리어·홈데코·가구 브랜드 핵심 출품 타겟',
    mechanical:   '건설 현장 기계·설비·HVAC 공급업체 핵심 타겟',
    surface:      '표면처리·타일·석재·코팅 소재 기업 핵심 출품 타겟',
    mfg:          '건자재 OEM 제조사·부품 공급업체 B2B 가능',
    environment:  '친환경 건자재·단열재·에너지 절약 솔루션 기업',
    it:           '스마트홈·빌딩 자동화·건설 IT 솔루션 기업',
    trade:        '건자재·설비 해외 수입 바이어 및 국내 유통사',
    security:     '빌딩 보안·스마트 도어록·CCTV 시스템 기업',
    media:        '건축·인테리어 전문 미디어 취재 및 협업 가능',
    edu:          '건축·인테리어 설계 교육기관·연구소 참관 및 협력 연계',
    hotel:        '호텔 인테리어·시공 전문 업체 협업 가능',
    vr:           'AR 건축 설계·가상 인테리어 솔루션 기업 체험 부스 가능',
    health:       '병원·의료 시설 인테리어·시공 전문 업체 일부 가능',
    beauty:       '욕실 인테리어·화장실 제품 브랜드 일부 가능',
    handmade:     '수제 가구·공예 인테리어 크리에이터 일부 참가 가능',
    camping:      '글램핑 시설 설치·아웃도어 구조물 업체 일부 가능',
    coffee:       '카페 인테리어·시공 전문 업체 일부 참가 가능',
    food:         '주방 설계·인테리어 연계 식음료 업체 — 연관성 낮음',
    pet:          '반려동물 친화 인테리어 시공 업체 — 연관성 낮음',
    baby:         '어린이·유아 시설 인테리어 업체 — 연관성 낮음',
    special:      '지역 특산 건자재·로컬 소재 기업 — 연관성 낮음',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_culture: {
    handmade:     '공예·일러스트·아트 크리에이터 — 핵심 직접 출품 대상',
    beauty:       '뷰티·미용 브랜드 — 뷰티썸 포함 핵심 출품 타겟',
    trade:        '공예품·아트 상품·뷰티 제품 유통·판매 채널 확보 가능',
    media:        '예술·라이프스타일·뷰티 전문 미디어·인플루언서 협업',
    health:       '더마·뷰티 헬스케어 기반 스킨케어 브랜드 참가 가능',
    edu:          '미술·디자인 교육 기관·공예 학원 참관 및 협력 연계',
    it:           'AI 아트·디지털 크리에이티브 툴 기업 체험 부스 가능',
    food:         '아트 카페·디저트·식음료 연계 브랜드 참가 가능',
    hotel:        '아트 호텔·문화 공간 협업 및 홍보 가능',
    vr:           'VR·AR 예술 체험·디지털 아트 플랫폼 기업 출품 가능',
    special:      '지역 공예·향토 아트 브랜드 직접 출품 가능',
    pet:          '반려동물 아트 콜라보·펫 일러스트 브랜드 일부 가능',
    coffee:       '아트 카페·핸드드립 콘셉트 커피 브랜드 참가 가능',
    interior:     '아트 인테리어·홈데코 브랜드 출품 가능',
    mfg:          '공예 재료·소재 공급업체 B2B 가능',
    baby:         '유아용 아트 교구·그림책·공예 키트 브랜드 가능',
    environment:  '친환경 아트 소재·리사이클 공예 브랜드 참가 가능',
    camping:      '아웃도어 아트·자연 소재 공예 브랜드 일부 가능',
    construction: '아트 시공·조각 설치 전문 업체 — 연관성 낮음',
    mechanical:   '공예 기계·레이저 커팅기 업체 — 연관성 낮음',
    surface:      '아트 도장·코팅 소재 기업 — 연관성 낮음',
    security:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_health: {
    health:       '의료기기·헬스테크 솔루션 기업 — 핵심 전시 출품 타겟',
    it:           '병원 IT 시스템·디지털 헬스·EMR 솔루션 공급업체',
    trade:        '의료기기 해외 수출입 바이어 및 국내 유통·납품사',
    mfg:          '의료기기 OEM·부품 제조사 B2B 파트너 발굴 가능',
    media:        '의료·헬스케어 전문 미디어 취재 및 협업 가능',
    edu:          '의과대학·연구소·의료 교육기관 세미나 참가 가능',
    beauty:       '더마·메디컬 스킨케어·병원 코스메틱 브랜드 출품 가능',
    environment:  '의료 폐기물 처리·친환경 병원 솔루션 기업 가능',
    food:         '건강기능식품·의료 영양·처방 식단 브랜드 출품 가능',
    security:     '병원 보안·출입 통제·환자 모니터링 시스템 기업',
    mechanical:   '의료 설비·수술실 장비·멸균 기기 공급업체',
    vr:           '의료 VR 교육·수술 시뮬레이션·재활 AR 기업',
    hotel:        '의료 관광·헬스 리조트·웰니스 숙박 업체 협업 가능',
    interior:     '병원·의원 인테리어·의료 공간 설계 전문 업체',
    baby:         '영유아 의료기기·신생아 케어 장비 브랜드 일부 가능',
    construction: '병원·의료 시설 건축·시공 전문 업체 일부 가능',
    pet:          '동물 의료기기·수의 헬스케어 기업 일부 참가 가능',
    surface:      '의료 소재·코팅·멸균 소재 기업 일부 가능',
    coffee:       '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    camping:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    handmade:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    special:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_it: {
    it:           'AI·ICT 솔루션·스타트업 — 핵심 전시 출품 타겟',
    vr:           'VR·AR·메타버스 기술 기업 — 체험 부스 직접 출품 대상',
    media:        '디지털 미디어·테크 콘텐츠·유튜브 채널 협업 가능',
    trade:        'IT 솔루션 해외 수출 바이어 및 국내 총판·유통사',
    mfg:          'IT 하드웨어·IoT 기기 OEM 제조사 B2B 가능',
    edu:          'AI·코딩·IT 교육기관·대학 연구소 참관 및 협력 연계',
    health:       '디지털 헬스·의료 AI·헬스케어 IT 솔루션 기업',
    security:     '사이버 보안·네트워크 보안 솔루션 기업 출품 가능',
    mechanical:   '스마트 팩토리·산업용 로봇·자동화 기계 기업',
    environment:  '그린 IT·데이터센터 에너지 효율·친환경 솔루션',
    hotel:        '호텔 IT 시스템·스마트 호스피탈리티 솔루션 기업',
    food:         '푸드테크·스마트 키친 솔루션 기업 출품 가능',
    interior:     '스마트홈·빌딩 자동화·IoT 인테리어 솔루션 기업',
    construction: '건설 IT·BIM·드론 측량 솔루션 기업 참가 가능',
    beauty:       '뷰티테크·AI 피부 분석·스마트 화장품 기기 기업',
    baby:         '스마트 유아 모니터·에듀테크·육아 앱 기업 가능',
    pet:          '펫 IoT·반려동물 스마트 기기·앱 서비스 기업 가능',
    coffee:       '카페 자동화·로봇 바리스타·스마트 주문 시스템 기업',
    defense:      '국방 IT·드론·AI 감시 시스템 기업 일부 참가 가능',
    camping:      '스마트 캠핑 기기·아웃도어 GPS 앱 기업 일부 가능',
    surface:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    handmade:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    special:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_eco: {
    environment:  '친환경·재생에너지 솔루션 기업 — 핵심 전시 출품 타겟',
    it:           '스마트 에너지·그린테크·탄소 모니터링 IT 솔루션',
    mfg:          '친환경 제조공정·저탄소 소재·그린 OEM 기업',
    mechanical:   '에너지 설비·열관리·친환경 기계 공급업체',
    trade:        '친환경 제품 해외 수출입 바이어 및 그린 유통사',
    construction: '친환경 건자재·제로에너지 건축 시공 업체',
    surface:      '친환경 코팅·고기능 소재·재활용 소재 기업',
    edu:          'ESG·환경 연구기관·대학 연구소 참관 및 협력 연계',
    security:     '환경 모니터링·재난 안전 시스템 기업',
    media:        '환경·ESG 전문 미디어 취재 및 홍보 협업 가능',
    health:       '수처리·공기 정화·웰빙 환경 솔루션 기업 가능',
    food:         '친환경 포장재·바이오 식품 용기 기업 출품 가능',
    interior:     '친환경 인테리어 소재·지속가능 가구 브랜드 가능',
    vr:           '가상 환경 체험·탄소중립 AR 교육 콘텐츠 기업',
    hotel:        '친환경 숙박·그린 호텔 운영 업체 협업 가능',
    special:      '지역 친환경 특산물·로컬 에코 브랜드 참가 가능',
    camping:      '친환경 캠핑 용품·생분해 아웃도어 소재 브랜드',
    baby:         '친환경 유아용품·생분해 기저귀 브랜드 일부 가능',
    beauty:       '천연·친환경 화장품·제로웨이스트 뷰티 브랜드 가능',
    handmade:     '업사이클링 공예·리사이클 아트 크리에이터 출품 가능',
    pet:          '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    coffee:       '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    defense:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
  cat_def: {
    defense:      '방산·군사 장비·무기 체계 기업 — 핵심 전시 출품 타겟',
    security:     '보안·방범·사이버 보안 솔루션 — B2B 직접 연결 대상',
    it:           '국방 IT·드론·AI 감시 시스템·C4I 솔루션 공급업체',
    mfg:          '방산 부품·장비 OEM 제조사 B2B 파트너 발굴 가능',
    mechanical:   '군사 기계·특수 설비·무기 체계 제조 장비 기업',
    trade:        '방산 장비 해외 수출입 바이어 및 공급망 유통사',
    surface:      '방탄·특수 코팅·고강도 소재 기업 출품 가능',
    environment:  '군사 환경 모니터링·오염 정화 솔루션 기업 일부',
    edu:          '국방 연구소·대학 방위산업학과 참관 및 협력 연계',
    health:       '군 의료·응급처치·의무 장비 기업 출품 가능',
    media:        '방위산업·국방 전문 미디어 취재 협업 가능',
    vr:           '군사 훈련 시뮬레이션·VR 전술 교육 시스템 기업',
    construction: '군사 시설·벙커·특수 구조물 건설 업체 일부 가능',
    hotel:        '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    pet:          '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    baby:         '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    beauty:       '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    food:         '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    coffee:       '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    camping:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    interior:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    handmade:     '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
    special:      '이 전시 분야와 직접 연관성 낮아 최소 가중치 부여',
  },
};

function getBreakdownWhy(label: string, catKey: string, indKey: string): string {
  if (label.startsWith('직함')) {
    if (/대표|CEO/.test(label)) return '의사결정권자 — 최종 수락까지 단계가 짧아 가장 높은 점수를 부여합니다';
    if (/이사|Manager/.test(label)) return '중간관리자 — 내부 검토 후 결정하는 역할로 일정 리드타임이 있습니다';
    if (/담당|Specialist/.test(label)) return '실무 담당자 — 상위 결재가 필요해 리드타임이 더 길어집니다';
    return '직함 정보가 명확하지 않아 기본 점수를 부여합니다';
  }
  if (label.startsWith('업종')) {
    return indKey ? getIndWhy(catKey, indKey) : '';
  }
  if (label.startsWith('연락처')) {
    if (label.includes('+')) return '이메일+전화 모두 보유 — 즉시 접근 가능한 양질의 리드입니다';
    if (/이메일/.test(label)) return '이메일만 보유 — 온라인 초청은 가능하나 전화 확인이 어렵습니다';
    if (/전화/.test(label)) return '전화만 보유 — 문자·통화는 가능하나 이메일 발송이 어렵습니다';
    return '연락처 정보 없음 — 실제 섭외 시도 자체가 어렵습니다';
  }
  return '';
}

function getIndWhy(catKey: string, indKey: string): string {
  return (
    SHOW_IND_WHY[catKey]?.[indKey] ??
    INDUSTRY_DEFAULT_WHY[indKey] ??
    '이 전시 분야와 직접 연관성이 낮아 최소 가중치 부여'
  );
}

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  contact: Contact | null;
  selectedEvent: string;
  contacts: Contact[];
  scoreVersion?: number;
}

export function ContactDetail({ contact, selectedEvent, contacts, scoreVersion }: Props) {
  const [localSeries, setLocalSeries] = useState('');

  useEffect(() => {
    if (selectedEvent.startsWith('cat_')) {
      const g = SHOW_GROUPS.find(gr => gr.key === selectedEvent);
      const first = g?.shows.find(k => SHOWS[k]) ?? '';
      setLocalSeries(first);
    }
  }, [selectedEvent]);

  const effectiveEventId = selectedEvent.startsWith('cat_') ? localSeries : selectedEvent;
  void effectiveEventId;

  const classifyResult = useMemo(() => {
    if (!contact) return null;
    return classifyContact(contact, selectedEvent);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, selectedEvent, scoreVersion]);

  // 선택 분야 라벨
  const selectedEventLabel = useMemo(() => {
    const group = SHOW_GROUPS.find(g => g.key === selectedEvent);
    if (group) return `${group.emoji} ${group.label}`;
    const show = SHOWS[selectedEvent as keyof typeof SHOWS];
    return show ? `${show.emoji} ${show.name.replace(/\s*\d{4}$/, '')}` : selectedEvent;
  }, [selectedEvent]);

  // 분야 카테고리 키 (개별 전시 → parent cat, 분야 → 직접)
  const catKey = useMemo(() => {
    if (selectedEvent.startsWith('cat_')) return selectedEvent;
    return SHOW_GROUPS.find(g => g.shows.includes(selectedEvent))?.key ?? '';
  }, [selectedEvent]);

  // 업종 가중치 정렬
  const industryPolicy = useMemo(() => {
    const w = SHOW_WEIGHTS[selectedEvent] || {};
    return Object.entries(w)
      .filter(([k]) => k !== 'other')
      .map(([k, v]) => ({ key: k, label: INDUSTRY_LABELS[k] || k, pts: v as number }))
      .sort((a, b) => b.pts - a.pts)
      .filter(i => i.pts > 0);
  }, [selectedEvent]);

  // 점수 분포 (10점 구간)
  const scoreData = useMemo(() => {
    const buckets = Array.from({ length: 10 }, (_, i) => ({ range: `${i * 10}`, count: 0 }));
    contacts.forEach(c => {
      const r = classifyContact(c, selectedEvent);
      buckets[Math.min(9, Math.floor(r.score / 10))].count++;
    });
    return buckets;
  }, [contacts, selectedEvent]);

  const [showMoreInd, setShowMoreInd] = useState(false);
  const [openSection, setOpenSection] = useState<'breakdown' | 'purpose' | 'compare' | null>('breakdown');
  const [isEmptyAtBottom, setIsEmptyAtBottom] = useState(false);

  useEffect(() => {
    setOpenSection('breakdown');
  }, [contact?.id]);

  // 분야별 점수 비교 — early return 전에 위치해야 훅 규칙 준수
  const showScores = useMemo(() => {
    if (!contact) return [];
    return SHOW_GROUPS.map(group => ({
      key: group.key,
      name: group.label,
      emoji: group.emoji,
      score: classifyContact(contact, group.key).score,
    })).sort((a, b) => b.score - a.score);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact, scoreVersion]);

  // ── 빈 상태 ──────────────────────────────────────────────────────────────
  if (!contact || !classifyResult) {
    return (
      <div
        className="flex-1 overflow-y-auto bg-gray-50 relative"
        onScroll={e => {
          const el = e.currentTarget;
          setIsEmptyAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 20);
        }}
      >
        <div className="space-y-4 max-w-3xl mx-auto pb-8">

          {/* 1) 온보딩 — 박스 없음 */}
          <div className="py-10 px-5 text-center">
            <MousePointerClick className="w-12 h-12 text-orange-300 mx-auto mb-4" />
            <div className="text-2xl font-bold text-gray-700 mb-2">좌측 목록에서 연락처를 선택하세요</div>
            <div className="text-base text-gray-400 mb-6">선택하면 분야별 적합도 분석을 확인합니다</div>
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm text-amber-700 rounded-full font-medium">
              TIP &nbsp;↑↓ 화살표 키로 빠르게 탐색할 수 있습니다
            </span>
          </div>

          {/* 2) 점수 분포 차트 */}
          <div className="mx-5 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-500">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-bold text-gray-700">등록된 연락처 점수 분포</span>
              </div>
              <div className="text-sm text-gray-400">{selectedEventLabel}</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={scoreData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 14, fill: '#9CA3AF' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ fontSize: 16, borderRadius: 8, border: '1px solid #e5e7eb', padding: '4px 10px' }}
                  formatter={(v: number) => [`${v}명`, '인원']}
                  labelFormatter={(l) => `${l}~${Number(l) + 9}점`}
                  cursor={{ stroke: '#E8470A', strokeWidth: 1, strokeDasharray: '3 3' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#E8470A', strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* 3) 업종 가중치 산출 근거 */}
          <div className="mx-5 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-bold text-gray-700">업종 가중치 산출 근거</span>
              </div>
              <div className="text-sm text-gray-400">{selectedEventLabel}</div>
            </div>
            <div className="space-y-4">
              {industryPolicy.slice(0, 3).map(item => (
                <div key={item.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-gray-800">{item.label}</span>
                    <span className="text-sm font-bold text-[#E8470A]">+{item.pts}pt</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{getIndWhy(catKey, item.key)}</p>
                </div>
              ))}
            </div>
            {industryPolicy.length > 3 && (
              <>
                {showMoreInd && (
                  <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                    {industryPolicy.slice(3).map(item => (
                      <div key={item.key}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-semibold text-gray-600">{item.label}</span>
                          <span className="text-sm font-bold text-gray-400">+{item.pts}pt</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">{getIndWhy(catKey, item.key)}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowMoreInd(v => !v)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  {showMoreInd
                    ? <><ChevronUp className="w-4 h-4" />나머지 {industryPolicy.length - 3}개 업종 접기</>
                    : <><ChevronDown className="w-4 h-4" />나머지 {industryPolicy.length - 3}개 업종 근거 보기</>
                  }
                </button>
              </>
            )}
          </div>

          {/* 5) 영업 유형 분류 기준 */}
          <div className="mx-5 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 text-gray-500">
              <Crosshair className="w-5 h-5" />
              <span className="text-sm font-bold text-gray-700">영업 유형 분류 기준</span>
            </div>
            <div className="text-sm text-gray-400 mb-3">명함의 <strong className="text-gray-600">업종·직함·회사명</strong> 키워드로 자동 판별</div>
            <div className="space-y-3">
              {([
                { type: '부스', criteria: '자사 제품·서비스를 현장에서 직접 전시하고 바이어·관람객과 대면 영업 가능한 기업.', keywords: '업종: 반려동물·식품·의료·IT·화장품·제조 등. 아래 세 조건 외 사업체 기본값.' },
                { type: '바이어', criteria: '전시 출품사의 제품을 구매·유통할 목적으로 참가하는 바이어·유통사.', keywords: '업종: 유통·무역·수입·수출·도매  /  직함: buyer·purchasing·구매' },
                { type: '미디어', criteria: '전시를 취재·홍보하거나 콘텐츠를 제작하는 미디어 파트너.', keywords: '업종: 미디어·언론·방송·잡지·콘텐츠  /  직함: 기자·에디터·PD·유튜버' },
                { type: '', criteria: '영리 목적이 아닌 비영리·기관 성격. 연사 초청·협력기관·후원 방향으로 접근.', keywords: '업종·회사명: 협회·학회·연구소·대학·병원·공공기관·재단' },
              ] as const).map(item => (
                <div
                  key={item.type || 'inst'}
                  className="rounded-lg p-3 border"
                  style={{ background: TYPE_COLORS[item.type]?.bg, borderColor: TYPE_COLORS[item.type]?.border }}
                >
                  <div className="font-bold text-sm mb-1" style={{ color: TYPE_COLORS[item.type]?.text }}>
                    {TYPE_COLORS[item.type]?.label}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{item.criteria}</p>
                  <p className="text-sm text-gray-400">{item.keywords}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

          {/* 스크롤 유도 */}
          <div
            className="pointer-events-none absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-gray-200/80 to-transparent flex items-end justify-center pb-2 transition-opacity duration-300"
            style={{ opacity: isEmptyAtBottom ? 0 : 1 }}
          >
            <ChevronDown className="w-7 h-7 text-gray-400 animate-bounce" />
          </div>
      </div>
    );
  }

  // ── 선택된 연락처 화면 ────────────────────────────────────────────────────
  const gradeBg =
    classifyResult.grade === 'high'
      ? 'bg-emerald-50 border-emerald-200'
      : classifyResult.grade === 'mid'
      ? 'bg-amber-50 border-amber-200'
      : 'bg-red-50 border-red-200';
  const gradeText =
    classifyResult.grade === 'high' ? 'text-emerald-700' : classifyResult.grade === 'mid' ? 'text-amber-700' : 'text-red-700';
  const maxPts = Math.max(...classifyResult.breakdown.map(b => Math.abs(b.pts)), 1);

  // 업종 키 추출 (상세 근거용)
  const contactIndKey = (() => {
    const indItem = classifyResult.breakdown.find(b => b.label.startsWith('업종'));
    if (!indItem) return '';
    return Object.entries(INDUSTRY_LABELS).find(([, lbl]) => indItem.label.includes(lbl))?.[0] ?? '';
  })();

  // 이니셜 아바타 색상 (이름 기반)
  const avatarColor = (() => {
    const colors = ['bg-orange-100 text-orange-600','bg-emerald-100 text-emerald-600','bg-sky-100 text-sky-600','bg-violet-100 text-violet-600','bg-amber-100 text-amber-600'];
    const idx = (contact.name.charCodeAt(0) || 0) % colors.length;
    return colors[idx];
  })();
  const initials = contact.name.slice(0,2).toUpperCase();

  return (
    <div className="flex-1 overflow-hidden bg-gray-100">
      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-5 h-full items-stretch">

        {/* LEFT: 연락처 정보 */}
        <div className="w-full md:w-[38%] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          {/* 이미지 / 아바타 영역 */}
          <div className="flex-1 min-h-[180px] flex items-center justify-center bg-gray-50 border-b border-gray-100">
            {contact.image_url ? (
              <img
                src={contact.image_url}
                alt={contact.name}
                className="w-full h-full object-contain bg-gray-50"
                style={{ maxHeight: 480 }}
              />
            ) : (
              <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black ${avatarColor}`}>
                {initials}
              </div>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="p-5 space-y-1">
            <h2 className="font-bold text-2xl text-gray-800 leading-tight">{contact.name}</h2>
            {contact.company && <div className="text-base text-gray-600">{contact.company}</div>}
            {contact.title && <div className="text-sm text-gray-400">{contact.title}</div>}
            {contact.industry && (
              <div className="inline-block text-sm bg-gray-100 text-gray-500 rounded-full px-2 py-0.5 mt-1">{contact.industry}</div>
            )}
            {contact.country && (
              <div className="text-base text-gray-500 flex items-center gap-1.5 pt-1">
                {FLAGS[contact.country] || '🌍'} {contact.country}
              </div>
            )}
          </div>

          {/* 연락처 */}
          <div className="px-5 pb-5 space-y-2 border-t border-gray-100 pt-4">
            {contact.email && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.email!);
                  toast.success('이메일 주소가 복사되었습니다', { description: contact.email });
                }}
                className="w-full text-left text-base text-gray-600 flex items-center gap-2 hover:text-[#E8470A] hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{contact.email}</span>
              </button>
            )}
            {contact.phone && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(contact.phone!);
                  toast.success('전화번호가 복사되었습니다', { description: contact.phone });
                }}
                className="w-full text-left text-base text-gray-600 flex items-center gap-2 hover:text-[#E8470A] hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{contact.phone}</span>
              </button>
            )}
            {contact.website && (
              <a
                href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-gray-600 flex items-center gap-2 hover:text-[#E8470A] hover:bg-orange-50 px-2 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{contact.website}</span>
              </a>
            )}
            {contact.note && (
              <div className="border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 mt-2">
                <span className="text-sm font-bold text-gray-500">메모</span>
                <p className="text-base text-gray-600 mt-1">{contact.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: 적합도 분석 */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div className={`flex-1 min-h-0 flex flex-col border-[1.5px] rounded-xl overflow-hidden shadow-sm ${gradeBg}`}>
            <div className="px-4 py-2.5 flex justify-between items-center gap-3">
              <div className="min-w-0">
                <span className={`font-bold text-xl ${gradeText}`}>
                  {classifyResult.grade === 'high' ? '높은 적합도' : classifyResult.grade === 'mid' ? '보통 적합도' : '낮은 적합도'}
                </span>
                <span className="text-sm opacity-60 ml-2 whitespace-nowrap">
                  {classifyResult.grade === 'high' ? '우선 섭외 대상' : classifyResult.grade === 'mid' ? '관심 타겟' : '낮은 우선순위'}
                </span>
              </div>
              <div className={`text-3xl font-black leading-none flex-shrink-0 ${gradeText}`}>
                {classifyResult.score}<span className="text-sm font-normal opacity-70 ml-1">pt</span>
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-white border-t divide-y divide-gray-100">

              {/* ── 섹션 1: 채점 근거 ── */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setOpenSection(o => o === 'breakdown' ? null : 'breakdown')}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-[#E8470A] flex-shrink-0" />
                    <span className="text-base font-bold text-gray-700">채점 근거</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${openSection === 'breakdown' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'breakdown' && (
                  <div className="px-4 py-4 space-y-3 bg-gray-50">
                    {classifyResult.breakdown.filter(item => item.label !== '100pt 상한 적용').map((item, idx) => {
                      const why = getBreakdownWhy(item.label, catKey, contactIndKey);
                      return (
                        <div key={idx} className="bg-white rounded-lg border border-gray-100 px-3 py-2.5">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-base text-gray-600">{item.label}</span>
                            <span className={`text-base font-bold ${item.pts >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                              {item.pts > 0 ? '+' : ''}{item.pts}pt
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full mb-1.5">
                            <div
                              className={`h-2 rounded-full ${item.pts >= 0 ? 'bg-emerald-500' : 'bg-red-400'}`}
                              style={{ width: `${(Math.abs(item.pts) / maxPts) * 100}%` }}
                            />
                          </div>
                          {why && <p className="text-sm text-gray-400 leading-relaxed">{why}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── 섹션 2: 추천 영업 목적 ── */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => setOpenSection(o => o === 'purpose' ? null : 'purpose')}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1 h-4 rounded-full bg-[#E8470A] flex-shrink-0" />
                    <span className="text-base font-bold text-gray-700 flex-shrink-0">추천 영업 목적</span>
                    {openSection !== 'purpose' && (
                      <span
                        className="ml-1 text-sm font-bold px-2 py-0.5 rounded-md border truncate"
                        style={{
                          background: TYPE_COLORS[classifyResult.suggestedType]?.bg || '#F9FAFB',
                          color: TYPE_COLORS[classifyResult.suggestedType]?.text || '#6B7280',
                          borderColor: TYPE_COLORS[classifyResult.suggestedType]?.border || '#E5E7EB',
                        }}
                      >
                        {TYPE_COLORS[classifyResult.suggestedType]?.label || '🏛 기관'}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${openSection === 'purpose' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'purpose' && (
                  <div className="px-4 py-4 bg-gray-50">
                    <div
                      className="rounded-lg p-3 border shadow-sm"
                      style={{
                        background: TYPE_COLORS[classifyResult.suggestedType]?.bg || '#F9FAFB',
                        borderColor: TYPE_COLORS[classifyResult.suggestedType]?.border || '#E5E7EB',
                      }}
                    >
                      <div className="font-bold text-xl" style={{ color: TYPE_COLORS[classifyResult.suggestedType]?.text || '#6B7280' }}>
                        {TYPE_COLORS[classifyResult.suggestedType]?.label || '🏛 기관'}
                      </div>
                      <p className="text-base mt-1 opacity-80 leading-relaxed">{classifyResult.typeReason}</p>
                      {contactIndKey && catKey && (
                        <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100 leading-relaxed">
                          {getIndWhy(catKey, contactIndKey)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ── 섹션 3: 분야별 적합도 비교 ── */}
              <div className={openSection === 'compare' ? 'flex-1 flex flex-col overflow-hidden min-h-0' : 'flex-shrink-0'}>
                <button
                  onClick={() => setOpenSection(o => o === 'compare' ? null : 'compare')}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors flex-shrink-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-[#E8470A] flex-shrink-0" />
                    <span className="text-base font-bold text-gray-700">분야별 적합도 비교</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${openSection === 'compare' ? 'rotate-180' : ''}`} />
                </button>
                {openSection === 'compare' && (
                  <div className="relative flex-1 min-h-0 bg-gray-100">
                  <div className="absolute inset-0 overflow-y-auto overscroll-contain px-4 py-4 space-y-2.5">
                    {showScores.map(item => {
                      const isCurrent = item.key === catKey;
                      const barColor = item.score >= 70 ? 'bg-emerald-500' : item.score >= 40 ? 'bg-amber-400' : 'bg-red-400';
                      return (
                        <div key={item.key} className={`rounded-lg px-3 py-2 ${isCurrent ? 'bg-orange-50 ring-1 ring-[#E8470A]/30' : 'bg-gray-50'}`}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-sm font-medium truncate max-w-[70%] ${isCurrent ? 'text-[#E8470A]' : 'text-gray-600'}`}>
                              {item.emoji} {item.name}
                            </span>
                            <span className={`text-sm font-bold ml-2 flex-shrink-0 ${isCurrent ? 'text-[#E8470A]' : 'text-gray-500'}`}>
                              {item.score}pt
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full">
                            <div
                              className={`h-2 rounded-full transition-all ${barColor}`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pointer-events-none absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent" />
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
