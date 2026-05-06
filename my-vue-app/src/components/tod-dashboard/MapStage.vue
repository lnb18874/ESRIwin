<template>
  <section class="map-shell">
    <div ref="mapContainer" class="map-view"></div>
    <div v-if="!mapLoaded" class="loading-tip">正在加载 GeoScene 底图...</div>

    <div class="map-overlay">
      <div class="rail-line rail-main"></div>
      <div class="rail-line rail-branch"></div>
      <div class="station-pin" :style="mode.pinStyle">
        <span>{{ mode.station.slice(0, 2) }}</span>
      </div>

      <template v-if="activeMode === 'business'">
        <div class="insar-heat" :style="{ opacity: opacity / 100 }"></div>
        <button
          v-for="block in businessBlocks"
          :key="block.id"
          class="mass-block"
          :class="block.risk"
          :style="block.style"
          type="button"
          @click="$emit('select-feature', block)"
        >
          <span>{{ block.far }}</span>
        </button>
      </template>

      <template v-if="activeMode === 'hub'">
        <div class="province-boundary"></div>
        <div v-for="flow in hubFlows" :key="flow.id" class="flow-line" :style="flow.style"></div>
        <button
          v-for="point in breakPoints"
          :key="point.id"
          class="break-point"
          :style="point.style"
          type="button"
          @click="$emit('select-feature', point)"
        ></button>
      </template>

      <template v-if="activeMode === 'water'">
        <div class="lst-heat" :style="{ opacity: opacity / 100 }"></div>
        <div class="height-cylinder">
          <span>24m</span>
        </div>
        <div class="view-corridor"></div>
        <button
          v-for="model in waterModels"
          :key="model.id"
          class="heritage-model"
          :class="{ exceed: model.exceed }"
          :style="model.style"
          type="button"
          @click="$emit('select-feature', model)"
        ></button>
      </template>

      <div class="popup-card" :class="{ show: selectedFeature }">
        <template v-if="selectedFeature">
          <strong>{{ selectedFeature.name }}</strong>
          <span>{{ selectedFeature.metric }}</span>
        </template>
      </div>
    </div>

    <div class="map-status">
      <span>MapView 预览</span>
      <strong>{{ mode.mapHint }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Map, MapView } from '@/utils/geoscene'
import type { PlanningMode } from '@/stores/mainTabs'
import { breakPoints, businessBlocks, hubFlows, waterModels } from './data'
import type { ModeConfig, OverlayFeature } from './types'

const props = defineProps<{
  mode: ModeConfig
  activeMode: PlanningMode
  opacity: number
  selectedFeature: OverlayFeature | null
}>()

defineEmits<{
  'select-feature': [feature: OverlayFeature]
}>()

const mapContainer = ref<HTMLDivElement>()
const mapLoaded = ref(false)

let mapInstance: any = null

const initMap = async () => {
  if (!mapContainer.value || mapInstance) return

  await nextTick()

  try {
    const map = new Map({
      basemap: 'tianditu-vector',
    })

    mapInstance = new MapView({
      container: mapContainer.value,
      map,
      center: props.mode.center,
      zoom: props.mode.zoom,
    })

    mapLoaded.value = true
  } catch (error) {
    console.error('GeoScene 地图初始化失败', error)
  }
}

const flyToMode = () => {
  if (!mapInstance) return

  const target = {
    center: props.mode.center,
    zoom: props.mode.zoom,
  }

  if (typeof mapInstance.goTo === 'function') {
    mapInstance.goTo(target)
  } else {
    mapInstance.center = target.center
    mapInstance.zoom = target.zoom
  }
}

onMounted(() => {
  initMap()
})

watch(
  () => props.activeMode,
  () => {
    flyToMode()
  },
)

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})
</script>

<style scoped>
.map-shell {
  position: relative;
  min-width: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid #cfdae7;
  border-radius: 8px;
  background: #eaf2f8;
  box-shadow: 0 16px 36px rgba(29, 53, 87, 0.1);
}

.map-view {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #dceaf5;
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
  color: #2f4a65;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.82);
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px);
  background-size: 72px 72px;
}

.map-overlay button {
  pointer-events: auto;
}

.rail-line,
.province-boundary,
.flow-line {
  position: absolute;
  height: 4px;
  transform-origin: left center;
  border-radius: 999px;
}

.rail-main {
  left: 13%;
  top: 52%;
  width: 72%;
  background: #2563eb;
  transform: rotate(-8deg);
}

.rail-branch {
  left: 42%;
  top: 30%;
  width: 42%;
  border-top: 3px dashed #d97706;
  transform: rotate(55deg);
}

.station-pin {
  position: absolute;
  display: grid;
  place-items: center;
  width: clamp(42px, 5vw, 54px);
  height: clamp(42px, 5vw, 54px);
  transform: translate(-50%, -50%);
  border: 3px solid #ffffff;
  border-radius: 50%;
  color: #ffffff;
  font-weight: 800;
  background: #1769e0;
  box-shadow: 0 0 0 10px rgba(23, 105, 224, 0.14), 0 10px 24px rgba(23, 105, 224, 0.28);
}

.insar-heat,
.lst-heat {
  position: absolute;
  inset: 10% 12%;
  border-radius: 48%;
  filter: blur(8px);
}

.insar-heat {
  background:
    radial-gradient(circle at 38% 35%, rgba(239, 68, 68, 0.7), transparent 20%),
    radial-gradient(circle at 55% 50%, rgba(245, 158, 11, 0.56), transparent 24%),
    radial-gradient(circle at 62% 72%, rgba(59, 130, 246, 0.54), transparent 30%);
}

.mass-block,
.heritage-model {
  position: absolute;
  width: clamp(52px, 7vw, 70px);
  min-height: 44px;
  transform: translate(-50%, -100%) skewY(-12deg);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 4px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 12px 12px 0 rgba(15, 23, 42, 0.18);
  cursor: pointer;
}

.mass-block.high {
  background: linear-gradient(180deg, #ef4444, #991b1b);
}

.mass-block.medium {
  background: linear-gradient(180deg, #f59e0b, #92400e);
}

.mass-block.low {
  background: linear-gradient(180deg, #22c55e, #166534);
}

.province-boundary {
  left: 46%;
  top: 14%;
  width: 2px;
  height: 72%;
  border-left: 3px dashed rgba(71, 85, 105, 0.76);
}

.flow-line {
  background: linear-gradient(90deg, transparent, #0ea5e9, #ffffff, transparent);
  animation: flowPulse 2.2s linear infinite;
  box-shadow: 0 0 18px rgba(14, 165, 233, 0.72);
  transform: rotate(var(--angle));
}

.break-point {
  position: absolute;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 10px rgba(239, 68, 68, 0.18), 0 0 22px rgba(239, 68, 68, 0.6);
  cursor: pointer;
}

.lst-heat {
  background:
    radial-gradient(circle at 35% 58%, rgba(14, 165, 233, 0.62), transparent 24%),
    radial-gradient(circle at 52% 42%, rgba(34, 197, 94, 0.44), transparent 28%),
    radial-gradient(circle at 68% 36%, rgba(249, 115, 22, 0.56), transparent 22%);
}

.height-cylinder {
  position: absolute;
  left: 50%;
  top: 54%;
  display: grid;
  place-items: center;
  width: min(250px, 42vw);
  height: min(150px, 24vw);
  transform: translate(-50%, -50%) perspective(500px) rotateX(62deg);
  border: 3px solid rgba(239, 68, 68, 0.82);
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.14);
  box-shadow: 0 0 44px rgba(239, 68, 68, 0.2) inset;
}

.height-cylinder span {
  transform: rotateX(-62deg);
  color: #991b1b;
  font-weight: 800;
}

.view-corridor {
  position: absolute;
  left: 43%;
  top: 49%;
  width: 35%;
  height: 22%;
  transform: skewX(-20deg);
  border: 1px solid rgba(22, 163, 74, 0.7);
  background: rgba(34, 197, 94, 0.26);
}

.heritage-model {
  width: clamp(48px, 6vw, 58px);
  background: linear-gradient(180deg, #38bdf8, #0369a1);
}

.heritage-model.exceed {
  background: linear-gradient(180deg, #ef4444, #991b1b);
  box-shadow: 0 0 24px rgba(239, 68, 68, 0.62), 12px 12px 0 rgba(15, 23, 42, 0.18);
}

.popup-card {
  position: absolute;
  left: 22px;
  bottom: 54px;
  display: none;
  width: min(260px, calc(100% - 44px));
  padding: 12px;
  border: 1px solid #d6e1ee;
  border-radius: 8px;
  color: #142033;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
}

.popup-card.show {
  display: grid;
  gap: 6px;
}

.popup-card span {
  color: #64748b;
  font-size: 12px;
}

.map-status {
  position: absolute;
  left: 16px;
  bottom: 14px;
  z-index: 3;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid #d6e1ee;
  border-radius: 7px;
  color: #64748b;
  background: rgba(255, 255, 255, 0.88);
}

.map-status strong {
  color: #142033;
}

@keyframes flowPulse {
  from {
    background-position: -120px 0;
  }

  to {
    background-position: 260px 0;
  }
}

@media (max-width: 980px) {
  .map-shell {
    min-height: 100%;
  }
}
</style>
