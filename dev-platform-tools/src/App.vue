<!--
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 10:33:10
 * @Description: 
 -->
<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title" />
    <!-- <vue-particles
      :color="particles.color"
      :particleOpacity="particles.particleOpacity"
      :particlesNumber="particles.particlesNumber"
      :shapeType="particles.shapeType"
      :particleSize="particles.particleSize"
      :linesColor="particles.linesColor"
      :linesWidth="particles.linesWidth"
      :lineLinked="particles.lineLinked"
      :lineOpacity="particles.lineOpacity"
      :linesDistance="particles.linesDistance"
      :moveSpeed="particles.moveSpeed"
      :hoverEffect="particles.hoverEffect"
      :hoverMode="particles.hoverMode"
      :clickEffect="particles.clickEffect"
      :clickMode="particles.clickMode"
      class="lizi"
    ></vue-particles>-->
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      particles: {
        color: "#4f5b98", // 默认'#dedede'。粒子颜色。
        particleOpacity: 1, // 默认0.7。粒子透明度。
        particlesNumber: 80, // 默认80。粒子数量。
        shapeType: "circle", // 默认'circle'。可用的粒子外观类型有："circle","edge","triangle", "polygon","star"。
        particleSize: 4, // 默认80。单个粒子大小。
        linesColor: "#4f5b98", // 默认'#dedede'。线条颜色。
        linesWidth: 1, // 默认1。线条宽度。
        lineLinked: true, // 默认true。连接线是否可用。
        lineOpacity: 0.4, // 默认0.4。线条透明度。
        linesDistance: 150, // 默认150。线条距离。
        moveSpeed: 2, // 默认3。粒子运动速度。
        hoverEffect: true, // 默认true。是否有hover特效。
        hoverMode: "grab", // 默认true。可用的hover模式有: "grab", "repulse", "bubble"。
        clickEffect: true, // 默认true。是否有click特效。
        clickMode: "push", // 默认true。可用的click模式有: "push", "remove", "repulse", "bubble"。
      },
      dialogVisible: true,
    };
  },
  methods: {},
};
</script>

<style lang="scss">
@import "~@/assets/css/platform/gst/config.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  position: relative;
  height: 100%;
  width: 100%;
  .lizi {
    position: absolute;
    top: 0;
    height: 99vh;
    width: 100%;
    background: $header_bg;
  }
}
</style>
