var _util = 0;
var _adjustment = 0;
/**
 * Calculate bitterness variables of a given recipe
 *
 * @param {number} hop_grams
 * @param {number} time
 * @param {number} alpha_acids
 * @param {number} batch_size
 * @param {number} original_gravity
 * @param {number} adjustment
 *
 **/
var Bitterness = module.exports = function Bitterness(hop_grams, time, alpha_acids, batch_size, original_gravity, adjustment) {
  this._hop_grams = hop_grams;
  this._time = time,
  this._alpha_acids = alpha_acids;
  this._batch_size = batch_size;
  this._original_gravity = original_gravity;
  this._util = 18.11 + 13.86 * Math.tanh((this._time - 31.32) / 18.27);
  this._adjustment = adjustment;
  this._adjustment = 0;
};
/**
 *
 * Calculate bitterness in IBU using Rager formula
 * @return {number}
 *
 **/
Bitterness.prototype.rager = function() {
  var result = 0;
  result = (this._hop_grams * this._util * this._alpha_acids * 10) /
            (this._batch_size * (1 + this._adjustment));
  return result;
};
/**
 *
 * Calculate bitterness IBU using Tinseth formula
 * @return {number}
 *
 **/
Bitterness.prototype.tinseth = function() {
  var result = 0,
      mg_alpha = 0,
      b_factor = 0,
      bt_factor = 0;
  mg_alpha = this.mgAlphaAcids();
  b_factor = this.boilingFactor();
  bt_factor = this.boilingTimeFactor();
  result = mg_alpha * b_factor * bt_factor;
  return result;
};
/**
 *
 * Calculate mg alpha acids ratio, required by Tinseth formula
 * @return {number}
 *
 **/
Bitterness.prototype.mgAlphaAcids = function() {
  this._adjustment = 0;
  this._util = 1;
  return this.rager();
};
/**
 *
 * Calculate boiling factor, required by Tinseth formula
 * @return {number}
 *
 **/
Bitterness.prototype.boilingFactor = function() {
  var result = 0;
  result = 1.65 * Math.E(((this._original_gravity * 0.001) - 1.0) / 0.111);
  return result;
};
/**
 *
 * Calculate boiling time factor, required by Tinseth formula
 * @return {number}
 *
 **/
Bitterness.prototype.boilingTimeFactor() {
  var result = 0;
  result = (1 - Math.E(-0.04 * this._time)) / 4.15;
  return result;
};
