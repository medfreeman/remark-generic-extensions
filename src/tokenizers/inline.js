import { inlineExtensionRegex } from "../utils/regexes.js";
import { entries, get, prettify } from "../utils/object";
import { forEach } from "../utils/array";
import { trim } from "../utils/string";
import { vfileDebug, vfileWarning } from "../utils/eat";
import propertiesExtractor from "../utils/propertiesExtractor";
import {
  replacePlaceholder,
  replacePlaceholdersInObject
} from "../utils/placeholderReplacer";

function inlineExtensionTokenizer(eat, value, silent, settings) {
  const match = inlineExtensionRegex.exec(value);
  if (match) {
    /* istanbul ignore if */
    if (silent) return true;

    const debug = settings.debug ? eat::vfileDebug : () => {};
    const warning = eat::vfileWarning;

    const element = {
      name: match[1],
      content: match[2] ? match[2] : undefined,
      argument: match[3] ? match[3] : undefined,
      properties: {
        id: undefined,
        className: undefined
      }
    };

    const propertiesString = match[4] ? match[4]::trim() : undefined;

    debug(`Inline extension \`${element.name}\` found`);
    debug(`Full match: "${match[0]}"`);
    debug(`Content: "${element.content || ""}"`);
    debug(`Argument: "${element.argument || ""}"`);
    debug(`Properties string: "${propertiesString || ""}"`);

    if (propertiesString) {
      const { properties, propertiesLeft } = propertiesExtractor(
        propertiesString,
        settings::get(`elements.${element.name}.propsDefaultValues`, {})
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
    const hastInputTree = settings::get(`elements.${element.name}.html`, {});
    // Extract the first-level hast properties separated from structure
    const { tagName, children, properties = {} } = hastInputTree;

    // Prepare the final hast tree
    const hastOutputTree = {
      type: "inline-extension",
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
    const {
      newObject,
      foundPlaceholdersInObject
    } = replacePlaceholdersInObject(
      properties,
      element,
      settings.placeholderAffix
    );

    const newProperties = newObject;

    foundPlaceholdersInElement = {
      ...foundPlaceholdersInElement,
      ...foundPlaceholdersInObject
    };

    const parseHastChildrenTreeRecursive = (inputChildrenArray = []) => {
      const outputChildrenArray = [];
      inputChildrenArray::forEach(childElement => {
        // Extract the current level hast properties separated from structure
        const {
          type,
          tagName,
          value,
          children,
          properties = {}
        } = childElement;

        // Replace the placeholders in the current level of the tree
        const {
          newObject,
          foundPlaceholdersInObject
        } = replacePlaceholdersInObject(
          properties,
          element,
          settings.placeholderAffix
        );

        const newProperties = newObject;
        foundPlaceholdersInElement = {
          ...foundPlaceholdersInElement,
          ...foundPlaceholdersInObject
        };

        const { newValue, foundPlaceholders } = replacePlaceholder(
          value,
          element,
          settings.placeholderAffix
        );

        foundPlaceholdersInElement = {
          ...foundPlaceholdersInElement,
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

        // Add the current level tree branch to the output tree
        outputChildrenArray.push({
          children: parseHastChildrenTreeRecursive(children),
          ...branch
        });
      });
      return outputChildrenArray;
    };

    hastOutputTree.data.hChildren = parseHastChildrenTreeRecursive(children);

    // For each property found in markdown
    Object::entries(element.properties)::forEach(([key, value]) => {
      // If the property was not referenced by a placeholder
      if (!foundPlaceholdersInElement::get(`properties.${key}`, undefined)) {
        // Set the corresponding property to the first-level html element
        newProperties[key] = value;
      }
    });

    // Assign the first-level properties to the hast node
    hastOutputTree.data.hProperties = newProperties;

    debug("Hast output tree:\n" + hastOutputTree::prettify());

    // Return the output tree, while eating the original markdown
    return eat(match[0])(hastOutputTree);
  }
}

export default inlineExtensionTokenizer;
