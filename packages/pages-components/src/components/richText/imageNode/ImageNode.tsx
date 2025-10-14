import React from "react";
import {
  EditorConfig,
  DecoratorNode,
  NodeKey,
  DOMExportOutput,
  LexicalEditor,
} from "lexical";

import LexicalImage from "./LexicalImage.js";
import { SerializedImageNode } from "./types.js";
import { $createImageNode } from "./methods.js";

/**
 * Defines a Lexical Dev {@link DecoratorNode} that supports images in Rich Text. Rendering
 * of the Node is achieved by using the {@link LexicalImage} Component. This Node is meant to
 * be used with a read-only Lexical Editor. As such, it does not have setters for its various
 * attributes.
 */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number;
  __height: "inherit" | number;
  __maxWidth: number;

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  getSrc(): string {
    const latest = this.getLatest();
    return latest.__src;
  }

  getAltText(): string {
    const latest = this.getLatest();
    return latest.__altText;
  }

  /**
   * Defines the JSON Serialization strategy for an {@link ImageNode}.
   */
  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  /**
   * Static constructor for creating an {@link ImageNode} from a JSON serialized Node.
   */
  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode(serializedNode);
  }

  /**
   * Inserts the {@link ImageNode}'s placeholder {@link HTMLElement} into the Lexical Dev's DOM.
   */
  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const className = config.theme.image;
    if (className) {
      span.className = className;
    }

    return span;
  }

  exportDOM(editor: LexicalEditor): DOMExportOutput {
    const span = document.createElement("span");
    const className = editor._config.theme.image;
    if (className) {
      span.className = className;
    }

    const img = document.createElement("img");
    img.src = this.__src; // Use 'this' for instance properties
    if (this.__altText) {
      img.alt = this.__altText;
    }
    if (this.__width !== "inherit" && this.__width) {
      img.width = Number(this.__width);
    }
    if (this.__height !== "inherit" && this.__height) {
      img.height = Number(this.__height);
    }
    if (this.__maxWidth) {
      img.style.maxWidth = `${this.__maxWidth}px`;
    }
    img.loading = "lazy";
    img.decoding = "async";

    span.appendChild(img);

    return { element: span };
  }

  /**
   * Since this Node will only be used in a read-only context, we don't need to worry about
   * updating the DOM when its attributes change.
   */
  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <LexicalImage
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
      />
    );
  }
}
