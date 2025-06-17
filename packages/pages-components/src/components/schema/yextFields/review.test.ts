import {
  AggregateRatingSchema,
  ReviewSchema,
  validateAggregateRating,
  validateReview,
} from "./review.js";

describe("validateReview", () => {
  it("returns false for invalid review objects", () => {
    expect(validateReview(undefined)).toBe(false);
    expect(validateReview({})).toBe(false);
    expect(validateReview("string")).toBe(false);
    expect(validateReview({ unknownKey: "value" })).toBe(false);
  });

  it("should return true for valid review objects", () => {
    expect(validateReview({ ratingValue: "4.5" })).toBe(true);
    expect(validateReview({ bestRating: "5" })).toBe(true);
    expect(validateReview({ author: "John Doe" })).toBe(true);
    expect(
      validateReview({
        ratingValue: "4",
        bestRating: "5",
        author: "Jane Smith",
      })
    ).toBe(true);
  });
});

describe("validateAggregateRating", () => {
  it("returns false for invalid aggregate rating objects", () => {
    expect(validateAggregateRating(undefined)).toBe(false);
    expect(validateAggregateRating({})).toBe(false);
    expect(validateAggregateRating("string")).toBe(false);
    expect(validateAggregateRating(123)).toBe(false);
    expect(validateAggregateRating({ unknownKey: "value" })).toBe(false);
  });

  it("should return true for valid aggregate rating objects", () => {
    expect(validateAggregateRating({ ratingValue: "4.8" })).toBe(true);
    expect(validateAggregateRating({ reviewCount: "150" })).toBe(true);
    expect(
      validateAggregateRating({ ratingValue: "4.2", reviewCount: "50" })
    ).toBe(true);
  });
});

describe("ReviewSchema", () => {
  it("returns false for invalid review input", () => {
    expect(ReviewSchema(undefined)).toBe(false);
    expect(ReviewSchema({})).toBe(false);
    expect(ReviewSchema({ invalid: "data" } as any)).toBe(false);
  });

  it("returns the correct schema for a valid review", () => {
    const review1 = { ratingValue: "4" };
    expect(ReviewSchema(review1)).toEqual({
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
          bestRating: undefined,
        },
        author: {
          "@type": "Person",
          name: undefined,
        },
      },
    });

    const review2 = { bestRating: "5", author: "Alice" };
    expect(ReviewSchema(review2)).toEqual({
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: undefined,
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Alice",
        },
      },
    });

    const review3 = { ratingValue: "3.5", bestRating: "5", author: "Bob" };
    expect(ReviewSchema(review3)).toEqual({
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "3.5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "Bob",
        },
      },
    });
  });
});

describe("AggregateRatingSchema", () => {
  it("returns undefined for invalid aggregate rating input", () => {
    expect(AggregateRatingSchema(undefined)).toBe(undefined);
    expect(AggregateRatingSchema({})).toBe(undefined);
    expect(AggregateRatingSchema({ invalid: "data" } as any)).toBe(undefined);
  });

  it("returns the correct schema for a valid aggregate rating", () => {
    const rating1 = { ratingValue: "4.7" };
    expect(AggregateRatingSchema(rating1)).toEqual({
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.7",
        reviewCount: undefined,
      },
    });

    const rating2 = { reviewCount: "200" };
    expect(AggregateRatingSchema(rating2)).toEqual({
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: undefined,
        reviewCount: "200",
      },
    });

    const rating3 = { ratingValue: "4.0", reviewCount: "75" };
    expect(AggregateRatingSchema(rating3)).toEqual({
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.0",
        reviewCount: "75",
      },
    });
  });
});
