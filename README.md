Bitterness
==========

A basic library providing utility methods to calculate bitterness of a given recipe, in IBU measure unit, featuring Rager forumula, Tinseth formula or an average of the two, Garetz formula is also available.

## Installation
```js
    npm install bitterness
```
## Usage
```js
  var bitterness = require('bitterness');
  // ibu value with Rager formula
  var rager = bitterness.rager(hop_grams, // grams of hop
                               time, // time in minutes
                               alpha_acids, // AA% in the form of % (e.g. 6% => 6)
                               batch_size, // size of the batch in liters
                               original_gravity); // OG in the form xxxx.xx (e.g. 1050.00)
  // ibu value with Tinseth formula
  var tinseth = bitterness.tinseth(hop_grams, // grams of hop
                                   time, // time in minutes
                                   alpha_acids, // AA% in the form of % (e.g. 6% => 6)
                                   batch_size, // size of the batch in liters
                                   original_gravity); // OG in the form xxxx.xx (e.g. 1050.00)
  // ibu value using Garetz formula
  var garetz = bitterness.garetz(hop_grams, // grams of hop
                                 time, // time in minutes
                                 alpha_acids, // AA% in the form of % (e.g. 6% => 6)
                                 batch_size, // size of the batch in liters
                                 original_gravity, // OG in the form xxxx.xx (e.g. 1050.00)
                                 final_volume // size of the volume post boil in liters
                                 height); // height in meters of the boiling batch
  // ibu value using mixed formulas
  var average = bitterness.average(hop_grams, // grams of hop
                                   time, // time in minutes
                                   alpha_acids, // AA% in the form of % (e.g. 6% => 6)
                                   batch_size, // size of the batch in liters
                                   original_gravity, // OG in the form xxxx.xx (e.g. 1050.00)
                                   final_volume // size of the volume post boil in liters, optional
                                   height); // height in meters of the boiling batch, optional

  // In the average method, final_volume and height are optional, if omitted it will use only Rager and Tinseth methods in computation, otherwise height is defaulted at 0 meters if omitted.
```
Example:
```js
  var bitterness = require('bitterness');
  var rager = bitterness.rager;
  // 93 grams, 90 minutes boil time, 6% alpha acids, 25 liters batch, 1050 og
  var r = rager(93, 90, 6, 25, 1050);
  // cache the last stats inserted in any previous method
  var g = bitterness.garetz(); // using defaulted final volume = (batch size - 10%) and height = 0

  console.log(r); // 71 ibu
  console.log(g); // 64 ibu

  // returns the sum of all hop additions, taking in account only parameterized calls
  var additions = bitterness.ibu();
  console.log(additions); // 71 ibu, corresponding to r var
```
## Test
```js
  npm test
```
## Release History
```js
  0.1.0 Initial release.
  0.1.2 Better organization, privatized some functions, writing test.
  0.1.5 Module pattern design. Updated usage section.
  0.1.6 Added Garetz method for IBU calculation.
  0.1.7 Added Garetz into the average method, optional.
  0.1.9 Corrected Tinseth formula, added cache of last addition, and subtotal.
```
