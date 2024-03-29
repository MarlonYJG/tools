#!/usr/bin/env node

// const config = require('./webpack.config.js');

let dev = (port) => {
    // 启动项目后自动打开浏览器
    config.plugins.push(new OpenBrowserPlugin({ url: `http://localhost:${port}` }))
    // 创建一个小型服务器
    new WebpackDevServer(webpack(config), {
        contentBase: './public',// 配置http服务器的文件目录
        hot: true, // 开启模块热替换
        historyApiFallback: true // 开启html5 History API网页
    }).listen(port, 'localhost', function (err, result) {
        if (err) {
            console.log(err);
        }
    });
}

exports.dev = function (...args) {
    console.log(...args);
    // const msg = format.apply(format, args)
    // console.log(chalk.white(prefix), sep, msg)
}