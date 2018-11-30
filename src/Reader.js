// Reader
// A Monad for threading configuration to many functions

"use strict"

// Imports.
const mixin = require("./mixin.js")

// data Reader e a = Reader (e -> a)
function Reader(run) {
  if (!(this instanceof Reader)) return new Reader(run)

  this.run = run
}

// bind :: (a -> Reader e b) -> Reader e a -> Reader e b
Reader.prototype.bind = function(f) {
  const m = this

  return Reader((e) => f(m.run(e)).run(e))
}

// map :: (a -> b) -> Reader e a -> Reader e b
Reader.prototype.map = function(f) {
  const m = this

  return Reader((e) => f(m.run(e)))
}

// of :: a -> Reader e a
const of = x => Reader(() => x)

// get :: Reader e e
const get = Reader((e) => e)


// Exports.
module.exports = mixin({
  of,
  get
})(Reader)
