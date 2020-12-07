<template>
  <!--集中度 折线图 -->
  <div class="chart-content">
    <!-- <div id="export-png">
      <p class="title2">
        <span></span>{{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '700px'}"></div>
    </div>-->
    <div class="chartBox">
      <p class="title2">
        <span></span>
        市场集中度 {{form.concentrationType == 'cr4' ? "CR4" : "CR8"}}
      </p>
      <div class="chartMap" id="chartMap"></div>
      <div class="trendInstruction">
        <span>备注：市场集中度CR8：指该行业的相关市场内，某一时间段内中标额最多的前8家企业中标额合计占市场总中标额的百分比。</span>
        <br />
        <span>寡占II型：CR8≥85%、寡占III型：75%≤CR8＜85%、寡占IV型：45%≤CR8＜75%、寡占V型：40%≤CR8＜45%、竞争型：CR8＜40%。当市场处于竞争型(竞争型：CR8<40%)是比较好的水平区间。</span>
      </div>
    </div>
    <div class="chart-btn" :class="{'right-btn':rigthPosition}" v-if="isShowBtn">
      <el-button style="line-height:7px;" @click="downloadPNG('export-png')">
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
    rigthPosition: {
      type: Boolean,
      default: true
    },
    // 标题内容
    titleContent: {
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
    }
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawLine();
    }
  },
  data() {
    return {
      ownChartConfig: {},
      isNoEnter: true
    };
  },
  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    async drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      // 绘制图表
      if (this.chartConfig) {
        myChart.setOption(this.ownChartConfig, true);
        myChart.on("legendselectchanged", async function(obj) {
          self.isNoEnter = false;
          let legendName = obj.name;
          switch (legendName) {
            case "按年显示":
              // 获取年数据 重新绘制
            //   await self.queryCrTypeReport("1");
              this.$emit('queryCrTime','1');
              if (obj.selected["按年显示"] == true) {
                obj.selected["按季度显示"] = false;
                myChart.setOption({
                  legend: [{ selected: obj.selected }],
                  xAxis: {
                    data: self.crTime
                  },
                  series: [{ data: self.crTimeData }, {}]
                });
              }
              break;
            case "按季度显示":
              // 获取季度数据 重新绘制
              this.$emit('queryCrTime','2');
            //   await self.queryCrTypeReport("2");
              if (obj.selected["按季度显示"] == true) {
                obj.selected["按年显示"] = false;
                myChart.setOption({
                  legend: [{ selected: obj.selected }],
                  xAxis: {
                    data: self.crTime
                  },
                  series: [{}, { data: self.crTimeData }]
                });
              }
              break;
          }
        });
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
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
}
</style>