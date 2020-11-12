<!--
 * @Author: Marlon
 * @Date: 2020-08-03 13:58:54
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-05 11:54:05
 * @Description: 规则统计
--> 
<template>
  <div class="rules-s-page">
    <ul class="q">
      <li>
        <span>项目：</span>
        <el-select v-model="proVal" placeholder="请选择项目" @change="clearVals" clearable filterable>
          <el-option v-for="item in proList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </li>
      <li>
        <span>业务板块：</span>
        <el-select v-model="blockVal" placeholder="请选择业务板块" clearable filterable>
          <el-option v-for="item in blockList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </li>
    </ul>
    <el-tabs v-model="activeName">
      <el-tab-pane label="清洗规则统计" name="1">
        <div class="clear-r">
          <el-tree
            class="rules-tree"
            :highlight-current="true"
            node-key="id"
            :data="clearData"
            :props="defaultProps"
            @node-click="handleNodeClick"
          >
            <span class="nodeLabel" slot-scope="{ node }">
              <el-tooltip
                v-if="node.label.length > 18"
                effect="dark"
                :content="`${node.label}`"
                placement="left"
              >
                <span>{{ node.label }}</span>
              </el-tooltip>
              <span v-else>{{ node.label }}</span>
            </span>
          </el-tree>
          <div class="rt-content">
            <p>
              <i></i>
              <span>规则明细：</span>
            </p>
            <!-- 表格 -->
            <TableDefault
              TId="rs"
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
      </el-tab-pane>
      <el-tab-pane label="质量规则统计" name="2">
        <div class="quality">
          <el-tree
            class="rules-tree"
            :highlight-current="true"
            node-key="id"
            :data="qualityData"
            :props="defaultProps"
            @node-click="handleNodeClickQuality"
          >
            <span class="nodeLabel" slot-scope="{ node }">
              <el-tooltip
                v-if="node.label.length > 18"
                effect="dark"
                :content="`${node.label}`"
                placement="left"
              >
                <span>{{ node.label }}</span>
              </el-tooltip>
              <span v-else>{{ node.label }}</span>
            </span>
          </el-tree>
          <div class="rt-content">
            <p>
              <i></i>
              <span>规则明细：</span>
            </p>
            <!-- 表格 -->
            <TableDefault
              TId="qr"
              :TAlign="TAlign_2"
              :TLoading="TLoading_2"
              :TTitle="tableTitle_2"
              :TData="tableData_2"
              :TEdit="TEdit_2"
              :TIsShowPage="true"
              :TTotal="TPage_2.total"
              :TCurrentPage="TPage_2.index"
              :TPageSize="TPage_2.size"
              @changePage="changePage_2"
            ></TableDefault>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";

export default {
  mixins: [mixin],
  data() {
    return {
      // 检索条件
      proVal: "",
      proList: [],
      blockVal: "",
      blockList: [],
      activeName: "1",
      // 规则树
      clearData: [],
      qualityData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      activeTree_: "",
      activeTreeQ_: "",
      // 清洗规则 表格
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
        type: "switch",
        title: "状态",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "状态",
            css: "success",
            value: false,
          },
        ],
      },
      tableTitle: [
        { label: "规则编码", prop: "code" },
        { label: "规则名称", prop: "name" },
        { label: "规则内容", prop: "rulesContent" },
        { label: "对应数据集表", prop: "dataSetCode" },
        { label: "对应字段", prop: "dataSetAttrCode" },
        { label: "创建人", prop: "createPerson" },
        { label: "创建时间", prop: "createTime" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      TClickItem: [
        {
          link: "",
          cells: [],
        },
      ],
      // 质量规则 表格
      TLoading_2: false,
      TAlign_2: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit_2: {
        show: false,
        slot: false,
        type: "switch",
        title: "状态",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "状态",
            css: "success",
            value: false,
          },
        ],
      },
      tableTitle_2: [
        { label: "规则编码", prop: "code" },
        { label: "规则名称", prop: "name" },
        { label: "规则内容", prop: "rulesContent" },
        { label: "对应数据集表", prop: "dataSetCode" },
        { label: "对应字段", prop: "dataSetAttrCode" },
        { label: "创建人", prop: "createPerson" },
        { label: "创建时间", prop: "createTime" },
      ],
      tableData_2: [],
      TPage_2: {
        total: 0,
        index: 1,
        size: 10,
      },
      TClickItem_2: [
        {
          link: "",
          cells: [],
        },
      ],
    };
  },
  watch: {
    proVal(newVal) {
      if (newVal) {
        this.getSectorList({ areaId: newVal });
        this.getTree(newVal);
        this.getList();
        this.getQualityList();
      }
    },
    blockVal() {
      this.getList();
      this.getQualityList();
    },
    activeTree_: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        } else {
          this.tableData = [];
        }
      },
      deep: true,
    },
    activeTreeQ_: {
      handler(newVal) {
        if (newVal) {
          this.getQualityList();
        } else {
          this.tableData_2 = [];
        }
      },
      deep: true,
    },
  },
  methods: {
    // 规则树激活
    handleNodeClick(data) {
      this.activeTree_ = data;
    },
    handleNodeClickQuality(data) {
      this.activeTreeQ_ = data;
    },
    // 初始化查询值
    clearVals() {
      this.blockVal = "";
      this.blockList = [];
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 分页操作
    changePage_2({ pageSize, currentPage }) {
      this.$set(this.TPage_2, `index`, currentPage);
      this.$set(this.TPage_2, `size`, pageSize);
      this.getQualityList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {},
    loop(arr, newArr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            item.children.forEach((item_) => {
              newArr.push({
                ...item_,
                value: item_.id,
              });
            });
          }
          newArr.push({
            ...item,
            value: item.id,
          });
        });
      }
    },
    // 规则树处理
    treeLoop(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.count) {
            item["label"] = `${item.name}(${item.count})`;
          } else {
            item["label"] = `${item.name}`;
          }
          if (item.children && item.children.length) {
            this.treeLoop(item.children);
          } else {
            delete item.children;
          }
        });
      }
    },

    /* 请求 */
    // 获取 项目列表
    getProList() {
      API.getAreaList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        let proArr = [];
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          this.loop(Res.data.children.children, proArr);
        }
        if (proArr.length) {
          this.proVal = proArr[0].id;
        }
        this.proList = proArr;
      });
    },
    // 业务板块
    getSectorList({ areaId, type = "", initVal = "" }) {
      API.searchSectorDic({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.blockList = Res;
        } else {
          this.blockList = [];
        }
      });
    },
    // 规则树
    getTree(areaId) {
      API.getRulesTree({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res && Res.children && Res.children.length) {
          let clear_rules = [
            {
              ...Res.children[0],
            },
          ];
          this.treeLoop(clear_rules);
          let quality_rules = [
            {
              ...Res.children[1],
            },
          ];
          this.treeLoop(quality_rules);
          this.clearData = clear_rules;
          this.qualityData = quality_rules;
        } else {
          this.clearData = this.qualityData = [];
        }
      });
    },
    // 获取 清洗规则统计
    getList() {
      //
      /* 
        
         data.forEach(item => {
                  item["edit"] = {
                    show: true,
                    title: "状态",
                    fixed: "right",
                    width: 150,
                    slot: true,
                    type: "switch",
                    editTypes: [
                      {
                        label: "状态",
                        css: "success",
                        value: item.disable === 0 ? true : false
                      }
                    ]
                  };
                });
        
        */
      if (this.activeTree_ && this.proVal) {
        this.TLoading = true;
        API.detailClearRules({
          areaId: this.proVal,
          rulesId: this.activeTree_.id,
          businessSectorId: this.blockVal,
          pageNum: this.TPage.index,
          pageSize: this.TPage.size,
        })
          .then((res) => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "totalCount",
                },
              },
              "TLoading",
              this
            );
            if (Res.init()) {
              const { data, total, title } = Res.formatData();
              this.tableTitle = title;
              this.tableData = data;
              this.$set(this.TPage, `total`, total);
            } else {
              this.tableData = [];
              this.$set(this.TPage, `total`, 0);
            }
          })
          .catch((err) => {
            this.TLoading = false;
          });
      }
    },
    // 获取 质量规则统计
    getQualityList() {
      if (this.activeTreeQ_ && this.proVal) {
        this.TLoading_2 = true;
        API.detailClearRules({
          areaId: this.proVal,
          rulesId: this.activeTreeQ_.id,
          businessSectorId: this.blockVal,
          pageNum: this.TPage_2.index,
          pageSize: this.TPage_2.size,
        })
          .then((res) => {
            let Res = new ResDatas(
              {
                res,
                code: 0,
                fieldKey: {
                  data: "data",
                  title: "title",
                  total: "totalCount",
                },
              },
              "TLoading_2",
              this
            );
            if (Res.init()) {
              const { data, total, title } = Res.formatData();
              this.tableTitle_2 = title;
              this.tableData_2 = data;
              this.$set(this.TPage_2, `total`, total);
            } else {
              this.tableData_2 = [];
              this.$set(this.TPage_2, `total`, 0);
            }
          })
          .catch((err) => {
            this.TLoading_2 = false;
          });
      }
    },
  },
  mounted() {
    this.getProList();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.rules-s-page {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .q {
    overflow: hidden;
    margin-bottom: 5px;
    li {
      float: left;
      margin-right: 15px;
    }
  }
  /deep/ .el-tabs--bottom .el-tab-pane,
  .el-tabs--top .el-tab-pane {
    height: calc(100% - 37px);
  }
  // 清洗规则
  .clear-r,
  .quality {
    height: 100%;
  }
  .rules-tree {
    float: left;
    width: 300px;
    height: 100%;
    overflow: auto;
    box-sizing: border-box;
    border-right: 1px solid #d2d2d2;
    .nodeLabel {
      display: inline-block;
      width: 220px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      & > span {
        display: inline-block;
        width: inherit;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .rt-content {
    width: calc(100% - 307px);
    height: 100%;
    overflow: auto;
    float: left;
    margin-left: 5px;
    & > p {
      padding-left: 5px;
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
      i {
        position: absolute;
        top: 2px;
        width: 3px;
        height: 15px;
        background: $table_edit_btn_color_active;
      }
      span {
        display: inline-block;
        height: 18px;
        line-height: 18px;
        margin-left: 12px;
        font-size: 14px;
      }
    }
  }
}
</style>
