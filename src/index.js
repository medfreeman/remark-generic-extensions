import _ from "lodash"

_.mixin({
  "sortByHtmlAttrPreference": (object) => {
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
})

function remarkGenericExtensions(options = {}) {
  const settings = Object.assign({}, {
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
    const match = /^\!(\w+)(?:\[([^\)]*)\])?(?:\(([^\)]*)\))?(?:\{([^\}]*)\})?/.exec(value)
    if (match) {
      /* istanbul ignore if */
      if (silent) return true

      const element = match[1]
      const content = match[2] ? match[2] : undefined
      const argument = match[3] ? match[3] : undefined
      let properties = match[4] ? _.trim(match[4]) : undefined

      const classNamesArray = []
      const propertiesObject = {}

      const contentMappedAttribute = _.get(settings, `elements[${element}].attributeMap.content`, undefined)
      if (contentMappedAttribute) {
        propertiesObject[contentMappedAttribute] = content
      }

      const argumentMappedAttribute = _.get(settings, `elements[${element}].attributeMap.argument`, undefined)
      if (argumentMappedAttribute) {
        propertiesObject[argumentMappedAttribute] = argument
      }

      if (properties) {
        // Extract key/value pairs surrounded by quotes i.e `foo="bar baz"`
        properties = properties.replace(/\s*([^\t\n\f \/>"'=]+)=(?:\"([^"]+)\")/g, (match, s1, s2) => {
          propertiesObject[s1] = s2
          return ""
        })

        // Extract key/value pairs not surrounded by quotes i.e `foo=bar`
        properties = properties.replace(/\s*([^\t\n\f \/>"'=]+)=([^\t\n\f \/>"'=]+)/g, (match, s1, s2) => {
          propertiesObject[s1] = s2
          return ""
        })

        // Extract classnames i.e `.yeah`
        properties = properties.replace(/\s*\.([^\s]+)/g, (match, s1) => {
          classNamesArray.push(s1)
          return ""
        })
        if (classNamesArray.length) {
          propertiesObject["className"] = classNamesArray.join(" ")
        }

        // Extract ids i.e `#heyy`, last one is kept if multiple are specified
        properties = properties.replace(/\s*\#([^\s]+)/g, (match, s1) => {
          propertiesObject["id"] = s1
          return ""
        })

        // Extract lone properties i.e `alone`
        properties = properties.replace(/\s*([^\t\n\f \/>"'=]+)/g, (match, s1) => {
          const attributeDefaultValue = _.get(settings, `elements[${element}].attributeDefaultValues[${s1}]`, undefined)
          propertiesObject[s1] = attributeDefaultValue ? attributeDefaultValue : ""
          return ""
        })
      }

      log("Element type:", element)
      log("Full match:", match[0])
      log("Content:", content ? content : "undefined" )
      contentMappedAttribute ?
        log(`The content property is mapped to '${contentMappedAttribute}' html attribute.`) :
        log("The content property is not mapped to any html attribute.")
      log("Argument:", argument ? argument : "undefined" )
      argumentMappedAttribute ?
        log(`The argument property is mapped to '${argumentMappedAttribute}' html attribute.`) :
        log("The argument property is not mapped to any html attribute.")
      log("Id:", propertiesObject["id"] ? propertiesObject["id"] : "undefined" )
      log("Class names:", propertiesObject["className"] ? propertiesObject["className"] : "undefined" )
      log("Properties:", Object.keys(propertiesObject).length !== 0 ? propertiesObject : "undefined")
      log("\n")

      return eat(match[0])({
        type: "extension",
        data: {
          hName: element,
          hProperties: _.sortByHtmlAttrPreference(propertiesObject),
        }
      })
    }
  }

  function locateExtension(value, fromIndex) {
    return value.indexOf("!", fromIndex)
  }

  function log(...messages) {
    if (settings.debug && typeof console !== "undefined") {
      console.log(...messages)
    }
  }
}

export default remarkGenericExtensions
