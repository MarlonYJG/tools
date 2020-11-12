<!--
 * @Author: Marlon
 * @Date: 2020-04-26 14:57:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 09:13:24
 * @Description: ETL-作业编排
 -->
<template>
  <div class="work">
    <div class="work-edit-area">
      <ul class="work-edit-area-btn">
        <li>
          <AddButton text="新增作业" @click="showDialog" :clickArgs="{type:'新增作业'}"></AddButton>
        </li>
      </ul>
      <ul class="work-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select v-model="proVal" filterable placeholder="请选择" size="small" @change="getList">
            <el-option
              v-for="item in proOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <div class="work-table">
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
      :FDFootInfo="FDFootInfo"
      :FDRules="FDRules"
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
          item: [
            "projectName",
            "code",
            "name",
            "sourceDataSourceName",
            "targetDataSourceName",
            "remark"
          ]
        }
      ],
      TEdit: {
        show: true,
        slot: true,
        type: "popover",
        title: "操作",
        width: 280,
        fixed: "right",
        editTypes: [
          {
            label: "添加任务&转换",
            css: "success"
          },
          {
            label: "执行",
            css: "warning"
          },
          {
            label: "查看结果",
            css: "warning"
          },
          {
            label: "其他",
            css: "warning",
            select: [
              {
                label: "编辑",
                css: "warning"
              },
              {
                label: "删除",
                css: "danger",
                pass: true
              }
            ]
          }
        ]
      },
      tableTitle: [
        { prop: "projectName", label: "项目" },
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "typeName", label: "类型" },
        { prop: "sourceDataSourceName", label: "数据来源" },
        { prop: "targetDataSourceName", label: "数据去向" },
        { prop: "remark", label: "备注" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      activeRow_: "",
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFootInfo: "",
      FDFoot: {
        button: []
      },
      FDRules: {},
      // 项目列表
      proOption: [],
      proVal: ""
    };
  },
  watch: {
    proVal: function(newVal) {
      if (newVal == 0 || !!newVal) {
        this.getList();
      }
    }
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.FDVisible = editItem.close;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "编辑":
          {
            this.FDTitle = "编辑作业";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择项目",
                  width: "120"
                },
                width: "200",
                key: "projectId",
                defaultModel: this.proVal,
                placeholder: "",
                option: this.proOption
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120"
                },
                width: "280",
                key: "code",
                defaultModel: "",
                placeholder: ""
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120"
                },
                width: "280",
                key: "name",
                defaultModel: "",
                placeholder: ""
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120"
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4
                }
              }
            ];
            this.FDRules = {
              projectId: [
                { required: true, message: "请选择项目", trigger: "change" }
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" }
              ],
              name: [{ required: true, message: "请输入名称", trigger: "blur" }]
            };
            if (initDig && JSON.stringify(initDig) !== "{}") {
              for (const key in initDig) {
                if (initDig.hasOwnProperty(key)) {
                  // TODO 优化
                  this.FDForm.forEach(item => {
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
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      this.upDate(form);
                    }
                  });
                }
              }
            ]);
          }
          return;
        case "新增作业":
          {
            this.FDTitle = "新增作业";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "选择项目",
                  width: "120"
                },
                width: "200",
                key: "projectId",
                defaultModel: this.proVal,
                placeholder: "",
                option: this.proOption
              },
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120"
                },
                width: "280",
                key: "code",
                defaultModel: "",
                placeholder: ""
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120"
                },
                width: "280",
                key: "name",
                defaultModel: "",
                placeholder: ""
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120"
                },
                width: "280",
                key: "remark",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4
                }
              }
            ];
            this.FDRules = {
              projectId: [
                { required: true, message: "请选择项目", trigger: "change" }
              ],
              code: [
                { required: true, message: "请输入编码", trigger: "blur" }
              ],
              name: [{ required: true, message: "请输入名称", trigger: "blur" }]
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      this.add(form);
                    }
                  });
                }
              }
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
      this.getList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      console.log(row, column, id, "========");
      this.activeRow_ = row;
      // TODO
      const { code, name, projectId, remark } = row;
      switch (column.label) {
        case "删除": {
          this.$confirm(`即将删除“${name}”任务, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.del({ id: row.id });
            })
            .catch(() => {});
          return;
        }
        case "查看结果": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/etl/list/resultsList",
                jump: {
                  type: "int",
                  mode: "push"
                }
              }
            ]
          });
          return;
        }
        case "执行": {
          this.runTask({ taskId: this.activeRow_.id });
          return;
        }
        case "编辑": {
          this.popoverHide();
          this.showDialog({
            type: column.label,
            initDig: {
              code,
              name,
              projectId,
              remark
            }
          });
          return;
        }
        case "添加任务&转换": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/etl/list/addTask",
                jump: {
                  type: "int",
                  mode: "push"
                }
              }
            ]
          });
          return;
        }
        default:
          break;
      }
    },
    // popover隐藏
    popoverHide() {
      let popoverArr = document.getElementsByClassName(
        "table_custom_edit_popover"
      );
      if (popoverArr && popoverArr.length) {
        for (let index = 0; index < popoverArr.length; index++) {
          popoverArr[index].style.cssText = "display: none;";
        }
      }
    },
    // 下拉关联-回调
    FDhandlerSelect({ item, form }) {
      console.log(item, form);
      console.log(this.FDForm);
      if (item.key === "type") {
        this.$set(this.FDForm[3], `defaultModel`, form[item.key]);
        if (this.FDForm.length) {
          this.FDForm.forEach((item_, index) => {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item_.key === key) {
                  // TODO 添加初始化状态，根据特定的key
                  this.$set(this.FDForm[index], `defaultModel`, form[key]);
                }
              }
            }
          });
        }
        if (form[item.key] === 1) {
          this.$set(this.FDForm[4], `show`, false);
          this.$set(this.FDForm[5], `show`, false);
          this.$set(this.FDForm[6], `show`, false);
          this.$set(this.FDForm[7], `show`, false);
          this.$set(this.FDForm[8], `show`, true);
          this.FDFoot.button.splice(0, 0, {
            type: "button",
            label: "添加数据源",
            cb: () => {
              this.FDVisible = false;
              setTimeout(() => {
                openUrl({
                  type: "open",
                  url: "/data-manage/#/dataSource/list"
                });
              }, 200);
            }
          });
        } else if (form[item.key] === 2) {
          this.$set(this.FDForm[4], `show`, true);
          this.$set(this.FDForm[5], `show`, true);
          this.$set(this.FDForm[6], `show`, true);
          this.$set(this.FDForm[7], `show`, true);
          this.$set(this.FDForm[8], `show`, false);
          if (this.FDFoot.button.length >= 2) {
            this.FDFoot.button.splice(0, 1);
          }
        }
      }
    },

    /* 请求 */
    // 项目列表
    getProjectList({ init }) {
      API._publicProject().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            proArr.push({
              label: item.name,
              value: item.id
            });
          });
          if (init) {
            this.proVal = proArr[0].value;
          }
        }
        this.proOption = proArr;
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.workList({
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        projectId: this.proVal
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
                pageSize: "pageSize",
                index: "pageNo"
              }
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, title, index } = Res.formatData();
            this.tableTitle = title;
            if (data && data.length) {
              data.forEach(item => {
                item["edit"] = this.TEdit;
              });
            }
            this.tableData = data;
            this.TPage = {
              total,
              index,
              size: pageSize
            };
          } else {
            this.tableData = [];
            this.TPage = {
              total: 0,
              index: 1,
              size: 10
            };
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 增加
    add(req) {
      const { remark, projectId, code, name } = req;
      API.workAdd({ remark, projectId, code, name }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 删除
    del({ id }) {
      API.workDel({ id }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.getList();
      });
    },
    // 更新
    upDate(req) {
      const { remark, projectId, code, name } = req;
      API.workUpdate({
        remark,
        projectId,
        code,
        name,
        id: this.activeRow_.id
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 执行
    runTask({ taskId }) {
      API.runTask({ id: taskId }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.getList();
      });
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.proVal = paramsUrl.id;
      this.getProjectList({ init: false });
    } else {
      this.getProjectList({ init: true });
    }
  }
};
</script>

<style lang="less" scoped>
.work {
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
