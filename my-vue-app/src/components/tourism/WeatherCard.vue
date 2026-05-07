<template>
  <section class="ink-card weather-card">
    <div class="card-head">
      <h3>天气与舒适度</h3>
      <span class="head-kicker">{{ data?.tips?.slice(0, 12) ?? '' }}…</span>
    </div>
    <div v-if="data" class="weather-body">
      <div class="weather-main">
        <span class="weather-icon">{{ weatherIcon }}</span>
        <div>
          <strong class="temp">{{ data.temperature }}°</strong>
          <span class="desc">{{ data.weather }}</span>
        </div>
      </div>
      <div class="weather-metrics">
        <div class="metric-row">
          <span class="m-label">湿度</span>
          <span class="m-val">{{ data.humidity }}%</span>
        </div>
        <div class="metric-row">
          <span class="m-label">AQI</span>
          <span class="m-val" :class="aqiClass">{{ data.aqi }}</span>
        </div>
        <div class="metric-row">
          <span class="m-label">舒适度</span>
          <div class="comfort-bar-wrap">
            <div class="comfort-bar" :style="{ width: data.comfortIndex + '%' }"></div>
          </div>
          <span class="m-val">{{ data.comfortIndex }}</span>
        </div>
      </div>
      <div class="forecast-row">
        <div v-for="day in data.forecast3Days" :key="day.date" class="forecast-day">
          <span class="fc-date">{{ day.date }}</span>
          <span class="fc-weather">{{ day.weather }}</span>
          <span class="fc-temp">{{ day.tempLow }}°~{{ day.tempHigh }}°</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无数据</div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherInfo } from '@/types/tourism'

const props = defineProps<{
  data: WeatherInfo | null
}>()

const weatherIcon = computed(() => {
  const w = props.data?.weather
  if (w?.includes('晴')) return '☀'
  if (w?.includes('多云')) return '⛅'
  if (w?.includes('阴')) return '☁'
  if (w?.includes('雨')) return '🌧'
  return '🌤'
})

const aqiClass = computed(() => {
  const v = props.data?.aqi ?? 0
  if (v <= 50) return 'good'
  if (v <= 100) return 'moderate'
  return 'bad'
})
</script>

<style scoped>
.weather-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.weather-icon {
  font-size: 36px;
}

.temp {
  font-family: var(--ink-font-title);
  font-size: 28px;
  font-weight: 700;
  color: var(--ink-text);
}

.desc {
  display: block;
  font-size: 12px;
  color: var(--ink-text-secondary);
}

.weather-metrics {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.metric-row {
  display: grid;
  grid-template-columns: 50px 1fr 36px;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.m-label {
  color: var(--ink-text-secondary);
}

.m-val {
  text-align: right;
  font-weight: 600;
}

.m-val.good { color: #16a34a; }
.m-val.moderate { color: var(--ink-ochre); }
.m-val.bad { color: var(--ink-red); }

.comfort-bar-wrap {
  height: 6px;
  border-radius: 3px;
  background: var(--ink-border-light);
  overflow: hidden;
}

.comfort-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--ink-blue), var(--ink-green-light));
  transition: width 0.8s ease;
}

.forecast-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid var(--ink-border-light);
}

.forecast-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 11px;
}

.fc-date { color: var(--ink-text-secondary); }
.fc-weather { font-weight: 600; }
.fc-temp { color: var(--ink-text-secondary); }

.empty-state {
  text-align: center;
  padding: 16px 0;
  color: var(--ink-text-secondary);
  font-size: 13px;
}
</style>
