import { EditorThemeClasses } from "lexical";
import styles from "./default-styling.module.css";

/**
 * Tailwind styling for the different Tokens that can occur within a Code Block.
 * Token Types come from the PrismJS library, which Lexical uses to power Code Blocks.
 * The Types include Comment, Variable, Operator, etc.
 */
const styleSuffixesToTokenTypes = {
  tokenAttr: ["atrule", "attr", "keyword"],
  tokenProperty: [
    "boolean",
    "constant",
    "deleted",
    "number",
    "property",
    "symbol",
    "tag",
  ],
  tokenComment: ["cdata", "comment", "doctype", "prolog"],
  tokenFunction: ["class", "class-name", "function"],
  tokenSelector: ["builtin", "char", "inserted", "selector", "string"],
  tokenVariable: ["important", "namespace", "regex", "variable"],
  tokenOperator: ["entity", "operator", "url"],
  tokenPunctuation: ["punctuation"],
};

/**
 * Default styling to apply to the different types of Lexical Rich Text
 * Elements.
 */
const DefaultNodeStyling: EditorThemeClasses = {
  ...Object.fromEntries(
    [
      "characterLimit",
      "code",
      "hashtag",
      "image",
      "link",
      "ltr",
      "mark",
      "markOverlap",
      "paragraph",
      "quote",
      "rtl",
      "table",
      "tableCell",
      "tableCellHeader",
    ].map((node) => [node, getStyleFromSuffix(node)])
  ),
  codeHighlight: Object.fromEntries(
    Object.entries(styleSuffixesToTokenTypes).flatMap(
      ([styleSuffix, tokenTypes]) =>
        tokenTypes.map((type) => [type, getStyleFromSuffix(styleSuffix)])
    )
  ),
  embedBlock: {
    base: getStyleFromSuffix("embedBlock"),
    focus: getStyleFromSuffix("embedBlockFocus"),
  },
  heading: Object.fromEntries(
    ["h1", "h2", "h3", "h4", "h5", "h6"].map((node) => [
      node,
      getStyleFromSuffix(node),
    ])
  ),
  list: {
    listitem: getStyleFromSuffix("listItem"),
    listitemChecked: getStyleFromSuffix("listItemChecked"),
    listitemUnchecked: getStyleFromSuffix("listItemUnchecked"),
    nested: {
      listitem: getStyleFromSuffix("nestedListItem"),
    },
    olDepth: ["ol1", "ol2", "ol3", "ol4", "ol5"].map(getStyleFromSuffix),
    ulDepth: ["ul1", "ul2", "ul3"].map(getStyleFromSuffix),
  },
  text: Object.fromEntries(
    [
      "bold",
      "code",
      "italic",
      "strikethrough",
      "subscript",
      "superscript",
      "underline",
      "underlineStrikethrough",
    ].map((node) => [node, getStyleFromSuffix(`text${capitalize(node)}`)])
  ),
};

function capitalize(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function getStyleFromSuffix(suffix: string) {
  return styles[`yext-default-richtextv2-theme__${suffix}`];
}

export default DefaultNodeStyling;
