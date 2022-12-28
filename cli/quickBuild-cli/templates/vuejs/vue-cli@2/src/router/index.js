/*
 * @Author: Marlon
 * @Date: 2020-02-18 09:37:59
 * @LastEditors: Marlon
 * @Description: router 监控台
 */
import Vue from 'vue'
import Router from 'vue-router'

// TODO 路由引入
import routePublic from "./config/home.js";

Vue.use(Router)

const createRouter = () => new Router({
  // mode: "history",
  routes: routePublic
})

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

router.beforeEach(async (to, from, next) => {
  next()
  // const token = 'token_'
  // if (!token && to.name !== 'login') {
  //   // 未登录且要跳转的页面不是登录页
  //   next() // TODO 退出到登录页面
  // } else if (!token && to.name === 'login') {
  //   // 未登陆且要跳转的页面是登录页
  //   next()
  // } else if (token && to.name === 'login') {
  //   // 已登录且要跳转的页面是登录页
  //   next() // TODO 进入默认页
  // } else {
  //   next()
  // }
})

router.afterEach((to) => {

})



export default router