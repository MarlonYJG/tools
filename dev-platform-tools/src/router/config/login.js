/*
 * @Author: Marlon
 * @Date: 2020-07-10 09:16:29
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-14 13:37:48
 * @Description: 登录页
 */

/* login */
// 登录
const Login = () => import('@/views/login/login.vue')

export default [
    {
        path: '/',
        name: 'gst',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'GST - 登录',
            isNotMenu: true
        },
        component: Login
    },
]