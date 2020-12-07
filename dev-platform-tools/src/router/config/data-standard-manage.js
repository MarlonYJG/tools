/*
 * @Author: Marlon
 * @Date: 2020-07-20 10:33:42
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 11:00:53
 * @Description: 数据标准管理
 */

import { PRODUCT } from '@/config'
/* 隐藏页 */
const otherIndex = () => import('@/views/data-standard-manage/other/index')
// 顶板数据-查看详情
const standardDetails = () => import('@/views/data-standard-manage/other/standard-details/index')

/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/data-standard-manage')

/* 数据标准编辑管理 */
// 项目管理
const proManage = () => import('@/views/data-standard-manage/edit-management/region-manage/index')
// 分类管理
const claManage = () => import('@/views/data-standard-manage/edit-management/classify-manage/index')
// 数据集
const dataSet = () => import('@/views/data-standard-manage/edit-management/data-set')
// 数据标准属性
const dataStandAttr = () => import('@/views/data-standard-manage/edit-management/data-stand-attr')
// 代码集
const codeSet = () => import('@/views/data-standard-manage/edit-management/code-set')

/* 规则管理 */
// 数据清洗规则
const clearRules = () => import('@/views/data-standard-manage/rules-management/clean-rules')
// 数据质量规则
const qualityRules = () => import('@/views/data-standard-manage/rules-management/quality-rules')
const rulesStatistics = () => import('@/views/data-standard-manage/rules-management/rules-statistics')

/* 数据标准发布管理 */
// 定板数据标准
const dataFixed = () => import('@/views/data-standard-manage/issue-management/data-fixed')
// 数据采集标准
const collection = () => import('@/views/data-standard-manage/issue-management/collection')


// 规则统计

export default [
    {
        path: '/',
        name: 'index',
        redirect: '/dataStandardManage',
    },
    {
        path: '/dataStandardManage',
        name: 'dataStandardManage',
        component: resolve => {
            require([`@/layout/gst`], resolve);
        },
        redirect: '/dataStandardManage/editManage',
        meta: {
            title: '数据标准管理'
        },
        children: [
            {
                path: 'editManage',
                name: 'editManage',
                component: OneIndex,
                redirect: '/dataStandardManage/editManage/projectManage',
                meta: {
                    title: '数据标准编辑管理'
                },
                children: [
                    {
                        path: 'projectManage',
                        name: 'projectManage',
                        component: proManage,
                        meta: {
                            title: '项目管理',
                        }
                    }, {
                        path: 'classifyManage',
                        name: 'classifyManage',
                        component: claManage,
                        meta: {
                            title: '分类管理'
                        }
                    }, {
                        path: 'dataSet',
                        name: 'dataSet',
                        component: dataSet,
                        meta: {
                            title: '数据集'
                        }
                    }, {
                        path: 'dataStandAttr',
                        name: 'dataStandAttr',
                        component: dataStandAttr,
                        meta: {
                            title: '数据标准属性'
                        }
                    }, {
                        path: 'codeSet',
                        name: 'codeSet',
                        component: codeSet,
                        meta: {
                            title: '代码集'
                        }
                    }
                ]
            },
            {
                path: 'ruleManage',
                name: 'ruleManage',
                component: OneIndex,
                redirect: '/dataStandardManage/ruleManage/cleanRules',
                meta: {
                    title: '规则管理'
                },
                children: [
                    {
                        path: 'cleanRules',
                        name: 'cleanRules',
                        component: clearRules,
                        meta: {
                            title: '数据清洗规则'
                        }
                    },
                    {
                        path: 'qualityRules',
                        name: 'qualityRules',
                        component: qualityRules,
                        meta: {
                            title: '数据质量规则'
                        }
                    },
                    {
                        path: 'ruleStatis',
                        name: 'ruleStatis',
                        component: rulesStatistics,
                        meta: {
                            title: '规则统计'
                        }
                    }
                ]
            },
            {
                path: 'releaseManage',
                name: 'releaseManage',
                component: OneIndex,
                redirect: '/dataStandardManage/releaseManage/dataFixed',
                meta: {
                    title: '数据标准发布管理'
                },
                children: [
                    {
                        path: 'dataFixed',
                        name: 'dataFixed',
                        component: dataFixed,
                        meta: {
                            title: '定版数据标准'
                        }
                    },
                    {
                        path: 'collection',
                        name: 'collection',
                        component: collection,
                        meta: {
                            title: '数据采集标准'
                        }
                    }
                ]
            }
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
                path: 'standardDetails',
                name: 'standardDetails',
                component: standardDetails,
                meta: {
                    title: '查看详情'
                }
            }
        ]
    }

]