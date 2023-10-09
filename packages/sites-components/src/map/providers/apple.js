import { Coordinate } from '../coordinate';
import { MapProviderOptions } from '../mapProvider';
import { ProviderMap } from '../providerMap';
import { ProviderPin } from '../providerPin';

// Map Class

class AppleMap extends ProviderMap {
  constructor(options) {
    super(options);
  }

  getCenter() {
    // GENERATOR TODO
  }

  getZoom() {
    // GENERATOR TODO
  }

  setCenter(coordinate, animated) {
    // GENERATOR TODO
  }

  setZoom(zoom, animated) {
    // GENERATOR TODO
  }
}

// Pin Class

class ApplePin extends ProviderPin {
  constructor(options) {
    super(options);
  }

  setCoordinate(coordinate) {
    // GENERATOR TODO
  }

  setMap(newMap, currentMap) {
    // GENERATOR TODO
  }

  setProperties(pinProperties) {
    // GENERATOR TODO
  }
}

// Load Function

function load(resolve, reject, apiKey, options) {
  // GENERATOR TODO
}

// Exports

const AppleMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(AppleMap)
  .withPinClass(ApplePin)
  .withProviderName('Apple')
  .build();

export {
  AppleMaps
};
