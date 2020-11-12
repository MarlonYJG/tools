<template>
  <div class="data-info">

    <div class="info-head">
      <el-form :inline="true">
        <el-form-item label="进行标识：">
          <el-select v-model="selectVal" placeholder="请选择" @change="selectFun">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成功标识：">
        <el-select v-model="successVal" placeholder="请选择" @change="selectFun">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="info-content">
      <el-table style="width: 100%;" border :data="etlDataList" :header-cell-class-name="tableRowClassName">
        <el-table-column label="序号" width="50" prop="seq" type="index" align="center">
        </el-table-column>
        <el-table-column label="表名称" prop="jobRepositoryTargetTableName" align="left" width="250px">
        </el-table-column>
        <el-table-column label="总条数" prop="totalNum" align="center">
        </el-table-column>
        <el-table-column label="符合条数" prop="normalNum" align="center">
        </el-table-column>
        <el-table-column label="不符条数" prop="illegalNum" align="center">
          <template slot-scope="scope">
            <p @click="getDetail(scope.row, '2')" class="colorBlue">{{scope.row.illegalNum}}</p>
          </template>
        </el-table-column>
        <el-table-column label="异常条数" prop="systemExceptionNum" align="center">
          <template slot-scope="scope">
            <p @click="getDetail(scope.row, '0')" class="colorBlue">{{scope.row.systemExceptionNum}}</p>
          </template>
        </el-table-column>
        <el-table-column label="进行标识" prop="completeFlag" align="center" :formatter="formatCompleteFlag">
        </el-table-column>
        <el-table-column label="成功标识" prop="resultFlag" align="center" :formatter="formatResultFlag">
        </el-table-column>
        <el-table-column label="异常信息" prop="exceptionInfo" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="异常批号" prop="saveExceptionNo" align="center">
        </el-table-column>
        <el-table-column label="源sql" prop="sourceSql" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="源分页sql" prop="sourcePageSql" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="总批数" prop="totalBatchNum" align="center">
        </el-table-column>
        <el-table-column label="异常总数" prop="transExceptionNum" align="center">
        </el-table-column>
        <el-table-column label="异常批次" prop="exceptionBatchNo" align="center">
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="pageSize" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="dialogStatus" :close-on-click-modal="false">
      <el-table :data="dialogData" border :header-cell-class-name="tableRowClassName" v>
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column label="表名或sql" prop="content" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="关联id" prop="relationId" align="center">
        </el-table-column>
        <el-table-column label="数据行" prop="dataLine" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="清洗规则" prop="clearFlag" align="center">
        </el-table-column>
        <el-table-column label="异常信息" prop="exceptionInfo" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="数据级别" prop="dataLevel" align="center">
        </el-table-column>
        <el-table-column label="数据时间戳" prop="dataTimestamp" align="center" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="记录表id" prop="reportId" align="center">
        </el-table-column>
        <el-table-column label="增量时间戳表id" prop="incrId" align="center">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" :formatter="dateFormat">
        </el-table-column>
        <el-table-column label="转换id" prop="tranId" align="center">
        </el-table-column>
        <el-table-column label="是否处理" prop="dealFlag" align="center" :formatter="formatDealFlag">
        </el-table-column>
        <el-table-column label="目标表名称" prop="targetName" align="center">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @size-change="dialogHandleSizeChange" @current-change="dialogHandleCurrentChange"
          :current-page="dialogCurrentPage" :page-size="dialogPageSize" :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper" :total="dialogTotal"></el-pagination>
      </div>

    </el-dialog>

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
        exceptionDataDialog: false,
        jobId: '',
        tableTransferData: [],
        selectVal: '',
        successVal: '',
        options: [{
          value: '0',
          label: '进行中'
        }, {
          value: '1',
          label: '已完成'
        }, {
          value: '',
          label: '全部'
        }],
        options2: [{
          value: '0',
          label: '成功'
        }, {
          value: '1',
          label: '失败'
        }, {
          value: '',
          label: '全部'
        }],
        dialogStatus: false,
        dialogTitle: '',
        dialogData: [],
        dialogTotal: 0,
        dialogCurrentPage: 1,
        dialogPageSize: 10,
        dialogType: 0 ,
        dialogRow : {},

      };
    },
    watch: {},
    computed: {},
    created() {
      this.listTableTransferInfoPage(this.pageSize, this.currentPage);
    },
    methods: {
      tableRowClassName() {
        return "warning-row";
      },
      dateFormat(row, column, cellValue, index) {
        if (cellValue == undefined) {
          return ''
        };
        return moment(cellValue).format("YYYY-MM-DD HH:mm:ss")
      },
      formatDealFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "未处理";
        } else if ("1" == cellValue) {
          return "已处理";
        }
      },
      formatCompleteFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "进行中";
        } else if ("1" == cellValue) {
          return "已完成";
        }
      },
      formatResultFlag(row, column, cellValue, index) {
        if ("0" == cellValue) {
          return "成功";
        } else if ("1" == cellValue) {
          return "失败";
        }
      },
      // 初始化数据
      listTableTransferInfoPage(size, current) {
        let jobId = this.$route.query.jobId;
        api
          .listTableTransferInfoPage({
            pageSize: size,
            pageNum: current,
            jobId: jobId,
            completeFlag: this.selectVal,
            resultFlag: this.successVal
          })
          .then(res => {
            this.etlDataList = res.data.data.list;
            this.total = res.data.data.totalCount;
          });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.listTableTransferInfoPage(val, 1);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.listTableTransferInfoPage(this.pageSize, val);
      },
      selectFun() {
        this.listTableTransferInfoPage(10, 1);
      },
      getDetail(row, index) {
        this.dialogStatus = true;
        let type;
        switch (index) {
          case '0':
            this.dialogTitle = '系统异常数据';
            type = '0';
            break;
          case '1':
            this.dialogTitle = '唯一标识清空数据';
            type = '1';
            break;
          case '2':
            this.dialogTitle = '不合规数据';
            type = '2';
            break;
        }
        this.dialogType=type;
        this.dialogRow=row;
        api
          .listTransferExceptionPage({
            pageSize: 10,
            pageNum: 1,
            recordId: row.id,
            jobId: row.jobExecutionListId,
            type: type
          })
          .then(res => {
            this.dialogData = res.data.data.list;
            this.dialogTotal = res.data.data.totalCount;
          });

      },
      listTransferExceptionPage(size,current){
        api
          .listTransferExceptionPage({
            pageSize: size,
            pageNum: current,
            recordId: this.dialogRow.id,
            jobId: this.dialogRow.jobExecutionListId,
            type: this.dialogType
          })
          .then(res => {
            this.dialogData = res.data.data.list;
            this.dialogTotal = res.data.data.totalCount;
          });

      },
      dialogHandleSizeChange(val) {
        this.dialogPageSize = val;
        this.listTransferExceptionPage(val, 1);
      },
      dialogHandleCurrentChange(val) {
        this.dialogCurrentPage = val;
        this.listTransferExceptionPage(this.dialogPageSize, val);
      },

    }
  };

</script>
<style lang="scss" scoped>
  /* element-ui 样式 */
  .data-info {
    /deep/ .el-dialog {
      width: 1500px;
    }

    /deep/ .el-input {
      width: 200px;
    }
  }

  .colorBlue {
    color: blue;
    cursor: pointer;
  }

  .pagination {
    width: 100%;
    width: 500px;
    margin: 20px auto;

    /deep/ .el-input {
      width: 100px;
    }
  }

  /deep/ .el-table td {
    padding: 0px;
  }

</style>
