# Lab: Workbox




## Content




<strong>Overview        </strong>

<strong>1. Get set up        </strong>

<strong>2. Install workbox-sw        </strong>

<strong>3. Write a basic service worker using workbox-sw        </strong>

<strong>4. Inject a manifest into the service worker        </strong>

<strong>5. Add routes to the service worker</strong>

<strong>6. Optional: Use Webpack plugin to bundle the service worker        </strong>

<strong>Congratulations!</strong>

<a id="overview" />


## Overview




<a href="https://workboxjs.org/">Workbox</a> is the successor to <a href="https://github.com/GoogleChrome/sw-precache">sw-precache</a> and <a href="https://github.com/GoogleChrome/sw-toolbox">sw-toolbox</a>. It is a collection of libraries and tools used for generating a service worker, precaching, routing, and runtime-caching. Workbox also includes modules for easily integrating <a href="https://github.com/GoogleChrome/workbox/tree/master/packages/workbox-background-sync">background sync</a> and <a href="https://github.com/GoogleChrome/workbox/tree/master/packages/workbox-google-analytics">Google analytics</a> into your service worker.

See the <a href="https://developers.google.com/web/tools/workbox/">Workbox page</a> on developers.google.com for an explanation of each module contained in Workbox. In this lab, we use the main Workbox library, <code>workbox-sw</code>, and <code>workbox-build</code> to inject an array of static assets to precache into a service worker.

#### What you will learn

* How to write a service worker using the <code>workbox-sw</code> library
* How to add routes to your service worker using <code>workbox-sw</code>
* How to use the predefined caching strategies provided in <code>workbox-sw</code>
* How to inject a manifest into your service worker using <code>workbox-build</code> and the <code>workbox-webpack-plugin</code>

#### What you should already know

* Basic HTML, CSS, and JavaScript
* ES2015 Promises
* How to run commands from the command line
* Familiarity with gulp
* Some familiarity with service workers is recommended

#### What you will need

* Computer with terminal/shell access
* Connection to the internet 
* A <a href="https://jakearchibald.github.io/isserviceworkerready/">browser that supports service worker</a>
* A text editor
* <a href="https://nodejs.org/en/">Node</a> and <a href="https://www.npmjs.com/">npm</a>

<a id="1" />


## 1. Get set up




If you have not already downloaded the repository, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>. You don't need to start the server for this lab.

If you have a text editor that lets you open a project, open the <strong>workbox-lab/project</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>project</strong> folder is where you will be building the lab. 

This folder contains:

* <strong>app/css/main.css</strong> is the cascading stylesheet for the sample page
* <strong>app/images</strong> folder contains sample images
* <strong>gulpfile.js</strong> is where we will write the <code>workbox-build</code> gulp task
* <strong>app/index.html</strong> is a sample HTML page
* <strong>app/service-worker.js</strong> is where we will write the service worker using <code>workbox-sw</code>
* <strong>package.json</strong> tracks Node dependencies

<a id="2" />


## 2. Install workbox-sw




From the <strong>project</strong> directory, install the project dependencies. See the <strong>package.json</strong> file for the full list of dependencies.
```
npm install
```

Then run the following to install the <code>workbox-sw</code> library and save it as a project dependency:
```
npm install --save workbox-sw
```

#### Explanation

<a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.html">workbox-sw</a> is a high-level library that makes it easier to precache assets and configure routes with caching strategies in a service worker.

<a id="3" />


## 3. Write a basic service worker using workbox-sw




Open <strong>service-worker.js</strong> and add the following snippet. Be sure to replace <code>vX.Y.Z</code> with the actual version number of the <code>workbox-sw</code> library (you can find the version number in the file in <strong>node_modules/workbox-sw/build/importScripts/</strong>).

#### service-worker.js
```
importScripts('workbox-sw.prod.vX.Y.Z.js');

const workboxSW = new WorkboxSW();
workboxSW.precache([]);
```

Save the <strong>service-worker.js </strong>file. In the command line, run <code>gulp serve</code> to open the app in the browser (if you don't have gulp installed globally, install it with <code>npm install -g gulp</code>). Take a moment to look over the gulpfile and make sure you understand what it does. 

<a href="tools_for_pwa_developers.md#unregister">Unregister</a> any existing service workers at localhost:8002. Refresh the page and check that the new service worker was created in your browser's <a href="tools_for_pwa_developers.md#accesssw">developer tools</a>. You should see a "Service Worker registration successful" message in the console.

#### Explanation

Here we import the <code>workbox-sw</code> library and create an instance of <code>WorkboxSW</code> so we can access <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.WorkboxSW.html#main">the library methods</a> from this object.

In the next line we call <code>workboxSW.precache([])</code>. This method takes a manifest of URLs to cache on service worker installation. It is recommended to use <code>workbox-build</code> or <code>workbox-cli</code> to generate the manifest for you (this is why the array is empty). We will do that in the next step. 

The <code>precache</code> method takes care of precaching files, removing cached files no longer in the manifest, updating existing cached files, and it even sets up a fetch handler to respond to any requests for URLs in the manifest using a cache-first strategy. See <a href="https://workboxjs.org/examples/workbox-sw/#explore-the-code">this example</a> for a full explanation.

<a id="4" />


## 4. Inject a manifest into the service worker




This step uses gulp and <code>workbox-build</code> to build a service worker. 

Start by installing the <a href="https://workboxjs.org/reference-docs/latest/module-workbox-build.html">workbox-build</a> module:
```
npm install --save workbox-build
```

This module is used to generate a list of assets that should be precached in a service worker. The list items are created with a hash that Workbox uses to intelligently update a cache when the service worker is updated.

Next, add a line to include the workbox-build library at the top of <strong>gulpfile.js</strong>:

#### gulpfile.js
```
const wbBuild = require('workbox-build');
```

Now copy and paste the following gulp task into the gulpfile:

#### gulpfile.js
```
gulp.task('bundle-sw', () => {
  return wbBuild.injectManifest({
    swSrc: 'app/service-worker.js',
    swDest: 'build/service-worker.js',
    globDirectory: 'app',
    staticFileGlobs: [
      'index.html',
      'css/main.css'
    ]
  })
  .catch((err) => {
    console.log('[ERROR] This happened: ' + err);
  });
});
```

Finally, update the <code>default</code> gulp task to include the <code>bundle-sw</code> task in its <code>runSequence</code>:

#### gulpfile.js
```
gulp.task('default', ['clean'], cb => {
  runSequence(
    'copy',
    'bundle-sw',
    cb
  );
});
```

Save the file and run <code>gulp serve</code> in the command line (you can use <code>Ctrl-c</code> to terminate the previous <code>gulp serve</code> process). When the command finishes executing, open <strong>build/service-worker.js</strong> and check that the manifest has been added to the <code>precache</code> method in the service worker. It should look like this:

#### build/service-worker.js
```
workboxSW.precache([
  {
    "url": "index.html",
    "revision": "ee7d4366f82a736863dc612c50d16e54"
  },
  {
    "url": "css/main.css",
    "revision": "3a78f101efdbf4c896cef53c323c7bb7"
  }
]);
```

When the app opens in the browser, make sure to close any other open instances of the app.<a href="tools_for_pwa_developers.md#update">Update the service worker</a> and <a href="tools_for_pwa_developers.md#cache">check the cache</a> in your browser's developer tools. You should see the <strong>index.html</strong> and <strong>main.css</strong> files are cached.

#### Explanation

In this step, we installed the <code>workbox-build</code> module and wrote a gulp task that uses the module's <a href="https://workboxjs.org/reference-docs/latest/module-workbox-build.html#.injectManifest">injectManifest</a> method. This method copies the source service worker file to the destination service worker file, searches the new service worker for an empty <code>precache()</code> call, like <code>.precache([])</code>, and populates the empty array with the assets defined in <code>staticFileGlobs</code>.

<a id="5" />


## 5. Add routes to the service worker




<code>workbox-sw</code> has a <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Router.html#main">router</a> method that lets you easily add routes to your service worker.

Let's add a few routes to the service worker. Copy the following code into <strong>app/service-worker.js</strong>. Make sure you're not editing the service worker in the <strong>build</strong> folder. This file will be overwritten when we run <code>gulp serve</code>.

#### service-worker.js
```
workboxSW.router.registerRoute('https://fonts.googleapis.com/(.*)',
  workboxSW.strategies.cacheFirst({
    cacheName: 'googleapis',
    cacheExpiration: {
      maxEntries: 20
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

workboxSW.router.registerRoute('http://weloveiconfonts.com/(.*)',
  workboxSW.strategies.cacheFirst({
    cacheName: 'iconfonts',
    cacheExpiration: {
      maxEntries: 20
    },
    cacheableResponse: {statuses: [0, 200]}
  })
);

// We want no more than 50 images in the cache. We check using a cache first strategy
workboxSW.router.registerRoute(/\.(?:png|gif|jpg)$/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'images-cache',
    cacheExpiration: {
      maxEntries: 50
    }
  })
);
```

Save the file. This should rebuild <strong>build/service-worker.js</strong>, restart the server automatically and refresh the page.<a href="tools_for_pwa_developers.md#update">Update the service worker</a> and refresh the page a couple times so that the service worker intercepts some network requests. Check the caches to see that the <code>googleapis</code>, <code>iconfonts</code>, and <code>images-cache</code> all exist and contain the right assets. You may need to refresh the caches in developer tools to see the contents. Now you can take the app offline by either stopping the server or using <a href="tools_for_pwa_developers.md#offline">developer tools</a>. The app should work as normal!

#### Explanation

Here we add a few routes to the service worker using <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Router.html#registerRoute">registerRoute</a> method on the <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Router.html#main">router</a> class. <code>registerRoute</code> takes an Express-style or regular expression URL pattern, or a <a href="https://workboxjs.org/reference-docs/latest/module-workbox-routing.Route.html#main">Route</a> instance. The second argument is the handler that provides a response if the route matches. The handler argument is ignored if you pass in a Route object, otherwise it's required.

Each route uses the <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Strategies.html#main">strategies</a> class to access the <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Strategies.html#cacheFirst">cacheFirst</a> run-time caching strategy. The built-in caching strategies have several <a href="https://workboxjs.org/reference-docs/latest/module-workbox-sw.Strategies.html#.StrategyOptions">configuration options</a> for controlling how resources are cached.

The domains in the first two routes are not <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS">CORS</a>-enabled so we must use the <code>cacheableResponse</code> option to allow responses with a status of <code>0</code> (<a href="https://jakearchibald.com/2015/thats-so-fetch/#no-cors-and-opaque-responses">opaque responses</a>). Otherwise, Workbox does not cache these responses if you're using the <code>cacheFirst</code> strategy. (Opaque responses are allowed when using <code>networkFirst</code> and <code>staleWhileRevalidate</code>, because even if an error response is cached, it will be replaced in the near future.)

<a id="6" />


## 6. Optional: Use Webpack plugin to bundle the service worker




### 6.1 Install the dependencies

In the command line, move into the <strong>webpack</strong> directory and install the dependencies. Then install the webpack module globally so we can use it from the command line.
```
cd ../webpack
npm install
npm install -g webpack
npm install -g webpack-dev-server
```

#### Explanation

This will install several packages:

* <a href="https://webpack.js.org/">Webpack</a> - webpack is a tool for bundling your project's assets 
* <a href="https://workboxjs.org/get-started/webpack.html">workbox-webpack-plugin</a> - generates a service worker or injects a manifest into an existing service worker as part of a webpack build process
* <a href="https://github.com/webpack/webpack-dev-server">webpack-dev-server</a> - a webpack development server that provides live reloading

### 6.2 Configure webpack

Open <strong>webpack.config.js</strong> and paste in the following code to include the necessary plugins:

#### webpack.config.js
```
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');
```

Then paste in the following <code>module.exports</code> object:

#### webpack.config.js
```
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new WorkboxPlugin({
      globDirectory: './',
      globPatterns: ['**\/*.{html,js,css}'],
      globIgnores: ['admin.html', 'node_modules/**', 'service-worker.js',
        'webpack.config.js', 'src/**', 'build/**'],
      swSrc: './src/service-worker.js',
      swDest: './service-worker.js',
    })
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css']
  }
};
```

In the command line run the following commands to test your code:
```
webpack
webpack-dev-server --open --hot
```

#### Explanation

Here we are adding the <code>workbox-webpack-plugin</code> to a very basic webpack configuration file. The plugin will inject the files matched in the glob patterns into the source service worker and copy the whole file to the destination service worker. The source service worker must contain an empty call to the <code>precache</code> method (<code>workboxSW.precache([]);</code>).

This example is meant to demonstrate just the <code>workbox-webpack-plugin</code> and doesn't really use webpack the way it's meant to be used. If you'd like to learn more about webpack itself, checkout the <a href="https://webpack.js.org/concepts/">introduction</a> on webpack.js.org. 

<a id="congrats" />


## Congratulations!




You have learned how to use Workbox to easily create production-ready service workers!

### What we've covered

* Using <code>workbox-sw</code> to precache static assets
* Using <code>workbox-sw</code> to create routes in your service worker
* Using <code>workbox-build</code> to inject a list of files for your service worker to precache
* Using <code>workbox-webpack-plugin</code> to inject a list of files for your service worker to precache

### Resources

* <a href="https://workboxjs.org/">Workboxjs.org</a>
* <a href="https://developers.google.com/web/tools/workbox/">Workbox</a> - developers.google.com


