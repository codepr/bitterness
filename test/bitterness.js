var should = require('chai').should(),
    bitterness = require('../index.js'),
    rager = bitterness.rager,
    tinseth = bitterness.tinseth;

var hop_grams = 93,
    alpha_acids = 6,
    time = 90,
    original_gravity = 1050,
    batch_size = 25;

bitterness_1 = new bitterness(hop_grams, time, alpha_acids, batch_size, original_gravity);
var bitterness_2 = new bitterness(70, 80, 8.5, 35, 1057);

describe('#rager', function() {
    it('rager ibu calculation: 71', function() {
        bitterness_1.rager().should.equal(71);
    });

    it('rager ibu calculation: 54', function() {
        bitterness_2.rager().should.equal(54);
    });
});

describe('#tinseth', function() {
    it('tinseth ibu calculation: 135', function() {
        bitterness_1.tinseth().should.equal(135);
    });

    it('tinseth ibu calculation: 108', function() {
        bitterness_2.tinseth().should.equal(108);
    });

});

describe('#average', function() {
    it('average ibu calculation: 103', function() {
        bitterness_1.average().should.equal(103);
    });

    it('average ibu calculation: 81', function() {
        bitterness_2.average().should.equal(81);
    });
});
