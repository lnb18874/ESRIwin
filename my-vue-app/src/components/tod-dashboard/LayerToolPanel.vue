<template>
  <aside class="panel-stack">
    <!-- 图层控制 -->
    <section class="panel-card">
      <div class="section-head">
        <h2>图层控制器</h2>
        <span>{{ station }}</span>
      </div>
      <div class="layer-tree">
        <label v-for="layer in currentLayers" :key="layer.id" class="layer-row">
          <input v-model="layer.enabled" type="checkbox" @change="onLayerToggle(layer.id, layer.enabled)" />
          <span class="layer-dot" :style="{ background: layer.color }"></span>
          <span>{{ layer.name }}</span>
        </label>
      </div>
      <label class="opacity-control">
        <span>全局不透明度</span>
        <input :value="opacity" type="range" min="20" max="90" @input="onOpacityChange" />
        <strong>{{ opacity }}%</strong>
      </label>
    </section>

    <!-- 工具箱 -->
    <section class="panel-card">
      <div class="section-head"><h2>分析工具箱</h2></div>
      <div class="tool-grid">
        <button v-for="tool in currentTools" :key="tool.name" class="tool-btn" type="button" :title="tool.name">
          <span>{{ tool.icon }}</span>
          <small>{{ tool.name }}</small>
        </button>
      </div>
    </section>

    <!-- 图例 -->
    <section class="panel-card compact">
      <div class="section-head"><h2>图例</h2></div>
      <div class="legend-list">
        <div v-for="item in currentLegend" :key="item.label" class="legend-item">
          <span class="legend-swatch" :class="item.style" :style="item.style === 'solid' ? { background: item.color } : item.style === 'dashed' ? { borderColor: item.color } : {}"></span>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PlanningMode } from '@/stores/mainTabs'
import type { LayerControl, ToolItem } from './types'

const props = defineProps<{
  station: string
  layers: LayerControl[]
  opacity: number
  activeMode: PlanningMode
}>()

const emit = defineEmits<{
  'update:opacity': [value: number]
  'toggle-layer': [id: string, enabled: boolean]
}>()

// 所有模式的图层配置（共享引用，由 data.ts 管理）
const allLayers = computed(() => props.layers)

// 当前模式可见的图层
const currentLayers = computed(() => {
  const modeLayers: Record<PlanningMode, string[]> = {
    business: ['rail', 'insar', 'construction', 'vitality'],
    hub: ['rail', 'flow', 'breakpoints', 'isochrone'],
    water: ['heritage', 'lst', 'corridor', 'height-limit'],
  }
  const ids = modeLayers[props.activeMode] ?? []
  return allLayers.value.filter(l => ids.includes(l.id))
})

// 当前模式的工具
const modeTools: Record<PlanningMode, ToolItem[]> = {
  business: [
    { name: '沉降剖面', icon: '⌁' },
    { name: '地块查询', icon: '□' },
    { name: '缓冲分析', icon: '◎' },
    { name: '导出报表', icon: '⬇' },
  ],
  hub: [
    { name: 'OD分析', icon: '↔' },
    { name: '等时圈', icon: '◎' },
    { name: '断点标注', icon: '⚠' },
    { name: '路径规划', icon: '⌁' },
  ],
  water: [
    { name: '视域分析', icon: '◎' },
    { name: '限高检测', icon: '↕' },
    { name: '3D漫游', icon: '🎥' },
    { name: '影像对比', icon: '⊞' },
  ],
}
const currentTools = computed(() => modeTools[props.activeMode] ?? modeTools.business)

// 当前模式的图例
const legendMap: Record<PlanningMode, { label: string; color: string; style: string }[]> = {
  business: [
    { label: '轨交线路', color: '#2563eb', style: 'solid' },
    { label: 'InSAR 沉降场', color: '#ef4444', style: 'solid' },
    { label: '施工标注 (YOLO)', color: '#f59e0b', style: 'solid' },
    { label: '活力热力', color: '#16a34a', style: 'gradient' },
  ],
  hub: [
    { label: '轨交线路', color: '#2563eb', style: 'solid' },
    { label: 'OD 客流光带', color: '#0ea5e9', style: 'solid' },
    { label: '慢行断点', color: '#ef4444', style: 'solid' },
    { label: '省界', color: '#64748b', style: 'dashed' },
  ],
  water: [
    { label: '风貌建筑', color: '#38bdf8', style: 'solid' },
    { label: 'LST 冷岛', color: '#16a34a', style: 'gradient' },
    { label: '视域通廊', color: '#16a34a', style: 'dashed' },
    { label: '限高约束体', color: '#ef4444', style: 'dashed' },
  ],
}
const currentLegend = computed(() => legendMap[props.activeMode] ?? legendMap.business)

function onOpacityChange(event: Event) {
  emit('update:opacity', Number((event.target as HTMLInputElement).value))
}

function onLayerToggle(id: string, enabled: boolean) {
  emit('toggle-layer', id, enabled)
}
</script>

<style scoped>
.panel-stack { display: flex; flex-direction: column; gap: 12px; min-width: 0; }

.panel-card {
  padding: 14px; border: 1px solid #d9e4ef; border-radius: 8px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 10px 26px rgba(29, 53, 87, 0.08);
}
.compact { padding-bottom: 10px; }

.section-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.section-head h2 { margin: 0; color: #142033; font-size: 15px; }
.section-head span { color: #64748b; font-size: 12px; }

.layer-tree { display: grid; gap: 8px; }

.layer-row {
  display: flex; align-items: center; gap: 9px; min-height: 32px;
  color: #24364c; font-size: 13px; cursor: pointer;
}

.layer-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}

.opacity-control {
  display: grid;
  grid-template-columns: 1fr minmax(80px, 1.2fr) auto;
  align-items: center; gap: 10px; margin-top: 14px;
  font-size: 12px; color: #64748b;
}
input[type='range'] { accent-color: #1769e0; }

.tool-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tool-btn {
  display: grid; place-items: center; gap: 4px; min-height: 56px;
  border: 1px solid #d7e3ef; border-radius: 7px; color: #1f3b57;
  background: #f8fbff; cursor: pointer; transition: all 0.15s;
}
.tool-btn:hover { border-color: #1769e0; background: #eef7ff; }
.tool-btn span { font-size: 20px; }
.tool-btn small { font-size: 11px; }

.legend-list { display: grid; gap: 8px; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #334155; }

.legend-swatch {
  width: 24px; height: 3px; border-radius: 2px; flex-shrink: 0;
}
.legend-swatch.solid { background: attr(data-color); }
.legend-swatch.dashed { background: transparent; border-top: 3px dashed; }
.legend-swatch.gradient { background: linear-gradient(90deg, #16a34a, #f59e0b, #ef4444); }

@media (max-width: 980px) { .panel-stack { gap: 10px; } .panel-card { padding: 12px; } }
@media (max-width: 768px) {
  .panel-stack { gap: 8px; } .panel-card { padding: 10px; }
  .section-head h2 { font-size: 14px; } .tool-btn { font-size: 11px; }
}
</style>
