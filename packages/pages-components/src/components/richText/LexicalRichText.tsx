import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalRichTextProps } from "./types.js";
import { generateConfig } from "./methods.js";
import styles from "./lexical.module.css";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";

/**
 * @deprecated Use the stream's .html version instead with `dangerouslySetInnerHTML`.
 * <div dangerouslySetInnerHTML={{ __html: c_lrt.html }} />
 *
 * Renders a read-only view of a Lexical Rich Text field. Styling for the various
 * types of Rich Text element can be optionally provided. If not provided, Yext default
 * styling will be applied.
 *
 * Note: This component currently only supports rendering on the client side.
 */
export function LexicalRichText({
  serializedAST,
  nodeClassNames,
}: LexicalRichTextProps) {
  const [html, setHtml] = useState("");

  return (
    <>
      <LexicalComposer
        initialConfig={generateConfig(serializedAST, nodeClassNames)}
      >
        <HtmlExportPlugin onHTML={setHtml} />
        <div className={`${styles["editor-inner"]} ${styles["no-border"]}`}>
          <div className={styles["editor-inner"]}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}

function HtmlExportPlugin({ onHTML }: { onHTML: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const html = $generateHtmlFromNodes(editor);
      onHTML(html);
    });
  }, [editor, onHTML]);

  return null;
}
