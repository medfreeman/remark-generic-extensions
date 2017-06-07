import joi from "joi"

const html5TagNameRegex = joi.string().regex(
  /^\w([^A-Z\s\/\u0000>])*$/,
  "html element tag name"
)

const hastSchema = joi.array().items(
  joi.object({
    type: joi.string().regex(
      /^(element|doctype|comment|text)$/,
      "hast node type"
    ),
    tagName: html5TagNameRegex,
    children: joi.lazy(() => hastSchema).description("Hast schema"),
  }).pattern(/\w/, joi.string())
)

const schema = joi.object({
  debug: joi.boolean(),
  placeholder: joi.string(),
  elements: joi.object(undefined).pattern(/\w/, joi.object({
    attributeDefaultValues: joi.object(undefined).pattern(/\w/, joi.string()),
    hast: joi.object({
      tagName: html5TagNameRegex,
      children: hastSchema,
    }).pattern(/\w/, joi.string())
  }))
})

export default schema
