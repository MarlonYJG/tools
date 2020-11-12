'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      /* 
        恩铸：http://10.1.31.30:8060
        王超：http://10.1.92.95:8040
        晓鹏：http://10.1.31.25:8091
        余鹏飞：http://10.2.104.42:8090
        测试环境：http://10.0.204.111
        线上环境：http://gst-pro.glodon.com
        集成测试：http://10.0.104.13
      */
      // 登录、注销
      '/auth': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/auth': '/auth'
        },
      },
      /* ********************************** 数据中台 ************************************** */
      // 元数据管理
      '/md': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/md': '/md'
        },
      },
      // 数据管理
      '/dsm': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/dsm': '/dsm'
        },
      },
      // 数据采集
      '/dc': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/dc': '/dc'
        },
      },
      // 质量检测 
      '/dq': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/dq': '/dq'
        }
      },
      // 数据标准：数据集
      '/ds': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/ds': '/ds'
        }
      },
      // 规则树
      '/rc': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/rc': '/rc'
        }
      },
      // ETL
      '/etl': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/etl': '/etl'
        }
      },
      // 自助智能分析 
      '/di': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/di': '/di'
        }
      },
      /* ********************************** 业务中台 ************************************** */
      //指标中心
      '/constructionservice': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/constructionservice': '/constructionservice'
        },
      },
      // 指标中心 数据集
      '/di': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/di': '/di'
        }
      },
      // 指标中心 指标地图 详情
      '/calculationservice': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/calculationservice': '/calculationservice'
        }
      },
      // 用户画像
      '/profile': {
        target: 'http://10.0.204.111',
        changeOrigin: true,
        pathRewrite: {
          '^/profile': '/profile'
        }
      },
      /* ********************************** 产品 ************************************** */
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },
  test: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  local: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
