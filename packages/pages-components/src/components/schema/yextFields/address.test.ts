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
