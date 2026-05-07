// ============================================================
// 水乡文旅模块 — 类型定义 (与后端接口对齐)
// ============================================================

// ---------- 景区基础信息 ----------
export interface ScenicSpot {
  id: string
  name: string
  subtitle: string // 一句话简介
  location: [number, number] // [lng, lat]
  thumbnail: string
  tags: string[] // 标签如 ["5A景区", "世界文化遗产"]
  description: string
}

// ---------- A. 实时概览 ----------
export interface RealtimeOverview {
  scenicId: string
  currentVisitors: number // 当前实时人数
  maxCapacity: number // 最大承载量
  loadRate: number // 承载率 0-1
  crowdLevel: 'comfortable' | 'moderate' | 'crowded' | 'full' // 拥挤度
  updateTime: string // ISO datetime
}

// ---------- B. 热门排行 ----------
export interface HotRanking {
  scenicId: string
  name: string
  rank: number
  prevRank: number // 上期排名(用于升降动画)
  hotIndex: number // 热度指数 0-100
  score: number // 综合评分
  change: 'up' | 'down' | 'same'
}

// ---------- C. 人流趋势 ----------
export interface FlowTrendPoint {
  hour: string // "08:00"
  visitors: number
  lastWeek?: number // 上周同期(对比线)
}

export interface FlowTrend {
  scenicId: string
  today: FlowTrendPoint[]
  yesterday: FlowTrendPoint[]
  forecast: FlowTrendPoint[] // 预测(虚线)
}

// ---------- D. 推荐指数 ----------
export interface RecommendDimensions {
  scenery: number // 风景指数
  culture: number // 文化底蕴
  service: number // 服务质量
  accessibility: number // 交通便利
  value: number // 性价比
  uniqueness: number // 独特性
}

export interface RecommendIndex {
  scenicId: string
  overall: number // 综合推荐指数
  dimensions: RecommendDimensions
}

// ---------- E. 天气 ----------
export interface WeatherInfo {
  scenicId: string
  temperature: number
  humidity: number
  weather: string // "晴" | "多云" | "小雨" 等
  aqi: number
  comfortIndex: number // 体感舒适度 0-100
  tips: string
  forecast3Days: DayForecast[]
}

export interface DayForecast {
  date: string
  weather: string
  tempHigh: number
  tempLow: number
}

// ---------- F. 交通接驳 ----------
export interface TransportItem {
  type: 'metro' | 'bus' | 'parking' | 'bike' | 'taxi' | 'ferry'
  name: string // 线路/站点名
  detail: string // 详情
  status: 'normal' | 'busy' | 'limited' // 实时状态
  distance: string // 距景区距离
}

// ---------- G. 文化场馆 ----------
export interface CultureVenue {
  id: string
  scenicId: string
  name: string
  type: string // "博物馆" | "纪念馆" | "书院" 等
  thumbnail: string
  openTime: string
  ticketRemaining: number // 余票数
  totalTickets: number
  price: number
  rating: number
}

// ---------- H. 非遗项目 ----------
export interface HeritageItem {
  id: string
  scenicId: string
  name: string
  category: string // "传统技艺" | "民俗" | "曲艺" 等
  level: 'national' | 'provincial' | 'municipal' // 保护级别
  description: string
  image: string
  inheritor: string // 传承人
}

// ---------- I. 特色路线 ----------
export interface TourRoute {
  id: string
  scenicId: string
  title: string
  theme: string // "古镇漫游" | "水巷寻幽" | "美食之旅" 等
  duration: string // 建议时长
  stops: RouteStop[]
  distance: string
  difficulty: 'easy' | 'moderate'
}

export interface RouteStop {
  name: string
  description: string
  icon?: string
}

// ---------- J. 游客满意度 ----------
export interface SatisfactionData {
  scenicId: string
  overallScore: number // 综合满意度 1-5
  reviewCount: number
  dimensionScores: {
    scenery: number
    service: number
    sanitation: number
    traffic: number
    value: number
  }
  topTags: { label: string; count: number }[]
  recentReviews: ReviewItem[]
}

export interface ReviewItem {
  id: string
  username: string
  avatar?: string
  rating: number
  content: string
  date: string
}

// ---------- 聚合类型(单景区完整数据) ----------
export interface ScenicFullData {
  info: ScenicSpot
  realtime: RealtimeOverview
  hotRanking: HotRanking
  flowTrend: FlowTrend
  recommend: RecommendIndex
  weather: WeatherInfo
  transport: TransportItem[]
  venues: CultureVenue[]
  heritages: HeritageItem[]
  routes: TourRoute[]
  satisfaction: SatisfactionData
}

// ---------- API 响应格式 ----------
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface ScenicListResponse {
  list: ScenicSpot[]
  total: number
}

// ---------- 景区切换参数 ----------
export type ScenicId = string
