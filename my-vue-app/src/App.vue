<template>
  <div class="cesium-container">
    <!-- 地球容器 -->
    <div id="cesiumContainer"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
// 引入 Cesium 的默认样式
import 'cesium/Build/Cesium/Widgets/widgets.css';

onMounted(() => {
  // ⚠️ 注意：如果不配置 Token，控制台会有警告，地球可能显示不全
  // 你可以在这里设置你的 Cesium Ion Token，或者暂时留空看效果
  // Cesium.Ion.defaultAccessToken = '你的_TOKEN_在这里';

  const viewer = new Cesium.Viewer('cesiumContainer', {
    // 基础配置：关闭一些不需要的UI控件以保持界面干净
    animation: false,       // 左下角动画
    baseLayerPicker: false, // 右上角图层选择器
    fullscreenButton: false,// 全屏按钮
    vrButton: false,        // VR按钮
    geocoder: false,        // 搜索框
    homeButton: false,      // Home按钮
    infoBox: false,         // 信息框
    sceneModePicker: false, // 2D/3D切换
    selectionIndicator: false, // 选择指示器
    timeline: false,        // 时间轴
    navigationHelpButton: false, // 帮助按钮
  });

  // 简单的测试：让地球自动旋转
  viewer.scene.screenSpaceCameraController.enableRotateInput = true;
});
</script>

<style scoped>
.cesium-container {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>