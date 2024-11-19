export type Address = {
  line1: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
};

export type Location = {
  name?: string;
  address?: Address;
};

export const AddressSchema = (address?: Address) => {
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
