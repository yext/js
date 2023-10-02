/** @module @yext/components-maps */

import { Coordinate } from '../coordinate';
import { MapProviderOptions } from '../mapProvider';
import { ProviderMap } from '../providerMap';
import { ProviderPin } from '../providerPin';

// Map Class

/**
 * @extends module:@yext/components-maps~ProviderMap
 */
class LeafletMap extends ProviderMap {
  /**
   * @param {module:@yext/components-maps~ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

    this._initMap(options);

    if (options.controlEnabled) {
      this.map.zoomControl.setPosition('topright');
    }

    this.map.on('movestart', () => this._panStartHandler());
    this.map.on('moveend', () => this._panHandler());
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
    const latLng = new L.latLng(coordinate.latitude, coordinate.longitude);

    this.map.panTo(latLng, { animate: animated });
  }

  /**
   * @inheritdoc
   */
  setZoom(zoom, animated) {
    this.map.setZoom(zoom, { animate: animated });
  }

  /**
   * @inheritdoc
   */
  setZoomCenter(zoom, center, animated) {
    const latLng = new L.latLng(center.latitude, center.longitude);

    this.map.setView(latLng, zoom, { animate: animated });
  }

  /**
   * Initialize the Leaflet map
   * @protected
   * @param {module:@yext/components-maps~ProviderMapOptions} options
   */
  _initMap(options) {
    // We need to setZoom on map init because otherwise it will default
    // to zoom = undefined and will try to load infinite map tiles.
    // This setZoom is immediately overridden by Map.constructor()
    this.map = new L.map(options.wrapper, {
      boxZoom: options.controlEnabled,
      doubleClickZoom: options.controlEnabled,
      dragging: options.controlEnabled,
      zoom: 0,
      zoomControl: options.controlEnabled,
      zoomSnap: 0,
      ...options.providerOptions
    });

    const params = options.providerOptions;
    const tileLayerSrc = params.tileLayerSrc || 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
    const tileLayerConfig = params.tileLayerOptions || {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
    };

    tileLayerConfig.accessToken = this.constructor.apiKey;

    L.tileLayer(tileLayerSrc, tileLayerConfig).addTo(this.map);
  }
}

// Pin Class

/**
 * @extends module:@yext/components-maps~ProviderPin
 * @todo GENERATOR TODO Full HTML pin support {@link https://leafletjs.com/reference-1.6.0.html#popup}
 */
class LeafletPin extends ProviderPin {
  /**
   * @param {module:@yext/components-maps~ProviderPinOptions} options
   */
  constructor(options) {
    super(options);

    this.pin = new L.marker();

    this.pin.on('click', () => this._clickHandler());
    this.pin.on('mouseover', () => this._hoverHandler(true));
    this.pin.on('mouseout', () => this._hoverHandler(false));
    // GENERATOR TODO focus handler (after HTML pin support)
  }

  /**
   * @inheritdoc
   */
  setCoordinate(coordinate) {
    const latLng = new L.latLng(coordinate.latitude, coordinate.longitude);
    this.pin.setLatLng(latLng);
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

  /**
   * @inheritdoc
   */
  setProperties(pinProperties) {
    const width = pinProperties.getWidth();
    const height = pinProperties.getHeight();
    const anchorX = pinProperties.getAnchorX();
    const anchorY = pinProperties.getAnchorY();

    this.pin.setIcon(new L.icon({
      iconUrl: this._icons[pinProperties.getIcon()],
      iconSize: [width, height],
      iconAnchor: [anchorX * width, anchorY * height],
      className: pinProperties.getClass()
    }));
    this.pin.setZIndexOffset(pinProperties.getZIndex());
  }
}

// Load Function

 /**
  * This function is called when calling {@link module:@yext/components-maps~MapProvider#load MapProvider#load}
  * on {@link module:@yext/components-maps~LeafletMaps LeafletMaps}.
  * @alias module:@yext/components-maps~loadLeafletMaps
  * @param {function} resolve Callback with no arguments called when the load finishes successfully
  * @param {function} reject Callback with no arguments called when the load fails
  * @param {string} apiKey Provider API key
  * @param {Object} options Additional provider-specific options
  * @param {string} [options.version='1.7.1'] API version
  * @see module:@yext/components-maps~ProviderLoadFunction
  */
function load(resolve, reject, apiKey, {
  version = '1.7.1'
} = {}) {
  const baseUrl = `https://unpkg.com/leaflet@${version}/dist/leaflet`;

  LeafletMap.apiKey = apiKey;

  const mapStyle = document.createElement('link');
  mapStyle.rel = 'stylesheet';
  mapStyle.href = baseUrl + '.css';

  const mapScript = document.createElement('script');
  mapScript.src = baseUrl + '.js';
  mapScript.onload = () => resolve();

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

/**
 * @type {module:@yext/components-maps~MapProvider}
 */
const LeafletMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(LeafletMap)
  .withPinClass(LeafletPin)
  .withProviderName('Leaflet')
  .build();

export {
  LeafletMaps
};
