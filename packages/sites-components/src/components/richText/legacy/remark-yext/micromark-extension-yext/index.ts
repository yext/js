import { combineExtensions } from "micromark-util-combine-extensions";
import { yextStrikethroughSubscript } from "./strikethrough-subscript/index.js";
import { yextSuperscript } from "./superscript/index.js";
import { yextUnderline } from "./underline/index.js";

/**
 * A function that returns a micromark syntax extension to support Yext Markdown.
 */
export function yextSyntax() {
  return combineExtensions([
    yextUnderline(),
    yextSuperscript(),
    yextStrikethroughSubscript(),
  ]);
}
