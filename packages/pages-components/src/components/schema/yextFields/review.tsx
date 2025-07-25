export type Review = {
  ratingValue?: string;
  bestRating?: string;
  author?: string;
};

export const validateReview = (review: any): review is Review => {
  if (typeof review !== "object") {
    return false;
  }
  return "ratingValue" in review;
};

export type AggregateRating = {
  ratingValue?: string;
  reviewCount?: string;
};

export const validateAggregateRating = (
  aggregateRating: any
): aggregateRating is AggregateRating => {
  if (typeof aggregateRating !== "object") {
    return false;
  }
  return "ratingValue" in aggregateRating && "reviewCount" in aggregateRating;
};

export const ReviewSchema = (review?: Review) => {
  return (
    validateReview(review) && {
      review: {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: review.ratingValue,
          bestRating: review.bestRating,
        },
        ...(review.author && {
          author: {
            "@type": "Person",
            name: review.author,
          },
        }),
      },
    }
  );
};

export const AggregateRatingSchema = (rating?: AggregateRating) => {
  return validateAggregateRating(rating)
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating.ratingValue,
          reviewCount: rating.reviewCount,
        },
      }
    : undefined;
};
