/*
 * @Author: Marlon
 * @Date: 2020-05-17 21:54:13
 * @LastEditors: Marlon
 * @LastEditTime: 2020-12-07 09:22:33
 * @Description: 标道
 */

import OtherLayout from '@/views/bd/other'
import Login from '@/views/bd/login/login'
import Home from '@/views/bd/home/home'
import StandardQuery from '@/views/bd/bx-search'
import IndexQuery from '@/views/bd/index-query'
import bxQueryDetails from '@/views/bd/bx-search/details'
console.log(bxQueryDetails)

/* 个人中心 */
import indexPersonal from '@/views/bd/index-personal'; // 个人中心
import MyInformation from '@/views/bd/index-personal/my-information'; // 我的信息
import MySubscriptions from '@/views/bd/index-personal/my-subscriptions'; // 我的订阅
import MyCollection from '@/views/bd/index-personal/my-collection'; // 我的收藏

export default [
    {
        path: '/',
        name: '/',
        redirect: '/bd',
        meta: {
            title: '标道'
        },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '标道'
        },
    },
    {
        path: '/bd',
        name: 'bd',
        redirect: '/bd/home',
        component: OtherLayout,
        children: [
            {
                path: 'home',
                name: 'home',
                component: Home,
                meta: {
                    title: '首页'
                },
            },
            {
                path: 'bx-search',
                name: 'bx-search',
                component: StandardQuery,
                meta: {
                    title: '标讯查询'
                },
            },
            {
                path: 'bx-search-details',
                name: 'bx-search-details',
                component: bxQueryDetails,
                meta: {
                    title: '标讯查询详情'
                },
            },
            {
                path: 'index',
                name: 'index',
                component: IndexQuery,
                meta: {
                    title: '指标查询'
                },
            },
            /* 个人中心 */
            {
                path: 'index-personal',
                name: 'index-personal',
                component: indexPersonal,
                meta: {
                    title: '个人中心'
                },
                redirect: '/bd/index-personal/my-information',
                children: [
                    {
                        path: 'my-information',
                        name: 'my-information',
                        component: MyInformation,
                        meta: {
                            title: '我的信息'
                        }
                    },
                    {
                        path: 'my-subscriptions',
                        name: 'my-subscriptions',
                        component: MySubscriptions,
                        meta: {
                            title: '我的订阅'
                        }
                    },
                    {
                        path: 'my-collection',
                        name: 'my-collection',
                        component: MyCollection,
                        meta: {
                            title: '我的收藏'
                        }
                    }
                ]
            }
        ]
    },

]
