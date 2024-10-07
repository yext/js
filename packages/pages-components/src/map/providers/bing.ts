
import { Coordinate } from "../coordinate.js";
import { LoadScript } from "../performance/loadContent.js";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { Map } from "../map.js";
import { HTMLProviderPin, ProviderPinOptions } from "../providerPin.js";

// Map Class

// CustomOverlay for HTML Pins
let PinOverlay: any;
declare const window: Window &
  typeof globalThis & { [key: string]: any };

function initPinOverlayClass() {
  class PinOverlayClass extends Microsoft.Maps.CustomOverlay {
    _container: HTMLElement;
    _pins: Set<BingPin>;
    _viewChangeEventHandler: Microsoft.Maps.IHandlerId | null;
    // @ts-expect-error Property '_map' in type 'PinOverlayClass' is not assignable to the same property in base type 'CustomOverlay'.
    _map: Microsoft.Maps.Map | null;
    constructor() {
      super({ beneathLabels: false });

      this._container = document.createElement("div");
      this._pins = new Set<BingPin>();
      this._viewChangeEventHandler = null;

      this._container.style.position = "absolute";
      this._container.style.left = "0";
      this._container.style.top = "0";
    }

    addPin(pin: BingPin) {
      this._pins.add(pin);
      if (pin._wrapper) {
        pin._wrapper.style.position = "absolute";
        this._container.appendChild(pin._wrapper);
      }

      if (this._map) {
        this.updatePinPosition(pin);
      }
    }

    onAdd() {
      this._map = this.getMap();
      this.setHtmlElement(this._container);
    }

    onLoad() {
      this._viewChangeEventHandler = Microsoft.Maps.Events.addHandler(
        this._map,
        "viewchange",
        () => this.updatePinPositions()
      );
      this.updatePinPositions();
    }

    onRemove() {
      if (this._viewChangeEventHandler) {
        Microsoft.Maps.Events.removeHandler(this._viewChangeEventHandler);
      }
      this._map = null;
    }

    removePin(pin: BingPin) {
      this._pins.delete(pin);
      if (pin._wrapper) {
        this._container.removeChild(pin._wrapper);
      }
    }

    updatePinPosition(pin: BingPin) {
      if (!this._map) {
        return;
      }

      const topLeft = this._map.tryLocationToPixel(
        pin._location,
        Microsoft.Maps.PixelReference.control
      );
      if (pin._wrapper) {
        if (topLeft instanceof Microsoft.Maps.Point) {
          pin._wrapper.style.left = topLeft.x + "px";
          pin._wrapper.style.top = topLeft.y + "px";

        }
      }
    }

    updatePinPositions() {
      this._pins.forEach((pin: BingPin) => this.updatePinPosition(pin));
    }
  }

  PinOverlay = PinOverlayClass;
}

class BingMap extends ProviderMap {

  wrapper: HTMLElement | null;
  map?: Microsoft.Maps.Map;
  pinOverlay: typeof PinOverlay;

  constructor(options: ProviderMapOptions) {
    super(options);

    this.wrapper = options.wrapper;
    if (!this.wrapper) {
      return
    }
    this.map = new Microsoft.Maps.Map(this.wrapper, {
      disablePanning: !options.controlEnabled,
      disableZooming: !options.controlEnabled,
      showLocateMeButton: false,
      showMapTypeSelector: false,
      showScalebar: false,
      showTrafficButton: false,
      ...options.providerOptions,
    } as Microsoft.Maps.IMapLoadOptions);

    this.pinOverlay = new PinOverlay(this.map);
    this.map.layers.insert(this.pinOverlay);

    Microsoft.Maps.Events.addHandler(this.map, "viewchangestart", () =>
      this._panStartHandler()
    );
    Microsoft.Maps.Events.addHandler(this.map, "viewchangeend", () =>
      this._panHandler()
    );
  }

  /**
   * {@inheritDoc ProviderMap.getCenter}
   */
  getCenter(): Coordinate {
    return new Coordinate(this.map?.getCenter() ?? { lat: 0, lng: 0 });
  }

  /**
   * {@inheritDoc ProviderMap.getZoom}
   */
  getZoom(): number {
    return this.map?.getZoom() ?? 0;
  }

  /**
   * {@inheritDoc ProviderMap.setCenter}
   */
  setCenter(coordinate: Coordinate, _: boolean) {
    const center = new Microsoft.Maps.Location(
      coordinate.latitude,
      coordinate.longitude
    );
    this.map?.setView({ center });
    this.pinOverlay.updatePinPositions();
  }

  /**
   * {@inheritDoc ProviderMap.setZoom}
   */
  setZoom(zoom: number, _: boolean) {
    // Bing only allows integer zoom
    this.map?.setView({ zoom: Math.floor(zoom) });
    this.pinOverlay.updatePinPositions();
  }
}

// Pin Class
class BingPin extends HTMLProviderPin {
  _location: Microsoft.Maps.Location;
  _map: Map | null;
  static _pinId?: number;
  /**
   * Bing pins need global callbacks to complete initialization.
   * This function provides a unique ID to include in the name of the callback.
   * @returns An ID for the pin unique across all instances of {@link BingPin}
   */
  static getId(): number {
    this._pinId = (this._pinId || 0) + 1;
    return this._pinId;
  }

  constructor(options: ProviderPinOptions) {
    super(options);

    this._map = null;
    this._location = new Microsoft.Maps.Location(0, 0);
  }

  /**
   * {@inheritDoc HTMLProviderPin.setCoordinate}
   */
  setCoordinate(coordinate: Coordinate) {
    this._location = new Microsoft.Maps.Location(
      coordinate.latitude,
      coordinate.longitude
    );

    if (this._map) {
      (this._map.getProviderMap() as BingMap).pinOverlay.updatePinPosition(this);
    }
  }

  /**
   * {@inheritDoc HTMLProviderPin.setMap}
   */
  setMap(newMap: Map, currentMap: Map) {
    if (currentMap) {
      (currentMap.getProviderMap() as BingMap).pinOverlay.removePin(this);
    }

    if (newMap) {
      (newMap.getProviderMap() as BingMap).pinOverlay.addPin(this);
    }

    this._map = newMap;
  }
}

// Load Function

// Random token obtained from `echo BingMapsCallbackYext | md5 | cut -c -8`
const globalCallback = "BingMapsCallback_593d7d33";
const baseUrl = "https://www.bing.com/api/maps/mapcontrol";

/**
 * This function is called when calling {@link MapProvider#load}
 * on {@link BingMaps}.
 * @param resolve - Callback with no arguments called when the load finishes successfully
 * @param reject - Callback with no arguments called when the load fails
 * @param apiKey - Provider API key
 * @param options - Additional provider-specific options
 * options.params=\{\} - Additional API params
 * @see ProviderLoadFunction
 */
function load(resolve: () => void, _: () => void, apiKey: string, { params = {} } = {}) {
  window[globalCallback] = () => {
    initPinOverlayClass();
    resolve();
  };

  const apiParams = {
    callback: globalCallback,
    key: apiKey,
    ...params,
  };

  LoadScript(
    baseUrl +
    "?" +
    Object.entries(apiParams)
      .map(([key, value]) => key + "=" + value)
      .join("&")
  );
}

// Exports
const BingMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(BingMap)
  .withPinClass(BingPin)
  .withProviderName("Bing")
  .build();

export { BingMaps };
