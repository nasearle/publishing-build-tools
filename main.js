var cleanup = require('./cleanup');
var glob = require('globule');
var shell = require('shelljs');
var groupings = require('./groupings.json');
var fs = require('fs');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

shell.exec('git pull');

var languages = ['en', 'sp'];

console.log('\nUpdating codelabs & concepts markdown files from GDocs...\n');
shell.exec('./claat update');

console.log('\nCleaning codelabs & concepts markdown files...\n');
var filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  cleanup.cleanup(filename, filename, '');
});

for (var groupingName in groupings) {
  console.log('\n');
  shell.exec('git clone https://github.com/nasearle/' + groupingName + '.git');
  // console.log('cd ' + groupingName);
  shell.cd(groupingName);
  var grouping = groupings[groupingName];
  if (grouping.type == 'code') {
    console.log('\nUpdating course: ' + groupingName + '...\n');
    grouping.modules.forEach(function(module) {
      // console.log('rm -rf ' + module);
      shell.exec('rm -rf ' + module);
      // console.log('cp -R ../en/code/' + module, './' + module);
      shell.cp('-R', '../en/code/' + module, './' + module);
    });
  } else {
    console.log('\nUpdating GitBook repo: ' + groupingName + '...\n');
    // console.log('rm -rf', 'img');
    shell.rm('-rf', 'img');
    // console.log('mkdir img');
    shell.mkdir('img');
    if (!fs.existsSync('./README.md')) {
      // console.log('echo "readme" > README.md');
      console.log('No README.md exists (required for GitBook), writing...\n');
      shell.exec('echo "readme" > README.md');
    }
    languages.forEach(function(lang) {
      console.log('Processing ' + lang + '...');
      var files = shell.ls('./' + lang);
      // console.log('rm -rf ' + lang + '/*');
      shell.exec('rm -rf ' + lang + '/*');
      files.forEach(function(fileName) {
        var folderName = fileName.slice(0, -3); // remove file's .md extension
        //  console.log('cp ../' + lang + '/' + grouping.type + '/' + folderName +
        //    '/index.md', './' + lang + '/' + fileName);
        shell.cp('../' + lang + '/' + grouping.type + '/' + folderName +
          '/index.md', './' + lang + '/' + fileName);
        // console.log('cp -R', '../' + lang + '/' + grouping.type + '/' +
        //   folderName + '/img', './img');
        shell.cp('-R', '../' + lang + '/' + grouping.type + '/' +
          folderName + '/img', './');
      });
    });
  }
  if (!fs.existsSync('./.gitignore')) {
    // console.log('echo "node_modules\n.DS_Store" > .gitignore');
    console.log('No .gitignore exists, writing...\n');
    shell.exec('echo "node_modules\n.DS_Store" > .gitignore');
  }
  // console.log('git add . && git commit -m "autoupdate' + Date.now() +
  //   '" && git push');
  console.log('\nPushing changes to repo: ' + groupingName + '...\n');
  shell.exec('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  // console.log('cd ..');
  shell.cd('..');
  // console.log('rm -rf ' + groupingName);
  shell.rm('-rf', groupingName);
}

console.log('Complete.\nRemember to commit & push!');
