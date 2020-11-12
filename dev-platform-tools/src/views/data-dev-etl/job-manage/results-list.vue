<!--
 * @Author: Marlon
 * @Date: 2020-04-26 14:57:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 09:13:17
 * @Description: ETL-结果列表
 -->
<template>
  <div class="results-l">
    <div class="results-l-edit-area">
      <ul class="results-l-edit-area-select">
        <li>
          <el-input placeholder="请输入名称" v-model="proVal" size="small">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="getList"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="results-l-table">
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
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
    </div>
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
        { prop: "typeName", label: "类型" },
        { prop: "projectName", label: "名称" },
        { prop: "executionTypeName", label: "执行类型" },
        { prop: "startTime", label: "任务执行开始时间" },
        { prop: "endTime", label: "任务执行结束时间" },
        { prop: "statusName", label: "状态" }
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10
      },
      proVal: "",
      pageCount: 0
    };
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      switch (column.label) {
        case "查看详情": {
          cellJump(this, {
            row,
            column,
            TClickItem: [
              {
                link: "/other/dataDetails",
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

    /* 请求 */
    // 获取
    getList() {
      this.TLoading = true;
      if (this.proVal) {
        this.pageCount += 1;
      } else {
        this.pageCount = 0;
      }
      // if (this.pageCount == 1) {
      //   this.$set(this.TPage, `index`, 1);
      // }
      API.resultsList({
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        name: this.proVal
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
            this.tableData = data;
            this.$set(this.TPage, `total`, total);
            this.$set(this.TPage, `size`, pageSize);
            this.$set(this.TPage, `index`, index);
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
            this.$set(this.TPage, `size`, 10);
            this.$set(this.TPage, `index`, 1);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.proVal = paramsUrl.name;
    }
    this.getList();
  }
};
</script>

<style lang="less" scoped>
.results-l {
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
