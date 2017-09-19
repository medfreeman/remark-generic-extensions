function vfileWarning(message, ruleId = "") {
  this.file.message(message, null, ruleId);
}

function vfileDebug(message) {
  this::vfileWarning(message, "debug");
}

export { vfileWarning, vfileDebug };
