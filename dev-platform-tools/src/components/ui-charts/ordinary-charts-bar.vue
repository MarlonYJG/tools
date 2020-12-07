<!--
 * @Author: yangjianguo
 * @Date: 2019-08-22 19:44:38
 * @LastEditors: yangjianguo
 * @LastEditTime: 2019-08-28 13:43:00
 * @Description: 柱状图-非 同比环比
 -->
<template>
  <!-- 普通 柱状图 -->
  <div class="chart-content">
    <div id="bar1-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
        <el-tooltip placement="right" v-if="toolTip && toolTip !==''">
          <div slot="content" style="width:300px">{{toolTip}}</div>
          <b class="el-icon-shiyongbangzhu doubt"></b>
        </el-tooltip>
      </p>
      <div :id="elId" :style="{width: '100%', height:barHeight }"></div>
    </div>

    <div
      class="chart-btn"
      :class="{'left-btn': !rigthPosition,'right-btn':rigthPosition,'top0': top}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click="downloadPNG('bar1-png')" v-show="isShowImg">
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { downloadPNG } from '@/utils/common'
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
    toolTip: {
      type: String,
      default: ''
    },
    // echarts 配置参数
    chartConfig: {
      type: Object,
      default: {}
    },
    //是否显示导出图片按钮
    isShowImg: {
      type: Boolean,
      default: true
    },
    // 是否显示按钮
    isShowBtn: {
      type: Boolean,
      default: true
    },
    rigthPosition: {
      type: Boolean,
      default: true
    },
    top: {
      type: Boolean,
      default: false
    },
    barHeight: {
      type: String,
      default: '700px'
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val
      this.drawBar()
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
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId))

      // 绘制图表
      if (this.chartConfig) {
        myChart.hideLoading()
        myChart.setOption(this.ownChartConfig, true)
        // 柱状图宽度自适应
        window.onresize = function() {
          myChart.resize()
        }
      }
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
    // right: 10%;
  }
  .el-icon-shiyongbangzhu:before {
    color: #1296db;
  }
  .top0 {
    top: 0;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
  .doubt {
    font-size: 18px;
    color: #dddddd;
  }
}
</style>