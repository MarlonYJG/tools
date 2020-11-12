<!--
 * @Author: Marlon
 * @Date: 2020-09-28 10:45:29
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-28 10:46:45
 * @Description: 散点图-基础
-->
<template>
  <div class="chart-view" :id="'chart_scattor_'+this.elId"></div>
</template>
 
 <script>
import { fromJS } from "immutable";
import echarts from "echarts"; //引入echarts
export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    elId: {
      type: String,
      default: ""
    },
    chartConfig: {
      type: Object,
      default: function() {
        return {
          title: {
            text: "20%",
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "rgb(96, 98, 102)",
              fontSize: "20"
            }
          },
          color: ["#69BAFF"],
          legend: {
            show: false,
            itemGap: 12,
            data: ["01", "02"]
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                }
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
                        show: false
                      },
                      labelLine: {
                        show: false
                      }
                    }
                  }
                },
                {
                  name: "正确字段占比",
                  value: 80
                }
              ]
            }
          ]
        };
      }
    }
  },
  watch: {
    data: {
      handler: function(newVal, oldVal) {
        setTimeout(() => {
          this.draw();
        }, 0);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    draw() {
      let myChart = this.$echarts.init(
        document.getElementById(`chart_scattor_${this.elId}`)
      );
      // 绘制图表
      if (this.chartConfig && this.chartConfig.series) {
        if (this.data && this.data.length) {
          let self = this;
          const ImmuSourceConfig = fromJS(this.chartConfig);
          const newChartConfig = ImmuSourceConfig.updateIn(
            ["series"],
            seriesItem => {
              // TODO 待优化
              return seriesItem.update(0, dataItem => {
                return dataItem.updateIn(["data"], valItem => {
                  return valItem.map(function(item, index) {
                    return item.set("value", self.data[index]);
                  });
                });
              });
            }
          );
          myChart.setOption(newChartConfig.toJS());
        } else {
          myChart.clear();
        }
      } else {
        myChart.clear();
      }
    }
  }
};
</script>
 
<style lang="scss" scoped>
.chart-view {
  width: 100%;
  height: 100%;
}
</style>
