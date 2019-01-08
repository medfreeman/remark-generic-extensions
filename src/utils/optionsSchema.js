import joi from "joi";

const hastNodeTypeRegex = joi
  .string()
  .regex(/^(element|comment|text)$/, "hast node type");

const html5TagNameRegex = joi
  .string()
  // eslint-disable-next-line no-control-regex
  .regex(/^[a-z]([^A-Z\s/\u0000>])*$/, "html5 element tag name");

const hastPropertyNameRegex = /^[^\t />"'=-]+$/;

const hastSchema = joi
  .array()
  .items(
    joi.object({
      type: hastNodeTypeRegex,
      tagName: html5TagNameRegex.when("type", {
        is: "element",
        then: joi.required()
      }),
      value: joi
        .string()
        .when("type", {
          is: "comment",
          then: joi.required()
        })
        .when("type", {
          is: "text",
          then: joi.required()
        }),
      properties: joi
        .object({
          class: joi.any().forbidden(),
          for: joi.any().forbidden()
        })
        .pattern(hastPropertyNameRegex, joi.any()),
      children: joi.lazy(() => hastSchema)
    })
  )
  .description("hast schema");

const schema = joi.object({
  debug: joi.boolean(),
  placeholderAffix: joi.string(),
  elements: joi.object(undefined).pattern(
    /\w/,
    joi
      .object({
        propsDefaultValues: joi
          .object(undefined)
          .pattern(hastPropertyNameRegex, joi.any()),
        html: joi.object({
          tagName: html5TagNameRegex,
          properties: joi
            .object({
              class: joi.any().forbidden(),
              for: joi.any().forbidden()
            })
            .pattern(hastPropertyNameRegex, joi.any()),
          children: hastSchema
        }),
        replace: joi.func()
      })
      .without("html", "replace")
  )
});

export default schema;
