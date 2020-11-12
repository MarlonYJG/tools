<!--
 * @Author: Marlon
 * @Date: 2020-02-21 08:28:50
 * @LastEditors: Marlon
 * @LastEditTime: 2020-03-09 12:07:09
 * @Description: 非菜单页面
 -->
<template>
  <el-container class="layout">
    <el-header class="header-l">
      <Header @Htarget="Htarget" :HisCollapse="isCollapse"></Header>
    </el-header>
    <el-container class="body">
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Header from "@/layout/components/header.vue";
export default {
  components: {
    Header
  },
  data() {
    return {
      isCollapse: false
    };
  },
  methods: {
    // 折叠菜单
    Htarget(isTrue) {
      this.isCollapse = isTrue;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/platform/gst/config.scss";
.layout {
  width: 100%;
  height: 100%;
  transition: width 0.3s ease;
}
.header-l {
  background: $header_bg;
}
.body {
  position: relative;
  z-index: 1;
  height: 100%;
  overflow: hidden;
  background: $other_bg;
}

.main {
  box-sizing: border-box;
  padding: 0;
}
</style>
