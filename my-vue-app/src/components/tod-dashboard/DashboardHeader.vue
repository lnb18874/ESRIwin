<template>
  <header class="dashboard-header">
    <div class="brand">
      <div class="brand-mark">TOD</div>
      <div>
        <div class="system-title">长三角示范区 TOD 协同规划平台</div>
        <div class="system-subtitle">三维评估 · 风险预警 · 协同决策</div>
      </div>
    </div>

    <nav class="mode-tabs" aria-label="场景切换">
      <button
        v-for="m in modes"
        :key="m.key"
        class="mode-tab"
        :class="{ active: activeMode === m.key }"
        type="button"
        @click="$emit('change-mode', m.key)"
      >
        <span>{{ m.label }}</span>
        <small>{{ m.station }}</small>
      </button>
    </nav>

    <div class="header-tools">
      <!-- 时间轴控制 -->
      <div class="timeline-group">
        <label class="timeline">
          <span>InSAR 时间轴</span>
          <input
            type="range"
            :min="tl.minYear"
            :max="tl.maxYear"
            :value="tl.currentYear"
            @input="onTimelineInput"
          />
          <strong>{{ tl.currentYear }}</strong>
        </label>
        <div class="playback-controls">
          <button class="pb-btn" type="button" :title="tl.playing ? '暂停' : '播放'" @click="tl.togglePlay()">
            {{ tl.playing ? '⏸' : '▶' }}
          </button>
          <button
            v-for="s in [1, 2, 4]"
            :key="s"
            class="pb-btn speed"
            :class="{ active: tl.speed === s }"
            type="button"
            @click="tl.setSpeed(s)"
          >
            {{ s }}×
          </button>
        </div>
      </div>
      <button class="icon-btn" type="button" title="用户">U</button>
      <button class="icon-btn" type="button" title="关于">i</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { PlanningMode } from '@/stores/mainTabs'
import { useTimelineStore } from '@/stores/timeline'
import type { ModeConfig } from './types'

defineProps<{
  modes: ModeConfig[]
  activeMode: PlanningMode
}>()

const emit = defineEmits<{
  'change-mode': [mode: PlanningMode]
  'update:timeline': [value: number]
}>()

const tl = useTimelineStore()

function onTimelineInput(event: Event) {
  const val = Number((event.target as HTMLInputElement).value)
  tl.setYear(val)
  emit('update:timeline', val)
}
</script>

<style scoped>
.dashboard-header {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto minmax(260px, 1fr);
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  border-bottom: 1px solid #d7e2ee;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
}

.brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.brand-mark {
  display: grid; place-items: center; flex: 0 0 auto;
  width: 42px; height: 42px;
  border: 1px solid #7bb2f3; border-radius: 8px;
  color: #0f5cb8; font-weight: 800; background: #eef7ff;
}
.system-title { color: #132338; font-size: 18px; font-weight: 800; white-space: nowrap; }
.system-subtitle { color: #65768a; font-size: 11px; }

.mode-tabs {
  display: flex; align-items: center; gap: 6px;
  padding: 4px; border: 1px solid #d3dfec; border-radius: 8px; background: #f4f8fc;
}
.mode-tab {
  min-width: 100px; height: 46px; border: 0; border-radius: 6px;
  color: #475569; background: transparent; cursor: pointer;
}
.mode-tab span { display: block; font-size: 13px; font-weight: 700; }
.mode-tab small { display: block; font-size: 10px; color: #65768a; }
.mode-tab.active { color: #fff; background: #1769e0; box-shadow: 0 6px 16px rgba(23, 105, 224, 0.22); }
.mode-tab.active small { color: rgba(255, 255, 255, 0.78); }

.header-tools { display: flex; align-items: center; justify-content: flex-end; gap: 8px; }

.timeline-group {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 10px; border: 1px solid #d5e1ee; border-radius: 8px; background: #f8fbff;
}
.timeline { display: flex; align-items: center; gap: 6px; }
.timeline span { color: #65768a; font-size: 11px; white-space: nowrap; }
.timeline strong { font-size: 13px; color: #142033; min-width: 32px; }
input[type='range'] { accent-color: #1769e0; width: 80px; }

.playback-controls { display: flex; align-items: center; gap: 2px; }
.pb-btn {
  width: 26px; height: 26px; border: 1px solid #d5e1ee; border-radius: 4px;
  color: #1f3b57; background: #fff; cursor: pointer; font-size: 12px;
  display: grid; place-items: center; transition: all 0.15s;
}
.pb-btn:hover { border-color: #1769e0; color: #1769e0; }
.pb-btn.speed.active { background: #1769e0; color: #fff; border-color: #1769e0; }

.icon-btn {
  width: 32px; height: 32px; border: 1px solid #d5e1ee; border-radius: 6px;
  color: #1f3b57; background: #fff; cursor: pointer;
}

@media (max-width: 1180px) {
  .dashboard-header { grid-template-columns: 1fr; gap: 10px; }
  .mode-tabs { width: 100%; overflow-x: auto; }
  .header-tools { justify-content: flex-start; flex-wrap: wrap; }
}
@media (max-width: 768px) {
  .dashboard-header { padding: 8px 10px; gap: 8px; }
  .brand-mark { width: 36px; height: 36px; font-size: 12px; }
  .system-title { font-size: 15px; }
  .system-subtitle { display: none; }
  .mode-tab { min-width: 70px; height: 40px; }
  .mode-tab small { display: none; }
}
</style>
