<!--
 * @Author: Marlon
 * @Date: 2020-04-27 14:09:57
 * @LastEditors: Marlon
 * @LastEditTime: 2020-05-20 10:41:23
 * @Description: ETL规则配置-规则统计
 -->
<template>
  <div class="rule-collect">
    <div class="rule-tree">
      <!-- 规则树 -->
      <MTitle TitleName="规则树"></MTitle>
      <el-tree
        :highlight-current="true"
        node-key="id"
        :current-node-key="'1'"
        :default-expanded-keys="defaultTree"
        :data="ruleTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
    <div class="rule-table">
      <div class="rule-table-area-query">
        <ul class="lt">
          <li>
            <MTitle TitleName="规则明细"></MTitle>
          </li>
        </ul>
        <ul class="rt">
          <li>
            <label for>项目：</label>
            <el-select
              v-model="proVal"
              filterable
              placeholder="请选择"
              size="small"
              @change="proChange"
            >
              <el-option
                v-for="item in proList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>任务：</label>
            <el-select
              v-model="taskVal"
              filterable
              placeholder="请选择"
              size="small"
              @change="getList"
            >
              <el-option
                v-for="item in taskList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </div>
      <!-- 表格 -->
      <TableDefault
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="total"
        :TCurrentPage="current"
        :TPageSize="pageSize"
        :TClickItem="TClickItem"
        :TSort="TSort"
        @clickCell="lickCell"
        @changePage="changePage"
        @editBtnCb="editBtnCb"
      ></TableDefault>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { cellJump } from "@/utils/jump";

import MTitle from "@/components/titles/title";

export default {
  mixins: [mixin],
  components: {
    MTitle
  },
  data() {
    return {
      // 查询条件
      proVal: "",
      proList: [],
      taskVal: "",
      taskList: [],
      // 规则树
      ruleTree: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultTree: ["1"],

      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [
            "projectName",
            "remark",
            "tableNameRemark",
            "dataCollectionName"
          ]
        }
      ],
      TSort: {
        default: {
          prop: "gmtCreate",
          order: "descending"
        },
        sortArr: [
          {
            prop: "dbName",
            order: "descending"
          },
          {
            prop: "tableName",
            order: "descending"
          },
          {
            prop: "columnCount",
            order: "descending"
          }
        ]
      },
      TEdit: {
        show: true,
        title: "状态",
        fixed: "right",
        width: 150,
        slot: true,
        type: "switch",
        editTypes: [
          {
            label: "状态",
            css: "success",
            value: false
          }
        ]
      },
      tableTitle: [
        { prop: "ruleCode", label: "规则编码" },
        { prop: "ruleName", label: "规则名称" },
        { prop: "rulesContent", label: "规则内容" },
        { prop: "tableMappingName", label: "对应表" },
        { prop: "columnMappingName", label: "对应字段" },
        { prop: "creator", label: "创建人" },
        { prop: "createTime", label: "创建时间" }
      ],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      TClickItem: [
        {
          link: "/metaData/maintain/tableInfo",
          cells: ["columnCount"]
        }
      ],
      treeActive_: ""
    };
  },
  watch: {
    proVal: function(newVal) {
      if (newVal) {
        this.getTaskList(newVal);
      }
    },
    taskVal: function(newVal) {
      this.ruleTree = [];
      if (newVal) {
        this.getRuleTree(newVal);
        this.getList();
      }
    },
    treeActive_: function(newVal) {
      this.getList();
    }
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
      } else if (text === "删除") {
        this.del(row);
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.current = currentPage;
      this.pageSize = pageSize;
      this.getList();
    },
    lickCell({ row, column, id }) {
      const { dbId, tableName, tableNameRemark, remark, projectId } = row;
      this.tableId_ = row.id;
      switch (column.label) {
        case "状态":
          {
            this.update({ id: row.id, state: row.edit.editTypes[0].value });
          }
          return;
        default:
          break;
      }
    },
    handleNodeClick(data) {
      this.treeActive_ = data.id;
    },
    // 递归
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach(item => {
          item.name = item.name + ` (${item.count})`;
          if (item.children && item.children.length) {
            this.loop(item.children);
          }
        });
      }
    },
    // 选择项目
    proChange() {
      this.taskVal = "";
      this.taskList = [];
    },

    /* 请求 */
    // 项目列表
    getProList({ init }) {
      API._publicProject().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            proArr.push({
              ...item,
              label: item.name,
              value: item.id
            });
          });
          if (init) {
            this.proVal = proArr[0].value;
          }
        }
        this.proList = proArr;
      });
    },
    // 获取 任务列表
    getTaskList(projectId) {
      API._publicTask({ projectId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let taskArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            taskArr.push({
              ...item,
              label: item.name,
              value: item.id
            });
          });
        }
        if (!this.taskVal) {
          if (taskArr.length) {
            this.taskVal = taskArr[0].id;
          }
        }
        this.taskList = taskArr;
      });
    },
    // 规则树
    getRuleTree(taskId) {
      API.ruleCollectTree({ taskId })
        .then(res => {
          let Res = new ResDatas({
            code: 0,
            res
          }).init();
          if (Res) {
            let tree_ = [
              {
                children: Res.children,
                name: Res.name,
                id: Res.id,
                parentId: Res.parentId,
                count: Res.count
              }
            ];
            this.loop(tree_);
            this.ruleTree = tree_;
            this.treeActive_ = tree_[0].id;
          } else {
            this.ruleTree = [];
          }
        })
        .catch(error => {
          this.ruleTree = [];
          console.error(error);
        });
    },
    // 获取
    getList() {
      this.TLoading = true;
      if (this.taskVal && this.treeActive_) {
        API.ruleCollectList({
          ruleId: this.treeActive_,
          taskId: this.taskVal,
          pageNum: this.current,
          pageSize: this.pageSize
        })
          .then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "total",
                  pageSize: "pageSize"
                },
                titleKey: []
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, total, pageSize } = Res.formatData();
              if (data && data.length) {
                data.forEach(item => {
                  item["edit"] = {
                    show: true,
                    title: "状态",
                    fixed: "right",
                    width: 150,
                    slot: true,
                    type: "switch",
                    editTypes: [
                      {
                        label: "状态",
                        css: "success",
                        value: item.disable === 0 ? true : false
                      }
                    ]
                  };
                });
              }
              console.log(data);
              this.tableData = data;
              this.total = total;
              this.pageSize = pageSize;
            } else {
              this.tableData = [];
              this.total = 0;
            }
          })
          .catch(error => {
            this.TLoading = false;
          });
      }
    },
    // 修改
    update({ id, state }) {
      API.ruleCollectUpdate({
        id,
        disable: state ? 0 : 1
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        });
        this.getList();
      });
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.proVal = paramsUrl.projectId;
      this.taskVal = paramsUrl.id;
      this.getProList({ init: false });
    } else {
      this.getProList({ init: true });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.rule-collect {
  height: calc(100% - 52px);
  display: flex;
  overflow: hidden;
  flex-direction: row;

  .rule-tree {
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
  .rule-table {
    height: 100%;
    flex: 1;
    box-sizing: border-box;
    // border: 1px solid red;
    padding: 5px;
    overflow: auto;
    &-area-query {
      overflow: hidden;
      .lt {
        float: left;
        overflow: hidden;
      }
      .rt {
        float: right;
        overflow: hidden;
        li {
          float: left;
          &:nth-child(1) {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>