import { describe, it, expect } from "vitest";
import { Event } from "./Event.js";
import { BaseSchema } from "./BaseSchema.js";

const mockAddress = {
  city: "New York",
  countryCode: "US",
  line1: "123 Event Street",
  postalCode: "10001",
  region: "NY",
};

const mockPhotoGallery = [
  {
    image: {
      url: "https://example.com/event-image1.jpg",
      width: 800,
      height: 600,
    },
  },
];

const mockPerformers = ["Band A", "Singer B"];

const mockOfferFields = {
  c_currency: "USD",
  price: "25.00",
  expirationDate: "2025-06-15",
  stockStatus: "InStock",
  availabilityDate: "2025-01-01",
};

describe("Event", () => {
  it("returns a basic Event schema for a document with only a name", () => {
    const document = { name: "Test Event" };
    const schema = Event(document);
    console.log(BaseSchema(document, "Event"));
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Test Event",
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with location information", () => {
    const document = {
      name: "Concert in Central Park",
      geomodifier: "Central Park",
      address: mockAddress,
    };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Concert in Central Park",
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
      location: {
        "@type": "Place",
        name: "Central Park",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Event Street",
          addressLocality: "New York",
          addressRegion: "NY",
          postalCode: "10001",
          addressCountry: "US",
        },
      },
    });
  });

  it("returns an Event schema with photo gallery", () => {
    const document = { name: "Art Exhibition", photoGallery: mockPhotoGallery };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Art Exhibition",
      image: ["https://example.com/event-image1.jpg"],
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with start and end dates", () => {
    const document = {
      name: "Conference 2025",
      c_startDate: "2025-09-10T09:00:00",
      c_endDate: "2025-09-12T17:00:00",
    };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Conference 2025",
      startDate: "2025-09-10T09:00:00",
      endDate: "2025-09-12T17:00:00",
      description: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with description, attendance mode, and event status", () => {
    const document = {
      name: "Online Workshop",
      description: "A workshop on web development.",
      attendance: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
    };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Online Workshop",
      description: "A workshop on web development.",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      endDate: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with performers", () => {
    const document = { name: "Music Festival", performers: mockPerformers };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Music Festival",
      performer: {
        "@type": "PerformingGroup",
        name: "Band A and Singer B",
      },
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with organizer information", () => {
    const document = { name: "Charity Gala", organizerName: "Charity Org" };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Charity Gala",
      organizer: {
        "@type": "Organization",
        name: "Charity Org",
      },
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns an Event schema with offer details", () => {
    const document = {
      name: "Ticket Sale",
      c_currency: mockOfferFields.c_currency,
      price: mockOfferFields.price,
      expirationDate: mockOfferFields.expirationDate,
      stockStatus: mockOfferFields.stockStatus,
      availabilityDate: mockOfferFields.availabilityDate,
    };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Ticket Sale",
      offers: {
        "@type": "Offer",
        url: "",
        priceCurrency: "USD",
        price: "25.00",
        priceValidUntil: "2025-06-15",
        itemCondition: "InStock",
        availability: "2025-01-01",
      },
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
    });
  });

  it("returns a specific schema type when provided", () => {
    const document = { name: "Comedy Show" };
    const schema = Event(document, "ComedyEvent");
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "ComedyEvent",
      name: "Comedy Show",
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });

  it("returns a comprehensive Event schema with all valid fields", () => {
    const document = {
      name: "Grand Opening Event",
      geomodifier: "Grand Hall",
      address: mockAddress,
      photoGallery: mockPhotoGallery,
      c_startDate: "2025-07-01T10:00:00",
      c_endDate: "2025-07-01T18:00:00",
      description: "Come celebrate our grand opening!",
      attendance: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      performers: mockPerformers,
      organizerName: "Event Organizers Inc.",
      c_currency: mockOfferFields.c_currency,
      price: mockOfferFields.price,
      expirationDate: mockOfferFields.expirationDate,
      stockStatus: mockOfferFields.stockStatus,
      availabilityDate: mockOfferFields.availabilityDate,
    };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Grand Opening Event",
      location: {
        "@type": "Place",
        name: "Grand Hall",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Event Street",
          addressLocality: "New York",
          addressRegion: "NY",
          postalCode: "10001",
          addressCountry: "US",
        },
      },
      image: ["https://example.com/event-image1.jpg"],
      startDate: "2025-07-01T10:00:00",
      endDate: "2025-07-01T18:00:00",
      description: "Come celebrate our grand opening!",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      performer: {
        "@type": "PerformingGroup",
        name: "Band A and Singer B",
      },
      organizer: {
        "@type": "Organization",
        name: "Event Organizers Inc.",
      },
      offers: {
        "@type": "Offer",
        url: "",
        priceCurrency: "USD",
        price: "25.00",
        priceValidUntil: "2025-06-15",
        itemCondition: "InStock",
        availability: "2025-01-01",
      },
    });
  });

  it("handles undefined or empty input", () => {
    const document = { name: "Event with minimal data" };
    const schema = Event(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Event with minimal data",
      description: undefined,
      endDate: undefined,
      eventAttendanceMode: undefined,
      eventStatus: undefined,
      organizer: {
        "@type": "Organization",
        name: undefined,
        url: undefined,
      },
      location: {
        "@type": "Place",
        name: undefined,
      },
      startDate: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
    });
  });
});
