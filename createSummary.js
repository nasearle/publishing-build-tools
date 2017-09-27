#!/usr/bin/env node

const glob = require('globule');
const fs = require('fs');
const chalk = require('chalk');
const gutil = require('gulp-util');

let currentPath = process.cwd();
function createSummary(bookConfig) {
  let result = [];
  result.push('# Summary');
  result.push('\n');
  result.push('* [Introduction](README.md)\n');
  let indentLevel = 0;
  result.push(createSummaryRecursive(bookConfig.contents,
    result, indentLevel));
  result = result.join('');
  if (bookConfig.langs.length > 1) {
    let langsResult = [];
    langsResult.push('# Languages');
    langsResult.push('\n');
    bookConfig.langs.forEach(function(language) {
      if (language === 'en') {
        langsResult.push('* [English](en/)\n');
      } else if (language === 'idn') {
        langsResult.push('* [Indonesian](idn/)\n');
      } else if (language === 'sp') {
        langsResult.push('* [Spanish](sp/)\n');
      }
      fs.writeFileSync(`${currentPath}/${language}/SUMMARY.md`, result);
    });
    fs.writeFileSync(`${currentPath}/LANGS.md`, langsResult);
    gutil.log(chalk.cyan('Created language file for'), chalk.cyan(bookConfig.title));
  } else {
    fs.writeFileSync(`${currentPath}/SUMMARY.md`, result);
  }
  gutil.log(chalk.cyan('Created summary for'), chalk.cyan(bookConfig.title));
}

function createSummaryRecursive(jsonArray, result, indentLevel) {
  jsonArray.forEach(function(jsonObject) {
    indentLevel++;
    if (jsonObject.hasOwnProperty('contents')) {
      result.push(`${' '.repeat(2 * indentLevel)}* ${jsonObject.name}\n`);
      createSummaryRecursive(jsonObject.contents, result, indentLevel);
    }
    if (jsonObject.hasOwnProperty('id')) {
      let link = glob.find(`**/${jsonObject.url}/*.md`);
      result.push(`${' '.repeat(2 * indentLevel)}* [${jsonObject.name}](${link})\n`);
    }
    indentLevel--;
  });
  return result;
}

exports.createSummary = createSummary;
