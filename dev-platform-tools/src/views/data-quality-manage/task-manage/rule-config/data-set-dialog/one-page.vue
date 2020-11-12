<template>
  <div class="one-page">
    <TableDefault
      :TId="TId"
      :TLoading="TLoading"
      :TTitle="tableTitle"
      :TData="tableData"
      :TIsShowPage="true"
      :TTotal="TPage.total"
      :TCurrentPage="TPage.index"
      :TPageSize="TPage.size"
      :TIsShowCheckBox="TIsShowCheckBox"
      @clickCell="lickCell"
      @changePage="changePage"
      @handleSelectionChange="handleSelectionChange"
      @columnContentType="columnContentType"
    ></TableDefault>
    <div class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
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
      define: () => "新增",
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
      TId: "one-table",
      TLoading: true,
      tableTitle: [],
      tableData: [],
      tableDataAll: [],
      TIsShowCheckBox: true,
      TPage: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize,
      },
      checkedVals: [],
      addType: "新增",
      editType: "编辑",
      tableDataSetId: 0, // 'table' 的数据集类型Id
      getDataSetErrorTips: "获取编辑数据集列表失败!",
      editSelectNumTips: "编辑数据集,单表添加只能选一个",
      isRemarkEdit: true,
      isDataSetEdit: true,
    };
  },
  watch: {
    handleType() {
      console.log("watch--handleType", this.handleType, this.taskId);
    },
    taskId() {
      console.log("watch--taskId", this.handleType, this.taskId);
      this.handleType === this.addType && this.getTableList();
    },
  },
  computed: {
    // 是否新增操作
    isAdd() {
      return;
    },
    // 是否编辑操作
    isEdit() {
      if (
        this.handleType === this.editType ||
        this.handleType === this.addType
      ) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    console.log(
      "async mounted-one",
      this.handleType,
      this.dataSetId,
      this.taskId
    );
    console.log(
      "async-mounted-dataSetTypeId-isAdd",
      this.dataSetTypeId,
      this.isAdd
    );
    // await this.getTableList();
    await this.main();
  },
  methods: {
    // 自定义列类型 自定义关联逻辑
    columnContentType(propType, { scope, type, item, column }, cb) {
      if (this.TId === "one-table") {
        switch (propType) {
          case "propsType": // 显示自定义类型列
            {
              if (column.prop === "dataSetName" || column.prop === "remark") {
                cb(true);
              }
            }
            return;
          case "propItemType": // 渲染相对应的列的内容类型
            {
              if (column.prop === "dataSetName" || column.prop === "remark") {
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
      this.dataSetTypeId !== this.tableDataSetId && this.getTableList();

      this.isEdit &&
        this.dataSetTypeId === this.tableDataSetId &&
        this.dataSetId &&
        this.getDataSetDetail();
    },
    // 数据集table-list
    getTableList() {
      let params = {
        taskId: this.taskId,
      };
      API.ruleTableDSForAdd(params).then((res) => {
        let Res = new ResDatas({
          res,
          error: "新增数据集列表失败!",
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.TPage = {
          ...this.TPage,
          total: this.tableDataAll.length,
        };
        this.getCurrectTableList();
        this.TLoading = !this.TLoading;
      });
    },
    // 获取当前页数据
    getCurrectTableList() {
      let { index, size } = this.TPage;
      let start = (index - 1) * size;
      let end = start + size;
      this.tableData = this.tableDataAll.slice(start, end);
    },
    // dialog-close
    closeDialog() {
      this.$emit("closeDialog1", false);
    },
    // 提交
    submit() {
      let params = {
        taskId: this.taskId,
        dqDataSetList: [...this.checkedVals],
      };
      if (this.handleType == "新增") {
        API.ruleSaveTableDataSet(params).then((res) => {
          let data = res.data;
          if (data.code === 200) {
            switch (this.handleType) {
              case "新增":
                this.$message({
                  message: "单表批量添加成功",
                  type: "success",
                });
                break;
              case "编辑":
                this.$message({
                  message: "单表编辑成功",
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
                  message: "单表批量添加失败",
                  type: "error",
                });
                break;
              case "编辑":
                this.$message({
                  message: "单表编辑失败",
                  type: "error",
                });
                break;
              default:
                break;
            }
          }
        });
      } else {
        if (!this.validateSubmit()) {
          return;
        }
        API.ruleUpdateTableDataSet({
          ...this.checkedVals[0],
        }).then((res) => {
          let data = res.data;
          if (data.code === 200) {
            switch (this.handleType) {
              case "新增":
                this.$message({
                  message: "单表批量添加成功",
                  type: "success",
                });
                break;
              case "编辑":
                this.$message({
                  message: "单表编辑成功",
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
                  message: "单表批量添加失败",
                  type: "error",
                });
                break;
              case "编辑":
                this.$message({
                  message: "单表编辑失败",
                  type: "error",
                });
                break;
              default:
                break;
            }
          }
        });
      }
    },
    // 提交验证
    validateSubmit() {
      if (this.checkedVals && this.checkedVals.length > 1 && this.isEdit) {
        this.$message.error(this.editSelectNumTips);
        return;
      }
      return true;
    },
    // 多选
    handleSelectionChange(key, val) {
      switch (this.handleType) {
        // 新增
        case "新增":
          this.checkedVals = []; // 初始化
          if (val && val.length) {
            val.forEach((item) => {
              let obj = {
                name: item.dataSetName,
                code: item.tableName,
                remark: item.remark,
              };
              this.checkedVals.push(obj);
            });
          }
          break;
        // 编辑
        case "编辑":
          this.checkedVals = []; // 初始化
          if (val && val.length) {
            val.forEach((item) => {
              console.log("item", item);
              let obj = {
                id: this.dataSetId,
                name: item.dataSetName,
                code: item.tableName,
                remark: item.remark,
              };
              this.checkedVals.push(obj);
            });
            val.length > 1 && this.$message.error(this.editSelectNumTips);
          }
          break;
        default:
          break;
      }
    },
    lickCell({ row, column, id }) {},
    changePage({ pageSize, currentPage }) {
      this.TPage = {
        ...this.TPage,
        index: currentPage,
        size: pageSize,
      };
      this.getCurrectTableList();
    },
    // 获取编辑数据集列表
    getDataSetDetail() {
      let args = {
        dataSetId: this.dataSetId || 0 // 数据集id Number
      };
      console.log("getDataSetDetail-enter");
      API.getDataSetDetail(args).then((res) => {
        let Res = new ResDatas({
          res,
          error: this.getDataSetErrorTips,
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.TPage = {
          ...this.TPage,
          total: this.tableDataAll.length,
        };
        this.getCurrectTableList();
        this.TLoading = !this.TLoading;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.one-page {
  position: relative;
  padding-bottom: 40px;
  box-sizing: border-box;
  .dialog-footer {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>