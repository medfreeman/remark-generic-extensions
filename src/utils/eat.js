function vfileFail(message) {
  this.file.fail(message , this.now())
}

function vfileWarning(message, ruleId = "") {
  this.file.message(message , this.now(), ruleId)
}

function vfileDebug(message) {
  this::vfileWarning(message, "debug")
}

export { vfileFail, vfileWarning, vfileDebug }
