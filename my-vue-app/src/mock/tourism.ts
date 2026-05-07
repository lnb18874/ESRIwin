// ============================================================
// 水乡文旅模块 — Mock 数据
// 后端就绪后可直接删除本文件
// ============================================================

import type {
  CultureVenue,
  FlowTrend,
  HeritageItem,
  HotRanking,
  RealtimeOverview,
  RecommendIndex,
  SatisfactionData,
  ScenicSpot,
  TourRoute,
  TransportItem,
  WeatherInfo,
} from '@/types/tourism'

// ============ 6个水乡景区 ============
const SCENIC_SPOTS: ScenicSpot[] = [
  {
    id: 'zhouzhuang',
    name: '周庄',
    subtitle: '中国第一水乡',
    location: [120.8528, 31.1207],
    thumbnail: '',
    tags: ['5A景区', '世界文化遗产预备', '江南六大古镇'],
    description: '周庄始建于北宋，是江南水乡的典范，以"小桥、流水、人家"闻名于世。',
  },
  {
    id: 'tongli',
    name: '同里',
    subtitle: '醇正水乡，旧时江南',
    location: [120.7185, 31.1538],
    thumbnail: '',
    tags: ['5A景区', '世界文化遗产预备', '江南六大古镇'],
    description: '同里以"一园二堂三桥"格局著称，退思园被列为世界文化遗产。',
  },
  {
    id: 'xitang',
    name: '西塘',
    subtitle: '生活着的千年古镇',
    location: [120.9005, 30.9387],
    thumbnail: '',
    tags: ['5A景区', '江南六大古镇', '廊棚水巷'],
    description: '西塘以千米廊棚为特色，烟雨长廊下，感受千年古镇的生活气息。',
  },
  {
    id: 'wuzhen',
    name: '乌镇',
    subtitle: '来过，便不曾离开',
    location: [120.4976, 30.7482],
    thumbnail: '',
    tags: ['5A景区', '世界互联网大会', '江南六大古镇'],
    description: '乌镇分为东栅西栅，以戏剧节和互联网大会闻名，是古今交融的水乡典范。',
  },
  {
    id: 'zhujiajiao',
    name: '朱家角',
    subtitle: '上海威尼斯',
    location: [121.0568, 31.1086],
    thumbnail: '',
    tags: ['4A景区', '上海水乡', '淀山湖畔'],
    description: '朱家角紧邻淀山湖，北大街、放生桥闻名，是上海近郊最具代表性的水乡古镇。',
  },
  {
    id: 'nanxun',
    name: '南浔',
    subtitle: '诗书之乡，中西合璧',
    location: [120.4275, 30.8782],
    thumbnail: '',
    tags: ['5A景区', '江南六大古镇', '中西建筑'],
    description: '南浔以嘉业藏书楼、小莲庄、中西合璧建筑群著称，文化底蕴深厚。',
  },
]

export async function mockScenicList(): Promise<ScenicSpot[]> {
  return SCENIC_SPOTS
}

// ============ 辅助生成器 ============
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickByScenic<T>(scenicId: string, map: Record<string, T>, fallback: T): T {
  return map[scenicId] ?? fallback
}

// ============ A. 实时概览 ============
export async function mockRealtime(scenicId: string): Promise<RealtimeOverview> {
  const caps: Record<string, number> = {
    zhouzhuang: 28000,
    tongli: 22000,
    xitang: 25000,
    wuzhen: 35000,
    zhujiajiao: 18000,
    nanxun: 15000,
  }
  const max = pickByScenic(scenicId, caps, 20000)
  const current = randomInt(Math.floor(max * 0.35), Math.floor(max * 0.92))
  const rate = current / max
  const level: RealtimeOverview['crowdLevel'] =
    rate < 0.5 ? 'comfortable' : rate < 0.7 ? 'moderate' : rate < 0.9 ? 'crowded' : 'full'
  return {
    scenicId,
    currentVisitors: current,
    maxCapacity: max,
    loadRate: Math.round(rate * 100) / 100,
    crowdLevel: level,
    updateTime: new Date().toISOString(),
  }
}

// ============ B. 热门排行 ============
export async function mockHotRanking(): Promise<HotRanking[]> {
  const list: HotRanking[] = [
    { scenicId: 'wuzhen', name: '乌镇', rank: 1, prevRank: 2, hotIndex: 96, score: 4.8, change: 'up' },
    { scenicId: 'zhouzhuang', name: '周庄', rank: 2, prevRank: 1, hotIndex: 93, score: 4.7, change: 'down' },
    { scenicId: 'xitang', name: '西塘', rank: 3, prevRank: 3, hotIndex: 88, score: 4.6, change: 'same' },
    { scenicId: 'tongli', name: '同里', rank: 4, prevRank: 5, hotIndex: 82, score: 4.5, change: 'up' },
    { scenicId: 'nanxun', name: '南浔', rank: 5, prevRank: 4, hotIndex: 76, score: 4.4, change: 'down' },
    { scenicId: 'zhujiajiao', name: '朱家角', rank: 6, prevRank: 6, hotIndex: 70, score: 4.3, change: 'same' },
  ]
  return list
}

// ============ C. 人流趋势 ============
export async function mockFlowTrend(_scenicId: string): Promise<FlowTrend> {
  const hours = Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`)
  const baseToday = [120, 100, 80, 70, 60, 55, 70, 180, 520, 980, 1450, 1800, 2100, 2200, 2350, 2400, 2280, 2100, 1600, 1200, 800, 500, 300, 200]
  const today = hours.map((hour, i) => ({
    hour,
    visitors: baseToday[i]! + randomInt(-50, 80),
    lastWeek: baseToday[i]! + randomInt(-100, 100),
  }))
  const yesterday = hours.map((hour, i) => ({
    hour,
    visitors: baseToday[i]! + randomInt(-80, 60),
    lastWeek: undefined,
  }))
  const forecast = hours.map((hour, i) => ({
    hour,
    visitors: baseToday[i]! + randomInt(-30, 120),
    lastWeek: undefined,
  }))
  return { scenicId: _scenicId, today, yesterday, forecast }
}

// ============ D. 推荐指数 ============
export async function mockRecommend(scenicId: string): Promise<RecommendIndex> {
  const data: Record<string, RecommendIndex> = {
    zhouzhuang: { scenicId, overall: 94, dimensions: { scenery: 96, culture: 92, service: 88, accessibility: 85, value: 82, uniqueness: 95 } },
    tongli: { scenicId, overall: 89, dimensions: { scenery: 90, culture: 94, service: 84, accessibility: 80, value: 88, uniqueness: 86 } },
    xitang: { scenicId, overall: 88, dimensions: { scenery: 91, culture: 84, service: 83, accessibility: 86, value: 90, uniqueness: 88 } },
    wuzhen: { scenicId, overall: 97, dimensions: { scenery: 94, culture: 95, service: 95, accessibility: 92, value: 80, uniqueness: 97 } },
    zhujiajiao: { scenicId, overall: 83, dimensions: { scenery: 84, culture: 78, service: 80, accessibility: 94, value: 92, uniqueness: 76 } },
    nanxun: { scenicId, overall: 87, dimensions: { scenery: 88, culture: 92, service: 82, accessibility: 76, value: 86, uniqueness: 90 } },
  }
  return data[scenicId] ?? data.zhouzhuang!
}

// ============ E. 天气 ============
export async function mockWeather(scenicId: string): Promise<WeatherInfo> {
  const d: WeatherInfo = {
    scenicId,
    temperature: randomInt(18, 30),
    humidity: randomInt(55, 85),
    weather: ['晴', '多云', '小雨', '阴'][randomInt(0, 3)]!,
    aqi: randomInt(30, 90),
    comfortIndex: randomInt(65, 92),
    tips: '当前天气适宜出行，建议携带防晒用品。若遇小雨，漫步烟雨长廊别有韵味。',
    forecast3Days: [
      { date: '05-08', weather: '多云', tempHigh: 28, tempLow: 19 },
      { date: '05-09', weather: '晴', tempHigh: 30, tempLow: 20 },
      { date: '05-10', weather: '小雨', tempHigh: 26, tempLow: 18 },
    ],
  }
  return d
}

// ============ F. 交通接驳 ============
export async function mockTransport(scenicId: string): Promise<TransportItem[]> {
  const map: Record<string, TransportItem[]> = {
    zhouzhuang: [
      { type: 'bus', name: '昆山260路', detail: '昆山南站→周庄客运站', status: 'normal', distance: '约1.2km' },
      { type: 'metro', name: '苏州S1线(规划)', detail: '预计2027年延伸至周庄', status: 'limited', distance: '规划中' },
      { type: 'parking', name: '周庄古镇停车场', detail: '车位800个', status: 'busy', distance: '约0.5km' },
      { type: 'bike', name: '共享单车停放点', detail: '景区入口右侧', status: 'normal', distance: '约0.1km' },
      { type: 'ferry', name: '水巷游船码头', detail: '古镇内游船', status: 'normal', distance: '景区内' },
    ],
    tongli: [
      { type: 'metro', name: '苏州4号线', detail: '同里站出，换乘725路', status: 'normal', distance: '约3km' },
      { type: 'bus', name: '吴江725路', detail: '4号线同里站→同里古镇', status: 'normal', distance: '约0.3km' },
      { type: 'parking', name: '同里古镇停车场', detail: '车位600个', status: 'moderate' as any, distance: '约0.6km' },
      { type: 'taxi', name: '出租车乘降点', detail: '景区南门/北门', status: 'normal', distance: '约0.1km' },
    ],
    xitang: [
      { type: 'metro', name: '嘉兴S2线(规划)', detail: '长三角示范区规划线路', status: 'limited', distance: '规划中' },
      { type: 'bus', name: '嘉善K215路', detail: '嘉善南站→西塘', status: 'normal', distance: '约0.4km' },
      { type: 'parking', name: '西塘景区停车场', detail: '车位1000个', status: 'normal', distance: '约0.3km' },
    ],
    wuzhen: [
      { type: 'bus', name: '桐乡K282路', detail: '桐乡站→乌镇', status: 'normal', distance: '约0.5km' },
      { type: 'parking', name: '乌镇西栅停车场', detail: '车位2000个', status: 'normal', distance: '约0.2km' },
      { type: 'bike', name: '共享单车停放点', detail: '景区各入口', status: 'normal', distance: '约0.1km' },
      { type: 'ferry', name: '乌镇水上游线', detail: '东西栅接驳船', status: 'normal', distance: '景区内' },
    ],
    zhujiajiao: [
      { type: 'metro', name: '上海17号线', detail: '朱家角站1号口出', status: 'normal', distance: '约1.5km' },
      { type: 'bus', name: '青浦朱徐线', detail: '朱家角汽车站', status: 'normal', distance: '约0.3km' },
      { type: 'parking', name: '朱家角停车场', detail: '车位500个', status: 'busy', distance: '约0.3km' },
    ],
    nanxun: [
      { type: 'bus', name: '湖州101路', detail: '湖州站→南浔', status: 'normal', distance: '约0.8km' },
      { type: 'parking', name: '南浔古镇停车场', detail: '车位400个', status: 'normal', distance: '约0.4km' },
      { type: 'taxi', name: '出租车乘降点', detail: '景区正门', status: 'normal', distance: '约0.1km' },
    ],
  }
  return map[scenicId] ?? map.zhouzhuang!
}

// ============ G. 文化场馆 ============
export async function mockCultureVenues(scenicId: string): Promise<CultureVenue[]> {
  const map: Record<string, CultureVenue[]> = {
    zhouzhuang: [
      { id: 'zv1', scenicId, name: '周庄博物馆', type: '博物馆', thumbnail: '', openTime: '08:30-17:00', ticketRemaining: 320, totalTickets: 500, price: 0, rating: 4.6 },
      { id: 'zv2', scenicId, name: '沈厅', type: '古建筑', thumbnail: '', openTime: '08:00-17:30', ticketRemaining: 180, totalTickets: 400, price: 0, rating: 4.8 },
      { id: 'zv3', scenicId, name: '逸飞之家', type: '纪念馆', thumbnail: '', openTime: '09:00-16:30', ticketRemaining: 85, totalTickets: 200, price: 0, rating: 4.5 },
    ],
    wuzhen: [
      { id: 'wv1', scenicId, name: '木心美术馆', type: '美术馆', thumbnail: '', openTime: '09:00-17:00', ticketRemaining: 210, totalTickets: 600, price: 20, rating: 4.9 },
      { id: 'wv2', scenicId, name: '乌镇大剧院', type: '剧院', thumbnail: '', openTime: '10:00-21:00', ticketRemaining: 0, totalTickets: 300, price: 80, rating: 4.7 },
      { id: 'wv3', scenicId, name: '茅盾纪念馆', type: '纪念馆', thumbnail: '', openTime: '08:30-17:00', ticketRemaining: 260, totalTickets: 500, price: 0, rating: 4.6 },
    ],
    nanxun: [
      { id: 'nv1', scenicId, name: '嘉业藏书楼', type: '图书馆', thumbnail: '', openTime: '08:30-16:30', ticketRemaining: 150, totalTickets: 300, price: 0, rating: 4.8 },
      { id: 'nv2', scenicId, name: '南浔非遗馆', type: '非遗馆', thumbnail: '', openTime: '09:00-17:00', ticketRemaining: 200, totalTickets: 400, price: 0, rating: 4.4 },
    ],
  }
  return map[scenicId] ?? [
    { id: 'dv1', scenicId, name: '古镇文化展示馆', type: '博物馆', thumbnail: '', openTime: '08:30-17:00', ticketRemaining: 300, totalTickets: 500, price: 0, rating: 4.5 },
    { id: 'dv2', scenicId, name: '传统手工艺馆', type: '非遗馆', thumbnail: '', openTime: '09:00-16:30', ticketRemaining: 120, totalTickets: 300, price: 0, rating: 4.3 },
  ]
}

// ============ H. 非遗展示 ============
export async function mockHeritages(scenicId: string): Promise<HeritageItem[]> {
  const map: Record<string, HeritageItem[]> = {
    zhouzhuang: [
      { id: 'zh1', scenicId, name: '周庄阿婆茶', category: '民俗', level: 'provincial', description: '江南水乡传统的饮茶习俗，以邻里聚茶为特色，蕴含深厚的人情味。', image: '', inheritor: '张秀英' },
      { id: 'zh2', scenicId, name: '周庄竹编', category: '传统技艺', level: 'municipal', description: '以竹为材料编织各种生活用具，技法细腻，造型优美。', image: '', inheritor: '李明华' },
      { id: 'zh3', scenicId, name: '周庄宣卷', category: '曲艺', level: 'provincial', description: '以说唱形式讲述历史故事和民间传说，是水乡特有的口头艺术。', image: '', inheritor: '王建平' },
    ],
    wuzhen: [
      { id: 'wh1', scenicId, name: '蓝印花布印染', category: '传统技艺', level: 'national', description: '以天然靛蓝为染料，手工刻版、刮浆、染色，制作出独具江南风韵的印花布。', image: '', inheritor: '吴元新' },
      { id: 'wh2', scenicId, name: '乌镇香市', category: '民俗', level: 'provincial', description: '春季举办的民间庙会活动，集商贸、娱乐、信仰于一体。', image: '', inheritor: '—' },
      { id: 'wh3', scenicId, name: '乌镇三白酒酿造', category: '传统技艺', level: 'municipal', description: '以糯米为原料，采用传统工艺酿造的白酒，口感醇厚绵甜。', image: '', inheritor: '徐春荣' },
    ],
    nanxun: [
      { id: 'nh1', scenicId, name: '湖笔制作技艺', category: '传统技艺', level: 'national', description: '与徽墨、宣纸、端砚并称文房四宝，制作工序120余道。', image: '', inheritor: '王一品' },
      { id: 'nh2', scenicId, name: '南浔三道茶', category: '民俗', level: 'municipal', description: '甜茶、咸茶、清茶三道，蕴含先苦后甜的人生哲理。', image: '', inheritor: '陈雪芳' },
    ],
    xitang: [
      { id: 'xh1', scenicId, name: '西塘田歌', category: '传统音乐', level: 'provincial', description: '也叫田山歌，在水田劳作时传唱的民歌，曲调悠扬。', image: '', inheritor: '顾友根' },
      { id: 'xh2', scenicId, name: '西塘纽扣制作', category: '传统技艺', level: 'municipal', description: '西塘是"中国纽扣之乡"，传统贝壳扣制作技艺精湛。', image: '', inheritor: '沈瑞康' },
    ],
    tongli: [
      { id: 'th1', scenicId, name: '同里剪纸', category: '传统美术', level: 'municipal', description: '以江南水乡为主题的精美剪纸艺术，刀法细腻，构图生动。', image: '', inheritor: '朱凤英' },
      { id: 'th2', scenicId, name: '同里鸡头米羹', category: '传统技艺', level: 'municipal', description: '用芡实制作的传统甜品，清甜软糯，是水乡代表性小吃。', image: '', inheritor: '吴阿婆' },
    ],
    zhujiajiao: [
      { id: 'zj1', scenicId, name: '朱家角阿婆粽', category: '传统技艺', level: 'municipal', description: '以五花肉、咸蛋黄为馅料的特色粽子，制作技艺代代相传。', image: '', inheritor: '徐阿婆' },
    ],
  }
  return map[scenicId] ?? map.zhouzhuang!
}

// ============ I. 特色路线 ============
export async function mockTourRoutes(scenicId: string): Promise<TourRoute[]> {
  const map: Record<string, TourRoute[]> = {
    zhouzhuang: [
      {
        id: 'zr1', scenicId, title: '经典水巷漫游', theme: '古镇漫游', duration: '2.5小时', distance: '约3km', difficulty: 'easy',
        stops: [
          { name: '古牌楼', description: '进入古镇的标志性建筑' },
          { name: '双桥', description: '周庄最具标志性的石桥，构成"钥匙"造型' },
          { name: '沈厅', description: '明代富商沈万三后裔的宅第' },
          { name: '张厅', description: '"轿从门前进，船从家中过"的明代建筑' },
          { name: '富安桥', description: '周庄最古老的石拱桥之一' },
          { name: '南湖秋月', description: '古镇南端的湖景' },
        ],
      },
      {
        id: 'zr2', scenicId, title: '非遗体验之旅', theme: '文化体验', duration: '3小时', distance: '约2km', difficulty: 'easy',
        stops: [
          { name: '竹编工坊', description: '亲手体验竹编制作' },
          { name: '阿婆茶馆', description: '品尝地道阿婆茶' },
          { name: '宣卷书场', description: '聆听水乡曲艺' },
          { name: '逸飞之家', description: '了解画家陈逸飞与周庄的故事' },
        ],
      },
    ],
    wuzhen: [
      {
        id: 'wr1', scenicId, title: '西栅夜色之旅', theme: '夜景漫游', duration: '4小时', distance: '约4km', difficulty: 'easy',
        stops: [
          { name: '西栅游客中心', description: '乘船进入景区' },
          { name: '草木本色染坊', description: '参观蓝印花布晒场' },
          { name: '木心美术馆', description: '感受文学与艺术之美' },
          { name: '西栅大街', description: '沿河漫步，赏灯笼夜景' },
          { name: '水上集市', description: '品尝水乡特色小吃' },
        ],
      },
    ],
  }
  return map[scenicId] ?? [
    { id: 'dr1', scenicId, title: '古镇经典半日游', theme: '古镇漫游', duration: '3小时', distance: '约3km', difficulty: 'easy',
      stops: [
        { name: '入口牌坊', description: '开启水乡之旅' },
        { name: '核心景点', description: '参观最具代表性的古建筑群' },
        { name: '水巷泛舟', description: '乘坐手摇船穿行水巷' },
        { name: '特色老街', description: '漫步石板路，品尝当地小吃' },
      ],
    },
  ]
}

// ============ J. 满意度 ============
export async function mockSatisfaction(scenicId: string): Promise<SatisfactionData> {
  const data: Record<string, SatisfactionData> = {
    zhouzhuang: {
      scenicId, overallScore: 4.7, reviewCount: 12860,
      dimensionScores: { scenery: 4.8, service: 4.3, sanitation: 4.5, traffic: 4.2, value: 4.1 },
      topTags: [{ label: '水乡韵味', count: 3850 }, { label: '历史悠久', count: 3120 }, { label: '拍照圣地', count: 2980 }, { label: '游船体验', count: 2450 }, { label: '商业化适度', count: 1620 }],
      recentReviews: [
        { id: 'r1', username: '旅行的意义', rating: 5, content: '清晨的周庄真的太美了，薄雾笼罩着小桥流水，仿佛走进了水墨画中。', date: '2026-05-06' },
        { id: 'r2', username: '江南烟雨', rating: 4, content: '双桥确实是地标，人有点多但值得一看。沈厅的格局让人惊叹。', date: '2026-05-04' },
      ],
    },
    wuzhen: {
      scenicId, overallScore: 4.8, reviewCount: 18600,
      dimensionScores: { scenery: 4.7, service: 4.8, sanitation: 4.9, traffic: 4.5, value: 4.0 },
      topTags: [{ label: '夜景绝美', count: 5200 }, { label: '管理规范', count: 4850 }, { label: '戏剧节', count: 3600 }, { label: '互联网大会', count: 2800 }, { label: '门票略贵', count: 2100 }],
      recentReviews: [
        { id: 'r3', username: '文艺青年', rating: 5, content: '木心美术馆的设计令人震撼，西栅的夜景更是让人流连忘返。', date: '2026-05-05' },
        { id: 'r4', username: '带着爸妈出游', rating: 4, content: '管理真的很好，到处都很干净，就是门票和住宿偏贵。', date: '2026-05-03' },
      ],
    },
  }
  return data[scenicId] ?? {
    scenicId, overallScore: 4.5, reviewCount: 8500,
    dimensionScores: { scenery: 4.6, service: 4.3, sanitation: 4.4, traffic: 4.1, value: 4.3 },
    topTags: [{ label: '古色古香', count: 2800 }, { label: '适合拍照', count: 2400 }, { label: '小吃丰富', count: 1950 }],
    recentReviews: [
      { id: 'r5', username: '旅行达人', rating: 5, content: '很不错的古镇体验，保留了原汁原味的水乡风貌。', date: '2026-05-02' },
    ],
  }
}
