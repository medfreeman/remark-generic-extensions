/* eslint-disable no-unused-vars */

import { readFileSync as read } from "fs"
import { join } from "path"

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

const base = file => read(join(__dirname, "fixtures", file), "utf-8")

test(
  "should add an extension",
  t => t.deepEqual(
    transformToHtml("!icon"),
    "<p><icon></icon></p>\n"
  )
)

test(
  "should add an extension with an id",
  t => t.deepEqual(
    transformToHtml("!icon{ #my-id }"),
    `<p><icon id="my-id"></icon></p>\n`
  )
)

test(
  "should add an extension with a class",
  t => t.deepEqual(
    transformToHtml("!icon{ .my-class }"),
    `<p><icon class="my-class"></icon></p>\n`
  )
)

test(
  "should add an extension with an attribute",
  t => t.deepEqual(
    transformToHtml("!icon{ attr=my-attr }"),
    `<p><icon attr="my-attr"></icon></p>\n`
  )
)

test(
  "should add an extension with a quoted attribute",
  t => t.deepEqual(
    transformToHtml(`!icon{ attr="my attribute" }`),
    `<p><icon attr="my attribute"></icon></p>\n`
  )
)

test(
  "should add an extension with a lone attribute",
  t => t.deepEqual(
    transformToHtml(`!icon{ attr }`),
    `<p><icon attr=""></icon></p>\n`
  )
)

test(
  "should add an extension with a lone attribute with a default value",
  t => t.deepEqual(
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
    ),
    `<p><icon attr="default"></icon></p>\n`
  )
)

test(
  "should add an extension with a mapped content",
  t => t.deepEqual(
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
    ),
    `<p><icon tooltip="my-tooltip"></icon></p>\n`
  )
)

test(
  "should add an extension with a mapped argument",
  t => t.deepEqual(
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
    ),
    `<p><icon icon="my-icon"></icon></p>\n`
  )
)
