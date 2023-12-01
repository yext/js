import { codes } from 'micromark-util-symbol/codes.js';
import { Extension, Construct } from 'micromark-util-types';
import { tokenizeStrikethroughSubscript } from './tokenizer.js';
import { resolveAllStrikethroughSubscript } from './resolver.js';

/**
 * A micromark syntax extension to support strikethrough and subscript.
 */
export function yextStrikethroughSubscript(): Extension {
  const tokenizer: Construct = {
    tokenize: tokenizeStrikethroughSubscript,
    resolveAll: resolveAllStrikethroughSubscript
  };

  return {
    text: { [codes.tilde]: tokenizer },
    insideSpan: { null: [tokenizer] }
  };
}
