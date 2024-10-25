import { Type, assertType, assertInstance } from "./util/assertions.js";
import { MapProvider } from "./mapProvider.js";
import {
  PinClickHandler,
  PinFocusHandler,
  PinHoverHandler,
  PinProperties,
} from "./mapPin.js";
import { Coordinate } from "./coordinate.js";
import { Map } from "./map.js";

/**
 * {@link ProviderPin} options class
 */
class ProviderPinOptions {
  providerPinClass: typeof ProviderPin;
  clickHandler: PinClickHandler;
  focusHandler: PinFocusHandler;
  hoverHandler: PinHoverHandler;
  icons: { [key: string]: string };

  constructor(provider: MapProvider) {
    assertInstance(provider, MapProvider);

    this.providerPinClass = provider.getPinClass();

    this.clickHandler = () => null;
    this.focusHandler = (_: boolean) => null;
    this.hoverHandler = (_: boolean) => null;
    this.icons = {};
  }

  /**
   * @param clickHandler - Function called when the pin is clicked
   */
  withClickHandler(clickHandler: PinClickHandler): ProviderPinOptions {
    assertType(clickHandler, Type.FUNCTION);

    this.clickHandler = clickHandler;
    return this;
  }

  /**
   * @param focusHandler - Function called when the pin becomes (un)focused
   */
  withFocusHandler(focusHandler: PinFocusHandler): ProviderPinOptions {
    assertType(focusHandler, Type.FUNCTION);

    this.focusHandler = focusHandler;
    return this;
  }

  /**
   * @param hoverHandler - Function called when the pin becomes (un)hovered
   */
  withHoverHandler(hoverHandler: PinHoverHandler): ProviderPinOptions {
    assertType(hoverHandler, Type.FUNCTION);

    this.hoverHandler = hoverHandler;
    return this;
  }

  /**
   * Similar to {@link MapPinOptions#withIcon},
   * but all icons are given as a map of key =\> icon. If a provider pin instance needs an icon to be
   * a specialized class rather than a simple URL, the icons in this object can be converted in this
   * function and assigned back to the icons object instead of being recreated from the URL every
   * time the pin's icon changes.
   * @param icons - Map of a string key to the URL or data URI of an image
   */
  withIcons(icons: { [key: string]: string }): ProviderPinOptions {
    this.icons = icons;
    return this;
  }

  /**
   * @returns An instance of a subclass of {@link ProviderPin}
   *   for the given {@link MapProvider}
   */
  build(): ProviderPin {
    const providerPinClass = this.providerPinClass;
    return new providerPinClass(this);
  }
}

/**
 * This class is an interface that should be implemented for each map provider, such as Google Maps.
 * It is used as an API for a {@link MapPin} to control a
 * provider-specific pin instance. Ideally, this class should have minimal functionality so that
 * adding a new provider is easy and behavior is as consistent as possible across all providers.
 */
class ProviderPin {
  _clickHandler: PinClickHandler;
  _focusHandler: PinFocusHandler;
  _hoverHandler: PinHoverHandler;
  _icons: { [key: string]: string };
  /**
   * The constructor creates a pin instance using the provider's API and initializes it with all the
   * given options. See {@link ProviderPinOptions}
   * for the supported options.
   */
  constructor(options: ProviderPinOptions) {
    assertInstance(options, ProviderPinOptions);

    this._clickHandler = options.clickHandler;
    this._focusHandler = options.focusHandler;
    this._hoverHandler = options.hoverHandler;
    this._icons = options.icons;
  }

  /**
   * @param coordinate - The position of the pin
   */
  setCoordinate(_: Coordinate) {
    throw new Error("not implemented");
  }

  /**
   * Remove the pin from its current map and, if newMap is not null, add it to the new map.
   * @param newMap - The new map -- if null, the pin will not be
   *   shown on any map
   * @param currentMap - The current map -- if null, the pin is
   *   not shown on any map
   */
  setMap(_: Map | null, __: Map | null) {
    throw new Error("not implemented");
  }

  /**
   * Apply the given properties to modify the appearance of the pin.
   * @see PinProperties
   */
  setProperties(_: PinProperties) {
    throw new Error("not implemented");
  }
}

const htmlPinBaseStyle = Object.freeze({
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "contain",
  left: "0",
  outline: "none",
  pointerEvents: "auto",
  position: "absolute",
  top: "0",
});

/**
 * This class is an extension of {@link ProviderPin} that
 * allows HTML elements to be used as map pins.
 */
class HTMLProviderPin extends ProviderPin {
  _pinEl: HTMLElement;
  _pinAlt: HTMLElement;
  _wrapper: HTMLElement | null;

  /**
   * This is the base style applied to pin elements. It is a map from CSS property to value, such
   * as 'position': 'absolute'
   */
  static get baseStyle() {
    return htmlPinBaseStyle;
  }

  /**
   * After instatiating a {@link ProviderPin}, this creates
   * a wrapper element and a default pin element.
   */
  constructor(options: ProviderPinOptions) {
    super(options);

    this._pinEl = document.createElement("button");
    Object.assign(this._pinEl.style, HTMLProviderPin.baseStyle);

    this._pinAlt = document.createElement("span");
    this._pinAlt.classList.add("sr-only");
    this._pinEl.appendChild(this._pinAlt);

    this._wrapper = document.createElement("div");
    this._wrapper.style.pointerEvents = "none";
    this._wrapper.appendChild(this._pinEl);

    this.addListeners();
  }

  /**
   * Adds click, hover, and focus event listeners to the wrapper element
   */
  addListeners() {
    if (this._wrapper) {
      this._wrapper.addEventListener("click", () => this._clickHandler());
      this._wrapper.addEventListener("focusin", () => this._focusHandler(true));
      this._wrapper.addEventListener("focusout", () =>
        this._focusHandler(false)
      );
      this._wrapper.addEventListener("mouseover", () =>
        this._hoverHandler(true)
      );
      this._wrapper.addEventListener("mouseout", () =>
        this._hoverHandler(false)
      );
    }
  }

  /**
   * @returns HTML button element for pin element
   */
  getPinElement(): HTMLElement {
    return this._pinEl;
  }

  /**
   * @returns HTML button element for wrapper element
   */
  getWrapperElement(): HTMLElement | null {
    return this._wrapper;
  }

  /**
   * @see ProviderPin#setProperties
   */
  setProperties(pinProperties: PinProperties) {
    this.setElementProperties(pinProperties);

    const className = pinProperties.getClass();
    const element = pinProperties.getElement() || this._pinEl;
    const zIndex = pinProperties.getZIndex();

    element.style.pointerEvents = "auto";

    if (this._wrapper) {
      this._wrapper.style.zIndex = zIndex.toString();
      this._wrapper.setAttribute("class", className);

      if (element !== this._wrapper.children[0]) {
        (this._wrapper.children[0] as HTMLElement).style.pointerEvents = "";
        this._wrapper.removeChild(this._wrapper.children[0]);
        this._wrapper.appendChild(element);
      }
    }
  }

  /**
   * Sets properties used specifically by the pin element
   */
  setElementProperties(pinProperties: PinProperties) {
    const anchorX = pinProperties.getAnchorX();
    const anchorY = pinProperties.getAnchorY();
    const height = pinProperties.getHeight();
    const icon = this._icons[pinProperties.getIcon()];
    const srText = pinProperties.getSRText();
    const width = pinProperties.getWidth();

    Object.assign(this._pinEl.style, {
      backgroundImage: icon ? `url("${icon}")` : "",
      height: height + "px",
      transform: `translate(${-100 * anchorX}%, ${-100 * anchorY}%)`,
      width: width + "px",
    });

    this._pinAlt.innerText = srText;
  }
}

export { ProviderPinOptions, ProviderPin, HTMLProviderPin };
