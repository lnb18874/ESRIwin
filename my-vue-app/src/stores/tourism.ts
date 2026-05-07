// ============================================================
// 水乡文旅模块 — Pinia Store
// 管理景区切换、数据加载、轮询刷新
// ============================================================

import { defineStore } from 'pinia'
import {
  fetchFlowTrend,
  fetchHeritages,
  fetchHotRanking,
  fetchRealtime,
  fetchRecommend,
  fetchRoutes,
  fetchSatisfaction,
  fetchScenicFullData,
  fetchScenicList,
  fetchTransport,
  fetchVenues,
  fetchWeather,
} from '@/api/tourism'
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

export const useTourismStore = defineStore('tourism', {
  state: () => ({
    // 景区列表
    scenicList: [] as ScenicSpot[],
    selectedScenicId: 'zhouzhuang' as string,

    // 数据
    realtime: null as RealtimeOverview | null,
    hotRanking: [] as HotRanking[],
    flowTrend: null as FlowTrend | null,
    recommend: null as RecommendIndex | null,
    weather: null as WeatherInfo | null,
    transport: [] as TransportItem[],
    venues: [] as CultureVenue[],
    heritages: [] as HeritageItem[],
    routes: [] as TourRoute[],
    satisfaction: null as SatisfactionData | null,

    // 状态
    loading: false,
    error: null as string | null,
    realtimeTimer: null as ReturnType<typeof setInterval> | null,
  }),

  getters: {
    currentScenic(state): ScenicSpot | undefined {
      return state.scenicList.find((s) => s.id === state.selectedScenicId)
    },
    crowdLabel(state): string {
      const m: Record<string, string> = {
        comfortable: '舒适',
        moderate: '适中',
        crowded: '拥挤',
        full: '满载',
      }
      return m[state.realtime?.crowdLevel ?? 'comfortable'] ?? '—'
    },
    topRankings(state): HotRanking[] {
      return state.hotRanking.slice(0, 6)
    },
  },

  actions: {
    // ---------- 初始化 ----------
    async init() {
      this.loading = true
      this.error = null
      try {
        this.scenicList = await fetchScenicList()
        if (!this.scenicList.find((s) => s.id === this.selectedScenicId)) {
          this.selectedScenicId = this.scenicList[0]?.id ?? 'zhouzhuang'
        }
        await this.loadAllData()
        this.startRealtimePolling()
      } catch (e: any) {
        this.error = e?.message ?? '加载失败'
      } finally {
        this.loading = false
      }
    },

    // ---------- 切换景区 ----------
    async switchScenic(scenicId: string) {
      if (this.selectedScenicId === scenicId) return
      this.selectedScenicId = scenicId
      await this.loadAllData()
    },

    // ---------- 全量加载 ----------
    async loadAllData() {
      const id = this.selectedScenicId
      const [realtime, flowTrend, hotRanking, recommend, weather, transport, venues, heritages, routes, satisfaction] =
        await Promise.all([
          fetchRealtime(id),
          fetchFlowTrend(id),
          fetchHotRanking(),
          fetchRecommend(id),
          fetchWeather(id),
          fetchTransport(id),
          fetchVenues(id),
          fetchHeritages(id),
          fetchRoutes(id),
          fetchSatisfaction(id),
        ])
      this.realtime = realtime
      this.flowTrend = flowTrend
      this.hotRanking = hotRanking
      this.recommend = recommend
      this.weather = weather
      this.transport = transport
      this.venues = venues
      this.heritages = heritages
      this.routes = routes
      this.satisfaction = satisfaction
    },

    // ---------- 轮询实时数据(30s) ----------
    startRealtimePolling() {
      this.stopRealtimePolling()
      this.realtimeTimer = setInterval(async () => {
        try {
          this.realtime = await fetchRealtime(this.selectedScenicId)
        } catch {
          // 静默失败
        }
      }, 30_000)
    },

    stopRealtimePolling() {
      if (this.realtimeTimer) {
        clearInterval(this.realtimeTimer)
        this.realtimeTimer = null
      }
    },

    // ---------- 销毁 ----------
    dispose() {
      this.stopRealtimePolling()
    },
  },
})
