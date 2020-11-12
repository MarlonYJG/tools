<!--
 * @Author: yangjianguo
 * @Date: 2019-07-30 14:04:25
 * @LastEditors: Marlon
 * @LastEditTime: 2020-04-14 16:35:47
 * @Description: 数据ETL配置-》数据源信息
 -->
<template>
  <div class="data-info">
    <div class="info-head">
      <el-button type="primary" @click="openDialog('mysql')">添加mysql库</el-button>
      <el-button type="primary" @click="openDialog('orcal')">添加orcal库</el-button>
    </div>
    <div class="info-content">
      <el-table
        style="width: 80%;"
        border
        :data="sqlDataList"
        :header-cell-class-name="tableRowClassName"
      >
        <el-table-column label="序号" type="index" width="64" align="center"></el-table-column>
        <el-table-column label="名称" width="400" prop="connectName" align="center"></el-table-column>
        <el-table-column label="数据库类型" prop="dbType" align="center"></el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <!-- <el-button type="text" size="small" @click="editInfo(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" size="small" @click="deletedInfo(scope.row)">
              <i class="el-icon-delete"></i>
            </el-button>
            <el-button type="text" size="small" @click="openBackup(scope.row)"><i class="el-icon-baocun"></i>
            </el-button> -->
            <el-button size="small" type="primary" plain @click="editInfo(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" plain @click="deletedInfo(scope.row)">删除</el-button>
            <!-- <el-button size="small" type="success" plain @click="openBackup(scope.row)">备份</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[3, 5]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          :total="7"
          style="text-align:center"
      ></el-pagination>-->
    </div>
    <!-- 添加库 弹框 -->
    <el-dialog
      :visible.sync="dialogLibrary"
      :close-on-click-modal="false"
      @close="closeDialog('dialogLibrary','sqlForm')"
      class="sqlDialog"
    >
      <el-form :model="sqlData" :rules="sqlDataRules" ref="sqlForm" label-width="100px">
        <el-form-item label="名称" prop="connectName">
          <el-input v-model="sqlData.connectName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="sqlData.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="sqlData.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="datasourceName">
          <el-input v-model="sqlData.datasourceName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="sqlData.username" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="sqlData.password" type="password" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('dialogLibrary','sqlForm')">取 消</el-button>
        <el-button type="primary" @click="addLibrary('sqlForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 弹框 -->
    <el-dialog :visible.sync="dialogEdit" :close-on-click-modal="false" class="editDialog">
      <el-form :model="editData" :rules="editDataRules" ref="editForm" label-width="100px">
        <el-form-item label="名称" prop="connectName">
          <el-input v-model="editData.connectName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="editData.ip"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="editData.port"></el-input>
        </el-form-item>
        <el-form-item label="数据库名称" prop="datasourceName">
          <el-input v-model="editData.datasourceName" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editData.username" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editData.password" type="password" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "api";
export default {
  props: {},
  data() {
    let validateIP = (rule, value, callback) => {
      let tmp = /(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))/;
      if (!tmp.test(value)) {
        callback(new Error("请输入正确的ip地址"));
      } else {
        callback();
      }
    };
    return {
      sqlDataList: [],
      // 数据库验证信息
      sqlData: {
        connectName: "",
        ip: "",
        port: "",
        datasourceName: "",
        username: "",
        password: ""
      },
      sqlDataRules: {
        connectName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        ip: [{ required: true, message: "请输入ip", trigger: "blur" }],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        datasourceName: [
          { required: true, message: "请输入数据库名", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      // 编辑数据 验证信息
      editData: {
        connectName: "",
        ip: "",
        port: "",
        datasourceName: "",
        username: "",
        password: ""
      },
      editDataRules: {
        connectName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        ip: [{ required: true, message: "请输入ip", trigger: "blur" }],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        datasourceName: [
          { required: true, message: "请输入数据库名", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      dialogLibrary: false,
      dialogEdit: false,
      fooType: ""
    };
  },
  watch: {},
  computed: {},
  created() {
    this.queryDatasource();
  },
  mounted() {},
  methods: {
    closeDialog(dialogName, formName) {
      this.$refs[formName].resetFields();
      switch (dialogName) {
        case "dialogLibrary":
          this.dialogLibrary = false;
          break;
        case "dialogEdit":
          this.dialogEdit = false;
          break;
      }
    },
    tableRowClassName() {
      return "warning-row";
    },
    // 初始化数据
    queryDatasource() {
      api.queryDatasource({}).then(res => {
        this.sqlDataList = res.data.data;
      });
    },
    openDialog(fooName) {
      // 判断点击的是哪个 库的弹窗
      this.fooType = fooName;
      this.dialogLibrary = true;
    },
    // 添加库信息
    addLibrary(formName) {
      this.$refs[formName].validate(valid => {
        let tmpObj = this.sqlData;
        if (valid) {
          // 判断 添加的信息 是 mysql还是orcal
          this.fooType === "mysql" ? (tmpObj.dbType = 0) : (tmpObj.dbType = 1);
          api
            .editDatasource({
              dbType: tmpObj.dbType,
              operFlag: "add",
              connectName: tmpObj.connectName,
              ip: tmpObj.ip,
              datasourceName: tmpObj.datasourceName,
              port: tmpObj.port,
              username: tmpObj.username,
              password: tmpObj.password
            })
            .then(res => {
              this.dialogLibrary = false;
              this.$refs[formName].resetFields();
              this.queryDatasource();
            });
        } else {
          return false;
        }
      });
    },
    // 确认编辑信息
    confirm(formName) {
      this.$refs[formName].validate(valid => {
        let tmpObj = this.editData;
        let dbType = 0;
        if (valid) {
          tmpObj.dbType = "mysql" ? (dbType = 0) : (dbType = 1);
          api
            .editDatasource({
              operFlag: "edit",
              id: tmpObj.id,
              dbType: dbType,
              connectName: tmpObj.connectName,
              ip: tmpObj.ip,
              datasourceName: tmpObj.datasourceName,
              port: tmpObj.port,
              username: tmpObj.username,
              password: tmpObj.password
            })
            .then(res => {
              this.dialogEdit = false;
              this.queryDatasource();
            });
        } else {
          return false;
        }
      });
    },
    // 打开编辑弹框
    editInfo(data) {
      this.dialogEdit = true;
      this.editData = data;
    },
    // 删除模态框
    deletedInfo(data) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.deleteHandle(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deleteHandle(data) {
      api
        .editDatasource({
          operFlag: "del",
          id: data.id
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.queryDatasource();
        })
        .catch(res => {
          this.$message.error("删除失败");
        });
    },
    //备份信息弹窗
  openBackup(data) {
        this.$confirm('正在对数据进行备份, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '正在备份，稍后请到服务器下载。。。',
            duration: 1500
            
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消备份',
            duration: 1500
          });          
        });
      },
  },
  
};
</script>
<style lang="scss" scoped>
// element-ui 样式
.data-info {
  /deep/ .el-dialog {
    width: 650px;
  }
  /deep/ .el-form {
    margin-left: 100px;
  }
  /deep/ .el-input {
    width: 300px;
  }
}
.data-info {
  margin: 55px 0 0 105px;
  .info-head {
    margin: 10px 0 20px 0;
  }
  .sqlDialog,
  .editDialog {
    .dialog-footer {
      margin-right: 109px;
    }
  }
}
</style>