/*
 * @Author: Marlon
 * @Date: 2020-07-10 09:16:29
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 16:35:02
 * @Description: 公共页面
 */



/* error */
// 无权限
const Error401 = () => import('@/views/error-page/401.vue')
// 服务器异常
const Error500 = () => import('@/views/error-page/500.vue')
// 404
const Error404 = () => import('@/views/error-page/404.vue')
// global-loading
const GlobalLoading = () => import('@/views/error-page/loading.vue')

export default [
    {
        path: '/loading',
        name: 'globalLoading',
        meta: {
            title: '加载中...',
            isNotMenu: true
        },
        component: GlobalLoading
    },
    {
        path: '/401',
        name: 'error_401',
        meta: {
            title: '无权限',
            isNotMenu: true
        },
        component: Error401
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            title: '404',
            isNotMenu: true
        },
        component: Error500
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            title: '服务器异常',
            isNotMenu: true
        },
        component: Error404
    }
]