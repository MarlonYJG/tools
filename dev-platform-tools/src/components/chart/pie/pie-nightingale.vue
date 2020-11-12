<!--
 * @Author: Marlon
 * @Date: 2020-03-20 11:11:13
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-26 12:42:53
 * @Description: 南丁格尔饼图
 -->
 <template>
  <div class="chart-view" :id="'chart_pie_nightingale_'+this.elId"></div>
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
            show: false,
            text: "南丁格尔玫瑰图",
            x: "center"
          },
          color: [
            "#80E8B4",
            "#CEA2F4",
            "#69BBFF",
            "#6ED9FF",
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea"
          ],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          toolbox: {
            show: false,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              magicType: {
                show: true,
                type: ["pie", "funnel"]
              },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          calculable: true,
          series: [
            {
              name: "错误字段分布",
              type: "pie",
              radius: [60, 120],
              //   startAngle:90,
              roseType: "area",
              label: {
                normal: {
                  formatter: ["{c|{d}%}", "{b|{b}}"].join("\n"),
                  rich: {
                    c: {
                      color: "rgb(96, 98, 102)",
                      fontSize: 15,
                      //   fontWeight: "bold",
                      lineHeight: 5
                    },
                    b: {
                      color: "rgb(96, 98, 102)",
                      fontSize: 15,
                      height: 40
                    }
                  }
                }
              },
              data: [
                { value: 5, name: "控制检查" },
                { value: 10, name: "值域检查" },
                { value: 15, name: "完整性检查" },
                { value: 20, name: "逻辑检查" }
              ].sort(function(a, b) {
                return a.value - b.value;
              })
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
        document.getElementById(`chart_pie_nightingale_${this.elId}`)
      );
      // 绘制图表
      if (this.chartConfig && this.chartConfig.series) {
        if (this.data && this.data.length) {
          // TODO 待优化
          const ImmuSourceConfig = fromJS(this.chartConfig);
          const newChartConfig = ImmuSourceConfig.updateIn(
            ["series"],
            seriesItem => {
              return seriesItem.update(0, dataItem => {
                return dataItem.updateIn(["data"], valItem => {
                  return this.data;
                });
              });
            }
          );
          const newOption = newChartConfig.toJS();
          newOption.series[0].data = newOption.series[0].data.sort(function(
            a,
            b
          ) {
            return a.value - b.value;
          });
          myChart.setOption(newOption);
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