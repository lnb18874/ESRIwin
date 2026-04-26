<template>
  <div class="map-container">
    <!-- 地图容器，ref 用于绑定 DOM 元素 -->
    <div ref="mapContainer" class="map-view"></div>
    
    <!-- 简单的加载提示 -->
    <div v-if="!mapLoaded" class="loading-tip">
      正在加载天地图资源...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- 配置区域 ---
// ⚠️ 请将此处替换为你刚才申请到的天地图 Key
const TIAN_MAP_KEY = '31ac18b8bb0a640a09eb08deda097c4a'; 

// --- 状态定义 ---
const mapContainer = ref(null); // 地图容器的 DOM 引用
const mapLoaded = ref(false);   // 地图加载状态

// --- 核心逻辑 ---

/**
 * 动态加载天地图 JS API 脚本
 * 返回一个 Promise，确保脚本加载完成后再执行后续代码
 */
const loadTianMapScript = () => {
  return new Promise((resolve, reject) => {
    // 如果已经加载过，直接 resolve
    if (window.T) {
      resolve(window.T);
      return;
    }

    const script = document.createElement('script');
    // 使用 HTTPS 协议，版本 v=4.0
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIAN_MAP_KEY}`;
    script.type = 'text/javascript';
    
    script.onload = () => {
      // 稍微延迟一下，确保 T 对象完全初始化
      setTimeout(() => resolve(window.T), 100);
    };
    
    script.onerror = () => reject(new Error('天地图 JS API 加载失败'));
    
    document.head.appendChild(script);
  });
};

/**
 * 初始化地图实例
 */
const initMap = async () => {
  try {
    // 1. 等待脚本加载完成
    const T = await loadTianMapScript();
    
    // 2. 创建地图实例
    // 注意：这里使用 EPSG:4326 坐标系（经纬度），适合大多数简单应用
    const map = new T.Map(mapContainer.value, {
      projection: 'EPSG:4326' 
    });

    // 3. 设置初始中心点和缩放级别
    // 这里设置为中心在上海（参考你的所在地）
    const center = new T.LngLat(121.4737, 31.2304); 
    map.centerAndZoom(center, 12);

    // 4. 添加地图类型控件（可选，让用户切换矢量/卫星图）
    const mapTypeControl = new T.Control.MapType();
    map.addControl(mapTypeControl);

    // 5. 更新状态
    mapLoaded.value = true;
    console.log('✅ 天地图初始化成功！');

  } catch (error) {
    console.error('❌ 地图初始化失败:', error);
  }
};

// --- 生命周期 ---
onMounted(() => {
  initMap();
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100vh; /* 占满全屏高度 */
  background-color: #f0f0f0; /* 加载前的背景色 */
}

.map-view {
  width: 100%;
  height: 100%;
  outline: none; /* 去除点击边框 */
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 16px;
  z-index: 999;
  pointer-events: none; /* 让鼠标事件穿透文字 */
}
</style>