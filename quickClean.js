#!/usr/bin/env node

const cleanBook = require('./cleanMarkdown');
const fs = require('fs');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const chalk = require('chalk');

let currentPath = process.cwd();

try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  gutil.log(' ', 'Cleaning', config.title);
  let filesToProcess = glob.find('**/index.md');
  filesToProcess.forEach(function(filename) {
    cleanBook.cleanup(filename, filename);
  });
} catch (err) {
  gutil.log(chalk.red(err));
  shell.exit(1);
}
