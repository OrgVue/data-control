// IO
// A Monad for synchronous operations with side effects.

"use strict"

// Imports.
const mixin = require("./mixin.js")

// data IO a = IO (() -> a)
function IO(unsafe) {
  if (!(this instanceof IO)) return new IO(unsafe)
  
  this.unsafe = unsafe
}

// bind :: (a -> IO b) -> IO a -> IO b
// ${doc.IO.bind}
IO.prototype.bind = function(f) {
  const m = this

  return IO(() => f(m.unsafe()).unsafe())
}

// map :: (a -> b) -> IO a -> IO b
// ${doc.IO.map}
IO.prototype.map = function(f) {
  const m = this

  return IO(() => f(m.unsafe()))
}

// of :: a -> IO a
// ${doc.IO.of}
const of = x => IO(() => x)

// Exports.
module.exports = mixin({
  of: of
})(IO)
