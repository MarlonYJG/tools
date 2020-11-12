/*
 * @Author: Marlon
 * @Date: 2020-07-25 19:28:33
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:34:43
 * @Description: 规则中心
 */

import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/rule-center/other/index')


/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/rule-center')


/* 规则引擎 */
// 规则定义
const RuleDefinition = () => import('@/views/rule-center/rule-engine/definition')

export default [
    {
        path: '/',
        name: 'index',
        redirect: '/ruleCenter',
    },
    {
        path: '/ruleCenter',
        name: 'ruleCenter',
        component: resolve => {
            require([`@/layout/${PLATFORM}`], resolve);
        },
        redirect: '/ruleCenter/engine',
        meta: {
            title: '规则中心'
        },
        children:[
            {
                path: 'engine',
                name: 'engine',
                component: OneIndex,
                redirect: '/ruleCenter/engine/definition',
                meta: {
                    title: '规则引擎'
                },
                children:[{
                    path: 'definition',
                    name: 'definition',
                    component: RuleDefinition,
                    meta: {
                        title: '规则定义',
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
        children:[]
    }
]
