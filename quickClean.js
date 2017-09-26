#!/usr/bin/env node

const codelabHelper = require('./codelabHelper')
const glob = require('globule')

console.log('\nCleaning codelabs & concepts markdown files...\n')
var filesToProcess = glob.find('**/index.md')
filesToProcess.forEach(function (filename) {
  codelabHelper.cleanup(filename, filename)
})
