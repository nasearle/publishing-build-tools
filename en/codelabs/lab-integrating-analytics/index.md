# Lab: Integrating Analytics




## Contents




<a href="#overview"><strong>Overview</strong></a>

<a href="#1"><strong>1. Get set up</strong></a>

<a href="#2"><strong>2. Create a Google Analytics account</strong></a>

<a href="#3"><strong>3. Get your tracking ID and snippet</strong></a>

<a href="#4"><strong>4. View user data</strong></a>

<a href="#5"><strong>5. Use debug mode</strong></a>

<a href="#6"><strong>6. Add custom events</strong></a>

<a href="#7"><strong>7. Showing push notifications</strong></a>

<a href="#8"><strong>8. Using analytics in the service worker</strong></a>

<a href="#9"><strong>9. Use analytics offline</strong></a>

<a href="#10"><strong>10. Optional: Add hits for notification actions</strong></a>

<a href="#11"><strong>11. Optional: Use hitCallback</strong></a>

<a href="#12"><strong>Congratulations!</strong></a>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/integrating-analytics.html">Integrating Analytics</a>

<a id="overview" />


## Overview




This lab shows you how to integrate Google Analytics into your web apps.

#### What you will learn

* How to create a Google Analytics account
* How to create a Google Firebase account
* How to integrate Google Analytics into a web app
* How to add and track custom events (including push notifications)
* How to use Google Analytics with service workers
* How to use analytics even when offline

#### What you should know

* Basic JavaScript and HTML
* Familiarity with <a href="https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/">Push Notifications</a>
* Some familiarity with the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a>
* The concept of an <a href="https://en.wikipedia.org/wiki/Immediately-invoked_function_expression">Immediately Invoked Function Expression</a> (IIFE)
* How to enable the developer console

#### What you will need

* Computer with terminal/shell access
* Connection to the internet 
* A <a href="http://caniuse.com/#search=push">browser that supports push</a>
* A text editor
* <a href="https://nodejs.org/en/">Node</a> installed

<a id="1"  />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open Chrome and navigate to <strong>localhost:8080/google-analytics-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>google-analytics-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab.

This folder contains:

* <strong>pages</strong> folder contains sample resources that we use in experimenting:
* <strong>page-push-notification.html</strong>
* <strong>other.html</strong>
* <strong>images</strong> folder contains images to style our notifications
* <strong>index.html</strong> is the main HTML page for our sample site/application
* <strong>main.js</strong> is the main JavaScript for the app
* <strong>analytics-helper.js</strong> is an empty helper file
* <strong>sw.js</strong> is the service worker file
* <strong>manifest.json</strong> is the manifest for push notifications

In the browser, you should be prompted to allow notifications. If the prompt does not appear, then <a href="tools_for_pwa_developers.md#permissions">manually allow notifications</a>. You should see a permission status of "granted" in the console.

You should also see that a service worker registration is logged to the console.

The app for this lab is a simple web page that has some <a href="https://developers.google.com/web/fundamentals/engage-and-retain/push-notifications/">push notification</a> code. 

<strong>main.js</strong> requests notification permission and registers a service worker, <strong>sw.js</strong>. The service worker has listeners for push events and notification events.

<strong>main.js</strong> also contains functions for subscribing and unsubscribing for push notifications. We will address that later (subscribing to push isn't yet possible because we haven't registered with a push service).

Test the notification code by using developer tools to <a href="tools_for_pwa_developers.md#push">send a push notification</a>.

A notification should appear on your screen. Try clicking it. It should take you to a sample page.

<div class="note">
<strong>Note: </strong>The developer tools UI is constantly changing and, depending on the browser, may look a little different when you try it.
</div>

<div class="note">
<strong>Note:</strong> Simulated push notifications can be sent from the browser even if the subscription object is null.
</div>

#### For more information

You can learn how to build the starter app and learn more about push in <a href="lab_integrating_web_push.md">Push Notifications codelab</a>.

<a id="2" />


## 2. Create a Google Analytics account




<div class="note">
<strong>Note:</strong> The Google Analytics UI is subject to updates and may not look exactly like the screenshots presented in this lab.
</div>

In a separate tab or window, navigate to <a href="https://analytics.google.com/">analytics.google.com</a>. Sign in with your <a href="https://accounts.google.com/signup">Gmail account</a>, and follow the step that matches your status:

#### If you already have a Google Analytics account:

Create another one. Select the <strong>Admin</strong> tab. Under <strong>account</strong>, select your current Google Analytics account and choose <strong>create new account</strong>. A single Gmail account can have multiple (currently 100) Google Analytics accounts. 

!<a href="../img/67167bdc1b3d25ee.png">Adding an account</a>

#### If you don't have a Google Analytics account:

Select <strong>Sign up</strong> to begin creating your account.

The account creation screen should look like this:

!<a href="../img/77f0da1cc8479fea.png">Creating an account</a>

#### What would you like to track? 

Choose website. 

<div class="note">
<strong>Note: </strong>Websites and mobile apps implement Google Analytics differently. This lab covers web sites. For mobile apps, see <a href="https://support.google.com/analytics/answer/2587086?ref_topic=2587085&rd=1">analytics for mobile applications</a>.
</div>

<div class="note">
<strong>Note:</strong> All the names we use for the account and website are arbitrary. They are only used for reference and don't affect analytics.
</div>

#### Setting up your account

Enter an account name (for example "PWA Training"). 

#### Setting up your property

The property must be associated with a site. We will use a mock <a href="https://pages.github.com/">GitHub Pages</a> site. 

1. Set the website name to whatever you want, for example "GA Code Lab Site".   
2. Set the website URL to <strong>USERNAME.github.io/google-analytics-lab/</strong>, where <strong>USERNAME</strong> is your <a href="https://github.com/">GitHub</a> username (or just your name if you don't have a GitHub account). Set the protocol to <strong>https://</strong>. 

<div class="note">
<strong>Note: </strong>For this lab, the site is just a placeholder, you do not need to set up a GitHub Pages site or be familiar with GitHub Pages or even GitHub. The site URL that you use to create your Google Analytics account is only used for things like automated testing. 
</div>

3. Select any industry or category. 
4. Select your timezone. 
5. Unselect any data sharing settings.
6. Then choose <strong>Get Tracking ID</strong> and agree to the terms and conditions. 

#### Explanation

Your account is the top most level of organization. For example, an account might represent a company. An account has <a href="https://support.google.com/analytics/answer/2649554">properties</a> that represent individual collections of data. One property in an account might represent the company's web site, while another property might represent the company's iOS app. These properties have tracking IDs (also called property IDs) that identify them to Google Analytics. You will need to get the tracking ID to use for your app.

#### For more information

* <a href="https://support.google.com/analytics/answer/2587086?ref_topic=2587085&rd=1">Analytics for mobile applications</a>
* <a href="https://github.com/">GitHub</a> and <a href="https://pages.github.com/">GitHub Pages</a>
* <a href="https://support.google.com/analytics/answer/2649554">Properties</a>
* <a href="https://accounts.google.com/signup">Google/Gmail accounts</a>
* <a href="https://analytics.google.com/">Google Analytics</a>

<a id="3" />


## 3. Get your tracking ID and snippet




You should now see your property's tracking ID and tracking code snippet.

If you lost your place:

1. Select the <strong>Admin</strong> tab. 
2. Under <strong>account</strong>, select your account (for example "PWA Training") from the drop down list. 
3. Then under <strong>property</strong>, select your property (for example "GA Code Lab Site") from the down list. 
4. Now choose <strong>Tracking Info</strong>, followed by <strong>Tracking Code</strong>. 

!<a href="../img/e6c84f2ccde27125.png">Finding the snippet</a>

Your tracking ID looks like <code>UA-XXXXXXXX-Y</code> and your tracking code snippet looks like:

#### index.html

```
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]) \ 
.push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0]; \
a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script', \
'https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXXXXX-Y', 'auto');
  ga('send', 'pageview');

</script>
```

Copy this script (from the Google Analytics page) and paste it in TODO 3 in <strong>index.html</strong> and <strong>pages/other.html</strong>. Save the scripts and refresh the <strong>app</strong> page (you can close the <strong>page-push-notification.html</strong> page that was opened from the notification click). 

Now return to the Google Analytics site. Examine the real time data:

1. Select the <strong>Reporting</strong> tab.
2. Select <strong>Real-Time.</strong>
3. Select <strong>Overview.</strong>

!<a href="../img/b2dba5f011013e99.png">Real-time navigation</a>

You should see yourself being tracked. The screen should look similar to this (note that the full path may be shown):

!<a href="../img/83ce80dc15443148.png">Real-time screen</a>

<div class="note">
<strong>Note: </strong>If you don't see this, refresh the <strong>app</strong> page and check again.
</div>

The <strong>Active Page</strong> indicates which page is being viewed. Back in the app, click <strong>Other page</strong> to navigate to the other page. Then return to the Google Analytics site and check <strong>Active Page</strong> again. It should now show <strong>app/pages/other.html</strong> (this might take a few seconds).

#### Explanation

When a page loads, the tracking snippet script is executed. The <a href="https://en.wikipedia.org/wiki/Immediately-invoked_function_expression">Immediately Invoked Function Expression</a> (IIFE) in the script does two things:

1. Creates another <code>script</code> tag that starts asynchronously downloading <strong>analytics.js</strong>, the library that does all of the analytics work. 
2. Initializes a global <code>ga</code> function, called the command queue. This function allows "commands" to be scheduled and run once the <strong>analytics.js</strong> library has loaded. 

The next lines add two commands to the queue. The first creates a new <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/tracker-object-reference">tracker object</a>. Tracker objects track and store data. When the new tracker is created, the analytics library gets the user's IP address, user agent, and other page information, and stores it in the tracker. From this info Google Analytics can extract:

* User's geographic location
* User's browser and operating system (OS)
* Screen size
* If Flash or Java is installed
* The referring site

The second command sends a "<a href="https://support.google.com/analytics/answer/6086082">hit</a>." This sends the tracker's data to Google Analytics. Sending a hit is also used to note a user interaction with your app. The user interaction is specified by the hit type, in this case a "pageview." Because the tracker was created with your tracking ID, this data is sent to your account and property.

Real-time mode in the Google Analytics dashboard shows the hit received from this script execution, along with the page (<strong>Active Page</strong>) that it was executed on.

You can read this <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/how-analyticsjs-works">documentation</a> to learn more about how <strong>analytics.js</strong> works.

The code so far provides the basic functionality of Google Analytics. A tracker is created and a  pageview hit is sent every time the page is visited. In addition to the data gathered by tracker creation, the pageview event allows Google Analytics to infer:

* The total time the user spends on the site 
* The time spent on each page and the order in which the pages are visited
* Which internal links are clicked (based on the URL of the next pageview)

#### For more information

* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/">The tracking snippet</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/tracker-object-reference">Tracker objects</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/creating-trackers">Creating trackers</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#create">The create command</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#send">The send command</a>
* <a href="https://support.google.com/analytics/answer/6086082">Hits</a>
* <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters">The data sent in a hit</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/how-analyticsjs-works">How analytics.js works</a>

<a id="4" />


## 4. View user data




We are using the real-time viewing mode because we have just created the app. Normally, records of past data would also be available. You can view this from the reporting tab by selecting <strong>Audience</strong> and then <strong>Overview</strong>. 

<div class="note">
<strong>Note:</strong> Data for our app is not available yet. It takes some time to process the data, typically <a href="https://support.google.com/analytics/answer/1070983#DataProcessingLatency">24-48 hours</a>.
</div>

Here you can see general information such as pageview records, bounce rate, ratio of new and returning visitors, and other statistics.

!<a href="../img/1b6463f39646e4e1.png">Records overview</a>

You can also see specific information like visitors' language, country, city, browser, operating system, service provider, screen resolution, and device.

!<a href="../img/66759e07d712dd12.png">Records details</a>

#### For more information

* <a href="https://analyticsacademy.withgoogle.com/">Learn about Google Analytics for business</a>

<a id="5" />


## 5. Use Debug Mode




Checking the dashboard is not an efficient method of testing. Google Analytics offers the <strong>analytics.js</strong> library with a debug mode.

TODO: Replace <strong>analytics.js</strong> in the tracking snippet (in <strong>index.html</strong> and <strong>pages/other.html</strong>) with <strong>analytics_debug.js</strong>.

<div class="note">
<strong>Note:</strong> Don't use <strong>analytics_debug.js</strong> in production. It is much larger than <strong>analytics.js</strong>.
</div>

Save the scripts and refresh the page. You should see the browser console logging details of the "create" and "send" commands. 

<div class="note">
<strong>Note:</strong> There is also a <a href="https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna">Chrome debugger extension</a> that can be used alternatively. 
</div>

Navigate back to <strong>app/index.html</strong> using the <strong>Back</strong> link. Check the console logs again. Note how the location field changes on the data sent by the send command.

#### For more information

* <a href="https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna">Chrome debugger extension</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/debugging">Debugging Google Analytics</a>

<a id="6" />


## 6. Add custom events




Google Analytics supports custom events that allow fine grain analysis of user behavior. 

In <strong>main.js</strong>, replace TODO 6 with the following:

#### main.js

```
ga('send', {
  hitType: 'event',
  eventCategory: 'products',
  eventAction: 'purchase',
  eventLabel: 'Summer products launch'
});
```

Save the script and refresh the page. Click <strong>BUY NOW!!!</strong>. Check the console log, do you see the custom event? 

Now return to the real-time reporting section of the Google Analytics dashboard (from the <strong>Reporting</strong> tab, select <strong>Real-Time</strong>). Instead of selecting <strong>Overview</strong>, select <strong>Events</strong>. Do you see the custom event? (If not, try clicking <strong>BUY NOW!!!</strong> again.)

!<a href="../img/1f21b1938268723a.png">Real-time events</a>

#### Explanation

When using the send command in the <code>ga</code> command queue, the hit type can be set to 'event', and values associated with an event can be added as parameters. These values represent the `eventCategory`, `eventAction`, and `eventLabel`. All of these are arbitrary, and used to organize events. Sending these custom events allows us to deeply understand user interactions with our site.

<div class="note">
<strong>Note:</strong> Many of the <code>ga</code> commands are flexible and can use multiple signatures. 

You can see all method signatures in the <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference">command queue reference</a>.
</div>

<strong>Optional</strong>: Update the custom event that you just added to use the alternative signature described in the <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference">command queue reference</a>. Hint: Look for the "send" command examples.

You can view past events in the Google Analytics dashboard from the <strong>Reporting</strong> tab by selecting <strong>Behavior</strong>, followed by <strong>Events</strong> and then <strong>Overview</strong>. However your account won't yet have any past events to view (because you just created it).

!<a href="../img/3107f35a9adc1fb3.png">Recorded events</a>

#### For more information

* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/events">Event tracking</a>
* <a href="https://support.google.com/analytics/answer/1033068">About events</a>
* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference">Command queue reference</a>

<a id="7" />


## 7. Showing push notifications




Lets use a custom event to let us know when users subscribe to push notifications.

### 7.1 Create a project on Firebase

First we need to add push subscribing to our app. To subscribe to the push service in Chrome, you need to create a project on Firebase.

1. In the <a href="https://console.firebase.google.com/">Firebase console</a>, select <strong>Create New Project</strong>.
2. Supply a project name and click <strong>Create Project</strong>.
3. Click the <strong>Settings</strong> (gear) icon next to your project name in the navigation pane, and select <strong>Project Settings</strong>.
4. Select the <strong>Cloud Messaging</strong> tab. You can find your <strong>Server key</strong> and <strong>Sender ID</strong> in this page. Save these values.

Replace <code>YOUR_SENDER_ID</code>  in the <strong>manifest.json</strong> file with the Sender ID of your Firebase project. The <strong>manifest.json</strong> file should look like this:

#### manifest.json

```
{
  "name": "Google Analytics codelab",
  "gcm_sender_id": "YOUR_SENDER_ID"
}
```

Save the file. Refresh the app and click <strong>Subscribe</strong>. The browser console should indicate that you have subscribed to push notifications.

#### Explanation

Chrome uses Firebase Cloud Messaging (FCM) to route its push messages. All push messages are sent to FCM, and then FCM passes them to the correct client.

<div class="note">
<strong>Note:</strong> FCM has replaced Google Cloud Messaging (GCM). Some of the code to push messages to Chrome still contains references to GCM. These references are correct and work for both GCM and FCM.
</div>

### 7.2 Add custom analytics

Now we can add custom analytics events for push subscriptions.

Replace TODO 7.2a with the following code

#### main.js

```
ga('send', 'event', 'push', 'subscribe', 'success');
```

Replace TODO 7.2b with the following code

#### main.js

```
ga('send', 'event', 'push', 'unsubscribe', 'success');
```

Save the script and refresh the app. Now test the subscribe and unsubscribe buttons. Confirm that you see the custom events logged in the browser console, and that they are also shown on the Google Analytics dashboard. 

Note that this time we used the alternative <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/command-queue-reference#send">send command signature</a>, which is more concise.

<strong>Optional</strong>: Add analytics hits for the <code>catch</code> blocks of the <code>subscribe</code> and <code>unsubscribe</code> functions. In other words, add analytics code to record when users have errors subscribing or unsubscribing. Then manually block notifications in the app by clicking the icon next to the URL and revoking permission for notifications. Refresh the page and test subscribing, you should see an event fired for the subscription error logged in the console (and in the real-time section of the Google Analytics dashboard). Remember to restore notification permissions when you are done.

#### Explanation

We have added Google Analytics send commands inside our push subscription code. This lets us track how often users are subscribing and unsubscribing to our push notifications, and if they are experiencing errors in the process.

<a id="8" />


## 8. Using analytics in the service worker




The service worker does not have access to the analytics command queue, <code>ga`, because the command queue is in the main thread (not the service worker thread) and requires the `window</code> object. We will need to use a separate API to send hits from the service worker.

### 8.1 Use the Measurement Protocol interface

In <strong>analytics-helper.js</strong>, replace TODO 8.1a with the following code, but use your analytics tracking ID instead of <code>UA-XXXXXXXX-Y</code>:

#### analytics-helper.js

```
// Set this to your tracking ID
var trackingId = 'UA-XXXXXXXX-Y';
```

Replace TODO 8.1b in the same file with the following code:

#### analytics-helper.js

```
function sendAnalyticsEvent(eventAction, eventCategory) {
  'use strict';

  console.log('Sending analytics event: ' + eventCategory + '/' + eventAction);

  if (!trackingId) {
    console.error('You need your tracking ID in analytics-helper.js');
    console.error('Add this code:\nvar trackingId = \'UA-XXXXXXXX-X\';');
    // We want this to be a safe method, so avoid throwing unless absolutely necessary.
    return Promise.resolve();
  }

  if (!eventAction && !eventCategory) {
    console.warn('sendAnalyticsEvent() called with no eventAction or ' +
    'eventCategory.');
    // We want this to be a safe method, so avoid throwing unless absolutely necessary.
    return Promise.resolve();
  }

  return self.registration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription === null) {
      throw new Error('No subscription currently available.');
    }

    // Create hit data
    var payloadData = {
      // Version Number
      v: 1,
      // Client ID
      cid: subscription.endpoint,
      // Tracking ID
      tid: trackingId,
      // Hit Type
      t: 'event',
      // Event Category
      ec: eventCategory,
      // Event Action
      ea: eventAction,
      // Event Label
      el: 'serviceworker'
    };

    // Format hit data into URI
    var payloadString = Object.keys(payloadData)
    .filter(function(analyticsKey) {
      return payloadData[analyticsKey];
    })
    .map(function(analyticsKey) {
      return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
    })
    .join('&');

    // Post to Google Analytics endpoint
    return fetch('https://www.google-analytics.com/collect', {
      method: 'post',
      body: payloadString
    });
  })
  .then(function(response) {
    if (!response.ok) {
      return response.text()
      .then(function(responseText) {
        throw new Error(
          'Bad response from Google Analytics:\n' + response.status
        );
      });
    } else {
      console.log(eventCategory + '/' + eventAction +
        'hit sent, check the Analytics dashboard');
    }
  })
  .catch(function(err) {
    console.warn('Unable to send the analytics event', err);
  });
}
```

Save the script.

#### Explanation

Because the service worker does not have access to the analytics command queue, `ga`, we need to use the Google Analytics <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/">Measurement Protocol</a> interface. This interface lets us make HTTP requests to send hits, regardless of the execution context. 

We start by creating a variable with your tracking ID. This will be used to ensure that hits are sent to your account and property, just like in the analytics snippet. 

The <code>sendAnalyticsEvent</code> helper function starts by checking that the tracking ID is set and that the function is being called with the correct parameters. After checking that the client is subscribed to push, the hit data is created in the <code>payloadData</code> variable:

#### analytics-helper.js

```
var payloadData = {
  // Version Number
  v: 1,
  // Client ID
  cid: subscription.endpoint,
  // Tracking ID
  tid: trackingId,
  // Hit Type
  t: 'event',
  // Event Category
  ec: eventCategory,
  // Event Action
  ea: eventAction,
  // Event Label
  el: 'serviceworker'
};
```

The <strong>version number</strong>, <strong>client ID</strong>, <strong>tracking ID</strong>, and <strong>hit type</strong> parameters are <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/devguide">required by the API</a>. The <strong>event category</strong>, <strong>event action</strong>, and <strong>event label</strong> are the same parameters that we have been using with the command queue interface.

Next, the hit data is <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/reference">formatted into a URI</a> with the following code:

#### analytics-helper.js

```
var payloadString = Object.keys(payloadData)
.filter(function(analyticsKey) {
  return payloadData[analyticsKey];
})
.map(function(analyticsKey) {
  return analyticsKey + '=' + encodeURIComponent(payloadData[analyticsKey]);
})
.join('&');
```

Finally the data is sent to the <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/reference">API endpoint</a> (<strong>https://www.google-analytics.com/collect</strong>) with the following code:

#### analytics-helper.js

```
return fetch('https://www.google-analytics.com/collect', {
  method: 'post',
  body: payloadString
});
```

The hit is sent with the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API">Fetch API</a> using a POST request. The body of the request is the hit data.

<div class="note">
<strong>Note:</strong> You can learn more about the Fetch API in the <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-codelabs/content/docs/lab_fetch_api.html">fetch codelab</a>.
</div>

#### For more information

* <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/">Measurement Protocol</a>
* <a href="https://github.com/gauntface/simple-push-demo">Push demo</a>

### 8.2 Send hits from the service worker

Now that we can use the Measurement Protocol interface to send hits, let's add custom events to the service worker.

Replace TODO 8.2a in <strong>sw.js</strong> with the following code:

#### sw.js

```
self.importScripts('js/analytics-helper.js');
```

Replace TODO 8.2b in <strong>sw.js</strong> with the following code:

#### sw.js

```
e.waitUntil(
  sendAnalyticsEvent('close', 'notification')
);
```

Replace TODO 8.2c in <strong>sw.js</strong> with the following code:

#### sw.js

```
sendAnalyticsEvent('click', 'notification')
```

Replace TODO 8.2d in <strong>sw.js</strong> with the following code:

#### sw.js

```
sendAnalyticsEvent('received', 'push')
```

Save the script. Refresh the page to install the new service worker. Then close and reopen the app to activate the new service worker (remember to close all tabs and windows running the app). 

Now try these experiments and check the console and Google Analytics dashboard for each:

1. Trigger a push notification. 
2. Click the notification, and note what happens. 
3. Trigger another notification and then close it (with the x in the upper right corner).

Do you see console logs for each event? Do you see events on Google Analytics?

<div class="note">
<strong>Note: </strong>Because these events use the Measurement Protocol interface instead of <strong>analytics_debug.js</strong>, the debug console logs don't appear. You can debug the Measurement Protocol hits with <a href="https://developers.google.com/analytics/devguides/collection/protocol/v1/validating-hits"> hit validation</a>.
</div>

#### Explanation

We start by using <a href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">ImportScripts</a> to import the <strong>analytics-helper.js</strong> file with our <code>sendAnalyticsEvent</code> helper function. Then we use this function to send custom events at appropriate places (such as when push events are received, or notifications are interacted with). We pass in the <code>eventAction</code> and <code>eventCategory</code> that we want to associate with the event as parameters. 

<div class="note">
<strong>Note:</strong> We have used <code>event.waitUntil</code> to wrap all of our asynchronous operations. If unfamiliar, <code>event.waitUntil</code> extends the life of an event until the asynchronous actions inside of it have completed. This ensures that the service worker will not be terminated pre-emptively while waiting for an asynchronous action to complete.
</div>

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">ImportScripts</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/ExtendableEvent/waitUntil">event.waitUntil</a>

<a id="9" />


## 9. Use analytics offline




What can you do about sending analytics hits when your users are offline? Analytics data can be stored when users are offline and sent at a later time when they have reconnected. Fortunately, there is an <a href="https://www.npmjs.com/package/sw-offline-google-analytics">npm package</a> for this.

From the app/ directory, run the following command line command:

    npm install sw-offline-google-analytics

This will import the <a href="https://nodejs.org/en/">node</a> module.

In <strong>sw.js</strong> replace TODO 9 with:

#### sw.js

```
importScripts('path/to/offline-google-analytics-import.js');
goog.offlineGoogleAnalytics.initialize();
```

Where <code>path/to/offline-google-analytics-import.js</code> is the path to the <strong>offline-google-analytics-import.js</strong> file in the <strong>node_module</strong> folder. 

Now save the script. Update the service worker by refreshing the page and closing and reopening the app (remember to close all tabs and windows running the app).

Now <a href="tools_for_pwa_developers.md#offline">simulate offline behavior</a>.

Click <strong>BUY NOW!!!</strong> to fire our first custom analytics event. 

You will see an error in the console because we are offline and can't make requests to Google Analytics servers. You can confirm by checking the real-time section of Google Analytics dashboard and noting that the event is not shown.

<a href="tools_for_pwa_developers.md#indexeddb">Now check IndexedDB</a>. Open <strong>offline-google-analytics</strong>. You should see a URL cached. If you are using Chrome (see screenshot below), it is shown in <strong>urls</strong>.You may need to click the refresh icon in the <strong>urls</strong> interface.

!<a href="../img/88188d9545f98f83.png">Offline hits</a>

Now disable offline mode, and refresh the page. Check <strong>IndexedDB</strong> again, and observe that the URL is no longer cached.

Now check the Google Analytics dashboard. You should see the custom event!

#### Explanation

Here we import and initialize the <strong>offline-google-analytics-import.js</strong> library. You can check out the <a href="https://developers.google.com/web/updates/2016/07/offline-google-analytics">documentation</a> for details, but this library adds a fetch event handler to the service worker that only listens for requests made to the Google Analytics domain. The handler attempts to send Google Analytics data just like we have done so far, by network requests. If the network request fails, the request is stored in IndexedDB. The requests are then sent later when connectivity is re-established.

This strategy won't work for hits sent from our service worker because the service worker doesn't listen to fetch events from itself (that could cause some serious problems!). This isn't so important in this case because all the hits that we would want to send from the service worker are tied to online events (like push notifications) anyways.

<div class="note">
<strong>Note:</strong> These events don't use <strong>analytics_debug.js</strong>, so the debug console logs don't appear.
</div>

<div class="note">
<strong>Note:</strong> Some users have reported a bug in Chrome that recreates deleted databases on reload.
</div>

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/importScripts">ImportScripts</a>
* <a href="https://developers.google.com/web/updates/2016/07/offline-google-analytics">Offline Google Analytics</a>
* <a href="https://developers.google.com/web/showcase/2015/service-workers-iowa#offline_google_analytics">Google I/O offline example</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">IndexedDB</a>

<a id="10" />


## 10. Optional: Add hits for notification actions




Add two actions to the push notifications. Send a distinct analytics hit for each action that the user clicks. Remember that you will need to use the Measurement Protocol interface because this code will be in the service worker. Test the actions and make sure the hits are sending.

<div class="note">
<strong>Note:</strong> Notification actions may not be available in Firefox.
</div>

<a id="11" />


## 11. Optional: Use hitCallback




How can you send analytics hits for an action that takes the user away from your page, such as clicking a link to an external vendor or submitting a form (many browsers stop executing JavaScript once the current page starts unloading, preventing send commands from being executed)? 

Research the <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits">hitCallback</a> functionality. Use a hitCallback to send an analytics event whenever a user clicks the <strong>Special offers</strong> external link. Make sure to use a timeout so that if the analytics library fails, the user's desired action will still complete!

<div class="note">
<strong>Note:</strong> If the user's browser supports <code>navigator.sendBeacon</code> then 'beacon' can be specified as the transport mechanism. This avoids the need for a hitCallback. See the <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits">documentation</a> for more info.
</div>

#### For more information

* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/sending-hits">Sending hits</a>

#### Solution code

To get a copy of the working code, navigate to the <strong>solution</strong> folder.

<a id="12" />


## Congratulations!




You now know how to integrate Google Analytics into your apps, and how to use analytics with service worker and push notifications.

<a id="additional" />

### Resources

* <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/">Adding analytics.js to Your Site</a>
* <a href="https://analyticsacademy.withgoogle.com/">Google Analytics Academy</a> (non-technical)
* <a href="https://codelabs.developers.google.com/codelabs/performance-analytics/index.html?index=..%2F..%2Findex#0">Measuring Critical Performance Metrics with Google Analytics</a> code lab
* <a href="https://github.com/googleanalytics/autotrack/blob/master/docs/plugins/page-visibility-tracker.md#improving-session-duration-calculations">pageVisibilityTracker plugin</a> (improves pageview and session duration accuracy)


