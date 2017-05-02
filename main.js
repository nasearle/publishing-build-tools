var cleanup = require('./cleanup');
var glob = require('globule');
var shell = require('shelljs');
var courses = require('./courses.json');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

// Pull GDoc files as markdown
shell.exec('./claat update');

// Clean up markdown
var filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  cleanup.cleanup(filename, filename, '');
});

// Push course packages
for (var course in courses) {
  shell.exec('git clone https://github.com/nasearle/' + course + '.git');
  shell.cd(course);
  shell.exec('rm -rf $(ls)');
  courses[course].forEach(function(module) {
    shell.cp('-R', '../en/code/' + module, './' + module);
  });
  shell.exec('touch .gitignore');
  shell.exec('echo "node_modules" >> .gitignore');
  shell.exec('echo ".DS_Store" >> .gitignore');
  shell.exec('git add . && git commit -m "autoupdate' + Date.now() +
    '" && git push');
  shell.cd('..');
  shell.rm('-rf', course);
}
