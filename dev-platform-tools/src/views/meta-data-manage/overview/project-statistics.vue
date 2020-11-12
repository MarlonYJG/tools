<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:24:04
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 08:58:17
 * @Description: 项目统计
 -->
<template>
  <div class="project-statistics">
    <ul class="project-statistics-edit-area">
      <li>
        <AddButton text="新建" @click="showDialog" :clickArgs="{type:'新建'}"></AddButton>
      </li>
    </ul>
    <div class="project-statistics-table">
      <TableDefault
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="total"
        :TCurrentPage="current"
        :TClickItem="TClickItem"
        :TPageSize="pageSize"
        :TSort="TSort"
        :TAlign="TAlign"
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
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas } from "utils/res-format";
export default {
  mixins: [mixin],
  data() {
    return {
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["name", "remark"],
        },
      ],
      TSort: {
        default: {
          prop: "gmtCreate",
          order: "descending",
        },
        sortArr: [
          {
            prop: "code",
            order: "descending",
          },
          {
            prop: "dbCount",
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
        fixed: "right",
        width: 140,
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
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "dbCount", label: "数据库个数" },
        { prop: "tableCount", label: "数据表个数" },
        { prop: "columnCount", label: "字段个数" },
        { prop: "remark", label: "备注" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      tableData: [],
      current: 1,
      pageSize: 10,
      total: 0,
      // 是否显示弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      // 弹出框配置
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
      },
      // 可跳转的值
      TClickItem: [
        {
          link: "/metaData/maintain/library",
          cells: ["dbCount"],
        },
        {
          link: "/metaData/maintain/table",
          cells: ["tableCount"],
        },
        {
          link: "/metaData/maintain/tableInfo",
          cells: ["columnCount"],
        },
      ],
      dialogActiveItem_: "",
      tableId_: "",
    };
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
      this.dialogActiveItem_ = type;
      switch (type) {
        case "新建":
          {
            this.FDTitle = "新建项目";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "80",
                },
                width: "220",
                key: "name",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "80",
                },
                width: "220",
                key: "code",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "80",
                },
                width: "380",
                key: "remark",
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
            this.FDTitle = "编辑项目信息";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "80",
                },
                width: "220",
                key: "name",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "80",
                },
                width: "220",
                key: "code",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "80",
                },
                width: "380",
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
            this.FDTitle = "复制项目";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "80",
                },
                width: "120",
                key: "name",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "80",
                },
                width: "120",
                key: "code",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "80",
                },
                width: "380",
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
                  this.copyPro(form);
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
      const { remark, name, code } = row;
      this.tableId_ = row.id;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                remark,
                name,
                code,
              },
            });
          }
          return;
        case "复制":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                remark,
                name,
                code,
              },
            });
          }
          return;
        default:
          return;
      }
    },

    /* 请求 */
    // 获取
    getList() {
      this.TLoading = true;
      API.PList({
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
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 删除
    del({ id }) {
      API.PDel({ id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 新建
    add(req) {
      const { name, remark, code } = req;
      API.PAdd({ name, remark, code }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 更新
    update({ name, code, remark }) {
      API.PUpdate({ id: this.tableId_, name, code, remark }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
        this.FDVisible = false;
      });
    },
    // 复制
    copyPro({ name, code, remark }) {
      API.PCopy({ id: this.tableId_, name, code, remark }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
        this.FDVisible = false;
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.project-statistics {
  &-edit-area {
    overflow: hidden;
    li {
      float: left;
      margin: 2px 15px;
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
