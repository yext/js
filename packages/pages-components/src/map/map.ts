import { Unit, Projection } from "./constants.js";
import { Coordinate } from "./coordinate.js";
import { GeoBounds } from "./geoBounds.js";
import { Type, assertType, assertInstance } from "./util/assertions.js";
import { MapPin, MapPinOptions } from "./mapPin.js";
import { MapProvider } from "./mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "./providerMap.js";

export type PaddingFunction = () => number;

export type PanHandler = (
  previousBounds?: GeoBounds,
  currentBounds?: GeoBounds
) => void;

export type PanStartHandler = (currentBounds?: GeoBounds) => void;

type PaddingObject = {
  bottom?: number | PaddingFunction;
  left?: number | PaddingFunction;
  right?: number | PaddingFunction;
  top?: number | PaddingFunction;
};

/**
 * The maximum percent of the map height or width that can be taken up by padding.
 * It's a number arbitrarily close to 1, because if total padding is \>= 1 there's no space for pins.
 * This shouldn't need to be changed. To set a {@link Map}'s
 * padding, use {@link setPadding}.
 */
const MAX_PADDING = 0.98;

/**
 * Padding values are given in pixels as a number or a function that returns a number.
 * They need to be converted to a non-negative fraction of the map's current height or width.
 * @param value - Minimum number of pixels
 *   between the map's edge and a pin
 * @param basis - The pixel measurement that the padding will be a fraction of
 * @returns The padding value as a fraction of basis
 */
function normalizePadding(
  value: number | PaddingFunction | undefined,
  basis: number
): number {
  return Math.max(value instanceof Function ? value() : value || 0, 0) / basis;
}

/**
 * {@link Map} options class
 */
class MapOptions {
  controlEnabled: boolean;
  defaultCenter: Coordinate;
  defaultZoom: number;
  legendPins: MapPin[];
  padding: PaddingObject;
  panHandler: PanHandler;
  panStartHandler: PanStartHandler;
  provider: MapProvider | null;
  providerOptions: ProviderMapOptions | object;
  singlePinZoom: number;
  wrapper: HTMLElement | null;
  /**
   * Initialize with default options
   */
  constructor() {
    this.controlEnabled = true;
    this.defaultCenter = new Coordinate(39.83, -98.58); // Center of the USA
    this.defaultZoom = 4;
    this.legendPins = [];
    this.padding = {
      bottom: () => 50,
      left: () => 50,
      right: () => 50,
      top: () => 50,
    };
    this.panHandler = (_, __) => null;
    this.panStartHandler = (_) => null;
    this.provider = null;
    this.providerOptions = {};
    this.singlePinZoom = 14;
    this.wrapper = null;
  }

  /**
   * @param controlEnabled - Whether the user can move and zoom the map
   */
  withControlEnabled(controlEnabled: boolean): MapOptions {
    this.controlEnabled = controlEnabled;
    return this;
  }

  /**
   * @param defaultCenter - The center on initial load and
   *   when calling {@link Map#fitCoordinates} with an empty array
   */
  withDefaultCenter(defaultCenter: Coordinate): MapOptions {
    this.defaultCenter = new Coordinate(defaultCenter);
    return this;
  }

  /**
   * @param defaultZoom - The zoom on initial load and when calling {@link Map#fitCoordinates}
   *   with an empty array
   */
  withDefaultZoom(defaultZoom: number): MapOptions {
    this.defaultZoom = defaultZoom;
    return this;
  }

  /**
   * GENERATOR TODO Map legend not yet implemented
   * @param legendPins - Pins used to construct the map legend
   */
  withLegendPins(legendPins: MapPin[]): MapOptions {
    this.legendPins = Array.from(legendPins);
    return this;
  }

  /**
   * Padding is used by {@link Map#fitCoordinates}.
   * Padding can either be constant values or funtions that return a padding value.
   * See {@link Map#setPadding} for more information.
   * @see {@link Map#setPadding}
   */
  withPadding(padding: {
    bottom: number | PaddingFunction;
    left: number | PaddingFunction;
    right: number | PaddingFunction;
    top: number | PaddingFunction;
  }): MapOptions {
    this.padding = padding;
    return this;
  }

  withPanHandler(panHandler: PanHandler): MapOptions {
    assertType(panHandler, Type.FUNCTION);

    this.panHandler = panHandler;
    return this;
  }

  withPanStartHandler(panStartHandler: PanStartHandler): MapOptions {
    assertType(panStartHandler, Type.FUNCTION);

    this.panStartHandler = panStartHandler;
    return this;
  }

  /**
   * The {@link MapProvider} must be loaded before
   * constructing the {@link Map}.
   */
  withProvider(provider: MapProvider): MapOptions {
    assertInstance(provider, MapProvider);

    this.provider = provider;
    return this;
  }

  /**
   * @param providerOptions - A free-form object used to set any additional provider-specific
   *   options in the {@link ProviderMap}
   */
  withProviderOptions(providerOptions: object): MapOptions {
    this.providerOptions = providerOptions;
    return this;
  }

  /**
   * @param singlePinZoom - The zoom when calling {@link Map#fitCoordinates}
   *   with an array containing one coordinate
   */
  withSinglePinZoom(singlePinZoom: number): MapOptions {
    this.singlePinZoom = singlePinZoom;
    return this;
  }

  /**
   * @param wrapper - The wrapper element that the map will be inserted into. The
   *   existing contents of the element will be removed.
   */
  withWrapper(wrapper: HTMLElement | null): MapOptions {
    if (!wrapper) {
      return this;
    }
    assertInstance(wrapper, HTMLElement);

    this.wrapper = wrapper;
    return this;
  }

  build(): Map {
    return new Map(this);
  }
}

/**
 * An interactive map that supports various map providers, such as Google Maps and Mapbox, with a
 * single API. Code written using this class functions approximately the same regardless of the map
 * provider used. Any map provider can be supported via an instance of {@link MapProvider}.
 */
class Map {
  /**
   * The {@link MapProvider} for the map must be loaded
   * before calling this constructor.
   */
  _defaultCenter: Coordinate;
  _defaultZoom: number;
  _legendPins: MapPin[];
  _padding: PaddingObject;
  _provider: MapProvider | null;
  _singlePinZoom: number;
  _wrapper: HTMLElement | null;
  _cachedBounds: GeoBounds | null;
  _resolveIdle: () => void;
  _resolveMoving: () => void;
  _idlePromise: Promise<void>;
  _panHandlerRunning: boolean;
  _panStartHandlerRunning: boolean;
  _currentBounds: GeoBounds;
  _movingPromise?: Promise<void>;
  _panHandler?: PanHandler;
  _panStartHandler?: PanStartHandler;
  _map: ProviderMap;

  constructor(options: MapOptions) {
    assertInstance(options, MapOptions);
    if (options.provider) {
      assertInstance(options.provider, MapProvider);
    }
    if (options.wrapper) {
      assertInstance(options.wrapper, HTMLElement);
    }

    if (!options.provider?.loaded) {
      throw new Error(
        `MapProvider '${options.provider?.getProviderName()}' is not loaded. The MapProvider must be loaded before calling Map constructor.`
      );
    }

    this._defaultCenter = options.defaultCenter;
    this._defaultZoom = options.defaultZoom;
    this._legendPins = options.legendPins;
    this._provider = options.provider;
    this._singlePinZoom = options.singlePinZoom;
    this._wrapper = options.wrapper;

    this._padding = {};
    this.setPadding(options.padding);

    this._cachedBounds = null; // Cached map bounds, invalidated on map move

    this._resolveIdle = () => null;
    this._resolveMoving = () => null;
    this._idlePromise = Promise.resolve();
    this._setIdle();

    this.setPanHandler(options.panHandler);
    this.setPanStartHandler(options.panStartHandler);

    // Remove all child elements of wrapper
    while (this._wrapper?.lastChild) {
      this._wrapper.removeChild(this._wrapper.lastChild);
    }

    this._panHandlerRunning = false;
    this._panStartHandlerRunning = false;
    this._map = new ProviderMapOptions(options.provider, this._wrapper)
      .withControlEnabled(options.controlEnabled)
      .withPanHandler(() => this.panHandler())
      .withPanStartHandler(() => this.panStartHandler())
      .withProviderOptions(options.providerOptions)
      .build();

    this.setZoomCenter(this._defaultZoom, this._defaultCenter);
    this._currentBounds = this.getBounds();
  }

  /**
   * Set the map bounds so that all the given coordinates are within the {@link padded}
   * view.
   * @param animated - Whether to transition smoothly to the new bounds
   * @param maxZoom - The max zoom level after fitting. Uses {@link singlePinZoom}
   *   by default.
   */
  fitCoordinates(
    coordinates: Coordinate[],
    animated = false,
    maxZoom: number = this._singlePinZoom
  ) {
    if (coordinates.length) {
      this.setBounds(
        GeoBounds.fit(coordinates),
        animated,
        this._padding,
        maxZoom
      );
    } else {
      this.setZoomCenter(this._defaultZoom, this._defaultCenter, animated);
    }
  }

  /**
   * Get the current visible region of the map. If the map is zoomed out to show multiple copies of
   * the world, the longitude bounds will be outside [-180, 180) but the center will always be
   * within [-180, 180).
   */
  getBounds(): GeoBounds {
    if (!this._cachedBounds) {
      const pixelHeight = this._wrapper?.offsetHeight ?? 0;
      const pixelWidth = this._wrapper?.offsetWidth ?? 0;
      const zoom = this.getZoom();
      const center = this.getCenter();

      const degreesPerPixel = 360 / Math.pow(2, zoom + 8);
      const width = pixelWidth * degreesPerPixel;
      const height = pixelHeight * degreesPerPixel;

      this._cachedBounds = new GeoBounds(center, center);
      this._cachedBounds.ne.add(
        height / 2,
        width / 2,
        Unit.DEGREE,
        Projection.MERCATOR
      );
      this._cachedBounds.sw.add(
        -height / 2,
        -width / 2,
        Unit.DEGREE,
        Projection.MERCATOR
      );

      this.moving().then(() => (this._cachedBounds = null));
    }

    return new GeoBounds(this._cachedBounds.sw, this._cachedBounds.ne);
  }

  /**
   * @returns The center of the current visible region of
   *   the map
   */
  getCenter(): Coordinate {
    return this._map.getCenter();
  }

  /**
   * Intended for internal use only
   * @returns The map's {@link ProviderMap}
   *   instance
   */
  getProviderMap(): ProviderMap {
    return this._map;
  }

  /**
   * To standardize zoom for all providers, zoom level is calculated with this formula:
   * zoom = log2(pixel width of equator) - 8.
   * At zoom = 0, the entire world is 256 pixels wide.
   * At zoom = 1, the entire world is 512 pixels wide.
   * Zoom 2 → 1024 pixels, zoom 3 → 2056 pixels, etc.
   * Negative and non-integer zoom levels are valid and follow the formula.
   * @returns The current zoom level of the map
   */
  getZoom(): number {
    return this._map.getZoom();
  }

  /**
   * Returns when the map is not moving.
   * Use map.idle().then(callback) to run callback immediately if the map is currently idle or once
   * the map becomes idle if it's not.
   */
  async idle() {
    await this._idlePromise;
  }

  /**
   * Returns when the map is moving.
   * Use map.moving().then(callback) to run callback immediately if the map is currently moving or
   * once the map starts moving if it's not.
   */
  async moving() {
    await this._movingPromise;
  }

  /**
   * @returns A {@link MapPinOptions}
   *   instance with the same provider as this map
   */
  newPinOptions(): MapPinOptions {
    return new MapPinOptions().withProvider(this._provider);
  }

  /**
   * Called when the map has finished moving, at most once per animation frame.
   * Passes the current and previous bounds to the custom pan handler given by {@link MapOptions#withPanHandler}
   */
  panHandler() {
    // Throttle panHandler to run at most once per frame
    if (this._panHandlerRunning) {
      return;
    }

    this._panHandlerRunning = true;

    requestAnimationFrame(() => {
      const previousBounds = this._currentBounds;
      this._currentBounds = this.getBounds();

      if (this._panHandler) {
        this._panHandler(
          previousBounds,
          new GeoBounds(
            new Coordinate(this._currentBounds.sw),
            new Coordinate(this._currentBounds.ne)
          )
        );
      }

      this._panHandlerRunning = false;
    });

    this._setIdle();
  }

  /**
   * Called when the map has started moving, at most once per animation frame.
   * Passes the current bounds to the custom pan handler given by {@link MapOptions#withPanStartHandler}
   */
  panStartHandler() {
    // Throttle panStartHandler to run at most once per frame
    if (this._panStartHandlerRunning) {
      return;
    }

    this._panStartHandlerRunning = true;

    requestAnimationFrame(() => {
      if (this._panStartHandler) {
        this._panStartHandler(
          new GeoBounds(
            new Coordinate(this._currentBounds.sw),
            new Coordinate(this._currentBounds.ne)
          )
        );
      }

      this._panStartHandlerRunning = false;
    });

    this._setMoving();
  }

  /**
   * @param bounds - bounds.ne: The northeast corner of the bounds -- must be convertible to {@link Coordinate}
   * bounds.se: The southwest corner of the bounds -- must be convertible to {@link Coordinate}
   * @param animated - Whether to transition smoothly to the new bounds
   * @param padding - padding.bottom: Minimum number of pixels between the map's bottom edge and a pin
   * padding.left: Minimum number of pixels between the map's left edge and a pin
   * padding.right: Minimum number of pixels between the map's right edge and a pin
   * padding.top: Minimum number of pixels between the map's top edge and a pin
   */
  setBounds(
    { ne, sw }: GeoBounds,
    animated = false,
    padding: {
      bottom?: number | PaddingFunction;
      left?: number | PaddingFunction;
      right?: number | PaddingFunction;
      top?: number | PaddingFunction;
    } = {},
    maxZoom = Infinity
  ) {
    const pixelHeight = this._wrapper?.offsetHeight;
    const pixelWidth = this._wrapper?.offsetWidth;

    if (!pixelHeight || !pixelWidth) {
      return;
    }

    // Normalize padding to a fraction of the map height or width.
    let paddingBottom = normalizePadding(padding.bottom, pixelHeight);
    let paddingLeft = normalizePadding(padding.left, pixelWidth);
    let paddingRight = normalizePadding(padding.right, pixelWidth);
    let paddingTop = normalizePadding(padding.top, pixelHeight);

    // Calculate the total horizontal and vertical padding. For each, if the total is greater than
    // the max amount of padding, scale down each padding value proportionately so that combined
    // they equal the max.
    let horizontalPadding = paddingLeft + paddingRight;
    let verticalPadding = paddingBottom + paddingTop;

    if (horizontalPadding > MAX_PADDING) {
      paddingLeft *= MAX_PADDING / horizontalPadding;
      paddingRight *= MAX_PADDING / horizontalPadding;
      horizontalPadding = MAX_PADDING;
    }

    if (verticalPadding > MAX_PADDING) {
      paddingBottom *= MAX_PADDING / verticalPadding;
      paddingTop *= MAX_PADDING / verticalPadding;
      verticalPadding = MAX_PADDING;
    }

    // Calculate the height and width of the map area within the padding.
    const paddingInnerHeight = pixelHeight * (1 - verticalPadding);
    const paddingInnerWidth = pixelWidth * (1 - horizontalPadding);

    const bounds = new GeoBounds(sw, ne);
    const nw = new Coordinate(bounds.ne.latitude, bounds.sw.longitude);

    // Get the height and width of the bounds to fit as degrees of longitude.
    const height = bounds.sw.distanceTo(nw, Unit.DEGREE, Projection.MERCATOR);
    const width = (bounds.ne.longitude - nw.longitude + 360) % 360;

    // Fit the bounds within the area of the map like object-fit:contain then extend the bounds
    // to fill the remaining area within the padding.
    let newHeight =
      Math.max(height, (width * paddingInnerHeight) / paddingInnerWidth) /
      (1 - verticalPadding);
    let newWidth =
      Math.max(width, (height * paddingInnerWidth) / paddingInnerHeight) /
      (1 - horizontalPadding);

    // Calculate the zoom based on the pixel width of the map and the degree width of the bounds.
    let zoom = Math.log2((pixelWidth * 360) / newWidth) - 8;

    // If the calculated zoom is greater the max zoom, use the max zoom and calculate the map bounds
    // width and height based on the max zoom.
    if (zoom > maxZoom) {
      zoom = maxZoom;
      newWidth = (pixelWidth * 360) / 2 ** (zoom + 8);
      newHeight = (newWidth * pixelHeight) / pixelWidth;
    }

    // Move the center to the center of the area within the padding.
    const center = bounds.getCenter(Projection.MERCATOR);
    const deltaLat = ((paddingTop - paddingBottom) / 2) * newHeight;
    const deltaLon = ((paddingRight - paddingLeft) / 2) * newWidth;

    center.add(deltaLat, deltaLon, Unit.DEGREE, Projection.MERCATOR);

    this.setZoomCenter(zoom, center, animated);
  }

  /**
   * @param coordinate - Must be convertible to {@link Coordinate}
   * @param animated - Whether to transition smoothly to the new center
   */
  setCenter(coordinate: object, animated = false) {
    this._map.setCenter(new Coordinate(coordinate), animated);
  }

  /**
   * Padding is used by {@link Map#fitCoordinates}.
   * Padding can either be constant values or funtions that return a padding value.
   * Constant values are good if the map should always have the same padding on every breakpoint.
   * Functions are useful if the map should have different padding at different breakpoints/layouts.
   * The function can check window.innerWidth or any other condition before returning a number.
   * @param padding - padding.bottom: Minimum number of pixels between the map's bottom edge and a pin
   * padding.left: Minimum number of pixels between the map's left edge and a pin
   * padding.right: Minimum number of pixels between the map's right edge and a pin
   * padding.top: Minimum number of pixels between the map's top edge and a pin
   */
  setPadding({
    bottom = this._padding.bottom,
    left = this._padding.left,
    right = this._padding.right,
    top = this._padding.top,
  }: {
    bottom?: number | PaddingFunction;
    left?: number | PaddingFunction;
    right?: number | PaddingFunction;
    top?: number | PaddingFunction;
  }): Map {
    this._padding = { bottom, left, right, top };
    return this;
  }

  setPanHandler(panHandler: PanHandler) {
    assertType(panHandler, Type.FUNCTION);

    this._panHandler = panHandler;
  }

  setPanStartHandler(panStartHandler: PanStartHandler) {
    assertType(panStartHandler, Type.FUNCTION);

    this._panStartHandler = panStartHandler;
  }

  /**
   * @param animated - Whether to transition smoothly to the new zoom
   * @see Map#getZoom
   */
  setZoom(zoom: number, animated = false) {
    this._map.setZoom(zoom, animated);
  }

  /**
   * @param center - Must be convertible to {@link Coordinate}
   * @param animated - Whether to transition smoothly to the new bounds
   * @see Map#setZoom
   * @see Map#setCenter
   */
  setZoomCenter(zoom: number, center: Coordinate, animated = false) {
    this._map.setZoomCenter(zoom, center, animated);
  }

  /**
   * Set the map state to idle
   */
  _setIdle() {
    this._resolveMoving();
    this._movingPromise = new Promise(
      (resolve) => (this._resolveMoving = resolve)
    );
    this._resolveIdle();
  }

  /**
   * Set the map state to moving
   */
  _setMoving() {
    this._resolveIdle();
    this._idlePromise = new Promise((resolve) => (this._resolveIdle = resolve));
    this._resolveMoving();
  }
}

export { MapOptions, Map };
