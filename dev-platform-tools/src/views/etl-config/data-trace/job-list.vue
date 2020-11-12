<template>
  <div class="data-info">

    <!--作业列表 开始 -->
    <div class="info-head">
      <el-input v-model="input" placeholder="作业库名称"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="listJobPage(10, 1)">搜索</el-button>
    </div>
    <div class="info-content">
      <el-table style="width: 100%;" border :data="etlDataList" :header-cell-class-name="tableRowClassName">
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center"></el-table-column>
        <el-table-column label="作业主键id" prop="jobRepositoryInfoId" align="center"></el-table-column>
        <el-table-column label="作业库名称" prop="jobName" align="center"></el-table-column>
        <el-table-column label="作业执行开始时间" prop="executionStartTime" align="center" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="是否增量" prop="incrFlag" align="center" :formatter="formatIncrFlag">
        </el-table-column>
        <el-table-column label="表截断标识" prop="truncateFlag" align="center" :formatter="formatTruncateFlag">
        </el-table-column>
        <el-table-column label="更新类型标识" prop="updateFlag" align="center" :formatter="formatUpdateFlag">
        </el-table-column>
        <el-table-column label="作业类型" prop="jobType" align="center" :formatter="formatJobType">
        </el-table-column>
        <el-table-column label="cron表达式" prop="corn" align="center"></el-table-column>
        <el-table-column label="执行类型" prop="taskType" align="center" :formatter="formatTaskType">
        </el-table-column>
        <el-table-column label="是否完成" prop="completeFlag" align="center" :formatter="formatCompleteFlag">
          </el-table-column>
        <el-table-column label="任务调度表主键" prop="taskSchedulerId" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" :formatter="dateFormat">
        </el-table-column>
        <el-table-column align="center" label="操作" width="360px">
          <template slot-scope="scope">
            <el-button type="primary" plain size="small" @click="openDataSourceDialog(scope.row)">数据源信息</el-button>
            <el-button type="success" plain size="small" @click="openTableTransferInfo(scope.row)">表转换信息</el-button>
            <el-button type="info" plain size="small" @click="openExceptionOverall(scope.row)">异常数据总览</el-button>
            <el-button type="warning" plain size="small" @click="openIllegalDataReport(scope.row)">违规数据报表</el-button>
            <el-button type="primary" plain size="small" @click="downIllegalDataReport(scope.row)">报表下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="pageSize" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>
    <!--作业列表 结束 -->

    <!--数据源信息 开始 -->
    <el-dialog title="数据源信息" :visible.sync="dataSourceDialog" :close-on-click-modal="false">
      <el-table :data="dataSourceData" border :header-cell-class-name="tableRowClassName">
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="数据源类型" prop="sourceType" align="center" :formatter="formatDataSource">
        </el-table-column>
        <el-table-column label="数据库名称" prop="datasourceName" align="center">
        </el-table-column>
        <el-table-column label="数据库类型" prop="type" align="center" :formatter="formatDatabase">
        </el-table-column>
        <el-table-column label="数据库连接名称" prop="connectName" align="center">
        </el-table-column>
        <el-table-column label="数据库服务地址" prop="ip" align="center">
        </el-table-column>
        <el-table-column label="端口号" prop="port" align="center">
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--数据源信息 结束 -->

  </div>
</template>

<script>
  import api from "api";
  import moment from 'moment';
  export default {
    components: {},
    props: {},
    data() {
      return {
        total: 0,
        etlDataList: [],
        currentPage: 1,
        pageSize: 10,
        input: '',
        dataSourceDialog: false,
        jobId: '',
        dataSourceData: [],


      };
    },
    watch: {},
    computed: {},
    created() {
      this.listJobPage(this.pageSize, this.currentPage);
    },
    methods: {
      tableRowClassName() {
        return "warning-row";
      },
      // 初始化数据
      listJobPage(size, current) {
        api
          .listJobPage({
            pageSize: size,
            pageNum: current,
            search: this.input
          })
          .then(res => {
            this.etlDataList = res.data.data.list;
            this.total = res.data.data.totalCount;
          });
      },
      dateFormat(row, column, cellValue, index) {
        if (cellValue == undefined) {
          return ''
        };
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
      },
      formatIncrFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "否";
        } else if ("1" == cellValue) {
          return "是";
        }
      },
      formatTruncateFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "不删除";
        } else if ("1" == cellValue) {
          return "删除";
        }
      },
      formatUpdateFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "不删除";
        } else if ("1" == cellValue) {
          return "逻辑删除";
        } else if ("2" == cellValue) {
          return "物理删除";
        }
      },
      formatJobType(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "规则";
        } else if ("1" == cellValue) {
          return "串联";
        } else if ("2" == cellValue) {
          return "kettle";
        }
      },
      formatTaskType(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "间隔";
        } else if ("1" == cellValue) {
          return "每天";
        } else if ("2" == cellValue) {
          return "每周";
        } else if ("3" == cellValue) {
          return "每月";
        } else if ("4" == cellValue) {
          return "cron";
        }
      },
      formatCompleteFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "否";
        } else if ("1" == cellValue) {
          return "是";
        }
      },
      formatDataSource(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "源库";
        } else if ("1" == cellValue) {
          return "目标库";
        }
      },
      formatDatabase(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "mysql";
        } else if ("1" == cellValue) {
          return "oracle";
        }
      },
      // 数据源信息查询
      openDataSourceDialog(data) {
        this.dataSourceDialog = true;
        api
          .listJobDataSource({
            jobId: data.id,
          })
          .then(res => {
            this.dataSourceData = res.data.data;
          });

      },
      // 表转换信息列表
      openTableTransferInfo(data) {
        this.$router.push({
          path: "/menuNav1/tableTransfer",
          query: {
            'jobId': data.id,
          }
        });

      },
      // 不合规数据和异常数据总览
      openExceptionOverall(data) {
        this.$router.push({
          path: "/menuNav1/exceptionDataOverall",
          query: {
            'jobId': data.id,
          }
        });
      },
            //违规数据标表
      openIllegalDataReport(data) {
        this.$router.push({
          path: "/menuNav1/IllegalDataReport",
          query: {
            'jobId': data.id,
          }
        });
      },
      //按照规则统计不合规数据导出excel
      downIllegalDataReport(data){
        api.downIllegalDataReport(data.id);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pageSize = val;
        this.listJobPage(val, 1);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage = val;
        this.listJobPage(this.pageSize, val);
      },
      handleSizeChange_tableTransfer(val) {
        console.log(`每页 ${val} 条`);
        this.tableTransfer.pageSize = val;
        api
          .listTableTransferInfoPage({
            pageSize: this.tableTransfer.size,
            pageNum: this.tableTransfer.currentPage,
            jobId: this.tableTransfer.rowId,
          })
          .then(res => {
            this.tableTransferData = res.data.data.list;
            this.tableTransfer.total = res.data.data.totalCount;
          });
      },
      handleCurrentChange_tableTransfer(val) {
        console.log(`当前页: ${val}`);
        this.tableTransfer.currentPage = val;
        api
          .listTableTransferInfoPage({
            pageSize: this.tableTransfer.size,
            pageNum: this.tableTransfer.currentPage,
            jobId: data.id,
          })
          .then(res => {
            this.tableTransferData = res.data.data.list;
            this.tableTransfer.total = res.data.data.totalCount;
          });
      }
    }
  };

</script>
<style lang="scss" scoped>
  /* element-ui 样式 */
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
