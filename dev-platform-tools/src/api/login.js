/*
 * @Author: Marlon
 * @Date: 2020-08-18 14:35:34
 * @LastEditors: Marlon
 * @LastEditTime: 2020-08-28 16:36:56
 * @Description: 登录
 */
import service from 'utils/request'

export const BaseLogin = '/auth'

export default {
    // 获取公钥
    __publicKey(data) {
        return service({
            url: BaseLogin + '/login/getPublicKey',
            method: 'post',
            data
        })
    },
    // 登录
    __publicLogin(data) {
        return service({
            url: BaseLogin + '/login',
            method: 'post',
            data
        })
    },
    // 注销
    __publicLogout() {
        return service({
            url: BaseLogin + '/auth/logout',
            method: 'get',
        })
    }
}