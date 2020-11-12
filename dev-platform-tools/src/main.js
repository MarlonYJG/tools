/*
 * @Author: Marlon
 * @Date: 2020-02-18 09:37:59
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 16:44:05
 * @Description: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { PRODUCT } from './config'
import Vue from 'vue';

import * as filter from './utils/filters' // TODO

import './directive/index';
import App from './App';
import router from './router';
import ElementUI from 'element-gui';
import jsoneditor from 'jsoneditor';
import echarts from 'echarts';
import 'echarts-liquidfill';
import VueParticles from 'vue-particles';

import 'element-gui/lib/theme-chalk/index.css';
import 'element-gui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-gui/lib/transitions/collapse-transition';
import './assets/css/fonts.scss';
import './assets/css/base.scss';
import './assets/css/control/jsoneditor/jsoneditor.css';



// import './assets/css/index.css'

import './utils/trag'// TODO


import Axios from 'utils/axios.js';
import store from "./store";

if ('GST' === PRODUCT) {
  require('./assets/css/platform/gst/element-ui.scss')
  require('./assets/css/platform/gst/globol-custom.scss')
}

Vue.use(require('vue-wechat-title'))
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.component(CollapseTransition.name, CollapseTransition)

// TODO 全局导入过滤器 
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))

Vue.prototype.$jsoneditor = jsoneditor
Vue.prototype.Axios = Axios
Vue.prototype.$echarts = echarts


Vue.config.productionTip = false

/* eslint-disable no-new */
const $this = new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
window.$this = $this;