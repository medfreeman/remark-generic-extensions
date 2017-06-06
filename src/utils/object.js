function get(path, def) {
  let object = this
  return path
  .split(".")
  .filter(Boolean)
  .every(step => ((object = object[step]) !== undefined)) ? object : def
}

function prettify() {
  return JSON.stringify(this, undefined, 2)
}

export { get, prettify }
