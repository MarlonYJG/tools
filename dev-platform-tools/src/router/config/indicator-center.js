/*
 * @Author: 赵鹏鹏
 * @Date: 2020-05-17 21:54:13
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 15:45:41
 * @Description: 指标中心
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system

/* 隐藏页 */
const otherIndex = () => import('@/views/indicator-center/other/index')


/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/indicator-center')

// 指标中心-指标构建

//业务板块管理
const BusinessSegments = () => import('@/views/indicator-center/indicator-build/indicator-construction')
// 数据域管理
const DataFields = () => import('@/views/indicator-center/indicator-build/data-domain-mangement')
// 指标定义
const Indicators = () => import('@/views/indicator-center/indicator-build/indicator-definition')
// 维度定义
const Dimension = () => import('@/views/indicator-center/indicator-build/dimension-definition')

// 指标中心-指标管理

// 数据期定义
const PeriodDefinition = () => import('@/views/indicator-center/indicator-tube/period-definition')
// 派生指标管理
const DerivedIndicators = () => import('@/views/indicator-center/indicator-tube/derived-indicators')
// 指标社群管理
const IndicatorCommunity = () => import('@/views/indicator-center/indicator-tube/indicator-community')
// 指标构建
const IndicatorBuild = () => import('@/views/indicator-center/indicator-tube/build/index')

/* 指标中心-指标展示 */
const IndicatorMap = () => import('@/views/indicator-center/indicator-view/map')
const IndicatorCollect = () => import('@/views/indicator-center/indicator-view/collect')
const IndicatorMapDetails = () => import('@/views/indicator-center/indicator-view/map/map-details')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/indicator',
    },
    {
        path: '/indicator',
        name: 'indicator',
        component: resolve => {
            require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
        },
        redirect: '/indicator/construct',
        meta: {
            title: '指标中心'
        },
        children: [
            {
                path: 'construct',
                name: 'construct',
                component: OneIndex,
                meta: {
                    title: '指标构建'
                },
                redirect: '/indicator/construct/BusinessSegments',
                children: [{
                    path: 'BusinessSegments',
                    name: 'BusinessSegments',
                    component: BusinessSegments,
                    meta: {
                        title: '业务板块管理'
                    }
                }, {
                    path: 'DataFields',
                    name: 'DataFields',
                    component: DataFields,
                    meta: {
                        title: '数据域管理'
                    }
                }, {
                    path: 'Indicators',
                    name: 'Indicators',
                    component: Indicators,
                    meta: {
                        title: '指标定义'
                    }
                }, {
                    path: 'Dimension',
                    name: 'Dimension',
                    component: Dimension,
                    meta: {
                        title: '维度定义'
                    }
                }]
            },
            {
                path: 'management',
                name: 'management',
                component: OneIndex,
                meta: {
                    title: '指标管理'
                },
                redirect: '/indicator/management/periodDefinition',
                children: [{
                    path: 'periodDefinition',
                    name: 'periodDefinition',
                    component: PeriodDefinition,
                    meta: {
                        title: '数据期定义'
                    }
                }, {
                    path: 'derivedIndicators',
                    name: 'derivedIndicators',
                    component: DerivedIndicators,
                    meta: {
                        title: '派生指标管理'
                    }
                }, {
                    path: 'indicatorCommunity',
                    name: 'indicatorCommunity',
                    component: IndicatorCommunity,
                    meta: {
                        title: '指标社群管理'
                    }
                },
                {
                    path: 'indicatorBuild',
                    name: 'indicatorBuild',
                    component: IndicatorBuild,
                    meta: {
                        title: '指标构建'
                    }
                }
                ]
            },
            {
                path: 'view',
                name: 'view',
                component: OneIndex,
                meta: {
                    title: '指标展示'
                },
                redirect: '/indicator/view/map',
                children: [{
                    path: 'map',
                    name: 'map',
                    component: IndicatorMap,
                    meta: {
                        title: '指标地图'
                    }
                }, {
                    path: 'collect',
                    name: 'collect',
                    component: IndicatorCollect,
                    meta: {
                        title: '我的收藏'
                    }
                }, {
                    path: 'mapDetails',
                    name: 'mapDetails',
                    component: IndicatorMapDetails,
                    meta: {
                        title: '详情',
                        parentPath: '/indicator/view/map'
                    }
                }]
            }
        ]
    },
]
