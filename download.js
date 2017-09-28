#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const globby = require('globby');
const glob = require('globule');
const rimraf = require('rimraf');
const gutil = require('gulp-util');
const chalk = require('chalk');
let currentPath = process.cwd();

function updateBook(bookConfig) {

  // Log the name of the book you are updating
  gutil.log(chalk.cyan('Updating'), chalk.cyan(bookConfig.name));

  // Remove all book content files So we start fresh
  globby.sync(['*', '!config.json', '!styles/**', '!book.json']).forEach(function(item) {
    rimraf.sync(item);
  });

  /* Update the book looking through the contents recursively for each language,
   only exporting the english language as others are added manually */
  if (bookConfig.langs.length > 1) {
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
  } else {
    updateBookRecursive(bookConfig);
  }
  gutil.log(chalk.yellow('-->'), chalk.cyan('Updated'), chalk.cyan(bookConfig.name));
}

function updateBookRecursive(jsonObject) {
  if (jsonObject.hasOwnProperty('id')) {
    gutil.log('   ', 'Downloading', jsonObject.name);
    shell.exec(`${__dirname}/claat export  -f md -o "${currentPath}" ${jsonObject.id}`);
    let metadataFile = glob.find(`**/${jsonObject.url}/*.json`)[0];
    let metadata = fs.readFileSync(metadataFile);
    metadata = JSON.parse(metadata);
    if (metadata.status && metadata.status.indexOf('not ready') > -1) {
      gutil.log(chalk.yellow(metadata.title), chalk.yellow('is not ready for Publishing! Please update the doc and republish'));
    }
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
  var exportDoc = function(bookConfig, id) {
    let doc = findDocLocationRecursive(bookConfig, id);
    if (doc) {
      let docCurrentPath = doc.currentPath;
      let docFullPath = `${doc.currentPath}/${doc.dir}`;
      let docName = doc.name;
      gutil.log('', chalk.cyan('Updating '), chalk.cyan(docName));
      rimraf.sync(docFullPath);
      shell.exec(`${__dirname}/claat export  -f md -o "${docCurrentPath}" ${id}`);
      let metadataFile = glob.find(`${docFullPath}/*.json`)[0];
      let metadata = fs.readFileSync(metadataFile);
      metadata = JSON.parse(metadata);
      if (metadata.status && metadata.status.indexOf('not ready') > -1) {
        gutil.log(chalk.yellow(metadata.title), chalk.yellow('is not ready for publishing! Please update the gdoc and republish'));
      }
      gutil.log('-->', chalk.cyan('Download Complete!'), '');
    } else {
      gutil.log(chalk.red(`Can't find doc with ID ${id} in the config file`));
    }
  };

  if (bookConfig.langs.length > 1) {
    bookConfig.langs.forEach(function(language) {
      currentPath = `${currentPath}/${language}`;
      if (language === 'en') {
        exportDoc(bookConfig, id);
      }
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    });
  } else {
    exportDoc(bookConfig, id);
  }
}

function findDocLocationRecursive(jsonObject, id) {
  let doc = {};
  if (jsonObject.id === id) {
    doc.currentPath = currentPath;
    doc.dir = jsonObject.url;
    doc.name = jsonObject.name;
    return doc;
  } else {
    for (let index in jsonObject.contents) {
      let currentChild = jsonObject.contents[index];
      if (!currentChild.hasOwnProperty('id')) {
        let fileSafeName = currentChild.name.replace(/\s+/g, '-').toLowerCase();
        fileSafeName = fileSafeName.replace(/\./g, '-');
        fileSafeName = fileSafeName.replace(/:/g, '');
        currentPath = currentPath.concat('/'.concat(fileSafeName));
        doc = findDocLocationRecursive(currentChild, id);
        currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        if (doc !== false) {
          return doc;
        }
      } else {
        doc = findDocLocationRecursive(currentChild, id);
        if (doc !== false) {
          return doc;
        }
      }
    }

    return false;
  }
}

exports.updateBook = updateBook;
exports.updateDoc = updateDoc;
