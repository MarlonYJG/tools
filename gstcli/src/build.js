#!/usr/bin/env node

let build = () => {
    // 打包
    webpack(config, function (err, stats) {
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }))
        console.log(symbol.success, chalk.green(' 打包完成'));
        process.exit(1);
    })
}

exports.build = function (...args) {
    console.log(...args);
    // const msg = format.apply(format, args)
    // console.log(chalk.white(prefix), sep, msg)
}