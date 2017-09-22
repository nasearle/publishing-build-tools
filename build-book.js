#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const globby = require('globby')
const rimraf = require('rimraf')

var currentPath = process.cwd()

// Get config file
try {
  var config = fs.readFileSync(currentPath.concat('/config.json'))
  // Remove all book content files (in case anything was deleted)
  globby.sync(['*', '!config.json']).forEach(function (item) {
    rimraf.sync(item)
  })
  config = JSON.parse(config)
  if (config.title) {
    console.log(`Updating book: ${config.title}`)
  }

  updateBook(config)
  createSummary(config)
} catch (err) {
  console.log(err)
  console.log(`No config file found in working directory (${currentPath})`)
  shell.exit(1)
}

function updateBook (bookConfig) {
  updateBookRecursively(bookConfig.bookContents)
}

function updateBookRecursively (jsonArray) {
  jsonArray.forEach(function (jsonObject) {
    if (jsonObject.hasOwnProperty('contents')) {
      currentPath = currentPath.concat('/'.concat(jsonObject.name))
      if (!fs.existsSync(currentPath)) {
        console.log(`Created folder ${currentPath}`)
        fs.mkdirSync(currentPath)
      }
      console.log(currentPath)
      updateBookRecursively(jsonObject.contents)
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
    }

    if (jsonObject.hasOwnProperty('id')) {
      console.log(`Updating ${jsonObject.name}`)
      shell.exec(`${__dirname}/claat export  -f md -o "${currentPath}" ${jsonObject.id}`)
    }
  })
}

function createSummary (config) {
  // TODO
}
