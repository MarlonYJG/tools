<!--
 * @Author: Marlon
 * @Date: 2020-02-18 10:24:04
 * @LastEditors: Marlon
 * @LastEditTime: 2020-05-19 10:34:09
 * @Description: ETL执行信息统计
 -->
<template>
  <div class="results-other">
    <ul class="results-other-edit-area">
      <li>
        任务名称：
        <span>{{taskName}}</span>
      </li>
      <li>
        表转换个数：
        <span>{{tableNum}}</span>
      </li>
    </ul>
    <ul class="results-other-edit-query">
      <li>
        <label for>进行标识：</label>
        <el-select
          v-model="markVal"
          filterable
          placeholder="请选择"
          size="mini"
          @change="getList"
          clearable
        >
          <el-option
            v-for="item in markList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label for>成功标识：</label>
        <el-select
          v-model="markSuccessVal"
          filterable
          placeholder="请选择"
          size="mini"
          @change="getList"
          clearable
        >
          <el-option
            v-for="item in markSuccessList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
    </ul>
    <div class="results-other-table">
      <TableDefault
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="total"
        :TCurrentPage="current"
        :TPageSize="pageSize"
        :TSort="TSort"
        :TAlign="TAlign"
        :TClickItem="TClickItem"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      @editBtnCb="editBtnCb"
    >
      <TableDefault
        slot="soltDigContent"
        :TId="SoldTId"
        :THeight="450"
        :TMaxHeight="450"
        :TIsShowIndex="TIsShowIndex"
        :TIsShowCheckBox="false"
        :TCurrentTid="SoldTId"
        :TLoading="SoldTLoading"
        :TTitle="SoldtableTitle"
        :TData="SoldtableData"
        :TIsShowPage="true"
        :TTotal="SoldTPage.total"
        :TCurrentPage="SoldTPage.index"
        :TPageSize="SoldTPage.size"
        :TEdit="SoldTEdit"
        :TAlign="SoldTAlign"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage_1"
      ></TableDefault>
    </SoltDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api";
import { ResDatas, reqFormatDic } from "utils/res-format";
import SoltDialog from "@/components/dialog/solt-dialog";
export default {
  mixins: [mixin],
  components: {
    SoltDialog
  },
  data() {
    return {
      // 指标
      taskName: "",
      tableNum: "",
      // 查询条件区域
      markVal: "",
      markList: [],
      markSuccessVal: "",
      markSuccessList: [],
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: ["name", "remark"]
        }
      ],
      TSort: {
        default: {
          prop: "gmtCreate",
          order: "descending"
        },
        sortArr: [
          {
            prop: "code",
            order: "descending"
          },
          {
            prop: "dbCount",
            order: "descending"
          },
          {
            prop: "tableCount",
            order: "descending"
          },
          {
            prop: "columnCount",
            order: "descending"
          }
        ]
      },
      TEdit: {
        show: false,
        title: "操作",
        fixed: "right",
        width: 240,
        editTypes: []
      },
      tableTitle: [
        { prop: "tableName", label: "表名称" },
        { prop: "totalNum", label: "总条数" },
        { prop: "normalNum", label: "符合条数" },
        { prop: "illegalNum", label: "不符合条数" },
        { prop: "exceptionNum", label: "异常条数" },
        { prop: "completeFlagName", label: "进行标识" },
        { prop: "exceptionInfo", label: "异常信息" },
        { prop: "exceptionBatchNum", label: "异常批号" },
        { prop: "totalBatchNum", label: "总批号" },
        { prop: "sourceSql", label: "源sql" },
        { prop: "sourcePageSql", label: "源分页sql" }
      ],
      tableData: [{ illegalNum: 1, exceptionNum: 2 }],
      current: 1,
      pageSize: 10,
      total: 0,
      TClickItem: [
        {
          type: "dialog",
          cells: ["illegalNum", "exceptionNum"],
          cb: form => {
            this.showSlotDig(form);
          }
        }
      ],
      // 弹出框-表格
      SoldTId: "soldId",
      SoldTLoading: false,
      SoltDigShow: false,
      SoltDigTitle: "",
      TIsShowIndex: {
        show: true
        // fixed:'left'
      },
      soltDFootBtn: [
        {
          label: "确定",
          css: "primary",
          cb: ({ Item }) => {
            this.add();
          }
        }
      ],
      SoldtableTitle: [
        { prop: "sql", label: "表名或sql" },
        { prop: "dataRowId", label: "关联ID" },
        { prop: "dataRow", label: "数据行" },
        { prop: "exceptionInfo", label: "异常信息" },
        { prop: "recordId", label: "记录表id" },
        { prop: "createTime", label: "创建时间" },
        { prop: "tranId", label: "转换id" },
        { prop: "targetName", label: "目标表名称" }
      ],
      SoldtableData: [],
      SoldTPage: {
        total: 0,
        index: 1,
        size: 10
      },
      SoldTEdit: {
        show: false,
        title: "操作",
        width: 80,
        // fixed: "right",
        editTypes: [
          {
            label: "清空",
            css: "danger"
          }
        ]
      },
      SoldTAlign: [
        {
          key: "left",
          item: ["datasourceName", "remark"]
        }
      ],
      SoldCheckBox: [],
      // 表格激活行
      tableActiveRow_: ""
    };
  },
  methods: {
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = editItem.close;
      } else if (text === "删除") {
      }
    },
    // 弹出框-表格
    showSlotDig({ column, row }) {
      console.log(column);
      this.tableActiveRow_ = {
        prop: column.property,
        row
      };
      // TODO
      switch (column.property) {
        case "illegalNum":
          {
            this.SoltDigShow = true;
            this.SoltDigTitle = "不符合数据";
            this.getillegal(row);
          }
          return;
        case "exceptionNum":
          {
            this.SoltDigShow = true;
            this.SoltDigTitle = "系统异常数据";
            this.getexception(row);
          }
          return;
        default:
          break;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.current = currentPage;
      this.pageSize = pageSize;
      this.getList();
    },
    changePage_1({ pageSize, currentPage }) {
      const { prop, row } = this.tableActiveRow_;
      this.$set(this.SoldTPage, `index`, currentPage);
      this.$set(this.SoldTPage, `size`, pageSize);
      switch (prop) {
        case "illegalNum":
          {
            this.getillegal(row);
          }
          return;
        case "exceptionNum":
          {
            this.getexception(row);
          }
          return;
        default:
          break;
      }
    },
    lickCell({ row, column, id }) {
      const { remark, name, code } = row;

      console.log(123123);
    },

    /* 请求 */
    // 进行标识
    markIng() {
      API.resultsIng().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let arr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            arr.push({
              label: item.name,
              value: item.id
            });
          });
        }
        this.markList = arr;
      });
    },
    // 成功标识
    successMark() {
      API.resultsSucc().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let arr = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            arr.push({
              label: item.name,
              value: item.id
            });
          });
        }
        this.markSuccessList = arr;
      });
    },
    // 获取
    getList() {
      if (this.$route.query && this.$route.query.row) {
        let { id } = JSON.parse(this.$route.query.row);
        this.TLoading = true;
        API.resultsListGet(
          reqFormatDic({
            completeFlag: this.markVal,
            executionResultId: id,
            resultFlag: this.markSuccessVal,
            pageNum: this.current,
            pageSize: this.pageSize
          })
        )
          .then(res => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "total",
                  pageSize: "pageSize"
                }
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, title, total, pageSize } = Res.formatData();
              this.tableTitle = title;
              this.tableData = data;
              this.total = total;
              this.pageSize = pageSize;
            }
          })
          .catch(error => {
            this.TLoading = false;
            console.error(error);
          });
      }
    },
    // 异常 查询
    getexception({ id }) {
      this.SoldTLoading = true;
      API.resultsError({
        executionResultId: id,
        pageNum: this.SoldTPage.index,
        pageSize: this.SoldTPage.size
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
                pageSize: "pageSize"
              }
            },
            "SoldTLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.SoldtableTitle = title;
            console.log(JSON.stringify(title));
            this.SoldtableData = data;
            this.$set(this.SoldTPage, `total`, total);
            this.$set(this.SoldTPage, `size`, pageSize);
          }
          console.log("异常查询", res);
        })
        .catch(error => {
          this.SoldTLoading = false;
          console.error(error);
        });
    },
    // 不符合 查询
    getillegal({ id }) {
      this.SoldTLoading = true;
      API.resultsNo({
        executionResultId: id,
        pageNum: this.SoldTPage.index,
        pageSize: this.SoldTPage.size
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
                pageSize: "pageSize"
              }
            },
            "SoldTLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.SoldtableTitle = title;
            // TODO
            this.SoldtableData = data;
            this.$set(this.SoldTPage, `total`, total);
            this.$set(this.SoldTPage, `size`, pageSize);
          }
          console.log("不符合查询", res);
        })
        .catch(error => {
          this.SoldTLoading = false;
          console.error(error);
        });
    }
  },
  mounted() {
    this.markIng();
    this.successMark();
    if (this.$route.query && this.$route.query.row) {
      let { countExecutionResultInfo, taskName } = JSON.parse(
        this.$route.query.row
      );
      this.taskName = taskName;
      this.tableNum = countExecutionResultInfo;
    }
    this.getList();
  }
};
</script>

<style lang="scss" scoped>
.results-other {
  margin: 2px 15px;
  &-edit-area {
    overflow: hidden;
    float: left;
    li {
      float: left;
      margin: 2px 15px;
      height: 30px;
      line-height: 30px;
    }
  }
  &-edit-query {
    float: right;
    overflow: hidden;
    li {
      float: left;
      height: 30px;
      line-height: 30px;
      margin: 2px 15px;
    }
  }
  &-table {
    margin: 20px 0;
    padding-top: 30px;
  }
  /deep/ .el-table th {
    padding: 2px 0;
  }
}
</style>
