<!--
 * @Author: Marlon
 * @Date: 2020-10-21 17:09:51
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-27 16:35:31
 * @Description: 线图-基础-统计结果-专用
-->
<template>
  <div class="chart-view" :id="'chart_lines_' + this.elId"></div>
</template>
 
 <script>
import { fromJS } from "immutable";
import echarts from "echarts"; //引入echarts
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    elId: {
      type: String,
      default: "",
    },
    chartConfig: {
      type: Object,
      default: function () {
        return {
          title: {
            text: "20%",
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "rgb(96, 98, 102)",
              fontSize: "20",
            },
          },
          color: ["#69BAFF"],
          legend: {
            show: false,
            itemGap: 12,
            data: ["01", "02"],
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          series: [
            {
              name: "字段占比分布",
              type: "pie",
              clockWise: true,
              radius: ["55%", "80%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
              hoverAnimation: false,
              data: [
                {
                  name: "错误字段占比",
                  value: 20,
                  itemStyle: {
                    normal: {
                      color: "#82E8B5",
                      label: {
                        show: false,
                      },
                      labelLine: {
                        show: false,
                      },
                    },
                  },
                },
                {
                  name: "正确字段占比",
                  value: 80,
                },
              ],
            },
          ],
        };
      },
    },
  },
  watch: {
    data: {
      handler: function (newVal, oldVal) {
        setTimeout(() => {
          this.draw();
        }, 0);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(
        document.getElementById(`chart_lines_${this.elId}`)
      );
      // 绘制图表
      if (this.chartConfig && this.chartConfig.series) {
        if (this.data && this.data.length) {
          this.chartConfig.series[0].data = this.data;
          myChart.setOption(this.chartConfig);
        } else {
          myChart.clear();
        }
      } else {
        myChart.clear();
      }
    },
  },
};
</script>
 
<style lang="scss" scoped>
.chart-view {
  width: 100%;
  height: 100%;
}
</style>
