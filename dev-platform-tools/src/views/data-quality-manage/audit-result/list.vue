<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:33:37
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 17:23:59
 * @Description: 数据质量管理-审核结果-任务执行结果列表
 -->
<template>
  <div class="dq-ar-list">
    <div class="dq-ar-list-edit-area">
      <ul class="dq-ar-list-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select v-model="projectVal" filterable placeholder="请选择项目" size="medium" clearable>
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
          <el-select v-model="taskVal" filterable placeholder="请选择任务" size="medium" clearable>
            <el-option
              v-for="item in taskOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-button type="primary" size="medium" @click="taskList">查询</el-button>
        </li>
      </ul>
    </div>
    <div class="dq-ar-list-table">
      <TableDefault
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        @clickCell="lickCell"
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
export default {
  mixins: [mixin],
  data() {
    return {
      // 存储原始级联数据
      sourceOption: [],
      // 项目
      projectVal: "",
      projectOption: [],
      // 任务
      taskVal: "",
      taskOption: [],
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["projectName", "sourceName", "taskName"]
        }
      ],
      tableTitle: [
        { prop: "projectName", label: "所属项目", sort: 0 },
        { prop: "sourceName", label: "对应数据源", sort: 0 },
        { prop: "taskName", label: "任务名称", sort: 0 },
        { prop: "versionNo", label: "版本", sort: 0 },
        { prop: "createTime", label: "任务执行开始时间", sort: 0 },
        { prop: "updateTime", label: "任务执行结束时间", sort: 0 },
        { prop: "status_value", label: "状态", sort: 0 }
      ],
      tableData: [],
      TEdit: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "查看详情",
            css: "text"
          },
          {
            label: "查看报告",
            css: "text"
          }
        ]
      },
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
    projectVal: {
      handler(newVal) {
        this.sourceOption.forEach(item => {
          if (newVal === item.id) {
            if (item.children && item.children.length) {
              let taskArr = [];
              item.children.forEach(ele => {
                taskArr.push({
                  label: ele.label,
                  value: ele.id
                });
              });
              this.taskOption = taskArr;
            }
          }
        });
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
    // 单元格事件
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      // const { projectId, remark, taskCode, taskName, sourceId } = row;
      switch (column.label) {
        case "查看详情":
          {
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/dataQuality/auditResult/query",
                  jump: {
                    type: "int",
                    mode: "push"
                  }
                }
              ]
            });
          }
          return;
        case "查看报告":
          {
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/dataQuality/auditResult/report",
                  jump: {
                    type: "int",
                    mode: "push"
                  }
                }
              ]
            });
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 获取项目列表
    getProjectList() {
      API._publicProTaskVer().then(res => {
        let Res = new ResDatas({
          res,
          error: "获取列表失败"
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          this.sourceOption = Res;
          Res.forEach(item => {
            proArr.push({
              label: item.label,
              value: item.id
            });
          });
        }
        this.projectOption = proArr;
      });
    },
    // 获取
    taskList() {
      this.TLoading = true;
      let req = reqFormatDic({
        pageNo: this.TPage.index,
        pageSize: this.TPage.size,
        projectId: this.projectVal,
        taskId: this.taskVal
      });
      API.taskRunList(req)
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
    }
  },
  mounted() {
    this.getProjectList();
    this.taskList();
  }
};
</script>

<style lang="scss" scoped>
.dq-ar-list {
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