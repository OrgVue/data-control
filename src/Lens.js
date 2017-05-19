// data Lens s t a b = Functor f => Lens (a -> f b) -> s -> f t

"use strict"

const compose = require("./compose.js")
const Const = require("./Const.js")
const Identity = require("./Identity.js")

const K = x => _ => x

// ofProp :: String -> Lens (Object String a) (Object String b) a b
const ofProp = key => f => obj =>
  f(obj ? obj[key] : undefined).map(x => {
    var k, r

    r = {}
    for (k in obj) {
      if (k !== key) {
        r[k] = obj[k]
      } else if (x !== undefined) {
        r[k] = x
      }
    }

    return r
  })

// over :: Lens s t a b -> (a -> b) -> s -> t
// ${doc.Lens.over}
const over = lens => f => s => lens(compose(Identity)(f))(s).x

// set :: Lens s t a b -> b -> s -> t
// ${doc.Lens.set}
const set = lens => v => s => lens(compose(Identity)(K(v)))(s).x

// view :: Lens s t a b -> s -> a
// ${doc.Lens.view}
const view = lens => s => lens(Const)(s).x

// Exports.
module.exports = {
  ofProp: ofProp,
  over: over,
  set: set,
  view: view
}
