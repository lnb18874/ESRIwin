<template>
  <aside class="analysis-panel">
    <section class="station-card">
      <span class="mode-kicker">{{ mode.badge }}</span>
      <h1>{{ mode.station }}</h1>
      <p>{{ mode.focus }}</p>
    </section>

    <!-- ========== 商务型 ========== -->
    <template v-if="activeMode === 'business'">
      <section class="panel-card">
        <div class="section-head">
          <h2>FAR 开发强度评估</h2>
          <span>容积率 / 沉降风险</span>
        </div>
        <div ref="farChartRef" class="echart-box"></div>
      </section>

      <section class="panel-card">
        <div class="section-head">
          <h2>沉降风险监测</h2>
          <span>mm/月</span>
        </div>
        <div ref="insarGaugeRef" class="echart-box" style="height:170px"></div>
      </section>

      <section class="panel-card compact">
        <div class="section-head"><h2>高危风险点</h2></div>
        <button
          v-for="parcel in highRiskParcels"
          :key="parcel.id"
          class="list-link"
          type="button"
        >
          {{ parcel.name }} · FAR {{ parcel.currentFAR }} · 沉降 {{ parcel.subsidenceRate }}mm/月
        </button>
      </section>
    </template>

    <!-- ========== 枢纽商圈型 ========== -->
    <template v-if="activeMode === 'hub'">
      <section class="panel-card">
        <div class="section-head">
          <h2>职住平衡 · 24h 人口潮汐</h2>
          <span>熵值 {{ hubStore.balance?.entropy?.toFixed(2) ?? '—' }}</span>
        </div>
        <div ref="balanceChartRef" class="echart-box"></div>
      </section>

      <section class="panel-card">
        <div class="section-head">
          <h2>跨城消费引力</h2>
          <span>距离 / 消费指数</span>
        </div>
        <div ref="scatterChartRef" class="echart-box"></div>
      </section>

      <section class="panel-card compact">
        <div class="section-head"><h2>慢行断点</h2></div>
        <button
          v-for="bp in hubStore.breakPoints.slice(0, 5)"
          :key="bp.id"
          class="list-link"
          type="button"
        >
          <span class="bp-priority" :class="bp.priority">{{ priorityLabel(bp.priority) }}</span>
          {{ bp.name }} · 绕行{{ bp.detourDistance }}m
        </button>
      </section>
    </template>

    <!-- ========== 水乡文旅型 ========== -->
    <template v-if="activeMode === 'water'">
      <section class="panel-card">
        <div class="section-head">
          <h2>视域保护度</h2>
          <span>雷达</span>
        </div>
        <div class="radar-chart">
          <div class="radar-fill"></div>
          <span>限高</span><span>通廊</span><span>风貌</span><span>可视</span>
        </div>
      </section>

      <section class="panel-card">
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

      <section class="panel-card compact">
        <div class="section-head"><h2>实景 VR 漫游</h2></div>
        <div class="vr-window">
          <div class="vr-sky"></div>
          <div class="vr-water"></div>
          <span>水乡客厅风貌预览</span>
        </div>
      </section>

      <button class="tourism-link" type="button" @click="goTourism">
        查看完整文旅数据 →
      </button>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import type { PlanningMode } from '@/stores/mainTabs'
import { useBusinessStore } from '@/stores/business'
import { useHubStore } from '@/stores/hub'
import type { ModeConfig } from './types'

const props = defineProps<{
  mode: ModeConfig
  activeMode: PlanningMode
}>()

const router = useRouter()
const businessStore = useBusinessStore()
const hubStore = useHubStore()

function goTourism() { router.push('/tourism') }

// ---------- ECharts refs ----------
const farChartRef = ref<HTMLDivElement>()
const insarGaugeRef = ref<HTMLDivElement>()
const balanceChartRef = ref<HTMLDivElement>()
const scatterChartRef = ref<HTMLDivElement>()

let farInstance: echarts.ECharts | null = null
let insarGaugeInstance: echarts.ECharts | null = null
let balanceInstance: echarts.ECharts | null = null
let scatterInstance: echarts.ECharts | null = null

const resizeObserver = new ResizeObserver(() => {
  farInstance?.resize()
  insarGaugeInstance?.resize()
  balanceInstance?.resize()
  scatterInstance?.resize()
})

// ---------- 商务型图表 ----------
function getFarOption() {
  const parcels = businessStore.parcels
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.94)', borderColor: '#d9e4ef', textStyle: { color: '#142033', fontSize: 12 } },
    grid: { top: 4, right: 30, bottom: 20, left: 38 },
    xAxis: { type: 'category', data: parcels.map(p => p.name), axisLabel: { fontSize: 11, color: '#64748b' }, axisLine: { lineStyle: { color: '#d9e4ef' } } },
    yAxis: { type: 'value', name: 'FAR', splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } }, axisLabel: { fontSize: 10, color: '#64748b' } },
    series: [
      {
        data: parcels.map(p => ({
          value: p.currentFAR,
          itemStyle: { color: p.recommendation === 'restrict' ? '#ef4444' : p.recommendation === 'caution' ? '#f59e0b' : '#22c55e' },
        })),
        type: 'bar', barWidth: 20, backgroundStyle: { color: '#e2e8f0', borderRadius: [4, 4, 0, 0] },
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      },
      {
        type: 'line',
        data: parcels.map(p => p.allowedFAR),
        lineStyle: { color: '#0f172a', width: 2, type: 'dashed' },
        symbol: 'none',
        markLine: {
          silent: true,
          lineStyle: { color: '#0f172a', type: 'dashed' },
          data: [{ yAxis: parcels[0]?.allowedFAR ?? 5.8, label: { formatter: '限高', fontSize: 10 } }],
        },
      },
    ],
  }
}

function getInsarGaugeOption() {
  const points = businessStore.insarPoints
  const maxRate = Math.max(...points.map(p => p.subsidenceRate), 10)
  const dangerCount = points.filter(p => p.riskLevel === 'danger').length
  return {
    series: [
      {
        type: 'gauge', radius: '90%', center: ['50%', '55%'],
        startAngle: 210, endAngle: -30,
        min: 0, max: maxRate + 2,
        axisLine: {
          lineStyle: {
            width: 16,
            color: [[0.4, '#22c55e'], [0.7, '#f59e0b'], [1, '#ef4444']],
          },
        },
        pointer: { length: '60%', width: 5, itemStyle: { color: '#0f172a' } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { fontSize: 10, color: '#64748b', distance: -36 },
        detail: {
          valueAnimation: true, fontSize: 20, color: '#142033', offsetCenter: [0, '70%'],
          formatter: () => `${dangerCount}个高危`,
        },
        data: [{ value: dangerCount > 0 ? (maxRate * 0.8 + dangerCount * 0.5) : maxRate * 0.3, name: '风险等级' }],
      },
    ],
  }
}

// ---------- 枢纽型图表 ----------
function getBalanceOption() {
  const bal = hubStore.balance
  if (!bal) return {}
  const hours = bal.hourlyDistribution.map(d => d.hour.replace(':00', ''))
  const pops = bal.hourlyDistribution.map(d => d.pop)
  return {
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(255,255,255,0.94)', borderColor: '#d9e4ef', textStyle: { color: '#142033', fontSize: 12 } },
    grid: { top: 8, right: 12, bottom: 20, left: 44 },
    xAxis: { type: 'category', data: hours, axisLabel: { fontSize: 10, color: '#64748b', interval: 3 }, axisLine: { lineStyle: { color: '#d9e4ef' } } },
    yAxis: { type: 'value', name: '人', axisLabel: { fontSize: 10, color: '#64748b', formatter: (v: number) => v >= 10000 ? `${(v / 10000).toFixed(0)}万` : v }, splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } } },
    series: [{
      data: pops, type: 'line', smooth: true, symbol: 'none',
      lineStyle: { color: '#0ea5e9', width: 2.5 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(14,165,233,0.22)' }, { offset: 1, color: 'rgba(14,165,233,0.02)' },
        ]),
      },
      markLine: {
        silent: true, symbol: 'none',
        lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
        data: [{ yAxis: 185000, label: { formatter: '居住人口', fontSize: 10 } }],
      },
    }],
  }
}

function getScatterOption() {
  const rad = hubStore.radiation
  if (!rad) return {}
  const scatterData = [
    { name: '花桥·餐饮', x: 0.8, y: rad.formatMix.dining, value: '餐饮' },
    { name: '花桥·零售', x: 1.2, y: rad.formatMix.retail, value: '零售' },
    { name: '花桥·服务', x: 1.5, y: rad.formatMix.service, value: '服务' },
    { name: '花桥·娱乐', x: 0.6, y: rad.formatMix.entertainment, value: '娱乐' },
    { name: '太仓·餐饮', x: 2.1, y: 42, value: '餐饮' },
    { name: '太仓·零售', x: 2.4, y: 35, value: '零售' },
  ]
  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.94)',
      borderColor: '#d9e4ef',
      textStyle: { color: '#142033', fontSize: 12 },
      formatter: (p: any) => `${p.name}<br/>距离系数: ${p.data[0]}<br/>占比: ${p.data[1]}%`,
    },
    grid: { top: 8, right: 14, bottom: 24, left: 38 },
    xAxis: { type: 'value', name: '距离系数', axisLabel: { fontSize: 10, color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } } },
    yAxis: { type: 'value', name: '占比 %', axisLabel: { fontSize: 10, color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } } },
    series: [{
      type: 'scatter',
      data: scatterData.map(d => [d.x, d.y]),
      symbolSize: (val: number[]) => Math.max((val[1] ?? 0) * 0.4, 10),
      itemStyle: {
        color: (p: any) => p.data[1] > 35 ? '#f59e0b' : '#0ea5e9',
        shadowBlur: 12,
        shadowColor: 'rgba(245,158,11,0.3)',
      },
      label: { show: true, formatter: (p: any) => scatterData[p.dataIndex]?.value ?? '', fontSize: 10 },
    }],
  }
}

// ---------- 辅助 ----------
const highRiskParcels = computed(() =>
  businessStore.parcels.filter(p => p.riskScore >= 50)
)

function priorityLabel(p: string) {
  const m: Record<string, string> = { critical: '紧急', high: '高', medium: '中', low: '低' }
  return m[p] ?? p
}

// ---------- 图表生命周期 ----------
function initFarChart() {
  if (!farChartRef.value || !businessStore.parcels.length) return
  farInstance = echarts.init(farChartRef.value)
  farInstance.setOption(getFarOption())
  resizeObserver.observe(farChartRef.value)
}
function initInsarGauge() {
  if (!insarGaugeRef.value || !businessStore.insarPoints.length) return
  insarGaugeInstance = echarts.init(insarGaugeRef.value)
  insarGaugeInstance.setOption(getInsarGaugeOption())
  resizeObserver.observe(insarGaugeRef.value)
}
function initBalanceChart() {
  if (!balanceChartRef.value || !hubStore.balance) return
  balanceInstance = echarts.init(balanceChartRef.value)
  balanceInstance.setOption(getBalanceOption())
  resizeObserver.observe(balanceChartRef.value)
}
function initScatterChart() {
  if (!scatterChartRef.value || !hubStore.radiation) return
  scatterInstance = echarts.init(scatterChartRef.value)
  scatterInstance.setOption(getScatterOption())
  resizeObserver.observe(scatterChartRef.value)
}

function destroyAll() {
  farInstance?.dispose(); farInstance = null
  insarGaugeInstance?.dispose(); insarGaugeInstance = null
  balanceInstance?.dispose(); balanceInstance = null
  scatterInstance?.dispose(); scatterInstance = null
}

// Watch stores for data arrival
watch(() => businessStore.parcels, (val) => { if (val.length) { destroyAll(); nextTick(initFarChart) } })
watch(() => businessStore.insarPoints, (val) => { if (val.length) nextTick(initInsarGauge) })
watch(() => hubStore.balance, (val) => { if (val) nextTick(initBalanceChart) })
watch(() => hubStore.radiation, (val) => { if (val) nextTick(initScatterChart) })

// Re-init on mode switch (after data may have loaded)
watch(() => props.activeMode, (mode) => {
  destroyAll()
  nextTick(() => {
    if (mode === 'business') { initFarChart(); initInsarGauge() }
    if (mode === 'hub') { initBalanceChart(); initScatterChart() }
  })
})

onBeforeUnmount(() => { destroyAll(); resizeObserver.disconnect() })
</script>

<style scoped>
.analysis-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.panel-card,
.station-card {
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(29, 53, 87, 0.08);
}

.panel-card { padding: 14px; }
.compact { padding-bottom: 10px; }
.station-card { padding: 18px; }

.mode-kicker { color: #1769e0; font-size: 12px; font-weight: 800; }
.station-card h1 { margin: 8px 0 6px; color: #142033; font-size: clamp(22px, 3vw, 28px); }
.station-card p { margin: 0; color: #64748b; font-size: 13px; line-height: 1.6; }

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}
.section-head h2 { margin: 0; color: #142033; font-size: 15px; }
.section-head span { color: #64748b; font-size: 12px; }

.echart-box { width: 100%; height: 150px; }

.list-link {
  display: flex; align-items: center; gap: 8px;
  width: 100%;
  min-height: 36px;
  margin-bottom: 6px;
  padding: 6px 10px;
  border: 1px solid #d7e3ef;
  border-radius: 6px;
  color: #1f3b57;
  font-size: 12px;
  text-align: left;
  background: #f8fbff;
  cursor: pointer;
  transition: background 0.2s;
}
.list-link:hover { background: #eef4fa; }

.bp-priority {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
}
.bp-priority.critical { color: #fff; background: #ef4444; }
.bp-priority.high { color: #fff; background: #f59e0b; }
.bp-priority.medium { color: #fff; background: #64748b; }
.bp-priority.low { color: #334155; background: #e2e8f0; }

/* ---- 水乡模式保留样式 ---- */
.radar-chart {
  position: relative; display: grid; place-items: center;
  height: 150px; border-radius: 8px; background: #f4f8fc; overflow: hidden;
}
.radar-chart::before {
  content: ''; width: 118px; height: 118px; border: 1px solid #cbd5e1;
  background:
    linear-gradient(45deg, transparent 49%, #d6dee8 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, #d6dee8 50%, transparent 51%);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
}
.radar-fill {
  position: absolute; width: 100px; height: 100px;
  clip-path: polygon(50% 8%, 86% 46%, 60% 88%, 20% 60%);
  background: rgba(23, 105, 224, 0.32);
}
.radar-chart span {
  position: absolute; color: #475569; font-size: 12px;
}
.radar-chart span:nth-of-type(1) { top: 10px; }
.radar-chart span:nth-of-type(2) { right: 18px; }
.radar-chart span:nth-of-type(3) { bottom: 10px; }
.radar-chart span:nth-of-type(4) { left: 18px; }

.area-chart, .vr-window {
  height: 150px; border-radius: 8px; background: #f4f8fc;
}
.area-chart svg { width: 100%; height: 100%; }
.area-chart path {
  fill: rgba(34, 197, 94, 0.36);
  stroke: #16a34a; stroke-width: 3;
}

.vr-window {
  position: relative; overflow: hidden;
  background: linear-gradient(#bfe8ff 0 45%, #72b596 45% 64%, #6bb9df 64% 100%);
}
.vr-sky { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.58), transparent); animation: drift 5s linear infinite; }
.vr-water { position: absolute; top: 64%; inset: 0; background: repeating-linear-gradient(170deg, rgba(255,255,255,0.42) 0 2px, transparent 2px 12px); }
.vr-window span { position: absolute; left: 12px; bottom: 10px; color: #123044; font-weight: 800; }

.tourism-link {
  display: block; width: 100%; padding: 10px 0;
  border: 1px solid #2d5a4b; border-radius: 8px;
  color: #2d5a4b; font-size: 14px; font-weight: 700;
  background: rgba(45, 90, 75, 0.04);
  cursor: pointer; transition: all 0.25s;
}
.tourism-link:hover { color: #fff; background: #2d5a4b; }

@keyframes drift { from { transform: translateX(-40%); } to { transform: translateX(40%); } }

@media (max-width: 980px) { .analysis-panel { gap: 10px; } .panel-card { padding: 12px; } }
@media (max-width: 768px) { .analysis-panel { gap: 8px; } .panel-card { padding: 10px; } .section-head h2 { font-size: 14px; } .list-link { font-size: 12px; padding: 8px; } }
@media (max-width: 480px) { .analysis-panel { gap: 8px; } .panel-card { padding: 8px; } .station-card { padding: 8px; } .section-head h2 { font-size: 13px; } .list-link { font-size: 11px; padding: 6px; } }
</style>
