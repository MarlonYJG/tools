<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:35:42
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-08-14 15:39:59
 * @Description: 数据质量管理-任务管理-项目管理
 -->
 <template>
  <div class="dq-project-manage">
    <div class="dq-project-manage-edit-area">
      <ul class="dq-project-manage-edit-area-btn">
        <li>
          <AddButton text="新增项目" @click="showDialog" :clickArgs="{type:'新增项目'}"></AddButton>
        </li>
      </ul>
    </div>
    <div class="dq-project-manage-table">
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
import { openUrl } from "utils/jump";
export default {
  mixins: [mixin],
  data() {
    return {
      // 表格
      TAlign: [
        {
          key: "left",
          item: ["projectName", "remark"],
        },
      ],
      TLoading: false,
      TEdit: {
        show: true,
        title: "操作",
        fixed: "right",
        width: "100",
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
        {
          label: "编码",
          prop: "projectCode",
        },
        {
          label: "名称",
          prop: "projectName",
        },
        {
          label: "任务个数",
          prop: "taskCount",
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
      TClickItem: [
        {
          link: "/dataQuality/taskManage/task",
          cells: ["taskCount"],
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
        projectName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        projectCode: [
          { required: true, message: "请输入编码", trigger: "blur" },
        ],
      },
      tableActive_: "",
    };
  },
  methods: {
    // 初始化抽象列中元素的信息并执行删除操作(弹出框关闭时的回调)
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
                key: "projectCode",
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
                key: "projectName",
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
                      this.ProAdd(form);
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
                key: "projectCode",
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
                key: "projectName",
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
                      this.ProUpdate(form);
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
      this.ProList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      const { projectCode, projectName, remark } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showDialog({
              type: column.label,
              initDig: {
                projectCode,
                projectName,
                remark,
              },
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${projectName}”项目, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.ProDel({ id: row.id });
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
    ProList() {
      this.TLoading = true;
      API.projectList({
        current: this.TPage.index,
        size: this.TPage.size,
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
    // 新增项目
    ProAdd(req) {
      const { remark, projectCode, projectName } = req;
      API.projectAdd({ remark, projectCode, projectName }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "添加成功!",
          error: "添加失败!",
        }).state();
        this.FDVisible = false;
        this.ProList();
      });
    },
    // 编辑项目
    ProUpdate({ projectCode, projectName, remark }) {
      API.projectUpdate({
        projectCode,
        projectName,
        remark,
        id: this.tableActive_.id,
      }).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "修改成功!",
          error: "修改失败!",
        }).state();
        this.FDVisible = false;
        this.ProList();
      });
    },
    // 删除操作
    ProDel({ id }) {
      let queStr = `?id=${id}`;
      API.projectDel(queStr).then((res) => {
        new ResDatas({
          res,
          code: 200,
          msg: "删除成功!",
          error: "删除失败!",
        }).state();
        this.ProList();
      });
    },
  },
  mounted() {
    this.ProList();
  },
};
</script>

<style lang="less" scoped>
.dq-project-manage {
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
