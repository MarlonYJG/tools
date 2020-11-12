<template>
  <div class="rule-collect">
    <div class="title-name">
      <div class="left">规则数：</div>
      <div class="right">
        <p class="name">规则明细：</p>
        <ul class="handle">
          <li>
            <label for>项目：</label>
            <el-select
              v-model="projectId"
              filterable
              placeholder="请选择"
              size="small"
              @change="selectProChange"
            >
              <el-option
                v-for="item in projectDic"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
          <li>
            <label for>任务：</label>
            <el-select
              v-model="taskId"
              filterable
              placeholder="请选择"
              size="small"
              @change="selectTaskChange"
            >
              <el-option
                v-for="item in taskDic"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </li>
        </ul>
      </div>
    </div>
    <div class="body">
      <div class="rules-tree">
        <el-tree :data="treeRulesDic" @node-click="handleNodeClick" node-key="id"></el-tree>
      </div>
      <div class="rule-list">
        <TableDefault
          :TLoading="TLoading"
          :TTitle="tableTitle"
          :TData="tableData"
          :TIsShowPage="true"
          :TTotal="TPage.total"
          :TCurrentPage="TPage.index"
          :TPageSize="TPage.size"
          @changePage="changePage"
        ></TableDefault>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from "mixin";
import API from "api/index";
import { ResDatas } from "utils/res-format";
const init_pageNum = 1;
const init_pageSize = 10;
const INIT_NUM = 0;
export default {
  mixins: [mixin],
  data() {
    return {
      treeRulesDic: [],
      projectId: "",
      projectDic: [],
      taskId: "",
      taskDic: [],
      ruleTypeId: "",
      TLoading: false,
      tableData: [],
      tableDataAll: [],
      tableTitle: [],
      TPage: {
        index: init_pageNum,
        total: INIT_NUM,
        size: init_pageSize
      }
    };
  },
  async mounted() {
    await this.getTaskList({ init: true });
  },
  methods: {
    // 获取项目-任务联动字典
    getTaskList({ init }) {
      let params = {
        taskId: this.projectId
      };
      API._ruleRelationTaskList(params).then(async res => {
        let Res = new ResDatas({
          res,
          error: "项目-任务联动字典获取失败!"
        }).init();
        this.projectDic = Res && Res.length ? Res : [];
        this.projectId =
          this.projectDic && this.projectDic.length
            ? this.projectDic[0].id
            : "";
        this.taskDic =
          this.projectDic &&
          this.projectDic.length &&
          this.projectDic[0].children
            ? this.projectDic[0].children
            : [];
        this.taskId =
          this.taskDic && this.taskDic.length ? this.taskDic[0].id : "";
        await this.getRulesTreeDic();
        await this.getRulesDetList();
      });
    },
    // 项目select-change
    selectProChange(val) {
      this.projectDic.forEach(item => {
        if (item.id === val) {
          this.taskDic = item.children ? item.children : [];
          this.taskId = this.taskDic.length ? this.taskDic[0].id : "";
          // this.getRulesDetList();
          this.selectTaskChange();
        }
      });
    },
    // 任务select-change
    async selectTaskChange() {
      await this.getRulesTreeDic();
      await this.getRulesDetList();
    },
    // 获取规则树-字典
    getRulesTreeDic() {
      let params = {
        taskId: this.taskId
      };
      API.rulesTreeDic(params).then(res => {
        let Res = new ResDatas({
          res,
          error: "规则树字典获取失败!"
        }).init();
        let data = Res && Res.data ? Res.data : {};
        let { children } = data;
        this.treeRulesDic = children ? [{ ...children, label: "规则" }] : [];
        this.treeRulesDic = this.concatData(this.treeRulesDic);
      });
    },
    // 拼接数据
    concatData(arr) {
      for (let i = 0; i < arr.length; i++) {
        arr[i].label = `${arr[i].label}(${arr[i].ruleNum})`;
        if (Array.isArray(arr[i].children)) {
          this.concatData(arr[i].children);
        }
      }
      return arr;
    },
    // 获取规则明细列表
    getRulesDetList() {
      let paramsBase = {
        taskId: this.taskId
      };
      let params = this.ruleTypeId
        ? {
            ...paramsBase,
            ruleTypeId: this.ruleTypeId
          }
        : { ...paramsBase };
      API.rulesQueryRuleStatisticsList(params).then(res => {
        let Res = new ResDatas({
          res,
          error: "获取规则明细列表获取失败!"
        }).init();
        this.tableTitle = Res && Res.title ? Res.title : [];
        this.tableDataAll = Res && Res.data ? Res.data : [];
        this.getCurrectTableList();
      });
    },
    handleNodeClick(val) {
      this.ruleTypeId = val && val.id ? val.id : "";
      this.getRulesDetList();
    },
    // 获取当前页数据
    getCurrectTableList() {
      let { index, size } = this.TPage;
      let start = (index - 1) * size;
      let end = start + size;
      this.tableData = this.tableDataAll.slice(start, end);
    },
    // 分页
    changePage({ pageSize, currentPage }) {
      this.TPage = {
        ...this.TPage,
        index: currentPage,
        size: pageSize
      };
      this.getCurrectTableList();
    }
  }
};
</script>

<style lang="less" scoped>
.rule-collect {
  height: 100%;
  .title-name {
    height: 60px;
    div.left {
      width: 300px;
      float: left;
      line-height: 60px;
    }
    div.right {
      width: calc(100% - 300px);
      float: right;
      height: 60px;
      & > p.name {
        width: auto;
        float: left;
        line-height: 60px;
      }
      & > .handle {
        width: auto;
        float: right;
        & > li {
          width: auto;
          float: left;
          margin-right: 20px;
        }
      }
    }
  }
  .body {
    height: calc(100% - 60px);
    div.rules-tree {
      width: 300px;
      height: 100%;
      float: left;
      border: 1px solid #eee;
      box-sizing: border-box;
    }
    div.rule-list {
      width: calc(100% - 300px);
      padding: 0 20px;
      box-sizing: border-box;
      float: right;
    }
  }
  &-btn {
    float: left;
    overflow: hidden;
    li {
      float: left;
      margin: 2px 15px;
    }
  }
  &-select {
    float: left;
    overflow: hidden;
    margin: 4px 55px;
    li {
      float: left;
      margin-right: 20px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &-table {
    margin: 20px 0;
  }
}
</style>