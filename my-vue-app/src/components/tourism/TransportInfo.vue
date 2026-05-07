<template>
  <section class="ink-card transport-info">
    <div class="card-head">
      <h3>交通接驳</h3>
      <span class="head-kicker">实时状态</span>
    </div>
    <div class="transport-list" v-if="data.length">
      <div v-for="item in data" :key="item.type + item.name" class="transport-item">
        <span class="t-icon">{{ typeIcon(item.type) }}</span>
        <div class="t-info">
          <span class="t-name">{{ item.name }}</span>
          <span class="t-detail">{{ item.detail }}</span>
        </div>
        <span class="t-status" :class="item.status">{{ statusLabel(item.status) }}</span>
        <span class="t-dist">{{ item.distance }}</span>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { TransportItem } from '@/types/tourism'

defineProps<{
  data: TransportItem[]
}>()

function typeIcon(t: TransportItem['type']): string {
  const m: Record<string, string> = {
    metro: '🚇',
    bus: '🚌',
    parking: '🅿',
    bike: '🚲',
    taxi: '🚕',
    ferry: '⛴',
  }
  return m[t] ?? '📍'
}

function statusLabel(s: TransportItem['status']): string {
  const m: Record<string, string> = {
    normal: '正常',
    busy: '繁忙',
    limited: '有限',
  }
  return m[s] ?? s
}
</script>

<style scoped>
.transport-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.transport-item {
  display: grid;
  grid-template-columns: 24px 1fr auto auto;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--ink-radius-sm);
  transition: background 0.2s;
}

.transport-item:hover {
  background: rgba(45, 90, 75, 0.03);
}

.t-icon {
  font-size: 16px;
  text-align: center;
}

.t-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.t-name {
  font-size: 13px;
  font-weight: 600;
}

.t-detail {
  font-size: 11px;
  color: var(--ink-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.t-status {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 600;
}

.t-status.normal {
  color: #16a34a;
  background: rgba(22, 163, 74, 0.06);
}

.t-status.busy {
  color: var(--ink-ochre);
  background: rgba(196, 127, 58, 0.06);
}

.t-status.limited {
  color: var(--ink-red);
  background: rgba(196, 75, 75, 0.06);
}

.t-dist {
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
