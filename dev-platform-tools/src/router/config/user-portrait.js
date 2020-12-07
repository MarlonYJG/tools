/*
 * @Author: Marlon
 * @Date: 2020-05-12 17:01:58
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-20 15:19:04
 * @Description: 用户画像
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
/* 隐藏页 */
const otherIndex = () => import('@/views/user-portrait/other')


/* 非隐藏页 */
// 一级菜单的默认页(公共/私有)
const OneIndex = () => import('@/views/user-portrait')

// 标签管理-标签定义
const LabelMaintain = () => import('@/views/user-portrait/label-manage/label-maintain')
// 标签管理-标签设置
const LabelSet = () => import('@/views/user-portrait/label-set')


export default [
    {
        path: '/',
        name: 'home',
        redirect: '/userPortrait',
    },
    {
        path: '/userPortrait',
        name: 'userPortrait',
        component: resolve => {
            require([`@/layout/${PLATFORM.toLowerCase()}`], resolve);
        },
        redirect: '/userPortrait/labelManage',
        meta: {
            title: '用户画像'
        },
        children: [
            {
                path: 'labelManage',
                name: 'labelManage',
                component: OneIndex,
                meta: {
                    title: '标签管理'
                },
                redirect: '/userPortrait/labelManage/LabelMaintain',
                children: [{
                    path: 'LabelMaintain',
                    name: 'LabelMaintain',
                    component: LabelMaintain,
                    meta: {
                        title: '标签定义'
                    }
                }, {
                    path: 'LabelSet',
                    name: 'LabelSet',
                    component: LabelSet,
                    meta: {
                        title: '标签设置'
                    }
                }]
            },

        ]
    },
]
