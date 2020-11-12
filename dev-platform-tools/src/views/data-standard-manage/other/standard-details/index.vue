<!--
 * @Author: Marlon
 * @Date: 2020-07-22 16:20:55
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-25 13:43:11
 * @Description: 数据标准-顶板数据-查看详情
--> 

<template>
  <div class="standard-details">
    <div class="standard-details-edit-area">
      <p>{{areaName}}：{{versionName}} 版本号：{{versionNumber}}</p>
    </div>
    <!-- 行规则、字段规则 -->
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="数据标准" name="1">
        <StandardDetails :activeIndex="activeIndex" />
      </el-tab-pane>
      <el-tab-pane label="代码集" name="2">
        <CodeSet :activeIndex="activeIndex" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StandardDetails from "./data-standard";
import CodeSet from "./code-set";

export default {
  components: {
    StandardDetails,
    CodeSet,
  },
  data() {
    return {
      // 标题
      areaName: "",
      versionName: "",
      versionNumber: "",
      // 标签切换
      activeIndex: "1",
    };
  },
  mounted() {
    if (this.$route.query && this.$route.query.row) {
      const { areaName, versionName, versionNumber } = JSON.parse(
        this.$route.query.row
      );
      this.areaName = areaName;
      this.versionName = versionName;
      this.versionNumber = versionNumber;
    }
  },
};
</script>

<style lang="scss" scoped>
.standard-details {
  height: 100%;
  padding: 10px;
  margin-left: 20px;
  overflow: hidden;
  &-edit-area {
    overflow: hidden;
    p {
      margin: 5px 0;
      font-size: 14px;
      font-weight: bolder;
    }
  }
  /deep/ .el-tabs__content {
    height: calc(100% - 80px);
  }
}
</style>
