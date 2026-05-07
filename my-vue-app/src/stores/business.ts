// ============================================================
// 商务型 — Pinia Store
// ============================================================

import { defineStore } from 'pinia'
import { fetchBusinessData, fetchConstructionSites, fetchInsarPoints, fetchParcels } from '@/api/business'
import type { BusinessData, ConstructionSite, InsarPoint, ParcelFAR } from '@/types/business'

export const useBusinessStore = defineStore('business', {
  state: () => ({
    data: null as BusinessData | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    insarPoints(state): InsarPoint[] { return state.data?.insarPoints ?? [] },
    constructionSites(state): ConstructionSite[] { return state.data?.constructionSites ?? [] },
    parcels(state): ParcelFAR[] { return state.data?.parcels ?? [] },
  },

  actions: {
    async init() {
      this.loading = true
      this.error = null
      try {
        this.data = await fetchBusinessData()
      } catch (e: any) {
        this.error = e?.message ?? '加载失败'
      } finally {
        this.loading = false
      }
    },

    async refresh() {
      try {
        const [insar, sites, parcels] = await Promise.all([
          fetchInsarPoints(), fetchConstructionSites(), fetchParcels(),
        ])
        if (this.data) {
          this.data.insarPoints = insar
          this.data.constructionSites = sites
          this.data.parcels = parcels
          this.data.updateTime = new Date().toISOString()
        }
      } catch { /* silent */ }
    },
  },
})
