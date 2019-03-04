"use strict"

const assert = require("assert")
// const doc = require("crocodile").doc
const doc = x => x()
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

    describe("#doM", function() {
      it("should perform a generator of tasks in order", function() {
        Task.doM(function*() {
          const a = yield Task.of("foo")
          const b = yield Task.of("bar")

          return Task.of(a + b)
        }).fork(nop, effect)

        assert.strictEqual(r, "foobar")
      })
    })

    describe("#foldM", function() {
      it("should fold using a bindable function", function(done) {
        Task.foldM((acc, item) => Task((err, res) => {
          res(acc + item)
        }), 0)([1,2,3,4,5]).fork(done.fail, res => {
          assert.strictEqual(res, 15)
          done()
        })
      })

      it("should be cancelable", function(done) {
        const cancel = Task.foldM((acc, item) => Task((err, res) => {
          res(acc + item)
        }), 0)([1,2,3,4,5]).fork(err => {
          assert.strictEqual(err, "foobar")
          done()
        }, done.fail)

        cancel("foobar") // foldM calls asynchronously, which is why this should work
      })
      
      it("should be cancelable (nested)", function (done) {

        const toComplete = ['a', 'b', 'c']
        const completed = []

        const cancel = Task.foldM(
          (acc, item) =>
            Task((_, res) => {
              acc.push(item)
              return res(acc)
            })
              .bind(x => Task.foldM((agg, i) => Task((_, complete) => {
                completed.push(i)
                agg.push(i)
                return complete(agg)

              }), x)(toComplete))
          , [])([1]).fork(err => {
            assert.deepEqual(completed, ['a'])
            assert.notDeepEqual(completed, ['a', 'b', 'c'])
            assert.strictEqual(err, "foobar")
            done()
          }, done.fail)

        cancel("foobar")
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
