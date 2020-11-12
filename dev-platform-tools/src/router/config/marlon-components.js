/*
 * @Author: Marlon
 * @Date: 2020-10-29 10:36:03
 * @LastEditors: Marlon
 * @LastEditTime: 2020-11-03 16:34:22
 * @Description: 组件库-页面
 */
import system from '@/config/system.config.js'
const { PLATFORM } = system
const TopologyTool = () => import('@/views/marlon-components/topology-tool')

export default [
    {
        path: '/components',
        name: 'components',
        meta: {
            title: '组件库',
        },
        component: TopologyTool
    },
]
