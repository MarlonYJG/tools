<template>
  <!-- 带有同比环比 柱状图 -->
  <div class="chart-content">
    <div id="bar-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '700px'}"></div>
    </div>
    <div
      class="chart-btn"
      :class="{'left-btn': !rigthPosition,'right-btn':rigthPosition}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click="downloadPNG('bar-png')">
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { downloadPNG } from '@/utils/common'
import { getChartColor, getHistogramColor, getPieChars } from '@/utils/color'

export default {
  props: {
    elId: {
      type: String,
      default: ''
    },
    // 标题内容
    titleContent: {
      type: String,
      default: ''
    },
    // button位置
    rigthPosition: {
      type: Boolean,
      default: true
    },
    // echarts 配置参数
    chartConfig: {
      type: Object,
      default: {}
    },
    // echarts 数据
    chartsData: {
      type: Array,
      default: []
    },
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val
      this.drawBar()
    },
    chartsData(val) {
      this.ownChartsData = val
    }
  },
  data() {
    return {
      ownChartConfig: {},
      ownChartsData: []
    }
  },
  created() {},

  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId))
      // 绘制图表
      if (this.chartConfig) {
        myChart.setOption(this.ownChartConfig, true)
        myChart.on('legendselectchanged', obj => {
          let myChart = this.$echarts.init(document.getElementById(this.elId))
          let legendName = obj.name
          let selected = obj.selected
          let option = myChart.getOption()
          let legend = option.legend[0].selected
          // 第一部分：  判断点击的是同比还是环比
          switch (legendName) {
            // 如果是同比 当同比高亮时 显示所有选中图例的折线，否则消失
            case '同比':
              let tbObj = {}
              tbObj['环比'] = false
              if (selected['同比']) {
                Object.keys(legend).forEach(item => {
                  if (item.indexOf('比') === -1 && legend[item]) {
                    tbObj[item + '同比'] = true
                    tbObj[item + '环比'] = false
                  }
                })
              } else {
                Object.keys(legend).forEach(item => {
                  if (item.indexOf('同比') !== -1) {
                    tbObj[item] = false
                  }
                })
              }
              myChart.setOption({
                legend: [{ selected: tbObj }]
              })
              break
            // 如果是环比 当环比高亮时 显示所有选中图例的折线，否则消失
            case '环比':
              let hbObj = {}
              if (selected['环比']) {
                hbObj['同比'] = false
                Object.keys(legend).forEach(item => {
                  if (item.indexOf('比') === -1 && legend[item]) {
                    hbObj[item + '环比'] = true
                    hbObj[item + '同比'] = false
                  }
                })
              } else {
                Object.keys(legend).forEach(item => {
                  if (item.indexOf('环比') !== -1) {
                    hbObj[item] = false
                  }
                })
              }
              myChart.setOption({
                legend: [{ selected: hbObj }]
              })
              break
          }

          // 第二部分：  选中图例时 显示相应的 同比或环比 折线
          let tmpObj = {}

          if (obj.selected['同比'] === true) {
            if (obj.selected[legendName]) {
              tmpObj[legendName + '环比'] = false
              tmpObj[legendName + '同比'] = true
            } else {
              tmpObj[legendName + '同比'] = false
            }
          } else if (obj.selected['环比'] === true) {
            if (obj.selected[legendName]) {
              tmpObj[legendName + '同比'] = false
              tmpObj[legendName + '环比'] = true
            } else {
              tmpObj[legendName + '环比'] = false
            }
          }
          myChart.setOption({
            legend: [{ selected: tmpObj }]
          })

          // 第三部分： 处理区域渐变效果

          // let currName = ''
          // let reconsider = []
          // let flag = 0 // 标记当前有几个图例被选中
          // for (let key in selected) {
          //   if (selected[key] && key !== '同比' && key !== '环比') {
          //     flag++
          //     currName = key
          //   }
          // }
          // if (flag > 1) {
          //   reconsider = this.clearDrawLine()
          //   myChart.setOption({
          //     series: reconsider
          //   })
          // } else {
          //   reconsider = this.drawLine(currName, selected)
          //   myChart.setOption({
          //     series: reconsider
          //   })
          // }
        })
        // 柱状图宽度自适应
        window.onresize = function() {
          myChart.resize()
        }
      }
    },
    // 清除折线区域的渐变效果
    clearDrawLine() {
      let data = this.ownChartsData
      let tmpArr = []
      for (let i = 0; i < data.length; i++) {
        let barInfo = data[i]
        let tmpObj = {}
        // 筛选所有的 环比同比 并且设置为 折线图 以及设置样式
        if (barInfo.name.indexOf('同比') !== -1) {
          // 设置 折线区域颜色
          tmpObj.areaStyle = {
            opacity: 0
          }
        } else if (barInfo.name.indexOf('环比') !== -1) {
          tmpObj.areaStyle = {
            opacity: 0
          }
        }
        tmpArr.push(tmpObj)
      }
      return tmpArr
    },
    // 重绘折线区域的渐变效果
    drawLine(name, selState) {
      let data = this.ownChartsData
      let tmpArr = []
      for (let i = 0; i < data.length; i++) {
        let barInfo = data[i]
        let tmpObj = {}
        // 筛选所有的 环比同比 并且设置为 折线图 以及设置样式
        if (barInfo.name === name + '同比' && selState['同比']) {
          let brokenLineColor = getChartColor(i)
          // 设置 折线区域颜色
          tmpObj.areaStyle = {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: brokenLineColor[1] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: brokenLineColor[2] // 100% 处的颜色
                }
              ],
              global: false
            },
            opacity: 0.5
          }
        } else if (barInfo.name === name + '环比' && selState['环比']) {
          let brokenLineColor = getChartColor(i)
          // 设置 折线区域颜色
          tmpObj.areaStyle = {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: brokenLineColor[1] // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: brokenLineColor[2] // 100% 处的颜色
                }
              ],
              global: false
            },
            opacity: 0.5
          }
        }
        tmpArr.push(tmpObj)
      }
      return tmpArr
    }
  },
  mounted() {}
}
</script>
<style lang="scss" scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.chart-content {
  position: relative;
  .chart-btn {
    position: absolute;
    top: 45px;
    right: 10%;
    width: 100px;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
}
</style>