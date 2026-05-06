import { defineStore } from 'pinia';

export const useMainTabsStore = defineStore('mainTabs', {
  state: () => ({
    activeTab: '商务三角',
  }),
  actions: {
    setActiveTab(tab: string) {
      this.activeTab = tab;
    },
  },
});
