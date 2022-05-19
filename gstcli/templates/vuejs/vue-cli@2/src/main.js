// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './directive/index';
import ElementUI from 'element-gui';
import 'element-gui/lib/theme-chalk/index.css';
import 'element-gui/lib/theme-chalk/base.css'; // fade/zoom 
import CollapseTransition from 'element-gui/lib/transitions/collapse-transition'; // collapse 展开折

import './assets/css/base.less';
import './assets/css/fonts.less';
import './assets/css/element-gui.less';

import store from "./store";

Vue.use(require('vue-wechat-title'))
Vue.use(ElementUI)
Vue.component(CollapseTransition.name, CollapseTransition)


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
