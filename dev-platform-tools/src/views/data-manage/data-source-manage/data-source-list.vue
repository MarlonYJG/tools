<!--
 * @Author: Marlon
 * @Date: 2020-02-21 10:56:47
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 09:40:48
 * @Description: 数据管理-数据源管理-数据源列表
 -->
<template>
  <div class="data-source-list">
    <div class="data-source-list-edit-area">
      <ul class="data-source-list-edit-area-btn">
        <li>
          <AddButton text="新增" @click="showDialog" :clickArgs="{type:'新增'}"></AddButton>
        </li>
      </ul>
      <ul class="data-source-list-edit-area-select">
        <li>
          <el-input placeholder="请输入名称" v-model="inputVal" size="medium">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="DSMCList"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="data-source-list-table">
      <TableDefault
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TEdit="TEdit"
        :TAlign="TAlign"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @clickRow="clickRow"
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
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { isPositiveInt, checkip } from "utils";
export default {
  mixins: [mixin],
  data() {
    return {
      // 编辑-表格配置
      TLoading: false,
      TEdit: {
        show: true,
        title: "操作",
        width: 100,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            property: "edit",
            css: "text",
          },
          {
            label: "删除",
            property: "del",
            css: "text",
          },
        ],
      },
      TAlign: [
        {
          key: "left",
          item: ["datasourceName", "remark"],
        },
      ],
      tableTitle: [
        {
          prop: "datasourceName",
          label: "名称",
        },
        {
          prop: "datasourceType_value",
          label: "数据库类型",
        },
        {
          prop: "remark",
          label: "备注",
        },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 是否显示弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      // 弹出框配置
      FDForm: [],
      FDFoot: {
        button: [
          {
            type: "button",
            label: "连接测试",
            cb: (form, $this) => {
              $this.$refs[this.FDId].validate((valid) => {
                if (valid) {
                  this.joinText(form);
                }
              });
            },
          },
          {
            type: "ok",
            label: "确定",
            cb: (form, $this) => {
              if (this.dialogActiveItem === "新增") {
                $this.$refs[this.FDId].validate((valid) => {
                  if (valid) {
                    this.DSMCAdd(form);
                  }
                });
              } else {
                $this.$refs[this.FDId].validate((valid) => {
                  if (valid) {
                    this.DSMCUpdate(form);
                  }
                });
              }
            },
          },
        ],
      },
      FDRules: {},
      // 输入要查询的值
      inputVal: "",
      // 获取点击值的信息
      tableActive_: "",
      // 获取对应行为的弹出框
      dialogActiveItem: "",
    };
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        API.DSMCDel({ id: row.id }).then((res) => {
          new ResDatas({ res, msg: "删除成功!" }).state();
          this.DSMCList();
        });
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      this.dialogActiveItem = type;
      this.FDRules = {
        datasourceType: [
          { required: true, message: "请选择数据库类型", trigger: "change" },
        ],
        datasourceName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        ip: [{ validator: this.validatorIp, trigger: "blur" }],
        port: [{ validator: this.validatorPort, trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        databaseName: [
          { required: true, message: "请输入数据库名称", trigger: "blur" },
        ],
      };
      switch (type) {
        case "新增":
          {
            this.FDTitle = "新增数据源";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据库类型",
                  width: "120",
                },
                key: "datasourceType",
                width: "200",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "datasourceName",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "IP",
                  width: "120",
                },
                key: "ip",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "端口",
                  width: "120",
                },
                key: "port",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "用户名",
                  width: "120",
                },
                key: "username",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "密码",
                  width: "120",
                },
                showPassword: true,
                key: "password",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "数据库名称",
                  width: "120",
                },
                key: "databaseName",
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
            API._PublicDataBaseList({
              name: "datasource_datasource_type",
            }).then((res) => {
              let Res = new ResDatas({ res }).init();
              let arr = [];
              if (Res && Res.length) {
                Res.forEach((item) => {
                  arr.push({
                    label: item.name,
                    value: item.code,
                  });
                });
              }
              this.$set(this.FDForm[0], `option`, arr);
              this.$set(this.FDForm[0], `defaultModel`, arr[0].value);
            });
          }
          return;
        case "编辑":
          {
            this.FDTitle = "编辑数据源";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据库类型",
                  width: "120",
                },
                key: "datasourceType",
                width: "200",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "datasourceName",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "IP",
                  width: "120",
                },
                key: "ip",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "端口",
                  width: "120",
                },
                key: "port",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "用户名",
                  width: "120",
                },
                key: "username",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "密码",
                  width: "120",
                },
                showPassword: true,
                key: "password",
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "数据库名称",
                  width: "120",
                },
                key: "databaseName",
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
            API._PublicDataBaseList({
              name: "datasource_datasource_type",
            }).then((res) => {
              let Res = new ResDatas({ res }).init();
              let arr = [];
              if (Res && Res.length) {
                Res.forEach((item) => {
                  arr.push({
                    label: item.name,
                    value: item.code,
                  });
                });
              }
              this.$set(this.FDForm[0], `option`, arr);
            });
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
      this.DSMCList();
    },
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const {
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      } = row;
      switch (column.label) {
        case "编辑":
          this.showDialog({
            type: column.label,
            initDig: {
              databaseName,
              datasourceName,
              datasourceType,
              ip,
              password,
              port,
              remark,
              username,
            },
          });
          return;

        default:
          break;
      }
    },
    clickRow({ row, column, id }) {
      console.log(row, column, id);
    },
    // ip验证
    validatorIp(rule, value, callback) {
      if (checkip(value)) {
        callback();
      } else {
        callback(new Error("请检查ip"));
      }
    },
    // 端口号验证
    validatorPort(rule, value, callback) {
      if (isPositiveInt(value)) {
        callback();
      } else {
        callback(new Error("请检查端口号"));
      }
    },

    /* 请求 */
    // 查询数据源列表
    DSMCList() {
      let req = null;
      if (this.inputVal) {
        req = {
          current: this.TPage.index,
          size: this.TPage.size,
          datasourceName: this.inputVal,
        };
      } else {
        req = {
          current: this.TPage.index,
          size: this.TPage.size,
        };
      }
      this.TLoading = true;
      API.DSMCList(req)
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size",
                index: "current",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, index, pageSize } = Res.formatData();
            this.tableData = data;
            this.TPage = {
              total,
              index,
              size: pageSize,
            };
          }
        })
        .catch((err) => {
          this.TLoading = false;
        });
    },
    // 新增数据源
    DSMCAdd(req) {
      const {
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      } = req;
      API.DSMCAdd({
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
        id: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({ res, msg: "添加成功!" }).state();
        this.FDVisible = false;
        this.DSMCList();
      });
    },
    // 修改数据源
    DSMCUpdate(req) {
      const {
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      } = req;
      API.DSMCUpdate({
        id: this.tableActive_.id,
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      }).then((res) => {
        new ResDatas({ res, msg: "修改成功!" }).state();
        this.FDVisible = false;
        this.DSMCList();
      });
    },
    // 连接测试
    joinText(req) {
      const {
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      } = req;
      API.JoinText({
        databaseName,
        datasourceName,
        datasourceType,
        ip,
        password,
        port,
        remark,
        username,
      }).then((res) => {
        let Res = res.data.data;
        if (Res) {
          this.$message({
            message: "连接成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "连接失败",
            type: "error",
          });
        }
        this.FDVisible = false;
        this.DSMCList();
      });
    },
  },
  mounted() {
    this.DSMCList();
  },
};
</script>

<style lang="scss" scoped>
.data-source-list {
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
}
</style>