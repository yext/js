import { OfferSchema, validateOffer } from "./offers.js";

const offer = {
  url: "http://example.com/full-product",
  priceCurrency: "USD",
  price: "199.99",
  priceValidUntil: "2026-01-01",
  itemCondition: "UsedCondition",
  availability: "InStock",
};

const basicOffer = {
  priceCurrency: "USD",
  price: "199.99",
  availability: "InStock",
};

describe("validateOffer", () => {
  it("returns false for invalid offers", () => {
    expect(validateOffer(undefined)).toBe(false);
    expect(validateOffer({})).toBe(false);
    expect(validateOffer("{}")).toBe(false);
    expect(validateOffer({ key: "value" })).toBe(false);
    expect(validateOffer({ itemCondition: "good" })).toBe(false);
    expect(
      validateOffer({
        price: "100",
        priceCurrency: "USD",
        availability: "INVALID",
      })
    ).toBe(false);
  });

  it("should return true for valid offers", () => {
    expect(validateOffer(offer)).toBe(true);
    expect(validateOffer(basicOffer)).toBe(true);
  });
});

describe("OfferSchema", () => {
  it("returns false for invalid offers", () => {
    expect(OfferSchema(undefined)).toBe(false);
    expect(OfferSchema({})).toBe(false);
    expect(OfferSchema("{}" as any)).toBe(false);
    expect(OfferSchema({ key: "value" } as any)).toBe(false);
    expect(OfferSchema({ url: offer.url, price: offer.price })).toBe(false);
  });

  it("returns the correct schema for valid offers", () => {
    expect(OfferSchema(offer)).toEqual({
      offers: {
        "@type": "Offer",
        url: "http://example.com/full-product",
        priceCurrency: "USD",
        price: "199.99",
        priceValidUntil: "2026-01-01",
        itemCondition: "UsedCondition",
        availability: "InStock",
      },
    });

    expect(OfferSchema(basicOffer)).toEqual({
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: "199.99",
        availability: "InStock",
      },
    });
  });
});
