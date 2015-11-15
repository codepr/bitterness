/**
 * Bitterness
 * https://github.com/codepr/bitterness
 *
 * Copyright (c) 2014 Andrea Baldan
 * Licensed under the MIT license.
 **/

'use strict'

var bitterness = module.exports = (function() {

	var DECIMAL_METRIC_FACTOR = 7490;
	var IMPERIAL_METRIC_FACTOR = 74.90;
	// constants derived from respective methods
	// Rager constants
	var STANDARD_BASE_OG = 1050;
	var RAGER_BOIL_TIME_ADJUSTMENT = 31.32;
	// Tinseth constants
	// accordingly to Glenn Tinseth, the numbers 0.000125 and 1.65 are
	// empirically derived to fit his data.
	// The number 0.04 controls the shape of the utils vs time curve, finally
	// 4.15 controls the max util value, should be adjusted based on personal
	// util value.
	var TINSETH_BIGNESS_GRAVITY_BASE = 0.000125;
	var TINSETH_BIGNESS_MULTIPLIER = 1.65;
	var TINSETH_CURVE_SHAPE = -0.04;
	var TINSETH_MAX_UTILIZATION = 4.15;
	// Garetz constants
	var GARETZ_HEIGHT_METERS = 168;
	var GARETZ_HEIGHT_FEETS = 550;

	var isMetric = true;

	//Tanh functions for full compatibility, apparently node before 0.11 doesn't
	//support Math.tanh
	//
	var tanh = function(arg) {
		return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
	}

	// alpha acids utilization vs time, according to Rager can be reduced to this
	// equation

	var util = function(time) {
		return 18.11 + 13.86 * tanh((time - RAGER_BOIL_TIME_ADJUSTMENT) / 18.27);
	}

	// Garetz formula for utilization take in account yeast flocculation, these
	// ranges represent average flocculation

	var garetzUtil = function(time) {
		if (time < 11) {
			return 0;
		} else if (time > 10 && time < 16) {
			return 2;
		} else if (time > 15 && time < 21) {
			return 5;
		} else if (time > 20 && time < 26) {
			return 8;
		} else if (time > 25 && time < 31) {
			return 11;
		} else if (time > 30 && time < 36) {
			return 14;
		} else if (time > 35 && time < 41) {
			return 16;
		} else if (time > 40 && time < 46) {
			return 18;
		} else if (time > 45 && time < 51) {
			return 19;
		} else if (time > 50 && time < 61) {
			return 20;
		} else if (time > 60 && time < 71) {
			return 21;
		} else if (time > 70 && time < 81) {
			return 22;
		} else {
			return 23;
		}
	}

	// according to Rager, if the gravity of the boil exceeds 1050 there is a
	// gravity adjustment to factor in

	var adjustment = function(originalGravity) {
		if(originalGravity > STANDARD_BASE_OG) {
			return ((originalGravity - STANDARD_BASE_OG) / 2) * 0.001;
		}
		else return 0;
	}

	// mg/l of added alpha acids needed in the formula IBUs = decimal util * mg/l

	var mgAlphaAcids = function(hopGrams, alphaAcids, batchSize, metric) {
		var factor = 1000;
		if(metric == false) factor = DECIMAL_METRIC_FACTOR;
		return ((hopGrams * (alphaAcids * 0.01) * factor) / (batchSize - (batchSize * 0.1)));
	}

	// empirically retrieved factors used to calculate decimal util
	// bigness factor..

	var bignessFactor = function(originalGravity) {
		return (TINSETH_BIGNESS_MULTIPLIER *
				Math.pow(TINSETH_BIGNESS_GRAVITY_BASE, ((originalGravity * 0.001) - 1)));
	}

	// ..and boiling time factor

	var boilingTimeFactor = function(time) {
		return (1 - Math.exp(TINSETH_CURVE_SHAPE * time)) / TINSETH_MAX_UTILIZATION;
	}

	// Garetz method expect some factors to be combined together
	// based on height and temperature..

	var temperatureFactor = function(height) {
		var heightFactor = GARETZ_HEIGHT_METERS;
		if(isMetric == false) heightFactor = GARETZ_HEIGHT_FEETS;
		return ((height / heightFactor) * 0.02) + 1;
	}

	// .. and gravity based on different state of volume

	var gravityFactor = function(finalVolume, currentVolume, originalGravity) {
		var boilGravity = ((finalVolume / currentVolume) * ((originalGravity * 0.001) - 1)) + 1;
		return (5 * (boilGravity - 0.85));
	}

	return {

		/**
		 * Calculate bitterness of a given recipe in IBU using Rager formula.
		 *
		 * @param {number} hopWeight hop weight in grams / oz according to metric
		 * system
		 * @param {number} time time in minutes
		 * @param {number} alphaAcids alpha acids in % form (e.g. 6% => 6)
		 * @param {number} batchSize batch size in liters / gal according to metric
		 * system
		 * @param {number} originalGravity original gravity (xxxx.xx format e.g.
		 * 1050.00)
		 * @return {number} Number of IBU according to Rager formula
		 **/

		rager: function(hopWeight, time, alphaAcids, batchSize, originalGravity) {
			var _this = this;
			var result = 0;
			var factor = 10;
			if(_this.isMetric == false) factor = IMPERIAL_METRIC_FACTOR;
			result = (hopWeight * util(time) * alphaAcids * factor) /
				(batchSize * (1 + adjustment(originalGravity)));
			result = result / 100;
			return Math.round(result * 100) / 100;
		},

		/**
		 * Calculate bitterness of a given recipe in IBU using Tinseth formula.
		 *
		 * @param {number} hopWeight hop weight in grams / oz according to metric
		 * system
		 * @param {number} time time in minutes
		 * @param {number} alphaAcids alpha acids in % form (e.g. 6% => 6)
		 * @param {number} batchSize batch size in liters / gal according to metric
		 * system
		 * @param {number} originalGravity original gravity (xxxx.xx format e.g.
		 * 1050.00)
		 * @return {number} Number of IBU according to Tinseth formula
		 **/

		tinseth: function(hopWeight, time, alphaAcids, batchSize, originalGravity) {
			var _this = this;
			var result = 0;
			var mg_alpha = mgAlphaAcids(hopWeight, alphaAcids, batchSize, _this.isMetric);
			var b_factor = bignessFactor(originalGravity);
			var bt_factor = boilingTimeFactor(time);
			result = b_factor * bt_factor * mg_alpha;
			return Math.round(result * 100) / 100;
		},

		/**
		 * Calculate bitterness of a given recipe in IBU using Garetz formula.
		 *
		 * @param {number} hopWeight hop weight in grams / oz according to metric
		 * system
		 * @param {number} time time in minutes
		 * @param {number} alphaAcids alpha acids in % form (e.g. 6% => 6)
		 * @param {number} batchSize batch size in liters / gal according to metric
		 * system
		 * @param {number} originalGravity original gravity (xxxx.xx format e.g.
		 * 1050.00)
		 * @param {number} finalVolume final volume in liters / gal according to
		 * metric system
		 * @param {number} height height of the boiling batch in meters / feets
		 * according to metric system
		 * @return {number} Number of IBU according to Garetz formula
		 **/

		garetz: function(hopWeight, time, alphaAcids, batchSize, originalGravity, finalVolume, height) {
			var _this = this;
			var result = 0;
			var factor = 1;
			var _finalVolume = finalVolume || (batchSize - (batchSize * 0.1));
			var _height = height || 0;
			var gf = gravityFactor(_finalVolume, batchSize, originalGravity);
			var tf = temperatureFactor(_height);
			if(_this.isMetric == false) factor = 7.490;
			var fr = (garetzUtil(time) * alphaAcids * hopWeight * factor) /
				(650 * batchSize * gf * tf);
			result = (130 * (-1 + (Math.sqrt(1 + fr))) / (_finalVolume / batchSize));
			return Math.round(result * 100) / 100;
		},

		/**
		 * Set preferred measure unit system (default is true, e.g. European)
		 * @param {boolean} metric true or false
		 */

			setMetricSystem: function(metric) {
				if(typeof(metric)== 'boolean') this.isMetric = metric;
			}
	};
})();
