import { getImageTransformationsString } from "./url.js";

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
