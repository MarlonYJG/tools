<!--
 * @Author: Marlon
 * @Date: 2020-03-02 21:37:09
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-08 17:09:42
 * @Description: 数据质量管理-任务管理-质量规则配置
 -->
<template>
  <div class="rule-config">
    <el-tabs v-model="activeIndex" @tab-click="handleClick" style="height:auto;">
      <el-tab-pane
        v-for="item in menuList"
        :index="item.id"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      ></el-tab-pane>
    </el-tabs>
    <data-set v-if="activeIndex==='1'"></data-set>
    <rule-collect v-else></rule-collect>
  </div>
</template>

<script>
import dataSet from "./data-set";
import ruleCollect from "./rule-collect";
const menuListDic = [
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
  data() {
    return {
      activeIndex: "1",
      menuList: menuListDic
    };
  },
  mounted() {},
  methods: {
    handleClick(val) {
      this.activeIndex = val.name;
    }
  },
  components: {
    dataSet,
    ruleCollect
  }
};
</script>

<style lang="less" scoped>
.rule-config {
  height: 100%;
}
</style>