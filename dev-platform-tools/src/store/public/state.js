/*
 * @Author: Marlon
 * @Date: 2020-03-14 11:38:51
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-29 13:55:06
 * @Description: 临时数据库
 */
const state = {
    systemList: [], // 系统列表
    menuList: [], // 菜单列表
    breadcrumbList: [], // 面包屑
    userInfo: {}, // 用户信息
    data: {// 拓扑图-工具
        scale: 1,
        lineName: 'curve',
        fromArrowType: '',
        toArrowType: 'triangleSolid',
        locked: 0
    }
}

export default state;