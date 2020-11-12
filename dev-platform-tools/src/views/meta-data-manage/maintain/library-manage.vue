<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:25:27
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 08:59:24
 * @Description: 库管理
 -->
<template>
  <div class="library-manage">
    <div class="library-manage-edit-area">
      <ul class="library-manage-edit-area-btn">
        <li>
          <AddButton text="新增库" @click="showDialog" :clickArgs="{type:'新增库'}"></AddButton>
        </li>
        <li>
          <el-tooltip class="item" effect="dark" content="比较两个或多个项目之间的元数据的差异" placement="top">
            <el-button size="medium" @click="exportDbDifference">比较</el-button>
          </el-tooltip>
        </li>
      </ul>
      <ul class="library-manage-edit-area-select">
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
    <div class="library-manage-table">
      <TableDefault
        TId="table_01"
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TEdit="TEdit"
        :TData="tableData"
        :TIsShowCheckBox="true"
        :TIsShowPage="true"
        :TTotal="total"
        :TCurrentPage="current"
        :TPageSize="pageSize"
        :TClickItem="TClickItem"
        :TSort="TSort"
        :TMultipleSelection="TMultipleSelection"
        @handleSelectionChange="handleSelectionChange"
        @clickCell="lickCell"
        @changePage="changePage"
        @editBtnCb="editBtnCb"
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
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas } from "utils/res-format";
import { cellJump } from "utils/jump";
import { _ExportExcel } from "utils/index";
export default {
  mixins: [mixin],
  data() {
    return {
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["projectName", "remark", "dbNameRemark"],
        },
      ],
      TSort: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "dbName",
            order: "descending",
          },
          {
            prop: "tableCount",
            order: "descending",
          },
          {
            prop: "columnCount",
            order: "descending",
          },
        ],
      },
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
          },
          {
            label: "导入数据库结构",
            css: "text",
          },
          {
            label: "导入数据标准",
            css: "text",
          },
          {
            label: "复制",
            css: "text",
          },
        ],
      },
      tableTitle: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "库名" },
        { prop: "dbNameRemark", label: "中文名称" },
        { prop: "tableCount", label: "数据表个数" },
        { prop: "columnCount", label: "字段个数" },
        { prop: "dataStandardName", label: "关联数据标准" },
        { prop: "manager", label: "负责人" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      TClickItem: [
        {
          link: "/metaData/maintain/table",
          cells: ["tableCount"],
        },
        {
          link: "/metaData/maintain/tableInfo",
          cells: ["columnCount"],
        },
      ],
      // 多选
      multipleSelection: [],
      TMultipleSelection: [],
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [
        {
          type: "select",
          label: {
            name: "所属项目",
            width: "120",
          },
          width: "200",
          defaultModel: "",
          placeholder: "",
          option: [
            {
              label: "海淀",
              value: "haidian",
            },
          ],
        },
        {
          type: "input",
          label: {
            name: "中文名称",
            width: "120",
          },
          width: "280",
          defaultModel: "",
          placeholder: "",
        },
        {
          type: "input",
          label: {
            name: "库名",
            width: "120",
          },
          width: "280",
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
          defaultModel: "",
          placeholder: "",
          autosize: {
            min: 2,
            max: 4,
          },
        },
      ],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 下拉选择
      selectOpt: [],
      selectVal: "",
      dataSourceList: [],
      dataStandardList: [],
      // 临时变量
      tableActive_: "",
    };
  },
  watch: {
    selectVal: function (newVal) {
      if (newVal) {
        this.getList();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      } else if (text === "删除") {
        this.del(row);
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "新增库":
          {
            this.FDTitle = "新增库";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "所属项目",
                  width: "120",
                },
                width: "200",
                key: "projectId",
                defaultModel: this.selectVal,
                placeholder: "",
                option: this.selectOpt,
              },
              {
                type: "input",
                label: {
                  name: "中文名称",
                  width: "120",
                },
                width: "280",
                key: "dbNameRemark",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "库名",
                  width: "120",
                },
                width: "280",
                key: "dbName",
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
                {
                  required: true,
                  message: "请选择所属项目",
                  trigger: "change",
                },
              ],
              dbName: [
                { required: true, message: "请输入编码", trigger: "blur" },
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
            this.FDTitle = "编辑库信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "所属项目",
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
                  name: "中文名称",
                  width: "120",
                },
                width: "280",
                key: "dbNameRemark",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "库名",
                  width: "120",
                },
                width: "280",
                key: "dbName",
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
                {
                  required: true,
                  message: "请选择所属项目",
                  trigger: "change",
                },
              ],
              dbName: [
                { required: true, message: "请输入编码", trigger: "blur" },
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
                      this.update(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "导入数据库结构":
          {
            this.FDTitle = "选择数据源";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据源",
                  width: "120",
                },
                width: "200",
                key: "dataSourceId",
                defaultModel: "",
                placeholder: "请选择数据源",
                option: this.dataSourceList,
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "button",
                label: "添加数据源",
                cb: (form) => {
                  this.FDVisible = false;
                  setTimeout(() => {
                    cellJump(this, {
                      TClickItem: [
                        {
                          link: "/data-manage/#/dataSource/list",
                          jump: {
                            type: "out",
                            mode: "open",
                          },
                        },
                      ],
                    });
                  }, 120);
                },
              },
              {
                type: "ok",
                label: "确定",
                cb: (form) => {
                  this.FDVisible = false;
                  this.importDb(form);
                },
              },
            ]);
          }
          return;
        case "导入数据标准":
          {
            this.FDTitle = "导入数据标准";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择数据标准",
                  width: "120",
                },
                width: "200",
                key: "dataStandardId",
                defaultModel: "",
                placeholder: "请选择数据标准",
                option: this.dataStandardList,
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form) => {
                  this.FDVisible = false;
                  this.importStand(form);
                },
              },
            ]);
          }
          return;
        case "复制":
          {
            this.FDTitle = "编辑库信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "所属项目",
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
                  name: "中文名称",
                  width: "120",
                },
                width: "280",
                key: "dbNameRemark",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "库名",
                  width: "120",
                },
                width: "280",
                key: "dbName",
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
                cb: (form) => {
                  this.copyLibrary(form);
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
      this.current = currentPage;
      this.pageSize = pageSize;
      this.getList();
    },
    lickCell({ row, column, id }) {
      const { projectId, dbName, dbNameRemark, remark, dataStandardId } = row;
      this.tableActive_ = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                projectId,
                dbName,
                dbNameRemark,
                remark,
              },
            });
          }
          return;
        case "导入数据库结构":
          {
            this.showDialog({
              type: column.label,
            });
          }
          return;
        case "导入数据标准":
          {
            this.showDialog({
              type: column.label,
            });
          }
          return;
        case "复制":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                projectId,
                dbName,
                dbNameRemark,
                remark,
              },
            });
          }
          return;
        default:
          break;
      }
    },
    // 多选条件限制
    handleSelectionChange(type, val) {
      if (val && val.length > 2) {
        let newArr = val.slice(-2);
        this.TMultipleSelection = newArr;
      }
      this.multipleSelection = val;
    },
    // 选择下拉
    selectChange() {
      this.getList();
    },

    /* 请求 */
    // 获取项目列表
    getTree({ init }) {
      API._publicTree({ level: 1 }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取项目失败!",
        }).init();
        if (Res.length) {
          let arr_ = [];
          Res.forEach((item) => {
            arr_.push({
              label: item.nodeName,
              value: item.projectId,
            });
          });
          this.selectOpt = arr_;
        }
      });
    },
    // 获取数据源
    getDataSource() {
      API._publicDataSourceList().then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取数据源列表失败!",
        }).init();
        let sourceArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            sourceArr.push({
              label: item.datasourceName,
              value: item.id,
            });
          });
        }
        this.dataSourceList = sourceArr;
      });
    },
    // 获取数据标准
    getDataStandard() {
      API._publicDataStandardList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
          error: "获取数据标准列表失败!",
        }).init();
        let dataStandardArr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            dataStandardArr.push({
              label: item.versionName,
              value: item.id,
            });
          });
        }
        this.dataStandardList = dataStandardArr;
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.DList({
        projectId: this.selectVal,
        pageNo: this.current,
        pageSize: this.pageSize,
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.tableTitle = title;
            this.tableData = data;
            this.total = total;
            this.pageSize = pageSize;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    del({ id }) {
      API.DDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    update({ projectId, dbName, dbNameRemark, remark }) {
      API.DUpdate({
        projectId,
        dbName,
        dbNameRemark,
        remark,
        id: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    add(req) {
      const { projectId, dbName, dbNameRemark, remark } = req;
      API.DAdd({ projectId, dbName, dbNameRemark, remark }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 复制
    copyLibrary({ projectId, dbName, dbNameRemark, remark }) {
      API.DCopy({
        projectId,
        dbName,
        dbNameRemark,
        remark,
        id: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 导入数据标准
    importStand(req) {
      const loading = this.$loading({
        lock: true,
        text: "正在执行导入操作...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      API.exportDataStandard({
        dataStandardId: req.dataStandardId,
        dbId: this.tableActive_.id,
      }).then((res) => {
        loading.close();
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 导入数据源
    importDb(req) {
      const loading = this.$loading({
        lock: true,
        text: "正在执行导入操作...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      API.exportDataBase({
        dataSourceId: req.dataSourceId,
        dbId: this.tableActive_.id,
      }).then((res) => {
        loading.close();
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 对比导出
    exportDbDifference() {
      if (this.multipleSelection.length === 2) {
        API.DExport({
          firstDbId: this.multipleSelection[0].id,
          secondDbId: this.multipleSelection[1].id,
        }).then((res) => {
          _ExportExcel(
            res.config.url +
              `?firstDbId=${this.multipleSelection[0].id}&secondDbId=${this.multipleSelection[1].id}`
          );
        });
      } else {
        this.$message({
          message: "请选择两个对比库",
          type: "warning",
        });
      }
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.selectVal = paramsUrl.id;
      this.getTree({ init: false });
    } else {
      this.getTree({ init: true });
      this.getList();
    }
    this.getDataSource();
    this.getDataStandard();
  },
};
</script>

<style lang="less" scoped>
.library-manage {
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
  /deep/ .el-table th {
    padding: 2px 0;
  }
}
</style>
