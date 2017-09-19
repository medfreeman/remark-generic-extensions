/* eslint-disable no-irregular-whitespace */
const inlineExtensionRegex = /^!(\w+)(?:\[([^)]*)\])?(?:\(([^)]*)\))?(?:\{([^}]*)\})?/;

const blockExtensionRegex = /^(\w+):(?:[ \t]+)([^\f\n\r\v]*)?(?:[\f\n\r\v]+):::(?:[\f\n\r\v]+)([^]*?)(?:[\f\n\r\v]+):::(?:(?:[\f\n\r\v]+)(?:\{([^}]*)\}))?/;

const keyValueQuotedPropertiesRegex = /(?:\t )*([^\t />"'=]+)=(?:"([^"]+)")/g;

const keyValuePropertiesRegex = /(?:\t )*([^\t />"'=]+)=([^\t />"'=]+)/g;

const classNameRegex = /(?:\t )*\.([^\t ]+)/g;

const idRegex = /(?:\t )*#([^\t ]+)/g;

const lonePropertiesRegex = /(?:\t )*([^\t />"'=]+)/g;

export {
  inlineExtensionRegex,
  blockExtensionRegex,
  keyValueQuotedPropertiesRegex,
  keyValuePropertiesRegex,
  classNameRegex,
  idRegex,
  lonePropertiesRegex
};
