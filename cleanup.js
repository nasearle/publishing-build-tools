'use strict';

var fs = require('fs');
var chalk = require('chalk');
var glob = require('globule');
var moment = require('moment');
var gutil = require('gulp-util');
var copydir = require('copy-dir');
var shell = require('shelljs');
const path = require('path');
const remark = require('remark');
const remarkHtml = require('remark-html');
const wfRegEx = require('./wfRegEx');
const mkdirp = require('mkdirp');

function cleanup(sourceFile, destFile, bookPath) {
  gutil.log(' ', 'Processing', sourceFile);
  let matches;
  var metadataFile = sourceFile.replace('index.md', 'codelab.json');
  var metadata = fs.readFileSync(metadataFile);
  metadata = JSON.parse(metadata);
  var result = [];
  var markdown = fs.readFileSync(sourceFile, 'utf8');
  result.push('# ' + metadata.title);
  markdown = markdown.replace(/^# (.*)\n/, '');
  var feedbackLink = markdown.match(/\[Codelab Feedback\](.*)\n/);
  if (feedbackLink && feedbackLink[0]) {
    markdown = markdown.replace(feedbackLink[0], '');
  }

  let reCodeInOL = /(^\d+\. .*?)\n+(#### .*?)?\n*```\n((.|\n)*?)```/gm;
  matches = wfRegEx.getMatches(reCodeInOL, markdown);
  matches.forEach(function(match) {
    let result = match[1] + '\n\n';
    let code = match[3].split('\n');
    code.forEach(function(line) {
      result += '        ' + line + '\n';
    });
    markdown = markdown.replace(match[0], result);
  });

  // Eliminate the Duration on Codelabs
  markdown = markdown.replace(/^\*Duration is \d+ min\*\n/gm, '');

  // Change bold underscores to <strong> tags
  markdown = markdown.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // Change italics *'s to <em> tags
  markdown = markdown.replace(/([^*])\*([^*\n]+?)\*([^*])/g, '$1<em>$2</em>$3');

  // Change inline backticks to <code> tags
  markdown = markdown.replace(/`([^`\n]+?)`/g, '<code>$1</code>');

  // Remove new line break between codeblocks and previous line so that
  // code in numbered lists doesn't reset the numbers
  markdown = markdown.replace(/\n*```/g, '\n```');

  // Remove empty lines in note divs
  markdown = markdown.replace(/<div class="note">\s*\n\n/g, '<div class="note">\n');
  markdown = markdown.replace(/\n\n+<\/div>/g, '\n</div>');

  // Change any empty markdown links to simply [Link](url)
  markdown = markdown.replace(/^\[\]\(/gm, '[Link](');

  // Add image info to images using IMAGEINFO syntax
  markdown = markdown.replace(/!\[.+?\]\((.+?)\)\[IMAGEINFO\]:.+,\s*(.+?)\n/g, '![$2](../$1)\n');

  // Replace [ICON HERE] with the correct icon
  markdown = markdown.replace(/(\[ICON HERE\])(.*?)!\[(.*?)]\((.*?)\)/g, '<img src="$4" style="width:20px;height:20px;" alt="$3"> $2');

  // Remove any bold from headings
  markdown = markdown.replace(/^(#+) __(.*)__/gm, '$1 $2');

  // These two command should stay in order:
  // Remove extra spaces that claat adds before markdown style links
  markdown = markdown.replace(/(\W)[^\S\n](\[.*?\]\(.*?\))/g, '$1$2');
  // Convert markdown style links to <a> tags, ignoring ![alt](url) image links
  markdown = markdown.replace(/([^\!])\[(.*?)\]\((.*?)\)/g, '$1<a href="$3">$2</a>');

  // Remove empty <strong> tags
  markdown = markdown.replace(/<strong>\s*<\/strong>/g, ' ');

  // Convert markdown inside a set of HTML elements to HTML.
  //   This is required because DevSite's MD parser doesn't handle markdown
  //   inside of HTML. :(
  let RE_ASIDE = /<aside markdown="1" .*?>\n?((.|\n)*?)\n?<\/aside>/gm;
  matches = wfRegEx.getMatches(RE_ASIDE, markdown);
  matches.forEach(function(match) {
    let htmlAside = remark().use(remarkHtml).process(match[0]);
    markdown = markdown.replace(match[0], String(htmlAside));
  });

  let RE_TABLE = /<table markdown="1">((.|\n)*?)<\/table>/gm;
  matches = wfRegEx.getMatches(RE_TABLE, markdown);
  matches.forEach(function(match) {
    let htmlTable = remark().use(remarkHtml).process(match[0]);
    markdown = markdown.replace(match[0], String(htmlTable));
  });

  result.push(markdown);
  result = result.join('\n');
  gutil.log('  ', chalk.cyan('->'), destFile);
  let destDir = path.parse(destFile).dir;
  mkdirp.sync(destDir);
  fs.writeFileSync(destFile, result);
}

exports.cleanup = cleanup;
