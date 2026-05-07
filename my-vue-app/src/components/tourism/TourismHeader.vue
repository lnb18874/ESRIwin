<template>
  <header class="tourism-header">
    <div class="brand-area">
      <div class="brand-ink">
        <span class="ink-char">水</span>
      </div>
      <div class="brand-text">
        <h1>长三角示范区 · 水乡文旅</h1>
        <p>江南慢生活 · 一程山水一程歌</p>
      </div>
    </div>

    <nav class="scenic-tabs" aria-label="景区切换">
      <button
        v-for="spot in scenicList"
        :key="spot.id"
        class="scenic-tab"
        :class="{ active: spot.id === selectedId }"
        type="button"
        @click="$emit('select', spot.id)"
      >
        <span class="tab-name">{{ spot.name }}</span>
        <span class="tab-sub">{{ spot.subtitle }}</span>
      </button>
    </nav>

    <div class="header-extra">
      <span class="update-time" v-if="currentScenic">
        当前景区：{{ currentScenic.name }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { ScenicSpot } from '@/types/tourism'

defineProps<{
  scenicList: ScenicSpot[]
  selectedId: string
  currentScenic?: ScenicSpot
}>()

defineEmits<{
  select: [id: string]
}>()
</script>

<style scoped>
.tourism-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--ink-border);
  background: var(--ink-paper);
  backdrop-filter: blur(16px);
  flex-shrink: 0;
}

.brand-area {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brand-ink {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border: 2px solid var(--ink-green);
  border-radius: 50%;
  background: linear-gradient(135deg, #f0f7f4, #e8f0ea);
}

.ink-char {
  font-family: var(--ink-font-title);
  font-size: 22px;
  font-weight: 800;
  color: var(--ink-green);
}

.brand-text h1 {
  margin: 0;
  font-family: var(--ink-font-title);
  font-size: 20px;
  font-weight: 800;
  color: var(--ink-text);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

.brand-text p {
  margin: 2px 0 0;
  font-size: 11px;
  color: var(--ink-text-secondary);
  letter-spacing: 0.08em;
}

/* 景区Tab */
.scenic-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px;
  border: 1px solid var(--ink-border);
  border-radius: var(--ink-radius);
  background: rgba(245, 240, 232, 0.6);
  overflow-x: auto;
  justify-self: center;
}

.scenic-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 46px;
  padding: 0 12px;
  border: none;
  border-radius: var(--ink-radius-sm);
  color: var(--ink-text-secondary);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}

.scenic-tab .tab-name {
  font-family: var(--ink-font-title);
  font-size: 14px;
  font-weight: 700;
}

.scenic-tab .tab-sub {
  font-size: 10px;
  opacity: 0.7;
}

.scenic-tab:hover {
  color: var(--ink-green);
  background: rgba(45, 90, 75, 0.06);
}

.scenic-tab.active {
  color: #fff;
  background: linear-gradient(135deg, var(--ink-green-light), var(--ink-green));
  box-shadow: 0 6px 18px rgba(45, 90, 75, 0.22);
}

.scenic-tab.active .tab-sub {
  color: rgba(255, 255, 255, 0.78);
}

.header-extra {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.update-time {
  font-size: 12px;
  color: var(--ink-text-secondary);
}

@media (max-width: 1180px) {
  .tourism-header {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .scenic-tabs {
    width: 100%;
  }
  .header-extra {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .tourism-header {
    padding: 8px 10px;
    gap: 8px;
  }
  .brand-text h1 {
    font-size: 16px;
  }
  .brand-text p {
    display: none;
  }
  .scenic-tab {
    min-width: 56px;
    height: 40px;
    padding: 0 8px;
  }
  .scenic-tab .tab-name {
    font-size: 12px;
  }
  .scenic-tab .tab-sub {
    display: none;
  }
}
</style>
