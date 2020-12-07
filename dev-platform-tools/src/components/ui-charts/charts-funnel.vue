<template>
  <!-- 普通饼图 -->
  <div class="chart-content">
    <div :id='imageId'>
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '600px'}"></div>
    </div>
    <div
      class="chart-btn"
      :class="{'left-btn':!rigthPosition,'right-btn':rigthPosition}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click='downloadPNG(imageId)'>
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { downloadPNG } from "@/utils/common";
export default {
  props: {
    elId: {
      type: String,
      default: ""
    },
    // 标题内容
    titleContent: {
      type: String,
      default: ""
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
    // 图片名字
    imageId: {
      type: String,
      default: ""
    },
    // 是否显示按钮
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawCharts();
    }
  },
  data() {
    return {
      ownChartConfig: {}
    };
  },
  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawCharts() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      // 绘制图表
      if (this.ownChartConfig) {
        myChart.hideLoading();
        myChart.setOption(this.ownChartConfig, true);
        // 柱状图宽度自适应
        window.onresize = function() {
          myChart.resize();
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.chart-content {
  position: relative;
  .chart-btn {
    position: absolute;
    top: 45px;
    right: 10px;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
}
</style>