/*
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-12 14:14:37
 * @Description: 
 */
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
module.exports = {
  NODE_ENV: '"production"',
  Project_key: project,
  PLATFORM_NAME: platform
}
