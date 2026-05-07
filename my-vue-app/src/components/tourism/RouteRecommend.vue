<template>
  <section class="ink-card route-recommend">
    <div class="card-head">
      <h3>特色路线推荐</h3>
      <span class="head-kicker">{{ data.length }}条路线</span>
    </div>
    <div class="route-list" v-if="data.length">
      <div v-for="route in data" :key="route.id" class="route-item">
        <div class="r-top">
          <span class="r-theme">{{ route.theme }}</span>
          <span class="r-title">{{ route.title }}</span>
        </div>
        <div class="r-meta">
          <span>⏱ {{ route.duration }}</span>
          <span>📏 {{ route.distance }}</span>
          <span class="r-diff" :class="route.difficulty">
            {{ route.difficulty === 'easy' ? '轻松' : '适中' }}
          </span>
        </div>
        <div class="r-stops">
          <div class="stop-dot-line"></div>
          <div class="stop-items">
            <div v-for="(stop, i) in route.stops" :key="i" class="stop-item">
              <span class="stop-dot"></span>
              <div>
                <span class="stop-name">{{ stop.name }}</span>
                <span class="stop-desc">{{ stop.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { TourRoute } from '@/types/tourism'

defineProps<{
  data: TourRoute[]
}>()
</script>

<style scoped>
.route-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.route-item {
  padding: 10px;
  border: 1px solid var(--ink-border-light);
  border-radius: var(--ink-radius-sm);
  transition: box-shadow 0.2s;
}

.route-item:hover {
  box-shadow: 0 4px 12px var(--ink-shadow);
}

.r-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.r-theme {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--ink-ochre);
  background: rgba(196, 127, 58, 0.06);
  white-space: nowrap;
}

.r-title {
  font-size: 13px;
  font-weight: 700;
}

.r-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--ink-text-secondary);
}

.r-diff {
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 10px;
}

.r-diff.easy {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.06);
}

.r-diff.moderate {
  color: var(--ink-ochre);
  background: rgba(196, 127, 58, 0.06);
}

.r-stops {
  position: relative;
  padding-left: 14px;
}

.stop-dot-line {
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: linear-gradient(180deg, var(--ink-green), var(--ink-border));
}

.stop-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stop-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
}

.stop-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-top: 4px;
  border-radius: 50%;
  background: var(--ink-green);
  box-shadow: 0 0 0 3px rgba(45, 90, 75, 0.12);
}

.stop-name {
  font-size: 12px;
  font-weight: 600;
}

.stop-desc {
  display: block;
  font-size: 11px;
  color: var(--ink-text-secondary);
}

.empty-state {
  text-align: center;
  padding: 16px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
