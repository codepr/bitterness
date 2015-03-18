/**
 * Bitterness
 * https://github.com/codepr/bitterness
 *
 * Copyright (c) 2014 Andrea Baldan
 * Licensed under the MIT license.
 **/

/**
 * Calculate bitterness variables of a given recipe
 *
 * @param {number} hop_grams
 * @param {number} time
 * @param {number} alpha_acids
 * @param {number} batch_size
 * @param {number} original_gravity
 *
 **/
var bitterness = module.exports = function bitterness(hop_grams, time, alpha_acids, batch_size, original_gravity) {
  this._hop_grams = hop_grams;
  this._time = time,
  this._alpha_acids = alpha_acids;
  this._batch_size = batch_size;
  this._original_gravity = original_gravity;

  function tanh (arg) {
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
  }

  this._util = 18.11 + 13.86 * tanh((this._time - 31.32) / 18.27);
  if(original_gravity > 1050) this._adjustment = (original_gravity - 1050) / 2;
  else this._adjustment = 0;
  this._adjustment = 0;
};
/**
 *
 * Calculate bitterness in IBU using Rager formula
 * @return {number}
 *
 **/
bitterness.prototype.rager = function() {
  var result = 0;
  result = (this._hop_grams * this._util * this._alpha_acids * 10) /
            (this._batch_size * (1 + this._adjustment));
  return Math.round(result / 100);
};
/**
 *
 * Calculate bitterness IBU using Tinseth formula, MGA * BF * BTF
 * @return {number}
 *
 **/
bitterness.prototype.tinseth = function() {
  var result = 0,
      mg_alpha = 0,
      b_factor = 0,
      bt_factor = 0,
      hg = this._hop_grams,
      aa = this._alpha_acids,
      bs = this._batch_size,
      og = this._original_gravity,
      tm = this._time;

  function mgAlphaAcids() {
    return ((hg * aa * 10) / (bs));
  }

  function boilingFactor() {
    return (1.65 * (Math.exp(((og * 0.001) - 1.0) / 0.111)));
  }

  function boilingTimeFactor() {
    return (1 - Math.exp(-0.04 * tm)) / 4.15;
  }

  mg_alpha = mgAlphaAcids();
  b_factor = boilingFactor();
  bt_factor = boilingTimeFactor();
  result = b_factor * bt_factor * mg_alpha;
  return Math.round(result);
};
/**
 *
 * Calculate average bitterness IBU using Tinseth formula mixed with Rager one.
 * @return {number}
 *
 **/
bitterness.prototype.average = function() {
  return ((this.rager() + this.tinseth()) / 2);
};
