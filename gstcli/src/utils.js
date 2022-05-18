const ora = require('ora')
const fs = require('fs')
const child = require('child_process').exec;
const download = require('download-git-repo')
const process = require('process')
const chalk = require('chalk')
const inquirer = require('inquirer')


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
            const data = fs.readFileSync(fileName).toString();
            // 转为json对象
            let json = JSON.parse(data);
            // 将用户输入的更新到模板package.json文件
            // Object.keys(obj).forEach(key => {
            //     json[key] = obj[key];
            // });
            // 重写模板下的package.json文件
            fs.writeFileSync(fileName, JSON.stringify(json, null, '\t'), 'utf-8');
            resolve();
        }
    });
}




// 下载 code
let downloadHubApp = (msg, url, tarDir, branch) => {
    return new Promise((resolve, reject) => {
        let spinner = ora()
        spinner.start();
        let timer = setInterval(() => {
            spinner.color = 'yellow';
            spinner.text = `正在下载 ${msg} 分支${branch}...`
        }, 1000);
        download(
            `direct:${url}#${branch}`,
            `${tarDir}`,
            { clone: true },
            function (err) {
                clearInterval(timer);
                if (err) {
                    spinner.fail(`${msg}:${branch} 下载失败`)
                    reject(err)
                } else {
                    spinner.succeed(`${msg}:${branch} 下载成功`)
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

//  询问
let prompt = (promptList) => {
    return new Promise((resolve) => {
        inquirer.prompt(promptList)
            .then(answer => {
                resolve(answer);
            })
    });
}

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



// ========= 创建工作空间 ========================================================
// 工作空间(文件夹)
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

module.exports = {
    createWorkSpace,

    //////
    loadCmd,
    updateJsonFile,
    downloadHubApp,
    isExist,
    log,
    prompt,
    initStart,
    start,
    creatPro
}