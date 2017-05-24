function vfileFail(message) {
  this.file.fail(message , this.now())
}

function vfileWarning(message) {
  this.file.message(message , this.now())
}

function vfileDebug(message) {
  this::vfileWarning(message)
}

export { vfileFail, vfileWarning, vfileDebug }
