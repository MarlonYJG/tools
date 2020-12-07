<template>
  <!-- 折线图 -->
  <div class="chart-content">
    <div id="export-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '700px'}"></div>
    </div>
    <div class="chart-btn" :class="{'right-btn':rigthPosition}" v-if="isShowBtn">
      <el-button style="line-height:7px;" @click="downloadPNG('export-png')">
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { downloadPNG } from '@/utils/common'
import { getColor } from '@/utils/color'
export default {
  props: {
    elId: {
      type: String,
      default: ''
    },
    rigthPosition: {
      type: Boolean,
      default: true
    },
    // 标题内容
    titleContent: {
      type: String,
      default: ''
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
    // 是否显示按钮
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val
      this.drawLine()
    }
  },
  data() {
    return {
      ownChartConfig: {}
    }
  },
  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawLine() {
      // 绘制图表
      if (this.ownChartConfig) {
        this.$nextTick(() => {
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById(this.elId))
          myChart.hideLoading()
          myChart.setOption(this.ownChartConfig, true)
          //   myChart.on("legendselectchanged", obj => {
          //   let myChart = this.$echarts.init(document.getElementById(this.elId));
          //   let legendName = obj.name;
          //   let selected = obj.selected;
          //   let option = myChart.getOption();
          //   let legend = option.legend[0].selected;
          //   let currName = "";
          //   let reconsider = [];
          //   let flag = 0; // 标记当前有几个图例被选中
          //   for (let key in selected) {
          //     if (selected[key]) {
          //       flag++;
          //       currName = key;
          //     }
          //   }
          //   if (flag > 1) {
          //     reconsider = this.clearDrawLine();
          //     myChart.setOption({
          //       series: reconsider
          //     });
          //   } else {
          //     reconsider = this.againDrawLine(currName);
          //     myChart.setOption({
          //       series: reconsider
          //     });
          //   }
          // });
          // 柱状图宽度自适应
          window.onresize = function() {
            myChart.resize()
          }
        })
      }
    },
    // 清除折线区域颜色
    clearDrawLine() {
      let data = this.chartsData
      let tmpArr = []
      for (let i = 0; i < data.length; i++) {
        let barInfo = data[i]
        let tmpObj = {}
        tmpObj.areaStyle = {
          opacity: 0
        }
        tmpArr.push(tmpObj)
      }
      return tmpArr
    },
    // 重新绘制折线区域颜色
    againDrawLine(name) {
      let data = this.chartsData
      let tmpArr = []
      for (let i = 0; i < data.length; i++) {
        let brokenLineColor = getColor(i)
        let barInfo = data[i]
        let tmpObj = {}
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
                color: brokenLineColor[0] // 0% 处的颜色
              },
              {
                offset: 1,
                color: brokenLineColor[1] // 100% 处的颜色
              }
            ],
            global: false
          },
          opacity: 0.5
        }
        tmpArr.push(tmpObj)
      }
      return tmpArr
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.chart-content {
  position: relative;
  .chart-btn {
    position: absolute;
    top: 45px;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
}
</style>