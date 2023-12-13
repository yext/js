import { yextSyntax } from "./micromark-extension-yext/index.js";
import { Processor } from "unified";
import { Root } from "mdast";
import { yextFromMarkdown } from "./mdast-util-yext/index.js";
import { ok as assert } from "uvu/assert";

/**
 * Remark plugin to support Yext Markdown (underline, subscript, superscript,
 * and strikethrough).
 */
export default function remarkYext(this: Processor<any, Root, any, any>) {
  const data = this.data() as any;

  add("micromarkExtensions", yextSyntax());
  add("fromMarkdownExtensions", yextFromMarkdown());

  function add(field: string, value: unknown) {
    const fieldData = data[field];
    if (fieldData) {
      assert(Array.isArray(fieldData));
      fieldData.push(value);
    } else {
      data[field] = [value];
    }
  }
}
