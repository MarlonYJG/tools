/*
 * @Author: 赵鹏鹏
 * @Date: 2020-11-12 09:56:17
 * @LastEditors: 赵鹏鹏
 * @LastEditTime: 2020-11-12 10:08:48
 * @Description: 我的订阅-Api
 */
import mySubscriptions from './my-subscriptions'; // 我的订阅
import myCollection from './my-collection'; // 我的收藏

export default Object.assign(myCollection, mySubscriptions);