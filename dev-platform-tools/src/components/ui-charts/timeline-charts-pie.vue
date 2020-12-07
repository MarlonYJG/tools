<template>
  <!-- 时间轮播 饼图 -->
  <div class="own-pie">
    <div id="pie-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '800px'}"></div>
    </div>
    <div class="chart-btn" :class="{'left-btn': !rigthPosition,'right-btn':rigthPosition}">
      <el-button style="line-height:7px;" @click="downloadPNG('pie-png')">
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { downloadPNG } from "@/utils/common";
import { getPieChars } from "@/utils/color";
export default {
  props: {
    elId: {
      type: String,
      default: "",
    },
    // 标题内容
    titleContent: {
      type: String,
      default: "",
    },
    // echarts 配置参数
    chartConfig: {
      type: Array,
      default: [],
    },
    // button位置
    rigthPosition: {
      type: Boolean,
      default: true,
    },
    // Legend 数据
    pieChartLegend: {
      type: Array,
      default: [],
    },
    pieTitle: {
      type: String,
      default: "",
    },
    // 时间线数据
    pieChartTimeline: {
      type: Array,
      default: [],
    },
    // 单位
    unit: {
      type: String,
      default: "",
    },
  },
  watch: {
    titleConfig(val) {
      this.queryTime = val.queryTime ? val.queryTime : [];
      this.dimensionName = val.dimensionName ? val.dimensionName : "";
    },
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawPie();
    },
  },
  data() {
    return {
      ownChartConfig: [],
    };
  },
  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      let self = this;
      myChart.resize();
      // 绘制图表
      myChart.setOption({
        baseOption: {
          timeline: {
            axisType: "category",
            autoPlay: false,
            lineStyle: {
              color: "#ccc",
            },
            symbol: "circle",
            symbolSize: 15,
            // 是否显示轮播
            controlStyle: {
              show: false,
            },
            itemStyle: {
              color: "#E5E5E5FF",
            },
            checkpointStyle: {
              color: "#01C1DF",
              borderColor: "rgba(1,193,223,0.3)",
            },
            emphasis: {
              checkpointStyle: {
                color: "blue",
              },
              itemStyle: {
                color: "#01C1DF",
                borderColor: "rgba(1,193,223,0.3)",
              },
              label: {
                color: "#01C1DF",
              },
            },
            data: this.pieChartTimeline,
          },
          title: {
            subtext: this.pieTitle,
            x: "center",
            y: "58%",
            textStyle: {
              color: "#666",
              fontSize: 18,
              fontWeight: "bold",
            },
            subtextStyle: {
              color: "#666",
              fontSize: 18,
              fontWeight: "bold",
            },
          },
          legend: {
            right: "40%",
            data: this.pieChartLegend,
          },
          tooltip: {
            trigger: "item",
            formatter: function (params, ticket, callback) {
              let result = "";
              if (params.componentType === "timeline") {
                result = params.name;
              } else {
                result =
                  params.name +
                  "<br/>" +
                  self.pieTitle +
                  "：" +
                  params.value +
                  "<br/>占比：" +
                  params.percent +
                  "%";
              }
              return result;
            },
          },
          series: [
            {
              type: "pie",
              selectedMode: "single",
              roseType: "radius",
              radius: ["25%", "55%"],
              center: ["50%", "60%"],
              itemStyle: {
                normal: {
                  color: function(params) {
                    return getPieChars(params.dataIndex);
                  },
                },
              },
              label: {
                normal: {
                  show: true,
                  color: "#555555FF",
                  position: "outside",
                  formatter: "{b}\n\n{c}" + self.unit + "({d}%)",
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold",
                  },
                },
              },
            },
          ],
        },
        options: this.ownChartConfig,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.own-pie {
  position: relative;
  .chart-btn {
    position: absolute;
    top: 45px;
    right: 10%;
  }
  .left-btn {
    left: 0;
  }
  .right-btn {
    right: 10%;
  }
}
</style>