/*
 * @Author: Marlon
 * @Date: 2020-04-26 14:51:52
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-20 15:15:33
 * @Description: 数据开发-自助智能分析
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/self-service-analysis/other')
const DataSetUpdate = () => import('@/views/self-service-analysis/other/data-set')

/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/self-service-analysis')
//  数据准备
const DataSource = () => import('@/views/self-service-analysis/data-preparation/data-source')
const DataSet = () => import('@/views/self-service-analysis/data-preparation/data-set')


export default [
    {
        path: '/',
        name: 'home',
        redirect: '/analysis',
    },
    {
        path: '/index',
        name: 'index',
        redirect: '/analysis',
    },
    {
        path: '/analysis',
        name: 'analysis',
        component: resolve => {
            require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
        },
        redirect: '/analysis/preparation',
        meta: {
            title: '自助智能分析'
        },
        children: [
            {
                path: 'preparation',
                name: 'preparation',
                component: OneIndex,
                redirect: '/analysis/preparation/dataSource',
                meta: {
                    title: '数据准备'
                },
                children: [
                    {
                        path: 'dataSource',
                        name: 'dataSource',
                        component: DataSource,
                        meta: {
                            title: '数据源'
                        }
                    }, {
                        path: 'dataSet',
                        name: 'dataSet',
                        component: DataSet,
                        meta: {
                            title: '数据集'
                        }
                    }
                ]
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
                path: 'dataSetUpdate',
                name: 'dataSetUpdate',
                component: DataSetUpdate,
                meta: {
                    title: '数据集编辑',
                    isNotMenu: true
                }
            },
        ]
    }

]