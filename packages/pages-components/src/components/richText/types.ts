import { EditorThemeClasses } from "lexical";
import { type ContextEditableProps } from "@lexical/react/LexicalContentEditable";

/**
 * The shape of data passed to {@link LexicalRichText}.
 */
export interface LexicalRichTextProps {
  /** A JSON-serialized Lexical Dev AST. */
  serializedAST: string;
  /** CSS Class names for the various Lexical Node types. */
  nodeClassNames?: EditorThemeClasses;
  /** Props to be passed to the ContentEditable component. */
  contentEditableProps?: ContextEditableProps;
}
