// ============================================================
// 枢纽商圈型 — Mock 数据
// ============================================================

import type { BreakPoint, BusinessRadiation, HubData, JobHousingBalance, ODFlow } from '@/types/hub'

export async function mockHubData(): Promise<HubData> {
  const odFlows: ODFlow[] = [
    {
      id: 'od-01', from: [121.286, 31.242], to: [121.086, 31.298],
      volume: 52000, morningPeak: 18500, eveningPeak: 16200, mainMode: 'metro',
    },
    {
      id: 'od-02', from: [121.35, 31.22], to: [121.086, 31.298],
      volume: 31000, morningPeak: 11200, eveningPeak: 9800, mainMode: 'car',
    },
    {
      id: 'od-03', from: [121.086, 31.298], to: [121.18, 31.10],
      volume: 24000, morningPeak: 8200, eveningPeak: 9200, mainMode: 'bus',
    },
    {
      id: 'od-04', from: [121.10, 31.32], to: [121.20, 31.28],
      volume: 18000, morningPeak: 6500, eveningPeak: 5800, mainMode: 'metro',
    },
  ]

  const breakPoints: BreakPoint[] = [
    {
      id: 'bp-01', location: [121.105, 31.295], name: '花桥北省界桥',
      type: 'bridge', detourDistance: 620, priority: 'critical',
      description: '沪苏省界桥下慢行道绕行严重，步行需绕行620米', suggestion: '新建省界慢行天桥，预计缩短至80m',
    },
    {
      id: 'bp-02', location: [121.11, 31.31], name: '非机动车过街缺口',
      type: 'crossing', detourDistance: 320, priority: 'high',
      description: '花桥站南侧非机动车过街无专用通道', suggestion: '增设信号灯控过街口 + 骑行标识线',
    },
    {
      id: 'bp-03', location: [121.082, 31.285], name: '花桥站南接驳断点',
      type: 'transfer', detourDistance: 480, priority: 'critical',
      description: '公交站至地铁口步行11分钟，超过5分钟标准', suggestion: '优化公交站点位置 + 增设共享单车停放区',
    },
    {
      id: 'bp-04', location: [121.095, 31.305], name: '太仓方向路径缺口',
      type: 'path_gap', detourDistance: 850, priority: 'high',
      description: '太仓—花桥连接线缺少连续慢行道', suggestion: '沿河新建滨水绿道，连接两城慢行网络',
    },
    {
      id: 'bp-05', location: [121.115, 31.322], name: '省界骑行断头路',
      type: 'path_gap', detourDistance: 1100, priority: 'medium',
      description: '省界处骑行道中断，需经由机动车道', suggestion: '打通省界骑行衔接段，设置保护隔离',
    },
  ]

  const balance: JobHousingBalance = {
    areaId: 'huaqiao',
    areaName: '花桥片区',
    residencePop: 185000,
    jobPop: 72000,
    entropy: 0.58,
    commuteTimeAvg: 52,
    hourlyDistribution: [
      { hour: '00:00', pop: 98000 }, { hour: '02:00', pop: 94000 }, { hour: '04:00', pop: 92000 },
      { hour: '06:00', pop: 105000 }, { hour: '08:00', pop: 72000 }, { hour: '10:00', pop: 68000 },
      { hour: '12:00', pop: 75000 }, { hour: '14:00', pop: 78000 }, { hour: '16:00', pop: 85000 },
      { hour: '18:00', pop: 115000 }, { hour: '20:00', pop: 125000 }, { hour: '22:00', pop: 118000 },
    ],
  }

  const radiation: BusinessRadiation = {
    stationId: 'huaqiao-station',
    stationName: '花桥站',
    isochrone15min: 32000,
    isochrone30min: 86000,
    commercialDensity: 0.72,
    vacancyRate: 0.14,
    formatMix: { dining: 38, retail: 32, service: 20, entertainment: 10 },
  }

  return { odFlows, breakPoints, balance, radiation, updateTime: new Date().toISOString() }
}
