<!--
 * @Author: Marlon
 * @Date: 2020-02-21 08:28:50
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-05 10:13:57
 * @Description: 布局
 -->
<template>
  <el-container class="layout">
    <Header></Header>
    <el-container class="other-body">
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/layout/bd/components/header.vue";
export default {
  components: {
    Header,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";
.layout {
  width: 100%;
  height: 100%;
  transition: width 0.3s ease;
}
.other-body {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 60px;
  overflow: hidden;
}
.main {
  box-sizing: border-box;
  padding: 0;
}
</style>
