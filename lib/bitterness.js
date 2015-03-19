/**
 * Bitterness
 * https://github.com/codepr/bitterness
 *
 * Copyright (c) 2014 - 2015 Andrea Baldan
 * Licensed under the MIT license.
 **/

var bitterness = module.exports = (function() {

  // private function for tanh

  tanh = function(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
  }

  // private function for utilization calculation

  util = function(tm) {
    return 18.11 + 13.86 * this.tanh((tm - 31.32) / 18.27);
  }

  // private function for adjustment in case of OG > 1050

  adjustment = function(og) {
    if(og > 1050) return ((og - 1050) / 2) * 0.001;
    else return 0;
  }

  // private function needed by Tinseth method

  mgAlphaAcids = function(hg, aa, bs) {
    return ((hg * aa * 10) / (bs));
  }

  // private function needed by Tinseth method

  boilingFactor = function(og) {
    return (1.65 * (Math.exp(((og * 0.001) - 1.0) / 0.111)));
  }

  // private function needed by Tinseth method

  boilingTimeFactor = function(tm) {
    return (1 - Math.exp(-0.04 * tm)) / 4.15;
  }

  // private function needed by Garetz method

  temperatureFactor = function(h) {
    return ((h / 168) * 0.02) + 1;
  }

  // private function needed by Garetz method

  gravityFactor = function(fv, bv, og) {
    var bg = ((fv / bv) * ((og * 0.001) - 1)) + 1;
    return (5 * (bg - 0.85));
  }

  return {

    /**
     * Calculate bitterness of a given recipe in IBU using Rager formula.
     *
     * @param {number} hop_grams
     * @param {number} time in minutes
     * @param {number} alpha_acids in % form (e.g. 6% => 6)
     * @param {number} batch_size in liters
     * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
     * @return {number}
     **/

    rager: function(hop_grams, time, alpha_acids, batch_size, original_gravity) {
      var result = 0;
      result = (hop_grams * util(time) * alpha_acids * 10) /
              (batch_size * (1 + adjustment(original_gravity)));
      return Math.round(result / 100);
    },

    /**
     * Calculate bitterness of a given recipe in IBU using Tinseth formula.
     *
     * @param {number} hop_grams
     * @param {number} time in minutes
     * @param {number} alpha_acids in % form (e.g. 6% => 6)
     * @param {number} batch_size in liters
     * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
     * @return {number}
     **/

    tinseth: function(hop_grams, time, alpha_acids, batch_size, original_gravity) {
      var mg_alpha = mgAlphaAcids(hop_grams, alpha_acids, batch_size);
      var b_factor = boilingFactor(original_gravity);
      var bt_factor = boilingTimeFactor(time);
      result = b_factor * bt_factor * mg_alpha;
      return Math.round(result);
    },

    /**
     * Calculate bitterness of a given recipe in IBU using Garetz formula.
     *
     * @param {number} hop_grams
     * @param {number} time in minutes
     * @param {number} alpha_acids in % form (e.g. 6% => 6)
     * @param {number} batch_size in liters
     * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
     * @param {number} final_volume in liters
     * @param {number} height in meters of the boiling batch
     * @return {number}
     **/

    garetz: function(hop_grams, time, alpha_acids, batch_size, original_gravity, final_volume, height) {
      var gf = gravityFactor(final_volume, batch_size, original_gravity);
      var tf = temperatureFactor(height);
      var fr = (util(time) * alpha_acids * hop_grams) / (650 * batch_size * gf * tf);
      return Math.round(130 * (-1 + (Math.sqrt(1 + fr))) / (final_volume / batch_size));
    },

    /**
     * Calculate bitterness of a given recipe in IBU using Rager and Tinseth formula mixed in avg.
     *
     * @param {number} hop_grams
     * @param {number} time in minutes
     * @param {number} alpha_acids in % form (e.g. 6% => 6)
     * @param {number} batch_size in liters
     * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
     * @return {number}
     **/

    average: function(hop_grams,  time, alpha_acids, batch_size, original_gravity) {
      return ((this.rager(hop_grams,  time, alpha_acids, batch_size, original_gravity) + this.tinseth(hop_grams,  time, alpha_acids, batch_size, original_gravity)) / 2);
    }
  };
})();
