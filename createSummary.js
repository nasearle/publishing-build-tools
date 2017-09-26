#!/usr/bin/env node

const glob = require('globule')
const fs = require('fs')

var currentPath = process.cwd()

function createSummary (bookConfig) {
  console.log(`Creating SUMMARY.md file for ${bookConfig.title}`)
  var result = []
  result.push('# Summary')
  result.push('\n\n')
  result.push('* [Introduction](README.md)\n')
  var indentLevel = 0
  result.push(createSummaryRecursive(bookConfig.bookContents, result, indentLevel))
  result = result.join('')
  bookConfig.langs.forEach(function (language) {
    fs.writeFileSync(`${currentPath}/${language}/SUMMARY.md`, result)
  })
}

function createSummaryRecursive (jsonArray, result, indentLevel) {
  jsonArray.forEach(function (jsonObject) {
    indentLevel++
    if (jsonObject.hasOwnProperty('contents')) {
      // console.log(jsonObject)
      result.push(`${' '.repeat(2 * indentLevel)}* ${jsonObject.name}\n`)
      createSummaryRecursive(jsonObject.contents, result, indentLevel)
    }
    if (jsonObject.hasOwnProperty('id')) {
      var link = glob.find(`**/${jsonObject.url}.md`)
      result.push(`${' '.repeat(2 * indentLevel)}* [${jsonObject.name}](${link})\n`)
    }
    indentLevel--
  })
  return result
}

exports.createSummary = createSummary
