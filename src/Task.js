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

  return Task((rej, res, env) =>
    m.fork(rej, (x) => f(x).fork(rej, res, env), env),
  )
}

// map :: (a -> b) -> Task e a -> Task e b
Task.prototype.map = function(f) {
  const m = this

  return Task((rej, res, env) => m.fork(rej, (x) => res(f(x)), env))
}

// of :: a -> Task e a
// ${doc.Task.of}
const of = (x) => Task((_, res) => res(x))

// sequence :: [Task e a] -> Task e [a]
const sequence = (ms) =>
  ms.reduce((r, m) => r.bind((t) => m.map((x) => t.concat([x]))), Task.of([]))

const doM = (steps) =>
  Task((err, res, env) => {
    const gen = steps()
    const step = (value) => {
      const result = gen.next(value)
      if (result.done) {
        return result.value
      }

      return result.value.bind(step)
    }

    step().fork(err, res, env)
  })

// foldM :: (a -> b -> Task e a) -> a -> [b] -> Task e a
const foldM = (f, init, { delay = 21 } = {}) => (ms) =>
  Task((rej, res, mon) => {
    let cancelled = undefined
    let result = init
    const _ = (i) => {
      if (i >= ms.length) {
        res(result)
      } else if (cancelled === undefined) {
        f(result, ms[i]).fork(
          rej,
          (x) => {
            result = x
            setTimeout(_, delay, i + 1)
          },
          mon,
        )
      } else {
        rej(cancelled)
      }
    }

    _(0)

    return (reason) => {
      cancelled = reason
    }
  })

const toPromise = (task) => new Promise((res, rej) => task.fork(rej, res))

const fromPromise = (promise) => Task((rej, res) => promise.then(res, rej))

// Exports.
module.exports = mixin({
  doM,
  foldM,
  fromPromise,
  of,
  sequence,
  toPromise,
})(Task)
