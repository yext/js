import { Coordinate } from "../coordinate.js";
import { MapProviderOptions } from "../mapProvider.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { ProviderPin, ProviderPinOptions } from "../providerPin.js";
import { Map } from "../map.js";
import { PinProperties } from "../pinProperties.js";

declare const L: any;

// Map Class

class LeafletMap extends ProviderMap {
  map?: L.Map;
  static apiKey: string;
  constructor(options: ProviderMapOptions) {
    super(options);

    this._initMap(options);

    if (options.controlEnabled) {
      this.map?.zoomControl.setPosition("topright");
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
    return this.map?.getZoom() ?? 0;
  }

  /**
   * {@inheritDoc ProviderMap.setCenter}
   */
  setCenter(coordinate: Coordinate, animated: boolean) {
    const latLng = new L.LatLng(coordinate.latitude, coordinate.longitude);

    this.map?.panTo(latLng, { animate: animated });
  }

  /**
   * {@inheritDoc ProviderMap.setZoom}
   */
  setZoom(zoom: number, animated: boolean) {
    this.map?.setZoom(zoom, { animate: animated });
  }

  /**
   * {@inheritDoc ProviderMap.setZoomCenter}
   */
  setZoomCenter(zoom: number, center: Coordinate, animated: boolean) {
    const latLng = new L.LatLng(center.latitude, center.longitude);

    this.map?.setView(latLng, zoom, { animate: animated });
  }

  _initMap(options: ProviderMapOptions) {
    // We need to setZoom on map init because otherwise it will default
    // to zoom = undefined and will try to load infinite map tiles.
    // This setZoom is immediately overridden by Map.constructor()
    if (options.wrapper) {
      this.map = new L.Map(options.wrapper, {
        boxZoom: options.controlEnabled,
        doubleClickZoom: options.controlEnabled,
        dragging: options.controlEnabled,
        zoom: 0,
        zoomControl: options.controlEnabled,
        zoomSnap: 0,
        ...options.providerOptions,
      });
    }

    const params = options.providerOptions;
    const tileLayerSrc =
      params.tileLayerSrc ||
      "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
    const tileLayerConfig = params.tileLayerOptions || {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
    };

    tileLayerConfig.accessToken = LeafletMap.apiKey;

    if (this.map) {
      L.tileLayer(tileLayerSrc, tileLayerConfig).addTo(this.map);
    }
  }
}

// Pin Class

/**
 * GENERATOR TODO Full HTML pin support {@link https://leafletjs.com/reference-1.6.0.html#popup}
 */
class LeafletPin extends ProviderPin {
  pin: L.Marker;

  constructor(options: ProviderPinOptions) {
    super(options);

    this.pin = new L.Marker(new L.LatLng(0, 0));

    this.pin.on("click", () => this._clickHandler());
    this.pin.on("mouseover", () => this._hoverHandler(true));
    this.pin.on("mouseout", () => this._hoverHandler(false));
    // GENERATOR TODO focus handler (after HTML pin support)
  }

  /**
   * {@inheritDoc ProviderPin.setCoordinate}
   */
  setCoordinate(coordinate: Coordinate) {
    const latLng = new L.LatLng(coordinate.latitude, coordinate.longitude);
    this.pin.setLatLng(latLng);
  }

  /**
   * {@inheritDoc ProviderPin.setMap}
   */
  setMap(newMap: Map, _: Map) {
    if (newMap) {
      const leafletMap = (newMap.getProviderMap() as LeafletMap).map;
      if (leafletMap) {
        this.pin.addTo(leafletMap);
      }
    } else {
      this.pin.remove();
    }
  }

  /**
   * {@inheritDoc ProviderPin.setProperties}
   */
  setProperties(pinProperties: PinProperties) {
    const width = pinProperties.getWidth();
    const height = pinProperties.getHeight();
    const anchorX = pinProperties.getAnchorX();
    const anchorY = pinProperties.getAnchorY();

    this.pin.setIcon(
      new L.Icon({
        iconUrl: this._icons[pinProperties.getIcon()],
        iconSize: [width, height],
        iconAnchor: [anchorX * width, anchorY * height],
        className: pinProperties.getClass(),
      })
    );
    this.pin.setZIndexOffset(pinProperties.getZIndex());
  }
}

// Load Function

/**
 * This function is called when calling {@link MapProvider#load}
 * on {@link LeafletMaps}.
 * @param resolve - Callback with no arguments called when the load finishes successfully
 * @param reject - Callback with no arguments called when the load fails
 * @param apiKey - Provider API key
 * @param options - Additional provider-specific options
 * options.version='1.7.1' - API version
 * @see ProviderLoadFunction
 */
function load(
  resolve: () => void,
  _: () => void,
  apiKey: string,
  { version = "1.7.1" } = {}
) {
  const baseUrl = `https://unpkg.com/leaflet@${version}/dist/leaflet`;

  LeafletMap.apiKey = apiKey;

  const mapStyle = document.createElement("link");
  mapStyle.rel = "stylesheet";
  mapStyle.href = baseUrl + ".css";

  const mapScript = document.createElement("script");
  mapScript.src = baseUrl + ".js";
  mapScript.onload = () => resolve();

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

const LeafletMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(LeafletMap)
  .withPinClass(LeafletPin)
  .withProviderName("Leaflet")
  .build();

export { LeafletMaps };
