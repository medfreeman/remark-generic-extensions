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
    const inlineExtensionRegex = /^\!(\w+)(?:\[([^\)]*)\])?(?:\(([^\)]*)\))?(?:\{([^\}]*)\})?/
    const keyValueQuotedPropertiesRegex = /\s*([^\t\n\f \/>"'=]+)=(?:\"([^"]+)\")/g
    const keyValuePropertiesRegex = /\s*([^\t\n\f \/>"'=]+)=([^\t\n\f \/>"'=]+)/g
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
        propertiesString = propertiesString.replace(keyValueQuotedPropertiesRegex, (match, s1, s2) => {
          element.properties[s1] = s2
          return ""
        })

        // Extract key/value pairs not surrounded by quotes i.e `foo=bar`
        propertiesString = propertiesString.replace(keyValuePropertiesRegex, (match, s1, s2) => {
          element.properties[s1] = s2
          return ""
        })

        // Extract classnames i.e `.yeah`
        propertiesString = propertiesString.replace(classNameRegex, (match, s1) => {
          classNamesArray.push(s1)
          return ""
        })
        if (classNamesArray.length) {
          element.properties.className = classNamesArray.join(" ")
        }

        // Extract ids i.e `#heyy`, last one is kept if multiple are specified
        propertiesString = propertiesString.replace(idRegex, (match, s1) => {
          element.properties.id = s1
          return ""
        })

        // Extract lone properties i.e `alone`
        propertiesString = propertiesString.replace(lonePropertiesRegex, (match, s1) => {
          element.properties[s1] = _.get(settings, `elements[${element.name}].attributeDefaultValues[${s1}]`, "")
          return ""
        })
      }

      const hastInputTree = _.get(settings, `elements[${element.name}].hast`, {})
      const { tagName, children, ...properties } = hastInputTree

      const hastOutputTree = {
        type: "inline-extension",
        data: {
          hName: tagName ? tagName : element.name,
          hChildren: []
        }
      }

      const placeholder = _.escapeRegExp(settings.placeholder)

      const foundPlaceholders = {
        content: false,
        argument: false,
        properties: {
          id: false,
          className: false
        }
      }

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

      const newProperties = replacePlaceholders(properties)

      let hastInputChildrenTreeBranch = children
      let hastChildrenTreeBranchArray = hastOutputTree.data.hChildren

      while (hastInputChildrenTreeBranch) {
        const { type, tagName, value, children, ...childProperties } = hastInputChildrenTreeBranch

        const newChildProperties = replacePlaceholders(childProperties)

        const hastBranch = {
          type: type ? type : "element",
          tagName: tagName ? tagName : undefined,
          value: value ? value : undefined,
          properties: {
            ...newChildProperties
          }
        }

        hastChildrenTreeBranchArray.push(
          {
            children: [],
            ...hastBranch
          }
        )

        hastInputChildrenTreeBranch = children
        hastChildrenTreeBranchArray = hastChildrenTreeBranchArray[0].children
      }

      _.forOwn(element.properties, function(value, key) {
        if (!_.get(foundPlaceholders, `properties[${key}]`, undefined)) {
          newProperties[key] = element.properties[key]
        }
      })

      hastOutputTree.data.hProperties = sortByHtmlAttrPreference(newProperties)

      return eat(match[0])(hastOutputTree)
    }

  }

  function locateExtension(value, fromIndex) {
    return value.indexOf("!", fromIndex)
  }
}

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
