<!--
 * @Author: Marlon
 * @Date: 2020-02-24 09:03:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 09:12:58
 * @Description: 数据采集-采集任务管理-任务列表
 -->
 
<template>
  <div class="task-list">
    <div class="task-list-edit-area">
      <ul class="task-list-edit-area-btn">
        <li>
          <AddButton text="新增任务" @click="showDialog" :clickArgs="{type:'新增任务'}"></AddButton>
        </li>
      </ul>
      <ul class="task-list-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="selectVal"
            filterable
            placeholder="请选择"
            size="small"
            @change="selectChange"
          >
            <el-option
              v-for="item in selectOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="task-list-table">
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
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
    ></FormDialog>
    <ColumnDialog
      :ColDialogVisible="ColDialogVisible"
      :HearderBtn="HearderBtn"
      :SourceId="SourceId"
      :TargetId="TargetId"
      :TargeListId="TargeListId"
      :SourceListId="SourceListId"
      @editBtnCb="editBtnCb"
      @submit="submit"
    ></ColumnDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import ColumnDialog from "./components/column-dialog";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
export default {
  mixins: [mixin],
  components: {
    ColumnDialog,
  },
  data() {
    return {
      TLoading: false,
      // 表格
      TAlign: [
        {
          key: "left",
          item: ["taskName", "remark", "sourceName", "targetName"],
        },
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: 350,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
          {
            label: "设置数据源",
            css: "text",
          },
          {
            label: "编辑转换",
            css: "text",
          },
          {
            label: "数据统计",
            css: "text",
          },
          {
            label: "执行任务",
            css: "text",
          },
        ],
      },
      tableTitle: [
        {
          prop: "taskCode",
          label: "编码",
        },
        {
          prop: "taskName",
          label: "名称",
        },
        {
          prop: "taskType_value",
          label: "类型",
        },
        {
          label: "数据来源",
          prop: "sourceName",
        },
        {
          label: "数据去向",
          prop: "targetName",
        },
        {
          label: "备注",
          prop: "remark",
        },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 可跳转的值
      TClickItem: [
        {
          link: "/",
          cells: ["address"],
        },
      ],
      tableActive: "",
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      dialogActiveItem: "",
      // 项目列表
      selectOpt: [],
      selectVal: "",
      // 多行-弹出框
      HearderBtn: [
        {
          type: "button",
          class: "",
          label: "添加数据源",
          classType: "primary",
          cb: () => {
            // TODO 跳转到数据源管理项目
            this.ColDialogVisible = false;
            setTimeout(() => {
              openUrl({
                type: "open",
                url: "/data-manage/#/dataSource/list",
                obj: {},
              });
            }, 200);
          },
        },
        {
          type: "button",
          class: "info",
          label: "参照源一键生成目标库",
          classType: "info",
          cb: () => {
            // TODO 跳转到数据源管理项目
            this.ColDialogVisible = false;
            setTimeout(() => {
              openUrl({
                type: "open",
                url: "/data-manage/#/dataSource/list",
                obj: {},
              });
            }, 200);
          },
        },
      ],
      ColDialogVisible: false,
      TargetId: "",
      SourceId: "",
      SourceListId: "",
      TargeListId: "",
    };
  },
  watch: {
    selectVal: function (newVal) {
      if (newVal == 0 || !!newVal) {
        this.getList();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      // console.log(editItem);
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.ColDialogVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      this.dialogActiveItem = type;
      switch (type) {
        case "新增任务":
          {
            this.FDTitle = "新增任务";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "200",
                key: "projectId",
                defaultModel: "",
                placeholder: "",
                option: this.selectOpt,
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                width: "280",
                key: "taskCode",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                width: "280",
                key: "taskName",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              projectId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              taskCode: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              taskName: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.add(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "编辑":
          {
            this.FDTitle = "编辑任务信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "200",
                key: "projectId",
                defaultModel: "",
                placeholder: "",
                option: this.selectOpt,
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                width: "280",
                key: "taskCode",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                width: "280",
                key: "taskName",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach((item) => {
                    if (key === item.key) {
                      item["key"] = key;
                      item["defaultModel"] = initDig[key];
                    }
                  });
                }
              }
            }
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.upDate(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        default:
          return;
      }
    },
    showColDialog({ type, initDig = null }) {
      switch (type) {
        case "设置数据源":
          {
            this.ColDialogVisible = true;
          }
          break;

        default:
          break;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 单元格事件
    async lickCell({ row, column, id }) {
      this.tableActive = row;
      const {
        projectId,
        remark,
        taskCode,
        taskName,
        sourceId,
        targetId,
        targetType,
        sourceType,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                projectId,
                remark,
                taskCode,
                taskName,
                id: row.id,
              },
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${taskName}”任务, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.del({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        case "设置数据源":
          {
            this.TargetId = sourceType || "";
            this.SourceId = targetType || "";
            this.SourceListId = sourceId || "";
            this.TargeListId = targetId || "";
            await this.showColDialog({
              type: "设置数据源",
              initDig: null,
            });
          }
          return;
        case "编辑转换":
          {
            console.log("编辑转换");
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/dataCollection/task/conf",
                  jump: {
                    type: "int",
                    mode: "push",
                  },
                },
              ],
            });
          }
          return;
        case "数据统计":
          {
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/other/dataStatistics",
                  jump: {
                    type: "int",
                    mode: "push",
                  },
                },
              ],
            });
          }
          return;
        case "执行任务":
          {
            this.runTask({ taskId: this.tableActive.id });
          }
          return;
        default:
          break;
      }
    },
    // 设置数据源回调
    submit(form) {
      const { projectId, id } = this.tableActive;
      const { sourceTypeKey, targetTypeKey, sourceKey, targeKey } = form;
      this.setDataSource({
        projectId,
        id,
        sourceType: sourceTypeKey,
        targetType: targetTypeKey,
        sourceId: sourceKey,
        targetId: targeKey,
      });
    },
    // 选择下拉
    selectChange(item) {
      this.getList();
    },

    /* 请求 */
    // 项目列表
    getProjectList({ init }) {
      API._projectList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 200,
          error: "项目列表获取失败!",
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            proArr.push({
              label: item.projectName,
              value: item.id,
            });
          });
          if (init) {
            this.selectVal = proArr[0].value;
          }
        }
        this.selectOpt = proArr;
      });
    },
    // 设置数据源
    setSourceFn(form) {
      console.log(form);
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.projectTaskList({
        current: this.TPage.index,
        size: this.TPage.size,
        projectId: this.selectVal,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 200,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size",
              },
              titleKey: [],
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
              size: pageSize,
            };
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 增加
    add(req) {
      const { remark, projectId, taskCode, taskName } = req;
      API.projectTaskAdd({
        remark,
        projectId,
        taskCode,
        taskName,
      }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "添加成功!",
          error: "添加失败!",
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 删除
    del({ id }) {
      API.projectTaskDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "删除成功!",
          error: "删除失败!",
        }).state();
        this.getList();
      });
    },
    // 更新
    upDate({ remark, projectId, taskCode, taskName }) {
      API.projectTaskUpdate({
        id: this.tableActive.id,
        remark,
        projectId,
        taskCode,
        taskName,
      }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "修改成功!",
          error: "修改失败!",
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 设置数据源
    setDataSource({
      projectId,
      id,
      sourceType,
      targetType,
      sourceId,
      targetId,
    }) {
      this.ColDialogVisible = false;
      API.projectTaskUpdate({
        projectId,
        id,
        sourceType,
        targetType,
        sourceId,
        targetId,
      }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "设置成功!",
          error: "设置失败!",
        }).state();
        this.getList();
      });
    },
    // 执行任务
    runTask({ taskId }) {
      API.projectTaskRun({ taskId }).then((res) => {
        new ResDatas({
          res,
          msg: "任务执行中,稍后请在“数据统计”中查看(此操作较为耗时)",
          error: "执行失败",
        }).state();
        this.getList();
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.selectVal = paramsUrl.id;
      this.getProjectList({ init: false });
    } else {
      this.getProjectList({ init: true });
    }
  },
};
</script>

<style lang="less" scoped>
.task-list {
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
    }
  }
  &-table {
    margin: 20px 0;
  }
}
</style>
