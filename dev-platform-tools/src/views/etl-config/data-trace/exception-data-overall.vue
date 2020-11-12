<template>
  <div class="data-info">

    <div class="info-head">
      <el-form :inline="true">
        <el-form-item label="状态：">
          <el-select v-model="form.dataState" placeholder="">
            <el-option v-for="item in dataStateList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类型：">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
          </el-checkbox>
          <el-checkbox-group v-model="form.exceptionType" @change="handleCheckedChange"
            style="display: inline; margin-left: 25px;">
            <el-checkbox v-for="(item, index) in exceptionTypeList" :label="item.code" :key="index">{{item.value}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>

      </el-form>
    </div>
    <div class="info-content">
      <el-table style="width: 100%;" border :data="etlDataList" :header-cell-class-name="tableRowClassName">
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
        etlDataList: [],
        currentPage: 1,
        pageSize: 10,
        jobId: '',
        dataStateList: [{
          value: '0',
          label: '进行中'
        }, {
          value: '1',
          label: '已完成'
        }, {
          value: '',
          label: '全部'
        }],
        exceptionTypeList: [{
          code: '0',
          value: '系统异常'
        }, {
          code: '1',
          value: '唯一清空标识'
        }, {
          code: '2',
          value: '不规则'
        }],
        form: {
          dataState: '',
          exceptionType: [],
        },
        checkAll: false,
        isIndeterminate: true,

      };
    },
    watch: {},
    computed: {},
    created() {
      this.listExceptionOverallPage(this.pageSize, this.currentPage);
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
      // 初始化数据
      listExceptionOverallPage(size, current) {
        let jobId = this.$route.query.jobId;
        api
          .listExceptionOverallPage({
            pageSize: size,
            pageNum: current,
            jobId: jobId,
            type: this.form.exceptionType.join(","),
            state: this.form.dataState
          })
          .then(res => {
            this.etlDataList = res.data.data.list;
            this.total = res.data.data.totalCount;
          });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.listExceptionOverallPage(val, 1);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.listExceptionOverallPage(this.pageSize, val);
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
        this.listExceptionOverallPage(10, 1);
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
