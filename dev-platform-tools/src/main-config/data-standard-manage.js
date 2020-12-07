/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑       永不宕机     永无BUG
 */

/*
 * @Author: Marlon
 * @Date: 2020-02-18 09:37:59
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 17:37:45
 * @Description: 
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import { PRODUCT } from '../config'
import Vue from 'vue';

import * as filter from '../filter'
import '../directive/index';
import App from '../App';
import router from '../router/data-standard-manage';
import ElementUI from 'element-gui';
import echarts from 'echarts';
import 'echarts-liquidfill';
import VueParticles from 'vue-particles';
// 公共样式
import 'element-gui/lib/theme-chalk/index.css';
import 'element-gui/lib/theme-chalk/base.css';
import CollapseTransition from 'element-gui/lib/transitions/collapse-transition';
import '../assets/css/fonts.scss';
import '../assets/css/base.scss';



import Axios from 'utils/axios.js';
import store from "../store";

// 各产品的静态资源

import jsoneditor from 'jsoneditor';
import '../assets/css/control/jsoneditor/jsoneditor.css';

require('../assets/css/platform/gst/element-ui.scss')
require('../assets/css/platform/gst/globol-custom.scss')

Vue.prototype.$jsoneditor = jsoneditor

Vue.use(require('vue-wechat-title'))
Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.component(CollapseTransition.name, CollapseTransition)

// 全局导入过滤器 
Object.keys(filter).forEach(key => Vue.filter(key, filter[key]))

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
