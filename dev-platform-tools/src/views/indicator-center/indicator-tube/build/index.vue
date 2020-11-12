<!--
 * @Author: Marlon
 * @Date: 2020-08-31 14:21:20
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-31 15:47:31
 * @Description: 指标构建
-->
<template>
  <div>
    <TableDefault
      :TAlign="TAlign"
      :TLoading="TLoading"
      :TTitle="tableTitle"
      :TData="tableData"
      :TEdit="TEdit"
      :TIsShowPage="false"
      :TTotal="TPage.total"
      :TCurrentPage="TPage.index"
      :TPageSize="TPage.size"
      @clickCell="lickCell"
      @changePage="changePage"
    ></TableDefault>
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
      TLoading: false,
      // 表格
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: 350,
        fixed: "right",
        editTypes: [
          {
            label: "执行数据集构建",
            css: "text",
          },
          {
            label: "执行Kylin构建",
            css: "text",
            pass: true,
          },
          {
            label: "执行指标计算",
            css: "text",
          },
          {
            label: "刷新",
            css: "text",
          },
        ],
      },
      tableTitle: [
        {
          prop: "dataSetId",
          label: "数据集ID",
        },
        {
          prop: "dataSetCategory",
          label: "数据集分类",
        },
        {
          prop: "dataSetName",
          label: "数据集名称",
        },
        {
          label: "数据集中文名称",
          prop: "dataSetComment",
        },
        {
          label: "数据集创建时间",
          prop: "dataSetCreateTime",
        },
        {
          label: "数据集构建时间",
          prop: "dataSetBuildTime",
        },
        {
          label: "数据集构建状态",
          prop: "dataSetBuildStatus",
        },
        {
          label: "Kylin构建时间",
          prop: "kylinBuildTime",
        },
        {
          label: "Kylin构建状态",
          prop: "kylinBuildStatus",
        },
        {
          label: "指标计算时间",
          prop: "calculateTime",
        },
        {
          label: "指标计算结果",
          prop: "calculateStatus",
        },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      // 可跳转的值
      TClickItem: [
        {
          link: "/",
          cells: [],
        },
      ],
    };
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getDataSetList();
    },
    lickCell({ row, column, id }) {
      this.tableActive = row;
      const { dataSetId } = row;
      switch (column.label) {
        case "执行数据集构建":
          {
            this.dataSetBuild(dataSetId);
          }
          return;
        case "执行Kylin构建":
          {
            this.KylinBuild(dataSetId);
          }
          return;
        case "执行指标计算":
          {
            this.triggerIndicator(dataSetId);
          }
          return;
        case "刷新":
          {
            this.refreshBuild(dataSetId);
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 数据集
    getDataSetList() {
      this.TLoading = true;
      API.getIndicatorDataSetList()
        .then((res) => {
          this.TLoading = false;
          let Res = new ResDatas({ res, code: 0 }).init();
          if (Res) {
            this.tableData = Res;
          } else {
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch((err) => {
          this.TLoading = false;
        });
    },
    // 构建数据集
    dataSetBuild(dataSetId) {
      API.triggerDataSetBuild({
        datasetId: dataSetId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDataSetList();
      });
    },
    // 执行Kylin构建
    KylinBuild(dataSetId) {
      API.triggerKylinBuild({
        datasetId: dataSetId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDataSetList();
      });
    },
    // 执行指标
    triggerIndicator(dataSetId) {
      API.triggerIndicatorCalculate({
        datasetId: dataSetId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDataSetList();
      });
    },
    // 刷新
    refreshBuild(dataSetId) {
      API.refreshBuildStatus({
        datasetId: dataSetId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getDataSetList();
      });
    },
  },
  mounted() {
    this.getDataSetList();
  },
};
</script>

<style>
</style>