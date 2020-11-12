<!--
 * @Author: yangjianguo
 * @Date: 2019-08-09 14:34:14
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-13 10:00:03
 * @Description: 作业列表
 -->
<template>
  <div class="task-list">
    <div class="info-head">
      <el-button type="primary" @click="taskDialog=true">添加转换作业</el-button>
      <!-- <el-button type="primary" @click="connectionDialog=true">添加串联作业</el-button> -->
      <el-button type="primary" @click="exportEompare">导出对比</el-button>
    </div>
    <div class="info-content">
      <el-table
        style="width: 80%;"
        border
        ref="multipleTable"
        :data="jobList"
        @selection-change="handleSelectionChange"
        :header-cell-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="名称" prop="jobName" align="center"></el-table-column>
        <el-table-column label="类型" prop="jobTypeName" align="center"></el-table-column>
        <el-table-column label="备注" prop="remark" align="center"></el-table-column>
        <el-table-column align="center" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="editInfo(scope.row)" type="text" size="small">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="text" size="small">
              <i class="el-icon-delete" @click="deletedInfo(scope.row)"></i>
            </el-button>
            <el-button type="text" size="small" v-if="scope.row.jobType === 0">
              <i class="el-icon-setting" @click="goPath(scope.row)"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" label="导入/导出" width="185px">
          <template slot-scope="scope">
            <div class="drdc">
              <el-tooltip content="只能上传Excel文件，且不超过500kb" placement="top">
                <el-upload
                  class="upload-demo"
                  :action="uploadUrl"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :on-success="success"
                  :data="jobData"
                  :file-list="scope.row.obj"
                  multiple
                  :on-exceed="handleExceed"
                >
                  <el-button size="small" type="success" plain @click="uploadFn(scope.row)">导入</el-button>
                </el-upload>
              </el-tooltip>
            </div>
            <div class="drdc">
              <el-button size="small" type="primary" plain @click="exportExcelFn(scope.row)">导出</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加转换作业 弹框 -->
    <el-dialog
      :visible.sync="taskDialog"
      :close-on-click-modal="false"
      @close="closeDialog('taskDialog','addInfo')"
      class="addDialog"
    >
      <el-form :model="taskData" :rules="taskDataRules" ref="addInfo">
        <el-form-item label="名称" label-width="92px" prop="name">
          <el-input v-model="taskData.name"></el-input>
        </el-form-item>
        <el-form-item label="源数据信息" prop="sourceInfo" class="right-move">
          <el-select v-model="taskData.sourceInfo" placeholder="请选择">
            <el-option
              v-for="item in tmpArr"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标数据源" prop="targetInfo" class="right-move">
          <el-select v-model="taskData.targetInfo" placeholder="请选择">
            <el-option
              v-for="(item,index) in tmpArr"
              :key="index"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('taskDialog','addInfo')">取 消</el-button>
        <el-button type="primary" @click="addMysql('addInfo')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 添加串联作业 弹框 -->
    <el-dialog
      :visible.sync="connectionDialog"
      :close-on-click-modal="false"
      @close="closeDialog('connectionDialog','addConnection')"
      label-width="600px"
      width="800px"
      class="addDialog"
    >
      <el-form :model="connectionData" :rules="connectionRules" ref="addConnection">
        <el-form-item label="名称" label-width="78px" prop="name">
          <el-input v-model="connectionData.name"></el-input>
        </el-form-item>
        <el-form-item label="数据信息" prop="sourceInfo" class="right-move">
          <el-select v-model="connectionData.sourceInfo" placeholder="请选择">
            <el-option
              v-for="item in tmpArr"
              :key="item.id"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="own-check">
            <el-checkbox-group v-model="addType">
              <el-checkbox :label="addChecked.type">{{addChecked.name}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox-group v-model="delType">
              <el-checkbox :label="delChecked.type">{{delChecked.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item>
          <el-select v-model="contactModel" placeholder="请选择" style="margin-left:78px">
            <el-option
              v-for="item in contactData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog('connectionDialog','addConnection')">取 消</el-button>
        <el-button type="primary" @click="addConnection('addConnection')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 弹框 -->
    <el-dialog :visible.sync="dialogEdit" :close-on-click-modal="false" label-width="600px">
      <el-form :model="editData" :rules="editDataRules" ref="editInfo">
        <el-form-item label="名称" label-width="92px" prop="name">
          <el-input v-model="editData.name"></el-input>
        </el-form-item>
        <el-form-item label="源数据信息" prop="sourceInfo" class="right-move">
          <el-select v-model="editData.sourceInfo" placeholder="请选择">
            <el-option
              v-for="(item,index) in tmpArr"
              :key="index"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标数据源" prop="targetInfo" class="right-move">
          <el-select v-model="editData.targetInfo" placeholder="请选择">
            <el-option
              v-for="(item,index) in tmpArr"
              :key="index"
              :label="item.datasourceName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('editInfo')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "api";
export default {
  components: {},
  props: {},
  data() {
    return {
      jobData: {
        jobId: ""
      },
      uploadUrl: "",
      currId: "",
      jobList: [],
      tmpArr: [],
      addChecked: { name: "增量导入", type: 1 },
      delChecked: { name: "裁剪", type: 1 },
      addType: [],
      delType: [],
      contactModel: 1,
      contactData: [
        {
          value: 1,
          label: "建设工程串联"
        },
        {
          value: 2,
          label: "政府采购串联"
        },
        {
          value: 3,
          label: "土地串联"
        },
        {
          value: 4,
          label: "产权交易串联"
        }
      ],
      taskData: {
        name: "",
        sourceInfo: "",
        targetInfo: ""
      },
      taskDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sourceInfo: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        targetInfo: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ]
      },
      connectionData: {
        name: "",
        sourceInfo: "",
        targetInfo: ""
      },
      connectionRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sourceInfo: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ]
      },
      editData: {
        name: "",
        sourceInfo: "",
        targetInfo: ""
      },
      editDataRules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        sourceInfo: [
          { required: true, message: "请选择源数据信息", trigger: "change" }
        ],
        targetInfo: [
          { required: true, message: "请选择目标数据源", trigger: "change" }
        ]
      },
      taskDialog: false,
      dialogEdit: false,
      connectionDialog: false,
      formLabelWidth: "120px",
      // 要导出的数据
      exportExcelArr: [],
      files: [{ name: "food.jpg", url: "https://xxx.cdn.com/xxx.jpg" }]
    };
  },
  watch: {},
  computed: {},
  created() {
    this.getJobRepo();
    let getParams = "";
    console.log(window.location.port);
    console.log();
    // let baseUrl = window.location.host
    let baseUrl = process.env.RES_URL ? process.env.RES_URL : "";
    this.uploadUrl = baseUrl + "/check/uploadFile";
  },
  mounted() {},
  methods: {
    uploadFn(row) {
      console.log(row);
      this.jobData.jobId = row.id;
    },
    tableRowClassName() {
      return "warning-row";
    },
    closeDialog(dialogName, formName) {
      this.$refs[formName].resetFields();
      switch (dialogName) {
        case "taskDialog":
          this.taskDialog = false;
          break;
        case "dialogEdit":
          this.dialogEdit = false;
          break;
      }
    },
    // 初始化 数据
    getJobRepo() {
      this.tmpArr = [];
      api.getJobRepo({}).then(res => {
        let resData = res.data.data;
        for (let item of resData) {
          item.obj =
            item.configName === null || item.configName === ""
              ? []
              : [{ name: item.configName, id: item.id, url: "" }];
        }
        console.log(resData);
        this.jobList = resData;
      });
      api.queryDatasource({}).then(res => {
        let resData = res.data.data;
        for (let i = 0; i < resData.length; i++) {
          let tmpObj = {};
          tmpObj.id = resData[i].id;
          tmpObj.datasourceName = resData[i].datasourceName;
          this.tmpArr.push(tmpObj);
        }
      });
    },
    addMysql(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let sourceInfo = this.taskData.sourceInfo;
          let targetInfo = this.taskData.targetInfo;
          let name = this.taskData.name;
          api
            .editJobRepo({
              operFlag: "add",
              jobName: name,
              sourceId: sourceInfo,
              targetId: targetInfo,
              jobType: 0
            })
            .then(res => {
              this.$refs[formName].resetFields();
              this.getJobRepo();
              this.taskDialog = false;
            });
        } else {
          return false;
        }
      });
    },
    // 添加串联
    addConnection(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let sourceInfo = this.connectionData.sourceInfo;
          let name = this.connectionData.name;
          let addType = this.addType[0];
          let delType = this.delType[0];
          api
            .editJobRepo({
              operFlag: "add",
              jobName: name,
              sourceId: sourceInfo,
              jobType: 1,
              incrFlag: addType,
              truncateFlag: delType,
              seriesFlag: +this.contactModel
            })
            .then(res => {
              this.$refs[formName].resetFields();
              this.getJobRepo();
              this.connectionDialog = false;
            });
        } else {
          return false;
        }
      });
    },
    openDialog(fooName) {
      this.fooType = fooName;
      this.dialogLibrary = true;
    },
    confirmEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let sourceInfo = this.editData.sourceInfo;
          let targetInfo = this.editData.targetInfo;
          let name = this.editData.name;
          api
            .editJobRepo({
              id: this.currId,
              operFlag: "edit",
              jobName: name,
              sourceId: sourceInfo,
              targetId: targetInfo,
              jobType: 0
            })
            .then(res => {
              this.dialogEdit = false;
              this.getJobRepo();
            });
        } else {
          return false;
        }
      });
    },
    // 编辑信息
    editInfo(data) {
      this.currId = data.id;
      // 初始化数据
      this.editData.name = data.jobName;
      this.editData.sourceInfo = data.sourceId;
      this.editData.targetInfo = data.targetId;
      this.dialogEdit = true;
    },
    // 删除信息
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
        .editJobRepo({
          operFlag: "del",
          id: data.id
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getJobRepo();
        })
        .catch(err => {
          this.$message.error("删除失败");
        });
    },
    // 跳转
    goPath(data) {
      // 页面跳转时 菜单高亮跟随变动
      let currIndex = getCurrMenuId("ruleConfig");
      this.$router.push({
        path: "/menuNav1/ruleConfig",
        query: {
          keyID: data.id,
          currIndex: currIndex,
          jobName: data.jobName
        }
      });
    },
    // 控制选择的个数
    handleSelectionChange(valArr) {
      if (valArr.length >= 2) {
        if (valArr.length > 2) {
          this.jobList.forEach((item, index) => {
            if (item.id === valArr[0].id) {
              this.$refs.multipleTable.toggleRowSelection(item);
            }
          });
        }
        // 获取数组中的最后两位元素
        this.exportExcelArr = valArr.slice(-2);
      } else {
        this.exportExcelArr = [];
      }
    },
    // 导出对比配置
    exportEompare() {
      if (this.exportExcelArr.length) {
        // let baseUrl = window.location.host
        let baseUrl = process.env.RES_URL ? process.env.RES_URL : "";
        exportExcel(
          {
            firstProjectUrl: baseUrl,
            firstJobId: this.exportExcelArr[0].id,
            secondProjectUrl: baseUrl,
            secondJobId: this.exportExcelArr[1].id
          },
          "check/checkJobConfig"
        );
      } else {
        this.$message({
          type: "error",
          message: "比较数据有且只能有两条!"
        });
      }
    },
    // 导入功能 TODO
    handleRemove(file, fileList) {
      console.log(file, fileList);
      let params = {
        fileName: file.name,
        id: file.id
      };
      this.removeUpload(params);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    success(response, file, fileList) {
      this.getJobRepo();
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //请求删除上传文件
    removeUpload(params) {
      api
        .removeUpload(params)
        .then(res => {
          console.log(res);
          this.getJobRepo();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(err => err);
    },
    // 导出 TODO
    exportExcelFn(row) {
      console.log(row);
      // let baseUrl = window.location.host
      let baseUrl = process.env.RES_URL ? process.env.RES_URL : "";
      const elink = document.createElement("a");
      elink.href = baseUrl + "/check/exportJobConfig" + "?" + "jobId=" + row.id;
      elink.click();
    }
  }
};
</script>
<style lang="scss" scoped>
.task-list {
  /deep/ .el-form {
    margin-left: 100px;
  }
  /deep/ .el-input {
    width: 300px;
  }
  /deep/ .right-move {
    .el-form-item__error {
      left: 92px;
    }
  }
}
.task-list {
  margin: 55px 0 0 105px;
  .info-head {
    margin: 10px 0 20px 0;
  }
  .own-check {
    display: inline-flex;
    > div {
      margin-left: 80px;
    }
  }
}
// 导入、导出
.drdc {
  float: left;
  width: 80px;
  /* min-height: 68px; */
}
</style>