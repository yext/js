/**
 * This class is used to set the appearance of a {@link MapPin}.
 * Most properties are supported by all providers, but some are only supported by providers that
 * implement {@link HTMLProviderPin}.
 */
class PinProperties {
  _anchorX: number;
  _anchorY: number;
  _height: number;
  _icon: string;
  _srText: string;
  _width: number;
  _zIndex: number;
  _class: string;
  _element: HTMLElement | null;
  constructor() {
    // Properties supported by all pins
    this._anchorX = 0.5;
    this._anchorY = 1;
    this._height = 39;
    this._icon = "default";
    this._srText = "map pin";
    this._width = 33;
    this._zIndex = 0;

    // Properties supported only by HTML pins
    this._class = "";
    this._element = null;
  }

  /**
   * @returns The point in the pin that should be positioned over the coordinate, from 0
   *   (left edge) to 1 (right edge)
   */
  getAnchorX(): number {
    return this._anchorX;
  }

  /**
   * @returns The point in the pin that should be positioned over the coordinate, from 0
   *   (top edge) to 1 (bottom edge)
   */
  getAnchorY(): number {
    return this._anchorY;
  }

  /**
   * {@link HTMLProviderPins} only
   * @returns The class of the wrapper element for an HTML pin
   */
  getClass(): string {
    return this._class;
  }

  /**
   * {@link HTMLProviderPins} only
   * @returns The HTML pin element
   */
  getElement(): HTMLElement | null {
    return this._element;
  }

  /**
   * @returns The pixel height of the pin
   */
  getHeight(): number {
    return this._height;
  }

  /**
   * This returns a string key that can be used with {@link MapPin#getIcon}
   * to get the icon image for a pin.
   * @returns The unique name of the icon
   */
  getIcon(): string {
    return this._icon;
  }

  /**
   * @returns The text that a screen reader reads when focused on the pin
   */
  getSRText(): string {
    return this._srText;
  }

  /**
   * @returns The pixel width of the pin
   */
  getWidth(): number {
    return this._width;
  }

  /**
   * @returns The z-index of the pin
   */
  getZIndex(): number {
    return this._zIndex;
  }

  /**
   * @see PinProperties#getAnchorX
   */
  setAnchorX(anchorX: number): PinProperties {
    this._anchorX = anchorX;
    return this;
  }

  /**
   * @see PinProperties#getAnchorY
   */
  setAnchorY(anchorY: number): PinProperties {
    this._anchorY = anchorY;
    return this;
  }

  /**
   * @see PinProperties#getClass
   */
  setClass(className: string): PinProperties {
    this._class = className;
    return this;
  }

  /**
   * @see PinProperties#getElement
   */
  setElement(element: HTMLElement): PinProperties {
    this._element = element;
    return this;
  }

  /**
   * @see PinProperties#getHeight
   */
  setHeight(height: number): PinProperties {
    this._height = height;
    return this;
  }

  /**
   * @see PinProperties#getIcon
   */
  setIcon(icon: string): PinProperties {
    this._icon = icon;
    return this;
  }

  /**
   * @see PinProperties#getSRText
   */
  setSRText(srText: string): PinProperties {
    this._srText = srText;
    return this;
  }

  /**
   * @see PinProperties#getWidth
   */
  setWidth(width: number): PinProperties {
    this._width = width;
    return this;
  }

  /**
   * @see PinProperties#getZIndex
   */
  setZIndex(zIndex: number): PinProperties {
    this._zIndex = zIndex;
    return this;
  }
}

export { PinProperties };
