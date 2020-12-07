<!--
 * @Author: Marlon
 * @Date: 2020-02-25 15:50:25
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-09 14:40:47
 * @Description: 表格弹出框
 -->
<template>
  <el-dialog
    :title="TableDigTitle"
    :visible.sync="dialogTableVisible"
    :width="TableDigWidth ? `${TableDigWidth}px`:null"
    @close="close"
    class="T-dialog"
    :close-on-click-modal="false"
  >
    <el-table
      :ref="TableDigId"
      size="small"
      :data="tableData"
      v-loading="loading"
      border
      style="width: 100%"
      tooltip-effect="dark"
      :height="(TabledigHeight)?TabledigHeight:null"
      :max-height="TabledigHeight ?TabledigHeight:null"
      :row-class-name="TMarkAverageFn"
      :cell-class-name="TMarkMinMaxLinkFn"
      :summary-method="TSumFn"
      @selection-change="handleSelectionChange"
      @cell-click="TClickCells"
      @row-click="TClickRowFn"
    >
      <!-- 多选 -->
      <el-table-column v-if="TableDigShowCheckBox" type="selection" width="45" :fixed="true"></el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="TableDigIndex"
        label="序号"
        type="index"
        :index="TindexFn"
        width="50"
        align="center"
      ></el-table-column>
      <!-- 数据 -->
      <template v-for="(item, index)  in tableTitle">
        <el-table-column
          v-if="item.type === 'select'"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || null"
          :key="index"
          :show-overflow-tooltip="true"
          :sortable="false"
          align="center"
        ></el-table-column>
        <el-table-column
          v-else-if="item.type ==='input'"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || null"
          :key="index"
          :show-overflow-tooltip="true"
          :sortable="false"
          align="center"
        >
          <template slot-scope="scope">
            <el-input size="small" placeholder="请输入内容" v-model="scope.row.value" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="item.prop"
          :label="item.label"
          :width="item.width || null"
          :key="index"
          :show-overflow-tooltip="true"
          :sortable="false"
          align="center"
        ></el-table-column>
      </template>
      <!-- 末尾操作 -->
      <el-table-column
        v-if="TableDigEdit.show"
        :label="TableDigEdit.label"
        :width="TableDigEdit.width || null"
        :fixed="TableDigEdit.fixed || null"
        align="center"
      >
        <template v-for="(item, index) in TableDigEdit.types">
          <Debounce time="1500" :key="index">
            <el-button
              :key="index"
              size="mini"
              :class="editButtonClassFn(item)"
              @click="TEditFn(item)"
            >{{item.label}}</el-button>
          </Debounce>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="TableDigPage.show"
      style="text-align:center;"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      :current-page="currentPage"
      :page-sizes="[10, 20]"
      :page-size="pageSize"
      :total="total"
      @size-change="TChangePageSizeFn"
      @current-change="TChangeCurrentFn"
    ></el-pagination>
    <div v-if="TableDigFootInfo && TableDigFootInfo.show" class="foot-info">
      <label for>备注说明：</label>
      <el-input
        v-if="TableDigFootInfo.type ==='textarea'"
        :disabled="TableDigFootInfo.disabled"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        :placeholder="TableDigFootInfo.placeholder"
        v-model="footInfo"
        style="width:85%"
      ></el-input>
    </div>
    <div slot="footer" class="dialog-footer" v-if="TableDigFoot.show">
      <template v-for="(item, index) in TableDigFoot.data">
        <!-- item.classType || null -->
        <Debounce time="1500" :key="index">
          <el-button
            size="small"
            :key="index"
            type="primary"
            @click="submitBtn(item)"
          >{{item.label}}</el-button>
        </Debounce>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import Debounce from "@/components/debounce/index";
export default {
  components: { Debounce },
  props: {
    TableDigId: {
      type: String,
      default: ""
    },
    // 标题
    TableDigTitle: {
      type: String,
      default: ""
    },
    TableDigWidth: {
      type: Number,
      default: 0
    },
    // 控制是否显示
    TableDigVisible: {
      type: Boolean,
      default: false
    },
    // 表头
    TableTitle: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 数据
    TableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否加载
    TableDigLoading: {
      type: Boolean,
      default: false
    },
    // 可点击的单元格
    TClickItem: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否固定表头
    TabledigHeight: {
      type: Number,
      default: 0
    },
    // 多选
    TableDigShowCheckBox: {
      type: Boolean,
      default: false
    },
    // 设置多选的key
    TableDigCheckBoxKey: {
      type: String,
      default: ""
    },
    // 是否显示序号
    TableDigIndex: {
      type: Boolean,
      default: true
    },
    // 抽象列
    TableDigEdit: {
      type: Object,
      default: function() {
        return {
          show: false,
          label: "操作",
          width: 100,
          fixed: "right",
          types: [
            {
              label: "删除"
            }
          ]
        };
      }
    },
    // 分页
    TableDigPage: {
      type: Object,
      default: function() {
        return {
          show: true,
          currentPage: 1,
          pageSize: 10,
          total: 0
        };
      }
    },
    // 底部操作
    TableDigFoot: {
      type: Object,
      default: function() {
        return {
          show: true,
          data: [
            {
              type: "button",
              classType: "primary",
              class: "",
              label: "确定"
            }
          ]
        };
      }
    },
    // 是否显示底部信息
    TableDigFootInfo: {
      type: Object,
      default: function() {
        return {
          show: false,
          type: "textarea",
          disabled: true,
          placeholder: "",
          model: ""
        };
      }
    }
  },

  data() {
    return {
      // 控制弹出框显示
      dialogTableVisible: false,
      // 是否加载
      loading: false,
      // 表格数据
      tableData: [],
      // 表格表头
      tableTitle: [],
      // 当前页数
      currentPage: 1,
      // 每页展示的数量
      pageSize: 10,
      // 总数
      total: 0,
      // 多选
      multipleSelection: [],
      // 底部信息
      footInfo: "",
      // 按钮配置
      editButtonClass: [],
      clickEditBtnObj: "", //临时记录抽象列中的元素
      index_: 0,
      row_: null
    };
  },
  watch: {
    TableDigVisible(newVal) {
      this.dialogTableVisible = newVal;
    },
    TableTitle: {
      handler(newVal) {
        this.tableTitle = newVal;
      },
      deep: true,
      immediate: true
    },
    TableData: {
      handler(newVal) {
        this.tableData = newVal;
        // 初始化多选值
        setTimeout(() => {
          if (newVal) {
            this.tableData.forEach(row => {
              if (!!row[this.TableDigCheckBoxKey]) {
                this.$refs[this.TableDigId].toggleRowSelection(row, true);
              }
            });
          }
        }, 0);
      },
      deep: true,
      immediate: true
    },
    TableDigLoading: {
      handler(newVal) {
        this.loading = newVal;
      },
      immediate: true
    },
    TableDigPage: {
      handler(newVal) {
        this.currentPage = newVal.currentPage;
        this.pageSize = newVal.pageSize;
        this.total = newVal.total;
      },
      immediate: true,
      deep: true
    },
    TableDigShowCheckBox: {
      handler(newVal, oldv) {},
      immediate: true
    },
    TableDigFootInfo: {
      handler(newVal) {
        this.footInfo = newVal.model;
      },
      deep: true
    }
  },
  methods: {
    // 提交
    submitBtn(edit) {
      if (edit.cb) {
        edit.cb({
          multipleSelection: this.multipleSelection,
          FootInfo: this.footInfo,
          TableTitle: this.tableTitle,
          TableData: this.tableData
        });
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    // 关闭弹出框
    close() {
      this.$emit("editBtnCb", {
        label: "close",
        close: this.dialogTableVisible
      });
    },
    // 头部操作
    headerBtn(btnObj) {
      if (btnObj.cb) {
        btnObj.cb(this.form);
        this.dialogTableVisible = false;
      } else {
        console.error("按钮配置中缺少回调函数(cb)");
      }
    },
    // 自动更改序号
    TindexFn(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 改变每页显示的条数
    TChangePageSizeFn(size) {
      this.$emit("changePage", {
        pageSize: size,
        currentPage: this.currentPage
      });
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击页码
    TChangeCurrentFn(currentPage) {
      this.$emit("changePage", {
        pageSize: this.pageSize,
        currentPage: currentPage
      });
    },
    // TODO 编辑列按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "";
      //   this.TEdit.editTypes.forEach((element, index) => {
      //     if (item.label === element.label) {
      //       BtnClass = element.css || "";
      //       return;
      //     } else {
      //       return BtnClass;
      //     }
      //   });

      return BtnClass;
    },
    // 抽象列操作
    TEditFn(editItem) {
      this.index_ += 1;
      this.clickEditBtnObj = editItem;
      if (!editItem.pass) {
        if (editItem.label === "删除") {
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$emit("editBtnCb", editItem, this.TId, this.row_);
            })
            .catch(() => {});
          return;
        }
      }
    },
    // 标记平均值
    TMarkAverageFn({ row, rowIndex }) {
      //   if (
      //     (row.countName === "平均值" ||
      //       row.countName === "平均数" ||
      //       row.col_1 === "平均数" ||
      //       row.groupTime === "平均值") &&
      //     this.isNeedOtherData
      //   ) {
      //     return "average-row";
      //   }
      //   return "";
    },
    // 标记表格中的最大值最小值 以及 可点击的值
    TMarkMinMaxLinkFn({ row, column, rowIndex, columnIndex }) {
      let clickCell = column.property || "";
      if (clickCell) {
        if (this.TClickItem.length) {
          let linkArr = [];
          let sign = "";
          for (let index = 0; index < this.TClickItem.length; index++) {
            if (
              this.TClickItem[index].cells &&
              this.TClickItem[index].cells.length
            ) {
              if (this.TClickItem[index].cells.includes(clickCell)) {
                // TODO 判断点击类型
                if (this.TClickItem[index].type === "dialog") {
                  sign = "clickStyle-dialog";
                } else if (this.TClickItem[index].link) {
                  sign = "clickStyle";
                }
                return sign;
              }
            }
          }
        }
      }
    },
    // 总计
    TSumFn() {
      return [];
    },
    // 触发单元格事件
    TClickCells(row, column, cell, event) {
      // console.log(row, column, cell, event, "单元格事件");
      let colClink = column.property;
      //   中间件(中间控制层)
      let Callback_ = null;
      // 可点击的按钮(抽象列)
      //   console.log(this.clickEditBtnObj);
      if (this.clickEditBtnObj && this.clickEditBtnObj.link) {
        //   构建跳转对象
        let TClickItem_ = [
          {
            link: this.clickEditBtnObj.link,
            jump: this.clickEditBtnObj.jump || null
          }
        ];
        console.log(this.clickEditBtnObj);
        // 触发函数
        cellJump(
          this,
          {
            row,
            column,
            TClickItem: TClickItem_
          },
          Callback_
        );

        return;
      }
      // 获取可点击的行(元素)
      if (this.TClickItem.length) {
        if (!row[colClink]) return;
        for (let index = 0; index < this.TClickItem.length; index++) {
          // 判断是点击的类型
          if (
            this.TClickItem[index].type &&
            this.TClickItem[index].type === "dialog"
          ) {
            // 定义（回调）
            Callback_ = this.TClickItem[index]["cb"];
          }
          if (this.TClickItem[index].cells.length) {
            let clickItem_ = this.TClickItem[index].cells;
            for (let j = 0; j < clickItem_.length; j++) {
              if (colClink === clickItem_[j]) {
                // 触发函数
                cellJump(
                  this,
                  {
                    row,
                    column,
                    TClickItem: this.TClickItem
                  },
                  Callback_
                );
              }
            }
          }
        }
      }
    },
    TClickRowFn(row, column, event) {
      this.index_ += 1;
      if (this.index_ % 2 !== 0) {
        this.$emit("clickRow", { row, column, id: this.TId });
      } else {
        // 针对删除获取对应的行信息
        this.row_ = row;
        let column_ = Object.assign({}, column, this.clickEditBtnObj);
        // 获取编辑列指定按钮的行信息(代理)
        this.$emit("clickCell", { row, column: column_, id: this.TId });
      }
      this.index_ = 0;
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/config.scss";
.T-dialog {
  margin: 10px 0;
  /deep/ .el-table {
    th {
      background-color: $table_title_bg;
    }
    thead {
      color: $table_title_color;
    }
    // 可点击-跳转
    .clickStyle {
      text-decoration: underline;
      color: $table_link_color;
      cursor: pointer;
      &:hover {
        color: $table_link_color_hover;
      }
      //   弹出框
      &-dialog {
        color: $table_link_color;
        cursor: pointer;
        &:hover {
          color: $table_link_color_hover;
        }
      }
    }
  }
  //  分页
  .pagination {
    margin: 15px 0;
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
  //
  .foot-info {
    margin: 20px 5px 1px 5px;
    & > label {
      display: inline-block;
      line-height: 54px;
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
}
</style>