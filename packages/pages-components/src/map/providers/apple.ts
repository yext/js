import { Coordinate } from "../coordinate.js";
import { Map } from "../map.js";
import { MapProviderOptions } from "../mapProvider.js";
import { PinProperties } from "../pinProperties.js";
import { ProviderMap, ProviderMapOptions } from "../providerMap.js";
import { ProviderPin, ProviderPinOptions } from "../providerPin.js";

// Map Class

class AppleMap extends ProviderMap {
  constructor(options: ProviderMapOptions) {
    super(options);
  }

  getCenter(): Coordinate {
    // GENERATOR TODO
    throw new Error("not implemented");
  }

  getZoom(): number {
    // GENERATOR TODO
    throw new Error("not implemented");
  }

  setCenter(coordinate: Coordinate, animated: boolean) {
    // GENERATOR TODO
  }

  setZoom(zoom: number, animated: boolean) {
    // GENERATOR TODO
  }
}

// Pin Class

class ApplePin extends ProviderPin {
  constructor(options: ProviderPinOptions) {
    super(options);
  }

  setCoordinate(coordinate: Coordinate) {
    // GENERATOR TODO
  }

  setMap(newMap: Map | null, currentMap: Map | null) {
    // GENERATOR TODO
  }

  setProperties(pinProperties: PinProperties) {
    // GENERATOR TODO
  }
}

// Load Function

function load(resolve: Function, reject: Function, apiKey: string, options: Object) {
  // GENERATOR TODO
}

// Exports

const AppleMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(AppleMap)
  .withPinClass(ApplePin)
  .withProviderName("Apple")
  .build();

export { AppleMaps };
