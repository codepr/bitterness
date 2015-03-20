/**
 * Bitterness
 * https://github.com/codepr/bitterness
 *
 * Copyright (c) 2014 - 2015 Andrea Baldan
 * Licensed under the MIT license.
 **/

var bitterness = module.exports = (function() {

  var ibus = [];
  var current = {};
  var metric = true;

  // private function for approximation of HypTan

  hyptan = function(arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
  }

  // private function for utilization calculation

  util = function(tm) {
    return 18.11 + 13.86 * hyptan((tm - 31.32) / 18.27);
  }

  // private function for adjustment in case of OG > 1050

  adjustment = function(og) {
    if(og > 1050) return ((og - 1050) / 2) * 0.001;
    else return 0;
  }

  // private function needed by Tinseth method

  mgAlphaAcids = function(hg, aa, bs) {
    return ((hg * (aa * 0.01) * 1000) / (bs - (bs * 0.1)));
  }

  // private function needed by Tinseth method

  bignessFactor = function(og) {
    return (1.65 * Math.pow(0.000125, ((og * 0.001)-1)));
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
      if(arguments.length == 0) {
        result = (current.hg * util(current.tm) * current.aa * 10) /
                (current.bs * (1 + adjustment(current.og)));
      } else {
        current.hg = hop_grams;
        current.tm = time;
        current.aa = alpha_acids;
        current.bs = batch_size;
        current.og = original_gravity;
        result = (hop_grams * util(time) * alpha_acids * 10) /
                (batch_size * (1 + adjustment(original_gravity)));
        ibus.push(result / 100);
      }
      result = result / 100;
      return Math.round(result * 100) / 100;
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
      var result = 0,
          mg_alpha = 0,
          b_factor = 0,
          bt_factor = 0,
          cache = false;
      if(arguments.length == 0) {
        mg_alpha = mgAlphaAcids(current.hg, current.aa, current.bs);
        b_factor = bignessFactor(current.og);
        bt_factor = boilingTimeFactor(current.tm);
      } else {
        cache = true;
        current.hg = hop_grams;
        current.tm = time;
        current.aa = alpha_acids;
        current.bs = batch_size;
        current.og = original_gravity;
        mg_alpha = mgAlphaAcids(hop_grams, alpha_acids, batch_size);
        b_factor = bignessFactor(original_gravity);
        bt_factor = boilingTimeFactor(time);
      }
      result = b_factor * bt_factor * mg_alpha;
      if(cache == true) ibus.push(result);
      return Math.round(result * 100) / 100;
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
      var result = 0,
          gf = 0,
          tf = 0,
          fr = 0,
          cache = false;
      if(arguments.length == 0) {
        fv = current.fv || (batch_size - (batch_size * 0.1));
        ht = current.ht || 0;
        gf = gravityFactor(fv, current.bs, current.og);
        tf = temperatureFactor(ht);
        fr = (util(current.tm) * current.aa * current.hg) / (650 * current.bs * gf * tf);
        result = (130 * (-1 + (Math.sqrt(1 + fr))) / (current.fv / current.bs));
      } else {
        cache = true;
        current.hg = hop_grams;
        current.tm = time;
        current.aa = alpha_acids;
        current.bs = batch_size;
        current.og = original_gravity;
        current.fv = final_volume;
        current.ht = height;
        gf = gravityFactor(final_volume, batch_size, original_gravity);
        tf = temperatureFactor(height);
        fr = (util(time) * alpha_acids * hop_grams) / (650 * batch_size * gf * tf);
        result = (130 * (-1 + (Math.sqrt(1 + fr))) / (final_volume / batch_size));
      }
      if(cache == true) ibus.push(result);
      return Math.round(result * 100) / 100;
    },

    /**
     * Calculate bitterness of a given recipe in IBU using Rager Tinseth and optionally Garetz formula mixed in avg.
     *
     * @param {number} hop_grams
     * @param {number} time in minutes
     * @param {number} alpha_acids in % form (e.g. 6% => 6)
     * @param {number} batch_size in liters
     * @param {number} original_gravity (xxxx.xx format e.g. 1050.00)
     * @param {number} final_volume in liters post boil, optional
     * @param {number} height of the boil batch in meters, optional defaulted at 0
     * @return {number}
     **/

    average: function(hop_grams,  time, alpha_acids, batch_size, original_gravity, final_volume, height) {
      var result;
      if(arguments.length == 0) {
        if(current.fv != undefined) {
          result = ((this.rager(current.hg,  current.tm, current.aa, current.bs, current.og) + this.tinseth(current.hg,  current.tm, current.aa, current.bs, current.og) + this.garetz(current.hg,  current.tm, current.aa, current.bs, current.og, current.fv, current.ht)) / 3);
          ibus.pop();
          ibus.pop();
          ibus.pop();
        } else {
          result = ((this.rager(current.hg,  current.tm, current.aa, current.bs, current.og) + this.tinseth(current.hg,  current.tm, current.aa, current.bs, current.og)) / 2);
          ibus.pop();
          ibus.pop();
        }
        return Math.round(result * 100) / 100;
      } else {
        current.hg = hop_grams;
        current.tm = time;
        current.aa = alpha_acids;
        current.bs = batch_size;
        current.og = original_gravity;
        if(final_volume != undefined) {
          height = height || 0;
          current.fv = final_volume;
          current.ht = height;
          result = ((this.rager(hop_grams,  time, alpha_acids, batch_size, original_gravity) + this.tinseth(hop_grams,  time, alpha_acids, batch_size, original_gravity) + this.garetz(hop_grams,  time, alpha_acids, batch_size, original_gravity, final_volume, height)) / 3);
          ibus.pop();
          ibus.pop();
          ibus.pop();
          ibus.push(result);
          return Math.round(result * 100) / 100;
        } else {
          result = ((this.rager(hop_grams,  time, alpha_acids, batch_size, original_gravity) + this.tinseth(hop_grams,  time, alpha_acids, batch_size, original_gravity)) / 2);
          ibus.pop();
          ibus.pop();
          ibus.push(result);
          return Math.round(result * 100) / 100;
        }
      }
    },

    /**
     * @return {number} return the sum of all hop additions.
     */

    ibu: function() {
      var sum = 0;
      for(i = 0; i < ibus.length; i++) {
        sum += ibus[i];
      }
      return Math.round(sum * 100) / 100;
    }

  };
})();
