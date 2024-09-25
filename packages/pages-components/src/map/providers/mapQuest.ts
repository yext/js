/** @module @yext/components-maps */

import L from "leaflet";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMapOptions } from "../providerMap.js";
import { LeafletMaps } from "./leaflet.js";

const LeafletMap = LeafletMaps.getMapClass();
const LeafletPin = LeafletMaps.getPinClass();


// Map Class


/**
 * @extends module:@yext/components-maps~LeafletMap
 */
class MapQuestMap extends LeafletMap {
  //@ts-ignore
  map: L.mapquest.map;
  /**
   * @inheritdoc
   */
  _initMap(options: ProviderMapOptions) {
    //@ts-ignore
    this.map = L.mapquest.map(options.wrapper, {
      boxZoom: options.controlEnabled,
      center: new L.LatLng(0, 0),
      doubleClickZoom: options.controlEnabled,
      dragging: options.controlEnabled,
      //@ts-ignore
      layers: L.mapquest.tileLayer("map"),
      zoom: 0,
      zoomControl: options.controlEnabled,
      zoomSnap: 0,
      ...options.providerOptions,
    });
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~LeafletPin
 */
class MapQuestPin extends LeafletPin { }

// Load Function

/**
 * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
 * on {@link module:@yext/components-maps~MapQuestMaps MapQuestMaps}.
 * @alias module:@yext/components-maps~loadMapQuestMaps
 * @param resolve Callback with no arguments called when the load finishes successfully
 * @param reject Callback with no arguments called when the load fails
 * @param apiKey Provider API key
 * @param options Additional provider-specific options
 * @param options.version='v1.3.2' API version
 * @see module:@yext/components-maps~ProviderLoadFunction
 */
function load(resolve: Function, reject: Function, apiKey: string, { version = "v1.3.2" } = {}) {
  const baseUrl = `https://api.mqcdn.com/sdk/mapquest-js/${version}/mapquest-maps`;

  const mapStyle = document.createElement("link");
  mapStyle.rel = "stylesheet";
  mapStyle.href = baseUrl + ".css";

  const mapScript = document.createElement("script");
  mapScript.src = baseUrl + ".js";
  mapScript.onload = () => {
    //@ts-ignore
    L.mapquest.key = apiKey;
    resolve();
  };

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

/**
 * @type {module:@yext/components-maps~MapProvider}
 */
const MapQuestMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(MapQuestMap)
  .withPinClass(MapQuestPin)
  .withProviderName("MapQuest")
  .build();

export { MapQuestMaps };
