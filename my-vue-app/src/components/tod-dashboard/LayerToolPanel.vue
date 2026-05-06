<template>
  <aside class="panel-stack">
    <section class="panel-card">
      <div class="section-head">
        <h2>图层控制器</h2>
        <span>{{ station }}</span>
      </div>
      <div class="layer-tree">
        <label v-for="layer in layers" :key="layer.id" class="layer-row">
          <input v-model="layer.enabled" type="checkbox" />
          <span class="layer-dot" :style="{ background: layer.color }"></span>
          <span>{{ layer.name }}</span>
        </label>
      </div>
      <label class="opacity-control">
        <span>热力透明度</span>
        <input :value="opacity" type="range" min="20" max="90" @input="updateOpacity" />
        <strong>{{ opacity }}%</strong>
      </label>
    </section>

    <section class="panel-card">
      <div class="section-head">
        <h2>分析工具箱</h2>
      </div>
      <div class="tool-grid">
        <button v-for="tool in tools" :key="tool.name" class="tool-btn" type="button" :title="tool.name">
          <span>{{ tool.icon }}</span>
          <small>{{ tool.name }}</small>
        </button>
      </div>
    </section>

    <section class="panel-card compact">
      <div class="section-head">
        <h2>全局图层</h2>
      </div>
      <div class="legend-list">
        <div class="legend-item">
          <span class="line solid"></span>
          <span>营运铁路</span>
        </div>
        <div class="legend-item">
          <span class="line dashed"></span>
          <span>在建铁路</span>
        </div>
        <div class="legend-item">
          <span class="area admin"></span>
          <span>行政边界</span>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import type { LayerControl, ToolItem } from './types'

defineProps<{
  station: string
  layers: LayerControl[]
  tools: ToolItem[]
  opacity: number
}>()

const emit = defineEmits<{
  'update:opacity': [value: number]
}>()

const updateOpacity = (event: Event) => {
  emit('update:opacity', Number((event.target as HTMLInputElement).value))
}
</script>

<style scoped>
.panel-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.panel-card {
  padding: 14px;
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(29, 53, 87, 0.08);
}

.compact {
  padding-bottom: 10px;
}

.section-head,
.layer-row,
.legend-item {
  display: flex;
  align-items: center;
}

.section-head {
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.section-head h2 {
  margin: 0;
  color: #142033;
  font-size: 15px;
}

.section-head span,
.opacity-control {
  color: #64748b;
  font-size: 12px;
}

.layer-tree,
.legend-list {
  display: grid;
  gap: 10px;
}

.layer-row {
  gap: 9px;
  min-height: 32px;
  color: #24364c;
  font-size: 13px;
}

.layer-dot,
.area {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.opacity-control {
  display: grid;
  grid-template-columns: 1fr minmax(80px, 1.2fr) auto;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

input[type='range'] {
  accent-color: #1769e0;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.tool-btn {
  display: grid;
  place-items: center;
  gap: 4px;
  min-height: 64px;
  border: 1px solid #d7e3ef;
  border-radius: 7px;
  color: #1f3b57;
  background: #f8fbff;
  cursor: pointer;
}

.tool-btn span {
  font-size: 22px;
}

.legend-item {
  gap: 8px;
  color: #334155;
  font-size: 13px;
}

.line {
  width: 32px;
  height: 0;
  border-top: 3px solid #2563eb;
}

.line.dashed {
  border-top-style: dashed;
  border-color: #d97706;
}

.area.admin {
  border-radius: 2px;
  background: #e2e8f0;
  outline: 1px solid #94a3b8;
}

@media (max-width: 980px) {
  .panel-stack {
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    overflow-x: auto;
  }
}
</style>
