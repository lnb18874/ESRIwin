<template>
  <!-- 这里以后放路由视图或你的主布局 -->
  <router-view />
  
</template>

<script setup>
// 脚本留空
</script>

<style scoped>
:deep(router-view) {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>