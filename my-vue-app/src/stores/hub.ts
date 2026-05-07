// ============================================================
// 枢纽商圈型 — Pinia Store
// ============================================================

import { defineStore } from 'pinia'
import { fetchBalance, fetchBreakPoints, fetchHubData, fetchODFlows, fetchRadiation } from '@/api/hub'
import type { BreakPoint, BusinessRadiation, HubData, JobHousingBalance, ODFlow } from '@/types/hub'

export const useHubStore = defineStore('hub', {
  state: () => ({
    data: null as HubData | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    odFlows(state): ODFlow[] { return state.data?.odFlows ?? [] },
    breakPoints(state): BreakPoint[] { return state.data?.breakPoints ?? [] },
    balance(state): JobHousingBalance | null { return state.data?.balance ?? null },
    radiation(state): BusinessRadiation | null { return state.data?.radiation ?? null },
  },

  actions: {
    async init() {
      this.loading = true
      this.error = null
      try {
        this.data = await fetchHubData()
      } catch (e: any) {
        this.error = e?.message ?? '加载失败'
      } finally {
        this.loading = false
      }
    },

    async refresh() {
      try {
        const [ods, bps, bal, rad] = await Promise.all([
          fetchODFlows(), fetchBreakPoints(), fetchBalance(), fetchRadiation(),
        ])
        if (this.data) {
          this.data.odFlows = ods
          this.data.breakPoints = bps
          this.data.balance = bal
          this.data.radiation = rad
          this.data.updateTime = new Date().toISOString()
        }
      } catch { /* silent */ }
    },
  },
})
