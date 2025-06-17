import { describe, it, expect } from "vitest";
import {
  AddressSchema,
  LocationSchema,
  validateAddress,
  validateLocation,
} from "./address.js";

const address = {
  city: "Arlington",
  countryCode: "US",
  line1: "1101 Wilson Blvd",
  localizedCountryName: "United States",
  localizedRegionName: "Arlington",
  postalCode: "22209",
  region: "VA",
};

describe("validateLocation", () => {
  it("returns true for valid locations", () => {
    expect(validateLocation({ name: "Business Name", address: address })).toBe(
      true
    );
    expect(validateLocation({ name: "Business Name" })).toBe(true);
    expect(validateLocation({ address: address })).toBe(true);
  });
  it("returns false for invalid locations", () => {
    expect(
      validateLocation('{ name: "Business Name", address: address }')
    ).toBe(false);
    expect(validateLocation(undefined)).toBe(false);
    expect(validateLocation(1)).toBe(false);
    expect(validateLocation({ key: "value" })).toBe(false);
  });
});

describe("validateAddress", () => {
  it("returns true for valid addresses", () => {
    expect(validateAddress(address)).toBe(true);
    expect(validateAddress({ line1: "Line 1" })).toBe(true);
    expect(validateAddress({ city: "City" })).toBe(true);
    expect(validateAddress({ region: "Region" })).toBe(true);
    expect(validateAddress({ postalCode: "Postal Code" })).toBe(true);
    expect(validateAddress({ line1: "Country Code" })).toBe(true);
  });
  it("returns false for invalid locations", () => {
    expect(validateAddress('{ city: "City"}')).toBe(false);
    expect(validateAddress(undefined)).toBe(false);
    expect(validateAddress(1)).toBe(false);
    expect(validateAddress({ key: "value" })).toBe(false);
  });
});

describe("AddressSchema", () => {
  it("returns false for invalid addresses", () => {
    expect(AddressSchema(undefined)).toBe(false);
    expect(AddressSchema({ key: "value" } as any)).toBe(false);
  });
  it("returns valid schema for valid addresses", () => {
    expect(AddressSchema(address)).toEqual({
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressLocality: "Arlington",
        addressRegion: "VA",
        postalCode: "22209",
        streetAddress: "1101 Wilson Blvd",
      },
    });
    expect(AddressSchema({ line1: "1101 Wilson Blvd" } as any)).toEqual({
      address: {
        "@type": "PostalAddress",
        streetAddress: "1101 Wilson Blvd",
      },
    });
  });
});

describe("LocationSchema", () => {
  it("returns false for invalid locations", () => {
    expect(LocationSchema(undefined)).toBe(false);
    expect(LocationSchema({ key: "value" } as any)).toBe(false);
  });
  it("returns valid schema for valid locations", () => {
    expect(LocationSchema({ name: "Yext", address })).toEqual({
      "@type": "Place",
      name: "Yext",
      address: {
        "@type": "PostalAddress",
        addressCountry: "US",
        addressLocality: "Arlington",
        addressRegion: "VA",
        postalCode: "22209",
        streetAddress: "1101 Wilson Blvd",
      },
    });
    expect(LocationSchema({ name: "Yext" })).toEqual({
      "@type": "Place",
      name: "Yext",
    });
  });
});

// const doc = {
//   _env: {
//     YEXT_PUBLIC_VISUAL_EDITOR_APP_API_KEY: "7c2df4d982a40eecfdc0608ed95bc8f0",
//   },
//   _pageset:
//     '{"name":"accounts/4259018/sites/157771/pagesets/locations","uid":"01976543-bd11-7e9d-b035-7472f9440b43","codeTemplate":"main","assignments":["global"],"createTime":"2025-06-12T17:50:28Z","updateTime":"2025-06-12T17:50:28Z","scope":{"locales":["en","es"],"entityTypes":["location"]},"defaultLayout":"accounts/4259018/sites/157771/layouts/locations-default-layout","displayName":"Locations","writebackUrlField":"pgs_june12FontsTest_locations_46svv_Url","type":"ENTITY","typeConfig":{"entityConfig":{"contentEndpointId":"locationsContent"}}}',
//   _schema: {
//     "@graph": [
//       {
//         "@context": "https://schema.org",
//         "@type": "LocalBusiness",
//         address: {
//           "@type": "PostalAddress",
//           addressCountry: "US",
//           addressLocality: "Washington",
//           addressRegion: "DC",
//           postalCode: "20037",
//           streetAddress: "2517 K Street Northwest",
//         },
//         name: "AGalaxy Grill",
//       },
//     ],
//   },
//   _site: {
//     id: "site-157771",
//     meta: {
//       entityType: {
//         id: "site",
//         uid: 29107,
//       },
//       locale: "en",
//     },
//     uid: 2016778663,
//   },
//   _yext: {
//     contentDeliveryAPIDomain: "https://cdn.yextapis.com",
//     managementAPIDomain: "https://api.yext.com",
//     platformDomain: "https://www.yext.com",
//   },
//   address: {
//     city: "Washington",
//     countryCode: "US",
//     line1: "2517 K Street Northwest",
//     localizedCountryName: "United States",
//     localizedRegionName: "Washington DC",
//     postalCode: "20037",
//     region: "DC",
//   },
//   addressHidden: false,
//   businessId: 4259018,
//   c_june12StructDemoLocationsHeroSection2: {
//     image: {
//       height: 2048,
//       url: "https://a.mktgcdn.com/p/2NXFA3zTVNQBcc7LCGNdTHp5SZVHIVTz_X9tLVZI6S8/2048x2048.jpg",
//       width: 2048,
//     },
//     primaryCta: {
//       label: "CTA 3",
//       link: "#",
//       linkType: "OTHER",
//     },
//     secondaryCta: {
//       label: "CTA 4",
//       link: "#",
//       linkType: "OTHER",
//     },
//   },
//   c_june12StructDemo_locations_heroSection: {
//     image: {
//       height: 2048,
//       url: "https://a.mktgcdn.com/p/KuK2XRaNDf-LF97Jt_ZMASRdUxtPiJP2MCwU6Ccmh9Q/2048x2048.jpg",
//       width: 2048,
//     },
//     primaryCta: {
//       label: "CTA 1",
//       link: "#",
//       linkType: "OTHER",
//     },
//     secondaryCta: {
//       label: "CTA 2",
//     },
//   },
//   cityCoordinate: {
//     latitude: 38.892091,
//     longitude: -77.024055,
//   },
//   geocodedCoordinate: {
//     latitude: 38.9028813,
//     longitude: -77.0541449,
//   },
//   id: "1084658808",
//   isoRegionCode: "DC",
//   locale: "en",
//   meta: {
//     entityType: {
//       id: "location",
//       uid: 0,
//     },
//     locale: "en",
//   },
//   name: "AGalaxy Grill",
//   siteDomain: "",
//   siteId: 157771,
//   siteInternalHostName: "",
//   slug: "beaucouzé/123",
//   timezone: "America/New_York",
//   uid: 1095527849,
//   yextDisplayCoordinate: {
//     latitude: 38.9028813,
//     longitude: -77.0541449,
//   },
//   yextRoutableCoordinate: {
//     latitude: 38.9026458,
//     longitude: -77.0541408,
//   },
// };
