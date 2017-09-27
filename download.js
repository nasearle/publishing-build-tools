#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const globby = require('globby');
const rimraf = require('rimraf');
const gutil = require('gulp-util');
const chalk = require('chalk');
const path = require('path');
const dirTree = require('directory-tree');
let currentPath = process.cwd();

function updateBook(bookConfig) {
  // Remove all book content files (in case anything was deleted)
  globby.sync(['*', '!config.json']).forEach(function(item) {
    rimraf.sync(item);
  });

  /* Update the book looking through the contents recursively for each language,
   only exporting the english language as others are added manually */
  bookConfig.langs.forEach(function(language) {
    currentPath = `${currentPath}/${language}`;
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }

    if (language === 'en') {
      updateBookRecursive(bookConfig);
    }
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  });
  gutil.log(' ', chalk.blue('Download complete!'), '');
}

function updateBookRecursive(jsonObject) {
  if (jsonObject.hasOwnProperty('id')) {
    gutil.log(' ', 'Downloading', jsonObject.name);
    shell.exec(`${__dirname}/claat export  -f md -o "${currentPath}" ${jsonObject.id}`);
  }

  for (index in jsonObject.contents) {
    let currentChild = jsonObject.contents[index];
    if (!currentChild.hasOwnProperty('id')) {
      let fileSafeName = currentChild.name.replace(/\s+/g, '-').toLowerCase();
      fileSafeName = fileSafeName.replace(/\./g, '-');
      fileSafeName = fileSafeName.replace(/:/g, '');
      currentPath = currentPath.concat('/'.concat(fileSafeName));
      // Create the directory
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }

      updateBookRecursive(currentChild);
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    } else {
      updateBookRecursive(currentChild);
    }
  }
}

function updateDoc(bookConfig, id) {
  bookConfig.langs.forEach(function(language) {
    currentPath = `${currentPath}/${language}`;
    if (language === 'en') {
      let result = findDocLocationRecursive(bookConfig, id);
      if (result) {
        let docDir = result[0];
        let docPath = `${result[0]}/${result[1]}`;
        let docName = result[2];
        gutil.log('  ', chalk.blue('Downloading'), chalk.blue(docName));
        rimraf.sync(docPath);
        shell.exec(`${__dirname}/claat export  -f md -o "${docDir}" ${id}`);
      } else {
        console.log('remove doc');
        const tree = dirTree(currentPath, {extensions: /\.json$/}, (item, path) => {
            console.log(item.path);
            let metadata = fs.readFileSync(item.path);
            console.log(metadata.src);
          });
      }
    }
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  });
  gutil.log('->', chalk.blue('Download Complete!'), '');
}

function findDocLocationRecursive(jsonObject, id) {
  let result = [];
  if (jsonObject.id === id) {
    result.push(currentPath);
    result.push(jsonObject.url);
    result.push(jsonObject.name);
    return result;
  } else {
    for (index in jsonObject.contents) {
      let currentChild = jsonObject.contents[index];
      if (!currentChild.hasOwnProperty('id')) {
        let fileSafeName = currentChild.name.replace(/\s+/g, '-').toLowerCase();
        fileSafeName = fileSafeName.replace(/\./g, '-');
        fileSafeName = fileSafeName.replace(/:/g, '');
        currentPath = currentPath.concat('/'.concat(fileSafeName));
        if (!fs.existsSync(currentPath)) {
          fs.mkdirSync(currentPath);
        }
        result = findDocLocationRecursive(currentChild, id);
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (result !== false) {
          return result;
        }
      } else {
        result = findDocLocationRecursive(currentChild, id);
        if (result !== false) {
          return result;
        }
      }
    }

    return false;
  }
}

exports.updateBook = updateBook;
exports.updateDoc = updateDoc;
