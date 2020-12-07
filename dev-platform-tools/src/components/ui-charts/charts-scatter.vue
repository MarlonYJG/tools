<!--
 * @Author: yangjianguo
 * @Date: 2019-08-24 14:37:40
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-16 16:16:26
 * @Description: 散点图
 -->
<template>
  <div class="chart-content">
    <div id="bar1-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
        <el-tooltip placement="right" v-if="toolTip && toolTip !==''">
          <div slot="content" style="width:300px">
            {{toolTip}}
          </div>
          <b class="el-icon-shiyongbangzhu doubt"></b>
        </el-tooltip>
      </p>
      <div :id="elId" :style="{width: '100%', height: '500px'}"></div>
    </div>

    <div
      class="chart-btn"
      :class="{'left-btn': !rigthPosition,'right-btn':rigthPosition}"
      v-if="isShowBtn"
    >
      <el-button style="line-height:7px;" @click="downloadPNG('bar1-png')">
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
    toolTip: {
      type: String,
      default: ""
    },
    // echarts 配置参数
    chartConfig: {
      type: Object,
      default: {}
    },
    // 是否显示按钮
    isShowBtn: {
      type: Boolean,
      default: true
    },
    rigthPosition: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawBar();
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
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      // 绘制图表
      if (this.ownChartConfig) {
        let self = this;
        myChart.hideLoading();
        myChart.setOption(self.ownChartConfig, true);
        // 柱状图宽度自适应
        window.onresize = function() {
          myChart.resize();
        };
        myChart.on("click", function(params) {
          self.$emit("jumpUrl",params.data)
          if (params.componentType === "series") {
            // TODO 跳转到指定页面
            if (params.value[2]) {
              // this.$router.push({
              //   path:'',
              //   query:''
              // })
            }
          }
        });
      }
    },
  },
};
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
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
  .doubt {
    font-size: 18px;
    color:#DDDDDD;
  }
}
</style>