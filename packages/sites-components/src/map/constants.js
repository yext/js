/** @module @yext/components-geo */

/**
 * @enum {Symbol}
 * @property {Symbol} DEGREE The length of one degree of Earth's equator
 * @property {Symbol} KILOMETER One kilometer
 * @property {Symbol} MILE One mile
 * @property {Symbol} RADIAN The length of Earth's radius
 * @readonly
 */
const Unit = Object.freeze({
  DEGREE: Symbol('deg'),
  KILOMETER: Symbol('km'),
  MILE: Symbol('mi'),
  RADIAN: Symbol('r')
});

/**
 * @enum {Symbol}
 * @property {Symbol} MERCATOR {@link https://en.wikipedia.org/wiki/Mercator_projection Mercator Projection} for flat maps of Earth
 * @property {Symbol} SPHERICAL Earth as a sphere, a model approximately equal to the real Earth
 * @readonly
 */
const Projection = Object.freeze({
  MERCATOR: Symbol('mercator'),
  SPHERICAL: Symbol('spherical')
});

/**
 * @constant {number}
 * @default
 */
const EARTH_RADIUS_MILES = 3959;
/**
 * @constant {number}
 * @default
 */
const EARTH_RADIUS_KILOMETERS = 6371;

export {
  Unit,
  Projection,
  EARTH_RADIUS_MILES,
  EARTH_RADIUS_KILOMETERS
};