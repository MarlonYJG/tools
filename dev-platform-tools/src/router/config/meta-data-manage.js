/*
 * @Author: Marlon
 * @Date: 2020-02-20 21:57:24
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:34:32
 * @Description: 元数据管理
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/meta-data-manage/other/index')
const dataDetails = () => import('@/views/meta-data-manage/other/data-standard-details')

/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/meta-data-manage')
//  全局概览
const Index = () => import('@/views/meta-data-manage/overview')
const OProSta = () => import('@/views/meta-data-manage/overview/project-statistics')
// 元数据维护
const MLabMLibary = () => import('@/views/meta-data-manage/maintain/library-manage')
const MTable = () => import('@/views/meta-data-manage/maintain/table-manage')
const MTableInfo = () => import('@/views/meta-data-manage/maintain/table-info-manage')
// 元数据应用
const ADS = () => import('@/views/meta-data-manage/application/database-structure')
const ADataS = () => import('@/views/meta-data-manage/application/data-standard')
const ADataQ = () => import('@/views/meta-data-manage/application/data-query')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/metaData',
    },
    {
        path: '/index',
        name: 'index',
        redirect: '/metaData',
    },
    {
        path: '/metaData',
        name: 'metaData',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        redirect: '/metaData/index',
        meta: {
            title: '元数据管理'
        },
        children: [
            {
                path: 'index',
                name: 'metaDataIndex',
                component: Index,
                meta: {
                    title: '项目总览'
                }
            },
            {
                path: 'whole',
                name: 'whole',
                component: OneIndex,
                redirect: '/metaData/whole/statistics',
                meta: {
                    title: '全局概览'
                },
                children: [
                    {
                        path: 'statistics',
                        name: 'statistics',
                        component: OProSta,
                        meta: {
                            title: '项目统计'
                        }
                    }
                ]
            },
            {
                path: 'maintain',
                name: 'maintain',
                component: OneIndex,
                redirect: '/metaData/maintain/library',
                meta: {
                    title: '元数据维护'
                },
                children: [
                    {
                        path: 'library',
                        name: 'ibrary',
                        component: MLabMLibary,
                        meta: {
                            title: '库管理'
                        }
                    },
                    {
                        path: 'table',
                        name: 'table',
                        component: MTable,
                        meta: {
                            title: '表管理'
                        }
                    },
                    {
                        path: 'tableInfo',
                        name: 'tableInfo',
                        component: MTableInfo,
                        meta: {
                            title: '表明细信息管理'
                        }
                    },
                ]
            },
            {
                path: 'application',
                name: 'application',
                component: OneIndex,
                redirect: '/metaData/application/dataBase',
                meta: {
                    title: '元数据应用'
                },
                children: [{
                    path: 'dataBase',
                    name: 'dataBase',
                    component: ADS,
                    meta: {
                        title: '数据库结构同步'
                    }
                },
                {
                    path: 'dataStandard',
                    name: 'dataStandard',
                    component: ADataS,
                    meta: {
                        title: '数据标准匹配'
                    }
                },
                {
                    path: 'query',
                    name: 'query',
                    component: ADataQ,
                    meta: {
                        title: '数据查询'
                    }
                }]
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
