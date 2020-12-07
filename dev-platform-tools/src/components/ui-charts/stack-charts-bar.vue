<template>
  <!-- 堆叠 柱状图 -->
  <div class="chart-content">
    <div id="bar-png">
      <p class="title2">
        <span></span>
        {{titleContent}}
      </p>
      <div :id="elId" :style="{width: '100%', height: '700px'}"></div>
    </div>

    <div class="chart-btn" :class="{'left-btn': !rigthPosition,'right-btn':rigthPosition}">
      <el-button style="line-height:7px;" @click="downloadPNG('bar-png')">
        <span class="el-icon-tupian" style="margin-right:5px"></span>导出图片
      </el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import { downloadPNG } from "@/utils/common";
import { getChartColor, getHistogramColor, getPieChars } from "@/utils/color";
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
  created() {},

  methods: {
    // 导出图片
    downloadPNG,
    // 绘制echarts
    drawBar() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById(this.elId));
      let ifShow = true;
      let ifName = "百分比（%）";
      // 绘制图表
      if (this.chartConfig) {
        myChart.setOption(this.ownChartConfig, true);
        myChart.on("legendselectchanged", function(obj) {
          let legendSelectes = {};
          let legendName = obj.name;
          let ifTbOurHb =
            legendName == "同比" || legendName == "环比" ? true : false;

          // 同比&&环比图例控制
          if (ifTbOurHb) {
            let nowLegend = legendName;
            let otherLegend = nowLegend == "同比" ? "环比" : "同比";

            if (obj.selected[nowLegend]) {
              //图例激活状态
              legendSelectes[nowLegend] = true;
              legendSelectes[otherLegend] = false;

              Object.keys(legendSelectes).forEach(item => {
                console.log(item)
                legendSelectes[item] =
                  item.indexOf(otherLegend) !== -1
                    ? false
                    : legendSelectes[item];
                // 判断柱状图对应的图例是否激活并设置其对应折线图图例
                let _ifBarLegend =
                  item.indexOf("同比") === -1 && item.indexOf("环比") === -1
                    ? true
                    : false;

                if (_ifBarLegend) {
                  legendSelectes[item + nowLegend] = obj.selected[item];
                  console.log(legendSelectes)
                }
              });
            } else {
              //   图例关闭状态
              legendSelectes[nowLegend] = false;
              Object.keys(legendSelectes).forEach(item => {
                legendSelectes[item] =
                  item.indexOf(nowLegend) !== -1 ? false : legendSelectes[item];
              });
            }
          }

          // 此时为柱状图图例点击
          if (!ifTbOurHb) {
            let objSelecteds = obj.selected;

            // 遍历所有图例，并进行重新赋值
            Object.keys(objSelecteds).forEach(item => {
              if (item.indexOf("同比") !== -1) {
                return;
              }
              if (item.indexOf("环比") !== -1) {
                return;
              }

              legendSelectes[item] = objSelecteds[item] ? true : false;
              legendSelectes[item + "同比"] =
                objSelecteds[item] && objSelecteds["同比"] ? true : false;
              legendSelectes[item + "环比"] =
                objSelecteds[item] && objSelecteds["环比"] ? true : false;
            });
          }

          ifShow =
            !obj.selected["同比"] && !obj.selected["环比"] ? false : true;
          ifName =
            !obj.selected["同比"] && !obj.selected["环比"] ? "" : "百分比（%）";
          myChart.setOption({
            legend: [
              {
                selected: legendSelectes
              }
            ],
            yAxis: [
              {},
              {
                show: ifShow,
                name: ifName
              }
            ]
          });
        });
        // 柱状图宽度自适应
        window.onresize = function() {
          myChart.resize();
        };
      }
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.chart-content {
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