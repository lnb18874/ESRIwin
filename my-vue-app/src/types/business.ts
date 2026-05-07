// ============================================================
// 商务型 (虹桥/嘉定) — 类型定义
// 感知·地隧韧性协同：在建地铁施工监测 + InSAR 沉降 + FAR 评估
// ============================================================

// ---------- InSAR 沉降监测点 ----------
export interface InsarPoint {
  id: string
  location: [number, number] // [lng, lat]
  subsidenceRate: number // 沉降速率 mm/月
  cumulativeSubsidence: number // 累计沉降量 mm
  riskLevel: 'normal' | 'warning' | 'danger' // 风险等级
  trend: 'stable' | 'accelerating' | 'decelerating' // 趋势
  timeSeries: InsarTimePoint[] // 时间序列
}

export interface InsarTimePoint {
  date: string // "2026-01"
  value: number // 累计沉降 mm
}

// ---------- YOLO 施工识别 ----------
export interface ConstructionSite {
  id: string
  location: [number, number]
  name: string // 工地名称
  type: 'tower_crane' | 'foundation_pit' | 'shield' | 'mixed' // 施工类型
  intensity: number // 施工强度 α (0-1)
  changeRate: number // 变化率(周)
  lastDetected: string
  encroachment: boolean // 是否侵入红线
}

// ---------- FAR 地块评估 ----------
export interface ParcelFAR {
  id: string
  name: string // 地块编号
  currentFAR: number // 当前容积率
  allowedFAR: number // 允许上限
  subsidenceRate: number // 该地块平均沉降速率
  riskScore: number // 综合风险评分 0-100
  recommendation: 'safe' | 'caution' | 'restrict' // 开发建议
}

// ---------- 聚合数据 ----------
export interface BusinessData {
  insarPoints: InsarPoint[]
  constructionSites: ConstructionSite[]
  parcels: ParcelFAR[]
  updateTime: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
