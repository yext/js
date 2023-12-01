import { codes } from "micromark-util-symbol/codes.js";
import { Extension, Construct } from "micromark-util-types";
import { tokenizeUnderline } from "./tokenizer.js";
import { resolveAllUnderline } from "./resolver.js";

/**
 * A micromark syntax extension to support underline.
 */
export function yextUnderline(): Extension {
  const tokenizer: Construct = {
    tokenize: tokenizeUnderline,
    resolveAll: resolveAllUnderline,
  };

  return {
    text: { [codes.plusSign]: tokenizer },
    insideSpan: { null: [tokenizer] },
  };
}
