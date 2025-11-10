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
    expect(result).toBe("https://dyn.mktgcdn.com/p/uuid/width=800,height=600");
  });

  it("converts Yext CDN file URLs", () => {
    const yextFileUrl = "https://a.mktgcdn.com/f/contentHash.jpg";
    const result = getImageUrl(yextFileUrl, width, height);
    expect(result).toBe(
      "https://dyn.mktgcdn.com/f/contentHash.jpg/width=800,height=600"
    );
  });

  it("converts Yext CDN EU URLs", () => {
    const yextEuUrl = "https://a.eu.mktgcdn.com/f/contentHash.jpg";
    const result = getImageUrl(yextEuUrl, width, height);
    expect(result).toBe(
      "https://dyn.eu.mktgcdn.com/f/contentHash.jpg/width=800,height=600"
    );
  });

  it("returns Unsplash URLs as-is without conversion", () => {
    const unsplashUrl = "https://images.unsplash.com/photo-1234567890";
    const result = getImageUrl(unsplashUrl, width, height);
    expect(result).toBe(unsplashUrl);
  });

  it("rejects malicious hostnames that try to spoof Yext CDN domain", () => {
    const maliciousUrl1 = "https://evil-mktgcdn.com.attacker.com/f/file.jpg";
    const result1 = getImageUrl(maliciousUrl1, width, height);
    expect(result1).toBe(maliciousUrl1);

    const maliciousUrl2 = "https://mktgcdn.com.evil.com/p/photo.jpg";
    const result2 = getImageUrl(maliciousUrl2, width, height);
    expect(result2).toBe(maliciousUrl2);

    const maliciousUrl3 = "https://attacker.com/mktgcdn.com/f/file.jpg";
    const result3 = getImageUrl(maliciousUrl3, width, height);
    expect(result3).toBe(maliciousUrl3);
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
