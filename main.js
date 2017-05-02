var cleanup = require('./cleanup');
var glob = require('globule');
var shell = require('shelljs');
var courses = require('./courses.json');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

var languages = ['en', 'sp'];
//
// // Pull GDoc files as markdown
// shell.exec('./claat update');
//
// // Clean up markdown
// var filesToProcess = glob.find('**/index.md');
// filesToProcess.forEach(function(filename) {
//   cleanup.cleanup(filename, filename, '');
// });

// Push course packages
for (var courseTitle in courses) {
  shell.exec('git clone https://github.com/nasearle/' + courseTitle + '.git');
  console.log('cd ' + courseTitle);
  shell.cd(courseTitle);
  var course = courses[courseTitle];
  if (course.type == 'code') {
    // console.log('rm -rf $(ls)');
    // shell.exec('rm -rf $(ls)');
    // course.modules.forEach(function(module) {
    //   console.log('cp -R ../en/code/' + module, './' + module);
    //   shell.cp('-R', '../en/code/' + module, './' + module);
    // });
  } else {
    console.log('mkdir img');
    // shell.mkdir('img');
    languages.forEach(function(lang) {
      var files = shell.ls('./' + lang);
      console.log('rm -rf ' + lang + '/*');
      shell.exec('rm -rf ' + lang + '/*');
      files.forEach(function(file) {
        console.log('cp ../' + lang + '/' + course.type + '/' + file + '/index.md', './' + lang + '/' + file + '.md');
        shell.cp('../' + lang + '/' + course.type + '/' + file + '/index.md', './' + lang + '/' + file + '.md');
      });
    });
  }
  // console.log('echo "node_modules" > .gitignore');
  // shell.exec('echo "node_modules" > .gitignore');
  // console.log('echo ".DS_Store" >> .gitignore');
  // shell.exec('echo ".DS_Store" >> .gitignore');
  // console.log('git add . && git commit -m "autoupdate' + Date.now() +
  //   '" && git push');
  // shell.exec('git add . && git commit -m "autoupdate' + Date.now() +
  //   '" && git push');
  console.log('cd ..');
  shell.cd('..');
  // console.log('rm -rf ' + courseTitle);
  // shell.rm('-rf', courseTitle);
}
