<!--
 * @Author: Marlon
 * @Date: 2020-11-09 14:58:58
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-11 13:45:07
 * @Description: 首页
-->
<template>
  <div>
    标道首页
    <el-button @click="toME">个人中心</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    toME() {
      this.$router.push("/bd/index-personal/my-information")
    }
  }
}
</script>

<style>
</style>
