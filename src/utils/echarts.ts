import * as echarts from 'echarts/core'
import {
  PieChart,
  type PieSeriesOption,
  BarChart,
  type BarSeriesOption,
  LineChart,
  type LinesSeriesOption
} from 'echarts/charts'
import {
  TitleComponent,
  type TitleComponentOption,
  TooltipComponent,
  type TooltipComponentOption,
  DatasetComponent,
  type DatasetComponentOption,
  TransformComponent,
  LegendComponent,
  type LegendComponentOption,
  GridComponent,
  type GridComponentOption
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'

export type ECOption = echarts.ComposeOption<
  | PieSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | DatasetComponentOption
  | LegendComponentOption
  | BarSeriesOption
  | GridComponentOption
  | LinesSeriesOption
>

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GridComponent,
  LabelLayout,
  UniversalTransition,
  SVGRenderer,
  PieChart,
  BarChart,
  LineChart
])

export default echarts
