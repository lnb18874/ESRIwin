// ============================================================
// 时间轴动画 — Pinia Store
// 驱动 InSAR 沉降时序、人流趋势等随时间变化的可视化
// ============================================================

import { defineStore } from 'pinia'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    minYear: 2019,
    maxYear: 2026,
    currentYear: 2026,
    playing: false,
    speed: 1, // 1x / 2x / 4x
    timer: null as ReturnType<typeof setInterval> | null,
  }),

  getters: {
    // 当前年份对应的 InSAR 数据索引 (0-based, 对应 timeSeries 数组)
    dataIndex(state): number {
      return state.currentYear - state.minYear
    },
    // 归一化进度 0-1
    progress(state): number {
      return (state.currentYear - state.minYear) / (state.maxYear - state.minYear)
    },
  },

  actions: {
    setYear(year: number) {
      this.currentYear = Math.max(this.minYear, Math.min(this.maxYear, Math.round(year)))
    },

    togglePlay() {
      if (this.playing) {
        this.pause()
      } else {
        this.play()
      }
    },

    play() {
      if (this.playing) return
      this.playing = true
      const interval = Math.round(1000 / this.speed)
      this.timer = setInterval(() => {
        if (this.currentYear >= this.maxYear) {
          this.currentYear = this.minYear
        } else {
          this.currentYear++
        }
      }, interval)
    },

    pause() {
      this.playing = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    setSpeed(speed: number) {
      this.speed = speed
      if (this.playing) {
        this.pause()
        this.play()
      }
    },

    reset() {
      this.pause()
      this.currentYear = this.maxYear
    },

    dispose() {
      this.pause()
    },
  },
})
