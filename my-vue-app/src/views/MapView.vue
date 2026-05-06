
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
      <!-- 顶部 Header 控件栏 -->
      <div class="map-header">
        <!-- <div class="header-title">长三角城市群可视化系统</div> -->
        <div class="header-controls">
          <el-button size="small" class="control-btn">商务三角</el-button>
          <el-button size="small" class="control-btn">枢纽商圈</el-button>
          <el-button size="small" class="control-btn">水乡文旅</el-button>
          <el-dropdown size="small" class="el-button">
            <!-- 
              触发内容区域：模仿按钮内部结构
              注意：这里不需要额外的 span 包裹，直接用 template 或 div 即可
            -->
            <span class="el-dropdown-link">
              分析工具
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>商务三角</el-dropdown-item>
                <el-dropdown-item>枢纽商圈</el-dropdown-item>
                <el-dropdown-item divided>水乡文旅</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="map-block">
        <div ref="mapContainer" class="map-view"></div>
        <div v-if="!mapLoaded" class="loading-tip">正在加载GeoScene地图...</div>
      </div>
      <!-- 底部区域切换按钮 -->
      <div class="bottom-bar">
        <el-button 
          v-for="area in areas" 
          :key="area.name" 
          size="small" 
          class="area-btn"
          :class="{ active: currentArea === area.name }"
          @click="switchArea(area)"
        >
          {{ area.name }}
        </el-button>
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
import { Map, MapView } from '@/utils/geoscene';

let mapInstance = null; // 地图实例
const mapContainer = ref(null); // 地图容器的 DOM 引用
const mapLoaded = ref(false);   // 地图加载状态
const currentArea = ref('上海');

// 区域坐标配置
const areas = [
  { name: '江苏', lng: 118.7969, lat: 32.0603, zoom: 9 },
  { name: '浙江', lng: 120.1536, lat: 30.2873, zoom: 9 },
  { name: '上海', lng: 121.4737, lat: 31.2304, zoom: 12 },
  { name: '安徽', lng: 117.2830, lat: 31.8612, zoom: 9 },
];

// 切换区域
const switchArea = (area) => {
  currentArea.value = area.name;
  if (mapInstance) {
    mapInstance.center = [area.lng, area.lat];
    mapInstance.zoom = area.zoom;
  }
};

const map_center = { lng: 121.4737, lat: 31.2304 };

const initMap = async () => {
  try {
    const map = new Map({
      basemap: 'tianditu-vector' 
    });

    mapInstance = new MapView({
      container: mapContainer.value,
      map: map,
      center: [map_center.lng, map_center.lat],
      zoom: 12
    });

    mapLoaded.value = true;
    console.log('✅ GeoScene 地图初始化成功！');
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
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255,255,255,0.95);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  margin-bottom: 12px;
}
.header-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.header-controls {
  display: flex;
  gap: 10px;
}
.control-btn {
  font-size: 13px;
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
.area-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
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
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>