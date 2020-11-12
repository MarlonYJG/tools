<!--
 * @Author: 赵鹏鹏
 * @Date: 2020-05-20 00:45:34
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-07-18 17:30:53
 * @Description: 指标构建-数据域管理
--> 
<template>
  <el-tabs v-model="activeName">
    <!-- 数据域分类管理一栏 -->
    <el-tab-pane label="数据域分类管理" name="one">
      <template v-if="activeName == 'one'">
        <classiFicationOne></classiFicationOne>
      </template>
    </el-tab-pane>
    <!-- 数据域管理一栏 -->
    <el-tab-pane label="数据域管理" name="two">
      <template v-if="activeName == 'two'">
        <adminisTrationTwo></adminisTrationTwo>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import classiFicationOne from "./components/classification-one";
import adminisTrationTwo from "./components/administration-two";

export default {
  name: "DataFields",
  data() {
    return {
      activeName: "one"
    };
  },
  components: {
    classiFicationOne,
    adminisTrationTwo
  },
  methods: {},
  computed: {},
  created() {    
    let { to, from } = this.$route.query;
    if (from == "business" && to == "two") {
      this.activeName = "two";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
