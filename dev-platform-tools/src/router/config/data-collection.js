/*
 * @Author: Marlon
 * @Date: 2020-02-24 09:05:44
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:33:03
 * @Description: 数据采集
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system

/* 隐藏页 */
const otherIndex = () => import('@/views/data-collection/other')
const dataStatistics = () => import('@/views/data-collection/other/data-statistics')

/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/data-collection')
//  全局概览
const ProjectM = () => import('@/views/data-collection/overview/project-manage')
const ProjectC = () => import('@/views/data-collection/overview/project-conf')
// 采集任务管理
const TaskList = () => import('@/views/data-collection/task-collection-manage/task-list')
const TaskConf = () => import('@/views/data-collection/task-collection-manage/rule-conf')

export default [
    {
        path: '/',
        name: 'home',
        redirect: '/dataCollection',
    },
    {
        path: '/index',
        name: 'index',
        redirect: '/dataCollection',
    },
    {
        path: '/dataCollection',
        name: 'dataCollection',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        redirect: '/dataCollection/whole',
        meta: {
            title: '数据采集'
        },
        children: [
            {
                path: 'whole',
                name: 'whole',
                component: OneIndex,
                redirect: '/dataCollection/whole/projectManage',
                meta: {
                    title: '全局概览'
                },
                children: [
                    {
                        path: 'projectManage',
                        name: 'projectManage',
                        component: ProjectM,
                        meta: {
                            title: '项目管理',
                        }
                    }, {
                        path: 'projectConf',
                        name: 'projectConf',
                        component: ProjectC,
                        meta: {
                            title: '项目信息配置'
                        }
                    }
                ]
            },
            {
                path: 'task',
                name: 'task',
                component: OneIndex,
                redirect: '/dataCollection/task/list',
                meta: {
                    title: '采集任务管理'
                },
                children: [
                    {
                        path: 'list',
                        name: 'list',
                        component: TaskList,
                        meta: {
                            title: '任务列表'
                        }
                    },
                    {
                        path: 'conf',
                        name: 'conf',
                        component: TaskConf,
                        meta: {
                            title: '转换规则配置'
                        }
                    },
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
                path: 'dataStatistics',
                name: 'dataStatistics',
                component: dataStatistics,
                meta: {
                    title: '数据采集统计',
                    isNotMenu: true
                }
            },
        ]
    }

]