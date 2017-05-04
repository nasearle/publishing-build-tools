# Lab: Responsive Design




## Contents




<a href="#overview"><strong>Overview</strong></a> 

<a href="#1"><strong>1. Get set up</strong></a> 

<a href="#2"><strong>2. Test the page</strong></a> 

<a href="#3"><strong>3. Set the visual viewport</strong></a> 

<a href="#4"><strong>4. Use media queries</strong></a> 

<a href="#5"><strong>5. Using Flexbox</strong></a> 

<a href="#6"><strong>6. Using Flexbox as a progressive enhancement</strong></a> 

<a href="#congrats"><strong>Congratulations!</strong></a>

<a id="overview" />


## Overview




This lab shows you how to style your content to make it responsive. 

#### What you will learn

* How to style your app so that it works well in multiple form factors
* How to use Flexbox to easily organize your content into columns
* How to use media queries to reorganize your content based on screen size

#### What you should know

* Basic HTML and CSS

#### What you will need

* Computer with terminal/shell access
* Connection to the internet
* Text editor

<a id="1" />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open your browser and navigate to <strong>localhost:8080/responsive-design-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>responsive-design-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab. 

This folder contains:

* <strong>index.html</strong> is the main HTML page for our sample site/application
* <strong>modernizr-custom.js</strong> is a feature detection tool that simplifies testing for Flexbox support
* <strong>styles/main.css</strong> is the cascading style sheet for the sample site

<a id="2" />


## 2. Test the page




Return to the app in the browser. Try shrinking the window width to below 500px and notice that the content doesn't respond well.

Open developer tools and <a href="tools_for_pwa_developers.md#mobile">enable responsive design or device mode</a> in your browser. This mode simulates the behavior of your app on a mobile device. Notice that the page is zoomed out to fit the fixed-width content on the screen. This is not a good experience because the content will likely be too small for most users, forcing them to zoom and pan. 

<a id="3" />


## 3. Set the visual viewport




Replace TODO 3 in <strong>index.html</strong> with the following tag: 

#### index.html

```
<meta name="viewport" content="width=device-width, initial-scale=1">
```

Save the file. Refresh the page in the browser and <a href="tools_for_pwa_developers.md#mobile">check the page in device mode</a>. Notice the page is no longer zoomed out and the scale of the content matches the scale on a desktop device. If the content behaves unexpectedly in the device emulator, toggle in and out of device mode to reset it.

<div class="note">
<strong>Warning:</strong> Device emulation gives you a close approximation as to how your site will look on a mobile device, but to get the full picture you should always test your site on real devices. You can learn more about debugging Android devices on <a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/">Chrome</a> and <a href="https://developer.mozilla.org/en-US/docs/Tools/Remote_Debugging">Firefox</a>.
</div>

#### Explanation

A meta viewport tag gives the browser instructions on how to control the page's dimensions and scaling. The <code>width</code> property controls the size of the viewport. It can be set to a specific number of pixels (for example, <code>width=500</code>) or to the special value <code>device-width,</code> which is the width of the screen in CSS pixels at a scale of 100%. (There are corresponding <code>height</code> and <code>device-height</code> values, which can be useful for pages with elements that change size or position based on the viewport height.)

The initial-scale property controls the zoom level when the page is first loaded. Setting initial scale improves the experience, but the content still overflows past the edge of the screen. We'll fix this in the next step.

#### For more information

* <a href="https://developers.google.com/web/fundamentals/design-and-ui/responsive/fundamentals/set-the-viewport">Set the viewport</a> - Responsive Web Design Basics 
* <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag">Using the viewport meta tag to control layout on mobile browsers</a> - MDN

<a id="4" />


## 4. Use media queries




Replace TODO 4 in <strong>styles/main.css</strong> with the following code:

#### main.css

```
@media screen and (max-width: 48rem) {
  .container .col {
    width: 95%;
  }
}
```

Save the file. Disable device mode in the browser and refresh the page. Try shrinking the window width. Notice that the content switches to a single column layout at the specified width. Re-enable device mode and observe that the content responds to fit the device width.

#### Explanation

To make sure that the text is readable we use a media query when the browser's width becomes 48rem (768 pixels at browser's default font size or 48 times the default font size in the user's browser). See <a href="https://webdesign.tutsplus.com/tutorials/comprehensive-guide-when-to-use-em-vs-rem--cms-23984">When to use Em vs Rem</a> for a good explanation of why rem is a good choice for relative units. When the media query is triggered we change the layout from three columns to one column by changing the <code>width</code> of each of the three <code>div</code>s to fill the page. 

<a id="5" />


## 5. Using Flexbox




The <a href="https://www.w3.org/TR/css-flexbox-1/">Flexible Box Layout Module</a> (Flexbox) is a useful and easy-to-use tool for making your content responsive. <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/">Flexbox</a> lets us accomplish the same result as in the previous steps, but it takes care of any spacing calculations for us and provides a bunch of ready-to-use CSS properties for structuring content. 

### 5.1 Comment out existing rules in CSS

Comment out all of the rules in <strong>styles/main.css</strong> by wrapping them in <code>/<em></code> and <code></em>/</code>. We will make these our fallback rules for when Flexbox is not supported in the <a href="#6">Flexbox as progressive enhancement</a> section.

### 5.2 Add Flexbox layout

Replace TODO 5.2 in <strong>styles/main.css</strong> with the following code:

#### main.css

```
.container {
  display: -webkit-box;  /<em> OLD - iOS 6-, Safari 3.1-6 </em>/
  display: -ms-flexbox;  /<em> TWEENER - IE 10 </em>/
  display: flex;         /<em> NEW, Spec - Firefox, Chrome, Opera </em>/
  background: #eee;  
  overflow: auto;
}

.container .col {
  flex: 1;
  padding: 1rem;
}
```

Save the code and refresh <strong>index.html</strong> in your browser. Disable device mode in the browser and refresh the page. If you make your browser window narrower, the columns grow thinner until only one of them remains visible. We'll fix this with media queries in the next exercise.

#### Explanation

The first rule defines the <code>container</code> <code>div</code> as the flex container. This enables a flex context for all its direct children. We are mixing old and new syntax for including Flexbox to get broader support (see <strong>For more information</strong> for details).

The second rule uses the <code>.col</code> class to create our equal width flex children. Setting the first argument of the <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/#article-header-id-13"><code>flex</code></a> property to <code>1</code> for all <code>div</code>s with class <code>col</code> divides the remaining space evenly between them. This is more convenient than calculating and setting the relative width ourselves.

#### For more information

* <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/">A Complete Guide to Flexbox</a> - CSS Tricks
* <a href="https://www.w3.org/TR/css-flexbox-1/">CSS Flexible Box Layout Module Level 1</a> - W3C
* <a href="http://shouldiprefix.com/#flexbox">What CSS to prefix?</a>
* <a href="https://css-tricks.com/using-flexbox/">Using Flexbox</a> - CSS Tricks

### 5.3 Optional: Set different relative widths

Use the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:nth-child">nth-child pseudo-class</a> to set the relative widths of the first two columns to 1 and the third to 1.5. You must use the <code>flex</code> property to set the relative widths for each column. For example, the selector for the first column would look like this:

```
.container .col:nth-child(1)
```

### 5.4 Use media queries with Flexbox

Replace TODO 5.4 in <strong>styles/main.css</strong> with the code below:

#### main.css

```
@media screen and (max-width: 48rem) {
  .container {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    flex-flow: column;
  }
}
```

Save the code and refresh <strong>index.html</strong> in your browser. Now if you shrink the browser width, the content reorganizes into one column.

#### Explanation

When the media query is triggered we change the layout from three-column to one-column by setting the <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/#article-header-id-5"><code>flex-flow</code></a> property to <code>column</code>. This accomplishes the same result as the media query we added in step 5. <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/">Flexbox</a> provides tons of other properties like <code>flex-flow</code> that let you easily structure, re-order, and justify your content so that it responds well in any context.

<a id="6" />


## 6. Using Flexbox as a progressive enhancement




As Flexbox is a relatively new technology, we should include fallbacks in our CSS.

### 6.1 Add Modernizr

<a href="https://modernizr.com/docs">Modernizr</a> is a feature detection tool that simplifies testing for Flexbox support.

Replace TODO 6.1 in <strong>index.html</strong> with the code to include the custom Modernizr build:

#### index.html

```
<script src="modernizr-custom.js"></script>
```

#### Explanation

We include a <a href="https://modernizr.com/download">Modernizr build</a> at the top of <strong>index.html</strong>, which tests for Flexbox support. This runs the test on page-load and appends the class <code>flexbox</code> to the <code><html></code> element if the browser supports Flexbox. Otherwise, it appends a <code>no-flexbox</code> class to the <code><html></code> element. In the next section we add these classes to the CSS.

<div class="note">
<strong>Note:</strong> If we were using the <code>flex-wrap</code> property of Flexbox, we would need to add a separate Modernizr detector just for this feature. Older versions of some browsers partially support Flexbox, and do not include this feature.
</div>

### 6.2 Use Flexbox progressively

Let's use the <code>flexbox</code> and <code>no-flexbox</code> classes in the CSS to provide fallback rules when Flexbox is not supported.

Now in <strong>styles/main.css</strong>, add <code>.no-flexbox</code> in front of each rule that we commented out:

#### main.css

```
.no-flexbox .container {
  background: #eee;
  overflow: auto;
}

.no-flexbox .container .col {
    width: 27%;
    padding: 30px 3.15% 0;
    float: left;
}

@media screen and (max-width: 48rem) {
  .no-flexbox .container .col {
    width: 95%;
  }
}
```

In the same file, add <code>.flexbox</code> in front of the rest of the rules:

#### main.css

```
.flexbox .container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background: #eee;
  overflow: auto;
}

.flexbox .container .col {
  flex: 1;
  padding: 1rem;
}

@media screen and (max-width: 48rem) {
    .flexbox .container {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-flow: column;
    }
}
```

Remember to add <code>.flexbox</code> to the rules for the individual columns if you completed the optional step 5.3.

Save the code and refresh <strong>index.html</strong> in the browser. The page should look the same as before, but now it works well in any browser on any device. If you have a <a href="http://caniuse.com/#search=flexbox">browser that doesn't support Flexbox</a>, you can test the fallback rules by opening <strong>index.html</strong> in that browser.

#### For more information

* <a href="https://www.sitepoint.com/migrating-flexbox-cutting-mustard/">Migrating to Flexbox</a> - Cutting the Mustard
* <a href="https://modernizr.com/docs">Modernizr Documentation</a>

<a id="congrats" />


## Congratulations!




You have learned to style your content to make it responsive. Using media queries, you can change the layout of your content based on the window or screen size of the user's device.

### What we've covered

* Setting the visual viewport
* Flexbox
* Media queries

### Resources

#### Learn more about the basics of responsive design

* <a href="https://developers.google.com/web/fundamentals/design-and-ui/responsive/#set-the-viewport">Responsive Web Design Basics - Set the viewport</a> 
* <a href="http://www.quirksmode.org/mobile/viewports2.html">A tale of two viewports</a>

#### Learn more about Flexbox as a progressive enhancement

* <a href="http://blog.formkeep.com/progressive-enhancement-start-using-css-without-breaking-older-browsers/">Progressive Enhancement: Start Using CSS Without Breaking Older Browsers</a>
* <a href="https://www.sitepoint.com/migrating-flexbox-cutting-mustard/">Migrating to Flexbox by Cutting the Mustard</a>
* <a href="https://modernizr.com/">Modernizr</a>

#### Learn about libraries for responsive CSS

* <a href="http://getbootstrap.com/">Bootstrap</a>
* <a href="http://sass-lang.com/">Sass</a>
* <a href="http://lesscss.org/">Less</a>
* <a href="https://material.google.com/">Material Design</a>

#### Learn more about using media queries

* <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries">Using Media Queries</a> 


