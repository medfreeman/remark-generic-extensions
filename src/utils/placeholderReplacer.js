import { keys, entries } from "../utils/object";
import { forEach } from "../utils/array";
import { startsWith } from "../utils/string";

const replacePlaceholder = (inputString, element, affix) => {
  const foundPlaceholders = {};

  const outputString = inputString
    ? inputString.replace(
        new RegExp(
          affix +
            "(content|argument|prop" +
            affix +
            "(" +
            Object::keys(element.properties).join("|") +
            "))" +
            affix
        ),
        (match, s1, s2) => {
          if (s1::startsWith("prop")) {
            if (!foundPlaceholders.properties) {
              foundPlaceholders.properties = {};
            }
            foundPlaceholders.properties[s2] = true;
            return element.properties[s2];
          } else {
            foundPlaceholders[s1] = true;
            return element[s1];
          }
        }
      )
    : undefined;

  return {
    newValue: outputString,
    foundPlaceholders
  };
};

/*
  Replace the placeholders on any level
  of the pseudo hast tree by their corresponding
  property and populate the found placeholders object
*/
const replacePlaceholdersInObject = (propertiesObject, element, affix) => {
  const newPropertiesObject = {};
  let allFoundPlaceholders = {};

  Object::entries(propertiesObject)::forEach(([key, value]) => {
    if (typeof value === "string") {
      const { newValue, foundPlaceholders } = replacePlaceholder(
        value,
        element,
        affix
      );

      newPropertiesObject[key] = newValue;
      allFoundPlaceholders = {
        ...allFoundPlaceholders,
        ...foundPlaceholders
      };
    } else {
      newPropertiesObject[key] = value;
    }
  });

  return {
    newObject: newPropertiesObject,
    foundPlaceholdersInObject: allFoundPlaceholders
  };
};

export { replacePlaceholder, replacePlaceholdersInObject };
