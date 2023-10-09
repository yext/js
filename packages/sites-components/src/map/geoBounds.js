/** @module @yext/components-geo */

import { Unit, Projection } from './constants';
import { Coordinate } from './coordinate';

/**
 * This class represents a bounded coordinate region of a sphere.
 * The bounds are defined by two {@link module:@yext/components-geo~Coordinate Coordinates}: southwest and northeast.
 * If the northeast coordinate does not have a greater latitude and longitude than the soutwest
 * coordinate, the behavior of this object is undefined.
 */
class GeoBounds {
  /**
   * Create a new {@link module:@yext/components-geo~GeoBounds GeoBounds} with minimal area that
   * contains all the given coordinates
   * @param {module:@yext/components-geo~Coordinate[]} coordinates
   * @returns {module:@yext/components-geo~GeoBounds}
   */
  static fit(coordinates) {
    // North/South bounds are the northernmost and southernmost points
    const latitudes = coordinates.map(coordinate => coordinate.latitude);
    const north = Math.max(...latitudes);
    const south = Math.min(...latitudes);

    // East/West bounds need to be chosen to minimize the area that fits all pins
    // Choose them by finding the largest area with no pins
    const longitudes = coordinates
      .map(coordinate => coordinate.normalLon)
      .sort((i, j) => i - j);

    const splitIndex = longitudes
      .map((longitude, i) => {
        const next = i < longitudes.length - 1 ? longitudes[i + 1] : longitudes[0] + 360;
        return { distance: next - longitude, index: i };
      })
      .reduce((max, distance) => distance.distance > max.distance ? distance : max)
      .index;

    const east = longitudes[splitIndex];
    const west = longitudes[(splitIndex + 1) % longitudes.length];

    return new this(new Coordinate(south, west), new Coordinate(north, east));
  }

  /**
   * @param {module:@yext/components-geo~Coordinate} sw Southwest coordinate
   * @param {module:@yext/components-geo~Coordinate} ne Northeast coordinate
   */
  constructor(sw, ne) {
    this._ne = new Coordinate(ne);
    this._sw = new Coordinate(sw);
  }

  /**
   * Northeast coordinate
   * @type {module:@yext/components-geo~Coordinate}
   */
  get ne() {
    return this._ne;
  }

  /**
   * Southwest coordinate
   * @type {module:@yext/components-geo~Coordinate}
   */
  get sw() {
    return this._sw;
  }

  set ne(newNE) {
    this._ne = new Coordinate(newNE);
  }

  set sw(newSW) {
    this._sw = new Coordinate(newSW);
  }

  /**
   * Whether the coordinate lies within the region defined by the bounds.
   * {@link module:@yext/components-geo~Coordinate#normalLon Normalized longitudes} are used for the
   * bounds and the coordinate.
   * @param {module:@yext/components-geo~Coordinate} coordinate
   * @returns {boolean}
   */
  contains(coordinate) {
    const withinLatitude = this._sw.latitude <= coordinate.latitude && coordinate.latitude <= this._ne.latitude;
    const longitudeSpansGlobe = this._ne.longitude - this._sw.longitude >= 360;
    const withinNormalLon = this._sw.normalLon <= this._ne.normalLon ?
      (this._sw.normalLon <= coordinate.normalLon && coordinate.normalLon <= this._ne.normalLon) :
      (this._sw.normalLon <= coordinate.normalLon || coordinate.normalLon <= this._ne.normalLon);

    return withinLatitude && (longitudeSpansGlobe || withinNormalLon);
  }

  /**
   * Extend the bounds if necessary so that the coordinate is contained by them.
   * @param {module:@yext/components-geo~Coordinate} coordinate
   */
  extend(coordinate) {
    this._ne.latitude = Math.max(this._ne.latitude, coordinate.latitude);
    this._sw.latitude = Math.min(this._sw.latitude, coordinate.latitude);

    if (!this.contains(coordinate)) {
      const eastDist = ((coordinate.longitude - this._ne.longitude) % 360 + 360) % 360;
      const westDist = ((this._sw.longitude - coordinate.longitude) % 360 + 360) % 360;

      if (eastDist < westDist) {
        this._ne.longitude += eastDist;
      } else {
        this._sw.longitude -= westDist;
      }
    }
  }

  /**
   * Calculate the center of the bounds using the given projection.
   * To find the visual center on a Mercator map, use Projection.MERCATOR.
   * To find the center for geolocation or geosearch purposes, use Projection.SPHERICAL.
   * @param {module:@yext/components-geo~Projection} [projection=Projection.SPHERICAL]
   * @returns {module:@yext/components-geo~Coordinate}
   */
  getCenter(projection = Projection.SPHERICAL) {
    const nw = new Coordinate(this._ne.latitude, this._sw.longitude);
    const latDist = this._sw.distanceTo(nw, Unit.DEGREE, projection);
    const newLon = (nw.longitude + this._ne.longitude) / 2 + (this._ne.longitude < nw.longitude ? 180 : 0);

    nw.add(-latDist / 2, 0, Unit.DEGREE, projection);
    nw.longitude = newLon;

    return nw;
  }
}

export {
  GeoBounds
};