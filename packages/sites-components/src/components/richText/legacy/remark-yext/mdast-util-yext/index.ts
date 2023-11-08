import { Extension } from 'mdast-util-from-markdown';
import { strikethroughFromMarkdown } from './strikethrough.js';
import { subscriptFromMarkdown } from './subscript.js';
import { superscriptFromMarkdown } from './superscript.js';
import { underlineFromMarkdown } from './underline.js';

/**
 * A function that returns the fromMarkdown mdast extensions to support Yext Markdown.
 */
export function yextFromMarkdown(): Extension[] {
  return [
    underlineFromMarkdown,
    strikethroughFromMarkdown,
    subscriptFromMarkdown,
    superscriptFromMarkdown
  ];
}
