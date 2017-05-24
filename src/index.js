import _ from "lodash"

import inlineExtensionLocator from "./locators/inline"
import inlineExtensionTokenizer from "./tokenizers/inline"

function remarkGenericExtensions(options = {}) {
  const settings = _.assign({}, {
    placeholder: "::",
    elements: {}
  }, options)

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
