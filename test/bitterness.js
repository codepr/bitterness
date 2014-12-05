var should = require('chai').should(),
    bitterness = require('../index.js'),
    rager = bitterness.rager,
    tinseth = bitterness.tinseth;

var hop_grams = 93,
    alpha_acids = 6,
    time = 90,
    original_gravity = 1050,
    batch_size = 25;

bitterness = new bitterness(hop_grams, time, alpha_acids, batch_size, original_gravity);

describe('#rager', function() {
  it('calculate ibu', function() {
    bitterness.rager().should.equal(71);
  });
});
