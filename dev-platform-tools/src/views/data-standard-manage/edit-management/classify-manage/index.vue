<!--
 * @Author: Marlon
 * @Date: 2020-07-20 21:38:07
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-22 10:23:39
 * @Description: 分类管理
--> 
<template>
  <div class="classify-manage-page">
    <el-tabs v-model="activeIndex" @tab-click="handleClick" style="height: auto;">
      <el-tab-pane
        v-for="item in tabs"
        :index="item.id"
        :key="item.id"
        :label="item.name"
        :name="item.id"
      ></el-tab-pane>
    </el-tabs>
    <BusinessBlock v-if="activeIndex==='1'" />
  </div>
</template>

<script>
import BusinessBlock from "./business-block";

const TABS = [
  {
    id: "1",
    name: "业务板块"
  }
];
export default {
  components: { BusinessBlock },
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
.classify-manage-page {
  width: 100%;
  height: 100%;
}
</style>
