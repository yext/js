import { InitialConfigType } from "@lexical/react/LexicalComposer";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { HashtagNode } from "@lexical/hashtag";
import { EditorThemeClasses } from "lexical";
import DefaultNodeStyling from "./DefaultStyling.js";
import { ImageNode } from "./imageNode/index.js";

/**
 * Configuration for the Lexical Editor that powers the {@link LexicalComposer}. There is
 * some additional configuration (error handling, theme) specifically for this Component itself.
 */
export function generateConfig(
  editorState: string,
  theme?: EditorThemeClasses
): InitialConfigType {
  return {
    namespace: "",
    editable: false,
    onError: (error) => {
      throw error;
    },
    editorState: editorState,
    theme: theme ?? DefaultNodeStyling,
    nodes: [
      HeadingNode,
      HashtagNode,
      ImageNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };
}
