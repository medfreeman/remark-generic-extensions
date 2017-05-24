import _ from "lodash"

function prettify() {
  return JSON.stringify(this, undefined, 2)
}

/*
  Sort an object keys by custom order:
  `id` property, `class` property, then alphabetical
*/
function sortKeysByHtmlAttrs() {
  const keys = _.keys(this)
  const sortedKeys = _.sortBy(keys, (key) => {
    if (key === "id") return ""
    else if (key === "className") return " "
    else return key
  })

  return _.fromPairs(
    _.map(sortedKeys, key => [key, this[key]])
  )
}

export { prettify, sortKeysByHtmlAttrs }
