/**
 * Bitterness
 * https://github.com/codepr/bitterness
 *
 * Copyright (c) 2014 - 2015 Andrea Baldan
 * Licensed under the MIT license.
 **/

var bitterness = module.exports = {

  // private function for tanh

  tanh: function(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
  },

  // private function for utilization calculation

  util: function(tm) {
    return 18.11 + 13.86 * this.tanh((tm - 31.32) / 18.27);
  },

  // private function for adjustment in case of OG > 1050

  adjustment: function(og) {
    if(og > 1050) return ((og - 1050) / 2) * 0.001;
    else return 0;
  },

  // private function needed by tinseth method

  mgAlphaAcids: function(hg, aa, bs) {
    return ((hg * aa * 10) / (bs));
  },

  // private function needed by tinseth method

  boilingFactor: function(og) {
    return (1.65 * (Math.exp(((og * 0.001) - 1.0) / 0.111)));
  },

  // private function needed by tinseth method

  boilingTimeFactor: function(tm) {
    return (1 - Math.exp(-0.04 * tm)) / 4.15;
  },

  /**
   * Calculate bitterness of a given recipe in IBU using rager formula.
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
    result = (hop_grams * this.util(time) * alpha_acids * 10) /
            (batch_size * (1 + this.adjustment(original_gravity)));
    return Math.round(result / 100);
  },

  /**
   * Calculate bitterness of a given recipe in IBU using tinseth formula.
   *
   * @param {number} hop_grams
   * @param {number} time in minutes
   * @param {number} alpha_acids in % form (e.g. 6% => 6)
   * @param {number} batch_size in liters
   * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
   * @return {number}
   **/

  tinseth: function(hop_grams, time, alpha_acids, batch_size, original_gravity) {
    mg_alpha = this.mgAlphaAcids(hop_grams, alpha_acids, batch_size);
    b_factor = this.boilingFactor(original_gravity);
    bt_factor = this.boilingTimeFactor(time);
    result = b_factor * bt_factor * mg_alpha;
    return Math.round(result);
  },

  /**
   * Calculate bitterness of a given recipe in IBU using rager and timseth formula mixed in avg.
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
