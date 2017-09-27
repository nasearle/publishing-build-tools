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

  gutil.log(' ', 'Updating', config.title);
  download.updateBook(config);

  let filesToProcess = glob.find('**/index.md');
  filesToProcess.forEach(function(filename) {
    cleanBook.cleanup(filename, filename);
  });

  createSummary.createSummary(config);

  shell.exec('git add . && git commit -m "autoupdate-' + Date.now() +
               '" && git push');
} catch (err) {
  console.log(err);
  shell.exit(1);
}
