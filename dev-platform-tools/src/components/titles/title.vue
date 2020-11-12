<!--
 * @Author: Marlon
 * @Date: 2020-03-20 08:34:34
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-18 10:52:04
 * @Description: 标题
 -->
<template>
  <div class="M-title">
    <p>
      <i></i>
      <span>{{TitleName}}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    TitleName: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/css/components/m-title.scss";
.M-title {
  box-sizing: border-box;
  p {
    position: relative;
    overflow: hidden;
    i {
      position: absolute;
      top: 2px;
      width: 3px;
      height: 15px;
      background: $title_icon;
    }
    span {
      display: inline-block;
      height: 18px;
      line-height: 18px;
      margin-left: 12px;
      color: $title_color;
      font-size: 16px;
      font-family: PingFang-SC-Medium;
    }
  }
}
</style>