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
  // ibu value using both formulas
  var average = bitterness.average(hop_grams, // grams of hop
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
```
