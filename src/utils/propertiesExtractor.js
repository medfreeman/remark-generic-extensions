import {
  keyValueQuotedPropertiesRegex,
  keyValuePropertiesRegex,
  classNameRegex,
  idRegex,
  lonePropertiesRegex
} from "./regexes.js";

const propertiesExtractor = (propertiesString, propsDefaultValues) => {
  const properties = {};
  const classNamesArray = [];

  let propertiesLeft = propertiesString;

  // Extract key/value pairs surrounded by quotes i.e `foo="bar baz"`
  propertiesLeft = propertiesLeft.replace(
    keyValueQuotedPropertiesRegex,
    (match, s1, s2) => {
      properties[s1] = s2;
      return "";
    }
  );

  // Extract key/value pairs not surrounded by quotes i.e `foo=bar`
  propertiesLeft = propertiesLeft.replace(
    keyValuePropertiesRegex,
    (match, s1, s2) => {
      properties[s1] = s2;
      return "";
    }
  );

  // Extract classnames i.e `.yeah`
  propertiesLeft = propertiesLeft.replace(classNameRegex, (match, s1) => {
    classNamesArray.push(s1);
    return "";
  });
  if (classNamesArray.length) {
    properties.className = classNamesArray.join(" ");
  }

  // Extract ids i.e `#heyy`, last one is kept if multiple are specified
  propertiesLeft = propertiesLeft.replace(idRegex, (match, s1) => {
    properties.id = s1;
    return "";
  });

  // Extract lone properties i.e `alone`
  propertiesLeft = propertiesLeft.replace(lonePropertiesRegex, (match, s1) => {
    properties[s1] = propsDefaultValues[s1] || "";
    return "";
  });

  return {
    properties,
    propertiesLeft
  };
};

export default propertiesExtractor;
