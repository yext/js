import { describe, it, expect, vi } from "vitest";
import { getImageTransformationsString, getImageUrl } from "./url.js";

describe("getImageTransformationsString", () => {
  it("returns an empty string when no transformations are provided", () => {
    expect(getImageTransformationsString(undefined)).toBe("");
    expect(getImageTransformationsString({})).toBe("");
  });

  it("returns a correctly formatted string for valid transformations", () => {
    expect(getImageTransformationsString({ quality: 80, format: "webp" })).toBe(
      ",quality=80,format=webp"
    );
    expect(getImageTransformationsString({ fit: "cover" })).toBe(",fit=cover");
  });

  it("ignores undefined or empty string values", () => {
    expect(
      getImageTransformationsString({
        quality: undefined,
        format: "jpeg",
        // @ts-expect-error
        fit: "",
      })
    ).toBe(",format=jpeg");
  });
});

describe("getImageUrl", () => {
  const width = 800;
  const height = 600;

  it("converts Yext CDN photo URLs", () => {
    const yextPhotoUrl = "https://a.mktgcdn.com/p/uuid/800x600.jpg";
    const result = getImageUrl(yextPhotoUrl, width, height);
    expect(result).toBeDefined();
    expect(result).toContain("dyn.mktgcdn.com");
  });

  it("converts Yext CDN file URLs", () => {
    const yextFileUrl = "https://a.mktgcdn.com/f/contentHash.jpg";
    const result = getImageUrl(yextFileUrl, width, height);
    expect(result).toBeDefined();
    expect(result).toContain("dyn.mktgcdn.com");
  });

  it("converts Yext CDN EU URLs", () => {
    const yextEuUrl = "https://a.eu.mktgcdn.com/f/contentHash.jpg";
    const result = getImageUrl(yextEuUrl, width, height);
    expect(result).toBeDefined();
    expect(result).toContain("dyn.eu.mktgcdn.com");
  });

  it("returns Unsplash URLs as-is without conversion", () => {
    const unsplashUrl = "https://images.unsplash.com/photo-1234567890";
    const result = getImageUrl(unsplashUrl, width, height);
    expect(result).toBe(unsplashUrl);
  });

  it("handles invalid URLs by logging an error", () => {
    const logMock = vi.spyOn(console, "error").mockImplementation(() => {
      /* do nothing */
    });
    const invalidUrl = "not-a-valid-url";

    const result = getImageUrl(invalidUrl, width, height);

    expect(result).toBeUndefined();
    expect(logMock).toHaveBeenCalledWith(`Invalid image url: ${invalidUrl}.`);

    vi.clearAllMocks();
  });
});
