
import cleanup from 'cleanup';
var glob = require('globule');
var shell = require('shelljs');

shell.exec('./claat update');

var filesToProcess = glob.find('**/index.md');

filesToProcess.forEach(function(filename) {
  cleanup(filename, filename, '');
});
