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

// Exports.
module.exports = mixin({
  doM,
  of,
  sequence
})(Task)
