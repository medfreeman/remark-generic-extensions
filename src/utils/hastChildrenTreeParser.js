import { forEach } from "./array";
import {
  replacePlaceholder,
  replacePlaceholdersInObject
} from "./placeholderReplacer";

const parseHastChildrenTreeRecursive = (
  inputChildrenArray = [],
  element,
  affix
) => {
  const outputChildrenArray = [];
  let foundPlaceholdersInTree = {};

  inputChildrenArray::forEach(childElement => {
    // Extract the current level hast properties separated from structure
    const { type, tagName, value, children, properties = {} } = childElement;

    // Replace the placeholders in the current level of the tree
    const {
      newObject,
      foundPlaceholdersInObject
    } = replacePlaceholdersInObject(properties, element, affix);

    const newProperties = newObject;

    foundPlaceholdersInTree = {
      ...foundPlaceholdersInTree,
      ...foundPlaceholdersInObject
    };

    const { newValue, foundPlaceholders } = replacePlaceholder(
      value,
      element,
      affix
    );

    foundPlaceholdersInTree = {
      ...foundPlaceholdersInTree,
      ...foundPlaceholders
    };

    // Prepare the current level of the hast output tree
    const branch = {
      type: type ? type : "element",
      tagName: tagName ? tagName : undefined,
      value: newValue,
      properties: {
        ...newProperties
      }
    };

    const childrenProps = parseHastChildrenTreeRecursive(
      children,
      element,
      affix
    );

    // Add the current level tree branch to the output tree
    outputChildrenArray.push({
      children: childrenProps.outputChildrenArray,
      ...branch
    });

    foundPlaceholdersInTree = {
      ...foundPlaceholdersInTree,
      ...childrenProps.foundPlaceholdersInTree
    };
  });
  return {
    outputChildrenArray,
    foundPlaceholdersInTree
  };
};

export default parseHastChildrenTreeRecursive;
