import { AddressType } from "../../address/types.js";

export type Location = {
  name?: string;
  address?: AddressType;
};

export const AddressSchema = (address?: AddressType) => {
  return (
    address && {
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
    location && {
      "@type": "Place",
      name: location.name,
      ...AddressSchema(location.address),
    }
  );
};
