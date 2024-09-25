/** @module @yext/components-maps */

import { Type, assertType, assertInstance } from "./util/assertions.js";
import { ProviderMapOptions, ProviderMap } from "./providerMap.js";
import { ProviderPinOptions, ProviderPin } from "./providerPin.js";

type ProviderLoadFunction = (resolve: Function, reject: Function, apiKey: string, options: Object) => void;

/**
 * {@link module:@yext/components-maps~MapProvider MapProvider} options class
 */
class MapProviderOptions {
  loadFunction: ProviderLoadFunction;
  mapClass: typeof ProviderMap;
  pinClass: typeof ProviderPin;
  providerName: string;
  constructor() {
    this.loadFunction = (resolve, reject, apiKey, options) => resolve();
    this.mapClass = ProviderMap;
    this.pinClass = ProviderPin;
    this.providerName = "";
  }

  /**
   * @param loadFunction
   */
  withLoadFunction(loadFunction: ProviderLoadFunction): MapProviderOptions {
    assertType(loadFunction, Type.FUNCTION);

    this.loadFunction = loadFunction;
    return this;
  }

  /**
   * @param mapClass Subclass of {@link module:@yext/components-maps~ProviderMap ProviderMap}
   *   for the provider
   */
  withMapClass(mapClass: typeof ProviderMap): MapProviderOptions {
    this.mapClass = mapClass;
    return this;
  }

  /**
   * @param pinClass Subclass of {@link module:@yext/components-maps~ProviderPin ProviderPin}
   *   for the provider
   */
  withPinClass(pinClass: typeof ProviderPin): MapProviderOptions {
    this.pinClass = pinClass;
    return this;
  }

  /**
   * @param {string} providerName Name of the map provider
   */
  withProviderName(providerName: string): MapProviderOptions {
    this.providerName = providerName;
    return this;
  }

  build(): MapProvider {
    return new MapProvider(this);
  }
}

/**
 * This class is used for loading the API for a map provider such as Google Maps and creating {@link module:@yext/components-maps~ProviderMap ProviderMap}
 * and {@link module:@yext/components-maps~ProviderPin ProviderPin} instances.
 * Provider map implementations return an instance of this class for their provider that you can use
 * to load the API and pass in to {@link module:@yext/components-maps~MapOptions MapOptions} and {@link module:@yext/components-maps~MapPinOptions MapPinOptions} objects as the provider.
 * Example using {@link module:@yext/components-maps~GoogleMaps GoogleMaps}, an instance of this
 * class: GoogleMaps.load().then(() => map = new MapOptions().withProvider(GoogleMaps).build());
 */
class MapProvider {
  _loadFunction: ProviderLoadFunction;
  _mapClass: typeof ProviderMap;
  _pinClass: typeof ProviderPin;
  _providerName: string;
  _loadPromise: Promise<void>;
  _resolveLoad?: Function;
  _rejectLoad?: Function;
  _apiKey: string;
  _loadInvoked: boolean;
  _loaded: boolean;
  _options: any;

  constructor(options: MapProviderOptions) {
    assertInstance(options, MapProviderOptions);

    this._loadFunction = options.loadFunction;
    this._mapClass = options.mapClass;
    this._pinClass = options.pinClass;
    this._providerName = options.providerName;

    this._loadPromise = new Promise((resolve, reject) => {
      this._resolveLoad = resolve;
      this._rejectLoad = reject;
    });

    this._apiKey = "";
    this._loadInvoked = false;
    this._loaded = false;
    this._options = {};
  }

  /**
   * Returns true if the map provider has been successfully loaded
   */
  get loaded(): boolean {
    return this._loaded;
  }

  /**
   * @see module:@yext/components-maps~MapProviderOptions#withMapClass
   */
  getMapClass(): typeof ProviderMap {
    return this._mapClass;
  }

  /**
   * @see module:@yext/components-maps~MapProviderOptions#withPinClass
   */
  getPinClass(): typeof ProviderPin {
    return this._pinClass;
  }

  /**
   * @see module:@yext/components-maps~MapProviderOptions#withProviderName
   */
  getProviderName(): string{
    return this._providerName;
  }

  /**
   * Call {@link module:@yext/components-maps~MapPinOptions~loadFunction MapPinOptions~loadFunction}
   * and resolve or reject when loading succeeds or fails
   * @async
   * @param apiKey Provider API key -- uses value from {@link module:@yext/components-maps~MapProvider#setLoadOptions MapProvider#setLoadOptions}
   *   if not passed
   * @param options Additional provider-specific options -- uses value from {@link module:@yext/components-maps~MapProvider#setLoadOptions MapProvider#setLoadOptions}
   *   if not passed
   */
  async load(apiKey: string = this._apiKey, options: any = this._options) {
    if (!this._loadInvoked && this._resolveLoad && this._rejectLoad) {
      this._loadInvoked = true;
      this._loadFunction(this._resolveLoad, this._rejectLoad, apiKey, options);
    }

    await this.ready();
    this._loaded = true;
  }

  /**
   * Resolves or rejects when the map provider has loaded successfully or unsuccessfully
   * @async
   */
  async ready() {
    await this._loadPromise;
  }

  /**
   * Set the API key and provider options used on load. Does nothing if load was already called.
   * @param apiKey Provider API key
   * @param options Additional provider-specific options
   */
  setLoadOptions(apiKey: string, options: Object | null = null) {
    if (!this._loadInvoked) {
      this._apiKey = apiKey;
      this._options = options || this._options;
    }
  }
}

export { MapProviderOptions, MapProvider };
