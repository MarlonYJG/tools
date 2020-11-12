/*
 * @Author: Marlon
 * @Date: 2020-02-24 09:05:44
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 17:00:19
 * @Description: 标道
 */
import system from '@/config/system.config'
const { PLATFORM } = system

/* 登录 */
const Login = () => import('@/views/bd/login')

/*  */

export default [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录'
        },
    },
    {
        path: '/',
        name: 'home',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        meta: {
            title: '用户中心'
        },
    }

]