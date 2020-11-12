<!--
 * @Author: yangjianguo
 * @Date: 2019-08-15 15:36:01
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-14 17:26:35
 * @Description: 配置数据管理-》前端数据管理-》前端数据编辑
 -->
<template>
  <div class="data_management">
    <!-- 添加 -->
    <!-- <div class="add_edit">
      <el-button type="primary" plain @click="dialogFormVisible = true">添加界面数据</el-button>
    </div>-->
    <!-- 展示 -->
    <div class="view_edit">
      <el-table
        :data="tableData"
        border
        v-loading="loading"
        :height="850"
        size="small"
        stripe
        :header-cell-style="{background:'#F5F7F9',color:'#657180'}"
      >
        <el-table-column
          v-for="(item, index) in tableHeader"
          :key="index"
          :label="item.label"
          :width="item.width? item.width:null"
        >
          <template slot-scope="scope">
            <div v-if="index===6">
              <span>······</span>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </div>
            <div v-else-if="index ===7">
              <el-checkbox v-model="scope.row[item.key]" @change="handleCheckbox(scope.row)"></el-checkbox>
            </div>
            <span v-else>{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <!-- 弹出框 -->
    <el-dialog title :visible.sync="dialogFormVisible" width="30%">
      <el-form :rules="rules" :model="ruleForm" ref="ruleForm">
        <el-form-item
          v-for="(item, index) in formObj"
          :key="index"
          :label="item.label"
          :label-width="formLabelWidth"
          :prop="item.key"
        >
          <el-input
            v-if="item.key === 'datas'|| item.key==='parames'"
            type="textarea"
            v-model="ruleForm[item.key]"
          ></el-input>
          <el-checkbox v-else-if="item.key === 'isMockData'" v-model="ruleForm[item.key]"></el-checkbox>
          <el-input v-else v-model="ruleForm[item.key]" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('dialogFormVisible')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 -->
    <div class="custom_dialog" v-show="dialogEditVisible">
      <div class="modal">
        <p class="title">编辑数据</p>
        <div class="mod_body">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="文本呈现" name="first">
              <div id="jsoneditor" style="width:100%;height:400px;margin:0 auto;"></div>
            </el-tab-pane>
            <!-- <el-tab-pane label="表格呈现" name="second">
              <el-table :data="gridData">
                <el-table-column property="date" label="日期" width="150"></el-table-column>
                <el-table-column property="name" label="姓名" width="200"></el-table-column>
                <el-table-column property="address" label="地址"></el-table-column>
              </el-table>
            </el-tab-pane>-->
          </el-tabs>
          <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('dialogEditVisible')">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/api/index";
let container;
let editor;
export default {
  data() {
    return {
      loading: false,
      tableData: [],
      tableHeader: [
        {
          label: "序号",
          key: "id",
          width: "80"
        },
        // {
        //   label: "产品",
        //   key: "product"
        // },
        {
          label: "地区",
          key: "area"
        },
        {
          label: "名称",
          key: "name"
        },
        {
          label: "模块名称",
          key: "modelName"
        },
        {
          label: "接口地址",
          key: "api"
        },
        {
          label: "接口参数",
          key: "parames"
        },
        {
          label: "界面展示数据",
          key: "datas",
          width: "100"
        },
        {
          label: "使用静态数据",
          key: "isMockData",
          width: "105"
        }
      ],
      // 表单弹出框
      dialogFormVisible: false,
      // 编辑弹出框
      dialogEditVisible: false,
      formLabelWidth: "110px",
      // 表单中的显示字段
      formObj: [
        {
          label: "序号",
          key: "id"
        },
        {
          label: "产品",
          key: "product"
        },
        {
          label: "地区",
          key: "area"
        },
        {
          label: "名称",
          key: "name"
        },
        {
          label: "模块名称",
          key: "modelName"
        },
        {
          label: "接口地址",
          key: "api"
        },
        {
          label: "接口参数",
          key: "parames"
        },
        {
          label: "界面展示数据",
          key: "datas"
        },
        {
          label: "使用静态数据",
          key: "isMockData"
        }
      ],
      // 表单验证
      rules: {
        api: [{ required: true, message: "请输入接口地址", trigger: "blur" }],
        datas: [
          {
            required: true,
            message: "请录入数据",
            trigger: "blur"
          }
        ]
      },
      // 表单中的字段
      ruleForm: {
        id: "",
        product: "",
        area: "",
        name: "",
        modelName: "",
        api: "",
        parames: "",
        datas: "",
        isMockData: ""
      },
      // 切换表格
      activeName: "first",
      // 表格数据
      gridData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
      json: {},
      table: {},
      // 存储用户点击的id
      id: ""
    };
  },
  watch: {
    json: {
      handler(newVal, oldVal) {
        // console.log(newVal, oldVal);
        console.log(newVal);
        this.table = {
          header: [],
          data: []
        };
      },
      deep: true
    }
  },
  methods: {
    // 编辑
    handleEdit(index, row) {
      console.log(index, row.datas);
      this.json = JSON.parse(row.datas);
      this.id = row.key;
      this.dialogEditVisible = true;
      if (editor) {
        editor.set(this.json);
      }
    },
    // 删除
    handleDelete(index, row) {
      console.log(index, row);
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("发送请求");
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    // 表单重置（取消）
    resetForm(dialogName) {
      this[dialogName] = false;
      // 清空表单 TODO
    },
    // 标签切换
    handleClick(tab, event) {
      //   console.log(tab, event);
    },
    // 编辑JSON提交
    submitData() {
      let flag = true;
      try {
        if (this.json && typeof this.json === "string") {
          this.json = JSON.parse(this.json);
        }
      } catch (error) {
        flag = false;
        this.$message({
          message: "数据解析错误(非JSON格式)",
          type: "warning"
        });
        console.error(error);
      }
      if (flag) {
        let req = {
          id: this.id,
          jsonData: JSON.stringify(this.json)
        };
        api.saveJson(req).then(res => {
          try {
            if (res.data && Number(res.data.code) === 0) {
              this.resetForm("dialogEditVisible");
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              if (this.tableData.length) {
                // 修改数据
                this.tableData.forEach(item => {
                  if (item.key === this.id) {
                    item.datas = JSON.stringify(this.json);
                  }
                });
              }
            } else {
              this.$message.error(res.data.message);
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    },
    // 获取列表
    getList() {
      this.loading = true;
      api.getList().then(res => {
        console.log(res);
        try {
          if (res.data && Number(res.data.code) === 0) {
            let resData = res.data.data;
            let tableData = [];
            let tableHeader = [];
            if (resData.length) {
              resData.forEach((item, index) => {
                tableData.push({
                  key: item.id,
                  id: index + 1,
                  area: item.region,
                  name: item.screenName,
                  modelName: item.modelName,
                  api: item.modelUrl,
                  parames: item.modelParam,
                  datas: item.jsonData ? item.jsonData : "{}",
                  isMockData: Number(item.isReadStatic) === 0 ? true : false
                });
              });
            }
            this.tableData = tableData;
          } else {
            this.$message.error(res.data.message);
          }
          this.loading = false;
        } catch (error) {
          console.log(error);
        }
      });
    },
    // 编辑复选框
    handleCheckbox(obj) {
      let req = {
        id: obj.key,
        statusCode: obj.isMockData ? "0" : "1"
      };
      api.updateDataStatus(req).then(res => {
        try {
          if (res.data && Number(res.data.code) === 0) {
          } else {
            this.$message.error(res.data.message);

            this.tableData.forEach(item => {
              if (item.key === obj.key) {
                item.isMockData = !obj.isMockData;
              }
            });
          }
        } catch (error) {
          console.log(error);
        }
      });
    }
  },
  mounted() {
    this.getList();
    let that = this;
    this.$nextTick(() => {
      container = document.getElementById("jsoneditor");
      editor = new this.$jsoneditor(container, {
        mode: "code",
        indentation: 2,
        search: true,
        escapeUnicode: false,
        sortObjectKeys: true,
        onChange: function() {
          try {
            that.json = JSON.stringify(editor.get());
            console.log(editor.get());
          } catch (error) {
            // alert(error)
          }
        }
      });
    });
  }
};
</script>
<style lang="scss" scoped>
.data_management {
  height: 100%;
}
.add_edit {
  margin: 5px 0 15px 15px;
}
.view_edit {
  overflow: hidden;
  height: 100%;
}
/deep/.el-table .cell {
  text-align: center;
}
.custom_dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  .modal {
    width: 800px;
    height: 555px;
    position: relative;
    margin: 0 auto 50px;
    border-radius: 2px;
    -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-top: 15vh;
    background: #fff;
    padding: 20px 20px 0 20px;
    .title {
      font-size: 14px;
      text-align: center;
      height: 20px;
      letter-spacing: 1px;
    }
    .mod_body {
      position: relative;
      height: 510px;
      .dialog-footer {
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
  }
}
</style>
