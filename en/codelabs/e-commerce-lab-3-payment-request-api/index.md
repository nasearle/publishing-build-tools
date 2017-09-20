# E-Commerce Lab 3: Payment Request API




## Contents




<strong>Overview        </strong>

<strong>1. Get set up        </strong>

<strong>2. Create a PaymentRequest        </strong>

<strong>3. Add payment methods        </strong>

<strong>4. Add payment details        </strong>

<strong>5. Complete the PaymentRequest        </strong>

<strong>6. Allow shipping options        </strong>

<strong>7. Add event handlers        </strong>

<strong>8. Add payment options        </strong>

<strong>9. Test it out        </strong>

<strong>Congratulations!</strong>

<a id="overview" />


## Overview




#### What you will do

* Integrate the Payment Request API in the e-commerce app

#### What you should know

* Basic JavaScript and HTML
* Familiarity with the concept and basic syntax of ES2015 <a href="http://www.html5rocks.com/en/tutorials/es6/promises/">Promises</a>

#### What you will need

* USB cable to connect an Android device to your computer
* Computer with terminal/shell access
* Connection to the internet
* Chrome for Android version 56 or higher
* A text editor

<a id="1" />


## 1. Get set up




If you have a text editor that lets you open a project, then open the <strong>project</strong> folder in the <strong>pwa-ecommerce-demo</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>project</strong> folder is where you will build the app.

<div class="note">
If you have completed the E-Commerce App labs up to this point, your app is already set up and you can skip to step 2.
</div>

If you did not complete the previous labs, copy the contents of the <strong>lab3-payments</strong> folder and overwrite the contents of the <strong>project</strong> directory. Then run <code>npm install</code> in the command line at the <strong>project</strong> directory.

At the project directory, run <code>npm run serve</code> to build the application in <strong>dist</strong>. Open your browser and navigate to <code>localhost:8080</code> to see the initial state of the app.

<div class="note">
<strong>Note:</strong> The e-commerce app is based on Google's <a href="https://github.com/google/web-starter-kit/">Web Starter Kit</a>, which is an "opinionated boilerplate" designed as a starting point for new projects. It allows us to take advantage of several preconfigured tools that facilitate development, and are optimized both for speed and multiple devices. You can learn more about Web Starter Kit <a href="https://developers.google.com/web/tools/starter-kit/">here</a>.
</div>

<div class="note">
<strong>Note:</strong> Solution code for this lab can be found in the <strong>solution</strong> folder.
</div>

From here, you will be implementing the Payment Request API.

The Payment Request API is not yet supported on desktop as of Chrome 58, so you will need an Android device with Chrome installed to test the code. Follow the instructions in the <a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server">Access Local Servers</a> article to set up port forwarding on your Android device. This lets you host the e-commerce app on your phone.

<a id="2" />


## 2. Create a PaymentRequest




### 2.1 Detect feature availability

First, let's add add a feature detection for the Payment Request API. And if it's available, let a user process payment with it.

Replace "TODO PAY-2.1" in <strong>app/scripts/modules/app.js</strong> with the following code and remove the dummy conditional of <code>if (false) {</code> to add PaymentRequest feature detection:

#### app.js
```
if (window.PaymentRequest) {
```

#### Explanation

The feature detection is as simple as examining if <code>window.PaymentRequest</code> returns <code>undefined</code> or not.

### 2.2 Create a PaymentRequest

Create a Payment Request object using the PaymentRequest constructor.

Replace TODO PAY-2.2 in <strong>app/scripts/modules/payment-api.js</strong> with the following code to create a new <code>PaymentRequest</code> object:

#### payment-api.js
```
let request = new window.PaymentRequest(supportedInstruments, details, paymentOptions);
```

Save the file.

#### Explanation

The constructor takes three parameters.

__supportedInstruments:
__The first argument is a required set of data about supported payment methods. This can include basic credit cards as well as payment processors like Android Pay. We'll use only basic credit cards in this codelab.

__details:
__The second argument is required information about the transaction. This must include the information to display the total to the user (i.e., a label, currency, and value amount), but it can also include a breakdown of items in the transaction.

__paymentOptions:
__The third argument is an optional parameter for things like shipping. This allows you to require additional information from the user, like payer name, phone, email, and shipping information.

### Try it out

You should now be able to try the Payment Request API. If you are not running your server, <code>npm run serve</code> and try it using your Android device. Follow the instructions in the <a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server">Access Local Servers</a> article to set up port forwarding on your Android device.
```
$ npm run serve
```

The <code>PaymentRequest</code> UI displays when you click <strong>Checkout</strong>.

<div class="note">
<strong>Note:</strong> The information you enter here won't be posted anywhere other than your local server, but you should use fake information. However, since credit card information requires validation, you can use following fake number so it can accept a random CVC: <code>4242 4242 4242 4242</code>
</div>

Be aware, this is just the first step and there is more work to be done for the API to complete successfully. Let's continue.

<a id="3" />


## 3. Add payment methods




At this point, most of the arguments are empty arrays or objects. Let's configure the payment method (<code>supportedInstruments</code>) with proper values.

Replace the JSON block below TODO PAY-3 in <strong>app/scripts/modules/payment-api.js</strong> with this:

#### payment-api.js
```
{
  supportedMethods: ['basic-card'],
  data: {
    supportedNetworks: ['visa', 'mastercard', 'amex',
      'jcb', 'diners', 'discover', 'mir', 'unionpay']
  }
}
```

Save the file.

#### Explanation

The first argument of the <code>PaymentRequest</code> constructor takes a list of supported payment methods as JSON objects.

<code>supportedMethods</code> takes a list of supported method names as an array. Supported methods can be <code>basic-card</code> or a URL representing a payment app. These are defined in the <a href="https://www.w3.org/TR/payment-method-id/">Payment Method Identifiers</a> specification.

In the case of <code>basic-card</code>, <code>supportedNetworks</code> under <code>data</code> takes a list of supported credit card brands as defined at <a href="https://www.w3.org/Payments/card-network-ids">Card Network Identifiers Approved for use with Payment Request API</a>. This will filter and show only the credit cards available for the user in the Payment Request UI.

<a id="4" />


## 4. Add payment details




Next, let's provide information about items a user is trying to purchase.

### 4.1 Define the details object

The second argument of the <code>PaymentRequest</code> constructor takes details about the purchase. It takes a list of items to display and the total price information.

This portion is already implemented in the <code>buildPaymentDetails()</code> function in <strong>app/scripts/modules/payment-api.js</strong>. You don't have to do anything at this time, but see what's happening here.

#### payment-api.js
```
let details = {
  displayItems: displayItems,
  total: {
    label: 'Total due',
    amount: {currency: 'USD', value: String(total)}
  }
  // TODO PAY-6.2 - allow shipping options
};
return details;
```

Save the file.

#### Explanation

A required <code>total</code> parameter consists of a label, currency and total amount to be charged.

An optional <code>displayItems</code> parameter indicates how the final amount was calculated.

The <code>displayItems</code> parameter is not intended to be a line-item list, but is rather a summary of the order's major components: subtotal, discounts, tax, shipping costs, etc. Let's define it in the next section.

### 4.2 Define the display items

The <code>displayItems</code> variable should be defined based on items added to the cart.

Replace "TODO PAY-4.2" in <strong>app/scripts/modules/payment-api.js</strong> with the following code and remove the existing <code>let displayItems = [];</code>:

#### payment-api.js
```
let displayItems = cart.cart.map(item => {
  return {
    label: <code>${item.sku}: ${item.quantity}x $${item.price}</code>,
    amount: {currency: 'USD', value: String(item.total)}
  };
});
```

Save the file.

#### Explanation

The payment UI should look like this. Try expanding "Order summary":

![6e050d10dcedd865.png](img/6e050d10dcedd865.png)

Notice that the display items are present in the "Order summary" row. We gave each item a <code>label</code> and <code>amount</code>. <code>label</code> is a display label containing information about the item. <code>amount</code> is an object that constructs price information for the item.

<a id="5" />


## 5. Complete the PaymentRequest




You've put the minimum required options to run a Payment Request. Let's allow a user to complete the payment.

Replace "TODO PAY-5" and the existing <code>return request.show();</code> in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
    return request.show()
      .then(r => {
        // The UI will show a spinner to the user until
        // <code>request.complete()</code> is called.
        response = r;
        let data = r.toJSON();
        console.log(data);
        return data;
      })
      .then(data => {
        return sendToServer(data);
      })
      .then(() => {
        response.complete('success');
        return response;
      })
      .catch(e => {
        if (response) {
          console.error(e);
          response.complete('fail');
        } else if (e.code !== e.ABORT_ERR) {
          console.error(e);
          throw e;
        } else {
          return null;
        }
      });
```

#### Explanation

The <code>PaymentRequest</code> interface is activated by calling its <code>show()</code> method. This method invokes a native UI that allows the user to examine the details of the purchase, add or change information, and pay. A <code>Promise</code> (indicated by its <code>then()</code> method and callback function) that resolves will be returned when the user accepts or rejects the payment request.

Calling <code>toJSON()</code> serializes the response object. You can then POST it to a server to process the payment. This portion differs depending on what payment processor / payment gateway you are using.

Once the server returns a response, call <code>complete()</code> to tell the user if processing the payment was successful or not by passing it <code>success</code> or <code>fail</code>.

### Try out the app

Awesome! Now you have completed implementing the basic Payment Request API features in your app. If you are not running your server, <code>npm run serve</code> and try it using your Android device.
```
$ npm run serve
```

The <code>PaymentRequest</code> UI displays when you click <strong>Checkout</strong>.

<a id="6" />


## 6. Allow shipping options




So far you've learned how to integrate the Payment Request API when it doesn't involve shipping items. Moving forward you will learn how to collect shipping information and options from the user.

### 6.1 Define the shipping options

When you want to collect the user's address information in order to ship items, add <code>requestShipping: true</code> in the third property of the <code>PaymentRequest</code> constructor.

Replace "TODO PAY-6.1" in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
requestShipping: true,
```

You also need to provide list of shipping options.

Replace "TODO PAY-6.2" in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
,
shippingOptions: displayedShippingOptions
```

Luckily <code>SHIPPING_OPTIONS</code> is predefined in the <strong>app/scripts/modules/payment-api.js</strong>; you can parse it and construct the <code>displayShippingOptions</code> object from it.

Replace TODO PAY-6.3 in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
let displayedShippingOptions = [];
if (shippingOptions.length > 0) {
  let selectedOption = shippingOptions.find(option => {
    return option.id === shippingOptionId;
  });
  displayedShippingOptions = shippingOptions.map(option => {
    return {
      id: option.id,
      label: option.label,
      amount: {currency: 'USD', value: String(option.price)},
      selected: option.id === shippingOptionId
    };
  });
  if (selectedOption) total += selectedOption.price;
}
```

Save the file.

#### Explanation

<code>id</code> is a unique identifier of the shipping option item. <code>label</code> is a displayed label of the item. <code>amount</code> is an object that constructs price information for the item. <code>selected</code> is a boolean that indicates if the item is selected.

![30b7dec7c673d29b.png](img/30b7dec7c673d29b.png)

Notice that these changes add a section to the Payment Request UI, "Shipping". But beware, selecting shipping address will cause UI to freeze and timeout. To resolve this, you will need to handle <code>shippingaddresschange</code> event in the next section.

<div class="note">
<strong>Note: </strong>The address information available here is retrieved from the browser's autofill information. Depending on the user's browser status, users will get address information pre-filled without typing any text. They can also add a new entry on the fly.
</div>

<a id="7" />


## 7. Add event handlers




What if a user specifies a shipping address that's outside of your target countries and not deliverable? How do you charge a user when the user changes a shipping option? The answer is to receive events upon the user's making changes and update with relevant information.

### 7.1 Add <code>shippingaddresschange</code> event listener

When the user changes a shipping address, you will receive the <code>shippingaddresschange</code> event.

Replace "TODO PAY-7.1" in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
// When user selects a shipping address, add shipping options to match
request.addEventListener('shippingaddresschange', e => {
  e.updateWith((_ => {
    // Get the shipping options and select the least expensive
    shippingOptions = this.optionsForCountry(request.shippingAddress.country);
    selectedOption = shippingOptions[0].id;
    let details = this.buildPaymentDetails(cart, shippingOptions, selectedOption);
    return Promise.resolve(details);
  })());
});
```

#### Explanation

Upon receiving the <code>shippingaddresschange</code> event, the <code>request</code> object's <code>shippingAddress</code> information is updated. By examining it, you can determine if

* The item is deliverable.
* Shipping cost needs to be added/updated.

This code looks into the country of the shipping address and provides free shipping and express shipping inside the US, and provides international shipping otherwise. Checkout <code>optionsForCountry()</code> function in <strong>app/scripts/modules/payment-api.js</strong> to see how the evaluation is done.

![eff1228c617db607.png](img/eff1228c617db607.png)

Note that passing an empty array to <code>shippingOptions</code> indicates that shipping is not available for this address. You can display an error message via <code>shippingOption.error</code> in that case.

### 7.2 Add <code>shippingoptionchange</code> event listener

When the user changes a shipping option, you will receive the <code>shippingoptionchange</code> event.

Replace "TODO PAY-7.2" in <strong>app/scripts/modules/payment-api.js</strong> with the following code:

#### payment-api.js
```
// When user selects a shipping option, update cost, etc. to match
request.addEventListener('shippingoptionchange', e => {
  e.updateWith((_ => {
    selectedOption = request.shippingOption;
    let details = this.buildPaymentDetails(cart, shippingOptions, selectedOption);
    return Promise.resolve(details);
  })());
});
```

#### Explanation

Upon receiving the <code>shippingoptionchange</code> event, the <code>request</code> object's <code>shippingOption</code> is updated. The <code>shippingOption</code>It indicates the <code>id</code> of the selected shipping options. The <code>id</code> is passed to <code>buildPaymentsDetails</code>, which looksLook for the price of the shipping option and updates the display items so that the user knows the total cost is changed. <code>buildPaymentsDetails alsoAlso</code> changes the shipping option's <code>selected</code> property to <code>true</code> to indicate that the user has chosen the item. Checkout <code>buildPaymentDetails()</code> function in <strong>app/scripts/modules/payment-api.js</strong> to see how it works.

![40f84cde162b2247.png](img/40f84cde162b2247.png)

<a id="8" />


## 8. Add payment options




In addition to the shipping address, there are options to collect payer's information such as email address, phone number, and name.

Replace "TODO PAY-8" in <strong>app/scripts/modules/payment-api.js</strong> with the following payment options:

#### payment-api.js
```
requestPayerEmail: true,
requestPayerPhone: true,
requestPayerName: true
```

Save the file.

#### Explanation

![b56afb4d034b55fb.png](img/b56afb4d034b55fb.png)

By adding <code>requestPayerPhone: true</code>, <code>requestPayerEmail: true</code>, <code>requestPayerName: true</code> to the third argument of the <code>PaymentRequest</code> constructor, you can request the payer's phone number, email address, and name.

<a id="9" />


## 9. Test it out




Phew! You have now completed implementing the Payment Request API with shipping option. Let's try it once again by running your server if it's stopped.
```
$ npm run serve
```

![9dda7d0039db40c8.png](img/9dda7d0039db40c8.png)

Try: add random items to the card, go to checkout, change shipping address and options, and finally make a payment.

Follow the instructions in the <a href="https://developers.google.com/web/tools/chrome-devtools/remote-debugging/local-server">Access Local Servers</a> article to set up port forwarding on your Android device. This lets you host the e-commerce app on your phone.

Once you have the app running on your phone, add some items to your cart and go through the checkout process. The <code>PaymentRequest</code> UI displays when you click <strong>Checkout</strong>.

The payment information won't go anywhere, but you might be hesitant to use a real credit card number. Use "4242 4242 4242 4242" as a fake one. Other information can be anything.

<div class="note">
The service worker is caching resources as you use the app, so be sure to unregister the service worker and run <code>npm run serve</code> if you want to test new changes.
</div>

<a id="congrats" />


## Congratulations!




You have added Payment integration to the e-commerce app. Congratulations!

To learn more about the Payment Request API, visit the following links.


## Resources




* <a href="https://developers.google.com/web/updates/2016/07/payment-request">Bringing Easy and Fast Checkout with Payment Request API</a>
* <a href="https://developers.google.com/web/fundamentals/discovery-and-monetization/payment-request/">Payment Request API: an Integration Guide</a>
* <a href="https://www.youtube.com/watch?v=U0LkQijSeko">Web Payments session video at Chrome Dev Summit 2017</a>

### Specs

* <a href="https://w3c.github.io/browser-payment-api/">Payment Request API</a>
* <a href="https://w3c.github.io/webpayments-payment-apps-api/">Payment Handler API</a>

### Demos

* <a href="https://paymentrequest.show/demo/">https://paymentrequest.show/demo/</a>
* <a href="https://googlechrome.github.io/samples/paymentrequest/">https://googlechrome.github.io/samples/paymentrequest/</a>
* <a href="https://woocommerce.paymentrequest.show/">https://woocommerce.paymentrequest.show/</a>


