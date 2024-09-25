/** @module @yext/components-maps */

import { Coordinate } from "../coordinate.js";
import { LoadScript } from "../performance/loadContent.js";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { HTMLProviderPin, ProviderPinOptions } from "../providerPin.js";
import { Map } from "../map.js";

/**
 * @enum {string}
 */
const Library = {
  GEOCODER: "geocoder",
  PLACES: "places",
};

declare const window: Window &
  typeof globalThis & { [key: string]: any };

// Map Class

/**
 * @extends module:@yext/components-maps~ProviderMap
 */
class GoogleMap extends ProviderMap {
  map?: google.maps.Map;
  _moving?: boolean;
  /**
   * @param options
   */
  constructor(options: ProviderMapOptions) {
    super(options);

    if (!options.wrapper) {
      return;
    }
    this.map = new google.maps.Map(options.wrapper, {
      disableDefaultUI: !options.controlEnabled,
      fullscreenControl: false,
      gestureHandling: options.controlEnabled ? "auto" : "none",
      mapTypeControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: options.controlEnabled,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
      ...options.providerOptions,
    });

    this._moving = false;
    google.maps.event.addListener(this.map, "bounds_changed", () => {
      if (!this._moving) {
        this._moving = true;
        this._panStartHandler();
      }
    });
    google.maps.event.addListener(this.map, "idle", () => {
      this._moving = false;
      this._panHandler();
    });
  }

  /**
   * @inheritdoc
   */
  getCenter(): Coordinate {
    return new Coordinate(this.map?.getCenter() ?? { lat: 0, lng: 0 });
  }

  /**
   * @inheritdoc
   */
  getZoom(): number {
    return this.map?.getZoom() ?? 0;
  }

  /**
   * @inheritdoc
   */
  setCenter(coordinate: Coordinate, animated: boolean) {
    const latLng = new google.maps.LatLng(
      coordinate.latitude,
      coordinate.longitude
    );

    if (animated) {
      this.map?.panTo(latLng);
    } else {
      this.map?.setCenter(latLng);
    }
  }

  /**
   * @inheritdoc
   */
  setZoom(zoom: number, animated: boolean) {
    // Set zoom level to integer value to avoid zoom change on the next bounds change.
    this.map?.setZoom(Math.floor(zoom));
  }

  /**
   * @inheritdoc
   */
  setZoomCenter(zoom: number, center: Coordinate, animated: boolean) {
    this.setCenter(center, animated);
    this.setZoom(zoom, animated);
  }
}

// Pin Class

class CustomMarker extends google.maps.OverlayView {
  pin: GooglePin;
  constructor(pin: GooglePin) {
    super();
    this.pin = pin;
  }
  draw() {
    const position = this.getProjection()?.fromLatLngToDivPixel(
      this.pin._latLng ?? null
    );

    if (position && this.pin._wrapper) {
      this.pin._wrapper.style.left = position.x + "px";
      this.pin._wrapper.style.top = position.y + "px";
    }
  }

  onAdd() {
    if (this.pin._wrapper) {
      this.getPanes()?.floatPane.appendChild(this.pin._wrapper);

    }
  }

  onRemove() {
    this.pin._wrapper?.parentNode?.removeChild(this.pin._wrapper);
  }
}

/**
 * @extends module:@yext/components-maps~HTMLProviderPin
 */
class GooglePin extends HTMLProviderPin {
  _latLng?: google.maps.LatLng;
  pin: CustomMarker;
  /**
   * @param options
   */
  constructor(options: ProviderPinOptions) {
    super(options);

    if (this._wrapper) {
      this._wrapper.style.position = "absolute";
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this._wrapper);
    }

    this.pin = new CustomMarker(this);
  }

  /**
   * @inheritdoc
   */
  setCoordinate(coordinate: Coordinate) {
    this._latLng = new google.maps.LatLng(
      coordinate.latitude,
      coordinate.longitude
    );
    this.pin.draw();
  }

  /**
   * @inheritdoc
   */
  setMap(newMap: Map, currentMap: Map) {
    let googleMap = (newMap?.getProviderMap() as GoogleMap)?.map;
    this.pin.setMap(googleMap ?? null);
  }
}

// Load Function

// Random token obtained from `echo GoogleMapsCallbackYext | md5 | cut -c -8`
const globalCallback = "GoogleMapsCallback_b7d77ff2";
const baseUrl = "https://maps.googleapis.com/maps/api/js";

/**
 * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
 * on {@link module:@yext/components-maps~GoogleMaps GoogleMaps}.
 * @alias module:@yext/components-maps~loadGoogleMaps
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {string} apiKey Provider API key
 * @param {Object} options Additional provider-specific options
 * @param {boolean} [options.autocomplete=false] Whether to include Google's autocomplete API
 * @param {string} [options.channel=window.location.hostname] API key usage channel
 * @param {string} [options.client] Google API enterprise client
 * @param {string} [options.language] Language of the map
 * @param {module:Maps/Providers/Google.Library[]} [options.libraries=[]] Additional Google libraries to load
 * @param {Object<string,string>} [options.params={}] Additional API params
 * @see module:@yext/components-maps~ProviderLoadFunction
 */
function load(
  resolve: Function,
  reject: Function,
  apiKey: string,
  {
    autocomplete = false,
    channel = window.location.hostname,
    client,
    language,
    region,
    libraries = [],
    loading = "async",
    params = {},
  }: { autocomplete?: boolean, channel?: string, client?: string, language?: string, region?: string, libraries?: string[], params?: { [key: string]: string }, loading?: string } = {}
) {
  window[globalCallback] = resolve;

  if (autocomplete) {
    libraries.push(Library.GEOCODER, Library.PLACES);
  }

  const apiParams: { [key: string]: string } = {
    callback: globalCallback,
    channel,
    libraries: libraries.join(","),
    ...params,
  };

  if (apiKey) {
    apiParams.key = apiKey;
  }

  if (client) {
    apiParams.client = client;
  }

  if (language) {
    apiParams.language = language;
  }

  if (region) {
    apiParams.region = region;
  }

  if (loading) {
    apiParams.loading = loading;
  }

  LoadScript(
    baseUrl +
    "?" +
    Object.entries(apiParams)
      .map(([key, value]) => key + "=" + value)
      .join("&")
  );
}

// Exports

/**
 * @type {module:@yext/components-maps~MapProvider}
 */
const GoogleMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(GoogleMap)
  .withPinClass(GooglePin)
  .withProviderName("Google")
  .build();

export { GoogleMaps, Library };
