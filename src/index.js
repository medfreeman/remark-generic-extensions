import _ from "lodash"

function remarkGenericExtensions(options = {}) {
  const settings = _.assign({}, {
    placeholder: "::",
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
      /\s*([^\t\n\f \/>"'=]+)=(?:\"([^"]+)\")/g
    const keyValuePropertiesRegex =
      /\s*([^\t\n\f \/>"'=]+)=([^\t\n\f \/>"'=]+)/g
    const classNameRegex = /\s*\.([^\s]+)/g
    const idRegex = /\s*\#([^\s]+)/g
    const lonePropertiesRegex = /\s*([^\t\n\f \/>"'=]+)/g

    const match = inlineExtensionRegex.exec(value)
    if (match) {
      /* istanbul ignore if */
      if (silent) return true

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
            new RegExp( placeholder + "(content|argument|prop)" + placeholder ),
            (match, s1) => {
              if (s1 === "prop") {
                foundPlaceholders.properties[key] = true
                return element.properties[key]
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

      // Keep a reference to the next children branch in the input tree
      let hastInputChildrenTreeBranch = children
      // Keep a reference to the next children branch in the output tree
      let hastChildrenTreeBranchArray = hastOutputTree.data.hChildren

      // While there is children to process
      while (hastInputChildrenTreeBranch) {
        // Extract the current level hast properties separated from structure
        const { type, tagName, value, children, ...childProperties } =
          hastInputChildrenTreeBranch

        // Replaces the placeholders in the current level of the tree
        const newChildProperties = replacePlaceholders(childProperties)

        // Prepare the current level of the hast output tree
        const hastBranch = {
          type: type ? type : "element",
          tagName: tagName ? tagName : undefined,
          value: value ? value : undefined,
          properties: {
            ...newChildProperties
          }
        }

        // Add the current level tree branch to the output tree
        hastChildrenTreeBranchArray.push(
          {
            children: [],
            ...hastBranch
          }
        )

        // Keep a reference to the next children branch in the input tree
        hastInputChildrenTreeBranch = children
        // Keep a reference to the next children branch in the output tree
        hastChildrenTreeBranchArray = hastChildrenTreeBranchArray[0].children
      }

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
      hastOutputTree.data.hProperties = sortByHtmlAttrPreference(newProperties)

      // Return the output tree, while eating the original markdown
      return eat(match[0])(hastOutputTree)
    }

  }

  function locateExtension(value, fromIndex) {
    return value.indexOf("!", fromIndex)
  }
}

/*
  Sort an object keys by custom order:
  `id` property, `class` property, then alphabetical
*/
const sortByHtmlAttrPreference = (object) => {
  const keys = _.keys(object)
  const sortedKeys = _.sortBy(keys, (key) => {
    if (key === "id") return ""
    else if (key === "className") return " "
    else return key
  })

  return _.fromPairs(
    _.map(sortedKeys, key => [key, object[key]])
  )
}

export default remarkGenericExtensions
