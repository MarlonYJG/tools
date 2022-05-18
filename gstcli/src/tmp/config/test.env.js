/*
 * @Author: Marlon
 * @Date: 2020-07-18 14:08:56
 * @LastEditors: Marlon
 * @Description: 
 */
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
const systemCode = `'${JSON.stringify(process.argv[5])}'`;// systemCode
module.exports = {
  NODE_ENV: '"testing"',
  API_HOST: '""',
  Mock: false,
  Project_key: project,
  PLATFORM_NAME: platform,
  Project_JYDSJ: '""',
  SYSTEM_CODE: systemCode,
  HEADER_TITLE: '""',
  LOGIN_TITLE: '"广联达公共资源交易大数据分析平台"'
}
