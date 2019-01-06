import entries from "core-js/library/fn/object/entries";
import keys from "core-js/library/fn/object/keys";

function get(object, path, def) {
  return path
    .split(".")
    .filter(Boolean)
    .every(step => (object = object[step]) !== undefined)
    ? object
    : def;
}

function prettify(object) {
  return JSON.stringify(object, undefined, 2);
}

export { entries, keys, get, prettify };
