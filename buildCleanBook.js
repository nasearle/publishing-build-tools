#!/usr/bin/env node

const downloadBook = require('./downloadBook');
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
  gutil.log(' ', 'Updating', config.title);
  downloadBook.updateBook(config);

  let filesToProcess = glob.find('**/index.md');
  filesToProcess.forEach(function(filename) {
    cleanBook.cleanup(filename, filename);
  });

  createSummary.createSummary(config);
} catch (err) {
  console.log(err);
  shell.exit(1);
}
