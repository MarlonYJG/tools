<!--
 * @Author: Marlon
 * @Date: 2020-06-09 09:36:18
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-27 14:03:48
 * @Description: 指标地图
--> 
<template>
  <div class="indicator-vie-map">
    <ul class="query">
      <li>
        <label for>选择项目：</label>
        <el-select v-model="proVal" filterable placeholder="请选择" size="medium" @change="getMap">
          <el-option
            v-for="item in proOption"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </li>
      <li>
        <el-button size="medium" type="primary" @click="hanleJump">查看已收藏派生指标</el-button>
      </li>
    </ul>
    <ul class="indicator">
      <li>标准产品包含：</li>
      <li>
        业务板块：
        <span>{{segmentNum}}</span>
        <b>个</b>
      </li>
      <li>
        数据域：
        <span>{{domainNum}}</span>
        <b>个</b>
      </li>
      <li>
        原子/复合指标：
        <span>{{indicatorNum}}</span>
        <b>个</b>
      </li>
      <li>
        维度：
        <span>{{dimensionNum}}</span>
        <b>个</b>
      </li>
    </ul>
    <p
      class="info"
    >（操作说明：点击数据域可出现指标和维度，点击指标后，可进行派生指标的查询，点击派生指标，可查看派生指标的数据值；点击维度后，可查看所有维度，点击维度字段，可查看对应的维度值。）</p>
    <div class="graph">
      <ChartTree elId="tree" :data="treeData" :chartConfig="chartConfig"></ChartTree>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import ChartTree from "@/business-components/tree";
import { cellJump } from "utils/jump";

export default {
  mixins: [mixin],
  components: {
    ChartTree
  },
  data() {
    return {
      // 项目
      proVal: "",
      proOption: [],
      segmentNum: 0,
      domainNum: 0,
      indicatorNum: 0,
      dimensionNum: 0,

      // 树图
      treeData: [],
      chartConfig: {
        tooltip: {
          trigger: "item",
          formatter: function(x) {
            return x.data.desc || "";
          }
        },
        series: [
          {
            type: "tree",
            name: "指标地图",
            data: [],
            top: "5%",
            left: "12%",
            bottom: "2%",
            right: "37%",
            symbol: function(value, params) {
              if (params.symbol) {
                return params.symbol;
              }
              return "circle";
            },
            roam:true,
            edgeShape: "curve",
            symbolSize: 12,
            expandAndCollapse: true,
            initialTreeDepth: 3,
            animationDuration: 550,
            animationDurationUpdate: 750,
            itemStyle: {
              color: "#fff",
              borderWidth: 1,
              borderColor: "#54B8C6"
            },
            label: {
              normal: {
                position: "right",
                verticalAlign: "middle",
                align: "left",
                fontSize: 17
              }
            }
          }
        ]
      }
    };
  },
  watch: {},
  methods: {
    hanleJump() {
      cellJump(this, {
        TClickItem: [
          {
            link: "/indicator/view/collect",
            jump: {
              type: "push",
              mode: "int"
            }
          }
        ]
      });
    },
    // 初始化渲染数据节点样式
    loop(arr, i = 0) {
      if (arr && arr.length) {
        arr.forEach(item => {
          item["id"] = item.no;
          item["idType"] = item.id;
          item["name"] = item.label;
          item["desc"] = item.name;
          if (i == 0) {
            if (item.name.length > 10) {
              item.name = item.name.substr(0, 10) + "...";
            }
            item["symbol"] = "rect";
            item["symbolSize"] = [250, 50];
            item["itemStyle"] = {
              color: "#618CDE",
              borderRadius: 5,
              borderWidth: 0
            };
            item["label"] = {
              position: "inside",
              color: "#fff",
              align: "center",
              verticalAlign: "middle"
            };
          } else if (i == 1) {
            if (item.name.length > 5) {
              item.name = item.name.substr(0, 5) + "...";
            }
            item["symbol"] = "rect";
            item["symbolSize"] = [140, 35];
            item["itemStyle"] = {
              color: "#54B8C6"
            };
            item["label"] = {
              position: "inside",
              color: "#fff",
              align: "center",
              verticalAlign: "middle"
            };
            item["collapsed"] = false;
          } else {
            if (item.num==0 || item.num) {
              item["name"] = item.name + `(${item.num})`;
            } else {
              item["name"] = item.name;
            }
            item["symbolSize"] = 14;
            item["itemStyle"] = {
              color: "#fff",
              borderWidth: 1,
              borderColor: "#54B8C6"
            };
            item["label"] = {
              verticalAlign: "middle"
            };
          }
          if (item.children && item.children.length) {
            this.loop(item.children, i + 1);
          } else {
            delete item.children;
          }
        });
      }
    },

    /* 请求 */
    // 项目
    getProList() {
      API._publicProjectList().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if (Res && Res.length) {
          Res.forEach(item => {
            item["label"] = item.projectName;
            item["value"] = item.projectId;
          });
          this.proVal = Res[0].value;
          this.getMap();
        }
        this.proOption = Res;
      });
    },
    // 获取拓扑图
    getMap() {
      if (this.proVal) {
        API.getIndicatorMap({
          projectId: this.proVal
        }).then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          let treeData_ = [];
          if (Res) {
            const {
              segmentNum = 0,
              domainNum = 0,
              indicatorNum = 0,
              dimensionNum = 0,
              mapTree
            } = Res;
            this.segmentNum = segmentNum;
            this.domainNum = domainNum;
            this.indicatorNum = indicatorNum;
            this.dimensionNum = dimensionNum;
            console.log(mapTree);
            treeData_ = [
              {
                ...mapTree
              }
            ];
            this.loop(treeData_, 0);
            console.log(treeData_);
            this.treeData = treeData_;
          } else {
            this.treeData = treeData_;
            this.segmentNum = this.domainNum = this.indicatorNum = this.dimensionNum = 0;
          }
        });
      }
    }
  },
  mounted() {
    this.getProList();
  }
};
</script>

<style lang="scss" scoped>
.indicator-vie-map {
  font-size: 14px;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .query {
    overflow: hidden;
    li {
      &:first-child {
        float: left;
      }
      &:last-child {
        float: right;
      }
    }
  }
  .indicator {
    overflow: hidden;
    margin: 18px 0 0 0;
    color: #000;
    li {
      float: left;
      margin-right: 25px;
      height: 35px;
      line-height: 22px;
      &:first-child {
        position: relative;
        top: 8px;
        margin-right: 0;
      }
      span {
        position: relative;
        top: 7px;
        font-size: 34px;
      }
      &:nth-child(2) {
        span {
          color: #54b8c6;
        }
      }
      &:nth-child(3) {
        span {
          color: #6b9ffa;
        }
      }
      &:nth-child(4) {
        span {
          color: #8589da;
        }
      }
      &:nth-child(5) {
        span {
          color: #eb9a3d;
        }
      }
    }
  }
  .info {
    overflow: hidden;
    height: 30px;
    line-height: 30px;
    color: #999999;
  }
  .graph {
    width: 100%;
    height: calc(100% - 120px);
    overflow: auto;
    box-sizing: border-box;
  }
}
</style>
