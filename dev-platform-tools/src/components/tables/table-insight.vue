<!--
 * @Author: yangjianguo
 * @Date: 2019-08-23 15:48:36
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-10-30 14:37:45
 * @Description:
 -->
<template>
  <div class="own-table">
    <div v-if="isNeedTip">
      <div class="maximum" v-for="(item, index) in maximumData" :key="index">
        <p><span :style="{ background: item.color }"></span>{{ item.name }}</p>
      </div>
    </div>

    <div v-if="!isLimitHeigth">
      <el-table
        border
        style="width:100%"
        v-loading="tableLoading"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName"
        :summary-method="multistageTable"
        show-summary
        @sort-change="sortChange"
        @cell-click="clickCells"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="indexMethod"
          width="50"
          align="center"
        ></el-table-column>
        <template>
          <el-table-column
            align="center"
            :key="column.label"
            :label="column.label"
            :prop="column.prop"
            show-overflow-tooltip
            :sortable="
              (isSort || sortProp.includes(column.prop)) && (!column.child || column.child.length === 0)
            "
            v-for="column in tableName"
          >
            <template slot-scope="scope">
              <div v-if="percentage.includes(column.prop)">
                {{ scope.row[column.prop] }}%
              </div>
              <div v-else>{{scope.row[column.prop]}}</div>
            </template>
            <el-table-column
              v-if="column.child"
              align="center"
              v-for="child in column.child"
              :key="child.label"
              :label="child.label"
              :prop="child.prop"
              show-overflow-tooltip
              :sortable="(isSort || sortProp.includes(child.prop)) && (!child.child || child.length === 0)"
            >
              <template slot-scope="scope">
                {{ scope.row[child.prop]}}
              </template>
            </el-table-column>

          </el-table-column>
        </template>
        <el-table-column
          label="操作"
          prop="bidderName"
          align="center"
          v-if="isShowOperation"
        >
          <template slot-scope="scope">
            <p @click="lookDetails(scope.row)" class="operationItem">
              {{ operation[0] }}
            </p>
            <p @click="jumpPath1(scope.row)" class="operationItem">
              {{ operation[1] }}
            </p>
            <p @click="jumpPath2(scope.row)" class="operationItem">
              {{ operation[2] }}
            </p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="bidderName"
          align="center"
          v-if="lookOver"
        >
          <template slot-scope="scope">
            <p @click="lookDetails(scope.row)" class="operationItem">查看</p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="isShowPage"
        style="text-align:center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :total="totalPage"
      ></el-pagination>
    </div>
    <div v-else>
      <el-table
        border
        :height="tableHight"
        v-loading="tableLoading"
        :data="tableData"
        :row-class-name="tableRowClassName"
        :cell-class-name="tableCellClassName"
        :summary-method="multistageTable"
        show-summary
        @cell-click="clickCells"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="indexMethod"
          width="50"
          align="center"
        ></el-table-column>
        <template>
          <el-table-column
            align="center"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            show-overflow-tooltip
            :sortable="isSort"
            v-for="column in tableName"
          >
            <el-table-column
              v-if="column.child"
              align="center"
              v-for="child in column.child"
              :key="child.prop"
              :label="child.label"
              :prop="child.prop"
              show-overflow-tooltip
              :sortable="isSort"
            >
            </el-table-column>
          </el-table-column>
        </template>
        <el-table-column
          label="操作"
          prop="bidderName"
          align="center"
          v-if="isShowOperation"
        >
          <template slot-scope="scope">
            <p @click="lookDetails(scope.row)" class="operationItem">
              {{ operation[0] }}
            </p>
            <p @click="jumpPath1(scope.row)" class="operationItem">
              {{ operation[1] }}
            </p>
            <p @click="jumpPath2(scope.row)" class="operationItem">
              {{ operation[2] }}
            </p>
          </template>
        </el-table-column>
      </el-table>
      <p v-if="isNeedTip">
        （备注：蓝色标注字体为交易最小值，紫色标注字体为最大值。）
      </p>
      <el-pagination
        v-if="isShowPage"
        style="text-align:center;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
        :total="totalPage"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { formatTime, thousandFormat } from "@/utils/filters";
import { mapGetters } from "vuex";
export default {
  props: {
    // 是否需要 查看操作
    lookOver: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // table 加载
    tableLoading: {
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
    // 是否需要限制高度
    isLimitHeigth: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 表数据
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    tableHight: {
      type: Number,
      default: 0
    },
    // 需要加百分%
    percentage: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 总计
    totalNum: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 操作信息
    operation: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 是否显示操作
    isShowOperation: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否需要底部提示
    isNeedTip: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 是否需要 平均值，最大小值，总计
    isNeedOtherData: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 是否显示分页
    isShowPage: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    // 是否 排序
    isSort: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    // 是否后端排序
    isDynamicSort: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    sortProp: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 总条数
    totalPage: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    // 当前页
    fatherCurrentPage: {
      type: Number,
      default: function() {
        return 1;
      }
    },
    // 当前页显示条数
    fatherSize: {
      type: Number,
      default: function() {
        return 10;
      }
    },
    // 可以点击的单元格
    clickTableItem: {
      type: Array,
      default: function() {
        return [];
      }
    },
    // 时间类型
    dateType: {
      type: String,
      default: ""
    },
    // 时间字段名
    timeName: {
      type: String,
      default: ""
    },
    // 是否可以跳转其他页面
    isJumpOtherPage: {
      type: Boolean,
      default: false
    },
    // 模块名
    modeName: {
      type: String,
      default: ""
    },
    // 给 handleEvent/handleJumpEvent 添加参数，区别不同的table
    tableType: {
      type: String,
      default: ""
    }
  },
  computed: {
    //获取用户的权限
    ...mapGetters(["permissions"])
  },
  watch: {
    tableData(data) {
      // 格式化时间
      if (this.timeName === "") return;
      formatTime(data, this.timeName, this.dateType);
    },
    fatherCurrentPage(value) {
      this.currentPage = value;
    },
    fatherSize(value) {
      this.pageSize = value;
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      formatData: [],
      maximumData: [
        { name: "平均值", color: "#FAD9D9" },
        { name: "最小值", color: "#D9EDFA" },
        { name: "最大值", color: "#EED9FA" }
      ]
    };
  },
  methods: {
    // 点击单元触发事件
    // clickCells(row, column) {
    //   console.log('触犯了')
    //   //不触发平均值的下钻
    //   if(row.countName === "平均值" || row.countName === "平均数" || row.col_1 === "平均数" || row.groupTime === "平均值") return
    //   let permissions = this.permissions;
    //   let currProperty = column.property;
    //   if (this.clickTableItem.length !== 0) {
    //     console.log(344433)
    //     let clickTableItem = this.clickTableItem;
    //     //单元格为空不做跳转
    //     if(row[currProperty]==='') return
    //     console.log('isJumpOtherPage',this.isJumpOtherPage)
    //     console.log(currProperty)
    //     for (let item of clickTableItem) {
    //       console.log()
    //       console.log(currProperty === item)
    //       // 是否触发 跳转其他页面 && permissions.includes('jysdsj_jump_card') && permissions.includes('jysdsj_jump_trade')
    //       if (
    //         currProperty === item &&
    //         this.isJumpOtherPage &&
    //           permissions.includes("jysdsj_jump_card") &&
    //           permissions.includes("jysdsj_jump_trade")
    //       ) {
    //         console.log(9999)
    //         this.$emit("handleJumpEvent", this.tableType, row, column);
    //         return;
    //       } else if (currProperty === item && !this.isJumpOtherPage) {
    //         console.log(888)
    //         this.$emit("handleEvent", this.tableType, row, column, currProperty);
    //         return;
    //       }
    //     }
    //   }
    // },
    clickCells(row, column) {
      console.log('0222')
      //不触发平均值的下钻
      if(row.countName === "平均值" || row.countName === "平均数" || row.col_1 === "平均数" || row.groupTime === "平均值") return
      let permissions = this.permissions;
      let currProperty = "";
      if(column.property.indexOf("_") !== -1 && this.modeName !== "activity") {
        currProperty = column.property.slice(0,column.property.indexOf("_"));
      } else {
        currProperty = column.property;
      }
      // currProperty = column.property;
      console.log(currProperty)
      if (this.clickTableItem.length !== 0) {
        let clickTableItem = this.clickTableItem;
        //单元格为空不做跳转
        if(row[currProperty]==='') return
        for (let item of clickTableItem) {
          // 是否触发 跳转其他页面 && permissions.includes('jysdsj_jump_card') && permissions.includes('jysdsj_jump_trade')
          if (
            currProperty === item &&
            this.isJumpOtherPage &&
              permissions.includes("jysdsj_jump_card") &&
              permissions.includes("jysdsj_jump_trade")
          ) {
            this.$emit("handleJumpEvent", this.tableType, row, column);
          } else if (currProperty === item && !this.isJumpOtherPage) {
            this.$emit("handleEvent", this.tableType, row, column, currProperty);
          }
        }
      }
    },
    // 操作项--查看详情
    lookDetails(data) {
      this.$emit("lookDetails", data);
    },
    // 操作项--跳转1
    jumpPath1(data) {
      this.$emit("jumpPath1", data);
    },
    // 操作项--跳转2
    jumpPath2(data) {
      this.$emit("jumpPath2", data);
    },
    // 排序
    sortChange(data) {
      if (this.isDynamicSort) {
        let order = data.order === "ascending" ? "asc" : "desc";
        this.$emit("sortChange", data.prop, order);
      }
    },
    // 标记平均值
    tableRowClassName({ row, rowIndex }) {
      if (
        (row.countName === "平均值" ||
          row.countName === "平均数" ||
          row.col_1 === "平均数" ||
          row.groupTime === "平均值") &&
        this.isNeedOtherData
      ) {
        return "average-row";
      }
      return "";
    },
    // 标记表格中的最大值最小值 以及 可点击的值
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      //不标记平均值
      if(row.countName === "平均值" || row.countName === "平均数" || row.col_1 === "平均数" || row.groupTime === "平均值") return
      if (column.property) {
        let currTableVal = column.property;
        let clickProperty = "";
        // 可点击
        if(column.property.indexOf("_") !== -1 && this.modeName === "activity") {
          clickProperty = column.property.slice(0,column.property.indexOf("_"));
        } else {
          clickProperty = column.property;
        }
        if (this.clickTableItem.includes(clickProperty) && this.modeName !== "activity") {
          let sign = ["clickStyle"];
          // 最大小值
          if (row.valueType && this.isNeedOtherData) {
            let test = row.valueType.split(",");
            for (let i of test) {
              if (currTableVal === i.slice(0, -4) && i.slice(-3) === "MAX") {
                sign.push('max-cell')

              } else if (
                currTableVal === i.slice(0, -4) &&
                i.slice(-3) === "MIN"
              ) {
                sign.push('min-cell');
              }
            }
          }
          sign = sign.join(" ");
          return sign
        }
        // 最大小值
        if (row.valueType && this.isNeedOtherData) {
          let test = row.valueType.split(",");
          for (let i of test) {
            if (currTableVal === i.slice(0, -4) && i.slice(-3) === "MAX") {
              return "max-cell";
            } else if (
              currTableVal === i.slice(0, -4) &&
              i.slice(-3) === "MIN"
            ) {
              return "min-cell";
            }
          }
        }

        // 针对活跃度模块 做的判断
        if (
          column.property &&
          row.provinceType &&
          row.provinceType !== "qtCity" &&
          (row.col_1 !== "省本级" || row.col_1 !=='本省市') &&
          (row.col_1 !== "市本级" || row.col_1 !=='外省市')
        ) {
          return "click-cell";
        }
      }
    },
    // 总计
    multistageTable() {
      var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
      let tmpTotalNum = [];
      for(let i = 0; i<this.totalNum.length; i++) {
        // 如果是数字 就进行千分位转化
        if(!reg.test(this.totalNum[i] && this.totalNum[i] !== '')) {
          tmpTotalNum.push(this.totalNum[i]);
        }else {
          tmpTotalNum.push(this.totalNum[i]);
        }
      }
      return tmpTotalNum;
    },
    // 选择每页条数
    handleSizeChange(size) {
      this.pageSize = size;
      let tmpObj = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.$emit("tableData", tmpObj);
    },
    // 切换页数
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      let tmpObj = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      };
      this.$emit("tableData", tmpObj);
    },
    // table 序号
    indexMethod(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.operationItem {
  color: #1890ff;
  cursor: pointer;
}
.maximum {
  display: inline-block;
  float: right;
  margin: 0 22px 16px 8px;
  > p {
    > span {
      display: inline-block;
      vertical-align: bottom;
      margin-right: 4px;
      width: 22px;
      height: 16px;
    }
  }
}
</style>
