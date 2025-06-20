import { BaseSchema } from "./BaseSchema.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";
import { ReviewSchema, AggregateRatingSchema } from "../yextFields/review.js";
import { OfferSchema } from "../yextFields/offers.js";

// https://schema.org/Product
// Make sure to double check if the fields are correct for your site
const Product = (document: Record<string, any>, schemaType?: string) => {
  return {
    ...BaseSchema(document, schemaType ?? "Product"),
    ...PhotoGallerySchema(document.photoGallery),
    ...ReviewSchema(document.c_reviews),
    ...AggregateRatingSchema(document.c_aggregateRating),
    ...OfferSchema({
      url: "",
      priceCurrency: document.c_currency,
      price: document.price,
      priceValidUntil: document.expirationDate,
      itemCondition: document.condition,
      availability: document.stockStatus,
    }),
    description: document.description,
    sku: document.sku,
    mpn: document.mpn,
    ...(document.brand && {
      brand: {
        "@type": "Brand",
        name: document.brand,
      },
    }),
  };
};

export { Product };
