/*
 * @Author: Marlon
 * @Date: 2020-04-26 14:44:24
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:33:14
 * @Description: 数据开发-ETL
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/data-dev-etl/other/index')
const dataDetails = () => import('@/views/data-dev-etl/other/project-statistics')

/* 非隐藏页 */
//  一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/data-dev-etl')
// 任务管理
const ProjectM = () => import('@/views/data-dev-etl/task-manage/project-manage');
const TaskList = () => import('@/views/data-dev-etl/task-manage/task-list');
const Rconfig = () => import('@/views/data-dev-etl/task-manage/rule-config/index');
// 执行作业管理
const Work = () => import('@/views/data-dev-etl/job-manage/work');
const ResultsList = () => import('@/views/data-dev-etl/job-manage/results-list');
const AddTask = () => import('@/views/data-dev-etl/job-manage/add-task');
export default [
    {
        path: '/',
        name: 'home',
        redirect: '/etl',
    },
    {
        path: '/etl',
        name: 'etl',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        redirect: '/etl/manage/projectManage',
        meta: {
            title: 'ETL'
        },
        children: [
            {
                path: 'manage',
                name: 'manage',
                component: OneIndex,
                meta: {
                    title: '任务管理'
                },
                redirect: '/etl/manage/projectManage',
                children: [
                    {
                        path: 'projectManage',
                        name: 'projectManage',
                        component: ProjectM,
                        meta: {
                            title: '项目管理'
                        }
                    },
                    {
                        path: 'taskList',
                        name: 'taskList',
                        component: TaskList,
                        meta: {
                            title: '任务列表'
                        }
                    },
                    {
                        path: 'config',
                        name: 'config',
                        component: Rconfig,
                        meta: {
                            title: 'ETL规则配置'
                        }
                    }
                ]
            },
            {
                path: 'list',
                name: 'list',
                component: OneIndex,
                meta: {
                    title: '执行作业管理'
                },
                redirect: '/etl/list/work',
                children: [{
                    path: 'work',
                    name: 'work',
                    component: Work,
                    meta: {
                        title: '作业编排'
                    }
                }, {
                    path: 'resultsList',
                    name: 'resultsList',
                    component: ResultsList,
                    meta: {
                        title: '执行结果列表'
                    }
                }, {
                    path: 'addTask',
                    name: 'addTask',
                    component: AddTask,
                    meta: {
                        title: '任务及转换'
                    }
                }]
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
                path: 'dataDetails',
                name: 'dataDetails',
                component: dataDetails,
                meta: {
                    title: 'ETL执行信息统计',
                    isNotMenu: true
                }
            },
        ]
    }

]