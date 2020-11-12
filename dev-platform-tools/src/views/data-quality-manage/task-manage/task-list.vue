<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:36:11
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-08-17 15:02:49
 * @Description: 数据质量管理-任务管理-任务列表
 -->
<template>
  <div class="dq-task-list">
    <div class="dq-task-list-edit-area">
      <ul class="dq-task-list-edit-area-btn">
        <li>
          <AddButton text="新增任务" @click="showDialog" :clickArgs="{type:'新增任务'}"></AddButton>
        </li>
      </ul>
      <ul class="dq-task-list-edit-area-select">
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
    <div class="dq-task-list-table">
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
      :FDFootInfo="FDFootInfo"
      @editBtnCb="editBtnCb"
      @FDhandlerSelect="FDhandlerSelect"
    ></FormDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
export default {
  mixins: [mixin],
  data() {
    return {
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["taskName", "remark", "sourceName"],
        },
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: 380,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success",
          },
          {
            label: "删除",
            css: "danger",
            pass: true,
          },
          {
            label: "配置规则",
            css: "warning",
          },
          {
            label: "同步标准清洗规则",
            css: "warning",
          },
          {
            label: "复制",
            css: "warning",
          },
          {
            label: "执行任务",
            css: "warning",
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
          prop: "sourceType_value",
          label: "类型",
        },
        {
          label: "数据源",
          prop: "sourceName",
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
      TClickItem: [],
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      FDFootInfo: "",
      // 项目列表
      selectOpt: [],
      selectVal: "",
      // 弹出框-下拉列表集
      dataSourceList: [],
      // 数据标准原始数据级联列表
      sourceOption: [],
      // 数据标准列表
      dataStandards: [],
      // 临时变量
      tableActive_: "",
    };
  },
  watch: {
    selectVal: function (newVal) {
      if (newVal == 0 || !!newVal) {
        this.taskList();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "新增任务":
          {
            this.FDTitle = "新增任务";
            this.FDFootInfo = "";
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
                type: "select",
                label: {
                  name: "数据源",
                  width: "120",
                },
                width: "280",
                key: "sourceId",
                defaultModel: "",
                placeholder: "",
                option: this.dataSourceList,
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
              sourceId: [
                { required: true, message: "请选择数据源", trigger: "change" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "button",
                label: "添加数据源",
                cb: () => {
                  this.FDVisible = false;
                  setTimeout(() => {
                    openUrl({
                      type: "open",
                      url: "/data-manage/",
                    });
                  }, 120);
                },
              },
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.taskAdd(form);
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
            this.FDFootInfo = "";
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
                type: "select",
                label: {
                  name: "数据源",
                  width: "120",
                },
                width: "280",
                key: "sourceId",
                defaultModel: "",
                placeholder: "",
                option: this.dataSourceList,
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
              sourceId: [
                { required: true, message: "请选择数据源", trigger: "change" },
              ],
            };
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
                      this.taskUpdate(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "同步标准清洗规则":
          {
            this.FDTitle = "同步数据标准清洗规则";
            this.FDFootInfo =
              "说明：根据数据标准和元数据匹配情况，同步相应数据集的质量规则";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择数据标准",
                  width: "150",
                },
                width: "280",
                key: "standardId",
                defaultModel: "",
                placeholder: "",
                option: this.dataStandards,
              },
              {
                type: "select",
                clearable: true,
                label: {
                  name: "选择元数据库",
                  width: "150",
                },
                width: "280",
                key: "metadataId",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
            ];
            this.FDRules = {
              standardId: [
                {
                  required: true,
                  message: "请选择数据标准",
                  trigger: "change",
                },
              ],
            };
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
                      this.submitDataStandard(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "复制":
          {
            this.FDTitle = "编辑任务信息";
            this.FDVisible = true;
            this.FDFootInfo = "";
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
                type: "select",
                label: {
                  name: "数据源",
                  width: "120",
                },
                width: "280",
                key: "sourceId",
                defaultModel: "",
                placeholder: "",
                option: this.dataSourceList,
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
              sourceId: [
                { required: true, message: "请选择数据源", trigger: "change" },
              ],
            };
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
                cb: (form) => {
                  this.taskCopy(form);
                },
              },
            ]);
          }
          return;
        default:
          return;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.taskList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const { projectId, remark, taskCode, taskName, sourceId } = row;
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
                sourceId,
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
                this.taskDel({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        case "同步标准清洗规则":
          {
            this.showDialog({
              type: column.label,
            });
          }
          return;
        case "配置规则":
          {
            this.FDFootInfo = "";
            cellJump(this, {
              row,
              column,
              TClickItem: [
                {
                  link: "/dataQuality/taskManage/rule",
                  jump: {
                    type: "int",
                    mode: "push",
                  },
                },
              ],
            });
          }
          return;
        case "复制":
          {
            this.FDFootInfo = "";
            this.showDialog({
              type: column.label,
              initDig: {
                projectId,
                remark,
                taskCode,
                taskName,
                sourceId,
              },
            });
          }
          return;
        case "执行任务":
          {
            this.FDFootInfo = "";
            this.taskRun(row.id);
          }
          return;
        default:
          break;
      }
    },
    // 选择下拉
    selectChange(item) {
      this.taskList();
    },
    // 下拉选回调
    FDhandlerSelect({ item, val, form }) {
      let arr_ = [];
      if (item.key === "standardId") {
        this.$set(this.FDForm[0], `defaultModel`, val);
        this.sourceOption.forEach((ele) => {
          if (ele.id === val) {
            if (ele.children && ele.children.length) {
              ele.children.forEach((element) => {
                arr_.push({
                  label: element.label,
                  value: element.id,
                });
              });
            }
          }
        });
        this.$set(this.FDForm[1], `option`, arr_);
      }
    },

    /* 请求 */
    // 获取数据源列表
    getDataSourceList() {
      API._publicSourceData().then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取数据源列表失败!",
        }).init();
        let dataSoruceArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            dataSoruceArr.push({
              label: item.datasourceName,
              value: item.id,
            });
          });
        }
        this.dataSourceList = dataSoruceArr;
      });
    },
    // 项目列表
    getProjectList({ init }) {
      API._PublicProjectList().then((res) => {
        let Res = new ResDatas({
          res,
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
    // 获取
    taskList() {
      this.TLoading = true;
       API.taskList({
        paramsData: {
          current: this.TPage.index,
          size: this.TPage.size
        },
        projectId: this.selectVal
       })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              error: "获取失败!",
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
    taskAdd(req) {
      const { remark, projectId, sourceId, taskCode, taskName } = req;
      API.taskAdd({
        remark,
        projectId,
        sourceId,
        taskCode,
        taskName,
      }).then((res) => {
        new ResDatas({
          res,
          msg: "添加成功!",
          error: "添加失败!",
        }).state();
        this.FDVisible = false;
        this.taskList();
      });
    },
    // 删除
    taskDel({ id }) {
      let queStr = `?id=${id}`;
      API.taskDel(queStr).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "删除成功!",
          error: "删除失败!",
        }).state();
        this.taskList();
      });
    },
    // 更新
    taskUpdate({ remark, projectId, taskCode, taskName, sourceId }) {
      API.taskUpdate({
        id: this.tableActive_.id,
        sourceId,
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
        this.taskList();
      });
    },
    // 复制
    taskCopy(req) {
      const { projectId, sourceId, taskCode, taskName, remark } = req;
      API.taskCopy({
        id: this.tableActive_.id,
        projectId,
        sourceId,
        taskCode,
        taskName,
        remark,
      })
        .then((res) => {
          new ResDatas({
            res,
            error: "复制失败!",
            msg: "复制成功!",
          }).state();
          this.FDVisible = false;
          this.taskList();
        })
        .catch((error) => {
          this.FDVisible = false;
          console.error(error);
        });
    },
    // 执行任务
    taskRun(taskId) {
      API.taskRun({ taskId }).then((res) => {
        new ResDatas({
          res,
          msg: "执行成功",
        }).state();
      });
    },
    // 同步标准清洗规则-获取数据标准列表
    getDataStandard() {
      this.dataStandards = [];
      API._publicDataStandard().then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取数据标准列表失败",
        }).init();
        this.sourceOption = Res;
        Res.forEach((item) => {
          this.dataStandards.push({
            label: item.label,
            value: item.id,
          });
        });
      });
    },
    // 同步标准清洗规则-确定
    submitDataStandard(req) {
      const { standardId, metadataId } = req;
      API.taskSynDataStandard({
        standardId,
        metadataId,
        taskId: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({
          res,
          error: "同步失败",
          msg: "同步成功",
        }).state();
        this.FDVisible = false;
        this.taskList();
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
    this.getDataSourceList();
    this.getDataStandard();
  },
};
</script>

<style lang="less" scoped>
.dq-task-list {
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
