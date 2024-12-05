import {
  Unit,
  Projection,
  EARTH_RADIUS_MILES,
  EARTH_RADIUS_KILOMETERS,
} from "./constants.js";

/**
 * An array of property names to check in a Coordinate-like object for a value of or function that evaluates to degrees latitude
 */
const LATITUDE_ALIASES = ["latitude", "lat"];

/**
 * An array of property names to check in a Coordinate-like object for a value of or function that evaluates to degrees longitude
 */
const LONGITUDE_ALIASES = ["longitude", "lon", "lng", "long"];

type latLngFunction = () => number;

/**
 * Find a truthy or 0 value in an object, searching the given keys
 * @param object - Object to find a value in
 * @param keys - Keys to search in object
 * @returns The value found, or undefined if not found
 */
function findValue(
  object: { [key: string]: any },
  keys: string[]
): number | latLngFunction | undefined {
  for (const key of keys) {
    if (object[key] || object[key] === 0) {
      return object[key];
    }
  }
}

/**
 * @throws Will throw an error if value cannot be converted to a number.
 */
function forceNumber(value: any): number {
  switch (typeof value) {
    case "string":
    case "number":
      const parsed = Number.parseFloat(value as string);
      if (Number.isNaN(parsed)) {
        throw new Error(`'${value}' must be convertible to a Number'`);
      }
      return parsed;
    default:
      throw new Error(
        `typeof '${value}' must be a number or a string that can be converted to a number, is '${typeof value}'`
      );
  }
}

/**
 * @returns Radians
 */
function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * @returns Degrees
 */
function radiansToDegrees(radians: number): number {
  return (radians / Math.PI) * 180;
}

/**
 * Calculate distance between two points using the {@link https://en.wikipedia.org/wiki/Haversine_formula | Haversine Formula}
 */
function haversineDistance(source: Coordinate, dest: Coordinate): number {
  const lat1Rads = degreesToRadians(source.latitude);
  const lat2Rads = degreesToRadians(dest.latitude);
  const deltaLat = lat2Rads - lat1Rads;
  const deltaLon = degreesToRadians(dest.longitude - source.longitude);

  const a =
    Math.pow(Math.sin(deltaLat / 2), 2) +
    Math.cos(lat1Rads) *
      Math.cos(lat2Rads) *
      Math.pow(Math.sin(deltaLon / 2), 2);
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calculate the distance between two Mercator-projected latitudes in radians of longitude.
 * In Mercator Projection, visual distance between longitudes is always the same but visual distance
 * between latitudes is lowest at the equator and highest towards the poles.
 * @param latitudeA - The source latitude in degrees
 * @param latitudeB - The destination latitude in degrees
 * @returns Distance in radians of longitude
 */
function mercatorLatDistanceInRadians(
  latitudeA: number,
  latitudeB: number
): number {
  const aTan = Math.tan((Math.PI / 360) * (latitudeA + 90));
  const bTan = Math.tan((Math.PI / 360) * (latitudeB + 90));

  return Math.log(bTan / aTan);
}

/**
 * Add radians of longitude to a Mercator-projected latitude.
 * In Mercator Projection, visual distance between longitudes is always the same but visual distance
 * between latitudes is lowest at the equator and highest towards the poles.
 * @param startingLat - The source latitude in degrees
 * @param radians - Distance in radians of longitude
 * @returns The destination latitude in degrees
 */
function mercatorLatAddRadians(startingLat: number, radians: number): number {
  const aTan = Math.tan((Math.PI / 360) * (startingLat + 90));
  const bTan = aTan * Math.pow(Math.E, radians);

  return (Math.atan(bTan) * 360) / Math.PI - 90;
}

/**
 * This class represents a point on a sphere defined by latitude and longitude.
 * Latitude is a degree number in the range [-90, 90].
 * Longitude is a degree number without limits but is normalized to [-180, 180).
 */
class Coordinate {
  _lat: number;
  _lon: number;
  /**
   * Constructor takes either 1 or 2 arguments.
   * 2 arguments: latitude and longitude.
   * 1 argument: an object with at least one {@link LATITUDE_ALIASES | latitude alias}
   * and one one {@link LONGITUDE_ALIASES | longitude alias}.
   * @param longitude - Optional only if the first argument is a {@link Coordinate}-like object
   */
  constructor(latitudeOrObject: number | object, long?: number) {
    let latitude = latitudeOrObject;
    let longitude: number | latLngFunction | undefined = long;

    this._lat = 0;
    this._lon = 0;

    if (typeof latitudeOrObject == "object") {
      latitude = findValue(latitudeOrObject, LATITUDE_ALIASES) ?? 0;
      longitude = findValue(latitudeOrObject, LONGITUDE_ALIASES) ?? 0;

      this.latitude = typeof latitude == "function" ? latitude() : latitude;
      this.longitude = typeof longitude == "function" ? longitude() : longitude;
    }
    else if (typeof latitude == "number" && typeof longitude == "number") {
      this.latitude = latitude;
      this.longitude = longitude;
    }
  }

  /**
   * Degrees latitude in the range [-90, 90].
   * If setting a value outside this range, it will be set to -90 or 90, whichever is closer.
   */
  get latitude(): number {
    return this._lat;
  }

  set latitude(newLat: number) {
    this._lat = Math.max(-90, Math.min(forceNumber(newLat), 90));
  }

  /**
   * Degrees longitude in the range [-Infinity, Infinity].
   */
  get longitude(): number {
    return this._lon;
  }

  set longitude(newLon: number) {
    this._lon = forceNumber(newLon);
  }

  /**
   * Degrees longitude in the range [-180, 180).
   * If the coordinate's longitude is outside this range, the equivalent value within it is used.
   * Examples: 123 =\> 123, 270 =\> -90, -541 =\> 179
   */
  get normalLon(): number {
    return ((((this._lon + 180) % 360) + 360) % 360) - 180;
  }

  /**
   * Add distance to the coordinate to change its position.
   * @param latDist - latitude distance
   * @param lonDist - longitude distance
   * @param unit - The unit of latDist and lonDist
   * @param projection - The projection of Earth (not relevant when using a physical distance unit, e.g. Mile)
   */
  add(
    latDist: number,
    lonDist: number,
    unit = Unit.DEGREE,
    projection = Projection.SPHERICAL
  ): void {
    if (
      projection === Projection.MERCATOR &&
      (unit === Unit.DEGREE || unit === Unit.RADIAN)
    ) {
      const latDistRad =
        unit === Unit.DEGREE ? degreesToRadians(latDist) : latDist;
      const lonDistDeg =
        unit === Unit.DEGREE ? lonDist : radiansToDegrees(lonDist);

      this.latitude = mercatorLatAddRadians(this.latitude, latDistRad);
      this.longitude += lonDistDeg;
    } else {
      switch (unit) {
        case Unit.DEGREE:
          this.latitude += latDist;
          this.longitude += lonDist;
          break;
        case Unit.KILOMETER:
          this.latitude += radiansToDegrees(latDist) * EARTH_RADIUS_KILOMETERS;
          this.longitude +=
            radiansToDegrees(lonDist) *
            EARTH_RADIUS_KILOMETERS *
            Math.cos(degreesToRadians(this.latitude));
          break;
        case Unit.MILE:
          this.latitude += radiansToDegrees(latDist) * EARTH_RADIUS_MILES;
          this.longitude +=
            radiansToDegrees(lonDist) *
            EARTH_RADIUS_MILES *
            Math.cos(degreesToRadians(this.latitude));
          break;
        case Unit.RADIAN:
          this.latitude += radiansToDegrees(latDist);
          this.longitude += radiansToDegrees(lonDist);
          break;
        default:
          throw new Error(`unit unhandled: ${String(unit)}`);
      }
    }
  }

  /**
   * Calculate the distance from this coordinate to another coordinate.
   * @param unit - The unit of distance
   * @param projection - The projection of Earth (not relevant when using a physical distance unit, e.g. Mile)
   * @returns Distance in the requested unit
   */
  distanceTo(
    coordinate: Coordinate,
    unit = Unit.MILE,
    projection = Projection.SPHERICAL
  ): number {
    if (
      projection === Projection.MERCATOR &&
      (unit === Unit.DEGREE || unit === Unit.RADIAN)
    ) {
      const latDist = mercatorLatDistanceInRadians(
        this.latitude,
        coordinate.latitude
      );
      const absoluteLonDist = Math.abs(coordinate.normalLon - this.normalLon);
      const lonDist = degreesToRadians(
        Math.min(absoluteLonDist, 360 - absoluteLonDist)
      );

      const radianDist = Math.sqrt(Math.pow(latDist, 2) + Math.pow(lonDist, 2));

      switch (unit) {
        case Unit.DEGREE:
          return radiansToDegrees(radianDist);
        case Unit.RADIAN:
          return radianDist;
        default:
          throw new Error(`unit unhandled: ${String(unit)}`);
      }
    } else {
      const radianDist = haversineDistance(this, coordinate);

      switch (unit) {
        case Unit.DEGREE:
          return radiansToDegrees(radianDist);
        case Unit.KILOMETER:
          return radianDist * EARTH_RADIUS_KILOMETERS;
        case Unit.MILE:
          return radianDist * EARTH_RADIUS_MILES;
        case Unit.RADIAN:
          return radianDist;
        default:
          throw new Error(`unit unhandled: ${String(unit)}`);
      }
    }
  }

  /**
   * Test if this coordinate has the same latitude and longitude as another.
   */
  equals(coordinate: Coordinate): boolean {
    return (
      coordinate &&
      coordinate.latitude === this.latitude &&
      coordinate.longitude === this.longitude
    );
  }

  /**
   * Get the coordinate as a string that can be used in a search query.
   * Example: \{latitude: -45, longitude: 123\} =\> '-45,123'
   */
  searchQueryString(): string {
    return `${this.latitude},${this.longitude}`;
  }
}

export { Coordinate };
