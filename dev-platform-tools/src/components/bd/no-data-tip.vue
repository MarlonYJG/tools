<!--
 * @Author: zhangxd-i
 * @Date: 2020-11-10 15:24:12
 * @LastEditTime: 2020-11-11 15:30:28
 * @LastEditors: zhangxd-i
 * @Description: 
-->
<template>
  <div class="no-data-tip">
    <div :class="{'no-data': true, 'column': alignment==='column', 'row': alignment==='row'}">
      <div></div>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components:{},
  props:{
    // 对齐方式：row, column
    alignment: {
      type: String,
      default: 'row'
    }
  }
}
</script>
<style lang="scss" scoped>
// 没有数据
.no-data-tip{
  margin: 0 auto;
  width: 500px;
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 140px;
  font-family: PingFangSC-Regular, PingFang SC;
  >div:nth-child(1) {
    width: 200px;
    height: 180px;
    background: url(../../assets/img/no-data.png) no-repeat;
    background-size: 100% 100%;
  }
}
.column {
  flex-direction: column;
}
.row {
  flex-direction: row;
}
</style>