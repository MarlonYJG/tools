<template>
  <!-- 普通饼图 -->
  <div class="chart-content">
    <div id="area-png">
      <p class="title2">
        <span></span>
        <b v-if="queryTime.length !==0">{{queryTime[0]}} 至 {{queryTime[1]}}</b> {{dimensionName}} {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '500px'}"></div>
    </div>
    <div
      class="chart-btn"
      :class="{'left-btn':!rigthPosition,'right-btn':rigthPosition}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click="downloadPNG('area-png')">
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
    // 标题设置项
    titleConfig: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // button位置
    rigthPosition: {
      type: Boolean,
      default: true
    },
    // echarts 配置参数
    chartConfig: {
      type: Object,
      default: function() {
        return {};
      }
    },
    // 是否显示按钮
    isShowBtn: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    titleConfig(val) {
      console.log(val)
      if(val) {
        this.queryTime = val.queryTime ? val.queryTime : [];
        this.dimensionName = val.dimensionName ? val.dimensionName : '';
      }
    },
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawPie();
    }
  },
  data() {
    return {
      ownChartConfig: {},
      queryTime:[], // 查询时间
      dimensionName:'' // 维度名称
    };
  },
  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      // 绘制图表
      //   console.log(this.chartConfig)
      if (this.chartConfig) {
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