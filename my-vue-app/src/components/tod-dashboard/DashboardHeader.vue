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
        v-for="mode in modes"
        :key="mode.key"
        class="mode-tab"
        :class="{ active: activeMode === mode.key }"
        type="button"
        @click="$emit('change-mode', mode.key)"
      >
        <span>{{ mode.label }}</span>
        <small>{{ mode.station }}</small>
      </button>
    </nav>

    <div class="header-tools">
      <label class="timeline">
        <span>InSAR 时间轴</span>
        <input :value="timeline" type="range" min="2019" max="2026" @input="updateTimeline" />
        <strong>{{ timeline }}</strong>
      </label>
      <button class="icon-btn" type="button" title="用户">U</button>
      <button class="icon-btn" type="button" title="关于">i</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { PlanningMode } from '@/stores/mainTabs'
import type { ModeConfig } from './types'

defineProps<{
  modes: ModeConfig[]
  activeMode: PlanningMode
  timeline: number
}>()

const emit = defineEmits<{
  'change-mode': [mode: PlanningMode]
  'update:timeline': [value: number]
}>()

const updateTimeline = (event: Event) => {
  emit('update:timeline', Number((event.target as HTMLInputElement).value))
}
</script>

<style scoped>
.dashboard-header {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) auto minmax(260px, 1fr);
  align-items: center;
  gap: 16px;
  padding: 12px 18px;
  border-bottom: 1px solid #d7e2ee;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
}

.brand,
.mode-tabs,
.header-tools,
.timeline {
  display: flex;
  align-items: center;
}

.brand {
  gap: 12px;
  min-width: 0;
}

.brand-mark {
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  border: 1px solid #7bb2f3;
  border-radius: 8px;
  color: #0f5cb8;
  font-weight: 800;
  background: #eef7ff;
}

.system-title {
  color: #132338;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0;
  white-space: nowrap;
}

.system-subtitle,
.mode-tab small,
.timeline span {
  color: #65768a;
  font-size: 12px;
}

.mode-tabs {
  gap: 8px;
  padding: 5px;
  border: 1px solid #d3dfec;
  border-radius: 8px;
  background: #f4f8fc;
}

.mode-tab {
  min-width: 112px;
  height: 48px;
  border: 0;
  border-radius: 6px;
  color: #475569;
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
  background: #1769e0;
  box-shadow: 0 8px 18px rgba(23, 105, 224, 0.22);
}

.mode-tab.active small {
  color: rgba(255, 255, 255, 0.78);
}

.header-tools {
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
}

.timeline {
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid #d5e1ee;
  border-radius: 8px;
  background: #f8fbff;
}

input[type='range'] {
  accent-color: #1769e0;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 1px solid #d5e1ee;
  border-radius: 7px;
  color: #1f3b57;
  background: #ffffff;
  cursor: pointer;
}

@media (max-width: 1180px) {
  .dashboard-header {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .mode-tabs {
    width: 100%;
    overflow-x: auto;
  }

  .header-tools {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .system-title {
    white-space: normal;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 10px 12px;
    gap: 10px;
  }

  .brand {
    gap: 10px;
    min-width: 0;
    flex: 0 1 auto;
  }

  .brand-mark {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }

  .system-title {
    font-size: 16px;
  }

  .system-subtitle {
    display: none;
  }

  .mode-tabs {
    gap: 6px;
    padding: 4px;
  }

  .mode-tab {
    min-width: 90px;
    height: 44px;
    font-size: 13px;
  }

  .mode-tab small {
    font-size: 10px;
  }

  .timeline {
    flex-wrap: wrap;
    gap: 6px;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 8px 10px;
    gap: 8px;
  }

  .brand {
    min-width: 0;
  }

  .brand-mark {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }

  .system-title {
    font-size: 14px;
    font-weight: 700;
  }

  .mode-tabs {
    gap: 4px;
    padding: 3px;
    border-radius: 6px;
  }

  .mode-tab {
    min-width: 70px;
    height: 40px;
    font-size: 11px;
    padding: 4px 6px;
  }

  .mode-tab span {
    font-size: 12px;
  }

  .mode-tab small {
    font-size: 9px;
    display: none;
  }

  .timeline span {
    display: none;
  }

  .timeline input {
    width: 80px;
  }

  .icon-btn {
    width: 30px;
    height: 30px;
    font-size: 11px;
  }
}
</style>
