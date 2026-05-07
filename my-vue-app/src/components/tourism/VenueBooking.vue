<template>
  <section class="ink-card venue-booking">
    <div class="card-head">
      <h3>文化场馆预约</h3>
      <span class="head-kicker">实时余票</span>
    </div>
    <div class="venue-list" v-if="data.length">
      <div v-for="venue in data" :key="venue.id" class="venue-item">
        <div class="v-header">
          <span class="v-name">{{ venue.name }}</span>
          <span class="v-type">{{ venue.type }}</span>
        </div>
        <div class="v-meta">
          <span class="v-open">{{ venue.openTime }}</span>
          <span class="v-price" v-if="venue.price">¥{{ venue.price }}</span>
          <span class="v-price free" v-else>免费</span>
        </div>
        <div class="v-ticket-bar">
          <div class="ticket-progress">
            <div class="ticket-remain" :style="{ width: ticketPercent(venue) + '%' }"></div>
          </div>
          <span class="ticket-text" :class="{ urgent: venue.ticketRemaining < 50 }">
            余{{ venue.ticketRemaining }} / {{ venue.totalTickets }}
          </span>
        </div>
        <button class="book-btn" type="button">预约</button>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { CultureVenue } from '@/types/tourism'

defineProps<{
  data: CultureVenue[]
}>()

function ticketPercent(v: CultureVenue): number {
  return Math.round((v.ticketRemaining / v.totalTickets) * 100)
}
</script>

<style scoped>
.venue-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.venue-item {
  padding: 10px;
  border: 1px solid var(--ink-border-light);
  border-radius: var(--ink-radius-sm);
  transition: box-shadow 0.2s;
}

.venue-item:hover {
  box-shadow: 0 4px 12px var(--ink-shadow);
}

.v-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.v-name {
  font-size: 13px;
  font-weight: 700;
}

.v-type {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  color: var(--ink-green);
  background: rgba(45, 90, 75, 0.06);
}

.v-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 11px;
  color: var(--ink-text-secondary);
}

.v-price.free {
  color: #16a34a;
  font-weight: 600;
}

.v-ticket-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ticket-progress {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--ink-border-light);
  overflow: hidden;
}

.ticket-remain {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--ink-green-light), var(--ink-green));
  transition: width 0.6s ease;
}

.ticket-text {
  font-size: 11px;
  color: var(--ink-text-secondary);
  white-space: nowrap;
}

.ticket-text.urgent {
  color: var(--ink-red);
  font-weight: 600;
}

.book-btn {
  width: 100%;
  padding: 6px 0;
  border: 1px solid var(--ink-green);
  border-radius: var(--ink-radius-sm);
  color: var(--ink-green);
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.book-btn:hover {
  color: #fff;
  background: var(--ink-green);
}

.empty-state {
  text-align: center;
  padding: 20px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
