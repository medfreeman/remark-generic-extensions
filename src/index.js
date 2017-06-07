import assign from "core-js/library/fn/object/assign"
import joi from "joi"

import optionsSchema from "./utils/optionsSchema"
import inlineExtensionLocator from "./locators/inline"
import inlineExtensionTokenizer from "./tokenizers/inline"
import { prettify } from "./utils/object"
import { escapeRegExp } from "./utils/string"

function remarkGenericExtensions(options = {}) {
  const optionsValidation = joi.validate(options, optionsSchema)

  if (optionsValidation.error !== null) {
    console.error(
      "Invalid options provided:\n" +
      options::prettify() +
      "\n\n" +
      "returned:\n" +
      optionsValidation::prettify()
    )
    return false
  }

  const settings = Object::assign({},
    {
      debug: false,
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
