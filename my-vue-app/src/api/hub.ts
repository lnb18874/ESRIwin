// ============================================================
// 枢纽商圈型 — API 服务层
// 后端就绪后设置 VITE_HUB_API_BASE 即可
// ============================================================

import axios from 'axios'
import type { ApiResponse, BreakPoint, BusinessRadiation, HubData, JobHousingBalance, ODFlow } from '@/types/hub'
import { mockHubData } from '@/mock/hub'

const BASE_URL = import.meta.env.VITE_HUB_API_BASE ?? '/api/hub'
const http = axios.create({ baseURL: BASE_URL, timeout: 8000 })

export async function fetchHubData(): Promise<HubData> {
  try {
    const res = await http.get<ApiResponse<HubData>>('/full')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockHubData()
}

export async function fetchODFlows(): Promise<ODFlow[]> {
  try {
    const res = await http.get<ApiResponse<ODFlow[]>>('/od-flows')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockHubData()).odFlows
}

export async function fetchBreakPoints(): Promise<BreakPoint[]> {
  try {
    const res = await http.get<ApiResponse<BreakPoint[]>>('/breakpoints')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockHubData()).breakPoints
}

export async function fetchBalance(): Promise<JobHousingBalance> {
  try {
    const res = await http.get<ApiResponse<JobHousingBalance>>('/balance')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockHubData()).balance
}

export async function fetchRadiation(): Promise<BusinessRadiation> {
  try {
    const res = await http.get<ApiResponse<BusinessRadiation>>('/radiation')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockHubData()).radiation
}
