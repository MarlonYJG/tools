<!--
 * @Author: Marlon
 * @Date: 2020-06-10 09:58:01
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-08 16:26:20
 * @Description: 详情页
--> 
<template>
  <div class="map-details">
    <ul class="title">
      <li>{{title}}</li>
      <li v-if="isCollect">
        <el-button size="mini" type="primary">已收藏</el-button>
      </li>
      <li v-else>
        <el-button size="mini" type="primary" @click="clickCollect">收藏</el-button>
      </li>
    </ul>
    <div class="query">
      <ul class="select">
        <li>
          <label for>时间选择：</label>
          <el-select v-model="timeType" placeholder="请选择" size="small" style="width: 120px;">
            <el-option
              v-for="item in timeTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li v-show="timeType==1">
          <label for>年度：</label>
          <el-date-picker
            size="small"
            v-model="year"
            type="year"
            placeholder="选择年"
            style="width: 120px;"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </li>
        <li v-show="timeType==2">
          <label for>季度：</label>
          <el-date-picker
            size="small"
            v-model="yearJD"
            type="year"
            placeholder="选择年"
            style="width: 120px;"
            value-format="yyyy"
          ></el-date-picker>
          <el-select
            v-model="yearJD_jd"
            filterable
            clearable
            placeholder="请选择"
            size="small"
            style="width: 150px;"
          >
            <el-option
              v-for="item in jdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li v-show="timeType==3">
          <label for>月度：</label>
          <el-date-picker
            size="small"
            v-model="month"
            type="month"
            placeholder="选择月"
            style="width: 150px;"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </li>
        <li v-show="timeType==4">
          <el-date-picker
            size="small"
            v-model="custum"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </li>
      </ul>
      <ul class="btn">
        <li v-if="isShowInputSearch">
          <el-input size="small" placeholder="请输入内容" v-model="searchInput" clearable></el-input>
        </li>
        <li>
          <el-button size="small" type="primary" @click="getList">查询</el-button>
        </li>
      </ul>
    </div>
    <el-button class="export" size="small" @click="exportExcel">导出Excel</el-button>
    <div class="table-view">
      <TableDefault
        TId="indicator-table"
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TSort="TSort"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TIsShowCheckBox="true"
        @handleSelectionChange="handleSelectionChange"
        @changePage="changePage"
      ></TableDefault>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { Business_detail } from "api/indicator-center";
import { ResDatas } from "utils/res-format";
import { cellJump } from "@/utils/jump";
import { _ExportExcel } from "utils";
export default {
  mixins: [mixin],
  data() {
    return {
      // 标题
      title: "",
      searchInput: "",
      // 收藏状态
      isCollect: true,
      // 时间
      timeType: 1,
      timeTypeOption: [
        {
          label: "按年",
          value: 1,
        },
        {
          label: "按季度",
          value: 2,
        },
        {
          label: "按月",
          value: 3,
        },
        {
          label: "自定义",
          value: 4,
        },
      ],
      year: "",
      yearJD: "",
      yearJD_jd: "",
      jdOptions: [
        {
          label: "第一季度",
          value: 1,
        },
        {
          label: "第二季度",
          value: 2,
        },
        {
          label: "第三季度",
          value: 3,
        },
        {
          label: "第四季度",
          value: 4,
        },
      ],
      month: "",
      custum: "",
      isShowInputSearch: false,
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit: {
        show: false,
        slot: false,
        type: "popover",
        title: "操作",
        width: 180,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success",
          },
          {
            label: "查看",
            css: "warning",
          },
          {
            label: "修改状态",
            css: "warning",
          },
          {
            label: "删除",
            css: "danger",
            pass: true,
          },
        ],
      },
      tableTitle: [
        { prop: "date", label: "时间" },
        { prop: "result", label: "数据值" },
        { prop: "unit", label: "单位" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      TSort: {
        default: {
          prop: "",
          order: "",
        },
        sortArr: [],
      },
      TMultipleSelection: [],
    };
  },
  watch: {
    timeType: {
      handler(newVal) {
        switch (newVal) {
          case 1:
            {
              this.yearJD = this.month = this.custum = "";
              this.yearJD_jd = "";
            }
            return;
          case 2:
            {
              this.year = this.month = this.custum = "";
            }
            return;
          case 3:
            {
              this.yearJD = this.year = this.custum = "";
              this.yearJD_jd = "";
            }
            return;
          case 4:
            {
              this.yearJD = this.year = this.month = "";
              this.yearJD_jd = "";
            }
            return;
          default:
            break;
        }
      },
      immediate: true,
    },
  },
  methods: {
    clickCollect() {
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        API.indicatorCollect({ deriveIndicatorIds: [id] }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.collectState(id);
        });
      }
    },
    // 收藏状态
    collectState(deriveIndicatorId) {
      API.collectState({
        deriveIndicatorId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res.isCollect) {
          this.isCollect = true;
        } else {
          this.isCollect = false;
        }
      });
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 多选
    handleSelectionChange(type, val) {
      if (type == "checkbox") {
        this.TMultipleSelection = val;
      }
    },
    // 参数map
    reqMap() {
      let req = {};
      switch (this.timeType) {
        case 1:
          {
            req["timeType"] = "year";
            req["timeStr"] = this.year;
          }
          break;
        case 2:
          {
            req["timeType"] = "quarter";
            if (this.yearJD && this.yearJD_jd) {
              req["timeStr"] = this.yearJD + "-" + this.yearJD_jd;
            } else {
              req["timeStr"] = "";
            }
          }
          break;
        case 3:
          {
            req["timeType"] = "month";
            req["timeStr"] = this.month;
          }
          break;
        case 4:
          {
            req["timeType"] = "custum";
            if (this.custum.length) {
              req["timeStr"] = this.custum[0] + "," + this.custum[1];
            } else {
              req["timeStr"] = "";
              this.$message({
                message: "请选择日期",
                type: "warning",
              });
              return null;
            }
          }
          break;
        default:
          break;
      }
      if (this.$route.query && this.$route.query.row) {
        const { id } = JSON.parse(this.$route.query.row);
        return {
          deriveIndicatorId: id,
          pageNo: this.TPage.index,
          pageSize: this.TPage.size,
          searchCode: this.searchInput,
          ...req,
        };
      }
      return null;
    },

    /* 请求 */
    // 获取
    getList() {
      if (this.$route.query && this.$route.query.row) {
        if (this.reqMap()) {
          this.TLoading = true;
          API.getIndicatorDetailList(this.reqMap())
            .then((res) => {
              let Res = new ResDatas(
                {
                  code: 0,
                  res,
                  fieldKey: {
                    data: "data",
                    title: "title",
                    total: "total",
                    pageSize: "pageSize",
                    index: "pageNo",
                    ext: "ext",
                  },
                },
                "TLoading",
                this
              );
              if (Res.init()) {
                const {
                  data,
                  title,
                  total,
                  pageSize,
                  index,
                  ext,
                } = Res.formatData();
                this.tableTitle = title;
                this.tableData = data;
                this.isShowInputSearch = "showSearch" == ext;
                this.TPage = {
                  total,
                  index,
                  size: pageSize,
                };
              } else {
                this.tableData = [];
                this.TPage = {
                  total: 0,
                  index: 1,
                  size: 10,
                };
              }
            })
            .catch((error) => {
              this.TLoading = false;
            });
        }
      }
    },
    // 导出Excel
    exportExcel() {
      let ids = [];
      this.TMultipleSelection.forEach((item) => {
        ids.push(item.id);
      });
      let data = {
        ...this.reqMap(),
        ids: ids.join(),
      };
      let params = "?";
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          params += `${key}=${data[key]}&`;
        }
      }
      _ExportExcel(
        API.getIndicatorDetailExport(params.slice(0, params.length - 1))
      );

      return;
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { name, id } = JSON.parse(this.$route.query.row);
      this.title = name;
      this.collectState(id);
      this.getList();
    }
  },
};
</script>

<style lang="scss" scoped>
.map-details {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .title {
    overflow: hidden;
    font-size: 14px;
    li {
      float: left;
      height: 37px;
      line-height: 37px;
      &:first-child {
        margin-right: 20px;
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
  .query {
    height: 55px;
    line-height: 55px;
    overflow: hidden;
    .select {
      overflow: hidden;
      float: left;
      li {
        float: left;
        margin-right: 15px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .btn {
      float: right;
      overflow: hidden;
      li {
        float: left;
        margin-right: 15px;
      }
    }
  }
  .export {
    overflow: hidden;
    margin-bottom: 10px;
  }
  .table-view {
    width: 100%;
    height: calc(100% - 138px);
    overflow: auto;
  }
}
</style>
