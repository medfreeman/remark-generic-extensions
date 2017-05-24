import _ from "lodash"

import { prettify, sortKeysByHtmlAttrs } from "./utils/object"
import { vfileDebug } from "./utils/eat"

function remarkGenericExtensions(options = {}) {
  const settings = _.assign({}, {
    placeholder: "::",
    debug: false,
    elements: {}
  }, options)

  const Parser = this.Parser
  const tokenizers = Parser.prototype.inlineTokenizers
  const methods = Parser.prototype.inlineMethods

  tokenizeExtension.notInLink = true
  tokenizeExtension.locator = locateExtension
  tokenizers.extension = tokenizeExtension

  methods.splice(methods.indexOf("text"), 0, "extension")

  function tokenizeExtension(eat, value, silent) {
    const inlineExtensionRegex =
      /^\!(\w+)(?:\[([^\)]*)\])?(?:\(([^\)]*)\))?(?:\{([^\}]*)\})?/
    const keyValueQuotedPropertiesRegex =
      /(?:\t )*([^\t \/>"'=]+)=(?:\"([^"]+)\")/g
    const keyValuePropertiesRegex =
      /(?:\t )*([^\t \/>"'=]+)=([^\t \/>"'=]+)/g
    const classNameRegex = /(?:\t )*\.([^\t ]+)/g
    const idRegex = /(?:\t )*\#([^\t ]+)/g
    const lonePropertiesRegex = /(?:\t )*([^\t \/>"'=]+)/g

    const match = inlineExtensionRegex.exec(value)
    if (match) {
      /* istanbul ignore if */
      if (silent) return true

      const debug = settings.debug ? eat::vfileDebug : () => {}

      const element = {
        name: match[1],
        content: match[2] ? match[2] : undefined,
        argument: match[3] ? match[3] : undefined,
        properties: {
          id: undefined,
          className: undefined,
        }
      }

      let propertiesString = match[4] ? _.trim(match[4]) : undefined

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
            element.properties[s1] = _.get(
              settings,
              `elements[${element.name}].attributeDefaultValues[${s1}]`,
              ""
            )
            return ""
          }
        )

      }

      debug(
        "Computed properties: " + element.properties::prettify()
      )

      // Fetch the user provided pseudo hast tree
      const hastInputTree = _.get(
        settings,
        `elements[${element.name}].hast`,
        {}
      )
      // Extract the first-level hast properties separated from structure
      const { tagName, children, ...properties } = hastInputTree

      // Prepare the final hast tree
      const hastOutputTree = {
        type: "inline-extension",
        data: {
          hName: tagName ? tagName : element.name,
          hChildren: []
        }
      }

      // Escape the user provided placeholder for use in regex
      const placeholder = _.escapeRegExp(settings.placeholder)

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
        _.forOwn(propertiesObject, function(value, key) {
          const newValue = value.replace(
            new RegExp(
              placeholder +
              "(content|argument|prop" + placeholder +
              "(" + _.keys(element.properties).join("|") + "))" +
              placeholder
            ),
            (match, s1, s2) => {
              if (_.startsWith(s1, "prop")) {
                foundPlaceholders.properties[s2] = true
                return element.properties[s2]
              } else {
                foundPlaceholders.s1 = true
                return element[s1]
              }
            }
          )
          newPropertiesObject[key] = newValue
        })
        return newPropertiesObject
      }

      // Replace the placeholders in the first-level of the tree
      const newProperties = replacePlaceholders(properties)

      const parseHastChildrenTreeRecursive = (inputChildrenArray) => {
        const outputChildrenArray = []
        _.forEach(inputChildrenArray, (childElement) => {
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
      _.forOwn(element.properties, function(value, key) {
        // If the property was not referenced by a placeholder
        if (!_.get(foundPlaceholders, `properties[${key}]`, undefined)) {
          // Set the corresponding property to the first-level html element
          newProperties[key] = element.properties[key]
        }
      })

      /*
        Assign the first-level html element properties
        sorted in this order, `id` property, `class` property,
        then alphabetical, since remark-html prints its output
        in the order by which the properties have been added to the object
        Does not show through remark-react
      */
      hastOutputTree.data.hProperties = newProperties::sortKeysByHtmlAttrs()

      debug("Hast output tree:\n" + hastOutputTree::prettify())

      // Return the output tree, while eating the original markdown
      return eat(match[0])(hastOutputTree)
    }

  }

  function locateExtension(value, fromIndex) {
    return value.indexOf("!", fromIndex)
  }
}

export default remarkGenericExtensions
