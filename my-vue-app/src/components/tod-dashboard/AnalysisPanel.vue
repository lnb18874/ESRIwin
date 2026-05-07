<template>
  <aside class="analysis-panel">
    <section class="station-card">
      <span class="mode-kicker">{{ mode.badge }}</span>
      <h1>{{ mode.station }}</h1>
      <p>{{ mode.focus }}</p>
    </section>

    <template v-if="activeMode === 'business'">
      <section class="panel-card">
        <div class="section-head">
          <h2>开发强度评估</h2>
          <span>FAR</span>
        </div>
        <div class="bar-chart">
          <div v-for="item in businessBars" :key="item.name" class="bar-row">
            <span>{{ item.name }}</span>
            <div class="bar-track">
              <i :style="{ width: item.current + '%' }"></i>
              <em :style="{ left: item.limit + '%' }"></em>
            </div>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </section>
      <section class="panel-card">
        <div class="section-head">
          <h2>沉降风险预警</h2>
          <span>mm/月</span>
        </div>
        <div class="gauge">
          <div class="needle"></div>
          <strong>7.8</strong>
          <span>中高风险</span>
        </div>
      </section>
      <section class="panel-card compact">
        <div class="section-head">
          <h2>高危风险点</h2>
        </div>
        <button v-for="item in riskList" :key="item" class="list-link" type="button">{{ item }}</button>
      </section>
    </template>

    <template v-if="activeMode === 'hub'">
      <section class="panel-card">
        <div class="section-head">
          <h2>职住平衡熵</h2>
          <span>24h</span>
        </div>
        <div class="line-chart">
          <svg viewBox="0 0 320 120" role="img" aria-label="通勤潮汐折线图">
            <polyline points="0,92 45,78 92,32 140,45 186,70 235,36 278,54 320,24" />
          </svg>
        </div>
      </section>
      <section class="panel-card">
        <div class="section-head">
          <h2>跨城消费引力</h2>
          <span>距离/消费</span>
        </div>
        <div class="scatter-chart">
          <i v-for="dot in scatterDots" :key="dot.id" :style="dot.style"></i>
        </div>
      </section>
      <section class="panel-card compact">
        <div class="section-head">
          <h2>缝合路径建议</h2>
        </div>
        <button v-for="item in hubSuggestions" :key="item" class="list-link" type="button">{{ item }}</button>
      </section>
    </template>

    <template v-if="activeMode === 'water'">
      <section class="panel-card">
        <div class="section-head">
          <h2>视域保护度</h2>
          <span>雷达</span>
        </div>
        <div class="radar-chart">
          <div class="radar-fill"></div>
          <span>限高</span>
          <span>通廊</span>
          <span>风貌</span>
          <span>可视</span>
        </div>
      </section>
      <section class="panel-card">
        <div class="section-head">
          <h2>生态冷岛指数</h2>
          <span>LST</span>
        </div>
        <div class="area-chart">
          <svg viewBox="0 0 320 120" role="img" aria-label="生态冷岛面积图">
            <path d="M0 90 C45 72 58 52 98 58 C140 66 155 28 200 38 C248 50 262 24 320 34 L320 120 L0 120 Z" />
          </svg>
        </div>
      </section>
      <section class="panel-card compact">
        <div class="section-head">
          <h2>实景 VR 漫游</h2>
        </div>
        <div class="vr-window">
          <div class="vr-sky"></div>
          <div class="vr-water"></div>
          <span>水乡客厅风貌预览</span>
        </div>
      </section>
      <button class="tourism-link" type="button" @click="goTourism">
        查看完整文旅数据 →
      </button>
    </template>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PlanningMode } from '@/stores/mainTabs'
import { businessBars, hubSuggestions, riskList, scatterDots } from './data'
import type { ModeConfig } from './types'

defineProps<{
  mode: ModeConfig
  activeMode: PlanningMode
}>()

const router = useRouter()

function goTourism() {
  router.push('/tourism')
}
</script>

<style scoped>
.analysis-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.panel-card,
.station-card {
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(29, 53, 87, 0.08);
}

.panel-card {
  padding: 14px;
}

.compact {
  padding-bottom: 10px;
}

.station-card {
  padding: 18px;
}

.mode-kicker {
  color: #1769e0;
  font-size: 12px;
  font-weight: 800;
}

.station-card h1 {
  margin: 8px 0 6px;
  color: #142033;
  font-size: clamp(22px, 3vw, 28px);
}

.station-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.section-head h2 {
  margin: 0;
  color: #142033;
  font-size: 15px;
}

.section-head span {
  color: #64748b;
  font-size: 12px;
}

.bar-chart {
  display: grid;
  gap: 12px;
}

.bar-row {
  display: grid;
  grid-template-columns: 52px 1fr 42px;
  align-items: center;
  gap: 10px;
  color: #334155;
  font-size: 12px;
}

.bar-track {
  position: relative;
  height: 12px;
  border-radius: 999px;
  background: #e2e8f0;
}

.bar-track i,
.bar-track em {
  position: absolute;
  top: 0;
  height: 100%;
}

.bar-track i {
  left: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #22c55e, #f59e0b, #ef4444);
}

.bar-track em {
  width: 2px;
  background: #0f172a;
}

.gauge {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  border-radius: 8px;
  background: conic-gradient(from 220deg, #22c55e 0 30%, #f59e0b 30% 62%, #ef4444 62% 82%, transparent 82% 100%);
}

.gauge::after {
  content: '';
  position: absolute;
  inset: 36px;
  border-radius: 50%;
  background: #ffffff;
}

.gauge strong,
.gauge span,
.needle {
  position: relative;
  z-index: 1;
}

.gauge strong {
  margin-top: 28px;
  color: #142033;
  font-size: 34px;
}

.gauge span {
  color: #b91c1c;
  font-size: 13px;
}

.needle {
  position: absolute;
  width: 4px;
  height: 58px;
  transform: rotate(42deg);
  transform-origin: bottom center;
  background: #0f172a;
}

.list-link {
  display: block;
  width: 100%;
  min-height: 34px;
  margin-bottom: 8px;
  padding: 0 10px;
  border: 1px solid #d7e3ef;
  border-radius: 6px;
  color: #1f3b57;
  text-align: left;
  background: #f8fbff;
  cursor: pointer;
}

.line-chart,
.area-chart,
.scatter-chart,
.radar-chart,
.vr-window {
  height: 150px;
  border-radius: 8px;
  background: #f4f8fc;
}

.line-chart svg,
.area-chart svg {
  width: 100%;
  height: 100%;
}

.line-chart polyline {
  fill: none;
  stroke: #0ea5e9;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.area-chart path {
  fill: rgba(34, 197, 94, 0.36);
  stroke: #16a34a;
  stroke-width: 3;
}

.scatter-chart {
  position: relative;
}

.scatter-chart::before,
.scatter-chart::after {
  content: '';
  position: absolute;
  background: #cbd5e1;
}

.scatter-chart::before {
  left: 24px;
  right: 14px;
  bottom: 24px;
  height: 1px;
}

.scatter-chart::after {
  left: 24px;
  top: 16px;
  bottom: 24px;
  width: 1px;
}

.scatter-chart i {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #f59e0b;
  box-shadow: 0 0 14px rgba(245, 158, 11, 0.46);
}

.radar-chart {
  position: relative;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.radar-chart::before {
  content: '';
  width: 118px;
  height: 118px;
  border: 1px solid #cbd5e1;
  background:
    linear-gradient(45deg, transparent 49%, #d6dee8 50%, transparent 51%),
    linear-gradient(-45deg, transparent 49%, #d6dee8 50%, transparent 51%);
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
}

.radar-fill {
  position: absolute;
  width: 100px;
  height: 100px;
  clip-path: polygon(50% 8%, 86% 46%, 60% 88%, 20% 60%);
  background: rgba(23, 105, 224, 0.32);
}

.radar-chart span {
  position: absolute;
  color: #475569;
  font-size: 12px;
}

.radar-chart span:nth-of-type(1) {
  top: 10px;
}

.radar-chart span:nth-of-type(2) {
  right: 18px;
}

.radar-chart span:nth-of-type(3) {
  bottom: 10px;
}

.radar-chart span:nth-of-type(4) {
  left: 18px;
}

.vr-window {
  position: relative;
  overflow: hidden;
  background: linear-gradient(#bfe8ff 0 45%, #72b596 45% 64%, #6bb9df 64% 100%);
}

.vr-sky,
.vr-water {
  position: absolute;
  inset: 0;
}

.vr-sky {
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.58), transparent);
  animation: drift 5s linear infinite;
}

.vr-water {
  top: 64%;
  background: repeating-linear-gradient(170deg, rgba(255, 255, 255, 0.42) 0 2px, transparent 2px 12px);
}

.vr-window span {
  position: absolute;
  left: 12px;
  bottom: 10px;
  color: #123044;
  font-weight: 800;
}

@keyframes drift {
  from {
    transform: translateX(-40%);
  }

  to {
    transform: translateX(40%);
  }
}

.tourism-link {
  display: block;
  width: 100%;
  padding: 10px 0;
  border: 1px solid #2d5a4b;
  border-radius: 8px;
  color: #2d5a4b;
  font-size: 14px;
  font-weight: 700;
  background: rgba(45, 90, 75, 0.04);
  cursor: pointer;
  transition: all 0.25s;
}

.tourism-link:hover {
  color: #fff;
  background: #2d5a4b;
}

@media (max-width: 980px) {
  .analysis-panel {
    gap: 10px;
  }

  .panel-card {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .analysis-panel {
    gap: 8px;
  }

  .panel-card {
    padding: 10px;
  }

  .section-head h2 {
    font-size: 14px;
  }

  .bar-row span {
    font-size: 12px;
  }

  .gauge strong {
    font-size: 24px;
  }

  .list-link {
    font-size: 12px;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .analysis-panel {
    gap: 8px;
  }

  .panel-card {
    padding: 8px;
  }

  .station-card {
    padding: 8px;
  }

  .section-head h2 {
    font-size: 13px;
  }

  .bar-row span {
    font-size: 11px;
  }

  .gauge strong {
    font-size: 20px;
  }

  .list-link {
    font-size: 11px;
    padding: 6px;
  }
}
</style>
