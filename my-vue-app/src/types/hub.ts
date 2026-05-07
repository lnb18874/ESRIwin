// ============================================================
// 枢纽商圈型 (太仓/花桥) — 类型定义
// 评价·营运活力缝合：跨城通勤 + 慢行断点 + 商圈辐射
// ============================================================

// ---------- OD 客流 ----------
export interface ODFlow {
  id: string
  from: [number, number] // 起点坐标
  to: [number, number] // 终点坐标
  volume: number // 客流总量
  morningPeak: number // 早高峰流量
  eveningPeak: number // 晚高峰流量
  mainMode: 'metro' | 'bus' | 'car' | 'bike' // 主要通勤方式
}

// ---------- 慢行断点 ----------
export interface BreakPoint {
  id: string
  location: [number, number]
  name: string
  type: 'bridge' | 'crossing' | 'path_gap' | 'transfer' // 断点类型
  detourDistance: number // 绕行距离 m
  priority: 'critical' | 'high' | 'medium' | 'low' // 改造优先级
  description: string
  suggestion: string // 改造建议
}

// ---------- 职住平衡 ----------
export interface JobHousingBalance {
  areaId: string
  areaName: string
  residencePop: number // 居住人口
  jobPop: number // 就业岗位
  entropy: number // 平衡熵 (0=完全分离, 1=完全平衡)
  commuteTimeAvg: number // 平均通勤时间 min
  hourlyDistribution: HourlyPop[] // 24h人口分布
}

export interface HourlyPop {
  hour: string
  pop: number // 该时段人口
}

// ---------- 商圈辐射 ----------
export interface BusinessRadiation {
  stationId: string
  stationName: string
  isochrone15min: number // 15分钟等时圈覆盖人口
  isochrone30min: number // 30分钟等时圈覆盖人口
  commercialDensity: number // 商业密度指数
  vacancyRate: number // 空置率
  formatMix: FormatMix // 业态配比
}

export interface FormatMix {
  dining: number // 餐饮占比 %
  retail: number // 零售占比 %
  service: number // 服务占比 %
  entertainment: number // 娱乐占比 %
}

// ---------- 聚合数据 ----------
export interface HubData {
  odFlows: ODFlow[]
  breakPoints: BreakPoint[]
  balance: JobHousingBalance
  radiation: BusinessRadiation
  updateTime: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
