// @ts-nocheck
/** @module @yext/components-maps */

import { Coordinate } from "../coordinate";
import { LoadScript } from "../performance/loadContent";
import { MapProviderOptions } from "../mapProvider";
import { ProviderMap } from "../providerMap";
import { HTMLProviderPin } from "../providerPin";

/**
 * @enum {string}
 */
const Library = {
  GEOCODER: "geocoder",
  PLACES: "places",
};

// Map Class

/**
 * @extends module:@yext/components-maps~ProviderMap
 */
class GoogleMap extends ProviderMap {
  /**
   * @param {module:@yext/components-maps~ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

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
  getCenter() {
    return new Coordinate(this.map.getCenter());
  }

  /**
   * @inheritdoc
   */
  getZoom() {
    return this.map.getZoom();
  }

  /**
   * @inheritdoc
   */
  setCenter(coordinate, animated) {
    const latLng = new google.maps.LatLng(
      coordinate.latitude,
      coordinate.longitude
    );

    if (animated) {
      this.map.panTo(latLng);
    } else {
      this.map.setCenter(latLng);
    }
  }

  /**
   * @inheritdoc
   */
  setZoom(zoom, animated) {
    // Set zoom level to integer value to avoid zoom change on the next bounds change.
    this.map.setZoom(Math.floor(zoom));
  }

  /**
   * @inheritdoc
   */
  setZoomCenter(zoom, center, animated) {
    this.setCenter(center, animated);
    this.setZoom(zoom, animated);
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~HTMLProviderPin
 */
class GooglePin extends HTMLProviderPin {
  /**
   * @param {module:@yext/components-maps~ProviderPinOptions} options
   */
  constructor(options) {
    super(options);

    this._wrapper.style.position = "absolute";
    google.maps.OverlayView.preventMapHitsAndGesturesFrom(this._wrapper);

    const that = this;

    class CustomMarker extends google.maps.OverlayView {
      draw() {
        const position = this.getProjection()?.fromLatLngToDivPixel(
          that._latLng
        );

        if (position) {
          that._wrapper.style.left = position.x + "px";
          that._wrapper.style.top = position.y + "px";
        }
      }

      onAdd() {
        this.getPanes().floatPane.appendChild(that._wrapper);
      }

      onRemove() {
        that._wrapper.parentNode?.removeChild(that._wrapper);
      }
    }

    this.pin = new CustomMarker();
  }

  /**
   * @inheritdoc
   */
  setCoordinate(coordinate) {
    this._latLng = new google.maps.LatLng(
      coordinate.latitude,
      coordinate.longitude
    );
    this.pin.draw();
  }

  /**
   * @inheritdoc
   */
  setMap(newMap, currentMap) {
    this.pin.setMap(newMap ? newMap.getProviderMap().map : null);
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
  resolve,
  reject,
  apiKey,
  {
    autocomplete = false,
    channel = window.location.hostname,
    client,
    language,
    libraries = [],
    params = {},
  } = {}
) {
  window[globalCallback] = resolve;

  if (autocomplete) {
    libraries.push(Library.GEOCODER, Library.PLACES);
  }

  const apiParams = {
    callback: globalCallback,
    channel,
    language,
    libraries: libraries.join(","),
    ...params,
  };

  if (apiKey) {
    apiParams.key = apiKey;
  }

  if (client) {
    apiParams.client = client;
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
