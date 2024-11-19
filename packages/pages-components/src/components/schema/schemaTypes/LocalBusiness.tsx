import { BaseSchema } from "./BaseSchema.js";
import { AddressSchema } from "../yextFields/address.js";
import { OpeningHoursSchema } from "../yextFields/hours.js";
import { PhotoGallerySchema } from "../yextFields/photoGallery.js";

// LocalBusiness includes sub-LocalBusiness schema types, including:
// FinancialService, TravelAgency, GovernmentOffice, ShoppingCenter, MedicalBusiness etc
// pass different variables to the schemaType param if needed
// more sub-types see https://schema.org/LocalBusiness
const LocalBusiness = (document: Record<string, any>, schemaType?: string) => {
  return {
    ...BaseSchema(document, schemaType ?? "LocalBusiness"), // default, if schemaType is nil, set to LocalBusiness
    ...AddressSchema(document.address),
    ...OpeningHoursSchema(document.hours),
    ...PhotoGallerySchema(document.photoGallery),
    description: document.description,
    telephone: document.mainPhone,
    email: document.email,
  };
};

export { LocalBusiness };
