// Task
// A Monad for asynchronous operations that potentially have side effects.

"use strict"

// Imports.
const mixin = require("./mixin.js")

// data Task e a = Task (e -> (), a -> ()) -> ()
// ${doc.Task.Task}
function Task(fork) {
  if (!(this instanceof Task)) return new Task(fork)
  
  this.fork = fork
}

// bind :: (a -> Task e b) -> Task e a -> Task e b
// ${doc.Task.bind}
Task.prototype.bind = function(f) {
  return Task((rej, res) => this.fork(rej, x => f(x).fork(rej, res)))
}

// map :: (a -> b) -> Task e a -> Task e b
Task.prototype.map = function(f) {
  return Task((rej, res) => this.fork(rej, x => res(f(x))))
}

// of :: a -> Task e a
// ${doc.Task.of}
const of = x => Task((_, res) => res(x))

// Exports.
module.exports = mixin({
  of: of
})(Task)
