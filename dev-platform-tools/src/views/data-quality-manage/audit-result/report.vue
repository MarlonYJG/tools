<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:35:02
 * @LastEditors: Marlon
 * @LastEditTime: 2020-06-09 10:53:38
 * @Description: 数据质量管理-审核结果-数据质量报告
 -->
<template>
  <div class="dq-ar-report">
    <div class="dq-ar-report-edit">
      <ul class="dq-ar-report-edit-1">
        <li>
          <el-button size="medium" icon="el-icon-upload2">导出</el-button>
        </li>
        <li>
          <el-button size="medium" icon="el-icon-printer" @click="doPrint">打印</el-button>
        </li>
      </ul>
      <ul class="dq-ar-report-edit-2">
        <li>
          <label for>项目：</label>
          <el-cascader
            :options="projectOption"
            v-model="projectVal"
            filterable
            :props="{ expandTrigger: 'hover' }"
            placeholder="请选择指定项目的版本"
            style="width:350px"
            size="medium"
            @change="handleChange"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </li>
      </ul>
    </div>
    <!--startprint-->
    <div class="report">
      <p class="dq-ar-report-title">
        <span>{{reportTitle}}</span>
        <span>数据质量检测报告</span>
      </p>
      <div class="dq-ar-report-1">
        <MTitle TitleName="数据质量检测整体情况"></MTitle>
        <ul>
          <li>
            <span>本次数据质量检测:</span>
            <b>
              <countTo :startVal="0" :endVal="totalFields" :duration="3000" :decimals="0"></countTo>
            </b>
            <span>字段</span>
          </li>
          <li>
            <span>错误字段数:</span>
            <b>
              <countTo :startVal="0" :endVal="failFields" :duration="3000" :decimals="0"></countTo>
            </b>
            <span>个</span>
          </li>
          <li>
            <span>错误字段占比:</span>
            <b>
              <countTo
                :startVal="0"
                :endVal="rateFields"
                :duration="3000"
                :decimals="rateFields ===0 ?0:2"
              ></countTo>%
            </b>
          </li>
        </ul>
      </div>
      <div class="dq-ar-report-2">
        <MTitle TitleName="规则检查质量情况"></MTitle>
        <p>
          本次按照检验规则分类检验的数据质量情况如下。其中
          <b>{{title_1}}</b>
          <b v-if="title_2">和{{title_2}}</b>
          规则的错误字段数较多，需要
          <b>提升数据录入操作的规范性。</b>
        </p>
        <TableDefault
          :TLoading="TLoading_1"
          :TAlign="TAlign"
          :TIsShowIndex="TIsShowIndex"
          :TMaxHeight="TMaxHeight"
          :TTitle="tableTitle_1"
          :TData="tableData_1"
          :TShowSummary="TShowSummary"
        ></TableDefault>
        <div class="pie-area">
          <div class="pie-1">
            <div>
              <ChartPie elId="1" :data="pieData" :chartConfig="chartConfig"></ChartPie>
            </div>
            <span>错误字段占比</span>
          </div>
          <div class="pie-2">
            <div>
              <ChartPieNightingale elId="2" :data="pieNigData" :chartConfig="pieNigchartConfig"></ChartPieNightingale>
            </div>
            <span>错误字段分布</span>
          </div>
        </div>
      </div>
      <div class="dq-ar-report-3">
        <MTitle TitleName="规则检查质量情况"></MTitle>
        <p>本次按照不同类型检测的错误字段，分别进行了相应处理，处理结果如下。“净化回收率”（净化回收字段/错误字段数*100%）=51.2%，入库字段占比（入库字段数量/检查字段数量*100%）=80%。</p>
        <TableDefault
          :TLoading="TLoading_1"
          :TIsShowIndex="TIsShowIndex"
          :TMaxHeight="TMaxHeight"
          :TTitle="tableTitle_2"
          :TData="tableData_2"
        ></TableDefault>
        <G6FlowChart :FCNode="FCNode"></G6FlowChart>
      </div>
    </div>
    <!--endprint-->
  </div>
</template>

<script>
import moment from "moment";
import countTo from "vue-count-to";
import mixin from "mixin";
import MTitle from "@/components/titles/title";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { projectTaskVersion, projectTaskVersionParsing } from "utils";
import ChartPie from "@/components/chart/pie";
import ChartPieNightingale from "@/components/chart/pie/pie-nightingale";
import G6FlowChart from "../components/G6/flow-chart";

export default {
  mixins: [mixin],
  components: {
    countTo,
    MTitle,
    ChartPie,
    ChartPieNightingale,
    G6FlowChart
  },
  data() {
    return {
      // domTitle: "",
      reportTitle: "",
      totalFields: 0,
      failFields: 0,
      rateFields: 0,
      // 查询条件
      projectVal: [],
      projectOption: [],
      /* 表格 */
      TLoading_1: false,
      TAlign: [
        {
          key: "left",
          item: ["ruleName"]
        }
      ],
      TIsShowIndex: {
        show: false
      },
      TMaxHeight: 290,
      tableTitle_1: [
        {
          label: "规则类型",
          prop: "ruleName"
        },
        {
          label: "检查字段数",
          prop: "total"
        },
        {
          label: "错误字段数",
          prop: "fail"
        },
        {
          label: "错误字段占比",
          prop: "rate"
        }
      ],
      tableData_1: [],
      tableDataRate_1: 0,
      title_1: "",
      title_2: "",
      tableTitle_2: [
        {
          label: "规则类型"
        },
        {
          label: "检查字段数"
        },
        {
          label: "错误字段数"
        },
        {
          label: "处理方式"
        },
        {
          label: "处理字段数"
        },
        {
          label: "净化回收数"
        },
        {
          label: "净化回收率"
        },
        {
          label: "入库字段数量"
        },
        {
          label: "入库字段占比"
        }
      ],
      tableData_2: [],
      // 总计
      TShowSummary: {
        show: true,
        type: "custom",
        sumFn: this.sumFn
      },
      // 饼图
      pieData: [],
      chartConfig: {
        title: {
          text: "20%",
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "normal",
            color: "rgb(96, 98, 102)",
            fontSize: "20"
          }
        },
        color: ["#69BAFF"],
        legend: {
          show: false,
          itemGap: 12,
          data: ["01", "02"]
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "字段占比分布",
            type: "pie",
            clockWise: true,
            radius: ["55%", "80%"],
            itemStyle: {
              normal: {
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                }
              }
            },
            hoverAnimation: false,
            label: {
              show: true
            },
            data: [
              {
                name: "错误字段占比",
                value: 20,
                itemStyle: {
                  normal: {
                    color: "#82E8B5",
                    label: {
                      show: false
                    },
                    labelLine: {
                      show: false
                    }
                  }
                }
              },
              {
                name: "正确字段占比",
                value: 80
              }
            ]
          }
        ]
      },
      pieNigData: [],
      pieNigchartConfig: {
        title: {
          show: false,
          text: "南丁格尔玫瑰图",
          x: "center"
        },
        color: [
          "#80E8B4",
          "#CEA2F4",
          "#69BBFF",
          "#6ED9FF",
          "#37a2da",
          "#32c5e9",
          "#9fe6b8",
          "#ffdb5c",
          "#ff9f7f",
          "#fb7293",
          "#e7bcf3",
          "#8378ea"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"]
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "错误字段分布",
            type: "pie",
            radius: [50, 100],
            roseType: "area",
            label: {
              normal: {
                formatter: ["{c|{d}%}", "{b|{b}}"].join("\n"),
                rich: {
                  c: {
                    color: "rgb(96, 98, 102)",
                    fontSize: 15,
                    //   fontWeight: "bold",
                    lineHeight: 5
                  },
                  b: {
                    color: "rgb(96, 98, 102)",
                    fontSize: 15,
                    height: 40
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      // 流程图
      FCNode: []
    };
  },
  watch: {
    projectVal: {
      handler(newVal) {
        if (newVal && newVal.length) {
          this.getStatistics();
          this.getReportFields();
          // TODO
        }
      },
      deep: true
    }
  },
  methods: {
    // 打印
    doPrint() {
      // TODO
      console.log("打印");
    },
    // 总计
    sumFn(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 个";
        } else if (column.property === "rate") {
          if (this.tableDataRate_1 == "NaN") {
            sums[index] = "0%";
          } else {
            sums[index] = this.tableDataRate_1 + "%";
          }
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    handleChange(val) {
      let time = "";
      let task = "";
      if (this.projectOption.length) {
        this.projectOption.forEach(item => {
          if (item.value === val[0]) {
            if (item.children && item.children.length) {
              item.children.forEach(element => {
                if (element.value === val[1]) {
                  task = element.label;
                  if (element.children && element.children.length) {
                    element.children.forEach(ele => {
                      if (ele.value === val[2]) {
                        let Y = ele.label.slice(0, 4);
                        let M = ele.label.slice(4, 6);
                        let D = ele.label.slice(6, 8);
                        time = Y + "年" + M + "月" + D + "日";
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
      this.reportTitle = time + task;
    },

    /* 请求 */
    // 获取项目列表
    getProjectList({ init, projectVal, taskVal, versionVal }) {
      API._publicProTaskVer().then(res => {
        let Res = new ResDatas({
          res,
          error: "获取列表失败"
        }).init();
        let proArr = [];
        if (Res && Res.length) {
          proArr = projectTaskVersion(Res);
          if (init) {
            this.projectVal = projectTaskVersionParsing({
              sourceArr: proArr,
              ptvArr: [projectVal, taskVal, versionVal],
              key: "id",
              valKey: "value"
            });
          } else {
            this.projectVal = [
              proArr[0].value,
              proArr[0].children[0].value,
              proArr[0].children[0].children[0].value
            ];
            let Y = proArr[0].children[0].children[0].label.slice(0, 4);
            let M = proArr[0].children[0].children[0].label.slice(4, 6);
            let D = proArr[0].children[0].children[0].label.slice(6, 8);
            let time = Y + "年" + M + "月" + D + "日";
            this.reportTitle = time + proArr[0].children[0].label;
          }
        }
        this.projectOption = proArr;
      });
    },
    // 总数
    getStatistics() {
      const [projectVal, taskVal, versionVal] = projectTaskVersionParsing({
        sourceArr: this.projectOption,
        ptvArr: this.projectVal,
        key: "value",
        valKey: "id"
      });
      API.reportTotal({
        taskId: taskVal,
        versionNo: versionVal
      }).then(res => {
        let Res = new ResDatas({
          res,
          error: "获取总数失败"
        }).init();
        let pieData = [];
        if (Res) {
          this.totalFields = Res.total || 0;
          this.failFields = Res.fail || 0;
          this.rateFields = Res.rate || 0;
          pieData = [Number(Res.fail), Number(Res.total) - Number(Res.fail)];
          this.chartConfig.title.text = Res.rate + "%";
        } else {
          this.totalFields = 0;
          this.failFields = 0;
          this.rateFields = 0;
          pieData = [];
        }
        this.pieData = pieData;
      });
    },
    // 质量情况(字段)
    getReportFields() {
      this.TLoading_1 = true;
      const [projectVal, taskVal, versionVal] = projectTaskVersionParsing({
        sourceArr: this.projectOption,
        ptvArr: this.projectVal,
        key: "value",
        valKey: "id"
      });
      API.reportFields({
        taskId: taskVal,
        versionNo: versionVal
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            error: "获取质量情况失败"
          }).init();
          this.TLoading_1 = false;
          if (Res && Res.length) {
            this.title_1 = Res[0].ruleName;
            if (Res[1]) {
              this.title_2 = Res[1].ruleName;
            } else {
              this.title_2 = "";
            }

            // 构建南丁格尔 Map
            let data_ = [];
            Res.forEach(item => {
              item["rate"] = item.rate + "%";
              data_.push({
                value: Number(item.fail),
                name: item.ruleName
              });
            });
            this.pieNigData = data_;
            // 构建表格的 总计占比
            let valuestotal = Res.map(item => Number(item.total));
            let tableTotalFields = valuestotal.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            let valuesfail = Res.map(item => Number(item.fail));
            let tableFailFields = valuesfail.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.tableDataRate_1 = (
              (tableFailFields / tableTotalFields) *
              100
            ).toFixed(2);
            // 构建表格数据
            this.tableData_1 = Res;
          } else {
            this.tableData_1 = [];
            this.pieNigData = [];
          }
        })
        .catch(error => {
          this.TLoading_1 = false;
          console.error(error);
        });
    }
  },
  mounted() {
    // this.domTitle = `${this.$route.meta.title}(${moment()
    //   .locale("zh-cn")
    //   .format("YYYY-MM-DD HH:mm:ss")})`;
    if (this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.getProjectList({
        init: true,
        projectVal: paramsUrl.projectId,
        taskVal: paramsUrl.taskId,
        versionVal: paramsUrl.versionNo
      });
      let Y = paramsUrl.versionNo.slice(0, 4);
      let M = paramsUrl.versionNo.slice(4, 6);
      let D = paramsUrl.versionNo.slice(6, 8);
      let time = Y + "年" + M + "月" + D + "日";
      this.reportTitle = time + paramsUrl.taskName;
    } else {
      this.getProjectList({ init: false });
    }
  }
};
</script>

<style lang="scss" scoped>
$number_1: #01c1df;
$number_2: #818dfe;
$number_3: #b497f0;
.dq-ar-report {
  width: 100%;
  &-edit {
    overflow: hidden;
    margin-bottom: 20px;
    ul {
      li {
        float: left;
        box-sizing: border-box;
        margin: 1px 7px;
      }
    }
    &-1 {
      float: left;
    }
    &-2 {
      float: right;
      font-size: 14px;
      color: #555555;
      li {
        width: 405px;
        /deep/ .el-input__inner {
          color: #999999;
        }
      }
    }
  }
  &-title {
    text-align: center;
    font-size: 18px;
    font-weight: bolder;
    color: #555555;
    span {
      &:nth-child(1) {
        font-family: "pingfang sc 中粗体";
      }
      &:nth-child(2) {
        font-family: "pingfang sc 常规体";
      }
    }
  }
  .report {
    overflow: hidden;
  }
  &-1 {
    overflow: hidden;
    margin: 25px 0;
    ul {
      overflow: hidden;
      margin-top: 10px;
      li {
        float: left;
        box-sizing: border-box;
        margin-right: 60px;
        font-size: 14px;
        b {
          display: inline-block;
          height: 30px;
          font-size: 24px;
        }
        &:nth-child(1) {
          margin-left: 10px;
          b {
            color: $number_1;
          }
        }
        &:nth-child(2) {
          b {
            color: $number_2;
          }
        }
        &:nth-child(3) {
          margin-right: 0;
          b {
            color: $number_3;
          }
        }
      }
    }
  }
  &-2 {
    & > p {
      margin: 10px;
      font-size: 14px;
      font-family: "pingfang sc 常规体";
      b {
        font-weight: normal;
        font-family: "pingfang sc 中粗体";
      }
    }
  }
  .pie-area {
    overflow: hidden;
    width: 1500px;
    box-sizing: border-box;
    margin: 0 auto;
    & > div {
      float: left;
      width: 748px;
      height: 345px;
      box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      & > div {
        box-sizing: border-box;
        width: 748px;
        height: 300px;
      }
      & > span {
        font-size: 18px;
        font-family: PingFang-SC-Medium;
        color: #555555;
      }
    }
  }
  &-3 {
    & > p {
      margin: 10px;
      font-size: 14px;
      font-family: "pingfang sc 常规体";
      b {
        font-weight: normal;
        font-family: "pingfang sc 中粗体";
      }
    }
  }
  /deep/ .el-button--medium {
    padding: 10px;
  }
}
</style>