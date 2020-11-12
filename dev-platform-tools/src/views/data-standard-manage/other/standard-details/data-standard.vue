<!--
 * @Author: Marlon
 * @Date: 2020-07-25 13:18:46
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 16:38:50
 * @Description: 数据标准
--> 
<template>
  <div class="d-s">
    <ul class="q">
      <li>
        <label for>业务板块：</label>
        <el-select v-model="blockVal" filterable clearable placeholder="请选择业务板块" size="small">
          <el-option
            v-for="item in blockList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            @change="clearVals"
          ></el-option>
        </el-select>
      </li>
      <li>
        <label for>数据集分类：</label>
        <el-select v-model="classifyVal" clearable filterable placeholder="请选择分类" size="small">
          <el-option
            v-for="item in classifyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </li>
    </ul>
    <div class="d-s-top">
      <TableDefault
        :TId="TId_y"
        :THeight="400"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="false"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TEdit="TEdit"
        :TAlign="TAlign"
        :TActiveRow="TActiveRow"
        TRowKey="id"
        :TClickItem="TClickItem"
        @clickRow="clickRow"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <span class="d-s-mid" @click="fold = !fold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="d-s-bot">
      <p
        style="margin: 10px 5px;font-size: 14px;"
      >数据集“{{this.activeRow_ && this.activeRow_.name}}”的属性集</p>
      <div>
        <TableDefault
          :TId="TId"
          :TCurrentTid="TId"
          :TLoading="TableDigLoading"
          :TTitle="TableTitle"
          :TData="TableData"
          :TIsShowPage="true"
          :TTotal="TPage_1.total"
          :TCurrentPage="TPage_1.index"
          :TPageSize="TPage_1.size"
          :TEdit="TEdit_1"
          :TAlign="TAlign_1"
          :TClickItem="TClickItem_1"
          @changePage="changePage_1"
        ></TableDefault>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";

export default {
  mixins: [mixin],
  props: {
    activeIndex: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 检索条件
      blockList: [],
      blockVal: "",
      classifyList: [],
      classifyVal: "",
      // 布局
      fold: true,
      activeRow_: "",
      // 数据标准 表格
      TId_y: "bussiness",
      TLoading: false,
      TActiveRow: 0,
      TEdit: {
        show: false,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
        ],
      },
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      tableTitle: [
        { label: "业务板块名称", prop: "sectorName" },
        { label: "数据集分类名称", prop: "stageName" },
        { label: "数据集编码", prop: "code" },
        { label: "数据集名称", prop: "name" },
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
      //  数据标准属性 列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "属性编码", prop: "code" },
        { label: "属性名称", prop: "name" },
        { label: "数据类型", prop: "dataType" },
        { label: "数据格式", prop: "dataFormat" },
        { label: "值域", prop: "domain" },
      ],
      TableDigLoading: false,
      TPage_1: {
        total: 0,
        index: 1,
        size: 10,
      },
      TEdit_1: {
        show: false,
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
        ],
      },
      TAlign_1: [
        {
          key: "left",
          item: [],
        },
      ],
      TClickItem_1: [
        {
          link: "",
          cells: [],
        },
      ],
    };
  },
  watch: {
    blockVal(newVal) {
      if (newVal) {
        this.getSortList(newVal);
      }
      this.getCollection();
    },
    classifyVal(newVal) {
      this.getCollection();
    },
    activeIndex: {
      handler(newVal) {
        if (newVal) {
          this.getCollection();
        }
      },
      immediate: true,
    },
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getCollectionAttr();
        } else {
          this.TableData = [];
        }
      },
      deep: true,
    },
  },
  methods: {
    // 初始化查询值
    clearVals() {
      this.classifyVal = "";
      this.classifyList = [];
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getCollection();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getCollectionAttr();
    },
    clickRow({ row, column, id }) {
      this.TActiveRow = row.id;
      this.activeRow_ = row;
    },

    /* 请求 */
    // 业务板块
    getSectorList(dataFixedId) {
      API.getFixedSectorList({ dataFixedId }).then((res) => {
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
    // 数据集分类
    getSortList(fixedSectorId) {
      API.getFixedStageDic({
        fixedSectorId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.classifyList = Res;
        } else {
          this.classifyList = [];
        }
      });
    },
    // 数据标准 列表
    getCollection() {
      if (this.$route.query && this.$route.query.row) {
        const { id, fixedDataId, areaName } = JSON.parse(this.$route.query.row);
        let dataFixedId_ = "";
        if ("数据采集标准名称" == areaName) {
          dataFixedId_ = fixedDataId;
        } else {
          dataFixedId_ = id;
        }
        this.TLoading = true;
        this.tableData = [];
        API.detailCollection({
          sectorId: this.blockVal,
          stageId: this.classifyVal,
          dataFixedId: dataFixedId_,
        }).then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "totalCount",
              },
              titleKey: [],
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, title } = Res.formatData();
            if (data && data.length) {
              this.TActiveRow = data[0].id;
              this.activeRow_ = data[0];
            } else {
              this.activeRow_ = "";
            }
            this.tableTitle = title;
            this.tableData = data;
            this.$set(this.TPage, `total`, total);
          } else {
            this.activeRow_ = "";
            this.tableData = [];
            this.$set(this.TPage, `total`, 0);
          }
        });
      }
    },
    // 标准属性 列表
    getCollectionAttr() {
      if (this.activeRow_) {
        this.TableData = [];
        let req = {
          dataSetId: this.activeRow_.id,
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size,
        };
        this.TableDigLoading = true;
        API.getFixedDataSetAttrList(req)
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
                titleKey: [],
              },
              "TableDigLoading",
              this
            );
            if (Res.init()) {
              const { data, total, title } = Res.formatData();
              this.TableTitle = title;
              this.TableData = data;
              this.$set(this.TPage_1, `total`, total);
            } else {
              this.TableData = [];
              this.$set(this.TPage_1, `total`, 0);
            }
          })
          .catch((error) => {
            this.TableDigLoading = false;
          });
      }
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      console.log(JSON.parse(this.$route.query.row))
      const { id, fixedDataId, areaName } = JSON.parse(this.$route.query.row);
      if ("数据采集标准名称" == areaName) {
        this.getSectorList(id);
      } else {
        this.getSectorList(id);
      }
      this.getCollection();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.d-s {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .q {
    li {
      float: left;
      margin-right: 15px;
    }
  }
  &-top {
    width: 100%;
    // height: 44%;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
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
        li {
          float: left;
          margin-right: 20px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    &-table {
      margin: 20px 0;
    }
  }
  &-mid {
    display: inline-block;
    height: 30px;
    width: 100%;
    box-sizing: border-box;
    // border: 1px solid red;
    text-align: center;
    cursor: pointer;
    background: $fold_bg;
    .up-dow {
      font-weight: bolder;
      font-size: 30px;
    }
  }
  &-bot {
    width: 100%;
    // height: 44%;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    .bot-data-set-edit {
      margin-left: 15px;
    }
  }
}
</style>