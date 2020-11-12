<!--
 * @Author: Marlon
 * @Date: 2020-02-24 21:50:15
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-13 13:34:47
 * @Description: 采集数据统计
 -->

<template>
  <div class="data-statistics">
    <div class="data-statistics-top">
      <ul class="area-title">
        <li class="area-title-1">
          <span>采集任务：</span>
          <span>{{taskName}}</span>
        </li>
      </ul>
      <ul class="area-title">
        <li class="area-title-1">
          <span>源库：</span>
          <span>共有 {{sourceTotal}}张表 采集了 {{sourceUsed}}张表的数据</span>
        </li>
        <li class="area-title-2">
          <span>目标库：</span>
          <span>共有 {{targetTotal}}张表 本次任务同步数据涉及{{targetUsed}}张表</span>
        </li>
      </ul>
      <div class="area-table">
        <TableDefault
          TId="1"
          :TLoading="TLoading"
          :TTitle="tableTitle"
          :TData="tableData"
          :TIsShowPage="true"
          :TTotal="total"
          :TCurrentPage="current"
          :TPageSize="pageSize"
          @changePage="changePage"
        ></TableDefault>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas } from "utils/res-format";
export default {
  mixins: [mixin],
  data() {
    return {
      taskName: "",
      sourceTotal: 0,
      sourceUsed: 0,
      targetTotal: 0,
      targetUsed: 0,
      TLoading: false,
      tableTitle: [
        {
          prop: "targetJobCode",
          label: "目标表"
        },
        {
          prop: "targetJobName",
          label: "目标表中文名称"
        },
        {
          prop: "sourceJobCode",
          label: "源数据集"
        },
        {
          prop: "sourceJobName",
          label: "源数据集中文名称"
        },
        {
          prop: "targetRows",
          label: "目标表记录数"
        },
        {
          prop: "sourceRows",
          label: "源数据集记录数"
        }
      ],
      tableData: [],
      current: 1,
      pageSize: 10,
      total: 0
    };
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.current = currentPage;
      this.pageSize = pageSize;
      this.init();
    },

    /* 请求 */
    init() {
      if (this.$route.query && this.$route.query.row) {
        let urlParams = JSON.parse(this.$route.query.row);
        this.taskName = urlParams.taskName;
        this.getList(urlParams.id);
        this.getInfo(urlParams.id);
      }
    },
    // 统计列表
    getList(taskId) {
      this.TLoading = true;
      API.statisticsList({
        current: this.current,
        size: this.pageSize,
        taskId
      })
        .then(res => {
          let Res = new ResDatas(
            {
              res,
              code: 200,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size"
              },
              titleKey: []
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize } = Res.formatData();
            this.tableData = data;
            this.pageSize = pageSize;
            this.total = total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 统计信息
    getInfo(taskId) {
      API.statisticsInfo({ taskId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 200,
          error: "获取统计信息失败!"
        }).init();
        if (Res) {
          this.sourceTotal = Res.sourceCount;
          this.targetTotal = Res.targetCount;
          this.sourceUsed = Res.sourceCountTotal;
          this.targetUsed = Res.targetCountTotal;
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="less" scoped>
.data-statistics {
  padding: 20px;
  min-width: 1300px;
  width: calc(100% - 1px);
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .area {
    &-title {
      height: 32px;
      line-height: 30px;
      margin: 5px 30px;
      &-1 {
        float: left;
      }
      &-2 {
        margin-left: 400px;
      }
    }
  }
  &-top {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    flex: 1;
    overflow: hidden;
    .area-table {
      width: 100%;
      height: calc(100% - 80px);
      overflow: auto;
    }
  }
}
</style>
