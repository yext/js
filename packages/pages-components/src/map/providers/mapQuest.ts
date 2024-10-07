import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMapOptions } from "../providerMap.js";
import { LeafletMaps } from "./leaflet.js";

declare const L: any;
const LeafletMap = LeafletMaps.getMapClass();
const LeafletPin = LeafletMaps.getPinClass();

// Map Class

class MapQuestMap extends LeafletMap {
  map: any;
  /**
   * {@inheritDoc LeafletMap._initMap}
   */
  _initMap(options: ProviderMapOptions) {
    this.map = L.mapquest.map(options.wrapper, {
      boxZoom: options.controlEnabled,
      center: new L.LatLng(0, 0),
      doubleClickZoom: options.controlEnabled,
      dragging: options.controlEnabled,
      layers: L.mapquest.tileLayer("map"),
      zoom: 0,
      zoomControl: options.controlEnabled,
      zoomSnap: 0,
      ...options.providerOptions,
    });
  }
}

// Pin Class
class MapQuestPin extends LeafletPin { }

// Load Function

/**
 * This function is called when calling {@link MapProvider#load}
 * on {@link MapQuestMaps}.
 * @param resolve - Callback with no arguments called when the load finishes successfully
 * @param reject - Callback with no arguments called when the load fails
 * @param apiKey - Provider API key
 * @param options - Additional provider-specific options
 * options.version='v1.3.2' - API version
 * @see ProviderLoadFunction
 */
function load(resolve: () => void, _: () => void, apiKey: string, { version = "v1.3.2" } = {}) {
  const baseUrl = `https://api.mqcdn.com/sdk/mapquest-js/${version}/mapquest-maps`;

  const mapStyle = document.createElement("link");
  mapStyle.rel = "stylesheet";
  mapStyle.href = baseUrl + ".css";

  const mapScript = document.createElement("script");
  mapScript.src = baseUrl + ".js";
  mapScript.onload = () => {
    L.mapquest.key = apiKey;
    resolve();
  };

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

const MapQuestMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(MapQuestMap)
  .withPinClass(MapQuestPin)
  .withProviderName("MapQuest")
  .build();

export { MapQuestMaps };
