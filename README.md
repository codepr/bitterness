Bitterness
==========
[![Build Status](https://travis-ci.org/codepr/bitterness.svg?branch=master)](https://travis-ci.org/codepr/bitterness)

A basic library providing utility methods to calculate bitterness of a given recipe, in IBU measure unit, featuring Rager forumula, Tinseth formula or an average of the two, Garetz formula is also available. Measure system default set at metric, supports imperial system.

## Installation
```sh
    npm install bitterness
    # for development purpose install (e.g. running tests) need mocha and chai (much longer install)
    npm install bitterness --dev
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

  // In the average method, final_volume and height are optional, final_volume
  // is defaulted at final_volume - 10% (average boil time loss), height is defaulted at 0 meters if omitted.
```
Example:
```js
  var bitterness = require('bitterness');
  var rager = bitterness.rager;
  // 93 grams, 90 minutes boil time, 6% alpha acids, 25 liters batch, 1050 og
  var r = rager(93, 90, 6, 25, 1050);
  // cache the last stats inserted in any previous method
  var g = bitterness.garetz(); // using defaulted final volume = (batch size - 10%) and height = 0
  // average
  var a = bitterness.average(); // mix 3 formulas using defaulted final volume and height

  console.log(r); // ~ 71 ibu
  console.log(g); // ~ 64 ibu
  console.log(a); // ~ 66 ibu

  // returns the sum of all hop additions, taking in account only parameterized calls
  var total_ibu = bitterness.ibu();
  console.log(total_ibu); // 71 ibu, corresponding to r var

  var additions = bitterness.additions();
  console.log(additions) // [71]

  bitterness.metric(false); // set system to imperial
  // 3.17 oz, 90 minutes, 6% alpha acids, 6.60 gallons, 1050 og
  var r = rager(3.17, 90, 6, 6.60, 1050);
  bitterness.metric(true); // back to metric system

  additions = bitterness.additions();
  console.log(additions) // [71, 68]

  bitterness.clean(); // empty additions history
  additions = bitterness.additions();
  total_ibu = bitterness.ibu();
  console.log(additions) // []
  console.log(total_ibu) // 0

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
  1.0.0 Metric/Imperial system switch added.
  1.0.2 Corrected some bugs.
```
