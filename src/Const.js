// Const
// The Const Functor (not a Monad!)

"use strict"

const mixin = require("./mixin.js")

// data Const a b = Const a
function Const(x) {
  if (!(this instanceof Const)) return new Const(x)

  this.x = x
}

// map :: (a -> b) -> Const a b -> Const a b
Const.prototype.map = function(f) {
  return this
}

// of :: a -> Const a b
const of = x => Const(x)

module.exports = mixin({
  of: of
})(Const)
