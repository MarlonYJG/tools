<!--
 * @Author: Marlon
 * @Date: 2020-07-24 21:26:49
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-03 08:56:20
 * @Description: 数据标准-发布管理-采集标准
--> 

<template>
  <div class="collection">
    <div class="collection-edit-area">
      <ul class="collection-edit-area-btn">
        <li>
          <AddButton text="新增采集标准" @click="showFormDialog" :clickArgs="{type:'新增采集标准'}"></AddButton>
        </li>
      </ul>
      <ul class="collection-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select v-model="proVal" clearable filterable placeholder="请选择项目" size="small">
            <el-option
              v-for="item in proList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input
            placeholder="请输入版本编号(名称)"
            v-model="dataSetVal"
            size="small"
            style="width: 195px;"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"
              @click="getList"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="collection-table">
      <TableDefault
        TId="collection"
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TClickItem="TClickItem"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
      ></TableDefault>
    </div>
    <!-- 表单 -->
    <FormDialog
      :FDId="FDId"
      :FDVisible="FDVisible"
      :FDTitle="FDTitle"
      FDWidth="500"
      :FDForm="FDForm"
      :FDFoot="FDFoot"
      :FDRules="FDRules"
      @editBtnCb="editBtnCb"
      @FDUploadFiles="FDUploadFiles"
    ></FormDialog>
    <!-- 导出 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="650"
      @editBtnCb="editBtnCb"
    >
      <ul class="collection-list" slot="soltDigContent">
        <li v-for="(item,index) in fixedSectorDic" :key="index">
          <span>{{item.label}}</span>
          <el-button
            type="primary"
            icon="el-icon-download"
            size="mini"
            @click="handleClick(item.value)"
          ></el-button>
        </li>
      </ul>
    </SoltDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import Sortable from "sortablejs";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { cellJump } from "utils/jump";
import SoltDialog from "@/components/dialog/solt-dialog";
import { _ExportExcel } from "utils/index";
import { BaseUrl } from "api/data-standard-manage";

export default {
  mixins: [mixin],
  components: { SoltDialog },
  data() {
    return {
      // 查询条件
      proVal: "",
      proList: [],
      dataSetVal: "",
      blockList: [],
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit: {
        show: true,
        title: "操作",
        width: 350,
        fixed: "right",
        editTypes: [
          {
            label: "删除",
            css: "text",
            pass: true,
          },
          {
            label: "从标准生成",
            css: "text",
          },
          {
            label: "查看详情",
            css: "text",
          },
          {
            label: "导出Excel",
            css: "text",
          },
          {
            label: "导入Excel",
            css: "text",
          },
        ],
      },
      tableTitle: [
        { label: "数据采集标准名称", prop: "versionName" },
        { label: "版本编号", prop: "versionNumber" },
        { label: "项目", prop: "areaName" },
        { label: "数据集个数", prop: "countDataSet" },
        { label: "属性个数", prop: "countDataSetAttr" },
        { label: "数据来源", prop: "dataSourceStr" },
        { label: "发布人", prop: "createPersion" },
        { label: "发布时间", prop: "createTime" },
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
      // 弹出框
      FDId: "form_dialog_1",
      FDVisible: false,
      FDForm: [],
      FDTitle: "",
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 弹出框-导出
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      fixedSectorDic: [],
      activeRow_: "",
    };
  },
  watch: {
    proVal(newVal) {
      if (newVal) {
      }
      this.getList();
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.FDVisible = this.SoltDigShow = editItem.close;
        this.FDForm = [];
        this.fixedSectorDic = [];
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 表单
    showFormDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增采集标准":
          {
            this.FDTitle = "新增采集标准";
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "areaId",
                defaultModel: "",
                placeholder: "",
                option: this.proList,
              },
              {
                type: "input",
                label: {
                  name: "版本编码",
                  width: "120",
                },
                key: "versionNumber",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "版本名称",
                  width: "120",
                },
                key: "versionName",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "switch",
                show: false,
                label: {
                  name: "锁定",
                  width: "120",
                },
                width: "200",
                key: "isLock",
                defaultModel: false,
                placeholder: "",
                off: {
                  label: "否",
                },
                on: {
                  label: "是",
                  color: "#13ce66",
                },
              },
              {
                type: "textarea",
                label: {
                  name: "备注",
                  width: "120",
                },
                key: "remark",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.FDRules = {
              areaId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              versionNumber: [
                { required: true, message: "请输入编码", trigger: "blur" },
              ],
              versionName: [
                { required: true, message: "请输入名称", trigger: "blur" },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.add({
                        ...form,
                        isLock: form.isLock ? 1 : 0,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case "从标准生成":
          {
            this.FDTitle = "数据标准生成采集标准";
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "数据标准",
                  width: "120",
                },
                width: "280",
                key: "fixedDataId",
                defaultModel: "",
                placeholder: "",
                option: [],
              },
            ];
            this.getFixed(initDig.areaId);
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.setStandard({
                        id: row.id,
                        areaId: row.areaId,
                        fixedDataId: form.fixedDataId || row.fixedDataId,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        default:
          break;
      }
    },
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
    // 单元格事件
    lickCell({ row, column, id }) {
      const { areaId, versionName, fixedDataId = "" } = row;
      switch (column.label) {
        case "从标准生成":
          {
            this.showFormDialog({
              type: "从标准生成",
              initDig: {
                areaId,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${versionName}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.del(row.id);
              })
              .catch(() => {});
          }
          return;
        case "查看详情":
          {
            if (fixedDataId) {
              cellJump(this, {
                row: {
                  ...row,
                  areaName: "数据采集标准名称",
                },
                column,
                TClickItem: [
                  {
                    link: "/other/standardDetails",
                    jump: {
                      type: "int",
                      mode: "push",
                    },
                  },
                ],
              });
            } else {
              this.$message({
                message: "该采集标准无数据，无法查看详情!",
                type: "warning",
              });
            }
          }
          return;
        case "导出Excel":
          {
            this.SoltDigShow = true;
            this.SoltDigTitle = "导出excel-业务板块";
            this.activeRow_ = row;
            this.getFixedSectorList(row.fixedDataId);
          }
          return;
        case "导入Excel":
          {
            this.FDTitle = "导入Excel";
            this.FDForm = [
              {
                type: "upload",
                label: {
                  name: "",
                  width: "120",
                },
                width: "280",
                key: "importExcel",
                url: API.collectionImportExcel(),
                defaultModel: [],
                placeholder: "",
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "关 闭",
                cb: (form, $this) => {
                  this.FDVisible = false;
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        default:
          break;
      }
    },
    // 文件上传回调
    FDUploadFiles({
      type,
      file,
      response = null,
      err = null,
      fileList = null,
    }) {
      switch (type) {
        case "success":
          {
            this.$message({
              message: "上传成功!",
              type: "success",
            });
          }
          return;
        case "error":
          {
            this.$message({
              message: "上传失败",
              type: "error",
            });
          }
          return;
        default:
          break;
      }
    },

    /* 请求 */
    // 获取 项目列表
    getProList({ init }) {
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
          if (init) {
            // this.proVal = proArr[0].value;
          }
        }
        this.proList = proArr;
      });
    },
    // 数据标准
    getFixed(areaId) {
      API.dataFixedDic({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.versionName;
            item["value"] = item.id;
          });
          this.$set(this.FDForm[0], `option`, Res);
        } else {
          this.$set(this.FDForm[0], `option`, []);
        }
      });
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.searchCollectionList({
        areaId: this.proVal,
        pageNum: this.TPage.index,
        pageSize: this.TPage.size,
        likeStr: this.dataSetVal,
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
              titleKey: [],
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, total, title } = Res.formatData();
            if (title && title.length) {
              title.forEach((item, i) => {
                if (item.label === "操作") {
                  title.splice(i, 1);
                }
              });
            }
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
    },
    // 新增
    add(req) {
      this.FDVisible = false;
      API.addCollection(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    del(id) {
      API.deleteCollection({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 从标准生成
    setStandard(req) {
      this.FDVisible = false;
      API.generateCollection(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 获取要导出的业务板块列表
    getFixedSectorList(dataFixedId) {
      API.searchFixedSectorList({
        dataFixedId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.name;
            item["value"] = item.id;
          });
          this.fixedSectorDic = Res;
        } else {
          this.fixedSectorDic = [];
        }
      });
    },
    // 导出Excel
    handleClick(id) {
      if (this.activeRow_ && this.activeRow_.id) {
        _ExportExcel(
          BaseUrl +
            "/collection/exportExcel?id=" +
            this.activeRow_.id +
            "&sectorId=" +
            id
        );
      }
    },
  },
  mounted() {
    // if (this.$route.query && this.$route.query.row) {
    //   let paramsUrl = JSON.parse(this.$route.query.row);
    //   this.selectVal = paramsUrl.id;
    //   this.getProjectList({ init: false });
    // } else {
    //   this.getProjectList({ init: true });
    // }
    this.getProList({ init: true });
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.collection {
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
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
  .collection-list {
    overflow: hidden;
    li {
      padding: 2px;
      text-align: left;
      span {
        display: inline-block;
        width: 150px;
        margin-right: 10px;
        text-align: left;
        // margin-right: 100px;
      }
    }
  }
}
</style>
