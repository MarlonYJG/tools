/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:05:43
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 16:47:12
 * @Description: 状态机 监控台
 */
import Vue from "vue"
import Vuex from "vuex"
import createLogger from "vuex/dist/logger"
import system from '@/config/system.config.js'
import publicState from './public'

const { NODE_ENV, PROJECTKEY } = system

Vue.use(Vuex);
const debug = !NODE_ENV;

const PK = JSON.parse(JSON.stringify(PROJECTKEY))
let systemState = require(`./${PK}`).default

export default new Vuex.Store({
    ...publicState,
    modules: {
        systemState
    },

    // strict: debug,
    plugins: debug ? [createLogger()] : []
})
