import joi from "joi"

const hastNodeTypeRegex = joi.string().regex(
  /^(element|comment|text)$/,
  "hast node type"
)

const html5TagNameRegex = joi.string().regex(
  /^[a-z]([^A-Z\s/\u0000>])*$/,
  "html5 element tag name"
)

const hastPropertyNameRegex = /^[^\t />"'=-]+$/

const hastSchema = joi.array().items(
  joi.object({
    type: hastNodeTypeRegex,
    tagName: html5TagNameRegex
      .when("type", {
        is: "element",
        then: joi.required()
      }),
    value: joi.string()
      .when("type", {
        is: "comment",
        then: joi.required()
      })
      .when("type", {
        is: "text",
        then: joi.required()
      }),
    class: joi.any().forbidden(),
    for: joi.any().forbidden(),
    children: joi.lazy(() => hastSchema),
  })
    .pattern(hastPropertyNameRegex, joi.any())
).description("hast schema")

const schema = joi.object({
  debug: joi.boolean(),
  placeholder: joi.string(),
  elements: joi.object(undefined).pattern(/\w/, joi.object({
    attributeDefaultValues:
      joi.object(undefined).pattern(hastPropertyNameRegex, joi.any()),
    hast: joi.object({
      tagName: html5TagNameRegex,
      class: joi.any().forbidden(),
      for: joi.any().forbidden(),
      children: hastSchema
    }).pattern(hastPropertyNameRegex, joi.any())
  }))
})

export default schema
