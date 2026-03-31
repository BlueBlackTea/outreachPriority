import { Contact, EmailContent } from './types';
import { SHOWS, FLAGS, SHOW_GROUPS } from './data';

// ── 날짜 형식 변환: "03.06(금)–03.08(일)" → "Mar 6–8 (Fri–Sun)" ──────────
function toIntlDate(d: string): string {
  const MONTHS = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DAYS: Record<string, string> = {월:'Mon',화:'Tue',수:'Wed',목:'Thu',금:'Fri',토:'Sat',일:'Sun'};
  const m = d.match(/^(\d{2})\.(\d{2})\(([가-힣]+)\)\s*[–-]\s*(\d{2})\.(\d{2})\(([가-힣]+)\)$/);
  if (!m) return d;
  const [,mo1,d1,w1,mo2,d2,w2] = m;
  const from = `${MONTHS[+mo1]} ${+d1}`;
  const to   = mo1 === mo2 ? `${+d2}` : `${MONTHS[+mo2]} ${+d2}`;
  return `${from}–${to} (${DAYS[w1] ?? w1}–${DAYS[w2] ?? w2})`;
}

// ── 장소명 한글 → 영문 변환 ─────────────────────────────────────────────────
function toIntlVenue(v: string): string {
  if (!v || v === '미정') return 'TBD';
  return v
    .replace(/수원메쎄/g, 'Suwon Messe')
    .replace(/송도컨벤시아/g, 'Songdo Convensia')
    .replace(/aT센터/g, 'aT Center')
    .replace(/대전컨벤션센터/g, 'Daejeon Convention Center')
    .replace(/청주오스코/g, 'OSCO Cheongju')
    .replace(/수원컨벤션센터/g, 'Suwon Convention Center')
    .replace(/,\s*서울/g, ', Seoul')
    .replace(/,\s*부산/g, ', Busan')
    .replace(/,\s*대구/g, ', Daegu')
    .replace(/,\s*인천/g, ', Incheon')
    .replace(/\s*서울$/g, ', Seoul')
    .replace(/\s*부산$/g, ', Busan')
    .replace(/\s*대구$/g, ', Daegu')
    .replace(/^인천$/g, 'Incheon')
    .replace(/^광주$/g, 'Gwangju')
    .replace(/^대전$/g, 'Daejeon')
    .replace(/^수원$/g, 'Suwon')
    .replace(/^송도$/g, 'Songdo')
    .replace(/^마곡$/g, 'Magok')
    .replace(/^오송$/g, 'Osong')
    .replace(/^충청$/g, 'Chungcheong')
    .replace(/^제주$/g, 'Jeju')
    .replace(/^서울$/g, 'Seoul')
    .replace(/^부산$/g, 'Busan')
    .replace(/^대구$/g, 'Daegu')
    .replace(/^인도$/g, 'India')
    .replace(/미정/g, 'TBD')
    .trim();
}

export function generateEmail(
  contact: Contact,
  purpose: '부스' | '바이어' | '미디어' | '',
  eventId: string,
  seasonKey: string,
  langOverride: string
): EmailContent {
  if (eventId.startsWith('cat_')) {
    const g = SHOW_GROUPS.find(g => g.key === eventId);
    const label = g ? `${g.emoji} ${g.label}` : '해당 분야';
    return {
      subject: '특정 전시를 먼저 선택해 주세요',
      body: `${label} 분야가 선택된 상태입니다.\n특정 전시를 선택하면 이메일을 생성할 수 있습니다.\n\n위 전시 목록 또는 드롭다운에서 전시를 선택해 주세요.`,
    };
  }

  const ev = SHOWS[eventId];
  if (!ev) return { subject: '전시를 선택해 주세요', body: '유효한 전시를 선택하면 이메일이 생성됩니다.' };
  const s = ev.seasons.find((x) => x.key === seasonKey) || ev.seasons[0];
  const sL = s.label;

  // 언어 감지
  let lang = langOverride;
  if (lang === 'auto') {
    const contactLang = contact.lang || '';
    if (contactLang.includes('한국어')) lang = '한국어';
    else if (contactLang.includes('중국어')) lang = '中文';
    else if (contactLang.includes('일본어')) lang = '日本語';
    else lang = 'English';
  }

  const isKo = lang === '한국어';
  const isCn = lang === '中文';
  const isJp = lang === '日本語';

  // 비한국어 이메일에 사용할 전시명·일정·장소
  const evName    = (!isKo && ev.name_en) ? ev.name_en : ev.name;
  const evDates   = isKo ? s.dates  : toIntlDate(s.dates);
  const evVenue   = isKo ? s.venue  : toIntlVenue(s.venue);
  const showVenue = evVenue && evVenue !== '미정' && evVenue !== 'TBD';

  const flag = FLAGS[contact.country] || '🌏';
  const nm = contact.name || '';
  const dname = nm.includes('(') ? (isKo || isJp ? nm.split('(')[0].trim() : (nm.match(/\(([^)]+)\)/) || [, ''])[1] || nm) : nm;
  const hon = isKo ? (/대표|CEO|회장|Founder|President|Director|General Manager/.test(contact.title || '') ? '대표님' : '님') : '';

  const greeting = isKo
    ? `안녕하세요, ${dname} ${hon},`
    : isJp
    ? `${dname} 様\n\nお世話になっております。${evName} 事務局でございます。`
    : isCn
    ? `尊敬的 ${dname} 先生/女士，`
    : `Dear ${dname},`;


  const C = ev.contact;
  const ST = ev.stats;
  const B = ev.booth;

  const hasV = (v: string) => v && v !== '—';

  const IND_EN: Record<string, string> = {
    '반려동물/펫케어': 'pet care',
    '유통/무역':       'distribution & trade',
    'IT/기술':         'IT & technology',
    '미디어/언론':     'media & press',
    '의료/헬스':       'medical & health',
    '화장품':          'cosmetics & beauty',
    '교육/연구':       'education & research',
    '식품/건강':       'food & health',
    '제조업/포장재':   'manufacturing & packaging',
    '캠핑/아웃도어':   'camping & outdoor',
  };
  const isGenericInd = !contact.industry || contact.industry === '기타';
  const indEnWord = IND_EN[contact.industry || ''] || contact.industry || '';
  const indKo = isGenericInd ? '' : `${contact.industry} 분야 `;
  const indJp = isGenericInd ? '' : `${indEnWord} 分野でのご活躍に注目し、`;
  const indEn = isGenericInd ? '' : `your work in the ${indEnWord} space `;

  // 실적 블록
  const statsLinesKo = [
    hasV(ST.visitors2025) && `• 총 방문객: ${ST.visitors2025}명${hasV(ST.growthYoY) ? ` (전년비 ${ST.growthYoY})` : ''}`,
    hasV(ST.overseasVisitors2025) &&
      `• 해외 방문객: ${ST.overseasVisitors2025}명${hasV(ST.countries2025) ? ` (${ST.countries2025}개국)` : ''}${
        hasV(ST.overseasGrowth) ? ` — 전년비 ${ST.overseasGrowth} 급증` : ''
      }`,
    hasV(ST.matchMeetings) && `• 비즈 매칭: ${ST.matchMeetings}건${hasV(ST.consultationUSD) ? ` / 상담액 ${ST.consultationUSD}` : ''}`,
  ].filter(Boolean);
  const statsBlockKo = statsLinesKo.length ? `\n\n📊 ${ev.name} 실적\n${statsLinesKo.join('\n')}` : '';

  const statsLinesJp = [
    hasV(ST.visitors2025) && `• 総来場者：${ST.visitors2025}名${hasV(ST.growthYoY) ? `（前年比${ST.growthYoY}増）` : ''}`,
    hasV(ST.overseasVisitors2025) &&
      `• 海外来場者：${ST.overseasVisitors2025}名${hasV(ST.countries2025) ? `（${ST.countries2025}ヶ国）` : ''}${
        hasV(ST.overseasGrowth) ? ` — 前年比${ST.overseasGrowth}急増` : ''
      }`,
    hasV(ST.matchMeetings) && `• 商談：${ST.matchMeetings}件${hasV(ST.consultationUSD) ? ` / 相談総額：${ST.consultationUSD}` : ''}`,
  ].filter(Boolean);
  const statsBlockJp = statsLinesJp.length ? `\n\n📊 ${evName} 実績\n${statsLinesJp.join('\n')}` : '';

  const statsLinesEn = [
    hasV(ST.visitors2025) && `• Total Visitors: ${ST.visitors2025}${hasV(ST.growthYoY) ? ` (${ST.growthYoY} YoY)` : ''}`,
    hasV(ST.overseasVisitors2025) &&
      `• Overseas: ${ST.overseasVisitors2025} from ${hasV(ST.countries2025) ? ST.countries2025 + ' countries' : 'multiple countries'}${
        hasV(ST.overseasGrowth) ? ` (${ST.overseasGrowth} surge)` : ''
      }`,
    hasV(ST.matchMeetings) && `• Biz-Matching: ${ST.matchMeetings} meetings${hasV(ST.consultationUSD) ? ` | ${ST.consultationUSD}` : ''}`,
  ].filter(Boolean);
  const statsBlockEn = statsLinesEn.length ? `\n\n📊 ${evName} Performance\n${statsLinesEn.join('\n')}` : '';

  const statsLinesCn = [
    hasV(ST.visitors2025) && `• 参观者：${ST.visitors2025}${hasV(ST.growthYoY) ? `（同比${ST.growthYoY}）` : ''}`,
    hasV(ST.overseasVisitors2025) &&
      `• 海外：${ST.overseasVisitors2025}人${hasV(ST.countries2025) ? ` / ${ST.countries2025}国` : ''}${
        hasV(ST.overseasGrowth) ? `，同比+${ST.overseasGrowth}` : ''
      }`,
    hasV(ST.matchMeetings) && `• 商务配对：${ST.matchMeetings}场${hasV(ST.consultationUSD) ? ` / ${ST.consultationUSD}` : ''}`,
  ].filter(Boolean);
  const statsBlockCn = statsLinesCn.length ? `\n\n📊 ${evName} 成绩\n${statsLinesCn.join('\n')}` : '';

  const bizKo = hasV(ST.database)
    ? `\n\n💼 Global Biz-Matching\n${ST.database}건 DB 기반 1:1 사전예약 미팅 (구매/OEM·ODM/유통/수출입 등)`
    : '';
  const bizJp = hasV(ST.database)
    ? `\n\n💼 Biz-Matching\n${ST.database}件DB基盤の1:1事前予約商談（購買/OEM/販売代理/輸出入 等）`
    : '';
  const bizEn = hasV(ST.database) ? `\n\n💼 Biz-Matching\n1:1 pre-scheduled meetings powered by our ${ST.database}-entry buyer database` : '';

  const contactPartsKo = [hasV(C.tel) && `📞 ${C.tel}`, hasV(C.email) && `✉️ ${C.email}`, hasV(C.web) && `🌐 ${C.web}`].filter(Boolean).join('  |  ');
  const contactPartsJp = [hasV(C.tel) && `📞 ${C.tel}`, hasV(C.email) && `✉️ ${C.email}`, hasV(C.web) && `🌐 ${C.web}`].filter(Boolean).join('  |  ');
  const contactPartsEn = [hasV(C.tel) && `📞 ${C.tel}`, hasV(C.email) && `✉️ ${C.email}`, hasV(C.web) && `🌐 ${C.web}`].filter(Boolean).join('  |  ');
  const contactPartsCn = [hasV(C.tel) && `📞 ${C.tel}`, hasV(C.email) && `✉️ ${C.email}`].filter(Boolean).join('  |  ');

  const sigKo = contactPartsKo ? `${ev.name} 사무국\n${contactPartsKo}` : `${ev.name} 사무국`;
  const sigJp = contactPartsJp ? `${evName} 事務局\n${contactPartsJp}` : `${evName} 事務局`;
  const sigEn = contactPartsEn ? `${evName} Organizing Committee\n${contactPartsEn}` : `${evName} Organizing Committee`;
  const sigCn = contactPartsCn ? `${evName} 组委会\n${contactPartsCn}` : `${evName} 组委会`;

  // 날짜/장소 표시 헬퍼
  const dateVenueKo = `• 일정: ${s.dates}${s.venue && s.venue !== '미정' ? `\n• 장소: ${s.venue}` : ''}`;
  const dateVenueJp = `• 会期：${evDates}${showVenue ? `\n• 会場：${evVenue}` : ''}`;
  const dateVenueEn = `• Dates: ${evDates}${showVenue ? `\n• Venue: ${evVenue}` : ''}`;
  const dateVenueCn = `• 日期：${evDates}${showVenue ? `\n• 场地：${evVenue}` : ''}`;

  // ── 부스 ──────────────────────────────────────────────────────────────────
  if (purpose === '부스') {
    if (isJp) {
      return {
        subject: `【${evName} ${sL}】${contact.company} 様 ブース出展のご案内`,
        body: `${greeting}\n\n${indJp}**${evName} ${sL}** へのブース出展参加をご提案申し上げます。\n\n📅 開催概要\n${dateVenueJp}\n• 主催：KPFA　|　主管：MESSE ESANG${statsBlockJp}${bizJp}\n\n💡 ブース出展費用\n• スペースのみ：${B.spaceOnly}　• シェルスキーム：${B.shellScheme}\n\nご検討よろしくお願い申し上げます。${sigJp ? '\n\n'+sigJp : ''}`,
      };
    }
    if (isKo) {
      return {
        subject: `[${ev.name} ${sL}] ${contact.company} 부스 참가 제안`,
        body: `${greeting}\n\n${ev.name} 사무국입니다.\n\n${
          indKo ? `${contact.company}의 ${indKo.trimEnd()}의 활동에 주목하여, ` : ''
        }**${ev.name} ${sL}** 부스 참가를 제안드립니다.\n\n📅 행사 개요\n${dateVenueKo}\n• 주최: KPFA  |  주관: MESSE ESANG${statsBlockKo}${bizKo}\n\n💡 부스 참가 비용 안내\n• Space Only: ${
          B.spaceOnly
        }\n• Shell Scheme: ${B.shellScheme}${sigKo ? '\n\n'+sigKo : ''}`,
      };
    }
    if (isCn) {
      return {
        subject: `[${evName} ${sL}] 诚邀 ${contact.company} 洽谈参展事宜`,
        body: `${greeting}\n\n诚邀贵公司洽谈参加 **${evName} ${sL}** 的展览事宜。\n\n📅 展会概况\n${dateVenueCn}${statsBlockCn}\n\n💡 参展费用\n• Space Only：${B.spaceOnly}\n• Shell Scheme：${B.shellScheme}\n\n如有兴趣，欢迎联系。${sigCn ? '\n\n'+sigCn : ''}`,
      };
    }
    return {
      subject: `[${evName} ${sL}] Booth Participation Proposal — ${contact.company}`,
      body: `${greeting}\n\nI'm writing from the ${evName} organizing team.\n\nWe'd like to propose booth participation at **${evName} ${sL}** for ${contact.company}${
        indEn ? ` — we've been following ${indEn}and believe this would be a great fit` : ''
      }.\n\n📅 Show Details\n${dateVenueEn}${statsBlockEn}${bizEn}${
        contact.country !== '한국' ? `\n\n🌍 Full support available for international exhibitors from ${contact.country}.` : ''
      }\n\n💡 Booth Fees\n• Space Only: ${B.spaceOnly}\n• Shell Scheme: ${B.shellScheme}\n\nBest regards,${sigEn ? '\n'+sigEn : ''}`,
    };
  }

  // ── 바이어 ────────────────────────────────────────────────────────────────
  if (purpose === '바이어') {
    if (isJp) {
      return {
        subject: `【${evName} ${sL}】VIPバイヤーご招待`,
        body: `${greeting}\n\n${indJp || ''}**${evName} ${sL}** VIPバイヤーとしてご招待申し上げます。\n\n📅 ${evDates}${showVenue ? `  |  ${evVenue}` : ''}\n\n🎯 VIP特典\n• 1:1事前予約商談（並ばず希望企業と直接面談）${
          hasV(ST.exhibitors2025) ? `\n• ${ST.exhibitors2025}社カタログ事前閲覧` : ''
        }${hasV(ST.database) ? `\n• ${ST.database}件DB基盤マッチング` : ''}${
          hasV(ST.matchMeetings) && hasV(ST.consultationUSD) ? `\n• 実績：${ST.consultationUSD} / ${ST.matchMeetings}件` : ''
        }\n\nご参加のご意向をお知らせください。${sigJp ? '\n\n'+sigJp : ''}`,
      };
    }
    if (isKo) {
      return {
        subject: `[${ev.name} ${sL}] VIP 바이어 초청`,
        body: `${greeting}\n\n${ev.name} 사무국입니다.\n\n${
          indKo ? `${contact.company}의 ${indKo}전문성을 고려하여,` : `${contact.company}께`
        } **${ev.name} ${sL}** VIP 바이어로 특별 초청드립니다.\n\n📅 ${s.dates}${s.venue && s.venue !== '미정' ? `  |  ${s.venue}` : ''}\n\n🎯 VIP 바이어 혜택\n• 1:1 사전 예약 미팅 (원하는 기업 선택, 대기 없이 바로 상담)${
          hasV(ST.exhibitors2025) ? `\n• ${ST.exhibitors2025}개 참가사 카탈로그 사전 열람` : ''
        }${hasV(ST.database) ? `\n• ${ST.database}건 DB 기반 맞춤 매칭` : ''}${
          hasV(ST.matchMeetings) ? `\n• 실적: ${hasV(ST.consultationUSD) ? ST.consultationUSD + ' / ' : ''}${ST.matchMeetings}건` : ''
        }\n\n참관 의향을 알려주시면 초청장을 발송드리겠습니다.${sigKo ? '\n\n'+sigKo : ''}`,
      };
    }
    if (isCn) {
      return {
        subject: `[${evName} ${sL}] VIP买家专项邀请 — ${contact.company}`,
        body: `${greeting}\n\n诚邀贵公司作为 **${evName} ${sL}** VIP买家参加本次展会。\n\n📅 ${evDates}${showVenue ? `  |  ${evVenue}` : ''}\n\n🎯 VIP买家权益\n• 1:1预约商谈（直接与目标企业面谈，无需等候）${
          hasV(ST.exhibitors2025) ? `\n• 提前查阅${ST.exhibitors2025}家参展商目录` : ''
        }${hasV(ST.database) ? `\n• ${ST.database}条数据库精准匹配` : ''}${
          hasV(ST.matchMeetings) ? `\n• 实绩：${hasV(ST.consultationUSD) ? ST.consultationUSD + ' / ' : ''}${ST.matchMeetings}件商谈` : ''
        }\n\n参观意向请告知我们，将为您发送专属邀请函。${sigCn ? '\n\n'+sigCn : ''}`,
      };
    }
    return {
      subject: `[${evName} ${sL}] VIP Buyer Invitation`,
      body: `${greeting}\n\nI'm writing from the ${evName} organizing team.\n\nWe'd like to extend a special **VIP Buyer Invitation** to ${contact.company}${
        indEn ? `, given ${indEn}` : ''
      }.\n\n📅 ${evDates}${showVenue ? `  |  ${evVenue}` : ''}\n\n🎯 VIP Benefits\n• 1:1 pre-scheduled meetings — choose who you meet, no queuing${
        hasV(ST.exhibitors2025) ? `\n• Early access to ${ST.exhibitors2025} exhibitor catalog` : ''
      }${hasV(ST.database) ? `\n• Smart matching backed by ${ST.database}-entry database` : ''}${
        hasV(ST.matchMeetings)
          ? `\n• ${hasV(ST.consultationUSD) ? ST.consultationUSD + ' in consultations across ' : ''}${ST.matchMeetings} meetings`
          : ''
      }${contact.country !== '한국' ? `\n• ${flag} Travel/logistics support for buyers from ${contact.country}` : ''}\n\nPlease let us know if you're interested — we'll send the official invitation.\n\nBest regards,${sigEn ? '\n'+sigEn : ''}`,
    };
  }

  // ── 미디어 ────────────────────────────────────────────────────────────────
  if (isJp) {
    return {
      subject: `【${evName}】公式メディアパートナーシップのご提案 — ${contact.company} 様`,
      body: `${greeting}\n\n${contact.company} 様の専門性を評価し、**${evName}** 公式メディアパートナーとしてのご協力をご提案いたします。\n\n📰 メディアパートナー特典\n• 独占取材・優先インタビュー調整\n• 公式写真・映像素材の提供\n• 公式資料へのロゴ掲載\n\nご取材のご意向をお知らせいただければ、詳細をご案内いたします。${sigJp ? '\n\n'+sigJp : ''}`,
    };
  }
  if (isKo) {
    return {
      subject: `[${ev.name}] 공식 미디어 파트너 협력 제안 — ${contact.company}`,
      body: `${greeting}\n\n${ev.name} 사무국입니다.\n\n${contact.company}의 전문성을 높이 평가하여 **${ev.name} 공식 미디어 파트너**로 협력을 제안드립니다.\n\n📰 미디어 파트너 혜택\n• 전시회 전·중·후 독점 취재 및 보도자료 우선 제공\n• CEO·바이어 인터뷰 우선 배정\n• 공식 자료·SNS 미디어 파트너 로고 표기\n\n취재 의향을 알려주시면 세부 안내 및 취재 신청서를 발송드리겠습니다.${sigKo ? '\n\n'+sigKo : ''}`,
    };
  }
  if (isCn) {
    return {
      subject: `[${evName}] 官方媒体合作邀请 — ${contact.company}`,
      body: `${greeting}\n\n我们高度认可 ${contact.company} 的专业影响力，诚邀贵媒体成为 **${evName}** 官方媒体合作伙伴。\n\n📰 媒体合作权益\n• 展会前中后全程独家采访权及优先新闻稿\n• 优先安排CEO及买家专访\n• 提供官方照片/视频素材，官方资料标注媒体Logo\n\n如有意向，请告知我们，将发送官方媒体资料及采访申请表。${sigCn ? '\n\n'+sigCn : ''}`,
    };
  }
  return {
    subject: `[${evName}] Official Media Partnership — ${contact.company}`,
    body: `${greeting}\n\nWe'd like to invite ${contact.company} as an **Official Media Partner** for **${evName}**.\n\n📰 Partner Benefits\n• Exclusive press access pre/during/post show\n• Priority CEO & buyer interview scheduling\n• Official photo/video assets + logo on all materials\n\nPlease let us know if you're interested — we'll send the official press kit and accreditation form.\n\nBest regards,${sigEn ? '\n'+sigEn : ''}`,
  };
}
