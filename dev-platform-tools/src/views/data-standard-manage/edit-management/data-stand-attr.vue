<!--
 * @Author: Marlon
 * @Date: 2020-07-20 22:10:00
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-30 08:37:14
 * @Description: 数据标准-编辑管理-数据标准属性
--> 

<template>
  <div class="data-set">
    <div class="data-set-edit-area">
      <ul class="data-set-edit-area-btn">
        <li>
          <AddButton text="新增" @click="showDialog" :clickArgs="{type:'新增'}"></AddButton>
        </li>
      </ul>
      <ul class="data-set-edit-area-select">
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
        <li>
          <el-input placeholder="请输入中文(英文)" v-model="dataSetVal" size="small" style="width: 195px;">
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
    <div class="data-set-table">
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
        :TRowDrop="true"
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
      SoltDigWidth="650"
      @editBtnCb="editBtnCb"
    >
      <el-form slot="soltDigContent" :model="dataSetForm" :rules="rules" ref="form_1">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目：" :label-width="'100px'" prop="areaId">
              <el-select
                v-model="dataSetForm.areaId"
                placeholder="请选择项目"
                @change="handleChange('areaId',$event)"
              >
                <el-option
                  v-for="item in proList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务板块：" :label-width="'100px'" prop="businessSectorId">
              <el-select
                v-model="dataSetForm.businessSectorId"
                placeholder="请选择"
                @change="handleChange('businessSectorId',$event)"
              >
                <el-option
                  v-for="item in businessSectorDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据集分类：" :label-width="'100px'" prop="businessStageId">
              <el-select
                v-model="dataSetForm.businessStageId"
                placeholder="请选择"
                @change="handleChange('businessStageId',$event)"
              >
                <el-option
                  v-for="item in dataClassifyDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据集：" :label-width="'100px'" prop="dataSetId">
              <el-select v-model="dataSetForm.dataSetId" placeholder="请选择">
                <el-option
                  v-for="item in dataSetDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中文名称：" :label-width="'100px'" prop="name">
              <el-input v-model="dataSetForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="英文名称：" :label-width="'100px'" prop="code">
              <el-input v-model="dataSetForm.code"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据类型：" :label-width="'100px'" prop="dataType">
              <el-select v-model="dataSetForm.dataType" placeholder="请选择">
                <el-option
                  v-for="item in dataTypeDic"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据格式：" :label-width="'100px'" prop="dataFormat">
              <el-select v-model="dataSetForm.dataFormat" placeholder="请选择">
                <el-option
                  v-for="item in dataFormatDic"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col
            :span="12"
            v-if="dataSetForm.dataFormat==='N..'||dataSetForm.dataFormat==='C'||dataSetForm.dataFormat==='C..'"
          >
            <el-form-item label="数据长度：" :label-width="'100px'">
              <el-input-number
                size="small"
                v-model="dataSetForm.numLength"
                :min="0"
                :max="65535"
                label="描述文字："
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dataSetForm.dataFormat==='N..'">
            <el-form-item label="数据精度：" :label-width="'100px'">
              <el-input-number size="small" v-model="dataSetForm.numPrecision" :min="0" :max="50"></el-input-number>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="属性类型：" :label-width="'100px'" prop="businessType">
              <el-select v-model="dataSetForm.businessType" placeholder="请选择类型">
                <el-option
                  v-for="item in businessTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公开范围：" :label-width="'100px'">
              <el-radio v-model="dataSetForm.openRange" label="社会公开">社会公开</el-radio>
              <el-radio v-model="dataSetForm.openRange" label="政务公开">政务公开</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="值域：" :label-width="'100px'">
              <el-radio-group v-model="dataSetForm.domainType">
                <el-radio :label="1">文本</el-radio>
                <el-radio :label="2">代码集</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="dataSetForm.domainType===2">
            <el-form-item label="代码集：" :label-width="'100px'">
              <el-select v-model="dataSetForm.codeSetId" placeholder="请选择">
                <el-option
                  v-for="item in codeSetDic"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="唯一标识：" :label-width="'100px'">
              <el-switch v-model="dataSetForm.isSole"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否必填：" :label-width="'100px'">
              <el-switch v-model="dataSetForm.isRequired"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注：" :label-width="'100px'">
              <el-input type="textarea" v-model="dataSetForm.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </SoltDialog>
    <!-- 复制 -->
    <SoltDialog
      :SoltDigShow="SoltDigShow_1"
      :SoltDigTitle="SoltDigTitle_1"
      :soltDFootBtn="soltDFootBtn_1"
      SoltDigWidth="800"
      @editBtnCb="editBtnCb"
    >
      <div slot="soltDigContent" class="data-set-copy">
        <ul class="q">
          <li>
            <label for>项目：</label>
            <el-select
              v-model="proValDig"
              clearable
              filterable
              placeholder="请选择项目"
              size="small"
              @change="clearVals(4)"
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
              v-model="blockValDig"
              filterable
              clearable
              placeholder="请选择业务板块"
              size="small"
            >
              <el-option
                v-for="item in businessSectorDic"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-input
              placeholder="请输入数据集编码或名称"
              v-model="dataSetValDig"
              size="small"
              style="width: 195px;"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-search"
                style="cursor: pointer;"
                @click="getCopyList"
              ></i>
            </el-input>
          </li>
        </ul>
        <TableDefault
          TId="datastand_copy"
          :THeight="481"
          :TAlign="TAlign_1"
          :TLoading="TLoading_1"
          :TTitle="tableTitle_1"
          :TData="tableData_1"
          :TEdit="TEdit_1"
          :TIsShowPage="false"
          :TIsShowCheckBox="true"
          @handleSelectionChange="handleSelectionChange"
        ></TableDefault>
      </div>
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

export default {
  mixins: [mixin],
  components: { SoltDialog },
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
      dataSetVal: "",
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
            label: "复制",
            css: "text",
          },
          {
            label: "删除",
            css: "text",
            pass: true,
          },
        ],
      },
      tableTitle: [
        { label: "项目", prop: "areaName" },
        { label: "业务板块名称", prop: "sectorName" },
        { label: "数据集分类名称", prop: "stageName" },
        { label: "数据集名称", prop: "dataSetName" },
        { label: "英文名称", prop: "code" },
        { label: "中文名称", prop: "name" },
        { label: "数据类型", prop: "dataType" },
        { label: "数据格式", prop: "dataFormat" },
        { label: "值域", prop: "domain" },
        { label: "公开范围", prop: "openRange" },
        { label: "唯一标识", prop: "isSoleStr" },
        { label: "是否必填", prop: "isRequiredStr" },
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
          type: "dialog",
          cells: ["domain"],
          cb: (form) => {
            const { domainType } = form.row;
            if (2 === domainType) {
              cellJump(this, {
                row: {
                  ...form.row,
                },
                column: null,
                TClickItem: [
                  {
                    link: "/dataStandardManage/editManage/codeSet",
                    jump: {
                      type: "int",
                      mode: "push",
                    },
                  },
                ],
              });
            }
          },
        },
      ],
      // 弹出框
      SoltDigShow: false,
      SoltDigTitle: "",
      soltDFootBtn: [],
      dataTypeDic: [
        {
          value: "string",
          label: "字符串",
        },
        {
          value: "number",
          label: "数字",
        },
        {
          value: "date",
          label: "日期",
        },
      ],
      dataFormatDic: [],
      codeSetDic: [],
      dataClassifyDic: [],
      areaDictionary: [],
      dataSetDic: [],
      businessSectorDic: [],
      businessTypeList: [
        {
          id: 1,
          name: "系统属性",
        },
        {
          id: 2,
          name: "业务属性",
        },
      ], // 字段类型
      dataSetForm: {
        areaId: "",
        businessSectorId: "",
        businessStageId: "",
        dataSetId: "",
        name: "",
        code: "",
        dataType: "",
        dataFormat: "",
        numLength: 100,
        numPrecision: 2,
        openRange: "社会公开",
        domainType: 1,
        codeSetId: "",
        isSole: false,
        isRequired: false,
        remark: "",
        businessType: "",
      },
      rules: {
        areaId: [{ required: true, message: "请选择项目", trigger: "change" }],
        businessSectorId: [
          { required: true, message: "请选择业务板块", trigger: "change" },
        ],
        businessStageId: [
          { required: true, message: "请选择数据集分类", trigger: "change" },
        ],
        dataSetId: [
          { required: true, message: "请选择数据集", trigger: "change" },
        ],
        dataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        dataFormat: [
          { required: true, message: "请选择数据格式", trigger: "change" },
        ],
        businessType: [
          { required: true, message: "请选择属性类型", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入中文名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入英文名称", trigger: "blur" }],
      },
      // 复制
      SoltDigShow_1: false,
      SoltDigTitle_1: "",
      soltDFootBtn_1: [
        {
          label: "确定",
          css: "primary",
          cb: () => {
            if (this.SoldCheckBox.length) {
              this.copy();
            } else {
              this.$message({
                message: "请选择数据集",
                type: "warning",
              });
            }
          },
        },
      ],
      proValDig: "",
      blockValDig: "",
      dataSetValDig: "",
      TLoading_1: false,
      TAlign_1: [
        {
          key: "left",
          item: [],
        },
      ],
      TEdit_1: {
        show: false,
      },
      tableTitle_1: [
        { label: "数据集编码", prop: "code" },
        { label: "数据集名称", prop: "name" },
      ],
      tableData_1: [],
      SoldCheckBox: [],
      activeRow_: null,
    };
  },
  watch: {
    proVal(newVal) {
      if (newVal) {
        this.getSectorList({ areaId: newVal });
      }
      this.getList();
    },
    blockVal(newVal) {
      if (newVal) {
        this.getSortList({ sectorId: newVal });
      }
      this.getList();
    },
    classifyVal(newVal) {
      if (newVal) {
        this.getDataSet({ stageId: newVal });
      }
      this.getList();
    },
    dataSetValList(newVal) {
      this.getList();
    },
    proValDig(newVal) {
      if (newVal) {
        this.getSectorList({ areaId: newVal, type: "dig" });
      }
      this.getCopyList();
    },
    blockValDig() {
      this.getCopyList();
    },
    "dataSetForm.areaId": {
      handler(newVal) {
        if (newVal) {
          this.getSectorList({ areaId: newVal, type: "dig" });
          this.getCodeSetList(newVal);
        }
      },
    },
    "dataSetForm.businessSectorId": {
      handler(newVal) {
        if (newVal) {
          this.getSortList({ sectorId: newVal, type: "dig" });
        }
      },
    },
    "dataSetForm.businessStageId": {
      handler(newVal) {
        if (newVal) {
          this.getDataSet({ stageId: newVal, type: "dig" });
        }
      },
    },
    "dataSetForm.dataType": {
      handler(newVal) {
        if (newVal) {
          this.handleDataType(newVal);
        }
      },
    },
    SoltDigShow(newVal) {
      if (!newVal && this.$refs["form_1"]) {
        this.$refs["form_1"].resetFields();
      }
    },
  },
  methods: {
    editBtnCb(editItem, tid, row) {
      let text = editItem.label;
      if (text === "close") {
        this.SoltDigShow_1 = this.SoltDigShow = editItem.close;
        this.activeRow_ = null;
        this.dataSetForm = {
          areaId: "",
          businessSectorId: "",
          businessStageId: "",
          dataSetId: "",
          name: "",
          code: "",
          dataType: "",
          dataFormat: "",
          numLength: 100,
          numPrecision: 2,
          openRange: "社会公开",
          domainType: 1,
          codeSetId: "",
          isSole: false,
          isRequired: false,
          remark: "",
          businessType: "",
        };
      }
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList();
    },
    // 单元格事件
    lickCell({ row, column, id }) {
      const {
        areaId,
        businessSectorId,
        businessStageId,
        dataSetId,
        name,
        code,
        dataType,
        format = "",
        openRange = "",
        domainType,
        codeSetId = "",
        isSole,
        isRequired,
        remark,
        businessType = "",
        dataFormat = "",
      } = row;
      switch (column.label) {
        case "编辑":
          {
            let dataFormat_ = "";
            let numPrecision = 0;
            let numLength = 0;
            if (format && format.indexOf(",") !== -1) {
              dataFormat_ = format.split(",")[0];
              numLength = format.split(",")[1]
                ? parseInt(format.split(",")[1])
                : 0;
              numPrecision = format.split(",")[2]
                ? parseInt(format.split(",")[2])
                : 0;
            } else {
              dataFormat_ = dataFormat;
            }
            this.showDialog({
              type: column.label,
              initDig: {
                areaId,
                businessSectorId,
                businessStageId,
                dataSetId,
                name,
                code,
                dataType,
                dataFormat: dataFormat_,
                numLength,
                numPrecision,
                openRange,
                domainType,
                codeSetId,
                isSole: isSole ? true : false,
                isRequired: isRequired ? true : false,
                remark,
                businessType,
              },
              row,
            });
          }
          return;
        case "复制":
          {
            const { areaId, businessSectorId } = row;
            this.activeRow_ = row;
            this.proValDig = areaId;
            this.blockValDig = businessSectorId;
            this.SoltDigTitle_1 = "复制属性到";
            this.SoltDigShow_1 = true;
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
                this.del(row.id);
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
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
      } else if (3 === type) {
        this.dataSetValList = "";
        this.dataSetList = [];
      } else if (4 === type) {
        this.blockValDig = "";
        this.businessSectorDic = [];
      } else {
        this.dataSetList = [];
        this.dataSetValList = "";
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
    // 数据类型级联
    handleDataType(value) {
      this.$set(this.dataSetForm, `dataFormat`, "");
      switch (value) {
        case "string":
          {
            this.dataFormatDic = [
              {
                value: "C",
                label: "C",
              },
              {
                value: "C..",
                label: "C..",
              },
              {
                value: "C..ul",
                label: "C..ul",
              },
            ];
          }
          break;
        case "number":
          {
            this.dataFormatDic = [
              {
                value: "N..",
                label: "N..",
              },
            ];
          }
          break;
        case "date":
          {
            this.dataFormatDic = [
              {
                value: "yyyyMMdd",
                label: "yyyyMMdd",
              },
              {
                value: "yyyyMMddHHmmss",
                label: "yyyyMMddHHmmss",
              },
            ];
          }
          break;
        default:
          break;
      }
    },
    // 显示弹出框并修改配置
    showDialog({ type, initDig = null, row = null }) {
      switch (type) {
        case "新增":
          {
            this.SoltDigTitle = "新增属性";
            this.$set(this.dataSetForm, `areaId`, this.proVal);
            this.$set(this.dataSetForm, `businessSectorId`, this.blockVal);
            this.$set(this.dataSetForm, `businessStageId`, this.classifyVal);
            this.$set(this.dataSetForm, `dataSetId`, this.dataSetValList);
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs["form_1"].validate((valid) => {
                    if (valid) {
                      if (
                        this.dataSetForm.dataFormat == "C" ||
                        this.dataSetForm.dataFormat == "C.."
                      ) {
                        if (this.dataSetForm.numLength) {
                          // TODO
                        } else {
                          this.$message({
                            message: "请选择长度",
                            type: "warning",
                          });
                          return;
                        }
                      } else if (this.dataSetForm.dataFormat == "N..") {
                        if (
                          this.dataSetForm.numLength &&
                          this.dataSetForm.numPrecision
                        ) {
                          // TODO
                        } else {
                          this.$message({
                            message: "请选择长度和精度",
                            type: "warning",
                          });
                          return;
                        }
                      }
                      if (2 === this.dataSetForm.domainType) {
                        if (this.dataSetForm.codeSetId) {
                          //  TODO
                        } else {
                          this.$message({
                            message: "请选择代码集",
                            type: "warning",
                          });
                          return;
                        }
                      }
                      // 验证通过
                      this.add();
                    }
                  });
                },
              },
            ];
          }
          return;
        case "编辑":
          {
            const {
              areaId,
              businessSectorId,
              businessStageId,
              dataSetId,
              name,
              code,
              dataType,
              dataFormat,
              numLength,
              numPrecision,
              openRange,
              domainType,
              codeSetId,
              isSole,
              isRequired,
              remark,
              businessType,
            } = initDig;
            this.SoltDigTitle = "编辑属性";
            this.dataSetForm = {
              areaId,
              businessSectorId,
              businessStageId,
              dataSetId,
              name,
              code,
              dataType,
              dataFormat,
              numLength,
              numPrecision,
              openRange,
              domainType,
              codeSetId,
              isSole,
              isRequired,
              remark,
              businessType,
            };
            setTimeout(() => {
              this.dataSetForm = {
                areaId,
                businessSectorId,
                businessStageId,
                dataSetId,
                name,
                code,
                dataType,
                dataFormat,
                numLength,
                numPrecision,
                openRange,
                domainType,
                codeSetId,
                isSole,
                isRequired,
                remark,
                businessType,
              };
            }, 0);
            this.SoltDigShow = true;
            this.soltDFootBtn = [
              {
                label: "确定",
                css: "primary",
                cb: ({ Item }) => {
                  this.$refs["form_1"].validate((valid) => {
                    if (valid) {
                      if (
                        this.dataSetForm.dataFormat == "C" ||
                        this.dataSetForm.dataFormat == "C.."
                      ) {
                        if (!this.dataSetForm.numLength) {
                          this.$message({
                            message: "请选择长度",
                            type: "warning",
                          });
                          return;
                        }
                      } else if (this.dataSetForm.dataFormat == "N..") {
                        if (
                          this.dataSetForm.numLength &&
                          this.dataSetForm.numPrecision
                        ) {
                        } else {
                          this.$message({
                            message: "请选择长度和精度",
                            type: "warning",
                          });
                          return;
                        }
                      }
                      if (2 === this.dataSetForm.domainType) {
                        if (!this.dataSetForm.codeSetId) {
                          this.$message({
                            message: "请选择代码集",
                            type: "warning",
                          });
                          return;
                        }
                      }
                      // 验证通过
                      this.update(row);
                    }
                  });
                },
              },
            ];
          }
          return;
        default:
          return;
      }
    },
    // 多选
    handleSelectionChange(type, selectionArr) {
      if (type === "checkbox") {
        this.SoldCheckBox = selectionArr;
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
        sectorId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
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
        stageId,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if ("dig" == type) {
          if (Res) {
            this.dataSetDic = Res;
          } else {
            this.dataSetDic = [];
          }
        } else {
          if (Res) {
            Res.forEach((item) => {
              item["label"] = item.name;
              item["value"] = item.id;
            });
            this.dataSetList = Res;
          } else {
            this.dataSetList = [];
          }
        }
      });
    },
    // 代码集
    getCodeSetList(areaId) {
      API.getCodeSetDic({ areaId }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).init();
        if (Res) {
          this.codeSetDic = Res;
        } else {
          this.codeSetDic = [];
        }
      });
    },
    // 复制-属性列表
    getCopyList() {
      this.TLoading_1 = true;
      this.tableData_1 = [];
      API.dataStageAttrCopyList({
        areaId: this.proValDig,
        businessSectorId: this.blockValDig,
        likeStr: this.dataSetValDig,
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
            "TLoading_1",
            this
          );
          if (Res.init()) {
            const { data, total, title } = Res.formatData();
            this.tableTitle_1 = title;
            this.tableData_1 = data;
          } else {
            this.tableData_1 = [];
          }
        })
        .catch((err) => {
          this.TLoading_1 = false;
        });
    },
    // 获取
    getList() {
      this.TLoading = true;
      this.tableData = [];
      API.getDataSetAttrList({
        areaId: this.proVal,
        businessSectorId: this.blockVal,
        businessStageId: this.classifyVal,
        dataSetId: this.dataSetValList,
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
    add() {
      // 数据处理
      let dataFormat_ = "";
      const {
        dataFormat,
        numLength,
        numPrecision,
        isSole,
        isRequired,
      } = this.dataSetForm;
      if ("N.." === dataFormat) {
        dataFormat_ = `${dataFormat}${numLength},${numPrecision}`;
      } else if ("C" === dataFormat || "C.." === dataFormat) {
        dataFormat_ = `${dataFormat}${numLength}`;
      } else {
        dataFormat_ = dataFormat;
      }
      API.addDataSetAttr({
        ...this.dataSetForm,
        dataFormat: dataFormat_,
        isSole: isSole ? 1 : 0,
        isRequired: isRequired ? 1 : 0,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.SoltDigShow = false;
        this.getList();
        this.dataSetForm = {
          areaId: "",
          businessSectorId: "",
          businessStageId: "",
          dataSetId: "",
          name: "",
          code: "",
          dataType: "",
          dataFormat: "",
          numLength: 100,
          numPrecision: 2,
          openRange: "社会公开",
          domainType: 1,
          codeSetId: "",
          isSole: false,
          isRequired: false,
          remark: "",
        };
      });
    },
    // 删除
    del(id) {
      API.deleteDataSetAttr({ id }).then((res) => {
        new ResDatas({
          res,
          code: 0,
        }).state();
        this.getList();
      });
    },
    // 编辑
    update({ id }) {
      // 数据处理
      let dataFormat_ = "";
      const {
        dataFormat,
        numLength,
        numPrecision,
        isSole,
        isRequired,
      } = this.dataSetForm;
      if ("N.." === dataFormat) {
        dataFormat_ = `${dataFormat}${numLength},${numPrecision}`;
      } else if ("C" === dataFormat || "C.." === dataFormat) {
        dataFormat_ = `${dataFormat}${numLength}`;
      } else {
        dataFormat_ = dataFormat;
      }
      API.updateDataSetAttr({
        ...this.dataSetForm,
        dataFormat: dataFormat_,
        isSole: isSole ? 1 : 0,
        isRequired: isRequired ? 1 : 0,
        id,
      }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.SoltDigShow = false;
        this.getList();
      });
    },
    // 复制
    copy() {
      if (this.activeRow_ && this.proValDig) {
        let dataSetIdList = [];
        this.SoldCheckBox.forEach((item) => {
          dataSetIdList.push(item.id);
        });
        API.dataStageAttrCopy({
          id: this.activeRow_.id,
          areaId: this.proValDig,
          dataSetIdList,
        }).then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).state();
          this.SoltDigShow_1 = false;
          this.getList();
        });
      }
    },
    // 拖拽排序
    rowDrop({ $el }) {
      const _this = this;
      Sortable.create($el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          let idList = [];
          _this.tableData.forEach((item) => {
            idList.push(item.id);
          });
          API.sjbzsxSort({
            idList,
          }).then((res) => {
            let Res = new ResDatas({
              res,
              code: 0,
            }).state();
            _this.getList();
          });
        },
      });
    },
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { name } = JSON.parse(this.$route.query.column);
      const {
        areaId,
        jumpName = "",
        id,
        businessSectorId,
        businessStageId,
      } = JSON.parse(this.$route.query.row);
      if ("项目管理" === name) {
        this.proVal = areaId;
      } else if ("业务板块" === jumpName) {
        this.proVal = areaId;
        this.blockVal = id;
      } else if ("数据集分类" === jumpName) {
        this.proVal = areaId;
        this.blockVal = businessSectorId;
      } else if ("数据集" === jumpName) {
        this.proVal = areaId;
        this.blockVal = businessSectorId;
        this.classifyVal = businessStageId;
        this.dataSetValList = id;
      }
    }
    this.getProList({ init: true });
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.data-set {
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
  // 复制
  .data-set-copy {
    .q {
      overflow: hidden;
      li {
        float: left;
        margin-right: 17px;
      }
    }
  }
}
</style>
