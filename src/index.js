import joi from "joi";

import optionsSchema from "./utils/optionsSchema";
import inlineExtensionLocator from "./locators/inline";
import inlineExtensionTokenizer from "./tokenizers/inline";
import blockExtensionTokenizer from "./tokenizers/block";
import { prettify } from "./utils/object";
import { escapeRegExp } from "./utils/string";
import { vfileDebug, vfileWarning } from "./utils/eat";

const getLogFunctions = (eat, debugEnabled) => {
  const warning = eat::vfileWarning;
  const debug = debugEnabled ? eat::vfileDebug : () => {};
  return {
    warning,
    debug
  };
};

function remarkGenericExtensions(options = {}) {
  const optionsValidation = joi.validate(options, optionsSchema);

  if (optionsValidation.error !== null) {
    console.error(
      "Invalid options provided:\n" +
        options::prettify() +
        "\n\n" +
        "returned:\n" +
        optionsValidation::prettify()
    );
    return false;
  }

  const settings = {
    debug: false,
    placeholderAffix: "::",
    elements: {},
    ...options
  };

  // Escape the user provided placeholder affix for use in regex
  settings.placeholderAffix = settings.placeholderAffix::escapeRegExp();

  const Parser = this.Parser;

  const inlineTokenizers = Parser.prototype.inlineTokenizers;
  const inlineMethods = Parser.prototype.inlineMethods;

  const inlineExtensionWrapper = (eat, value, silent) => {
    const { warning, debug } = getLogFunctions(eat, settings.debug);
    return inlineExtensionTokenizer(
      eat,
      value,
      silent,
      settings,
      warning,
      debug
    );
  };

  inlineExtensionWrapper.notInLink = true;
  inlineExtensionWrapper.locator = inlineExtensionLocator;
  inlineTokenizers.extension = inlineExtensionWrapper;

  inlineMethods.splice(inlineMethods.indexOf("text"), 0, "extension");

  const blockTokenizers = Parser.prototype.blockTokenizers;
  const blockMethods = Parser.prototype.blockMethods;

  const blockExtensionWrapper = (eat, value, silent) => {
    const { warning, debug } = getLogFunctions(eat, settings.debug);
    return blockExtensionTokenizer(
      eat,
      value,
      silent,
      settings,
      warning,
      debug
    );
  };

  blockTokenizers.extension = blockExtensionWrapper;

  blockMethods.splice(blockMethods.indexOf("paragraph"), 0, "extension");
}

export default remarkGenericExtensions;
