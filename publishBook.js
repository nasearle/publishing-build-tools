#!/usr/bin/env node

const download = require('./download');
const cleanBook = require('./cleanMarkdown');
const createSummary = require('./createSummary');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const rimraf = require('rimraf');

let currentPath = process.cwd();
try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);

  download.updateBook(config);

  gutil.log(chalk.cyan('Cleaning'), chalk.cyan(config.name));
  let filesToProcess = glob.find('**/index.md');
  filesToProcess.forEach(function(filename) {
    cleanBook.cleanup(filename, filename);
  });
  let readmePath = `${currentPath}/readme/readme.md`;
  if (fs.existsSync(readmePath)) {
    console.log('exists');
    fs.renameSync(readmePath, readmePath.replace('readme/readme.md', 'README.md'));
    rimraf.sync(`${currentPath}/readme`);
  }

  gutil.log(chalk.yellow('-->'), chalk.cyan('Cleaned'), chalk.cyan(config.name));

  createSummary.createSummary(config);

} catch (err) {
  console.log(err);
  shell.exit(1);
}
