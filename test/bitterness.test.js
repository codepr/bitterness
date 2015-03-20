var should = require('chai').should(),
    bitterness = require('../index.js');

describe('Test #1', function() {

    it('Rager ibu calculation: 71.26', function() {
        bitterness.rager(93, 90, 6, 25, 1050).should.equal(71.26);
    });

    it('Tinseth ibu calculation: 61.19', function() {
        bitterness.tinseth(93, 90, 6, 25, 1050).should.equal(61.19);
    });

    it('Garetz ibu calculation: 64.37', function() {
        bitterness.garetz(93, 90, 6, 25, 1050, 23, 0).should.equal(64.37);
    });

    it('Average ibu calculation: 66.22', function() {
        bitterness.average(93, 90, 6, 25, 1050).should.equal(66.22);
    });

    it('Average + Garetz ibu calculation: 65.61', function() {
        bitterness.average(93, 90, 6, 25, 1050, 23, 0).should.equal(65.61);
    });

    it('Rager current addition: 71.26', function() {
        bitterness.rager().should.equal(71.26);
    });
});

describe('Test #2', function() {

    it('Rager ibu calculation: 53.93', function() {
        bitterness.rager(70, 80, 8.5, 35, 1057).should.equal(53.93);
    });

    it('Tinseth ibu calculation: 43.16', function() {
        bitterness.tinseth(70, 80, 8.5, 35, 1057).should.equal(43.16);
    });

    it('Garetz ibu calculation: 49.84', function() {
        bitterness.garetz(70, 80, 8.5, 35, 1057, 32, 0).should.equal(49.84);
    });

    it('Average ibu calculation: 48.55', function() {
        bitterness.average(70, 80, 8.5, 35, 1057).should.equal(48.55);
    });

    it('Average + Garetz ibu calculation: 48.98', function() {
        bitterness.average(70, 80, 8.5, 35, 1057, 32).should.equal(48.98);
    });
});

describe('Test #3', function() {

    it('Sum of all additions: 573.11', function() {
        bitterness.ibu().should.equal(573.11);
    });

    it('Switch to imperial system', function() {
        bitterness.metric(false);
        bitterness.rager(3.17, 90, 6, 6.60, 1050).should.equal(68.91);
    });
});
