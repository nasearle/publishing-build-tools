#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const gutil = require('gulp-util')
const chalk = require('chalk')
const downloadBook = require('./downloadBook')

let currentPath = process.cwd()
try {
  let config = fs.readFileSync(currentPath.concat('/config.json'))
  config = JSON.parse(config)
  gutil.log(' ', 'Updating', config.title)
  downloadBook.updateBook(config)
} catch (err) {
  gutil.log(chalk.red(err))
  shell.exit(1)
}
