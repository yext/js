import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalRichTextProps } from "./types.js";
import { generateConfig } from "./methods.js";

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
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={<div></div>}
      />
      <ListPlugin />
    </LexicalComposer>
  );
}
