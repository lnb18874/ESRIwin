<template>
  <section class="ink-card satisfaction-score">
    <div class="card-head">
      <h3>游客满意度</h3>
      <span class="head-kicker">{{ data?.reviewCount?.toLocaleString() ?? 0 }}条评价</span>
    </div>
    <div v-if="data" class="sat-body">
      <div class="sat-main">
        <div class="sat-score-ring">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="38" class="ring-bg" />
            <circle
              cx="50" cy="50" r="38"
              class="ring-fill"
              :style="{ strokeDasharray: data.overallScore * 59.7 + ' 239' }"
            />
          </svg>
          <span class="score-num">{{ data.overallScore }}</span>
        </div>
        <div class="sat-dimensions">
          <div v-for="(val, key) in data.dimensionScores" :key="key" class="dim-row">
            <span class="dim-label">{{ dimLabel(String(key)) }}</span>
            <div class="dim-stars">
              <span v-for="s in 5" :key="s" class="star" :class="{ filled: s <= Math.round(val) }">★</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sat-tags" v-if="data.topTags.length">
        <span v-for="tag in data.topTags.slice(0, 5)" :key="tag.label" class="sat-tag">
          {{ tag.label }} {{ tag.count }}
        </span>
      </div>
      <div class="sat-reviews" v-if="data.recentReviews.length">
        <div v-for="review in data.recentReviews.slice(0, 2)" :key="review.id" class="review-item">
          <div class="review-header">
            <span class="reviewer">{{ review.username }}</span>
            <span class="review-stars">
              <span v-for="s in 5" :key="s" :class="{ filled: s <= review.rating }">★</span>
            </span>
          </div>
          <p class="review-content">"{{ review.content }}"</p>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import type { SatisfactionData } from '@/types/tourism'

defineProps<{
  data: SatisfactionData | null
}>()

function dimLabel(key: string): string {
  const m: Record<string, string> = {
    scenery: '风景',
    service: '服务',
    sanitation: '卫生',
    traffic: '交通',
    value: '性价比',
  }
  return m[key] ?? key
}
</script>

<style scoped>
.sat-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sat-main {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 10px;
}

.sat-score-ring {
  display: grid;
  place-items: center;
  position: relative;
}

.sat-score-ring svg {
  width: 70px;
  height: 70px;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--ink-border-light);
  stroke-width: 5;
}

.ring-fill {
  fill: none;
  stroke: var(--ink-ochre);
  stroke-width: 5;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.score-num {
  position: absolute;
  font-family: var(--ink-font-title);
  font-size: 20px;
  font-weight: 800;
  color: var(--ink-ochre);
}

.sat-dimensions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dim-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dim-label {
  font-size: 11px;
  color: var(--ink-text-secondary);
  width: 38px;
}

.dim-stars .star {
  font-size: 12px;
  color: var(--ink-border-light);
}

.dim-stars .star.filled {
  color: #f59e0b;
}

.sat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.sat-tag {
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 999px;
  color: var(--ink-green);
  background: rgba(45, 90, 75, 0.05);
}

.sat-reviews {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--ink-border-light);
}

.review-item {
  font-size: 11px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
}

.reviewer {
  font-weight: 600;
}

.review-stars {
  font-size: 10px;
  color: var(--ink-border-light);
}

.review-stars .filled {
  color: #f59e0b;
}

.review-content {
  margin: 0;
  color: var(--ink-text-secondary);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 16px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
