import {
  AddressType,
  GetDirectionsConfig,
  ListingPublisherOption,
  ListingType,
  MapProviderOption,
  DirectionCoordinate,
} from "./types.js";

/**
 * Get the unabbreviated version of a field if available
 *
 * getUnabbreviated('countryCode', address) ==\> 'United States'
 *
 * @param field - an address field name
 * @param address - a Yext address
 * @returns the unabbreviated version of the field
 */
export const getUnabbreviated = (
  field: keyof AddressType,
  address: AddressType
): string | undefined => {
  const abbrFields: { [k: string]: keyof AddressType } = {
    region: "localizedRegionName",
    countryCode: "localizedCountryName",
  };

  const unabbreviatedField = abbrFields[field];

  return unabbreviatedField && address[unabbreviatedField];
};

/**
 * Get a third-party maps url for a Yext location
 *
 * @param address - Yext address
 * @param listings - List of available Yext Listings
 * @param googlePlaceId - Google Place ID
 * @param config - Options for determining URL
 * @param coordinates - Coordinates of location
 *
 * @returns Maps service url
 */
export const getDirections = (
  address?: AddressType,
  listings: ListingType[] = [],
  googlePlaceId?: string,
  config: GetDirectionsConfig = {
    route: false,
  },
  coordinate?: DirectionCoordinate
): string | undefined => {
  const NO_QUERY_WARNING = "Failed to construct query for maps service.";
  // Default query for all providers
  let query =
    address &&
    encodeArray([
      address.line1,
      address.line2,
      address.city,
      address.region,
      address.postalCode,
      address.countryCode,
    ]);

  switch (config.provider) {
    case MapProviderOption.APPLE: {
      // Apple Maps requires a query string
      if (!!coordinate?.latitude && !!coordinate?.longitude) {
        return getDirectionsApple(
          `${coordinate.latitude},${coordinate.longitude}`,
          config.route
        );
      }
      if (!query) {
        console.warn(
          `${NO_QUERY_WARNING} Check that you've provided a valid Yext Address.`
        );
        break;
      }

      return getDirectionsApple(query, config.route);
    }
    case MapProviderOption.BING: {
      if (!!coordinate?.latitude && !!coordinate?.longitude) {
        return getDirectionsBing(
          `${coordinate.latitude},${coordinate.longitude}`,
          config.route
        );
      }
      query =
        address &&
        encodeArray([
          address.line1,
          address.city,
          address.region,
          address.postalCode,
        ]);

      // Bing Maps requires a query
      if (!query) {
        console.warn(
          `${NO_QUERY_WARNING} Check that you've provided a valid Yext Address.`
        );
        break;
      }

      return getDirectionsBing(query, config.route);
    }
    default: {
      if (!!coordinate?.latitude && !!coordinate?.longitude) {
        return getDirectionsGoogle(
          `${coordinate.latitude},${coordinate.longitude}`,
          config.route
        );
      }
      const gmbListing = listings.find(
        (listing) =>
          listing?.publisher?.toUpperCase() ===
          ListingPublisherOption.GOOGLEMYBUSINESS
      );

      if (gmbListing?.listingUrl) {
        return gmbListing.listingUrl;
      }

      if (googlePlaceId) {
        return getDirectionsGooglePlaceID(googlePlaceId, query, config.route);
      }

      // Google Maps without Listings data requires a query
      if (!query) {
        console.warn(
          `${NO_QUERY_WARNING} Check that you've provided a valid Yext Address, Yext ListingType, or Google Place ID.`
        );
        break;
      }

      return getDirectionsGoogle(query, config.route);
    }
  }
};

/**
 * Get Apple Maps location query
 *
 * @param query - Stringified address query
 * @param route - Use address route
 *
 * @returns Apple maps url
 */
const getDirectionsApple = (query: string, route?: boolean): string => {
  return route
    ? `https://maps.apple.com/?daddr=${query}`
    : `https://maps.apple.com/?address=${query}`;
};

/**
 * Get Bing Maps location query
 *
 * @param query - Stringified address query
 * @param route - Use address route
 *
 * @returns Bing maps url
 */
const getDirectionsBing = (query: string, route?: boolean): string => {
  return route
    ? `https://bing.com/maps/default.aspx?rtp=adr.${query}`
    : `https://bing.com/maps/default.aspx?where1=${query}`;
};

/**
 * Get a Google Maps Place ID page.
 * Note (3/20/22): Google Place IDs must be refreshed
 * https://developers.google.com/maps/documentation/places/web-service/place-id#save-id
 *
 * @param placeId - Stringified address query
 * @param query - Stringified address query
 * @param route - Enable driving directions
 * @returns Google maps url
 */
const getDirectionsGooglePlaceID = (
  placeId: string,
  query?: string,
  route?: boolean
): string => {
  const queryParam = query ? `&query=${query}` : ``;
  if (route) {
    return `https://maps.google.com/maps/dir/?api=1${queryParam}&destination_place_id=${placeId}&destination=direct`;
  }

  if (queryParam) {
    return `https://maps.google.com/maps/search/?api=1${queryParam}&query_place_id=${placeId}`;
  }

  // Fallback to URL with route, as query is not required.
  return `https://maps.google.com/maps/dir/?api=1&destination_place_id=${placeId}&destination=direct`;
};

/**
 * Get a Google Maps search query
 *
 * @param query - Stringified address query
 * @param route - Enable driving directions
 * @returns Google maps url
 */
const getDirectionsGoogle = (query: string, route?: boolean): string => {
  return route
    ? `https://maps.google.com/maps/dir/?api=1&destination=${query}`
    : `https://maps.google.com/maps/search/?api=1&query=${query}`;
};

/**
 * Convert an array of values like address parts to a url readable string
 *
 * @param substrings - ordered list to encode as csv
 * @returns url friendly string
 */
const encodeArray = (substrings: (string | undefined)[] = []): string => {
  if (!substrings.length) return "";

  const str = substrings.filter(Boolean).join(", ");
  return encodeURI(str);
};
