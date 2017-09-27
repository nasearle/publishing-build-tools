#!/usr/bin/env node

const cleanBook = require('./cleanMarkdown');
const fs = require('fs');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const dirTree = require('directory-tree');

let currentPath = process.cwd();

try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  let docId = process.argv[2];
  currentPath = `${currentPath}/en`;
  const tree = dirTree(currentPath, {extensions: /\.json$/}, (item, path) => {
      let metadata = fs.readFileSync(item.path);
      metadata = JSON.parse(metadata);
      if (docId === metadata.source) {
        gutil.log(' ', chalk.cyan('Cleaning'), chalk.cyan(metadata.title));
        cleanBook.cleanup(`${path.dirname(item.path)}/index.md`,
        `${path.dirname(item.path)}/index.md`);
      }
    });
} catch (err) {
  gutil.log(chalk.red(err));
  console.log(err);
  shell.exit(1);
}
