# Lab: Gulp Setup




## Contents




<a href="#overview"><strong>Overview</strong></a> 

<a href="#1"><strong>1. Get set up</strong></a> 

<a href="#2"><strong>2. Install global tools</strong></a> 

<a href="#3"><strong>3. Prepare the project</strong></a> 

<a href="#4"><strong>4. Minify JavaScript</strong></a> 

<a href="#5"><strong>5. Prefix CSS</strong></a> 

<a href="#6"><strong>6. Automate development tasks</strong></a> 

<a href="#7"><strong>7. Congratulations!</strong></a>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/introduction-to-gulp.html">Introduction to Gulp</a>

<a id="overview" />


## Overview




This lab shows you how you can automate tasks with <a href="https://github.com/gulpjs/gulp/tree/master/docs">gulp</a>, a build tool and task runner.

#### What you will learn

* How to set up gulp
* How to create tasks using gulp plugins
* Ways to automate your development

#### What you should know

* Basic JavaScript, HTML, and CSS
* Some experience using a command line interface

#### What you will need

* Computer with terminal/shell access
* Connection to the internet 
* A text editor
* <a href="https://nodejs.org/en/">Node</a> and <a href="https://www.npmjs.com/">npm</a>

<a id="1" />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>gulp-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab. 

This folder contains:

* <strong>js/main.js</strong> and <strong>styles/main.css</strong> are sample resources that we use to experiment
* <strong>index.html</strong> is the main HTML page for the sample site/application
* <strong>gulpfile.js</strong> is the file that gulp uses to execute tasks, and where you will write your code

<a id="2">


## 2. Install global tools




<a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md">Gulp</a> is available as a Node package. In this section we install the gulp command line tool on your system. 

To install the gulp command line tool, run the following in the command line:

    npm install --global gulp-cli

#### Explanation

This command installs the gulp command line tool (globally) using npm. We use the command line tool to actually execute gulp. 

<a id="3">


## 3. Prepare the project




All projects that use gulp need to have the gulp package installed locally.

From <strong>app/</strong> (the project root), run the following in the command line:

    npm init -y

Note that a <strong>package.json</strong> file was created. Open the file and inspect it.

From the same directory, run the following in the command line:

    npm install gulp --save-dev

Note that a <strong>node_modules</strong> directory has been added to the project with various packages. Also note that <strong>package.json</strong> now lists "gulp" as a dependency. 

<div class="note">
<strong>Note:</strong> Some text editors hide files and directories that are listed in the <strong>.gitignore</strong> file. Both <strong>node_modules</strong> and <strong>build</strong> are in our <strong>.gitignore</strong>. If you have trouble viewing these during the lab, just delete the <strong>.gitignore</strong> file.
</div>

In <strong>gulpfile.js</strong>, replace the TODO 3 comment with the following:

#### gulpfile.js
```
var gulp = require('gulp');
```

#### Explanation 

We start by generating <strong>package.json</strong> with <code>npm init</code> (the <code>-y</code> flag uses default configuration values for simplicity). This file is used to keep track of the packages that your project uses, including gulp and its dependencies.

The next command installs the gulp package and its dependencies in the project. These are put in a <strong>node_modules</strong> folder. The <code>--save-dev</code> flag adds the corresponding package (in this case gulp) to <strong>package.json</strong>. Tracking packages like this allows quick re-installation of all the packages and their dependencies on future builds (the <code>npm install</code> command will read <strong>package.json</strong> and automatically install everything listed).

Finally we add code to <strong>gulpfile.js</strong> to include the gulp package. The <strong>gulpfile.js</strong> file is where all of the gulp code should go.

<a id="4">


## 4. Minify JavaScript




This exercise implements a simple task to minify (also called "uglify" for JavaScript) the <strong>app/js/main.js</strong> JavaScript file.  

From <strong>app/</strong>, run the following in the command line:

    npm install gulp-uglify --save-dev

Now replace TODO 4.1 in <strong>gulpfile.js</strong> with the following code:

#### gulpfile.js
```
var uglify = require('gulp-uglify');
```

Replace TODO 4.2 with the following code:

#### gulpfile.js
```
gulp.task('minify', function() {
  gulp.src('js/main.js')
  .pipe(uglify())
  .pipe(gulp.dest('build'));
});
```

Save the file. From <strong>app/</strong>, run the following in the command line:

    gulp minify

Open <strong>app/js/main.js</strong> and <strong>app/build/main.js</strong>. Note that the JavaScript from <strong>app/js/main.js</strong> has been minified into <strong>app/build/main.js</strong>.

#### Explanation

We start by installing the <strong>gulp-uglify</strong> package (this also updates the <strong>package.json</strong> dependencies). This enables minification functionality in our gulp process. 

Then we include this package in the <strong>gulpfile.js</strong> file, and add code to create a <code>minify</code> task. This task gets the <strong>app/js/main.js</strong> file, and pipes it to the <code>uglify</code> function (which is defined in the <strong>gulp-uglify</strong> package). The <code>uglify</code> function minifies the file, pipes it to the <code>gulp.dest</code> function, and creates a <strong>build</strong> folder containing the minified JavaScript.

<a id="5" />


## 5. Prefix CSS




In this exercise, you add vendor prefixes to the <strong>main.css</strong> file.  

Read the documentation for <a href="https://www.npmjs.com/package/gulp-autoprefixer">gulp-autoprefixer</a>. Using section 4 of this lab as an example, complete the following tasks:

1. Install the gulp-autoprefixer package
2. Require the package in <strong>gulpfile.js</strong>
3. Write a task in <strong>gulpfile.js</strong> called <code>processCSS</code>, that adds vendor prefixes to the <strong>app/styles/main.css</strong> and puts the new file in <strong>app/build/main.css</strong>

Test this task by running the following (from <strong>app/</strong>) in the command line:

    gulp processCSS

Open <strong>app/styles/main.css</strong> and <strong>app/build/main.css</strong>. Does the <code>box-container</code> class have vendor prefixes for the <code>display: flex</code> property?

<strong>Optional</strong>: Read the <a href="https://www.npmjs.com/package/gulp-sourcemaps">gulp-sourcemaps</a> documentation and incorporate <a href="http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/">sourcemap</a> generation in the <code>processCSS</code> task (not in a new task). 

<div class="note">
<strong>Hint:</strong> The <a href="https://www.npmjs.com/package/gulp-autoprefixer">gulp-autoprefixer</a> documentation has a useful example. Test by rerunning the <code>processCSS</code> task, and noting the sourcemap comment in the <strong>app/build/main.css</strong> file.
</div>

<a id="6" />


## 6. Automate development tasks




### 6.1 Define default tasks

Usually we want to run multiple tasks each time we rebuild an application. Rather than running each task individually, they can be set as default tasks. 

Replace TODO 6.1 in <strong>gulpfile.js</strong> with the following:

#### gulpfile.js
```
gulp.task('default', ['minify', 'processCSS']);
```

Now delete the <strong>app/build</strong> folder and run the following in the command line (from <strong>app/</strong>):

    gulp

Note that both the <code>minify</code> and <code>processCSS</code> tasks were run with that single command (check that the <strong>app/build</strong> directory has been created and that <strong>app/build/main.js</strong> and <strong>app/build/main.css</strong> are there).

#### Explanation

Default tasks are run anytime the <code>gulp</code> command is executed. 

### 6.2 Set up gulp watch

Even with default tasks, it can become tedious to run tasks each time a file is updated during development. <a href="https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpwatchglob--opts-tasks-or-gulpwatchglob--opts-cb">gulp.watch</a> watches files and automatically runs tasks when the corresponding files change.

Replace TODO 6.2 in <strong>gulpfile.js</strong> with the following:

#### gulpfile.js
```
gulp.task('watch', function() {
  gulp.watch('styles/*.css', ['processCSS']);
});
```

Save the file. From <strong>app/</strong>, run the following in the command line:

    gulp watch

Add a comment to <strong>app/styles/main.css</strong> and save the file. Open <strong>app/build/main.css</strong> and note the real-time changes in the corresponding build file.

TODO: Now update the <code>watch</code> task in <strong>gulpfile.js</strong> to watch <strong>app/js/main.js</strong> and run the <code>minify</code> task anytime the file changes. Test by editing the value of the variable <code>future</code> in <strong>app/js/main.js</strong> and noting the real-time change in <strong>app/build/main.js</strong>. Don't forget to save the file and rerun the <code>watch</code> task. 

<div class="note">
<strong>Note:</strong> The watch task continues to execute once initiated. You need to restart the task in the command line whenever you make changes to the task. If there is an error in a file being watched, the watch task terminates, and must be restarted. To stop the task, use <strong>Ctrl+c</strong> in the command line or close the command line window.
</div>

#### Explanation

We created a task called <code>watch</code> that watches all CSS files in the <strong>styles</strong> directory, and all the JS files in the <strong>js</strong> directory. Any time any of these files changes (and is saved), the corresponding task (<code>processCSS</code> or <code>minify)</code> executes.

### 6.3 Set up BrowserSync

You can also automate the setup of a local testing server.

From <strong>app/</strong>, run the following in the command line:

    npm install browser-sync --save-dev

Replace TODO 6.3a in <strong>gulpfile.js</strong> with the following:

#### gulpfile.js
```
var browserSync = require('browser-sync');
```

Now replace TODO 6.3b in <strong>gulpfile.js</strong> with the following: 

#### gulpfile.js
```
gulp.task('serve', function() {
  browserSync.init({
    server: '.',
    port: 3000
  });
});
```

Save the file. Now run the following in the command line (from <strong>app/</strong>):

    gulp serve

Your browser should open <strong>app/</strong> at <strong>localhost:3000</strong> (if it doesn't, open the browser and navigate there).

#### Explanation

The gulp <a href="https://www.browsersync.io/docs/gulp">browsersync</a> package starts a local server at the specified directory. In this case we are specifying the target directory as '<strong>.</strong>', which is the current working directory (<strong>app/</strong>). We also specify the port as 3000.

### 6.4 Put it all together

Let's combine everything learned so far.

TODO: Change the default tasks from <code>minify</code> and <code>processCSS</code> to <code>serve</code>.

TODO: Update the <code>serve</code> task to the following code:
```
gulp.task('serve', ['processCSS'], function() {
  browserSync.init({
    server: '.',
    port: 3000
  });
  gulp.watch('styles/*.css', ['processCSS']).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
});
```

Close the app from the browser and delete <strong>app/build/main.css</strong>. From <strong>app/</strong>, run the following in the command line: 

    gulp

Your browser should open <strong>app/</strong> at <strong>localhost:3000</strong> (if it doesn't, open the browser and navigate there). Check that the <strong>app/build/main.css</strong> has been created. Change the color of the blocks in <strong>app/styles/main.css</strong> and check that the blocks change color in the page.

#### Explanation

In this example we changed the default task to <code>serve</code> so that it runs when we execute the <code>gulp</code> command. The <code>serve</code> task has <code>processCSS</code> as a  <em>dependent task</em> . This means that the <code>serve</code> task will execute the <code>processCSS</code> task before executing itself. Additionally, this task sets a watch on CSS and HTML files. When CSS files are updated, the <code>processCSS</code> task is run again and the server reloads. Likewise, when HTML files are updated (like <strong>index.html</strong>), the browser page reloads automatically. 

<strong>Optional</strong>: In the <code>serve</code> task, add <code>minify</code> as a dependent task. Also in <code>serve</code>, add a watcher for <strong>app/js/main.js</strong> that executes the <code>minify</code> task and reloads the page whenever the <strong>app/js/main.js</strong> file changes. Test by deleting <strong>app/build/main.js</strong> and re-executing the <code>gulp</code> command. Now <strong>app/js/main.js</strong> should be minified into <strong>app/build/main.js</strong> and it should update in real time. Confirm this by changing the console log message in <strong>app/js/main.js</strong> and saving the file - the console should log your new message in the app.

<a id="7">


## Congratulations!




You have learned how to set up gulp, create tasks using plugins, and automate your development!

### Resources

* <a href="https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md">Gulp's Getting Started guide</a>
* <a href="https://github.com/gulpjs/gulp/blob/master/docs/recipes/README.md">List of gulp Recipes</a>
* <a href="http://gulpjs.com/plugins/">Gulp Plugin Registry</a>


