#!/usr/bin/env node

const buildBook = require('./buildBook')
const cleanBook = require('./codelabHelper')
const createSummary = require('./createSummary')
const glob = require('globule')
const gutil = require('gulp-util')
const shell = require('shelljs')
const fs = require('fs')

var currentPath = process.cwd()

try {
  var config = fs.readFileSync(currentPath.concat('/config.json'))
  config = JSON.parse(config)
  gutil.log(' ', 'Updating', config.title)
  buildBook.updateBook(config)

  var filesToProcess = glob.find('**/index.md')
  filesToProcess.forEach(function (filename) {
    cleanBook.cleanup(filename, filename)
  })

  createSummary.createSummary(config)
} catch (err) {
  console.log(err)
  shell.exit(1)
}
