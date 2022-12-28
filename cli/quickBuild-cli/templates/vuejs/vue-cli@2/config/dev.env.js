'use strict'
const merge = require('webpack-merge')
const releaseEnv = require('./release.env')
const prodEnv = require('./prod.env')

module.exports = merge(releaseEnv, prodEnv, {
  NODE_ENV: '"development"'
})
