import { BaseSchema } from "./BaseSchema.js";
import { LocationSchema } from "../yextFields/address.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";
import { PerformerSchema, OrganizationSchema } from "../yextFields/people.js";
import { OfferSchema } from "../yextFields/offers.js";

// https://schema.org/Event
// Make sure to double check if the fields are correct for your site
const Event = (data: any, schemaType?: string) => {
  return {
    ...BaseSchema(data, schemaType ?? "Event"),
    ...PhotoGallerySchema(data.document.photoGallery),
    ...LocationSchema({
      name: data.document.geomodifier,
      address: data.document.address,
    }),
    startDate: data.document.c_startDate,
    endDate: data.document.c_endDate,
    description: data.document.description,
    eventAttendanceMode: data.document.attendance,
    eventStatus: data.document.eventStatus,
    ...PerformerSchema(data.document.performers),
    ...OrganizationSchema({
      name: data.document.organizerName,
    }),
    ...OfferSchema({
      url: "",
      priceCurrency: data.document.c_currency,
      price: data.document.price,
      priceValidUntil: data.document.expirationDate,
      itemCondition: data.document.stockStatus,
      availability: data.document.availabilityDate,
    }),
  };
};

export { Event };
