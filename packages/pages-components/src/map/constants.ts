enum Unit {
  DEGREE = "deg",
  KILOMETER = "km",
  MILE = "mi",
  RADIAN = "r",
}

enum Projection {
  MERCATOR = "mercator",
  SPHERICAL = "spherical",
}

const EARTH_RADIUS_MILES = 3959;

const EARTH_RADIUS_KILOMETERS = 6371;

export { Unit, Projection, EARTH_RADIUS_MILES, EARTH_RADIUS_KILOMETERS };
