"use strict"

var assert = require("assert")
//var doc = require("crocodile").doc
const doc = x => x
var IO = require("../src/IO.js")

doc(function() {
  describe("IO", function() {
    describe("#bind", function() {
      it("should bind IO values", function() {
        var m = IO.of("hello").bind(x => IO.of(x.toUpperCase()))

        assert.strictEqual(m.unsafe(), "HELLO")
      })
    })

    describe("#map", function() {
      it("should map IO values", function() {
        var m = IO.of("hello").map(x => x.toUpperCase())

        assert.strictEqual(m.unsafe(), "HELLO")
      })
    })

    describe("#of", function() {
      it("should return the IO of a value", function() {
        assert.strictEqual(IO.of("hello").unsafe(), "hello")
      })
    })
  })
})()
