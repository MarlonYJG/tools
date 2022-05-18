#!/usr/bin/env node

const program = require('commander')
const { createProject, createWrokspace } = require('./create')
const { build } = require('./build')
const { init } = require('./init')
const { dev } = require('./dev')


const cmd = process.argv.slice(2)

let action = '';

if (cmd.includes('workspace') || cmd.includes('w')) {
    action = 'workspace <workspace>'
} else if (cmd.length == 1 && 'init' === cmd[0]) {
    action = 'init'
} else if (cmd.length == 1 && ('i' === cmd[0] || 'install' === cmd[0])) {
    action = 'install'
} else if (cmd.length == 1 && 'dev' === cmd[0]) {
    action = 'dev'
} else if (cmd.includes('create') || cmd.includes('c')) {
    action = 'create'
} else if (cmd.length == 1 && 'build' === cmd[0]) {
    action = 'build'
}

const actionMap = {
    'workspace <workspace>': {
        description: '创建工作空间',
        alias: 'w'
    },
    'init': {
        description: '初始化(安装依赖)',
        alias: ''
    },
    'install': {
        description: '安装依赖',
        alias: 'i'
    },
    'dev': {
        description: '启动',
        alias: ''
    },
    'create': {
        description: '创建项目',
        alias: 'c'
    },
    'build': {
        description: '编译(打包)',
        alias: ''
    },
}

// console.log(process.argv);
// console.log('命令：', cmd);
// console.log('命令标识', action);

program
    .command(action)
    .description(actionMap[action].description)
    .alias(actionMap[action].alias)
    .action(() => {
        switch (action) {
            case 'workspace <workspace>':
                createWrokspace(...process.argv.slice(2));
                break;
            case 'create':
                createProject(...process.argv.slice(2));
                break;
            case 'init':
                init(...process.argv);
                break;
            case 'dev':
                dev(program.port);
                break;
            case 'build':
                build();
                break;
            default:
                break;
        }
    })

// cli 版本
program
    .version(require('../package.json').version, '-v --version')
    .parse(process.argv);
