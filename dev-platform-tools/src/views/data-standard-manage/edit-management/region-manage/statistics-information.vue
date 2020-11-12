<!--
 * @Author: Marlon
 * @Date: 2020-02-26 11:39:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-27 06:47:01
 * @Description: 统计信息
 -->
<template>
  <div class="statistics-information">
    <ul>
      <li v-for="(item, i) in statisData" :key="i">
        <p class="name">{{item.label}}：</p>
        <p
          class="value"
          :style="(item.label === '业务板块个数'|| item.label === '数据集个数' ||item.label === '数据集个数' ||item.label === '数据标准属性个数'||item.label === '清洗规则条数'||item.label === '质量规则条数' ) ? 'text-decoration: underline;color: #3a8ee6;cursor: pointer;':''"
          @click="handleJump({item})"
        >{{item.value}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { cellJump } from "utils/jump";

import API from "api";
import { ResDatas } from "utils/res-format";

export default {
  props: {
    parId: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      statisDataOrigin: {},
      statisData: [],
    };
  },
  watch: {
    parId: {
      handler(newVal) {
        if (newVal && newVal.id) {
          this.getStatsInfo(newVal.id);
        }
      },
      deep: true,
    },
  },
  methods: {
    // 获取地区统计信息
    getStatsInfo(id) {
      // this.statisData = [];
      API.getStatsInfo({
        areaId: id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.statisDataOrigin = Res;
        } else {
          this.statisDataOrigin = {};
        }
        this.statisData = this.filterStatisData(this.statisDataOrigin);
      });
    },
    // 格式化统计信息
    filterStatisData(statsData) {
      let initStats = [];
      Object.keys(statsData).forEach((key) => {
        let _label = "";
        switch (key) {
          case "dataSetNums":
            _label = "数据集个数";
            break;
          case "dataSetAttrNums":
            _label = "数据标准属性个数";
            break;
          case "areaSpecNums":
            _label = "其中地区特性属性个数";
            break;
          case "cleanRuleNums":
            _label = "清洗规则条数";
            break;
          case "qualityRuleNums":
            _label = "质量规则条数";
            break;
          case "sectorNums":
            _label = "业务板块个数";
            break;
        }
        if (_label) {
          initStats.push({
            label: _label,
            value: statsData[key],
          });
        }
      });
      return initStats;
    },
    handleJump({ item }) {
      let url = "";
      switch (item.label) {
        case "业务板块个数":
          {
            url = "/dataStandardManage/editManage/classifyManage";
          }
          break;
        case "数据集个数":
          {
            url = "/dataStandardManage/editManage/dataSet";
          }
          break;
        case "数据标准属性个数":
          {
            url = "/dataStandardManage/editManage/dataStandAttr";
          }
          break;
        case "清洗规则条数":
          {
            url = "/dataStandardManage/ruleManage/cleanRules";
          }
          break;
        case "质量规则条数":
          {
            url = "/dataStandardManage/ruleManage/qualityRules";
          }
          break;
        default:
          break;
      }
      if (this.parId && this.parId.id) {
        console.log(this.parId,'~~~~')
        cellJump(this, {
          row: {
            areaId: Number(this.parId.id),
          },
          column: {
            name: "项目管理",
          },
          TClickItem: [
            {
              link: url,
              jump: {
                type: "int",
                mode: "push",
              },
            },
          ],
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.statistics-information {
  width: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  ul {
    padding: 20px;
    width: 100%;
    box-sizing: border-box;
    li {
      width: 100%;
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      p {
        font-size: 16px;
        float: left;
        &.name {
          width: 200px;
          float: left;
          text-align: right;
        }
        &.value {
          width: calc(100% - 200px);
          float: left;
          text-align: left;
        }
      }
    }
  }
}
</style>