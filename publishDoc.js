#!/usr/bin/env node

const download = require('./download');
const cleanBook = require('./cleanMarkdown');
const createSummary = require('./createSummary');
const gutil = require('gulp-util');
const shell = require('shelljs');
const fs = require('fs');
const chalk = require('chalk');

let currentPath = process.cwd();

/*
This is the function for exporting and cleaning a doc in the right place based
on the config file. It also updates the SUMMARY.md file.
*/
try {
  // Get the config file
  let config = fs.readFileSync(currentPath.concat('/config.json'));
  config = JSON.parse(config);

  // Get the doc ID's from the command line
  let docIds = process.argv.slice([2]);

  let doc;
  // Update and clean each doc
  docIds.forEach(function(docId) {
    doc = download.updateDoc(config, docId);
    // Clean the doc
    let metadataFile = `${doc.dir}/codelab.json`;
    let metadata = fs.readFileSync(metadataFile);
    metadata = JSON.parse(metadata);
    cleanBook.cleanup(`${doc.dir}/index.md`,
      `${doc.dir}/index.md`);
    gutil.log('  ', chalk.cyan('Cleaned'), chalk.cyan(metadata.title));

    // Generate the config file
    createSummary.createSummary(config);
  });
} catch (err) {
  console.log(err);
  shell.exit(1);
}
