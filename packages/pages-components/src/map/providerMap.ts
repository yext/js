import { Type, assertType, assertInstance, assertElement } from "./util/assertions.js";
import { MapProvider } from "./mapProvider.js";
import { PanHandler, PanStartHandler } from "./map.js";
import { Coordinate } from "./coordinate.js";

/**
 * {@link ProviderMap} options class
 */
class ProviderMapOptions {
  /**
   * @param wrapper - The wrapper element that the map will be inserted into
   */
  providerMapClass: typeof ProviderMap;
  wrapper: HTMLElement | null;
  controlEnabled: boolean;
  panHandler: PanHandler;
  panStartHandler: PanStartHandler;
  providerOptions: { [key: string]: any };
  instance: typeof mapboxgl;

  constructor(provider: MapProvider, wrapper: HTMLElement | null) {
    assertInstance(provider, MapProvider);
    if (wrapper) {
      assertElement(wrapper);
    }

    this.providerMapClass = provider.getMapClass();
    this.wrapper = wrapper;

    this.controlEnabled = true;
    this.panHandler = () => null;
    this.panStartHandler = () => null;
    this.providerOptions = {};
    this.instance = mapboxgl;
  }

  /**
   * @param controlEnabled - Whether the user can interact with the map
   */
  withControlEnabled(controlEnabled: boolean): ProviderMapOptions {
    this.controlEnabled = controlEnabled;
    return this;
  }

  /**
   * @param panHandler - Function called after the map bounds change
   */
  withPanHandler(panHandler: PanHandler): ProviderMapOptions {
    assertType(panHandler, Type.FUNCTION);

    this.panHandler = panHandler;
    return this;
  }

  /**
   * @param panStartHandler - Function called before the map bounds change
   */
  withPanStartHandler(panStartHandler: PanStartHandler): ProviderMapOptions {
    assertType(panStartHandler, Type.FUNCTION);

    this.panStartHandler = panStartHandler;
    return this;
  }

  /**
   * @param providerOptions - A free-form object used to set any additional provider-specific
   *   options, usually by passing the object to the map's constructor
   */
  withProviderOptions(providerOptions: object): ProviderMapOptions {
    this.providerOptions = providerOptions;
    return this;
  }

  withInstance(instance: typeof mapboxgl): ProviderMapOptions {
    this.instance = instance;
    return this;
  }

  /**
   * @returns An instance of a subclass of {@link ProviderMap}
   *   for the given {@link MapProvider}
   */
  build(): ProviderMap {
    const providerMapClass = this.providerMapClass;
    return new providerMapClass(this);
  }
}

/**
 * This class is an interface that should be implemented for each map provider, such as Google Maps.
 * It is used as an API for a {@link Map} to control a
 * provider-specific map instance. Ideally, this class should have minimal functionality so that
 * adding a new provider is easy and behavior is as consistent as possible across all providers.
 */
class ProviderMap {
  /**
   * The constructor creates a map instance using the provider's API and initializes it with all the
   * given options. See {@link ProviderMapOptions}
   * for the supported options.
   */
  _panHandler: PanHandler;
  _panStartHandler: PanStartHandler;

  constructor(options: ProviderMapOptions) {
    assertInstance(options, ProviderMapOptions);

    // When implementing a new MapProvider, call _panStartHandler when the map viewport starts
    // changing, and call _panHandler when it stops.
    this._panHandler = options.panHandler;
    this._panStartHandler = options.panStartHandler;
  }

  /**
   * The current center of the map
   */
  getCenter(): Coordinate {
    throw new Error("not implemented");
  }

  /**
   * Zoom level complies with the specifications in {@link Map#getZoom}
   * @returns The current zoom level of the map
   */
  getZoom(): number {
    throw new Error("not implemented");
  }

  /**
   * @param coordinate - The new center for the map
   * @param animated - Whether to transition smoothly to the new center
   */
  setCenter(_: Coordinate, __: boolean) {
    throw new Error("not implemented");
  }

  /**
   * Zoom level complies with the specifications in {@link Map#getZoom}
   * @param zoom - The new zoom level for the map
   * @param animated - Whether to transition smoothly to the new zoom
   */
  setZoom(_: number, __: boolean) {
    throw new Error("not implemented");
  }

  /**
   * @param center - Must be convertible to {@link Coordinate}
   * @param animated - Whether to transition smoothly to the new bounds
   * @see ProviderMap#setZoom
   * @see ProviderMap#setCenter
   */
  setZoomCenter(zoom: number, center: Coordinate, animated: boolean) {
    // This method doesn't need to be implemented for each provider,
    // but it can be overridden if this default implementation doesn't work.
    this.setZoom(zoom, animated);
    this.setCenter(center, animated);
  }
}

export { ProviderMapOptions, ProviderMap };
