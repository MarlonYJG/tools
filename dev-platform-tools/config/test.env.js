/*
 * @Author: Marlon
 * @Date: 2020-07-18 14:08:56
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-12 14:15:33
 * @Description: 
 */
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
module.exports = {
  NODE_ENV: '"testing"',
  Project_key: project,
  PLATFORM_NAME: platform
}
