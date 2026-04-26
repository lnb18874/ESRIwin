
<template>
  <div class="dashboard">
    <!-- 左侧面板 -->
    <div class="side-panel left">
      <div class="panel-block">
        <div class="panel-title">长三角职住人口年龄结构</div>
        <div class="panel-placeholder">[柱状图占位]</div>
      </div>
      <div class="panel-block">
        <div class="panel-title">交通流量</div>
        <div class="panel-placeholder">[堆叠面积图占位]</div>
      </div>
    </div>
    <!-- 中间地图 -->
    <div class="main-map">
      <div class="map-block">
        <div ref="mapContainer" class="map-view"></div>
        <div v-if="!mapLoaded" class="loading-tip">正在加载天地图资源...</div>
      </div>
      <!-- 底部区域切换按钮 -->
      <div class="bottom-bar">
        <el-button v-for="area in areas" :key="area" size="small" class="area-btn">{{ area }}</el-button>
      </div>
    </div>
    <!-- 右侧面板 -->
    <div class="side-panel right">
      <div class="panel-block">
        <div class="panel-title">长三角全域设施占比</div>
        <div class="panel-placeholder">[环形图占位]</div>
      </div>
      <div class="panel-block">
        <div class="panel-title">长三角各区AQI指数时序变化图</div>
        <div class="panel-placeholder">[折线图占位]</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const TIAN_MAP_KEY = '31ac18b8bb0a640a09eb08deda097c4a';
const mapContainer = ref(null);
const mapLoaded = ref(false);
const areas = [
  '江苏', '浙江', '上海'
];

const loadTianMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.T) {
      resolve(window.T);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIAN_MAP_KEY}`;
    script.type = 'text/javascript';
    script.onload = () => setTimeout(() => resolve(window.T), 100);
    script.onerror = () => reject(new Error('天地图 JS API 加载失败'));
    document.head.appendChild(script);
  });
};

const initMap = async () => {
  try {
    const T = await loadTianMapScript();
    const map = new T.Map(mapContainer.value, {
      projection: 'EPSG:4326'
    });
    const center = new T.LngLat(121.4737, 31.2304); // 上海中心
    map.centerAndZoom(center, 12);
    const mapTypeControl = new T.Control.MapType();
    map.addControl(mapTypeControl);
    mapLoaded.value = true;
  } catch (error) {
    console.error('❌ 地图初始化失败:', error);
  }
};

onMounted(() => {
  initMap();
});
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #eaf6ff;
}

.side-panel {
  flex: 0 1 22vw;
  min-width: 220px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 2vw 0.8vw;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  border-radius: 16px;
  z-index: 2;
}
.left {
  margin-right: 10px;
}
.right {
  margin-left: 10px;
}
.main-map {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-width: 0;
}
.map-block {
  flex: 1;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.map-view {
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  min-height: 0;
  outline: none;
  background: #f0f0f0;
}
.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 16px;
  z-index: 999;
  pointer-events: none;
}
.bottom-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 12px 0;
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  margin: 12px auto 0 auto;
  width: 90%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 3;
}
.area-btn {
  min-width: 72px;
}
.panel-block {
  background: rgba(255,255,255,0.95);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 16px 12px 20px 12px;
  margin-bottom: 8px;
}
.panel-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}
.panel-placeholder {
  height: 120px;
  background: linear-gradient(90deg, #e3eafc 0%, #f7faff 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 15px;
}
</style>