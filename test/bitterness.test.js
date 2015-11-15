var should = require('chai').should();
var bt = require('../index.js');

describe('Bitterness calculations according to European metric system:\n', function() {

	describe('# w: 93 grams, t: 90 mins, aa: 6%, b: 25 lit, og: 1050', function() {

		it('Rager: 71.26', function() {
			bt.rager(93, 90, 6, 25, 1050).should.equal(71.26);
		});

		it('Tinseth: 61.19', function() {
			bt.tinseth(93, 90, 6, 25, 1050).should.equal(61.19);
		});

		it('Garetz: 48.59', function() {
			bt.garetz(93, 90, 6, 25, 1050, 23, 0).should.equal(48.59);
		});

	});

	describe('# w: 70 grams, t: 80 mins, aa: 8.5%, b: 35 lit, og: 1057', function() {

		it('Rager: 53.93', function() {
			bt.rager(70, 80, 8.5, 35, 1057).should.equal(53.93);
		});

		it('Tinseth: 43.16', function() {
			bt.tinseth(70, 80, 8.5, 35, 1057).should.equal(43.16);
		});

		it('Garetz: 35.94', function() {
			bt.garetz(70, 80, 8.5, 35, 1057, 32, 0).should.equal(35.94);
		});
	});
});

describe('Bitterness calculations according to Imperial metric system:\n', function() {
	describe('# w: 3.17 oz, t: 90 mins, aa: 6%, b: 6.6 gal, og: 1050', function() {

		it('Rager: 68.91', function() {
			bt.setMetricSystem(false);
			bt.rager(3.17, 90, 6, 6.60, 1050).should.equal(68.91);
		});

		it('Tinseth: 59.18', function() {
			bt.tinseth(3.17, 90, 6, 6.60, 1050).should.equal(59.18);
		});

		it('Garetz: 48.45', function() {
			bt.garetz(3.17, 90, 6, 6.60, 1050).should.equal(48.45);
		});
	});

	describe('# w: 3.17 oz, t: 90 mins, aa: 6%, b: 6.6 gal, og: 1050, fb: 5.94, height: 6 feets', function() {

		it('Rager: 68.91', function() {
			bt.rager(3.17, 90, 6, 6.60, 1050).should.equal(68.91);
		});

		it('Tinseth: 59.18', function() {
			bt.tinseth(3.17, 90, 6, 6.60, 1050).should.equal(59.18);
		});

		it('Garetz: 48.42', function() {
			bt.garetz(3.17, 90, 6, 6.60, 1050, 5.94, 6).should.equal(48.42);
		});
	});
});
