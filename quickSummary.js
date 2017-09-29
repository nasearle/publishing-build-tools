#!/usr/bin/env node

const fs = require('fs');
const gutil = require('gulp-util');
const shell = require('shelljs');
const createSummary = require('./createSummary');

// This must be run on a book to create a Summary file for GitBook
let currentPath = process.cwd();
try {
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);
  gutil.log(' ', 'Creating SUMMARY.md for', config.title);
  createSummary.createSummary(config);
} catch (err) {
  console.log(err);
  shell.exit(1);
}
