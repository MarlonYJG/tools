<!--
 * @Author: Marlon
 * @Date: 2020-07-10 09:14:01
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-14 10:45:08
 * @Description: 
--> 
<template>
  <div>
    <el-button type="primary" size="mini" @click="backHome" plain>返回首页</el-button>
    <el-button type="primary" size="mini" @click="backPrev" plain>返回上一页({{ second }}s)</el-button>
  </div>
</template>

<script>
import "./error.scss";
export default {
  name: "backBtnGroup",
  data() {
    return {
      second: 5,
      timer: null
    };
  },
  methods: {
    backHome() {
      this.$router.replace({
        path: "/"
      });
    },
    backPrev() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.second === 0) this.backPrev();
      else this.second--;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>
