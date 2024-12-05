import { Type, assertType, assertInstance } from "./util/assertions.js";
import { ProviderMap } from "./providerMap.js";
import { ProviderPin } from "./providerPin.js";

type ProviderLoadFunction = (
  resolve: () => void,
  reject: () => void,
  apiKey: string,
  options: object
) => void;

/**
 * {@link MapProvider} options class
 */
class MapProviderOptions {
  loadFunction: ProviderLoadFunction;
  mapClass: typeof ProviderMap;
  pinClass: typeof ProviderPin;
  providerName: string;
  constructor() {
    this.loadFunction = (resolve, _, __, ___) => resolve();
    this.mapClass = ProviderMap;
    this.pinClass = ProviderPin;
    this.providerName = "";
  }

  withLoadFunction(loadFunction: ProviderLoadFunction): MapProviderOptions {
    assertType(loadFunction, Type.FUNCTION);

    this.loadFunction = loadFunction;
    return this;
  }

  /**
   * @param mapClass - Subclass of {@link ProviderMap}
   *   for the provider
   */
  withMapClass(mapClass: typeof ProviderMap): MapProviderOptions {
    this.mapClass = mapClass;
    return this;
  }

  /**
   * @param pinClass - Subclass of {@link ProviderPin} for the provider
   */
  withPinClass(pinClass: typeof ProviderPin): MapProviderOptions {
    this.pinClass = pinClass;
    return this;
  }

  /**
   * @param providerName - Name of the map provider
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
 * This class is used for loading the API for a map provider such as Google Maps and creating {@link ProviderMap}
 * and {@link ProviderPin} instances.
 * Provider map implementations return an instance of this class for their provider that you can use
 * to load the API and pass in to {@link MapOptions} and {@link MapPinOptions} objects as the provider.
 * Example using {@link GoogleMaps}, an instance of this
 * class: GoogleMaps.load().then(() =\> map = new MapOptions().withProvider(GoogleMaps).build());
 */
class MapProvider {
  _loadFunction: ProviderLoadFunction;
  _mapClass: typeof ProviderMap;
  _pinClass: typeof ProviderPin;
  _providerName: string;
  _loadPromise: Promise<void>;
  _resolveLoad?: () => void;
  _rejectLoad?: () => void;
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
   * @see ~MapProviderOptions#withMapClass
   */
  getMapClass(): typeof ProviderMap {
    return this._mapClass;
  }

  /**
   * @see MapProviderOptions#withPinClass
   */
  getPinClass(): typeof ProviderPin {
    return this._pinClass;
  }

  /**
   * @see MapProviderOptions#withProviderName
   */
  getProviderName(): string {
    return this._providerName;
  }

  /**
   * Call {@link loadFunction}
   * and resolve or reject when loading succeeds or fails
   * @param apiKey - Provider API key -- uses value from {@link MapProvider#setLoadOptions}
   *   if not passed
   * @param options - Additional provider-specific options -- uses value from {@link MapProvider#setLoadOptions}
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
   */
  async ready() {
    await this._loadPromise;
  }

  /**
   * Set the API key and provider options used on load. Does nothing if load was already called.
   * @param apiKey - Provider API key
   * @param options - Additional provider-specific options
   */
  setLoadOptions(apiKey: string, options: object | null = null) {
    if (!this._loadInvoked) {
      this._apiKey = apiKey;
      this._options = options || this._options;
    }
  }
}

export { MapProviderOptions, MapProvider };
