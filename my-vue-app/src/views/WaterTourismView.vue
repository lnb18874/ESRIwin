<template>
  <div class="water-tourism" :class="{ loading: store.loading }">
    <!-- 顶部Header -->
    <TourismHeader
      :scenic-list="store.scenicList"
      :selected-id="store.selectedScenicId"
      :current-scenic="store.currentScenic"
      @select="store.switchScenic"
    />

    <!-- 三栏主体 -->
    <main class="tourism-body">
      <!-- 左侧面板 -->
      <div class="panel-left">
        <RealTimeOverview
          :data="store.realtime"
          :crowd-label="store.crowdLabel"
        />
        <RecommendIndex :data="store.recommend" />
        <TransportInfo :data="store.transport" />
      </div>

      <!-- 中间面板 -->
      <div class="panel-center">
        <FlowTrend :data="store.flowTrend" />
        <VenueBooking :data="store.venues" />
        <HeritageShowcase :data="store.heritages" />
      </div>

      <!-- 右侧面板 -->
      <div class="panel-right">
        <PopularityRank
          :data="store.topRankings"
          :selected-id="store.selectedScenicId"
          @select="store.switchScenic"
        />
        <WeatherCard :data="store.weather" />
        <SatisfactionScore :data="store.satisfaction" />
        <RouteRecommend :data="store.routes" />
      </div>
    </main>

    <!-- 地图预览浮窗 -->
    <div class="map-preview-fab" title="查看地图" @click="goToMap">
      <el-icon :size="20"><MapLocation /></el-icon>
      <span>地图</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MapLocation } from '@element-plus/icons-vue'
import { useTourismStore } from '@/stores/tourism'
import TourismHeader from '@/components/tourism/TourismHeader.vue'
import RealTimeOverview from '@/components/tourism/RealTimeOverview.vue'
import RecommendIndex from '@/components/tourism/RecommendIndex.vue'
import TransportInfo from '@/components/tourism/TransportInfo.vue'
import FlowTrend from '@/components/tourism/FlowTrend.vue'
import VenueBooking from '@/components/tourism/VenueBooking.vue'
import HeritageShowcase from '@/components/tourism/HeritageShowcase.vue'
import PopularityRank from '@/components/tourism/PopularityRank.vue'
import WeatherCard from '@/components/tourism/WeatherCard.vue'
import SatisfactionScore from '@/components/tourism/SatisfactionScore.vue'
import RouteRecommend from '@/components/tourism/RouteRecommend.vue'

const store = useTourismStore()
const router = useRouter()

onMounted(() => {
  store.init()
})

onBeforeUnmount(() => {
  store.dispose()
})

function goToMap() {
  router.push('/')
}
</script>

<style scoped>
/* ============================================================
   水乡文旅 — 全局主题变量 (水墨江南风格)
   ============================================================ */
.water-tourism {
  /* 色调 */
  --ink-bg: #f5f0e8;
  --ink-paper: rgba(255, 252, 245, 0.94);
  --ink-green: #2d5a4b;
  --ink-green-light: #3d7d6e;
  --ink-ochre: #c47f3a;
  --ink-ochre-light: #e0a45c;
  --ink-blue: #7eb8c9;
  --ink-red: #c44b4b;
  --ink-text: #2c2c2c;
  --ink-text-secondary: #7a7268;
  --ink-border: #dbd2c4;
  --ink-border-light: #e8e0d4;
  --ink-shadow: rgba(45, 90, 75, 0.08);
  --ink-shadow-lg: rgba(45, 90, 75, 0.12);

  /* 排版 */
  --ink-font-title: 'Noto Serif SC', 'SimSun', 'STSong', 'Songti SC', serif;
  --ink-font-body: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  --ink-radius: 8px;
  --ink-radius-sm: 6px;
  --ink-gap: 12px;

  width: 100%;
  height: 100dvh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--ink-text);
  font-family: var(--ink-font-body);
  background:
    linear-gradient(175deg, #f5f0e8 0%, #ece4d5 40%, #e8ded0 100%);
  /* 宣纸纹理 */
  background-image:
    radial-gradient(ellipse at 20% 80%, rgba(180, 160, 130, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(160, 140, 110, 0.1) 0%, transparent 50%);
}

.water-tourism.loading {
  pointer-events: none;
  opacity: 0.7;
}

/* ============ 三栏布局 ============ */
.tourism-body {
  display: grid;
  grid-template-columns: minmax(260px, 21vw) minmax(0, 1fr) minmax(280px, 23vw);
  gap: var(--ink-gap);
  width: 100%;
  min-height: 0;
  flex: 1;
  padding: 12px 14px;
  overflow: hidden;
  max-width: 1600px;
  margin: 0 auto;
}

.panel-left,
.panel-center,
.panel-right {
  display: flex;
  flex-direction: column;
  gap: var(--ink-gap);
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--ink-border) transparent;
}

.panel-left::-webkit-scrollbar,
.panel-center::-webkit-scrollbar,
.panel-right::-webkit-scrollbar {
  width: 4px;
}

.panel-left::-webkit-scrollbar-thumb,
.panel-center::-webkit-scrollbar-thumb,
.panel-right::-webkit-scrollbar-thumb {
  background: var(--ink-border);
  border-radius: 4px;
}

/* ============ 通用面板卡片样式(子组件复用) ============ */
:deep(.ink-card) {
  padding: 14px;
  border: 1px solid var(--ink-border);
  border-radius: var(--ink-radius);
  background: var(--ink-paper);
  box-shadow: 0 8px 24px var(--ink-shadow);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  animation: cardFadeIn 0.5s ease both;
}

:deep(.ink-card:hover) {
  box-shadow: 0 12px 32px var(--ink-shadow-lg);
  /* 墨迹晕染效果 */;
}

:deep(.ink-card:nth-child(1)) { animation-delay: 0.05s; }
:deep(.ink-card:nth-child(2)) { animation-delay: 0.1s; }
:deep(.ink-card:nth-child(3)) { animation-delay: 0.15s; }
:deep(.ink-card:nth-child(4)) { animation-delay: 0.2s; }

:deep(.card-head) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--ink-border-light);
}

:deep(.card-head h3) {
  margin: 0;
  color: var(--ink-text);
  font-family: var(--ink-font-title);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

:deep(.card-head .head-kicker) {
  color: var(--ink-text-secondary);
  font-size: 11px;
}

/* ============ 地图预览浮窗 ============ */
.map-preview-fab {
  position: fixed;
  right: 18px;
  bottom: 28px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 56px;
  height: 56px;
  border: 1px solid var(--ink-border);
  border-radius: 50%;
  color: var(--ink-green);
  background: var(--ink-paper);
  box-shadow: 0 6px 20px var(--ink-shadow);
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-preview-fab:hover {
  color: #fff;
  background: var(--ink-green);
  transform: scale(1.08);
  box-shadow: 0 10px 28px rgba(45, 90, 75, 0.28);
}

.map-preview-fab span {
  font-size: 10px;
  font-weight: 600;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ============ 响应式 ============ */
@media (max-width: 1280px) {
  .tourism-body {
    grid-template-columns: minmax(240px, 280px) minmax(0, 1fr);
    grid-template-rows: 1fr auto;
    grid-template-areas:
      'left center'
      'right right';
  }
  .panel-left { grid-area: left; }
  .panel-center { grid-area: center; }
  .panel-right {
    grid-area: right;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--ink-gap);
  }
}

@media (max-width: 980px) {
  .water-tourism {
    min-height: 100dvh;
    height: auto;
    overflow: visible;
  }
  .tourism-body {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas: 'center' 'left' 'right';
    overflow: visible;
    padding: 10px;
  }
  .panel-right {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tourism-body {
    gap: 8px;
    padding: 8px;
  }
  .map-preview-fab {
    right: 12px;
    bottom: 20px;
    width: 46px;
    height: 46px;
  }
}
</style>
