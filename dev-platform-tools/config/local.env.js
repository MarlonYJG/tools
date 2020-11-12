/*
 * @Author: Marlon
 * @Date: 2020-07-14 16:44:08
 * @LastEditors: Marlon
 * @LastEditTime: 2020-10-12 14:14:57
 * @Description: 
 */ 
'use strict'
const project = `'${JSON.stringify(process.argv[2])}'`;
const platform = `'${JSON.stringify(process.argv[3])}'`;
module.exports = {
  NODE_ENV: '"local"',
  Project_key: project,
  PLATFORM_NAME: platform
}
