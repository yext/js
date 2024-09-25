/** @module @yext/components-maps */

import mapboxgl from "mapbox-gl";
import { Coordinate } from "../coordinate.js";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { HTMLProviderPin, ProviderPinOptions } from "../providerPin.js";
import { Map } from "../map.js";

// GENERATOR TODO: call map resize method when hidden/shown (CoreBev, used to be done in Core.js)

// Map Class

/**
 * @extends module:@yext/components-maps~ProviderMap
 */
class MapboxMap extends ProviderMap {
  /**
   * @param options
   */
  map?: mapboxgl.Map;
  constructor(options: ProviderMapOptions) {
    super(options);

    if (options.wrapper) {
      this.map = new mapboxgl.Map({
        container: options.wrapper,
        interactive: options.controlEnabled,
        style: "mapbox://styles/mapbox/streets-v9",
        ...options.providerOptions,
      });
    }

    // Add the zoom control
    if (options.controlEnabled) {
      const zoomControl = new mapboxgl.NavigationControl({
        showCompass: false,
      });
      this.map?.addControl(zoomControl);
    }

    this.map?.on("movestart", () => this._panStartHandler());
    this.map?.on("moveend", () => this._panHandler());
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
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    return (this.map?.getZoom() ?? 0) + 1;
  }

  /**
   * @inheritdoc
   */
  setCenter(coordinate: Coordinate, animated: boolean) {
    const center = new mapboxgl.LngLat(
      coordinate.longitude,
      coordinate.latitude
    );

    if (this.map) {
      this.map[animated ? "panTo" : "setCenter"](center);
    }
  }

  /**
   * @inheritdoc
   */
  setZoom(zoom: number, animated: boolean) {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    if (this.map) {
      this.map[animated ? "zoomTo" : "setZoom"](zoom - 1);
    }
  }

  /**
   * @inheritdoc
   */
  setZoomCenter(zoom: number, coordinate: Coordinate, animated: boolean) {
    const center = new mapboxgl.LngLat(
      coordinate.longitude,
      coordinate.latitude
    );

    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    if (this.map) {
      this.map[animated ? "easeTo" : "jumpTo"]({ center, zoom: zoom - 1 });
    }
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~HTMLProviderPin
 */
class MapboxPin extends HTMLProviderPin {
  /**
   * @param options
   */
  pin?: mapboxgl.Marker;
  constructor(options: ProviderPinOptions) {
    super(options);

    if (this._wrapper) {
      this._wrapper.style.position = "relative";
      this.pin = new mapboxgl.Marker({
        anchor: "top-left",
        element: this._wrapper,
      });
    }
  }

  /**
   * @inheritdoc
   */
  setCoordinate(coordinate: Coordinate) {
    this.pin?.setLngLat(
      new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude)
    );
  }

  /**
   * @inheritdoc
   */
  setMap(newMap: Map, currentMap: Map) {
    if (newMap) {
      const mapboxMap = (newMap.getProviderMap() as MapboxMap).map;
      if (mapboxMap) {
        this.pin?.addTo(mapboxMap);
      }
    } else {
      this.pin?.remove();
    }
  }
}

// Load Function

/**
 * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
 * on {@link module:@yext/components-maps~MapboxMaps MapboxMaps}.
 * @alias module:@yext/components-maps~loadMapboxMaps
 * @param resolve Callback with no arguments called when the load finishes successfully
 * @param reject Callback with no arguments called when the load fails
 * @param apiKey Provider API key
 * @param options Additional provider-specific options
 * @param options.version='v1.13.0' API version
 * @see module:@yext/components-maps~ProviderLoadFunction
 */
function load(resolve: Function, reject: Function, apiKey: string, { version = "v1.13.0" } = {}) {
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
