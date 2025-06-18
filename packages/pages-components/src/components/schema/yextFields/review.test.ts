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
    expect(validateReview({ bestRating: "5" })).toBe(false);
    expect(validateReview({ author: "John Doe" })).toBe(false);
  });

  it("should return true for valid review objects", () => {
    expect(validateReview({ ratingValue: "4.5" })).toBe(true);
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
    expect(validateAggregateRating({ ratingValue: "4.8" })).toBe(false);
    expect(validateAggregateRating({ reviewCount: "150" })).toBe(false);
  });

  it("should return true for valid aggregate rating objects", () => {
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

    const reviewWithNoRating = { bestRating: "5", author: "Alice" };
    expect(ReviewSchema(reviewWithNoRating)).toBe(false);
  });

  it("returns the correct schema for a valid review with no author", () => {
    const basicReview = { ratingValue: "4" };
    expect(ReviewSchema(basicReview)).toEqual({
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "4",
        },
      },
    });

    const fullReview = { ratingValue: "3.5", bestRating: "5", author: "Bob" };
    expect(ReviewSchema(fullReview)).toEqual({
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

    const rating1 = { ratingValue: "4.7" };
    expect(AggregateRatingSchema(rating1)).toBe(undefined);

    const rating2 = { reviewCount: "200" };
    expect(AggregateRatingSchema(rating2)).toBe(undefined);
  });

  it("returns the correct schema for a valid aggregate rating", () => {
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
