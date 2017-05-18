"use strict"

// mixin :: Object String a -> Object String a -> Object String a
module.exports = x => y => {
  var k

  for (k in x) {
    y[k] = x[k]
  }

  return y
}
