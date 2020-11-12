<!--
 * @Author: Marlon
 * @Date: 2020-07-22 16:20:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-27 08:59:21
 * @Description: 数据标准-规则管理-数据清洗规则
--> 

<template>
  <div class="clear-rules">
    <div class="clear-rules-edit-area">
      <ul>
        <li>
          <label for>项目：</label>
          <el-select
            v-model="proVal"
            clearable
            filterable
            placeholder="请选择项目"
            size="small"
            @change="clearVals(1)"
          >
            <el-option
              v-for="item in proList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>业务板块：</label>
          <el-select
            v-model="blockVal"
            filterable
            clearable
            placeholder="请选择业务板块"
            size="small"
            @change="clearVals(2)"
          >
            <el-option v-for="item in blockList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </li>
        <li>
          <label for>数据集分类：</label>
          <el-select
            v-model="classifyVal"
            clearable
            filterable
            placeholder="请选择分类"
            size="small"
            @change="clearVals(3)"
          >
            <el-option
              v-for="item in classifyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>数据集：</label>
          <el-select
            v-model="dataSetValList"
            clearable
            filterable
            placeholder="请选择数据集"
            size="small"
          >
            <el-option
              v-for="item in dataSetList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <!-- 行规则、字段规则 -->
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="行规则" name="1">
        <LineRules
          :activeIndex="activeIndex"
          :areaId="proVal"
          :businessSectorId="blockVal"
          :businessStageId="classifyVal"
          :dataSetId="dataSetValList"
        />
      </el-tab-pane>
      <el-tab-pane label="字段规则" name="2">
        <FieldRules
          :activeIndex="activeIndex"
          :areaId="proVal"
          :businessSectorId="blockVal"
          :businessStageId="classifyVal"
          :dataSetId="dataSetValList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";

import FieldRules from "./field";
import LineRules from "./line";

export default {
  components: {
    FieldRules,
    LineRules
  },
  data() {
    return {
      // 查询条件
      proVal: "",
      proList: [],
      classifyList: [],
      classifyVal: "",
      blockList: [],
      blockVal: "",
      dataSetList: [],
      dataSetValList: "",
      // 标签切换
      activeIndex: "1"
    };
  },
  watch: {
    proVal(newVal) {
      if (newVal) {
        this.getSectorList({ areaId: newVal });
      }
    },
    blockVal(newVal) {
      if (newVal) {
        this.getSortList({ sectorId: newVal });
      }
    },
    classifyVal(newVal) {
      if (newVal) {
        this.getDataSet({ stageId: newVal });
      }
    }
  },
  methods: {
    // 初始化查询值
    clearVals(type) {
      if (1 == type) {
        this.blockVal = "";
        this.blockList = [];
        this.classifyVal = "";
        this.classifyList = [];
        this.dataSetList = [];
        this.dataSetValList = "";
      } else if (2 == type) {
        this.classifyVal = "";
        this.classifyList = [];
        this.dataSetList = [];
        this.dataSetValList = "";
      } else {
        this.dataSetList = [];
        this.dataSetValList = "";
      }
    },
    loop(arr, newArr) {
      if (arr && arr.length) {
        arr.forEach(item => {
          if (item.children && item.children.length) {
            item.children.forEach(item_ => {
              newArr.push({
                ...item_,
                value: item_.id
              });
            });
          }
          newArr.push({
            ...item,
            value: item.id
          });
        });
      }
    },
    // 下拉初始化值
    handleChange(type, value) {
      switch (type) {
        case "areaId":
          {
            this.$set(this.dataSetForm, `businessSectorId`, "");
            this.$set(this.dataSetForm, `businessStageId`, "");
            this.$set(this.dataSetForm, `dataSetId`, "");
            this.businessSectorDic = [];
            this.dataClassifyDic = [];
            this.dataSetDic = [];
          }
          return;
        case "businessSectorId":
          {
            this.$set(this.dataSetForm, `businessStageId`, "");
            this.$set(this.dataSetForm, `dataSetId`, "");
            this.dataClassifyDic = [];
            this.dataSetDic = [];
          }
          return;
        case "businessStageId":
          {
            this.$set(this.dataSetForm, `dataSetId`, "");
            this.dataSetDic = [];
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 获取 项目列表
    getProList({ init }) {
      API.getAreaList().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let proArr = [];
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          this.loop(Res.data.children.children, proArr);
          if (init) {
            // this.proVal = proArr[0].value;
          }
        }
        this.proList = proArr;
      });
    },
    // 业务板块
    getSectorList({ areaId, type = "", initVal = "" }) {
      API.searchSectorDic({ areaId }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.businessSectorDic = Res;
          } else {
            this.businessSectorDic = [];
          }
        } else {
          if (Res) {
            this.blockList = Res;
          } else {
            this.blockList = [];
          }
        }
      });
    },
    // 数据集分类
    getSortList({ sectorId, type = "", initVal = "" }) {
      API.getStageClassifyDic({
        sectorId
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.dataClassifyDic = Res;
          } else {
            this.dataClassifyDic = [];
          }
        } else {
          if (Res) {
            this.classifyList = Res;
          } else {
            this.classifyList = [];
          }
        }
      });
    },
    // 数据集
    getDataSet({ stageId, type = "", initVal = "" }) {
      API.getStageDic({
        stageId
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.dataSetDic = Res;
          } else {
            this.dataSetDic = [];
          }
        } else {
          if (Res) {
            Res.forEach(item => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.dataSetList = Res;
          } else {
            this.dataSetList = [];
          }
        }
      });
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { name } = JSON.parse(this.$route.query.column);
      if ("项目管理" === name) {
        const { areaId } = JSON.parse(this.$route.query.row);
        this.proVal = areaId;
      } else {
      }
    }
    this.getProList({ init: true });
  }
};
</script>

<style lang="scss" scoped>
.clear-rules {
  width: 100%;
  height: 100%;
  overflow: hidden;
  &-edit-area {
    overflow: hidden;
    & > ul {
      float: left;
      overflow: hidden;
      & > li {
        float: left;
        margin: 4px 15px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 80px);
  }
}
</style>
