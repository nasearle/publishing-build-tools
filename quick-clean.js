var cleanup = require('./cleanup');
var glob = require('globule');

console.log('\nCleaning codelabs & concepts markdown files...\n');
var filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  cleanup.cleanup(filename, filename, '');
});
