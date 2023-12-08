import { SerializedLexicalNode, Spread } from "lexical";

export interface LexicalImageProps {
  src: string;
  altText: string;
  maxWidth: number;
  width: "inherit" | number;
  height: "inherit" | number;
}

/**
 * The raw Object obtained when first parsing a serialized {@link ImageNode}.
 */
export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    type: "image";
    version: 1;
  },
  SerializedLexicalNode
>;
