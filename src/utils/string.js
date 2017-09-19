import startsWith from "core-js/library/fn/string/virtual/starts-with";
import trim from "core-js/library/fn/string/virtual/trim";

// https://stackoverflow.com/a/3561711
const escapeRegExp = function() {
  return this.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export { startsWith, trim, escapeRegExp };
