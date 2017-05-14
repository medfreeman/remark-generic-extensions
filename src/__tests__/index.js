import test from "ava"
import remark from "remark"
import html from "remark-html"

import genericExtensions from "../"

const transformToHtml = (input, options) => {
  const { contents } = remark()
    .use(genericExtensions, options)
    .use(html)
    .processSync(input)
  return contents
}

test(
  "should add an extension",
  t => t.snapshot(transformToHtml("!icon"))
)

test(
  "should add an extension with an id",
  t => t.snapshot(transformToHtml("!icon{ #my-id }"))
)

test(
  "should add an extension with a class",
  t => t.snapshot(transformToHtml("!icon{ .my-class }"))
)

test(
  "should add an extension with an attribute",
  t => t.snapshot(transformToHtml("!icon{ attr=my-attr }"))
)

test(
  "should add an extension with a quoted attribute",
  t => t.snapshot(transformToHtml(`!icon{ attr="my attribute" }`))
)

test(
  "should add an extension with a lone attribute",
  t => t.snapshot(transformToHtml(`!icon{ attr }`))
)

test(
  "should add an extension with a lone attribute with a default value",
  t => t.snapshot(
    transformToHtml(
      `!icon{ attr }`,
      {
        elements: {
          icon: {
            attributeDefaultValues: {
              attr: "default",
            }
          }
        }
      }
    )
  )
)

test(
  "should add an extension with a mapped content",
  t => t.snapshot(
    transformToHtml(
      "!icon[my-tooltip]",
      {
        elements: {
          icon: {
            attributeMap: {
              content: "tooltip",
            }
          }
        }
      }
    )
  )
)

test(
  "should add an extension with a mapped argument",
  t => t.snapshot(
    transformToHtml(
      "!icon(my-icon)",
      {
        elements: {
          icon: {
            attributeMap: {
              argument: "icon",
            }
          }
        }
      }
    )
  )
)

test(
  "should work with other markdown",
  t => t.snapshot(
    transformToHtml(
      `#heading

!icon(my-icon)`
    )
  )
)
