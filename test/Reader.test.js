"use strict"

const assert = require("assert")
const Reader = require("../src/Reader.js")

describe("Reader", function() {
  describe("#run", function() {
    it("should run its contained function with an environment", function() {
      let res

      res = Reader.of("val").run("env")
      assert.strictEqual(res, "val")

      res = Reader(upper).run("env")
      assert.strictEqual(res, "ENV")
    })
  })

  describe("#bind", function() {
    it("should bind a function", function() {
      let res

      res = Reader.of("val")
      assert.strictEqual(res.run("env"), "val")

      res = res.bind(e => Reader(concat(e)))
      assert.strictEqual(res.run("foo"), "valfoo")

      res = res.bind(e => Reader(concat(e)))
      assert.strictEqual(res.run("bar"), "valbarbar")
    })
  })

  describe("#map", function() {
    it("should lift a function into functor space", function() {
      const res = Reader.of("foo")
        .map(upper)
        .run("anything")

      assert.strictEqual(res, "FOO")
    })
  })

  describe("#of", function() {
    it("should put a value inside a Reader", function() {
      const res = Reader.of("hello world").run("anything")

      assert.strictEqual(res, "hello world")
    })
  })

  describe("#Reader", function() {
    it("should construct a new reader", function() {
      const res = Reader(e => concat(e)("fix"))
        .map(upper)
        .run("pre")

      assert.strictEqual(res, "PREFIX")
    })
  })
})


function upper(b) {
  return b.toUpperCase()
}

function concat(a) {
  return function(b) {
    return a + b
  }
}