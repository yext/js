import { describe, it, expect } from "vitest";
import { Product } from "./Product.js";

const mockPhotoGallery = [
  {
    image: {
      url: "https://example.com/product-image1.jpg",
      width: 1000,
      height: 800,
    },
  },
  {
    image: {
      url: "https://example.com/product-image2.jpg",
      width: 1200,
      height: 900,
    },
  },
];

const mockReview = {
  ratingValue: "4.5",
  bestRating: "5",
  author: "John Doe",
};

const mockAggregateRating = {
  ratingValue: "4.2",
  reviewCount: "120",
};

const mockOfferFields = {
  c_currency: "USD",
  price: "99.99",
  expirationDate: "2025-12-31",
  stockStatus: "InStock",
  availabilityDate: "2024-01-01",
};

describe("Product", () => {
  it("returns a basic Product schema for a document with only a name", () => {
    const document = { name: "Test Product" };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      name: "Test Product",
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

  it("returns a Product schema with photo gallery", () => {
    const document = { name: "Test Product", photoGallery: mockPhotoGallery };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      name: "Test Product",
      image: [
        "https://example.com/product-image1.jpg",
        "https://example.com/product-image2.jpg",
      ],
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

  it("returns a Product schema with a single review", () => {
    const document = { name: "Test Product", c_reviews: mockReview };
    const schema = Product(document);
    console.log(schema);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Test Product",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      mpn: undefined,
      sku: undefined,
      review: {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "John Doe",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4.5",
          bestRating: "5",
        },
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

  it("returns a Product schema with aggregate rating", () => {
    const document = {
      name: "Test Product",
      c_aggregateRating: mockAggregateRating,
    };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Test Product",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      mpn: undefined,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.2",
        reviewCount: "120",
      },
      offers: {
        "@type": "Offer",
        url: "",
        priceCurrency: undefined,
        price: undefined,
        priceValidUntil: undefined,
        itemCondition: undefined,
        availability: undefined,
      },
    });
  });

  it("returns a Product schema with offer details", () => {
    const document = {
      name: "Test Product",
      c_currency: mockOfferFields.c_currency,
      price: mockOfferFields.price,
      expirationDate: mockOfferFields.expirationDate,
      stockStatus: mockOfferFields.stockStatus,
      availabilityDate: mockOfferFields.availabilityDate,
    };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Test Product",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      mpn: undefined,
      offers: {
        "@type": "Offer",
        url: "",
        priceCurrency: "USD",
        price: "99.99",
        priceValidUntil: "2025-12-31",
        itemCondition: "InStock",
        availability: "2024-01-01",
      },
    });
  });

  it("returns a Product schema with description, SKU, MPN, and brand", () => {
    const document = {
      name: "Test Product",
      description: "A fantastic new gadget.",
      sku: "PROD123",
      mpn: "MPN456",
      brand: "Awesome Brands Inc.",
    };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Test Product",
      description: "A fantastic new gadget.",
      sku: "PROD123",
      mpn: "MPN456",
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
      brand: {
        "@type": "Brand",
        name: "Awesome Brands Inc.",
      },
    });
  });

  it("returns a specific schema type when provided", () => {
    const document = { name: "Test Software Application" };
    const schema = Product(document, "SoftwareApplication");
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Test Software Application",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      mpn: undefined,
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

  it("returns a comprehensive Product schema with all valid fields", () => {
    const document = {
      name: "Comprehensive Product",
      photoGallery: mockPhotoGallery,
      c_reviews: mockReview,
      c_aggregateRating: mockAggregateRating,
      c_currency: mockOfferFields.c_currency,
      price: mockOfferFields.price,
      expirationDate: mockOfferFields.expirationDate,
      stockStatus: mockOfferFields.stockStatus,
      availabilityDate: mockOfferFields.availabilityDate,
      description: "An all-in-one comprehensive product for all your needs.",
      sku: "COMPREHENSIVE-SKU",
      mpn: "COMPREHENSIVE-MPN",
      brand: "Global Brands Co.",
    };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Comprehensive Product",
      image: [
        "https://example.com/product-image1.jpg",
        "https://example.com/product-image2.jpg",
      ],
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4.5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "John Doe",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.2",
        reviewCount: "120",
      },
      offers: {
        "@type": "Offer",
        url: "",
        priceCurrency: "USD",
        price: "99.99",
        priceValidUntil: "2025-12-31",
        itemCondition: "InStock",
        availability: "2024-01-01",
      },

      description: "An all-in-one comprehensive product for all your needs.",
      sku: "COMPREHENSIVE-SKU",
      mpn: "COMPREHENSIVE-MPN",
      brand: {
        "@type": "Brand",
        name: "Global Brands Co.",
      },
    });
  });

  it("handles undefined or empty input", () => {
    const document = { name: "Product with minimal data" };
    const schema = Product(document);
    expect(schema).toEqual({
      "@context": "https://schema.org",
      "@type": "Product",
      name: "Product with minimal data",
      brand: {
        "@type": "Brand",
        name: undefined,
      },
      description: undefined,
      mpn: undefined,
      offers: {
        "@type": "Offer",
        availability: undefined,
        itemCondition: undefined,
        price: undefined,
        priceCurrency: undefined,
        priceValidUntil: undefined,
        url: "",
      },
      sku: undefined,
    });
  });
});
