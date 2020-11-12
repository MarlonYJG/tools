<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-25 20:08:57
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-28 13:31:41
 * @Description: 指标管理-派生指标管理
--> 
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="派生指标管理" name="first">
        <!-- header中select&&input -->
        <div class="derive-list">
          <ul class="derive-list-btn">
            <li>
              <AddButton text="新建派生指标" @click="addTask_btn" :clickArgs="{type: '新建派生指标'}"></AddButton>
              <el-button size="medium" @click="delTask_btn()">批量删除</el-button>
              <el-button size="medium" @click="exportExcel_btn()">
                <i class="el-icon-upload el-icon--left" />Excel导出
              </el-button>
              <el-button size="medium" @click="polymerization_btn()">指标聚合</el-button>
              <!-- <el-button size="medium" @click="manyInit_btn()">批量初始化</el-button>
              <el-button size="medium" @click="manyEffect_btn()">批量生效</el-button>-->
              <el-button size="medium" @click="collects(1)">批量收藏</el-button>
            </li>
          </ul>
          <div class="derive-list-selectBox">
            <ul class="derive-list-selectBox-one">
              <li>
                <label for>选择项目：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectProject"
                  @change="ProjectChange"
                  clearable
                >
                  <el-option
                    v-for="item in areaListCenterArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>业务板块：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectPlate"
                  @change="PlateChange"
                  clearable
                >
                  <el-option
                    v-for="item in plateListCenterArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>数据域：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectYu"
                  @change="YuChange"
                  clearable
                >
                  <el-option
                    v-for="item in dataManyListCenter"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>指标来源：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectFinger"
                  @change="FingerChange"
                  clearable
                >
                  <el-option
                    v-for="item in selectFingerArr"
                    :key="item.indicatorSourceId"
                    :label="item.indicatorSourceName"
                    :value="item.indicatorSourceId"
                  ></el-option>
                </el-select>
              </li>
            </ul>
            <ul class="derive-list-selectBox-two">
              <li>
                <label for>时间修饰词：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:250px"
                  v-model="slectTime"
                  @change="TimeChange"
                  multiple
                  clearable
                >
                  <el-option
                    v-for="item in slectTimeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>选择维度：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectDegree"
                  @change="DegreeChange"
                  clearable
                >
                  <el-option
                    v-for="item in selectDegreeArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>状态：</label>
                <el-select
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  style="width:100px"
                  v-model="selectState"
                  @change="StateChange"
                  clearable
                >
                  <el-option
                    v-for="item in selectStateArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <el-input
                  placeholder="派生指标名称查询"
                  size="small"
                  style="width:200px"
                  v-model="inputSendCheck"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="SendCheckChange"
                  ></i>
                </el-input>
              </li>
            </ul>
          </div>
        </div>
        <!-- 表格 -->
        <div class="task-list-table">
          <TableDefault
            :TLoading="TLoading"
            :TIsShowCheckBox="true"
            :TAlign="TAlign"
            :TTitle="tableTitle"
            :TData="tableData"
            :TEdit="TEdit"
            :TIsShowPage="true"
            :TTotal="TPage.total"
            :TCurrentPage="TPage.index"
            :TPageSize="TPage.size"
            @clickCell="lickCell"
            @changePage="changePage"
            @handleSelectionChange="handleSelectionChange"
          ></TableDefault>
        </div>
        <!-- 新增弹出框 -->
        <derived-dialog
          :FDTitle="FDTitle"
          :FDVisible="FDVisible"
          :FDId="FDId"
          :FDWidth="FDWidth"
          :parForm="parForm"
          :isShowFooter="isShowFooter"
          :areaListCenterArr="areaListCenterArr"
          :plateListCenterArr="plateListCenterArr"
          :dataManyListCenter="dataManyListCenter"
          :selectFingerArr="selectFingerArr"
          :slectTimeArr="slectTimeArr"
          @editBtnCb="editBtnCb"
          @sunSelectChangeCallback="sunSelectChangeCallback"
          @submitForm="submitForm"
        ></derived-dialog>
        <!--  编辑查看弹出框-->
        <el-dialog
          :title="AllFDTitle"
          :visible.sync="AllFDVisible"
          width="500px"
          class="form_dialog"
          :before-close="AllhandleClose"
          :close-on-click-modal="false"
        >
          <el-form
            :model="Allform"
            :rules="AllrulesData"
            ref="AllruleForm"
            :label-position="AlllabelPosition"
            class="TDForm"
          >
            <el-form-item label="所属项目：" :label-width="AllformLabelWidth" prop="projectName">
              <el-select
                v-model="Allform.projectName"
                style="width:280px"
                :disabled="AllisDisabled"
              >
                <el-option
                  v-for="(items, i) in []"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务板块名称：" :label-width="AllformLabelWidth" prop="plateName">
              <el-select v-model="Allform.plateName" style="width:280px" :disabled="AllisDisabled">
                <el-option
                  v-for="(items, i) in []"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据域：" :label-width="AllformLabelWidth" prop="fenlName">
              <el-select v-model="Allform.fenlName" style="width:280px" :disabled="AllisDisabled">
                <el-option
                  v-for="(items, i) in []"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="派生指标名称：" :label-width="AllformLabelWidth" prop="pszbName">
              <el-input
                v-model="Allform.pszbName"
                autocomplete="off"
                style="width:280px"
                :disabled="this.AllFDTitle == '编辑派生指标' ? false : true"
              ></el-input>
            </el-form-item>
            <el-form-item label="单位：" :label-width="AllformLabelWidth" prop="dwName">
              <el-input
                v-model="Allform.dwName"
                autocomplete="off"
                style="width:280px"
                :disabled="this.AllFDTitle == '编辑派生指标' ? false : true"
              ></el-input>
            </el-form-item>
            <el-form-item label="指标来源名称：" :label-width="AllformLabelWidth" prop="zblyName">
              <el-input
                v-model="Allform.zblyName"
                autocomplete="off"
                style="width:280px"
                :disabled="AllisDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="时间修饰词：" :label-width="AllformLabelWidth" prop="sjxsName">
              <el-input
                v-model="Allform.sjxsName"
                autocomplete="off"
                style="width:280px"
                :disabled="AllisDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="地域修饰词：" :label-width="AllformLabelWidth" prop="dyxsName">
              <el-input
                v-model="Allform.dyxsName"
                autocomplete="off"
                style="width:280px"
                :disabled="AllisDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="维度选择：" :label-width="AllformLabelWidth" prop="xdxzName">
              <div v-for="(item,index) in Allform.xdxzName" :key="index">
                <el-input
                  autocomplete="off"
                  style="width:280px;margin-bottom:20px;"
                  :disabled="AllisDisabled"
                  :value="item"
                ></el-input>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="AllisShowFooter">
            <el-button type="primary" size="medium" @click="AllSubmitForm()">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 聚合指标弹出框 -->
        <soltDialog
          :SoltDigShow="soltDigShow"
          :SoltDigTitle="soltDigTitle"
          :soltDFootBtn="soltDFootBtn"
          SoltDigWidth="500"
          @editBtnCb="polymeriEditBtnCb"
        >
          <div slot="soltDigContent">
            <el-form
              :model="fuseForm"
              :rules="rulesFuse"
              ref="fuseForm"
              :label-position="fusePosition"
            >
              <el-form-item label="聚合指标名称：" :label-width="formLabelWidth" prop="fuseName">
                <el-input
                  v-model="fuseForm.fuseName"
                  autocomplete="off"
                  placeholder="聚合指标名称"
                  style="width:280px"
                  :disabled="false"
                ></el-input>
              </el-form-item>
              <el-form-item label="聚合函数列表：" :label-width="formLabelWidth" prop="functionList">
                <el-select
                  v-model="fuseForm.functionList"
                  style="width:280px"
                  :disabled="false"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, i) in functionListArr"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </soltDialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import mixin from "mixin";
import API from "api";
import _ from "lodash";
import { _ExportExcel, formatGetArr } from "utils";
import { Business_url } from "@/api/indicator-center";
import commonMixin from "./mixins/common.js";
import { mapActions, mapGetters } from "vuex";
import derivedDialog from "./components/derived-dialog";
import { ResDatas } from "utils/res-format";
import soltDialog from "@/components/dialog/solt-dialog";

export default {
  name: "derivedIndicators",
  data() {
    return {
      activeName: "first",
      // 选择项目
      selectProject: "",
      selectProjectArr: [],
      // 业务版块
      selectPlate: "",
      selectPlateArr: [],
      // 数据域
      selectYu: "",
      selectYuArr: [],
      // 指标来源
      selectFinger: "",
      selectFingerArr: [],
      // 时间修饰词
      slectTime: "",
      slectTimeArr: [],
      // 选择维度
      selectDegree: "",
      selectDegreeArr: [],
      // 状态
      selectState: "",
      selectStateArr: [],
      // 派生指标查询
      inputSendCheck: "",
      // 表格
      TLoading: false,
      TAlign: [],
      tableTitle: [
        {
          prop: "dataDomainName",
          label: "数据域名称",
        },
        {
          prop: "name",
          label: "派生指标名称",
        },
        {
          prop: "indicatorSourceName",
          label: "指标来源名称",
        },
        {
          prop: "timeQualifierName",
          label: "时间修饰词",
        },
        {
          prop: "regionSelected",
          label: "地域选择",
        },
        {
          prop: "statusValue",
          label: "状态",
        },
        {
          prop: "unit",
          label: "单位",
        },
        {
          prop: "gmtCreate",
          label: "创建时间",
        },
      ],
      tableData: [],
      TEdit: {
        show: true,
        title: "操作",
        width: 200,
        fixed: "right",
        editTypes: [
          {
            label: "编辑",
            css: "success",
          },
          {
            label: "查看",
            css: "success",
          },
          {
            label: "删除",
            pass: true,
            css: "danger",
          },
          {
            label: "收藏",
            css: "text",
          },
          // {
          //   label: "停用",
          //   css: "success"
          // }
        ],
      },
      TPage: {
        total: 0, // 条数
        index: 1, // 当前页
        size: 10, // 当前页显示条数
      },
      checkboxArr: [],
      // 新建弹出框
      FDTitle: "",
      FDVisible: false,
      parForm: {},
      FDId: "derivedDialog",
      // rules: {},
      FDWidth: "950",
      isShowFooter: true,
      // 编辑查看弹出框
      AllFDTitle: "",
      AllFDVisible: false,
      Allform: {
        projectName: "", // 所属项目
        plateName: "", // 所属业务板块
        fenlName: "", // 数据域
        pszbName: "", //派生指标名称
        dwName: "", // 单位
        zblyName: "", // 指标来源
        sjxsName: "", // 时间修饰
        dyxsName: "", // 地域修饰
        xdxzName: [], // 维度选择
      },
      AllrulesData: {
        projectName: [
          {
            required: true,
            message: "请选择所属项目",
            trigger: "change",
          },
        ],
        plateName: [
          {
            required: true,
            message: "请选择所属业务板块",
            trigger: "change",
          },
        ],
        fenlName: [
          {
            required: true,
            message: "请选择数据域",
            trigger: "change",
          },
        ],
      },
      AllisDisabled: true,
      AlllabelPosition: "right",
      AllformLabelWidth: "135px",
      AllisShowFooter: true,
      rowId: "",
      // == 聚合指标弹出框 ==
      soltDigShow: false,
      soltDigTitle: "聚合指标",
      formLabelWidth: "135px",
      fuseForm: {
        fuseName: "",
        functionList: "",
      },
      functionListArr: [],
      soltDFootBtn: [
        {
          label: "确定",
          css: "",
          cb: () => {
            this.addPolymeriEditBtnCb();
          },
        },
      ],
      fusePosition: "right",
      rulesFuse: {
        // 函数列表
        functionList: [
          {
            required: true,
            message: "请选择聚合函数",
            trigger: "change",
          },
        ],
        // 聚合指标名称
        fuseName: [
          {
            required: true,
            message: "请输入聚合指标名称",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mixins: [mixin, commonMixin],
  watch: {},
  components: {
    derivedDialog,
    soltDialog,
  },
  computed: {
    ...mapGetters({
      areaListCenterArr: "getAreaListCenter",
      plateListCenterArr: "plateListCenter",
      dataManyListCenter: "dataManyListCenter",
    }),
  },
  methods: {
    ...mapActions(["getArea_list", "getPlate_list", "getDataMany_list"]),
    // 批量收藏
    collects(type, row) {
      if (1 === type) {
        if (this.checkboxArr.length) {
          let deriveIndicatorIds = [];
          this.checkboxArr.forEach((item) => {
            deriveIndicatorIds.push(item.id);
          });
          this.indicatorCollect(deriveIndicatorIds);
        } else {
          this.$message({
            message: "请选择要收藏的指标",
            type: "warning",
          });
        }
      } else if (2 === type) {
        this.indicatorCollect([row.id]);
      }
    },
    // 收藏 请求
    indicatorCollect(deriveIndicatorIds) {
      API.indicatorCollect({ deriveIndicatorIds }).then((res) => {
        let Res = new ResDatas({
          res,
          code: 0,
        }).state();
        this.getTableList();
      });
    },
    // 新建派生指标
    addTask_btn() {
      // 有值传值
      if (
        this.selectProject ||
        this.selectPlate ||
        this.selectYu ||
        this.selectFinger
      ) {
        this.parForm = {
          selectProject: this.selectProject,
          selectPlate: this.selectPlate,
          selectYu: this.selectYu,
          selectFinger: this.selectFinger,
          isdisabled: false,
        };
      } else {
        this.parForm = {};
      }
      this.isShowFooter = true;
      this.FDVisible = true;
      this.FDTitle = "新建派生指标";
    },
    // 弹出框新增
    submitForm(form, FDTitle, checkoutBoxArr) {
      let {
        selectProject, // 选择项目
        selectPlate, // 业务板块
        selectYu, // 数据域名称
        // 第一步
        selectFinger, // 指标来源名称
        company, // 单位
        // 第二步
        manyTime, // 时间值可多选
        aftetTime, // 公告时间
        // 第三步
        domentDress, // 地域修饰词
        checkAll, // 全选
        checkedCities,
        // 第四步
        dimensionSelect, // 维度多选
        isdisabled, // 是否禁用
      } = form;
      if (FDTitle == "新建派生指标") {
        API.AddIndex_send({
          dataDomainId: selectYu, //数据域id
          indicatorSourceId: selectFinger, //指标来源
          timeQualifierColumn: aftetTime, // 时间修饰词统计字段
          timeQualifierList: manyTime, // 时间修饰词列表
          unit: company, // 单位
          dimensionList: checkoutBoxArr, // 维度列表
          regionQualifier: {
            // 地域修饰词列表
            dimensionId: domentDress || "",
            dimensionValueList: checkedCities || [],
          },
        })
          .then((res) => {
            new ResDatas({
              res,
              code: 0,
            }).state();
            if (res.data.code == 0) {
              this.FDVisible = false;
              this.getTableList();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // 弹出框关闭回调事件
    editBtnCb({ label, close }) {
      if (label == "close") {
        this.FDVisible = close;
        this.parForm = {};
      }
    },
    // 删除
    delTask_btn() {
      if (this.isManySelect("请选择删除项！")) {
        let arr = [];
        this.checkboxArr.forEach((item) => {
          arr.push(item.id);
        });
        API.delPro_send({
          deriveIndicatorIdList: arr,
        })
          .then((res) => {
            new ResDatas({ res, code: 0, msg: "删除成功！" }).state();
            if (res.data.code == 0) {
              this.getTableList();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    // excel 导出
    exportExcel_btn() {
      let arr = [];
      this.checkboxArr.forEach((item) => {
        arr.push(item.id);
      });
      let businessSegmentIds = arr.join(","); // 选中的id
      let queryStr = `businessSegmentId=${this.selectPlate}&dataDomainId=${
        this.selectYu
      }&deriveIndicatorIds=${businessSegmentIds}&deriveIndicatorName=${this.inputSendCheck.trim()}&dimensionId=${
        this.selectDegree
      }&indicatorSourceId=${this.selectFinger}&pageNo=${
        this.TPage.index
      }&pageSize=${this.TPage.size}&projectId=${this.selectProject}&status=${
        this.selectState
      }&timeQualifierList=${this.slectTime}`;
      _ExportExcel(Business_url + "/deriveIndicator/export?" + queryStr);
    },
    // 指标聚合
    polymerization_btn() {
      if (this.isManySelect("请勾选要聚合的指标！")) {
        this.soltDigShow = true;
      }
    },
    polymeriEditBtnCb(editItem, tid, row) {
      if (editItem.label === "close") {
        this.soltDigShow = editItem.close;

        this.$set(this.fuseForm, "fuseName", "");
        this.$set(this.fuseForm, "functionList", "");
      }
    },
    addPolymeriEditBtnCb() {
      this.$refs["fuseForm"].validate((valid) => {
        if (valid) {
          let { fuseName, functionList } = this.fuseForm;

          let arr = [];
          this.checkboxArr.forEach((item) => {
            arr.push(item.id);
          });
          API.aggregation({
            aggregationFunCode: functionList,
            deriveIndicatorName: fuseName,
            selectedDeriveIndicatorIdList: arr,
          })
            .then((res) => {
              new ResDatas({ res, code: 0, msg: "执行成功！" }).state();
              if (res.data.code == 0) {
                this.getTableList();
                this.soltDigShow = false;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      });
    },
    // 初始化
    // manyInit_btn() {
    //   if (this.checkboxArr.length <= 0) {
    //     this.$message({
    //       message: "请选择初始化项！",
    //       type: "warning"
    //     });
    //     return;
    //   }
    // API.manyInit_send({})
    //   .then(res => {
    //     let { code, message } = res.data;
    //     if (code == 0) {
    //       this.getTableList();
    //       this.$message({
    //         showClose: true,
    //         message: "初始化完成",
    //         type: "success"
    //       });
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: message,
    //         type: "error"
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // },
    // 批量生效
    // manyEffect_btn() {
    // if (this.isManySelect("请选择需要生效的项！")) {
    //   API.manyEffect_send({})
    //     .then(res => {
    //       let { code, message } = res.data;
    //       if (code == 0) {
    //         this.getTableList();
    //         this.$message({
    //           showClose: true,
    //           message: "生效成功",
    //           type: "success"
    //         });
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: message,
    //           type: "error"
    //         });
    //       }
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // }
    // },
    // 时间修饰词
    TimeChange() {
      this.getTableList();
    },
    // 选择维度
    DegreeChange() {
      this.getTableList();
    },
    // 状态
    StateChange() {
      this.getTableList();
    },
    // 派生指标模糊查询
    SendCheckChange() {
      this.getTableList();
    },

    // 查看-编辑
    // 弹框关闭前
    AllhandleClose(done) {
      if (this.$refs["AllruleForm"]) {
        this.$refs["AllruleForm"].resetFields();
      }
      done();
    },
    // 编辑
    AllSubmitForm() {
      let { pszbName, dwName } = this.Allform;
      API.editIndex_send({
        id: this.rowId,
        name: pszbName,
        unit: dwName,
      })
        .then((res) => {
          new ResDatas({ res, code: 0, msg: "编辑成功！" }).state();
          if (res.data.code == 0) {
            this.AllFDVisible = false;
            this.getTableList();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // ---------表格事件Start --------
    // 表格-点击单元格
    async lickCell({ row, column, id }) {
      let { label } = column;
      if (label == "编辑") {
        this.editCurrent(row);
      }
      if (label == "查看") {
        this.lookCurrent(row);
      }
      if (label == "删除") {
        this.delCurrent(row);
      }
      // if (label == "停用") {this.stopCurrent(row)};
      if ("收藏" === label) {
        this.collects(2, row);
      }
    },
    // 表格-点击编辑
    editCurrent(row) {
      let {
        id,
        name,
        unit,
        indicatorSourceName,
        timeQualifierName,
        dataDomainName,
        regionSelected,
        dimensionSelectedList,
        projectName,
        businessSegmentName,
      } = row;
      this.AllisShowFooter = true;
      this.AllFDVisible = true;
      this.AllFDTitle = "编辑派生指标";

      this.rowId = id;
      this.$set(this.Allform, "projectName", projectName);
      this.$set(this.Allform, "plateName", businessSegmentName);
      this.$set(this.Allform, "fenlName", dataDomainName);
      this.$set(this.Allform, "pszbName", name);
      this.$set(this.Allform, "dwName", unit);
      this.$set(this.Allform, "zblyName", indicatorSourceName);
      this.$set(this.Allform, "sjxsName", timeQualifierName);
      this.$set(this.Allform, "dyxsName", regionSelected);
      this.$set(this.Allform, "xdxzName", dimensionSelectedList);
    },
    // 表格-点击查看
    lookCurrent(row) {
      let {
        name,
        unit,
        indicatorSourceName,
        timeQualifierName,
        dataDomainName,
        regionSelected,
        dimensionSelectedList,
        projectName,
        businessSegmentName,
      } = row;
      this.AllisShowFooter = false;
      this.AllFDVisible = true;
      this.AllFDTitle = "查看派生指标";

      this.$set(this.Allform, "projectName", projectName);
      this.$set(this.Allform, "plateName", businessSegmentName);
      this.$set(this.Allform, "fenlName", dataDomainName);
      this.$set(this.Allform, "pszbName", name);
      this.$set(this.Allform, "dwName", unit);
      this.$set(this.Allform, "zblyName", indicatorSourceName);
      this.$set(this.Allform, "sjxsName", timeQualifierName);
      this.$set(this.Allform, "dyxsName", regionSelected);
      this.$set(this.Allform, "xdxzName", dimensionSelectedList);
    },
    // 表格-点击删除
    delCurrent(row) {
      this.$confirm(`您确定要删除该项吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          API.tableDel_send({
            id: row.id,
          })
            .then((res) => {
              new ResDatas({ res, code: 0, msg: "删除成功！" }).state();
              if (res.data.code == 0) {
                this.getTableList();
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 表格-点击停用
    // stopCurrent() {
    // TODO参数
    // API.stop_send({})
    //   .then(res => {
    //     let { code, message } = res.data;
    //     if (code == 0) {
    //       this.getTableList();
    //       this.$message({
    //         showClose: true,
    //         message: "停用成功",
    //         type: "success"
    //       });
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: message,
    //         type: "error"
    //       });
    //     }
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // },
    // 表格-分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getTableList();
    },
    // 表格-点击多选操作
    handleSelectionChange(type, selectionArr) {
      if (type == "checkbox") this.checkboxArr = selectionArr;
    },
    // ---------表格事件END --------
    // ---------接口请求Start---------
    getTableList() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      let params = {
        businessSegmentId: this.selectPlate, // 业务板块
        dataDomainId: this.selectYu, // 数据域
        deriveIndicatorName: this.inputSendCheck.trim(), // 名称
        dimensionId: this.selectDegree, // 维度id
        indicatorSourceId: this.selectFinger, // 指标来源Id
        pageNo: index,
        pageSize: size,
        projectId: this.selectProject, // 项目id
        status: this.selectState,
        timeQualifierList: this.slectTime,
      };
      API.TableList_send(params)
        .then((res) => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total",
              },
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total } = Res.formatData();
            this.tableData = data;
            this.tableTitle = title;
            this.$set(this.TPage, `total`, total);
          } else {
            this.tableData = [];
            this.TLoading = false;
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch((error) => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 接口-指标来源
    getFingerSend(id) {
      API.finger_send({
        dataDomainId: id, // 数据域id
      })
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.selectFingerArr = Res;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 接口-时间修饰词
    getDressUp() {
      API.dressUpTime_send()
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.slectTimeArr = formatGetArr(Res, "code", "name");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 搜索派生指标--获取维度列表
    getSelectDegree() {
      API.selectDegree_send()
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.selectDegreeArr = formatGetArr(
              Res,
              "dimensionId",
              "dimensionName"
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 接口-状态
    getSelectState() {
      API.selectState_send()
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            this.selectStateArr = formatGetArr(Res, "code", "name");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 接口-派生指标聚合函数列表
    getAggregationFuncList() {
      API.aggregationFuncList({})
        .then((res) => {
          let Res = new ResDatas({
            res,
            code: 0,
          }).init();
          if (Res) {
            Res.map((item) => {
              item.label = item.name;
              item.value = item.code;
            });
            this.functionListArr = Res;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // ---------接口请求END--------
    // 子组件弹框下拉回显
    sunSelectChangeCallback({ val, type }) {
      switch (type) {
        case "selectProject":
          this.getPlate_list(val);
          break;
        case "selectPlate":
          this.getDataMany_list(val);
          break;
        case "selectYu":
          this.getFingerSend(val);
          break;
        default:
          break;
      }
    },
    // 点击按钮之后判断是否多选
    isManySelect(title) {
      if (this.checkboxArr.length <= 0) {
        this.$message({
          message: title,
          type: "warning",
        });
        return false;
      } else {
        return true;
      }
    },
    // util - 删除无子集的数据
    deleteEmptyChildren(originArr) {
      if (Array.isArray(originArr) && originArr.length) {
        for (let i = 0; i < originArr.length; i++) {
          let item = originArr[i];
          if (item.children && !item.children.length) {
            delete item.children;
          } else {
            this.deleteEmptyChildren(item.children);
          }
        }
        return originArr;
      }
      return [];
    },
  },
  mounted() {
    // 获取选择项目
    this.getArea_list();
    // 获取表格列表
    this.getTableList();
    // 获取时间修饰词
    this.getDressUp();
    // 搜索派生指标--选择维度
    this.getSelectDegree();
    // 状态
    this.getSelectState();
    // 派生指标聚合函数列表
    this.getAggregationFuncList();
  },
};
</script>
<style lang="scss" scoped>
@import "../scss/common.scss";
@import "~@/assets/css/platform/gst/config.scss";
.form_dialog {
  .TDForm {
    .input-n {
      overflow: hidden;
      display: flex;
      margin: 0 auto;
      text-align: center;
      & > li {
        float: left;
        flex: 1;
      }
    }
    .area-type {
      width: 100%;
      max-height: 126px;
      box-sizing: border-box;
      //   border: 1px solid red;
      overflow-x: hidden;
      overflow-y: auto;
      &-list {
        width: 35%;
        float: left;
      }
      &- {
        width: 10%;
        float: left;
      }
      &-icon-add {
        margin-right: 5px;
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: green;
        }
      }
      &-icon-del {
        font-size: 20px;
        cursor: pointer;
        margin-top: 10px;
        &:hover {
          color: red;
        }
      }
    }
    // 底部信息
    .foot-info {
      overflow: hidden;
    }
  }
  /deep/ .el-dialog__header {
    background: $form_dialog_header_bg;
    padding: 8px;
    .el-dialog__title {
      font-size: 16px;
      color: $form_dialog_header_color;
    }
    .el-dialog__headerbtn {
      top: 10px;
      .el-icon-close {
        color: $form_dialog_header_color;
      }
    }
  }
}
</style>
