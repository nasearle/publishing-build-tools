#!/usr/bin/env node

const fs = require('fs')
const shell = require('shelljs')
const globby = require('globby')
const rimraf = require('rimraf')
const gutil = require('gulp-util')

let currentPath = process.cwd()

function updateBook (bookConfig) {
  // Remove all book content files (in case anything was deleted)
  globby.sync(['*', '!config.json']).forEach(function (item) {
    rimraf.sync(item)
  })

  /* Update the book looking through the contents recursively for each language,
   only exporting the english language as others are added manually */
  bookConfig.langs.forEach(function (language) {
    currentPath = `${currentPath}/${language}`
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath)
    }

    if (language === 'en') {
      updateBookRecursively(bookConfig.bookContents)
    }
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
  })
}

function updateBookRecursively (jsonArray) {
  // Create directories for  each level of the book contents
  jsonArray.forEach(function (jsonObject) {
    if (jsonObject.hasOwnProperty('contents')) {
      // Make the directories a safe string for the file system
      let fileSafeName = jsonObject.name.replace(/\s+/g, '-').toLowerCase()
      fileSafeName = fileSafeName.replace(/\./g, '-')
      fileSafeName = fileSafeName.replace(/:/g, '')
      currentPath = currentPath.concat('/'.concat(fileSafeName))

      // Create the directory
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath)
      }

      // Continue into the nested structure
      updateBookRecursively(jsonObject.contents)

      // Reset the path when coming out of the recursive loop
      currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
    }

    // If the object has the id property (meaning there is a doc for it), export it
    if (jsonObject.hasOwnProperty('id')) {
      gutil.log(' ', 'Downloading', jsonObject.name)
      shell.exec(`${__dirname}/claat export  -f md -o "${currentPath}" ${jsonObject.id}`)
    }
  })
}

exports.updateBook = updateBook
