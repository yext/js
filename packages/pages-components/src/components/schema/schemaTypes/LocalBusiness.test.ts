import { describe, it, expect } from "vitest";
import { LocalBusiness } from "./LocalBusiness.js";
import { validateHoursType } from "../yextFields/hours.js";

const mockAddress = {
  city: "Arlington",
  countryCode: "US",
  line1: "1101 Wilson Blvd",
  localizedCountryName: "United States",
  localizedRegionName: "Arlington",
  postalCode: "22209",
  region: "VA",
};

const mockHours = {
  monday: {
    isClosed: false,
    openIntervals: [{ start: "09:00", end: "17:00" }],
  },
  tuesday: {
    isClosed: false,
    openIntervals: [{ start: "09:00", end: "17:00" }],
  },
  wednesday: {
    isClosed: false,
    openIntervals: [{ start: "09:00", end: "17:00" }],
  },
  thursday: {
    isClosed: false,
    openIntervals: [{ start: "09:00", end: "17:00" }],
  },
  friday: {
    isClosed: false,
    openIntervals: [{ start: "09:00", end: "17:00" }],
  },
  saturday: {
    isClosed: true,
  },
  sunday: {
    isClosed: true,
  },
};

const mockPhotoGallery = [
  {
    image: {
      url: "https://example.com/image1.jpg",
      width: 1000,
      height: 800,
    },
  },
  {
    image: {
      url: "https://example.com/image2.jpg",
      width: 1200,
      height: 900,
    },
  },
];

describe("LocalBusiness", () => {
  it("returns a basic LocalBusiness schema for a document with only a name", () => {
    const document = { name: "Test Business" };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Test Business",
    });
  });

  it("returns a LocalBusiness schema with address information", () => {
    const document = { name: "Test Business", address: mockAddress };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Test Business",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1101 Wilson Blvd",
        addressLocality: "Arlington",
        addressRegion: "VA",
        postalCode: "22209",
        addressCountry: "US",
      },
    });
  });

  it("returns a LocalBusiness schema with opening hours", () => {
    const document = { name: "Test Business", hours: mockHours };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Test Business",
      openingHours: ["Mo,Tu,We,Th,Fr 09:00-17:00", "Sa,Su 00:00-00:00"],
    });
  });

  it("returns a LocalBusiness schema with photo gallery", () => {
    const document = { name: "Test Business", photoGallery: mockPhotoGallery };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Test Business",
      image: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
    });
  });

  it("returns a LocalBusiness schema with description, telephone, and email", () => {
    const document = {
      name: "Test Business",
      description: "A test business description.",
      mainPhone: "123-456-7890",
      email: "test@example.com",
    };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Test Business",
      description: "A test business description.",
      telephone: "123-456-7890",
      email: "test@example.com",
    });
  });

  it("returns a specific schema type when provided", () => {
    const document = { name: "Test Medical Business" };
    const schema = LocalBusiness(document, "MedicalBusiness");
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      name: "Test Medical Business",
    });
  });

  it("returns a comprehensive LocalBusiness schema with all valid fields", () => {
    console.log(validateHoursType(mockHours));
    const document = {
      name: "Comprehensive Test Business",
      address: mockAddress,
      hours: mockHours,
      photoGallery: mockPhotoGallery,
      description: "This is a comprehensive test business.",
      mainPhone: "987-654-3210",
      email: "comprehensive@example.com",
    };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Comprehensive Test Business",
      address: {
        "@type": "PostalAddress",
        streetAddress: "1101 Wilson Blvd",
        addressLocality: "Arlington",
        addressRegion: "VA",
        postalCode: "22209",
        addressCountry: "US",
      },
      openingHours: ["Mo,Tu,We,Th,Fr 09:00-17:00", "Sa,Su 00:00-00:00"],
      image: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      description: "This is a comprehensive test business.",
      telephone: "987-654-3210",
      email: "comprehensive@example.com",
    });
  });

  it("handles undefined or empty input", () => {
    const document = { name: "Business with no extra data" };
    const schema = LocalBusiness(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Business with no extra data",
      description: undefined,
      email: undefined,
      telephone: undefined,
    });
  });
});
