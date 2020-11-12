<!--
 * @Author: Marlon
 * @Date: 2020-07-25 13:19:04
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-25 18:35:14
 * @Description: 
--> 
<template>
  <div class="c-s">
    <div class="c-s-top">
      <TableDefault
        :TId="TId_y"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="true"
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
    <span class="c-s-mid" @click="fold = !fold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="c-s-bot">
      <p
        style="margin: 10px 5px;font-size: 14px;"
      >代码集“{{this.activeRow_ && this.activeRow_.name}}”的属性集</p>
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
      fold: true,
      activeRow_: "",
      // 代码集 表格
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
        { label: "分类", prop: "codeTypeName" },
        { label: "编码", prop: "code" },
        { label: "名称", prop: "name" },
        { label: "备注", prop: "remark" },
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
      //  代码集属性 列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "代码", prop: "code" },
        { label: "名称", prop: "name" },
        { label: "层级", prop: "hierarchy" },
        { label: "顺序", prop: "oder" },
        { label: "说明", prop: "instructions" },
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
    activeIndex: {
      handler(newVal) {
        if (newVal) {
          this.getList();
        }
      },
    },
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getFieldRules();
        } else {
          this.TableData = [];
        }
      },
      deep: true,
    },
  },
  methods: {
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getFieldRules();
    },
    clickRow({ row, column, id }) {
      this.TActiveRow = row.id;
      this.activeRow_ = row;
    },

    /* 请求 */
    // 代码集
    getList() {
      if (this.$route.query && this.$route.query.row) {
        const { areaId } = JSON.parse(this.$route.query.row);
        this.TLoading = true;
        // this.tableData = [];
        API.getCodeList({
          areaId,
          pageSize: this.TPage.size,
          pageNum: this.TPage.index,
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
    // 代码集属性
    getFieldRules() {
      if (this.activeRow_) {
        this.TableData = [];
        let req = {
          codeSetId: this.activeRow_.id,
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size,
        };
        this.TableDigLoading = true;
        API.getCodeAttrList(req)
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
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.c-s {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
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