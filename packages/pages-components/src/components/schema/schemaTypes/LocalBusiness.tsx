import { BaseSchema } from "./BaseSchema.js";
import { AddressSchema } from "../yextFields/address.js";
import { OpeningHoursSchema } from "../yextFields/hours.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";

// LocalBusiness includes sub-LocalBusiness schema types, including:
// FinancialService, TravelAgency, GovernmentOffice, ShoppingCenter, MedicalBusiness etc
// pass different variables to the schemaType param if needed
// more sub-types see https://schema.org/LocalBusiness
const LocalBusiness = (data: any, schemaType?: string) => {
  return {
    ...BaseSchema(data, schemaType ?? "LocalBusiness"), // default, if schemaType is nil, set to LocalBusiness
    ...AddressSchema(data.document.address),
    ...OpeningHoursSchema(data.document.hours),
    ...PhotoGallerySchema(data.document.photoGallery),
    description: data.document.description,
    telephone: data.document.mainPhone,
    email: data.document.email,
  };
};

export { LocalBusiness };
