/** @module @yext/components-maps */

import { Coordinate } from '../coordinate';
import { MapProviderOptions } from '../mapProvider';
import { ProviderMap } from '../providerMap';
import { LeafletMaps } from './leaflet';

const LeafletMap = LeafletMaps.getMapClass();
const LeafletPin = LeafletMaps.getPinClass();

// Map Class

/**
 * @extends module:@yext/components-maps~LeafletMap
 */
class MapQuestMap extends LeafletMap {
  /**
   * @inheritdoc
   */
  _initMap(options) {
    this.map = L.mapquest.map(options.wrapper, {
      boxZoom: options.controlEnabled,
      center: new L.latLng(0, 0),
      doubleClickZoom: options.controlEnabled,
      dragging: options.controlEnabled,
      layers: L.mapquest.tileLayer('map'),
      zoom: 0,
      zoomControl: options.controlEnabled,
      zoomSnap: 0,
      ...options.providerOptions
    });
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~LeafletPin
 */
class MapQuestPin extends LeafletPin {}

// Load Function

 /**
  * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
  * on {@link module:@yext/components-maps~MapQuestMaps MapQuestMaps}.
  * @alias module:@yext/components-maps~loadMapQuestMaps
  * @param {function} resolve Callback with no arguments called when the load finishes successfully
  * @param {function} reject Callback with no arguments called when the load fails
  * @param {string} apiKey Provider API key
  * @param {Object} options Additional provider-specific options
  * @param {string} [options.version='v1.3.2'] API version
  * @see module:@yext/components-maps~ProviderLoadFunction
  */
function load(resolve, reject, apiKey, {
  version = 'v1.3.2'
} = {}) {
  const baseUrl = `https://api.mqcdn.com/sdk/mapquest-js/${version}/mapquest-maps`;

  const mapStyle = document.createElement('link');
  mapStyle.rel = 'stylesheet';
  mapStyle.href = baseUrl + '.css';

  const mapScript = document.createElement('script');
  mapScript.src = baseUrl + '.js';
  mapScript.onload = () => {
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
  .withProviderName('MapQuest')
  .build();

export {
  MapQuestMaps
};
