import { AddressType } from "../../address/types.js";

export type Location = {
  name?: string;
  address?: AddressType;
};

export const validateLocation = (location: any): location is Location => {
  if (typeof location !== "object") {
    return false;
  }
  return "name" in location || "address" in location;
};

export const validateAddress = (address: any): address is AddressType => {
  if (typeof address !== "object") {
    return false;
  }
  return (
    "line1" in address ||
    "city" in address ||
    "region" in address ||
    "postalCode" in address ||
    "countryCode" in address
  );
};

export const AddressSchema = (address?: AddressType) => {
  return (
    validateAddress(address) && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address.line1,
        addressLocality: address.city,
        addressRegion: address.region,
        postalCode: address.postalCode,
        addressCountry: address.countryCode,
      },
    }
  );
};

export const LocationSchema = (location?: Location) => {
  return (
    validateLocation(location) && {
      "@type": "Place",
      name: location.name,
      ...AddressSchema(location.address),
    }
  );
};
