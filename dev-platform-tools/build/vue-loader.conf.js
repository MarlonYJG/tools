/*
 * @Author: Marlon
 * @Date: 2020-02-18 16:21:32
 * @LastEditors: Marlon
 * @LastEditTime: 2020-07-14 17:18:03
 * @Description: 
 */
'use strict'
const utils = require('./utils')
const config = require('../config')
let isProduction = false;
if (process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'local') {
  isProduction = true
}
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
