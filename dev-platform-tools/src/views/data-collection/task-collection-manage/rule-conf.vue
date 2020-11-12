<!--
 * @Author: Marlon
 * @Date: 2020-02-24 09:04:40
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 16:35:48
 * @Description: 数据采集-采集任务管理-转换规则配置
 -->
 
<template>
  <div class="r-c">
    <div class="r-c-edit-area">
      <ul class="r-c-edit-area-btn">
        <li>
          <AddButton text="添加目标表" @click="showTableDialog" :clickArgs="{type:'添加目标表'}"></AddButton>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="比较两个或多个项目之间的元数据的差异" placement="top">
            <!-- <el-button size="medium">批量效验</el-button> -->
          </el-tooltip>
        </li>
      </ul>
      <ul class="r-c-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="projectVal"
            filterable
            placeholder="请选择项目"
            size="small"
            @change="taskOptionFn({type:'project'},$event)"
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
            placeholder="请选择任务"
            size="small"
            @change="taskOptionFn({type:'task'},$event)"
          >
            <el-option
              v-for="item in taskOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="r-c-table">
      <TableDefault
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TEdit="TEdit"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
    <TableDialog
      TableDigId="aaa"
      :TableDigTitle="'添加目标表'"
      :TableDigVisible="TableDigVisible"
      :TableDigLoading="TableDigLoading"
      :TableDigWidth="800"
      :TableData="TableData"
      :TableTitle="TableTitle"
      :TabledigHeight="452"
      :TableDigShowCheckBox="true"
      :TableDigShowCheckBoxData="TableDigShowCheckBoxData"
      :TableDigPage="TableDigPage"
      :TableDigFoot="TableDigFoot"
      TableDigCheckBoxKey="isMatch"
      @editBtnCb="editBtnCb"
      @clickCell="lickCell"
    ></TableDialog>
    <!-- 弹出框-字段映射配置 -->
    <el-dialog
      title="字段映射配置"
      :visible.sync="fieldConfDigShow"
      :width="'800px'"
      class="zdyspz_dialog"
    >
      <el-table
        size="small"
        :data="fieldConfDigData"
        style="width: 100%"
        v-loading="fieldConfDigLoading"
        border
        tooltip-effect="dark"
        :height="491"
        :max-height="491"
        @cell-click="TClickCells"
        @row-click="TClickRowFn"
      >
        <el-table-column label="序号" type="index" :index="TindexFn" width="50" align="center"></el-table-column>
        <el-table-column prop="targetColCode" label="目标表字段" align="center"></el-table-column>
        <el-table-column prop="ruleType" label="源类型" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.ruleType" size="mini">
              <el-option
                v-for="item in ruleTypeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="sourceColCode" label="源配置值" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sourceColCode" placeholder="请输入内容" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="targetColName" label="目标字段中文名" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="address" label="操作" align="center" :width="150">
          <el-button size="mini" type="danger">清空</el-button>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="submitBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框-标签页 -->
    <TabsDialog
      :TabsDigShow="TabsDigShow"
      :TabsDFootBtn="TabsDFootBtn"
      :TabsItem="TabsItem"
      @editBtnCb="editBtnCb"
    ></TabsDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas } from "utils/res-format";
import { openUrl } from "utils/jump";

import TableDialog from "@/components/dialog/table-dialog";
import TabsDialog from "./components/tabs-dialog";
export default {
  mixins: [mixin],
  components: {
    TableDialog,
    TabsDialog
  },
  data() {
    return {
      // 项目
      projectOption: [],
      projectVal: "",
      // 任务列表
      taskOption: [],
      taskVal: "",
      // 表格
      TLoading: false,
      TPage: {
        index: 1,
        size: 10,
        total: 0
      },
      TEdit: {
        show: true,
        title: "操作",
        fixed: "right",
        width: 250,
        editTypes: [
          {
            label: "删除",
            css: "text"
          },
          {
            label: "编辑源数据集",
            css: "text"
          },
          {
            label: "字段映射配置",
            css: "text"
          }
        ]
      },
      tableTitle: [
        {
          prop: "targetJobCode",
          label: "目标表"
        },
        {
          prop: "targetJobName",
          label: "目标表中文名称"
        },
        {
          prop: "sourceJobCode",
          label: "源数据集"
        },
        {
          prop: "sourceJobName",
          label: "源数据集中文名称"
        },
        {
          prop: "dataType_value",
          label: "类型"
        }
      ],
      tableData: [],
      // 表格弹出配置——添加目标表
      TableDigVisible: false,
      TableData: [],
      TableTitle: [
        {
          label: "目标表",
          prop: "targetJobCode"
        },
        {
          label: "源表",
          prop: "sourceJobCode"
        }
      ],
      TableDigLoading: false,
      TableDigFoot: {
        show: true,
        data: [
          {
            type: "button",
            classType: "primary",
            class: "",
            label: "确定",
            cb: obj => {
              this.saveTaskItems(obj);
            }
          }
        ]
      },
      TableDigPage: {
        show: false,
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      TableDigShowCheckBoxData: [],
      // 是否显示编辑源数据集-弹出框
      TabsDigShow: false,
      TabsDFootBtn: [],
      TabsItem: {},
      // 字段映射配置-弹出框
      fieldConfDigShow: false,
      fieldConfDigLoading: false,
      fieldConfDigTitle: [
        {
          label: "目标表字段",
          prop: "targetColCode"
        },
        {
          label: "源类型",
          type: "select",
          prop: "ruleType"
        },
        {
          label: "源配置值",
          prop: "sourceColCode"
        },
        {
          label: "目标字段中文名",
          prop: "targetColName"
        }
      ],
      fieldConfDigData: [],
      ruleTypeOption: [],
      tableActive_: ""
    };
  },
  watch: {
    taskVal: function(newVal) {
      if (newVal === 0 || newVal) {
        this.getTaskItemList(newVal);
      }
    },
    projectVal: function(newVal) {
      if (newVal === 0 || newVal) {
        this.getTaskList(newVal);
      }
    }
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.taskItemDel(row);
      } else if (text === "close") {
        this.TableDigVisible = editItem.close;
        this.TableDigVisible_1 = editItem.close;
        this.TabsDigShow = editItem.close;
        this.fieldConfDigShow = editItem.close;
      }
    },
    // 自动更改序号
    TindexFn(index) {
      return index + 1;
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      if (this.taskVal) {
        this.getTaskItemList(this.taskVal);
      }
    },
    // 表格弹出框
    showTableDialog({ type }) {
      switch (type) {
        case "添加目标表":
          this.TableDigVisible = true;
          this.taskItemAdd();
          return;
        default:
          break;
      }
    },
    // 选择下拉(项目/任务)
    taskOptionFn({ type }, value) {
      switch (type) {
        case "project":
          this.getTaskList(value);
          return;
        default:
          break;
      }
    },
    // 单元格
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      switch (column.label) {
        case "编辑源数据集":
          {
            this.TabsDigShow = true;
            this.TabsItem = row;
            this.TabsDFootBtn = [
              {
                type: "ok",
                label: "确定",
                css: "primary",
                cb: form => {
                  this.updateCollect(row, form, form.type);
                }
              }
            ];
          }
          return;
        case "字段映射配置":
          {
            this.fieldConfDigShow = true;
            this.getFieldConf(row);
          }
          return;
        default:
          break;
      }
    },
    /* 特殊处理-字段映射配置-弹出框 */
    // 触发单元格事件
    TClickCells(row, column, cell, event) {
      if (column.label === "操作") {
        if (row.id) {
          this.delField(row.id);
        } else {
          this.fieldConfDigData.forEach((item, index) => {
            if (item.dom_id === row.dom_id) {
              this.fieldConfDigData.splice(index, 1);
            }
          });
        }
        // this.$confirm("此操作将永久清除, 是否继续?", "提示", {
        //   confirmButtonText: "确定",
        //   cancelButtonText: "取消",
        //   type: "warning"
        // })
        //   .then(() => {})
        //   .catch(() => {});
      }
    },
    TClickRowFn(row, column, event) {},
    // 字段映射-确定按钮-批量保存
    submitBtn() {
      this.fieldConfDigData.forEach(item => {
        delete item.dom_id;
      });
      API.saveField({
        list: this.fieldConfDigData
      }).then(res => {
        new ResDatas({
          res,
          code: 200,
          msg: "保存成功!",
          error: "保存失败!"
        }).state();
        this.fieldConfDigShow = false;
      });
    },

    /* 请求 */
    // 获取字段类型名列表
    getColumnTypeList() {
      API._sourceDataType({
        name: "rule_type"
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200,
          error: "获取字段类型名列表失败!"
        }).init();
        let columnTypeArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            columnTypeArr.push({
              label: item.name,
              value: item.code
            });
          });
        }
        this.ruleTypeOption = columnTypeArr;
      });
    },
    // 获取项目列表
    getProjectList({ isInit }) {
      API._projectList().then(res => {
        let Res = new ResDatas({
          res,
          code: 200
        }).init();
        let projectArr_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            projectArr_.push({
              label: item.projectName,
              value: item.id
            });
          });
          if (isInit) {
            this.projectVal = projectArr_[0].value;
          }
        }
        this.projectOption = projectArr_;
      });
    },
    // 获取任务列表
    getTaskList(projectId) {
      API._taskList({
        projectId
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200
        }).init();
        let taskArr_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            taskArr_.push({
              value: item.id,
              label: item.taskName
            });
          });
          this.taskVal = taskArr_[0].value;
        } else {
          this.taskVal = "";
        }
        this.taskOption = taskArr_;
      });
    },
    // 获取指定任务的列表
    getTaskItemList(taskId) {
      this.TLoading = true;
      API.taskTableList({
        taskId,
        current: this.TPage.index,
        size: this.TPage.size
      })
        .then(res => {
          let Res = new ResDatas(
            {
              res,
              code: 200,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size"
              },
              titleKey: []
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize } = Res.formatData();
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
    // 添加 目标表
    taskItemAdd() {
      if (this.taskVal) {
        this.TableDigLoading = true;
        API.taskTableAdd({
          taskId: this.taskVal
        })
          .then(res => {
            let Res = new ResDatas(
              {
                res
              },
              "TableDigLoading",
              this
            ).init();
            let checkboxArr = [];
            if (Res && Res.length) {
              this.TableData = Res;
              Res.forEach(item => {
                if (!!item.isMatch) {
                  checkboxArr.push(item);
                }
              });
            } else {
              this.TableData = [];
              checkboxArr = [];
            }
            this.TableDigShowCheckBoxData = checkboxArr;
          })
          .catch(error => {
            this.TableDigLoading = false;
            console.error(error);
          });
      } else {
        this.$message({
          message: "请选择要添加的任务",
          type: "warning"
        });
      }
    },
    // 保存 添加的目标表
    saveTaskItems(form) {
      const { multipleSelection, TableData } = form;
      if (TableData.length) {
        API.saveTaskJobs({
          taskId: this.taskVal,
          jobList: multipleSelection
        }).then(res => {
          new ResDatas({
            res,
            msg: "正在保存目标表,请在大约1分钟之后查看(此操作较为耗时)",
            error: "添加失败!"
          }).state();
          this.getTaskItemList(this.taskVal);
        });
      }
      this.TableDigVisible = false;
    },
    // 删除
    taskItemDel({ id }) {
      API.taskTableDel({
        id
      }).then(res => {
        new ResDatas({
          res,
          code: 200,
          msg: "删除成功!",
          error: "删除失败!"
        }).state();
        if (!!this.taskVal) {
          this.getTaskItemList(this.taskVal);
        }
      });
    },
    // 编辑源数据集-源数据表-保存
    saveSourceTable() {},
    //编辑源数据集-SQL数据集-保存
    updateCollect(row, req, type) {
      let params = {
        id: row.collectId
      };
      if (type === "first") {
        params["sqlScript"] = req.form.sqlText;
        params["collectType"] = 1;
        params["tableName"] = req.form.tableVal;
      } else if (type === "second") {
        params["sqlScript"] = req.form;
        params["collectType"] = 3;
      }
      API.updateCollect(params).then(res => {
        new ResDatas({
          res,
          msg: "修改成功!",
          error: "修改失败!"
        }).state();
        this.TabsDigShow = false;
        this.getTaskItemList(this.taskVal);
      });
    },
    // 字段映射配置-获取字段配置
    getFieldConf({ id }) {
      this.fieldConfDigLoading = true;
      API.getFieldConf({
        jobId: id
      })
        .then(res => {
          let Res = new ResDatas(
            {
              res,
              error: "获取字段配置列表异常!"
            },
            "fieldConfDigLoading",
            this
          ).init();
          if (Res && Res.length) {
            Res.forEach((item, index) => {
              item["dom_id"] = index + 1;
            });
            this.fieldConfDigData = Res;
          } else {
            this.fieldConfDigData = [];
          }
        })
        .catch(error => {
          this.fieldConfDigLoading = false;
          console.error(error);
        });
    },
    // 字段映射配置-删除
    delField(id) {
      API.delField({
        id
      }).then(res => {
        new ResDatas({
          res,
          code: 200,
          msg: "删除成功!",
          error: "删除失败!"
        }).state();
        this.getFieldConf(this.tableActive_);
      });
    }
  },
  mounted() {
    if (this.$route.query.row) {
      let row = JSON.parse(this.$route.query.row);
      if (row && row.projectId) {
        this.getProjectList({ isInit: false });
        this.projectVal = row.projectId;
      }
    } else {
      this.getProjectList({ isInit: true });
    }
    this.getColumnTypeList();
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.r-c {
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
      float: right;
      overflow: hidden;
      margin: 4px 55px;
      & > li {
        float: left;
        &:nth-of-type(1) {
          margin-right: 15px;
        }
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
  /deep/ .el-table {
    th {
      background-color: $table_title_bg;
    }
    thead {
      color: $table_title_color;
    }
    // 可点击-跳转
    .clickStyle {
      text-decoration: underline;
      color: $table_link_color;
      cursor: pointer;
      &:hover {
        color: $table_link_color_hover;
      }
      //   弹出框
      &-dialog {
        color: $table_link_color;
        cursor: pointer;
        &:hover {
          color: $table_link_color_hover;
        }
      }
    }
  }
  //  分页
  .pagination {
    margin: 15px 0;
  }
  .zdyspz_dialog {
    /deep/ .el-dialog__header {
      background: $form_dialog_header_bg;
      padding: 8px;
      .el-dialog__title {
        font-size: 16px;
        color: $form_dialog_header_color;
      }
      .el-dialog__headerbtn {
        top: 10px;
        .el-icon-close {
          color: $form_dialog_header_color;
        }
      }
    }
  }
}
</style>
