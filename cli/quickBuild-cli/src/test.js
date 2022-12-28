#!/usr/bin/env node

const download = require('download-git-repo')
const ora = require('ora')

const spinner = ora('downloading template')

exports.text = () => {
    download('vuejs-templates/webpack', 'testA', { clone: true }, err => {
        spinner.stop()
        if (err) console.log(err);
        console.log('testA');
        // generate(name, tmp, to, err => {
        //     if (err) logger.fatal(err)
        //     console.log()
        //     logger.success('Generated "%s".', name)
        // })
    })
}


