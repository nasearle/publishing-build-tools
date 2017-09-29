#!/usr/bin/env node

const fs = require('fs');
const shell = require('shelljs');
const globby = require('globby');
const glob = require('globule');
const rimraf = require('rimraf');
const gutil = require('gulp-util');
const chalk = require('chalk');
let currentPath = process.cwd();

/*
Function for updating the entire book based on its config.json file. Be aware
that this will replace all book contents with new content from GDocs, so
be sure to update any changes there first.
*/
function updateBook(bookConfig) {
  // Log the name of the book you are updating
  gutil.log(chalk.cyan('Updating'), chalk.cyan(bookConfig.name));

  // Remove all book content files so we start fresh
  globby.sync(['*', '!config.json', '!styles/**', '!book.json'])
    .forEach(function(item) {
      rimraf.sync(item);
    });

  /* Update the book looking through the contents recursively for each language,
   only exporting the english language as others are added manually. If there
   is only one language in the config, it will not create language directories.
    */
  if (bookConfig.langs.length > 1) {
    bookConfig.langs.forEach(function(language) {
      currentPath = `${currentPath}/${language}`;
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }

      if (language === 'en') {
        updateBookRecursive(bookConfig);
      }
      // Update the currentPath to the higher level directory after updating
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    });
  } else {
    updateBookRecursive(bookConfig);
  }
  gutil.log(chalk.yellow('-->'), chalk.cyan('Updated')
    , chalk.cyan(bookConfig.name));
}

// Updates book recursively based on the bookConfig
function updateBookRecursive(jsonObject) {
  // If the object has an ID property, that means it has a gdoc so we export it
  if (jsonObject.hasOwnProperty('id')) {
    gutil.log('   ', 'Downloading', jsonObject.name);
    shell.exec(`${__dirname}/claat export  -f md -o \
      "${currentPath}" ${jsonObject.id}`);

    // Read the metadata file and log a warning if the status is not ready
    let metadataFile = glob.find(`**/${jsonObject.url}/*.json`)[0];
    let metadata = fs.readFileSync(metadataFile);
    metadata = JSON.parse(metadata);
    if (metadata.status && metadata.status.indexOf('not ready') > -1) {
      gutil.log(chalk.yellow(metadata.title), chalk.yellow(`is not ready for \
        publishing! Please update the doc and republish`));
    }
  }

  /*
  Iterate over the objects children, creating directories for ones without ID
  properties using file safe names.
  */
  for (let index in jsonObject.contents) {
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

      // Recursively call this function on each child
      updateBookRecursive(currentChild);
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    } else {
      // If the object has an id, don't create dir before the recursive call
      updateBookRecursive(currentChild);
    }
  }
}

/*
Function for updating a single doc within an existing book using the file
structure from the config file.
*/
function updateDoc(bookConfig, id) {
  /*
  This function exports the doc into the correct directory based on
  currentPath.
  */
  let exportDoc = function(bookConfig, id) {
    // Find the doc information from the config file and passed in ID
    let doc = findDocLocationRecursive(bookConfig, id);
    if (doc) {
      // If found, remove the contents of the directory and reexport
      gutil.log('', chalk.cyan('Updating '), chalk.cyan(doc.name));
      rimraf.sync(doc.dir);
      shell.exec(`${__dirname}/claat export  \
        -f md -o "${doc.exportPath}" ${id}`);
      // Get the metadata file
      let metadataFile = glob.find(`${doc.dir}/*.json`)[0];
      let metadata = fs.readFileSync(metadataFile);
      metadata = JSON.parse(metadata);

      // Log a warning if the status was Not Ready
      if (metadata.status && metadata.status.indexOf('not ready') > -1) {
        gutil.log(chalk.yellow(metadata.title), chalk.yellow(`is not ready for \
          publishing! Please update the gdoc and republish`));
      }
      gutil.log('-->', chalk.cyan('Download Complete!'), '');
      return doc;
    } else {
      gutil.log(chalk.red(`Can't find doc with ID ${id} in the config file`));
    }
  };

  /*
  Exports in the correct directory depending if we are in a multilanguage book.
  */
  let resultDoc;
  if (bookConfig.langs.length > 1) {
    bookConfig.langs.forEach(function(language) {
      currentPath = `${currentPath}/${language}`;
      if (language === 'en') {
        resultDoc = exportDoc(bookConfig, id);
      }
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    });
  } else {
    resultDoc = exportDoc(bookConfig, id);
  }
  return resultDoc;
}

// Function for finding the correct path to a doc, given the id.
function findDocLocationRecursive(jsonObject, id) {
  let doc = {};
  if (jsonObject.id === id) {
    doc.exportPath = currentPath;
    doc.dir = `${currentPath}/${jsonObject.url}`;
    doc.name = jsonObject.name;
    return doc;
  } else {
    // If we haven't found the doc, search the object's children
    for (let index in jsonObject.contents) {
      let currentChild = jsonObject.contents[index];
      if (!currentChild.hasOwnProperty('id')) {
        // If the object has no ID, we have to update the path and search again
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
        // If the child object has an ID, search again in the child
        doc = findDocLocationRecursive(currentChild, id);
        if (doc !== false) {
          return doc;
        }
      }
    }
    // If we get here, the id doesn't exist in the config file
    return false;
  }
}

exports.updateBook = updateBook;
exports.updateDoc = updateDoc;
