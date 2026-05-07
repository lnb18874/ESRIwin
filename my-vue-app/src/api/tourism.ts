// ============================================================
// 水乡文旅模块 — API 服务层
// 采用策略模式：优先调用真实 API，失败时降级到 mock
// 后端就绪后只需更新 BASE_URL 和移除 fallback 即可
// ============================================================

import axios from 'axios'
import type {
  ApiResponse,
  CultureVenue,
  FlowTrend,
  HeritageItem,
  HotRanking,
  RealtimeOverview,
  RecommendIndex,
  SatisfactionData,
  ScenicFullData,
  ScenicListResponse,
  ScenicSpot,
  TourRoute,
  TransportItem,
  WeatherInfo,
} from '@/types/tourism'
import {
  mockCultureVenues,
  mockFlowTrend,
  mockHeritages,
  mockHotRanking,
  mockRealtime,
  mockRecommend,
  mockSatisfaction,
  mockScenicList,
  mockTourRoutes,
  mockTransport,
  mockWeather,
} from '@/mock/tourism'

const BASE_URL = import.meta.env.VITE_TOURISM_API_BASE ?? '/api/tourism'

const http = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
})

// ============ 景区列表 ============
export async function fetchScenicList(): Promise<ScenicSpot[]> {
  try {
    const res = await http.get<ApiResponse<ScenicListResponse>>('/scenic/list')
    if (res.data.code === 0) return res.data.data.list
  } catch {
    console.warn('[TourismAPI] GET /scenic/list 失败，使用 mock 数据')
  }
  return mockScenicList()
}

// ============ 单景区完整数据 ============
export async function fetchScenicFullData(scenicId: string): Promise<ScenicFullData> {
  try {
    const res = await http.get<ApiResponse<ScenicFullData>>(`/scenic/${scenicId}/full`)
    if (res.data.code === 0) return res.data.data
  } catch {
    console.warn(`[TourismAPI] GET /scenic/${scenicId}/full 失败，使用 mock 数据`)
  }
  return buildMockFullData(scenicId)
}

// ============ 子模块独立接口 (支持增量刷新) ============
export async function fetchRealtime(scenicId: string): Promise<RealtimeOverview> {
  try {
    const res = await http.get<ApiResponse<RealtimeOverview>>(`/scenic/${scenicId}/realtime`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockRealtime(scenicId)
}

export async function fetchFlowTrend(scenicId: string): Promise<FlowTrend> {
  try {
    const res = await http.get<ApiResponse<FlowTrend>>(`/scenic/${scenicId}/flow-trend`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockFlowTrend(scenicId)
}

export async function fetchHotRanking(): Promise<HotRanking[]> {
  try {
    const res = await http.get<ApiResponse<HotRanking[]>>('/scenic/ranking')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockHotRanking()
}

export async function fetchRecommend(scenicId: string): Promise<RecommendIndex> {
  try {
    const res = await http.get<ApiResponse<RecommendIndex>>(`/scenic/${scenicId}/recommend`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockRecommend(scenicId)
}

export async function fetchWeather(scenicId: string): Promise<WeatherInfo> {
  try {
    const res = await http.get<ApiResponse<WeatherInfo>>(`/scenic/${scenicId}/weather`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockWeather(scenicId)
}

export async function fetchTransport(scenicId: string): Promise<TransportItem[]> {
  try {
    const res = await http.get<ApiResponse<TransportItem[]>>(`/scenic/${scenicId}/transport`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockTransport(scenicId)
}

export async function fetchVenues(scenicId: string): Promise<CultureVenue[]> {
  try {
    const res = await http.get<ApiResponse<CultureVenue[]>>(`/scenic/${scenicId}/venues`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockCultureVenues(scenicId)
}

export async function fetchHeritages(scenicId: string): Promise<HeritageItem[]> {
  try {
    const res = await http.get<ApiResponse<HeritageItem[]>>(`/scenic/${scenicId}/heritages`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockHeritages(scenicId)
}

export async function fetchRoutes(scenicId: string): Promise<TourRoute[]> {
  try {
    const res = await http.get<ApiResponse<TourRoute[]>>(`/scenic/${scenicId}/routes`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockTourRoutes(scenicId)
}

export async function fetchSatisfaction(scenicId: string): Promise<SatisfactionData> {
  try {
    const res = await http.get<ApiResponse<SatisfactionData>>(`/scenic/${scenicId}/satisfaction`)
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockSatisfaction(scenicId)
}

// ============ 辅助 ============
async function buildMockFullData(scenicId: string): Promise<ScenicFullData> {
  const [list, rankingList] = await Promise.all([mockScenicList(), mockHotRanking()])
  const info = list.find((s) => s.id === scenicId) ?? list[0]!
  const hot = rankingList.find((r) => r.scenicId === scenicId) ?? rankingList[0]!
  const [realtime, flow, recommend, weather, transport, venues, heritages, routes, satisfaction] =
    await Promise.all([
      mockRealtime(scenicId),
      mockFlowTrend(scenicId),
      mockRecommend(scenicId),
      mockWeather(scenicId),
      mockTransport(scenicId),
      mockCultureVenues(scenicId),
      mockHeritages(scenicId),
      mockTourRoutes(scenicId),
      mockSatisfaction(scenicId),
    ])
  return { info, realtime, hotRanking: hot, flowTrend: flow, recommend, weather, transport, venues, heritages, routes, satisfaction }
}
