// Identity

"use strict"

const mixin = require("./mixin.js")

// data Identity a = Identity a
function Identity(x) {
  if (!(this instanceof Identity)) return new Identity(x)

  this.x = x
}

// bind :: (a -> Identity b) -> Identity a -> Identity b
Identity.prototype.bind = function(f) {
  return f(this.x)
}

// map :: (a -> b) -> Identity a -> Identity b
Identity.prototype.map = function(f) {
  return Identity(f(this.x))
}

// of :: a -> Identity a
const of = x => Identity(x)

module.exports = mixin({
  of: of
})(Identity)
