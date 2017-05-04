# Lab: sw-precache and sw-toolbox




## Content




<a href="#overview"><strong>Overview</strong></a>          

<a href="#1"><strong>1. Get set up</strong></a>          

<a href="#2"><strong>2. Installing the global tools</strong></a>          

<a href="#3"><strong>3. Installing gulp, sw-precache, and sw-toolbox plugins</strong></a>          

<a href="#4"><strong>4. Creating the service worker with sw-precache and gulp</strong></a>          

<a href="#5"><strong>5. Creating routes with sw-toolbox</strong></a>          

<a href="#6"><strong>6. Optional: Creating the service worker in the command line</strong></a>          

<a href="#congrats"><strong>Congratulations!</strong></a>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/using-sw-precache-and-sw-toolbox.html">Using sw-precache and sw-toolbox</a>

<a id="overview">


## Overview




The sw-precache module and sw-toolbox (Node.js) library make it easy to create production-quality service workers. This lab shows you how to use <code>sw-precache</code> and <code>sw-toolbox</code> to build the service worker programmatically, and provide different routing mechanisms for your service worker to use.

#### What you will learn

<em> Generate service workers using sw-precache and sw-toolbox
</em> Create sw-toolbox routes matching popular caching strategies
<em> Integrate sw-precache into your gulp build process
</em> Run sw-precache from the command line

#### What you should already know

<em> Basic HTML, CSS, and JavaScript
</em> ES2015 Promises
<em> How to run commands from the command line
</em> Familiarity with gulp

#### What you will need

<em> Computer with terminal/shell access
</em> Connection to the internet 
<em> A <a href="https://jakearchibald.github.io/isserviceworkerready/">browser that supports service worker</a>
</em> A text editor
<em> <a href="https://nodejs.org/en/">Node</a> and <a href="https://www.npmjs.com/">npm</a>

<a id="1">


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open your browser and navigate to <strong>localhost:8080/sw-precache-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>sw-precache-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab. 

This folder contains:

</em> <strong>css/main.css</strong> is the cascading stylesheet for the sample page
<em> <strong>images</strong> folder contains sample images
</em> <strong>js/toolbox-scripts.js</strong> is our custom sw-toolbox script
<em> <strong>gulpfile.js</strong> is where we will write the sw-precache gulp task
</em> <strong>index.html</strong> is a sample HTML page
<em> <strong>sw-precache-config.json</strong> is an optional configuration file for using sw-precache from the command line

<a id="2" />


## 2. Install the global tools




<a href="https://github.com/GoogleChrome/sw-precache">sw-precache</a> and <a href="https://github.com/GoogleChrome/sw-toolbox">sw-toolbox</a> are available as Node packages that can be used with gulp. In this section we install the gulp command line tool on your system. 

Install the gulp command line interface by running the following in the command line:

    npm install --global gulp-cli

#### Explanation

This installs the gulp command line interface globally so you can use it from the command line without having to type the full path to the version of gulp. 

<a id="3">


## 3. Installing gulp, sw-precache, and sw-toolbox plugins




Because <code>sw-precache</code> and <code>sw-toolbox</code> are Node.js based applications, we can incorporate them into a gulp-based workflow. First, we will initialize a node package file and install gulp. 

### 3.1 Run npm init

From <strong>app/</strong> (the project root), run the following in the command line:

    npm init -y

Note that a <strong>package.json</strong> file was created.

#### Explanation

This command initializes a node package file, <strong>package.json</strong> (the <code>-y</code> flag uses default configuration values for simplicity). Node uses <strong>package.json</strong> to store information about the project and its dependencies.

### 3.2 Install gulp plugin

From the same directory (<strong>app/</strong>), run the following in the command line:

    npm install gulp --save-dev

This command downloads the necessary dependencies for gulp. Note that a <strong>node_modules</strong> directory has been added to the project with various packages. Also note that <strong>package.json</strong> now lists "gulp" as a dependency.

### 3.3 Install sw-precache and sw-toolbox

From the same directory (<strong>app/</strong>), run the following from the command line:

    npm install --save-dev path sw-precache sw-toolbox

#### Explanation

Here we install the <code>sw-precache</code> and <code>sw-toolbox</code> packages. We also install the <code>path</code> package, which will simplify the process of building the correct file paths in the code.

<a id="4">


## 4. Creating the service worker with sw-precache and gulp




Sw-precache allows you generate service workers that precache static assets.

### 4.1 Include the necessary plugins in the gulpfile

In <strong>gulpfile.js</strong> replace TODO 4.1 with the following code:

#### gulpfile.js

```
var gulp = require('gulp');
var path = require('path');
var swPrecache = require('sw-precache');
```

#### Explanation

This code imports the packages and assigns them to variables so that they are easier to reference when creating the task.

### 4.2 Generate the service worker

Use <code>sw-precache</code> to generate a service worker as part of a gulp build process.  

In <strong>gulpfile.js</strong> replace TODO 4.2 with the following code:

#### gulpfile.js

```
var paths = {
  src: './'
};

gulp.task('service-worker', function(callback) {
  swPrecache.write(path.join(paths.src, 'service-worker.js'), {
    staticFileGlobs: [
      paths.src + 'index.html',
      paths.src + 'css/main.css'
    ],
    importScripts: [
      'node_modules/sw-toolbox/sw-toolbox.js',
      'js/toolbox-script.js'
    ],
    stripPrefix: paths.src
  }, callback);
});
```

Save the file. To test the code, enter the following command at the project root (<strong>app/</strong>):

    gulp service-worker

A <strong>service-worker.js</strong> script is created in <strong>app/</strong>. Open the <strong>service-worker.js</strong> file in a text editor and look at the code for yourself.

Refresh the app in the browser and then <a href="tools_for_pwa_developers.md#storage">inspect the cache</a> (you may need to refresh the cache). You should see that all files in the <code>staticFileGlobs</code> array have been added to the cache.

#### Explanation

The code first creates a variable, <code>paths</code>, to define the path of the source files.

The call to <code>swPrecache.write()</code> does the following:

1. Uses the <code>path</code> module to join <code>paths.src</code> (the location of our source code) with the string <code>service-worker.js</code> to indicate the name and location of the service worker. 
2. Writes an <code>install</code> event listener in the service worker that adds all the files in <code>staticFilesGlobs</code> to the cache (in this case, <strong>index.html</strong> and <strong>main.css</strong>).
3. Writes an <a href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">importScripts</a> method in the service worker that imports the scripts under <code>importScripts</code>. 
4. Strips the prefixes from the files to make them relative URLs using the <code>stripPrefix</code> method.

<a id="5">


## 5. Creating routes with sw-toolbox




The <code>sw-toolbox</code> library lets you add service worker routes to enable run-time caching in your application. 

Replace TODO 5 in <strong>js/toolbox-script.js</strong> with the following code:

#### toolbox-script.js

```
// Route #1
global.toolbox.router.get('/(.</em>)', global.toolbox.cacheFirst, {
  cache: {
    name: 'googleapis',
    maxEntries: 20,
  },
  origin: /\.googleapis\.com$/
});

// Route #2
global.toolbox.router.get(/\.(?:png|gif|jpg)$/, global.toolbox.cacheFirst, {
  cache: {
    name: 'images-cache',
    maxEntries: 50
  }
});
```

Save the code and <a href="tools_for_pwa_developers.md#unregister">unregister the service worker</a> in the browser. Refresh the page once or twice so that the new service worker installs and begins to intercept the network requests.<a href="tools_for_pwa_developers.md#storage">Inspect the cache</a> in the browser. You should see the <code>googleapis</code> cache populated with the Google web font, and the <code>images-cache</code> containing all of the fetched images.

#### Explanation

This code sets up several <a href="https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage">routes</a> that serve specific URLs, file types, and origins.

Route #1 creates a new cache called <code>googleapis</code> and stores up to 20 items (the <code>maxEntries</code> value) originating from any domain that matches the origin (any URL that ends with <strong>googleapis.com</strong>). The route uses the <a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network">cache-first</a> strategy to access resources. It first checks if the cache contains the resource. If that fails, it sends the request to the network and caches the response.

Route #2 also uses the cache-first strategy. It matches all the files ending in <strong>png</strong>, <strong>gif</strong>, or <strong>jpg</strong> (image files) using a regular expression and stores them in the <code>images-cache</code> cache with a limit of 50 items in the cache. If a new item is added to a full cache, then the oldest is deleted to make space. 

<div class="note">
<strong>Note:</strong> You can add <code>toolbox.options.debug = true;</code> to the script for more verbose console logs.
</div>

#### For more information

<em> <a href="https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage">sw-toolbox Usage Tutorial</a>
</em> <a href="https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-api.html">sw-toolbox API tutorial</a>
<em> <a href="http://expressjs.com/en/guide/routing.html">Express Routing</a>

<a id="6">


## 6. Optional: Creating the service worker in the command line




### 6.1 Install sw-precache globally

This exercise generates a service worker using the <code>sw-precache</code> command line tool. 

In the terminal window, run the following command:

    npm install --global sw-precache

#### Explanation

This command installs <code>sw-precache</code> globally and makes the <code>sw-precache</code> command available from any location.

### 6.2 Create the sw-precache-config file

The <code>sw-precache</code> command line tool can be passed a configuration file to specify the options for the service worker.

Copy and paste the following code into the <strong>sw-precache-config.json</strong> file:

#### sw-precache-config.json

```
{
  "staticFileGlobs": [
    "index.html",
    "css/main.css"
  ],
  "importScripts": [
    "node_modules/sw-toolbox/sw-toolbox.js",
    "js/toolbox-script.js"
  ]
}
```

Save the file.

#### Explanation

The JSON configuration file provides all the information <code>sw-precache</code> needs to generate the service worker.

#### For more information

</em> <a href="https://github.com/GoogleChrome/sw-precache#command-line-interface">sw-precache Command Line Interface</a>

### 6.3 Run sw-precache from the command line

In your terminal window, run the following command:

    sw-precache --config=sw-precache-config.json --verbose

If you test the new service worker in the browser the result should be the same as in the previous section.

#### Explanation

This command generates a service worker file (or overwrites the file if it already exists) using the options provided in <code>sw-precache-config.json</code>. The <code>--verbose</code> flag makes the success or error message more detailed.

<a id="congrats">


## Congratulations!




You have learned how to use <code>sw-precache</code> and <code>sw-toolbox</code> to build a service worker programmatically and to provide different routing mechanisms for your service worker to use.

### What we've covered

<em> Installing nvm, Node, and npm
</em> Installing gulp, sw-precache, and sw-toolbox plugins
<em> Installing gulp-cli and sw-precache globally to use from the command line
</em> Using sw-precache in a gulp-workflow to generate a service worker
<em> Using sw-precache from the command line to generate a service worker

### Resources

</em> <a href="https://github.com/GoogleChrome/sw-precache">sw-precache - Github</a>
<em> <a href="https://www.npmjs.com/package/sw-precache">sw-precache - npm</a>
</em> <a href="https://github.com/GoogleChrome/sw-toolbox">sw-toolbox - Github</a>
<em> <a href="https://googlechrome.github.io/sw-toolbox/docs/master/tutorial-usage">sw-toolbox Usage Tutorial</a>
</em> <a href="https://developers.google.com/web/updates/2015/02/offline-first-with-sw-precache">Offline-first, fast, with the sw-precache module</a>
<em> <a href="https://addyosmani.com/blog/application-shell/">Instant Loading Web Apps With A Service Worker Application Shell Architecture</a>
</em> <a href="https://github.com/GoogleChrome/sw-toolbox/blob/master/README.md">Service Worker Toolbox</a>


