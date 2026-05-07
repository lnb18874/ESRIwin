<template>
  <section class="ink-card heritage-showcase">
    <div class="card-head">
      <h3>非遗文化展示</h3>
      <span class="head-kicker">{{ data.length }}项</span>
    </div>
    <div class="heritage-scroll" v-if="data.length">
      <div class="heritage-card" v-for="item in data" :key="item.id">
        <div class="h-image-placeholder">
          <span class="h-icon">{{ categoryIcon(item.category) }}</span>
        </div>
        <div class="h-info">
          <div class="h-name-row">
            <span class="h-name">{{ item.name }}</span>
            <span class="h-level" :class="item.level">{{ levelLabel(item.level) }}</span>
          </div>
          <p class="h-desc">{{ item.description }}</p>
          <span class="h-inheritor">传承人：{{ item.inheritor }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { HeritageItem } from '@/types/tourism'

defineProps<{
  data: HeritageItem[]
}>()

function categoryIcon(c: string): string {
  const m: Record<string, string> = { '传统技艺': '🪡', '民俗': '🎭', '曲艺': '🎵', '传统音乐': '🎶', '传统美术': '🎨' }
  return m[c] ?? '📜'
}

function levelLabel(l: HeritageItem['level']): string {
  const m: Record<string, string> = { national: '国家级', provincial: '省级', municipal: '市级' }
  return m[l] ?? l
}
</script>

<style scoped>
.heritage-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 4px;
}

.heritage-scroll::-webkit-scrollbar {
  height: 3px;
}

.heritage-scroll::-webkit-scrollbar-thumb {
  background: var(--ink-border);
  border-radius: 2px;
}

.heritage-card {
  flex: 0 0 200px;
  scroll-snap-align: start;
  border: 1px solid var(--ink-border-light);
  border-radius: var(--ink-radius-sm);
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.heritage-card:hover {
  box-shadow: 0 6px 18px var(--ink-shadow);
}

.h-image-placeholder {
  height: 80px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, rgba(45,90,75,0.04), rgba(126,184,201,0.06));
}

.h-icon {
  font-size: 28px;
}

.h-info {
  padding: 8px 10px;
}

.h-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.h-name {
  font-size: 13px;
  font-weight: 700;
}

.h-level {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 3px;
}

.h-level.national { color: #b45309; background: rgba(180,83,9,0.08); }
.h-level.provincial { color: var(--ink-green); background: rgba(45,90,75,0.06); }
.h-level.municipal { color: var(--ink-text-secondary); background: rgba(122,114,104,0.06); }

.h-desc {
  margin: 0 0 4px;
  font-size: 11px;
  color: var(--ink-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.h-inheritor {
  font-size: 11px;
  color: var(--ink-ochre);
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
