import merge from "deepmerge";

import { entries, prettify } from "../utils/object";
import { forEach } from "../utils/array";
import { replacePlaceholdersInObject } from "../utils/placeholderReplacer";
import parseHastChildrenTreeRecursive from "../utils/hastChildrenTreeParser";

function hastTree(
  type,
  element,
  hastInputTree = {},
  placeholderAffix,
  warning,
  debug
) {
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
  forEach(entries(element.properties), ([key, value]) => {
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

  debug("Hast output tree:\n" + prettify(hastOutputTree));

  // Return the output tree, while eating the original markdown
  return hastOutputTree;
}

export default hastTree;
