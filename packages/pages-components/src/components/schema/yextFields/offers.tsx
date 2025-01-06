export type Offer = {
  url?: string;
  priceCurrency?: string;
  price?: string;
  priceValidUntil?: string;
  itemCondition?: string;
  availability?: string;
};

const validateOffer = (offer: any): offer is Offer => {
  if (typeof offer !== "object") {
    return false;
  }
  return (
    "url" in offer ||
    "priceCurrency" in offer ||
    "price" in offer ||
    "priceValidUntil" in offer ||
    "itemCondition" in offer ||
    "availability" in offer
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
