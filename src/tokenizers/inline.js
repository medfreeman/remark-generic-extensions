import { inlineExtensionRegex } from "../utils/regexes.js";
import { get } from "../utils/object";
import { trim } from "../utils/string";

import commonTokenizer from "./common";

function inlineExtensionTokenizer(
  eat,
  value,
  silent,
  settings,
  warning,
  debug
) {
  const match = inlineExtensionRegex.exec(value);
  if (match) {
    /* istanbul ignore if */
    if (silent) return true;

    const element = {
      name: match[1],
      content: match[2] ? match[2] : undefined,
      argument: match[3] ? match[3] : undefined
    };

    const propertiesString = match[4] ? trim(match[4]) : undefined;

    debug(`Inline extension \`${element.name}\` found`);
    debug(`Full match: "${match[0]}"`);

    const elementSettings = get(settings, `elements.${element.name}`, {});

    return eat(match[0])(
      commonTokenizer(
        "inline-extension",
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
