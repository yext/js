// @ts-nocheck
/** @module @yext/components-maps */

import { Coordinate } from "./coordinate.js";
import { Type, assertType, assertInstance } from "./util/assertions.js";
import { Map } from "./map.js";
import { MapProvider } from "./mapProvider.js";
import { PinProperties } from "./pinProperties.js";
import { ProviderPinOptions } from "./providerPin.js";

/**
 * @callback PinPropertiesForStatus
 * @param {Object} status A generic object whose properties define the state of the pin, from {@link module:@yext/components-maps~MapPin#setStatus MapPin#setStatus}
 * @returns {module:@yext/components-maps~PinProperties}
 * @see module:@yext/components-maps~MapPin#setStatus
 */

/**
 * @callback PinClickHandler
 */

/**
 * @callback PinFocusHandler
 * @param {boolean} focused Whether the pin is currently focused
 */

/**
 * @callback PinHoverHandler
 * @param {boolean} hovered Whether the pin is currently hovered
 */

/**
 * {@link module:@yext/components-maps~MapPin MapPin} options class
 */
class MapPinOptions {
  /**
   * Initialize with default options
   */
  constructor() {
    this.coordinate = new Coordinate(0, 0);
    this.hideOffscreen = false;
    this.icons = {};
    this.propertiesForStatus = (status) => new PinProperties();
    this.provider = null;
    this.type = "";
  }

  /**
   * @param {Object} coordinate Must be convertible to {@link module:@yext/components-tsx-geo~Coordinate Coordinate}
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withCoordinate(coordinate) {
    this.coordinate = new Coordinate(coordinate);
    return this;
  }

  /**
   * @param {boolean} hideOffscreen If true, the pin will only be rendered if it's in the visible
   *   portion of the map to improve performance
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withHideOffscreen(hideOffscreen) {
    this.hideOffscreen = hideOffscreen;
    return this;
  }

  /**
   * @param {string} key The unique name for the icon, used in {@link module:@yext/components-maps~PinProperties#getIcon PinProperties#getIcon}
   *   and {@link module:@yext/components-maps~PinProperties#setIcon PinProperties#setIcon}
   * @param {string} icon The URL or data URI of the icon image
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withIcon(key, icon) {
    this.icons[key] = icon;
    return this;
  }

  /**
   * @param {module:@yext/components-maps~PinPropertiesForStatus} propertiesForStatus
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withPropertiesForStatus(propertiesForStatus) {
    assertType(propertiesForStatus, Type.FUNCTION);

    this.propertiesForStatus = propertiesForStatus;
    return this;
  }

  /**
   * @param {module:@yext/components-maps~MapProvider} provider
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withProvider(provider) {
    assertInstance(provider, MapProvider);

    this.provider = provider;
    return this;
  }

  /**
   * @param {string} type A string describing the type of the pin
   * @returns {module:@yext/components-maps~MapPinOptions}
   */
  withType(type) {
    this.type = type;
    return this;
  }

  /**
   * @returns {module:@yext/components-maps~MapPin}
   */
  build() {
    return new MapPin(this);
  }
}

/**
 * A pin for a {@link module:@yext/components-maps~Map Map} that displays at a given {@link module:@yext/components-tsx-geo~Coordinate Coordinate}.
 * A MapPin can be displayed on at most one Map at a time. Pins support event handlers for clicking,
 * hovering, and focusing. The pin can change its appearance based on its current status, which is
 * changed by {@link module:@yext/components-maps~MapPin#setStatus setStatus}.
 */
class MapPin {
  /**
   * @param {module:@yext/components-maps~MapPinOptions} options
   */
  constructor(options) {
    assertInstance(options, MapPinOptions);
    assertInstance(options.provider, MapProvider);

    if (!options.provider.loaded) {
      throw new Error(
        `MapProvider '${options.provider.getProviderName()}' is not loaded. The MapProvider must be loaded before calling MapPin constructor.`
      );
    }

    this._coordinate = options.coordinate;
    this._hideOffscreen = options.hideOffscreen;
    this._icons = { ...options.icons };
    this._propertiesForStatus = options.propertiesForStatus;
    this._type = options.type;

    this._clickHandler = () => null;
    this._focusHandler = (focused) => this._hoverHandler(focused);
    this._hoverHandler = (hovered) => null;

    this._hidden = false;
    this._cancelHiddenUpdater = () => null;

    this._map = null;

    this._pin = new ProviderPinOptions(options.provider)
      .withIcons({ ...this._icons })
      .withClickHandler(() => this._clickHandler())
      .withFocusHandler((focused) => this._focusHandler(focused))
      .withHoverHandler((hovered) => this._hoverHandler(hovered))
      .build();

    this._pin.setCoordinate(options.coordinate);

    this._status = {};
    this.setStatus(this._status);
  }

  /**
   * @returns {module:@yext/components-tsx-geo~Coordinate} The coordinate of the pin
   */
  getCoordinate() {
    return this._coordinate;
  }

  /**
   * Get the icon for a string key, such as 'default', 'hovered', or 'selected'
   * @param {string} key The unique name of the icon
   * @returns {string} The URL or data URI of the icon image
   * @see module:@yext/components-maps~MapPinOptions#withIcon
   */
  getIcon(key) {
    return this._icons[key];
  }

  /**
   * @returns {module:@yext/components-maps~Map} The map that the pin is currently on, or null if
   * not on a map
   */
  getMap() {
    return this._map;
  }

  /**
   * Intended for internal use only
   * @returns {module:@yext/components-maps~ProviderPin} The pin's {@link module:@yext/components-maps~ProviderPin ProviderPin}
   *   instance
   */
  getProviderPin() {
    return this._pin;
  }

  /**
   * @returns {string} The string describing the type of pin
   */
  getType() {
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
   * @param {module:@yext/components-maps~PinClickHandler} clickHandler
   */
  setClickHandler(clickHandler) {
    assertType(clickHandler, Type.FUNCTION);

    this._clickHandler = clickHandler;
  }

  /**
   * @param {Object} coordinate Must be convertible to {@link module:@yext/components-tsx-geo~Coordinate Coordinate}
   */
  setCoordinate(coordinate) {
    this._coordinate = new Coordinate(coordinate);
    this._pin.setCoordinate(this._coordinate);

    if (this._hideOffscreen) {
      this._hideIfOffscreen();
    }
  }

  /**
   * Set a handler function for when the pin is (un)focused, replacing any previously set focus handler.
   * @param {module:@yext/components-maps~PinFocusHandler} focusHandler
   */
  setFocusHandler(focusHandler) {
    assertType(focusHandler, Type.FUNCTION);

    this._focusHandler = focusHandler;
  }

  /**
   * Set a handler function for when the pin is (un)hovered, replacing any previously set hover handler.
   * @param {module:@yext/components-maps~PinHoverHandler} hoverHandler
   */
  setHoverHandler(hoverHandler) {
    assertType(hoverHandler, Type.FUNCTION);

    this._hoverHandler = hoverHandler;
  }

  /**
   * Add the pin to a map, removing it from its current map if on one.
   * @param {?Map} map
   */
  setMap(map) {
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
      const hiddenUpdaterCancelledPromise = new Promise((resolve) => {
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
   * Example: if the pin's status is { a: true, b: true }, passing in { a: false, c: true } will
   * change the pin's status to { a: false, b: true, c: true }
   * @param {Object} status
   */
  setStatus(status) {
    Object.assign(this._status, status);
    this._pin.setProperties(this._propertiesForStatus(this._status));
  }

  /**
   * Add or remove the pin from the map based on whether its coordinate is within the current bounds
   * @protected
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
