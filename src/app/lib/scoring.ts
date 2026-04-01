import { Contact, ClassifyResult } from './types';
import { SHOW_WEIGHTS, TITLE_WEIGHTS, CONTACT_WEIGHTS, GRADE_THRESHOLDS } from './data';

export function classifyContact(contact: Contact, eventId: string): ClassifyResult {
  let score = 0;
  const reasons: string[] = [];
  const breakdown: { label: string; pts: number }[] = [];

  const t = `${contact.title || ''} ${contact.title_en || ''}`.toLowerCase();
  const ind = (contact.industry || '').toLowerCase();
  const co = `${contact.company || ''} ${contact.company_en || ''}`.toLowerCase();

  // 직함
  let titlePts = 0;
  let titleLabel = '';
  if (/대표|ceo|사장|회장|president|founder|owner|representative/.test(t)) {
    titlePts = TITLE_WEIGHTS.ceo;
    titleLabel = '직함 — 대표/CEO';
    reasons.push('의사결정권자');
  } else if (/이사|director|manager|본부장|부장|팀장|head|officer/.test(t)) {
    titlePts = TITLE_WEIGHTS.director;
    titleLabel = '직함 — 이사/Manager';
    reasons.push('중간관리자');
  } else if (/담당|coordinator|executive|specialist|lecturer|professor/.test(t)) {
    titlePts = TITLE_WEIGHTS.specialist;
    titleLabel = '직함 — 담당/Specialist';
    reasons.push('실무 담당자');
  } else {
    titlePts = TITLE_WEIGHTS.other;
    titleLabel = '직함 — 기타';
  }
  score += titlePts;
  breakdown.push({ label: titleLabel, pts: titlePts });

  // 업종
  const w = SHOW_WEIGHTS[eventId] || SHOW_WEIGHTS.megazoo;
  let indPts = 0;
  let indLabel = '';

  if (/반려동물|펫|pet/.test(ind)) {
    indPts = w.pet;
    indLabel = '업종 — 반려동물·펫';
    reasons.push('핵심 타겟 업종');
  } else if (/유통|무역|distribution|trade|import|export|wholesale/.test(ind)) {
    indPts = w.trade;
    indLabel = '업종 — 유통·무역';
    reasons.push('유통/무역 업종');
  } else if (/의료|헬스|health|pharma|수의|bio|바이오/.test(ind)) {
    indPts = w.health;
    indLabel = '업종 — 헬스케어';
    reasons.push('헬스케어 관련');
  } else if (/화장품|코스메틱|cosmet|beauty|미용|패션/.test(ind)) {
    indPts = w.beauty;
    indLabel = '업종 — 뷰티·코스메틱';
    reasons.push('뷰티/코스메틱');
  } else if (/it|기술|tech|통신|robot|로봇|ai|digital/.test(ind)) {
    indPts = w.it;
    indLabel = '업종 — IT·기술';
    reasons.push('IT/기술 업종');
  } else if (/미디어|언론|media|광고|방송/.test(ind)) {
    indPts = w.media;
    indLabel = '업종 — 미디어·언론';
    reasons.push('미디어 업종');
  } else if (/식품|food|건강|영양|농업|축산|farm/.test(ind)) {
    indPts = w.food;
    indLabel = '업종 — 식품·농업';
    reasons.push('식품/농업 관련');
  } else if (/교육|연구|research|university/.test(ind)) {
    indPts = w.edu;
    indLabel = '업종 — 교육·연구';
    reasons.push('교육/연구');
  } else if (/제조|manufact|건설|construction/.test(ind)) {
    indPts = w.mfg;
    indLabel = '업종 — 제조·건설';
    reasons.push('제조/건설업');
  } else if (/캠핑|아웃도어|camping|outdoor|등산|트레킹|hiking/.test(ind) || /캠핑|아웃도어|camping|outdoor/.test(co)) {
    indPts = w.camping || 0;
    indLabel = '업종 — 캠핑·아웃도어';
    reasons.push('캠핑/아웃도어');
  } else if (/커피|coffee|카페|cafe|로스터|roaster|바리스타|barista|디저트|dessert/.test(ind)) {
    indPts = w.coffee || 0;
    indLabel = '업종 — 커피·디저트';
    reasons.push('커피/카페/디저트');
  } else if (/영유아|베이비|유아|baby|infant|kids|어린이|육아/.test(ind)) {
    indPts = w.baby || 0;
    indLabel = '업종 — 영유아';
    reasons.push('영유아/베이비');
  } else if (/인테리어|interior|리빙|living|가구|furniture|홈데코/.test(ind)) {
    indPts = w.interior || 0;
    indLabel = '업종 — 인테리어·리빙';
    reasons.push('인테리어/리빙');
  } else if (/건축|건설|construction|architect|시공|토목|부동산/.test(ind)) {
    indPts = w.construction || 0;
    indLabel = '업종 — 건축·건설';
    reasons.push('건축/건설');
  } else if (/핸드메이드|handmade|공예|craft|아트|art|일러스트|illustr/.test(ind)) {
    indPts = w.handmade || 0;
    indLabel = '업종 — 핸드메이드·공예';
    reasons.push('핸드메이드/공예');
  } else if (/방위|defense|무기|weapon|군사|military|방산/.test(ind)) {
    indPts = w.defense || 0;
    indLabel = '업종 — 방위산업';
    reasons.push('방위산업');
  } else if (/환경|environment|에너지|energy|친환경|esg|green|위생|hygiene|청소/.test(ind)) {
    indPts = w.environment || 0;
    indLabel = '업종 — 환경·에너지';
    reasons.push('환경/에너지');
  } else if (/기계|설비|mechanical|machine|장비|equipment/.test(ind)) {
    indPts = w.mechanical || 0;
    indLabel = '업종 — 기계·설비';
    reasons.push('기계/설비');
  } else if (/표면처리|코팅|coating|소재|material|타일|tile|석재|stone/.test(ind)) {
    indPts = w.surface || 0;
    indLabel = '업종 — 표면처리·소재';
    reasons.push('표면처리/소재');
  } else if (/vr|ar|메타버스|metaverse|xr|확장현실/.test(ind)) {
    indPts = w.vr || 0;
    indLabel = '업종 — VR·AR·메타버스';
    reasons.push('VR/AR/메타버스');
  } else if (/호텔|hotel|숙박|hospitality|여행|travel|관광/.test(ind)) {
    indPts = w.hotel || 0;
    indLabel = '업종 — 호텔·관광';
    reasons.push('호텔/관광');
  } else if (/보안|security|방범|치안|안전|safety|소방/.test(ind)) {
    indPts = w.security || 0;
    indLabel = '업종 — 보안·안전';
    reasons.push('보안/안전');
  } else if (/특산물|special|지역|regional|향토/.test(ind)) {
    indPts = w.special || 0;
    indLabel = '업종 — 특산물·지역';
    reasons.push('특산물/지역');
  } else if (/전시|이벤트|expo|fair/.test(ind)) {
    indPts = 12;
    indLabel = '업종 — 전시·이벤트';
    reasons.push('전시/이벤트');
  } else {
    indPts = w.other;
    indLabel = '업종 — 기타';
    reasons.push('관련도 낮은 업종');
  }
  score += indPts;
  breakdown.push({ label: indLabel, pts: indPts });

  // 연락처
  let contPts = 0;
  let contLabel = '';
  if (contact.email && contact.phone) {
    contPts = CONTACT_WEIGHTS.both;
    contLabel = '연락처 — 이메일+전화';
    reasons.push('이메일+전화 보유');
  } else if (contact.email) {
    contPts = CONTACT_WEIGHTS.emailOnly;
    contLabel = '연락처 — 이메일만';
    reasons.push('이메일 보유');
  } else if (contact.phone) {
    contPts = CONTACT_WEIGHTS.phoneOnly;
    contLabel = '연락처 — 전화만';
    reasons.push('전화번호 보유');
  }
  if (contPts) {
    score += contPts;
    breakdown.push({ label: contLabel, pts: contPts });
  }

  // 100pt 상한
  const rawScore = score;
  if (rawScore > 100) {
    breakdown.push({ label: '100pt 상한 적용', pts: -(rawScore - 100) });
    score = 100;
  }

  const grade = score >= GRADE_THRESHOLDS.high ? 'high' : score >= GRADE_THRESHOLDS.low ? 'mid' : 'low';

  // 영업 목적 판정
  let suggestedType: '' | '부스' | '바이어' | '미디어' = '부스';
  let typeReason = '제품/서비스 직접 전시 → 부스 참가로 바이어·관람객과 대면 영업';

  const orgInd = /협회|학회|연구소|재단|대학|병원|의원|공공|기관|정부|association|hospital|university|research|foundation|institute/.test(ind);
  const orgCo = /협회|학회|연구소|재단|대학|병원|의원|공공|기관|정부|association|hospital|university|research|foundation|institute/.test(co);

  if (orgInd || orgCo) {
    suggestedType = '';
    const oSrc = ind + ' ' + co;
    if (/협회|학회|association/.test(oSrc)) {
      typeReason = '세미나 연사 또는 공식 협력기관 섭외 고려. 바이어 가능성은 대화 중 파악 권장.';
    } else if (/병원|의원|hospital/.test(oSrc)) {
      typeReason = '제품 구매 기관으로 바이어 가능성 문의 또는 세미나 연사 제안 고려.';
    } else if (/연구소|연구|research/.test(oSrc)) {
      typeReason = '세미나 연사 또는 전시 참관 초청 고려. 공동 연구·발표 제안도 가능.';
    } else if (/대학|university/.test(oSrc)) {
      typeReason = '세미나 연사 또는 참관 초청 고려.';
    } else if (/재단|공공|정부|기관|foundation|institute/.test(oSrc)) {
      typeReason = '공식 후원기관 또는 협력기관 섭외 고려.';
    } else {
      typeReason = '비영리·기관 성격 — 참관, 연사, 협력기관 방향으로 접근 고려.';
    }
  } else if (
    /미디어|언론|방송|잡지|magazine|media|influencer|content/.test(ind) ||
    /기자|에디터|pd|reporter|journalist|editor|influencer|blogger|유튜버|youtuber|writer|작가/.test(t)
  ) {
    suggestedType = '미디어';
    typeReason = '언론·콘텐츠 관련 종사자 → 공식 미디어 파트너 또는 취재 초청 협력 적합';
  } else if (
    /유통|무역|수입|수출|도매|trade|distribution|import|export|wholesale/.test(ind) ||
    /buyer|purchasing|sourcing|구매|바이어/.test(t)
  ) {
    suggestedType = '바이어';
    typeReason = '유통·무역 업종 또는 구매 담당 → 한국 제품 매입·해외 유통 목적의 바이어 가능성';
  } else {
    if (/식품|food|건강|영양|농업|farm/.test(ind)) {
      typeReason = '식품·원료 전시 및 바이어 유치 → 부스 참가 적합';
    } else if (/it|기술|tech|robot|ai|digital/.test(ind)) {
      typeReason = '솔루션·서비스 시연 및 비즈매칭 → 부스 참가 적합';
    } else if (/반려동물|펫|pet/.test(ind)) {
      typeReason = '반려동물 제품·서비스 전시 → 부스 참가 적합';
    } else if (/의료|헬스|health|바이오|bio/.test(ind)) {
      typeReason = '헬스케어 제품·솔루션 전시 → 부스 참가 적합';
    } else if (/화장품|뷰티|beauty|cosmet/.test(ind)) {
      typeReason = '뷰티·코스메틱 제품 전시 → 부스 참가 적합';
    } else if (/제조|manufact/.test(ind)) {
      typeReason = '자사 제품 직접 전시 → 부스 참가로 바이어·관람객과 대면 영업';
    }
  }

  return { score, grade, reasons, breakdown, suggestedType, typeReason };
}
