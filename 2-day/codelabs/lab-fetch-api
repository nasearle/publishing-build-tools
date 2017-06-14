# Lab: Fetch API




## Contents




<a href="#overview"><strong>Overview</strong></a> 

<a href="#1"><strong>1. Get set up</strong></a> 

<a href="#2"><strong>2. Fetching a resource</strong></a> 

<a href="#3"><strong>3. Fetch an image</strong></a> 

<a href="#4"><strong>4. Fetch text</strong></a> 

<a href="#5"><strong>5. Using HEAD requests</strong></a> 

<a href="#6"><strong>6. Using POST requests</strong></a> 

<a href="#7"><strong>7. Optional: CORS and custom headers</strong></a> 

<a href="#8"><strong>Congratulations!</strong></a> 

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working_with_the_fetch_api.html">Working with the Fetch API</a>

<a id="overview" />


## Overview




This lab walks you through using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a>, a simple interface for fetching resources, as an improvement over the <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a> API.

#### What you will learn

* How to use the Fetch API to request resources 
* How to make GET, HEAD, and POST requests with fetch

#### What you should know

* Basic JavaScript and HTML
* Familiarity with the concept and basic syntax of ES2015 <a href="http://www.html5rocks.com/en/tutorials/es6/promises/">Promises</a>
* The concept of an <a href="https://en.wikipedia.org/wiki/Immediately-invoked_function_expression">Immediately Invoked Function Expression</a> (IIFE)
* How to enable the developer console
* Some familiarity with <a href="http://www.json.org/">JSON</a> 

#### What you will need

* Computer with terminal/shell access
* Connection to the internet 
* A browser that supports <a href="http://caniuse.com/#feat=fetch">Fetch</a>
* A text editor
* <a href="https://nodejs.org/en/">Node</a> and <a href="https://www.npmjs.com/">npm</a>

<div class="note">
<strong>Note: </strong>Although the Fetch API is <a href="http://caniuse.com/#feat=fetch">not currently supported in all browsers</a>, there is a <a href="https://github.com/github/fetch">polyfill</a> (but see the readme for important caveats). 
</div>

<a id="1" />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open your browser and navigate to <strong>localhost:8080/fetch-api-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>fetch-api-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab.

This folder contains:

* <strong>echo-servers</strong> contains files that are used for running echo servers
* <strong>examples</strong> contains sample resources that we use in experimenting with fetch
* <strong>index.html</strong> is the main HTML page for our sample site/application
* <strong>js/main.js</strong> is the main JavaScript for the app, and where you will write all your code
* <strong>test/test.html</strong> is a file for testing your progress
* <strong>package.json</strong> is a configuration file for node dependencies 

<a id="2" />


## 2. Fetching a resource




### 2.1 Fetch a JSON file

Open <strong>js/main.js</strong> in your text editor.

Replace the TODO 2.1a comment with the following code:

#### main.js
```
if (!('fetch' in window)) {
  console.log('Fetch API not found, try including the polyfill');
  return;
}
```

In the <code>fetchJSON</code> function, replace TODO 2.1b with the following code:

#### main.js
```
fetch('examples/animals.json')
.then(logResult)
.catch(logError);
```

Save the script and refresh the page. Click <strong>Fetch JSON</strong>. The console should log the fetch response. 

<div class="note">
<strong>Note:</strong> We are using the <a href="https://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript">JavaScript module pattern</a> in this file. This is just to help keep the code clean and allow for easy testing. It is not related to the Fetch API.
</div>

<strong>Optional</strong>: Open the site on an <a href="http://caniuse.com/#search=fetch">unsupported browser</a> and verify that the support check conditional works. 

#### Explanation

The code starts by checking for fetch support. If the browser doesn't support fetch, the script logs a message and fails immediately. 

We pass the path for the resource we want to retrieve as a parameter to fetch, in this case <strong>examples/animals.json</strong>. A promise that resolves to a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">Response object</a> is returned. If the promise resolves, the response is passed to the <code>logResult</code> function. If the promise rejects, the <code>catch</code> takes over and the error is passed to the <code>logError</code> function. 

Response objects represent the response to a request. They contain the response body and also useful properties and methods. 

### 2.2 Examine response properties

Find the values of the <code>status</code>, <code>url</code>, and <code>ok</code> properties of the response for the fetch we just made. What are these values? Hint: Look in the console.

In the <code>fetchJSON</code> function we just wrote in section 2.1, replace the <strong>examples/animals.json</strong> resource with <strong>examples/non-existent.json</strong>. So the <code>fetchJSON</code> function should now look like:

#### main.js
```
function fetchJSON() {
  fetch('examples/non-existent.json')
  .then(logResult)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>Fetch JSON</strong> again to try and fetch this new resource. 

Now find the <code>status</code>, <code>URL</code>, and <code>ok</code> properties of the response for this new fetch we just made. What are these values?

The values should be different for the two files (do you understand why?). If you got any console errors, do the values match up with the context of the error? 

#### Explanation

Why didn't a failed response activate the <code>catch</code> block? This is an important note for fetch and promises—bad responses (like 404s) still resolve! A fetch promise only rejects if the request was unable to complete, so you must always check the validity of the response. 

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">Response objects</a>

### 2.3 Check response validity

We need to update our code to check the validity of responses.

Complete the function called <code>validateResponse</code> in TODO 2.3. The function should accept a response object as input. If the response object's <code>ok</code> property is false, the function should throw an error containing <code>response.statusText</code>. If the response object's <code>ok</code> property is true, the function should simply return the response object.

You can confirm that you have written the function correctly by navigating to <strong>app/test/test.html</strong>. This page runs tests on some of the functions you write. If there are errors with your implementation of a function (or you haven't implemented them yet), the test displays in red. Passed tests display in blue. Refresh the <strong>test.html</strong> page to retest your functions.

<div class="note">
<strong>Note:</strong> Be sure to open the test page using the localhost address so that it opens from the server and not directly from the file system.
</div>

Once you have successfully written the function, replace <code>fetchJSON</code> with the following code:

#### main.js
```
function fetchJSON() {
  fetch('examples/non-existent.json')
  .then(validateResponse)
  .then(logResult)
  .catch(logError);
}
```

This is <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises#chaining">promise chaining</a>.

Save the script and refresh the page. Click <strong>Fetch JSON</strong>. Now the response for <strong>examples/non-existent.json</strong> should trigger the <code>catch</code> block, unlike in section 2.2. Check the console to confirm this.

Now replace <strong>examples/non-existent.json</strong> resource in the <code>fetchJSON</code> function with the original <strong>examples/animals.json</strong> from section 2.1. The function should now look like:

#### main.js
```
function fetchJSON() {
  fetch('examples/animals.json')
  .then(validateResponse)
  .then(logResult)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>Fetch JSON</strong>. You should see that the response is being logged successfully like in section 2.1.

#### Explanation

Now that we have added the <code>validateResponse</code> check, bad responses (like 404s) throw an error and the <code>catch</code> takes over. This prevents bad responses from propagating down the fetch chain.

### 2.4 Read the response

Responses must be read in order to access the body of the response. Response objects have <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">methods</a> for doing this. 

To complete TODO 2.4, replace the <code>readResponseAsJSON</code> function with the following code:

#### main.js
```
function readResponseAsJSON(response) {
  return response.json();
}
```

(You can check that you have done this correctly by navigating to <strong>app/test/test.html</strong>.)

Then replace the <code>fetchJSON</code> function with the following code:

#### main.js
```
function fetchJSON() {
  fetch('examples/animals.json') // 1
  .then(validateResponse) // 2
  .then(readResponseAsJSON) // 3
  .then(logResult) // 4
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>Fetch JSON</strong>. Check the console to see that the JSON from <strong>examples/animals.json</strong> is being logged.

#### Explanation

Let's review what is happening.

Step 1. Fetch is called on a resource, <strong>examples/animals.json</strong>. Fetch returns a promise that resolves to a Response object. When the promise resolves, the response object is passed to <code>validateResponse</code>.

Step 2. <code>validateResponse</code> checks if the response is valid (is it a 200?). If it isn't, an error is thrown, skipping the rest of the <code>then</code> blocks and triggering the <code>catch</code> block. This is particularly important. Without this check bad responses are passed down the chain and could break later code that may rely on receiving a valid response. If the response is valid, it is passed to <code>readResponseAsJSON</code>.

Step 3. <code>readResponseAsJSON</code> reads the body of the response using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/json">Response.json()</a> method. This method returns a promise that resolves to JSON. Once this promise resolves, the JSON data is passed to <code>logResult</code>. (Can you think of what would happen if the promise from <code>response.json()</code> rejects?)

Step 4. Finally, the JSON data from the original request to <strong>examples/animals.json</strong> is logged by <code>logResult</code>. 

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/json">Response.json()</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response#Methods">Response methods</a>
* <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises#chaining">Promise chaining</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>02-fetching-a-resource</strong> folder.

<a id="3" />


## 3. Fetch an image




Fetch is not limited to JSON. In this example we will fetch an image and append it to the page.

To complete TODO 3a, replace the <code>showImage</code> function with the following code:

#### main.js
```
function showImage(responseAsBlob) {
  var container = document.getElementById('container');
  var imgElem = document.createElement('img');
  container.appendChild(imgElem);
  var imgUrl = URL.createObjectURL(responseAsBlob);
  imgElem.src = imgUrl;
}
```

To complete TODO 3b, finish writing the <code>readResponseAsBlob</code> function. The function should accept a response object as input. The function should return a promise that resolves to a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob">Blob</a>. 

<div class="note">
<strong>Note:</strong> This function will be very similar to <code>readResponseAsJSON</code>. Check out the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/blob"><code>blob()</code></a> method documentation).
</div>

(You can check that you have done this correctly by navigating to <strong>app/test/test.html</strong>.)

To complete TODO 3c, replace the <code>fetchImage</code> function with the following code:

#### main.js
```
function fetchImage() {
  fetch('examples/kitten.jpg')
  .then(validateResponse)
  .then(readResponseAsBlob)
  .then(showImage)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>Fetch image.</strong> You should see an adorable kitten on the page.

#### Explanation

In this example an image is being fetched, <strong>examples/kitten.jpg</strong>. Just like in the previous exercise, the response is validated with <code>validateResponse</code>. The response is then read as a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob">Blob</a> (instead of JSON as in section 2). An image element is created and appended to the page, and the image's <code>src</code> attribute is set to a data URL representing the Blob.

<div class="note">
<strong>Note:</strong> The <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL">URL object's</a> <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL">createObjectURL() method</a> is used to generate a data URL representing the Blob. This is important to note. You cannot set an image's source directly to a Blob. The Blob must be converted into a data URL.
</div>

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob">Blobs</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/blob">Response.blob()</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/URL">URL object</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>03-fetching-images</strong> folder.

<a id="4" />


## 4. Fetch text




In this example we will fetch text and add it to the page. 

To complete TODO 4a, replace the <code>showText</code> function with the following code:

#### main.js
```
function showText(responseAsText) {
  var message = document.getElementById('message');
  message.textContent = responseAsText;
}
```

To complete TODO 4b, finish writing the <code>readResponseAsText</code> function.. This function should accept a response object as input. The function should return a promise that resolves to text. 

<div class="note">
<strong>Note:</strong> This function will be very similar to <code>readResponseAsJSON</code> and <code>readResponseAsBlob</code>. Check out the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/text"><code>text()</code></a> method documentation).
</div>

(You can check that you have done this correctly by navigating to <strong>app/test/test.html</strong>.)

To complete TODO 4c, replace the <code>fetchText</code> function with the following code:
```
function fetchText() {
  fetch('examples/words.txt')
  .then(validateResponse)
  .then(readResponseAsText)
  .then(showText)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>Fetch text</strong>. You should see a message on the page.

#### Explanation

In this example a text file is being fetched, <strong>examples/words.txt</strong>. Like the previous two exercises, the response is validated with <code>validateResponse</code>. Then the response is read as text, and appended to the page.

<div class="note">
<strong>Note: </strong>While it may be tempting to fetch HTML and append it using the <code>innerHTML</code> attribute, be careful. This can expose your site to <a href="https://en.wikipedia.org/wiki/Cross-site_scripting">cross-site scripting attacks</a>!
</div>

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body/text">Response.text()</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>04-fetching-text</strong> folder.

<div class="note">
<strong>Note: </strong>Note that the methods used in the previous examples are actually methods of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Body">Body</a>, a Fetch API <a href="https://developer.mozilla.org/en-US/docs/Glossary/mixin">mixin</a> that is implemented in the Response object.
</div> 

<a id="5" />


## 5. Using HEAD requests




By default, fetch uses the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods">GET method</a>, which retrieves a specific resource. But fetch can also use other HTTP methods. 

### 5.1 Make a HEAD request

To complete TODO 5.1, replace the <code>headRequest</code> function with the following code:

#### main.js
```
function headRequest() {
  fetch('examples/words.txt', {
    method: 'HEAD'
  })
  .then(validateResponse)
  .then(readResponseAsText)
  .then(logResult)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>HEAD request</strong>. What do you notice about the console log? Is it showing you the text in <strong>examples/words.txt</strong>, or is it empty?

#### Explanation

<code>fetch()</code> can receive a second optional parameter, <code>init</code>. This enables the creation of custom settings for the fetch request, such as the <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods">request method</a>, cache mode, credentials, <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">and more</a>.

In this example we set the fetch request method to HEAD using the <code>init</code> parameter. HEAD requests are just like GET requests, except the body of the response is empty. This kind of request can be used when all you want is metadata about a file but don't need to transport all of the file's data. 

### 5.2 Optional: Find the size of a resource

Let's look at the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers">Headers</a> of the fetch response from section 5.1 to determine the size of <strong>examples/words.txt</strong>.

Complete the function called <code>logSize</code> in TODO 5.2. The function accepts a response object as input. The function should log the <code>content-length</code> of the response. To do this, you need to access the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response/headers">headers</a> property of the response, and use the headers object's <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers/get">get</a> method. After logging the the <code>content-length</code> header, the function should then return the response.

Then replace the <code>headRequest</code> function with the following code:
```
function headRequest() {
  fetch('examples/words.txt', {
    method: 'HEAD'
  })
  .then(validateResponse)
  .then(logSize)
  .then(readResponseAsText)
  .then(logResult)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>HEAD request</strong>. The console should log the size (in bytes) of <strong>examples/words.txt</strong> (it should be 74 bytes).

#### Explanation

In this example, the HEAD method is used to request the size (in bytes) of a resource (represented in the <code>content-length</code> header) without actually loading the resource itself. In practice this could be used to determine if the full resource should be requested (or even how to request it).

<strong>Optional</strong>: Find out the size of <strong>examples/words.txt</strong> using another method and confirm that it matches the value from the response header (you can look up how to do this for your specific operating system—bonus points for using the command line!).

#### For more information

* <a href="https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol#Request_methods">HTTP methods</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">Fetch method signature</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers">Headers</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>05-head-requests</strong> folder.

<a id="6" />


## 6. Using POST requests




Fetch can also send data with POST requests. 

### 6.1 Set up an echo server

For this example you need to run an echo server. From the <strong>fetch-api-lab/app</strong> directory run the following commands:

    npm install
    node echo-servers/echo-server-cors.js

You can check that you have successfully started the server by navigating to <strong>app/test/test.html</strong> and checking the 'echo server #1 running (with CORS)' task. If it is red, then the server is not running.

#### Explanation

In this step we install and run a simple server at <strong>localhost:5000/</strong> that echoes back the requests sent to it.

<div class="note">
<strong>Note: </strong>If you need to, you can stop the server by pressing <strong>Ctrl+C</strong> from the command line. 
</div>

### 6.2 Make a POST request

To complete TODO 6.2, replace the <code>postRequest</code> function with the following code:

#### main.js
```
function postRequest() {
  // TODO 6.3
  fetch('http://localhost:5000/', {
    method: 'POST',
    body: 'name=david&message=hello'
  })
  .then(validateResponse)
  .then(readResponseAsText)
  .then(logResult)
  .catch(logError);
}
```

Save the script and refresh the page. Click <strong>POST request</strong>. Do you see the sent request echoed in the console? Does it contain the name and message?

#### Explanation

To make a POST request with fetch, we use the <code>init</code> parameter to specify the method (similar to how we set the HEAD method in section 5). This is also where we set the <strong>body</strong> of the request. The body is the data we want to send. 

<div class="note">
<strong>Note:</strong> In production, remember to always encrypt any sensitive user data.
</div>

When data is sent as a POST request to <strong>localhost:5000/</strong>, the request is echoed back as the response. The response is then validated with <code>validateResponse</code>, read as text, and logged to the console.

In practice, this server would be a 3rd party API. 

### 6.3 Use the FormData interface

You can use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData">FormData</a> interface to easily grab data from forms.

In the <code>postRequest</code> function, replace TODO 6.3 with the following code:

#### main.js
```
var formData = new FormData(document.getElementById('myForm'));
```

Then replace the value of the <code>body</code> parameter with the <code>formData</code> variable. 

Save the script and refresh the page. Fill out the form (the <strong>Name</strong> and <strong>Message</strong> fields) on the page, and then click <strong>POST</strong> request. Do you see the form content logged in the console?

#### Explanation

The <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData"><code>FormData</code></a> constructor can take in an HTML <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form"><code>form</code></a>, and create a <code>FormData</code> object. This object is populated with the form's keys and values.

#### For more information

* <a href="https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html">POST requests</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/FormData">FormData</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>06-post-requests</strong> folder.

<a id="7" />


## 7. Optional: CORS and custom headers




### 7.1 Start a new echo server

Stop the previous echo server (by pressing <strong>Ctrl+C</strong> from the command line) and start a new echo server from the <strong>fetch-lab-api/app</strong> directory by running the following command:

    node echo-servers/echo-server-no-cors.js

You can check that you have successfully started the server by navigating to <strong>app/test/test.html</strong> and checking the 'echo server #2 running (without CORS)' task. If it is red, then the server is not running.

#### Explanation

The application we run in this step sets up another simple echo server, this time at <strong>localhost:5001/</strong>. This server, however, is not configured to accept <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS">cross origin requests</a>.

<div class="note">
<strong>Note: </strong>You can stop the server by pressing <strong>Ctrl+C</strong> from the command line. 
</div>

### 7.2 Fetch from the new server

Now that the new server is running at <strong>localhost:5001/</strong>, we can send a fetch request to it.

Update the <code>postRequest</code> function to fetch from <strong>localhost:5001/</strong> instead of <strong>localhost:5000/</strong>. Save the script, refresh the page, and then click <strong>POST Request</strong>.

You should get an error indicating that the cross-origin request is blocked due to the CORS <code>Access-Control-Allow-Origin</code> header being missing. 

Update fetch in the <code>postRequest</code> function to use <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">no-cors</a> mode (as the error log suggests). Comment out the <code>validateResponse</code> and <code>readResponseAsText</code> steps in the fetch chain. Save the script and refresh the page. Then click <strong>POST Request</strong>.

You should get a response object logged in the console.

#### Explanation

Fetch (and XMLHttpRequest) follow the <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy">same-origin policy</a>. This means that browsers restrict cross-origin HTTP requests from within scripts. A cross-origin request occurs when one domain (for example <strong>http://foo.com/</strong>) requests a resource from a separate domain (for example <strong>http://bar.com/</strong>). 

<div class="note">
<strong>Note:</strong> Cross-origin request restrictions are often a point of confusion. Many resources like images, stylesheets, and scripts are fetched across domains (i.e., cross-origin). However, these are exceptions to the same-origin policy. Cross-origin requests are still restricted from  <em>within scripts</em> .
</div>

Since our app's server has a different port number than the two echo servers, requests to either of the echo servers are considered cross-origin. The first echo server, however, running on <strong>localhost:5000/</strong>, is configured to support <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS">CORS</a>. The new echo server, running on <strong>localhost:5001/</strong>, is not (which is why we get an error). 

Using <code>mode: no-cors</code> allows fetching an opaque response. This prevents accessing the response with JavaScript (which is why we comment out <code>validateResponse</code> and <code>readResponseAsText</code>), but the response can still be <a href="https://jakearchibald.com/2015/thats-so-fetch/#no-cors-and-opaque-responses">consumed by other API's</a> or cached by a service worker.

### 7.3 Modify request headers

Fetch also supports modifying request headers. Stop the <strong>localhost:5001</strong> (no CORS) echo server and restart the <strong>localhost:5000</strong> (CORS) echo server from section 6  (<code>node echo-servers/echo-server-cors.js</code>).

Update the <code>postRequest</code> function to fetch from <strong>localhost:5000/</strong> again. Remove the <code>no-cors</code> mode setting from the <code>init</code> object or update the mode to <code>cors</code> (these are equivalent, as <code>cors</code> is the default mode). Uncomment the <code>validateResponse</code> and <code>readResponseAsText</code> steps in the fetch chain.

Now use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers">Header interface</a> to create a Headers object inside the <code>postRequest</code> function called <code>customHeaders</code> with the <code>Content-Type</code> header equal to <code>text/plain</code>. Then add a headers property to the <code>init</code> object and set the value to be the <code>customHeaders</code> variable. Save the script and refresh the page. Then click <strong>POST Request</strong>.

You should see that the echoed request now has a <code>Content-Type</code> of <code>plain/text</code> (as opposed to <code>multipart/form-data</code> as it had previously).

Now add a custom <code>Content-Length</code> header to the <code>customHeaders</code> object and give the request an arbitrary size. Save the script, refresh the page, and click <strong>POST Request</strong>. Observe that this header is not modified in the echoed request.

#### Explanation

The <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers/Headers">Header interface</a> enables the creation and modification of <a href="https://developer.mozilla.org/en-US/docs/Web/API/Headers">Headers</a> objects. Some headers, like <code>Content-Type</code> can be modified by fetch. Others, like <code>Content-Length</code>, are <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Guard">guarded</a> and can't be modified (for security reasons).

### 7.4 Set custom request headers

Fetch supports setting custom headers.

Remove the <code>Content-Length</code> header from the <code>customHeaders</code> object in the <code>postRequest</code> function. Add the custom header <code>X-Custom</code> with an arbitrary value (for example '<code>X-CUSTOM': 'hello world'</code>). Save the script, refresh the page, and then click <strong>POST Request</strong>.

You should see that the echoed request has the <code>X-Custom</code> that you added. 

Now add a <code>Y-Custom</code> header to the Headers object. Save the script, refresh the page, and click <strong>POST Request</strong>. 

You should get an error similar to this in the console:

<code>Fetch API cannot load http://localhost:5000/. Request header field y-custom is not allowed by Access-Control-Allow-Headers in preflight response.</code>

#### Explanation

Like cross-origin requests, custom headers must be supported by the server from which the resource is requested. In this example, our echo server is configured to accept the <code>X-Custom</code> header but not the <code>Y-Custom</code> header (you can open <strong>echo-servers/echo-server-cors.js</strong> and look for <code>Access-Control-Allow-Headers</code> to see for yourself). Anytime a custom header is set, the browser performs a <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests">preflight</a> check. This means that the browser first sends an OPTIONS request to the server, to determine what HTTP methods and headers are allowed by the server. If the server is configured to accept the method and headers of the original request, then it is sent, otherwise an error is thrown. 

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS">Cross Origin Resource Sharing (CORS)</a>
* <a href="https://jakearchibald.com/2015/thats-so-fetch/">That's so fetch!</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>solution</strong> folder.

<a id="8" />


## Congratulations!




You now know how to use the Fetch API to request resources and post data to servers.

<a id="9" />

### Resources

* <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working_with_the_fetch_api.html">Fetch API Concepts</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Learn more about the Fetch API</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch">Learn more about Using Fetch</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">Learn more about GlobalFetch.fetch()</a>
* <a href="https://developers.google.com/web/updates/2015/03/introduction-to-fetch">Get an Introduction to Fetch</a>
* <a href="https://davidwalsh.name/fetch">David Walsh's blog on fetch</a>
* <a href="https://jakearchibald.com/2015/thats-so-fetch/">Jake Archibald's blog on fetch</a>


