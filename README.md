Bitterness
==========
[![Build Status](https://travis-ci.org/codepr/bitterness.svg?branch=master)](https://travis-ci.org/codepr/bitterness)

A basic library providing utility methods to calculate bitterness of a given recipe, in IBU measure unit, featuring Rager forumula, Tinseth formula or an average of the two, Garetz formula is also available. Measure system is defaulted at European decimal system, supports Imperial system too.

### Installation
```sh
npm install bitterness
# for development purpose install (e.g. running tests) need mocha and chai
npm install bitterness --dev
```
### Usage
```js
var bt = require('bitterness');
// ibu value with Rager formula
var rager = bt.rager(
		hopWeight, // grams of hop
		time, // time in minutes
		alphaAcids, // AA% in the form of % (e.g. 6% => 6)
		batchSize, // size of the batch in liters
		originalGravity); // OG in the form xxxx.xx (e.g. 1050.00)
// ibu value with Tinseth formula
var tinseth = bt.tinseth(
		hopWeight, // grams of hop
		time, // time in minutes
		alphaAcids, // AA% in the form of % (e.g. 6% => 6)
		batchSize, // size of the batch in liters
		originalGravity); // OG in the form xxxx.xx (e.g. 1050.00)
// ibu value using Garetz formula
var garetz = bt.garetz(
		hopWeight, // grams of hop
		time, // time in minutes
		alphaAcids, // AA% in the form of % (e.g. 6% => 6)
		batchSize, // size of the batch in liters
		originalGravity, // OG in the form xxxx.xx (e.g. 1050.00)
		final_volume // size of the volume post boil in liters
		height); // height in meters of the boiling batch

```
### Practical example:
```js
var bt = require('bitterness');
var rager = bt.rager;
// 93 grams, 90 minutes boil time, 6% alpha acids, 25 liters batch, 1050 og
var r = rager(93, 90, 6, 25, 1050);
var g = bt.garetz(93, 90, 6, 25, 1050); // using defaulted final volume = (batch size - 10%) and height = 0

console.log(r); // ~ 71 ibu
console.log(g); // ~ 49 ibu

bt.setMetricSystem(false); // set system to imperial
// 3.17 oz, 90 minutes, 6% alpha acids, 6.60 gallons, 1050 og
var r = rager(3.17, 90, 6, 6.60, 1050);

```

### Test
```sh
npm test
```
### Changelog

See the [CHANGELOG](CHANGELOG.md) file.

### License

See the [LICENSE-MIT](LICENSE-MIT) file for license rights and limitations (MIT).
