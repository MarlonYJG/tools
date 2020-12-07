<!--
 * @Author: zhangxd-i
 * @Date: 2019-08-23 15:48:36
 * @LastEditors: zhangxd-i
 * @LastEditTime: 2020-11-13 10:56:02
 * @Description: table组件
 -->
<template>
  <div class="own-table">
    <el-table
      style="width:100%"
      show-summary
      highlight-current-row
      v-loading="tableLoading"
      :data="tableData"
      :card="isCardTable"
      :border="isShowBorder"
      :summary-method="multistageTable"
      
      @sort-change="sortChange"
      @cell-click="clickCells"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isShowSelect" type="selection" width="55">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        width="60"
        align="center"
        :index="indexMethod"
        :fixed="isFixed">
      </el-table-column>
      <slot name="before"></slot>
      <template v-for="(column, index) in soltNameList">
        <el-table-column
          align="center"
          show-overflow-tooltip
          :key="column.label + index"
          :label="column.label"
          :prop="column.prop"
          :sort-method="column.sortByDate"
          :sortable="
            (isSort || sortProp.includes(column.prop)) &&
              (!column.child || column.child.length === 0)
          ">
          <template v-if="column.child">
            <el-table-column
              v-for="(child, index) in column.child"
              align="center"
              :key="index"
              :label="child.label"
              :prop="child.prop"
              show-overflow-tooltip
              :sortable="
                (isSort || sortProp.includes(child.prop)) &&
                  (!child.child || child.length === 0)
              "
            >
            </el-table-column>
          </template>
        </el-table-column>
      </template>
      <slot name="after"></slot>
    </el-table>
    <el-pagination
      v-if="isShowPage"
      style="text-align:center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pagination"
      :page-size="ownPageSize"
      layout="total, sizes, prev, pager, next, jumper"
      class="pagination"
      :total="totalPage"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    // 默认分页数
    pagination: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // table 加载
    tableLoading: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 列是否固定在左侧
    isFixed: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 表名
    tableName: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 个性名称
    soltName: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 表数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 自定义排序的列
    sortProp: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否 排序
    isSort: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否后端排序
    isDynamicSort: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 总计
    totalNum: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否显示分页
    isShowPage: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 总条数
    totalPage: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    // 可以点击的单元格
    clickTableItem: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 当前页
    pageNum: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    // 当前页显示条数
    pageSize: {
      type: Number,
      default: function() {
        return 20;
      }
    },
    // 是否显示多选
    isShowSelect: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否显示导出
    isShowExcel: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否显示border
    isShowBorder: {
      type: Boolean,
      default: false
    },
    // table 类型 是否为卡片形式
    isCardTable: {
      type: Boolean,
      default: true
    },
  },
  watch: {
    tableName(data) {
      // 添加 sort-method 方法 进行排序处理
      data.forEach(item => {
        item["sortByDate"] = function(a, b, type) {
          let prev = a[item.prop];
          let next = b[item.prop];
          if (prev && next) {
            if (type == 'asc') {
                  return prev - next;
              } else {
                  return next - prev
              }
          }
        };
      });
      this.tableName = data;
      this.filterItem();
    },
    pageNum(value) {
      this.currentPage = value;
    },
    pageSize(value) {
      this.ownPageSize = value;
    }
  },
  data() {
    return {
      soltNameList: [],
      currentPage: 1,
      ownPageSize: this.pageSize
    };
  },
  methods: {
    // 排序
    sortChange(data) {
      console.log(data)
      if (this.isDynamicSort) {
        let order = '';
        if(data.order === 'ascending') {
          order = 'ASC';
        }else if(data.order === 'descending') {
          order = 'DESC';
        }else {
          order = '';
        };
        this.$emit("sortChange", data.prop, order);
      }
    },
    filterItem() {
      if (this.soltName.length !== 0) {
        const newArr = this.tableName.filter(item => {
          return !this.soltName.includes(item.prop);
        });
        this.soltNameList = newArr;
      } else {
        this.soltNameList = this.tableName;
      }
    },
    // 全选
    handleSelectionChange(data) {
      this.$emit("selectionChange", data);
    },
    // 点击单元触发事件
    clickCells(row, column) {
      // console.log(row, column)
    },
    // 总计
    multistageTable() { return this.totalNum; },
    // 选择每页条数
    handleSizeChange(size) {
      this.ownPageSize = size;
      let tmpObj = {
        pageSize: this.ownPageSize,
        currentPage: this.currentPage
      };
      this.$emit("changePage", tmpObj);
    },
    // 切换页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      let tmpObj = {
        pageSize: this.ownPageSize,
        currentPage: this.currentPage
      };
      this.$emit("changePage", tmpObj);
    },
    // table 序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.ownPageSize + index + 1;
    },
    // 导出 excel
    exportEx() {
      this.$emit("exportEx");
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
