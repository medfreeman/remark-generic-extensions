function vfileWarning(message, ruleId = "") {
  this.file.message(message, null, ruleId);
}

function vfileDebug(message) {
  vfileWarning.bind(this)(message, "debug");
}

export { vfileWarning, vfileDebug };
