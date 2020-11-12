<!--
 * @Author: Marlon
 * @Date: 2020-08-24 14:53:02
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-28 11:11:06
 * @Description: 标题声明
-->
<template>
  <div class="bone ownTitle">
    <p class="title2">
      <span></span>
      {{titleName}}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    // 传入的标题
    titleName: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang='scss' scoped>
@import "~@/assets/css/standard-product/css/common.scss";
.ownTitle {
  padding: 0 !important;
}
</style>