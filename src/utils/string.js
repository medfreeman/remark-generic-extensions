// https://stackoverflow.com/a/3561711
const escapeRegExp = function() {
  return this.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
}

export { escapeRegExp }
