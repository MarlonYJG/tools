/*
 * @Author: Marlon
 * @Date: 2020-02-18 09:37:59
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:54:12
 * @Description: router 监控台
 */
import Vue from 'vue'
import Router from 'vue-router'
import system from '@/config/system.config.js'
import { PRODUCT } from '@/config'
import { setToken, getToken, Session, canTurnTo } from 'utils/lib'
import store from '@/store'


Vue.use(Router)

const { PLATFORM, TOKEN_KEY, PROJECTKEY, LOGIN_PAGE_NAME, WEB_SESSION, NODE_ENV, PUBLIC_PAGE, PLATFORM_LOGIN } = system
let routes = []
let routePublic = []

const router = new Router({
  // mode: 'history',
  routes
});


if ('GST' == PRODUCT) {
  // 平台子系统 模式
  routes = require(`./config/${PROJECTKEY}`).default;
  routePublic = require(`./config/index`).default;
  if (!NODE_ENV) {
    if (PLATFORM_LOGIN.includes(PRODUCT)) {
      routes = routes.concat(require(`./config/login`).default, routePublic)
    } else {
      routes = routes.concat(routePublic)
    }
  } else {
    routes = routes.concat(routePublic)
  }

  // 环境切换(dev/非dev)
  const switchDev = (next) => {
    if (!NODE_ENV) {
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    } else {
      window.location.replace(location.origin)
    }
  }

  if (LOGIN_PAGE_NAME !== PROJECTKEY) {
    router.beforeEach((to, from, next) => {
      const token = getToken(TOKEN_KEY)
      if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        switchDev(next)
      } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        if (!NODE_ENV) {
          next() // 跳转
        } else {
          window.location.replace(location.origin)
          return
        }
      } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
          path: '/'
        })
      } else {
        if (sessionStorage.getItem('userInfo') && JSON.parse(sessionStorage.getItem('userInfo')).userId) {
          next({ to, replace: true })
        } else {
          store.dispatch('getUserInfo').then(user => {
            if (user) {
              if (user.userId) {
                setToken(user.userId)
                next()
              } else {
                setToken('')
                switchDev(next)
              }
            } else {
              setToken('')
              switchDev(next)
            }
          }).catch(() => {
            setToken('')
            switchDev(next)
          })
        }
      }



      window.addEventListener("beforeunload", () => {
        if (to.name === LOGIN_PAGE_NAME && !from.name) {

        } else {
          //在页面刷新前将vuex里的信息保存到sessionStorage里
        }
      });
    })
  }

  router.afterEach(to => {
    const { pathname } = location
    if (!PUBLIC_PAGE.includes(to.path)) {
      localStorage.setItem(`catchPath_${PRODUCT}`, pathname + '#' + to.path)
    }
  })


} else if ('BD' == PRODUCT) {
  // 平台子系统 模式
  routes = require(`./config/${PROJECTKEY}`).default;
  routePublic = require(`./config/index`).default;
  if (!NODE_ENV) {
    // let login = require(`./config/login`).default;
    routes = routes.concat(routePublic)
  } else {
    routes = routes.concat(routePublic)
  }
  const router = new Router({
    // mode: 'history',
    routes
  });

  // 环境切换(dev/非dev)
  const switchDev = (next) => {
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  }
  router.beforeEach((to, from, next) => {
    const token = getToken(TOKEN_KEY)
    if (!token && to.name !== LOGIN_PAGE_NAME) {
      // 未登录且要跳转的页面不是登录页
      switchDev(next)
    } else if (!token && to.name === LOGIN_PAGE_NAME) {
      // 未登陆且要跳转的页面是登录页
      next() // 跳转
    } else if (token && to.name === LOGIN_PAGE_NAME) {
      // 已登录且要跳转的页面是登录页
      next({
        path: '/bd/home'
      })
    } else {
      if (sessionStorage.getItem('userInfo')) {
        store.commit('GET_USER_INFO', JSON.parse(sessionStorage.getItem('userInfo')))
        next({ to, replace: true })
      } else {
        store.dispatch('getUserInfo').then(res => {
          if (res.code == 0) {
            let user = {
              userInfo: {
                user: res.data.user
              }
            }
            sessionStorage.setItem('userInfo', JSON.stringify(user))
            next()
          } else {
            switchDev(next)
          }
        }).catch(() => {
          switchDev(next)
        })
      }
    }

    // const sessionVal = webSession.get(WEB_SESSION);
    window.addEventListener("beforeunload", () => {
      if (to.name === LOGIN_PAGE_NAME && !from.name) {
        sessionStorage.clear()
      } else {
        if (sessionVal) {
          //在页面刷新前将vuex里的信息保存到sessionStorage里
          // webSession.set(WEB_SESSION, sessionVal);
        }
      }
    });
  })

  router.afterEach(to => {
    const { pathname, hash } = location
    if (!PUBLIC_PAGE.includes(to.path)) {
      localStorage.setItem('catchPath_bd', pathname + '#' + to.path)
    }
    // 激活顶部菜单
    store.commit('ACTIVE_HEADER', { activeHeader: hash })

  })

}


export default router
