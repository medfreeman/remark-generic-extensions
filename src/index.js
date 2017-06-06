import assign from "core-js/library/fn/object/assign"

import inlineExtensionLocator from "./locators/inline"
import inlineExtensionTokenizer from "./tokenizers/inline"
import { escapeRegExp } from "./utils/string"

function remarkGenericExtensions(options = {}) {
  const settings = Object::assign({},
    {
      placeholder: "::",
      elements: {}
    },
    options
  )

  // Escape the user provided placeholder for use in regex
  settings.placeholder = settings.placeholder::escapeRegExp()

  const Parser = this.Parser
  const tokenizers = Parser.prototype.inlineTokenizers
  const methods = Parser.prototype.inlineMethods

  const inlineExtensionWrapper = (eat, value, silent) =>
    inlineExtensionTokenizer(eat, value, silent, settings)

  inlineExtensionWrapper.notInLink = true
  inlineExtensionWrapper.locator = inlineExtensionLocator
  tokenizers.extension = inlineExtensionWrapper

  methods.splice(methods.indexOf("text"), 0, "extension")
}

export default remarkGenericExtensions
