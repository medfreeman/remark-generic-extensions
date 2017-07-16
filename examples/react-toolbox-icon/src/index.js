import React from "react"
import { render } from "react-dom"
import remark from "remark"
import genericExtensions from "remark-generic-extensions"
import remarkReact from "remark-react"
import deepmerge from "deepmerge"
import sanitizeGhSchema from "hast-util-sanitize/lib/github.json"
import ThemeProvider from "react-toolbox/lib/ThemeProvider"

import theme from "./assets/react-toolbox/theme"
import "./assets/react-toolbox/theme.css"
import TooltipIcon from "./TooltipIcon.jsx"

const markdownToReact = (markdown) =>
  remark()
  .use(genericExtensions, {
    elements: {
      Icon: {
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
          "tooltip",
          "icon",
          "floating",
          "accent"
        ]
      }
    }),
    remarkReactComponents: {
      Icon: TooltipIcon,
    },
  })
  .processSync(markdown, { commonmark: true })
.contents

const content = markdownToReact(`# Hello

!Icon[add](Add button){ floating accent }`)

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
}

const App = () => (
  <ThemeProvider theme={theme}>
    <div style={styles}>
      { content }
    </div>
  </ThemeProvider>
)

render(<App />, document.getElementById('root'))
