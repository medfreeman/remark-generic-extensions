import remark from "remark"
import genericExtensions from "remark-generic-extensions/lib/browser"
import remarkReact from "remark-react"
import deepmerge from "deepmerge"
import sanitizeGhSchema from "hast-util-sanitize/lib/github.json"

import TooltipIcon from "./TooltipIcon.jsx"

const markdownToReact = (markdown) =>
  remark()
  .use(genericExtensions, {
    elements: {
      Icon: {
        propsDefaultValues: {
          accent: true,
          floating: true,
          primary: true,
          raised: true
        },
        html: {
          properties: {
            icon: "::content::",
            tooltip: "::argument::"
          }
        }
      }
    }
  })
  .use(remarkReact, {
    sanitize: deepmerge(sanitizeGhSchema, {
      // remove user-content from github.json to remark-slug work as expected
      clobberPrefix: "",
      tagNames: [
        "Icon",
      ],
      // allow code to have className
      attributes: {
        "*": ["className"],
        Icon: [
          "accent",
          "floating",
          "icon",
          "primary",
          "raised",
          "tooltip"
        ]
      }
    }),
    remarkReactComponents: {
      Icon: TooltipIcon,
    },
  })
  .processSync(markdown, { commonmark: true })
  .contents

export default markdownToReact
