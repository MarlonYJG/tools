<!--
 * @Author: Marlon
 * @Date: 2020-04-26 14:58:25
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 16:54:08
 * @Description: ETL-规则配置
 -->
<template>
  <div class="etl-rule-config">
    <el-tabs v-model="activeIndex" @tab-click="handleClick" style="height: auto;">
      <el-tab-pane
        v-for="item in tabs"
        :index="item.id"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      ></el-tab-pane>
    </el-tabs>
    <DataSet v-if="activeIndex==='1'"></DataSet>
    <RuleCollect v-else></RuleCollect>
  </div>
</template>

<script>
import DataSet from "./data-set-rule/target-table";
import RuleCollect from "./rule-collect";

const TABS = [
  {
    id: "1",
    name: "数据集规则"
  },
  {
    id: "2",
    name: "规则统计"
  }
];
export default {
  components: { DataSet, RuleCollect },
  data() {
    return {
      activeIndex: "1",
      tabs: TABS
    };
  },
  methods: {
    handleClick(val) {
      this.activeIndex = val.name;
    }
  }
};
</script>

<style lang="scss" scoped>
.etl-rule-config {
  height: 100%;
}
</style>