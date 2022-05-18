/*
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @Description: 
 */
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
const systemCode = `'${JSON.stringify(process.argv[5])}'`;// systemCode


//下面的步骤就是获取命令行参数。
let env = ''
if (process.platform !== 'darwin') {
  let argvs = JSON.parse(process.env.npm_config_argv).original;
  env = argvs.slice(2)[0] ? argvs.slice(2)[0].substring(2) : 'dev';
}

module.exports = {
  NODE_ENV: '"production"',
  API_HOST: '""',
  Mock: false,
  Project_key: project,
  PLATFORM_NAME: platform,
  Project_JYDSJ: '""',
  ITEM_NAME: JSON.stringify(env),
  SYSTEM_CODE: systemCode,
  HEADER_TITLE: '""',
  LOGIN_TITLE: '"广联达公共资源交易大数据分析平台"'
}
