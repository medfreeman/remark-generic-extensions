import { prettify } from "../utils/object";
import propertiesExtractor from "../utils/propertiesExtractor";
import hastTree from "../renderers/hastTree";

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

  debug("Computed properties: " + prettify(element.properties));

  return hastTree(
    type,
    element,
    elementSettings.html,
    placeholderAffix,
    warning,
    debug
  );
}

export default commonTokenizer;
