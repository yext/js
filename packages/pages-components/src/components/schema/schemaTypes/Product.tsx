import { BaseSchema } from "./BaseSchema.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";
import { ReviewSchema, AggregateRatingSchema } from "../yextFields/review.js";
import { OfferSchema } from "../yextFields/offers.js";

// https://schema.org/Product
// Make sure to double check if the fields are correct for your site
const Product = (data: any, schemaType?: string) => {
  return {
    ...BaseSchema(data, schemaType ?? "Product"),
    ...PhotoGallerySchema(data.document.photoGallery),
    ...ReviewSchema(data.document.c_reviews),
    ...AggregateRatingSchema(data.document.c_aggregateRating),
    ...OfferSchema({
      url: "",
      priceCurrency: data.document.c_currency,
      price: data.document.price,
      priceValidUntil: data.document.expirationDate,
      itemCondition: data.document.stockStatus,
      availability: data.document.availabilityDate,
    }),
    description: data.document.description,
    sku: data.document.sku,
    mpn: data.document.mpn,
    brand: {
      "@type": "Brand",
      name: data.document.brand,
    },
  };
};

export { Product };
