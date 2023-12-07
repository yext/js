import { useEffect } from "react";
import { $getListDepth, $isListItemNode, $isListNode } from "@lexical/list";
import {
  INDENT_CONTENT_COMMAND,
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  RangeSelection,
  ElementNode,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function getElementNodesInSelection(
  selection: RangeSelection
): Set<ElementNode> {
  const nodesInSelection = selection.getNodes();
  if (nodesInSelection.length === 0) {
    return new Set([
      selection.anchor.getNode().getParentOrThrow(),
      selection.focus.getNode().getParentOrThrow(),
    ]);
  }
  return new Set(
    nodesInSelection.map((n) => ($isElementNode(n) ? n : n.getParentOrThrow()))
  );
}

const HIGH_PRIORITY = 3;

function isIndentPermitted(maxDepth: number): boolean {
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
          "ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent."
        );
      }
      totalDepth = Math.max($getListDepth(parent) + 1, totalDepth);
    }
  }
  return totalDepth <= maxDepth;
}

export function ListMaxIndentLevelPlugin({ maxDepth }: { maxDepth: number }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      INDENT_CONTENT_COMMAND,
      () => !isIndentPermitted(maxDepth || 7),
      HIGH_PRIORITY
    );
  }, [editor, maxDepth]);
  return null;
}
