import startsWith from "core-js/library/fn/string/starts-with";
import trim from "core-js/library/fn/string/trim";

const trimNewLines = function(string) {
  return string.replace(/^[\n\r]+|[\n\r]+$/g, "");
};

// https://stackoverflow.com/a/3561711
const escapeRegExp = function(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export { startsWith, trim, trimNewLines, escapeRegExp };
