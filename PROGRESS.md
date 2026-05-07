# 长三角示范区 TOD 协同规划平台 — 项目进度

> 最后更新：2026-05-07
> 项目：地隧协同 · 数智孪生 — 长三角一体化示范区"在建+营运"轨道交通 TOD 协同规划与韧性治理平台

---

## 一、项目概述

| 项 | 值 |
|----|-----|
| 竞赛 | 2026 易智瑞杯 · 中国大学生 GIS 软件开发竞赛 (C-GIS 应用开发组) |
| 团队 | 南京工业大学 — 李佳琪(队长/前端)、李恺(算法)、李煜凡(算法)、陆浩然(后端) |
| 架构 | B/S — Vue 3 + GeoScene API + Python 后端 + PostgreSQL/PostGIS |
| 仓库 | `E:\download\ESRIwin` |
| 当前分支 | `main` |

### 三种模式

| 模式 | 站点 | 核心叙事 | 技术手段 | 状态 |
|------|------|----------|----------|------|
| **商务型** | 虹桥/嘉定 | 在建地铁沿线施工监测与沉降风险 | YOLO + InSAR + FAR | ⚠ 静态mock |
| **枢纽商圈型** | 太仓/花桥 | 跨省通勤断点缝合与职住平衡 | 网络分析 + OD + 等时圈 | ⚠ 静态mock |
| **水乡文旅型** | 水乡客厅 | 3D 视域保护与生态冷岛效应 | 3D限高体 + LST + MCE | ⚠ 静态mock + 独立详情页 |

---

## 二、技术栈

| 层 | 技术 | 版本 |
|----|------|------|
| 框架 | Vue 3 (Composition API + `<script setup>`) | 3.5 |
| 语言 | TypeScript | 6.0 |
| 构建 | Vite | 6.4 |
| UI 库 | Element Plus | 2.13 |
| 图表 | ECharts | 6.0 |
| 状态管理 | Pinia | 3.0 |
| 路由 | Vue Router | 5.0 |
| 地图 | @geoscene/core (ArcGIS) | 4.28 |
| 样式 | Less + scoped CSS | 4.6 |
| HTTP | Axios | 1.15 |
| 图标 | @element-plus/icons-vue | 2.3 |

---

## 三、文件结构

```
ESRIwin/
├── PROGRESS.md                          ← 本文件
├── README.md
└── my-vue-app/
    ├── package.json
    ├── index.html
    ├── vite.config.ts (未检查)
    └── src/
        ├── main.ts                      — 入口：挂载 Vue/Pinia/Router/ElementPlus/GeoScene
        ├── App.vue                      — 根组件：<router-view />
        ├── env.d.ts                     — 环境类型声明
        │
        ├── assets/
        │   └── main.css                 — 全局 reset 样式
        │
        ├── router/
        │   └── index.ts                 — 路由：/ (MapView), /tourism (WaterTourismView)
        │
        ├── stores/
        │   ├── mainTabs.ts              — 主页面三模式切换状态
        │   └── tourism.ts               — 文旅模块状态（景区列表/数据/30s轮询）
        │
        ├── types/
        │   ├── tourism.ts               — 文旅模块完整类型定义（10个子模块）
            │   ├── business.ts              — 商务模式类型（InSAR/YOLO/FAR）
            │   └── hub.ts                   — 枢纽模式类型（OD/断点/职住平衡）
        │
        ├── api/
        │   ├── tourism.ts               — 文旅API服务层（含降级mock策略）
        │   ├── business.ts              — 商务API服务层
        │   └── hub.ts                   — 枢纽API服务层
        │
        ├── mock/
        │   ├── tourism.ts               — 文旅mock数据（6景区×10维度）
        │   ├── business.ts              — 商务mock数据（InSAR监测点/工地/地块）
        │   └── hub.ts                   — 枢纽mock数据（OD流/断点/职住平衡）
        │
        ├── utils/
        │   └── geoscene.ts              — GeoScene Map/MapView 封装
        │
        ├── views/
        │   ├── MapView.vue              — 主仪表盘页面（三栏布局）
        │   └── WaterTourismView.vue     — 水乡文旅详情页（独立路由）
        │
        └── components/
            ├── tod-dashboard/           — 主仪表盘子组件
            │   ├── types.ts             —   类型定义
            │   ├── data.ts              —   静态mock数据
            │   ├── DashboardHeader.vue  —   顶部Header + 模式Tab切换
            │   ├── MapStage.vue         —   ✅ 地图区域（GeoScene GraphicsLayer 真实图层管理）
            │   ├── LayerToolPanel.vue   —   左侧：图层控制 + 工具面板
            │   └── AnalysisPanel.vue    —   右侧：各模式分析面板
            │
            └── tourism/                 — 文旅详情页子组件（11个）
                ├── TourismHeader.vue        — 顶部品牌栏 + 景区Tab
                ├── RealTimeOverview.vue     — A. 实时人数仪表盘
                ├── PopularityRank.vue       — B. 热门排行
                ├── FlowTrend.vue            — C. 人流趋势(ECharts)
                ├── RecommendIndex.vue       — D. 推荐指数(ECharts雷达图)
                ├── WeatherCard.vue          — E. 天气与舒适度
                ├── TransportInfo.vue        — F. 交通接驳
                ├── VenueBooking.vue         — G. 文化场馆预约
                ├── HeritageShowcase.vue     — H. 非遗展示画廊
                ├── RouteRecommend.vue       — I. 特色路线推荐
                └── SatisfactionScore.vue    — J. 游客满意度
```

---

## 四、功能实现状态

### 4.1 全局框架

| 功能 | 状态 | 说明 |
|------|------|------|
| 三模式切换 | ✅ 完成 | DashboardHeader Tab 驱动 Pinia store |
| 三栏响应式布局 | ✅ 完成 | CSS Grid，1280/980/768/480 断点 |
| GeoScene 地图加载 | ✅ 完成 | 天地图底图 + 按模式 flyTo |
| 左侧图层控制面板 | ✅ 完成 | 图层开关 + 透明度滑块 + 工具网格 |
| 右侧分析面板 | ✅ 完成 | 三种模式均已接入 ECharts + Pinia store |
| Element Plus 全局注册 | ✅ 完成 | + 图标全量注册 |

### 4.2 商务型（虹桥）

| 功能 | 状态 | 说明 |
|------|------|------|
| 开发强度 FAR 柱状图 | ✅ ECharts | ECharts 柱状图 + 限高警戒线 |
| 沉降风险仪表盘 | ✅ ECharts | ECharts 仪表盘，动态风险等级 |
| 高危风险点列表 | ✅ 动态 | 从 Pinia store 过滤高危地块 |
| 建筑体块地图标注 | ✅ 已实现 | GeoScene Point Graphic + SimpleMarkerSymbol |
| InSAR 沉降热力图层 | ✅ 完成 | GeoScene 半透明圆 + 风险颜色分级 |
| YOLO 施工识别图层 | ❌ 缺失 | 计划书提及，未实现 |
| 施工强度 α 指数 | ❌ 缺失 | — |
| 盾构-沉降耦合分析 | ❌ 缺失 | — |

### 4.3 枢纽商圈型（花桥）

| 功能 | 状态 | 说明 |
|------|------|------|
| 职住平衡 24h 潮汐 | ✅ ECharts | ECharts 面积图 + 居住人口线 |
| 跨城消费引力 | ✅ ECharts | ECharts 散点图 + 业态占比 |
| 慢行断点列表 | ✅ 动态 | 从 Pinia store 加载 + 优先级标签 |
| OD 客流光带 | ✅ 完成 | CSS 流光动画 + 省界/断点标注 |
| 慢行断点地图标注 | ✅ 完成 | GeoScene Point Graphic + 点击弹窗 |
| 省界断点高亮 | ❌ 缺失 | — |
| 等时圈/公交覆盖 | ❌ 缺失 | — |

### 4.4 水乡文旅型（水乡客厅）— 主仪表盘

| 功能 | 状态 | 说明 |
|------|------|------|
| 视域保护度雷达图 | ⚠ mock | CSS clip-path 模拟 |
| 生态冷岛面积图 | ⚠ mock | SVG path |
| VR 漫游窗口 | ⚠ mock | CSS 渐变示意图 |
| 风貌建筑标注 | ✅ 完成 | GeoScene Point Graphic + 限高状态颜色 |
| LST 热力图层 | ✅ 完成 | GeoScene Polygon + 温度颜色分级 |
| 3D 限高约束体 | ⚠ 2D | 红色虚线约束圈，3D待 SceneView |
| 视廊扇形锥体 | ✅ 完成 | GeoScene 半透明 Polygon 通廊区 |

### 4.5 水乡文旅详情页（独立页面）

| 功能 | 状态 | 说明 |
|------|------|------|
| 景区切换 (6景区) | ✅ 完成 | 顶部 Tab，Store 驱动 |
| 实时人数仪表盘 | ✅ 完成 | 数字跳动动画 + 承载率进度条 |
| 热门排行 | ✅ 完成 | FLIP 过渡动画 |
| 人流趋势 ECharts | ✅ 完成 | 今日/昨日/预测三线面积图 |
| 推荐指数雷达图 | ✅ 完成 | ECharts + SVG 评分环 |
| 天气舒适度 | ✅ 完成 | 天气图标 + 三日预报 |
| 交通接驳 | ✅ 完成 | 图标列表 + 实时状态 |
| 文化场馆预约 | ✅ 完成 | 卡片列表 + 余票进度条 |
| 非遗展示画廊 | ✅ 完成 | 横向 scroll-snap 滚动 |
| 特色路线推荐 | ✅ 完成 | 时间轴步骤条 |
| 游客满意度 | ✅ 完成 | SVG评分环 + 标签云 + 评价 |
| 水墨江南主题 | ✅ 完成 | CSS 变量体系 + 宣纸纹理 |
| 30s 实时轮询 | ✅ 完成 | Pinia store 定时刷新 |
| API 降级 mock | ✅ 完成 | try/catch 策略 |
| 后端接口预留 | ✅ 完成 | VITE_TOURISM_API_BASE 环境变量 |

### 4.6 后端接口状态

| 端点 | 状态 | 对应前端文件 |
|------|------|-------------|
| `GET /api/tourism/scenic/list` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/full` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/realtime` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/flow-trend` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/recommend` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/weather` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/transport` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/venues` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/heritages` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/routes` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/:id/satisfaction` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/tourism/scenic/ranking` | ⚡ 已定义 | api/tourism.ts |
| `GET /api/business/insar` | ⚡ 已定义 | api/business.ts |
| `GET /api/business/construction` | ⚡ 已定义 | api/business.ts |
| `GET /api/business/parcels` | ⚡ 已定义 | api/business.ts |
| `GET /api/hub/od-flows` | ⚡ 已定义 | api/hub.ts |
| `GET /api/hub/breakpoints` | ⚡ 已定义 | api/hub.ts |
| `GET /api/hub/balance` | ⚡ 已定义 | api/hub.ts |
| `GET /api/tourism/view-corridor/:spotId` | ❌ 未定义 | — |
| `GET /api/tourism/lst/:areaId` | ❌ 未定义 | — |
| `GET /api/tourism/3d-model/:spotId` | ❌ 未定义 | — |

> ⚡ = 前端已定义接口签名，后端就绪后只需设置环境变量
> ❌ = 前后端均未实现

---

## 五、优先级排序的待办清单

### P0 — 本次重构
- [x] **重构 MapStage.vue** — 从 CSS overlay 模拟 → 真实的 GeoScene 图层管理系统
  - [x] 图层注册/移除/显隐控制
  - [x] 按 activeMode 自动切换可见图层
  - [x] Graphic 点击事件 → 弹出信息窗口
  - [x] 保留 GeoScene MapView 的真实渲染能力

### P1 — 核心功能
- [x] 商务模式地图图层：建筑体块标注已完成，InSAR热力/YOLO标注待后端数据
- [x] 枢纽模式地图图层：慢行断点+省界标注已完成，OD流线/等时圈待补充
- [x] 文旅模式地图图层：风貌建筑+视廊通廊区已完成，LST/3D限高体待3D SceneView
- [x] 三种模式右侧面板改用 ECharts 替换 CSS/SVG mock
- [x] 商务/枢纽模式的 API 接口定义 + mock 降级（与文旅对齐）

### P2 — 增强体验
- [x] DashboardHeader 时间轴播放/暂停/速度控制
- [x] LayerToolPanel 模式专属图层切换
- [x] 地图模式专属 GraphicsLayer (InSAR热力/断点等)
- [x] OD 客流光带动画 (枢纽模式)
- [ ] 3D SceneView 集成（倾斜摄影 + 限高约束体 + 第一人称漫游）
- [ ] 商务模式详情页（与 WaterTourismView 风格一致）
- [ ] 枢纽模式详情页
- [ ] InSAR 时间轴播放动画
- [ ] OD 流线贝塞尔曲线动画

### P3 — 收尾
- [ ] 对接后端真实 API
- [ ] 性能优化（图层懒加载、大数据量降采样）
- [ ] 移动端适配完善
- [ ] 部署配置

---

## 六、变更日志

| 日期 | 变更 | 说明 |
|------|------|------|
| 2026-05-07 | 初始化 | 创建进度文档；完成水乡文旅详情页(16文件)；重构MapStage为真实图层管理 |
| 2026-05-07 | P1核心功能 | 新建商务/枢纽数据层(types/api/mock/stores各4个)；AnalysisPanel升级ECharts(4个图表)；MapView集成stores |
| 2026-05-07 | 主页面打磨 | Timeline动画store+播放控制；LayerToolPanel模式专属图层；MapStage模式GraphicsLayer(30+个GeoScene图形)；OD流CSS动画 |
