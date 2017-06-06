import assign from "core-js/library/fn/object/assign"
import joi from "joi"

import inlineExtensionLocator from "./locators/inline"
import inlineExtensionTokenizer from "./tokenizers/inline"
import { prettify } from "./utils/object"
import { escapeRegExp } from "./utils/string"

function remarkGenericExtensions(options = {}) {
  const html5TagNameValidator = joi.string().regex(
    /^\w([^A-Z\s\/\u0000>])*$/,
    "html element tag name"
  )

  const hastSchema = joi.array().items(
    joi.object({
      type: joi.string().regex(
        /^(element|doctype|comment|text)$/,
        "hast node type"
      ),
      tagName: html5TagNameValidator,
      children: joi.lazy(() => hastSchema).description("Hast schema"),
    }).pattern(/\w/, joi.string())
  )

  const schema = joi.object({
    debug: joi.boolean(),
    placeholder: joi.string(),
    elements: joi.object(undefined).pattern(/\w/, joi.object({
      attributeDefaultValues: joi.object(undefined).pattern(/\w/, joi.string()),
      hast: joi.object({
        tagName: html5TagNameValidator,
        children: hastSchema,
      }).pattern(/\w/, joi.string())
    }))
  })

  const result = joi.validate(options, schema)

  if (result.error !== null) {
    console.error(
      "Invalid options provided:\n" +
      options::prettify() +
      "\n\n" +
      "returned:\n" +
      result::prettify()
    )
    return false
  }

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
