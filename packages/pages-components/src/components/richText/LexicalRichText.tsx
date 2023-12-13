import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import {
  CodeHighlightPlugin,
  ImagePlugin,
  ListMaxIndentLevelPlugin,
} from "./plugins/index.js";
import { LexicalRichTextProps } from "./types.js";
import { generateConfig } from "./methods.js";
import styles from "./lexical.module.css";

/**
 * Renders a read-only view of a Lexical Rich Text field. Styling for the various
 * types of Rich Text element can be optionally provided. If not provided, Yext default
 * styling will be applied.
 */
export function LexicalRichText({
  serializedAST,
  nodeClassNames,
}: LexicalRichTextProps) {
  return (
    <LexicalComposer
      initialConfig={generateConfig(serializedAST, nodeClassNames)}
    >
      <div className={`${styles["editor-inner"]} ${styles["no-border"]}`}>
        <div className={styles["editor-inner"]}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                ariaLabel="Lexical Rich Text"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
            placeholder={<div></div>}
          />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <ImagePlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
        </div>
      </div>
    </LexicalComposer>
  );
}
