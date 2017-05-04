# Lab: Promises




## Contents




<a href="#overview"><strong>Overview</strong></a><strong>  </strong>

<a href="#1"><strong>1. Get set up</strong></a><strong>  </strong>

<a href="#2"><strong>2. </strong><strong>Using promises</strong></a><strong>  </strong>

<a href="#3"><strong>3. Chaining promises</strong></a><strong>  </strong>

<a href="#4"><strong>4. Optional: Using Promise.all and Promise.race</strong></a><strong>  </strong>

<a href="#congrats"><strong>Congratulations!</strong></a>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working_with_promises.html">Working with Promises</a>

<a id="overview" />


## Overview




This lab teaches you how to use JavaScript <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promises</a>.

#### What you will learn

<em> How to create promises
</em> How to chain promises together
<em> How to handle errors in promises
</em> How to use Promise.all and Promise.race

#### What you should know

<em> Basic JavaScript and HTML
</em> The concept of an <a href="https://en.wikipedia.org/wiki/Immediately-invoked_function_expression">Immediately Invoked Function Expression</a> (IIFE)
<em> How to enable the developer console

#### What you will need

</em> A browser that supports <a href="http://caniuse.com/#feat=promises">Promises</a> and <a href="http://caniuse.com/#feat=fetch">Fetch</a>
<em> A text editor
</em> Computer with terminal/shell access
<em> Connection to the internet 

<a id="1">


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>. 

Open your browser and navigate to <strong>localhost:8080/promises-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>promises-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab.

This folder contains:

</em> <strong>flags/chile.png</strong>, <strong>flags/peru.png</strong>, <strong>flags/spain.png</strong> - sample resources that we use to experiment
<em> <strong>js/main.js</strong> is the main JavaScript file for the app
</em> <strong>test/test.html</strong> is a file for testing your progress
<em> <strong>index.html</strong> is the main HTML page for our sample site/application

<a id="2">


## 2. Using promises




This step uses <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises">Promises</a> to handle asynchronous code in JavaScript.

### 2.1 Create a promise

Let's start by creating a simple promise. 

Complete the <code>getImageName</code> function by replacing TODO 2.1 in <strong>js/main.js</strong> with the following code:

#### main.js

```
country = country.toLowerCase();
var promiseOfImageName = new Promise(function(resolve, reject) {
  setTimeout(function() {
    if (country === 'spain' || country === 'chile' || country === 'peru') {
      resolve(country + '.png');
    } else {
      reject(Error('Didn\'t receive a valid country name!'));
    }
  }, 1000);
});
console.log(promiseOfImageName);
return promiseOfImageName;
```

Save the script and refresh the page. 

Enter "Spain" into the app's <strong>Country Name</strong> field. Then, click <strong>Get Image Name</strong>. You should see a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise object</a> logged in the console.

Now enter "Hello World" into the <strong>Country Name</strong> field and click <strong>Get Image Name</strong>. You should see another Promise object logged in the console, followed by an error.

<div class="note">
<strong>Note: </strong>Navigate to <strong>app/test/test.html</strong> in the browser to check your function implementations. Functions that are incorrectly implemented or unimplemented show red errors. Be sure to open the test page using the localhost address so that it opens from the server and not directly from the file system.
</div>

#### Explanation

The <code>getImageName</code> function creates a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">promise</a>. A promise represents a value that might be available now, in the future, or never. In effect, a promise lets an asynchronous function such as <code>getImageName</code> (the <code>setTimeout</code> method is used to make <code>getImageName</code> asynchronous) return a value much like a synchronous function. Rather than returning the final value (in this case, "Spain.png"), <code>getImageName</code> returns a promise of a future value (this is what you see in the console log). Promise construction typically looks like <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises#promises_arrive_in_javascript">this example at developers.google.com</a>:

#### main.js

```
var promise = new Promise(function(resolve, reject) {
  // do a thing, possibly async, then...

  if (/</em> everything turned out fine <em>/) {
    resolve("Stuff worked!");
  }
  else {
    reject(Error("It broke"));
  }
});
```

Depending on the outcome of an asynchronous operation, a promise can either <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve">resolve</a> with a value or <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject">reject</a> with an error. In the <code>getImageName</code> function, the <code>promiseOfImageName</code> promise either resolves with an image filename, or rejects with a custom error signifying that the function input was invalid. 

<strong>Optional</strong>: Complete the <code>isSpain</code> function so that it takes a string as input, and returns a new promise that resolves if the function input is "Spain", and rejects otherwise. You can verify that you implemented <code>isSpain</code> correctly by navigating to <strong>app/test/test.html</strong> and checking the <code>isSpain</code> test. Note that this exercise is optional and is not used in the app.

### 2.2. Use the promise

This section uses the promise we just created. 

Replace TODO 2.2 inside the <code>flagChain</code> function in <strong>js/main.js</strong> with the following code:

#### main.js

```
return getImageName(country)
.then(logSuccess, logError);
```

Save the script and refresh the page. 

Enter "Spain" into the app's <strong>Country Name</strong> field again. Now click <strong>Flag Chain</strong>. In addition to the promise object, "Spain.png" should now be logged.

Now enter "Hello World" into the <strong>Country Name</strong> text input and click <strong>Flag Chain</strong> again. You should see another promise logged in the console, followed by a custom error message.

#### Explanation

The <code>flagChain</code> function returns the result of <code>getImageName</code>, which is a promise. The <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then">then</a> method lets us implicitly pass the settled (either resolved or rejected) promise to another function. The <code>then</code> method takes two arguments in the following order: 

1. The function to be called if the promise resolves.
2. The function to be called if the promise rejects. 

If the first function is called, then it is implicitly passed the resolved promise value. If the second function is called, then it is implicitly passed the rejection error.   

<div class="note">
<strong>Note:</strong> We used named functions inside <code>then</code> as good practice, but we could use <a href="https://en.wikibooks.org/wiki/JavaScript/Anonymous_functions">anonymous functions</a> as well.
</div>

### 2.3 Use catch for error handling

Let's look at the <code>catch</code> method, which is a clearer alternative for error handling.

Replace the code inside the <code>flagChain</code> function with the following:

#### main.js

```
return getImageName(country)
.then(logSuccess)
.catch(logError);
```

Save the script and refresh the page. Repeat the experiments from section 2.2 and note that the results are identical. 

#### Explanation

The <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch">catch</a> method is similar to <code>then</code>, but deals only with rejected cases. It behaves like <code>then(undefined, onRejected)</code>. With this new pattern, if the promise from <code>getImageName</code> resolves, then <code>logSuccess</code> is called (and is implicitly passed the resolved promise value). If the promise from <code>getImageName</code> rejects, then <code>logError</code> is called (and implicitly passed the rejection error). 

This code is not quite equivalent to the code in section 2.2, however. This new code also triggers <code>catch</code> if <code>logSuccess</code> rejects, because <code>logSuccess</code> occurs before the <code>catch</code>. This new code would actually be equivalent to the following:

#### main.js

```
return getImageName(country)
.then(logSuccess)
.then(undefined, logError);
```

The difference is subtle, but extremely useful. Promise rejections skip forward to the next <code>then</code> with a rejection callback (or <code>catch</code>, since they're equivalent). With <code>then(func1, func2)</code>, <code>func1</code> or <code>func2</code> will be called, never both. But with <code>then(func1).catch(func2)</code>, both will be called if <code>func1</code> rejects, as they're separate steps in the chain. 

<strong>Optional</strong>: If you wrote the optional <code>isSpain</code> function in section 2.1, complete the <code>spainTest</code> function so that it takes a string as input and returns a promise using an <code>isSpain</code> call with the input string. Use <code>then</code> and <code>catch</code> such that <code>spainTest</code> returns a value of true if the <code>isSpain</code> promise resolves and false if the <code>isSpain</code> promise rejects (you can use the <code>returnTrue</code> and <code>returnFalse</code> helper functions). You can verify that you have implemented <code>spainTest</code> correctly by navigating to <strong>app/test/test.html</strong> and checking the <code>spainTest</code> test.

#### For more information

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise object</a>
<em> <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises">Promises introduction</a>
</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve">Resolve</a>
<em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject">Reject</a>
</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then">Then</a>
<em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch">Catch</a> 

#### Solution code

To get a copy of the working code, navigate to the <strong>02-basic-promises</strong> folder.

<a id="3" />


## 3. Chaining promises




The <code>then</code> and <code>catch</code> methods also return promises, making it possible to chain promises together.

### 3.1 Add asynchronous steps

Replace the code in the <code>flagChain</code> function with the following:

#### main.js

```
return getImageName(country)
.then(fetchFlag)
.then(processFlag)
.then(appendFlag)
.catch(logError);
```

Save the script and refresh the page.

Enter "Spain" into the app's <strong>Country Name</strong> text input. Now click <strong>Flag Chain</strong>. You should see the Spanish flag display on the page.

Now enter "Hello World" into the <strong>Country Name</strong> text input and click <strong>Flag Chain</strong>. The console should show that the error is triggering <code>catch</code>.

#### Explanation

The updated <code>flagChain</code> function does the following:

1. As before, <code>getImageName</code> returns a promise. The promise either resolves with an image file name, or rejects with an error, depending on the function's input.
2. If the returned promise resolves, then the image file name is passed to <code>fetchFlag</code> inside the first <code>then</code>. This function requests the corresponding image file asynchronously, and returns a promise (see <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">fetch</a> documentation).
3. If the promise from <code>fetchFlag</code> resolves, then the resolved value (a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Response">response</a> object) is passed to <code>processFlag</code> in the next <code>then</code>. The <code>processFlag</code> function checks if the response is ok, and throws an error if it is not. Otherwise, it processes the response with the <code>blob</code> method, which also returns a promise.
4. If the promise from <code>processFlag</code> resolves, the resolved value (a <a href="https://developer.mozilla.org/en-US/docs/Web/API/Blob">blob</a>), is passed to the <code>appendFlag</code> function. The <code>appendFlag</code> function creates an image from the value and appends it to the DOM. 

If any of the promises reject, then all subsequent <code>then</code> blocks are skipped, and <code>catch</code> executes, calling <code>logError</code>. Throwing an error in the <code>processFlag</code> function also triggers the <code>catch</code> block.

### 3.2 Add a recovery catch

The <code>flagChain</code> function does not add a flag to the page if an invalid country is used as input (<code>getImageName</code> rejects and execution skips to the <code>catch</code> block). 

Add a <code>catch</code> to the promise chain that uses the <code>fallbackName</code> function to supply a fallback image file name to the <code>fetchFlag</code> function if an invalid country is supplied to <code>flagChain</code>. To verify this was added correctly, navigate to <strong>app/test/test.html</strong> and check the <code>flagChain</code> test.

<div class="note">
<strong>Note:</strong> This test is asynchronous and may take a few moments to complete.
</div>

Save the script and refresh the page. Enter "Hello World" in the <strong>Country Name</strong> field and click <strong>Flag Chain</strong>. Now the Chilean flag should display even though an invalid input was passed to <code>flagChain</code>.

#### Explanation

Because <code>catch</code> returns a promise, you can use the <code>catch</code> method inside a promise chain to  </em>recover<em>  from earlier failed operations.

#### For more information

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch">Fetch API</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>03-chaining-promises</strong> folder.

<a id="4" />


## 4. Optional: Using Promise.all and Promise.race




### 4.1 Promise.all

Often we want to take action only after a collection of asynchronous operations have completed successfully. 

Complete the <code>allFlags</code> function such that it takes a list of promises as input. The function should use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">Promise.all</a> to evaluate the list of promises. If all promises resolve successfully, then <code>allFlags</code> returns the values of the resolved promises as a list. Otherwise, <code>allFlags</code> returns <code>false</code>. To verify that you have done this correctly, navigate to <strong>app/test/test.html</strong> and check the <code>allFlags</code> test.

Test the function by replacing TODO 4.1 in <strong>js/main.js</strong> with the following code:

#### main.js

```
var promises = [
  getImageName('Spain'),
  getImageName('Chile'),
  getImageName('Peru')
];

allFlags(promises).then(function(result) {
  console.log(result);
});
```

Save the script and refresh the page. The console should log each promise object and show <code>["spain.png", "chile.png", "peru.png"]</code>. 

<div class="note">
<strong>Note: </strong>In this example we are using an <a href="https://en.wikibooks.org/wiki/JavaScript/Anonymous_functions">anonymous function</a> inside the <code>then</code> call. This is not related to <code>Promise.all</code>.
</div>

Change one of the inputs in the <code>getImageName</code> calls inside the <code>promises</code> variable to "Hello World". Save the script and refresh the page. Now the console should log <code>false</code>.

#### Explanation

<code>Promise.all</code> returns a promise that resolves if all of the promises passed into it resolve. If any of the passed-in promises reject, then <code>Promise.all</code> rejects with the reason of the first promise that was rejected. This is very useful for ensuring that a group of asynchronous actions complete (such as multiple images loading) before proceeding to another step. 

<div class="note">
<strong>Note: </strong><code>Promise.all</code> would not work if the promises passed in were from <code>flagChain</code> calls because <code>flagChain</code> uses <code>catch</code> to ensure that the returned promise always resolves.
</div>

<div class="note">
<strong>Note:</strong> Even if an input promise rejects, causing <code>Promise.all</code> to reject, the remaining input promises still settle. In other words, the remaining promises still execute, they simply are not returned by <code>Promise.all</code>.
</div>

#### For more information

<em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">Promise.all documentation</a>

### 4.2 Promise.race

Another promise method that you may see referenced is <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race">Promise.race</a>.

Replace TODO 4.2 in <strong>js/main.js</strong> with the following code:

#### main.js

```
var promise1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, 'one');
});

var promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2])
.then(logSuccess)
.catch(logError);
```

Save the script and refresh the page. The console should show "two" logged by <code>logSuccess</code>.

Change <code>promise2</code> to reject instead of resolve. Save the script and refresh the page. Observe that "two" is logged again, but this time by <code>logError</code>. 

#### Explanation

<code>Promise.race</code> takes a list of promises and settles as soon as the first promise in the list settles. If the first promise resolves, <code>Promise.race</code> resolves with the corresponding value, if the first promise rejects, <code>Promise.race</code> rejects with the corresponding reason.

In this example, if <code>promise2</code> resolves before <code>promise1</code> settles, the <code>then</code> block executes and logs the value of the <code>promise2</code>. If <code>promise2</code> rejects before <code>promise1</code> settles, the <code>catch</code> block executes and logs the reason for the <code>promise2</code> rejection.

<div class="note">
<strong>Note:</strong> Because <code>Promise.race</code> rejects immediately if one of the supplied promises rejects (even if another supplied promise resolves later) <code>Promise.race</code> by itself can't be used to reliably return the first promise that resolves. See the <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working_with_promises.html#race">concepts section</a> for more details. 
</div>

#### For more information

</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race">Promise.race documentation</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>solution</strong> folder.

<a id="congrats">


## Congratulations!




You have learned the basics of JavaScript Promises!

### Resources

<em> <a href="https://developers.google.com/web/fundamentals/getting-started/primers/promises">Promises introduction</a>
</em> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">Promise - MDN</a>


