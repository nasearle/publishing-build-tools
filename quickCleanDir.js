#!/usr/bin/env node

const cleanBook = require('./cleanMarkdown');
const fs = require('fs');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const chalk = require('chalk');

let currentPath = process.cwd();

let filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  cleanBook.cleanup(filename, filename);
});

try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  gutil.log(' ', 'Cleaning', config.title);
} catch (err) {
  if (err.message.indexOf('ENOENT') === -1) {
    gutil.log(chalk.yellow(err.message));
    shell.exit(1);
  }
}
