function vfileWarning(message, ruleId = "") {
  this.file.message(message , this.now(), ruleId)
}

function vfileDebug(message) {
  this::vfileWarning(message, "debug")
}

export { vfileWarning, vfileDebug }
