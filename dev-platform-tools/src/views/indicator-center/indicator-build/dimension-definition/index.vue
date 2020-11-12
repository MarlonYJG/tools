<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 08:46:31
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-07-18 16:04:18
 * @Description: 指标构建-维度定义
-->
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="维度定义" name="first">
        <div class="indicaor-list">
          <ul class="indicaor-list-btn">
            <li>
              <AddButton text="新建维度" @click="showDialog" :clickArgs="{type: '新建维度'}"></AddButton>
              <el-button size="medium" @click="tableDel">删除</el-button>
              <el-button size="medium" @click="exportExcel()">
                <i class="el-icon-upload el-icon--left" />Excel导出
              </el-button>
            </li>
          </ul>
          <div class="indicaor-list-selectBox">
            <ul class="indicaor-list-selectBox-one">
              <li>
                <label for>选择项目：</label>
                <el-select
                  v-model="tmSelectVal"
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  @change="xmSelectChange"
                >
                  <el-option
                    v-for="(item,i) in tmSelectOpt"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>业务板块：</label>
                <el-select
                  v-model="tSelectVal"
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  @change="ywSelectChange"
                >
                  <el-option
                    v-for="(item,i) in tywSelectOpt"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <label for>数据域：</label>
                <el-select
                  v-model="tjSelectVal"
                  filterable
                  placeholder="--请选择--"
                  size="small"
                  @change="tjSelectChange"
                >
                  <el-option
                    v-for="(item,i) in tjSelectOpt"
                    :key="i"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </li>
              <li>
                <el-input
                  v-model="tmainSearchInput"
                  placeholder="维度名称查询"
                  size="small"
                  style="width:250px"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    style="cursor: pointer"
                    @click="searchIndicator()"
                  ></i>
                </el-input>
              </li>
            </ul>
          </div>
        </div>
        <!-- 表格 -->
        <div class="task-list-table">
          <TableDefault
            :TId="TID"
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
            :TRowDrop="true"
            @clickCell="clickCell"
            @changePage="changePage"
            @handleSelectionChange="handleSelectionChange"
          ></TableDefault>
        </div>
        <el-dialog
          :title="FDTitle"
          :visible.sync="FDVisible"
          width="500px"
          class="form_dialog"
          :before-close="handleClose"
          :close-on-click-modal="false"
        >
          <el-form
            :model="form"
            :rules="rulesData"
            ref="ruleForm"
            :label-position="labelPosition"
            class="TDForm"
          >
            <el-form-item label="所属项目：" :label-width="formLabelWidth" prop="projectName">
              <el-select
                v-model="form.projectName"
                @change="handlerSelect_t()"
                style="width:280px"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="(items, i) in tmSelectOpt"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务板块名称：" :label-width="formLabelWidth" prop="plateName">
              <el-select
                v-model="form.plateName"
                style="width:280px"
                @change="handlerSelect_y()"
                :disabled="isDisabled"
              >
                <el-option
                  v-for="(items, i) in tywSelectOpt"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据域名称：" :label-width="formLabelWidth" prop="fenlName">
              <el-select v-model="form.fenlName" style="width:280px" :disabled="isDisabled">
                <el-option
                  v-for="(items, i) in tjSelectOpt"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="维度名称：" :label-width="formLabelWidth" prop="domainName">
              <el-input
                v-model="form.domainName"
                autocomplete="off"
                style="width:280px"
                :disabled="isDisabled"
              ></el-input>
            </el-form-item>
            <el-form-item label="维度类型：" :label-width="formLabelWidth" prop="weiduType">
              <el-select v-model="form.weiduType" style="width:280px" :disabled="isDisabled">
                <el-option
                  v-for="(items, i) in weiduTypeArr"
                  :key="i"
                  :label="items.label"
                  :value="items.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择数据集：" :label-width="formLabelWidth" prop="dataSet">
              <tree-select
                v-if="!form.lookDataSet"
                v-model="form.dataSet"
                :options="dataSetArr"
                placeholder="请选择数据集"
                style="width:280px"
                @select="selectChange"
                search-nested
                :disabled="isDisabled"
              ></tree-select>
              <el-input
                v-else
                v-model="form.lookDataSet"
                autocomplete="off"
                style="width:280px"
                :disabled="isDisabled"
                suffix-icon="el-icon-arrow-down"
              ></el-input>
            </el-form-item>
            <el-form-item label="选择字段：" :label-width="formLabelWidth" prop="xField">
              <el-select
                v-model="form.xField"
                filterable
                placeholder="请选择"
                style="width:280px"
                @change="xFieldChange"
                :disabled="isDisabled"
              >
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <el-option
                  v-for="items in xFieldArr"
                  :key="items.id"
                  :label="items.columnComment"
                  :value="items.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性值：" prop="remark" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="form.remark" style="width:280px" disabled></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" v-if="isShowFooter">
            <el-button type="primary" size="medium" @click="submitForm()">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import API from "api";
import mixin from "mixin";
import commonMixin from "../mixins/common";
import TreeSelect from "@riophae/vue-treeselect";
import _ from "lodash";
import { ResDatas } from "utils/res-format";
export default {
  name: "Dimension",
  mixins: [mixin, commonMixin],
  data() {
    return {
      activeName: "first",
      // 所选项目下拉选择
      tmSelectVal: "",
      tmSelectOpt: [],
      // 业务板块下拉选择
      tSelectVal: "",
      tywSelectOpt: [],
      // 数据域分类
      tjSelectVal: "",
      tjSelectOpt: [],
      // 名称查询2
      tmainSearchInput: "",
      // 弹框
      FDTitle: "",
      FDVisible: false,
      form: {
        projectName: "", // 所属项目
        plateName: "", // 所属业务板块
        fenlName: "", // 数据域
        domainName: "", // 维度名称
        weiduType: "", // 维度类型
        dataSet: null, // 选择数据集
        lookDataSet: "", // 查看-选择数据集
        xField: "", // 选择字段
        remark: "" // 属性值
      },
      formLabelWidth: "135px",
      labelPosition: "right",
      rulesData: {
        // "所属项目",
        projectName: [
          {
            required: true,
            message: "请选择所属项目",
            trigger: "change"
          }
        ],
        // 所属业务板块
        plateName: [
          {
            required: true,
            message: "请选择所属业务板块",
            trigger: "change"
          }
        ],
        // 数据域
        fenlName: [
          {
            required: true,
            message: "请选择所属数据域",
            trigger: "change"
          }
        ],
        // 维度名称
        domainName: [
          {
            required: true,
            message: "请输入维度名称",
            trigger: "blur"
          }
        ],
        // 维度类型
        weiduType: [
          {
            required: true,
            message: "请选择维度类型",
            trigger: "blur"
          }
        ],
        // 数据集
        dataSet: [
          {
            required: true,
            message: "请选择数据集",
            trigger: "change"
          }
        ],
        // 选择字段
        xField: [
          {
            required: true,
            message: "请选择字段",
            trigger: ["blur", "change"]
          }
        ]
      },
      isShowFooter: true, // 默认展示页脚
      // 维度类型
      weiduTypeArr: [
        {
          value: "normal",
          label: "普通维度"
        },
        {
          value: "regional",
          label: "地域维度"
        },
        {
          value: "particular",
          label: "特殊维度"
        }
      ],
      dataSetArr: [], //选择数据集
      xFieldArr: [], // 选择字段
      itemJson: null, // 字典值json
      columnCode: "", // 数据集字段编码
      columnComment: "", //字段备注
      dataSetCode: "", // 数据集编码
      dataSetComment: "", //数据集备注
      newDataSet: "", //格式化数据集
      isDisabled: false, // 是否禁用
      // 表格
      TID: "domain_table",
      TLoading: false,
      TAlign: [], // 控制文本位置
      tableTitle: [
        {
          prop: "segmentName",
          label: "业务板块名称"
        },
        {
          prop: "dataDomainName",
          label: "数据域名称"
        },
        {
          prop: "name",
          label: "维度名称"
        },
        {
          prop: "dictAttrValue",
          label: "维度属性值"
        },
        {
          prop: "creator",
          label: "创建人"
        },
        {
          prop: "gmtCreate",
          label: "创建时间"
        }
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
            css: "success"
          },
          {
            label: "查看",
            css: "success"
          },
          {
            label: "删除",
            css: "danger",
            pass: true
          }
        ]
      },
      TPage: {
        total: 0, // 条数
        index: 1, // 当前页
        size: 10 // 当前页显示条数
      },
      checkboxArr: [], // 选择的复选框
      rowID: ""
    };
  },
  watch: {
    // 项目
    tmSelectVal(newVal) {
      this.$set(this.form, "projectName", newVal);
    },
    // 板块
    tSelectVal(newVal) {
      this.$set(this.form, "plateName", newVal);
    },
    // 数据域
    tjSelectVal(newVal) {
      this.$set(this.form, "fenlName", newVal);
    },
    "form.dataSet": {
      deep: true,
      handler(newVal) {
        if (newVal) {
          let newValDataSet = "";
          this.loop_(this.dataSetArr, newVal, item => {
            newValDataSet = item;
          });
          if (newValDataSet && newValDataSet.type == "table") {
            this.dimension_field(newValDataSet.id.split("_")[0]);
            this.newDataSet = newValDataSet.id.split("_")[0];
            this.dataSetComment = newValDataSet.commentName;
          }
        }
      }
    }
  },
  components: {
    TreeSelect
  },
  methods: {
    // 选择数据集发生变化
    selectChange(node, instanceId) {
      this.dataSetCode = node.info.name;
      this.$set(this.form, "xField", "");
      this.$set(this.form, "remark", "");
    },
    // 所属项目下拉发生变化的时候
    handlerSelect_t() {
      let val = this.form.projectName;
      this.$set(this.form, "plateName", "");
      this.$set(this.form, "fenlName", "");
      this.getPlateList_bos(val);
    },
    // 所属业务板块下拉发生变化的时候
    handlerSelect_y() {
      let val = this.form.plateName;
      this.$set(this.form, "fenlName", "");
      this.classification_bos(val);
    },
    // ---------------header--from Start ---------------
    // 点击新建维度
    showDialog() {
      this.isDisabled = false;
      this.isShowFooter = true;
      this.FDVisible = true;
      this.$set(this.form, "lookDataSet", "");
      this.$nextTick(() => {
        this.FDTitle = "新建维度";
      });
      if (this.FDTitle == "查看维度" || this.FDTitle == "编辑维度") {
        this.$set(this.form, "projectName", "");
        this.$set(this.form, "plateName", "");
        this.$set(this.form, "fenlName", "");
      } else if (this.FDTitle == "新建维度") {
        // 默认带值进来
        this.$set(this.form, "projectName", this.tmSelectVal);
        this.$set(this.form, "plateName", this.tSelectVal);
        this.$set(this.form, "fenlName", this.tjSelectVal);
      }
      this.$set(this.form, "domainName", "");
      this.$set(this.form, "weiduType", "");
      this.$set(this.form, "dataSet", null);
      this.$set(this.form, "xField", "");
      this.$set(this.form, "remark", "");
    },
    // 新增与编辑
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let {
            dataSet, // 选择数据集
            remark, // 属性值
            xField, // 选择字段
            projectName, // 所属项目
            plateName, // 业务板块名称
            fenlName, // 数据域名称
            domainName, // 维度名称
            weiduType // 新增维度类型
          } = this.form;
          if (this.FDTitle == "新建维度") {
            let params = {
              dataSetComment: this.dataSetComment
                ? this.dataSetComment
                : this.columnCode, //数据集备注，需要从数据集系统获取，数据格式为（数据集的多层类型+数据集名称，如果数据集名称为空则取数据集编码）
              columnComment: this.columnComment
                ? this.columnComment
                : this.columnCode, // 数据集字段备注，如果数据集字段名称为空则取数据集字段编码
              columnCode: this.columnCode, //数据集字段编码
              dictValueContent: this.itemJson, // 字典值
              dataSetCode: this.dataSetCode, // 数据集编码
              columnId: xField, // 数据集字段id
              dataSetId: this.newDataSet, // 数据集id
              domainId: fenlName, // 数据域id
              name: domainName, //维度名称
              type: weiduType //维度类型
            };
            API.ProjectTaskAdd_dimension(params)
              .then(res => {
                new ResDatas({
                  res,
                  code: 0,
                  msg: "添加成功！"
                }).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList_box();
                  this.$refs["ruleForm"].resetFields();
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else if (this.FDTitle == "编辑维度") {
            let {
              dataSet, // 选择数据集
              remark, // 属性值
              xField, // 选择字段
              projectName, // 所属项目
              plateName, // 业务板块名称
              fenlName, // 数据域名称
              domainName, // 维度名称
              weiduType // 维度类型
            } = this.form;
            this.xFieldChange();
            let parames = {
              name: domainName, // 维度名称
              domainId: fenlName, // 数据域id
              dataSetId: this.newDataSet, // 数据集id
              columnId: xField, // 数据集字段id
              id: this.rowID, // 维度Id
              dataSetComment: this.dataSetComment
                ? this.dataSetComment
                : this.columnCode, //数据集备注，需要从数据集系统获取，数据格式为（数据集的多层类型+数据集名称，如果数据集名称为空则取数据集编码）
              columnCode: this.columnCode, //数据集字段编码
              dictValueContent: this.itemJson, // 字典值
              columnComment: this.columnComment
                ? this.columnComment
                : this.columnCode, // 数据集字段备注，如果数据集字段名称为空则取数据集字段编码

              dataSetCode: this.dataSetCode, // 数据集编码
              type: weiduType // 新增+维度类型字段
            };
            API.editPro_dimension(parames)
              .then(res => {
                new ResDatas({res, code: 0, msg: "编辑成功！"}).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList_box();
                  this.$refs["ruleForm"].resetFields();
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        }
      });
    },
    // 弹窗关闭之前
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      done();
    },
    // 点击删除
    tableDel() {
      if (this.checkboxArr.length <= 0) {
        this.$message({
          message: "请选择删除项！",
          type: "warning"
        });
        return;
      }
      let arr = [];
      this.checkboxArr.forEach(item => {
        arr.push(item.id);
      });
      let businessSegmentIds = arr.join(","); // 选中的id
      API.headel_dimension(businessSegmentIds)
        .then(res => {
          new ResDatas({res, code: 0}).state();
          if(res.data.code == 0){
            this.getList_box();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 导出excel
    exportExcel() {
      let arr = [];
      this.checkboxArr.forEach(item => {
        arr.push(item.id);
      });
      let businessSegmentIds = arr.join(","); // 选中的id
      window.location.href =
        "/constructionservice/dimension/export?" +
        `businessSegmentId=${this.tSelectVal}&projectId=${this.tmSelectVal}&dataDomainId=${this.tjSelectVal}&dimensionName=${this.tmainSearchInput.trim()}&idListStr=${businessSegmentIds}`;
    },
    // 选择项目下拉选择
    xmSelectChange() {
      this.tSelectVal = "";
      this.tjSelectVal = "";
      this.getPlateList_bos(this.tmSelectVal);
      this.getList_box();
    },
    // 业务板块下拉选择
    ywSelectChange() {
      this.tjSelectVal = "";
      this.classification_bos(this.tSelectVal);
      this.getList_box();
    },
    // 数据域分类下拉选择
    tjSelectChange() {
      this.getList_box();
    },
    // 选择字段下拉选择
    xFieldChange() {
      this.$set(this.form, "remark", "");
      let xFieldNewArr = this.xFieldArr || [];
      let arr = [];
      xFieldNewArr.forEach(item => {
        if (item.id == this.form.xField) {
          // 赋值JSON
          this.itemJson = JSON.stringify(item.dictData);
          // 数据集字段编码
          this.columnCode = item.columnCode;
          // 赋值字段备注
          this.columnComment = item.columnComment;
          // 遍历取nam赋值属性值
          if (item.dictData && item.dictData.length) {
            item.dictData.forEach(items => {
              arr.push(items.name);
            });
          }
        }
      });
      if (arr.length >= 5) {
        let str =
          arr[0] +
          "、" +
          arr[1] +
          "、" +
          arr[2] +
          "、" +
          "...." +
          arr[arr.length - 1];
        this.$set(this.form, "remark", str);
      } else {
        this.$set(this.form, "remark", arr.join("、"));
      }
    },
    // 点击数据域分类搜索框之后
    searchIndicator() {
      this.getList_box();
    },
    // ---------------header--from END ---------------

    // ----------   表格事件start -------------
    // 单元格事件
    async clickCell({ row, column }) {
      let {
        id, // 标识
        dataDomainName, // 数据域名称
        segmentName, // 业务板块名称
        dictAttrValue, // 维度属性值
        name, // 维度名称
        ifRegionalStr, // 是否地域维度
        ifGeneralStr, // 是否通用
        gmtCreate, // 创建时间
        creator // 创建人
      } = row;
      if (column.label == "查看") {
        API.lookItem_dimension(row.id).then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            this.isDisabled = true;
            this.FDVisible = true;
            this.FDTitle = "查看维度";
            this.isShowFooter = false;
            let {
              segmentName,
              name,
              domainName,
              dictAttrValue,
              dataSetId,
              columnId,
              projectId,
              dataSetComment,
              columnComment,
              type
            } = Res;
            this.$set(this.form, "projectName", projectId);
            this.$set(this.form, "plateName", segmentName);
            this.$set(this.form, "domainName", name);
            this.$set(this.form, "weiduType", type);
            this.$set(this.form, "fenlName", domainName);
            this.$set(this.form, "remark", dictAttrValue);
            this.$set(this.form, "xField", columnComment);
            // 展示
            this.$set(this.form, "dataSet", dataSetComment);
            this.$set(this.form, "lookDataSet", dataSetComment);
          }
        });
      } else if (column.label == "编辑") {
        this.$set(this.form, "lookDataSet", "");
        API.editItem_dimension(row.id).then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            this.isShowFooter = true;
            this.FDVisible = true;
            this.FDTitle = "编辑维度";
            this.isDisabled = false;
            this.rowID = row.id;
            let {
              projectId,
              segmentId,
              domainId,
              domainName,
              dictAttrValue,
              columnId,
              dataSetId,
              type
            } = Res;
            this.$set(this.form, "projectName", projectId);
            this.getPlateList_bos(projectId);
            this.$set(this.form, "plateName", segmentId);
            this.classification_bos(segmentId);
            this.$set(this.form, "fenlName", domainId);
            this.$set(this.form, "domainName", name);
            // 维度类型
            this.$set(this.form, "weiduType", type);
            // 属性值
            this.$set(this.form, "remark", dictAttrValue);
            // 选择字段
            this.dimension_field(dataSetId);
            this.$set(this.form, "xField", columnId);
            // 选择数据集
            this.loopUpdate(this.dataSetArr, dataSetId + "", item => {
              Res["dataSetId"] = item.id;
            });
            // 选择数据集
            this.$set(this.form, "dataSet", Res.dataSetId || null);
            // 默认取info里面的name
            this.dataSetCode = Res.dataSetCode;
          }
        });
      } else if (column.label == "删除") {
        this.delCurrent(row);
      }
    },
    // 表格-点击删除
    delCurrent(row) {
      let { id, name } = row;
      // 多选超过2个以上不可以进行删除操作
      if (this.checkboxLength >= 2) {
        this.$message({
          message: "多选超过2个以上不可以进行删除操作！",
          type: "warning"
        });
        return;
      }
      this.$confirm(`您确定要删除维度名称“${name}”吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.del(id);
        })
        .catch(() => {});
    },
    // 表格删除操作
    del(id) {
      API.delPro_dimension(id)
        .then(res => {
          new ResDatas({res, code: 0, msg: "删除成功！"}).state();
          if(res.data.code == 0){
            this.getList_box();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 分页操作
    changePage({ pageSize, currentPage }) {
      this.$set(this.TPage, `index`, currentPage);
      this.$set(this.TPage, `size`, pageSize);
      this.getList_box();
    },
    // ----------   表格事件END -------------
    // --------------接口获取start -------------------
    // 获取表格列表-接口请求
    getList_box() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      API.projectTaskList__dimension({
        projectId: this.tmSelectVal, // 项目ID
        businessSegmentId: this.tSelectVal, // 业务板块Id
        dataDomainId: this.tjSelectVal, // 数据域ID
        dimensionName: this.tmainSearchInput.trim(), // 维度名称
        pageNo: index, // 当前第几页
        pageSize: size // 每页数量
      })
        .then(res => {
          let Res = new ResDatas(
            {
              res,
              code: 0,
              fieldKey: {
                data: "data",
                title: "title",
                total: "total"
              }
            },
            "TLoading",
            this
          );
          if (Res.init()) {
            const { data, title, total} = Res.formatData();
            this.tableData = data;
            this.tableTitle = title;
            this.$set(this.TPage, `total`, total);
          }else {
            this.tableData = [];
            this.TLoading = false;
            this.$set(this.TPage, `total`, 0);
          }
        })
        .catch(error => {
          this.TLoading = false;
          console.error(error);
        });
    },
    // 获取所选项目下拉列表-接口请求
    getAreaList_bos() {
      API.getAreaList()
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            this.tmSelectOpt = this.formatGetArr(
              Res,
              "projectId",
              "projectName"
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 获取业务板块下拉列表-接口请求
    getPlateList_bos(id) {
      API.getPlateList_classify({
        projectId: id // 项目ID
      }).then(res => {
        let Res = new ResDatas({
            res,
            code: 0
        }).init();
        if(Res){
          this.tywSelectOpt = this.formatGetArr(
            Res,
            "businessSegmentId",
            "businessSegmentName"
          );
        }
      });
    },
    // 获取数据域下拉列表-接口请求
    classification_bos(id) {
      API.dataMany_send(id).then(res => {
        let Res = new ResDatas({
            res,
            code: 0
        }).init();
        if(Res){
          this.tjSelectOpt = this.formatGetArr(Res, "id", "name");
        }
      });
    },
    // 获取数据集下拉列表-接口请求
    dataSet_dimension() {
      API.dataSet_dimension().then(res => {
        let Res = new ResDatas({
            res,
            code: 0
        }).init();
        if(Res){
          if(Res.type == "tree"){
            let AreaData =
            Res.data &&
            Res.data.children.children &&
            Res.data.children.children.length
              ? Res.data.children.children
              : [];
            AreaData.forEach(item => {
              item["id"] = Number(item.id);
            });
            this.loop(AreaData);
            this.dataSetArr = AreaData;
          }
        }
      });
    },
    loop_(arr, val, cbVal) {
      if (arr && arr.length) {
        arr.forEach(item => {
          if (val == item.domKey) {
            cbVal(item);
          }
          if (item.children && item.children.length) {
            this.loop_(item.children, val, cbVal);
          }
        });
      }
    },
    loop(arr, domKey = "", commentName = "") {
      if (arr && arr.length) {
        arr.forEach(item => {
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
    loopUpdate(arr, val, cbVal) {
      if (arr && arr.length) {
        arr.forEach(item => {
          if (item.type == "table") {
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
    // 获取选择字段下拉列表-接口请求
    dimension_field(val) {
      let params = {
        dataSetId: val,
        dimensionOrMeasure: 0,
        isGetDictData: 1, //  是否需要获取关联字典表的值(0否,1是)
        name: ""
      };
      API.dimension_field(params).then(res => {
        let Res = new ResDatas({
            res,
            code: 0
        }).init();
        if(Res){
          Res.map(item => {
            item.columnComment = `${item.columnCode}(${item.columnComment})`;
          });
          this.xFieldArr = Res;
        }
      });
    },
    // --------------接口获取END -------------------
    // util - 转换数组
    formatGetArr(data, name1, name2) {
      let newArr = [];
      data.map(item => {
        if (item.hasOwnProperty(name1) && item.hasOwnProperty(name2)) {
          newArr.push({
            value: item[name1],
            label: item[name2]
          });
        }
      });
      return newArr;
    },
    // util- 取下拉列表id
    getId(arr = [], name = "") {
      let val = "";
      arr.forEach(item => {
        if (item.label == name) {
          val = item.value;
        }
      });
      return val;
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
    }
  },
  mounted() {
    this.getList_box();
    this.getAreaList_bos();
    this.dataSet_dimension();
  },
  created() {
    let { row,form } = this.$route.query;
    if (row) {
      let rowObj = JSON.parse(row);

      this.tmSelectVal = rowObj.projectId;
      if(form == 'businessSegments'){
        this.tSelectVal = rowObj.id;
      }else if(form == 'dataDataFields'){
         this.tSelectVal = rowObj.segmentId;
         this.tjSelectVal = rowObj.sort;
      }
      this.getPlateList_bos(this.tmSelectVal);
      this.classification_bos(this.tSelectVal);
    }
  }
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