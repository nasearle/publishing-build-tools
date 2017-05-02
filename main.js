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
  console.log('rm -rf $(ls)');
  shell.exec('rm -rf $(ls)');
  var course = courses[courseTitle];
  if (course.type == 'code') {
    course.modules.forEach(function(module) {
      console.log('cp -R ../en/code/' + module, './' + module);
      shell.cp('-R', '../en/code/' + module, './' + module);
    });
  } else {
    languages.forEach(function(lang) {
      console.log('cp -R ../' + lang + '/' + course.type + '/', './' + lang + '/');
      shell.cp('-R', '../' + lang + '/' + course.type + '/', './' + lang + '/');
    });
  }
  console.log('echo "node_modules" > .gitignore');
  shell.exec('echo "node_modules" > .gitignore');
  console.log('echo "node_modules" > .gitignore');
  shell.exec('echo ".DS_Store" >> .gitignore');
  console.log('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  shell.exec('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  console.log('cd ..');
  shell.cd('..');
  console.log('-rf ' + courseTitle);
  shell.rm('-rf', courseTitle);
}
