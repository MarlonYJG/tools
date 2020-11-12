/*
 * @Author: Marlon
 * @Date: 2020-10-30 16:05:15
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 16:24:56
 * @Description: 产品(项目)级配置
 */
import { PRODUCT, PRODUCTLIST } from './index'

let PRODUCT_CONFIG = null;// 产品配置
for (const key in PRODUCTLIST) {
    if (PRODUCTLIST.hasOwnProperty(key)) {
        if (PRODUCT === key) {
            PRODUCT_CONFIG = PRODUCTLIST[key]
        }
    }
}

export default PRODUCT_CONFIG