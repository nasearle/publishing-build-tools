#!/usr/bin/env node

const download = require('./download');
const cleanBook = require('./cleanMarkdown');
const createSummary = require('./createSummary');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const fs = require('fs');

let currentPath = process.cwd();

try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);

  shell.exec('git init');
  shell.exec(`git remote add origin ${config.gitbookRemote}`);
  shell.exec('git pull');

  shell.cp('-r', `${__dirname}/starting-files/styles`, `${currentPath}/`);
  shell.cp(`${__dirname}/starting-files/book.json`, `${currentPath}/`);

  shell.exec('git add . && git commit -m "autoupdate-' + Date.now() +
               '" && git push --set-upstream origin master');
} catch (err) {
  console.log(err);
  shell.exit(1);
}
