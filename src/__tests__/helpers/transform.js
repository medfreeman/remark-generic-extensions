import remark from "remark"
import html from "remark-html"

import genericExtensions from "../../"

const transformToHtml = (input, options) => {
  const { contents } = remark()
    .use(genericExtensions, options)
    .use(html)
    .processSync(input)
  return contents
}

export { transformToHtml }
