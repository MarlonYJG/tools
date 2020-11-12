<!--
 * @Author: Marlon
 * @Date: 2020-03-21 10:41:00
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-23 09:56:09
 * @Description: 流程图-业务组件
 -->
 <template>
  <div class="g6-custom-flow-chart" id="container_g6"></div>
</template>
 
 <script>
import G6 from "@antv/g6";
import imgField from "@/assets/icon/field.png";
import imgBidEvaluation from "@/assets/icon/bid-evaluation.png";
import imgCorrect from "@/assets/icon/correct.png";
import imgDelete from "@/assets/icon/delete.png";
import imgError from "@/assets/icon/error.png";
import imgLib from "@/assets/icon/import_lib.png";

export default {
  props: {
    FCNode: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      flowChartConfig: {
        nodes: [
          {
            id: "node1",
            label: "字段：0",
            x: 80,
            y: 100,
            icon: {
              show: true,
              img: imgField,
              width: 20,
              height: 20
            }
          },
          {
            id: "node2",
            label: "正确字段：0个",
            x: 80 + 200,
            y: 100,
            icon: {
              show: true,
              img: imgCorrect,
              width: 20,
              height: 20
            }
          },
          {
            id: "node3",
            label: "错误字段：0个",
            x: 80 + 200,
            y: 100 + 150,
            icon: {
              show: true,
              img: imgError,
              width: 20,
              height: 20
            }
          },
          {
            id: "node4",
            label: "净化字段：0个",
            x: 600,
            y: 175,
            icon: {
              show: true,
              img: imgBidEvaluation,
              width: 20,
              height: 20
            }
          },
          {
            id: "node5",
            label: "删除字段：0个",
            x: 600,
            y: 325,
            icon: {
              show: true,
              img: imgField,
              width: 20,
              height: 20
            }
          },
          {
            id: "node6",
            label: "入库数量：0个",
            x: 900,
            y: 175,
            icon: {
              show: true,
              img: imgLib,
              width: 20,
              height: 20
            }
          },
          {
            id: "node7",
            label: "质量检测",
            x: 80 + 100,
            y: 100 - 70,
            type: "rect",
            size: [80, 30],
            style: {
              radius: 2,
              stroke: "rgba(24, 144, 255, 1)",
              lineWidth: 1,
              fillOpacity: 0
            },
            labelCfg: {
              style: {
                fill: "#1890FF",
                fontSize: 14
              }
            }
          },
          {
            id: "node8",
            label: "数据清洗",
            x: 325 + 50,
            y: 250 - 60,
            type: "rect",
            size: [80, 30],
            style: {
              radius: 2,
              stroke: "rgba(24, 144, 255, 1)",
              lineWidth: 1,
              fillOpacity: 0
            },
            labelCfg: {
              style: {
                fill: "#1890FF",
                fontSize: 14
              }
            }
          }
        ],
        edges: [
          {
            source: "node1",
            target: "node2",
            shape: "hvh"
          },
          {
            source: "node2",
            target: "node6",
            shape: "hvh"
          },
          {
            source: "node1",
            target: "node3",
            shape: "hvh"
          },
          {
            source: "node3",
            target: "node4",
            shape: "hvh"
          },
          {
            source: "node3",
            target: "node5",
            shape: "hvh"
          },
          {
            source: "node7",
            target: "node8",
            shape: "line-jt"
          },
          {
            source: "node8",
            target: "node7",
            shape: "line-jt"
          }
        ]
      },
      graphObj: "" // G6 实例对象
    };
  },
  watch: {
    FCNode: {
      handler(newVal) {
        for (const key in this.flowChartConfig) {
          if (this.flowChartConfig.hasOwnProperty(key)) {
            if (key === "nodes") {
              if (this.FCNode && this.FCNode.length) {
                this.flowChartConfig[key].forEach((item, index) => {
                  item.label = newVal[index].label;
                });
              }
            }
          }
        }
        setTimeout(() => {
          this.draw();
        }, 0);
      },
      deep: true
    }
  },
  methods: {
    draw() {
      this.graphObj.changeData(this.flowChartConfig);
    },
    init() {
      this.graphObj = new G6.Graph({
        container: "container_g6",
        width: 1000,
        height: 430,
        defaultNode: {
          type: "circle",
          size: [50],
          color: "rgba(24, 144, 255, 1)",
          style: {
            fill: "#D2EAFE",
            lineWidth: 0
          },
          labelCfg: {
            position: "bottom",
            offset: 10,
            style: {
              fill: "#1890FF",
              fontSize: 14
            }
          }
        },
        defaultEdge: {
          type: "line",
          style: {
            stroke: "rgba(24, 144, 255, 1)",
            lineWidth: 1,
            lineDash: [3, 5] // 虚线
          }
        }
      });
      G6.registerEdge(
        "hvh",
        {
          afterDraw(cfg, group) {
            const shape = group.get("children")[0];
            const startPoint = shape.getPoint(0);
            // 添加圆点
            const circle = group.addShape("circle", {
              attrs: {
                x: startPoint.x,
                y: startPoint.y,
                fill: "#0889FC",
                r: 3
              }
            });

            // 对圆点添加动画
            circle.animate(
              {
                repeat: true,
                onFrame(ratio) {
                  const tmpPoint = shape.getPoint(ratio);
                  return {
                    x: tmpPoint.x,
                    y: tmpPoint.y
                  };
                }
              },
              3000
            );
          },
          draw(cfg, group) {
            const startPoint = cfg.startPoint;
            const endPoint = cfg.endPoint;
            let shape = "";
            if (cfg.source == "node1" && cfg.target == "node2") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, startPoint.y],
                    ["L", startPoint.x + 150, startPoint.y]
                  ]
                }
              });
            } else if (cfg.source == "node1" && cfg.target == "node3") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x + 52, startPoint.y - 10],
                    [
                      "L",
                      endPoint.x / 3 + (2 / 3) * startPoint.x,
                      startPoint.y - 10
                    ], // 三分之一处
                    [
                      "L",
                      endPoint.x / 3 + (2 / 3) * startPoint.x,
                      endPoint.y + 15
                    ], // 三分之二处
                    ["L", endPoint.x, endPoint.y + 15]
                  ]
                }
              });
            } else if (cfg.source == "node3" && cfg.target == "node4") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, startPoint.y + 10],
                    ["L", startPoint.x + 170, startPoint.y + 10],
                    [
                      "L",
                      startPoint.x + 170,
                      startPoint.y - (startPoint.y - 175)
                    ],
                    ["L", 600, startPoint.y - (startPoint.y - 175)],
                    ["M", 600, startPoint.y - (startPoint.y - 175)],
                    ["L", 720, startPoint.y - (startPoint.y - 175)],
                    ["L", 720, startPoint.y - (startPoint.y - 175 - 80)],
                    ["L", 775, startPoint.y - (startPoint.y - 175 - 80)],
                    ["L", 775, startPoint.y - (startPoint.y - 175 - 80) - 80],
                    ["L", 875, startPoint.y - (startPoint.y - 175 - 80) - 80]
                  ]
                }
              });
            } else if (cfg.source == "node3" && cfg.target == "node5") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, startPoint.y - 1],
                    ["L", startPoint.x + 170, startPoint.y - 1],
                    [
                      "L",
                      startPoint.x + 170,
                      startPoint.y + (startPoint.y - 175)
                    ],
                    [
                      "L",
                      startPoint.x + 170 + 100,
                      startPoint.y + (startPoint.y - 175)
                    ],
                    ["L", 720, startPoint.y + (startPoint.y - 175)],
                    ["L", 720, startPoint.y + (startPoint.y - 175) - 78]
                  ]
                }
              });
            } else if (cfg.source == "node4" && cfg.target == "node6") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, startPoint.y],
                    ["L", startPoint.x + 100, startPoint.y],
                    ["L", startPoint.x + 100, startPoint.y + 75]
                    // ["L", startPoint.x + 170, startPoint.y - (startPoint.y - 175)],
                    // ["L", 600, startPoint.y - (startPoint.y - 175)],
                    // ["M", startPoint.x + 170, startPoint.y + 5],
                    // ["L", startPoint.x + 170, 325],
                    // ["L", 600, 325]
                  ]
                }
              });
            } else if (cfg.source == "node5" && cfg.target == "node6") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, 325],
                    ["L", startPoint.x + 103, 325],
                    ["L", startPoint.x + 103, 325 - 75],
                    ["L", startPoint.x + 103 + 50, 325 - 75],
                    ["L", startPoint.x + 103 + 50, 325 - 75 - 75],
                    ["L", startPoint.x + 103 + 50 + 100, 325 - 75 - 75]
                    // ["L", startPoint.x + 170, startPoint.y - (startPoint.y - 175)],
                    // ["L", 600, startPoint.y - (startPoint.y - 175)],
                    // ["M", startPoint.x + 170, startPoint.y + 5],
                    // ["L", startPoint.x + 170, 325],
                    // ["L", 600, 325]
                  ]
                }
              });
            } else if (cfg.source == "node2" && cfg.target == "node6") {
              shape = group.addShape("path", {
                attrs: {
                  stroke: "rgba(24, 144, 255, 1)",
                  lineDash: [3, 5], // 虚线
                  path: [
                    ["M", startPoint.x, startPoint.y - 2],
                    ["L", startPoint.x + 470, startPoint.y - 2],
                    ["L", startPoint.x + 470, startPoint.y + 70]
                  ]
                }
              });
            }
            return shape;
          }
        },
        "cubic"
      );
      G6.registerEdge("line-jt", {
        draw(cfg, group) {
          const startPoint = cfg.startPoint;
          const endPoint = cfg.endPoint;
          let shape = "";
          if (cfg.source == "node7" && cfg.target == "node8") {
            shape = group.addShape("path", {
              attrs: {
                stroke: "rgba(24, 144, 255, 1)",
                path: [
                  ["M", startPoint.x - 35, startPoint.y + 15],
                  ["L", startPoint.x - 35, startPoint.y + 40],
                  ["M", startPoint.x - 45, startPoint.y + 15],
                  ["L", startPoint.x - 45, startPoint.y + 40],
                  ["M", startPoint.x - 40, startPoint.y + 47],
                  ["L", startPoint.x - 50, startPoint.y + 37],
                  ["M", startPoint.x - 40, startPoint.y + 47],
                  ["L", startPoint.x - 30, startPoint.y + 37]
                ]
              }
            });
          } else {
            shape = group.addShape("path", {
              attrs: {
                stroke: "rgba(24, 144, 255, 1)",
                path: [
                  ["M", startPoint.x - 35 + 80, startPoint.y + 15],
                  ["L", startPoint.x - 35 + 80, startPoint.y + 40],
                  ["M", startPoint.x - 45 + 80, startPoint.y + 15],
                  ["L", startPoint.x - 45 + 80, startPoint.y + 40],
                  ["M", startPoint.x - 40 + 80, startPoint.y + 47],
                  ["L", startPoint.x - 50 + 80, startPoint.y + 37],
                  ["M", startPoint.x - 40 + 80, startPoint.y + 47],
                  ["L", startPoint.x - 30 + 80, startPoint.y + 37]
                ]
              }
            });
          }
          return shape;
        }
      });
      this.graphObj.data(this.flowChartConfig);
      this.graphObj.render();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
 <style lang="scss" scoped>
.g6-custom-flow-chart {
  overflow: hidden;
  width: 1000px;
  margin: 0 auto;
  .custom-G6 {
    box-sizing: border-box;
    width: 1000px;
    height: 430px;
    margin: 20px auto;
  }
}
</style>
 

