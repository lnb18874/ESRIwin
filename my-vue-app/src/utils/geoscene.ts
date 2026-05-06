/**
 * GeoScene API 包装器
 * 处理 @geoscene/core 的导入问题
 */

// 导入必要的 GeoScene 模块
// 注意：使用完整路径导入来绕过package.json缺少主入口的问题
import Map from '@geoscene/core/Map'
import MapView from '@geoscene/core/views/MapView'
import GraphicsLayer from '@geoscene/core/layers/GraphicsLayer'
import Point from '@geoscene/core/geometry/Point'
import Polyline from '@geoscene/core/geometry/Polyline'
import Polygon from '@geoscene/core/geometry/Polygon'
import SimpleMarkerSymbol from '@geoscene/core/symbols/SimpleMarkerSymbol'
import SimpleLineSymbol from '@geoscene/core/symbols/SimpleLineSymbol'
import SimpleFillSymbol from '@geoscene/core/symbols/SimpleFillSymbol'
import Graphic from '@geoscene/core/Graphic'

// 导出所有需要的类
export {
  Map,
  MapView,
  GraphicsLayer,
  Point,
  Polyline,
  Polygon,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Graphic,
}

// 默认导出一个对象，包含所有类
export default {
  Map,
  MapView,
  GraphicsLayer,
  Point,
  Polyline,
  Polygon,
  SimpleMarkerSymbol,
  SimpleLineSymbol,
  SimpleFillSymbol,
  Graphic,
}
