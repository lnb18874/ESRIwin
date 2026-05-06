import type { LayerControl, ModeConfig, OverlayFeature, ToolItem } from './types'

export const modes: ModeConfig[] = [
  {
    key: 'business',
    label: '商务型',
    station: '虹桥',
    badge: '商务型模式',
    focus: '高密度开发与 InSAR 沉降风险的对抗关系。',
    mapHint: '建筑体块 + 沉降热力',
    center: [121.327, 31.2],
    zoom: 13,
    pinStyle: { left: '48%', top: '49%' },
  },
  {
    key: 'hub',
    label: '枢纽商圈型',
    station: '花桥',
    badge: '枢纽商圈型模式',
    focus: '跨城通勤缝合，突出行政边界断点与客流吸引。',
    mapHint: '客流光带 + 慢行断点',
    center: [121.086, 31.298],
    zoom: 13,
    pinStyle: { left: '53%', top: '47%' },
  },
  {
    key: 'water',
    label: '水乡文旅型',
    station: '水乡客厅',
    badge: '水乡文旅型模式',
    focus: '生态与风貌保护，控制视域高度和冷岛效应。',
    mapHint: '限高约束体 + LST 热力',
    center: [120.88, 31.08],
    zoom: 12,
    pinStyle: { left: '50%', top: '52%' },
  },
]

export const defaultLayerControls: LayerControl[] = [
  { id: 'rail', name: '轨道交通网', color: '#2563eb', enabled: true },
  { id: 'insar', name: 'InSAR 沉降场', color: '#ef4444', enabled: true },
  { id: 'vitality', name: '活力热力图', color: '#16a34a', enabled: false },
]

export const tools: ToolItem[] = [
  { name: '测量距离', icon: '↔' },
  { name: '剖面分析', icon: '⌁' },
  { name: '视点分析', icon: '◎' },
  { name: '框选查询', icon: '□' },
]

export const businessBlocks: OverlayFeature[] = [
  {
    id: 'b1',
    name: '商务地块 A',
    metric: 'α=0.82；沉降速率 7.8 mm/月',
    far: 'FAR 6.2',
    risk: 'high',
    style: { left: '37%', top: '33%', height: '128px' },
  },
  {
    id: 'b2',
    name: '商务地块 B',
    metric: 'α=0.67；沉降速率 4.1 mm/月',
    far: 'FAR 4.8',
    risk: 'medium',
    style: { left: '52%', top: '39%', height: '92px' },
  },
  {
    id: 'b3',
    name: '商务地块 C',
    metric: 'α=0.58；沉降速率 2.4 mm/月',
    far: 'FAR 3.6',
    risk: 'low',
    style: { left: '45%', top: '58%', height: '72px' },
  },
]

export const hubFlows = [
  { id: 'f1', style: { left: '24%', top: '42%', width: '46%', '--angle': '14deg' } },
  { id: 'f2', style: { left: '34%', top: '58%', width: '38%', '--angle': '-18deg' } },
  { id: 'f3', style: { left: '47%', top: '33%', width: '29%', '--angle': '42deg' } },
]

export const breakPoints: OverlayFeature[] = [
  { id: 'p1', name: '慢行断点 01', metric: '省界桥下绕行 620m', style: { left: '43%', top: '45%' } },
  { id: 'p2', name: '慢行断点 02', metric: '非机动车过街缺口', style: { left: '58%', top: '61%' } },
  { id: 'p3', name: '慢行断点 03', metric: '公交接驳步行 11 分钟', style: { left: '49%', top: '30%' } },
]

export const waterModels: OverlayFeature[] = [
  { id: 'w1', name: '风貌建筑 A', metric: '高度 18m，符合限高', exceed: false, style: { left: '38%', top: '42%', height: '58px' } },
  { id: 'w2', name: '占位模型 B', metric: '高度 31m，超出 24m 控制线', exceed: true, style: { left: '55%', top: '39%', height: '112px' } },
  { id: 'w3', name: '滨水设施 C', metric: '高度 12m，符合限高', exceed: false, style: { left: '48%', top: '62%', height: '42px' } },
]

export const businessBars = [
  { name: 'HQ-01', current: 82, limit: 74, value: '6.2' },
  { name: 'HQ-02', current: 64, limit: 76, value: '4.8' },
  { name: 'HQ-03', current: 48, limit: 68, value: '3.6' },
]

export const riskList = ['HQ-01 北侧地下空间', 'HQ-07 高架邻近地块', 'HQ-11 软土敏感区']

export const hubSuggestions = ['新增省界慢行天桥', '优化花桥站南侧接驳环', '设置跨城消费导流廊道']

export const scatterDots = [
  { id: 's1', style: { left: '18%', bottom: '28%' } },
  { id: 's2', style: { left: '34%', bottom: '48%' } },
  { id: 's3', style: { left: '52%', bottom: '36%' } },
  { id: 's4', style: { left: '67%', bottom: '62%' } },
  { id: 's5', style: { left: '78%', bottom: '44%' } },
]
