import startsWith from "core-js/library/fn/string/virtual/starts-with";
import trim from "core-js/library/fn/string/virtual/trim";

const trimNewLines = function() {
  return this.replace(/^[\n\r]+|[\n\r]+$/g, "");
};

// https://stackoverflow.com/a/3561711
const escapeRegExp = function() {
  return this.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export { startsWith, trim, trimNewLines, escapeRegExp };
