import { AddressType } from "../../address/types.js";

export type Location = {
  name?: string;
  address?: AddressType;
};

export const validateLocation = (location: any): location is Location => {
  if (typeof location !== "object") {
    return false;
  }
  return !!location.name || !!location.address;
};

export const validateAddress = (address: any): address is AddressType => {
  if (typeof address !== "object") {
    return false;
  }
  return (
    !!address.line1 ||
    !!address.city ||
    !!address.region ||
    !!address.postalCode ||
    !!address.countryCode
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
