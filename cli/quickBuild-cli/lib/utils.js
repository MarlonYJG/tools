const ora = require('ora')
const fs = require('fs')
const child = require('child_process').exec;
const download = require('download-git-repo')
const process = require('process')
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

let loadCmd = async (cmd, text) => {
    let loading = ora();
    loading.start(`${text}: 命令执行中...`);
    await child(cmd);
    loading.succeed(`${text}: 命令执行完成`)
}

// 更新json配置文件
let updateJsonFile = (fileName, obj) => {
    return new Promise((resolve) => {
        if (fs.existsSync(fileName)) {
            // 读出模板下的package.json文件
            // let data = fs.readFileSync(fileName, { flag: 'r+' }).toString();
            fs.readFile(fileName, (err, data) => {
                if (err) return err;
                let str = data.toString();
                console.log(str, '======');
                let regex = /name/g;
                if (regex.exec(str)) {
                    str.replace(regex, 'aa')
                    console.log('依照大', str);
                };
                // console.log(str, '已修改');
                // fs.writeFileSync(fileName, 'asdfsadfsdf', function (err) {
                //     if (err) return err;
                // });
            })
            // 转为json对象
            // console.log(data, '=================');

            // let json = JSON.parse(data);
            // 将用户输入的更新到模板package.json文件
            // Object.keys(obj).forEach(key => {
            //     json[key] = obj[key];
            // });
            // 重写模板下的package.json文件
            // console.log(data, '已修改');
            // fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
            // fs.writeFileSync(fileName, data, 'utf-8');
            // resolve();
        }
    });
}




// 下载 code
let downloadHubApp = (repos, url, tarDir, branch) => {
    return new Promise((resolve, reject) => {
        let spinner = ora()
        spinner.start();
        let timer = setInterval(() => {
            spinner.color = 'yellow';
            spinner.text = `  正在下载 ${repos}:${branch} ...`
        }, 1000);
        download(
            `direct:${url}#${branch}`,
            `${tarDir}`,
            { clone: true },
            function (err) {
                clearInterval(timer);
                if (err) {
                    spinner.fail(`${repos}:${branch} 下载失败`)
                    reject(err)
                } else {
                    spinner.succeed(`${repos}:${branch} 下载成功`)
                    resolve('success')
                }
            }
        )
    })
}

// 文件是否存在
let isExist = async (name) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(name)) {
            console.log(chalk.red(`  文件夹名(${name})已被占用，请更换名字重新创建`))
            process.exit()
        } else {
            resolve(true);
        }
    });
}


// log
let log = console.log



// 安装依赖
let initStart = () => {
    return new Promise((resolve, reject) => {
        let spinner = ora()
        spinner.start()
        spinner.text = `  正在安装依赖...`
        child(`npm install`, function (error, stdout, stderr) {
            console.log(stdout);
            if (error) {
                log(chalk.red(`  依赖安装失败`))
                console.log();
                log(chalk.red(stderr));
                console.log();
                log(chalk.warning('  请尝试手动执行(npm install)'));
                process.exit()
            } else {
                log(chalk.green(`  依赖安装成功`))
                resolve(true)
            }
        });
    })
}

// 启动
let start = () => {
    return new Promise((resolve, reject) => {
        // 读出模板下的package.json文件
        const data = fs.readFileSync('package.json').toString();
        // 转为json对象
        let json = JSON.parse(data);
        if (json.scripts) {
            if (json.scripts.dev) {
                child(`npm run dev`, function (error, stdout, stderr) {
                    console.log(stdout);
                    if (error) {
                        log(chalk.red(stderr));
                        process.exit()
                    } else {
                        resolve(true)
                    }
                });
            } else if (json.scripts.start) {

            } else if (json.scripts.serve) {

            }
        }
    })
}

// process.cwd()





// ========= 创建工作空间 ========================================================
let createWorkSpace = (name) => {
    return new Promise((resolve, reject) => {
        isExist(name);
        child(`mkdir ${name} && cd ${name} && mkdir .gst`, function (error, stdout, stderr) {
            if (error) {
                log(chalk.red(`  ${name} 创建失败`))
                reject(false)
            } else {
                log(chalk.green(` 工作空间 [${name}] 创建成功 `))
                resolve(true)
            }
        });
    })
}

// ========= 创建项目 ========================================================
// 创建项目
let creatPro = (projectName) => {
    return new Promise((resolve, reject) => {
        isExist(projectName);
        child(`mkdir ${projectName}`, function (error, stdout, stderr) {
            if (error) {
                log(chalk.red(`  ${projectName} 创建失败`))
                reject(false)
            } else {
                log(chalk.green(`  ${projectName} 创建成功`))
                resolve(true)
            }
        });
    })
}
//  询问
let prompt = (promptList) => {
    return new Promise((resolve) => {
        inquirer.prompt(promptList)
            .then(answer => {
                resolve(answer);
            })
    });
}
// 下载模板
let downloadTemplate = (template, v, tarDir) => {
    return new Promise((resolve, reject) => {
        let spinner = ora()
        spinner.start();
        let timer = setInterval(() => {
            spinner.color = 'yellow';
            spinner.text = `  正在下载 ${v} 模板 ...`
        }, 1000);
        download(
            `direct:${template}`,
            `${tarDir}`,
            { clone: true },
            function (err) {
                clearInterval(timer);
                if (err) {
                    spinner.fail(`  ${v} 模板下载失败`)
                    reject(err)
                } else {
                    spinner.succeed(`  ${v} 模板下载成功`)
                    resolve('success')
                }
            }
        )
    })
}
// .gst 是否存在
let isExistGst = () => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync('.gst')) {
            resolve(true)
        } else {
            resolve(false);
        }
    });
}
// 复制文件夹所有
function copyDir(srcDir, tarDir, cb) {
    if (fs.existsSync(tarDir)) {
        fs.readdir(srcDir, function (err, files) {
            var count = 0
            var checkEnd = function () {
                // console.log("进度", count)
                ++count == files.length && cb && cb()
            }
            if (err) {
                checkEnd()
                return
            }
            files.forEach(function (file) {
                var srcPath = path.join(srcDir, file)
                var tarPath = path.join(tarDir, file)
                fs.stat(srcPath, function (err, stats) {
                    if (stats.isDirectory()) {
                        fs.mkdir(tarPath, function (err) {
                            if (err) {
                                log(chalk.red(err))
                                return
                            }
                            copyDir(srcPath, tarPath, checkEnd)
                            // console.log("复制文件完成", srcPath)
                        })
                    } else {
                        copyFile(srcPath, tarPath, checkEnd)
                        // console.log("复制文件完成", srcPath)
                    }
                })
            })
            //为空时直接回调
            files.length === 0 && cb && cb()
        })
    } else {
        fs.mkdir(tarDir, function (err) {
            if (err) {
                log(chalk.red(err))
                return
            }
            // console.log('创建文件夹', tarDir)
            copyDir(srcDir, tarDir, cb)
        })
    }

}
// 复制文件
function copyFile(srcPath, tarPath, cb) {
    var rs = fs.createReadStream(srcPath)
    rs.on('error', function (err) {
        if (err) {
            log(chalk.red(err, srcPath))
        }
        cb && cb(err)
    })

    var ws = fs.createWriteStream(tarPath)
    ws.on('error', function (err) {
        if (err) {
            log(chalk.red(err, tarPath))
        }
        cb && cb(err)
    })

    ws.on('close', function (ex) {
        cb && cb(ex)
    })

    rs.pipe(ws)
    // console.log("复制文件完成", srcPath)
}

// 复制并创建模板
let templateCopy = (projectName, tmp_url, tarDir) => {
    return new Promise((resolve) => {
        copyDir(tmp_url, tarDir, () => {
            console.log();
            log(chalk.green('  项目初始化完成,请执行以下命令：'))
            log(chalk.cyan(`  cd ${projectName}`))
            log(chalk.cyan(`  npm install`))
            log(chalk.cyan(`  npm run dev`))
            resolve(true)
        })
    })
}


module.exports = {
    createWorkSpace,
    downloadTemplate,
    isExistGst,
    copyDir,
    copyFile,
    updateJsonFile,
    templateCopy,

    //////
    loadCmd,

    downloadHubApp,
    isExist,
    log,
    prompt,
    initStart,
    start,
    creatPro
}