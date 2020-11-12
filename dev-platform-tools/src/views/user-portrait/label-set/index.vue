<!--
 * @Author: Marlon
 * @Date: 2020-05-27 16:05:19
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-17 15:51:50
 * @Description: 标签设置
--> 
<template>
  <div class="label-set">
    <div class="label-set-edit-area">
      <ul class="label-set-edit-area-btn">
        <li>
          <el-button size="medium" @click="showDialog({type:'标签设置'})">标签设置</el-button>
        </li>
        <li>
          <el-button size="medium" @click="showFormDialog({type:'标签更新'})">标签更新</el-button>
        </li>
        <li>
          <el-button size="medium" @click="del({type:'批量删除'})">删除</el-button>
        </li>
      </ul>
      <ul class="label-set-edit-area-select">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="tag_0_val"
            filterable
            clearable
            placeholder="请选择"
            size="medium"
            @change="getList"
          >
            <el-option
              v-for="item in tag_0_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>业务板块：</label>
          <el-select
            v-model="tag_1_val"
            filterable
            clearable
            placeholder="请选择"
            size="medium"
            @change="getList"
          >
            <el-option
              v-for="item in tag_1_list"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>标签更新：</label>
          <el-select
            v-model="tag_3_val"
            filterable
            clearable
            placeholder="请选择"
            size="medium"
            @change="getList"
            style="width: 100px;"
          >
            <el-option
              v-for="item in labelCodeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>标签分组：</label>
          <el-cascader
            v-model="tag_2_val"
            :options="tag_2_list"
            :props="{ expandTrigger: 'hover' }"
            @change="getList"
            style="width: 290px;"
            size="medium"
            clearable
          ></el-cascader>
        </li>
        <li>
          <el-input placeholder="请输入内容" v-model="searchVal" size="medium">
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
    <div class="label-set-table">
      <TableDefault
        :TAlign="TAlign_1"
        :TLoading="TLoading_1"
        :TTitle="tableTitle_1"
        :TData="tableData_1"
        :TEdit="TEdit_1"
        :TIsShowPage="true"
        :TTotal="TPage_1.total"
        :TCurrentPage="TPage_1.index"
        :TPageSize="TPage_1.size"
        :TIsShowCheckBox="true"
        @editBtnCb="editBtnCb"
        @clickCell="lickCell"
        @changePage="changePage(1,$event)"
        @handleSelectionChange="handleSelectionChange"
      ></TableDefault>
    </div>
    <!-- 弹出框-表格（公共选择） -->
    <SoltDialog
      :SoltDigShow="SoltDigShow"
      :SoltDigTitle="SoltDigTitle"
      :soltDFootBtn="soltDFootBtn"
      SoltDigWidth="950"
      @editBtnCb="editBtnCb_1"
    >
      <div slot="soltDigContent" class="soltDigContent">
        <ul class="change-label">
          <li>
            <label for>业务板块：</label>
            <el-select
              v-model="dig_1_val"
              filterable
              clearable
              placeholder="请选择"
              size="small"
              @change="getLableList"
            >
              <el-option
                v-for="item in tag_1_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>标签分组：</label>
            <el-cascader
              v-model="dig_2_val"
              :options="tag_2_list"
              :props="{ expandTrigger: 'hover' }"
              style="width: 290px;"
              size="small"
              clearable
            ></el-cascader>
          </li>
          <li>
            <el-input placeholder="请输入内容" v-model="searchVal_2" size="small">
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer;"
                @click="getLableList"
              ></i>
            </el-input>
          </li>
        </ul>
        <TableDefault
          :TId="TId_2"
          :THeight="400"
          :TAlign="TAlign_2"
          :TLoading="TLoading_2"
          :TTitle="tableTitle_2"
          :TData="tableData_2"
          :TEdit="TEdit_2"
          :TIsShowPage="true"
          :TTotal="TPage_2.total"
          :TCurrentPage="TPage_2.index"
          :TPageSize="TPage_2.size"
          :TIsShowCheckBox="true"
          :TMultipleSelection="TMultipleSelection_2"
          @editBtnCb="editBtnCb"
          @changePage="changePage(2,$event)"
          @handleSelectionChange="handleSelectionChange_2"
        ></TableDefault>
      </div>
    </SoltDialog>
    <!-- 弹出框-关联框(简单) -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_1"
      :SoltDigTitle="SoltDigTitle_1"
      :soltDFootBtn="soltDFootBtn_1"
      SoltDigWidth="950"
      @editBtnCb="editBtnCb_2"
    >
      <div slot="soltDigContent" class="soltDigContent_1">
        <div class="lt">
          <el-input class="search" placeholder="请输入数据集编码/名称" v-model="searchValTable" size="small">
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer;"
              @click="likeTable"
            ></i>
          </el-input>
          <el-table
            height="305"
            :data="ViewTableData"
            stripe
            style="width: 100%"
            border
            size="small"
            v-loading="ViewTableDataLoading"
          >
            <el-table-column
              label="序号"
              type="index"
              :index="TindexFn"
              width="50"
              align="center"
              fixed
            ></el-table-column>
            <el-table-column prop="tableName" label="数据集编码" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="tableComment" label="数据集中文名称" width="180" show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="操作" fixed="right" width="50" align="center">
              <template slot-scope="scope">
                <el-popover
                  placement="right"
                  width="400"
                  trigger="click"
                  popper-class="popover-table"
                >
                  <p class="popover-table-title">
                    <i></i>
                    {{scope.row.tableComment}}
                  </p>
                  <el-table
                    :data="ViewTableDataChild"
                    height="250"
                    border
                    size="mini"
                    v-loading="ViewTableDataLoading_look"
                  >
                    <el-table-column
                      label="序号"
                      type="index"
                      :index="TindexFn"
                      width="50"
                      align="center"
                      fixed
                    ></el-table-column>
                    <el-table-column
                      property="columnComment"
                      width="200"
                      label="名称"
                      show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column
                      property="columnName"
                      width="200"
                      label="英文名称"
                      show-overflow-tooltip
                    ></el-table-column>
                  </el-table>
                  <el-button size="mini" plain class="popover-table-close" @click="closePopover">关闭</el-button>
                  <el-button
                    slot="reference"
                    @click="handleLook(scope.row)"
                    type="text"
                    size="small"
                  >查看</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="rt">
          <ul class="select">
            <li>
              <label for>项目：</label>
              <el-select
                v-model="proVal_2"
                filterable
                clearable
                placeholder="请选择"
                size="small"
                style="width: 140px;margin-right: 10px;"
              >
                <el-option
                  v-for="item in tag_0_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <li>
              <label for>选择方式：</label>
              <el-select
                v-model="sourceVal_2"
                filterable
                clearable
                placeholder="请选择"
                size="small"
                @change="getList"
                style="width: 140px;"
              >
                <el-option
                  v-for="item in source_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
          </ul>
          <p class="title">
            <i></i> SQL创建
          </p>
          <el-input
            type="textarea"
            :autosize="{ minRows: 14, maxRows: 14}"
            placeholder="请输入内容"
            v-model="creatSQL"
          ></el-input>
        </div>
      </div>
    </SoltDialog>
    <!-- 弹出框-(复杂) -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_2"
      :SoltDigTitle="SoltDigTitle_2"
      :soltDFootBtn="soltDFootBtn_2"
      SoltDigWidth="950"
      @editBtnCb="editBtnCb_fz"
    >
      <div slot="soltDigContent" class="fzTag">
        <div class="query-select">
          <p class="m-title">
            <i></i>
            <span>选择数据源</span>
          </p>
          <ul class="select">
            <li>
              <label for>项目：</label>
              <el-select
                v-model="fzPro"
                filterable
                placeholder="请选择"
                size="small"
                style="width: 140px;margin-right: 10px;"
                :disabled="fzDisableRules"
              >
                <el-option
                  v-for="item in tag_0_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>
            <!-- <li>
              <label for>选择方式：</label>
              <el-select
                v-model="fzSource"
                filterable
                placeholder="请选择"
                size="small"
                style="width: 140px;"
                :disabled="fzDisableRules"
              >
                <el-option
                  v-for="item in source_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </li>-->
          </ul>
        </div>
        <div class="tag-rules">
          <p class="m-title">
            <i></i>
            <span>标签规则</span>
          </p>
          <div class="rule-area">
            <div class="rule-area-default" v-for="(item,index) in rulesList" :key="index">
              <div class="ljysf" v-if="index!==0">
                <i></i>
                <el-select
                  :disabled="fzDisableRules"
                  v-model="item.typeVal"
                  filterable
                  size="small"
                  class="ljysf-lhf"
                >
                  <el-option
                    v-for="item in ljysfList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <i></i>
              </div>
              <i>{{index+1}}</i>
              <el-cascader
                v-model="item.ywbk"
                :options="pszbTree"
                :props="{ expandTrigger: 'hover' }"
                placeholder="请选择数据域"
                size="small"
                class="bk"
                :disabled="fzDisableRules"
              ></el-cascader>
              <el-input
                disabled
                class="select-search"
                placeholder="请选择派生指标"
                v-model="item.pszbLabel"
                size="small"
              ></el-input>
              <el-button
                class="select-btn"
                icon="el-icon-search"
                circle
                size="mini"
                @click="showDigPszb(item)"
                :disabled="fzDisableRules"
              ></el-button>
              <el-select
                :disabled="fzDisableRules"
                v-model="item.bds"
                filterable
                placeholder="请选择"
                size="small"
                class="ysf"
              >
                <el-option
                  v-for="item in inequalityList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                :disabled="fzDisableRules"
                class="num"
                clearable
                v-model="item.num"
                size="small"
              ></el-input>
              <span class="unit">{{item.unit}}</span>
              <b class="edit" v-if="!fzDisableRules">
                <span
                  class="el-icon-remove"
                  v-if="!(index==0 && index == rulesList.length-1)"
                  @click="tagRuleDelDom(item)"
                ></span>
                <span
                  class="el-icon-circle-plus"
                  v-if="index == rulesList.length-1"
                  @click="tagRuleAddDom(item)"
                ></span>
              </b>
            </div>
          </div>
        </div>
      </div>
    </SoltDialog>
    <!-- 弹出框-表单-更新机制 -->
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
    <!-- 弹出框-派生指标 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_2_1"
      :SoltDigTitle="SoltDigTitle_2_1"
      :soltDFootBtn="soltDFootBtn_2_1"
      SoltDigWidth="950"
      @editBtnCb="editBtnCb_pszb"
    >
      <div slot="soltDigContent" class="pszbDig">
        <el-input class="search-pszb" placeholder="请输入派生指标名称" v-model="likeSearch" size="small">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer;"
            @click="pszbGetList"
          ></i>
        </el-input>
        <div class="area">
          <div class="lt">
            <p class="m-title">
              <i></i>
              <span>原子\复合指标选择器</span>
            </p>
            <el-tree
              :data="pszbTree"
              :props="pszbdefaultProps"
              node-key="id"
              :default-expanded-keys="defaultExpandedKey"
              :highlight-current="false"
              :current-node-key="currentNodeKey"
              @node-click="handleNodeClickPSZB"
            ></el-tree>
          </div>
          <div class="rt">
            <p class="m-title">
              <i></i>
              <span>设置筛选条件</span>
            </p>
            <ul class="query">
              <li>
                <label for>选择维度：</label>
                <el-cascader
                  v-model="pszbWD"
                  :options="pszbWDOptions"
                  :props="{multiple: true}"
                  collapse-tags
                  clearable
                  :show-all-levels="false"
                  placeholder="请选择维度"
                  size="medium"
                  @change="pszbGetList"
                ></el-cascader>
              </li>
              <li>
                <label for>时间修饰词：</label>
                <el-select
                  v-model="time"
                  filterable
                  clearable
                  placeholder="请选择时间修饰词"
                  size="medium"
                  @change="pszbGetList"
                >
                  <el-option
                    v-for="item in timeOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  ></el-option>
                </el-select>
              </li>
            </ul>
            <TableDefault
              :THeight="400"
              :TAlign="TAlign_pszb"
              :TLoading="TLoading_pszb"
              :TTitle="tableTitle_pszb"
              :TIsShowIndex="TIsShowIndex"
              :TData="tableData_pszb"
              :TEdit="TEdit_pszb"
              :TIsShowPage="true"
              :TTotal="TPage_pszb.total"
              :TCurrentPage="TPage_pszb.index"
              :TPageSize="TPage_pszb.size"
              @clickCell="lickCell"
              @changePage="changePage('pszb',$event)"
            ></TableDefault>
          </div>
        </div>
      </div>
    </SoltDialog>
    <!-- 弹出框-预测 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_yc"
      :SoltDigTitle="SoltDigTitle_yc"
      :soltDFootBtn="soltDFootBtn_yc"
      SoltDigWidth="550"
      @editBtnCb="editBtnCb_yc"
    >
      <div slot="soltDigContent" class="yc">
        <ul class="list">
          <li v-for="(item, index) in ycBarList" :key="index">
            <span class="name">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
                <span>{{item.name}}</span>
              </el-tooltip>
            </span>
            <p :style="`width:${item.width}px`">
              <i>{{item.zb}}%</i>
            </p>
            <span class="num">
              <span>
                <el-tooltip class="item" effect="dark" :content="item.value+''" placement="top">
                  <span>{{item.value}}</span>
                </el-tooltip>
              </span>
              <b>{{item.unit}}</b>
            </span>
          </li>
        </ul>
      </div>
    </SoltDialog>
  </div>
</template>

<script>
import jdTag from "@/assets/icon/jd@51_55.png";
import mixin from "mixin";
import API from "api/index";
import { ResDatas, reqFormatDic } from "utils/res-format";
import { openUrl, cellJump } from "utils/jump";
import SoltDialog from "@/components/dialog/solt-dialog";

export default {
  mixins: [mixin],
  components: {
    SoltDialog,
  },
  data() {
    return {
      // 查找
      searchVal: "",
      tag_0_val: "", // 项目
      tag_0_list: [],
      tag_1_val: "", // 业务板块
      tag_1_list: [],
      tag_2_val: [], // 标签分组
      tag_2_list: [],
      tag_3_val: "", // 标签更新
      labelCodeList: [], // 标签更新方式
      labelPC: [], //标签更新频次
      // 表格
      TLoading_1: false,
      TAlign_1: [
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
      TEdit_1: {
        show: true,
        slot: false,
        type: "popover",
        title: "操作",
        width: 150,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "text",
          },
          {
            label: "查看",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
          },
        ],
      },
      tableTitle_1: [
        { prop: "projectName", label: "项目" },
        { prop: "businessType_value", label: "业务板块" },
        { prop: "labelValueName", label: "标签名称" },
        { prop: "labelName", label: "标签分类" },
        { prop: "labelGroups", label: "标签分组" },
        { prop: "updateMethod_value", label: "标签更新方式" },
        { prop: "updateFrequency_value", label: "标签更新频次" },
      ],
      tableData_1: [],
      TPage_1: {
        total: 0,
        index: 1,
        size: 10,
      },
      checkBox_1: [],
      activeRow_: "",
      // 弹出框-标签(公共选择弹出框表格)
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      // 弹出框- 表格
      TId_2: "labelItem_dig",
      dig_1_val: "",
      dig_2_val: "",
      searchVal_2: "",
      TLoading_2: false,
      TAlign_2: [
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
      TEdit_2: {
        show: false,
      },
      tableTitle_2: [
        { prop: "businessType_value", label: "业务板块" },
        { prop: "labelType_value", label: "标签类型" },
        { prop: "labelValueName", label: "标签名称" },
        { prop: "labelGroups", label: "标签分组" },
        { prop: "labelName", label: "标签分类" },
        { prop: "createTime", label: "创建时间" },
      ],
      tableData_2: [],
      TPage_2: {
        total: 0,
        index: 1,
        size: 10,
      },
      checkBox_2: [], // 选择的单条标签
      TMultipleSelection_2: [],
      // 弹出框-关联框(简单标签)
      SoltDigShow_1: false,
      SoltDigTitle_1: "",
      soltDFootBtn_1: [],
      ViewTableDataLoading: false,
      ViewTableDataLoading_look: false,
      ViewTableData: [],
      ViewTableDataSource: [],
      ViewcurrentPage: 1,
      ViewpageSize: 10,
      ViewTotal: 0,
      searchValTable: "",
      proVal_2: "",
      sourceVal_2: "",
      creatSQL: "",
      ViewTableDataChild: [],
      source_list: [], //数据源
      // 弹出框-表单
      FDId: "form_dialog_1",
      FDVisible: false,
      FDTitle: "",
      FDForm: [],
      FDFoot: {
        button: [],
      },
      FDRules: {},
      // 弹出框 - 复杂标签
      SoltDigShow_2: false,
      SoltDigTitle_2: "",
      soltDFootBtn_2: [],
      fzPro: "",
      fzSource: "",
      fzDisableRules: false,
      rulesList: [
        {
          nodeId: new Date().getTime().toString(),
          ywbk: [],
          pszbVal: "",
          pszbLabel: "",
          bds: "", // 不等式
          num: "",
          unit: "",
        },
      ],
      inequalityList: [],
      ljysfList: [
        {
          label: "或",
          value: "|",
        },
        {
          label: "且",
          value: "&",
        },
      ],
      // 弹出框 - 派生指标
      TIsShowIndex: {
        show: true,
        // fixed: "left"
      },
      SoltDigShow_2_1: false,
      SoltDigTitle_2_1: "",
      soltDFootBtn_2_1: [],
      likeSearch: "",
      currentNodeKey: "",
      defaultExpandedKey: [],
      pszbTree: [],
      pszbdefaultProps: {
        children: "children",
        label: "label",
      },
      pszbWD: [],
      pszbWDOptions: [],
      time: "",
      timeOptions: [],
      TLoading_pszb: false,
      TAlign_pszb: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit_pszb: {
        show: true,
        slot: false,
        type: "popover",
        title: "操作",
        width: 100,
        // fixed: "right",
        editTypes: [
          {
            label: "确定",
            css: "text",
          },
        ],
      },
      tableTitle_pszb: [{ prop: "name", label: "派生指标名称" }],
      tableData_pszb: [],
      TPage_pszb: {
        total: 0,
        index: 1,
        size: 10,
      },
      indicatorId_: "",
      rulesActive_: "",
      // 弹出框 - 预测
      SoltDigShow_yc: false,
      SoltDigTitle_yc: "用户群体预测",
      soltDFootBtn_yc: [],
      ycBarList: [],
    };
  },
  watch: {
    proVal_2: function (newVal) {
      if (newVal) {
        this.getSource(newVal);
      }
    },
    fzPro: function (newVal) {
      if (newVal) {
        this.getSource(newVal);
        this.getYWBKSJYZB();
      }
    },
    dig_2_val: function (newVal) {
      this.getLableList();
    },
    sourceVal_2: {
      handler(newVal) {
        this.getTable();
      },
    },
  },
  methods: {
    // 自动更改序号
    TindexFn(index) {
      return (this.ViewcurrentPage - 1) * this.ViewpageSize + index + 1;
    },
    TChangePageSizeFn(size) {
      this.ViewpageSize = size;
    },
    TChangeCurrentFn(currentPage) {
      this.ViewcurrentPage = currentPage;
    },
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
        this.del({ type: "单条删除", row });
      } else if (text === "close") {
        this.FDVisible = editItem.close;
        this.FDForm = [];
      }
    },
    editBtnCb_1(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow = editItem.close;
        this.TMultipleSelection_2 = this.checkBox_2 = [];
      }
    },
    editBtnCb_2(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow_1 = editItem.close;
        this.searchValTable = "";
        this.proVal_2 = this.sourceVal_2 = this.creatSQL = "";
      }
    },
    editBtnCb_fz(editItem, tid, row) {
      const { label, close } = editItem;
      if (label === "close") {
        this.SoltDigShow_2 = close;
        this.fzPro = "";
      }
    },
    editBtnCbForm(editItem, tid, row) {
      let text = editItem.label;
      if (text === "删除") {
      } else if (text === "close") {
        this.SoltDigShowForm = editItem.close;
      }
    },
    editBtnCb_pszb(editItem, tid, row) {
      const { label, close } = editItem;
      if (label === "close") {
        this.SoltDigShow_2_1 = close;
        this.defaultExpandedKey = [];
        this.currentNodeKey = "";
        this.rulesActive_ = "";
      }
    },
    editBtnCb_yc(editItem, tid, row) {
      const { label, close } = editItem;
      if (label === "close") {
        this.SoltDigShow_yc = close;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null }) {
      switch (type) {
        case "标签设置":
          {
            this.dig_1_val = this.tag_1_val || "";
            if (this.tag_2_val.length) {
              this.dig_2_val = this.tag_2_val;
            } else {
              this.dig_2_val = [];
            }
            this.TPage_2 = {
              total: 0,
              index: 1,
              size: 10,
            };
            this.getLableList();
            this.SoltDigShow = true;
            this.SoltDigTitle = "创建标签界面";
            this.soltDFootBtn = [
              {
                label: "下一步",
                css: "primary",
                cb: () => {
                  let $this = this;
                  if (this.checkBox_2.length) {
                    console.log(this.checkBox_2);
                    // TODO
                    switch (this.checkBox_2[0].labelType) {
                      case 1:
                        {
                          this.getTable();
                          this.SoltDigShow_1 = true;
                          this.SoltDigTitle_1 = "标签关联数据";
                          this.soltDFootBtn_1 = [
                            {
                              label: "保存",
                              css: "primary",
                              cb: () => {
                                this.save(function (id, labelId) {
                                  $this
                                    .$confirm(
                                      `您是否进行设置标签更新频次?`,
                                      "提示",
                                      {
                                        confirmButtonText: "是",
                                        cancelButtonText: "否",
                                        type: "warning",
                                      }
                                    )
                                    .then(() => {
                                      $this.showFormDialog({
                                        type: "",
                                        initDig: { id, labelId },
                                      });
                                    })
                                    .catch(() => {
                                      $this.SoltDigShow = $this.SoltDigShow_1 = false;
                                      $this.clearChange();
                                    });
                                });
                              },
                            },
                          ];
                        }
                        return;
                      case 2:
                        {
                          this.fzPro = "";
                          this.rulesList = [
                            {
                              nodeId: new Date().getTime().toString(),
                              ywbk: [],
                              pszbVal: "",
                              pszbLabel: "",
                              bds: "", // 不等式
                              num: "",
                              unit: "",
                            },
                          ];
                          this.fzDisableRules = false;
                          this.SoltDigShow_2 = true;
                          this.SoltDigTitle_2 = "设置复杂标签";
                          this.soltDFootBtn_2 = [
                            // {
                            //   label: "预测",
                            //   css: "",
                            //   cb: () => {
                            //     this.SoltDigShow_yc = true;
                            //     this.ycBarView();
                            //     // TODO
                            //   }
                            // },
                            {
                              label: "上一步",
                              css: "",
                              cb: () => {
                                this.SoltDigShow_2 = false;
                              },
                            },
                            {
                              label: "保存",
                              css: "primary",
                              cb: () => {
                                this.fzSave(function (id, labelId) {
                                  $this
                                    .$confirm(
                                      `您是否进行设置标签更新频次?`,
                                      "提示",
                                      {
                                        confirmButtonText: "是",
                                        cancelButtonText: "否",
                                        type: "warning",
                                      }
                                    )
                                    .then(() => {
                                      $this.showFormDialog({
                                        type: "",
                                        initDig: { id, labelId },
                                      });
                                    })
                                    .catch(() => {
                                      $this.SoltDigShow = $this.SoltDigShow_2 = false;
                                      $this.fzPro = $this.fzSource = "";
                                      $this.rulesList = [
                                        {
                                          nodeId: new Date()
                                            .getTime()
                                            .toString(),
                                          ywbk: [],
                                          pszbVal: "",
                                          pszbLabel: "",
                                          bds: "", // 不等式
                                          num: "",
                                          unit: "",
                                          typeVal: "|",
                                        },
                                      ];
                                    });
                                });
                              },
                            },
                          ];
                        }
                        return;
                      case 3:
                        {
                          // TODO
                        }
                        return;
                      case 4:
                        {
                          // TODO
                        }
                        return;
                      default:
                        break;
                    }
                  } else {
                    this.$message({
                      message: "请选择一条标签",
                      type: "warning",
                    });
                  }
                },
              },
            ];
          }
          return;
        default:
          return;
      }
    },
    // 简单标签 初始化值
    clearChange() {
      this.dig_1_val = this.dig_2_val = this.searchVal_2 = "";
      this.checkBox_2 = this.TMultipleSelection_2 = [];
      this.searchValTable = "";
      this.proVal_2 = this.sourceVal_2 = this.creatSQL = "";
    },
    // 标签更新频次
    showFormDialog({ type, initDig }) {
      switch (type) {
        case "标签更新":
          {
            if (this.checkBox_1.length) {
              this.FDVisible = true;
              this.FDTitle = "标签更新";
              this.FDForm = [
                {
                  type: "select",
                  label: {
                    name: "标签更新方式",
                    width: "150",
                  },
                  width: "200",
                  key: "updateMethod",
                  defaultModel: "",
                  placeholder: "",
                  option: this.labelCodeList,
                },
                {
                  type: "select",
                  label: {
                    name: "标签更新频次",
                    width: "150",
                  },
                  width: "200",
                  key: "updateFrequency",
                  defaultModel: "",
                  placeholder: "",
                  option: this.labelPC,
                },
              ];
              this.FDRules = {
                updateMethod: [
                  {
                    required: true,
                    message: "请选择更新方式",
                    trigger: "change",
                  },
                ],
                updateFrequency: [
                  {
                    required: true,
                    message: "请选择更新频次",
                    trigger: "change",
                  },
                ],
              };
              this.$set(this.FDFoot, `button`, [
                {
                  type: "ok",
                  label: "确定",
                  cb: (form, $this) => {
                    $this.$refs[this.FDId].validate((valid) => {
                      if (valid) {
                        this.labelUpdate(form);
                      }
                    });
                  },
                },
              ]);
            } else {
              this.$message({
                message: "请选择要更新的标签",
                type: "warning",
              });
            }
          }
          return;
        default:
          {
            const { updateFrequency = "", updateMethod = "" } = initDig;
            this.FDVisible = true;
            this.FDTitle = "设置标签更新机制";
            this.FDForm = [
              {
                type: "select",
                label: {
                  name: "标签更新方式",
                  width: "150",
                },
                width: "200",
                key: "updateMethod",
                defaultModel: updateMethod,
                placeholder: "",
                option: this.labelCodeList,
              },
              {
                type: "select",
                label: {
                  name: "标签更新频次",
                  width: "150",
                },
                width: "200",
                key: "updateFrequency",
                defaultModel: updateFrequency,
                placeholder: "",
                option: this.labelPC,
              },
            ];
            this.FDRules = {
              updateMethod: [
                {
                  required: true,
                  message: "请选择更新方式",
                  trigger: "change",
                },
              ],
              updateFrequency: [
                {
                  required: true,
                  message: "请选择更新频次",
                  trigger: "change",
                },
              ],
            };
            this.$set(this.FDFoot, `button`, [
              {
                type: "ok",
                label: "确定",
                cb: (form, $this) => {
                  $this.$refs[this.FDId].validate((valid) => {
                    if (valid) {
                      this.upDate({
                        id: initDig.id,
                        updateFrequency: form.updateFrequency,
                        updateMethod: form.updateMethod,
                        labelId: initDig.labelId,
                        ...form,
                      });
                      this.fzPro = "";
                      this.rulesList = [
                        {
                          nodeId: new Date().getTime().toString(),
                          ywbk: [],
                          pszbVal: "",
                          pszbLabel: "",
                          bds: "", // 不等式
                          num: "",
                          unit: "",
                        },
                      ];
                      this.SoltDigShow = this.SoltDigShow_1 = this.FDVisible = this.SoltDigShow_2 = false;
                      this.clearChange();
                    }
                  });
                },
              },
            ]);
          }
          break;
      }
    },
    // 分页操作
    changePage(type, { pageSize, currentPage }) {
      this.$set(this[`TPage_${type}`], `index`, currentPage);
      this.$set(this[`TPage_${type}`], `size`, pageSize);
      // TODO
      if (type == 1) {
        this.getList();
      } else if (type == 2) {
        this.getLableList();
      } else if (type == "pszb") {
        // 派生指标
        this.pszbGetList();
      }
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      this.activeRow_ = row;
      // TODO
      const { projectId, script, sourceId, labelType } = row;
      switch (column.label) {
        case "查看": {
          if (labelType == 2) {
            this.fzPro = projectId;
            this.fzSource = sourceId;
            this.getEditRulesList(row.id);
            this.fzDisableRules = true;
            this.SoltDigShow_2 = true;
            this.SoltDigTitle_2 = "编辑复杂标签";
            this.soltDFootBtn_2 = [];
          } else if (labelType == 1) {
            this.getTable();
            this.proVal_2 = projectId;
            this.creatSQL = script;
            this.sourceVal_2 = sourceId;
            this.SoltDigShow_1 = true;
            this.SoltDigTitle_1 = "查看标签关联数据";
            this.soltDFootBtn_1 = [];
          }

          return;
        }
        case "编辑": {
          if (labelType == 2) {
            this.fzPro = projectId;
            this.getEditRulesList(row.id);
            this.fzbqUpdate(row);
          } else if (labelType == 1) {
            this.jdbqUpdate(row);
          }
          return;
        }
        case "确定": {
          this.rulesList.forEach((item) => {
            if (this.rulesActive_.nodeId == item.nodeId) {
              item["pszbVal"] = row.id;
              item["pszbLabel"] = row.name;
              item["unit"] = row.unit;
              item["serialCode"] = row.serialCode;
            }
          });
          this.SoltDigShow_2_1 = false;
          return;
        }
        default:
          break;
      }
    },
    // 多选
    handleSelectionChange(type, selectionArr) {
      if (type === "checkbox") {
        this.checkBox_1 = selectionArr;
      }
    },
    // 选择标签-单条
    handleSelectionChange_2(type, selectionArr) {
      let arr = JSON.parse(JSON.stringify(selectionArr));
      if (selectionArr.length > 1) {
        let arrItem = selectionArr.slice(-1);
        this.TMultipleSelection_2 = arrItem;
        this.checkBox_2 = arrItem;
        return;
      } else {
        this.checkBox_2 = selectionArr;
        return;
      }
    },
    // 递归处理
    loop(arr) {
      if (arr && arr.length) {
        arr.forEach((item) => {
          item["label"] = item.typeName;
          item["value"] = item.treeId;
          if (item.children && item.children.length) {
            this.loop(item.children);
          }
        });
      }
    },
    closePopover() {
      let arr = document.getElementsByClassName("popover-table");
      for (let index = 0; index < arr.length; index++) {
        arr[index].style = "display:none;";
      }
    },
    /* 复杂标签 */
    // 删除
    tagRuleDelDom(item) {
      this.rulesList.forEach((ele, index) => {
        if (item.nodeId == ele.nodeId) {
          this.rulesList.splice(index, 1);
        }
      });
    },
    // 新增
    tagRuleAddDom(item) {
      const addItem = {
        nodeId: new Date().getTime().toString(),
        ywbk: [],
        pszbVal: "",
        pszbLabel: "",
        bds: "", // 不等式
        num: "",
        unit: "",
        typeVal: "|",
      };
      this.rulesList.push(addItem);
    },
    // 派生指标左侧树点击查询
    handleNodeClickPSZB(data) {
      if (!data.children) {
        this.indicatorId_ = data.id;
        this.pszbGetList();
      }
    },
    // 调用派生指标选项卡
    showDigPszb(item) {
      console.log(item);
      if (item.ywbk.length == 3) {
        this.rulesActive_ = item;
        this.SoltDigTitle_2_1 = "选择派生指标";
        this.SoltDigShow_2_1 = true;
        this.defaultExpandedKey = JSON.parse(JSON.stringify(item.ywbk));
        this.currentNodeKey = item.ywbk[2];
        console.log(this.defaultExpandedKey, this.currentNodeKey);
        this.getWD(item.ywbk[1]);
        this.indicatorId_ = item.ywbk[2];
        this.pszbGetList();
        // TODO 存在BUG 树形默认值问题
      } else {
        this.$message({
          message: "请先选择项目、数据域、指标",
          type: "warning",
        });
      }
    },
    // 简单标签 -编辑
    jdbqUpdate(row) {
      const { projectId, script, sourceId } = row;
      this.getTable();
      this.proVal_2 = projectId;
      this.creatSQL = script;
      this.sourceVal_2 = sourceId;
      this.SoltDigShow_1 = true;
      this.SoltDigTitle_1 = "编辑标签关联数据";
      this.soltDFootBtn_1 = [
        {
          label: "保存",
          css: "primary",
          cb: () => {
            this.upDate(row);
            this.$confirm(`您是否进行设置标签更新频次?`, "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                this.showFormDialog({ type: "", initDig: row });
              })
              .catch(() => {
                this.SoltDigShow = this.SoltDigShow_1 = this.SoltDigShow_2 = false;
                this.clearChange();
              });
          },
        },
      ];
    },
    // 复杂标签-编辑
    fzbqUpdate(row) {
      const { projectId, script, sourceId } = row;
      this.fzPro = projectId;
      this.fzSource = sourceId;
      this.SoltDigShow_2 = true;
      this.SoltDigTitle_2 = "编辑复杂标签";
      this.soltDFootBtn_2 = [
        // {
        //   label: "预测",
        //   css: "",
        //   cb: () => {
        //     this.ycBarView();
        //   }
        // },
        {
          label: "保存",
          css: "primary",
          cb: () => {
            this.fzUpdate(row);
            this.$confirm(`您是否进行设置标签更新频次?`, "提示", {
              confirmButtonText: "是",
              cancelButtonText: "否",
              type: "warning",
            })
              .then(() => {
                this.showFormDialog({ type: "", initDig: row });
              })
              .catch(() => {
                $this.SoltDigShow = $this.SoltDigShow_2 = $this.SoltDigShow_2 = false;
                $this.fzPro = $this.fzSource = "";
                $this.rulesList = [
                  {
                    nodeId: 1,
                    ywbk: [],
                    pszbVal: "",
                    pszbLabel: "",
                    bds: "", // 不等式
                    num: "",
                    unit: "",
                    typeVal: "|",
                  },
                ];
              });
          },
        },
      ];
      this.fzDisableRules = false;
    },
    // 预测-横向柱状图-计算
    ycBar(max, val) {
      // 325
      if (val) {
        return (val * 325) / max;
      } else {
        return 0;
      }
    },
    // 复杂标签-数据转换
    fzDataMap(rulesList) {
      let compArr = [];
      for (let index = 0; index < rulesList.length; index++) {
        let complexItem = {};
        if (index == 0) {
          complexItem["relation"] = "";
          complexItem["node"] = {
            id: rulesList[index].id || null,
            nodeId: rulesList[index].nodeId,
            // configId: rulesList[index].ywbk,
            serialCode: rulesList[index].serialCode,
            indexName: rulesList[index].pszbLabel,
            businessType: rulesList[index].ywbk[0],
            dataField: rulesList[index].ywbk[1],
            atomicIndex: rulesList[index].ywbk[2],
            indexId: rulesList[index].pszbVal,
            express: rulesList[index].bds,
            value: Number(rulesList[index].num),
          };
        }
        if (compArr.length) {
          if (rulesList[index].typeVal) {
            compArr.push(
              Object.assign(
                {},
                {
                  relation: rulesList[index].typeVal,
                  children: [
                    compArr[compArr.length - 1],
                    {
                      relation: "",
                      node: {
                        id: rulesList[index].id || null,
                        nodeId: rulesList[index].nodeId,
                        indexName: rulesList[index].pszbLabel,
                        serialCode: rulesList[index].serialCode,
                        // configId: rulesList[index].ywbk,
                        businessType: rulesList[index].ywbk[0],
                        dataField: rulesList[index].ywbk[1],
                        atomicIndex: rulesList[index].ywbk[2],
                        indexId: rulesList[index].pszbVal,
                        express: rulesList[index].bds,
                        value: Number(rulesList[index].num),
                      },
                    },
                  ],
                }
              )
            );
          }
        } else {
          compArr.push(complexItem);
        }
      }
      if (compArr.length) {
        return compArr[compArr.length - 1];
      }
      return null;
    },
    // 复杂标签- 数据解析
    fzDataMap_(obj, arr) {
      if (obj.relation) {
        if (obj.children && obj.children.length) {
          arr.push({
            nodeId: obj.children[1].node.nodeId,
            ywbk: [
              obj.children[1].node.businessType,
              obj.children[1].node.dataField,
              obj.children[1].node.atomicIndex,
            ],
            pszbVal: obj.children[1].node.indexId,
            pszbLabel: obj.children[1].node.indexName,
            bds: obj.children[1].node.express,
            num: obj.children[1].node.value,
            unit: "",
            typeVal: obj.relation,
          });
          this.fzDataMap_(obj.children[0], arr);
        }
      } else {
        arr.push({
          nodeId: obj.node.nodeId,
          ywbk: [
            obj.node.businessType,
            obj.node.dataField,
            obj.node.atomicIndex,
          ],
          pszbVal: obj.node.indexId,
          pszbLabel: obj.node.indexName,
          bds: obj.node.express,
          num: obj.node.value,
          unit: "",
          typeVal: obj.relation,
        });
      }
    },

    /* 请求 */
    // 项目
    getProject() {
      this.tag_0_list = [];
      API._publicProject().then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.projectName;
            item["value"] = item.projectId;
          });
        }
        this.tag_0_list = Res;
      });
    },
    // 业务板块
    getYWBK(name) {
      API._publicYWBK({
        name,
      }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (name === "BUSINESS_TYPE") {
          // 业务板块
          let proArr = [];
          if (Res && Res.length) {
            Res.forEach((item) => {
              proArr.push({
                label: item.name,
                value: item.code,
              });
            });
          }
          this.tag_1_list = proArr;
        } else if (name === "UPDATE_METHOD") {
          // 标签更新
          this.labelCodeList = [];
          if (Res && Res.length) {
            Res.forEach((item) => {
              this.labelCodeList.push({
                label: item.name,
                value: item.code,
              });
            });
          }
        } else if (name == "UPDATE_FREQUENCY") {
          // 更新频次
          this.labelPC = [];
          if (Res) {
            Res.forEach((item) => {
              this.labelPC.push({
                label: item.name,
                value: item.code,
              });
            });
          }
        } else if (name === "COMPLEX_EXPRESS") {
          // 不等式
          this.inequalityList = [];
          if (Res) {
            Res.forEach((item) => {
              this.inequalityList.push({
                label: item.name,
                value: item.code,
              });
            });
          }
        }
      });
    },
    // 标签分组
    getTagGroup() {
      API._publicTagGroup({
        parentCode: "",
      }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        let labelTag_ = [];
        if (Res && Res.length) {
          this.loop(Res);
        }
        labelTag_ = Res;
        this.tag_2_list = labelTag_;
      });
    },
    // 标签列表
    getLableList() {
      this.TLoading_2 = true;
      let labelGroup1 = "";
      let labelGroup2 = "";
      let labelGroup3 = "";
      if (this.dig_2_val.length) {
        labelGroup1 = this.dig_2_val[0];
        labelGroup2 = this.dig_2_val[1];
        labelGroup3 = this.dig_2_val[2];
      }
      API.labelSetListItem(
        reqFormatDic({
          current: this.TPage_2.index,
          size: this.TPage_2.size,
          labelGroup1,
          labelGroup2,
          labelGroup3,
          businessType: this.dig_1_val,
          labelValueName: this.searchVal_2,
        })
      )
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size",
                index: "current",
              },
            },
            "TLoading_2",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, index } = Res.formatData();
            if (data && data.length) {
              data.forEach((item) => {
                item["labelGroups"] =
                  item.labelGroup1Name +
                  "/" +
                  item.labelGroup2Name +
                  "/" +
                  item.labelGroup3Name;
              });
            }
            this.tableData_2 = data;
            this.TPage_2 = {
              index,
              size: pageSize,
              total,
            };
          } else {
            this.tableData_2 = [];
            this.TPage_2 = {
              index: 1,
              size: 10,
              total: 0,
            };
          }
        })
        .catch((error) => {
          this.TLoading_2 = false;
        });
    },
    // 选择方式(数据源)
    getSource(projectId) {
      this.source_list = [];
      API._publicDataSource({ projectId }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (Res) {
          Res.forEach((item) => {
            item["label"] = item.datasourceName;
            item["value"] = item.id;
          });
        }
        this.source_list = Res;
      });
    },
    // 获取预览表格数据
    getTable() {
      this.ViewTableData = [];
      if (this.sourceVal_2) {
        this.ViewTableDataLoading = true;
        API.labelSetTableView({ dataSourceId: this.sourceVal_2 })
          .then((res) => {
            let Res = new ResDatas({
              res,
            }).init();
            if (Res) {
              this.ViewTableData = Res;
              this.ViewTableDataSource = Res;
              this.ViewTableDataLoading = false;
            }
          })
          .catch((error) => {
            this.ViewTableDataLoading = false;
          });
      }
    },
    // 模糊查询
    likeTable() {
      this.ViewTableDataLoading = true;
      if (this.searchValTable) {
        let arr_ = [];
        this.ViewTableDataSource.forEach((item) => {
          console.log(item.tableName.indexOf(this.searchValTable));
          if (
            (item.tableName &&
              item.tableName.indexOf(this.searchValTable) !== -1) ||
            (item.tableComment &&
              item.tableComment.indexOf(this.searchValTable) !== -1)
          ) {
            arr_.push(item);
          }
        });
        this.ViewTableData = arr_;
      } else {
        this.ViewTableData = this.ViewTableDataSource;
      }
      setTimeout(() => {
        this.ViewTableDataLoading = false;
      }, 3000);
    },
    // 查看
    handleLook({ tableName }) {
      this.ViewTableDataLoading_look = true;
      this.ViewTableDataChild = [];
      if (this.sourceVal_2) {
        API.labelSetTableViewLook({
          tableName,
          dataSourceId: this.sourceVal_2,
        })
          .then((res) => {
            let Res = new ResDatas({
              res,
            }).init();
            if (Res) {
              this.ViewTableDataChild = Res;
            }
            this.ViewTableDataLoading_look = false;
          })
          .catch((error) => {
            this.ViewTableDataLoading_look = false;
          });
      }
    },

    // 获取
    getList() {
      this.TLoading_1 = true;
      let labelGroup1 = "";
      let labelGroup2 = "";
      let labelGroup3 = "";
      if (this.tag_2_val.length) {
        labelGroup1 = this.tag_2_val[0];
        labelGroup2 = this.tag_2_val[1];
        labelGroup3 = this.tag_2_val[2];
      }
      API.labelSetList(
        reqFormatDic({
          current: this.TPage_1.index,
          size: this.TPage_1.size,
          projectId: this.tag_0_val,
          businessType: this.tag_1_val,
          updateMethod: this.tag_3_val,
          labelGroup1,
          labelGroup2,
          labelGroup3,
          labelValueName: this.searchVal,
        })
      )
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              fieldKey: {
                data: "records",
                title: "",
                total: "total",
                pageSize: "size",
                index: "current",
              },
            },
            "TLoading_1",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, index } = Res.formatData();
            if (data && data.length) {
              data.forEach((item) => {
                item["labelGroups"] =
                  item.labelGroup1Name +
                  "/" +
                  item.labelGroup2Name +
                  "/" +
                  item.labelGroup3Name;
              });
            }
            this.tableData_1 = data;
            this.TPage_1 = {
              total,
              index,
              size: pageSize,
            };
          } else {
            this.tableData_1 = [];
            this.TPage_1 = {
              total: 0,
              index: 1,
              size: 10,
            };
          }
        })
        .catch((error) => {
          this.TLoading_1 = false;
          console.error(error);
        });
    },
    // 标签更新
    labelUpdate({ updateMethod, updateFrequency }) {
      if (this.checkBox_1.length) {
        let poList = [];
        this.checkBox_1.forEach((item) => {
          poList.push({
            id: item.id,
            labelId: item.labelId,
            projectId: item.projectId,
            script: item.script,
            sourceId: item.sourceId,
            updateMethod,
            updateFrequency,
          });
        });
        API.labelSetupdateBatches({
          poList,
        }).then((res) => {
          new ResDatas({
            res,
          }).state();
          this.FDVisible = false;
          this.getList();
        });
      }
    }, // 删除
    del({ type, row }) {
      switch (type) {
        case "批量删除":
          {
            if (this.checkBox_1.length) {
              let idList = [];
              this.checkBox_1.forEach((item) => {
                idList.push(item.id);
              });
              API.labelSetDels({
                idList: idList.join(),
              }).then((res) => {
                new ResDatas({
                  res,
                }).state();
                this.getList();
              });
            }
          }
          return;
        case "单条删除":
          {
            API.labelSetDel({ id: row.id }).then((res) => {
              new ResDatas({
                res,
              }).state();
              this.getList();
            });
          }
          return;
        default:
          break;
      }
    },
    // 简单标签——新建
    save(cb) {
      if (this.checkBox_2.length) {
        API.labelSetSave(
          reqFormatDic({
            projectId: this.proVal_2,
            script: this.creatSQL,
            sourceId: this.sourceVal_2,
            labelId: this.checkBox_2[0].id,
          })
        ).then((res) => {
          new ResDatas({
            res,
          }).state();
          if (res.data.data) {
            cb(res.data.data.id, res.data.data.labelId);
          }
          this.getList();
        });
      }
    },
    // 简单标签——编辑
    upDate({ id, labelId, updateFrequency, updateMethod }) {
      API.labelSetSaveUpdate(
        reqFormatDic({
          projectId: this.proVal_2,
          id,
          script: this.creatSQL,
          sourceId: this.sourceVal_2,
          labelId,
          updateFrequency,
          updateMethod,
        })
      ).then((res) => {
        new ResDatas({
          res,
        }).state();
        this.getList();
      });
    },
    // 获取业务板块数据域指标三级
    getYWBKSJYZB() {
      if (this.fzPro) {
        API._publicSegDomInd({ projectId: this.fzPro }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            function loop(arr) {
              if (arr && arr.length) {
                arr.forEach((item) => {
                  item["value"] = item.id;
                  if (item.children && item.children.length) {
                    loop(item.children);
                  } else {
                    delete item.children;
                  }
                });
              }
            }
            loop(Res);
            this.pszbTree = Res;
          } else {
            this.pszbTree = [];
          }
        });
      }
    },
    // 维度
    getWD(domainId) {
      API.labelSetDerivedIndexId({ domainId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          function loopTree(arr) {
            if (arr && arr.length) {
              arr.forEach((item) => {
                item["value"] = item.no;
                if (item.children && item.children.length) {
                  loopTree(item.children);
                } else {
                  delete item.children;
                }
              });
            }
          }
          loopTree(Res);
          this.pszbWDOptions = Res;
        } else {
          this.pszbWDOptions = [];
        }
      });
    },
    // 时间修饰词
    getTime() {
      API.labelSetDerivedIndexTime().then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        this.timeOptions = Res;
      });
    },
    // 复杂标签 保存
    fzSave(cb) {
      if (this.fzPro) {
        let complexConfig = this.fzDataMap(this.rulesList);
        if (this.checkBox_2.length) {
          API.labelSetDerivedIndexSave(
            reqFormatDic({
              projectId: this.fzPro,
              complexConfig,
              labelId: this.checkBox_2[0].id,
            })
          ).then((res) => {
            new ResDatas({
              res,
            }).state();
            if (res.data.data) {
              cb(res.data.data.id, res.data.data.labelId);
            }
            this.getList();
          });
        }
      }
    },
    // 复杂标签 获取编辑时的规则列表
    getEditRulesList(id) {
      API.labelSetDerivedIndexRulesList({ id }).then((res) => {
        let Res = new ResDatas({
          res,
        }).init();
        if (Res) {
          const { complexConfig } = Res;
          let arr = [];
          this.fzDataMap_(complexConfig, arr);
          this.rulesList = arr.reverse();
        }
      });
    },
    fzUpdate({ id, labelId, updateFrequency, updateMethod }) {
      let complexConfig = this.fzDataMap(this.rulesList);
      API.labelSetSaveUpdate(
        reqFormatDic({
          projectId: this.fzPro,
          complexConfig,
          id,
          labelId,
          updateFrequency,
          updateMethod,
        })
      ).then((res) => {
        new ResDatas({
          res,
        }).state();
        this.getList();
      });
    },
    /* 派生指标——弹出框-表格 */
    pszbGetList() {
      if (this.indicatorId_) {
        this.TLoading_pszb = true;
        let dimensionList = [];
        this.pszbWD.forEach((item) => {
          dimensionList.push({
            code: item[1],
            parentCode: item[0],
          });
        });
        let dimensionList__ = null;
        if (!dimensionList.length) {
          dimensionList__ = null;
        } else {
          dimensionList__ = dimensionList;
        }
        API.labelSetDerivedIndex({
          indicatorId: this.indicatorId_,
          dimensionList: dimensionList__,
          name: this.likeSearch,
          pageNo: this.TPage_pszb.index,
          pageSize: this.TPage_pszb.size,
          timeModifier: this.time,
        }).then((res) => {
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
            "TLoading_pszb",
            this
          );
          if (Res.init()) {
            const { data, total, pageSize, title, index } = Res.formatData();
            this.tableTitle_pszb = title;
            this.tableData_pszb = data;
            this.TPage_pszb = {
              total,
              size: pageSize,
              index,
            };
          } else {
            this.tableData_pszb = [];
            this.TPage_pszb = {
              total: 0,
              size: 10,
              index: 1,
            };
          }
        });
      }
    },
    // 预测
    ycBarView() {
      // API
      this.ycBarList = [
        {
          name: "全部 :",
          value: 321,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
        {
          name: "注册资本高 :",
          value: 250,
          unit: "家",
        },
      ];
      let max = 0;
      let maxArr = [];
      this.ycBarList.forEach((item) => {
        maxArr.push(Number(item.value));
      });
      max = Math.max.apply(Math, maxArr);

      this.ycBarList.forEach((item) => {
        item["width"] = this.ycBar(max, Number(item.value));
        item["zb"] = Number((Number(item.value) / max).toFixed(2)) * 100;
      });
      console.log(this.ycBarList);
    },
  },
  mounted() {
    this.getProject();
    this.getYWBK("BUSINESS_TYPE");
    this.getYWBK("UPDATE_METHOD");
    this.getYWBK("UPDATE_FREQUENCY");
    this.getYWBK("COMPLEX_EXPRESS");
    this.getTagGroup();
    this.getList();
    this.getTime();
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.label-set {
  font-size: 14px;
  &-edit-area {
    overflow: hidden;
    &-btn {
      float: left;
      overflow: hidden;
      li {
        float: left;
        margin: 2px 5px;
      }
    }
    &-select {
      float: right;
      overflow: hidden;
      margin: 4px;
      li {
        float: left;
        margin-right: 10px;
        & > div {
          width: 120px;
        }
        &:last-child {
          & > div {
            width: 150px;
          }
        }
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
  .soltDigContent {
    // 选择标签
    .change-label {
      overflow: hidden;
      margin-bottom: 5px;
      li {
        float: left;
        height: 35px;
        line-height: 35px;
        margin-right: 10px;
      }
    }
  }
  .soltDigContent_1 {
    display: flex;
    height: 390px;
    overflow: hidden;
    .lt {
      width: 450px;
      box-sizing: border-box;
      .search {
        margin: 45px 0 5px 0;
      }
      /deep/ .el-table {
        th {
          background-color: $table_title_bg;
          // padding: 2px 0;
        }
        thead {
          color: $table_title_color;
        }
        // 可点击-跳转
        .clickStyle {
          text-decoration: underline;
          color: $table_link_color;
          cursor: pointer;
          &:hover {
            color: $table_link_color_hover;
          }
          //   弹出框
          &-dialog {
            color: $table_link_color;
            cursor: pointer;
            &:hover {
              color: $table_link_color_hover;
            }
          }
        }
        // 激活当前行
        .active-row {
          background: $table_row_active;
        }
        .el-button--text {
          color: $table_edit_btn_border_color_active;
        }
      }
      //  分页
      .pagination {
        margin: 15px 0;
      }
    }
    .rt {
      flex: 1;
      box-sizing: border-box;
      padding-left: 4px;
      .select {
        overflow: hidden;
        li {
          float: left;
          height: 35px;
          line-height: 35px;
        }
      }
      .title {
        margin: 10px 0;
        margin-top: 15px;
        & > i {
          display: inline-block;
          width: 3px;
          height: 15px;
          background: $table_edit_btn_border_color_active;
          position: relative;
          top: 3px;
        }
      }
    }
  }
  // 复杂标签
  .fzTag {
    .m-title {
      height: 25px;
      line-height: 25px;
      position: relative;
      overflow: hidden;
      i {
        position: absolute;
        top: 5px;
        width: 3px;
        height: 15px;
        background: $lt_menu_bg_active;
      }
      span {
        display: inline-block;
        height: 18px;
        line-height: 18px;
        margin-left: 12px;
        font-size: 14px;
      }
    }
    .query-select {
      .select {
        margin: 10px 0;
        overflow: hidden;
        li {
          float: left;
          &:first-child {
            margin-right: 100px;
          }
        }
      }
    }
    .tag-rules {
      height: 305px;
      overflow: hidden;
      box-sizing: border-box;
      .rule-area {
        height: calc(100% - 35px);
        overflow: auto;
        box-sizing: border-box;
        margin-top: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 5px;
        padding-left: 5px;
        .rule-area-default {
          position: relative;
          line-height: 37px;
          margin-bottom: 5px;
          padding-right: 5px;
          overflow: hidden;
          .ljysf {
            position: relative;
            overflow: hidden;
            i {
              position: relative;
              left: 35px;
              display: block;
              width: 2px;
              height: 24px;
              background: #e4e7ed;
            }
            .ljysf-lhf {
              width: 80px;
            }
          }
          & > i {
            float: left;
            width: 30px;
            height: 30px;
            line-height: 28px;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 5px;
            text-align: center;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px solid #e4e7ed;
            font-size: 12px;
            font-style: normal;
            margin-left: 22px;
          }
          .bk {
            position: relative;
            top: 3px;
            float: left;
            width: 205px;
            margin-right: 10px;
          }
          .select-search {
            float: left;
            width: 255px;
          }
          .select-btn {
            position: relative;
            top: 5px;
            float: left;
            margin-left: 5px;
            margin-right: 10px;
          }
          .ysf {
            float: left;
            width: 120px;
            margin-right: 10px;
          }
          .num {
            float: left;
            width: 80px;
            margin-right: 2px;
          }
          .unit {
            float: left;
            overflow: hidden;
          }
          .edit {
            position: relative;
            top: 4px;
            float: right;
            width: 75px;
            font-size: 30px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            span {
              cursor: pointer;
              &:hover {
                color: #01c1df;
              }
            }
          }
        }
      }
    }
  }
  // 派生指标
  .pszbDig {
    overflow: hidden;
    .search-pszb {
      margin-bottom: 20px;
    }
    .area {
      overflow: hidden;
      .m-title {
        height: 25px;
        line-height: 25px;
        position: relative;
        overflow: hidden;
        margin-bottom: 10px;
        i {
          position: absolute;
          top: 5px;
          width: 3px;
          height: 15px;
          background: $lt_menu_bg_active;
        }
        span {
          display: inline-block;
          height: 18px;
          line-height: 18px;
          margin-left: 12px;
          font-size: 14px;
        }
      }
      .lt {
        float: left;
        width: 240px;
        margin-right: 10px;
      }
      .rt {
        float: left;
        width: calc(100% - 250px);
        .query {
          overflow: hidden;
          li {
            float: left;
            margin-right: 35px;
            &:last-child {
              margin-right: 0;
            }
          }
        }
      }
    }
  }
  // 预测
  .yc {
    height: 355px;
    overflow: auto;
    .list {
      overflow: hidden;
      li {
        width: 100%;
        height: 30px;
        line-height: 28px;
        box-sizing: border-box;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .name {
          float: left;
          width: 102px;
          height: 30px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          box-sizing: border-box;
          text-align: right;
          padding-right: 10px;
        }
        p {
          float: left;
          width: 325px;
          height: 30px;
          overflow: hidden;
          border-radius: 17px;
          background: linear-gradient(
            90deg,
            rgba(119, 206, 255, 1) 0%,
            rgba(119, 144, 255, 1) 100%
          );
          i {
            float: right;
            margin-right: 20px;
            color: #fff;
            font-style: normal;
          }
        }
        .num {
          float: left;
          margin-left: 8px;
          box-sizing: border-box;
          width: 70px;
          height: 30px;
          overflow: hidden;
          & > span {
            display: inline-block;
            max-width: 49px;
            height: 30px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          b {
            position: relative;
            top: -11px;
            left: -4px;
            display: inline-block;
            height: 30px;
            line-height: 28px;
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>
