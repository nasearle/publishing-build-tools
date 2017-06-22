const fs = require('fs');
const glob = require('globule');
const shell = require('shelljs');
const emptyDir = require('empty-dir');
const courses = require('./config.json');
const codelabHelper = require('./codelabHelper');

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

const languages = ['en', 'sp'];

console.log('Updating codelabs & concepts markdown files from Gdocs...');
shell.exec('./claat update');

console.log('Cleaning codelabs & concepts markdown files...');
const filesToProcess = glob.find('**/index.md');
filesToProcess.forEach(function(filename) {
  codelabHelper.cleanup(filename, filename, '');
});

/*
The 'courses' object is used to map courses to their respective repository and
track which units/topics belong in which course.

The courses object is imported from config.json, which already has the
repository information. The "sources" property is what specifies which
units/topics belong in each course.

Currently sources have to be specified manually for code resources, but will
be built automatically for codelab and concept resources using the codelab.json
metadata files.
*/

console.log('Organizing resources into courses...');

// Find all the metadata files for codelab & concepts docs
// (use English files as source of truth to prevent duplicates / mismatches)
const codelabsMetaDataFiles = glob.find('en/codelabs/**/codelab.json');
const conceptsMetaDataFiles = glob.find('en/concepts/**/codelab.json');

// Convert these files into actual data
const codelabMetaData = codelabsMetaDataFiles.map(file => {
  return jsonFileToObject(file);
});
const conceptsMetaData = conceptsMetaDataFiles.map(file => {
  return jsonFileToObject(file);
});

// Look through this data, and add appropriate sources to each course in
// 'courses' object
addSources('codelabs', codelabMetaData);
addSources('concepts', conceptsMetaData);
// TODO write to config.json

// Now the 'courses' object has sources for all resources (code, concepts, codelabs)
console.log('Courses organized as:');
console.log(JSON.stringify(courses, null, 1));

// Now build each course
for (let courseKey in courses) {
  console.log(`Building ${courseKey} course...`);
  let course = courses[courseKey];
  shell.mkdir(courseKey);

  // Build linked README first, will get added to each repo
  let tempReadme = `${courseKey}/temp-README.md`;
  shell.exec(`touch ${tempReadme}`);
  shell.exec(`echo "# ${courseKey}\n" >> ${tempReadme}`);
  for (let resourceKey in course) {
    let repo = course[resourceKey].repo;
    let gitbook = course[resourceKey].gitbook;
    shell.exec(`echo "${resourceKey} repo: ${repo}\n" >> ${tempReadme}`);
    if (gitbook) {
      shell.exec(`echo "${resourceKey} GitBook: ${gitbook}\n" >> ${tempReadme}`);
    }
  }

  // Build each courses resources
  for (let resourceKey in course) {
    console.log(`Building ${resourceKey} for ${courseKey}`);
    let resource = course[resourceKey];
    let repo = resource.repo;
    let sources = resource.sources;
    let path = `${courseKey}/${resourceKey}`;
    shell.exec(`git clone ${repo} ${path}`);
    shell.rm('-rf', `${path}/*`); // remove all files except .git

    if (resourceKey === 'code') {
      sources.forEach(source => {
        let srcPath = `${languages[0]}/${resourceKey}/${source}`;
        let destPath = `${path}/${source}`;
        shell.cp('-R', srcPath, destPath);
      });
    } else if (resourceKey === 'concepts' || resourceKey === 'codelabs') {
      mkdirIfNotExist(`${path}/img`);
      languages.forEach(lang => {
        mkdirIfNotExist(`${path}/${lang}`);
        sources.forEach(source => {
          let srcPath = `${lang}/${resourceKey}/${source}/index.md`;
          let destPath = `${path}/${lang}/${source}.md`;
          shell.cp('-R', srcPath, destPath);
          let imgPath = `${lang}/${resourceKey}/${source}/img`;
          let hasImages = !emptyDir.sync(imgPath);
          if (hasImages) {
            let imgSrc = `${imgPath}/*`;
            let imgDest = `${path}/img`;
            shell.cp('-R', imgSrc, imgDest);
          }
        });
      });
    }
    // Add linked README
    shell.cp(tempReadme, `${path}/README.md`);
    // Add a .gitignore if it doesn't exist
    if (!fs.existsSync(`${path}/.gitignore`)) {
      shell.exec(`echo "node_modules\n.DS_Store" > ${path}/.gitignore`);
    }
    console.log(`Pushing ${courseKey} ${resourceKey} to:\n ${repo}`);
    shell.cd(`${path}`);
    shell.exec('git add . && git commit -m "autoupdate-' + Date.now() +
               '" && git push');
    shell.cd('-');
  }
  shell.rm('-rf', `${courseKey}`);
}

console.log('Publishing complete.');

function mkdirIfNotExist(path) {
  if (!fs.existsSync(path)) {
    shell.mkdir(path);
  }
}

function addSources(resource, metadata) {
  metadata.forEach(data => {
    let courseTags = data.tags;
    if (!courseTags || courseTags.length === 0) {
      console.log(`ERR: ${data.url} in ${resource} has no tags`);
      return;
    }
    courseTags.forEach(tag => {
      if (!courses[tag]) {
        console.log(`ERR: ${data.url} in ${resource} has unsupported tag: ${tag}`);
        return;
      }
      courses[tag][resource].sources.push(data.url);
    });
  });
}

function jsonFileToObject(file) {
  let fileString = fs.readFileSync(file, 'utf8');
  let data = JSON.parse(fileString);
  return data;
}
