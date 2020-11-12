<!--
 * @Author: Marlon
 * @Date: 2020-07-08 10:26:53
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-07-17 18:34:21
 * @Description: 基础按钮
--> 
<template>
  <el-button size="medium" @click="click">
    <i class="el-icon-circle-plus-outline"></i>
    {{text}}
  </el-button>
</template>
<script>
export default {
  name: "Add-Button",
  props: {
    // 按钮文本
    text: {
      type: String,
      default: ""
    },
    // 点击-参数
    clickArgs: {
      type: Object,
      default: ""
    }
  },
  methods: {
    click() {
      if (this.clickArgs) {
        this.$emit("click", this.clickArgs);
      } else {
        this.$emit("click");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
