import { TableCellNode, SerializedTableCellNode } from "@lexical/table";
import { LexicalEditor, DOMExportOutput, $applyNodeReplacement } from "lexical";

/**
 * This class extends the default Lexical {@link TableCellNode} to remove the
 * default styles the Node automatically applies. https://github.com/facebook/lexical/issues/5081
 */
export class CustomTableCellNode extends TableCellNode {
  static getType(): string {
    return "tablecell";
  }

  static clone(node: CustomTableCellNode) {
    const cellNode = new CustomTableCellNode(
      node.__headerState,
      node.__colSpan,
      node.__width,
      node.__key
    );
    cellNode.__rowSpan = node.__rowSpan;
    cellNode.__backgroundColor = node.__backgroundColor;
    return cellNode;
  }

  static importJSON(serializedNode: SerializedTableCellNode): TableCellNode {
    const colSpan = serializedNode.colSpan || 1;
    const rowSpan = serializedNode.rowSpan || 1;
    const cellNode = $applyNodeReplacement(
      new CustomTableCellNode(
        serializedNode.headerState,
        colSpan,
        serializedNode.width || undefined
      )
    ) as TableCellNode;
    cellNode.__rowSpan = rowSpan;
    cellNode.__backgroundColor = serializedNode.backgroundColor || null;
    return cellNode;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const domExported = super.exportDOM(editor);
    if (domExported.element) {
      const element_ = domExported.element as HTMLElement;
      element_.removeAttribute("style");
      element_.style.width = this.getWidth() ? `${this.getWidth()}px` : "";
      return {
        ...domExported,
        element: element_,
      };
    }

    return domExported;
  }
}
