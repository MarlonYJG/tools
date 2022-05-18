#!/usr/bin/env node

const exec = require('child_process').exec;
const inquirer = require('inquirer')
const path = require('path')
const ora = require('ora')
const download = require('download-git-repo')
const chalk = require('chalk')
const fs = require('fs')


const { downloadHubApp, createWorkSpace, log, prompt, creatPro } = require('./utils')


// 创建工作空间
exports.createWrokspace = async function (...args) {
    let repositoriesMap = {
        'gst-datahub': {
            name: '数据底座(gst-datahub)',
            github: 'https://geek.glodon.com/scm/gst/gst-datahub.git'
        },
        'gst-dataapplication': {
            name: '数据应用(gst-dataapplication)',
            github: 'https://geek.glodon.com/scm/gst/gst-dataapplication.git'
        },
        'gst-web': {
            name: 'GST平台(gst-web)',
            github: 'https://geek.glodon.com/scm/gst/gst-web.git'
        },
        'gst-hlht-web': {
            name: '互联互通(gst-hlht-web)',
            github: 'https://geek.glodon.com/scm/gst/gst-hlht-web.git'
        },
        'gst-bimvision-web': {
            name: '可视化大屏(gst-bimvision-web)',
            github: 'https://geek.glodon.com/scm/gst/gst-bimvision-web.git'
        },
        'appcenter-web': {
            name: '应用中心管理(appcenter-web)',
            github: 'https://geek.glodon.com/scm/gst/appcenter-web.git'
        },
        'bd-web': {
            name: '标道(bd-web)',
            github: 'https://geek.glodon.com/scm/gst/bd-web.git'
        },
    }
    let workespaceName = args[1];
    let wk = await createWorkSpace(workespaceName);
    if (wk) {
        let repo_choices = [];
        for (const key in repositoriesMap) {
            if (Object.hasOwnProperty.call(repositoriesMap, key)) {
                repo_choices.push({
                    value: key,
                    name: repositoriesMap[key].name
                })
            }
        }
        inquirer
            .prompt([
                {
                    type: 'checkbox',
                    name: 'repositories',
                    message: '请选择存储库',
                    default: '',
                    choices: repo_choices
                },
            ])
            .then(async (answer) => {
                const { repositories } = answer;
                if (!repositories.length) process.exit();

                // console.log(repositories);
                let repositories_inq = [];
                repositories.forEach(item => {
                    repositories_inq.push({
                        type: 'list',
                        name: `${item}_branch`,
                        message: `请选择分支(${item})`,
                        default: 'dev',
                        choices: [
                            'master',
                            'dev',
                            'release'
                        ]
                    })
                });
                inquirer.prompt(repositories_inq).then((branchName) => {
                    for (const key in branchName) {
                        if (Object.hasOwnProperty.call(branchName, key)) {
                            let repositories_key = key.split('_')[0]
                            downloadHubApp(`${repositoriesMap[repositories_key].name}`, `${repositoriesMap[repositories_key].github}`, `${workespaceName}/${repositories_key}`, `${branchName[key]}`)
                        }
                    }
                })
            }).catch(error => {
                log(chalk.red(`  ${error}`))
            });
    }

}

// 创建项目
exports.createProject = async function (...args) {
    // 询问用户
    let promptList = [
        {
            type: 'list',
            name: 'frame',
            message: '请选择项目模板:',
            default: '',
            choices: ['vue2', 'vue3', 'react', 'ts']
        },
        {
            type: 'input',
            name: 'description',
            message: '描述信息:'
        },
        {
            type: 'input',
            name: 'author',
            message: '作者:'
        }
    ];
    let projectName = args[1];
    await creatPro(projectName);
    // 选择模板
    let answerList = await prompt(promptList)
    console.log(answerList, '====');
    // 下载模板

    // 修改json文件



}
