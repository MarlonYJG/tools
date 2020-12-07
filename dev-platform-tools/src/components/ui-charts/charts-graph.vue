<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-06-15 23:20:20
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-16 16:15:30
 * @Description: 关系图
--> 
<template>
  <!-- 关系图 -->
  <div class="chart-content">
    <div :id="imageId">
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '800px'}"></div>
    </div>
    <div
      class="chart-btn"
      :class="{'left-btn':!rigthPosition,'right-btn':rigthPosition}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click="downloadPNG(imageId)">
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
      this.drawPie();
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
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      myChart.resize();
      // 绘制
      if (this.chartConfig) {
        myChart.setOption(this.ownChartConfig, true);
        // 图宽度自适应
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
</style>