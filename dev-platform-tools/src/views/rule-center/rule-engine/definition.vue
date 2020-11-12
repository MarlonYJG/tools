<!--
 * @Author: Marlon
 * @Date: 2020-07-25 19:30:56
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-28 17:00:04
 * @Description: 规则引擎 - 规则定义
--> 
<template>
  <div class="rule-definition">
    <div class="left">
      <el-tree
        ref="rule-tree"
        :highlight-current="true"
        :data="ruleList"
        node-key="id"
        accordion
        @node-click="handleNodeClick"
        :current-node-key="currentKey"
      ></el-tree>
    </div>
    <!-- 右侧区域 -->
    <div class="right">
      <ul>
        <li>
          <el-button size="small" @click="showFormDialog({type:'新增规则'})">新增规则</el-button>
        </li>
      </ul>
      <div class="rule-definition-top">
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
          @editBtnCb="editBtnCb"
          @clickCell="lickCell"
          @clickRow="clickRow"
          @changePage="changePage"
        ></TableDefault>
      </div>
      <span class="rule-definition-mid" @click="fold = !fold">
        <i v-if="fold" class="el-icon-arrow-down up-dow"></i>
        <i v-else class="el-icon-arrow-up up-dow"></i>
      </span>
      <div v-show="fold" class="rule-definition-bot">
        <p
          style="margin: 10px 5px;font-size: 14px;"
        >规则“{{this.activeRow_ && this.activeRow_.name}}”的参数列表</p>
        <ul class="bot-parame-edit">
          <li>
            <el-button size="small" @click="showFormDialog({type:'新增'})">新增</el-button>
          </li>
        </ul>
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
          @editBtnCb="editBtnCb"
          @clickCell="lickCellDataSet"
          @changePage="changePage_1"
        ></TableDefault>
      </div>
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
    ></FormDialog>
    <!-- 参数预览 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <el-form slot="soltDigContent" :model="rulePreviewForm" ref="form_1">
        <el-row>
          <el-col :span="10">
            <el-tree
              :data="ruleTypePreviewTreeDic"
              node-key="id"
              show-checkbox
              accordion
              :default-expanded-keys="activeRuleTypeIds"
              :default-checked-keys="activeRuleTypeId"
              :props="defaultProps"
            ></el-tree>
          </el-col>
          <el-col :span="14">
            <el-form-item
              v-for="(item,key) in rulePreviewDic"
              :key="key"
              :label="`${item.label}：`"
              :label-width="formLabelWidth"
              :prop="item.prop"
            >
              <!-- 单选 -->
              <el-radio-group
                v-if="(item.displayMode===1&&(item.paraType===2 || item.paraType===3)) || (item.displayMode===6&&(item.paraType===2 || item.paraType===3))"
                v-model="rulePreviewForm[item.prop]"
              >
                <el-radio :label="i" v-for="i in item.paraRange" :key="i"></el-radio>
              </el-radio-group>
              <!-- 多选 -->
              <el-checkbox-group
                v-if="item.displayMode===2&&(item.paraType===2 || item.paraType===3)"
                v-model="rulePreviewForm[item.prop]"
              >
                <el-checkbox :label="i" v-for="i in item.paraRange" :key="i" :name="item.prop"></el-checkbox>
              </el-checkbox-group>
              <!-- 文本 -->
              <el-input
                v-if="(item.displayMode===3&&item.paraType===1) || (item.displayMode===1&&item.paraType===1)"
                v-model="rulePreviewForm[item.prop]"
                :readonly="true"
              ></el-input>
              <!-- 文本域 + 删选 -->
              <div class="search-input" v-if="item.displayMode===4&&item.paraType===4">
                <el-input v-model="rulePreviewForm[item.prop]"></el-input>
                <el-button type="text">添加</el-button>
              </div>
              <!-- 纯文本域 -->
              <el-input
                v-if="item.displayMode===4&&item.paraType===1"
                type="textarea"
                v-model="rulePreviewForm[item.prop]"
              ></el-input>
              <!-- 下拉选 -->
              <el-select
                v-if="item.displayMode===6&&item.paraType===4"
                v-model="rulePreviewForm[item.prop]"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in checkFormDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </SoltDialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  data() {
    return {
      // 树形项目列表
      currentKey: "",
      ruleList: [],
      ruleOption: [],
      activeTree_: {
        id: "",
        name: "",
      },
      // 布局
      fold: true,
      // 表格
      TId_y: "bussiness",
      TLoading: false,
      TActiveRow: 0,
      TEdit: {
        show: true,
        title: "操作",
        width: 180,
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
            label: "参数预览",
            css: "text",
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
        { label: "规则编码", prop: "code" },
        { label: "规则名称", prop: "name" },
        { label: "规则分类", prop: "ruleTypeName" },
        { label: "规则实现接口", prop: "impInterface" },
        { label: "规则逻辑类型", prop: "ruleLogicTypeName" },
        { label: "备注", prop: "remarks" },
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
      // 规则参数 列表
      TId: "table-data-set",
      TableData: [],
      TableTitle: [
        { label: "参数编码", prop: "code" },
        { label: "参数名称", prop: "name" },
        { label: "参数类型", prop: "paraTypeName" },
        { label: "参数值域", prop: "paraRange" },
        { label: "显示方式", prop: "displayModeName" },
        { label: "提示信息", prop: "promptInfo" },
        { label: "默认值", prop: "defaultValue" },
      ],
      TableDigLoading: false,
      TPage_1: {
        total: 0,
        index: 1,
        size: 10,
      },
      TEdit_1: {
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
      // 新增规则
      ruleLogicType: [],
      // 弹出框
      FDVisible: false,
      FDId: "form_dialog_1",
      FDForm: [],
      FDTitle: "",
      FDFoot: {
        button: [],
      },
      FDRules: {},
      paraTypeDic: [], // 参数类型
      displayModeDic: [], // 显示方式
      // 参数预览
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      rulePreviewForm: {},
      ruleTypePreviewTreeDic: [],
      activeRuleTypeIds: [],
      activeRuleTypeId: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      rulePreviewDic: [],
      formLabelWidth: "120px",
      checkFormDic: [],
      // 获取点击值的信息
      activeRow_: "",
    };
  },
  watch: {
    activeTree_: {
      handler(newVal) {
        this.getList();
      },
      deep: true,
    },
    activeRow_: {
      handler(newVal) {
        if (newVal) {
          this.getParameList();
        } else {
          this.TableData = [];
        }
      },
      deep: true,
    },
    SoltDigShow(newVal) {
      if (!newVal && this.$refs["form_1"]) {
        this.$refs["form_1"].resetFields();
      }
    },
  },
  methods: {
    // 规则树-点击
    handleNodeClick(data) {
      this.activeTree_ = {
        id: data.id,
        name: data.label,
      };
    },
    // 表单-弹出框
    showFormDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增规则":
          {
            this.FDTitle = "新增规则";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "规则编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "规则名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "规则分类",
                  width: "120",
                },
                width: "280",
                key: "ruleTypeId",
                defaultModel: "",
                placeholder: "",
                option: this.ruleOption,
              },
              {
                type: "select",
                label: {
                  name: "规则逻辑类型",
                  width: "120",
                },
                width: "280",
                key: "ruleLogicType",
                defaultModel: "",
                placeholder: "",
                option: this.ruleLogicType,
              },
              {
                type: "textarea",
                label: {
                  name: "规则说明",
                  width: "120",
                },
                key: "remarks",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "实现接口",
                  width: "120",
                },
                key: "impInterface",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.addRule(form);
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case "规则-编辑":
          {
            this.FDTitle = "编辑规则";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "规则编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: initDig.code,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "规则名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: initDig.name,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "规则分类",
                  width: "120",
                },
                width: "280",
                key: "ruleTypeId",
                defaultModel: initDig.ruleTypeId,
                placeholder: "",
                option: this.ruleOption,
              },
              {
                type: "select",
                label: {
                  name: "规则逻辑类型",
                  width: "120",
                },
                width: "280",
                key: "ruleLogicType",
                defaultModel: initDig.ruleLogicType,
                placeholder: "",
                option: this.ruleLogicType,
              },
              {
                type: "textarea",
                label: {
                  name: "规则说明",
                  width: "120",
                },
                key: "remarks",
                width: "280",
                defaultModel: initDig.remarks,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "实现接口",
                  width: "120",
                },
                key: "impInterface",
                width: "280",
                defaultModel: initDig.impInterface,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateRule({
                        ...form,
                        id: row.id,
                      });
                    }
                  });
                },
              },
            ]);
            this.FDVisible = true;
          }
          return;
        case "新增":
          {
            this.FDTitle = "新增参数";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "参数编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "参数名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: "",
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "参数类型",
                  width: "120",
                },
                width: "280",
                key: "paraTypeId",
                defaultModel: "",
                placeholder: "",
                option: this.paraTypeDic,
              },
              {
                type: "select",
                label: {
                  name: "显示形式",
                  width: "120",
                },
                width: "280",
                key: "displayModeId",
                defaultModel: "",
                placeholder: "",
                option: this.displayModeDic,
              },
              {
                type: "textarea",
                label: {
                  name: "参数值域值",
                  width: "120",
                },
                key: "paraRange",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "提示信息",
                  width: "120",
                },
                key: "promptInfo",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "默认值",
                  width: "120",
                },
                key: "defaultValue",
                width: "280",
                defaultModel: "",
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      if (
                        this.activeRow_ &&
                        this.activeRow_.id &&
                        this.activeRow_.ruleTypeId
                      ) {
                        this.addParams({
                          ...form,
                          ruleId: this.activeRow_.id,
                          ruleTypeId: this.activeRow_.ruleTypeId,
                        });
                      }
                    }
                  });
                },
              },
            ]);
            if (this.activeRow_) {
              this.FDVisible = true;
            }
          }
          return;
        case "规则参数-编辑":
          {
            this.FDTitle = "编辑规则参数";
            this.FDForm = [
              {
                type: "input",
                label: {
                  name: "参数编码",
                  width: "120",
                },
                key: "code",
                clearable: true,
                width: "280",
                defaultModel: initDig.code,
                placeholder: "",
              },
              {
                type: "input",
                label: {
                  name: "参数名称",
                  width: "120",
                },
                key: "name",
                clearable: true,
                width: "280",
                defaultModel: initDig.name,
                placeholder: "",
              },
              {
                type: "select",
                label: {
                  name: "参数类型",
                  width: "120",
                },
                width: "280",
                key: "paraTypeId",
                defaultModel: initDig.paraTypeId,
                placeholder: "",
                option: this.paraTypeDic,
              },
              {
                type: "select",
                label: {
                  name: "显示形式",
                  width: "120",
                },
                width: "280",
                key: "displayModeId",
                defaultModel: initDig.displayModeId,
                placeholder: "",
                option: this.displayModeDic,
              },
              {
                type: "textarea",
                label: {
                  name: "参数值域值",
                  width: "120",
                },
                key: "paraRange",
                width: "280",
                defaultModel: initDig.paraRange,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "提示信息",
                  width: "120",
                },
                key: "promptInfo",
                width: "280",
                defaultModel: initDig.promptInfo,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
              {
                type: "textarea",
                label: {
                  name: "默认值",
                  width: "120",
                },
                key: "defaultValue",
                width: "280",
                defaultModel: initDig.defaultValue,
                placeholder: "",
                autosize: {
                  min: 2,
                  max: 4,
                },
              },
            ];
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.updateParams({
                        ...form,
                        id: row.id,
                        ruleId: row.ruleId,
                        ruleTypeId: row.ruleTypeId,
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
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = this.FDVisible = editItem.close;
      }
    },
    loop(arr, newArr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            this.loop(item.children, newArr);
          } else {
            delete item.children;
          }
          item["value"] = item.id;
          newArr.push(item);
        });
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    changePage_1({ pageSize, currentPage }) {
      this.$set(this.TPage_1, `index`, currentPage);
      this.$set(this.TPage_1, `size`, pageSize);
      this.getParameList();
    },
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      const {
        name,
        code,
        ruleLogicType,
        ruleTypeId,
        remarks = "",
        impInterface,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "规则-编辑",
              initDig: {
                name,
                code,
                ruleLogicType,
                ruleTypeId: ruleTypeId + "",
                remarks,
                impInterface,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delRule(row.id);
              })
              .catch(() => {});
          }
          return;
        case "参数预览":
          {
            this.SoltDigTitle = "参数预览";
            this.paramsView(row);
          }
          return;
        default:
          break;
      }
    },
    lickCellDataSet({ row, column, id }) {
      const {
        code,
        name,
        paraTypeId,
        displayModeId,
        paraRange,
        promptInfo,
        defaultValue,
      } = row;
      switch (column.label) {
        case "编辑":
          {
            this.showFormDialog({
              type: "规则参数-编辑",
              initDig: {
                code,
                name,
                paraTypeId,
                displayModeId,
                paraRange,
                promptInfo,
                defaultValue,
              },
              row,
            });
          }
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${name}”, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delParams(row.id);
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    clickRow({ row, column, id }) {
      this.TActiveRow = row.id;
      this.activeRow_ = row;
    },

    /* 请求 */
    // 逻辑类型
    ruleLogicTypeListFn() {
      API.ruleLogicTypeList().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            this.ruleLogicType.push({
              label: item.name,
              value: Number(item.id),
            });
          });
        } else {
          this.ruleLogicType = [];
        }
      });
    },
    // 参数类型
    getParaTypeDic() {
      API.getParaTypeDic().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.name;
            item["value"] = item.id;
          });
          this.paraTypeDic = Res;
        } else {
          this.paraTypeDic = [];
        }
      });
    },
    // 显示形式
    getDisplayModeDic() {
      API.getDisplayModeDic().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.displayMode;
            item["value"] = item.id;
          });
          this.displayModeDic = Res;
        } else {
          this.displayModeDic = [];
        }
      });
    },
    // 获取规则树
    getRuleTree() {
      API.getRuleTypeTreeDic().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          let ruleTree_ = Res.data.children.children;
          this.loop(ruleTree_, this.ruleOption);
          this.ruleList = ruleTree_;
        } else {
          this.ruleList = [];
        }
      });
    },
    // 规则列表
    getList() {
      if (this.activeTree_ && this.activeTree_.id) {
        this.TLoading = true;
        API.getRuleList({
          pageNum: this.TPage.index,
          pageSize: this.TPage.size,
          ruleTypeId: this.activeTree_.id,
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
              if (data && data.length) {
                this.TActiveRow = data[0].id;
                this.activeRow_ = data[0];

                // if (row) {
                // //   this.TActiveRow = row.id;
                // //   this.activeRow_ = row;
                // } else {

                // }
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
          })
          .catch((err) => {
            this.TLoading = false;
          });
      }
    },
    // 规则参数列表
    getParameList() {
      if (this.activeRow_) {
        this.TableData = [];
        this.TableDigLoading = true;
        API.getRuleParameterList({
          pageNum: this.TPage_1.index,
          pageSize: this.TPage_1.size,
          ruleId: this.activeRow_.id,
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
              "TableDigLoading",
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
    // 新增规则
    addRule(req) {
      this.FDVisible = false;
      API.addRule(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 编辑规则
    updateRule(req) {
      this.FDVisible = false;
      API.updateRule(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    delRule(id) {
      API.deleteRule({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 参数预览
    async paramsView(row) {
      this.activeRuleTypeIds = row.parentIds.map((item) => item.toString());
      this.activeRuleTypeId = [this.activeRuleTypeIds.pop()];
      await this.getRuleTypePreviewTree();
      let params = {
        ruleId: row.id,
      };
      await API.rulePreview(params).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.rulePreviewDic = Res;
          this.rulePreviewForm = {};
          this.rulePreviewDic.forEach((item) => {
            if (item.paraType === 2) {
              item.paraRange = JSON.parse(item.paraRange);
              item.value = [];
            }
            this.rulePreviewForm[item.prop] = item.value;
          });
        }
        this.SoltDigShow = true;
      });
    },
    // 新增参数
    addParams(req) {
      this.FDVisible = false;
      API.addRuleParameter(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getParameList();
      });
    },
    updateParams(req) {
      this.FDVisible = false;
      API.updateRuleParameter(req).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getParameList();
      });
    },
    delParams(id) {
      API.deleteRuleParameter({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getParameList();
      });
    },
    // 规则树
    getRuleTypePreviewTree() {
      API.getRuleTypePreviewTree().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (
          Res &&
          Res.data &&
          Res.data.children &&
          Res.data.children.children
        ) {
          this.ruleTypePreviewTreeDic = Res.data.children.children;
        }
      });
    },
    // 规则DOM结构
  },
  mounted() {
    this.getRuleTree();
    this.ruleLogicTypeListFn();
    this.getParaTypeDic();
    this.getDisplayModeDic();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.rule-definition {
  width: 100%;
  overflow: hidden;
  .left,
  .right {
    box-sizing: border-box;
    float: left;
    height: 100%;
    padding: 10px 0;
  }
  .left {
    width: 295px;
    overflow: auto;
    padding-right: 5px;
  }
  .right {
    width: calc(100% - 300px);
    padding: 5px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #eee;
  }
  &-top {
    width: 100%;
    // height: 44%;
    box-sizing: border-box;
    // border: 1px solid red;
    flex: 1;
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
    .bot-parame-edit {
      overflow: hidden;
    }
  }
}
</style>
