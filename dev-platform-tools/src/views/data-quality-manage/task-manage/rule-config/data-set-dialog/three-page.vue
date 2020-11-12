<template>
  <div class="three-page">
    <el-form :model="form" :rules="rules" ref="formName">
      <el-form-item label="数据集名称：" placeholder="请输入..." prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item class="if-options-item" label="选择表：" prop="relationTableList">
        <div class="if-options">
          <el-input v-model="form.relationTableList" placeholder="请输入..." :readonly="isReadOnly"></el-input>
          <el-button type="text" @click="addForm">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item class="if-options-item" label="选择字段：" prop="relationColumnVoList">
        <div class="if-options">
          <el-input
            v-model="form.relationColumnVoList"
            placeholder="默认是全部字段，可以在这里设置要检查的字段"
            :readonly="isReadOnly"
          ></el-input>
          <el-button type="text" @click="addColumn">添加</el-button>
        </div>
      </el-form-item>
      <el-form-item label="关联条件：" prop="relationInfo">
        <el-input
          type="textarea"
          v-model="form.relationInfo"
          placeholder="请参考相应SQL语法填写join关联条件，比如a.code=b.code"
        ></el-input>
      </el-form-item>
      <el-form-item label="数据过滤：" prop="filterInfo">
        <el-input type="textarea" v-model="form.filterInfo" placeholder="请参考相应SQL语法填写where过滤语句"></el-input>
      </el-form-item>
      <el-form-item label="备注说明：" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入..."></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      :before-close="handleClose"
    >
      <TableDefault
        :TLoading="TLoading"
        :TTitle="tableTitle"
        :TData="tableData"
        :TIsShowPage="true"
        :TTotal="TPage.total"
        :TId="TId"
        :TCurrentPage="TPage.index"
        :TPageSize="TPage.size"
        :TIsShowCheckBox="TIsShowCheckBox"
        @changePage="changePage"
        @handleSelectionChange="handleSelectionChange"
        @columnContentType="columnContentType"
      ></TableDefault>
      <div class="dialog-footer">
        <el-button type="primary" @click="addSubmit()">确 定</el-button>
        <el-button @click="closeRelationDialog">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
const rulesDic = {
  name: [{ required: true, message: "请输入数据集名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入SQL语句", trigger: "blur" }],
};
const init_pageNum = 1;
const init_pageSize = 10;
const INIT_NUM = 0;
export default {
  mixins: [mixin],
  props: {
    taskId: {
      type: String,
      define: () => "",
    },
    handleType: {
      type: String,
      define: () => "",
    },
    // 明细数据集Id
    dataSetId: {
      type: Number,
      default: () => 0,
    },
    // 数据集类型Id
    dataSetTypeId: {
      type: Number,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        name: "", // 数据集名称
        relationTableList: "", // 选择表
        relationColumnVoList: "", // 选择字段
        relationInfo: "", // 关联条件
        filterInfo: "", // 数据过滤
        remark: "", // 备注
      },
      rules: rulesDic,
      dialogTitle: "选择表",
      dialogVisible: false,
      TLoading: false,
      tableData: [],
      tableTitle: [],
      tableDataAll: [],
      TPage: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize,
      },
      TIsShowCheckBox: true,
      TId: "TRef",
      relationColumnVoList: [], // 选择字段
      // relationTableList: [],  // 选择表
      relationDataSetId: 2, // 'relation' 的数据集类型Id
      editType: "编辑",
      getRelationDetailErrorTips: "获取多表关联构造数据集失败!",
      separator: ";", // 选择表/选择字段 多个数据分隔符
      isReadOnly: true, // 是否只读
      isAliasEdit: true, // 选择字段 别名可编辑
      checkboxMaxLen: 2, // 添加表 多选最大数
      checkboxMaxTips: "添加表 多选必须两条数据",
      relationUpdateErrorTips: "多表关联更新失败!",
    };
  },
  async mounted() {
    console.log("mounted-three", this.handleType, this.taskId);
    this.TIsShowCheckBox = this.handleType === "add" ? false : true;
    await this.main();
  },
  watch: {
    handleType(val) {
      this.TIsShowCheckBox = val === "add" ? false : true;
    },
  },
  computed: {
    // 是否编辑操作
    isEdit() {
      return this.handleType === this.editType;
    },
  },
  methods: {
    // 自定义列类型 自定义关联逻辑
    columnContentType(propType, { scope, type, item, column }, cb) {
      if (this.TId === "TRef") {
        switch (propType) {
          case "propsType": // 显示自定义类型列
            {
              if (column.prop === "columnAliasName") {
                cb(true);
              }
            }
            return;
          case "propItemType": // 渲染相对应的列的内容类型
            {
              if (column.prop === "columnAliasName") {
                if (type === "input") {
                  return cb(true);
                }
                return cb(false);
              }
            }
            return;
          default:
            return;
        }
      }
    },
    main() {
      this.handleType === this.editType &&
        this.dataSetTypeId === this.relationDataSetId &&
        this.dataSetId &&
        this.getDataSetDetail();
    },
    // 选择表list
    queryTableName() {
      let baseParams = {
        taskId: this.taskId,
      };
      let params =
        this.form && this.form.relationTableList
          ? {
              ...baseParams,
              tableNames: this.form.relationTableList,
            }
          : {
              ...baseParams,
            };
      API.rulesQueryTableName(params).then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取失败!",
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.TPage.total = this.tableDataAll.length;
        this.getCurrectTableList();
        this.defineTableChecked();
      });
    },
    // 字段表list
    queryColumn() {
      if (
        !(this.form.relationTableList && this.form.relationTableList.length)
      ) {
        this.$message({
          message: "请选择检查表",
          type: "error",
        });
        return false;
      }

      let relationTableList = [];
      this.form.relationTableList.split(",").forEach((item) => {
        relationTableList.push({
          tableName: item,
        });
      });
      let baseParams = {
        dqDataSet: {
          taskId: this.taskId,
        },
        relationTableList,
      };
      let params = {};
      switch (this.handleType) {
        case "新增":
          params = { ...baseParams };
          break;
        case "编辑":
          params = {
            ...baseParams,
            relationColumnVoList: [],
          };
          break;
        default:
          break;
      }

      API.rulesQueryColumn(params).then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取失败!",
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.TPage.total = this.tableDataAll.length;
        this.getCurrectTableList();
        this.dialogVisible = !this.dialogVisible;
      });
    },
    // 获取当前页数据
    getCurrectTableList() {
      let { index, size } = this.TPage;
      let start = (index - 1) * size;
      let end = start + size;
      this.tableData = this.tableDataAll.slice(start, end);
    },
    // 关闭多表关联的 选择表或字段 模态窗
    closeRelationDialog() {
      this.dialogVisible = !this.dialogVisible;
    },
    // 关闭 新增或编辑数据集 模态窗
    closeDialog() {
      console.log("进来closeDialog");
      this.$emit("closeDialog1", false);
    },
    // 仅当用户通过点击关闭图标或遮罩关闭 Dialog 时起效
    handleClose(done) {
      this.dialogVisible = false;
      done();
    },
    // 添加检查表dialog-打开
    async addForm() {
      this.dialogTitle = "选择表";
      await this.queryTableName();
      this.TIsShowCheckBox = true;
      console.log("addForm-TIsShowCheckBox", this.TIsShowCheckBox);
      this.dialogVisible = !this.dialogVisible;
    },
    // 添加字段表dialog-打开
    // async addColumn() {
    //   this.dialogTitle = "选择字段";
    //   let flag = await this.queryColumn();
    //   if (flag) {
    //     this.dialogVisible = !this.dialogVisible;
    //   }
    // },
    // 选择表&选择字段 确定
    addSubmit() {
      if (
        this.form.relationTableList &&
        this.form.relationTableList.split(this.separator).length !=
          this.checkboxMaxLen
      ) {
        this.$message.error(this.checkboxMaxTips);
        return;
      }
      console.log(
        "addSubmit-relationColumnVoList",
        this.form.relationColumnVoList,
        this.relationColumnVoList
      );
      this.dialogVisible = !this.dialogVisible;
    },
    // 多表构造数据集-提交
    submit() {
      let relationTableList = [],
        relationColumnVoList = [];
      this.form.relationTableList.split(this.separator).forEach((item) => {
        relationTableList.push({
          tableName: item,
        });
      });
      this.relationColumnVoList.forEach((item) => {
        relationColumnVoList.push({
          tableName: item.tableName,
          columnName: item.columnName,
          columnAliasName: item.columnAliasName ? item.columnAliasName : "",
          columnRemark: item.columnRemark ? item.columnRemark : "",
        });
      });

      let obj = {
        dqDataSet: {
          ...this.form,
          taskId: this.taskId,
        },
        relationTableList,
        relationColumnVoList,
      };

      let params = Object.assign(
        {
          dqDataSet: {},  // 多表关联弹框的基本信息
          relationTableList: [],  // 选择表弹框的信息，必须选择两个表
          relationColumnVoList: [],  // 选择字段弹框的信息
        }, 
        obj
      );

      API.saveOrUpdateRelationDataSet(params).then((res) => {
        let data = res.data;
        if (data.code === 200) {
          switch (this.handleType) {
            case "新增":
              this.$message({
                message: "多表关联构造数据集添加成功",
                type: "success",
              });
              break;
            default:
              break;
          }
          this.closeDialog();
        } else {
          switch (this.handleType) {
            case "新增":
              this.$message({
                message: "多表关联构造数据集添加失败",
                type: "error",
              });
              break;
            case this.editType:
              this.$message.error(data.message || this.relationUpdateErrorTips);
              break;

            default:
              break;
          }
        }
      });
    },
    // 分页
    changePage({ pageSize, currentPage }) {
      this.TPage = {
        ...this.TPage,
        index: currentPage,
        size: pageSize,
      };
      this.getCurrectTableList();
    },
    // 多选
    handleSelectionChange(key, val) {
      let isTableDialog = this.dialogTitle == "选择表";
      if (isTableDialog && val.length > this.checkboxMaxLen) {
        this.$message.error(this.checkboxMaxTips);
        return;
      }

      let result = "";
      if (val && val.length) {
        val.forEach((item) => {
          let value = isTableDialog
            ? item.tableName
            : item.columnAliasName || item.columnName;
          result += result === "" ? value : this.separator + value;
        });
      }
      switch (this.dialogTitle) {
        case "选择表":
          this.form.relationTableList = result;
          // this.relationTableList = val;
          break;
        case "选择字段":
          this.form.relationColumnVoList = result;
          this.relationColumnVoList = val;
          break;
        default:
          break;
      }
      console.log("relationColumnVoList", this.relationColumnVoList);
    },
    // 默认表格-checkbox回显
    defineTableChecked() {
      let rows = [{ ...this.tableData[0] }, { ...this.tableData[1] }];
      rows.forEach((row) => {
        console.log(this.$refs["TRef"], "TRef");
        // this.$refs.TRef.toggleRowSelection(row);
      });
    },
    //选择字段list
    addColumn() {
      this.dialogTitle = "选择字段";
      if (!this.form.relationTableList) {
        this.$message({
          message: "请添加选择表",
          type: "error",
        });
        return;
      }
      let relationTableList =
        this.form.relationTableList &&
        this.form.relationTableList.split(";").map((item) => {
          return { tableName: item };
        });
      let params = {
        dqDataSet: {
          taskId: this.taskId,
        },
        relationTableList,
      };

      API.rulesQueryColumn(params).then((res) => {
        let Res = new ResDatas({
          res,
          error: "获取失败!",
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.TPage.total = this.tableDataAll.length;
        this.TIsShowCheckBox = true; // 多选
        this.getCurrectTableList();
        console.log("addColumn-TIsShowCheckBox", this.TIsShowCheckBox);
        this.dialogVisible = !this.dialogVisible;
      });
    },
    // 获取数据集明细
    getDataSetDetail() {
      let args = {
        dataSetId: this.dataSetId || 0 // 数据集id Number
      };
      console.log("getDataSetDetail-enter");
      API.getDataSetDetail(args).then((res) => {
        let Res = new ResDatas({
          res,
          error: this.getRelationDetailErrorTips,
        }).init();

        ({
          name: this.form.name,
          relationInfo: this.form.relationInfo,
          filterInfo: this.form.filterInfo,
          remark: this.form.remark,
        } = Res.dqDataSet);
        this.form.relationTableList = Res.relationTableList.reduce(
          (pre, curr) => pre.tableName + this.separator + curr.tableName
        );
        this.relationColumnVoList = Res.relationColumnVoList;
        this.form.relationColumnVoList = Res.relationColumnVoList.reduce(
          (pre, curr) => {
            return (
              (pre.columnNameAliasName || pre.columnName) +
              this.separator +
              (curr.columnNameAliasName || curr.columnName)
            );
          }
        );
      });
    },
  },
};
</script>

<style lang="less" scoped>
.three-page {
  position: relative;
  padding-bottom: 40px;
  box-sizing: border-box;
  /deep/ .el-form-item__label {
    width: 120px;
  }
  /deep/ .el-form-item__content {
    width: calc(100% - 240px);
    float: left;
  }
  .if-options {
    width: 100%;
    display: inline-block;
    height: 80px;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    background-color: #fff;
    background-image: none;
    box-sizing: border-box;
    &:hover {
      outline: 0;
      border-color: #409eff;
    }
    /deep/ .el-input__inner {
      border: 0;
    }
    /deep/ .el-form-item__content {
      width: 100%;
    }
    /deep/ .el-button {
      position: absolute;
      bottom: 0;
      right: 5px;
    }
  }
  .dialog-footer {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>