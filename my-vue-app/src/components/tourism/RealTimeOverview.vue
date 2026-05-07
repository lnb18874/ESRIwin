<template>
  <section class="ink-card realtime-overview">
    <div class="card-head">
      <h3>实时概览</h3>
      <span class="head-kicker">更新于 {{ updateTime }}</span>
    </div>
    <div class="realtime-body" v-if="data">
      <div class="visitor-count">
        <span class="count-label">当前人数</span>
        <div class="count-number">
          <span
            v-for="(digit, i) in countDigits"
            :key="i"
            class="digit"
            :style="{ animationDelay: i * 0.03 + 's' }"
          >{{ digit }}</span>
        </div>
        <span class="count-unit">人</span>
      </div>
      <div class="capacity-bar-wrap">
        <div class="capacity-bar">
          <div
            class="capacity-fill"
            :class="data.crowdLevel"
            :style="{ width: loadPercent + '%' }"
          >
            <span class="water-ripple"></span>
          </div>
        </div>
        <div class="capacity-labels">
          <span>承载率 {{ loadPercent }}%</span>
          <span>上限 {{ formatNum(data.maxCapacity) }}</span>
        </div>
      </div>
      <div class="crowd-tag" :class="data.crowdLevel">
        {{ crowdLabel }}
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RealtimeOverview } from '@/types/tourism'

const props = defineProps<{
  data: RealtimeOverview | null
  crowdLabel: string
}>()

const countDigits = computed(() => {
  if (!props.data) return ['—']
  return String(props.data.currentVisitors).padStart(5, '0').split('')
})

const loadPercent = computed(() => {
  if (!props.data) return 0
  return Math.round(props.data.loadRate * 100)
})

const updateTime = computed(() => {
  if (!props.data) return '—'
  try {
    return new Date(props.data.updateTime).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return '—'
  }
})

function formatNum(n: number): string {
  return n >= 10000 ? (n / 10000).toFixed(1) + '万' : String(n)
}
</script>

<style scoped>
.realtime-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.visitor-count {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.count-label {
  font-size: 12px;
  color: var(--ink-text-secondary);
}

.count-number {
  display: flex;
  gap: 2px;
}

.digit {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 40px;
  border-radius: 4px;
  font-family: var(--ink-font-title);
  font-size: 28px;
  font-weight: 800;
  color: var(--ink-green);
  background: rgba(45, 90, 75, 0.06);
  animation: digitIn 0.4s ease both;
}

.count-unit {
  font-size: 13px;
  color: var(--ink-text-secondary);
  margin-left: 4px;
}

.capacity-bar-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.capacity-bar {
  height: 18px;
  border-radius: 999px;
  background: var(--ink-border-light);
  overflow: hidden;
  position: relative;
}

.capacity-fill {
  height: 100%;
  border-radius: inherit;
  position: relative;
  min-width: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.capacity-fill.comfortable {
  background: linear-gradient(90deg, var(--ink-green-light), #5a9e82);
}

.capacity-fill.moderate {
  background: linear-gradient(90deg, var(--ink-ochre-light), var(--ink-ochre));
}

.capacity-fill.crowded {
  background: linear-gradient(90deg, #e08050, #d46530);
}

.capacity-fill.full {
  background: linear-gradient(90deg, #d45050, var(--ink-red));
}

.water-ripple {
  position: absolute;
  right: 0;
  top: 0;
  width: 30px;
  height: 100%;
  background: rgba(255, 255, 255, 0.35);
  animation: ripple 1.5s ease-in-out infinite;
}

.capacity-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--ink-text-secondary);
}

.crowd-tag {
  align-self: flex-start;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.crowd-tag.comfortable {
  color: var(--ink-green);
  background: rgba(45, 90, 75, 0.08);
}

.crowd-tag.moderate {
  color: var(--ink-ochre);
  background: rgba(196, 127, 58, 0.08);
}

.crowd-tag.crowded {
  color: #d46530;
  background: rgba(212, 101, 48, 0.08);
}

.crowd-tag.full {
  color: var(--ink-red);
  background: rgba(196, 75, 75, 0.08);
}

.empty-state {
  text-align: center;
  padding: 28px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}

@keyframes digitIn {
  from {
    opacity: 0;
    transform: translateY(-14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ripple {
  0%, 100% { opacity: 0.2; transform: scaleX(0.6); }
  50% { opacity: 0.5; transform: scaleX(1); }
}
</style>
