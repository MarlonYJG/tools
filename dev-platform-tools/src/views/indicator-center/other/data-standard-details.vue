<!--
 * @Author: Marlon
 * @Date: 2020-02-21 08:28:50
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-22 14:17:06
 * @Description: 元数据-标准匹配详情
 -->
<template>
  <div class="data-detail">
    <div class="data-detail-top">
      <ul class="area-query">
        <li>
          <span>元数据：</span>
          <span>{{dsMappingId.dbName}}</span>
          <span>{{dsMappingId.projectName}}</span>
        </li>
        <li class="area-title-1">
          <span>数据标准：</span>
          <span>{{dsMappingId.dsName}}</span>
        </li>
        <li>
          <label for>匹配情况过滤：</label>
          <el-select
            v-model="dcMappingTypeVal"
            filterable
            placeholder="请选择"
            size="small"
            @change="handleOption('1',$event)"
          >
            <el-option
              v-for="item in dcMappingTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
      <div class="area-table">
        <TableDefault
          TId="1"
          :TAlign="TAlign"
          :TLoading="TLoading"
          :TTitle="tableTitle"
          :TEdit="TEdit"
          :TData="tableData"
          :TIsShowPage="true"
          :TTotal="TPage.total"
          :TCurrentPage="TPage.index"
          :TPageSize="TPage.size"
          @clickCell="lickCell"
          @changePage="changePage"
          @clickRow="clickRow"
        ></TableDefault>
      </div>
    </div>
    <span class="data-detail-mid" @click="handleFold">
      <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
      <i v-else class="el-icon-arrow-up up-dow"></i>
    </span>
    <div v-show="fold" class="data-detail-bot">
      <ul class="area-query">
        <li>
          <span>元数据表</span>
          <span>“{{dcMappingListItem?dcMappingListItem.tableName:''}} {{dcMappingListItem ? dcMappingListItem.dcName:''}}”</span>
        </li>
        <li class="area-title-2">
          <span>数据标准数据集</span>
          <span>“{{dcMappingListItem?dcMappingListItem.dcName:''}} {{dcMappingListItem?dcMappingListItem.dcCode:''}}”</span>
        </li>
        <li>
          <label for>匹配情况过滤：</label>
          <el-select
            v-model="dcAttrMappingTypeVal"
            filterable
            placeholder="请选择"
            size="small"
            @change="handleOption('2',$event)"
          >
            <el-option
              v-for="item in dcAttrMappingTypeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
      </ul>
      <p class="area-title">字段与属性匹配详情：</p>
      <div class="bot-table">
        <TableDefault
          TId="2"
          :TAlign="TAlign_1"
          :TLoading="TLoading_1"
          :TTitle="tableTitleBot"
          :TEdit="TEditBot"
          :TData="tableDataBot"
          :TIsShowPage="true"
          :TTotal="TPage_1.total"
          :TCurrentPage="TPage_1.index"
          :TPageSize="TPage_1.size"
          @changePage="changePage_1"
          @clickCell="lickCell"
        ></TableDefault>
      </div>
    </div>
    <!-- 弹出框 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
    ></FormDialog>
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
      dsMappingId: "",
      fold: false,
      // 数据集
      dcMappingTypeVal: "all",
      dcMappingTypeOption: [],
      // 数据集属性
      dcAttrMappingTypeVal: "",
      dcAttrMappingTypeOption: [],
      // 编辑-表格配置
      TLoading: false,
      TLoading_1: false,
      TAlign: [
        {
          key: "left",
          item: ["tableNameRemark", "dcName"]
        }
      ],
      TAlign_1: [
        {
          key: "left",
          item: ["columnNameRemark", "dcAttrName"]
        }
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: "160",
        fixed: "right",
        editTypes: [
          {
            label: "选择数据集",
            css: "warning"
          }
        ]
      },
      TEditBot: {
        show: true,
        title: "操作",
        width: "180",
        fixed: "right",
        editTypes: [
          {
            label: "选择数据标准属性",
            css: "warning"
          }
        ]
      },
      tableTitle: [
        { prop: "tableName", label: "数据表名称" },
        { prop: "tableNameRemark", label: "数据表中文名称" },
        { prop: "columnCount", label: "字段个数" },
        { prop: "dcCode", label: "数据集编码" },
        { prop: "dcName", label: "数据集名称" },
        { prop: "dcAttrCount", label: "数据集属性个数" },
        { prop: "mappingDcAttrCount", label: "匹配数据集属性个数" },
        { prop: "gmtCreate", label: "创建时间" }
      ],
      tableData: [],
      tableTitleBot: [
        { prop: "columnName", label: "字段名称" },
        { prop: "columnNameRemark", label: "字段中文名称" },
        { prop: "dcAttrCode", label: "数据集属性编码" },
        { prop: "dcAttrName", label: "数据集属性名称" },
        { prop: "gmtCreate", label: "创建时间" }
      ],
      tableDataBot: [],
      TPage: {
        index: 1,
        total: 0,
        size: 10
      },
      TPage_1: {
        index: 1,
        total: 0,
        size: 10
      },
      // 弹出框
      FDId: "1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: []
      },
      FDRules: {},
      dcListData: [], // 数据集
      dcAttrListData: [], //数据标准
      // 数据集属性对象
      dcMappingListItem: "",
      // 临时变量
      tableActive_: ""
    };
  },
  watch: {
    dcMappingListItem: function(newVal) {
      if (newVal) {
        this.dcAttrMappingList(newVal.id);
        this.dcAttrList(newVal);
      }
    }
  },
  methods: {
    handleFold() {
      this.fold = !this.fold;
    },
    // 表格-回调
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        console.log("删除");
      } else if (text === "close") {
        this.FDVisible = editItem.close;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "选择数据集":
          {
            this.FDTitle = "选择数据集";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据集",
                  width: "150"
                },
                key: "dcId",
                width: "200",
                defaultModel: initDig.dcId,
                placeholder: "",
                option: this.dcListData
              }
            ];
            this.FDRules = {
              dcId: [
                { required: true, message: "请选择数据集", trigger: "change" }
              ]
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      console.log(form, "11");
                      this.setdcReMapping(form);
                    }
                  });
                }
              }
            ]);
          }
          return;
        case "选择数据标准属性":
          {
            this.FDTitle = "选择数据标准属性";
            this.FDVisible = true;
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据标准属性",
                  width: "150"
                },
                key: "dcAttrName",
                width: "210",
                defaultModel: initDig.dcAttrName,
                placeholder: "",
                option: this.dcAttrListData
              }
            ];
            this.FDRules = {
              dcAttrName: [
                {
                  required: true,
                  message: "请选择数据标准属性",
                  trigger: "change"
                }
              ]
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate(valid => {
                    if (valid) {
                      this.setDcAttrReMapping(form);
                    }
                  });
                }
              }
            ]);
          }
          return;
        default:
          return;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.dcMappingList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.dcAttrMappingList(this.dcMappingListItem.id);
    },
    // 单元格
    lickCell({ row, column, id }) {
      this.tableActive_ = row;
      switch (column.label) {
        case "选择数据集":
          {
            const { dcId } = row;
            this.showDialog({
              type: column.label,
              initDig: {
                dcId
              }
            });
          }
          return;
        case "选择数据标准属性":
          {
            console.log(row);
            const { dcAttrName } = row;
            this.showDialog({
              type: column.label,
              initDig: {
                dcAttrName
              }
            });
          }
          return;
        default:
          break;
      }
    },
    // 点击行
    clickRow({ row, column, id }) {
      this.dcMappingListItem = row;
    },
    // 下拉选择
    handleOption(type, val) {
      switch (type) {
        case "1":
          {
            this.dcMappingList();
            this.dcAttrMappingTypeVal = "all";
          }
          return;
        case "2":
          {
            this.dcAttrMappingList(this.dcMappingListItem.id);
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 数据集匹配类型列表
    dcMappingTypeList() {
      API.dcMappingTypeList().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let dcMapping_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            dcMapping_.push({
              label: item.name,
              value: item.code
            });
          });
          this.dcMappingTypeVal = Res[0].code;
        }
        this.dcMappingTypeOption = dcMapping_;
      });
    },
    // 数据集属性匹配
    dcAttrMappingTypeList() {
      API.dcAttrMappingTypeList().then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let dcAttr_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            dcAttr_.push({
              label: item.name,
              value: item.code
            });
          });
          this.dcAttrMappingTypeVal = dcAttr_[0].value;
        }
        this.dcAttrMappingTypeOption = dcAttr_;
      });
    },
    // 获取 数据集列表
    dcMappingList() {
      this.TLoading = true;
      API.dcMappingList({
        dsMappingId: this.dsMappingId.id,
        dcMappingType: this.dcMappingTypeVal,
        pageNo: this.TPage.index,
        pageSize: this.TPage.size
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
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total, pageSize } = Res.formatData();
            this.tableTitle = title;
            this.tableData = data;
            this.TPage = {
              total,
              index: this.TPage.index,
              size: pageSize
            };
            if (data && data.length) {
              this.dcMappingListItem = data[0];
            } else {
              this.dcMappingListItem = "";
              this.tableData = [];
              this.tableDataBot = [];
              this.$set(this.TPage_1, `total`, 0);
              this.$set(this.TPage, `total`, 0);
            }
          } else {
            this.tableData = [];
            this.tableDataBot = [];
            this.$set(this.TPage_1, `total`, 0);
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 获取 数据集属性列表
    dcAttrMappingList(dcMappingId) {
      if (dcMappingId) {
        this.TLoading_1 = true;
        API.dcAttrMappingList({
          dcMappingId,
          dcAttrMappingType: this.dcAttrMappingTypeVal,
          pageNo: this.TPage_1.index,
          pageSize: this.TPage_1.size
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
              "TLoading_1",
              this
            );
            if (Res.init()) {
              const { data, title, total, pageSize } = Res.formatData();
              this.tableTitleBot = title;
              this.tableDataBot = data;
              this.TPage_1 = {
                total,
                index: this.TPage_1.index,
                size: pageSize
              };
            } else {
              this.tableDataBot = [];
              this.$set(this.TPage_1, `total`, 0);
            }
          })
          .catch(error => {
            this.TLoading_1 = false;
            console.error(error);
          });
      }
    },
    // 数据集列表
    dcList() {
      API.dcList({
        dataStandardId: this.dsMappingId.dsId
      }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        let dc_ = [];
        if (Res && Res.length) {
          Res.forEach(item => {
            dc_.push({
              value: item.id,
              label: item.name,
              type: item.type
            });
          });
        }
        this.dcListData = dc_;
      });
    },
    // 数据集属性 标准匹配列表
    dcAttrList(dcItem) {
      if (dcItem && dcItem.dcId && dcItem.dcType) {
        API.dcAttrList({
          dcId: dcItem.dcId,
          dcType: dcItem.dcType
        }).then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          let dcAtt_ = [];
          if (Res && Res.length) {
            Res.forEach(item => {
              dcAtt_.push({
                label: item.name,
                value: item.name,
                type: item.type,
                id: item.id
              });
            });
          }
          this.dcAttrListData = dcAtt_;
        });
      }
    },
    // 更新数据集列表
    setdcReMapping(req) {
      let type = "";
      if (this.dcListData.length) {
        this.dcListData.forEach(item => {
          if (req.dcId === item.value) {
            type = item.type;
          }
        });
      }
      API.setDcReMapping({
        dcMappingId: this.tableActive_.id,
        dcId: req.dcId,
        dcType: type
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.dcMappingList();
      });
    },
    // 更新数据集属性列表
    setDcAttrReMapping(req) {
      let type = "";
      let dcAttrId = "";
      if (this.dcAttrListData.length) {
        this.dcAttrListData.forEach(item => {
          if (req.dcAttrName === item.value) {
            type = item.type;
            dcAttrId = item.id || -1;
          }
        });
      }
      API.setDcAttrReMapping({
        dcAttrMappingId: this.tableActive_.id,
        dcAttrId,
        dcAttrType: type,
        dcAttrName: req.dcAttrName
      }).then(res => {
        new ResDatas({
          res,
          code: 0
        }).state();
        this.FDVisible = false;
        this.dcAttrMappingList(this.dcMappingListItem.id);
      });
    }
  },
  mounted() {
    this.dcMappingTypeList();
    this.dcAttrMappingTypeList();
    if (this.$route.query.row) {
      let paramsUrl = JSON.parse(this.$route.query.row);
      this.dsMappingId = paramsUrl;
      this.dcMappingList();
      this.dcList();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.data-detail {
  padding: 20px;
  min-width: 1300px;
  width: calc(100% - 10px);
  height: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  // border: 1px solid red;
  overflow: auto;
  display: flex;
  flex-direction: column;
  .area-query {
    float: left;
    width: 100%;
    overflow: hidden;
    margin-top: 5px;
    li {
      float: left;
      height: 32px;
      line-height: 30px;
      &:first-child {
        float: left;
        margin-left: 30px;
      }
      &:last-child {
        float: right;
        margin-right: 30px;
      }
    }
  }
  .area {
    &-title-1 {
      margin-left: 300px;
    }
    &-title-2 {
      margin-left: 80px;
    }
    &-title {
      float: left;
      height: 32px;
      line-height: 30px;
      margin: 5px 30px 0;
    }
  }
  &-top {
    width: 100%;
    height: 100px;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    overflow: auto;
    .area-table {
      margin-top: 40px;
      width: 100%;
      height: calc(100% - 40px);
      overflow: auto;
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
    height: 100px;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
    overflow: auto;
    .bot-table {
      margin-top: 40px;
      width: 100%;
      height: calc(100% - 75px);
      overflow: auto;
    }
  }
  /deep/ .el-table th {
    padding: 8px 0 !important;
  }
}
</style>