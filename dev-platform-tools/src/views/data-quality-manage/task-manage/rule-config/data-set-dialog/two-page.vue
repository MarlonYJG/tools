<template>
  <div class="two-page">
    <el-form :model="form" :rules="rules" ref="formName">
      <el-form-item label="数据集名称：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="备注说明：" :label-width="formLabelWidth" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入..."></el-input>
      </el-form-item>
      <el-form-item label="SQL语句：" :label-width="formLabelWidth" prop="code">
        <el-input type="textarea" v-model="form.code" placeholder="请填写SQL语句..."></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button type="primary" @click="submit()">确 定</el-button>
      <el-button @click="closeDialog">取 消</el-button>
    </div>
  </div>
</template>

<script>
import API from "api/index";
import { ResDatas } from "utils/res-format";
const rulesDic = {
  name: [{ required: true, message: "请输入数据集名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入SQL语句", trigger: "blur" }]
};
export default {
  props: {
    taskId: {
      type: String,
      define: () => ""
    },
    handleType: {
      type: String,
      define: () => ""
    },
    // 明细数据集Id
    dataSetId: {
      type: Number,
      default: () => 0
    },
    // 数据集类型Id
    dataSetTypeId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      formLabelWidth: "120px",
      rules: rulesDic,
      form: {
        name: "",
        remark: "",
        code: ""
      },
      addType: "新增",
      editType: "编辑",
      sqlDataSetId: 1, // 'sql' 的数据集类型Id
      getDataSetErrorTips: "获取sql数据集明细失败!"
    };
  },
  mounted() {
    console.log("mounted-two", this.handleType, this.taskId);
    this.main();
  },
  methods: {
    main() {
      this.handleType === this.editType &&
        this.dataSetTypeId === this.sqlDataSetId &&
        this.dataSetId &&
        this.getDataSetDetail();
    },
    // dialog-close
    closeDialog() {
      this.$emit("closeDialog1", false);
    },
    // 提交
    submit() {
      let params = {
        taskId: this.taskId,
        ...this.form
      };
      this.$refs["formName"].validate(valid => {
        if (valid) {
          API.ruleSaveOrUpdateSqlDataSet(params).then(res => {
            if (res.status === 200) {
              switch (this.handleType) {
                case "新增":
                  this.$message({
                    message: "SQL数据集添加成功",
                    type: "success"
                  });
                  break;
                case "编辑":
                  this.$message({
                    message: "SQL数据集编辑成功",
                    type: "success"
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
                    message: "SQL数据集添加失败",
                    type: "error"
                  });
                  break;
                case "编辑":
                  this.$message({
                    message: "SQL数据集编辑失败",
                    type: "error"
                  });
                  break;
                default:
                  break;
              }
            }
          });
        } else {
          return false;
        }
      });
    },
    // 获取sql数据集明细
    getDataSetDetail() {
      let args = {
        dataSetId: this.dataSetId || 0 // 数据集id Number
      };
      API.getDataSetDetail(args).then(res => {
        let Res = new ResDatas({
          res,
          error: this.getDataSetErrorTips
        }).init();

        this.form = Res;
      });
    }
  }
};
</script>

<style lang="less" scoped>
.two-page {
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