import { Coordinate } from "./coordinate.js";
import { Type, assertType, assertInstance } from "./util/assertions.js";
import { Map } from "./map.js";
import { MapProvider } from "./mapProvider.js";
import { PinProperties } from "./pinProperties.js";
import { ProviderPin, ProviderPinOptions } from "./providerPin.js";

type PropertiesForStatus = (status: object) => PinProperties;
export type PinClickHandler = () => void;
export type PinFocusHandler = (focused: boolean) => void;
export type PinHoverHandler = (hovered: boolean) => void;

/**
 * {@link MapPin} options class
 */
class MapPinOptions {
  /**
   * Initialize with default options
   */
  coordinate: Coordinate;
  hideOffscreen: boolean;
  icons: { [key: string]: string };
  propertiesForStatus: PropertiesForStatus;
  provider: MapProvider | null;
  type: string;

  constructor() {
    this.coordinate = new Coordinate(0, 0);
    this.hideOffscreen = false;
    this.icons = {};
    this.propertiesForStatus = (_) => new PinProperties();
    this.provider = null;
    this.type = "";
  }

  /**
   * @param coordinate - Must be convertible to {@link Coordinate}
   */
  withCoordinate(coordinate: Coordinate): MapPinOptions {
    this.coordinate = new Coordinate(coordinate);
    return this;
  }

  /**
   * @param hideOffscreen - If true, the pin will only be rendered if it's in the visible
   *   portion of the map to improve performance
   */
  withHideOffscreen(hideOffscreen: boolean): MapPinOptions {
    this.hideOffscreen = hideOffscreen;
    return this;
  }

  /**
   * @param key - The unique name for the icon, used in {@link PinProperties#getIcon}
   *   and {@link PinProperties#setIcon}
   * @param icon - The URL or data URI of the icon image
   */
  withIcon(key: string, icon: string): MapPinOptions {
    this.icons[key] = icon;
    return this;
  }

  withPropertiesForStatus(propertiesForStatus: PropertiesForStatus): MapPinOptions {
    assertType(propertiesForStatus, Type.FUNCTION);

    this.propertiesForStatus = propertiesForStatus;
    return this;
  }

  withProvider(provider: MapProvider | null): MapPinOptions {
    if (provider) {
      assertInstance(provider, MapProvider);
      this.provider = provider;
    }
    return this;
  }

  /**
   * @param type - A string describing the type of the pin
   */
  withType(type: string): MapPinOptions {
    this.type = type;
    return this;
  }

  build(): MapPin {
    return new MapPin(this);
  }
}

/**
 * A pin for a {@link Map} that displays at a given {@link Coordinate}.
 * A MapPin can be displayed on at most one Map at a time. Pins support event handlers for clicking,
 * hovering, and focusing. The pin can change its appearance based on its current status, which is
 * changed by {@link setStatus}.
 */
class MapPin {
  _coordinate: Coordinate;
  _hideOffscreen: boolean;
  _icons: { [key: string]: string };
  _propertiesForStatus: PropertiesForStatus;
  _type: string;
  _clickHandler: PinClickHandler;
  _focusHandler: PinFocusHandler;
  _hoverHandler: PinHoverHandler;
  _hidden: boolean;
  _cancelHiddenUpdater: () => void;
  _map: Map | null;
  _pin: ProviderPin;
  _status: object;

  constructor(options: MapPinOptions) {
    assertInstance(options, MapPinOptions);
    if (options.provider) {
      assertInstance(options.provider, MapProvider);
    }

    if (!options.provider?.loaded) {
      throw new Error(
        `MapProvider '${options.provider?.getProviderName()}' is not loaded. The MapProvider must be loaded before calling MapPin constructor.`
      );
    }

    this._coordinate = options.coordinate;
    this._hideOffscreen = options.hideOffscreen;
    this._icons = { ...options.icons };
    this._propertiesForStatus = options.propertiesForStatus;
    this._type = options.type;

    this._clickHandler = () => null;
    this._focusHandler = (focused) => this._hoverHandler(focused);
    this._hoverHandler = (_) => null;

    this._hidden = false;
    this._cancelHiddenUpdater = () => null;

    this._map = null;

    this._pin = new ProviderPinOptions(options.provider)
      .withIcons({ ...this._icons })
      .withClickHandler(() => this._clickHandler())
      .withFocusHandler((focused: boolean) => this._focusHandler(focused))
      .withHoverHandler((hovered: boolean) => this._hoverHandler(hovered))
      .build();

    this._pin.setCoordinate(options.coordinate);

    this._status = {};
    this.setStatus(this._status);
  }

  /**
   * @returns The coordinate of the pin
   */
  getCoordinate(): Coordinate {
    return this._coordinate;
  }

  /**
   * Get the icon for a string key, such as 'default', 'hovered', or 'selected'
   * @param key - The unique name of the icon
   * @returns The URL or data URI of the icon image
   * @see MapPinOptions#withIcon
   */
  getIcon(key: string): string {
    return this._icons[key];
  }

  /**
   * @returns The map that the pin is currently on, or null if
   * not on a map
   */
  getMap(): Map | null {
    return this._map;
  }

  /**
   * Intended for internal use only
   * @returns The pin's {@link ProviderPin}
   *   instance
   */
  getProviderPin(): ProviderPin {
    return this._pin;
  }

  /**
   * @returns The string describing the type of pin
   */
  getType(): string {
    return this._type;
  }

  /**
   * Remove this pin from its current map, if on one.
   */
  remove() {
    this.setMap(null);
  }

  /**
   * Set a handler function for when the pin is clicked, replacing any previously set click handler.
   */
  setClickHandler(clickHandler: PinClickHandler) {
    assertType(clickHandler, Type.FUNCTION);

    this._clickHandler = clickHandler;
  }

  /**
   * @param coordinate - Must be convertible to {@link Coordinate}
   */
  setCoordinate(coordinate: Coordinate) {
    this._coordinate = new Coordinate(coordinate);
    this._pin.setCoordinate(this._coordinate);

    if (this._hideOffscreen) {
      this._hideIfOffscreen();
    }
  }

  /**
   * Set a handler function for when the pin is (un)focused, replacing any previously set focus handler.
   */
  setFocusHandler(focusHandler: PinFocusHandler) {
    assertType(focusHandler, Type.FUNCTION);

    this._focusHandler = focusHandler;
  }

  /**
   * Set a handler function for when the pin is (un)hovered, replacing any previously set hover handler.
   */
  setHoverHandler(hoverHandler: PinHoverHandler) {
    assertType(hoverHandler, Type.FUNCTION);

    this._hoverHandler = hoverHandler;
  }

  /**
   * Add the pin to a map, removing it from its current map if on one.
   */
  setMap(map: Map | null) {
    if (map === this._map) {
      return;
    }

    if (map !== null) {
      assertInstance(map, Map);
    }

    this._pin.setMap(map, this._hidden ? null : this._map);
    this._map = map;
    this._hidden = false;
    this._cancelHiddenUpdater();

    if (map && this._hideOffscreen) {
      let hiddenUpdaterCancelled = false;
      const hiddenUpdaterCancelledPromise = new Promise<void>((resolve) => {
        this._cancelHiddenUpdater = () => {
          hiddenUpdaterCancelled = true;
          resolve();
        };
      });

      (async () => {
        while (!hiddenUpdaterCancelled) {
          this._hideIfOffscreen();

          // Wait for the map to move, then stop moving
          await Promise.race([hiddenUpdaterCancelledPromise, map.moving()]);
          await Promise.race([hiddenUpdaterCancelledPromise, map.idle()]);
        }
      })();
    }
  }

  /**
   * Assign all properties in an object to the pin's status.
   * Example: if the pin's status is \{ a: true, b: true \}, passing in \{ a: false, c: true \} will
   * change the pin's status to \{ a: false, b: true, c: true \}
   */
  setStatus(status: object) {
    Object.assign(this._status, status);
    this._pin.setProperties(this._propertiesForStatus(this._status));
  }

  /**
   * Add or remove the pin from the map based on whether its coordinate is within the current bounds
   */
  _hideIfOffscreen() {
    if (this._map) {
      const isVisible = this._map.getBounds().contains(this._coordinate);

      if (this._hidden && isVisible) {
        this._pin.setMap(this._map, null);
      } else if (!this._hidden && !isVisible) {
        this._pin.setMap(null, this._map);
      }

      this._hidden = !isVisible;
    }
  }
}

export { MapPinOptions, MapPin, PinProperties };
