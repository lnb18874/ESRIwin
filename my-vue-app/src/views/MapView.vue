<template>
  <div class="tod-dashboard">
    <DashboardHeader
      v-model:timeline="timeline"
      :modes="modes"
      :active-mode="activeTab"
      @change-mode="switchMode"
    />

    <main class="dashboard-body">
      <LayerToolPanel
        v-model:opacity="opacity"
        class="left-region"
        :station="currentMode.station"
        :layers="layerControls"
        :tools="tools"
      />

      <MapStage
        class="map-region"
        :mode="currentMode"
        :active-mode="activeTab"
        :opacity="opacity"
        :selected-feature="selectedFeature"
        @select-feature="selectFeature"
      />

      <AnalysisPanel class="right-region" :mode="currentMode" :active-mode="activeTab" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AnalysisPanel from '@/components/tod-dashboard/AnalysisPanel.vue'
import DashboardHeader from '@/components/tod-dashboard/DashboardHeader.vue'
import LayerToolPanel from '@/components/tod-dashboard/LayerToolPanel.vue'
import MapStage from '@/components/tod-dashboard/MapStage.vue'
import { defaultLayerControls, modes, tools } from '@/components/tod-dashboard/data'
import type { OverlayFeature } from '@/components/tod-dashboard/types'
import { useMainTabsStore, type PlanningMode } from '@/stores/mainTabs'

const mainTabsStore = useMainTabsStore()
const activeTab = computed(() => mainTabsStore.activeTab)
const currentMode = computed(() => modes.find((mode) => mode.key === activeTab.value) ?? modes[0]!)

const timeline = ref(2026)
const opacity = ref(68)
const selectedFeature = ref<OverlayFeature | null>(null)
const layerControls = reactive(defaultLayerControls.map((layer) => ({ ...layer })))

const switchMode = (mode: PlanningMode) => {
  mainTabsStore.setActiveTab(mode)
  selectedFeature.value = null
}

const selectFeature = (feature: OverlayFeature) => {
  selectedFeature.value = feature
}
</script>

<style scoped>
.tod-dashboard {
  min-height: 100dvh;
  color: #142033;
  background:
    linear-gradient(180deg, rgba(235, 244, 255, 0.96), rgba(248, 251, 255, 0.98)),
    #f7fbff;
}

.dashboard-body {
  display: grid;
  grid-template-columns: minmax(240px, 18vw) minmax(420px, 1fr) minmax(280px, 22vw);
  gap: 14px;
  width: min(100%, 1920px);
  min-height: calc(100dvh - 71px);
  margin: 0 auto;
  padding: 14px;
}

.left-region,
.right-region {
  min-height: 0;
}

.map-region {
  min-height: 0;
}

@media (max-width: 1280px) {
  .dashboard-body {
    grid-template-columns: minmax(220px, 260px) minmax(360px, 1fr);
    grid-template-areas:
      'left map'
      'right map';
    align-items: start;
  }

  .left-region {
    grid-area: left;
  }

  .map-region {
    grid-area: map;
    position: sticky;
    top: 14px;
  }

  .right-region {
    grid-area: right;
  }
}

@media (max-width: 980px) {
  .dashboard-body {
    grid-template-columns: 1fr;
    grid-template-areas:
      'map'
      'left'
      'right';
    min-height: auto;
  }

  .map-region {
    position: relative;
    top: auto;
  }
}
</style>
