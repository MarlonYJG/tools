#!/usr/bin/env node
const { start, isExist, log, initStart } = require('../lib/utils')
const chalk = require('chalk')
const process = require('process')
const fs = require('fs')
const ora = require('ora')



let init = async (username, token) => {

    try {
        await loadCmd(`git init`, 'git初始化');
        if (username === '' || token === '') {
            console.log(symbol.warning, chalk.yellow('缺少参数无法创建远程仓库'));
        } else {
            const projectName = process.cwd().split('\\').slice(-1)[0];
            await loadCmd(`curl -u qjk-xiaoqi:a97fc56cbefe4bdc092490067bb1a9727615a583 https://api.github.com/user/repos -d "{\"name\": \"kkk\"}"`, 'Github仓库创建');
            // curl -u qjk-xiaoqi:a97fc56cbefe4bdc092490067bb1a9727615a583 https://api.github.com/user/repos -d "{\"name\": \"auto\"}"
            await loadCmd(`git remote add origin https://github.com/${username}/${projectName}.git`, '关联远端仓库')
            let loading = ora();
            loading.start(`package.json更新repository：命令执行中...`);
            await updateJsonFile('package.json', {
                "repository": {
                    "type": "git",
                    "url": `https://github.com/${username}/${projectName}.git`
                }
            }).then(() => {
                loading.succeed(`package.json更新repository: 命令执行完成`);
            });
            await loadCmd(`git add .`, "执行 git add");
            await loadCmd(`git commit -a -m "init"`, '执行git commit')
            await loadCmd(`git push --set-upstream origin master`, '执行git push')
        }
        await loadCmd(`npm install`, "安装依赖");
    } catch (err) {
        console.log(symbol.error, chalk.red('初始化失败'));
        console.log(symbol.error, chalk.red(err));
        process.exit(1);
    }

}

let loadCmd = async (cmd, text) => {
    let loading = ora();
    loading.start(`${text}: 命令执行中...`);
    await child.exec(cmd);
    loading.succeed(`${text}: 命令执行完成`)
}

// 安装依赖
exports.init = async function (...args) {
    // 检测是否存在 node npm
    console.log(args);
    if (!args[0].indexOf('node')) {
        log(chalk.red('  缺少node(npm)环境'))
        process.exit()
    }
    // 检查是否存在 json
    if (!fs.existsSync('package.json')) {
        log(chalk.red('  缺少package.json'))
        process.exit()
    }
    let install = await initStart()
    if (install) {
        process.exit()
    }
}

