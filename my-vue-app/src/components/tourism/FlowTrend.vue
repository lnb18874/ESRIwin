<template>
  <section class="ink-card flow-trend">
    <div class="card-head">
      <h3>人流趋势</h3>
      <div class="legend-row">
        <span class="dot today"></span>今日
        <span class="dot yesterday"></span>昨日
        <span class="dot forecast"></span>预测
      </div>
    </div>
    <div ref="chartRef" class="chart-box" v-if="data"></div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { FlowTrend } from '@/types/tourism'

const props = defineProps<{
  data: FlowTrend | null
}>()

const chartRef = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null

const option = computed(() => {
  if (!props.data) return {}
  const hours = props.data.today.map((p) => p.hour)
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,252,245,0.95)',
      borderColor: '#dbd2c4',
      textStyle: { color: '#2c2c2c', fontSize: 12 },
    },
    legend: { show: false },
    grid: { top: 8, right: 12, bottom: 20, left: 38 },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: { lineStyle: { color: '#dbd2c4' } },
      axisTick: { show: false },
      axisLabel: { color: '#7a7268', fontSize: 10, interval: 3 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e8e0d4', type: 'dashed' } },
      axisLabel: { color: '#7a7268', fontSize: 10, formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v },
    },
    series: [
      {
        name: '今日',
        type: 'line',
        data: props.data.today.map((p) => p.visitors),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#2d5a4b', width: 2.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(45,90,75,0.22)' },
            { offset: 1, color: 'rgba(45,90,75,0.02)' },
          ]),
        },
      },
      {
        name: '昨日',
        type: 'line',
        data: props.data.yesterday.map((p) => p.visitors),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#94a3b8', width: 1.5, type: 'dashed' },
        areaStyle: { opacity: 0 },
      },
      {
        name: '预测',
        type: 'line',
        data: props.data.forecast.map((p) => p.visitors),
        smooth: true,
        symbol: 'none',
        lineStyle: { color: '#c47f3a', width: 1.5, type: 'dotted' },
        areaStyle: { opacity: 0 },
      },
    ],
  }
})

function initChart() {
  if (!chartRef.value) return
  instance = echarts.init(chartRef.value)
  instance.setOption(option.value)
}

watch(
  () => props.data,
  () => {
    if (!instance || !props.data) return
    instance.setOption(option.value, true)
  },
  { deep: true },
)

const resizeObserver = new ResizeObserver(() => {
  instance?.resize()
})

watch(chartRef, (el) => {
  if (el && props.data) {
    nextTick(() => {
      initChart()
      resizeObserver.observe(el)
    })
  }
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  instance?.dispose()
})
</script>

<style scoped>
.chart-box {
  width: 100%;
  height: 180px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 4px 12px;
  flex-wrap: wrap;
  font-size: 10px;
  color: var(--ink-text-secondary);
}

.legend-row .dot {
  width: 10px;
  height: 3px;
  border-radius: 2px;
  margin-right: -8px;
}

.dot.today { background: var(--ink-green); }
.dot.yesterday { background: #94a3b8; }
.dot.forecast { background: var(--ink-ochre); }

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
