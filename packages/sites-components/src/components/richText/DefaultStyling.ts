import { EditorThemeClasses } from "lexical";
import styles from "./default-styling.module.css";

/**
 * Default styling to apply to the different types of Lexical Rich Text
 * Elements.
 */
const DefaultNodeStyling: EditorThemeClasses = {
  characterLimit: styles["yext-default-richtextv2-theme__characterLimit"],
  code: styles["yext-default-richtextv2-theme__code"],
  codeHighlight: {
    atrule: styles["yext-default-richtextv2-theme__tokenAttr"],
    attr: styles["yext-default-richtextv2-theme__tokenAttr"],
    boolean: styles["yext-default-richtextv2-theme__tokenProperty"],
    builtin: styles["yext-default-richtextv2-theme__tokenSelector"],
    cdata: styles["yext-default-richtextv2-theme__tokenComment"],
    char: styles["yext-default-richtextv2-theme__tokenSelector"],
    class: styles["yext-default-richtextv2-theme__tokenFunction"],
    "class-name": styles["yext-default-richtextv2-theme__tokenFunction"],
    comment: styles["yext-default-richtextv2-theme__tokenComment"],
    constant: styles["yext-default-richtextv2-theme__tokenProperty"],
    deleted: styles["yext-default-richtextv2-theme__tokenProperty"],
    doctype: styles["yext-default-richtextv2-theme__tokenComment"],
    entity: styles["yext-default-richtextv2-theme__tokenOperator"],
    function: styles["yext-default-richtextv2-theme__tokenFunction"],
    important: styles["yext-default-richtextv2-theme__tokenVariable"],
    inserted: styles["yext-default-richtextv2-theme__tokenSelector"],
    keyword: styles["yext-default-richtextv2-theme__tokenAttr"],
    namespace: styles["yext-default-richtextv2-theme__tokenVariable"],
    number: styles["yext-default-richtextv2-theme__tokenProperty"],
    operator: styles["yext-default-richtextv2-theme__tokenOperator"],
    prolog: styles["yext-default-richtextv2-theme__tokenComment"],
    property: styles["yext-default-richtextv2-theme__tokenProperty"],
    punctuation: styles["yext-default-richtextv2-theme__tokenPunctuation"],
    regex: styles["yext-default-richtextv2-theme__tokenVariable"],
    selector: styles["yext-default-richtextv2-theme__tokenSelector"],
    string: styles["yext-default-richtextv2-theme__tokenSelector"],
    symbol: styles["yext-default-richtextv2-theme__tokenProperty"],
    tag: styles["yext-default-richtextv2-theme__tokenProperty"],
    url: styles["yext-default-richtextv2-theme__tokenOperator"],
    variable: styles["yext-default-richtextv2-theme__tokenVariable"],
  },
  embedBlock: {
    base: styles["yext-default-richtextv2-theme__embedBlock"],
    focus: styles["yext-default-richtextv2-theme__embedBlockFocus"],
  },
  hashtag: styles["yext-default-richtextv2-theme__hashtag"],
  heading: {
    h1: styles["yext-default-richtextv2-theme__h1"],
    h2: styles["yext-default-richtextv2-theme__h2"],
    h3: styles["yext-default-richtextv2-theme__h3"],
    h4: styles["yext-default-richtextv2-theme__h4"],
    h5: styles["yext-default-richtextv2-theme__h5"],
    h6: styles["yext-default-richtextv2-theme__h6"],
  },
  image: styles["yext-default-richtextv2-theme__image"],
  link: styles["yext-default-richtextv2-theme__link"],
  list: {
    listitem: styles["yext-default-richtextv2-theme__listItem"],
    listitemChecked: styles["yext-default-richtextv2-theme__listItemChecked"],
    listitemUnchecked:
      styles["yext-default-richtextv2-theme__listItemUnchecked"],
    nested: {
      listitem: styles["yext-default-richtextv2-theme__nestedListItem"],
    },
    olDepth: [
      styles["yext-default-richtextv2-theme__ol1"],
      styles["yext-default-richtextv2-theme__ol2"],
      styles["yext-default-richtextv2-theme__ol3"],
      styles["yext-default-richtextv2-theme__ol4"],
      styles["yext-default-richtextv2-theme__ol5"],
    ],
    ulDepth: [
      styles["yext-default-richtextv2-theme__ul1"],
      styles["yext-default-richtextv2-theme__ul2"],
      styles["yext-default-richtextv2-theme__ul3"],
    ],
  },
  ltr: styles["yext-default-richtextv2-theme__ltr"],
  mark: styles["yext-default-richtextv2-theme__mark"],
  markOverlap: styles["yext-default-richtextv2-theme__markOverlap"],
  paragraph: styles["yext-default-richtextv2-theme__paragraph"],
  quote: styles["yext-default-richtextv2-theme__quote"],
  rtl: styles["yext-default-richtextv2-theme__rtl"],
  table: styles["yext-default-richtextv2-theme__table"],
  tableCell: styles["yext-default-richtextv2-theme__tableCell"],
  tableCellHeader: styles["yext-default-richtextv2-theme__tableCellHeader"],
  text: {
    bold: styles["yext-default-richtextv2-theme__textBold"],
    code: styles["yext-default-richtextv2-theme__textCode"],
    italic: styles["yext-default-richtextv2-theme__textItalic"],
    strikethrough: styles["yext-default-richtextv2-theme__textStrikethrough"],
    subscript: styles["yext-default-richtextv2-theme__textSubscript"],
    superscript: styles["yext-default-richtextv2-theme__textSuperscript"],
    underline: styles["yext-default-richtextv2-theme__textUnderline"],
    underlineStrikethrough:
      styles["yext-default-richtextv2-theme__textUnderlineStrikethrough"],
  },
};

export default DefaultNodeStyling;
