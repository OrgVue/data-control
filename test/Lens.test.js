"use strict"

const assert = require('assert')
const doc = require('crocodile').doc 
const Lens = require('../src/Lens.js')

const compose = g => f => x => g(f(x))

const obj = {
  name: "Piet",
  address: {
    street: "5th Avenue",
    zip: "bh 90210"
  }
}

var lens = compose(Lens.ofProp("address"))(Lens.ofProp("street"))

doc(function() {
  describe("Lens", function() {
    describe("#Id", function() {
      it("should be the top level lens", function() {
        const obj = {
          name: "Andy Z."
        }

        assert.deepStrictEqual(Lens.view(Lens.Id)(obj), { name: "Andy Z." })
        assert.deepStrictEqual(Lens.over(Lens.Id)(x => {
          x.name = "Andy"

          return x
        })(obj), { name: "Andy" })
      })
    })

    describe("#over", function() {
      it("should reach inside an object and update", function() {
        assert.deepStrictEqual(Lens.over(lens)(x => x.toUpperCase())(obj), {
          name: "Piet",
          address: {
            street: "5TH AVENUE",
            zip: "bh 90210"
          }
        })
      })
    })

    describe("#set", function() {
      it("should set a value inside an object", function() {
        assert.deepStrictEqual(Lens.set(lens)("Unknown Street")(obj), {
          name: "Piet",
          address: {
            street: "Unknown Street",
            zip: "bh 90210"
          }
        })
      })
    })

    describe("#view", function() {
      it("should read from inside an object", function() {
        assert.strictEqual("5th Avenue", Lens.view(lens)(obj))
      })
    })
  })
})
