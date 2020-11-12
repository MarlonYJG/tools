<!--
 * @Author: Marlon
 * @Date: 2020-07-21 09:12:20
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 14:18:59
 * @Description: 数据标准-发布管理-定板数据标准
--> 

<template>
  <div class="data-fixed">
    <div class="data-fixed-edit-area">
      <ul class="data-fixed-edit-area-btn">
        <li>
          <AddButton text="新增发布标准" @click="showFormDialog" :clickArgs="{type:'新增发布标准'}"></AddButton>
        </li>
        <li>
           <el-button type="warning" @click="linkTest">外链测试</el-button>
        </li>
      </ul>
      <ul class="data-fixed-edit-area-select">
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
    <div class="data-fixed-table">
      <TableDefault
        TId="datastand_01"
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
      @FDhandlerSelect="FDhandlerSelect"
    ></FormDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import Sortable from "sortablejs";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { cellJump } from "utils/jump";

export default {
  mixins: [mixin],
  components: {},
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
          {
            label: "查看详情",
            css: "text",
          },
        ],
      },
      tableTitle: [
        { label: "版本名称", prop: "versionName" },
        { label: "版本编号", prop: "versionNumber" },
        { label: "项目", prop: "areaName" },
        { label: "数据集个数", prop: "countDataSet" },
        { label: "属性个数", prop: "countDataSetAttr" },
        { label: "清洗规则条数", prop: "countCleanRules" },
        { label: "质量规则条数", prop: "countQualityRules" },
        { label: "发布人", prop: "issuePerson" },
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
        this.FDVisible = editItem.close;
        this.FDForm = [];
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
        case "新增发布标准":
          {
            this.FDTitle = "新增发布标准";
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
                type: "select",
                label: {
                  name: "业务板块",
                  width: "120",
                },
                width: "280",
                key: "businessSectorId",
                defaultModel: "",
                placeholder: "",
                option: [],
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
              businessSectorId: [
                {
                  required: true,
                  message: "请选择业务板块",
                  trigger: "change",
                },
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
        case "编辑":
          {
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "项目",
                  width: "120",
                },
                width: "280",
                key: "areaId",
                defaultModel: initDig.areaId,
                placeholder: "",
                option: this.proList,
              },
              {
                type: "select",
                label: {
                  name: "业务板块",
                  width: "120",
                },
                width: "280",
                key: "businessSectorId",
                defaultModel: initDig.businessSectorId,
                placeholder: "",
                option: [],
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
                defaultModel: initDig.versionNumber,
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
                defaultModel: initDig.versionName,
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
                defaultModel: initDig.isLock ? true : false,
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
                defaultModel: initDig.remark,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.getSectorList({
              areaId: initDig.areaId,
              type: "dig",
              initVal: initDig.businessSectorId,
            });
            this.FDRules = {
              areaId: [
                { required: true, message: "请选择项目", trigger: "change" },
              ],
              businessSectorId: [
                {
                  required: true,
                  message: "请选择业务板块",
                  trigger: "change",
                },
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
                      this.update({
                        ...row,
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
    // 下拉关联
    FDhandlerSelect({ item, form, val }) {
      if ("areaId" === item.key) {
        this.getSectorList({ areaId: val, type: "dig", initVal: "" });
        if (this.FDForm.length) {
          this.FDForm.forEach((item_, index) => {
            for (const key in form) {
              if (form.hasOwnProperty(key)) {
                if (item_.key === key) {
                  // TODO 添加初始化状态，根据特定的key
                  this.$set(this.FDForm[index], `defaultModel`, form[key]);
                }
              }
            }
          });
        }
      }
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      const {
        areaId,
        businessSectorId,
        versionNumber,
        versionName,
        isLock,
        remark,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "编辑",
              initDig: {
                areaId,
                businessSectorId,
                versionNumber,
                versionName,
                isLock,
                remark,
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
            cellJump(this, {
              row: {
                ...row,
                areaName: "数据定板标准名称",
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
    // 业务板块
    getSectorList({ areaId, type = "", initVal = "" }) {
      API.searchSectorDic({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          if (Res) {
            Res.forEach((item) => {
              item["value"] = item.id;
              item["label"] = item.name;
            });
            Res.unshift({
              value: 0,
              label: "全部板块",
            });
            this.$set(this.FDForm[1], `defaultModel`, initVal);
            this.$set(this.FDForm[1], `option`, Res);
          } else {
            this.$set(this.FDForm[1], `defaultModel`, initVal);
            this.$set(this.FDForm[1], `option`, []);
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
    // 获取
    getList() {
      this.TLoading = true;
      API.searchDataFixed({
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
      API.addDataFixed(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    del(id) {
      API.deleteDataFixed({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    update(req) {
      this.FDVisible = false;
      API.updateDataFixed(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
     // TODO 外链测试
    linkTest() {
      if (window.GST) {
        console.log(GST);
        GST.GSTTask.randerDom("myBadList");
        GST.GSTTask.rander();
        GST.GSTTask.APIGet({ a: 1, b: 2 });
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
.data-fixed {
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
}
</style>
