<!--
 * @Author: yangjianguo
 * @Date: 2019-07-24 18:47:23
 * @LastEditors: yangjianguo
 * @LastEditTime: 2019-10-25 14:09:44
 * @Description: 定时任务
 -->
<template>
  <div class="data-info">
    <div class="info-head">
      <el-button type="primary" plain @click="openDialog">添加ETL任务</el-button>
    </div>
    <div class="info-content">
      <el-table style="width: 100%;" border :data="etlDataList">
        <el-table-column label="序号" prop="seq" type="index" width="64" align="center"></el-table-column>
        <el-table-column label="作业类型" prop="systemTypeName" align="center"></el-table-column>
        <el-table-column label="任务名称" prop="taskSchedulerName" align="center"></el-table-column>
        <el-table-column label="自动任务周期类型" width="150" prop="taskTypeName" align="center"></el-table-column>
        <el-table-column label="执行计划" prop="period" align="center"></el-table-column>
        <el-table-column label="状态" prop="statusName" align="center"></el-table-column>
        <el-table-column label="描述" prop="description" width="150" align="center"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.status===1"
              @click="startAndStopInfo(scope.row, '启动')"
            >启动</el-button>
            <el-button
              type="text"
              size="small"
              :disabled="scope.row.status===2"
              @click="startAndStopInfo(scope.row)"
            >停止</el-button>
            <el-button type="text" size="small" @click="deletedInfo(scope.row, '删除')">删除</el-button>
            <el-button type="text" size="small" @click="immediateInfo(scope.row)">立即执行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        :page-sizes="[10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 添加ETL任务 弹框 -->
    <el-dialog :visible.sync="dialogLibrary" class="etlDialog" title="添加ETL任务">
      <el-form :model="taskData" :rules="etlDataRules" ref="etlForm" label-width="100px">
        <el-form-item label="任务名称：" prop="name">
          <el-select v-model="taskData.name" placeholder="--选择任务--">
            <el-option
              v-for="(item,index) in taskName"
              :key="index"
              :label="item.jobName"
              :value="item.jobName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行周期：" prop="cycle" class="right-move">
          <el-select v-model="taskData.cycle" placeholder="--选择周期--">
            <el-option v-for="(item,index) in lifeCycle" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="ifCorn" label="cron表达式：" prop="cronExpression" class="right-move">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="taskData.cronExpression"></el-input>
        </el-form-item>
        <div class="smallSelBox" v-else>
          <span class="name">执行计划：</span>
          <el-form-item v-show="ifDateShow" label="日期：" prop="cycle" class="right-move">
            <el-select v-model="taskData.date">
              <el-option v-for="(item,index) in playDates" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="ifWeekShow" label="星期：" prop="week" class="right-move">
            <el-select v-model="taskData.week">
              <el-option v-for="(item,index) in playWeeks" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="小时：" prop="hour" class="right-move">
            <el-select v-model="taskData.hour">
              <el-option v-for="(item,index) in playHours" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分钟：" prop="minute" class="right-move">
            <el-select v-model="taskData.minute">
              <el-option
                v-for="(item,index) in playMinutes"
                :key="index"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="描述：" prop="describe" class="right-move">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="describeContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addLibrary">确 定</el-button>
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
      ifCorn: false,
      total: 0,
      etlDataList: [],
      currentPage: 1,
      // 任务名称
      taskName: [],
      // 执行周期
      lifeCycle: ["每天", "每周", "每月", "cron表达式"],
      // 执行计划-日期
      playDates: [],
      // 执行计划-星期
      playWeeks: [],
      // 执行计划-小时
      playHours: [],
      // 执行计划-分钟
      playMinutes: [],
      describeContent: "",
      taskData: {
        name: "",
        cycle: "",
        date: "",
        week: "",
        hour: "",
        minute: "",
        describe: "",
        cronExpression: ""
      },
      ifDateShow: true,
      ifWeekShow: true,
      etlDataRules: {
        name: [
          { required: true, message: "请选择任务名称", trigger: "change" }
        ],
        cycle: [
          { required: true, message: "请选择执行周期", trigger: "change" }
        ],
        week: [{ required: true, message: "请选择星期", trigger: "change" }],
        date: [{ required: true, message: "请选择日期", trigger: "change" }],
        hour: [{ required: true, message: "请选择小时", trigger: "change" }],
        minute: [{ required: true, message: "请选择分钟", trigger: "change" }],
        cronExpression: [{ required: true, message: "请输入cron表达式", trigger: "change" }]
      },
      dialogLibrary: false,
    };
  },
  watch: {
    "taskData.cycle": function() {
      let _cycle = this.taskData.cycle;
      switch (_cycle) {
        case "每天":
          this.ifWeekShow = false;
          this.ifDateShow = false;
          this.ifCorn = false;
          this.etlDataRules.week = [
            { required: false, message: "请选择星期", trigger: "change" }
          ];
          this.etlDataRules.date = [
            { required: false, message: "请选择日期", trigger: "change" }
          ];
          break;
        case "每周":
          this.ifWeekShow = true;
          this.ifDateShow = false;
          this.ifCorn = false;
          this.etlDataRules.week = [
            { required: true, message: "请选择星期", trigger: "change" }
          ];
          this.etlDataRules.date = [
            { required: false, message: "请选择日期", trigger: "change" }
          ];
          break;
        case "每月":
          this.ifWeekShow = false;
          this.ifDateShow = true;
          this.ifCorn = false;
          this.etlDataRules.date = [
            { required: true, message: "请选择日期", trigger: "change" }
          ];
          this.etlDataRules.week = [
            { required: false, message: "请选择星期", trigger: "change" }
          ];
          break;
        case "cron表达式":
          this.etlDataRules.week = [
            { required: true, message: "请选择星期", trigger: "change" }
          ];
          this.etlDataRules.date = [
            { required: true, message: "请选择日期", trigger: "change" }
          ];
          this.etlDataRules.hour = [
            { required: true, message: "请选择小时", trigger: "change" }
          ];
          this.etlDataRules.minute = [
            { required: true, message: "请选择分钟", trigger: "change" }
          ];
          this.ifCorn = true;
          break;
      }
    }
  },
  computed: {},
  created() {
    this.queryDatasource(10, 1);
    // 初始化弹窗日期
    for (let i = 1; i < 29; i++) {
      this.playDates.push(i);
    }
    // 初始化星期
    for (let i = 1; i < 8; i++) {
      this.playWeeks.push(i);
    }
    // 初始化小时
    for (let i = 0; i < 24; i++) {
      this.playHours.push(i);
    }
    // 初始化分钟
    for (let i = 0; i < 60; i += 5) {
      this.playMinutes.push(i);
    }
  },
  methods: {
    closeDialog() {
      this.$refs["etlForm"].resetFields();
      this.dialogLibrary = false;
    },
    // 初始化数据
    queryDatasource(size, current) {
      api
        .getJobScheduleManagement({
          size: size,
          current: current
        })
        .then(res => {
          this.etlDataList = res.data.data.records;
          this.total = res.data.data.total;
        }).catch();
    },
    openDialog() {
      this.dialogLibrary = true;
      this.getTaskName();
    },
    // 获取任务名称
    getTaskName() {
      api.getTaskName({}).then(res => {
        let data = res.data.data;
        data.forEach(item => {
          let obj = {};
          obj.jobName = item.jobName;
          obj.id = item.id;
          this.taskName.push(obj);
        });
      });
    },
    getTaskType(val) {
      switch (val) {
        case "每天":
          return 1;
          break;
        case "每周":
          return 2;
          break;
        case "每月":
          return 3;
          break;
        case "cron表达式":
          return 4;
          break;
      }
    },
    // 添加ETL任务
    addLibrary(formName) {
      this.$refs["etlForm"].validate(valid => {
        let tmpObj = this.sqlData;
        if (valid) {
          // 获取taskId 任务唯一标识码
          let taskId;
          this.taskName.forEach(item => {
            let _taskName = this.taskData.name;
            if (item.jobName == _taskName) {
              taskId = item.id;
              return;
            }
          });
          // 获取taskType 1每天执行 2每周执行 3每月执行 4corn表达式运行
          let _taskType = this.taskData.cycle;
          let taskType = this.getTaskType(_taskType);
          let _weekday = this.taskData.week ? this.taskData.week : null;
          let _data = this.taskData.date ? this.taskData.date : null;

          // 获取corn
          let _corn = taskType === 4 ? this.taskData.expression : null;
          let _description = this.describeContent;
          api
            .getAddTaskSchedule({
              systemType: 0,
              description: _description,
              taskId: taskId,
              taskType: taskType,
              corn: _corn,
              hour: this.taskData.hour,
              minute: this.taskData.minute,
              weekday: _weekday,
              dayOfMonth: _data
            })
            .then(res => {
              this.dialogLibrary = false;
              this.$refs["etlForm"].resetFields();
              this.queryDatasource(10, 1);
              this.describeContent = "";
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          return false;
        }
      });
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
      let jobId = data.id;
      // taskId
      api
        .getDeleteTack({
          jobId: jobId
        })
        .then(res => {
          this.$message({
            message: "删除成功",
            type: "success"
          });
          let _currentPage = this.currentPage;
          this.queryDatasource(10, _currentPage);
        })
        .catch(res => {
          this.$message.error("删除失败");
        });
    },
    // 启动和停止
    startAndStopInfo(data, type) {
      let _jobId = data.id;
      api
        .getTaskStatus({
          jobId: _jobId
        })
        .then(res => {
          let obj = res.data;
          if (obj.code === 0) {
            let _type = obj.data;
            switch (_type) {
              case "启动中":
                data.status = 1;
                break;
              case "停止":
                data.status = 2;
                break;
            }
            data.statusName = obj.data;
          }
        });
    },
    // 立即执行
    immediateInfo(data) {
      let _jobId = data.id;

      this.$confirm("是否立即执行该任务", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .getTaskImmediateDo({
              jobId: _jobId
            })
            .then(res => {
              let _data = res.data;
              if (_data.code === 0) {
                this.$message({
                  message: "任务已立即执行！",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "任务未能立即执行！",
                  type: "warning"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消立即执行操作！"
          });
        });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryDatasource(10, val);
    }
  }
};
</script>
<style lang="scss" scoped>
// element-ui 样式
.data-info {
  /deep/ .el-dialog {
    width: 1000px;
  }

  /deep/ .el-form {
    margin-left: 100px;
  }

  /deep/ .el-input {
    width: 300px;
  }
}

.data-info {
  // margin: 55px 0 0 105px;
  margin: 55px 0 0 102px;

  .info-head {
    margin: 10px 0 20px 0;
  }

  .etlDialog {
    .smallSelBox {
      padding-left: 100px;
      box-sizing: border-box;
      position: relative;
      overflow: hidden;

      .name {
        position: absolute;
        top: 0;
        left: 0;
        text-align: right;
        font-size: 14px;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        display: inline-block;
        width: 100px;
      }

      /deep/ .el-form-item {
        width: 180px;
        float: left;
      }

      /deep/ .el-form-item__label {
        width: 65px !important;
      }

      /deep/ .el-form-item__content {
        margin-left: 65px !important;
      }

      /deep/ .el-input {
        width: 100px;
      }
    }

    /deep/ .el-textarea {
      width: 300px;
    }
  }
}

.pagination {
  width: 100%;
  width: 500px;
  margin: 20px auto;

  /deep/ .el-input {
    width: 100px;
  }
}
</style>