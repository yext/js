import React, { ReactElement, useEffect, useState } from "react";
import remarkYext from './remark-yext/remarkYext.js'
import {
  emphasisHandler,
  strikethroughHandler,
  strongHandler,
  subscriptHandler,
  superscriptHandler,
  underlineHandler
} from './remark-yext/handlers.js';
import { Handler } from "mdast-util-to-hast";

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
  superscript: superscriptHandler
};

/**
 * A Component for rendering the legacy rich text field. This field's value
 * is stored as "Yext" Markdown.
 */
export default function LegacyRichText(props: {markdown: string}) {
  const [RenderedMarkdown, setRenderedMarkdown] = useState<ReactElement>();

  useEffect(() => {
    const loadComponent = async () => (await import("react-markdown")).default;
    loadComponent().then(renderMarkdown => {
      const renderedMarkdown = renderMarkdown({ children: props.markdown, remarkPlugins: [remarkYext],
        remarkRehypeOptions: {
           handlers: yextRemarkRehypeHandlers
         } });
      setRenderedMarkdown(renderedMarkdown);
    });
  }, []);

  return RenderedMarkdown ? RenderedMarkdown : null;
}