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
const inquirer = require('inquirer');

let currentPath = process.cwd();
let question = {
  type: 'confirm',
  name: 'overwrite',
  message: chalk.yellow(`This will overwrite all of your content with content \
from GDocs, are you sure you want to continue?`),
  default: false,
};

// Warning that this process will overwrite all of the exsting content.
inquirer.prompt([question]).then(function(answers) {
  if (answers.overwrite) {
    publishBook();
  }
});

/*
Uses the config.json file to export the entire book in the correct file
structure for GitBook.
*/
let publishBook = function() {
  try {
    // Get the config file
    let config = fs.readFileSync(currentPath.concat('/config.json'));
    config = JSON.parse(config);

    // Export the book based on the config file
    download.updateBook(config);

    // Clean up all of the resulting files by finding every index.md file
    gutil.log(chalk.cyan('Cleaning'), chalk.cyan(config.name));
    let filesToProcess = glob.find('**/index.md');
    filesToProcess.forEach(function(filename) {
      cleanBook.cleanup(filename, filename);
    });

    // If there is a README, move it to the correct spot and rename
    let readmePath = `${currentPath}/readme/readme.md`;
    if (fs.existsSync(readmePath)) {
      gutil.log(chalk.cyan('Created a README for'), chalk.cyan(config.name));
      fs.renameSync(readmePath, readmePath.replace('readme/readme.md'
        , 'README.md'));
      rimraf.sync(`${currentPath}/readme`);
    }

    gutil.log(chalk.yellow('-->'), chalk.cyan('Cleaned')
      , chalk.cyan(config.name));

    // Create the SUMMARY.md file (and LANGS.md if necessary)
    createSummary.createSummary(config);
  } catch (err) {
    console.log(err);
    shell.exit(1);
  }
};
