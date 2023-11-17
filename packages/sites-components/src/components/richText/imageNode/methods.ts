import { $applyNodeReplacement } from "lexical";
import { ImageNode } from "./ImageNode.js";

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
}: {
  src: string;
  altText: string;
  maxWidth?: number;
  width?: number | "inherit";
  height?: number | "inherit";
  key?: string;
}): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, altText, maxWidth, width, height, key)
  );
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
