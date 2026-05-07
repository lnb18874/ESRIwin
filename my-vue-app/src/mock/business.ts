// ============================================================
// 商务型 — Mock 数据
// ============================================================

import type { BusinessData, ConstructionSite, InsarPoint, ParcelFAR } from '@/types/business'

export async function mockBusinessData(): Promise<BusinessData> {
  const insarPoints: InsarPoint[] = [
    {
      id: 'insar-01', location: [121.32, 31.21],
      subsidenceRate: 7.8, cumulativeSubsidence: 86.4,
      riskLevel: 'danger', trend: 'accelerating',
      timeSeries: genTimeSeries(0, 86.4, 24),
    },
    {
      id: 'insar-02', location: [121.335, 31.19],
      subsidenceRate: 4.1, cumulativeSubsidence: 52.3,
      riskLevel: 'warning', trend: 'stable',
      timeSeries: genTimeSeries(0, 52.3, 24),
    },
    {
      id: 'insar-03', location: [121.34, 31.205],
      subsidenceRate: 2.4, cumulativeSubsidence: 28.7,
      riskLevel: 'normal', trend: 'decelerating',
      timeSeries: genTimeSeries(0, 28.7, 24),
    },
    {
      id: 'insar-04', location: [121.315, 31.195],
      subsidenceRate: 6.2, cumulativeSubsidence: 74.1,
      riskLevel: 'danger', trend: 'accelerating',
      timeSeries: genTimeSeries(0, 74.1, 24),
    },
    {
      id: 'insar-05', location: [121.328, 31.215],
      subsidenceRate: 3.3, cumulativeSubsidence: 40.5,
      riskLevel: 'warning', trend: 'stable',
      timeSeries: genTimeSeries(0, 40.5, 24),
    },
  ]

  const constructionSites: ConstructionSite[] = [
    {
      id: 'cs-01', location: [121.322, 31.208], name: '嘉闵线盾构段A',
      type: 'shield', intensity: 0.82, changeRate: 0.12,
      lastDetected: new Date().toISOString(), encroachment: false,
    },
    {
      id: 'cs-02', location: [121.335, 31.19], name: '苏锡常城铁基坑B',
      type: 'foundation_pit', intensity: 0.67, changeRate: -0.03,
      lastDetected: new Date().toISOString(), encroachment: true,
    },
    {
      id: 'cs-03', location: [121.318, 31.203], name: '虹桥商务区塔吊群C',
      type: 'tower_crane', intensity: 0.74, changeRate: 0.05,
      lastDetected: new Date().toISOString(), encroachment: false,
    },
    {
      id: 'cs-04', location: [121.34, 31.215], name: '嘉定新城站基坑D',
      type: 'mixed', intensity: 0.58, changeRate: -0.08,
      lastDetected: new Date().toISOString(), encroachment: false,
    },
  ]

  const parcels: ParcelFAR[] = [
    { id: 'p-01', name: 'HQ-01', currentFAR: 6.2, allowedFAR: 5.8, subsidenceRate: 7.8, riskScore: 82, recommendation: 'restrict' },
    { id: 'p-02', name: 'HQ-02', currentFAR: 4.8, allowedFAR: 6.0, subsidenceRate: 4.1, riskScore: 56, recommendation: 'caution' },
    { id: 'p-03', name: 'HQ-03', currentFAR: 3.6, allowedFAR: 5.5, subsidenceRate: 2.4, riskScore: 34, recommendation: 'safe' },
    { id: 'p-04', name: 'HQ-07', currentFAR: 5.1, allowedFAR: 5.2, subsidenceRate: 6.2, riskScore: 71, recommendation: 'restrict' },
    { id: 'p-05', name: 'HQ-11', currentFAR: 2.1, allowedFAR: 4.5, subsidenceRate: 3.3, riskScore: 42, recommendation: 'caution' },
  ]

  return { insarPoints, constructionSites, parcels, updateTime: new Date().toISOString() }
}

function genTimeSeries(start: number, end: number, steps: number) {
  return Array.from({ length: steps }, (_, i) => {
    const ratio = (i + 1) / steps
    const ease = ratio < 0.5 ? 2 * ratio * ratio : 1 - Math.pow(-2 * ratio + 2, 2) / 2
    return {
      date: `2024-${String(Math.floor(i / 2) + 1).padStart(2, '0')}`,
      value: Math.round((start + (end - start) * ease) * 10) / 10,
    }
  })
}
