import entries from "core-js/library/fn/object/entries"
import forEach from "core-js/library/fn/array/virtual/for-each"
import keys from "core-js/library/fn/object/keys"
import startsWith from "core-js/library/fn/string/virtual/starts-with"
import trim from "core-js/library/fn/string/virtual/trim"

import {
  inlineExtensionRegex,
  keyValueQuotedPropertiesRegex,
  keyValuePropertiesRegex,
  classNameRegex,
  idRegex,
  lonePropertiesRegex
} from "../utils/regexes.js"
import { get, prettify } from "../utils/object"
import { vfileDebug, vfileWarning } from "../utils/eat"

function inlineExtensionTokenizer(eat, value, silent, settings) {
  const match = inlineExtensionRegex.exec(value)
  if (match) {
    /* istanbul ignore if */
    if (silent) return true

    const debug = settings.debug ? eat::vfileDebug : () => {}
    const warning = eat::vfileWarning

    const element = {
      name: match[1],
      content: match[2] ? match[2] : undefined,
      argument: match[3] ? match[3] : undefined,
      properties: {
        id: undefined,
        className: undefined,
      }
    }

    let propertiesString = match[4] ? match[4]::trim() : undefined

    debug(`Inline extension \`${element.name}\` found`)
    debug(`Full match: "${match[0]}"`)
    debug(`Content: "${element.content || ""}"`)
    debug(`Argument: "${element.argument || ""}"`)
    debug(`Properties string: "${propertiesString || ""}"`)

    const classNamesArray = []

    if (propertiesString) {
      // Extract key/value pairs surrounded by quotes i.e `foo="bar baz"`
      propertiesString = propertiesString.replace(
        keyValueQuotedPropertiesRegex,
        (match, s1, s2) => {
          element.properties[s1] = s2
          return ""
        }
      )

      // Extract key/value pairs not surrounded by quotes i.e `foo=bar`
      propertiesString = propertiesString.replace(
        keyValuePropertiesRegex,
        (match, s1, s2) => {
          element.properties[s1] = s2
          return ""
        }
      )

      // Extract classnames i.e `.yeah`
      propertiesString = propertiesString.replace(
        classNameRegex,
        (match, s1) => {
          classNamesArray.push(s1)
          return ""
        }
      )
      if (classNamesArray.length) {
        element.properties.className = classNamesArray.join(" ")
      }

      // Extract ids i.e `#heyy`, last one is kept if multiple are specified
      propertiesString = propertiesString.replace(idRegex, (match, s1) => {
        element.properties.id = s1
        return ""
      })

      // Extract lone properties i.e `alone`
      propertiesString = propertiesString.replace(
        lonePropertiesRegex,
        (match, s1) => {
          element.properties[s1] = settings::get(
            `elements.${element.name}.propsDefaultValues.${s1}`,
            ""
          )
          return ""
        }
      )

    }

    if (propertiesString && propertiesString !== "") {
      warning(
        `There was some invalid properties: "${propertiesString}" ` +
        `was left after the processing of "${match[4]}"`
      )
    }

    debug(
      "Computed properties: " + element.properties::prettify()
    )

    // Fetch the user provided pseudo hast tree
    const hastInputTree = settings::get(
      `elements.${element.name}.html`,
      {}
    )
    // Extract the first-level hast properties separated from structure
    const { tagName, children, ...properties } = hastInputTree

    // Prepare the final hast tree
    const hastOutputTree = {
      type: "inline-extension",
      data: {
        hName: tagName ? tagName : element.name
      }
    }

    /*
      Prepare the found placeholders object
      The replacements that have *NOT* been provided
      will have their corresponding properties
      applied to the top-level html element later
    */
    const foundPlaceholders = {
      content: false,
      argument: false,
      properties: {
        id: false,
        className: false
      }
    }

    /*
      Replace the placeholders on any level
      of the pseudo hast tree by their corresponding
      property and populate the found placeholders object
    */
    const replacePlaceholders = (propertiesObject) => {
      const newPropertiesObject = {}
      Object::entries(propertiesObject)::forEach(
        ([key, value]) => {
          const newValue =
            typeof value === "string"
              ? value.replace(
                new RegExp(
                  settings.placeholder +
                "(content|argument|prop" + settings.placeholder +
                "(" + Object::keys(element.properties).join("|") + "))" +
                settings.placeholder
                ),
                (match, s1, s2) => {
                  if (s1::startsWith("prop")) {
                    foundPlaceholders.properties[s2] = true
                    return element.properties[s2]
                  } else {
                    foundPlaceholders.s1 = true
                    return element[s1]
                  }
                }
              )
              : value
          newPropertiesObject[key] = newValue
        }
      )
      return newPropertiesObject
    }

    // Replace the placeholders in the first-level of the tree
    const newProperties = replacePlaceholders(properties)

    const parseHastChildrenTreeRecursive = (inputChildrenArray = []) => {
      const outputChildrenArray = []
      inputChildrenArray::forEach((childElement) => {
        // Extract the current level hast properties separated from structure
        const { type, tagName, value, children, ...properties } =
          childElement

        // Replace the placeholders in the current level of the tree
        const newProperties = replacePlaceholders(properties)

        // Prepare the current level of the hast output tree
        const branch = {
          type: type ? type : "element",
          tagName: tagName ? tagName : undefined,
          value: value ? value : undefined,
          properties: {
            ...newProperties
          }
        }

        // Add the current level tree branch to the output tree
        outputChildrenArray.push(
          {
            children: parseHastChildrenTreeRecursive(children),
            ...branch
          }
        )
      })
      return outputChildrenArray
    }

    hastOutputTree.data.hChildren = parseHastChildrenTreeRecursive(children)

    // For each property found in markdown
    Object::entries(element.properties)::forEach( ([key, value]) => {
      // If the property was not referenced by a placeholder
      if (!foundPlaceholders::get(`properties.${key}`, undefined)) {
        // Set the corresponding property to the first-level html element
        newProperties[key] = value
      }
    })

    // Assign the first-level properties to the hast node
    hastOutputTree.data.hProperties = newProperties

    debug("Hast output tree:\n" + hastOutputTree::prettify())

    // Return the output tree, while eating the original markdown
    return eat(match[0])(hastOutputTree)
  }

}

export default inlineExtensionTokenizer
