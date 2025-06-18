import { BaseSchema } from "./BaseSchema.js";
import { LocationSchema } from "../yextFields/address.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";
import { PerformerSchema, OrganizationSchema } from "../yextFields/people.js";
import { OfferSchema } from "../yextFields/offers.js";

// https://schema.org/Event
// Make sure to double check if the fields are correct for your site
const Event = (document: Record<string, any>, schemaType?: string) => {
  const location = LocationSchema({
    name: document.geomodifier,
    address: document.address,
  });
  return {
    ...BaseSchema(document, schemaType ?? "Event"),
    ...PhotoGallerySchema(document.photoGallery),
    ...(location && { location }),
    ...PerformerSchema(document.performers),
    ...OrganizationSchema({
      name: document.organizerName,
    }),
    ...OfferSchema({
      url: "",
      priceCurrency: document.c_currency,
      price: document.price,
      priceValidUntil: document.expirationDate,
      itemCondition: document.condition,
      availability: document.stockStatus,
    }),
    ...(document.c_startDate && { startDate: document.c_startDate }),
    ...(document.c_endDate && { endDate: document.c_endDate }),
    ...(document.description && { description: document.description }),
    ...(document.attendance && { eventAttendanceMode: document.attendance }),
    ...(document.eventStatus && { eventStatus: document.eventStatus }),
  };
};

export { Event };
