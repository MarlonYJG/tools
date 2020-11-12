<!--
 * @Author: Marlon
 * @Date: 2020-02-18 21:59:18
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-13 14:49:24
 * @Description: 表格组件
 -->
 <template>
  <div class="T-table">
    <el-table
      style="width: 100%"
      tooltip-effect="dark"
      row-key="tid"
      :height="THeight ? THeight : null"
      :max-height="TMaxHeight ? TMaxHeight : null"
      :ref="TId"
      :id="TId"
      :border="TBorder"
      v-loading="TLoading"
      :data="TData"
      :row-class-name="TMarkAverageFn"
      :cell-class-name="TMarkMinMaxLinkFn"
      :default-sort="TSort.default"
      :show-summary="TShowSummary.show"
      :summary-method="TShowSummary.type === 'auto' ? null : TShowSummary.sumFn"
      @selection-change="handleSelectionChange"
      @cell-click="TClickCells"
      @row-click="TClickRowFn"
      @sort-change="TSortChange"
    >
      <!-- 多级表头 -->
      <template v-if="TMultiLevelHeader">
        <!-- 多选 -->
        <el-table-column
          v-if="TIsShowCheckBox"
          type="selection"
          :width="TIsShowCheckBoxFixed.width"
          :fixed="TIsShowCheckBoxFixed.fixed"
        ></el-table-column>
        <!-- 序号 -->
        <el-table-column
          v-if="TIsShowIndex.show"
          label="序号"
          type="index"
          :index="TindexFn"
          width="50"
          align="center"
          :fixed="TIsShowIndex.fixed"
        ></el-table-column>
        <template v-for="(column, index) in tableTitle">
          <el-table-column
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="TOverflowTooltip"
            :sortable="column.sortable || null"
            :sort-method="column.sortMethod || null"
            :align="
              TAlign.length
                ? TAlign[0].item.includes(column.prop)
                  ? TAlign[0].key
                  : 'center'
                : 'center'
            "
          >
            <template v-if="column.child && column.child.length">
              <el-table-column
                v-for="(item, index_) in column.child"
                :key="index_"
                :prop="item.prop"
                :label="item.label"
                :align="
                  TAlign.length
                    ? TAlign[0].item.includes(item.prop)
                      ? TAlign[0].key
                      : 'center'
                    : 'center'
                "
              >
                <template v-if="item.child && item.child.length">
                  <el-table-column
                    v-for="(item__, index__) in item.child"
                    :key="index__"
                    :prop="item__.prop"
                    :label="item__.label"
                    :align="
                      TAlign.length
                        ? TAlign[0].item.includes(item__.prop)
                          ? TAlign[0].key
                          : 'center'
                        : 'center'
                    "
                  >
                    <template v-if="item__.child && item__.child.length">
                      <el-table-column
                        v-for="(item___, index___) in item__.child"
                        :key="index___"
                        :prop="item___.prop"
                        :label="item___.label"
                        :align="
                          TAlign.length
                            ? TAlign[0].item.includes(item___.prop)
                              ? TAlign[0].key
                              : 'center'
                            : 'center'
                        "
                      >
                      </el-table-column>
                    </template>
                  </el-table-column>
                </template>
              </el-table-column>
            </template>
          </el-table-column>
        </template>
      </template>
      <!-- 普通表头 -->
      <template v-else>
        <!-- 多选 -->
        <el-table-column
          v-if="TIsShowCheckBox"
          type="selection"
          :width="TIsShowCheckBoxFixed.width"
          :fixed="TIsShowCheckBoxFixed.fixed"
        ></el-table-column>
        <!-- 序号 -->
        <el-table-column
          v-if="TIsShowIndex.show"
          label="序号"
          type="index"
          :index="TindexFn"
          width="50"
          align="center"
          :fixed="TIsShowIndex.fixed"
        ></el-table-column>
        <!-- 数据 -->
        <template v-for="(column, index) in tableTitle">
          <!-- 编辑数据集名称 -->
          <el-table-column
            align="center"
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="TOverflowTooltip"
            :sortable="column.sortable || null"
            :sort-method="column.sortMethod || null"
            v-if="column.prop === dataSetName && isDataSetEdit"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.dataSetName"></el-input>
            </template>
          </el-table-column>
          <!-- 编辑备注 -->
          <el-table-column
            align="center"
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="TOverflowTooltip"
            :sortable="column.sortable || null"
            :sort-method="column.sortMethod || null"
            v-else-if="column.prop === remark && isRemarkEdit"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark"></el-input>
            </template>
          </el-table-column>
          <!-- 自定义列类型(类) -->
          <el-table-column
            v-else-if="colunmFieldFn(column)"
            :align="
              TAlign.length
                ? TAlign[0].item.includes(column.prop)
                  ? TAlign[0].key
                  : 'center'
                : 'center'
            "
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="TOverflowTooltip"
            :sortable="column.sortable || null"
            :sort-method="column.sortMethod || null"
            :fixed="column.fixed || null"
          >
            <template slot-scope="scope">
              <!-- 下拉 -->
              <el-select
                v-if="columnContentType(scope, (type = 'select'), column)"
                v-model="scope.row[column.prop]"
                size="mini"
                filterable
                @change="cellTypeChange(column, scope.row)"
              >
                <el-option
                  v-for="item__ in column.randerOption"
                  :key="item__.value"
                  :label="item__.label"
                  :value="item__.value"
                ></el-option>
              </el-select>
              <!-- 输入框 -->
              <el-input
                v-if="columnContentType(scope, (type = 'input'), column)"
                v-model="scope.row[column.prop]"
                placeholder
                size="mini"
                @change="cellTypeChange(column, scope.row)"
              ></el-input>
              <!-- 弹出框提示 -->
              <el-popover
                v-if="columnContentType(scope, (type = 'popover'), column)"
                trigger="hover"
                placement="bottom"
                size="mini"
                popper-class="table-porper"
              >
                <p v-for="(item__, index_) in column.popoverArr" :key="index_">
                  {{ item__.labelProp }}{{ scope.row[item__.valueProp] }}
                </p>
                <div slot="reference" class="name-wrapper">
                  <span>{{ scope.row[column.prop] }}</span>
                </div>
              </el-popover>
              <!-- 文字提示 -->
            </template>
          </el-table-column>

          <!-- 其他 -->
          <el-table-column
            :align="
              TAlign.length
                ? TAlign[0].item.includes(column.prop)
                  ? TAlign[0].key
                  : 'center'
                : 'center'
            "
            :key="index"
            :label="column.label"
            :prop="column.prop"
            :show-overflow-tooltip="TOverflowTooltip"
            :sortable="column.sortable || null"
            :sort-method="column.sortMethod || null"
            :fixed="column.fixed || null"
            v-else
          >
            <template v-if="column.child">
              <el-table-column
                v-for="(child, indexs) in column.child"
                align="center"
                :key="indexs"
                :label="child.label"
                :prop="child.prop"
                :show-overflow-tooltip="TOverflowTooltip"
                :sortable="child.sortable || null"
              ></el-table-column>
            </template>
          </el-table-column>
        </template>
        <!-- 末尾操作(插槽方式) -->
        <el-table-column
          :label="TEdit.title"
          :width="TEdit.width || null"
          :fixed="TEdit.fixed || null"
          align="center"
          v-if="
            TEdit.show && TEdit.slot && TEdit.type && TEdit.type === 'popover'
          "
        >
          <!-- popover -->
          <template slot-scope="scope">
            <template v-for="(item_, i) in scope.row.edit.editTypes">
              <!-- 自定义方式(popover) -->
              <el-button
                v-if="item_.select && item_.select.length"
                :key="i"
                size="mini"
                :type="editButtonClassFn(item_)"
                :class="editButtonClassFn(item_)"
              >
                <el-popover
                  trigger="hover"
                  placement="bottom"
                  popper-class="table_custom_edit_popover"
                >
                  <ul class="popover-list">
                    <li
                      v-for="(item__, index_) in item_.select"
                      :key="index_"
                      @click="TEditFn(item__, scope.row)"
                    >
                      {{ item__.label }}
                    </li>
                  </ul>
                  <div slot="reference">
                    <span>
                      {{ item_.label }}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                  </div>
                </el-popover>
              </el-button>
              <!-- 非自定义方式 -->
              <el-button
                v-else
                :key="i"
                size="mini"
                :type="editButtonClassFn(item_)"
                :class="editButtonClassFn(item_)"
                @click="TEditFn(item_)"
                >{{ item_.label }}</el-button
              >
            </template>
          </template>
        </el-table-column>
        <el-table-column
          :label="TEdit.title"
          :width="TEdit.width || null"
          :fixed="TEdit.fixed || null"
          align="center"
          v-else-if="
            TEdit.show && TEdit.slot && TEdit.type && TEdit.type === 'switch'
          "
        >
          <!-- 开关 -->
          <template slot-scope="scope">
            <template v-for="(item_, index_) in scope.row.edit.editTypes">
              <el-switch
                :key="index_"
                v-model="item_.value"
                active-text="开启"
                active-color="#13ce66"
                inactive-text="禁用"
                @change="TEditFn(item_, scope.row)"
              ></el-switch>
            </template>
          </template>
        </el-table-column>
        <!-- 末尾操作(默认方式) -->
        <el-table-column
          v-else-if="TEdit.show"
          :label="TEdit.title"
          :width="TEdit.width || null"
          :fixed="TEdit.fixed || null"
          align="center"
        >
          <template v-for="(item, index) in TEdit.editTypes">
            <el-button
              :key="index"
              size="mini"
              :type="editButtonClassFn(item)"
              :class="editButtonClassFn(item)"
              @click="TEditFn(item)"
              >{{ item.label }}</el-button
            >
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="TIsShowPage"
      style="text-align: center"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      :current-page="currentPage"
      :page-sizes="pageSizeArr"
      :page-size="pageSize"
      :total="TTotal"
      @size-change="TChangePageSizeFn"
      @current-change="TChangeCurrentFn"
    ></el-pagination>
  </div>
</template>
 
 <script>
import Sortable from "sortablejs";
import { cellJump } from "utils/jump";
export default {
  props: {
    //  表格的id
    TId: {
      type: String,
      default: "",
    },
    // 是否加载
    TLoading: {
      type: Boolean,
      default: false,
    },
    // 表格标题
    TTitle: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 表格数据
    TData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 是否显示序号
    TIsShowIndex: {
      type: Object,
      default: function () {
        return {
          show: true,
          fixed: "left",
        };
      },
    },
    // 是否排序(默认列)
    TSort: {
      type: Object,
      default: function () {
        return {
          default: {
            prop: "date",
            order: "descending", // order: ascending, descending
          },
          sortArr: [],
        };
      },
    },
    // 是否显示分页
    TIsShowPage: {
      type: Boolean,
      default: false,
    },
    // 总条数
    TTotal: {
      type: Number,
      default: 0,
    },
    // 当前页
    TCurrentPage: {
      type: Number,
      default: 1,
    },
    // 当前页显示条数
    TPageSize: {
      type: Number,
      default: 10,
    },
    // 是否显示网格
    TBorder: {
      type: Boolean,
      default: true,
    },
    // 流体高度
    TMaxHeight: {
      type: Number,
      default: 0,
    },
    // 固定表头
    THeight: {
      type: Number,
      default: 0,
    },
    // 是否显示多选
    TIsShowCheckBox: {
      type: Boolean,
      default: false,
    },
    //
    TIsShowCheckBoxFixed: {
      type: Object,
      default: function () {
        return {
          // fixed: true,
          width: "45",
        };
      },
    },
    // 接收多选初始值
    TMultipleSelection: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 超出时是否需要提示
    TOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    // 是否显示编辑
    TEdit: {
      type: Object,
      default: function () {
        return {
          show: false,
          title: "操作",
          editTypes: [
            {
              label: "编辑",
              css: "",
              property: "",
              pass: true, // true：一级拦截(默认) false:二级拦截
            },
            {
              label: "删除",
              css: "",
              property: "",
              pass: true,
            },
          ],
        };
      },
    },
    // 可点击的单元格
    TClickItem: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 总计
    TShowSummary: {
      type: Object,
      default: function () {
        return {
          show: false,
          type: "auto",
          sumFn: function () {
            return [];
          },
        };
      },
    },
    // 备注 是否可编辑——TODO
    isRemarkEdit: {
      type: Boolean,
      default: false,
    },
    // 数据集名称 是否可编辑 TODO
    isDataSetEdit: {
      type: Boolean,
      default: false,
    },
    // 表格文字位置
    TAlign: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 识别行的唯一标识
    TRowKey: {
      type: [Number, String],
      default: "",
    },
    // 激活的当前行
    TActiveRow: {
      type: [Number, String, Boolean, Array],
      default: false,
    },
    // 是否启动行拖拽
    TRowDrop: {
      type: Boolean,
      default: false,
    },
    // 自定义【10，20】
    TpageSizeArr: {
      type: Array,
      default: function () {
        return [10, 20];
      },
    },
    // 标记综合风险度颜色
    isShowClass: {
      type: Object,
      default: function () {
        return {
          type: "",
          prop: "",
        };
      },
    },
    // 是否启动多级表头
    TMultiLevelHeader: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Sortable,
  },
  data() {
    return {
      currentPage: 1, // 当前页
      pageSize: 10, // 当前分页数
      editButtonClass: [],
      clickEditBtnObj: "", //临时记录抽象列中的元素
      // 表格标题
      tableTitle: [],
      index_: 0,
      row_: null,
      dataSetName: "dataSetName",
      remark: "remark",
      pageSizeArr: [10, 20],
    };
  },
  watch: {
    TData: {
      handler(newVal) {
        let sortDefaultProp = this.TSort.default.prop;
        let sortArr = [];
        this.pageSizeArr = this.TpageSizeArr;
        this.currentPage = this.TCurrentPage;
        this.pageSize = this.TPageSize;

        if (this.TSort.sortArr && this.TSort.sortArr.length) {
          sortArr = this.TSort.sortArr;
        }
        this.tableTitle = this.TTitle;
        if (this.tableTitle.length) {
          this.tableTitle.forEach((item) => {
            // 启动默认排序
            if (item.prop === sortDefaultProp) {
              item["sortable"] = true;
            }
            // 后端排序
            if (sortArr.length) {
              sortArr.forEach((ele) => {
                if (ele.prop === item.prop) {
                  item["sortable"] = true;
                  // 后端排序
                  if (ele.order === "custom") {
                    if (!this.$listeners.TSortChange) {
                      console.error("缺少后端排序事件：TSortChange");
                    }
                  }
                }
              });
            }
          });
        }
        if (this.TRowDrop) {
          this.rowDrop();
        }
      },
      deep: true,
      immediate: true,
    },
    TIsShowPage: {
      handler(newVal) {
        if (newVal && !this.$listeners.changePage) {
          console.error(
            "缺少分页事件：changePage",
            "TTotal",
            "TCurrentPage",
            "TPageSize"
          );
        }
      },
      immediate: true,
    },
    TEdit: {
      handler(newVal) {
        if (newVal && newVal.show) {
          if (!this.$listeners.clickCell) {
            console.error("缺少单元格事件：clickCell");
          }
        }
      },
    },
    TMultipleSelection: {
      handler(newVal) {
        if (newVal && newVal.length) {
          setTimeout(() => {
            newVal.forEach((row) => {
              if (this.$refs[this.TId]) {
                this.$refs[this.TId].toggleRowSelection(row);
              }
            });
          }, 0);
        } else {
          this.$refs[this.TId].clearSelection();
        }
      },
      // deep: true
    },
    TCurrentPage(newVal) {
      this.currentPage = newVal;
    },
    TPageSize(newVal) {
      this.pageSize = newVal;
    },
  },
  methods: {
    // 改变每页显示的条数
    TChangePageSizeFn(size) {
      this.$emit("changePage", {
        pageSize: size,
        currentPage: this.currentPage,
      });
    },
    // 点击页码
    TChangeCurrentFn(currentPage) {
      this.$emit("changePage", {
        pageSize: this.pageSize,
        currentPage: currentPage,
      });
    },
    // 多选
    handleSelectionChange(selectionArr, type = "checkbox") {
      this.$emit("handleSelectionChange", type, selectionArr);
    },
    // 行样式：行标记
    TMarkAverageFn({ row, rowIndex }) {
      if (typeof this.TActiveRow === "boolean") {
        return "";
      } else if (Array.isArray(this.TActiveRow)) {
        // 特殊行标识
        for (let index = 0; index < this.TActiveRow.length; index++) {
          if (
            row[this.TActiveRow[index].prop] === this.TActiveRow[index].value
          ) {
            return `active-${this.TActiveRow[index].color}`;
          }
        }
      } else {
        if (this.TActiveRow === row[this.TRowKey]) {
          return "active-row";
        }
        return "";
      }

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
    // 单元格：标记表格中的最大值最小值 以及 可点击的值
    TMarkMinMaxLinkFn({ row, column, rowIndex, columnIndex }) {
      let clickCell = column.property || "";
      // 标记-显示弹框及可跳转的
      if (clickCell) {
        if (this.TClickItem.length) {
          let linkArr = [];
          let sign = "";
          for (let index = 0; index < this.TClickItem.length; index++) {
            if (
              this.TClickItem[index].cells &&
              this.TClickItem[index].cells.length
            ) {
              /* 列中的特殊值标识 */
              if ("columnSpecialValue" === this.TClickItem[index].type) {
                let cells_ = this.TClickItem[index].cells || [];
                for (let i = 0; i < cells_.length; i++) {
                  if (cells_[i].prop === clickCell) {
                    if (
                      cells_[i].min &&
                      row[cells_[i].prop] === cells_[i].min.value
                    ) {
                      // 列中的最小值
                      sign = `clickStyle-${cells_[i].min.color}`;
                    } else if (
                      cells_[i].max &&
                      row[cells_[i].prop] === cells_[i].max.value
                    ) {
                      // 列中的最大值
                      sign = `clickStyle-${cells_[i].max.color}`;
                    } else if (
                      cells_[i].svg &&
                      row[cells_[i].prop] === cells_[i].svg.value
                    ) {
                      //TODO 列中的平均值
                    }
                  }
                }
                return sign;
              } else if (this.TClickItem[index].cells.includes(clickCell)) {
                /* 整列标识 */
                // TODO 待优化-先判断类型type
                if (this.TClickItem[index].type === "dialog") {
                  sign = "clickStyle-dialog";
                } else if (
                  this.TClickItem[index].type === "specialValue-dialog"
                ) {
                  sign = `clickStyle-${this.TClickItem[index].color}`;
                } else if (this.TClickItem[index].link) {
                  sign = "clickStyle";
                }
                return sign;
              }
            }
          }
        }

        // 综合风险度颜色
        if (this.isShowClass.prop && this.isShowClass.prop == clickCell) {
          if (this.isShowClass.type == "showStyle") {
            // 80(含)-100分 red      60(含)-80分  orange
            // 40(含)-60分  orchid   20(含)-40分  blue
            // 0(含)-20分   green
            if (row.hasOwnProperty("color") && row.color) {
              return row.color;
            } else {
              return "";
            }
          }
        }
      }
    },
    // 总计
    multistageTable() {
      return this.totalNum;
    },
    // 自动更改序号
    TindexFn(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    },
    // 编辑列按钮颜色配置
    editButtonClassFn(item) {
      let BtnClass = "text";
      this.TEdit.editTypes.forEach((element, index) => {
        if (item.label === element.label) {
          // BtnClass = element.css || "";
          return;
        } else {
          return BtnClass;
        }
      });
      return BtnClass;
    },
    // 编辑列操作
    TEditFn(editItem, row) {
      this.index_ += 1;
      this.clickEditBtnObj = editItem;
      if (!editItem.pass) {
        if (editItem.label === "删除") {
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.$emit("editBtnCb", editItem, this.TId, this.row_);
            })
            .catch(() => {});
          return;
        }
      }
      if (row && Object.keys(row).length) {
        this.index_ += 1;
        this.$emit("clickCell", { row, column: editItem, id: this.TId });
      }
    },
    // 触发单元格事件
    TClickCells(row, column, cell, event) {
      // console.log(row, column, cell, event, "单元格事件");
      let colClink = column.property;
      //   中间件(中间控制层)
      let Callback_ = null;
      // 可点击的按钮(抽象列)
      if (this.clickEditBtnObj && this.clickEditBtnObj.link) {
        //   构建跳转对象
        let TClickItem_ = [
          {
            link: this.clickEditBtnObj.link,
            jump: this.clickEditBtnObj.jump || null,
          },
        ];
        console.log(this.clickEditBtnObj);
        // 触发函数
        cellJump(
          this,
          {
            row,
            column,
            TClickItem: TClickItem_,
          },
          Callback_
        );

        return;
      }
      // 获取可点击的行(元素)
      if (this.TClickItem.length) {
        for (let index = 0; index < this.TClickItem.length; index++) {
          // 判断是点击的类型
          if (
            this.TClickItem[index].type &&
            this.TClickItem[index].type === "dialog"
          ) {
            // 定义（回调）
            Callback_ = this.TClickItem[index]["cb"];
          }

          // 特殊值的点击-弹框
          if (
            this.TClickItem[index].type &&
            this.TClickItem[index].type === "specialValue-dialog"
          ) {
            if (this.TClickItem[index].cb) {
              this.TClickItem[index]["cb"]({ row, column, cell, event });
            }
            return;
          }

          // 跳转一站式或者历史交易回溯
          if (
            this.TClickItem[index].type &&
            this.TClickItem[index].type === "jumpOneCardOrHistory"
          ) {
            this.$emit("jumpOneCardOrHistory", {
              row,
              column,
            });
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
                    TClickItem: this.TClickItem,
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
        // console.log("行事件", row, column);
        this.$emit("clickRow", { row, column, id: this.TId });
      } else {
        // 针对删除获取对应的行信息
        this.row_ = row;
        let column_ = Object.assign({}, column, this.clickEditBtnObj);
        // 获取编辑列指定按钮的行信息(代理)
        console.log("单元格事件", row, column);
        this.$emit("clickCell", { row, column: column_, id: this.TId });
      }
      this.index_ = 0;
    },
    // 启动 后端排序
    TSortChange({ column, prop, order }) {
      if (this.TSort.sortArr && this.TSort.sortArr.length) {
        this.TSort.sortArr.forEach((item) => {
          if (item.order === "custom" && prop === item.prop) {
            if (this.$listeners.TSortChange) {
              this.$emit("TSortChange", { column, prop, order });
            }
          }
        });
      }
    },
    // 启动 自定义排序
    sortMethod(a, b) {
      // console.log(this.$listeners)
    },
    // 自定义列类型值发生变化
    cellTypeChange(column, row) {
      this.$emit("cellTypeChange", { column, row });
    },
    // 确定哪些列是可自定义类型的列(抽象为同一类)
    colunmFieldFn(column) {
      let returnIsTrue = false;
      this.$emit("columnContentType", "propsType", { column }, function (
        isTrue
      ) {
        returnIsTrue = isTrue;
      });
      return returnIsTrue;
    },
    // 确定可自定义列的内容的渲染类型
    columnContentType(scope, type, column) {
      let returnIsTrue = false;
      this.$emit(
        "columnContentType",
        "propItemType",
        { scope, type, column },
        function (isTrue) {
          returnIsTrue = isTrue;
        }
      );
      return returnIsTrue;
    },
    // 行拖拽
    rowDrop() {
      setTimeout(() => {
        let tbody = document.querySelectorAll(`#${this.TId} tbody`);
        let el = "";
        if (tbody.length) {
          el = tbody[0];
        }
        this.$emit("rowDrop", { $el: el });
      }, 0);
    },
  },
};
</script>
 
<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.T-table {
  margin: 10px 0;
  //   .el-button:focus,
  //   .el-button:hover {
  //     color: #01c1df;
  //     border-color: #01c1df;
  //     background-color: rgba(1, 193, 223, 0.1);
  //   }
  /deep/ .el-table {
    th {
      background-color: $table_title_bg;
      height: 40px !important;
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
      // 特殊值
      &-red {
        color: $table_mark_color;
        cursor: pointer;
        text-decoration: underline;
      }
      // 最小值
      &-min {
        color: $table_column_min;
      }
      // 最大值
      &-max {
        color: $table_column_max;
      }
    }
    // 跳转一站式And历史回溯页面
    .mainStyle {
      color: $main_default_cg;
      cursor: pointer;
      &:hover {
        color: $main_hover_cg;
      }
    }
    // 风险度颜色Tootip
    .red {
      color: $table_100_cg;
      font-weight: bold;
    }
    .orange {
      color: $table_80_cg;
      font-weight: bold;
    }
    .orchid {
      color: $table_60_cg;
      font-weight: bold;
    }
    .blue {
      color: $table_40_cg;
      font-weight: bold;
    }
    .green {
      color: $table_0_cg;
      font-weight: bold;
    }
    // 样式1
    .text {
      color: #1890ff;
      cursor: pointer;
      &:hover {
        color: rgb(0, 204, 204);
      }
    }
    /* 行标记 */
    .active {
      // 激活当前行
      &-row {
        background: $table_row_active;
      }
      &-mark {
        background: $table_row_mark;
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
  /deep/ .el-table--enable-row-transition .el-table__body td {
    height: 45px;
  }
}
</style>
