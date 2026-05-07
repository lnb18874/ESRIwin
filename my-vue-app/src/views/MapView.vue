<template>
  <div class="tod-dashboard">
    <DashboardHeader
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
        :active-mode="activeTab"
        @toggle-layer="onToggleLayer"
      />

      <MapStage
        class="map-region"
        :mode="currentMode"
        :active-mode="activeTab"
        :opacity="opacity"
        :layer-states="layerStates"
        :selected-feature="selectedFeature"
        @select-feature="selectFeature"
      />

      <AnalysisPanel class="right-region" :mode="currentMode" :active-mode="activeTab" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import AnalysisPanel from '@/components/tod-dashboard/AnalysisPanel.vue'
import DashboardHeader from '@/components/tod-dashboard/DashboardHeader.vue'
import LayerToolPanel from '@/components/tod-dashboard/LayerToolPanel.vue'
import MapStage from '@/components/tod-dashboard/MapStage.vue'
import { defaultLayerControls, modes } from '@/components/tod-dashboard/data'
import type { OverlayFeature } from '@/components/tod-dashboard/types'
import { useMainTabsStore, type PlanningMode } from '@/stores/mainTabs'
import { useBusinessStore } from '@/stores/business'
import { useHubStore } from '@/stores/hub'
import { useTimelineStore } from '@/stores/timeline'

const mainTabsStore = useMainTabsStore()
const businessStore = useBusinessStore()
const hubStore = useHubStore()
const timelineStore = useTimelineStore()

const activeTab = computed(() => mainTabsStore.activeTab)
const currentMode = computed(() => modes.find((m) => m.key === activeTab.value) ?? modes[0]!)

const opacity = ref(68)
const selectedFeature = ref<OverlayFeature | null>(null)
const layerControls = reactive(defaultLayerControls.map((l) => ({ ...l })))

// 提取图层状态供 MapStage 使用
const layerStates = computed(() => {
  const m: Record<string, boolean> = {}
  for (const l of layerControls) m[l.id] = l.enabled
  return m
})

function switchMode(mode: PlanningMode) {
  mainTabsStore.setActiveTab(mode)
  selectedFeature.value = null
}

function selectFeature(feature: OverlayFeature) {
  selectedFeature.value = feature
}

function onToggleLayer(id: string, enabled: boolean) {
  const layer = layerControls.find(l => l.id === id)
  if (layer) layer.enabled = enabled
}

// 初始化模式专属 stores
watch(activeTab, (mode) => {
  if (mode === 'business' && !businessStore.data) businessStore.init()
  if (mode === 'hub' && !hubStore.data) hubStore.init()
}, { immediate: true })
</script>

<style scoped>
.tod-dashboard {
  width: 100%;
  height: 100dvh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #142033;
  background: linear-gradient(180deg, rgba(235, 244, 255, 0.96), rgba(248, 251, 255, 0.98)), #f7fbff;
}

.dashboard-body {
  display: grid;
  grid-template-columns: minmax(240px, 18vw) minmax(0, 1fr) minmax(280px, 22vw);
  gap: 14px;
  width: 100%;
  min-height: 0;
  flex: 1;
  margin: 0 auto;
  padding: 14px;
  overflow: hidden;
  align-items: stretch;
}

.left-region, .right-region { min-height: 0; overflow-y: auto; }
.map-region { min-height: 0; height: 100%; }

@media (max-width: 1280px) {
  .dashboard-body {
    grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) minmax(220px, 34vh);
    grid-template-areas: 'left map' 'left right';
    align-items: stretch;
  }
  .left-region { grid-area: left; }
  .map-region { grid-area: map; height: 100%; }
  .right-region { grid-area: right; }
}

@media (max-width: 980px) {
  .tod-dashboard { min-height: 100dvh; height: auto; overflow: visible; }
  .dashboard-body {
    grid-template-columns: 1fr; grid-template-rows: auto;
    grid-template-areas: 'map' 'left' 'right'; gap: 12px; padding: 12px; overflow: visible;
  }
  .map-region { height: clamp(420px, 58dvh, 620px); }
  .left-region, .right-region { overflow: visible; }
}

@media (max-width: 768px) {
  .dashboard-body { gap: 10px; padding: 10px; }
  .map-region { height: clamp(360px, 56dvh, 520px); }
}

@media (max-width: 480px) {
  .dashboard-body { gap: 8px; padding: 8px; }
  .map-region { height: clamp(300px, 54dvh, 420px); }
}
</style>
