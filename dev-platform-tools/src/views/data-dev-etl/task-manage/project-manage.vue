<!--
 * @Author: Marlon
 * @Date: 2020-04-26 14:57:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-29 09:14:51
 * @Description: ETL-项目管理
 -->
 <template>
  <div class="etl-t-m-project-manage">
    <div class="etl-t-m-project-manage-edit-area">
      <ul class="etl-t-m-project-manage-edit-area-btn">
        <li>
          <AddButton text="新增项目" @click="showDialog" :clickArgs="{type:'新增项目'}"></AddButton>
        </li>
      </ul>
    </div>
    <div class="etl-t-m-project-manage-table">
      <TableDefault
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TEdit="TEdit"
        :TData="tableData"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TClickItem="TClickItem"
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
import API from "api/index";
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
          item: ["code", "remark", "name"],
        },
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success",
          },
          {
            label: "删除",
            pass: true,
            css: "danger",
          },
        ],
      },
      tableTitle: [
        { prop: "code", label: "编码" },
        { prop: "name", label: "名称" },
        { prop: "taskNum", label: "任务个数" },
        { prop: "remark", label: "备注" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      TClickItem: [
        {
          link: "/etl/manage/taskList",
          cells: ["taskNum"],
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
        code: [{ required: true, message: "请输入编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
      activeRow_: "",
    };
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
        case "新增项目":
          {
            this.FDTitle = "新增项目";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
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
                  name: "编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "名称",
                  width: "120",
                },
                key: "name",
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
      this.activeRow_ = row;
      const { code, name, remark } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                code,
                name,
                remark,
              },
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”项目, 是否继续?`, "提示", {
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
        default:
          break;
      }
    },

    /* 请求 */
    // 获取项目列表
    getList() {
      this.TLoading = true;
      API.getProList({
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
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
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, title, index } = Res.formatData();
            this.tableData = data;
            this.tableTitle = title;
            this.TPage = {
              total,
              index,
              size: pageSize,
            };
          } else {
            this.tableData = [];
            this.TPage = {
              total: 0,
              index: 1,
              size: 10,
            };
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 新增项目
    add(req) {
      const { remark, code, name } = req;
      API.addPro({ remark, code, name }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 编辑项目
    update({ code, name, remark }) {
      this.FDVisible = false;
      API.updatePro({
        code,
        name,
        remark,
        id: this.activeRow_.id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.FDVisible = false;
        this.getList();
      });
    },
    // 删除操作
    del({ id }) {
      API.delPro({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="less" scoped>
.etl-t-m-project-manage {
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
