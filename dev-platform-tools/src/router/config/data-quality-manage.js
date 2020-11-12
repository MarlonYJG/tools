/*
 * @Author: Marlon
 * @Date: 2020-03-02 21:39:37
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:33:41
 * @Description: 数据质量管理
 */

import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/data-quality-manage/other/index')


/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/data-quality-manage')
// 数据质量管理
const Project = () => import('@/views/data-quality-manage/task-manage/project-manage')
const Task = () => import('@/views/data-quality-manage/task-manage/task-list')
const Rule = () => import('@/views/data-quality-manage/task-manage/rule-config/index.vue')
// 
const List = () => import('@/views/data-quality-manage/audit-result/list')
const Query = () => import('@/views/data-quality-manage/audit-result/query')
const Report = () => import('@/views/data-quality-manage/audit-result/report')
export default [
    {
        path: '/',
        name: 'home',
        redirect: '/dataQuality',
    },
    {
        path: '/dataQuality',
        name: 'dataQuality',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        redirect: '/dataQuality/taskManage',
        meta: {
            title: '数据质量管理'
        },
        children: [
            {
                path: 'taskManage',
                name: 'taskManage',
                component: OneIndex,
                redirect: '/dataQuality/taskManage/project',
                meta: {
                    title: '任务管理'
                },
                children: [
                    {
                        path: 'project',
                        name: 'project',
                        component: Project,
                        meta: {
                            title: '项目管理'
                        }
                    },
                    {
                        path: 'task',
                        name: 'task',
                        component: Task,
                        meta: {
                            title: '任务列表'
                        }
                    },
                    {
                        path: 'rule',
                        name: 'rule',
                        component: Rule,
                        meta: {
                            title: '质量规则配置'
                        }
                    },
                ]
            },
            {
                path: 'auditResult',
                name: 'auditResult',
                component: OneIndex,
                redirect: '/dataQuality/auditResult/list',
                meta: {
                    title: '审核结果'
                },
                children: [
                    {
                        path: 'list',
                        name: 'list',
                        component: List,
                        meta: {
                            title: '任务执行结果列表'
                        }
                    },
                    {
                        path: 'query',
                        name: 'query',
                        component: Query,
                        meta: {
                            title: '质量结果详情查询'
                        }
                    },
                    {
                        path: 'report',
                        name: 'report',
                        component: Report,
                        meta: {
                            title: '数据质量报告'
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
        ]
    }

]