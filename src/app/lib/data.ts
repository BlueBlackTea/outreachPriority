import { Show, IndustryWeights, TitleWeights, ContactWeights, ShowGroup } from './types';

// ── 빈 stats/booth/contact/market 템플릿 ────────────────────────────────────
const _S = { visitors2025:"—",exhibitors2025:"—",booths2025:"—",matchMeetings:"—",matchCompanies:"—",buyerCompanies:"—",consultationUSD:"—",database:"—",growthYoY:"—",overseasGrowth:"—",overseasVisitors2025:"—",countries2025:"—" };
const _B = { spaceOnly:"문의", shellScheme:"문의" };
const _C = { tel:"—", email:"—", web:"—" };
const _M = { size2027:"—", importUSD:"—", importCountries:"—" };

export const SHOWS: Record<string, Show> = {
  // ── 반려동물 ──────────────────────────────────────────────────────────────
  megazoo: {
    id:'megazoo', name:'MEGAZOO 2026', emoji:'🐾', color:'#E8470A',
    seasons:[
      { key:'1', label:'S1 (Spring)', dates:'29–31 May 2026', venue:'KINTEX 2 (22,580㎡)' },
      { key:'2', label:'S2 (Fall)',   dates:'20–22 Nov 2026', venue:'KINTEX 1 (42,930㎡)' },
    ],
    stats:{ visitors2025:"53,135", exhibitors2025:"579", booths2025:"1,175", matchMeetings:"843",
            matchCompanies:"324", buyerCompanies:"111", consultationUSD:"29.2 Million USD",
            database:"315,000", growthYoY:"+8.5%", overseasGrowth:"70%",
            overseasVisitors2025:"4,082", countries2025:"40+" },
    booth:{ spaceOnly:"USD 3,000", shellScheme:"USD 3,600" },
    contact:{ tel:"+82-2-6121-6462", email:"megazoo.es@esgroup.net", web:"www.megazoo.co.kr/eng" },
    market:{ size2027:"KRW 6.0 trillion", importUSD:"USD 337 million", importCountries:"45" },
  },
  kpetfair: {
    id:'kpetfair', name:'케이펫페어 2026', name_en:'K-PET FAIR 2026', emoji:'🐶', color:'#F97316',
    seasons:[
      { key:'1',  label:'대전',    dates:'02.06(금) – 02.08(일)', venue:'대전' },
      { key:'2',  label:'수원 S1', dates:'02.27(금) – 03.01(일)', venue:'수원' },
      { key:'3',  label:'세텍',    dates:'03.20(금) – 03.22(일)', venue:'SETEC, 서울' },
      { key:'4',  label:'광주',    dates:'04.03(금) – 04.05(일)', venue:'광주' },
      { key:'5',  label:'부산 S1', dates:'04.24(금) – 04.26(일)', venue:'BEXCO, 부산' },
      { key:'6',  label:'청주 S1', dates:'05.01(금) – 05.03(일)', venue:'청주' },
      { key:'7',  label:'마곡',    dates:'06.19(금) – 06.21(일)', venue:'마곡' },
      { key:'8',  label:'수원 S2', dates:'06.26(금) – 06.28(일)', venue:'수원' },
      { key:'9',  label:'코엑스',  dates:'07.17(금) – 07.19(일)', venue:'COEX, 서울' },
      { key:'10', label:'대구 S1', dates:'08.14(금) – 08.16(일)', venue:'대구' },
      { key:'11', label:'수원 S3', dates:'09.11(금) – 09.13(일)', venue:'수원' },
      { key:'12', label:'송도',    dates:'09.18(금) – 09.20(일)', venue:'송도' },
      { key:'13', label:'대구 S2', dates:'10.02(금) – 10.04(일)', venue:'대구' },
      { key:'14', label:'청주 S2', dates:'10.09(금) – 10.11(일)', venue:'청주' },
      { key:'15', label:'부산 S2', dates:'12.11(금) – 12.13(일)', venue:'부산' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  catfesta: {
    id:'catfesta', name:'궁디팡팡 캣페스타 2026', name_en:'GDPP Cat Festa 2026', emoji:'🐱', color:'#A855F7',
    seasons:[
      { key:'1', label:'제36회 벡스코',     dates:'03.27(금) – 03.29(일)', venue:'BEXCO, 부산' },
      { key:'2', label:'제37회 대전컨벤션', dates:'04.10(금) – 04.12(일)', venue:'대전컨벤션센터' },
      { key:'3', label:'제38회 aT센터',     dates:'06.12(금) – 06.14(일)', venue:'aT센터, 서울' },
      { key:'4', label:'제39회 킨텍스',     dates:'09.04(금) – 09.06(일)', venue:'KINTEX' },
      { key:'5', label:'제40회 수원메쎄',   dates:'10.30(금) – 11.01(일)', venue:'수원메쎄' },
      { key:'6', label:'제41회 세텍',       dates:'12.04(금) – 12.06(일)', venue:'SETEC, 서울' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  catfair: {
    id:'catfair', name:'가낳지모 캣페어 2026', name_en:'KANAJIMO Cat Fair 2026', emoji:'😸', color:'#C084FC',
    seasons:[
      { key:'1', label:'Winter', dates:'01.16(금) – 01.18(일)', venue:'미정' },
      { key:'2', label:'Summer', dates:'07.31(금) – 08.02(일)', venue:'미정' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  daegupet: {
    id:'daegupet', name:'대구펫쇼 2026', name_en:'Daegu Pet Show 2026', emoji:'🐕', color:'#FB923C',
    seasons:[{ key:'1', label:'대구펫쇼 2026', dates:'03.06(금) – 03.08(일)', venue:'대구' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  reptile: {
    id:'reptile', name:'코리아 렙타일포럼 2026', name_en:'Korea Reptile Forum 2026', emoji:'🦎', color:'#4ADE80',
    seasons:[{ key:'1', label:'렙타일포럼 2026', dates:'01.10(토) – 01.11(일)', venue:'수원' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 영유아 ────────────────────────────────────────────────────────────────
  kobebaby: {
    id:'kobebaby', name:'코베 베이비페어 2026', name_en:'COBE Baby Fair 2026', emoji:'👶', color:'#38BDF8',
    seasons:[
      { key:'1',  label:'수원메쎄 1월',     dates:'01.29(목) – 02.01(일)', venue:'수원메쎄' },
      { key:'2',  label:'송도컨벤시아 3월', dates:'03.12(목) – 03.15(일)', venue:'송도컨벤시아' },
      { key:'3',  label:'수원메쎄 3월',     dates:'03.19(목) – 03.22(일)', venue:'수원메쎄' },
      { key:'4',  label:'청주오스코 3월',   dates:'03.26(목) – 03.29(일)', venue:'청주오스코' },
      { key:'5',  label:'벡스코 4월',       dates:'04.16(목) – 04.19(일)', venue:'BEXCO, 부산' },
      { key:'6',  label:'코엑스 4월',       dates:'04.30(목) – 05.03(일)', venue:'COEX, 서울' },
      { key:'7',  label:'킨텍스 5월',       dates:'05.14(목) – 05.17(일)', venue:'KINTEX' },
      { key:'8',  label:'수원컨벤션 5월',   dates:'05.21(목) – 05.24(일)', venue:'수원컨벤션센터' },
      { key:'9',  label:'수원컨벤션 7월',   dates:'07.23(목) – 07.26(일)', venue:'수원컨벤션센터' },
      { key:'10', label:'킨텍스 8월',       dates:'08.06(목) – 08.09(일)', venue:'KINTEX' },
      { key:'11', label:'대전컨벤션 8월',   dates:'08.20(목) – 08.23(일)', venue:'대전컨벤션센터' },
      { key:'12', label:'청주오스코 9월',   dates:'09.03(목) – 09.06(일)', venue:'청주오스코' },
      { key:'13', label:'수원메쎄 9월',     dates:'09.17(목) – 09.20(일)', venue:'수원메쎄' },
      { key:'14', label:'벡스코 10월',      dates:'10.01(목) – 10.04(일)', venue:'BEXCO, 부산' },
      { key:'15', label:'킨텍스 10월',      dates:'10.08(목) – 10.11(일)', venue:'KINTEX' },
      { key:'16', label:'코엑스 10월',      dates:'10.29(목) – 11.01(일)', venue:'COEX, 서울' },
      { key:'17', label:'수원메쎄 11월',    dates:'11.26(목) – 11.29(일)', venue:'수원메쎄' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  daegubb: {
    id:'daegubb', name:'대구 베이비&키즈페어 2026', name_en:'Daegu Baby & Kids Fair 2026', emoji:'🍼', color:'#60A5FA',
    seasons:[
      { key:'1', label:'2월',  dates:'02.26(목) – 03.01(일)', venue:'EXCO, 대구' },
      { key:'2', label:'5월',  dates:'05.28(목) – 05.31(일)', venue:'EXCO, 대구' },
      { key:'3', label:'8월',  dates:'08.27(목) – 08.30(일)', venue:'EXCO, 대구' },
      { key:'4', label:'12월', dates:'12.03(목) – 12.06(일)', venue:'EXCO, 대구' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  globalbaby: {
    id:'globalbaby', name:'글로벌/헬시 베이비페어 2026', name_en:'Global/Healthy Baby Fair 2026', emoji:'🌍', color:'#34D399',
    seasons:[
      { key:'1', label:'헬시 벡스코 11월',   dates:'11.05(목) – 11.08(일)', venue:'BEXCO, 부산' },
      { key:'2', label:'글로벌 코엑스 11월', dates:'11.19(목) – 11.22(일)', venue:'COEX, 서울' },
      { key:'3', label:'글로벌 마곡 12월',   dates:'12.24(목) – 12.27(일)', venue:'마곡' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 커피·식음료 ───────────────────────────────────────────────────────────
  coffeedessert: {
    id:'coffeedessert', name:'코리아 커피&디저트 페스티벌 2026', name_en:'Korea Coffee & Dessert Festival 2026', emoji:'☕', color:'#92400E',
    seasons:[
      { key:'1', label:'시즌1',       dates:'04.03(금) – 04.05(일)', venue:'미정' },
      { key:'2', label:'스페셜 시즌', dates:'06.05(금) – 06.07(일)', venue:'미정' },
      { key:'3', label:'시즌2',       dates:'12.11(금) – 12.13(일)', venue:'미정' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  kfoodfest: {
    id:'kfoodfest', name:'코리아푸드페스티벌 2026', name_en:'Korea Food Festival 2026', emoji:'🍽️', color:'#F59E0B',
    seasons:[{ key:'1', label:'코리아푸드페스티벌 2026', dates:'05.08(금) – 05.10(일)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  kfarm: {
    id:'kfarm', name:'KFARM 2026', emoji:'🌱', color:'#2E7D32',
    seasons:[
      { key:'1', label:'충청', dates:'18–20 Jun 2026', venue:'OSCO, Cheongju' },
      { key:'2', label:'수원', dates:'29–31 Oct 2026', venue:'Suwon Messe, Suwon' },
    ],
    stats:{..._S}, booth:{ spaceOnly:"문의", shellScheme:"문의" },
    contact:{ tel:"+82-2-6121-6388", email:"kfarm@esgroup.net", web:"www.kfarm.co.kr" },
    market:{..._M},
  },

  // ── 캠핑·아웃도어 ─────────────────────────────────────────────────────────
  gocaf: {
    id:'gocaf', name:'GOCAF 2026', emoji:'🏕️', color:'#2D6A4F',
    seasons:[
      { key:'1',  label:'인천 퍼스트 시즌',   dates:'01.30(금) – 02.01(일)', venue:'인천' },
      { key:'2',  label:'수원메쎄 시즌1',     dates:'03.27(금) – 03.29(일)', venue:'수원메쎄' },
      { key:'3',  label:'부산 벡스코',        dates:'04.24(금) – 04.26(일)', venue:'BEXCO, 부산' },
      { key:'4',  label:'킨텍스',             dates:'05.23(토) – 05.25(월)', venue:'KINTEX' },
      { key:'5',  label:'수원메쎄 시즌2',     dates:'06.19(금) – 06.21(일)', venue:'수원메쎄' },
      { key:'6',  label:'서울 SETEC 스페셜',  dates:'07.10(금) – 07.12(일)', venue:'SETEC, 서울' },
      { key:'7',  label:'수원메쎄 더 파이널', dates:'08.28(금) – 08.30(일)', venue:'수원메쎄' },
      { key:'8',  label:'킨텍스 파이널 PART 1', dates:'10.09(금) – 10.11(일)', venue:'KINTEX' },
      { key:'9',  label:'인천 시즌2',         dates:'10.30(금) – 11.01(일)', venue:'인천' },
      { key:'10', label:'킨텍스 파이널 PART 2', dates:'11.27(금) – 11.29(일)', venue:'KINTEX' },
    ],
    stats:{ visitors2025:"184,869", exhibitors2025:"1,052", booths2025:"7,644", matchMeetings:"—",
            matchCompanies:"—", buyerCompanies:"—", consultationUSD:"—",
            database:"—", growthYoY:"+1.5%", overseasGrowth:"—",
            overseasVisitors2025:"—", countries2025:"—" },
    booth:{ spaceOnly:"KRW 800,000/3㎡", shellScheme:"KRW 1,000,000/3㎡" },
    contact:{ tel:"+82-2-6121-6388", email:"caf@esgroup.net", web:"www.gocaf.kr/eng" },
    market:{ size2027:"KRW 4.69B", importUSD:"—", importCountries:"—" },
  },
  // ── 건축·건설·인테리어·설비 ───────────────────────────────────────────────
  koreabuild: {
    id:'koreabuild', name:'코리아빌드 2026', name_en:'KoreaBuild 2026', emoji:'🏗️', color:'#475569',
    seasons:[
      { key:'1', label:'킨텍스', dates:'02.04(수) – 02.07(토)', venue:'KINTEX' },
      { key:'2', label:'코엑스', dates:'08.05(수) – 08.08(토)', venue:'COEX, 서울' },
      { key:'3', label:'부산',   dates:'10.01(목) – 10.04(일)', venue:'부산' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  seoularch: {
    id:'seoularch', name:'서울건축박람회 2026', name_en:'Seoul Architecture Fair 2026', emoji:'🏛️', color:'#64748B',
    seasons:[
      { key:'1', label:'춘계', dates:'04.23(목) – 04.26(일)', venue:'미정' },
      { key:'2', label:'추계', dates:'11.05(목) – 11.08(일)', venue:'미정' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  kyunghyang: {
    id:'kyunghyang', name:'경향하우징페어 2026', name_en:'Kyunghyang Housing Fair 2026', emoji:'🏠', color:'#7C3AED',
    seasons:[
      { key:'1', label:'광주 춘계', dates:'03.26(목) – 03.29(일)', venue:'광주' },
      { key:'2', label:'제주',      dates:'04.02(목) – 04.05(일)', venue:'제주' },
      { key:'3', label:'충청 춘계', dates:'06.11(목) – 06.14(일)', venue:'충청' },
      { key:'4', label:'대구',      dates:'09.10(목) – 09.13(일)', venue:'대구' },
      { key:'5', label:'충청 추계', dates:'10.29(목) – 11.01(일)', venue:'충청' },
      { key:'6', label:'광주 추계', dates:'11.26(목) – 11.29(일)', venue:'광주' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  interiordesign: {
    id:'interiordesign', name:'인테리어디자인코리아 2026', name_en:'Interior Design Korea 2026', emoji:'🛋️', color:'#8B5CF6',
    seasons:[{ key:'1', label:'킨텍스 2026', dates:'02.04(수) – 02.07(토)', venue:'KINTEX' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  spacedesign: {
    id:'spacedesign', name:'공간디자인페어 2026', name_en:'Space Design Fair 2026', emoji:'🏡', color:'#6D28D9',
    seasons:[{ key:'1', label:'공간디자인페어 2026', dates:'08.05(수) – 08.08(토)', venue:'COEX, 서울' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  living: {
    id:'living', name:'리빙앤라이프스타일 2026', name_en:'Living & Lifestyle 2026', emoji:'🪑', color:'#9333EA',
    seasons:[
      { key:'1', label:'부산', dates:'10.01(목) – 10.04(일)', venue:'부산' },
      { key:'2', label:'충청', dates:'10.29(목) – 11.01(일)', venue:'충청' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  mechanical: {
    id:'mechanical', name:'대한민국기계설비전시회 2026', name_en:'HVAC Korea 2026', emoji:'⚙️', color:'#374151',
    seasons:[{ key:'1', label:'대한민국기계설비전시회 2026', dates:'05.13(수) – 05.16(토)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  material: {
    id:'material', name:'고기능소재·장비위크 2026', name_en:'Advanced Material and Tech Week Korea 2026', emoji:'🔩', color:'#4B5563',
    seasons:[{ key:'1', label:'소재위크 2026', dates:'03.25(수) – 03.28(토)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  koindex: {
    id:'koindex', name:'KoINDEX 대한민국 산업전시회 2026', name_en:'KoINDEX 2026', emoji:'🏭', color:'#1F2937',
    seasons:[{ key:'1', label:'KoINDEX 2026', dates:'08.27(목) – 08.30(일)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 핸드메이드·아트 ───────────────────────────────────────────────────────
  illust: {
    id:'illust', name:'일러스트코리아 2026', name_en:'Illust Korea 2026', emoji:'🎨', color:'#EC4899',
    seasons:[
      { key:'1', label:'대구',       dates:'02.27(금) – 03.01(일)', venue:'대구' },
      { key:'2', label:'서울 4월',   dates:'04.23(목) – 04.26(일)', venue:'서울' },
      { key:'3', label:'수원 Summer',dates:'06.05(목) – 06.08(일)', venue:'수원' },
      { key:'4', label:'서울 aT',    dates:'09.04(목) – 09.07(일)', venue:'aT센터, 서울' },
      { key:'5', label:'인천',       dates:'10.30(목) – 11.02(일)', venue:'인천' },
      { key:'6', label:'수원 Winter',dates:'12.11(목) – 12.14(일)', venue:'수원' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  handart: {
    id:'handart', name:'핸드아티코리아 2026', name_en:'HandArty Korea 2026', emoji:'✋', color:'#F43F5E',
    seasons:[{ key:'1', label:'핸드아티코리아 2026', dates:'08.13(목) – 08.16(일)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  bemyobj: {
    id:'bemyobj', name:'비마이오브젝트 2026', name_en:'Be My Object 2026', emoji:'🎭', color:'#DB2777',
    seasons:[{ key:'1', label:'비마이오브젝트 2026', dates:'09.04(목) – 09.07(일)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 뷰티 ──────────────────────────────────────────────────────────────────
  beautysome: {
    id:'beautysome', name:'뷰티썸 2026', name_en:'Beautysome 2026', emoji:'💄', color:'#BE185D',
    seasons:[
      { key:'1', label:'인디아', dates:'08.27(목) – 08.30(일)', venue:'인도' },
      { key:'2', label:'수원',   dates:'11.05(목) – 11.08(일)', venue:'수원' },
    ],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 의료·헬스 ─────────────────────────────────────────────────────────────
  khf: {
    id:'khf', name:'KHF 2026', emoji:'🏥', color:'#E8003D',
    seasons:[{ key:'1', label:'KHF 2026', dates:'19–21 Aug 2026', venue:'COEX Hall C,D, Seoul' }],
    stats:{ visitors2025:"21,855", exhibitors2025:"300", booths2025:"470", matchMeetings:"103",
            matchCompanies:"—", buyerCompanies:"—", consultationUSD:"—",
            database:"—", growthYoY:"—", overseasGrowth:"—",
            overseasVisitors2025:"—", countries2025:"33" },
    booth:{ spaceOnly:"KRW 2,000,000/startup", shellScheme:"문의" },
    contact:{ tel:"+82-2-6121-6462", email:"khf@esgroup.net", web:"www.k-hospital.org" },
    market:{ size2027:"—", importUSD:"—", importCountries:"—" },
  },

  // ── IT·VR·AI ──────────────────────────────────────────────────────────────
  seoulai: {
    id:'seoulai', name:'서울AI페스티벌 2026', name_en:'Seoul AI Festival 2026', emoji:'🤖', color:'#2563EB',
    seasons:[{ key:'1', label:'서울AI페스티벌 2026', dates:'02.28(토) – 03.01(일)', venue:'서울' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  datacenter: {
    id:'datacenter', name:'데이터센터코리아 2026', name_en:'Data Center Korea 2026', emoji:'🖥️', color:'#1D4ED8',
    seasons:[{ key:'1', label:'데이터센터코리아 2026', dates:'11.04(수) – 11.07(토)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  // ── 환경·에너지 ───────────────────────────────────────────────────────────
  esg: {
    id:'esg', name:'ESG 친환경대전 2026', name_en:'ESG Eco-Friendly Exhibition 2026', emoji:'🌿', color:'#059669',
    seasons:[{ key:'1', label:'ESG친환경대전 2026', dates:'10.21(수) – 10.24(토)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  newenergy: {
    id:'newenergy', name:'뉴에너지 페어 오송 2026', name_en:'New Energy Fair Osong 2026', emoji:'⚡', color:'#10B981',
    seasons:[{ key:'1', label:'뉴에너지페어 2026', dates:'07.08(수) – 07.11(토)', venue:'오송' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
  issa: {
    id:'issa', name:'ISSA SHOW ASIA 2026', emoji:'🧹', color:'#065F46',
    seasons:[{ key:'1', label:'ISSA SHOW ASIA 2026', dates:'09.16(수) – 09.18(금)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },

  // ── 방위·보안 ─────────────────────────────────────────────────────────────
  kadex: {
    id:'kadex', name:'KADEX 국제방위산업전시회 2026', name_en:'KADEX 2026', emoji:'🛡️', color:'#1E3A5F',
    seasons:[{ key:'1', label:'KADEX 2026', dates:'10.06(화) – 10.09(금)', venue:'미정' }],
    stats:{..._S}, booth:{..._B}, contact:{..._C}, market:{..._M},
  },
};

export const TYPE_COLORS = {
  부스:   { bg:'#EEF6FF', border:'#3B82F6', text:'#1D4ED8', label:'🏪 부스 참가' },
  바이어: { bg:'#FFF7ED', border:'#F97316', text:'#C2410C', label:'💼 바이어' },
  미디어: { bg:'#F0FDF4', border:'#22C55E', text:'#15803D', label:'📰 미디어' },
  '':     { bg:'#F9FAFB', border:'#E5E7EB', text:'#9CA3AF', label:'🏛 기관' },
};

export const FLAGS: Record<string, string> = {
  한국: '🇰🇷', 중국: '🇨🇳', 일본: '🇯🇵', 대만: '🇹🇼', 태국: '🇹🇭',
  베트남: '🇻🇳', 인도네시아: '🇮🇩', 필리핀: '🇵🇭', 싱가포르: '🇸🇬', 홍콩: '🇭🇰', 미국: '🇺🇸',
};

// INITIAL_CONTACTS는 Supabase로 이전되었습니다.
// 로그인 후 DB에서 불러옵니다.

// 가중치 (localStorage에서 로드하거나 기본값 사용)
const loadWeights = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const SHOW_WEIGHTS: Record<string, IndustryWeights> = loadWeights('show_weights', {
  // ── 반려동물 ──────────────────────────────────────────────────────────────
  megazoo:       { pet:45,trade:28,health:17,it:14,food:14,beauty:20,edu:7, mfg:9, media:14,camping:3,  other:3, coffee:6, baby:6, interior:3, construction:3, handmade:3, defense:2, environment:6, mechanical:3, surface:3, vr:3,  hotel:6, security:2, special:6  },
  kpetfair:      { pet:45,trade:23,health:17,it:9, food:11,beauty:9, edu:9, mfg:6, media:9, camping:6,  other:3, coffee:3, baby:3, interior:2, construction:2, handmade:6, defense:2, environment:6, mechanical:2, surface:2, vr:3,  hotel:3, security:2, special:9  },
  catfesta:      { pet:45,trade:17,health:11,it:6, food:9, beauty:9, edu:9, mfg:3, media:9, camping:6,  other:3, coffee:3, baby:3, interior:2, construction:2, handmade:11,defense:2, environment:3, mechanical:2, surface:2, vr:3,  hotel:3, security:2, special:6  },
  catfair:       { pet:45,trade:17,health:11,it:6, food:9, beauty:9, edu:9, mfg:3, media:9, camping:6,  other:3, coffee:3, baby:3, interior:2, construction:2, handmade:9, defense:2, environment:3, mechanical:2, surface:2, vr:3,  hotel:3, security:2, special:6  },
  daegupet:      { pet:45,trade:17,health:17,it:9, food:11,beauty:9, edu:9, mfg:6, media:9, camping:6,  other:3, coffee:3, baby:3, interior:2, construction:2, handmade:6, defense:2, environment:6, mechanical:2, surface:2, vr:3,  hotel:3, security:2, special:9  },
  reptile:       { pet:45,trade:11,health:9, it:6, food:6, beauty:3, edu:17,mfg:3, media:6, camping:9,  other:6, coffee:2, baby:3, interior:2, construction:2, handmade:6, defense:2, environment:6, mechanical:2, surface:2, vr:3,  hotel:2, security:2, special:9  },
  // ── 영유아 ────────────────────────────────────────────────────────────────
  kobebaby:      { pet:6, trade:17,health:23,it:9, food:17,beauty:17,edu:17,mfg:6, media:9, camping:3,  other:3, coffee:6, baby:45,interior:6, construction:2, handmade:9, defense:2, environment:6, mechanical:2, surface:2, vr:6,  hotel:3, security:2, special:6  },
  daegubb:       { pet:6, trade:17,health:23,it:9, food:17,beauty:17,edu:17,mfg:6, media:9, camping:3,  other:3, coffee:6, baby:45,interior:6, construction:2, handmade:9, defense:2, environment:6, mechanical:2, surface:2, vr:6,  hotel:3, security:2, special:6  },
  globalbaby:    { pet:6, trade:17,health:28,it:9, food:14,beauty:17,edu:17,mfg:6, media:9, camping:3,  other:3, coffee:3, baby:45,interior:6, construction:2, handmade:6, defense:2, environment:6, mechanical:2, surface:2, vr:6,  hotel:3, security:2, special:3  },
  // ── 커피·식음료 ───────────────────────────────────────────────────────────
  coffeedessert: { pet:3, trade:17,health:9, it:6, food:34,beauty:6, edu:6, mfg:6, media:9, camping:6,  other:3, coffee:45,baby:3, interior:6, construction:2, handmade:6, defense:2, environment:3, mechanical:2, surface:2, vr:3,  hotel:17,security:2, special:11 },
  kfoodfest:     { pet:3, trade:17,health:11,it:6, food:45,beauty:6, edu:6, mfg:6, media:9, camping:6,  other:3, coffee:23,baby:6, interior:3, construction:2, handmade:3, defense:2, environment:6, mechanical:2, surface:2, vr:3,  hotel:11,security:2, special:11 },
  kfarm:         { pet:14,trade:14,health:9, it:23,food:39,beauty:3, edu:14,mfg:20,media:6, camping:6,  other:2, coffee:17,baby:3, interior:2, construction:2, handmade:3, defense:2, environment:9, mechanical:9, surface:3, vr:3,  hotel:6, security:2, special:17 },
  // ── 캠핑·아웃도어 ─────────────────────────────────────────────────────────
  gocaf:         { pet:17,trade:23,health:9, it:14,food:23,beauty:9, edu:6, mfg:17,media:11,camping:45, other:5, coffee:9, baby:3, interior:3, construction:3, handmade:6, defense:2, environment:9, mechanical:3, surface:3, vr:3,  hotel:6, security:2, special:11 },
  // ── 건축·건설·인테리어·설비 ───────────────────────────────────────────────
  koreabuild:    { pet:2, trade:11,health:3, it:9, food:3, beauty:3, edu:6, mfg:17,media:9, camping:2,  other:3, coffee:2, baby:2, interior:23,construction:45,handmade:6, defense:6, environment:11,mechanical:17,surface:17,vr:6,  hotel:6, security:6, special:2  },
  seoularch:     { pet:2, trade:11,health:3, it:9, food:3, beauty:3, edu:6, mfg:17,media:9, camping:2,  other:3, coffee:2, baby:2, interior:23,construction:45,handmade:6, defense:6, environment:11,mechanical:17,surface:17,vr:6,  hotel:6, security:6, special:2  },
  kyunghyang:    { pet:3, trade:17,health:6, it:9, food:6, beauty:6, edu:6, mfg:17,media:9, camping:3,  other:3, coffee:3, baby:6, interior:45,construction:34,handmade:11,defense:3, environment:9, mechanical:11,surface:11,vr:6,  hotel:9, security:6, special:3  },
  interiordesign:{ pet:2, trade:14,health:3, it:9, food:3, beauty:9, edu:6, mfg:11,media:11,camping:2,  other:3, coffee:3, baby:6, interior:45,construction:23,handmade:17,defense:2, environment:6, mechanical:9, surface:9, vr:6,  hotel:11,security:3, special:2  },
  spacedesign:   { pet:2, trade:14,health:3, it:9, food:3, beauty:9, edu:6, mfg:11,media:11,camping:2,  other:3, coffee:3, baby:6, interior:45,construction:23,handmade:17,defense:2, environment:6, mechanical:9, surface:9, vr:6,  hotel:11,security:3, special:2  },
  living:        { pet:3, trade:17,health:6, it:6, food:6, beauty:11,edu:6, mfg:9, media:9, camping:6,  other:3, coffee:6, baby:9, interior:45,construction:17,handmade:23,defense:2, environment:6, mechanical:6, surface:9, vr:3,  hotel:9, security:2, special:6  },
  mechanical:    { pet:2, trade:11,health:6, it:17,food:3, beauty:2, edu:9, mfg:23,media:6, camping:2,  other:3, coffee:2, baby:2, interior:6, construction:23,handmade:2, defense:9, environment:9, mechanical:45,surface:11,vr:6,  hotel:3, security:6, special:2  },
  material:      { pet:2, trade:9, health:3, it:9, food:3, beauty:6, edu:9, mfg:28,media:6, camping:2,  other:3, coffee:2, baby:2, interior:9, construction:17,handmade:6, defense:9, environment:9, mechanical:17,surface:45,vr:3,  hotel:2, security:6, special:2  },
  koindex:       { pet:3, trade:17,health:6, it:17,food:6, beauty:3, edu:6, mfg:34,media:9, camping:3,  other:6, coffee:2, baby:2, interior:9, construction:23,handmade:3, defense:11,environment:11,mechanical:23,surface:14,vr:6,  hotel:3, security:6, special:6  },
  // ── 핸드메이드·아트 ───────────────────────────────────────────────────────
  illust:        { pet:6, trade:11,health:3, it:9, food:6, beauty:17,edu:17,mfg:3, media:17,camping:3,  other:3, coffee:6, baby:9, interior:9, construction:2, handmade:45,defense:2, environment:3, mechanical:2, surface:3, vr:9,  hotel:6, security:2, special:6  },
  handart:       { pet:3, trade:11,health:3, it:6, food:6, beauty:17,edu:17,mfg:3, media:14,camping:3,  other:3, coffee:6, baby:6, interior:9, construction:2, handmade:45,defense:2, environment:3, mechanical:2, surface:3, vr:6,  hotel:6, security:2, special:6  },
  bemyobj:       { pet:3, trade:11,health:3, it:6, food:6, beauty:17,edu:14,mfg:3, media:14,camping:3,  other:3, coffee:6, baby:6, interior:11,construction:2, handmade:45,defense:2, environment:3, mechanical:2, surface:3, vr:6,  hotel:6, security:2, special:6  },
  // ── 뷰티 ──────────────────────────────────────────────────────────────────
  beautysome:    { pet:6, trade:23,health:9, it:9, food:6, beauty:45,edu:9, mfg:6, media:17,camping:2,  other:3, coffee:6, baby:6, interior:6, construction:2, handmade:11,defense:2, environment:3, mechanical:2, surface:6, vr:6,  hotel:6, security:2, special:6  },
  // ── 의료·헬스 ─────────────────────────────────────────────────────────────
  khf:           { pet:6, trade:9, health:45,it:32,food:6, beauty:6, edu:20,mfg:6, media:9, camping:2,  other:2, coffee:3, baby:11,interior:2, construction:2, handmade:2, defense:3, environment:6, mechanical:3, surface:2, vr:6,  hotel:3, security:3, special:2  },
  // ── IT·VR·AI ──────────────────────────────────────────────────────────────
  seoulai:       { pet:3, trade:9, health:11,it:45,food:3, beauty:3, edu:23,mfg:9, media:14,camping:2,  other:3, coffee:2, baby:3, interior:3, construction:3, handmade:2, defense:9, environment:6, mechanical:6, surface:3, vr:17, hotel:3, security:11,special:2  },
  datacenter:    { pet:2, trade:9, health:6, it:45,food:2, beauty:2, edu:14,mfg:17,media:9, camping:2,  other:3, coffee:2, baby:2, interior:6, construction:11,handmade:2, defense:11,environment:6, mechanical:9, surface:3, vr:9,  hotel:3, security:17,special:2  },
  // ── 환경·에너지 ───────────────────────────────────────────────────────────
  esg:           { pet:3, trade:11,health:6, it:11,food:9, beauty:3, edu:9, mfg:17,media:9, camping:6,  other:3, coffee:2, baby:2, interior:9, construction:17,handmade:3, defense:6, environment:45,mechanical:9, surface:6, vr:3,  hotel:6, security:6, special:6  },
  newenergy:     { pet:2, trade:11,health:3, it:11,food:3, beauty:2, edu:9, mfg:23,media:6, camping:3,  other:3, coffee:2, baby:2, interior:6, construction:14,handmade:2, defense:9, environment:45,mechanical:14,surface:6, vr:3,  hotel:3, security:6, special:3  },
  issa:          { pet:2, trade:11,health:17,it:9, food:6, beauty:6, edu:6, mfg:23,media:6, camping:3,  other:6, coffee:3, baby:2, interior:6, construction:9, handmade:2, defense:6, environment:39,mechanical:11,surface:9, vr:2,  hotel:17,security:9, special:2  },
  // ── 방위·보안 ─────────────────────────────────────────────────────────────
  kadex:         { pet:2, trade:9, health:6, it:17,food:2, beauty:2, edu:6, mfg:23,media:6, camping:6,  other:3, coffee:2, baby:2, interior:3, construction:9, handmade:2, defense:45,environment:6, mechanical:14,surface:6, vr:6,  hotel:2, security:11,special:2  },
});

export const SHOW_GROUPS: ShowGroup[] = [
  { key:'cat_pet',     emoji:'🐾', label:'반려동물',           shows:['megazoo','kpetfair','catfesta','catfair','daegupet','reptile'] },
  { key:'cat_baby',    emoji:'👶', label:'영유아',             shows:['kobebaby','daegubb','globalbaby'] },
  { key:'cat_coffee',  emoji:'☕', label:'커피·식음료',        shows:['coffeedessert','kfoodfest'] },
  { key:'cat_farm',    emoji:'🌱', label:'농업',               shows:['kfarm'] },
  { key:'cat_camp',    emoji:'🏕️', label:'캠핑·아웃도어',      shows:['gocaf'] },
  { key:'cat_build',   emoji:'🏗️', label:'건축·인테리어·설비', shows:['koreabuild','seoularch','kyunghyang','interiordesign','spacedesign','living','mechanical','material','koindex'] },
  { key:'cat_culture', emoji:'🎨', label:'문화·라이프',        shows:['illust','handart','bemyobj','beautysome'] },
  { key:'cat_health',  emoji:'🏥', label:'의료·헬스',          shows:['khf'] },
  { key:'cat_it',      emoji:'💻', label:'IT·VR·AI',           shows:['seoulai','datacenter'] },
  { key:'cat_eco',     emoji:'🌿', label:'환경·에너지',        shows:['esg','newenergy','issa'] },
  { key:'cat_def',     emoji:'🛡️', label:'방위산업',           shows:['kadex'] },
];

function buildCategoryWeight(showKeys: string[]): IndustryWeights {
  const validKeys = showKeys.filter(k => SHOW_WEIGHTS[k]);
  if (!validKeys.length) {
    return { pet:0,trade:0,health:0,it:0,food:0,beauty:0,edu:0,mfg:0,media:0,camping:0,other:0,
             coffee:0,baby:0,interior:0,construction:0,handmade:0,defense:0,environment:0,
             mechanical:0,surface:0,vr:0,hotel:0,security:0,special:0 };
  }
  const keys = Object.keys(SHOW_WEIGHTS[validKeys[0]]) as (keyof IndustryWeights)[];
  const result = {} as IndustryWeights;
  keys.forEach(k => { result[k] = Math.max(...validKeys.map(sk => SHOW_WEIGHTS[sk][k] || 0)); });
  return result;
}
SHOW_GROUPS.forEach(g => { SHOW_WEIGHTS[g.key] = buildCategoryWeight(g.shows); });

export const DEFAULT_SHOW_WEIGHTS: Record<string, IndustryWeights> = JSON.parse(JSON.stringify(SHOW_WEIGHTS));

export const GRADE_THRESHOLDS = loadWeights('grade_thresholds', { high: 70, low: 40 });
export const TITLE_WEIGHTS: TitleWeights = loadWeights('title_weights', { ceo: 35, director: 23, specialist: 14, other: 9 });
export const CONTACT_WEIGHTS: ContactWeights = loadWeights('contact_weights', { both: 20, emailOnly: 12, phoneOnly: 12 });

export const INDUSTRY_LABELS: Record<keyof IndustryWeights, string> = {
  pet:          '반려동물/펫케어',
  trade:        '유통/무역',
  health:       '제약/의료',
  it:           'IT/기술',
  food:         '식품/F&B',
  beauty:       '화장품',
  edu:          '교육/연구',
  mfg:          '제조업/포장재',
  media:        '미디어/언론',
  camping:      '캠핑/아웃도어',
  other:        '기타',
  coffee:       '커피·디저트',
  baby:         '영유아',
  interior:     '인테리어·리빙',
  construction: '건축·건설',
  handmade:     '핸드메이드·공예',
  defense:      '방위산업',
  environment:  '환경·에너지',
  mechanical:   '기계·설비',
  surface:      '표면처리·소재',
  vr:           'VR·AR·메타버스',
  hotel:        '호텔·관광',
  security:     '보안·안전',
  special:      '특산물·지역',
};
