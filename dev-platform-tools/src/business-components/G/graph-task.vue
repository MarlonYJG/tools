<!--
 * @Author: Marlon
 * @Date: 2020-05-13 09:32:58
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-10 14:42:55
 * @Description: 拓扑图(任务)
 -->
 <template>
  <div class="graph-task">
    <el-button class="save" type="primary" size="small" @click="saveG" :loading="GsaveLoading">保存</el-button>
    <div class="canvas" id="g1"></div>
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="GraphTDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="400"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" style="text-align: center;">
        <el-select size="small" v-model="value" filterable placeholder="请选择" clearable>
          <el-option
            v-for="item in GraphTDigOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </SoltDialog>
  </div>
</template>
 
 <script>
import G6 from "@antv/g6";
import SoltDialog from "@/components/dialog/solt-dialog";
import API from "api/index";
import { ResDatas, globalLoading } from "utils/res-format";
import { max } from "moment";

/* ************** */
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };

//  组件props
const props = {
  // data: mockDatas_,
  config: {
    padding: [20, 50],
    defaultLevel: 3,
    defaultZoom: 0.8,
    modes: { default: ["zoom-canvas", "drag-canvas"] },
  },
  nodeClick: (item) => {
    console.log(item);
  },
};
let backUpData;
let maxMatrixY = 0;
let isAnimating = false;
let I = 5;

let graph = null;

export default {
  props: {
    GId: {
      type: String,
      default: "",
    },
    GraphTDigTitle: {
      type: String,
      default: "",
    },
    GsaveLoading: {
      type: Boolean,
      default: false,
    },
    GraphTDigSelect: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 任务 下拉列表
    GraphTDigOption: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 拓扑图数据
    Gdata: {
      type: Object,
      default: function () {
        return {
          nodes: [],
          edges: [],
        };
      },
    },
    GTreeActive: {
      type: [Object, String],
      default: function () {
        return null;
      },
    },
  },
  components: {
    SoltDialog,
  },
  data() {
    return {
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [
        {
          label: "确定",
          css: "primary",
          cb: () => {
            const GlobalLoading = globalLoading();
            this.SoltDigShow = false;

            let name_ = "";
            this.GraphTDigOption.forEach((item) => {
              if (item.value == this.value) {
                name_ = item.label;
              }
            });

            // 更新绘制数据
            this.GTgraphData.nodes.forEach((item) => {
              if (this.activeNode_.id == item.id) {
                this.$set(item, `arrangeTaskId`, this.value);
                this.$set(item, `taskName`, name_);
              }
            });
            const itemM = graph.findById(this.activeNode_.id);
            graph.removeItem(itemM);
            graph.changeData(this.GTgraphData);

            console.log(this.activeNode_, "当前节点", "任务");
            if (this.activeNode_.state == 0 || this.activeNode_.state == 2) {
              // 修改当前节点对应的父节点(返回数据)
              this.GTgraphData.edges.forEach((item) => {
                if (this.activeNode_.id == item.target) {
                  this.GTgraphData.nodes.forEach((item_) => {
                    if (item.source == item_.id) {
                      this.reqData.push({
                        arrangeTaskId: item_.arrangeTaskId,
                        childArrangeTaskId: this.value,
                        childNodeNum: item_.childNodeNum,
                        nodeNum: item_.id,
                        state: 2,
                        id: item_.node_id,
                        taskName: item_.taskName,
                        xAxis: item_.x,
                        yAxis: item_.y,
                      });
                    }
                  });
                }
              });
              // 修改当前节点(返回数据)
              this.reqData.push({
                arrangeTaskId: this.value,
                childArrangeTaskId: this.activeNode_.childArrangeTaskId,
                childNodeNum: this.activeNode_.childNodeNum,
                nodeNum: this.activeNode_.id,
                state: 2,
                id: this.activeNode_.node_id,
                taskName: this.activeNode_.taskName,
                xAxis: this.activeNode_.x,
                yAxis: this.activeNode_.y,
              });
            } else {
              // 在生成的数据中查找并修改
              this.reqData.forEach((item) => {
                // 修改当前节点
                if (this.activeNode_.id == item.nodeNum) {
                  item.arrangeTaskId = this.value;
                  item.taskName = name_;
                }
                // 修改生成节点关联父节点的任务(多个父节点)
                if (this.activeNode_.id == item.childNodeNum) {
                  item.childArrangeTaskId = this.value;
                }
              });
            }
            setTimeout(() => {
              GlobalLoading.close();
            }, 150);
          },
        },
      ],
      // 弹出框-下拉
      value: "",
      options: [],
      // 临时记录点击的节点
      activeNode_: "",
      // 拓扑图数据
      GTgraphData: {
        nodes: [],
        edges: [],
      },
      // G6实例
      graph: null,
      // 请求参数数据字典
      reqData: [],
    };
  },
  watch: {
    Gdata: {
      handler(newVal) {
        if (newVal && this.GTreeActive) {
          setTimeout(() => {
            console.log(newVal, "shuj", this.GTreeActive, this.GraphTDigOption);
            // 获取激活的任务菜单(任务id)
            let activeTreeTaskId = "";
            if (this.GTreeActive) {
              if (this.GTreeActive.info.flag == "task") {
                // 任务
                activeTreeTaskId = this.GTreeActive.id;
              } else if (this.GTreeActive.info.flag == "table") {
                // 表
                activeTreeTaskId = this.GTreeActive.pid;
              }
            }
            console.log(activeTreeTaskId);
            // 获取激活的任务菜单(任务名称)
            let activeTreeTaskName = "";
            this.GraphTDigOption.forEach((item) => {
              if (activeTreeTaskId == item.id) {
                activeTreeTaskName = item.label;
              }
            });
            if (newVal && newVal.nodes) {
              if (newVal.nodes.length) {
                let obj_ = {};
                if (newVal.nodes) {
                  obj_["nodes"] = JSON.parse(JSON.stringify(newVal)).nodes;
                } else {
                  obj_["nodes"] = [];
                }
                if (newVal.edges) {
                  obj_["edges"] = JSON.parse(JSON.stringify(newVal)).edges;
                } else {
                  obj_["edges"] = [];
                }
                this.GTgraphData = JSON.parse(JSON.stringify(obj_));
                this.reqData = [];
              } else {
                let nodeNumIndex = "1";
                if (newVal.nodeNumMax) {
                  nodeNumIndex = Number(newVal.nodeNumMax) + 1 + "";
                }
                console.log(this.nodeNumIndex, "=====================初始值");
                // 启动默认值
                this.GTgraphData = {
                  nodes: [
                    {
                      id: nodeNumIndex,
                      taskOrTable: "task",
                      childArrangeTaskId: 0,
                      childNodeNum: 0,
                      taskName: activeTreeTaskName,
                      arrangeTaskId: activeTreeTaskId
                        ? Number(activeTreeTaskId)
                        : "",
                      x: 200,
                      y: 100,
                      state: 1,
                    },
                  ],
                  edges: [],
                };
                this.reqData = [
                  {
                    taskOrTable: "task",
                    taskName: activeTreeTaskName,
                    arrangeTaskId: activeTreeTaskId
                      ? Number(activeTreeTaskId)
                      : "",
                    childArrangeTaskId: 0,
                    childNodeNum: 0,
                    nodeNum: nodeNumIndex,
                    state: 1,
                    xAxis: 200,
                    yAxis: 100,
                  },
                ];
              }
            }
            // 重新渲染
            graph.clear();
            graph.destroy();
            this.initData(this.GTgraphData);
            this.initGraph(this.GTgraphData);
          }, 0);
        } else {
          graph.clear();
        }
      },
      deep: true,
    },
    GTreeActive: {
      handler(newVal) {
        if (!newVal) {
          graph.clear();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = editItem.close;
      } else if (text === "删除") {
      }
    },
    // 数据初始化
    initData(data) {
      if (data.nodes && data.nodes.length) {
        data.nodes.forEach((item) => {
          item["type"] = "flow-rect";
          item["coefficientX"] = 0.2;
          item["coefficientY"] = -0.1;
          item["dialog"] = true;
        });
      }
    },
    // 保存
    saveG() {
      this.$emit("Gsave", { gId: this.GId, reqData: this.reqData });
    },
    /**
     * sleep
     * @param {duration} number unit ms
     */
    sleep(duration = 500) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve("done");
        }, duration);
      });
    },
    /**
     * 创建提示
     * @param {postion} 鼠标点击的位置
     * @param {name} string 节点名称
     * @param {id} string 节点id
     */
    createTooltip(postion, name, id) {
      const offsetTop = -60;
      const existTooltip = document.getElementById(id);
      const x = postion.x + "px";
      const y = postion.y + offsetTop + "px";
      if (existTooltip) {
        existTooltip.style.left = x;
        existTooltip.style.top = y;
      } else {
        // content
        const tooltip = document.createElement("div");
        const span = document.createElement("span");
        span.textContent = name;
        tooltip.style.padding = "10px";
        tooltip.style.background = "rgba(0,0,0, 0.65)";
        tooltip.style.color = "#fff";
        tooltip.style.borderRadius = "4px";
        tooltip.appendChild(span);
        // box
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.zIndex = "99";
        div.id = id;
        div.style.left = x;
        div.style.top = y;
        div.appendChild(tooltip);
        document.body.appendChild(div);
      }
    },
    /**
     * 删除提示
     * @param {id} string
     */
    removeTooltip(id) {
      const removeNode = document.getElementById(id);
      if (removeNode) {
        document.body.removeChild(removeNode);
      }
    },
    /**
     * 计算位置
     * @param {data} Array<Item>
     * @param {flag} string[] | string
     * @param {postion} object
     */
    getExpandPosition(data) {
      maxMatrixY = 0;
      const graphData = {
        nodes: [],
        edges: [],
      };
      if (!data) {
        return graphData;
      }
      this.recursionExpand(data, 0, graphData);
      return graphData;
    },
    /**
     * 展开时的特殊处理
     */
    recursionExpand(
      data,
      parentMatrixX,
      graphData,
      parentX,
      parentY,
      parentAnimate
    ) {
      let $this = this;
      if (!data || !data.length) {
        return;
      }
      data.forEach((item, index) => {
        const matrixX = parentMatrixX || 0;
        const children = $this.get(item, "childList", []);
        const animate = $this.get(item, "animate", false);
        const afterDrawHidden = $this.get(item, "afterDrawHidden", false);
        const collapsed = $this.get(item, "collapsed");
        const currentX = parentAnimate === "expand" ? parentX : item.x;
        const currentY = parentAnimate === "expand" ? parentY : item.y;
        item = Object.assign(Object.assign({}, item), {
          id: $this.toString(item.id),
          x: currentX,
          y: currentY,
          hasChildren: children.length,
        });
        data[index] = item;
        const { childList } = item,
          model = __rest(item, ["childList"]);
        graphData.nodes.push(model);
        if ((children.length && animate) || (children.length && !collapsed)) {
          $this.recursionExpand(
            children,
            afterDrawHidden ? matrixX : matrixX + 1,
            graphData,
            currentX,
            currentY,
            animate
          );
        }
      });
    },
    /**
     * 更新当前数据的collapse状态以及子节点的afterDrawHidden状态
     * @param {id} string
     * @param {recordIndex} string 节点索引
     * @param {collapsed} boolean
     */
    updateCollapseStatus(id, recordIndex, collapsed, animate) {
      let $this = this;
      let currentList = backUpData;
      try {
        let currentRecord;
        const indexs = recordIndex.split("-");
        for (let i = 0; i < indexs.length; i += 1) {
          currentRecord = currentList[indexs[i]];
          currentList = currentList[indexs[i]].childList;
        }
        currentRecord.collapsed = !collapsed;
        currentRecord.animate = animate;
        const setHidden = (data) => {
          if (!data || !data.length) {
            return;
          }
          data.forEach((item, index) => {
            const children = $this.get(item, "childList", []);
            data[index] = Object.assign(Object.assign({}, item), {
              afterDrawHidden: !collapsed,
            });
            if (children.length && !item.collapsed) {
              setHidden(children);
            }
          });
        };
        setHidden(currentList);
      } catch (err) {
        console.error(err, id, currentList);
      }
    },
    // 事件绑定
    initEvent() {
      graph.on("node:click", async (evt) => {
        const { item, target } = evt;
        const {
          attrs: { text, width, height, dialog },
        } = target;

        /* 计算要生成节点的Id */
        let max_ = [];
        console.log(this.Gdata, "=====================初始值");
        if (this.Gdata && this.Gdata.nodeNumMax) {
          console.log(this.Gdata, "=====================初始值");
          max_.push(Number(this.Gdata.nodeNumMax));
        }
        let modelId = "";
        this.GTgraphData.nodes.forEach((n) => {
          if (n.nodeNum) {
            max_.push(Number(n.nodeNum));
          } else {
            max_.push(Number(n.id));
          }
        });

        if (max_.length) {
          modelId = Math.max.apply(null, max_) + 1 + "";
        } else {
          modelId = this.GTgraphData.nodes.length + 1 + "";
        }
        /* 动态计算生成节点的位置 */
        const model = item.getModel();

        this.activeNode_ = model;

        switch (text) {
          case "前置":
            {
              let x = model.x - 150;
              let y = model.y;
              // 设置新节点的Y轴位置
              let arrY_ = [];
              this.reqData.forEach((reqNode_) => {
                if (model.id == reqNode_.childNodeNum) {
                  if (reqNode_.childNodeNum) {
                    arrY_.push(Number(reqNode_.yAxis));
                    this.GTgraphData.nodes.forEach((node_) => {
                      if (reqNode_.nodeNum == node_.id) {
                        arrY_.push(Number(node_.y));
                      }
                    });
                  }
                }
              });

              if (arrY_.length) {
                y = Math.max.apply(null, arrY_) + 65;
              }
              // 位置重复(已占位)
              this.GTgraphData.nodes.forEach((node_) => {
                if (x == node_.x) {
                  arrY_.push(Number(node_.y));
                }
              });
              if (arrY_.length) {
                y = Math.max.apply(null, arrY_) + 65;
              }

              // 生成节点
              this.GTgraphData.nodes.push({
                id: modelId,
                name: "",
                taskName: "",
                x,
                y,
                type: "flow-rect",
                coefficientX: 0.2,
                coefficientY: -0.1,
                state: 1,
                taskOrTable: "task",
              });
              // 生成连线
              this.GTgraphData.edges.push({
                source: model.id,
                target: modelId,
                type: "line",
              });
              graph.changeData(this.GTgraphData);
              // 存储生成的父节点
              this.reqData.push({
                arrangeTaskId: "",
                childArrangeTaskId: model.arrangeTaskId || 0,
                childNodeNum: model.id,
                nodeNum: modelId,
                state: 1,
                taskName: "",
                xAxis: x,
                yAxis: y,
                taskOrTable: "task",
              });
            }
            return;
          case "后置":
            {
              let x = model.x + 150;
              let y = model.y;
              // 设置新节点的Y轴位置
              let arrY_ = [];
              this.reqData.forEach((reqNode_) => {
                if (model.id == reqNode_.nodeNum) {
                  if (reqNode_.childNodeNum) {
                    arrY_.push(Number(reqNode_.yAxis));
                    this.GTgraphData.nodes.forEach((node_) => {
                      if (reqNode_.childNodeNum == node_.id) {
                        arrY_.push(Number(node_.y));
                      }
                    });
                  }
                }
              });

              if (arrY_.length) {
                y = Math.max.apply(null, arrY_) + 65;
              }

              // 位置重复(已占位)
              this.GTgraphData.nodes.forEach((node_) => {
                if (x == node_.x) {
                  arrY_.push(Number(node_.y));
                }
              });

              if (arrY_.length) {
                y = Math.max.apply(null, arrY_) + 65;
              }
              // 生成节点
              this.GTgraphData.nodes.push({
                id: modelId,
                name: "",
                taskName: "",
                x,
                y,
                type: "flow-rect",
                coefficientX: 0.2,
                coefficientY: -0.1,
                state: 1,
                taskOrTable: "task",
              });
              // 生成连线
              this.GTgraphData.edges.push({
                source: model.id,
                target: modelId,
                targetAnchor: 0,
                sourceAnchor: 1,
                type: "line",
              });
              graph.changeData(this.GTgraphData);
              // 修改关联父节点
              console.log(model, "当前节点");
              // 获取当前节点
              let nowNode = "";
              this.reqData.forEach((node_) => {
                if (model.id == node_.nodeNum) {
                  nowNode = node_;
                }
              });

              if (!Number(nowNode.childNodeNum)) {
                //没节点
                if (model.state == 0) {
                  this.reqData.push({
                    arrangeTaskId: model.arrangeTaskId,
                    childArrangeTaskId: 0,
                    childNodeNum: modelId,
                    nodeNum: model.id,
                    state: 2,
                    id: model.node_id,
                    taskName: model.taskName,
                    xAxis: model.x,
                    yAxis: model.y,
                    taskOrTable: "task",
                  });
                } else {
                  this.reqData.forEach((reqNode) => {
                    if (model.id == reqNode.nodeNum) {
                      reqNode.childNodeNum = modelId;
                    }
                  });
                }
              } else {
                this.reqData.push({
                  arrangeTaskId: model.arrangeTaskId,
                  childArrangeTaskId: 0,
                  childNodeNum: modelId,
                  nodeNum: model.id,
                  state: 1,
                  taskName: model.taskName,
                  xAxis: model.x,
                  yAxis: model.y,
                  taskOrTable: "task",
                });
              }
              // 存储生成的子节点
              this.reqData.push({
                arrangeTaskId: "",
                childArrangeTaskId: 0,
                childNodeNum: 0,
                nodeNum: modelId,
                state: 1,
                taskName: "",
                xAxis: x,
                yAxis: y,
                taskOrTable: "task",
              });
            }
            return;
          case "X":
            {
              // TODO 如果当前节点存在 前置和后置任务时，则不可删除
              let delReq = [];
              // 获取存储关系的数据(并非节点数据)——删除 构建的请求参数字典
              if (model.state == 0 || model.state == 2) {
                delReq.push(model.node_id);
                this.GTgraphData.nodes.forEach((nodeItem) => {
                  if (model.id == nodeItem.childNodeNum) {
                    delReq.push(nodeItem.node_id);
                  }
                });
                // 请求
                API.workTaskViewTaskNodeDel({
                  ids: delReq.join(),
                }).then((res) => {
                  new ResDatas({
                    res,
                    code: 0,
                  }).state();
                  this.$emit("refshGraph");
                });
              } else {
                let reqNode_ = this.reqData.filter((reqNode, index) => {
                  if (model.id != reqNode.nodeNum) {
                    return reqNode;
                  }
                });
                this.reqData = reqNode_;
              }
              // 删除关联线
              this.GTgraphData.edges.forEach((edgesItem, i) => {
                if (model.id == edgesItem.source) {
                  this.GTgraphData.edges.splice(i, 1);
                }
                if (model.id == edgesItem.target) {
                  this.GTgraphData.edges.splice(i, 1);
                }
              });
              // 删除点
              this.GTgraphData.nodes.forEach((nodesItem, i) => {
                if (model.id == nodesItem.id) {
                  this.GTgraphData.nodes.splice(i, 1);
                }
              });
              graph.changeData(this.GTgraphData);
              this.$emit("refshGraph");
            }
            return;
          default:
            break;
        }
        if (dialog || (width && height)) {
          console.log("弹出框-选择-任务");
          this.value = model.arrangeTaskId;
          this.SoltDigShow = true;
          return;
        }
      });
      graph.on("node:mouseenter", (evt) => {
        const node = evt.item;
        graph.setItemState(node, "hover", true);
        graph.updateItem(node, {
          style: Object.assign(Object.assign({}, node._cfg.originStyle), {
            shadowColor: "#bbb",
            shadowBlur: 6,
          }),
        });
      });
      graph.on("node:mousemove", (evt) => {
        if (isAnimating) {
          return;
        }
        const { item, target, x, y } = evt;
        const {
          attrs: { isTitleShape },
        } = target;
        const model = item.getModel();
        const { taskName, id } = model;
        if (isTitleShape) {
          const postion = graph.getClientByPoint(x, y);
          this.createTooltip(postion, taskName, id);
        } else {
          this.removeTooltip(id);
        }
      });
      graph.on("node:mouseout", (evt) => {
        if (isAnimating) {
          return;
        }
        const { item, target } = evt;
        const {
          attrs: { isTitleShape },
        } = target;
        const model = item.getModel();
        const { id } = model;
        if (isTitleShape) {
          this.removeTooltip(id);
        }
      });
      graph.on("node:mouseleave", (evt) => {
        const node = evt.item;
        graph.setItemState(node, "hover", false);
        graph.updateItem(node, {
          style: Object.assign(Object.assign({}, node._cfg.originStyle), {
            shadowColor: "transparent",
            shadowBlur: 0,
          }),
        });
      });
    },
    /**
     * 简易get，项目中请使用lodash的get
     * @param {Object} object 查找对象
     * @param {string} path 查找路径
     * @param {*} defaultValue 默认值
     */
    get(object, path, defaultValue) {
      return (
        (object === null || object === void 0 ? void 0 : object[path]) ||
        defaultValue
      );
    },
    // number to string
    toString(id) {
      return id + "";
    },
    /**
     * 计算位置
     * @param {data} Array<Item>
     * @param {flag} string[] | string
     * @param {postion} object
     */
    getPosition(data, init) {
      maxMatrixY = 0;
      const graphData = {
        nodes: [],
        edges: [],
      };
      if (!data) {
        return graphData;
      }
      if (init) {
        this.initAnimateData(data, graphData);
      } else {
        this.recursion(data, 0, graphData);
      }
      console.log(graphData);
      return graphData;
    },
    /**
     * 生成初始化数据，为了动画而动画
     */
    initAnimateData(data, graphData) {
      let $this = this;
      if (!data || !data.length) {
        return;
      }
      data.forEach((item) => {
        const children = $this.get(item, "childList", []);
        const collapsed = $this.get(item, "collapsed");
        const model = __rest(item, ["childList"]);
        console.log(model, "子节点");
        graphData.nodes.push(model);
        if (children.length && !collapsed) {
          $this.initAnimateData($this.get(item, "childList", []), graphData);
        }
      });
    },
    /**
     * 递归
     */
    recursion(data, parentMatrixX) {
      let $this = this;
      if (!data || !data.length) {
        return;
      }
      const {
        config: {
          padding = [20, 20],
          nodesMargin = [250, 100],
          coefficient = [0.2, -0.1],
        },
      } = props;
      data.nodes.forEach((item, index) => {
        item = Object.assign(Object.assign({}, item), {
          id: $this.toString(item.id),
          // matrixX,
          // matrixY: maxMatrixY,
          x: item.x,
          y: item.y,
          type: "flow-rect",
          coefficientX: coefficient[0],
          coefficientY: coefficient[1],
        });
        data[index] = item;

        if (parentId) {
          data.edges.push({
            source: parentId,
            target: $this.toString(item.id),
            targetAnchor: 0,
            sourceAnchor: 1,
            type: index === 0 ? "line" : "flow-cubic",
          });
        }
      });
    },
    /**
     * 数据转换，生成图表数据
     */
    transformData(data, parentIndex) {
      let $this = this;
      if (!data || !data.length) {
        return;
      }
      const {
        config: { defaultLevel = 10, padding = [20, 20] },
      } = props;
      data.forEach((item, index) => {
        item = Object.assign(Object.assign({}, item), {
          lightColor: "#1890FF",
          id: $this.toString(item.id),
          x: item.x,
          y: item.y,
        });
        data[index] = item;
      });
    },
    /**
     * 获取keys, 折叠、展开时直接使用
     * @param {data} ListItem
     * @param {keys} string[]
     */
    getKeys(data, keys) {
      let $this = this;
      if (!data || !data.length) {
        return;
      }
      data.forEach((item) => {
        const { id } = item;
        const children = $this.get(item, "childList", []);
        keys.push(id);
        if (children.length) {
          $this.getKeys(children, keys);
        }
      });
    },
    // 自定义节点、边
    registerFn() {
      let $this = this;
      G6.registerNode(
        "flow-rect",
        {
          shapeType: "flow-rect",
          draw(cfg, group) {
            console.log("~~~~~~~~~ 任务 ");
            const {
              name = "",
              lightColor,
              hasChildren,
              label,
              rate,
              collapsed,
              taskName = "",
              x,
              y,
            } = cfg;
            // 逻辑不应该在这里判断
            const rectConfig = {
              width: 200,
              height: 100,
              lineWidth: 1,
              fontSize: 12,
              fill: "#fff",
              radius: 4,
              stroke: "#1890FF",
              opacity: 1,
              x,
              y,
              dialog: true,
            };
            const textConfig = {
              textAlign: "left",
              textBaseline: "top",
            };
            const rect = group.addShape("rect", {
              attrs: Object.assign({ x: 0, y: 0 }, rectConfig),
            });
            // 标题判断
            function ItemTitle() {
              let title = "任务：" + taskName;
              if (title.length > 10) {
                title = title.substr(0, 10) + "...";
              } else {
                title = title;
              }
              return title;
            }
            // 标题
            group.addShape("text", {
              attrs: Object.assign(Object.assign({}, textConfig), {
                x: x + 12,
                y: y + 10,
                text: ItemTitle(),
                fontSize: 18,
                fill: "#000",
                cursor: "pointer",
                isTitleShape: true,
                dialog: true,
              }),
            });
            // 前置
            group.addShape("circle", {
              attrs: {
                x: x + rectConfig.width - 170,
                y: y + rectConfig.height / 2 + 25,
                r: 18,
                stroke: "#E4E7ED",
                fill: "#fff",
                isCollapseShape: true,
              },
            });
            group.addShape("text", {
              attrs: {
                x: x + rectConfig.width - 170,
                y: y + rectConfig.height / 2 + 25,
                width: 16,
                height: 16,
                textAlign: "center",
                textBaseline: "middle",
                text: "前置",
                fontSize: 12,
                fill: "#000",
                cursor: "pointer",
                isCollapseShape: true,
              },
            });
            // 后置
            group.addShape("circle", {
              attrs: {
                x: x + rectConfig.width - 30,
                y: y + rectConfig.height / 2 + 25,
                r: 18,
                stroke: "#E4E7ED",
                fill: "#fff",
                isCollapseShape: true,
              },
            });
            group.addShape("text", {
              attrs: {
                x: x + rectConfig.width - 30,
                y: y + rectConfig.height / 2 + 25,
                width: 16,
                height: 16,
                textAlign: "center",
                textBaseline: "middle",
                text: "后置",
                fontSize: 12,
                fill: "#000",
                cursor: "pointer",
                isCollapseShape: true,
              },
            });
            // 删除
            group.addShape("circle", {
              attrs: {
                x: x + rectConfig.width - 100,
                y: y + rectConfig.height / 2 + 30,
                r: 12,
                stroke: "#E4E7ED",
                fill: "#fff",
                isCollapseShape: true,
              },
            });
            group.addShape("text", {
              attrs: {
                x: x + rectConfig.width - 100,
                y: y + rectConfig.height / 2 + 32,
                width: 14,
                height: 14,
                textAlign: "center",
                textBaseline: "middle",
                text: "X",
                fontSize: 16,
                fill: "#000",
                cursor: "pointer",
                isCollapseShape: true,
              },
            });

            this.drawLinkPoints(cfg, group);
            return rect;
          },
          update(cfg, item) {
            const group = item.getContainer();
            this.updateLinkPoints(cfg, group);
          },
          setState(name, value, item) {
            if (name === "click" && value) {
              //   console.log("===", name, item, "===");
              //   console.log("value", value);
              //   const group = item.getContainer();
              //   const { collapsed } = item.getModel();
              //   const [, , , , , , CircleShape, TextShape] = group.get(
              //     "children"
              //   );
              //   if (TextShape) {
              //     const {
              //       attrs: { stroke }
              //     } = CircleShape;
              //     if (!collapsed) {
              //       TextShape.attr({
              //         text: "-",
              //         fill: stroke
              //       });
              //       CircleShape.attr({
              //         fill: "#fff"
              //       });
              //     } else {
              //       TextShape.attr({
              //         text: "+",
              //         fill: "#fff"
              //       });
              //       CircleShape.attr({
              //         fill: stroke
              //       });
              //     }
              //   }
            }
          },
          getAnchorPoints() {
            return [
              [0, 0.5],
              [1, 0.5],
            ];
          },
        },
        // 注意这里继承了 'single-shape'
        "rect"
      );
      G6.registerEdge(
        "flow-cubic",
        {
          getControlPoints(cfg) {
            let controlPoints = cfg.controlPoints; // 指定controlPoints
            if (!controlPoints || !controlPoints.length) {
              const { startPoint, endPoint, sourceNode, targetNode } = cfg;
              const {
                x: startX,
                y: startY,
                coefficientX,
                coefficientY,
              } = sourceNode ? sourceNode.getModel() : startPoint;
              const { x: endX, y: endY } = targetNode
                ? targetNode.getModel()
                : endPoint;
              let curveStart = (endX - startX) * coefficientX;
              let curveEnd = (endY - startY) * coefficientY;
              curveStart = curveStart > 40 ? 40 : curveStart;
              curveEnd = curveEnd < -30 ? curveEnd : -30;
              controlPoints = [
                { x: startPoint.x + curveStart, y: startPoint.y },
                { x: endPoint.x + curveEnd, y: endPoint.y },
              ];
            }
            return controlPoints;
          },
          getPath(points) {
            const path = [];
            path.push(["M", points[0].x, points[0].y]);
            path.push([
              "C",
              points[1].x,
              points[1].y,
              points[2].x,
              points[2].y,
              points[3].x,
              points[3].y,
            ]);
            return path;
          },
        },
        "single-line"
      );
    },
    //
    initGraph(data) {
      const width = document.getElementById(`g1`).scrollWidth;
      const height = document.getElementById(`g1`).scrollHeight || 500;
      const defaultConfig = {
        width,
        height,
        pixelRatio: 1,
        modes: {
          default: ["zoom-canvas", "drag-canvas"],
        },
        fitView: false,
        animate: true,
        defaultEdge: {
          style: {
            stroke: "#1890FF",
          },
        },
      };
      const { config } = props;
      graph = new G6.Graph(
        Object.assign(Object.assign({ container: `g1` }, defaultConfig), config)
      );
      // 初始化数据
      this.initData(data);
      // 注册事件
      this.initEvent();
      // 填充数据
      graph.data(data);
      graph.render();
      graph.zoom(0.8);
    },
  },
  mounted() {
    this.registerFn();
    this.initGraph(this.GTgraphData);
  },
};
</script>
 
<style lang="scss" scoped>
.graph-task {
  width: 100%;
  height: 100%;
  .save {
    float: right;
    margin-right: 15px;
    margin-bottom: 10px;
  }
  .canvas {
    width: 100%;
    height: calc(100% - 45px);
    box-sizing: border-box;
    border: 1px solid #f0f0f0;
    overflow: auto;
  }
}
</style>
