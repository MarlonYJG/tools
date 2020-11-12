<!--
 * @Author: Marlon
 * @Date: 2020-05-12 14:36:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-10 14:38:56
 * @Description: 添加任务&转换
 -->
 <template>
  <div class="add-task">
    <div class="task-tree">
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        style="margin-bottom: 5px;width: 100%;"
        @click="showSlotDig"
      >新增任务&转换</el-button>
      <el-input placeholder="搜索任务或转换" v-model="filterText" size="small" clearable>
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="getList({type:'默认-模糊匹配'})"
          style="cursor: pointer;"
        ></i>
      </el-input>
      <el-tree
        class="tree"
        ref="tree"
        :highlight-current="true"
        node-key="id"
        :current-node-key="'1'"
        :default-expanded-keys="defaultTree"
        :data="ruleTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <el-tooltip
            v-if="node.label.length >20"
            class="item"
            effect="dark"
            :content="`${node.label}`"
            placement="right"
          >
            <span class="tree-text">{{ node.label }}</span>
          </el-tooltip>
          <span v-else class="tree-text">{{ node.label }}</span>
          <span v-if="data.id == activeTree.id && data.pid == activeTree.pid">
            <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="task-view">
      <div class="M-title">
        <p>
          <i></i>
          <span>
            当前转换:
            <span>北京ods > 标段表</span>
          </span>
        </p>
      </div>
      <el-tabs v-model="activeName" class="task-view-title">
        <el-tab-pane label="任务关联视图" name="1"></el-tab-pane>
        <el-tab-pane label="转换关联视图" name="2"></el-tab-pane>
      </el-tabs>
      <!-- 拓扑图 -->
      <div id="view-area" class="view-area" :style="activeName == 1 ? 'z-index: 1':'z-index: -1'">
        <GraphTask
          GId="g1"
          :GsaveLoading="GsaveLoadingTask"
          GraphTDigTitle="选择任务"
          :GraphTDigOption="taskViewList"
          :Gdata="taskGData"
          :GTreeActive="activeTree"
          @Gsave="Gsave"
          @refshGraph="refshGraph"
        ></GraphTask>
      </div>
      <div class="view-area" :style="activeName == 2 ? 'z-index: 1':'z-index: -1'">
        <GraphTable
          GId="g2"
          :GsaveLoading="GsaveLoadingTable"
          GraphTDigTitle="选择转换"
          :GraphTDigOption="tableViewList"
          :GTreeActive="activeTree"
          :Gdata="tableGData"
          @Gsave="Gsave_1"
          @refshGraph="refshGraph"
        ></GraphTable>
      </div>
    </div>
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="600"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <el-input placeholder="搜索任务或转换" v-model="filterText_2" size="small" clearable>
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="getList({type:'弹出框-模糊匹配'})"
            style="cursor: pointer;"
          ></i>
        </el-input>
        <el-tree
          class="tree"
          ref="modalTree"
          :highlight-current="true"
          show-checkbox
          node-key="id"
          :current-node-key="''"
          :default-expanded-keys="defaultTree"
          :data="ruleTree_2"
          :props="defaultProps"
          @check="check"
          :filter-node-method="filterNode_2"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <el-tooltip class="item" effect="dark" :content="`${node.label}`" placement="top-start">
              <span class="tree-text-search">{{ node.label }}</span>
            </el-tooltip>
          </span>
        </el-tree>
      </div>
    </SoltDialog>
  </div>
</template>
 
<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas, globalLoading } from "utils/res-format";

import SoltDialog from "@/components/dialog/solt-dialog";
import GraphTask from "@/business-components/G/graph-task";
import GraphTable from "@/business-components/G/graph-table";

export default {
  components: {
    SoltDialog,
    GraphTask,
    GraphTable,
  },
  data() {
    return {
      // 任务列表
      filterText: "",
      ruleTree: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultTree: [],
      activeTree: "",
      // 弹出框
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [
        {
          label: "确定",
          css: "primary",
          cb: ({ Item }) => {
            this.add();
          },
        },
      ],
      ruleTree_2: [],
      filterText_2: "",
      queryTree: [],
      // 标签
      activeName: "1",
      // 任务视图
      taskViewList: [],
      // 转换视图
      tableViewList: [],
      // 任务-拓扑图
      taskGData: {},
      GsaveLoadingTask: false,
      // 转换-拓扑图
      tableGData: {},
      GsaveLoadingTable: false,
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterText_2(val) {
      this.$refs.modalTree.filter(val);
    },
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = editItem.close;
        this.queryTree = [];
      } else if (text === "删除") {
      }
    },
    handleNodeClick(data) {
      this.activeTree = data;
      this.getTaskViewList();
      if (data.info.flag == "task") {
        // 任务
        this.getZHViewList({ arrangeTaskId: data.id });
        // 任务
        // 获取拓扑图
        if (this.$route.query && this.$route.query.row) {
          let { id } = JSON.parse(this.$route.query.row);
          // 表
          if (id && data.children && data.children.length) {
            this.graphTable({ arrangeId: id, id: data.children[0].id });
          }
          // 任务
          this.graphTask({ arrangeId: id, id: data.id });
        }
      } else {
        // 表转换
        this.getZHViewList({ arrangeTaskId: data.pid });
        // 获取拓扑图
        if (this.$route.query && this.$route.query.row) {
          let { id } = JSON.parse(this.$route.query.row);
          // 表
          if (id) {
            this.graphTable({ arrangeId: id, id: data.id });
          }
          // 任务
          this.graphTask({ arrangeId: id, id: data.pid });
        }
      }
    },
    // 过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    filterNode_2(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 添加任务
    showSlotDig() {
      if (this.$route.query && this.$route.query.row) {
        let { id, projectId } = JSON.parse(this.$route.query.row);
        if (id && projectId) {
          this.getAddTree({ id, projectId });
        }
      }

      this.SoltDigShow = true;
      this.SoltDigTitle = "新增任务&转换";
    },
    // 复选
    check(data, item) {
      console.log(item.checkedNodes, "选择的值");
      let tree_ = []; // 获取选择的值(平铺)
      item.checkedNodes.forEach((item_) => {
        if (!item_.children || !item_.children.length) {
          tree_.push(item_);
        }
      });

      console.log(tree_, "~~");
      let arrangeTaskList = [];
      tree_.forEach((node) => {
        if (node.info.flag == "table") {
          arrangeTaskList.push({
            taskId: node.info.parentId,
            arrangeTableMappingVoList: [
              {
                taskId: node.info.parentId,
                tableMappingId: node.id,
              },
            ],
          });
        } else if (node.info.flag == "task") {
          arrangeTaskList.push({
            taskId: node.id,
          });
        }
      });

      let clearArr = [];
      arrangeTaskList.forEach((item_) => {
        let flag = false;
        clearArr.forEach((item__) => {
          if (item_.taskId == item__.taskId) {
            item__.arrangeTableMappingVoList.push(
              item_.arrangeTableMappingVoList[0]
            );
            flag = true;
          }
        });

        if (!flag) {
          clearArr.push(item_);
        }
      });

      this.queryTree = clearArr;
      console.log(this.queryTree, "保存");
    },
    // 删除
    remove(node, data) {
      console.log(node, data);
      if (data.info.flag == "task") {
        // 任务
        this.delTask({ id: data.id });
      } else {
        // 表转换
        this.delTable({ id: data.id });
      }
      // const parent = node.parent;
      // const children = parent.data.children || parent.data;
      // const index = children.findIndex(d => d.id === data.id);
      // children.splice(index, 1);
    },
    // 保存-拓扑图-回调
    Gsave({ gId, reqData }) {
      console.log("保存", reqData, "后端返回数据：", this.taskGData);
      for (let index = 0; index < reqData.length; index++) {
        if (!reqData[index].arrangeTaskId) {
          this.$message({
            message: "请选择任务!",
            type: "warning",
          });
          return;
        }
      }

      switch (this.activeName) {
        case "1":
          {
            console.log("发送");
            reqData.forEach((item) => {
              item["xaxis"] = item.xAxis + "";
              item["yaxis"] = item.yAxis + "";
              delete item.xAxis;
              delete item.yAxis;
            });
            this.graphTaskSave(reqData);
          }
          return;
        case "2":
          {
            this.graphTableSave(reqData);
          }
          return;
        default:
          break;
      }
    },
    Gsave_1({ gId, reqData }) {
      console.log("保存-表", reqData, "后端返回数据：", this.taskGData);
      for (let index = 0; index < reqData.length; index++) {
        if (!reqData[index].arrangeTableMappingId) {
          this.$message({
            message: "请选择转换表!",
            type: "warning",
          });
          return;
        }
      }
      if (this.activeName == 2) {
        console.log("发送");
        reqData.forEach((item) => {
          item["xaxis"] = item.xAxis + "";
          item["yaxis"] = item.yAxis + "";
          delete item.xAxis;
          delete item.yAxis;
        });
        this.graphTableSave(reqData);
      }
    },
    // 刷新画布
    refshGraph() {
      if (this.activeTree) {
        this.handleNodeClick(this.activeTree);
      }
    },

    /* 请求 */
    // 获取 任务&转换 树
    getLtTree() {
      let { id, projectId } = JSON.parse(this.$route.query.row);
      if (id && projectId) {
        API.workTaskTreeLt({
          id,
          projectId,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (
            Res &&
            Res.data &&
            Res.data.children &&
            Res.data.children.children
          ) {
            this.ruleTree = Res.data.children.children;
          } else {
            this.ruleTree = [];
          }
        });
      }
    },
    // 获取 新增 任务&转换 树
    getAddTree({ id, projectId }) {
      API.workTaskTreeAdd({ id, projectId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res && Res.data && Res.data.children.children) {
          this.ruleTree_2 = Res.data.children.children;
        } else {
          this.ruleTree_2 = [];
        }
      });
    },
    // 保存 新增任务&转换
    add() {
      if (this.$route.query && this.$route.query.row) {
        const GlobalLoading = globalLoading();
        let { id } = JSON.parse(this.$route.query.row);
        if (id) {
          API.workTaskTreeAddSave({
            arrangeId: id,
            arrangeTaskVoList: this.queryTree,
          })
            .then((res) => {
              GlobalLoading.close();
              new ResDatas({
                res,
                code: 0,
              }).state();
              this.SoltDigShow = false;
              this.$refs.modalTree.setCheckedKeys([]);
              this.getLtTree();
            })
            .catch((err) => {
              GlobalLoading.close();
            });
        }
      }
    },
    // 获取 任务树——废弃(前端谋划匹配)
    getList({ type }) {
      switch (type) {
        case "默认-模糊匹配":
          {
            console.log("默认-模糊匹配");
          }
          return;
        case "弹出框-模糊匹配":
          {
            console.log("弹出框-模糊匹配");
          }
          return;
        default:
          break;
      }
    },
    // 删除任务(左侧一级)
    delTask({ id }) {
      API.workTaskTreeLtDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.activeTree = "";
        this.taskGData = null;
        this.getLtTree();
      });
    },
    // 删除转换表(左侧二级)
    delTable({ id }) {
      API.workTaskTreeLtTableDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.activeTree = "";
        this.tableGData = null;
        this.getLtTree();
      });
    },
    // 获取 任务关联视图 中的下拉选择
    getTaskViewList() {
      if (this.$route.query && this.$route.query.row) {
        let { id, projectId } = JSON.parse(this.$route.query.row);
        API.workTaskView({
          id,
          projectId,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          let arr = [];
          if (Res && Res.length) {
            Res.forEach((item) => {
              arr.push({
                ...item,
                label: item.taskName,
                value: item.id,
              });
            });
          }
          this.taskViewList = arr;
          console.log(Res, "任务关联视图——下拉");
        });
      }
    },
    // 获取 转换关联视图 中的下拉选择
    getZHViewList({ arrangeTaskId }) {
      API.workTaskViewZH({
        arrangeTaskId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let arr = [];
        console.log(Res, "表转换-下拉");
        if (Res && Res.length) {
          Res.forEach((item) => {
            arr.push({
              ...item,
              label: item.tableMappingName,
              value: item.id,
            });
          });
        }
        this.tableViewList = arr;
      });
    },
    // 拓扑图 任务
    graphTask({ id, arrangeId }) {
      API.graphTask({
        arrangeId,
        id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res && Res.nodes) {
          this.taskGData = Res;
        } else {
          this.taskGData = {
            nodes: [],
            edges: [],
            nodeNumMax: Res.nodeNumMax,
          };
        }
        console.log(Res, "拓扑图-任务");
      });
    },
    // 拓扑图 转换表
    graphTable({ arrangeId, id }) {
      API.graphTable({
        arrangeId,
        id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res && Res.nodes) {
          this.tableGData = Res;
        } else {
          this.tableGData = {
            nodes: [],
            edges: [],
            nodeNumMax: Res.nodeNumMax,
          };
        }
        console.log(Res, "拓扑图-表");
      });
    },
    // 拓扑图 任务 保存
    graphTaskSave(reqData) {
      this.GsaveLoadingTask = true;
      API.graphTaskSave({ etlArrangeTaskRelyVo: reqData }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        setTimeout(() => {
          this.GsaveLoadingTask = false;
        }, 100);
        if (this.activeTree) {
          this.handleNodeClick(this.activeTree);
        }
      });
    },
    // 拓扑图 转换表 保存
    graphTableSave(reqData) {
      this.GsaveLoadingTable = true;
      API.graphTableSave({ etlArrangeTableMappingRelyList: reqData }).then(
        (res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          setTimeout(() => {
            this.GsaveLoadingTable = false;
          }, 100);
          if (this.activeTree) {
            this.handleNodeClick(this.activeTree);
          }
        }
      );
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let { id, projectId } = JSON.parse(this.$route.query.row);
      if (id && projectId) {
        this.getLtTree();
      }
    }
  },
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.add-task {
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: row;
  .task {
    &-tree {
      width: 260px;
      height: 100%;
      box-sizing: border-box;
      border-right: 1px solid #e4e7ed;
      padding: 5px;
      overflow: auto;
      /deep/
        .el-tree--highlight-current
        .el-tree-node.is-current
        > .el-tree-node__content {
        color: $lt_menu_bg_active;
      }
    }
    &-view {
      position: relative;
      height: 100%;
      flex: 1;
      box-sizing: border-box;
      //   border: 1px solid red;
      padding: 5px;
      &-title {
        margin: 5px 0 -10px 13px;
      }
      .view-area {
        position: absolute;
        top: 72px;
        left: 5px;
        width: 99%;
        height: calc(100% - 72px);
        box-sizing: border-box;
      }
      /deep/ .el-tabs__nav {
        z-index: 1;
      }
    }
  }
  .M-title {
    box-sizing: border-box;
    p {
      position: relative;
      overflow: hidden;
      i {
        position: absolute;
        top: 2px;
        width: 3px;
        height: 15px;
        background: $table_edit_btn_color_active;
      }
      span {
        display: inline-block;
        height: 18px;
        line-height: 18px;
        margin-left: 12px;
        font-size: 14px;
      }
    }
  }
  .tree {
    margin-top: 10px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .soltDigContent {
    // height: 400px;
    // overflow: hidden;
    .tree {
      max-height: 400px;
      overflow: auto;
      overflow-x: auto;
    }
  }
  .tree-text {
    display: inline-block;
    width: 175px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tree-text-search {
    display: inline-block;
    width: 485px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
