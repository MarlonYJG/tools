/*
 * @Author: Marlon
 * @Date: 2020-04-16 09:40:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-04 15:43:28
 * @Description: 旧版-ETL——废弃
 */ 
// import Vue from 'vue'
// import Router from 'vue-router'

import system from '@/config/system.config.js'
const { PLATFORM } = system
// 数据源信息
// import dataInfo from '@/views/etl-config/data-source-manage/data-info'
const dataInfo = () => import('@/views/etl-config/data-source-manage/data-info');
// 作业列表
// import taskList from '@/views/etl-config/task-rule/task-list'
const taskList = () => import('@/views/etl-config/task-rule/task-list');

// 转换规则配置
// import ruleConfig from '@/views/etl-config/task-config/rule-config'
const ruleConfig = () => import('@/views/etl-config/task-config/rule-config');

// 转换规则配置详情
// import ruleConfigDetail from '@/views/etl-config/task-config/rule-config-detail'
const ruleConfigDetail = () => import('@/views/etl-config/task-config/rule-config-detail');

// 作业调度管理-定时任务
// import timeTask from '@/views/job-management/job-schedule-management/time-task'
const timeTask = () => import('@/views/etl-config/job-management/job-schedule-management/time-task');

// 作业调度管理-依赖任务
// import relyTask from '@/views/job-management/job-schedule-management/rely-task'
const relyTask = () => import('@/views/etl-config/job-management/job-schedule-management/rely-task');
// 前端数据管理
// import editData from '@/views/data-management/front-data/index'
const editData = () => import('@/views/etl-config/data-management/front-data/index');

//ETL数据追溯
// import jobList from '@/views/etl-config/data-trace/job-list'
const jobList = () => import('@/views/etl-config/data-trace/job-list');
// import tableTransfer from '@/views/etl-config/data-trace/table-transfer'
const tableTransfer = () => import('@/views/etl-config/data-trace/table-transfer');
// import exceptionDataOverall from '@/views/etl-config/data-trace/exception-data-overall'
const exceptionDataOverall = () => import('@/views/etl-config/data-trace/exception-data-overall');
// import IllegalDataReport from '@/views/etl-config/data-trace/illegal-data-report'
const IllegalDataReport = () => import('@/views/etl-config/data-trace/illegal-data-report');

// Vue.use(Router)

export default [
    {
      path: '/',
      redirect: '/menuNav1/dataInfo'
    },
    {
      path: '/menuNav1',
      name: 'Layout1',
      redirect: '/menuNav1/dataInfo',
      component: resolve => {
        require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
    },
      meta: {
        title: '数据ETL配置'
      },
      children: [{
          path: 'dataInfo',
          name: 'dataInfo',
          component: dataInfo,
          meta: {
            title: '数据源管理'
          },
          children: [{
            path: 'dataInfo',
            name: 'dataInfo',
            meta: {
              title: '数据源信息'
            },
            component: dataInfo,
          }],
        },
        {
          path: 'taskList',
          name: 'taskList',
          component: taskList,
          meta: {
            title: '作业规则'
          },
        },
        {
          path: 'ruleConfig',
          name: 'ruleConfig',
          component: ruleConfig,
          meta: {
            title: '作业配置'
          },
        },
        {
          path: 'ruleConfigDetail',
          name: 'ruleConfigDetail',
          component: ruleConfigDetail,
          hidden: true,
          meta: {
            title: ''
          },
        },
        {
          path: 'jobList',
          name: 'jobList',
          component: jobList,
          meta: {
            title: '数据追溯'
          },
        },
        {
          path: 'tableTransfer',
          name: 'tableTransfer',
          component: tableTransfer,
          meta: {
            title: ''
          },
        },
        {
          path: 'exceptionDataOverall',
          name: 'exceptionDataOverall',
          component: exceptionDataOverall,
          meta: {
            title: ''
          },
        },
        {
          path: 'IllegalDataReport',
          name: 'IllegalDataReport',
          component: IllegalDataReport,
          meta: {
            title: ''
          },
        }
      ]
    },
    {
      path: '/menuNav2',
      name: 'Layout2',
      redirect: '/menuNav2/timeTask',
      component: resolve => {
        require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
    },
      meta: {
        title: '作业调度管理'
      },
      children: [{
          path: 'timeTask',
          name: 'timeTask',
          component: timeTask,
          meta: {
            title: '定时任务'
          },
        },
        {
          path: 'relyTask',
          name: 'relyTask',
          component: relyTask,
          meta: {
            title: '依赖任务'
          },
        }
      ]
    },
    {
      path: '/menuNav3',
      name: 'Layout3',
      redirect: '/menuNav3/index',
      component: resolve => {
        require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
    },
      meta: {
        title: '配置数据管理'
      },
      children: [{
        path: 'index',
        name: 'index',
        component: editData,
        meta: {
          title: '前端数据管理'
        },
      }]
    },
  ];
