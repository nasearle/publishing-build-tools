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

//   console.log(jsonObject);
//   // Exit if the book has no contents
//   if (!jsonObject.hasOwnProperty('contents') &&
//     !jsonObject.hasOwnProperty('id')) {
//     console.log('Config file had incorrect structure')
//     shell.exit(1)
//   } else if (jsonObject.hasOwnProperty('bookContents')) {
//     jsonObject.bookContents.forEach(function (content) {
//       updateBookRecursively(content)
//     })
//   } else if (jsonObject.hasOwnProperty('contents')) {
//     currentPath = currentPath.concat('/'.concat(jsonObject.name))
//     if (!fs.existsSync(currentPath)) {
//       console.log(`Created folder ${currentPath}`);
//       fs.mkdirSync(currentPath)
//     }
//     jsonObject.contents.forEach(function (content) {
//       updateBookRecursively(content)
//       if (content.hasOwnProperty('id')) {
//         console.log(`Updating ${content.name}`);
//         shell.exec(`${__dirname}/claat export  -f md -o "${currentPath}" ${module.id}`)
//       }
//     })
//     currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'))
//   }
// }

function createSummary (config) {
  // TODO
}
