import { Coordinate } from "../coordinate.js";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { HTMLProviderPin, ProviderPinOptions } from "../providerPin.js";
import { Map } from "../map.js";
import mapboxgl from "mapbox-gl";

// GENERATOR TODO: call map resize method when hidden/shown (CoreBev, used to be done in Core.js)

// Map Class

class MapboxMap extends ProviderMap {
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
   * {@inheritDoc ProviderMap.getCenter}
   */
  getCenter(): Coordinate {
    return new Coordinate(this.map?.getCenter() ?? { lat: 0, lng: 0 });
  }

  /**
   * {@inheritDoc ProviderMap.getZoom}
   */
  getZoom(): number {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    return (this.map?.getZoom() ?? 0) + 1;
  }

  /**
   * {@inheritDoc ProviderMap.setCenter}
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
   * {@inheritDoc ProviderMap.setZoom}
   */
  setZoom(zoom: number, animated: boolean) {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    if (this.map) {
      this.map[animated ? "zoomTo" : "setZoom"](zoom - 1);
    }
  }

  /**
   * {@inheritDoc ProviderMap.zetZoomCenter}
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

class MapboxPin extends HTMLProviderPin {
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
   * {@inheritDoc HTMLProviderPin.setCoordinate}
   */
  setCoordinate(coordinate: Coordinate) {
    this.pin?.setLngLat(
      new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude)
    );
  }

  /**
   * {@inheritDoc HTMLProviderPin.setMap}
   */
  setMap(newMap: Map, _: Map) {
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
 * This function is called when calling {@link MapProvider#load}
 * on {@link MapboxMaps}.
 * @param resolve - Callback with no arguments called when the load finishes successfully
 * @param reject - Callback with no arguments called when the load fails
 * @param apiKey - Provider API key
 * @param options - Additional provider-specific options
 * options.version='v1.13.0' - API version
 * @see ProviderLoadFunction
 */
function load(
  resolve: () => void,
  _: () => void,
  apiKey: string,
  { version = "v1.13.0" } = {}
) {
  const baseUrl = `https://api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl`;

  const mapStyle = document.createElement("link");
  mapStyle.rel = "stylesheet";
  mapStyle.href = baseUrl + ".css";

  const mapScript = document.createElement("script");
  mapScript.src = baseUrl + ".js";
  mapScript.onload = () => {
    (mapboxgl as any).accessToken = apiKey;
    resolve();
  };

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

const MapboxMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(MapboxMap)
  .withPinClass(MapboxPin)
  .withProviderName("Mapbox")
  .build();

export { MapboxMaps };
