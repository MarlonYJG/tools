/*
 * @Author: Marlon
 * @Date: 2020-02-18 09:37:59
 * @LastEditors: Marlon
 * @Description: router 配置层
 */


export default [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home.vue'),
        meta: {
            title: 'home'
        },
    }
]