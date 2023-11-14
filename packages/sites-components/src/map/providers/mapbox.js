// @ts-nocheck
/** @module @yext/components-maps */

import { Coordinate } from "../coordinate";
import { MapProviderOptions } from "../mapProvider";
import { ProviderMap } from "../providerMap";
import { HTMLProviderPin } from "../providerPin";

// GENERATOR TODO: call map resize method when hidden/shown (CoreBev, used to be done in Core.js)

// Map Class

/**
 * @extends module:@yext/components-maps~ProviderMap
 */
class MapboxMap extends ProviderMap {
  /**
   * @param {module:@yext/components-maps~ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

    this.map = new mapboxgl.Map({
      container: options.wrapper,
      interactive: options.controlEnabled,
      style: "mapbox://styles/mapbox/streets-v9",
      ...options.providerOptions,
    });

    // Add the zoom control
    if (options.controlEnabled) {
      const zoomControl = new mapboxgl.NavigationControl({
        showCompass: false,
      });
      this.map.addControl(zoomControl);
    }

    this.map.on("movestart", () => this._panStartHandler());
    this.map.on("moveend", () => this._panHandler());
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
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    return this.map.getZoom() + 1;
  }

  /**
   * @inheritdoc
   */
  setCenter(coordinate, animated) {
    const center = new mapboxgl.LngLat(
      coordinate.longitude,
      coordinate.latitude
    );

    this.map[animated ? "panTo" : "setCenter"](center);
  }

  /**
   * @inheritdoc
   */
  setZoom(zoom, animated) {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    this.map[animated ? "zoomTo" : "setZoom"](zoom - 1);
  }

  /**
   * @inheritdoc
   */
  setZoomCenter(zoom, coordinate, animated) {
    const center = new mapboxgl.LngLat(
      coordinate.longitude,
      coordinate.latitude
    );

    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    this.map[animated ? "easeTo" : "jumpTo"]({ center, zoom: zoom - 1 });
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~HTMLProviderPin
 */
class MapboxPin extends HTMLProviderPin {
  /**
   * @param {module:@yext/components-maps~ProviderPinOptions} options
   */
  constructor(options) {
    super(options);

    this._wrapper.style.position = "relative";
    this.pin = new mapboxgl.Marker({
      anchor: "top-left",
      element: this._wrapper,
    });
  }

  /**
   * @inheritdoc
   */
  setCoordinate(coordinate) {
    this.pin.setLngLat(
      new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude)
    );
  }

  /**
   * @inheritdoc
   */
  setMap(newMap, currentMap) {
    if (newMap) {
      this.pin.addTo(newMap.getProviderMap().map);
    } else {
      this.pin.remove();
    }
  }
}

// Load Function

/**
 * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
 * on {@link module:@yext/components-maps~MapboxMaps MapboxMaps}.
 * @alias module:@yext/components-maps~loadMapboxMaps
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {string} apiKey Provider API key
 * @param {Object} options Additional provider-specific options
 * @param {string} [options.version='v1.13.0'] API version
 * @see module:@yext/components-maps~ProviderLoadFunction
 */
function load(resolve, reject, apiKey, { version = "v1.13.0" } = {}) {
  const baseUrl = `https://api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl`;

  const mapStyle = document.createElement("link");
  mapStyle.rel = "stylesheet";
  mapStyle.href = baseUrl + ".css";

  const mapScript = document.createElement("script");
  mapScript.src = baseUrl + ".js";
  mapScript.onload = () => {
    mapboxgl.accessToken = apiKey;
    resolve();
  };

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

/**
 * @type {module:@yext/components-maps~MapProvider}
 */
const MapboxMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(MapboxMap)
  .withPinClass(MapboxPin)
  .withProviderName("Mapbox")
  .build();

export { MapboxMaps };
