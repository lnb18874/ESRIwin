<template>
  <div class="tod-dashboard">
    <header class="cockpit-header">
      <div class="brand">
        <div class="brand-mark">TOD</div>
        <div>
          <div class="system-title">长三角示范区 TOD 协同规划平台</div>
          <div class="system-subtitle">三维评估 · 风险预警 · 协同决策</div>
        </div>
      </div>

      <nav class="mode-tabs" aria-label="场景切换">
        <button
          v-for="mode in modes"
          :key="mode.key"
          class="mode-tab"
          :class="{ active: activeTab === mode.key }"
          type="button"
          @click="switchMode(mode.key)"
        >
          <span>{{ mode.label }}</span>
          <small>{{ mode.station }}</small>
        </button>
      </nav>

      <div class="header-tools">
        <label class="timeline">
          <span>InSAR 时间轴</span>
          <input v-model="timeline" type="range" min="2019" max="2026" />
          <strong>{{ timeline }}</strong>
        </label>
        <button class="icon-btn" type="button" title="用户">U</button>
        <button class="icon-btn" type="button" title="关于">i</button>
      </div>
    </header>

    <main class="cockpit-body">
      <aside class="left-panel">
        <section class="panel-section">
          <div class="section-head">
            <h2>图层控制器</h2>
            <span>{{ currentMode.station }}</span>
          </div>
          <div class="layer-tree">
            <label v-for="layer in layerControls" :key="layer.id" class="layer-row">
              <input v-model="layer.enabled" type="checkbox" />
              <span class="layer-dot" :style="{ background: layer.color }"></span>
              <span>{{ layer.name }}</span>
            </label>
          </div>
          <label class="opacity-control">
            <span>热力透明度</span>
            <input v-model="opacity" type="range" min="20" max="90" />
            <strong>{{ opacity }}%</strong>
          </label>
        </section>

        <section class="panel-section">
          <div class="section-head">
            <h2>分析工具箱</h2>
          </div>
          <div class="tool-grid">
            <button v-for="tool in tools" :key="tool.name" class="tool-btn" type="button" :title="tool.name">
              <span>{{ tool.icon }}</span>
              <small>{{ tool.name }}</small>
            </button>
          </div>
        </section>

        <section class="panel-section compact">
          <div class="section-head">
            <h2>全局图层</h2>
          </div>
          <div class="legend-list">
            <div class="legend-item">
              <span class="line solid"></span>
              <span>营运铁路</span>
            </div>
            <div class="legend-item">
              <span class="line dashed"></span>
              <span>在建铁路</span>
            </div>
            <div class="legend-item">
              <span class="area admin"></span>
              <span>行政边界</span>
            </div>
          </div>
        </section>
      </aside>

      <section class="map-shell">
        <div ref="mapContainer" class="map-view"></div>
        <div v-if="!mapLoaded" class="loading-tip">正在加载 GeoScene 地图...</div>

        <div class="map-overlay">
          <div class="rail-line rail-main"></div>
          <div class="rail-line rail-branch"></div>
          <div class="station-pin" :style="currentMode.pinStyle">
            <span>{{ currentMode.station.slice(0, 2) }}</span>
          </div>

          <template v-if="activeTab === 'business'">
            <div class="insar-heat" :style="{ opacity: opacity / 100 }"></div>
            <button
              v-for="block in businessBlocks"
              :key="block.id"
              class="mass-block"
              :class="block.risk"
              :style="block.style"
              type="button"
              @click="selectFeature(block)"
            >
              <span>{{ block.far }}</span>
            </button>
          </template>

          <template v-if="activeTab === 'hub'">
            <div class="province-boundary"></div>
            <div v-for="flow in hubFlows" :key="flow.id" class="flow-line" :style="flow.style"></div>
            <button
              v-for="point in breakPoints"
              :key="point.id"
              class="break-point"
              :style="point.style"
              type="button"
              @click="selectFeature(point)"
            ></button>
          </template>

          <template v-if="activeTab === 'water'">
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
              @click="selectFeature(model)"
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
          <span>SceneView 预览</span>
          <strong>{{ currentMode.mapHint }}</strong>
        </div>
      </section>

      <aside class="right-panel">
        <section class="station-card">
          <span class="mode-kicker">{{ currentMode.badge }}</span>
          <h1>{{ currentMode.station }}</h1>
          <p>{{ currentMode.focus }}</p>
        </section>

        <template v-if="activeTab === 'business'">
          <section class="panel-section">
            <div class="section-head">
              <h2>开发强度评估</h2>
              <span>FAR</span>
            </div>
            <div class="bar-chart">
              <div v-for="item in businessBars" :key="item.name" class="bar-row">
                <span>{{ item.name }}</span>
                <div class="bar-track">
                  <i :style="{ width: item.current + '%' }"></i>
                  <em :style="{ left: item.limit + '%' }"></em>
                </div>
                <strong>{{ item.value }}</strong>
              </div>
            </div>
          </section>
          <section class="panel-section">
            <div class="section-head">
              <h2>沉降风险预警</h2>
              <span>mm/月</span>
            </div>
            <div class="gauge risk">
              <div class="needle"></div>
              <strong>7.8</strong>
              <span>中高风险</span>
            </div>
          </section>
          <section class="panel-section compact">
            <div class="section-head">
              <h2>高危风险点</h2>
            </div>
            <button v-for="item in riskList" :key="item" class="list-link" type="button">{{ item }}</button>
          </section>
        </template>

        <template v-if="activeTab === 'hub'">
          <section class="panel-section">
            <div class="section-head">
              <h2>职住平衡熵</h2>
              <span>24h</span>
            </div>
            <div class="line-chart">
              <svg viewBox="0 0 320 120" role="img" aria-label="通勤潮汐折线图">
                <polyline points="0,92 45,78 92,32 140,45 186,70 235,36 278,54 320,24" />
              </svg>
            </div>
          </section>
          <section class="panel-section">
            <div class="section-head">
              <h2>跨城消费引力</h2>
              <span>距离/消费</span>
            </div>
            <div class="scatter-chart">
              <i v-for="dot in scatterDots" :key="dot.id" :style="dot.style"></i>
            </div>
          </section>
          <section class="panel-section compact">
            <div class="section-head">
              <h2>缝合路径建议</h2>
            </div>
            <button v-for="item in hubSuggestions" :key="item" class="list-link" type="button">{{ item }}</button>
          </section>
        </template>

        <template v-if="activeTab === 'water'">
          <section class="panel-section">
            <div class="section-head">
              <h2>视域保护度</h2>
              <span>雷达</span>
            </div>
            <div class="radar-chart">
              <div class="radar-fill"></div>
              <span>限高</span>
              <span>通廊</span>
              <span>风貌</span>
              <span>可视</span>
            </div>
          </section>
          <section class="panel-section">
            <div class="section-head">
              <h2>生态冷岛指数</h2>
              <span>LST</span>
            </div>
            <div class="area-chart">
              <svg viewBox="0 0 320 120" role="img" aria-label="生态冷岛面积图">
                <path d="M0 90 C45 72 58 52 98 58 C140 66 155 28 200 38 C248 50 262 24 320 34 L320 120 L0 120 Z" />
              </svg>
            </div>
          </section>
          <section class="panel-section compact">
            <div class="section-head">
              <h2>实景 VR 漫游</h2>
            </div>
            <div class="vr-window">
              <div class="vr-sky"></div>
              <div class="vr-water"></div>
              <span>水乡客厅风貌预览</span>
            </div>
          </section>
        </template>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { Map, MapView } from '@/utils/geoscene'
import { useMainTabsStore, type PlanningMode } from '@/stores/mainTabs'

type OverlayFeature = {
  id: string
  name: string
  metric: string
  style?: Record<string, string>
  far?: string
  risk?: string
  exceed?: boolean
}

const mainTabsStore = useMainTabsStore()
const activeTab = computed(() => mainTabsStore.activeTab)
const mapContainer = ref<HTMLDivElement>()
const mapLoaded = ref(false)
const timeline = ref(2026)
const opacity = ref(68)
const selectedFeature = ref<OverlayFeature | null>(null)

let mapInstance: any = null

type ModeConfig = {
  key: PlanningMode
  label: string
  station: string
  badge: string
  focus: string
  mapHint: string
  center: [number, number]
  zoom: number
  pinStyle: Record<string, string>
}

const modes: ModeConfig[] = [
  {
    key: 'business',
    label: '商务型',
    station: '虹桥',
    badge: '商务型模式',
    focus: '高密度开发与 InSAR 沉降风险的对抗关系。',
    mapHint: '建筑体块 + 沉降热力',
    center: [121.327, 31.2],
    zoom: 13,
    pinStyle: { left: '48%', top: '49%' },
  },
  {
    key: 'hub',
    label: '枢纽商圈型',
    station: '花桥',
    badge: '枢纽商圈型模式',
    focus: '跨城通勤缝合，突出边界断点与客流吸引。',
    mapHint: '流向线 + 慢行断点',
    center: [121.086, 31.298],
    zoom: 13,
    pinStyle: { left: '53%', top: '47%' },
  },
  {
    key: 'water',
    label: '水乡文旅型',
    station: '水乡客厅',
    badge: '水乡文旅型模式',
    focus: '生态与风貌保护，控制视域高度和冷岛效应。',
    mapHint: '限高约束体 + LST 热力',
    center: [120.88, 31.08],
    zoom: 12,
    pinStyle: { left: '50%', top: '52%' },
  },
]

const currentMode = computed<ModeConfig>(() => modes.find((mode) => mode.key === activeTab.value) ?? modes[0]!)

const layerControls = reactive([
  { id: 'rail', name: '轨道交通网', color: '#36a3ff', enabled: true },
  { id: 'insar', name: 'InSAR 沉降场', color: '#ff5a5f', enabled: true },
  { id: 'vitality', name: '活力热力图', color: '#22c55e', enabled: false },
])

const tools = [
  { name: '测量距离', icon: '↔' },
  { name: '剖面分析', icon: '⌁' },
  { name: '视点分析', icon: '◎' },
  { name: '框选查询', icon: '□' },
]

const businessBlocks: OverlayFeature[] = [
  { id: 'b1', name: '商务地块 A', metric: 'α=0.82；沉降速率 7.8 mm/月', far: 'FAR 6.2', risk: 'high', style: { left: '37%', top: '33%', height: '128px' } },
  { id: 'b2', name: '商务地块 B', metric: 'α=0.67；沉降速率 4.1 mm/月', far: 'FAR 4.8', risk: 'medium', style: { left: '52%', top: '39%', height: '92px' } },
  { id: 'b3', name: '商务地块 C', metric: 'α=0.58；沉降速率 2.4 mm/月', far: 'FAR 3.6', risk: 'low', style: { left: '45%', top: '58%', height: '72px' } },
]

const hubFlows = [
  { id: 'f1', style: { left: '24%', top: '42%', width: '46%', '--angle': '14deg' } },
  { id: 'f2', style: { left: '34%', top: '58%', width: '38%', '--angle': '-18deg' } },
  { id: 'f3', style: { left: '47%', top: '33%', width: '29%', '--angle': '42deg' } },
]

const breakPoints: OverlayFeature[] = [
  { id: 'p1', name: '慢行断点 01', metric: '省界桥下绕行 620m', style: { left: '43%', top: '45%' } },
  { id: 'p2', name: '慢行断点 02', metric: '非机动车过街缺口', style: { left: '58%', top: '61%' } },
  { id: 'p3', name: '慢行断点 03', metric: '公交接驳步行 11 分钟', style: { left: '49%', top: '30%' } },
]

const waterModels: OverlayFeature[] = [
  { id: 'w1', name: '风貌建筑 A', metric: '高度 18m，符合限高', exceed: false, style: { left: '38%', top: '42%', height: '58px' } },
  { id: 'w2', name: '占位模型 B', metric: '高度 31m，超出 24m 控制线', exceed: true, style: { left: '55%', top: '39%', height: '112px' } },
  { id: 'w3', name: '滨水设施 C', metric: '高度 12m，符合限高', exceed: false, style: { left: '48%', top: '62%', height: '42px' } },
]

const businessBars = [
  { name: 'HQ-01', current: 82, limit: 74, value: '6.2' },
  { name: 'HQ-02', current: 64, limit: 76, value: '4.8' },
  { name: 'HQ-03', current: 48, limit: 68, value: '3.6' },
]

const riskList = ['HQ-01 北侧地下空间', 'HQ-07 高架邻近地块', 'HQ-11 软土敏感区']
const hubSuggestions = ['新增省界慢行天桥', '优化花桥站南侧接驳环', '设置跨城消费导流廊道']
const scatterDots = [
  { id: 's1', style: { left: '18%', bottom: '28%' } },
  { id: 's2', style: { left: '34%', bottom: '48%' } },
  { id: 's3', style: { left: '52%', bottom: '36%' } },
  { id: 's4', style: { left: '67%', bottom: '62%' } },
  { id: 's5', style: { left: '78%', bottom: '44%' } },
]

const initMap = async () => {
  if (!mapContainer.value || mapInstance) return

  try {
    const map = new Map({
      basemap: 'topo-vector',
    })

    mapInstance = new MapView({
      container: mapContainer.value,
      map,
      center: currentMode.value.center,
      zoom: currentMode.value.zoom,
    })

    mapLoaded.value = true
  } catch (error) {
    console.error('GeoScene 地图初始化失败', error)
  }
}

const switchMode = async (mode: PlanningMode) => {
  mainTabsStore.setActiveTab(mode)
  selectedFeature.value = null
  await nextTick()
  flyToCurrentMode()
}

const flyToCurrentMode = () => {
  if (!mapInstance) return

  const target = {
    center: currentMode.value.center,
    zoom: currentMode.value.zoom,
  }

  if (typeof mapInstance.goTo === 'function') {
    mapInstance.goTo(target)
  } else {
    mapInstance.center = target.center
    mapInstance.zoom = target.zoom
  }
}

const selectFeature = (feature: OverlayFeature) => {
  selectedFeature.value = feature
}

onMounted(() => {
  initMap()
})

watch(activeTab, () => {
  flyToCurrentMode()
})

onBeforeUnmount(() => {
  if (mapInstance) {
    mapInstance.destroy()
    mapInstance = null
  }
})
</script>

<style scoped>
.tod-dashboard {
  width: 100vw;
  height: 100vh;
  color: #e8f2ff;
  background:
    radial-gradient(circle at 18% 8%, rgba(49, 135, 255, 0.2), transparent 26%),
    linear-gradient(135deg, #07111f 0%, #10253a 48%, #14251f 100%);
  overflow: hidden;
}

.cockpit-header {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto minmax(260px, 1fr);
  align-items: center;
  gap: 18px;
  height: 76px;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(153, 197, 255, 0.18);
  background: rgba(5, 15, 28, 0.78);
  backdrop-filter: blur(16px);
}

.brand,
.header-tools,
.mode-tabs,
.timeline,
.layer-row,
.legend-item,
.section-head {
  display: flex;
  align-items: center;
}

.brand {
  gap: 12px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border: 1px solid rgba(99, 179, 255, 0.6);
  border-radius: 8px;
  color: #67d4ff;
  font-weight: 800;
  background: rgba(8, 36, 62, 0.86);
}

.system-title {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0;
}

.system-subtitle,
.mode-tab small,
.timeline span,
.map-status,
.station-card p,
.section-head span {
  color: #92abc5;
  font-size: 12px;
}

.mode-tabs {
  gap: 8px;
  padding: 5px;
  border: 1px solid rgba(126, 185, 255, 0.2);
  border-radius: 8px;
  background: rgba(8, 22, 38, 0.82);
}

.mode-tab {
  min-width: 116px;
  height: 48px;
  border: 0;
  border-radius: 6px;
  color: #c5d7ea;
  background: transparent;
  cursor: pointer;
}

.mode-tab span,
.mode-tab small {
  display: block;
}

.mode-tab span {
  font-size: 14px;
  font-weight: 700;
}

.mode-tab.active {
  color: #ffffff;
  background: linear-gradient(135deg, #1677ff, #20c997);
  box-shadow: 0 8px 22px rgba(26, 124, 255, 0.32);
}

.mode-tab.active small {
  color: rgba(255, 255, 255, 0.78);
}

.header-tools {
  justify-content: flex-end;
  gap: 10px;
}

.timeline {
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid rgba(126, 185, 255, 0.22);
  border-radius: 8px;
  background: rgba(10, 31, 50, 0.72);
}

input[type='range'] {
  accent-color: #28d3b2;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid rgba(126, 185, 255, 0.28);
  border-radius: 7px;
  color: #d8e9ff;
  background: rgba(13, 35, 56, 0.82);
  cursor: pointer;
}

.cockpit-body {
  display: grid;
  grid-template-columns: 300px minmax(420px, 1fr) 340px;
  gap: 14px;
  height: calc(100vh - 76px);
  padding: 14px;
}

.left-panel,
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  overflow: auto;
}

.panel-section,
.station-card {
  border: 1px solid rgba(133, 188, 255, 0.18);
  border-radius: 8px;
  background: rgba(8, 23, 40, 0.76);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
}

.panel-section {
  padding: 14px;
}

.panel-section.compact {
  padding-bottom: 10px;
}

.section-head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.section-head h2 {
  margin: 0;
  font-size: 15px;
}

.layer-tree,
.legend-list {
  display: grid;
  gap: 10px;
}

.layer-row {
  gap: 9px;
  height: 32px;
  color: #d9e8f8;
  font-size: 13px;
}

.layer-dot,
.area {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.opacity-control {
  display: grid;
  grid-template-columns: 1fr 1.2fr auto;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
  color: #b8cbdf;
  font-size: 12px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.tool-btn {
  display: grid;
  place-items: center;
  gap: 4px;
  height: 66px;
  border: 1px solid rgba(119, 177, 242, 0.22);
  border-radius: 7px;
  color: #d7eaff;
  background: rgba(17, 45, 70, 0.74);
  cursor: pointer;
}

.tool-btn span {
  font-size: 22px;
}

.legend-item {
  gap: 8px;
  color: #c7d8e9;
  font-size: 13px;
}

.line {
  width: 32px;
  height: 0;
  border-top: 3px solid #56b7ff;
}

.line.dashed {
  border-top-style: dashed;
  border-color: #ffc857;
}

.area.admin {
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.26);
  outline: 1px solid rgba(255, 255, 255, 0.54);
}

.map-shell {
  position: relative;
  min-width: 0;
  overflow: hidden;
  border: 1px solid rgba(133, 188, 255, 0.22);
  border-radius: 8px;
  background: #10243a;
}

.map-view {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(30deg, rgba(42, 93, 117, 0.45) 12%, transparent 12% 20%, rgba(35, 87, 94, 0.38) 20% 34%, transparent 34%),
    #183a48;
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 5;
  transform: translate(-50%, -50%);
  color: #cfe7ff;
}

.map-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 64px 64px;
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
  background: #59bfff;
  transform: rotate(-8deg);
}

.rail-branch {
  left: 42%;
  top: 30%;
  width: 42%;
  border-top: 3px dashed #ffd166;
  transform: rotate(55deg);
}

.station-pin {
  position: absolute;
  display: grid;
  place-items: center;
  width: 54px;
  height: 54px;
  transform: translate(-50%, -50%);
  border: 3px solid #ffffff;
  border-radius: 50%;
  color: #041322;
  font-weight: 800;
  background: #28d3b2;
  box-shadow: 0 0 0 12px rgba(40, 211, 178, 0.16), 0 0 32px rgba(40, 211, 178, 0.66);
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
    radial-gradient(circle at 38% 35%, rgba(255, 50, 50, 0.85), transparent 20%),
    radial-gradient(circle at 55% 50%, rgba(255, 184, 77, 0.7), transparent 24%),
    radial-gradient(circle at 62% 72%, rgba(32, 140, 255, 0.64), transparent 30%);
}

.mass-block,
.heritage-model {
  position: absolute;
  width: 70px;
  min-height: 44px;
  transform: translate(-50%, -100%) skewY(-12deg);
  border: 1px solid rgba(255, 255, 255, 0.52);
  border-radius: 4px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 14px 14px 0 rgba(2, 8, 18, 0.26);
  cursor: pointer;
}

.mass-block.high {
  background: linear-gradient(180deg, #ff5757, #9b1c31);
}

.mass-block.medium {
  background: linear-gradient(180deg, #ffbd59, #9c6512);
}

.mass-block.low {
  background: linear-gradient(180deg, #43d39e, #177953);
}

.province-boundary {
  left: 46%;
  top: 14%;
  width: 2px;
  height: 72%;
  border-left: 3px dashed rgba(255, 255, 255, 0.72);
}

.flow-line {
  background: linear-gradient(90deg, transparent, #3cc7ff, #ffffff, transparent);
  animation: flowPulse 2.2s linear infinite;
  box-shadow: 0 0 18px rgba(60, 199, 255, 0.85);
  transform: rotate(var(--angle));
}

.break-point {
  position: absolute;
  width: 22px;
  height: 22px;
  transform: translate(-50%, -50%);
  border: 2px solid #fff;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 0 10px rgba(255, 59, 48, 0.2), 0 0 22px rgba(255, 59, 48, 0.8);
  cursor: pointer;
}

.lst-heat {
  background:
    radial-gradient(circle at 35% 58%, rgba(33, 196, 255, 0.76), transparent 24%),
    radial-gradient(circle at 52% 42%, rgba(52, 211, 153, 0.58), transparent 28%),
    radial-gradient(circle at 68% 36%, rgba(255, 111, 89, 0.72), transparent 22%);
}

.height-cylinder {
  position: absolute;
  left: 50%;
  top: 54%;
  display: grid;
  place-items: center;
  width: 250px;
  height: 150px;
  transform: translate(-50%, -50%) perspective(500px) rotateX(62deg);
  border: 3px solid rgba(255, 79, 79, 0.88);
  border-radius: 50%;
  background: rgba(255, 66, 66, 0.16);
  box-shadow: 0 0 44px rgba(255, 76, 76, 0.28) inset;
}

.height-cylinder span {
  transform: rotateX(-62deg);
  color: #ffd0d0;
  font-weight: 800;
}

.view-corridor {
  position: absolute;
  left: 43%;
  top: 49%;
  width: 35%;
  height: 22%;
  transform: skewX(-20deg);
  border: 1px solid rgba(116, 255, 166, 0.7);
  background: rgba(43, 213, 118, 0.28);
}

.heritage-model {
  width: 58px;
  background: linear-gradient(180deg, #7dd3fc, #256d8f);
}

.heritage-model.exceed {
  background: linear-gradient(180deg, #ff6b6b, #a5162d);
  box-shadow: 0 0 24px rgba(255, 70, 70, 0.78), 14px 14px 0 rgba(2, 8, 18, 0.26);
}

.popup-card {
  position: absolute;
  left: 22px;
  bottom: 54px;
  display: none;
  width: 240px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;
  background: rgba(4, 15, 28, 0.9);
  box-shadow: 0 12px 26px rgba(0, 0, 0, 0.32);
}

.popup-card.show {
  display: grid;
  gap: 6px;
}

.popup-card span {
  color: #bdd2e7;
  font-size: 12px;
}

.map-status {
  position: absolute;
  left: 16px;
  bottom: 14px;
  z-index: 3;
  display: flex;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  background: rgba(5, 15, 28, 0.72);
}

.map-status strong {
  color: #e9f6ff;
}

.station-card {
  padding: 18px;
}

.mode-kicker {
  color: #28d3b2;
  font-size: 12px;
  font-weight: 800;
}

.station-card h1 {
  margin: 8px 0 6px;
  font-size: 28px;
}

.station-card p {
  margin: 0;
  line-height: 1.6;
}

.bar-chart {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 52px 1fr 42px;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.bar-track {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.bar-track i,
.bar-track em {
  position: absolute;
  top: 0;
  height: 100%;
}

.bar-track i {
  left: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #35d3a4, #ffc857, #ff5a5f);
}

.bar-track em {
  width: 2px;
  background: #ffffff;
}

.gauge {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  border-radius: 8px;
  background: conic-gradient(from 220deg, #31d0aa 0 30%, #ffd166 30% 62%, #ff5a5f 62% 82%, transparent 82% 100%);
}

.gauge::after {
  content: '';
  position: absolute;
  inset: 36px;
  border-radius: 50%;
  background: #0b1d31;
}

.gauge strong,
.gauge span,
.needle {
  position: relative;
  z-index: 1;
}

.gauge strong {
  margin-top: 28px;
  font-size: 34px;
}

.gauge span {
  color: #ffb4b4;
  font-size: 13px;
}

.needle {
  position: absolute;
  width: 4px;
  height: 58px;
  transform: rotate(42deg);
  transform-origin: bottom center;
  background: #ffffff;
}

.list-link {
  display: block;
  width: 100%;
  height: 34px;
  margin-bottom: 8px;
  border: 1px solid rgba(116, 172, 232, 0.18);
  border-radius: 6px;
  color: #d9e9fa;
  text-align: left;
  background: rgba(21, 52, 78, 0.65);
  cursor: pointer;
}

.line-chart,
.area-chart,
.scatter-chart,
.radar-chart,
.vr-window {
  height: 150px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
}

.line-chart svg,
.area-chart svg {
  width: 100%;
  height: 100%;
}

.line-chart polyline {
  fill: none;
  stroke: #35c9ff;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.area-chart path {
  fill: rgba(47, 211, 139, 0.58);
  stroke: #76f7b2;
  stroke-width: 3;
}

.scatter-chart {
  position: relative;
}

.scatter-chart::before,
.scatter-chart::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.16);
}

.scatter-chart::before {
  left: 24px;
  right: 14px;
  bottom: 24px;
  height: 1px;
}

.scatter-chart::after {
  left: 24px;
  top: 16px;
  bottom: 24px;
  width: 1px;
}

.scatter-chart i {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ffca3a;
  box-shadow: 0 0 18px rgba(255, 202, 58, 0.7);
}

.radar-chart {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.radar-chart::before {
  content: '';
  width: 118px;
  height: 118px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background:
    linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.22) 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.22) 50%, transparent 51%);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
}

.radar-fill {
  position: absolute;
  width: 100px;
  height: 100px;
  clip-path: polygon(50% 8%, 86% 46%, 60% 88%, 20% 60%);
  background: rgba(44, 211, 178, 0.5);
}

.radar-chart span {
  position: absolute;
  color: #b9d4ee;
  font-size: 12px;
}

.radar-chart span:nth-of-type(1) {
  top: 10px;
}

.radar-chart span:nth-of-type(2) {
  right: 18px;
}

.radar-chart span:nth-of-type(3) {
  bottom: 10px;
}

.radar-chart span:nth-of-type(4) {
  left: 18px;
}

.vr-window {
  position: relative;
  overflow: hidden;
  background: linear-gradient(#8fd3ff 0 45%, #3a8569 45% 64%, #1f5a7a 64% 100%);
}

.vr-sky,
.vr-water {
  position: absolute;
  inset: 0;
}

.vr-sky {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
  animation: drift 5s linear infinite;
}

.vr-water {
  top: 64%;
  background: repeating-linear-gradient(170deg, rgba(255, 255, 255, 0.2) 0 2px, transparent 2px 12px);
}

.vr-window span {
  position: absolute;
  left: 12px;
  bottom: 10px;
  font-weight: 800;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
}

@keyframes flowPulse {
  from {
    background-position: -120px 0;
  }

  to {
    background-position: 260px 0;
  }
}

@keyframes drift {
  from {
    transform: translateX(-40%);
  }

  to {
    transform: translateX(40%);
  }
}

@media (max-width: 1180px) {
  .cockpit-header {
    grid-template-columns: 1fr;
    height: auto;
  }

  .header-tools {
    justify-content: flex-start;
  }

  .cockpit-body {
    grid-template-columns: 240px minmax(360px, 1fr);
  }

  .right-panel {
    display: none;
  }
}
</style>
