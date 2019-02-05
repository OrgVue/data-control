// Task
// A Monad for asynchronous operations that potentially have side effects.

"use strict"

// Imports.
const mixin = require("./mixin.js")

// data Task e a = Task ((e -> ()) -> (a -> ()) -> ())
// ${doc.Task.Task}
function Task(fork) {
  if (!(this instanceof Task)) return new Task(fork)

  this.fork = fork
}

// bind :: (a -> Task e b) -> Task e a -> Task e b
// ${doc.Task.bind}
Task.prototype.bind = function(f) {
  const m = this

  return Task((rej, res) => m.fork(rej, x => f(x).fork(rej, res)))
}

// map :: (a -> b) -> Task e a -> Task e b
Task.prototype.map = function(f) {
  const m = this

  return Task((rej, res) => m.fork(rej, x => res(f(x))))
}

// of :: a -> Task e a
// ${doc.Task.of}
const of = x => Task((_, res) => res(x))

// sequence :: [Task e a] -> Task e [a]
const sequence = ms =>
  ms.reduce((r, m) => r.bind(t => m.map(x => t.concat([x]))), Task.of([]))

const doM = steps => Task((err, res) => {
  const gen = steps()
  const step = value => {
    const result = gen.next(value)
    if (result.done) {
      return result.value
    }

    return result.value.bind(step)
  }

  step().fork(err, res)
})

// foldM :: (a -> b -> Task e a) -> a -> [b] -> Task e a
const foldM = (f, init) => (ms) =>
  Task((rej, res) => {
    let cancelled = undefined
    let result = init
    const _ = (i) => {
      if (i >= ms.length) {
        res(result)
      } else if (cancelled === undefined) {
        f(result, ms[i]).fork(rej, (x) => {
          result = x
          setTimeout(_, 21, i + 1)
        })
      } else {
        rej(cancelled)
      }
    }

    _(0)

    return (reason) => {
      cancelled = reason
    }
  })

// Exports.
module.exports = mixin({
  doM,
  foldM,
  of,
  sequence
})(Task)
