const {useLexicalComposerContext} = /** @type {useLexicalComposerContextJS} */ (require('@lexical/react/LexicalComposerContext'));
const {$wrapNodeInElement, mergeRegister} = /** @type {LexicalUtilsJS} */ (require('@lexical/utils'));
const {
  $createRangeSelection,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_HIGH,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
  createCommand,
} = /** @type {LexicalJS} */ (require('lexical'));
import {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from '/src/com/yext/knowledgeapplications/js/field/rich-text-v2/nodes/ImageNode';
const CAN_USE_DOM = typeof window !== 'undefined'
  && typeof window.document !== 'undefined'
  && typeof window.document.createElement !== 'undefined';
const getDOMSelection = targetWindow => CAN_USE_DOM
  ? (targetWindow || window).getSelection() : null;
export const INSERT_IMAGE_COMMAND = createCommand('INSERT_IMAGE_COMMAND');
/**
 * Image Plugin used by Lexical Composer
 *
 * @author Ruihao Zhu (rzhu@yext.com)
 */
export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  React.useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }
    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        payload => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode]);
          if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
            $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        event => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand(
        DRAGOVER_COMMAND,
        event => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        DROP_COMMAND,
        event => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);
  return null;
}
function onDragStart(event) {
  const TRANSPARENT_IMAGE =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const img = document.createElement('img');
  img.src = TRANSPARENT_IMAGE;
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) {
    return false;
  }
  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );
  return true;
}
function onDragover(event) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  if (!canDropImage(event)) {
    event.preventDefault();
  }
  return true;
}
function onDrop(event, editor) {
  const node = getImageNodeInSelection();
  if (!node) {
    return false;
  }
  const data = getDragImageData(event);
  if (!data) {
    return false;
  }
  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const rangeSelection = $createRangeSelection();
    if (range !== null && range !== undefined) {
      rangeSelection.applyDOMRange(range);
    }
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}
function getImageNodeInSelection() {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) {
    return null;
  }
  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}
function getDragImageData(event) {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) {
    return null;
  }
  const {type, data} = JSON.parse(dragData);
  if (type !== 'image') {
    return null;
  }
  return data;
}
function canDropImage(event) {
  const target = event.target;
  return !!(
    target
    && target instanceof HTMLElement
    && !target.closest('code, span.yext-default-richtextv2-theme__image')
    && target.parentElement
  );
}
function getDragSelection(event) {
  let range;
  const target = event.target;
  const targetWindow =
    target == null
      ? null
      : target.nodeType === 9
        ? (target).defaultView
    : (target).ownerDocument.defaultView;
  const domSelection = getDOMSelection(targetWindow);
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent && domSelection !== null) {
    domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }
  return range;
}