/*
 * @Author: Marlon
 * @Date: 2020-07-14 16:44:08
 * @LastEditors: Marlon
 * @Description: 
 */
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
const JYDSJ = `'${JSON.stringify(process.argv[4])}'`;// 类型：产品/项目
const systemCode = `'${JSON.stringify(process.argv[5])}'`;// systemCode
module.exports = {
  NODE_ENV: '"local"',
  API_HOST: '""',
  Mock: false,
  Project_key: project,
  PLATFORM_NAME: platform,
  Project_JYDSJ: JYDSJ,
  SYSTEM_CODE: systemCode,
  HEADER_TITLE: '""',
  LOGIN_TITLE: '"广联达公共资源交易大数据分析平台"'
}
