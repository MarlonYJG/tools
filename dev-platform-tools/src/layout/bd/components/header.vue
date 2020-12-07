<!--
 * @Author: Marlon
 * @Date: 2020-11-05 09:52:18
 * @LastEditors: zhangxd-i
 * @LastEditTime: 2020-11-11 10:06:55
 * @Description: 顶部
-->
<template>
  <el-header class="header-l">
    <Header @Htarget="Htarget" :HisCollapse="isCollapse"></Header>
  </el-header>
</template>

<script>
import Header from "@/layout/bd/header.vue";
export default {
  components: {
    Header,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    // 折叠菜单
    Htarget(isTrue) {
      this.isCollapse = isTrue;
    },
  },
};
</script>


<style lang="scss" scoped>
@import "~@/assets/css/platform/bd/config.scss";
.header-l {
  width: 100%;
  background: #1F5191;
  color: #fff;
  // background: $header_bg;
}
</style>

