#!/usr/bin/env node

const glob = require('globule');
const fs = require('fs');
const chalk = require('chalk');
const gutil = require('gulp-util');

let currentPath = process.cwd();

// This function creates a SUMMARY.md file from the config file in the directory
function createSummary(bookConfig) {
  let result = [];
  //  Add the title and README
  result.push('# Summary');
  result.push('\n');
  result.push('* [Introduction](README.md)\n');
  // Keep track of indent level
  let indentLevel = 0;

  // Recursively create the summary using the indent level to track depth
  result.push(createSummaryRecursive(bookConfig.contents, result, indentLevel));
  // Turns array into single string
  result = result.join('');

  // Creates the LANGS.md file if the config has more than one language in it
  if (bookConfig.langs.length > 1) {
    let langsResult = [];
    langsResult.push('# Languages');
    langsResult.push('\n');
    bookConfig.langs.forEach(function(language) {
      if (language === 'en') {
        // If the langauge is english, write summary file
        langsResult.push('* [English](en/)\n');
        fs.writeFileSync(`${currentPath}/${language}/SUMMARY.md`, result);
      } else if (language === 'idn') {
        langsResult.push('* [Indonesian](idn/)\n');
      } else if (language === 'sp') {
        langsResult.push('* [Spanish](sp/)\n');
      } else {
        langsResult.push(`* [OTHER LANGUAGE](${language}/)\n`);
      }
    });
    langsResult = langsResult.join('');
    fs.writeFileSync(`${currentPath}/LANGS.md`, langsResult);
    gutil.log(chalk.cyan('Created language file for')
      , chalk.cyan(bookConfig.name));
  } else {
    // Write the summary file at the root if there is only one language
    fs.writeFileSync(`${currentPath}/SUMMARY.md`, result);
  }
  gutil.log(chalk.cyan('Created SUMMARY for'), chalk.cyan(bookConfig.name));
}

function createSummaryRecursive(jsonArray, result, indentLevel) {
  // Creates the SUMMARY.md from the config file
  jsonArray.forEach(function(jsonObject) {
    if (jsonObject.hasOwnProperty('contents')) {
      result.push(`${' '.repeat(2 * indentLevel)}* ${jsonObject.name}\n`);
      indentLevel++;
      createSummaryRecursive(jsonObject.contents, result, indentLevel);
    }
    if (jsonObject.hasOwnProperty('id')) {
      let link = glob.find(`**/${jsonObject.url}/*.md`);
      result.push(`${' '.repeat(2 * indentLevel)}* \
        [${jsonObject.name}](${link})\n`);
    }
    indentLevel--;
  });
  return result;
}

exports.createSummary = createSummary;
