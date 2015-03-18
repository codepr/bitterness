Bitterness
==========

A small library providing utility methods to calculate bitterness of a given recipe, in IBU measure unit.

## Installation

## Usage

  var bitterness = new bitterness(hop_grams, time, alpha_acids, batch_size, original_gravity);
  var rager = bitterness.rager(); // ibu value with rager formula
  var tinseth = bitterness.tinseth(); // ibu value with tinseth formula
  var average = bitterness.average(); // ibu value using both formulas

## Test

  npm test

## Release History

  * 0.1.0 Initial release
  * 0.1.2 Better organization, privatized some functions, writing test.
