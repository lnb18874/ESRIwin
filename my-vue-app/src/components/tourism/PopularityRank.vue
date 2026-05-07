<template>
  <section class="ink-card popularity-rank">
    <div class="card-head">
      <h3>热门排行</h3>
      <span class="head-kicker">实时热度</span>
    </div>
    <TransitionGroup name="rank" tag="ol" class="rank-list" v-if="data.length">
      <li
        v-for="item in data"
        :key="item.scenicId"
        class="rank-item"
        :class="{ current: item.scenicId === selectedId, top: item.rank <= 3 }"
        @click="$emit('select', item.scenicId)"
      >
        <span class="rank-num" :class="'r' + item.rank">{{ item.rank }}</span>
        <span class="rank-name">{{ item.name }}</span>
        <span class="rank-change" :class="item.change">
          {{ changeIcon(item.change) }}
        </span>
        <span class="rank-hot">{{ item.hotIndex }}°</span>
      </li>
    </TransitionGroup>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { HotRanking } from '@/types/tourism'

defineProps<{
  data: HotRanking[]
  selectedId: string
}>()

defineEmits<{
  select: [id: string]
}>()

function changeIcon(c: HotRanking['change']): string {
  if (c === 'up') return '↑'
  if (c === 'down') return '↓'
  return '—'
}
</script>

<style scoped>
.rank-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0;
  margin: 0;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: var(--ink-radius-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.rank-item:hover,
.rank-item.current {
  background: rgba(45, 90, 75, 0.05);
}

.rank-item.current {
  outline: 1px solid var(--ink-green-light);
}

.rank-num {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 800;
  color: var(--ink-text-secondary);
  background: var(--ink-border-light);
}

.rank-num.r1,
.rank-num.r2,
.rank-num.r3 {
  color: #fff;
}

.rank-num.r1 { background: linear-gradient(135deg, #f59e0b, #e67e00); }
.rank-num.r2 { background: linear-gradient(135deg, #94a3b8, #64748b); }
.rank-num.r3 { background: linear-gradient(135deg, #cd853f, #a0522d); }

.rank-name {
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-change {
  font-size: 12px;
  width: 20px;
  text-align: center;
}

.rank-change.up { color: #16a34a; }
.rank-change.down { color: var(--ink-red); }
.rank-change.same { color: var(--ink-text-secondary); }

.rank-hot {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink-ochre);
  min-width: 40px;
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}

/* FLIP 过渡动画 */
.rank-enter-active,
.rank-leave-active {
  transition: all 0.4s ease;
}

.rank-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.rank-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.rank-move {
  transition: transform 0.4s ease;
}
</style>
