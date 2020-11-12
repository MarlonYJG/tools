<template>
  <div class="data-info">

    <div class="info-head">
        <el-input v-model="tableName" placeholder="表名称"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="listIllegalDataReport(10, 1)">搜索</el-button>
    </div>
    <div class="info-content">
      <el-table  style="width: 100%;" border :data="etlDataList" :header-cell-class-name="tableRowClassName">
        <el-table-column label="序号" prop="seq" type="index" width="50" align="center">
        </el-table-column> 
        <el-table-column label="表名" prop="ruleIllegalDataGatherVo.targetName" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="字段名" prop="ruleIllegalDataGatherVo.fieldName" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="规则名" prop="ruleIllegalDataGatherVo.ruleName" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="规则编码" prop="ruleIllegalDataGatherVo.clearFlag" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="查询总数（queryNum，查询总数小于清洗转换总数的话进行了字段拆分）" prop="tableIllegalDataGatherVo.queryNum" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="清洗转换总数（total=legalTotalNum+illegalTotalNum）" prop="tableIllegalDataGatherVo.total" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="合规总条数（legalTotalNum）" prop="tableIllegalDataGatherVo.legalTotalNum" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="不合规总条数（illegalTotalNum）" prop="tableIllegalDataGatherVo.illegalTotalNum" align="center" :show-overflow-tooltip=true>
        </el-table-column>
        <el-table-column label="该规则清洗掉的条数（ruleIllegalNum）" prop="ruleIllegalDataGatherVo.ruleIllegalNum" align="center" :show-overflow-tooltip=true >
        </el-table-column>
        <el-table-column label="该规则清洗掉的条数占不合规总条数的比例（ruleIllegalNum/illegalTotalNum%）" prop="ruleIllegalDataGatherVo.ruleIllegalRate" align="center" :show-overflow-tooltip=true :formatter="formatPercentage">
        </el-table-column>
        <el-table-column label="该规则清洗掉的条数占清洗转换总条数的比例（ruleIllegalNum/total%）" prop="ruleIllegalDataGatherVo.ruleIllegalTotalRate" align="center" :show-overflow-tooltip=true :formatter="formatPercentage">
        </el-table-column>
        <el-table-column label="合规总条数占比（legalTotalNum/total）" prop="tableIllegalDataGatherVo.legalTotalRate" align="center" :show-overflow-tooltip=true :formatter="formatPercentage">
        </el-table-column>
        <el-table-column label="不合规总条数占比（illegalTotalNum/total）" prop="tableIllegalDataGatherVo.illegalTotalRate" align="center" :show-overflow-tooltip=true :formatter="formatPercentage">
        </el-table-column>
        <el-table-column label="reportId" prop="ruleIllegalDataGatherVo.reportId" align="center" :show-overflow-tooltip=true>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-size="pageSize" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>

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
        etlDataList: [

        ],
        currentPage: 1,
        pageSize: 10,
        jobId: '',
        tableName: ''

      };
    },
    watch: {},
    computed: {},
    created() {
      this.listIllegalDataReport(this.pageSize, this.currentPage);
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
      formatPercentage(row, column, cellValue, index) {
                if ("0" == cellValue) {
          return "0";
        } else {
          return  Number(cellValue*100).toFixed(4).replace(/0+$/,"").replace(/\.$/,"") + "%";
        }
      },
      // 初始化数据
      listIllegalDataReport(size, current) {
        let jobId = this.$route.query.jobId;
        api
          .listIllegalDataReport({
            pageSize: size,
            pageNum: current,
            jobReportId: jobId,
            tableName: this.tableName
          })
          .then(res => {
            this.etlDataList = res.data.data.illegalDataGatherListVoList;
            this.total = res.data.data.totalCount;
          });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.listIllegalDataReport(val, 1);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.listIllegalDataReport(this.pageSize, val);
      },
      //全选
      handleCheckAllChange(val) {
        let exceptionTypeList = this.exceptionTypeList;
        let tmp = [];
        for (let i = 0; i < exceptionTypeList.length; i++) {
          tmp.push(exceptionTypeList[i].code);
        }
        this.form.exceptionType = val ? tmp : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        let length = this.exceptionTypeList.length
        this.checkAll = checkedCount === length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < length;
      },
      onSearch() {
        this.listIllegalDataReport(10, 1);
      },

    }
  };

</script>
<style lang="scss" scoped>
  /* element-ui 样式 */

  .data-info {
    margin: 55px 0 0 105px;

    .info-head {
      margin: 10px 0 20px 0;
    }
    /deep/ .el-input {
      width: 300px;
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