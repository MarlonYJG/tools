<!--
 * @Author: Marlon
 * @Date: 2020-07-13 16:21:27
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-13 16:24:16
 * @Description: 
--> 
<template>
  <div></div>
</template>
<script>
export default {
  name: "global-loading",
  data() {
    return {
      src: ""
    };
  },
  mounted() {
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    setTimeout(() => {
      loading.close();
    }, 2000);
  }
};
</script>