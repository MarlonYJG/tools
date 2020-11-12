<!--
 * @Author: Marlon
 * @Date: 2020-03-16 10:10:36
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 10:51:27
 * @Description: 数据集规则
--> 
<template>
  <div class="dq-rule-config">
    <div class="handle-list">
      <ul class="handle1">
        <li>
          <AddButton
            text="新增数据集"
            @click="showDialog1"
            :clickArgs="{type:'新增数据集',typeName: addType}"
          ></AddButton>
        </li>
      </ul>
      <ul class="handle2">
        <li>
          <label for>项目：</label>
          <el-select
            v-model="projectId"
            filterable
            placeholder="请选择"
            size="small"
            @change="selectProChange"
          >
            <el-option
              v-for="item in projectDic"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </li>
        <li>
          <label for>任务：</label>
          <el-select
            v-model="taskId"
            filterable
            placeholder="请选择"
            size="small"
            @change="selectTaskChange"
          >
            <el-option v-for="item in taskDic" :key="item.id" :label="item.label" :value="item.id"></el-option>
          </el-select>
        </li>
      </ul>
    </div>
    <!-- 数据集规则-table -->
    <TableDefault
      :TLoading="TLoading"
      :TTitle="tableTitle"
      :TData="tableData"
      :TEdit="TEdit"
      :TIsShowPage="true"
      :TTotal="TPage.total"
      :TCurrentPage="TPage.index"
      :TPageSize="TPage.size"
      @clickCell="lickCell"
      @changePage="changePage"
      @clickRow="clickRow"
    ></TableDefault>
    <div v-if="tableRuleTitle.length">
      <div class="handle-list">
        <ul class="handle1">
          <li>
            <el-button type="primary" size="medium" @click="addRules({type:'新增规则列表'})">新增</el-button>
          </li>
        </ul>
      </div>
      <TableDefault
        :TLoading="TRuleLoading"
        :TTitle="tableRuleTitle"
        :TData="tableRuleData"
        :TEdit="TRuleEdit"
        :TIsShowPage="true"
        :TTotal="TRulePage.total"
        :TCurrentPage="TRulePage.index"
        :TPageSize="TRulePage.size"
        @changePage="changeRulePage"
        @clickCell="lickRuleCell"
      ></TableDefault>
    </div>
    <el-dialog
      :title="dialogTitle1"
      :visible.sync="dialogVisible1"
      width="800px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeTabIndex" @tab-click="handleTabsClick">
        <el-tab-pane
          v-for="item in menuTabsList"
          :index="item.id"
          :key="item.id"
          :label="item.name"
          :name="item.id"
        ></el-tab-pane>
      </el-tabs>
      <one-page
        v-if="activeTabIndex=='0'"
        :taskId="taskId"
        :dataSetId="dataSetId"
        :handleType="handleType"
        :dataSetTypeId="dataSetTypeId"
        @closeDialog1="closeDialog1"
      ></one-page>
      <two-page
        v-if="activeTabIndex=='1'"
        :taskId="taskId"
        :dataSetId="dataSetId"
        :handleType="handleType"
        :dataSetTypeId="dataSetTypeId"
        @closeDialog1="closeDialog1"
      ></two-page>
      <three-page
        v-if="activeTabIndex=='2'"
        :taskId="taskId"
        :dataSetId="dataSetId"
        :handleType="handleType"
        :dataSetTypeId="dataSetTypeId"
        @closeDialog1="closeDialog1"
      ></three-page>
    </el-dialog>
    <params-preview
      :dialogVisible="dialogVisible2"
      :titleName="titleName"
      :formData="paramsPreForm"
      @closeDialog="closeDialog2"
      @addHandle="addRuleHandle"
      @changeRuleId="changeRuleId"
      :ruleId="ruleId"
      :taskId="taskId"
    ></params-preview>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
import paramsPreview from "@/business-components/params-preview";
import onePage from "./data-set-dialog/one-page";
import twoPage from "./data-set-dialog/two-page";
import threePage from "./data-set-dialog/three-page";
const init_pageNum = 1;
const init_pageSize = 10;
const INIT_NUM = 0;
const TEditDic = {
  show: true,
  title: "操作",
  width: 300,
  fixed: "right",
  editTypes: [
    {
      label: "编辑数据集",
      css: "success",
    },
    {
      label: "删除",
      css: "danger",
      pass: true,
    },
    {
      label: "添加规则",
      css: "warning",
    },
  ],
};
const TRuleEditDic = {
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
      label: "删除",
      css: "danger",
      pass: true,
    },
  ],
};
const menuTabsListDic = [
  {
    id: "0",
    name: "单表批量添加",
  },
  {
    id: "1",
    name: "SQL数据集",
  },
  {
    id: "2",
    name: "多表关联构造数据集",
  },
];
export default {
  mixins: [mixin],
  data() {
    return {
      TRuleLoading: false,
      tableRuleTitle: [],
      tableRuleData: [],
      TRuleEdit: TRuleEditDic,
      TLoading: false,
      tableData: [],
      tableTitle: [
        { prop: "name", label: "数据集名称", sort: 0 },
        { prop: "type_value", label: "数据集类型", sort: 0 },
        { prop: "code", label: "数据集编码（SQL）", sort: 0 },
        { prop: "remark", label: "备注", sort: 0 },
        { prop: "createTime", label: "创建时间", sort: 6 },
      ],
      projectId: "",
      projectDic: [],
      taskId: "",
      taskDic: [],
      TEdit: TEditDic,
      TPage: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize,
      },
      TRulePage: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize,
      },
      dialogTitle1: "添加数据集",
      dialogTitle2: "添加规则",
      dialogVisible1: false,
      dialogVisible2: false,
      activeTabIndex: "0",
      activeTabIndexDefault: "0",
      menuTabsList: menuTabsListDic,
      TClickItem: ["name"],
      handleType: "新增",
      activeDataSetId: "",
      activeArea: "",
      ifReadOnly: false,
      TPage1: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize,
      },
      paramsPreForm: {},
      tempParamsPreForm: {},
      titleName: "新增规则",
      ruleId: "",
      dataSetId: 0, // 明细数据集Id
      editType: "编辑",
      addType: "新增",
      dataSetTypeId: null, // 数据集类型Id
    };
  },
  async mounted() {
    await this.getTaskList({ init: true });
  },
  methods: {
    changeRuleId(id) {
      this.ruleId = id;
    },
    // 获取项目-任务联动字典
    getTaskList({ init }) {
      let params = {
        taskId: this.projectId,
      };
      API._ruleRelationTaskList(params).then(async (res) => {
        let Res = new ResDatas({
          res,
          error: "项目-任务联动字典获取失败!",
        }).init();
        this.projectDic = Res && Res.length ? Res : [];
        this.projectId =
          this.projectDic && this.projectDic.length
            ? this.projectDic[0].id
            : "";
        this.taskDic =
          this.projectDic &&
          this.projectDic.length &&
          this.projectDic[0].children
            ? this.projectDic[0].children
            : [];
        this.taskId =
          this.taskDic && this.taskDic.length ? this.taskDic[0].id : "";
        await this.getRuleMainList();
      });
    },
    // 获取数据集table-list
    getRuleMainList() {
      let params = {
        pageNo: this.TPage.index,
        pageSize: this.TPage.size,
        id: this.taskId,
      };
      API.ruleMainList(params).then(async (res) => {
        let Res = new ResDatas(
          {
            res,
            code: 200,
            fieldKey: {
              data: "records",
              title: "",
              total: "total",
              pageSize: "size",
            },
            titleKey: [],
          },
          "TLoading",
          this
        );
        if (Res.init()) {
          const { data, totalCount, pageSize, pageNo, title } = Res.init();
          this.tableData = data;
          this.tableTitle = title;
          this.TPage = {
            total: totalCount,
            index: pageNo,
            size: pageSize,
          };
          // await
        } else {
          this.tableData = [];
          this.$set(this.TPage, `total`, 0);
        }
      });
    },
    // 数据集table-click
    clickTableItem() {},
    // 数据集table-分页
    changeshowPage(pageObj) {},
    // 新增数据集dialog-打开
    showDialog1({ type, typeName }) {
      this.dialogTitle1 = type;
      this.handleType = typeName;
      this.dialogVisible1 = !this.dialogVisible1;
      this.activeTabIndex = this.activeTabIndexDefault;
    },
    // 字典表匹配dialog-打开
    showDialog2() {
      this.$message({
        message:
          "说明：如果第三方数据库的备注信息没有值，也就是没有中文名称，可以根据对方给的数据字典说明（excel）导入补充中文名称，这样便于查看",
        type: "warning",
      });
    },
    // 项目select-change
    selectProChange(val) {
      this.projectDic.forEach((item) => {
        if (item.id === val) {
          this.taskDic = item.children ? item.children : [];
          this.taskId = this.taskDic.length ? this.taskDic[0].id : "";
          this.getRuleMainList();
        }
      });
    },
    // 任务select-change
    selectTaskChange(val) {
      console.log("-===============", val, this.taskId);
      this.getRuleMainList();
    },
    // 数据集tabl-二级联动table
    clickRow({ row, column }) {
      this.dialogVisible2 = false;
      this.activeDataSetId = row.id;
      this.paramsPreForm = { ...row };
      this.tempParamsPreForm = { ...row };
      this.qualityRulesList();
    },
    // 数据集table-单元格点击事件
    lickCell({ row, column, id }) {
      const { name, type } = row;
      switch (column.label) {
        case "编辑数据集":
          this.dialogVisible2 = false;
          this.dialogTitle1 = "编辑数据集";

          this.activeTabIndex = `${type}`;
          this.dataSetId = row.id || 0; // 明细数据集Id
          this.handleType = this.editType; // 操作类型
          this.dataSetTypeId = type;
          this.dialogVisible1 = !this.dialogVisible1;
          return;
        case "删除":
          {
            this.dialogVisible2 = false;
            this.$confirm(`即将删除“${name}”任务, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.projectDel({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        case "添加规则":
          this.titleName = "添加规则";
          this.activeDataSetId = row.id;
          this.paramsPreForm = { ...row };
          this.tempParamsPreForm = { ...row };
          this.ruleId = "";
          console.log("添加规则----", row);
          this.dialogVisible2 = true;
          return;
        default:
          break;
      }
    },
    // 数据集table-删除
    async projectDel(params) {
      API.ruleDelDataSet(params).then(async (res) => {
        let data = res.data;
        if (data.code === 200) {
          await this.getRuleMainList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },
    // 数据集table-分页
    changePage({ pageSize, currentPage }) {
      this.TPage = {
        ...this.TPage,
        index: currentPage,
        size: pageSize,
      };
      this.getRuleMainList();
    },
    // 添加数据集
    addDataSet() {},
    // 数据集dailog-tabs切换
    handleTabsClick(val) {
      let { name } = val;
      this.activeTabIndex = name;
    },
    // 添加/编辑数据集dialog-close
    async closeDialog1(val, done) {
      await this.getRuleMainList();
      done && done();
      this.dialogVisible1 = val;
      this.activeTabIndex = "";
    },
    // 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose(done) {
      this.closeDialog1(false, done);
    },
    // 质量规则列表
    qualityRulesList() {
      let params = {
        id: this.activeDataSetId,
        pageNo: this.TRulePage.index,
        pageSize: this.TRulePage.size,
      };
      API.rulesQualityRulesList(params).then((res) => {
        let Res = new ResDatas(
          {
            res,
            code: 200,
            fieldKey: {
              data: "records",
              title: "",
              total: "totalCount",
              pageSize: "size",
            },
            titleKey: [],
          },
          "TLoading",
          this
        );
        if (Res.init()) {
          const { data, totalCount, pageSize, pageNo, title } = Res.init();
          this.tableRuleData = data;
          this.tableRuleTitle = title;
          this.TRulePage = {
            total: totalCount,
            index: pageNo,
            size: pageSize,
          };
        } else {
          this.tableRuleData = [];
          this.$set(this.TRulePage, `total`, 0);
        }
      });
    },
    // 质量规则table-分页
    changeRulePage({ pageSize, currentPage }) {
      this.TRulePage = {
        ...this.TPage,
        index: currentPage,
        size: pageSize,
      };
      this.qualityRulesList();
    },
    // 质量规则table-单元格点击事件
    lickRuleCell({ row, column, id }) {
      const { ruleName } = row;
      console.log("编辑单条规则----", row);
      switch (column.label) {
        case "编辑":
          this.titleName = "编辑规则";
          this.dialogVisible2 = true;
          this.ruleId = row.ruleId + "";
          this.paramsPreForm = { ...row };
          return;
        case "删除":
          {
            this.$confirm(`即将删除“${ruleName}”任务, 是否继续?`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                this.delDataSetRule({ id: row.id });
              })
              .catch(() => {});
          }
          return;
        default:
          break;
      }
    },
    // 新增规则dialog-打开
    showDialog2() {},
    // 规则列表-删除
    delDataSetRule(params) {
      API.ruleDelDataSetRuleById(params).then(async (res) => {
        let data = res.data;
        if (data.code === 200) {
          await this.qualityRulesList();
          this.$message({
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "删除失败",
            type: "error",
          });
        }
      });
    },
    async closeDialog2() {
      await this.getRuleMainList();
      await this.qualityRulesList();
      this.dialogVisible2 = false;
    },
    addRuleHandle(flag) {
      if (flag) {
        this.$message({
          message: `${this.titleName}成功`,
          type: "success",
        });
        this.closeDialog2();
      } else {
        this.$message({
          message: `${this.titleName}失败`,
          type: "error",
        });
      }
    },
    addRules() {
      console.log(1);
      this.titleName = "新增规则";
      this.ruleId = "";
      this.dialogVisible2 = true;
      this.paramsPreForm = this.tempParamsPreForm;
    },
  },
  components: {
    onePage,
    twoPage,
    threePage,
    paramsPreview,
  },
};
</script>

<style lang="less" scoped>
.dq-rule-config {
  & > div.handle-list {
    height: 60px;
    & > ul {
      width: auto;
      height: 60px;
      padding: 10px 0;
      box-sizing: border-box;
      &.handle1 {
        float: left;
      }
      &.handle2 {
        float: right;
      }

      & > li {
        width: auto;
        float: left;
        margin-right: 20px;
      }
    }
  }
  &-btn {
    float: left;
    overflow: hidden;
    li {
      float: left;
      margin: 2px 15px;
    }
  }
  &-select {
    float: left;
    overflow: hidden;
    margin: 4px 55px;
    li {
      float: left;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
  /deep/ .el-dialog__header {
    height: 40px;
    line-height: 40px;
    background-color: #01c1df;
  }
}
</style>