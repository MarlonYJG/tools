<!--
 * @Author: yangjianguo
 * @Date: 2019-09-09 11:24:17
 * @LastEditors: yangjianguo
 * @LastEditTime: 2019-11-01 10:13:43
 * @Description: 转换规则配置详情
 -->
<template>
  <div class="rule-config">
    <el-form :inline="true" ref="formInline" :model="formInline" class="demo-form-inline">
      <el-form-item label="表编码：" prop="tableName">
        <el-input v-model="formInline.tableName" placeholder="表编码"></el-input>
      </el-form-item>
      <el-form-item label="表中文名：" prop="tableComment">
        <el-input v-model="formInline.tableComment" placeholder="表中文名"></el-input>
      </el-form-item>
      <el-form-item label="字段编码：" prop="columnName">
        <el-input v-model="formInline.columnName" placeholder="字段编码"></el-input>
      </el-form-item>
      <el-form-item label="字段中文名：" prop="columnComment">
        <el-input v-model="formInline.columnComment" placeholder="字段中文名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDetailBox" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      style="width: 100%;"
      border
      height="350"
      :data="detailList"
      :header-cell-class-name="tableRowClassName"
      v-loading="tableLoading"
    >
      <el-table-column prop="tableName" label="表编码"></el-table-column>
      <el-table-column prop="tableComment" label="表中文名"></el-table-column>
      <el-table-column prop="columnName" label="字段编码"></el-table-column>
      <el-table-column prop="columnComment" label="字段中文名"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import api from 'api'
export default {
  components: {},
  props: {},
  data() {
    return {
      tableLoading: true,
      dataAry: false,
      queryData: null,
      detailList: [],
      // 数据表规则
      formInline: {
        tableName: '',
        tableComment: '',
        columnName: '',
        columnComment: ''
      }
    }
  },
  computed: {},
  created() {
    this.queryData = this.$route.query
    this.getDetailBox()
  },
  methods: {
    // 给表头 添加样式
    tableRowClassName() {
      return 'warning-row'
    },
    //请求弹窗接口
    getDetailBox() {
      this.formInline.jobRepositoryId = this.queryData.id
      this.tableLoading = true
      api
        .getDetailBox(this.formInline)
        .then(res => {
          this.detailList = res.data.data
          this.tableLoading = false
        })
        .catch(err => {
          this.tableLoading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
// element-ui
.rule-config {
  .target-dialog,
  .examine-field {
    /deep/ .el-dialog__header {
      border-bottom: 1px solid #ccc;

      .el-dialog__title {
        font-size: 16px;
      }
    }
  }

  .selData-dialog {
    /deep/ .el-dialog__body {
      padding: 0;
    }

    /deep/ .el-textarea {
      width: 95%;

      .el-textarea__inner {
        min-height: 120px !important;
      }
    }
  }

  .el-checkbox-group {
    overflow-x: hidden;
    overflow-y: auto;
    height: 200px;
  }

  .info-head {
    /deep/ .el-button {
      padding: 7px 20px;
    }
  }

  /deep/ .own-check {
    .el-checkbox-group {
      height: auto;
      overflow-y: hidden;
    }
  }

  /deep/ .own-collapse {
    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background: #ccc;
    }

    .el-collapse-item__arrow {
      margin: 0 auto;
      font-size: 26px !important;
      transform: rotate(90deg);
    }

    .el-collapse-item__content {
      margin-bottom: 0;
    }

    .el-collapse-item__arrow.is-active {
      transform: rotate(-90deg);
    }
  }

  /deep/ .el-table__body tr.current-row > td {
    background-color: #f19944 !important;
  }

  /deep/ .el-table .cell {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /deep/ .el-input__inner {
    height: 32px;
    line-height: 32px;
  }

  /deep/ .el-input__icon {
    line-height: 32px;
  }

  /deep/ .el-table {
    td {
      padding: 3px 0;
    }
  }

  /deep/ .el-checkbox {
    line-height: 22px;
    display: block;
  }

  /deep/ .el-dialog__close {
    font-size: 22px;
  }

  /deep/ .el-tabs__content {
    padding-left: 20px;
    height: 200px;
  }
}

// 页面样式
.rule-config {
  position: relative;
  height: 100%;

  .info-head {
    margin: -2px 4px 5px 0;
  }

  .own-collapse {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 100;

    .info-head {
      position: relative;
      height: 40px;

      .add {
        margin: 4px 0 0 5px;
        padding: 8px 15px;
      }

      .title {
        display: inline-block;
        margin-left: 80px;
        font-size: 14px;
      }
    }
  }

  .sel-Dictionary {
    .rule-convert {
      .ruleTitle {
        margin: 0 0 20px 15px;
        font-size: 16px;
      }

      .ruleExplain {
        margin: 0 0 20px 7px;
      }

      .textarea {
        margin-left: 24px;
      }
    }
  }

  .pagination {
    /* width: 100%; */
    width: 500px;
    margin: 20px auto;

    /deep/ .el-input {
      width: 100px;
    }
  }
}
</style>
