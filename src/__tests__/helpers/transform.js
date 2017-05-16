import remark from "remark"
import html from "remark-html"
import react from "remark-react"
import reactTestRenderer from "react-test-renderer"

import genericExtensions from "../../"

import Icon from "./Icon.jsx"

const transformToHtml = (input, options) => {
  const { contents } = remark()
    .use(genericExtensions, options)
    .use(html)
    .processSync(input)
  return contents
}

const transformToReact = (input, options) => {
  const { contents } = remark()
    .use(genericExtensions, options)
    .use(react, {
      sanitize: false,
      remarkReactComponents: {
        Icon: Icon
      }
    })
    .processSync(input)
  return reactTestRenderer.create(contents).toJSON()
}

export { transformToHtml, transformToReact }
