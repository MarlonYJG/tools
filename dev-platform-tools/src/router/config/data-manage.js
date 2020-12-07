/*
 * @Author: Marlon
 * @Date: 2020-02-21 10:52:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-20 15:14:39
 * @Description: 数据管理
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/meta-data-manage/other/index')
const dataDetails = () => import('@/views/meta-data-manage/other/data-standard-details')

/* 非隐藏页 */
//  数据源管理
const Index = () => import('@/views/data-manage/data-source-manage/data-source-list')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/dataSource/list',
    },
    {
        path: '/dataSource',
        name: 'dataSource',
        component: resolve => {
            require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
        },
        redirect: '/dataSource/list',
        meta: {
            title: '数据管理'
        },
        children: [
            {
                path: 'list',
                name: 'list',
                component: Index,
                meta: {
                    title: '数据源管理'
                }
            },

        ]
    },
    {
        path: '/other',
        name: 'other',
        component: otherIndex,
        meta: {
            title: '隐藏页面'
        },
        children: [
            {
                path: 'dataDetails',
                name: 'dataDetails',
                component: dataDetails,
                meta: {
                    title: '数据标准匹配详情',
                    isNotMenu: true
                }
            },
        ]
    }

]