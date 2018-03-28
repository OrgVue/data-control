"use strict"

const assert = require("assert")
const doc = require("crocodile").doc
const Task = require("../src/Task.js")

var r

doc(function() {
  describe("Task", function() {
    // describe('#ap', function() {
    //   it('should apply one functor to another', function() {
    //     Task.of(upper).ap(Task.of('beep')).fork(nop, effect);

    //     assert.strictEqual(r, 'BEEP');
    //   });
    // });

    describe("#bind", function() {
      it("should bind a function", function() {
        Task.of("hello")
          .bind(compose(Task.of, upper))
          .fork(nop, effect)

        assert.strictEqual(r, "HELLO")
      })
    })

    describe("#map", function() {
      it("should lift a function into functor space", function() {
        Task.of("foo")
          .map(upper)
          .fork(nop, effect)

        assert.strictEqual(r, "FOO")
      })
    })

    describe("#of", function() {
      it("should put a value inside a Task", function() {
        Task.of("hello world").fork(nop, effect)

        assert.strictEqual(r, "hello world")
      })
    })

    describe("#sequence", function() {
      it("should turn a list of tasks into a task of lists", function() {
        const ts = [Task.of(2), Task.of(3), Task.of(5)]
        Task.sequence(ts).fork(nop, effect)

        assert.deepStrictEqual(r, [2, 3, 5])
      })
    })

    describe("#Task", function() {
      it("should construct a new task", function() {
        Task((rej, res) => rej("Error"))
          .map(upper)
          .fork(effect, nop)

        assert.strictEqual(r, "Error")
      })
    })
  })
})

function nop() {}

function compose(f, g) {
  return function(x) {
    return f(g(x))
  }
}

function effect(t) {
  r = t
}

function upper(b) {
  return b.toUpperCase()
}
