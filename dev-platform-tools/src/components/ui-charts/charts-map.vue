<template>
  <!-- 普通饼图 -->
  <div class="chart-content">
     <div :id="elId" style="width:700px;height:500px"></div>
  </div>
</template>

<script>
export default {
  props: {
    elId: {
      type: String,
      default: ""
    },
    // echarts 配置参数
    chartConfig: {
      type: Object,
      default: {}
    },
  },
  watch: {
    chartConfig(val) {
      this.ownChartConfig = val;
      this.drawPie();
    },
  },
  data() {
    return {
      ownChartConfig: {},
    };
  },
  mounted(){

      this.drawPie();
  },
  methods: {
     // 绘制echarts
    drawPie() {
     var mapChart = this.$echarts.init(document.getElementById(this.elId));
     mapChart.setOption(this.ownChartConfig, true);
    },
  },
};
</script>
<style lang="scss" scoped>
.chart-content {
    position: relative;
    .chart-btn {
      position: absolute;
      top: -8px;
      right: 10px;
    }
  }
</style>