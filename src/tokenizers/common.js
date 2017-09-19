import merge from "deepmerge";

import { entries, prettify } from "../utils/object";
import { forEach } from "../utils/array";
import propertiesExtractor from "../utils/propertiesExtractor";
import { replacePlaceholdersInObject } from "../utils/placeholderReplacer";
import parseHastChildrenTreeRecursive from "../utils/hastChildrenTreeParser";

function commonTokenizer(
  type,
  rawElement,
  propertiesString,
  elementSettings,
  placeholderAffix,
  warning,
  debug
) {
  const element = {
    ...rawElement,
    properties: {
      id: undefined,
      className: undefined
    }
  };

  debug(`Content: "${element.content || ""}"`);
  debug(`Argument: "${element.argument || ""}"`);
  debug(`Properties string: "${propertiesString || ""}"`);

  if (propertiesString) {
    const { properties, propertiesLeft } = propertiesExtractor(
      propertiesString,
      elementSettings.propsDefaultValues || {}
    );
    element.properties = properties;

    if (propertiesLeft && propertiesLeft !== "") {
      warning(
        `There was some invalid properties: "${propertiesLeft}" ` +
          `was left after the processing of "${propertiesString}"`
      );
    }
  }

  debug("Computed properties: " + element.properties::prettify());

  // Fetch the user provided pseudo hast tree
  const hastInputTree = elementSettings.html || {};
  // Extract the first-level hast properties separated from structure
  const { tagName, children, properties = {} } = hastInputTree;

  // Prepare the final hast tree
  const hastOutputTree = {
    type: type,
    data: {
      hName: tagName ? tagName : element.name
    }
  };

  /*
    Prepare the found placeholders object
    The replacements that have *NOT* been provided
    will have their corresponding properties
    applied to the top-level html element later
  */
  let foundPlaceholdersInElement = {
    content: false,
    argument: false,
    properties: {
      id: false,
      className: false
    }
  };

  // Replace the placeholders in the first-level of the tree
  const { newObject, foundPlaceholdersInObject } = replacePlaceholdersInObject(
    properties,
    element,
    placeholderAffix
  );

  const newProperties = newObject;

  foundPlaceholdersInElement = merge(
    foundPlaceholdersInElement,
    foundPlaceholdersInObject
  );

  const {
    outputChildrenArray,
    foundPlaceholdersInTree
  } = parseHastChildrenTreeRecursive(children, element, placeholderAffix);

  hastOutputTree.data.hChildren = outputChildrenArray;

  foundPlaceholdersInElement = merge(
    foundPlaceholdersInElement,
    foundPlaceholdersInTree
  );

  // For each property found in markdown
  Object::entries(element.properties)::forEach(([key, value]) => {
    // If the property was not referenced by a placeholder
    if (!foundPlaceholdersInElement.properties[key]) {
      // Set the corresponding property to the first-level html element
      newProperties[key] = value;
    }
  });

  if (type === "block-extension") {
    if (!foundPlaceholdersInElement.content) {
      // Set the content on a child text element
      hastOutputTree.data.hChildren.push({
        type: "text",
        value: element.content
      });
    }
  }

  // Assign the first-level properties to the hast node
  hastOutputTree.data.hProperties = newProperties;

  debug("Hast output tree:\n" + hastOutputTree::prettify());

  // Return the output tree, while eating the original markdown
  return hastOutputTree;
}

export default commonTokenizer;
