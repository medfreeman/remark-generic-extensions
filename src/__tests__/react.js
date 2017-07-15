import test from "ava"

import { transformToReact } from "./helpers/transform"

test(
  "should add an extension",
  t => t.snapshot(transformToReact("!Icon"))
)

test(
  "should add an extension with an id",
  t => t.snapshot(transformToReact("!Icon{ #my-id }"))
)

test(
  "should add an extension with a class",
  t => t.snapshot(transformToReact("!Icon{ .my-class }"))
)

test(
  "should add an extension with an attribute",
  t => t.snapshot(transformToReact("!Icon{ attr=my-attr }"))
)

test(
  "should add an extension with a quoted attribute",
  t => t.snapshot(transformToReact(`!Icon{ attr="my attribute" }`))
)

test(
  "should add an extension with a lone attribute",
  t => t.snapshot(transformToReact(`!Icon{ attr }`))
)

test(
  "should add an extension with a lone attribute with a default value",
  t => t.snapshot(
    transformToReact(
      `!Icon{ attr }`,
      {
        elements: {
          Icon: {
            propsDefaultValues: {
              attr: "default",
            }
          }
        }
      }
    )
  )
)

test.skip(
  "should add an extension with a lone attribute with a default boolean value",
  t => t.snapshot(
    transformToReact(
      `!Icon{ highlight }`,
      {
        elements: {
          Icon: {
            propsDefaultValues: {
              highlight: true,
            }
          }
        }
      }
    )
  )
)

test(
  "should add an extension with all types of parameters",
  t => t.snapshot(
    transformToReact(
      `!Icon{ #my-id .my-class attr attr2=my-attr attr3="my attribute" }`,
      {
        elements: {
          Icon: {
            propsDefaultValues: {
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
    transformToReact(
      "!Icon[my-tooltip]",
      {
        elements: {
          Icon: {
            html: {
              tooltip: "::content::"
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
    transformToReact(
      "!Icon(my-icon)",
      {
        elements: {
          Icon: {
            html: {
              icon: "::argument::"
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
    transformToReact(
      `#heading

!Icon`
    )
  )
)
