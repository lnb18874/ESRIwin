<template>
  <div class="geoscene-container">
    <div class="header">
      <h1>🗺️ GeoScene 地图演示</h1>
      <div class="controls">
        <el-button type="primary" @click="addMarker">添加标记</el-button>
        <el-button @click="zoomIn">放大</el-button>
        <el-button @click="zoomOut">缩小</el-button>
        <el-button @click="resetView">重置视图</el-button>
        <el-button type="info" @click="toggleLayer">切换图层</el-button>
      </div>
    </div>
    <div class="content">
      <div ref="mapDiv" class="map-view"></div>
      <div class="info-panel">
        <h3>GeoScene 信息</h3>
        <div class="info-item">
          <span>坐标：</span>
          <span class="value">{{ currentCoords.lng.toFixed(4) }}, {{ currentCoords.lat.toFixed(4) }}</span>
        </div>
        <div class="info-item">
          <span>缩放级别：</span>
          <span class="value">{{ zoom }}</span>
        </div>
        <div class="info-item">
          <span>标记数：</span>
          <span class="value">{{ markerCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Map,
  MapView,
  GraphicsLayer,
  Point,
  SimpleMarkerSymbol,
  Graphic,
} from '@/utils/geoscene'

let mapView: any = null
let graphicsLayer: any = null
let layerVisible = true
let markerCount = ref(0)
let zoom = ref(10)
let currentCoords = ref({ lng: 121.4737, lat: 31.2304 })

const mapDiv = ref<HTMLDivElement>()

// 初始化地图
const initMap = () => {
  try {
    // 创建地图
    const map = new Map({
      basemap: 'tianditu-vector' // 使用 GeoScene 支持的底图
    })

    // 创建地图视图
    mapView = new MapView({
      container: mapDiv.value,
      map: map,
      center: [currentCoords.value.lng, currentCoords.value.lat],
      zoom: zoom.value,
    })

    // 添加图形图层
    graphicsLayer = new GraphicsLayer()
    map.add(graphicsLayer)

    // 监听地图事件
    mapView.on('click', (event: any) => {
      const { longitude, latitude } = event.mapPoint
      currentCoords.value = { lng: longitude, lat: latitude }
      console.log('🖱️ 点击坐标:', { lng: longitude, lat: latitude })
    })

    mapView.watch('zoom', (newZoom: number) => {
      zoom.value = newZoom
    })

    ElMessage.success('✅ GeoScene 地图初始化成功！')
    console.log('✅ GeoScene 初始化完成')

    // 添加初始标记
    addInitialMarker()
  } catch (error) {
    console.error('❌ 地图初始化失败:', error)
    ElMessage.error('地图初始化失败: ' + (error as Error).message)
  }
}

// 添加初始标记
const addInitialMarker = () => {
  if (!graphicsLayer) return

  const point = new Point({
    longitude: currentCoords.value.lng,
    latitude: currentCoords.value.lat
  })

  const markerSymbol = new SimpleMarkerSymbol({
    color: [226, 119, 40],
    outline: {
      color: [255, 255, 255],
      width: 2
    },
    size: 12
  })

  const graphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
    attributes: {
      title: '初始位置',
      description: '这是一个初始标记'
    }
  })

  graphicsLayer.add(graphic)
  markerCount.value = 1
}

// 添加标记
const addMarker = () => {
  if (!graphicsLayer) return

  const randomLng = currentCoords.value.lng + (Math.random() - 0.5) * 0.1
  const randomLat = currentCoords.value.lat + (Math.random() - 0.5) * 0.1

  const point = new Point({
    longitude: randomLng,
    latitude: randomLat
  })

  const colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0]]
  const randomColor = colors[Math.floor(Math.random() * colors.length)]

  const markerSymbol = new SimpleMarkerSymbol({
    color: randomColor as any,
    outline: {
      color: [255, 255, 255],
      width: 2
    },
    size: 10
  })

  const graphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
    attributes: {
      title: `标记 ${markerCount.value + 1}`,
      description: `坐标: ${randomLng.toFixed(4)}, ${randomLat.toFixed(4)}`
    }
  })

  graphicsLayer.add(graphic)
  markerCount.value++
  ElMessage.success(`已添加标记 ${markerCount.value}`)
}

// 放大
const zoomIn = () => {
  if (mapView) {
    mapView.zoom += 1
  }
}

// 缩小
const zoomOut = () => {
  if (mapView) {
    mapView.zoom -= 1
  }
}

// 重置视图
const resetView = () => {
  if (mapView) {
    mapView.goTo({
      center: [currentCoords.value.lng, currentCoords.value.lat],
      zoom: 10
    })
    ElMessage.info('视图已重置')
  }
}

// 切换图层显示
const toggleLayer = () => {
  if (graphicsLayer) {
    layerVisible = !layerVisible
    graphicsLayer.visible = layerVisible
    ElMessage.info(`图层已${layerVisible ? '显示' : '隐藏'}`)
  }
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (mapView) {
    mapView.destroy()
  }
})
</script>

<style scoped>
.geoscene-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background: #f5f7fa;
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 12px 0;
  font-size: 24px;
}

.controls {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.controls :deep(.el-button) {
  height: 32px;
}

.content {
  display: flex;
  flex: 1;
  gap: 0;
  overflow: hidden;
}

.map-view {
  flex: 1;
  background: #e3f2fd;
}

.info-panel {
  width: 240px;
  background: white;
  border-left: 1px solid #ddd;
  padding: 16px;
  overflow-y: auto;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}

.info-panel h3 {
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
}

.info-item span:first-child {
  color: #666;
  font-weight: 500;
}

.info-item .value {
  color: #667eea;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

/* 响应式 */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }

  .info-panel {
    width: 200px;
  }
}
</style>
