const inlineExtensionRegex = /^!(\w+)(?:\[([^)]*)\])?(?:\(([^)]*)\))?(?:\{([^}]*)\})?/;

const keyValueQuotedPropertiesRegex = /(?:\t )*([^\t />"'=]+)=(?:"([^"]+)")/g;

const keyValuePropertiesRegex = /(?:\t )*([^\t />"'=]+)=([^\t />"'=]+)/g;

const classNameRegex = /(?:\t )*\.([^\t ]+)/g;

const idRegex = /(?:\t )*#([^\t ]+)/g;

const lonePropertiesRegex = /(?:\t )*([^\t />"'=]+)/g;

export {
  inlineExtensionRegex,
  keyValueQuotedPropertiesRegex,
  keyValuePropertiesRegex,
  classNameRegex,
  idRegex,
  lonePropertiesRegex
};
