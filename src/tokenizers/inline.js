import { inlineExtensionRegex } from "../utils/regexes.js";
import { get } from "../utils/object";
import { trim } from "../utils/string";
import { vfileDebug, vfileWarning } from "../utils/eat";

import commonTokenizer from "./common";

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
      argument: match[3] ? match[3] : undefined
    };

    const propertiesString = match[4] ? match[4]::trim() : undefined;

    debug(`Inline extension \`${element.name}\` found`);
    debug(`Full match: "${match[0]}"`);

    const elementSettings = settings::get(`elements.${element.name}`, {});

    return eat(match[0])(
      commonTokenizer(
        element,
        propertiesString,
        elementSettings,
        settings.placeholderAffix,
        warning,
        debug
      )
    );
  }
}

export default inlineExtensionTokenizer;
