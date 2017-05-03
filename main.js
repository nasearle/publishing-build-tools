var cleanup = require('./cleanup');
var glob = require('globule');
var shell = require('shelljs');
var courses = require('./courses.json');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

var languages = ['en', 'sp'];

// Pull GDoc files as markdown
shell.exec('./claat update');

// Clean up markdown
var filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  cleanup.cleanup(filename, filename, '');
});

// Push course packages
for (var courseTitle in courses) {
  shell.exec('git clone https://github.com/nasearle/' + courseTitle + '.git');
  console.log('cd ' + courseTitle);
  shell.cd(courseTitle);
  var course = courses[courseTitle];
  if (course.type == 'code') {
    course.modules.forEach(function(module) {
      console.log('rm -rf ' + module);
      shell.exec('rm -rf ' + module);
      console.log('cp -R ../en/code/' + module, './' + module);
      shell.cp('-R', '../en/code/' + module, './' + module);
    });
  } else {
    console.log('rm -rf', 'img');
    shell.rm('-rf', 'img');
    console.log('mkdir img');
    shell.mkdir('img');
    languages.forEach(function(lang) {
      var files = shell.ls('./' + lang);
      console.log('rm -rf ' + lang + '/*');
      shell.exec('rm -rf ' + lang + '/*');
      files.forEach(function(fileName) {
        var folderName = fileName.slice(0, -3); // remove file's .md extension
        console.log('cp ../' + lang + '/' + course.type + '/' + folderName +
          '/index.md', './' + lang + '/' + fileName);
        shell.cp('../' + lang + '/' + course.type + '/' + folderName +
          '/index.md', './' + lang + '/' + fileName);
        console.log('cp -R', '../' + lang + '/' + course.type + '/' +
          folderName + '/img', './img');
        shell.cp('-R', '../' + lang + '/' + course.type + '/' +
          folderName + '/img', './');
      });
    });
  }
  console.log('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  shell.exec('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  console.log('cd ..');
  shell.cd('..');
  console.log('rm -rf ' + courseTitle);
  shell.rm('-rf', courseTitle);
}
