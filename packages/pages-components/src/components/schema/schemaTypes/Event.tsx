import { BaseSchema } from "./BaseSchema.js";
import { LocationSchema } from "../yextFields/address.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";
import { PerformerSchema, OrganizationSchema } from "../yextFields/people.js";
import { OfferSchema } from "../yextFields/offers.js";

// https://schema.org/Event
// Make sure to double check if the fields are correct for your site
const Event = (document: Record<string, any>, schemaType?: string) => {
  return {
    ...BaseSchema(document, schemaType ?? "Event"),
    ...PhotoGallerySchema(document.photoGallery),
    location: {
      ...LocationSchema({
        name: document.geomodifier,
        address: document.address,
      }),
    },
    startDate: document.c_startDate,
    endDate: document.c_endDate,
    description: document.description,
    eventAttendanceMode: document.attendance,
    eventStatus: document.eventStatus,
    ...PerformerSchema(document.performers),
    ...OrganizationSchema({
      name: document.organizerName,
    }),
    ...OfferSchema({
      url: "",
      priceCurrency: document.c_currency,
      price: document.price,
      priceValidUntil: document.expirationDate,
      itemCondition: document.stockStatus,
      availability: document.availabilityDate,
    }),
  };
};

export { Event };
