
/** @return {ImageNode} */
export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  key,
  originalSrc,
}) {
  return $applyNodeReplacement(
    new ImageNode(
      src,
      altText,
      maxWidth,
      width,
      height,
      key,
      originalSrc,
    ),
  );
}
export function $isImageNode(node) {
  return node instanceof ImageNode;
}