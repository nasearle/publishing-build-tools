#!/usr/bin/env node

const gutil = require('gulp-util');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');
const inquirer = require('inquirer');

let currentPath = process.cwd();

let question = {
  type: 'confirm',
  name: 'overwrite',
  message: chalk.yellow(`This will overwrite your local styles and\
    book.json with a template, are you sure you want to continue?`),
  default: false
};

// Warning that this process will overwrite potentially exsting content.
inquirer.prompt([question]).then(function(answers) {
  if (answers.overwrite) {

    gutil.log(
      chalk.cyan('Copying template book.json & styles')
    );

    // Copy template styles & book.json from the build tools directory
    shell.cp('-r', `${__dirname}/starting-files/styles`, `${currentPath}/`);
    shell.cp(`${__dirname}/starting-files/book.json`, `${currentPath}/`);

  }
});
