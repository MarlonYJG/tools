<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 08:46:31
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-22 15:23:46
 * @Description: 指标构建-数据域管理-数据域管理
--> 
<template>
  <div>
    <div class="indicaor-list">
      <ul class="indicaor-list-btn">
        <li>
          <AddButton text="新建数据域" @click="showDialog" :clickArgs="{type: '新建数据域'}"></AddButton>
          <el-button size="medium" @click="exportExcel()">
            <i class="el-icon-upload el-icon--left" />Excel导出
          </el-button>
        </li>
      </ul>
      <div class="indicaor-list-selectBox">
        <ul class="indicaor-list-selectBox-one">
          <li>
            <label for>所属项目：</label>
            <el-select
              v-model="tmSelectVal"
              filterable
              placeholder="--请选择--"
              size="small"
              @change="xmSelectChange"
            >
              <el-option
                v-for="item in tmSelectOpt"
                :key="item.value"
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
                v-for="item in tywSelectOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>数据域分类：</label>
            <el-select
              v-model="tjSelectVal"
              filterable
              placeholder="--请选择--"
              size="small"
              @change="tjSelectChange"
            >
              <el-option
                v-for="item in tjSelectOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-input
              v-model="tmainSearchInput"
              placeholder="数据域名称查询"
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
        :TSort="TSort"
        :TRowDrop="true"
        :TClickItem="TClickItem"
        @clickCell="lickCell"
        @changePage="changePage"
        @rowDrop="rowDrop"
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
          <el-select v-model="form.projectName" @change="handlerSelect_t()" style="width:280px">
            <el-option
              v-for="(items, i) in tmSelectOpt"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属业务板块：" :label-width="formLabelWidth" prop="plateName">
          <el-select v-model="form.plateName" style="width:280px" @change="handlerSelect_y()">
            <el-option
              v-for="(items, i) in tywSelectOpt"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据域分类：" :label-width="formLabelWidth" prop="fenlName">
          <el-select v-model="form.fenlName" style="width:280px">
            <el-option
              v-for="(items, i) in tjSelectOpt"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据域名称：" :label-width="formLabelWidth" prop="domainName">
          <el-input v-model="form.domainName" autocomplete="off" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.remark" style="width:280px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="isShowFooter">
        <el-button type="primary" size="medium" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import API from "api";
import mixin from "mixin";
import Sortable from "sortablejs";
import { chnName } from "utils";
import commonMixin from "../../mixins/common";
import { ResDatas } from "utils/res-format";
export default {
  name: "adminisTrationTwo",
  mixins: [mixin, commonMixin],
  data() {
    return {
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
      // 新弹框
      FDTitle: "",
      FDVisible: false,
      form: {
        projectName: "", // 所属项目
        plateName: "", // 所属业务板块
        fenlName: "", // 数据域分类
        domainName: "", // 数据域名称
        remark: "" // 备注
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
        // 数据域分类
        fenlName: [
          {
            required: true,
            message: "请选择所属数据域分类",
            trigger: "change"
          }
        ],
        // 数据域名称
        domainName: [
          {
            required: true,
            message: "请输入所属数据域名称",
            trigger: "blur"
          },
          // {
          //   validator: this.asyncChnName,
          //   trigger: ["blur", "change"]
          // }
        ]
      },
      isShowFooter: true, // 默认展示页脚
      // 表格
      TID: "domain_table",
      TLoading: false,
      TAlign: [], // 控制文本位置
      tableTitle: [
        {
          prop: "businessSegmentName",
          label: "业务板块名称"
        },
        {
          prop: "dataDomainCategoryName",
          label: "数据域分类"
        },
        {
          prop: "name",
          label: "数据域名称"
        },
        {
          prop: "indicatorCount",
          label: "指标个数"
        },
        {
          prop: "dimensionCount",
          label: "维度"
        },
        {
          prop: "manager",
          label: "创建人"
        },
        {
          prop: "remark",
          label: "备注"
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
      TSort: {
        default: {},
        sortArr: [
          {
            prop: "name",
            order: "descending"
          },
          {
            prop: "indicatorCount",
            order: "descending"
          },
          {
            prop: "dimensionCount",
            order: "descending"
          }
        ]
      },
      // 可跳转的值
      TClickItem: [
        {
          link: "/indicator/construct/Indicators",
          cells: ["indicatorCount"]
        },
        {
          link: "/indicator/construct/Dimension?form=dataDataFields",
          cells: ["dimensionCount"]
        }
      ],
      checkboxArr: [], // 选择的复选框
      rowID: ""
    };
  },
  methods: {
    // 点击新建数据域
    showDialog() {
      this.isShowFooter = true;
      this.FDVisible = true;
      this.FDTitle = "新建数据域";
      this.tywSelectOpt = [];
      this.tjSelectOpt = [];

      // 默认带直进来
      this.$set(this.form, "projectName", this.tmSelectVal);
      this.$set(this.form, "plateName", this.tSelectVal);
      this.$set(this.form, "fenlName", this.tjSelectVal);
      if (this.tSelectVal) {
        this.getPlateList_bos(this.tmSelectVal);
      }
      if (this.tjSelectVal) {
        this.classification_bos(this.tSelectVal);
      }
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
    // 新增与编辑
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let {
            projectName, // 所属项目
            plateName, // 所属项目板块
            fenlName, // 数据域分类
            domainName, // 数据域名称
            remark // 备注
          } = this.form;
          if (this.FDTitle == "新建数据域") {
            API.ProjectTaskAdd_bos({
              dataDomainCategoryId: fenlName, //数据域分类ID
              dataDomainName: domainName, // 数据域名称
              remark: remark // 备注
            })
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
          } else if (this.FDTitle == "编辑数据域") {
            API.editPro_bos({
              dataDomainCategoryId: _.isNumber(fenlName)
                ? fenlName
                : this.getId(this.tjSelectOpt, fenlName),
              dataDomainName: domainName,
              id: this.rowID,
              remark: remark // 备注
            })
              .then(res => {
                new ResDatas({res, code: 0, msg: "编辑成功！"}).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList_box();
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        }
      });
    },
    // 表格关闭之前
    handleClose(done) {
      this.$refs["ruleForm"].resetFields();
      done();
    },
    // ---------------header--from Start ---------------
    // 导出excel
    exportExcel() {
      if (this.checkboxArr.length <= 0) {
        this.$message({
          message: "请选择导出范围！",
          type: "warning"
        });
        return;
      }
      let arr = [];
      this.checkboxArr.forEach(item => {
        arr.push(item.id);
      });
      let businessSegmentIds = arr.join(","); // 选中的id
      let isAll = 0;
      if (
        this.tmSelectVal ||
        this.tSelectVal ||
        this.tjSelectVal ||
        this.tmainSearchInput.trim()
      ) {
        isAll = 0;
      } else {
        isAll = this.checkboxArr.length == this.TPage.total ? 1 : 0; // 是否全部选中
      }
      window.location.href =
        "/constructionservice/data-domain/export?" +
        `dataDomainIds=${businessSegmentIds}&isAll=${isAll}&projectId=${this.tmSelectVal}&businessSegmentId=${this.tSelectVal}&dataDomainCategoryId=${this.tjSelectVal}&dataDomainName=${this.tmainSearchInput.trim()}`;
    },
    // 选择项目下拉选择
    xmSelectChange() {
      this.getPlateList_bos(this.tmSelectVal);
      this.getList_box();
    },
    // 业务板块下拉选择
    ywSelectChange() {
      this.classification_bos(this.tSelectVal);
      this.getList_box();
    },
    // 数据域分类下拉选择
    tjSelectChange() {
      this.getList_box();
    },
    // 点击数据域分类搜索框之后
    searchIndicator() {
      this.getList_box();
    },
    // ---------------header--from END ---------------

    // ----------   表格事件start -------------
    // 单元格事件
    async lickCell({ row, column, id }) {
      const {
        name, //数据域名称
        remark, //备注
        categoryId, // 数据域分类ID
        segmentId, // 业务板块id
        projectId, //所属项目ID
        businessSegmentName, // 业务板块名称
        dataDomainCategoryName // 数据域分类
      } = row;
      if (column.label == "查看") {
        this.FDVisible = true;
        this.FDTitle = "查看数据域";
        this.isShowFooter = false;

        this.$set(this.form, "projectName", projectId);
        this.$set(this.form, "plateName", businessSegmentName);
        this.$set(this.form, "fenlName", dataDomainCategoryName);
        this.$set(this.form, "domainName", name);
        this.$set(this.form, "remark", remark);
      } else if (column.label == "编辑") {
        this.$set(this.form, "projectName", projectId);
        this.$set(this.form, "plateName", businessSegmentName);
        this.$set(this.form, "fenlName", dataDomainCategoryName);
        this.$set(this.form, "domainName", name);
        this.$set(this.form, "remark", remark);
        // 调取接口
        // 传id
        this.isShowFooter = true;
        this.FDVisible = true;
        this.FDTitle = "编辑数据域";
        this.rowID = row.id;
        // 调取接口
        this.getPlateList_bos(projectId);
        this.classification_bos(segmentId);
      } else if (column.label == "删除") {
        this.delCurrent(row);
      }
    },
    // 表格-点击删除
    delCurrent(row) {
      let { id, businessSegmentName } = row;
      // 多选超过2个以上不可以进行删除操作
      if (this.checkboxLength >= 2) {
        this.$message({
          message: "多选超过2个以上不可以进行删除操作！",
          type: "warning"
        });
        return;
      }
      this.$confirm(`您确定要删除业务板块“${businessSegmentName}”吗?`, "提示", {
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
      API.delPro_bos({ id })
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
    // 行拖拽
    rowDrop({ $el }) {
      const _this = this;
      Sortable.create($el, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.tableData.splice(oldIndex, 1)[0];
          _this.tableData.splice(newIndex, 0, currRow);
          let sortList = [];
          _this.tableData.forEach(item => {
            sortList.push({
              sort: item.sort,
              dataDomainId: item.id
            });
          });
          _this.order({ sortList });
        }
      });
    },
    // 拖拽保存
    order(req) {
      API.ruleConfigCleanRulesOrder(req).then(res => {
        let { code, message } = res.data;
        if (code == 0) {
          this.getList_box();
        } else {
          this.$message({
            message: message,
            type: "error"
          });
        }
      });
    },
    // ----------   表格事件END -------------

    // --------------接口获取start -------------------
    // 获取表格列表-接口请求
    getList_box() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      this.TLoading = true;
      API.projectTaskList__bos({
        businessSegmentId: this.tSelectVal, // 业务板块Id
        dataDomainCategoryId: this.tjSelectVal, // 数据域分类Id
        dataDomainName: this.tmainSearchInput.trim(), // 数据域名称
        pageNo: index, // 当前第几页
        pageSize: size, // 每页数量
        projectId: this.tmSelectVal // 项目ID
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
    // 获取数据域分类下拉列表-接口请求
    classification_bos(id) {
      API.classification_bos({ businessSegmentId: id }).then(res => {
        let Res = new ResDatas({
          res,
          code: 0
        }).init();
        if(Res){
          this.tjSelectOpt = this.formatGetArr(
            Res,
            "dataDomainCategoryId",
            "dataDomainCategoryName"
          );
        }
      });
    },
    // --------------接口获取END -------------------
    // 转换数组
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
    // 验证名称
    async asyncChnName(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入所属数据域名称"));
      } else if (!chnName(value)) {
        callback(new Error("请输入正确的中文名称或查看输入格式"));
      } else {
        callback();
      }
    },
    // 取下拉列表id
    getId(arr = [], name = "") {
      let val = "";
      arr.forEach(item => {
        if (item.label == name) {
          val = item.value;
        }
      });
      return val;
    }
  },
  mounted() {
    let { row, from, to } = this.$route.query;
    if (from == "business" && to == "two") {
      this.tmSelectVal = JSON.parse(row).projectId;
      this.tSelectVal = JSON.parse(row).id;
      this.getPlateList_bos(JSON.parse(row).projectId);
    }
    this.getList_box();
    this.getAreaList_bos();
  }
};
</script>
<style lang="scss" scoped>
@import "../../scss/common.scss";
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



