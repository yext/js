const {
  $getListDepth,
  $isListItemNode,
  $isListNode,
} = /** @type {LexicalListJS} */ (require('@lexical/list'));
const {
  INDENT_CONTENT_COMMAND,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
} = /** @type {LexicalJS} */ (require('lexical'));
const {useLexicalComposerContext} = /** @type {useLexicalComposerContextJS} */ (require('@lexical/react/LexicalComposerContext'));
function getElementNodesInSelection(selection) {
  const nodesInSelection = selection.getNodes();
  if (nodesInSelection.length === 0) {
    return new Set([
      selection.anchor.getNode().getParentOrThrow(),
      selection.focus.getNode().getParentOrThrow(),
    ]);
  }
  return new Set(
    nodesInSelection.map(n => ($isElementNode(n) ? n : n.getParentOrThrow())),
  );
}
const highPriority = 3;
function isIndentPermitted(maxDepth) {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) {
    return false;
  }
  const elementNodesInSelection = getElementNodesInSelection(selection);
  let totalDepth = 0;
  for (const elementNode of elementNodesInSelection) {
    if ($isListNode(elementNode)) {
      totalDepth = Math.max($getListDepth(elementNode) + 1, totalDepth);
    } else if ($isListItemNode(elementNode)) {
      const parent = elementNode.getParent();
      if (!$isListNode(parent)) {
        throw new Error(
          'ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.',
        );
      }
      totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
    }
  }
  return totalDepth <= maxDepth;
}
export default function ListMaxIndentLevelPlugin({maxDepth}) {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => !isIndentPermitted(maxDepth || 7),
      highPriority,
    );
  }, [editor, maxDepth]);
  return null;
}