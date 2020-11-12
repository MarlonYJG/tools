<!--
 * @Author: Marlon
 * @Date: 2020-07-21 14:25:13
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-21 17:03:07
 * @Description: 变更历史
--> 
<template>
  <div class="change-history">
    <ul class="select-list">
      <li>
        <span>粒度：</span>
        <el-select v-model="selectFrom.size" placeholder="请选择">
          <el-option
            v-for="item in sizeOptions"
            :key="item.key"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </li>
      <li>
        <span>时间范围：</span>
        <el-date-picker
          v-model="selectFrom.timeRange"
          type="datetimerange"
          align="right"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00', '08:00:00']"
        ></el-date-picker>
      </li>
      <li class="button">
        <el-button type="primary" @click="getList">查询</el-button>
      </li>
    </ul>
    <div class="log">
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
        @changePage="changePage"
      ></TableDefault>
    </div>
  </div>
</template>

<script>
import API from "api";
import mixin from "mixin";
import { ResDatas } from "utils/res-format";

export default {
  mixins: [mixin],
  props: {
    parId: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: []
        }
      ],
      TEdit: {
        show: false,
        slot: false,
        type: "popover",
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "查看详情",
            css: "success"
          }
        ]
      },
      tableTitle: [
        { label: "粒度", prop: "grainType" },
        { label: "操作", prop: "operationType" },
        { label: "内容", prop: "operationContent" },
        { label: "时间", prop: "createTime" },
        { label: "作者", prop: "operator" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      // 检索条件
      selectFrom: {
        size: "",
        timeRange: []
      },
      // 粒度
      sizeOptions: []
    };
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 根据粒度值获取粒度id
    getGrainIdByVal(grainVal) {
      if (this.sizeOptions && this.sizeOptions.length) {
        let target = this.sizeOptions.filter(item => item.name === grainVal);
        if (target && target.length) {
          return target[0].id;
        }
      }
    },
    // 时间戳转标准格式
    filterTime(timer) {
      const getZero = num => {
        // 单数前面加0
        if (parseInt(num) < 10) {
          num = "0" + num;
        }
        return num;
      };
      let date = new Date(timer),
        oYear = date.getFullYear(),
        oMonth = date.getMonth() + 1,
        oDay = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
      let oTime =
        oYear +
        "-" +
        getZero(oMonth) +
        "-" +
        getZero(oDay) +
        " " +
        getZero(h) +
        ":" +
        getZero(m) +
        ":" +
        getZero(s);

      return oTime;
    },

    /* 请求 */
    // 获取
    getList() {
      if (this.parId && this.parId.id) {
        let beginTime, endTime, selectFromSize;
        // 校验粒度
        if (this.selectFrom && this.selectFrom.size) {
          selectFromSize = this.selectFrom.size;
        } else {
          this.$message({
            message: "请选择粒度",
            type: "error"
          });
          return;
        }
        // 校验时间
        if (
          this.selectFrom["timeRange"] &&
          this.selectFrom["timeRange"].length
        ) {
          beginTime = this.filterTime(this.selectFrom["timeRange"][0]);
          endTime = this.filterTime(this.selectFrom["timeRange"][1]);
        } else {
          this.$message({
            message: "请选择时间范围",
            type: "error"
          });
          return;
        }

        let params = {
          areaId: this.parId.id,
          beginTime,
          endTime,
          grainType: this.getGrainIdByVal(selectFromSize),
          pageNum: this.TPage.index,
          pageSize: this.TPage.size
        };
        this.TLoading = true;
        API.operateHistory(params)
          .then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "totalCount"
                  // index: "pageNo"
                }
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, total, title } = Res.formatData();
              this.tableTitle = title;
              this.tableData = data;
              this.$set(this.TPage, `total`, total);
              // this.$set(this.TPage, `index`, index);
            } else {
              this.tableData = [];
              this.$set(this.TPage, `total`, 0);
              this.$set(this.TPage, `index`, 1);
            }
          })
          .catch(error => {
            this.TLoading = false;
          });
      }
    },
    // 获取粒度字典
    getAllGrainDic() {
      API.getAllGrain().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res) {
          this.sizeOptions = Res;
        } else {
          this.sizeOptions = [];
        }
      });
    }
  },
  mounted() {
    this.getAllGrainDic();
  }
};
</script>

<style lang="scss" scoped>
.change-history {
  width: 100%;
  height: calc(100% - 10px);
  padding-top: 10px;
  ul.select-list {
    width: 100%;
    height: 60px;
    position: relative;
    padding: 10px 0;
    box-sizing: border-box;
    overflow: hidden;
    li {
      float: left;
      padding-right: 20px;
      // &.button {
      //   position: absolute;
      //   top: 10px;
      //   right: 0;
      // }
    }
  }
  .log {
    height: calc(100% - 61px);
    overflow: auto;
  }
}
</style>