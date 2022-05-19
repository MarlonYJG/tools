/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:36:01
 * @LastEditors: Marlon
 * @Description: store
 */
import Vue from "vue"
import Vuex from "vuex"

import state from "./state"
import mutations from "./mutations"
import * as actions from "./actions"
import * as getters from "./getters"



Vue.use(Vuex);

const debug = true;

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: debug,
})
