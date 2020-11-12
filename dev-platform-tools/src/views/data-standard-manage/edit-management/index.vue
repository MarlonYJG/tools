<!--
 * @Author: Marlon
 * @Date: 2020-02-26 11:39:21
 * @LastEditors: Marlon
 * @LastEditTime: 2020-09-21 14:56:28
 * @Description: 
--> 
<template>
  <div class="rt-view">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
<style lang="scss" scoped>
.rt-view {
  height: calc(100% - 45px) !important;
  overflow: hidden !important;
}
</style>