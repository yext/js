/** @module @yext/components-maps */

import { Type, assertType, assertInstance } from './util/assertions.js';
import { ProviderMapOptions, ProviderMap } from './providerMap.js';
import { ProviderPinOptions, ProviderPin } from './providerPin.js';

/**
 * @callback ProviderLoadFunction
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {string} apiKey Provider API key
 * @param {Object} [options={}] Additional provider-specific options
 */

/**
 * {@link module:@yext/components-maps~MapProvider MapProvider} options class
 */
class MapProviderOptions {
  constructor() {
    this.loadFunction = (resolve, reject, apiKey, options) => resolve();
    this.mapClass = ProviderMap;
    this.pinClass = ProviderPin;
    this.providerName = '';
  }

  /**
   * @param {module:@yext/components-maps~ProviderLoadFunction} loadFunction
   * @returns {module:@yext/components-maps~MapProviderOptions}
   */
  withLoadFunction(loadFunction) {
    assertType(loadFunction, Type.FUNCTION);

    this.loadFunction = loadFunction;
    return this;
  }

  /**
   * @param {module:@yext/components-maps~ProviderMap} mapClass Subclass of {@link module:@yext/components-maps~ProviderMap ProviderMap}
   *   for the provider
   * @returns {module:@yext/components-maps~MapProviderOptions}
   */
  withMapClass(mapClass) {
    this.mapClass = mapClass;
    return this;
  }

  /**
   * @param {module:@yext/components-maps~ProviderPin} pinClass Subclass of {@link module:@yext/components-maps~ProviderPin ProviderPin}
   *   for the provider
   * @returns {module:@yext/components-maps~MapProviderOptions}
   */
  withPinClass(pinClass) {
    this.pinClass = pinClass;
    return this;
  }

  /**
   * @param {string} providerName Name of the map provider
   * @returns {module:@yext/components-maps~MapProviderOptions}
   */
  withProviderName(providerName) {
    this.providerName = providerName;
    return this;
  }

  /**
   * @returns {module:@yext/components-maps~MapProvider}
   */
  build() {
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
  /**
   * @param {module:@yext/components-maps~MapProviderOptions} options
   */
  constructor(options) {
    assertInstance(options, MapProviderOptions);

    this._loadFunction = options.loadFunction;
    this._mapClass = options.mapClass;
    this._pinClass = options.pinClass;
    this._providerName = options.providerName;

    this._loadPromise = new Promise((resolve, reject) => {
      this._resolveLoad = resolve;
      this._rejectLoad = reject;
    });

    this._apiKey = '';
    this._loadInvoked = false;
    this._loaded = false;
    this._options = {};
  }

  /**
   * Returns true if the map provider has been successfully loaded
   * @type {boolean}
   */
  get loaded() {
    return this._loaded;
  }

  /**
   * @returns {module:@yext/components-maps~ProviderMap}
   * @see module:@yext/components-maps~MapProviderOptions#withMapClass
   */
  getMapClass() {
    return this._mapClass;
  }

  /**
   * @returns {module:@yext/components-maps~ProviderPin}
   * @see module:@yext/components-maps~MapProviderOptions#withPinClass
   */
  getPinClass() {
    return this._pinClass;
  }

  /**
   * @returns {string}
   * @see module:@yext/components-maps~MapProviderOptions#withProviderName
   */
  getProviderName() {
    return this._providerName;
  }

  /**
   * Call {@link module:@yext/components-maps~MapPinOptions~loadFunction MapPinOptions~loadFunction}
   * and resolve or reject when loading succeeds or fails
   * @async
   * @param {string} [apiKey] Provider API key -- uses value from {@link module:@yext/components-maps~MapProvider#setLoadOptions MapProvider#setLoadOptions}
   *   if not passed
   * @param {Object} [options] Additional provider-specific options -- uses value from {@link module:@yext/components-maps~MapProvider#setLoadOptions MapProvider#setLoadOptions}
   *   if not passed
   */
  async load(apiKey = this._apiKey, options = this._options) {
    if (!this._loadInvoked) {
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
   * @param {string} apiKey Provider API key
   * @param {?Object} [options=null] Additional provider-specific options
   */
  setLoadOptions(apiKey, options = null) {
    if (!this._loadInvoked) {
      this._apiKey = apiKey;
      this._options = options || this._options;
    }
  }
}

export {
  MapProviderOptions,
  MapProvider
}
