'use strict';

var fs = require('fs');
var assert = require('chai').assert;

var tv4 = require('tv4');
var schemaFile = './vega-embed-schema.json';
var schema = JSON.parse(fs.readFileSync(schemaFile));
var res = './test/resources/';

function error_msg(desc, e) {
  return desc + ': ' + JSON.stringify(e, function(key, value) {
    return key === 'stack' ? undefined : value;
  }, 2);
}

describe('schema', function() {

  it('should validate airports spec', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-airports.json'));
    var v = tv4.validate(spec, schema);
    assert.ok(v, error_msg('Airports', tv4.error));
  });

  it('should validate force spec', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-force.json'));
    var v = tv4.validate(spec, schema);
    assert.ok(v, error_msg('Force', tv4.error));
  });

  it('should validate jobs spec', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    var v = tv4.validate(spec, schema);
    assert.ok(v, error_msg('Jobs', tv4.error));
  });

  it('should validate world spec', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    var v = tv4.validate(spec, schema);
    assert.ok(v, error_msg('World', tv4.error));
  });

  it('should invalidate mising vega chart ref', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    delete spec.url;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate ill-formed url', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    spec.url = 1;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate ill-formed source', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-airports.json'));
    spec.source = 1;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate ill-formed vega spec', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    spec.spec = 'foo';
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate unsupported property', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    spec.foo = 'bar';
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate extra checkbox property', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-force.json'));
    spec.parameters[4].foo = 'bar';
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate missing range min/max', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    delete spec.parameters[0].min;
    assert.notOk(tv4.validate(spec, schema));

    spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    delete spec.parameters[0].max;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate extra range property', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-world.json'));
    spec.parameters[0].foo = 'bar';
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate missing select options', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    spec.parameters[1].type = 'select';
    delete spec.parameters[1].options;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate extra select property', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    spec.parameters[1].type = 'select';
    spec.parameters[1].foo = 'bar';
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate missing radio options', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    spec.parameters[1].type = 'radio';
    delete spec.parameters[1].options;
    assert.notOk(tv4.validate(spec, schema));
  });

  it('should invalidate extra radio property', function() {
    var spec = JSON.parse(fs.readFileSync(res + 'embed-jobs.json'));
    spec.parameters[1].type = 'radio';
    spec.parameters[1].foo = 'bar';
    assert.notOk(tv4.validate(spec, schema));
  });

});