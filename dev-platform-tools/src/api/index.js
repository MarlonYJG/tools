/*
 * @Author: Marlon
 * @Date: 2020-02-21 14:37:26
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-30 14:57:35
 * @Description: API系统
 */
import system from '@/config/system.config.js'

let PK = ''
const { PROJECTKEY } = system
PK = JSON.parse(JSON.stringify(PROJECTKEY))

export default require(`./${PK}`).default