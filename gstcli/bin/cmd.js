#!/usr/bin/env node

require('../src/main')



// const program = require('commander')
// const inquirer = require('inquirer')
// const path = require('path')
// const exec = require('child_process').exec;
// const ora = require('ora')
// const download = require('download-git-repo')
// const utils = require('../src/utils')
// const fs = require('fs')

// console.log("----start----")
// // 打印参数
// // console.log(process.argv)

// function resolve(dir) {
//     return path.join(__dirname, '..', dir)
// }
// console.log(__dirname);

// 1、创建工作空间
// program
//     .command('workspace <workespaceName>')
//     .description('create a new workspace')
//     .alias('w')
//     .action((workespaceName, options, command) => {
//         console.log(workespaceName)
//         console.log(options);
//         exec(`mkdir ${workespaceName} && cd ${workespaceName}`, function (error, stdout, stderr) {
//             console.log(`The workspace(${workespaceName}) was created successfully`);
//         });
//         // // 创建 公共
//         // exec(`cd ${workespaceName} && mkdir com`, function (error, stdout, stderr) {
//         // });

//         inquirer
//             .prompt([
//                 {
//                     type: 'checkbox',
//                     name: 'gst',
//                     message: '请选择类型(数据底座/数据应用)',
//                     default: 0,
//                     choices: [
//                         {
//                             value: 1,
//                             name: 'datahub'
//                         }, {
//                             value: 2,
//                             name: 'dataapplication'
//                         }]
//                 }
//             ])
//             .then((answer) => {
//                 answer.gst.forEach(item => {
//                     switch (item) {
//                         case 1:
//                             {
//                                 let spinner = ora()
//                                 spinner.text = `正在下载数据底座(gst-datahub)...`
//                                 spinner.start()

//                                 download(
//                                     'direct:https://geek.glodon.com/scm/gst/gst-datahub.git',
//                                     `${workespaceName}/gst-datahub`,
//                                     { clone: true },
//                                     function (err) {
//                                         if (err) {
//                                             spinner.fail('数据底座(gst-datahub)下载失败')
//                                             // errLog(err)
//                                         } else {
//                                             spinner.succeed('数据底座(gst-datahub)下载成功')
//                                             // successLog('项目初始化完成')
//                                         }
//                                     }
//                                 )
//                             }
//                             break;
//                         case 2:
//                             {
//                                 let spinner = ora()
//                                 spinner.text = `正在下载数据应用(gst-dataapplication)...`
//                                 spinner.start()
//                                 download(
//                                     'direct:https://geek.glodon.com/scm/gst/gst-dataapplication.git',
//                                     `${workespaceName}/gst-dataapplication`,
//                                     { clone: true },
//                                     function (err) {
//                                         if (err) {
//                                             spinner.fail('数据应用(gst-dataapplication)下载失败')
//                                             // errLog(err)
//                                         } else {
//                                             spinner.succeed('数据应用(gst-dataapplication)下载成功')
//                                             // successLog('项目初始化完成')
//                                         }
//                                     }
//                                 )
//                             }
//                         default:
//                             break;
//                     }
//                 });
//             }).catch(error => {
//                 console.error(error, 'gstcli--log');
//             });
//     })

// // 复制文件夹所有
// function copyDir(srcDir, tarDir, cb) {
//     if (fs.existsSync(tarDir)) {
//         fs.readdir(srcDir, function (err, files) {
//             var count = 0
//             var checkEnd = function () {
//                 console.log("进度", count)
//                 ++count == files.length && cb && cb()
//             }

//             if (err) {
//                 checkEnd()
//                 return
//             }

//             files.forEach(function (file) {
//                 var srcPath = path.join(srcDir, file)
//                 var tarPath = path.join(tarDir, file)

//                 fs.stat(srcPath, function (err, stats) {
//                     if (stats.isDirectory()) {
//                         fs.mkdir(tarPath, function (err) {
//                             if (err) {
//                                 console.log(err)
//                                 return
//                             }

//                             copyDir(srcPath, tarPath, checkEnd)
//                             console.log("复制文件完成", srcPath)
//                         })
//                     } else {
//                         copyFile(srcPath, tarPath, checkEnd)
//                         console.log("复制文件完成", srcPath)
//                     }
//                 })
//             })

//             //为空时直接回调
//             files.length === 0 && cb && cb()
//         })

//     } else {
//         fs.mkdir(tarDir, function (err) {
//             if (err) {
//                 console.log(err)
//                 return
//             }
//             console.log('创建文件夹', tarDir)
//             copyDir(srcDir, tarDir, cb)
//         })
//     }

// }
// // 复制文件
// function copyFile(srcPath, tarPath, cb) {
//     var rs = fs.createReadStream(srcPath)
//     rs.on('error', function (err) {
//         if (err) {
//             console.log('read error', srcPath)
//         }
//         cb && cb(err)
//     })

//     var ws = fs.createWriteStream(tarPath)
//     ws.on('error', function (err) {
//         if (err) {
//             console.log('write error', tarPath)
//         }
//         cb && cb(err)
//     })

//     ws.on('close', function (ex) {
//         cb && cb(ex)
//     })

//     rs.pipe(ws)
//     console.log("复制文件完成", srcPath)
// }

// 初始化工作空间
// program
//     .command('init')
//     .description('初始化工作空间')
//     .action((source, destination) => {
//         console.log('初始化工作空间');
//         // utils.loadCmd(,)
//         console.log(process.cwd());
//         console.log(resolve('src/tmp'));
//         // console.log(path.normalize(path.join(process.cwd(), '')));

//         copyDir(resolve('src/tmp'), process.cwd(), () => {
//             console.log('======================');
//         })
//     });


// 安装依赖
// program
//     .command('install')
//     .alias('i')
//     .description('安装依赖')
//     .action((source, destination) => {
//         console.log('安装依赖');
//         // console.log(resolve());
//         utils.loadCmd(`npm install`, '安装依赖')
//     });

// 启动
// program
//     .command('dev')
//     .alias('i')
//     .description('启动')
//     .action((source, destination) => {
//         console.log('启动');
//         // console.log(resolve());
//         // utils.loadCmd(`npm install`, '安装依赖')
//     });


// 创建项目
// program
//     .command('create <projectName>')
//     .alias('c')
//     .description('创建项目')
//     .action((source, destination) => {
//         console.log('创建项目');
//         // console.log(resolve());
//         // utils.loadCmd(`npm install`, '安装依赖')
//     });

// 4、拉取代码


// 5、提交代码

// program.version('1.0.0', '-v, --vers', 'output the current version').parse(process.argv)
