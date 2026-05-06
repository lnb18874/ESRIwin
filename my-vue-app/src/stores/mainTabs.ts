import { defineStore } from 'pinia'

export type PlanningMode = 'business' | 'hub' | 'water'

export const useMainTabsStore = defineStore('mainTabs', {
  state: () => ({
    activeTab: 'business' as PlanningMode,
  }),
  actions: {
    setActiveTab(tab: PlanningMode) {
      this.activeTab = tab
    },
  },
})
