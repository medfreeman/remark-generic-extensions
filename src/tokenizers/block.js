import { blockExtensionRegex } from "../utils/regexes.js";
import { get } from "../utils/object";
import { trim, trimNewLines } from "../utils/string";

import commonTokenizer from "./common";

function blockExtensionTokenizer(eat, value, silent, settings, warning, debug) {
  const match = blockExtensionRegex.exec(value);
  if (match) {
    /* istanbul ignore if */
    if (silent) return true;

    const element = {
      name: match[1],
      argument: match[2] ? match[2] : undefined,
      content: trimNewLines(match[3])
    };

    const propertiesString = match[4] ? trim(match[4]) : undefined;

    debug(`Block extension \`${element.name}\` found`);
    debug(`Full match: "${match[0]}"`);

    const elementSettings = get(settings, `elements.${element.name}`, {});

    return eat(match[0])(
      commonTokenizer(
        "block-extension",
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

export default blockExtensionTokenizer;
