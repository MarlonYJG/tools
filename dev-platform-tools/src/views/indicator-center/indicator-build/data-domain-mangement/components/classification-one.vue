<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 19:00:41
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-09-22 15:22:16
 * @Description: 指标构建-数据域管理-数据域分类管理
--> 
<template>
  <div>
    <div class="indicaor-list">
      <ul class="indicaor-list-btn">
        <li>
          <AddButton text="新建数据域分类" @click="showDialog" :clickArgs="{type: '新建数据域分类'}"></AddButton>
        </li>
      </ul>
      <div class="indicaor-list-selectBox">
        <ul class="indicaor-list-selectBox-one">
          <li>
            <label for>所属项目：</label>
            <el-select
              v-model="omSelectVal"
              filterable
              placeholder="--请选择--"
              size="small"
              @change="xmSelectChange"
            >
              <el-option
                v-for="item in omSelectOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>业务板块：</label>
            <el-select
              v-model="oSelectVal"
              filterable
              placeholder="--请选择--"
              size="small"
              @change="ywSelectChange"
            >
              <el-option
                v-for="item in oywSelectOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </li>
          <li>
            <el-input
              v-model="omainSearchInput"
              placeholder="数据域分类名称查询"
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
          <el-select v-model="form.projectName" @change="handlerSelect()" style="width:280px">
            <el-option
              v-for="(items, i) in omSelectOpt"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属业务板块：" :label-width="formLabelWidth" prop="plateName">
          <el-select v-model="form.plateName" style="width:280px">
            <el-option
              v-for="(items, i) in oywSelectOpt"
              :key="i"
              :label="items.label"
              :value="items.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据域分类：" :label-width="formLabelWidth" prop="fenlName">
          <el-input v-model="form.fenlName" autocomplete="off" style="width:280px"></el-input>
        </el-form-item>
        <el-form-item label="数据域分类编码：" :label-width="formLabelWidth" prop="codeName">
          <el-input v-model="form.codeName" autocomplete="off" style="width:280px"></el-input>
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
import commonMixin from "../../mixins/common";
import { reqFormatDic, ResDatas } from "utils/res-format";
import { chnName, underlineName } from "utils";
import _ from "lodash";
export default {
  name: "classiFicationOne",
  mixins: [mixin, commonMixin],
  data() {
    return {
      // 新弹窗
      FDVisible: false,
      FDTitle: "",
      form: {
        projectName: "", // 所属项目
        plateName: "", // 所属项目板块
        fenlName: "", // 分类
        codeName: "", // code编码
        remark: "" // 备注
      },
      formLabelWidth: "135px",
      labelPosition: "right",
      rulesData: {
        projectName: [
          {
            required: true,
            message: "请选择所属项目",
            trigger: "change"
          }
        ],
        plateName: [
          {
            required: true,
            message: "请选择所属业务板块",
            trigger: "change"
          }
        ],
        fenlName: [
          {
            required: true,
            message: "请输入数据域分类",
            trigger: "change"
          },
          // {
          //   validator: this.asyncChnName,
          //   trigger: "change"
          // }
        ],
        codeName: [
          {
            required: true,
            message: "请输入数据域分类编码",
            trigger: "change"
          },
          // {
          //   validator: this.asyncEnName,
          //   trigger: "change"
          // }
        ]
      },
      isShowFooter: true, // 默认展示页脚
      // --------------------------
      // 表格
      TLoading: false,
      TAlign: [], // 控制文本位置
      tableTitle: [
        {
          prop: "businessSegmentName",
          label: "业务板块名称"
        },
        {
          prop: "name",
          label: "数据域分类"
        },
        {
          prop: "code",
          label: "数据域分类编码"
        },
        {
          prop: "name",
          label: "数据域个数"
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
      rowID: "", //编辑当前项的id
      // plateValue: "", // 校验数据域分类的 板块选择那个
      checkboxArr: [], // 选择的复选框
      // 选择项目下拉列表
      omSelectVal: "",
      omSelectOpt: [],
      // 业务板块下拉列表
      oSelectVal: "",
      oywSelectOpt: [],
      // 模糊查询
      omainSearchInput: ""
    };
  },
  computed: {},
  methods: {
    // ---------------header--from Start ---------------
    // 点击新建数据域分类
    showDialog() {
      this.isShowFooter = true;
      this.FDVisible = true;
      this.FDTitle = "新建数据域分类";
      this.oywSelectOpt = [];

      this.$set(this.form, "projectName", this.omSelectVal);
      this.$set(this.form, "plateName", this.oSelectVal);
      if (this.oSelectVal) {
        this.getPlateList_classify_T(this.omSelectVal);
      }
    },
    // 所属项目下拉发生变化的时候
    handlerSelect() {
      let val = this.form.projectName;
      this.$set(this.form, "plateName", "");
      this.getPlateList_classify_T(val);
    },
    // 点击新建add与编辑
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let {
            projectName,
            plateName,
            fenlName,
            codeName,
            remark
          } = this.form;
          if (this.FDTitle == "新建数据域分类") {
            API.ProjectTaskAdd_classify({
              businessSegmentId: plateName, // 所属业务板块Id
              dataDomainCategoryCode: codeName, // 数据域分类编码
              dataDomainCategoryName: fenlName, // 数据域分类名称
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
                  this.getList();
                  this.$refs["ruleForm"].resetFields();
                }
              })
              .catch(error => {
                console.log(error);
              });
          } else if (this.FDTitle == "编辑数据域分类") {
            API.editPro_classify({
              businessSegmentId: _.isNumber(plateName)
                ? plateName
                : this.getId(this.oywSelectOpt, plateName), // 所属业务板块Id
              dataDomainCategoryCode: codeName, // 数据域分类编码
              dataDomainCategoryName: fenlName, // 数据域分类名称
              id: this.rowID, // 数据域分类Id
              remark: remark // 备注
            })
              .then(res => {
                new ResDatas({res, code: 0, msg: "编辑成功！"}).state();
                if(res.data.code == 0){
                  this.FDVisible = false;
                  this.getList();
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
    // 选择项目下拉
    xmSelectChange() {
      this.getPlateList_classify_T(this.omSelectVal);
      this.getList();
    },
    // 业务板块下拉
    ywSelectChange() {
      this.getList();
    },
    // 模糊查询
    searchIndicator() {
      this.getList();
    },
    // ---------------header--from END ---------------

    // ----------   表格事件start -------------
    // 单元格事件--表格编辑查看删除操作
    async lickCell({ row, column, id }) {
      const {
        gmtCreate, // 创建时间
        segmentId,
        name, // 数据域分类名称
        code, // 数据域分类编码
        remark, // 备注
        manager, // 创建人
        businessSegmentName, // 业务板块名称
        dataDomainCount, // 数据域分类个数
        projectId // 项目ID
      } = row;
      if (column.label == "查看") {
        this.FDVisible = true;
        this.FDTitle = "查看数据域分类";
        this.isShowFooter = false;
        this.$set(this.form, "projectName", projectId);
        this.$set(this.form, "plateName", businessSegmentName);
        this.$set(this.form, "fenlName", name);
        this.$set(this.form, "codeName", code);
        this.$set(this.form, "remark", remark);
      } else if (column.label == "编辑") {
        // this.plateValue = taskName;
        this.$set(this.form, "projectName", projectId);
        this.$set(this.form, "plateName", businessSegmentName);
        this.$set(this.form, "fenlName", name);
        this.$set(this.form, "codeName", code);
        this.$set(this.form, "remark", remark);

        // 调取接口
        // 传id
        this.isShowFooter = true;
        this.FDVisible = true;
        this.FDTitle = "编辑数据域分类";
        this.rowID = row.id;
        this.getPlateList_classify_T(projectId);
      } else if (column.label == "删除") {
        this.delCurrent(row);
      }
    },
    // 表格-点击删除
    delCurrent(row) {
      let { dataDomainCount, businessSegmentName } = row;
      // 多选超过2个以上不可以进行删除操作
      if (this.checkboxArr.length >= 2) {
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
          this.del(row.id);
        })
        .catch(() => {});
    },
    // 表格删除操作
    del(id) {
      API.delPro_classify({ id })
        .then(res => {
          new ResDatas({res, code: 0, msg: "删除成功！"}).state();
          if(res.data.code == 0){
            this.getList();
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
      this.getList();
    },
    // ----------   表格事件END -------------

    // --------------接口获取start -------------------
    // 获取表格列表接口
    getList() {
      this.TLoading = true;
      let { total, index, size } = this.TPage;
      API.projectTaskList__classify({
        businessSegmentId: this.oSelectVal, // 业务板块ID
        dataDomainCategoryName: this.omainSearchInput.trim(), // 数据域分类名称
        pageNo: index, // 当前第几页
        pageSize: size, // 每页数量
        projectId: this.omSelectVal //项目ID
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
    // 获取所属项目下拉列表
    getColumnTypeList() {
      API.getAreaList()
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
             this.omSelectOpt = this.formatGetArr(
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
    // 获取板块列表-接口请求
    async getPlateList_classify_T(id) {
      API.getPlateList_classify({
        projectId: id //项目ID
      })
        .then(res => {
          let Res = new ResDatas({
            res,
            code: 0
          }).init();
          if(Res){
            this.oywSelectOpt = this.formatGetArr(
              Res,
              "businessSegmentId",
              "businessSegmentName"
            );
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // --------------接口获取END -------------------

    //  --------------表单校验其他规则Start ----------------------
    // 验证名称
    async asyncChnName(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入数据域分类"));
      } else if (!chnName(value)) {
        callback(new Error("请输入正确的中文名称或查看输入格式"));
      } else {
        callback();
      }
    },
    // 验证分类编码编码
    async asyncEnName(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入数据域分类编码"));
      } else if (!underlineName(value)) {
        callback(new Error("请输入正确的英文名与下划线组合"));
      } else {
        callback();
      }
    },
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
    this.getList();
    this.getColumnTypeList();
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

