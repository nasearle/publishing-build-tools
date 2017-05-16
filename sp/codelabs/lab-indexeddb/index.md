# Lab: IndexedDB




## Contents




<a href="#overview"><strong>Overview</strong></a>          

<a href="#1"><strong>1. Get set up</strong></a>          

<a href="#2"><strong>2. Check for support</strong></a>          

<a href="#3"><strong>3. Creating the database and adding items</strong></a>          

<a href="#4"><strong>4. Searching the database</strong></a>          

<a href="#5"><strong>5. Optional: Processing orders</strong></a>          

<a href="#6"><strong>Congratulations!</strong></a>

Concepts: <a href="https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/docs/working-with-indexeddb.html">Working with IndexedDB</a>

<a id="overview" />


## Overview




This lab guides you through the basics of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API">IndexedDB API</a> using Jake Archibald's <a href="https://github.com/jakearchibald/indexeddb-promised">IndexedDB Promised</a> library. The IndexedDB Promised library is very similar to the IndexedDB API, but uses promises rather than events. This simplifies the API while maintaining its structure, so anything you learn using this library can be applied to the IndexedDB API directly.

This lab builds a furniture store app,  <em>Couches-n-Things</em> , to demonstrate the basics of IndexedDB.

#### What you will learn

* How to create object stores and indexes
* How to create, retrieve, update, and delete values (or CRUD)
* How to use cursors
* (Optional) How to use the <code>getAll()</code> method

#### What you should know

* Basic JavaScript and HTML
* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">JavaScript Promises</a>

#### What you will need

* Computer with terminal/shell access
* <a href="https://www.google.com/chrome/browser/desktop/">Chrome</a> (the unit tests have a Chrome dependency)

<a id="1" />


## 1. Get set up




If you have not downloaded the repository, installed Node, and started a local server, follow the instructions in <a href="setting_up_the_labs.md">Setting up the labs</a>.

Open your browser and navigate to <strong>localhost:8080/indexed-db-lab/app</strong>.

<div class="note">
<strong>Note:</strong> <a href="tools_for_pwa_developers.md#unregister">Unregister</a> any service workers and <a href="tools_for_pwa_developers.md#clearcache">clear all service worker caches</a> for localhost so that they do not interfere with the lab.
</div>

If you have a text editor that lets you open a project, open the <strong>indexed-db-lab/app</strong> folder. This will make it easier to stay organized. Otherwise, open the folder in your computer's file system. The <strong>app</strong> folder is where you will be building the lab. 

This folder contains:

* <strong>js/main.js</strong> is where we will write the scripts to interact with the database
* <strong>js/idb.js</strong> is the IndexedDB Promised library
* <strong>test/test.html</strong> is a QUnit test page
* <strong>index.html</strong> is the main HTML page for our sample site/application, and which contains some forms for interacting with our IndexedDB database

<a id="2" />


## 2. Check for support




Because IndexedDB isn't supported by all browsers, we need to check that the user's browser supports it before using it.

Replace TODO 2 in <strong>app/js/main.js</strong> with the following code:

#### main.js
```
if (!('indexedDB' in window)) {
  console.log('This browser doesn\'t support IndexedDB');
  return;
}
```

<a id="3" />


## 3. Creating the database and adding items




### 3.1 Open a database

Create the database for your app. 

In <strong>js/main.js</strong>, replace <code>var dbPromise;</code> with the following code:

#### main.js
```
var dbPromise = idb.open('couches-n-things', 1);
```

In the browser,<a href="tools_for_pwa_developers.md#indexeddb">open IndexedDB</a> in the developer tools and confirm that your database exists.

Open the QUnit test page, <strong>app/test/test.html</strong>, in another browser tab. This page contains several tests for testing our app at each stage of the codelab. Passed tests are blue and failed tests are red. Your app should pass the first test that checks whether the <code>couches-n-things</code> database exists in the browser.

<div class="note">
<strong>Note:</strong> Be sure to open the test page using the localhost address so that it opens from the server and not directly from the file system.
</div>

#### Explanation

<code>idb.open</code> takes a database name, version number, and optional callback function for performing database updates (not included in the above code). The version number determines whether the upgrade callback function is called. If the version number is greater than the version number of the database existing in the browser, then the upgrade callback is executed.

<div class="note">
<strong>Note: </strong>If at any point in the codelab your database gets into a bad state, you can delete it from the console with the following command: <code>indexedDB.deleteDatabase('couches-n-things');</code>. Note that you can't delete the database while the testing page is open.
</div>

### 3.2 Create an object store

Let's create an object store in the database to hold the furniture objects.

<div class="note">
<strong>Note:</strong> Close the test page. The database version can't be changed while another page is using the database.
</div>

To complete TODO 3.2 in <strong>main.js</strong>, replace <code>var dbPromise = idb.open('couches-n-things', 1);</code> with the following:

#### main.js
```
var dbPromise = idb.open('couches-n-things', 2, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      // a placeholder case so that the switch block will 
      // execute when the database is first created
      // (oldVersion is 0)
    case 1:
      console.log('Creating the products object store');
      upgradeDb.createObjectStore('products', {keyPath: 'id'});

    // TODO 4.1 - create 'name' index

    // TODO 4.2 - create 'price' and 'description' indexes

    // TODO 5.1 - create an 'orders' object store

  }
});
```

Save the code and reload the page in the browser.<a href="tools_for_pwa_developers.md#indexeddb">Open IndexedDB</a> in your browser's developer tools and expand the <code>couches-n-things</code> database. You should see the empty <code>products</code> object store.

Open the QUnit test page. Your app should now pass the second test that checks whether the <code>products</code> object store exists.

#### Explanation

To ensure database integrity, object stores and indexes can only be created during database upgrades. This means they are created inside the upgrade callback function in <code>idb.open</code>, which executes only if the version number (in this case it's <code>2</code>) is greater than the existing version in the browser or if the database doesn't exist. The callback is passed the <code>UpgradeDB</code> object (see the <a href="https://github.com/jakearchibald/idb#idbopenname-version-upgradecallback">documentation</a> for details), which is used to create the object stores.

Inside the callback, we include a switch block that executes its cases based on the version of the database already existing in the browser. <code>case 0</code> executes if the database doesn't yet exist. The database already exists for us, but we need a <code>case 0</code> in case we delete the database, or in case someone else uses our app on their own machine.

We have specified the <code>id</code> property as the <code>keyPath</code> for the object store. Objects added to this store must have an <code>id</code> property and the value must be unique.

<div class="note">
<strong>Note:</strong> We are deliberately not including <code>break</code> statements in the switch block to ensure all of the cases after the starting case will execute.
</div>

#### For more information

* <a href="https://github.com/jakearchibald/idb"><code>idb</code> - Github</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/createObjectStore"><code>createObjectStore</code> method</a>

### 3.3 Add objects to the object store

Add some sample furniture items to the object store. 

Replace TODO 3.3 in <strong>main.js</strong> with the following code:

#### main.js
```
dbPromise.then(function(db) {
  var tx = db.transaction('products', 'readwrite');
  var store = tx.objectStore('products');
  var items = [
    {
      name: 'Couch',
      id: 'cch-blk-ma',
      price: 499.99,
      color: 'black',
      material: 'mahogany',
      description: 'A very comfy couch',
      quantity: 3
    },
    {
      name: 'Armchair',
      id: 'ac-gr-pin',
      price: 299.99,
      color: 'grey',
      material: 'pine',
      description: 'A plush recliner armchair',
      quantity: 7
    },
    {
      name: 'Stool',
      id: 'st-re-pin',
      price: 59.99,
      color: 'red',
      material: 'pine',
      description: 'A light, high-stool',
      quantity: 3
    },
    {
      name: 'Chair',
      id: 'ch-blu-pin',
      price: 49.99,
      color: 'blue',
      material: 'pine',
      description: 'A plain chair for the kitchen table',
      quantity: 1
    },
    {
      name: 'Dresser',
      id: 'dr-wht-ply',
      price: 399.99,
      color: 'white',
      material: 'plywood',
      description: 'A plain dresser with five drawers',
      quantity: 4
    },
    {
      name: 'Cabinet',
      id: 'ca-brn-ma',
      price: 799.99,
      color: 'brown',
      material: 'mahogany',
      description: 'An intricately-designed, antique cabinet',
      quantity: 11
    }
  ];
  items.forEach(function(item) {
    console.log('Adding item: ', item);
    store.add(item);
  });
  return tx.complete;
}).then(function() {
  console.log('All items added successfully!');
}).catch(function(e) {
  console.log('Error adding items: ', e);
});
```

Save the file and reload the page in the browser. Click <strong>Add Products</strong> and refresh the page. Confirm that the objects display in the <code>products</code> object store under <code>couches-n-things</code> in the developer tools.

Reload the test page. The app should now pass the third test that checks whether the objects have been added to the <code>products</code> object store. 

#### Explanation

All database operations must be carried out within a <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction">transaction</a>. The transaction rolls back any changes to the database if any of the operations fail. This ensures the database is not left in a partially updated state. 

<div class="note">
<strong>Note:</strong> Specify the transaction mode as <code>readwrite</code> when making changes to the database (that is, using the <code>add</code>, <code>put</code>, or <code>delete</code> methods).
</div>

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction">Transactions - MDN</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/add">Add method - MDN</a>

<a id="4" />


## 4. Searching the database




### 4.1 Create indexes on the object store

Create some indexes on your object store.

<div class="note">
<strong>Note:</strong> Close the test page. The database version can't be changed while another page is using the database.
</div>

Replace TODO 4.1 in <strong>main.js</strong> with the following code:

#### main.js
```
case 2:
  console.log('Creating a name index');
  var store = upgradeDb.transaction.objectStore('products');
  store.createIndex('name', 'name', {unique: true});
```

<div class="note">
<strong>Important:</strong> Remember to change the version number to 3 before you test the code in the browser.
</div>

The full <code>idb.open</code> method should look like this:

#### main.js
```
var dbPromise = idb.open('couches-n-things', 3, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      // a placeholder case so that the switch block will 
      // execute when the database is first created
      // (oldVersion is 0)
    case 1:
      console.log('Creating the products object store');
      upgradeDb.createObjectStore('products', {keyPath: 'id'});
    case 2:
      console.log('Creating a name index');
      var store = upgradeDb.transaction.objectStore('products');
      store.createIndex('name', 'name', {unique: true});

    // TODO 4.2 - create 'price' and 'description' indexes

    // TODO 5.1 - create an 'orders' object store

  }
});
```

<div class="note">
<strong>Note:</strong> We did not include break statements in the switch block so that all of the latest updates to the database will execute even if the user is one or more versions behind.
</div>

Save the file and reload the page in the browser. Confirm that the <code>name</code> index displays in the <code>products</code> object store in the developer tools.

Open the test page. The app should now pass the fourth test that checks whether the <code>name</code> index exists.

#### Explanation

In the example, we create an index on the <code>name</code> property, allowing us to search and retrieve objects from the store by their name. The optional <code>unique</code> option ensures that no two items added to the <code>products</code> object store use the same name.

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBIndex"><code>IDBIndex</code> - MDN</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex"><code>createIndex</code> method - MDN</a>

### 4.2 Create <code>price</code> and <code>description</code> indexes

To complete TODO 4.2 in <strong>main.js</strong>, write a case 3 to add  and <code>description</code> indexes to the object store. Do not include the optional <code>{unique: true}</code> argument since these values do not need to be unique.

<div class="note">
<strong>Note: </strong>Remember to change the version number of the database to 4 before testing the code.
</div>

<div class="note">
<strong>Note:</strong> Remember to close the test page. The database version can't be changed while another page is using the database.
</div>

Save the code and refresh the page in the browser. Confirm that the <code>price</code> and <code>description</code> indexes display in the <code>products</code> object store in the developer tools.

Open the test page. The app should now pass tests five and six. These check whether the <code>price</code> and <code>description</code> indexes have been added to the store.

### 4.3 Use the get method

Use the indexes you created in the previous sections to retrieve items from the store.

Replace TODO 4.3 in <strong>main.js</strong> with the following code:

#### main.js
```
return dbPromise.then(function(db) {
  var tx = db.transaction('products', 'readonly');
  var store = tx.objectStore('products');
  var index = store.index('name');
  return index.get(key);
});
```

Save the code and refresh the page in the browser.

<div class="note">
<strong>Note:</strong> Make sure the items we added to the database in the previous step are still in the database. If the database is empty, click <strong>Add Products</strong> to populate it.
</div>

Enter an item name from step 3.3 into the <strong>By Name</strong> field and click <strong>Search</strong> next to the text box. The corresponding furniture item should display on the page.

Refresh the test page. The app should pass the seventh test, which checks if the <code>getByName</code> function returns a database object.

<div class="note">
<strong>Note:</strong> The <code>get</code> method is case sensitive.
</div>

#### Explanation

This code calls the <code>get</code> method on the 'name' index to retrieve an item by its 'name' property.

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/get"><code>Get</code> method - MDN</a>

### 4.4 Use a cursor object

Use a cursor object to get items from your store within a price range.

Replace TODO 4.4a in <strong>main.js</strong> with the following code:

#### main.js
```
var lower = document.getElementById('priceLower').value;
var upper = document.getElementById('priceUpper').value;
var lowerNum = Number(document.getElementById('priceLower').value);
var upperNum = Number(document.getElementById('priceUpper').value);

if (lower === '' && upper === '') {return;}
var range;
if (lower !== '' && upper !== '') {
  range = IDBKeyRange.bound(lowerNum, upperNum);
} else if (lower === '') {
  range = IDBKeyRange.upperBound(upperNum);
} else {
  range = IDBKeyRange.lowerBound(lowerNum);
}
var s = '';
dbPromise.then(function(db) {
  var tx = db.transaction('products', 'readonly');
  var store = tx.objectStore('products');
  var index = store.index('price');
  return index.openCursor(range);
}).then(function showRange(cursor) {
  if (!cursor) {return;}
  console.log('Cursored at:', cursor.value.name);
  s += '<h2>Price - ' + cursor.value.price + '</h2><p>';
  for (var field in cursor.value) {
    s += field + '=' + cursor.value[field] + '<br/>';
  }
  s += '</p>';
  return cursor.continue().then(showRange);
}).then(function() {
  if (s === '') {s = '<p>No results.</p>';}
  document.getElementById('results').innerHTML = s;
});
```

Save the code and refresh the page in the browser. Enter some prices into the 'price' text boxes (without a currency symbol) and click <strong>Search</strong>. Items should appear on the page ordered by price. 

<strong>Optional</strong>: Replace TODO 4.4b in the <code>getByDesc()</code> function with the code to get the items by their descriptions. The first part is done for you. The function uses the 'only' method on <code>IDBKeyrange</code> to match all items with exactly the provided description.

Save the code and refresh the page in the browser. Enter a description (must match the description in the desired object exactly) into the description text box and click <strong>Search</strong>.

#### Explanation

After getting the price values from the page, we determine which method to call on <code>IDBKeyRange</code> to limit the cursor. We open the cursor on the <code>price</code> index and pass the cursor object to the <code>showRange</code> function in <code>.then</code>. This function adds the current object to the html string, moves on to the next object with <code>cursor.continue()</code>, and calls itself, passing in the cursor object. <code>showRange</code> loops through each object in the object store until it reaches the end of the range. Then the cursor object is <code>undefined</code> and <code>if (!cursor) {return;}</code> breaks the loop.

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor"><code>IDBCursor</code> - MDN</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBKeyRange"><code>IDBKeyRange</code> - MDN</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBCursor/continue"><code>cursor.continue()</code> - MDN</a>

#### Solution code

The solution code can be found in the <strong>04-4-get-data</strong> directory.

<a id="5" />


## 5. Optional: Processing orders




In this section we create an <code>orders</code> object store to contain a user's orders. We take a sample order and check if the quantity of each item in the <code>products</code> object store is enough to fulfill the order. If we have enough in stock, we process the orders, subtracting the amount ordered from the quantity of each corresponding item in the <code>products</code> object store.

### 5.1 Create an orders object store

Create an object store to hold pending orders.

To complete TODO 5.1 in <strong>main.js</strong>, write a case 4 that adds an <code>orders</code> object store to the database. Make the <code>keyPath</code> the <code>id</code> property. This is very similar to creating the <code>products</code> object store in <code>case 1</code>.

<div class="note">
<strong>Important:</strong> Remember to change the version number of the database to 5 so the callback executes.
</div>

<div class="note">
<strong>Note:</strong> Remember to close the test page. The database version can't be changed while another page is using the database.
</div>

Save the code and refresh the page in the browser. Confirm that the object store displays in the developer tools.

Open the test page. Your app should pass the eighth test which tests if the <code>orders</code> object store exists.

### 5.2 Add sample orders

To complete TODO 5.2 in <strong>main.js</strong>, add the following items to the <code>orders</code> object store.

<div class="note">
<strong>Note:</strong> You'll need to write the code to actually add the items.
</div>

#### main.js
```
var items = [
  {
    name: 'Cabinet',
    id: 'ca-brn-ma',
    price: 799.99,
    color: 'brown',
    material: 'mahogany',
    description: 'An intricately-designed, antique cabinet',
    quantity: 7
  },
  {
    name: 'Armchair',
    id: 'ac-gr-pin',
    price: 299.99,
    color: 'grey',
    material: 'pine',
    description: 'A plush recliner armchair',
    quantity: 3
  },
  {
    name: 'Couch',
    id: 'cch-blk-ma',
    price: 499.99,
    color: 'black',
    material: 'mahogany',
    description: 'A very comfy couch',
    quantity: 3
  }
];
```

Save the code and refresh the page in the browser. Click <strong>Add Orders</strong> and refresh the page again. Confirm that the objects show up in the <code>orders</code> store in the developer tools.

Refresh the test page. Your app should now pass the ninth test which checks if the sample orders were added to the <code>orders</code> object store.

### 5.3 Display orders

To complete TODO 5.3 in <strong>main.js</strong>, write the code to display all of the objects in the <code>orders</code> object store on the page. This is very similar to the <code>getByPrice</code> function except you don't need to define a range for the cursor. The code to insert the <code>s</code> variable into the HTML is already written.

Save the code and refresh the page in the browser. Click <strong>Show Orders</strong> to display the orders on the page.

### 5.4 Get all orders

To complete TODO 5.4 in the <code>getOrders</code> function in <strong>main.js</strong>, write the code to get all objects from the <code>orders</code> object store. You must use the <a href="https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/getAll">getAll() method</a> on the object store. This returns an array containing all the objects in the store, which is then passed to the <code>processOrders</code> function in <code>.then</code>.

<div class="note">
<strong>Hint:</strong> Return the call to <code>dbPromise</code> otherwise the orders array will not be passed to the <code>processOrders</code> function.
</div>

Refresh the test page. Your app should now pass the tenth test, which checks if the <code>getOrders</code> function gets objects from the <code>orders</code> object store.

### 5.5 Process the orders

This step processes the array of orders passed to the <code>processOrders</code> function.

Replace TODO 5.5 in <strong>main.js</strong> with the following code:

#### main.js
```
return dbPromise.then(function(db) {
  var tx = db.transaction('products');
  var store = tx.objectStore('products');
  return Promise.all(
    orders.map(function(order) {
      return store.get(order.id).then(function(product) {
        return decrementQuantity(product, order);
      });
    })
  );
});
```

#### Explanation

This code gets each object from the <code>products</code> object store with an id matching the corresponding order, and passes it and the order to the <code>decrementQuantity</code> function.

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all">Promise.all() - MDN</a>
* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map">Array.map() - MDN</a>

### 5.6 Decrement quantity

Now we need to check if there are enough items left in the <code>products</code> object store to fulfill the order.

Replace TODO 5.6 in <strong>main.js</strong> with the following code:

#### main.js
```
return new Promise(function(resolve, reject) {
  var item = product;
  var qtyRemaining = item.quantity - order.quantity;
  if (qtyRemaining < 0) {
    console.log('Not enough ' + product.id + ' left in stock!');
    document.getElementById('receipt').innerHTML =
    '<h3>Not enough ' + product.id + ' left in stock!</h3>';
    throw 'Out of stock!';
  }
  item.quantity = qtyRemaining;
  resolve(item);
});
```

Refresh the test page. Your app should now pass the eleventh test, which checks if the <code>decrementQuantity</code> function subtracts the quantity ordered from the quantity available.

#### Explanation

Here we are subtracting the quantity ordered from the quantity left in the <code>products</code> store. If this value is less than zero, we reject the promise. This causes <code>Promise.all</code> in the <code>processOrders</code> function to fail so that the whole order is not processed. If the quantity remaining is not less than zero, then we update the quantity and return the object.

#### For more information

* <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise">new <code>Promise</code> - MDN</a>

### 5.7 Update the <code>products</code> object store

Finally, we must update the <code>products</code> object store with the new quantities of each item.

Replace TODO 5.7 in <strong>main.js</strong> with the code to update the items in the <code>products</code> objects store with their new quantities. We already updated the values in the <code>decrementQuantity</code> function and passed the array of updated objects into the <code>updateProductsStore</code> function. All that's left to do is use <a id="https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/put">ObjectStore.put</a> to update each item in the store. A few hints:

* Remember to make the transaction mode <code>'readwrite'</code>
* Remember to return <code>transaction.complete</code> (<code>tx.complete</code>) after putting the items into the store

Save the code and refresh the page in the browser. Check the quantity property of the cabinet, armchair, and couch items in the products object store. Click <strong>Fulfill</strong> in the page, refresh, and check the quantities again. They should be reduced by the amount of each product that was ordered.

Refresh the test page. Your app should now pass the last test, which checks whether the <code>updateProductsStore</code> function updates the items in the <code>products</code> object store with their reduced quantities.

#### Solution code

The solution code can be found in the <strong>solution</strong> directory.

<a id="6" />


## Congratulations!




You have learned the basics of working with IndexedDB. 

#### What we've covered

* How to create, read, update and delete data in the database
* The <code>getAll</code> method
* How to use cursors to iterate over the data


