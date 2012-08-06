var assert = require('assert')
// var sinon = require('sinon')
var fixtures = require('./fixtures')
var Rerouter = require('../index')

describe('Reroute', function() {

  describe('initialization', function() {

    it('should exist', function(done) {
      assert(!!Rerouter)
      done()
    })

    it('should create a new instance of Reroute', function(done) {
      var rr = new Rerouter()
      assert(rr instanceof Rerouter)
      assert(rr.constructor === Rerouter)
      done()
    })

    it('should self instantiate with `new` keyword', function(done) {
      var rr = Rerouter()
      assert(rr instanceof Rerouter)
      assert(rr.constructor === Rerouter)
      done()
    })

  })

  describe('addResource', function() {

    it('should have `addResource` method', function(done) {
      var rr = new Rerouter()
      assert(rr.addResource)
      done()
    })

    it('should register the name and controller', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)

      assert.equal(rr.reroutes['foo'].controller, fc)
      done()
    })

    it('should return a resource registration', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      var foo = rr.addResource('foo', fc)

      assert(foo)
      assert.equal(foo.controller, fc)
      assert.equal(foo.name, 'foo')
      done()
    })

    it('should throw on name conflict', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      function add() {
        rr.addResource('foo', fc)
      }

      assert.throws(add, Error)
      done()
    })

  })

  describe('match', function() {

    it('should have `match` method', function(done) {
      var rr = new Rerouter()
      assert(rr.match)
      done()
    })

    it('should match GET `/:controller` to `index`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo')

      assert.equal(match.fn, fc.index)
      assert.equal(match.params.action, 'index')
      done()
    })

    it('should match GET `/:controller/new` to `new`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo/new')

      assert.equal(match.fn, fc.new)
      assert.equal(match.params.action, 'new')
      done()
    })

    it('should match POST `/:controller` to `create`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo', 'POST')

      assert.equal(match.fn, fc.create)
      assert.equal(match.params.action, 'create')
      done()
    })

    it('should match GET `/:controller/:id` to `show`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo/123', 'GET')

      assert.equal(match.fn, fc.show)
      assert.equal(match.params.action, 'show')
      done()
    })

    it('should match GET `/:controller/:id/edit` to `edit`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo/123/edit', 'GET')

      assert.equal(match.fn, fc.edit)
      assert.equal(match.params.action, 'edit')
      done()
    })

    it('should match PUT `/:controller/:id` to `update`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo/123', 'PUT')

      assert.equal(match.fn, fc.update)
      assert.equal(match.params.action, 'update')
      done()
    })

    it('should match DELETE `/:controller/:id` to `destroy`', function(done) {
      var rr = Rerouter()
      var fc = fixtures.fullController

      rr.addResource('foo', fc)
      var match = rr.match('/foo/123', 'DELETE')

      assert.equal(match.fn, fc.destroy)
      assert.equal(match.params.action, 'destroy')
      done()
    })

  })

  describe('nested resources', function() {

    it('should have `add` method', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController

      var foo = rr.addResource('foo', fc)
      assert(foo.add)
      done()
    })

    it('should throw when adding non-resource', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController

      var foo = rr.addResource('foo', fc)
      function add() { foo.add({}) }
      assert.throws(add, Error)
      done()
    })

    it('should properly add child resource', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController

      var foo = rr.addResource('foo', fc)
      var bar = rr.addResource('bar', fc)
      foo.add(bar)
      assert.equal(foo.children.bar, bar)
      done()
    })

    it('should route to child resource root', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController
      var bc = { index:fixtures.noop() }

      var foo = rr.addResource('foo', fc)
      var bar = rr.addResource('bar', bc)
      foo.add(bar)

      var match = rr.match('/foo/bar', 'GET')

      assert.equal(match.fn, bc.index)
      done()
    })

    it('should route to child resource id', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController
      var bc = { show:fixtures.noop() }

      var foo = rr.addResource('foo', fc)
      var bar = rr.addResource('bar', bc)
      foo.add(bar)

      var match = rr.match('/foo/bar/1234', 'GET')

      assert.equal(match.fn, bc.show)
      done()
    })

    it('should route to child resource id/action', function(done) {
      var rr = new Rerouter()
      var fc = fixtures.fullController
      var bc = { edit:fixtures.noop() }

      var foo = rr.addResource('foo', fc)
      var bar = rr.addResource('bar', bc)
      foo.add(bar)

      var match = rr.match('/foo/bar/1234/edit', 'GET')

      assert.equal(match.fn, bc.edit)
      done()
    })

  })

})