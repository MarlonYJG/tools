<!--
 * @Author: zhangxd-i
 * @Date: 2020-11-06 15:14:00
 * @LastEditTime: 2020-11-12 14:47:35
 * @LastEditors: zhangxd-i
 * @Description: 标题
-->
<template>
  <div class="tip-title" :style="{'font-size': fontSize}">
    <span></span>
    <span v-html="contentText"></span>
  </div>
</template>

<script>
export default {
  props:{
    // 内容
    contentText: {
      type: String,
      default: ''
    },
    // 字体大小
    fontSize: {
      type: String,
      default: '16px'
    }
  }
}
</script>
<style lang="scss" scoped>
.tip-title {
  display: flex;
  font-weight: 600;
  >span {
    height: 18px;
    line-height: 18px;
  }
  >span:nth-child(1) {
    width: 3px;
    margin-right: 5px;
    background: #112742;
  }
}
</style>