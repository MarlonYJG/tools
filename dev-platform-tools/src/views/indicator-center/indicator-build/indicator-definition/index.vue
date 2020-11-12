<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 08:46:31
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-09 15:25:48
 * @Description: 指标构建-指标定义
--> 
<template>
  <div class="page-indicator">
    <el-tabs v-model="activeName" style="height:auto;">
      <el-tab-pane label="指标定义" name="1"></el-tab-pane>
    </el-tabs>
    <div class="page-indicator-area">
      <ul class="page-indicator-area-btn">
        <li>
          <AddButton text="新建指标" @click="showSoltDig" :clickArgs="{type:'新建指标'}"></AddButton>
        </li>
        <li>
          <el-button size="medium" @click="dels">删除</el-button>
        </li>
        <li>
          <el-button size="medium" @click="effectiveBatches">批量生效</el-button>
        </li>
        <li>
          <el-button size="medium" @click="batchFailure">批量失效</el-button>
        </li>
        <li>
          <el-button size="medium" @click="excelExp">Excel导出</el-button>
        </li>
      </ul>
      <ul class="page-indicator-area-query">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="proVal"
            clearable
            placeholder="请选择项目"
            size="medium"
            @change="handleChange(1,$event)"
            style="width: 125px;"
          >
            <el-option
              v-for="item in proOption"
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
            clearable
            placeholder="请选择业务板块"
            size="medium"
            @change="handleChange(2,$event)"
            style="width: 150px;"
          >
            <el-option
              v-for="item in blockOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>数据域：</label>
          <el-select
            v-model="areaVal"
            clearable
            placeholder="请选择交易域"
            size="medium"
            style="width: 150px;"
          >
            <el-option
              v-for="item in areaOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <el-input placeholder="请输入指标名称" v-model="search" size="medium" style="width: 150px;">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              @click="getList"
              style="cursor: pointer;"
            ></i>
          </el-input>
        </li>
      </ul>
    </div>
    <div class="page-indicator-table">
      <TableDefault
        TId="indicator-table"
        :TAlign="TAlign"
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TEdit="TEdit"
        :TIsShowPage="true"
        :TIsShowCheckBox="true"
        :TTotal="TPage.total"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TRowDrop="true"
        @handleSelectionChange="handleSelectionChange"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage"
        @rowDrop="rowDrop"
      ></TableDefault>
    </div>
    <!-- 弹出框 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        slot="soltDigContent"
        size="medium"
        :disabled="soltFormDis"
      >
        <el-form-item label="所属项目：" prop="soltProject">
          <el-select v-model="ruleForm.soltProject" placeholder="请选择项目" @change="handlerClear(1)">
            <el-option
              v-for="item in proOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-form-item label="所属业务板块：" prop="soltBlock" style="float: right;width: 370px;">
            <el-select v-model="ruleForm.soltBlock" placeholder="请选择板块" @change="handlerClear(2)">
              <el-option
                v-for="item in blockOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="数据域：" prop="soltArea">
          <el-select v-model="ruleForm.soltArea" placeholder="请选择板块">
            <el-option
              v-for="item in areaOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-form-item label="指标类型：" prop="soltTypeVal" style="float: right;width: 370px;">
            <el-select
              v-model="ruleForm.soltTypeVal"
              placeholder="请选择指标类型"
              :disabled="soltTypeValDis"
            >
              <el-option
                v-for="item in soltType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="指标名称：" prop="soltName">
          <el-input v-model="ruleForm.soltName"></el-input>
        </el-form-item>
        <el-form-item label="指标描述：" prop="soltDesc">
          <el-input type="textarea" v-model="ruleForm.soltDesc"></el-input>
        </el-form-item>
        <template v-if="ruleForm.soltTypeVal=='atomic'">
          <el-form-item label="选择数据集：" prop="soltDataSet">
            <TreeSelect
              v-model="ruleForm.soltDataSet"
              placeholder="选择数据集"
              :options="dataSetOption"
              search-nested
              :disabled="soltFormDis"
            ></TreeSelect>
          </el-form-item>
          <el-form-item label="选择函数：" prop="soltFns">
            <el-select v-model="ruleForm.soltFns" placeholder="请选择函数">
              <el-option
                v-for="(item, index) in soltFnList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择字段：" prop="soltFields" v-if="isShowFields">
            <el-select v-model="ruleForm.soltFields" placeholder="请选择字段">
              <el-option
                v-for="(item, index) in soltFieldList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-if="ruleForm.soltTypeVal=='composite'">
          <el-form-item label="公式/函数：" prop="soltFnsInfo">
            <el-select v-model="ruleForm.soltFnsInfo" placeholder="请选择函数">
              <el-option
                v-for="(item, index) in soltFnList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-tooltip effect="dark" content="相除函数为第一个字段除以第二个字段，第一个为除数，第二个为被除数；" placement="top">
              <span class="fn-title">相除函数为第一个字段除以第二个字段，第一个为除数，第二个为被除数；</span>
            </el-tooltip>
            <div class="fn-area">
              <p>相除函数表达式：</p>
              <ul class="fn-list">
                <li v-for="(item, index) in soltFuncNum" :key="index">
                  <label for>选择指标：</label>
                  <el-select v-model="item.val" placeholder="请选择指标">
                    <el-option
                      v-for="(item_, i) in soltFuncZb"
                      :key="i"
                      :label="item_.label"
                      :value="item_.value"
                    ></el-option>
                  </el-select>
                </li>
              </ul>
            </div>
          </el-form-item>
        </template>
        <el-form-item label="计算方式：" prop="soltCalculation">
          <el-input type="textarea" v-model="ruleForm.soltCalculation"></el-input>
        </el-form-item>
        <el-form-item label="单位：" prop="soltUnit">
          <el-input v-model="ruleForm.soltUnit"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="soltRemake">
          <el-input
            type="textarea"
            v-model="ruleForm.soltRemake"
            placeholder="可以填写该指标的使用数据范围；填写取【标段表】.合同估算价"
          ></el-input>
        </el-form-item>
      </el-form>
    </SoltDialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
import { _ExportExcel } from "utils";
import SoltDialog from "@/components/dialog/solt-dialog";
import { Business_url } from "@/api/indicator-center";

export default {
  name: "Indicators",
  mixins: [mixin],
  components: {
    Sortable,
    SoltDialog,
    TreeSelect,
  },
  data() {
    return {
      activeName: "1",
      proOption: [],
      proVal: "",
      blockVal: "",
      blockOption: [],
      areaVal: "",
      areaOption: [],
      search: "",
      // 表格
      TLoading: false,
      TAlign: [
        {
          key: "left",
          item: [
            "projectName",
            "code",
            "name",
            "sourceDataSourceName",
            "targetDataSourceName",
            "remark",
          ],
        },
      ],
      TEdit: {
        show: true,
        slot: false,
        type: "popover",
        title: "操作",
        width: 180,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success",
          },
          {
            label: "查看",
            css: "warning",
          },
          {
            label: "修改状态",
            css: "warning",
          },
          {
            label: "删除",
            css: "danger",
            pass: true,
          },
        ],
      },
      tableTitle: [
        { prop: "dataDomainName", label: "数据域名称" },
        { prop: "name", label: "指标名称" },
        { prop: "type_value", label: "指标类型" },
        { prop: "description", label: "指标描述" },
        { prop: "valid_value", label: "指标状态" },
        { prop: "creator", label: "创建人" },
        { prop: "gmtCreate", label: "创建时间" },
      ],
      tableData: [],
      TPage: {
        total: 0,
        index: 1,
        size: 10,
      },
      TMultipleSelection: [],
      // 弹出框
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      ruleForm: {
        soltProject: "",
        soltBlock: "",
        soltArea: "",
        soltTypeVal: "atomic",
        soltName: "",
        soltDesc: "",
        soltCalculation: "",
        soltUnit: "",
        soltRemake: "",
        soltDataSet: null,
        soltFields: "",
        soltFns: "",
        soltFnsInfo: "",
      },
      rules: {
        soltProject: [
          { required: true, message: "请选择项目", trigger: "change" },
        ],
        soltBlock: [
          { required: true, message: "请选择板块", trigger: "change" },
        ],
        soltArea: [
          { required: true, message: "请选择板块", trigger: "change" },
        ],
        soltTypeVal: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        soltName: [
          { required: true, message: "请输入指标名称", trigger: "blur" },
        ],
        soltDesc: [
          { required: true, message: "请输入指标名称", trigger: "blur" },
        ],
        soltDataSet: [
          { required: true, message: "请选择数据集", trigger: "change" },
        ],
        soltFns: [{ required: true, message: "请选择函数", trigger: "change" }],
        // soltFields: [
        //   { required: true, message: "请选择字段", trigger: "change" }
        // ]
        // soltCalculation: [
        //   { required: true, message: "请输入计算方式", trigger: "blur" }
        // ],
        // soltUnit: [{ required: true, message: "请输入单位", trigger: "blur" }]
      },
      soltType: [
        {
          label: "原子指标",
          value: "atomic",
        },
        {
          label: "复合指标",
          value: "composite",
        },
      ],
      isShowFields: false,

      // 原子
      dataSetOption: [],
      soltFieldList: [],
      soltFnList: [],
      // 复合
      soltFuncNum: [],
      soltFuncZb: [],
      //
      soltFormDis: false,
      soltTypeValDis: false,
      // 编辑 回显值
      updateObj: "",
    };
  },
  watch: {
    proVal: function (newVal) {
      this.getList();
      if (newVal) {
        this.businessSegments(newVal);
      }
    },
    blockVal: function (newVal) {
      this.getList();
      if (newVal) {
        this.dataField(newVal);
      }
    },
    areaVal: function (newVal) {
      this.getList();
    },
    "ruleForm.soltProject": function (newVal) {
      if (newVal) {
        this.businessSegments(newVal);
      }
    },
    "ruleForm.soltBlock": function (newVal) {
      if (newVal) {
        this.dataField(newVal);
      }
    },
    "ruleForm.soltArea": function (newVal) {
      if (newVal) {
        this.getZb(newVal);
      }
    },
    "ruleForm.soltTypeVal": {
      handler: function (newVal) {
        if (newVal == "atomic") {
          this.getFns("atomic");
        } else {
          this.getFns("composite");
        }
      },
      immediate: true,
    },
    "ruleForm.soltDataSet": function (newVal) {
      if (newVal) {
        let newValDataSet = "";
        this.loop_(this.dataSetOption, newVal, (item) => {
          newValDataSet = item;
        });
        if (newValDataSet && newValDataSet.type == "table") {
          this.getFields(newValDataSet.id.split("_")[0]);
        }
      }
    },
    "ruleForm.soltFnsInfo": function (newVal) {
      if (newVal) {
        this.soltFnList.forEach((item) => {
          if (newVal == item.id) {
            for (let index = 0; index < item.num; index++) {
              this.soltFuncNum.push({
                val: "",
              });
            }
          }
        });
      }
    },
    "ruleForm.soltFns": function (newVal) {
      if (newVal) {
        this.soltFnList.forEach((item) => {
          if (newVal == item.value) {
            this.isShowFields = item.paramType !== "constant";
          }
        });
      }
    },
    updateObj: {
      handler(newVal) {
        if (newVal) {
          const {
            type,
            projectId,
            segmentId,
            domainId,
            name,
            description,
            dataSetId,
            columnId,
            atomicFunctionId,
            compositeFunctionId,
            param,
            formula,
            unit,
            remark,
            columnCode
          } = newVal;
          // 赋值
          this.$set(this.ruleForm, `soltProject`, projectId);
          this.$set(this.ruleForm, `soltBlock`, segmentId);
          this.$set(this.ruleForm, `soltArea`, domainId);
          this.$set(this.ruleForm, `soltTypeVal`, type);
          this.$set(this.ruleForm, `soltName`, name);
          this.$set(this.ruleForm, `soltDesc`, description);
          this.$set(this.ruleForm, `soltCalculation`, formula);
          this.$set(this.ruleForm, `soltUnit`, unit);
          this.$set(this.ruleForm, `soltRemake`, remark);
          if (type == "atomic") {
            this.$set(this.ruleForm, `soltDataSet`, dataSetId || null);
            this.$set(this.ruleForm, `soltFields`, columnCode);
            this.$set(this.ruleForm, `soltFns`, atomicFunctionId);
          } else {
            this.$set(this.ruleForm, `soltFnsInfo`, compositeFunctionId);
            this.soltFuncNum = [];
            setTimeout(() => {
              let param_ = [];
              if (param) {
                param_ = JSON.parse(param);
              }
              param_.forEach((item) => {
                this.soltFuncNum.push({
                  val: item,
                });
              });
            }, 500);
          }
        }
      },
      immediate: true,
      deep: true,
    },
    isShowFields: {
      handler(newVal) {
        if (newVal) {
          this.rules = {
            ...this.rules,
            soltFields: [
              { required: true, message: "请选择字段", trigger: "change" },
            ],
          };
        } else {
          delete this.rules.soltFields;
        }
      },
      immediate: true,
    },
    SoltDigShow(newVal) {
      if (!newVal && this.$refs["ruleForm"]) {
        this.$refs["ruleForm"].resetFields();
      }
    },
  },
  methods: {
    handlerClear(type) {
      switch (type) {
        case 1:
          {
            this.$set(this.ruleForm, `soltBlock`, "");
            this.$set(this.ruleForm, `soltArea`, "");
            this.blockOption = [];
            this.areaOption = [];
          }
          return;
        case 2:
          {
            this.$set(this.ruleForm, `soltArea`, "");
            this.areaOption = [];
          }
          return;
        default:
          break;
      }
    },
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.SoltDigShow = editItem.close;
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 多选条件限制
    handleSelectionChange(type, val) {
      this.TMultipleSelection = val;
      if (val && val.length > 0) {
        // let newArr = val.slice(-2);
        // this.TMultipleSelection = newArr;
      }
    },
    // 行拖拽
    rowDrop({ $el }) {
      const _this = this;
      Sortable.create($el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          let etlRuleMappings = [];
          _this.tableData.forEach((item) => {
            etlRuleMappings.push({
              id: item.id,
            });
          });
          // TODO
          // _this.order({ etlRuleMappings });
        },
      });
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      const { name = "" } = row;
      switch (column.label) {
        case "编辑":
          {
            this.getUpdate(row);
            this.showSoltDig({
              type: column.label,
              row,
            });
          }
          return;
        case "查看":
          {
            this.getUpdate(row);
            this.showSoltDig({
              type: column.label,
            });
          }
          return;
        case "修改状态":
          {
            this.updateState(row);
          }
          return;
        case "删除": {
          this.$confirm(`即将删除“${name}”任务, 是否继续?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.del(row);
            })
            .catch(() => {});
          return;
        }
        default:
          break;
      }
    },
    // 新建指标
    showSoltDig({ type, initDig = null, row }) {
      switch (type) {
        case "新建指标":
          {
            this.$set(this.ruleForm, `soltProject`, "");
            this.$set(this.ruleForm, `soltBlock`, "");
            this.$set(this.ruleForm, `soltArea`, "");
            this.$set(this.ruleForm, `soltTypeVal`, "");
            this.$set(this.ruleForm, `soltName`, "");
            this.$set(this.ruleForm, `soltDesc`, "");
            this.$set(this.ruleForm, `soltCalculation`, "");
            this.$set(this.ruleForm, `soltUnit`, "");
            this.$set(this.ruleForm, `soltRemake`, "");
            this.$set(this.ruleForm, `soltDataSet`, null);
            this.$set(this.ruleForm, `soltFields`, "");
            this.$set(this.ruleForm, `soltFns`, "");
            this.$set(this.ruleForm, `soltFnsInfo`, "");
            this.soltFuncNum = [];

            this.soltFormDis = false;
            this.soltTypeValDis = false;
            this.SoltDigShow = true;
            this.$set(this.ruleForm, `soltTypeVal`, "atomic");
            this.SoltDigTitle = "新建指标";
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: () => {
                  this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                      this.add();
                    } else {
                      return false;
                    }
                  });
                },
              },
            ];
          }
          return;
        case "编辑":
          {
            this.soltFormDis = false;
            this.soltTypeValDis = true;
            this.SoltDigShow = true;
            this.SoltDigTitle = "编辑";
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: () => {
                  this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                      this.update(row);
                    } else {
                      return false;
                    }
                  });
                },
              },
            ];
          }
          return;
        case "查看":
          {
            this.soltFormDis = true;
            this.SoltDigShow = true;
            this.SoltDigTitle = "查看";
            this.soltDFootBtn = [];
          }
          return;
        default:
          break;
      }
    },
    // 初始化查询关联
    handleChange(type, val) {
      switch (type) {
        case 1:
          {
            this.blockVal = this.areaVal = "";
            this.blockOption = this.areaOption = [];
          }
          return;
        case 2:
          {
            this.areaVal = "";
            this.areaOption = [];
          }
          return;
        default:
          break;
      }
    },
    loop(arr, domKey = "", commentName = "") {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (domKey) {
            item["domKey"] = item.id + "_" + domKey;
          } else {
            item["domKey"] = item.id;
          }
          if (item.type == "table") {
            if (commentName) {
              let a_ = item.info.comment || item.info.name;
              item["commentName"] = commentName + "-" + a_;
            } else {
              item["commentName"] = a_;
            }
          } else {
            if (commentName) {
              item["commentName"] = commentName + "-" + item.label;
            } else {
              item["commentName"] = item.label;
            }
          }

          item.id = item.domKey;
          if (item.children && item.children.length) {
            this.loop(item.children, item.domKey, item.commentName);
          } else {
            delete item.children;
          }
        });
      }
    },
    loop_(arr, val, cbVal) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (val == item.domKey) {
            cbVal(item);
          }
          if (item.children && item.children.length) {
            this.loop_(item.children, val, cbVal);
          }
        });
      }
    },
    loopUpdate(arr, val, cbVal) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.type == "table") {
            console.log(val, item);
            if (val == item.domKey.split("_")[0]) {
              cbVal(item);
            }
          }
          if (item.children && item.children.length) {
            this.loopUpdate(item.children, val, cbVal);
          }
        });
      }
    },

    /* 请求 */
    // 获取 函数
    getFns(type) {
      API.definitionFns({ type }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.soltFnList = [];
        this.soltFuncNum = [];
        if (Res) {
          if (type == "atomic") {
            Res.forEach((item) => {
              item["value"] = item.id;
              item["label"] = item.name;
            });
          } else {
            Res.forEach((item) => {
              item["value"] = item.id;
              item["label"] = item.name;
            });
          }
        }
        this.soltFnList = Res;
      });
    },
    // 获取 数据集
    getDataSet() {
      API.definitionDataSet().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.dataSetOption = [];
        if (Res) {
          const {
            data: {
              children: { children },
            },
          } = Res;
          this.loop(children);
          this.dataSetOption = children;
          console.log(this.dataSetOption);
        }
      });
    },
    // 获取 字段
    getFields(id) {
      API.definitionFields({
        dataSetId: id,
        dimensionOrMeasure: 1,
        isGetDictData: 0,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.soltFieldList = [];
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.columnCode + `(${item.columnComment})`;
            item["value"] = item.columnCode;
          });
        }
        this.soltFieldList = Res;
      });
    },
    // 获取 指标
    getZb(id) {
      API.definitionzb({ id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.soltFuncZb = [];
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.fullName;
            item["value"] = item.id;
          });
        }
        this.soltFuncZb = Res;
      });
    },
    // 项目
    getPro() {
      API._publicProjectList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.proOption = [];
        if (Res) {
          Res.forEach((item) => {
            this.proOption.push({
              label: item.projectName,
              value: item.projectId,
            });
          });
        }
      });
    },
    // 业务板块
    businessSegments(projectId) {
      API._publicBusinessSegments({ projectId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.blockOption = [];
        if (Res) {
          Res.forEach((item) => {
            this.blockOption.push({
              label: item.businessSegmentName,
              value: item.businessSegmentId,
            });
          });
        }
      });
    },
    // 数据域
    dataField(id) {
      API._publicDataField({
        id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.areaOption = [];
        if (Res) {
          Res.forEach((item) => {
            this.areaOption.push({
              ...item,
              label: item.name,
              value: item.id,
            });
          });
        }
      });
    },
    // 新建指标
    add() {
      switch (this.ruleForm.soltTypeVal) {
        case "atomic":
          {
            const {
              soltArea,
              soltName,
              soltDesc,
              soltDataSet,
              soltFields,
              soltFnsInfo,
              soltCalculation,
              soltFns,
              soltUnit,
              soltRemake,
            } = this.ruleForm;

            let dataSetCode = "";
            let dataSetComment = "";
            let dataSetId = "";
            this.loop_(this.dataSetOption, soltDataSet, (item) => {
              if (item.type == "table") {
                dataSetCode = item.info.name;
                dataSetComment = item.commentName;
                dataSetId = item.id.split("_")[0];
              }
            });

            let columnCode = "";
            let columnComment = "";
            let columnId = "";

            this.soltFieldList.forEach((item) => {
              if (soltFields == item.value) {
                columnComment = item.columnComment || item.columnCode;
                columnCode = item.columnCode;
                columnId = item.id;
              }
            });
            let req = {};
            if (this.isShowFields) {
              req = {
                domainId: soltArea,
                name: soltName,
                description: soltDesc,

                dataSetCode,
                dataSetComment,
                dataSetId,

                columnCode,
                columnComment,
                columnId,
                atomicFunctionId: soltFns,

                formula: soltCalculation,
                unit: soltUnit,
                remark: soltRemake,
              };
            } else {
              req = {
                domainId: soltArea,
                name: soltName,
                description: soltDesc,

                dataSetCode,
                dataSetComment,
                dataSetId,

                atomicFunctionId: soltFns,

                formula: soltCalculation,
                unit: soltUnit,
                remark: soltRemake,
              };
            }

            API.definitionAdd(req).then((res) => {
              let Res = new ResDatas({
                res,
                code: 0,
              }).state();
              this.getList();
              if (res.data.code == 0) {
                this.SoltDigShow = false;
              }
            });
          }
          return;
        case "composite":
          {
            let paramArr = [];
            const {
              soltArea,
              soltName,
              soltDesc,
              soltFnsInfo,
              soltCalculation,
              soltUnit,
              soltRemake,
            } = this.ruleForm;
            this.soltFuncNum.forEach((item) => {
              paramArr.push(item.val);
            });
            API.definitionAddFh({
              domainId: soltArea,
              name: soltName,
              description: soltDesc,
              compositeFunctionId: soltFnsInfo,
              param: JSON.stringify(paramArr),
              formula: soltCalculation,
              unit: soltUnit,
              remark: soltRemake,
            }).then((res) => {
              new ResDatas({
                res,
                code: 0,
              }).state();
              this.getList();
              if (res.data.code == 0) {
                this.SoltDigShow = false;
              }
            });
          }
          return;
        default:
          break;
      }
    },
    // 获取
    getList() {
      this.TLoading = true;
      API.definitionList({
        businessSegmentId: this.blockVal,
        dataDomainId: this.areaVal,
        projectId: this.proVal,
        indicatorName: this.search,
        pageNo: this.TPage.index,
        pageSize: this.TPage.size,
        // type: "atomic"
      })
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
                pageSize: "pageSize",
                index: "pageNo",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total } = Res.formatData();
            this.tableTitle = title;
            this.tableData = data;
            this.$set(this.TPage, "total", total);
          } else {
            this.tableData = [];
            this.TLoading = false;
            this.$set(this.TPage, "total", 0);
          }
        })
        .catch((error) => {
          this.TLoading = false;
        });
    },
    // 批量 删除
    dels() {
      if (this.TMultipleSelection.length) {
        let arr = [];
        this.TMultipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        let idStr = arr.join();
        API.definitionDels({ idStr }).then((res) => {
          new ResDatas({ res, code: 0 }).state();
          this.getList();
        });
      }
    },
    // 批量生效
    effectiveBatches() {
      if (this.TMultipleSelection.length) {
        let arr = [];
        this.TMultipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        let idStr = arr.join();
        API.definitionEffective({ idStr }).then((res) => {
          new ResDatas({ res, code: 0 }).state();
          this.getList();
        });
      }
    },
    // 批量失效
    batchFailure() {
      if (this.TMultipleSelection.length) {
        let arr = [];
        this.TMultipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        let idStr = arr.join();
        API.definitionFailure({ idStr }).then((res) => {
          new ResDatas({ res, code: 0 }).state();
          this.getList();
        });
      }
    },
    // Excel导出
    excelExp() {
      let idListStr = "";
      if (this.TMultipleSelection.length) {
        let arr = [];
        this.TMultipleSelection.forEach((item) => {
          arr.push(item.id);
        });
        idListStr = arr.join();
        _ExportExcel(
          Business_url +
            "/indicator/export" +
            `?projectId=${this.proVal}&businessSegmentId=${this.blockVal}&dataDomainId=${this.areaVal}&indicatorName=${this.search}&idListStr=${idListStr}`
        );
        return;
      }
      _ExportExcel(
        Business_url +
          "/indicator/export" +
          `?projectId=${this.proVal}&businessSegmentId=${this.blockVal}&dataDomainId=${this.areaVal}&indicatorName=${this.search}`
      );
    },
    // 删除
    del({ id }) {
      API.definitionDel({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
    // 获取编辑
    getUpdate({ id }) {
      this.updateObj = "";
      API.definitionUpdateView({ id }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          // 数据集 字典转换
          const { dataSetId } = Res;
          this.loopUpdate(this.dataSetOption, dataSetId + "", (item) => {
            Res["dataSetId"] = item.id;
          });
          this.updateObj = Res;
        }
      });
    },
    // 编辑
    update({ id }) {
      switch (this.ruleForm.soltTypeVal) {
        case "atomic":
          {
            const {
              soltArea,
              soltName,
              soltDesc,
              soltDataSet,
              soltFields,
              soltFnsInfo,
              soltCalculation,
              soltFns,
              name,
              soltRemake,
            } = this.ruleForm;

            let dataSetCode = "";
            let dataSetComment = "";
            let dataSetId = "";
            this.loop_(this.dataSetOption, soltDataSet, (item) => {
              if (item.type == "table") {
                dataSetCode = item.info.name;
                dataSetComment = item.commentName;
                dataSetId = item.id.split("_")[0];
              }
            });

            let columnCode = "";
            let columnComment = "";
            let columnId = "";

            this.soltFieldList.forEach((item) => {
              if (soltFields == item.value) {
                columnComment = item.columnComment || item.columnCode;
                columnCode = item.columnCode;
                columnId = item.id;
              }
            });
            API.definitionUpdate({
              id,
              domainId: soltArea,
              name: soltName,
              description: soltDesc,

              dataSetCode,
              dataSetComment,
              dataSetId,

              columnCode,
              columnComment,
              columnId,
              atomicFunctionId: soltFns,

              formula: soltCalculation,
              unit: name,
              remark: soltRemake,
            }).then((res) => {
              new ResDatas({
                res,
                code: 0,
              }).state();
              this.getList();
              if (res.data.code == 0) {
                this.SoltDigShow = false;
              }
            });
          }
          return;
        case "composite":
          {
            let paramArr = [];
            const {
              soltArea,
              soltName,
              soltDesc,
              soltFnsInfo,
              soltCalculation,
              name,
              soltRemake,
            } = this.ruleForm;
            this.soltFuncNum.forEach((item) => {
              paramArr.push(item.val);
            });
            API.definitionUpdateFh({
              id,
              domainId: soltArea,
              name: soltName,
              description: soltDesc,
              compositeFunctionId: soltFnsInfo,
              param: JSON.stringify(paramArr),
              formula: soltCalculation,
              unit: name,
              remark: soltRemake,
            }).then((res) => {
              new ResDatas({
                res,
                code: 0,
              }).state();
              this.getList();
              if (res.data.code == 0) {
                this.SoltDigShow = false;
              }
            });
          }
          return;
        default:
          break;
      }
    },
    // 修改状态
    updateState({ id }) {
      API.definitionUpdateState({ id }).then((res) => {
        new ResDatas({ res, code: 0 }).state();
        this.getList();
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { segmentId = "", projectId, id } = JSON.parse(
        this.$route.query.row
      );
      if (segmentId) {
        this.proVal = projectId;
        this.blockVal = segmentId;
        this.areaVal = id;
      } else {
        this.proVal = projectId;
        this.blockVal = id;
      }
    }
    this.getPro();
    this.getList();
    this.getDataSet();
  },
};
</script>
<style lang="scss" scoped>
.page-indicator {
  height: 100%;
  width: 100%;
  overflow: hidden;
  &-area {
    overflow: hidden;
    margin-bottom: 10px;
    &-btn {
      float: left;
      overflow: hidden;
      li {
        float: left;
        margin-right: 5px;
      }
    }
    &-query {
      font-size: 14px;
      float: right;
      overflow: hidden;
      li {
        float: left;
        margin-right: 15px;
      }
    }
  }
  &-table {
    width: 100%;
    height: calc(100% - 90px);
    overflow: auto;
    box-sizing: border-box;
  }
  .fn-title {
    position: relative;
    top: 7px;
    display: inline-block;
    width: 408px;
    height: 25px;
    line-height: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fn-area {
    overflow: hidden;
    .fn-list {
      overflow: hidden;
      margin-left: 33px;
      max-height: 85px;
      overflow: auto;
      li {
        margin: 5px 0;
      }
    }
  }
}
</style>

