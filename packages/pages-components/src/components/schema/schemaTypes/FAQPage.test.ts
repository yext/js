import { describe, it, expect } from "vitest";
import { FAQPage } from "./FAQPage.js";

const mockPlainTextFAQ = [
  {
    question: "What is your return policy?",
    answer: "You can return items within 30 days of purchase.",
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship to most countries worldwide.",
  },
];

const mockRichTextFAQ = [
  {
    question: "What are your business hours?",
    answerV2: {
      json: {
        kind: "document",
        children: [
          {
            kind: "paragraph",
            children: [{ kind: "text", text: "Monday - Friday: 9 AM - 5 PM" }],
          },
          {
            kind: "paragraph",
            children: [{ kind: "text", text: "Saturday: 10 AM - 2 PM" }],
          },
          {
            kind: "paragraph",
            children: [{ kind: "text", text: "Sunday: Closed" }],
          },
        ],
      },
    },
  },
];

const mockMixedFAQ = [
  {
    question: "What is your return policy?",
    answer: "You can return items within 30 days of purchase.",
  },
  {
    question: "What are your business hours?",
    answerV2: {
      json: {
        kind: "document",
        children: [
          {
            kind: "paragraph",
            children: [{ kind: "text", text: "Monday - Friday: 9 AM - 5 PM" }],
          },
        ],
      },
    },
  },
  {
    question: "How do I contact support?",
    answer: "You can reach us via email or phone.",
  },
];

describe("FAQPage", () => {
  it("returns a FAQPage schema for plain text FAQs", () => {
    const schema = FAQPage(mockPlainTextFAQ);
    expect(schema).toEqual({
      "@context": "http://www.schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is your return policy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can return items within 30 days of purchase.",
          },
        },
        {
          "@type": "Question",
          name: "Do you offer international shipping?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we ship to most countries worldwide.",
          },
        },
      ],
    });
  });

  it("returns a FAQPage schema for rich text FAQs", () => {
    const schema = FAQPage(mockRichTextFAQ);
    expect(schema).toEqual({
      "@context": "http://www.schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are your business hours?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Monday - Friday: 9 AM - 5 PM" +
              "Saturday: 10 AM - 2 PM" +
              "Sunday: Closed",
          },
        },
      ],
    });
  });

  it("returns a FAQPage schema for mixed plain text and rich text FAQs", () => {
    const schema = FAQPage(mockMixedFAQ);
    expect(schema).toEqual({
      "@context": "http://www.schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is your return policy?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can return items within 30 days of purchase.",
          },
        },
        {
          "@type": "Question",
          name: "What are your business hours?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Monday - Friday: 9 AM - 5 PM",
          },
        },
        {
          "@type": "Question",
          name: "How do I contact support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can reach us via email or phone.",
          },
        },
      ],
    });
  });

  it("handles empty array input gracefully", () => {
    const schema = FAQPage([]);
    expect(schema).toEqual({
      "@context": "http://www.schema.org",
      "@type": "FAQPage",
      mainEntity: [],
    });
  });

  it("handles invalid FAQ entries gracefully", () => {
    const invalidFAQ = [
      { question: "Valid question", answer: "Valid answer" },
      { notAQuestion: "invalid", notAnAnswer: "invalid" },
      {
        question: "Another valid question",
        answerV2: {
          json: {
            kind: "paragraph",
            children: [{ kind: "text", text: "Another valid answer." }],
          },
        },
      },
      null,
      undefined,
      "a string",
      123,
    ];
    const schema = FAQPage(invalidFAQ as any);
    expect(schema).toEqual({
      "@context": "http://www.schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Valid question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Valid answer",
          },
        },
        undefined, // Invalid entry
        {
          "@type": "Question",
          name: "Another valid question",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Another valid answer.",
          },
        },
        undefined, // Invalid entry
        undefined, // Invalid entry
        undefined, // Invalid entry
        undefined, // Invalid entry
      ],
    });
  });
});
