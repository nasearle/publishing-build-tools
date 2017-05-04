# Lab: Caching Files with Service Worker




## Contents




<a href="#overview"><strong>Overview</strong></a>          

<a href="#1"><strong>1. Get set up</strong></a>          

<a href="#2"><strong>2. Cache the application shell</strong></a>          

<a href="#3"><strong>3. Serve files from the cache</strong></a>          

<a href="#4"><strong>4. Add network responses to the cache</strong></a><strong>  </strong>

<a href="#5"><strong>5. Respond with custom 404 page</strong></a>          

<a href="#6"><strong>6. Respond with custom offline page</strong></a>          

<a href="#7"><strong>7. Delete outdated caches</strong></a>          

<a href="#8"><strong>Congratulations!</strong></a><strong>  </strong>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/caching-files-with-service-worker.html">Caching Files with Service Worker</a>

<a id="overview" />


## Overview




This lab covers the basics of caching files with the service worker. The technologies involved are the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">Cache API</a> and the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API">Service Worker API</a>. See the <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/caching-files-with-service-worker.html">Caching files with the service worker</a> doc for a full tutorial on the Cache API. See <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/introduction_to_service_worker.html">Introduction to Service Worker</a> and <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-codelabs/content/docs/lab_scripting_the_service_worker.html">Lab: Scripting the service worker</a> for more information on service workers.

#### What you will learn

<em> How to use the Cache API to access and manipulate data in the cache
</em> How to cache the application shell and offline pages  
<em> How to intercept network requests and respond with resources in the cache
</em> How to remove unused caches on service worker activation

#### What you should know

<em> Basic JavaScript and HTML
</em> Familiarity with the concept and basic syntax of ES2015 <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises">Promises</a>

#### What you will need

<em> Computer with terminal/shell access
</em> Connection to the internet
<em> A <a href="https://jakearchibald.github.io/isserviceworkerready/">browser that supports <code>caches</code></a>
</em> A text editor

<a id="1" />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open your browser and navigate to <strong>localhost:8080/cache-api-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>cache-api-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab. 

This folder contains:

<em> <strong>images</strong> folder contains sample images, each with several versions at different resolutions
</em> <strong>pages</strong> folder contains sample pages and a custom offline page
<em> <strong>style</strong> folder contains the app's cascading stylesheet
</em> <strong>test</strong> folder contains QUnit tests
<em> <strong>index.html</strong> is the main HTML page for our sample site/application
</em> <strong>service-worker.js</strong> is the service worker file where we set up the interactions with the cache

<a id="2" />


## 2. Cache the application shell




Cache the application shell in the "install" event handler in the service worker.

Replace TODO 2 in <strong>serviceworker.js</strong> with the following code:

#### service-worker.js

```
var filesToCache = [
  '.',
  'style/main.css',
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700',
  'images/still_life-1600_large_2x.jpg',
  'images/still_life-800_large_1x.jpg',
  'images/still_life_small.jpg',
  'images/still_life_medium.jpg',
  'index.html',
  'pages/offline.html',
  'pages/404.html'

];

var staticCacheName = 'pages-cache-v1';

self.addEventListener('install', function(event) {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});
```

Save the code and reload the page in the browser.<a href="tools_for_pwa_developers.md#update">Update the service worker</a> and then <a href="tools_for_pwa_developers.md#storage">open the cache storage</a> in the browser. You should see the files appear in the table. You may need to refresh the page again for the changes to appear.

Open the first QUnit test page, <strong>app/test/test1.html</strong>, in another browser tab.

<div class="note">
<strong>Note: </strong>Be sure to open the test page using the localhost address so that it opens from the server and not directly from the file system.
</div> 

This page contains several tests for testing our app at each stage of the codelab. Passed tests are blue and failed tests are red. At this point, your app should pass the first two tests. These check that the cache exists and that it contains the app shell.

<div class="note">
<strong>Caution:</strong> Close the test page when you're finished with it, otherwise you won't be able to activate the updated service worker in the next sections. See the <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/introduction_to_service_workers.html#activation">Introduction to service worker</a> text for an explanation. 
</div>

<div class="note">
<strong>Note:</strong> In Chrome, you can <a href="tools_for_pwa_developers.md#clearcache">delete the cache</a> in <strong>DevTools</strong>.
</div>

#### Explanation

We first define the files to cache and assign them the to the <code>filesToCache</code> variable. These files make up the "application shell" (the static HTML,CSS, and image files that give your app a unified look and feel). We also assign a cache name to a variable so that updating the cache name (and by extension the cache version) happens in one place.

In the install event handler we create the cache with <a href="https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/open"><code>caches.open</code></a> and use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/addAll"><code>addAll</code> method</a> to add the files to the cache. We wrap this in <a href="https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil"><code>event.waitUntil</code></a> to extend the lifetime of the event until all of the files are added to the cache and <code>addAll</code> resolves successfully.

#### For more information

<em> <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/introduction-to-progressive-web-app-architectures.html">The Application Shell</a>
</em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/InstallEvent">The install event - MDN</a>

<a id="3" />


## 3. Serve files from the cache




Now that we have the files cached, we can intercept requests for those files from the network and respond with the files from the cache.

Replace TODO 3 in <strong>service-worker.js</strong> with the following:

#### service-worker.js

```
self.addEventListener('fetch', function(event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)

      // TODO 4 - Add fetched files to the cache
      
    }).catch(function(error) {

      // TODO 6 - Respond with custom offline page
      
    })
  );
});
```

Save the code and <a href="tools_for_pwa_developers.md#update">update the service worker</a> in the browser (make sure you have closed the <strong>test.html</strong> page). Refresh the page to see the network requests being logged to the console. Now <a href="tools_for_pwa_developers.md#offline">take the app offline</a> and refresh the page. The page should load normally!

#### Explanation

The <code>fetch</code> event listener intercepts all requests. We use <a href="https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith"><code>event.respondWith</code></a> to create a custom response to the request. Here we are using the <a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network">Cache falling back to network</a> strategy: we first check the cache for the requested resource (with <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/match"><code>caches.match</code></a>) and then, if that fails, we send the request to the network.

#### For more information

<em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/match">caches.match - MDN</a>
</em> <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working_with_the_fetch_api.html">The Fetch API</a>
<em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent">The fetch event - MDN</a>

<a id="4" />


## 4. Add network responses to the cache




We can add files to the cache as they are requested.

Replace TODO 4 in the <code>fetch</code> event handler with the code to add the files returned from the fetch to the cache:

#### service-worker.js

```
.then(function(response) {

  // TODO 5 - Respond with custom 404 page

  return caches.open(staticCacheName).then(function(cache) {
    if (event.request.url.indexOf('test') < 0) {
      cache.put(event.request.url, response.clone());
    }
    return response;
  });
});
```

Save the code. Take the app back online and <a href="tools_for_pwa_developers.md#update">update the service worker</a>. Visit at least one of the links on the homepage, then take the app offline again. Now if you revisit the pages they should load normally! Try navigating to some pages you haven't visited before.

Take the app back online and open <strong>app/test/test1.html</strong> in a new tab. Your app should now pass the third test that checks whether network responses are being added to the cache. Remember to close the test page when you're done.

#### Explanation

Here we are taking the responses returned from the network requests and putting them into the cache. 

We need to pass a clone of the response to <code>cache.put</code>, because the response can only be read once. See Jake Archibald's <a href="https://jakearchibald.com/2014/reading-responses/">What happens when you read a response</a> article for an explanation.

We have wrapped the code to cache the response in an <code>if</code> statement to ensure we are not caching our test page.

#### For more information

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache/put">Cache.put - MDN</a>

<a id="5" />


## 5. Respond with custom 404 page




Below TODO 5 in <strong>service-worker.js</strong>, write the code to respond with the <strong>404.html</strong> page from the cache if the response status is <code>404</code>. You can check the response status with <code>response.status</code>.

To test your code, save what you've written and then <a href="tools_for_pwa_developers.md#update">update the service worker</a> in the browser. Click the <strong>Non-existent file</strong> link to request a resource that doesn't exist.

#### Explanation

Network response errors do not throw an error in the <code>fetch</code> promise. Instead, <code>fetch</code> returns the response object containing the error code of the network error. This means we handle network errors in a <code>.then</code> instead of a <code>.catch</code>. However, if the <code>fetch</code> cannot reach the network (user is offline) an error is thrown in the promise and the <code>.catch</code> executes.

<div class="note">
<strong>Note:</strong> When intercepting a network request and serving a custom response, the service worker does not redirect the user to the address of the new response. The response is served at the address of the original request. For example, if the user requests a nonexistent file at <strong>www.example.com/non-existent.html</strong> and the service worker responds with a custom 404 page, <strong>404.html</strong>, the custom page will display at <strong>www.example.com/non-existent.html</strong>, not <strong>www.example.com/404.html</strong>.
</div>

#### For more information

<em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response/status">Response.status - MDN</a>
</em> <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status">Response status codes - MDN</a>
<em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response/ok">Response.ok - MDN</a>

#### Solution code

The solution code can be found in the <strong>05-404-page</strong> directory.

<a id="6" />


## 6. Respond with custom offline page




Below TODO 6 in the <code>.catch</code> in <strong>service-worker.js</strong>, write the code to respond with the <strong>offline.html</strong> page from the cache. The catch will trigger if the fetch to the network fails. 

To test your code, save what you've written and then update the service worker in the browser.<a href="tools_for_pwa_developers.md#offline">Take the app offline</a> and navigate to a page you haven't visited before to see the custom offline page.

#### Explanation

If <code>fetch</code> cannot reach the network, it throws an error and sends it to a <code>.catch</code>.

#### Solution code

The solution code can be found in the <strong>06-offline-page</strong> directory.

<a id="7" />


## 7. Delete outdated caches




We can get rid of unused caches in the service worker "activate" event.

Replace TODO 7 in <strong>service-worker.js</strong> with the following code:

#### service-worker.js

```
self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  var cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

Try changing the name of the cache to "pages-cache-v2": 

#### service-worker.js

```
var staticCacheName = 'pages-cache-v2';
```

Save the code and <a href="tools_for_pwa_developers.md#update">update the service worker</a> in the browser.<a href="tools_for_pwa_developers.md#storage">Inspect the cache storage</a> in your browser. You should see just the new cache. The old cache, <code>pages-cache-v1</code>, has been removed.

Open <strong>app/test/test2.html</strong> in a new browser tab. The test checks whether <code>pages-cache-v1</code> has been deleted and that <code>pages-cache-v2</code> has been created.

#### Explanation

We delete old caches in the <code>activate</code> event to make sure that we aren't deleting caches before the new service worker has taken over the page. We create an array of caches that are currently in use and delete all other caches.

#### For more information

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">Promise.all - MDN</a>
<em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">Array.map - MDN</a>

#### Solution code

The solution code can be found in the <strong>solution</strong> directory.

<a id="8" />


## Congratulations!




You have learned how to use the Cache API in the service worker.

### What we've covered

You have learned the basics of using the Cache API in the service worker. We have covered caching the application shell, intercepting network requests and responding with items from the cache, adding resources to the cache as they are requested, responding to network errors with a custom offline page, and deleting unused caches.

### Resources

#### Learn more about caching and the Cache API

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache">Cache - MDN</a>
<em> <a href="https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/">The Offline Cookbook</a>

#### Learn more about using service workers

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers">Using Service Workers - MDN</a>


