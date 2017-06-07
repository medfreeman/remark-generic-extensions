const inlineExtensionRegex =
  /^\!(\w+)(?:\[([^\)]*)\])?(?:\(([^\)]*)\))?(?:\{([^\}]*)\})?/

const keyValueQuotedPropertiesRegex =
  /(?:\t )*([^\t \/>"'=]+)=(?:\"([^"]+)\")/g

const keyValuePropertiesRegex =
  /(?:\t )*([^\t \/>"'=]+)=([^\t \/>"'=]+)/g

const classNameRegex = /(?:\t )*\.([^\t ]+)/g

const idRegex = /(?:\t )*\#([^\t ]+)/g

const lonePropertiesRegex = /(?:\t )*([^\t \/>"'=]+)/g

const tagNameRegex = /^\w([^A-Z\s\/\u0000>])*$/

export {
  inlineExtensionRegex,
  keyValueQuotedPropertiesRegex,
  keyValuePropertiesRegex,
  classNameRegex,
  idRegex,
  lonePropertiesRegex,
  tagNameRegex
}
