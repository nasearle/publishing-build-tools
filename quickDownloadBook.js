#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const gutil = require('gulp-util');
const chalk = require('chalk');
const download = require('./download');

let currentPath = process.cwd();
try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  download.updateBook(config);
} catch (err) {
  console.log(err);
  gutil.log(chalk.red(err));
  shell.exit(1);
}
