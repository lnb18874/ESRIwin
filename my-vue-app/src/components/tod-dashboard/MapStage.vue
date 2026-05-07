<template>
  <section class="map-shell">
    <div ref="mapContainer" class="map-view"></div>
    <div v-if="!mapLoaded" class="loading-tip">正在加载 GeoScene 底图...</div>

    <!-- OD 流线动画层 (枢纽模式) -->
    <div v-if="activeMode === 'hub' && layerStates.flow" class="flow-overlay" :style="{ opacity: opacity / 100 }">
      <div
        v-for="flow in odFlowLines"
        :key="flow.id"
        class="flow-path"
        :style="flow.style"
      >
        <div class="flow-dot" :style="{ animationDuration: flow.duration + 's' }"></div>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="popup-card" :class="{ show: selectedFeature }">
      <template v-if="selectedFeature">
        <strong>{{ selectedFeature.name }}</strong>
        <span>{{ selectedFeature.metric }}</span>
      </template>
    </div>

    <div class="map-status">
      <span>MapView · {{ mode.mapHint }}</span>
      <strong>{{ activeModeLabel }}</strong>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Map, MapView, GraphicsLayer, Point, Polyline, Polygon,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Graphic,
} from '@/utils/geoscene'
import type { PlanningMode } from '@/stores/mainTabs'
import type { ModeConfig, OverlayFeature } from './types'

const props = defineProps<{
  mode: ModeConfig
  activeMode: PlanningMode
  opacity: number
  layerStates: Record<string, boolean>
  selectedFeature: OverlayFeature | null
}>()

const mapContainer = ref<HTMLDivElement>()
const mapLoaded = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapView: any = null
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let graphicsLayer: any = null

const modeLabels: Record<PlanningMode, string> = {
  business: '商务型 · 地隧韧性协同',
  hub: '枢纽商圈型 · 营运活力缝合',
  water: '水乡文旅型 · TOD 潜力智选',
}
const activeModeLabel = computed(() => modeLabels[props.activeMode] ?? '')

// OD 流线配置(枢纽模式)
const odFlowLines = [
  { id: 'od1', style: { top: '35%', left: '18%', width: '42%', transform: 'rotate(-8deg)' }, duration: 3.5 },
  { id: 'od2', style: { top: '48%', left: '22%', width: '38%', transform: 'rotate(5deg)' }, duration: 4.2 },
  { id: 'od3', style: { top: '55%', left: '14%', width: '50%', transform: 'rotate(-14deg)' }, duration: 3.8 },
]

// ============ 地图初始化 ============
const initMap = async () => {
  if (!mapContainer.value || mapView) return
  await nextTick()

  try {
    const map = new Map({ basemap: 'tianditu-vector' })
    mapView = new MapView({
      container: mapContainer.value,
      map,
      center: props.mode.center,
      zoom: props.mode.zoom,
    })
    await mapView.when()

    graphicsLayer = new GraphicsLayer({ id: 'tod-graphics' })
    map.add(graphicsLayer)
    drawCurrentMode()

    mapLoaded.value = true
  } catch (error) {
    console.error('GeoScene 地图初始化失败', error)
  }
}

// ============ 绘制图形 ============
function clearGraphics() {
  if (graphicsLayer) graphicsLayer.removeAll()
}

function drawCurrentMode() {
  clearGraphics()
  const ls = props.layerStates
  if (props.activeMode === 'business') drawBusiness(ls)
  if (props.activeMode === 'hub') drawHub(ls)
  if (props.activeMode === 'water') drawWater(ls)
  // 全局轨交线
  if (ls.rail) drawRail()
}

function drawRail() {
  const gfx: any[] = []
  const cx = props.mode.center[0], cy = props.mode.center[1]
  const line = new Polyline({ paths: [[[cx - 0.15, cy + 0.05], [cx, cy - 0.02], [cx + 0.12, cy + 0.03]]] })
  gfx.push(new Graphic({ geometry: line, symbol: new SimpleLineSymbol({ color: '#2563eb', width: 2.5, style: 'solid' }) }))
  graphicsLayer.addMany(gfx)
}

// ---------- 商务型 ----------
function drawBusiness(ls: Record<string, boolean>) {
  const gfx: any[] = []
  const cx = 121.327, cy = 31.2

  // InSAR 沉降场 — 半透明圆
  if (ls.insar) {
    const points = [
      { lon: cx - 0.012, lat: cy + 0.008, r: 0.015, risk: 'danger' as const },
      { lon: cx + 0.008, lat: cy - 0.006, r: 0.012, risk: 'warning' as const },
      { lon: cx + 0.018, lat: cy + 0.010, r: 0.010, risk: 'danger' as const },
      { lon: cx - 0.006, lat: cy - 0.012, r: 0.013, risk: 'warning' as const },
      { lon: cx + 0.022, lat: cy - 0.002, r: 0.009, risk: 'normal' as const },
    ]
    const colors = { danger: [239, 68, 68, 0.35] as any, warning: [245, 158, 11, 0.30] as any, normal: [34, 197, 94, 0.25] as any }
    for (const p of points) {
      const ring: number[][] = []
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2
        ring.push([p.lon + Math.cos(a) * p.r, p.lat + Math.sin(a) * p.r])
      }
      gfx.push(new Graphic({
        geometry: new Polygon({ rings: [ring] }),
        symbol: new SimpleFillSymbol({ color: colors[p.risk], outline: { color: colors[p.risk].slice(0, 3).concat([0.6]) as any, width: 1 } }),
        attributes: { name: `监测点 · ${p.risk === 'danger' ? '高危' : p.risk === 'warning' ? '预警' : '正常'}`, metric: 'InSAR 沉降异常区' },
      }))
    }
  }

  // 施工标注
  if (ls.construction) {
    const sites = [
      { lon: cx - 0.01, lat: cy + 0.006, type: 'shield' },
      { lon: cx + 0.015, lat: cy - 0.008, type: 'foundation_pit' },
      { lon: cx + 0.005, lat: cy + 0.012, type: 'tower_crane' },
    ]
    for (const s of sites) {
      gfx.push(new Graphic({
        geometry: new Point({ longitude: s.lon, latitude: s.lat }),
        symbol: new SimpleMarkerSymbol({ color: s.type === 'shield' ? '#f59e0b' : s.type === 'foundation_pit' ? '#ef4444' : '#f59e0b', size: 10, outline: { color: '#fff', width: 1.5 } }),
        attributes: { name: s.type === 'shield' ? '盾构段' : s.type === 'foundation_pit' ? '基坑' : '塔吊群', metric: `YOLO α=${(0.5 + Math.random() * 0.4).toFixed(2)}` },
      }))
    }
  }

  graphicsLayer.addMany(gfx)
}

// ---------- 枢纽商圈型 ----------
function drawHub(ls: Record<string, boolean>) {
  const gfx: any[] = []
  const cx = 121.086, cy = 31.298

  // 慢行断点
  if (ls.breakpoints) {
    const bps = [
      { lon: cx - 0.005, lat: cy + 0.015, name: '花桥北省界桥', metric: '绕行620m · 紧急' },
      { lon: cx + 0.018, lat: cy - 0.005, name: '非机动车缺口', metric: '绕行320m · 高' },
      { lon: cx + 0.010, lat: cy + 0.020, name: '花桥南接驳', metric: '绕行480m · 紧急' },
    ]
    for (const bp of bps) {
      gfx.push(new Graphic({
        geometry: new Point({ longitude: bp.lon, latitude: bp.lat }),
        symbol: new SimpleMarkerSymbol({ color: '#ef4444', size: 12, outline: { color: '#fff', width: 2 } }),
        attributes: { id: bp.name, name: bp.name, metric: bp.metric },
      }))
    }
  }

  // 省界
  const boundary = new Polyline({ paths: [[[121.105, 31.24], [121.11, 31.36]]] })
  gfx.push(new Graphic({
    geometry: boundary,
    symbol: new SimpleLineSymbol({ color: '#64748b', width: 2, style: 'dash-dot' }),
    attributes: { name: '沪苏省界' },
  }))

  // 等时圈
  if (ls.isochrone) {
    for (const r of [0.02, 0.04]) {
      const ring: number[][] = []
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2
        ring.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.7])
      }
      gfx.push(new Graphic({
        geometry: new Polygon({ rings: [ring] }),
        symbol: new SimpleFillSymbol({ color: r === 0.02 ? [139, 92, 246, 0.15] as any : [139, 92, 246, 0.08] as any, outline: { color: [139, 92, 246, 0.5], width: 1.5, style: 'dash' } }),
        attributes: { name: r === 0.02 ? '15分钟' : '30分钟', metric: '等时圈' },
      }))
    }
  }

  graphicsLayer.addMany(gfx)
}

// ---------- 水乡文旅型 ----------
function drawWater(ls: Record<string, boolean>) {
  const gfx: any[] = []
  const cx = 120.88, cy = 31.08

  // 风貌建筑
  if (ls.heritage) {
    const models = [
      { lon: cx - 0.008, lat: cy + 0.010, name: '风貌建筑A', metric: '高度18m · 符合限高' },
      { lon: cx + 0.012, lat: cy - 0.005, name: '占位模型B', metric: '高度31m · 超出限高' },
      { lon: cx + 0.006, lat: cy + 0.016, name: '滨水设施C', metric: '高度12m · 符合限高' },
    ]
    for (const m of models) {
      const exceeded = m.metric.includes('超出')
      gfx.push(new Graphic({
        geometry: new Point({ longitude: m.lon, latitude: m.lat }),
        symbol: new SimpleMarkerSymbol({ color: exceeded ? '#ef4444' : '#38bdf8', size: exceeded ? 14 : 10, outline: { color: '#fff', width: 1.5 } }),
        attributes: { id: m.name, name: m.name, metric: m.metric },
      }))
    }
  }

  // LST 冷岛区域
  if (ls.lst) {
    const lstData = [
      { lon: cx - 0.005, lat: cy + 0.005, r: 0.012, temp: 28.5 },
      { lon: cx + 0.010, lat: cy - 0.008, r: 0.014, temp: 26.8 },
      { lon: cx - 0.012, lat: cy - 0.004, r: 0.010, temp: 30.2 },
    ]
    for (const d of lstData) {
      const ring: number[][] = []
      for (let i = 0; i <= 32; i++) {
        const a = (i / 32) * Math.PI * 2
        ring.push([d.lon + Math.cos(a) * d.r, d.lat + Math.sin(a) * d.r])
      }
      const alpha = d.temp < 28 ? 0.35 : 0.18
      const color = d.temp < 28 ? [34, 197, 94, alpha] as any : [245, 158, 11, alpha] as any
      gfx.push(new Graphic({
        geometry: new Polygon({ rings: [ring] }),
        symbol: new SimpleFillSymbol({ color, outline: { color: [34, 197, 94, 0.5], width: 1 } }),
        attributes: { name: `LST ${d.temp}°C`, metric: d.temp < 28 ? '冷岛效应区' : '热岛区' },
      }))
    }
  }

  // 视域通廊
  if (ls.corridor) {
    const corridor = new Polygon({ rings: [[[cx - 0.015, cy + 0.005], [cx + 0.02, cy - 0.008], [cx + 0.025, cy + 0.012], [cx - 0.01, cy + 0.018], [cx - 0.015, cy + 0.005]]] })
    gfx.push(new Graphic({
      geometry: corridor,
      symbol: new SimpleFillSymbol({ color: [34, 197, 94, 0.15] as any, outline: { color: [34, 197, 94, 0.6], width: 1.5 } }),
      attributes: { name: '视域通廊区' },
    }))
  }

  // 限高约束体 (简化为红色虚线圆)
  if (ls['height-limit']) {
    const ring: number[][] = []
    for (let i = 0; i <= 32; i++) {
      const a = (i / 32) * Math.PI * 2
      ring.push([cx + Math.cos(a) * 0.018, cy + Math.sin(a) * 0.018])
    }
    gfx.push(new Graphic({
      geometry: new Polygon({ rings: [ring] }),
      symbol: new SimpleFillSymbol({ color: [239, 68, 68, 0.08] as any, outline: { color: [239, 68, 68, 0.7], width: 2, style: 'dash' } }),
      attributes: { name: '24m 限高约束区' },
    }))
  }

  graphicsLayer.addMany(gfx)
}

// ============ 图层刷新 ============
watch(() => props.layerStates, () => { if (mapLoaded.value) drawCurrentMode() }, { deep: true })
watch(() => props.activeMode, () => {
  if (!mapLoaded.value) return
  clearGraphics()
  drawCurrentMode()
  flyToMode()
})
watch(() => props.opacity, (val) => {
  if (graphicsLayer) graphicsLayer.opacity = val / 100
})

function flyToMode() {
  if (!mapView) return
  const target = { center: props.mode.center, zoom: props.mode.zoom }
  if (typeof mapView.goTo === 'function') mapView.goTo(target)
  else { mapView.center = target.center; mapView.zoom = target.zoom }
}

// ============ 生命周期 ============
onMounted(() => { initMap() })
onBeforeUnmount(() => { if (mapView) { mapView.destroy(); mapView = null } })
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
}

.loading-tip {
  position: absolute;
  top: 50%; left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
  padding: 8px 12px; border-radius: 6px;
  color: #2f4a65; background: rgba(255, 255, 255, 0.82);
}

/* OD 流线动画层 */
.flow-overlay {
  position: absolute;
  inset: 0; z-index: 2;
  pointer-events: none;
}
.flow-path {
  position: absolute;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, #0ea5e9 40%, #fff 60%, transparent);
  transform-origin: left center;
  opacity: 0.8;
}
.flow-dot {
  position: absolute;
  top: 50%;
  width: 8px; height: 8px;
  margin-top: -4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 12px #0ea5e9, 0 0 24px rgba(14, 165, 233, 0.6);
  animation: flowMove linear infinite;
}

@keyframes flowMove {
  0% { left: -4px; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: calc(100% + 4px); opacity: 0; }
}

.popup-card {
  position: absolute;
  left: 22px; bottom: 54px;
  z-index: 10;
  display: none;
  width: min(260px, calc(100% - 44px));
  padding: 12px;
  border: 1px solid #d6e1ee; border-radius: 8px;
  color: #142033; background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.16);
}
.popup-card.show { display: grid; gap: 6px; }
.popup-card span { color: #64748b; font-size: 12px; }

.map-status {
  position: absolute;
  left: 16px; bottom: 14px;
  z-index: 3;
  display: flex; flex-wrap: wrap; gap: 10px;
  padding: 8px 10px;
  border: 1px solid #d6e1ee; border-radius: 7px;
  color: #64748b; background: rgba(255, 255, 255, 0.88);
}
.map-status strong { color: #142033; }

@media (max-width: 980px) {
  .map-shell { min-height: 100%; }
}
</style>
