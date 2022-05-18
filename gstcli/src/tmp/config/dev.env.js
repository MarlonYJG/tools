'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HEADER_TITLE: '""',
  LOGIN_TITLE: '"广联达公共资源交易大数据分析平台"'
})
