<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:26:19
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 09:00:05
 * @Description: 表管理
 -->
<template>
  <div class="table-manage">
    <div class="table-manage-edit-area">
      <ul class="table-manage-edit-area-btn">
        <li>
          <AddButton text="新增" @click="showDialog" :clickArgs="{type:'新增'}"></AddButton>
        </li>
      </ul>
      <ul class="table-manage-edit-area-select">
        <li>
          <el-select size="small" v-model="selectVal" placeholder="请选择项目" filterable clearable>
            <el-option
              v-for="item in selectOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-select size="small" v-model="dbVal" placeholder="请选择数据库" filterable clearable>
            <el-option
              v-for="item in dbOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input placeholder="请输入表名/中文名" v-model="inputVal" clearable size="small">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="query"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="table-manage-table">
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
    <!-- 弹出框 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="545"
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
import { ResDatas, projectDbTable } from "utils/res-format";
import { openUrl } from "utils/jump";
export default {
  mixins: [mixin],
  data() {
    return {
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [
            "projectName",
            "remark",
            "tableNameRemark",
            "dataCollectionName",
          ],
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
            prop: "tableName",
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
        fixed: "right",
        width: 150,
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
            label: "复制",
            css: "text",
          },
        ],
      },
      tableTitle: [
        { prop: "projectName", label: "所属项目" },
        { prop: "dbName", label: "库名" },
        { prop: "tableName", label: "表名" },
        { prop: "tableNameRemark", label: "中文名称" },
        { prop: "columnCount", label: "字段个数" },
        { prop: "dataCollectionName", label: "关联数据标准数据集" },
        { prop: "manager", label: "负责人" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      tableData: [],
      total: 0,
      current: 1,
      pageSize: 10,
      // 可跳转的值
      TClickItem: [
        {
          link: "/metaData/maintain/tableInfo",
          cells: ["columnCount"],
        },
      ],
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {
        projectName_dbId: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
      },
      // 项目
      selectOpt: [],
      selectVal: "",
      // 数据库
      dbOption: [],
      dbVal: "",
      // 输入要查询的值
      inputVal: "",
      // 项目、数据库
      pdtOptions: [],
      pdtVal: [],
      //
      dialogActiveItem_: "",
      tableId_: "",
    };
  },
  watch: {
    selectVal: function (newVal) {
      if (newVal) {
        this.getDbList(newVal);
      } else {
        this.dbOption = [];
        this.dbVal = "";
      }
    },
    dbVal: function (newVal) {
      if (newVal) {
        this.getList();
      }
    },
  },
  methods: {
    // 表格-回调
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
        case "新增":
          {
            let projectName_dbId = projectDbTable(this.pdtOptions, {
              projectId: this.selectVal,
              dbId: this.dbVal,
            });
            this.FDTitle = "新增表";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库",
                  width: "150",
                },
                key: "projectName_dbId",
                width: "280",
                clearable: false,
                defaultModel: projectName_dbId,
                placeholder: "请选择项目、数据库",
                options: this.pdtOptions,
              },
              {
                type: "input",
                label: {
                  name: "数据表名称",
                  width: "150",
                },
                key: "tableName",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "150",
                },
                key: "tableNameRemark",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "150",
                },
                key: "remark",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.add({
                        dbId: form.dbId || this.dbVal,
                        tableName: form.tableName,
                        tableNameRemark: form.tableNameRemark,
                        remark: form.remark,
                      });
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "编辑":
          {
            this.FDTitle = "编辑表信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库",
                  width: "150",
                },
                key: "projectName_dbId",
                width: "280",
                clearable: false,
                defaultModel: [],
                placeholder: "请选择项目、数据库",
                options: this.pdtOptions,
              },
              {
                type: "input",
                label: {
                  name: "数据表名称",
                  width: "150",
                },
                key: "tableName",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "150",
                },
                key: "tableNameRemark",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "150",
                },
                key: "remark",
                width: "280",
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
                      this.update(form);
                    }
                  });
                },
              },
            ]);
          }
          return;
        case "复制":
          {
            this.FDTitle = "复制表信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "cascader",
                label: {
                  name: "项目/数据库",
                  width: "150",
                },
                key: "projectName_dbId",
                width: "280",
                clearable: false,
                defaultModel: [],
                placeholder: "请选择项目、数据库",
                options: this.pdtOptions,
              },
              {
                type: "input",
                label: {
                  name: "数据表名称",
                  width: "150",
                },
                key: "tableName",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "中文名",
                  width: "150",
                },
                key: "tableNameRemark",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "150",
                },
                key: "remark",
                width: "280",
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
                  this.copyTable(form);
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
      const { dbId, tableName, tableNameRemark, remark, projectId } = row;
      let projectName_dbId = projectDbTable(this.pdtOptions, {
        projectId,
        dbId,
      });
      this.tableId_ = row.id;
      switch (column.label) {
        case "编辑":
          this.showDialog({
            type: column.label,
            initDig: {
              tableNameRemark,
              remark,
              projectName_dbId,
              tableName,
            },
          });
          return;
        case "复制":
          this.showDialog({
            type: column.label,
            initDig: {
              tableNameRemark,
              remark,
              projectName_dbId,
              tableName,
            },
          });
          return;
        default:
          break;
      }
    },
    query() {
      if (this.dbVal) {
        if (this.selectVal) {
          this.getList();
        } else {
          this.$message({
            message: "请选择项目",
            type: "warning",
          });
        }
      } else {
        this.getList();
      }
    },

    /* 请求 */
    // 调动数据库
    getDbList(id) {
      API._publicDataBase({ projectId: id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let arr = [];
        if (Res && Res.length) {
          Res.forEach((item) => {
            arr.push({
              label: item.nodeName,
              value: item.dbId,
            });
          });
        }
        this.dbOption = arr;
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.TList({
        projectId: this.selectVal,
        dbId: this.dbVal,
        tableName: this.inputVal,
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
    add(req) {
      const { dbId, tableName, tableNameRemark, remark } = req;
      if (dbId && tableName) {
        API.TAdd({ dbId, tableName, tableNameRemark, remark }).then((res) => {
          new ResDatas({
            res,
            code: 0,
          }).state();
          this.FDVisible = false;
          this.getList();
        });
      }
    },
    update({ dbId, tableName, tableNameRemark, remark }) {
      API.TUpdate({
        dbId,
        tableName,
        tableNameRemark,
        remark,
        id: this.tableId_,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    del({ id }) {
      API.TDel({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 复制
    copyTable({ dbId, tableName, tableNameRemark, remark }) {
      API.TCopy({
        dbId,
        tableName,
        tableNameRemark,
        remark,
        id: this.tableId_,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
  },
  mounted() {
    // 项目
    API._publicTree({ level: 1 }).then((res) => {
      let Res = new ResDatas({
        res,
        code: 0,
      });
      let arr = [];
      if (Res.init() && Res.init().length) {
        Res.init().forEach((item) => {
          arr.push({
            label: item.nodeName,
            value: item.projectId,
          });
        });
      }
      this.selectOpt = arr;
    });
    // 项目、数据库
    API._publicTree({ level: 2 }).then((res) => {
      let Res = new ResDatas({
        res,
        code: 0,
        fieldKey: {
          label: "nodeName",
          value: "nodeId",
          children: "subList",
        },
      });
      if (Res.init()) {
        this.pdtOptions = Res.formatCascader(Res.init());
      } else {
        this.pdtOptions = [];
      }
    });
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      if (paramsUrl.projectId) {
        // 来自库
        this.selectVal = paramsUrl.projectId;
        this.dbVal = paramsUrl.id;
      } else {
        // 来自项目
        this.selectVal = paramsUrl.id;
        this.query();
      }
    } else {
      this.query();
    }
  },
};
</script>

<style lang="scss" scoped>
.table-manage {
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
      li {
        float: left;
        margin-right: 20px;
        &:last-child {
          margin-right: 0;
        }
      }
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
