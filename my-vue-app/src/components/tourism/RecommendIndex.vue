<template>
  <section class="ink-card recommend-index">
    <div class="card-head">
      <h3>推荐指数</h3>
      <span class="head-kicker">{{ overall }}分</span>
    </div>
    <div v-if="data" class="recommend-body">
      <div ref="radarRef" class="radar-box"></div>
      <div class="overall-ring">
        <svg viewBox="0 0 100 100" class="ring-svg">
          <circle cx="50" cy="50" r="42" class="ring-bg" />
          <circle
            cx="50" cy="50" r="42"
            class="ring-fill"
            :style="{ strokeDasharray: overall * 2.64 + ' 264' }"
          />
        </svg>
        <span class="ring-num">{{ overall }}</span>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import * as echarts from 'echarts'
import type { RecommendIndex } from '@/types/tourism'

const props = defineProps<{
  data: RecommendIndex | null
}>()

const radarRef = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null

const overall = computed(() => props.data?.overall ?? 0)

const option = computed(() => {
  if (!props.data) return {}
  const d = props.data.dimensions
  return {
    radar: {
      center: ['50%', '50%'],
      radius: '65%',
      indicator: [
        { name: '风景', max: 100 },
        { name: '文化', max: 100 },
        { name: '服务', max: 100 },
        { name: '交通', max: 100 },
        { name: '性价比', max: 100 },
        { name: '独特性', max: 100 },
      ],
      axisName: { color: '#7a7268', fontSize: 11 },
      splitArea: {
        areaStyle: { color: ['rgba(45,90,75,0.02)', 'rgba(45,90,75,0.04)'] },
      },
      splitLine: { lineStyle: { color: '#e8e0d4' } },
      axisLine: { lineStyle: { color: '#dbd2c4' } },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [d.scenery, d.culture, d.service, d.accessibility, d.value, d.uniqueness],
            name: '推荐维度',
            areaStyle: { color: 'rgba(45,90,75,0.2)' },
            lineStyle: { color: '#2d5a4b', width: 2 },
            itemStyle: { color: '#2d5a4b' },
          },
        ],
      },
    ],
  }
})

watch(
  () => props.data,
  () => {
    if (!instance || !props.data) return
    instance.setOption(option.value, true)
  },
  { deep: true },
)

const resizeObserver = new ResizeObserver(() => instance?.resize())

watch(radarRef, (el) => {
  if (el && props.data) {
    nextTick(() => {
      instance = echarts.init(el)
      instance.setOption(option.value)
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
.recommend-body {
  display: grid;
  grid-template-columns: 1fr 80px;
  align-items: center;
  gap: 4px;
}

.radar-box {
  width: 100%;
  height: 180px;
}

.overall-ring {
  display: grid;
  place-items: center;
  position: relative;
}

.ring-svg {
  width: 70px;
  height: 70px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--ink-border-light);
  stroke-width: 6;
}

.ring-fill {
  fill: none;
  stroke: var(--ink-green);
  stroke-width: 6;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.ring-num {
  position: absolute;
  font-family: var(--ink-font-title);
  font-size: 22px;
  font-weight: 800;
  color: var(--ink-green);
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
