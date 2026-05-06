import type { PlanningMode } from '@/stores/mainTabs'

export type ModeConfig = {
  key: PlanningMode
  label: string
  station: string
  badge: string
  focus: string
  mapHint: string
  center: [number, number]
  zoom: number
  pinStyle: Record<string, string>
}

export type OverlayFeature = {
  id: string
  name: string
  metric: string
  style?: Record<string, string>
  far?: string
  risk?: 'high' | 'medium' | 'low'
  exceed?: boolean
}

export type LayerControl = {
  id: string
  name: string
  color: string
  enabled: boolean
}

export type ToolItem = {
  name: string
  icon: string
}
