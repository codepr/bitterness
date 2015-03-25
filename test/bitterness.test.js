var should = require('chai').should(),
    bitterness = require('../index.js');

describe('#1 w: 93 grams, t: 90 mins, aa: 6%, b: 25 lit, og: 1050', function() {

    it('Rager ibu calculation: 71.26', function() {
        bitterness.rager(93, 90, 6, 25, 1050).should.equal(71.26);
    });

    it('Tinseth ibu calculation: 61.19', function() {
        bitterness.tinseth(93, 90, 6, 25, 1050).should.equal(61.19);
    });

    it('Garetz ibu calculation: 64.37', function() {
        bitterness.garetz(93, 90, 6, 25, 1050, 23, 0).should.equal(64.37);
    });

    it('Average ibu calculation: 66.18', function() {
        bitterness.average(93, 90, 6, 25, 1050).should.equal(66.18);
    });

    it('Average + Garetz ibu calculation: 65.61', function() {
        bitterness.average(93, 90, 6, 25, 1050, 23, 0).should.equal(65.61);
    });

    it('Rager current addition: 71.26', function() {
        bitterness.rager().should.equal(71.26);
    });
});

describe('#2 w: 70 grams, t: 80 mins, aa: 8.5%, b: 35 lit, og: 1057', function() {

    it('Rager ibu calculation: 53.93', function() {
        bitterness.rager(70, 80, 8.5, 35, 1057).should.equal(53.93);
    });

    it('Tinseth ibu calculation: 43.16', function() {
        bitterness.tinseth(70, 80, 8.5, 35, 1057).should.equal(43.16);
    });

    it('Garetz ibu calculation: 49.84', function() {
        bitterness.garetz(70, 80, 8.5, 35, 1057, 32, 0).should.equal(49.84);
    });

    it('Parametrized average ibu calculation: 49.30', function() {
        bitterness.average(70, 80, 8.5, 35, 1057).should.equal(49.30);
    });

    it('Parametrized average ibu calculation: 48.98', function() {
        bitterness.average(70, 80, 8.5, 35, 1057, 32).should.equal(48.98);
    });

    it('Sum of all additions: 573.82', function() {
        bitterness.ibu().should.equal(573.82);
    });
});

describe('#3  w: 3.17 oz, t: 90 mins, aa: 6%, b: 6.6 gal, og: 1050', function() {
    it('Rager with imperial measure: 68.91', function() {
        bitterness.metric(false);
        bitterness.rager(3.17, 90, 6, 6.60, 1050).should.equal(68.91);
    });

    it('Cache / Tinseth with imperial measure: 59.18', function() {
        bitterness.tinseth().should.equal(59.18);
    });

    it('Cache / Garetz with imperial measure: 64.24', function() {
        bitterness.garetz().should.equal(64.24);
    });

    it('Cache / Average ibu calculation with imperial measure: 64.11', function() {
        bitterness.average().should.equal(64.11);
    });

    it('Cache / parametrized average ibu calculation with imperial measure: 48.98', function() {
        bitterness.average(3.17, 90, 6, 6.60, 1050, 5.93).should.equal(64.15);
    });

    it('Clean history', function() {
        bitterness.clean();
        bitterness.ibu().should.equal(0);
    });

    it('Update data', function() {
        bitterness.set({original_gravity:1063,
                        batch_size: 60,
                        hop_weight: 56,
                        alpha_acids:12,
                        time: 70});
        bitterness.rager().should.equal(68.91);
    });

});
