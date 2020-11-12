<!--
 * @Author: Marlon
 * @Date: 2020-02-27 16:48:49
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-27 10:34:12
 * @Description: 标签页弹出框
 -->

<template>
  <el-dialog
    title="编辑源数据集"
    :visible.sync="dialogTableVisible"
    width="800px"
    @close="close"
    class="tabs-dialog"
  >
    <el-tabs v-model="activeName" class="tabs">
      <el-tab-pane label="源数据表" name="first">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="表：">
            <el-select
              v-model="tableVal"
              style="margin-left: 20px;"
              placeholder="请选择表"
              clearable
              filterable
            >
              <el-option
                v-for="item in tableOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据过滤：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5, maxRows: 10}"
              placeholder="请参考相应SQL语法填写where过滤语句，该过滤语句可做数据筛选用，或做数据增量采集用。"
              v-model="sqlField"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="tabs-btn">
          <el-button size="medium" type="primary" @click="viewData">数据预览</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="SQL数据集" name="second">
        <el-input
          type="textarea"
          :autosize="{ minRows: 10, maxRows: 15}"
          placeholder="请填写SQL语句"
          v-model="sqlText"
        ></el-input>
        <div class="tabs-btn">
          <el-button size="medium" type="primary" @click="viewData">数据预览</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="相似数据集(知识库推荐)" name="third">
        <div>
          <p></p>
          <!-- <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
          </el-table>-->
        </div>
      </el-tab-pane>
    </el-tabs>
    
    <div slot="footer" class="dialog-footer">
      <template v-for="(item, index) in TabsDFootBtn">
        <el-button
          size="medium"
          :key="index"
          :type="editButtonClassFn(item)"
          :class="editButtonClassFn(item)"
          @click="FDEdit(item)"
        >{{item.label}}</el-button>
      </template>
    </div>
    <!-- 弹框 -->
    <el-dialog :title="previewTableTitle" :visible.sync="innerVisible">
      <el-table
        tooltip-effect="dark"
        border
        v-loading="loading"
        :data="dinnerDigTableData"
        style="width: 100%"
        height="550"
        max-height="550"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="TindexFn"
          width="70"
          align="center"
          fixed="left"
        ></el-table-column>
        <template v-for="(item, index) in dinnerDigTableTitle">
          <el-table-column
            v-if="dinnerDigTableTitle.length-1 !==index"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-else
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width ? `'${item.width}'`:null"
            align="center"
            show-overflow-tooltip
            fixed="right"
          ></el-table-column>
        </template>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align:center;"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :current-page="currentPage"
        :page-sizes="[20]"
        :page-size="pageSize"
        :total="total"
        @size-change="changePageSizeFn"
        @current-change="changeCurrentFn"
      ></el-pagination>
    </el-dialog>
  </el-dialog>
</template>

<script>
import API from "api";
import { ResDatas } from "utils/res-format";

export default {
  props: {
    TabsDigShow: {
      type: Boolean,
      default: false
    },
    TabsDFootBtn: {
      type: Array,
      default: function() {
        return [
          {
            label: "确定",
            css: "primary"
          }
        ];
      }
    },
    // sql数据集
    TabsDigSql: {
      type: String,
      default: ""
    },
    // 当前对象
    TabsItem: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      dialogTableVisible: false,
      activeName: "first",
      innerVisible: false,
      // 源数据表
      tableVal: "", // 表
      sqlField: "", // 过滤SQL
      tableOption: [],
      dinnerDigTableTitle: [], // 预览
      dinnerDigTableData: [],
      // SQL数据集
      sqlText: "",
      // 相似数据集
      // 表格预览
      previewTableTitle: "",
      loading: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,

      /*  */
      form: {},
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  watch: {
    TabsDigShow(newVal, oldVal) {
      this.dialogTableVisible = newVal;
    },
    TabsDigSql: function(newVal) {},
    TabsItem: {
      handler(newVal) {
        if (Object.keys(newVal).length) {
          // 源数据表
          this.getSourceTableList(newVal.id);
          // SQL数据集
          this.getCollect(newVal);
        }
      },
      deep: true
    }
  },
  methods: {
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogTableVisible
      });
    },
    // 自动更改序号
    TindexFn(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      this.TabsDFootBtn.forEach((element, index) => {
        if (item.label === element.label) {
          BtnClass = element.css || "";
          return;
        } else {
          return BtnClass;
        }
      });
      return BtnClass;
    },
    // 确定按钮
    FDEdit(edit) {
      if (edit.cb) {
        switch (this.activeName) {
          case "first":
            edit.cb({
              type: this.activeName,
              form: { tableVal: this.tableVal, sqlText: this.sqlField }
            });
            return;
          case "second":
            edit.cb({ type: this.activeName, form: this.sqlText });
            return;

          default:
            break;
        }
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    changePageSizeFn(size) {
      this.pageSize = size;
      this.viewData();
    },
    changeCurrentFn(currentPage) {
      this.currentPage = currentPage;
      this.viewData();
    },
    /* 请求 */
    // 编辑源数据集-数据预览
    viewData() {
      switch (this.activeName) {
        case "first":
          {
            this.innerVisible = true;
            // TODO bug：10条数据是不显示序号
            this.loading = true;
            this.previewTableTitle = "源数据表预览";
            this.dinnerDigTableTitle = [];
            this.dinnerDigTableData = [];
            API.preViewJob({
              jobId: this.TabsItem.id,
              collectPo: {
                collectType: 1,
                // sqlScript: this.sqlField,
                tableName: this.tableVal
              },
              page: {
                current: this.currentPage,
                size: this.pageSize
              }
            })
              .then(res => {
                let Res = new ResDatas(
                  {
                    res
                  },
                  "loading",
                  this
                );
                let resData_ = Res.init();
                if (resData_) {
                  if (
                    resData_ &&
                    resData_.data &&
                    resData_.data.records &&
                    resData_.data.records.length
                  ) {
                    this.dinnerDigTableData = resData_.data.records;
                  } else {
                    this.dinnerDigTableData = [];
                  }
                  if (resData_) {
                    if (resData_.title) {
                      this.dinnerDigTableTitle = resData_.title;
                    }
                    if (resData_.data) {
                      this.total = resData_.data.total || 0;
                    }
                    if (resData_.data) {
                      this.pageSize = resData_.data.size;
                    }
                  }
                } else {
                  this.dinnerDigTableData = [];
                  this.dinnerDigTableTitle = [];
                  this.total = 0;
                }
              })
              .catch(error => {
                this.loading = false;
                console.error(error);
              });
          }
          return;
        case "second":
          {
            this.previewTableTitle = "SQL数据集预览";
            this.dinnerDigTableTitle = [];
            this.dinnerDigTableData = [];
            if (this.sqlText) {
              this.innerVisible = true;
              this.loading = true;
              API.preViewJob({
                jobId: this.TabsItem.id,
                collectPo: {
                  collectType: 3,
                  sqlScript: this.sqlText,
                  tableName: this.tableVal
                },
                page: {
                  current: this.currentPage,
                  size: this.pageSize
                }
              })
                .then(res => {
                  console.log(res);
                  let Res = new ResDatas(
                    {
                      res,
                      fieldKey: {
                        data: "records",
                        title: "title",
                        total: "total",
                        pageSize: "size"
                      }
                    },
                    "loading",
                    this
                  );
                  if (Res.init()) {
                    let ResDatas = Res.init();
                    const { title } = Res.formatData();
                    this.dinnerDigTableData = ResDatas.data.records;
                    this.dinnerDigTableTitle = title;
                    this.total = ResDatas.data.total;
                    this.pageSize = ResDatas.data.size;
                  } else {
                    this.dinnerDigTableData = [];
                    this.dinnerDigTableTitle = [];
                    this.total = 0;
                  }
                })
                .catch(error => {
                  this.loading = false;
                  console.error(error);
                });
            } else {
              this.$message({
                message: "请填写SQL语句",
                type: "warning"
              });
            }
          }
          return;
        default:
          break;
      }
    },
    // 编辑源数据集-源数据表-获取表列表
    getSourceTableList(jobId) {
      API.getJobTableList({ jobId }).then(res => {
        let Res = new ResDatas({
          res,
          error: "获取列表失败!"
        }).init();
        let list = [];
        if (Res && Res.length) {
          Res.forEach((item, index) => {
            list.push({
              label: item.tableName,
              value: item.tableName
            });
          });
        }
        this.tableOption = list;
      });
    },
    // 编辑源数据集-SQL数据集-获取
    getCollect({ collectId }) {
      API.getCollect({ id: collectId }).then(res => {
        let Res = new ResDatas({
          res
        }).init();
        if (Res) {
          this.sqlText = Res.sqlScript || "";
          this.sqlField = Res.sqlScript || "";
          this.tableVal = Res.tableName || "";
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.tabs-dialog {
  .tabs {
    height: 375px;
  }
  .tabs-btn {
    text-align: center;
    margin-top: 22px;
  }
  // TODO 编辑按钮配色
  .edit-button-color {
    &-1 {
      background: $table_edit_btn_bg;
      color: $table_edit_btn_color;
      &:hover,
      &:focus {
        color: $table_edit_btn_color_focus;
        border-color: $table_edit_btn_border_color;
        background-color: $table_edit_btn_bg_focus;
      }
      &:active {
        color: $table_edit_btn_color_active;
        border-color: $table_edit_btn_border_color_active;
        outline: 0;
      }
    }
  }
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
  //  分页
  .pagination {
    margin: 15px 0;
  }
}
</style>