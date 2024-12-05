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

  setCenter(_: Coordinate, __: boolean) {
    // GENERATOR TODO
  }

  setZoom(_: number, __: boolean) {
    // GENERATOR TODO
  }
}

// Pin Class

class ApplePin extends ProviderPin {
  constructor(options: ProviderPinOptions) {
    super(options);
  }

  setCoordinate(_: Coordinate) {
    // GENERATOR TODO
  }

  setMap(_: Map | null, __: Map | null) {
    // GENERATOR TODO
  }

  setProperties(_: PinProperties) {
    // GENERATOR TODO
  }
}

// Load Function

function load(_: () => void, __: () => void, ___: string, ____: object) {
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
