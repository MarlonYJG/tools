<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:34:14
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-08-17 14:03:23
 * @Description: 数据质量管理-审核结果-质量结果详情查询
 -->

<template>
  <div class="dq-ar-query">
    <div class="dq-ar-query-edit-area">
      <ul class="dq-ar-query-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="projectVal"
            filterable
            clearable
            placeholder="请选择项目"
            size="medium"
            @change="handleChange('pro',$event)"
          >
            <el-option
              v-for="item in projectOption"
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
            clearable
            placeholder="请选择任务"
            size="medium"
            @change="handleChange('task',$event)"
          >
            <el-option
              v-for="item in taskOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>版本号：</label>
          <el-select
            v-model="versionVal"
            filterable
            clearable
            placeholder="请选择版本号"
            size="medium"
            @change="handleChange('version',$event)"
          >
            <el-option
              v-for="item in versionOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-button type="primary" size="medium" @click="taskList">查询</el-button>
        </li>
        <li>
          <el-button type="primary" size="medium" @click="exportExcel">导出 Excel</el-button>
        </li>
      </ul>
    </div>
    <div class="dq-ar-query-table">
      <TableDefault
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        @changePage="changePage"
      ></TableDefault>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { cellJump } from "utils/jump";
import { _DownLoadExcelGet } from "utils";
export default {
  mixins: [mixin],
  data() {
    return {
      // 保存原始数据
      sourceOption: [],
      // 查询条件
      projectVal: "",
      projectOption: [],
      taskVal: "",
      taskOption: [],
      versionVal: "",
      versionOption: [],
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [
            "taskName",
            "dataSetName",
            "ruleName",
            "ruleContent",
            "dataSetCode"
          ]
        }
      ],
      tableTitle: [
        { prop: "taskName", label: "任务名称" },
        { prop: "dataSetName", label: "数据集名称" },
        { prop: "dataSetCode", label: "数据集编码" },
        { prop: "ruleName", label: "规则名称" },
        { prop: "ruleContent", label: "规则内容" },
        { prop: "queryTotalNum", label: "数据总量" },
        { prop: "normalNum", label: "符合规则数" },
        { prop: "normalFieldRetaStr", label: "符合规则率" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      // 临时变量
      tableActive_: ""
    };
  },
  watch: {
    projectVal: function(newVal) {
      if (newVal) {
        this.getTaskVer({ type: "task", projectId: newVal });
      }
    },
    taskVal: function(newVal) {
      if (newVal) {
        this.getTaskVer({ type: "version", taskId: newVal });
      }
    }
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.taskList();
    },
    // 查询初始化
    handleChange(type, value) {
      switch (type) {
        case "pro":
          {
            this.taskVal = "";
            this.taskOption = [];
            this.versionVal = "";
            this.versionOption = [];
          }
          return;
        case "task":
          {
            this.versionVal = "";
            this.versionOption = [];
          }
          return;
        default:
          return;
      }
    },

    /* 请求 */
    // 获取项目列表
    getProjectList({ init }) {
      API._publicProTaskVer().then(res => {
        let Res = new ResDatas({
          res,
          error: "获取列表失败"
        }).init();

        let proArr = [];
        let taskOption_ = [];
        let versionOption_ = [];
        if (Res && Res.length) {
          this.sourceOption = Res;
          Res.forEach(item => {
            proArr.push({
              label: item.label,
              value: item.id
            });
            // 任务
            if (this.projectVal === item.id) {
              if (item.children && item.children.length) {
                item.children.forEach(element => {
                  taskOption_.push({
                    label: element.label,
                    value: element.id
                  });
                  if (element.children && element.children.length) {
                    element.children.forEach(ele => {
                      if (this.versionVal === ele.id) {
                        // 版本
                        versionOption_.push({
                          label: ele.label,
                          value: ele.id
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        } else {
          this.sourceOption = [];
        }
        this.projectOption = proArr;
        this.taskOption = taskOption_;
        this.versionOption = versionOption_;
      });
    },
    // 获取对应的下拉菜单
    getTaskVer({ type, projectId, taskId }) {
      switch (type) {
        case "task":
          {
            let taskOption_ = [];
            this.sourceOption.forEach(item => {
              if (projectId === item.id) {
                if (item.children && item.children.length) {
                  item.children.forEach(element => {
                    taskOption_.push({
                      label: element.label,
                      value: element.id
                    });
                  });
                }
              }
            });
            this.taskOption = taskOption_;
          }
          return;
        case "version":
          {
            let versionOption_ = [];
            this.sourceOption.forEach(item => {
              if (this.projectVal === item.id) {
                if (item.children && item.children.length) {
                  item.children.forEach(element => {
                    if (taskId === element.id) {
                      element.children.forEach(ele => {
                        versionOption_.push({
                          label: ele.label,
                          value: ele.id
                        });
                      });
                    }
                  });
                }
              }
            });
            this.versionOption = versionOption_;
          }
          return;

        default:
          return;
      }
    },
    // 获取
    taskList() {
      this.TLoading = true;
      let req = reqFormatDic({
        pageNo: this.TPage.index,
        pageSize: this.TPage.size,
        projectId: this.projectVal,
        taskId: this.taskVal,
        versionNo: this.versionVal
      });
      API.taskSearch(req)
        .then(res => {
          let Res = new ResDatas(
            {
              res,
              fieldKey: {
                data: "data",
                title: "title",
                total: "totalCount",
                pageSize: "pageSize"
              }
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.tableTitle = title;
            this.tableData = data;
            this.TPage = {
              total,
              index: this.TPage.index,
              size: pageSize
            };
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 导出excel
    exportExcel() {
      let req = {
        projectId: this.projectVal,
        taskId: this.taskVal,
        versionNo: this.versionVal
      };
     _DownLoadExcelGet({
        url: API.exportExcel(),
        data: req,
        cfg: { text: "正在导出..."}
      });
    }
  },
  mounted() {
    if (!this.$route.query.row) {
      this.getProjectList({ init: false });
      this.taskList();
    } else {
      this.getProjectList({ init: true });
      let paramsUrl = JSON.parse(this.$route.query.row);
      const { projectId, taskId, versionNo } = paramsUrl;
      this.projectVal = projectId;
      this.taskVal = taskId;
      this.versionVal = versionNo;
      this.taskList();
    }
  }
};
</script>

<style lang="scss" scoped>
.dq-ar-query {
  &-edit-area {
    overflow: hidden;
    &-btn {
      float: left;
      overflow: hidden;
      li {
        float: left;
        margin: 2px 15px;
      }
    }
    &-select {
      float: left;
      overflow: hidden;
      margin: 4px 0 0 10px;
      li {
        float: left;
        margin-left: 20px;
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
}
</style>