export type Offer = {
  url?: string;
  priceCurrency?: string;
  price?: string;
  priceValidUntil?: string;
  itemCondition?: string;
  availability?: (typeof availabilityOptions)[number];
};

const availabilityOptions = [
  "BackOrder",
  "Discontinued",
  "InStock",
  "InStoreOnly",
  "LimitedAvailability",
  "MadeToOrder",
  "OnlineOnly",
  "OutOfStock",
  "PreOrder",
  "PreSale",
  "Reserved",
  "SoldOut",
];

export const validateOffer = (offer: any): offer is Offer => {
  if (typeof offer !== "object") {
    return false;
  }

  return (
    "priceCurrency" in offer &&
    "price" in offer &&
    "availability" in offer &&
    availabilityOptions.includes(offer.availability)
  );
};

export const OfferSchema = (offer?: Offer) => {
  return (
    validateOffer(offer) && {
      offers: {
        "@type": "Offer",
        url: offer.url,
        priceCurrency: offer.priceCurrency,
        price: offer.price,
        priceValidUntil: offer.priceValidUntil,
        itemCondition: offer.itemCondition,
        availability: offer.availability,
      },
    }
  );
};
