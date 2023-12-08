import { ReactElement, useEffect, useState } from "react";
import remarkYext from "./remark-yext/remarkYext.js";
import {
  emphasisHandler,
  strikethroughHandler,
  strongHandler,
  subscriptHandler,
  superscriptHandler,
  underlineHandler,
} from "./remark-yext/handlers.js";
import { Handler } from "mdast-util-to-hast";
import { Root } from "mdast";
import { Processor } from "unified";

/**
 * Handlers for converting Yext Markdown-specific MDAST nodes to HAST nodes.
 * For use with remark-rehype.
 */
const yextRemarkRehypeHandlers: Record<string, Handler> = {
  emphasis: emphasisHandler,
  strong: strongHandler,
  underline: underlineHandler,
  strikethrough: strikethroughHandler,
  subscript: subscriptHandler,
  superscript: superscriptHandler,
};

/**
 * A Component for rendering the legacy rich text field. This field's value
 * is stored as "Yext" Markdown.
 */
export const LegacyRichText = (props: { markdown: string }) => {
  const [RenderedMarkdown, setRenderedMarkdown] = useState<ReactElement>();

  let ReactMarkdown: (arg0: {
    children: string;
    remarkPlugins: ((this: Processor<void, Root, void, void>) => void)[];
    remarkRehypeOptions: { handlers: Record<string, Handler> };
  }) => any;
  useEffect(() => {
    const renderMarkdown = async () => {
      if (!ReactMarkdown) {
        try {
          ReactMarkdown = (await import("react-markdown")).default;
        } catch (err) {
          throw new Error(
            "Failed to import React Markdown, cannot properly render LegacyRichText."
          );
        }
      }

      const renderedMarkdown = ReactMarkdown({
        children: props.markdown,
        remarkPlugins: [remarkYext],
        remarkRehypeOptions: {
          handlers: yextRemarkRehypeHandlers,
        },
      });

      setRenderedMarkdown(renderedMarkdown);
    };

    renderMarkdown();
  }, [props.markdown]);

  return RenderedMarkdown ? RenderedMarkdown : null;
};
