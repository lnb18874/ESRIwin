// ============================================================
// 商务型 — API 服务层
// 后端就绪后设置 VITE_BUSINESS_API_BASE 即可
// ============================================================

import axios from 'axios'
import type { ApiResponse, BusinessData, ConstructionSite, InsarPoint, ParcelFAR } from '@/types/business'
import { mockBusinessData } from '@/mock/business'

const BASE_URL = import.meta.env.VITE_BUSINESS_API_BASE ?? '/api/business'
const http = axios.create({ baseURL: BASE_URL, timeout: 8000 })

export async function fetchBusinessData(): Promise<BusinessData> {
  try {
    const res = await http.get<ApiResponse<BusinessData>>('/full')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return mockBusinessData()
}

export async function fetchInsarPoints(): Promise<InsarPoint[]> {
  try {
    const res = await http.get<ApiResponse<InsarPoint[]>>('/insar')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockBusinessData()).insarPoints
}

export async function fetchConstructionSites(): Promise<ConstructionSite[]> {
  try {
    const res = await http.get<ApiResponse<ConstructionSite[]>>('/construction')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockBusinessData()).constructionSites
}

export async function fetchParcels(): Promise<ParcelFAR[]> {
  try {
    const res = await http.get<ApiResponse<ParcelFAR[]>>('/parcels')
    if (res.data.code === 0) return res.data.data
  } catch { /* fallback */ }
  return (await mockBusinessData()).parcels
}
