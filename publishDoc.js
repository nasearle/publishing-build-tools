#!/usr/bin/env node

const download = require('./download');
const cleanBook = require('./cleanMarkdown');
const createSummary = require('./createSummary');
const glob = require('globule');
const gutil = require('gulp-util');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const dirTree = require('directory-tree');
const chalk = require('chalk');
let currentPath = process.cwd();

try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  let docIds = process.argv.slice([2]);

  docIds.forEach(function(docId) {
    download.updateDoc(config, docId);
  });
  if (config.langs.length > 1) {
    currentPath = `${currentPath}/en`;
  }
  const tree = dirTree(currentPath, {extensions: /\.json$/}, (item, path) => {
        let metadata = fs.readFileSync(item.path);
        metadata = JSON.parse(metadata);
        docIds.forEach(function(docId) {
          if (docId === metadata.source) {
            gutil.log(' ', chalk.cyan('Cleaning'), chalk.cyan(metadata.title));
            cleanBook.cleanup(`${path.dirname(item.path)}/index.md`,
            `${path.dirname(item.path)}/index.md`);
          }
        });
      });

  createSummary.createSummary(config);
} catch (err) {
  console.log(err);
  shell.exit(1);
}
