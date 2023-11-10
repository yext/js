import { EditorThemeClasses } from "lexical";

/**
 * Tailwind styling for the different Tokens that can occur within a Code Block.
 * Token Types come from the PrismJS library, which Lexical uses to power Code Blocks.
 * The Types include Comment, Variable, Operator, etc.
 */
const stylesToTokenTypes = {
  "text-sky-700": ["atrule", "attr", "keyword"],
  "text-pink-800": [
    "boolean",
    "constant",
    "deleted",
    "number",
    "property",
    "symbol",
    "tag",
  ],
  "text-slate-500": ["cdata", "comment", "doctype", "prolog"],
  "text-rose-500": ["class", "function"],
  "text-lime-600": ["builtin", "char", "inserted", "selector", "string"],
  "text-amber-500": ["important", "namespace", "regex", "variable"],
  "text-yellow-700": ["entity", "operator", "url"],
  "text-neutral-400": ["punctuation"],
};

/**
 * Default styling to apply to the different types of Lexical Rich Text
 * Elements.
 */
const DefaultNodeStyling: EditorThemeClasses = {
  paragraph: "m-0 mb-2 relative",
  link: "text-blue-500",
  heading: {
    h1: "text-2xl font-normal m-0 mb-3 p-0",
    h2: "text-sm text-gray-600 font-bold m-0 mt-2 p-0 uppercase",
    h3: "text-xs m-0 uppercase font-bold",
  },
  text: {
    code: "bg-slate-200 p-0.5",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "[text-decoration:underline_line-through]",
  },
  list: {
    ul: "p-0 m-0 ml-4 list-disc",
    ol: "p-0 m-0 ml-4, list-decimal",
    listitem: "mx-8 my-0",
    nested: {
      listitem: "list-none",
    },
    olDepth: [
      "p-0 m-0 ml-4 list-decimal list-inside",
      "p-0 m-0 ml-4 list-upper_alpha list-inside",
      "p-0 m-0 ml-4 list-lower_alpha list-inside",
      "p-0 m-0 ml-4 list-upper_roman list-inside",
      "p-0 m-0 ml-4 list-lower_roman list-inside",
    ],
    ulDepth: [
      "p-0 m-0 ml-4 list-disc list-inside",
      "p-0 m-0 ml-4 list-square list-inside",
      "p-0 m-0 ml-4 list-circle list-inside",
    ],
  },
  ltr: "text-left",
  code: "bg-gray-100 block text-xs m-0 mt-2 mb-2 overflow-x-auto relative p-2",
  codeHighlight: Object.fromEntries(
    Object.entries(stylesToTokenTypes).flatMap(([style, tokenTypes]) =>
      tokenTypes.map((type) => [type, style])
    )
  ),
  quote: "m-0 ml-5 text-sm text-gray-500 border-l-4 pl-4",
  table: "w-11/12 max-w-full overflow-y-scroll my-7",
  tableCellHeader: "bg-gray-200 text-start",
  tableCell: "p-2 align-top relative border border-gray-400",
};

export default DefaultNodeStyling;
