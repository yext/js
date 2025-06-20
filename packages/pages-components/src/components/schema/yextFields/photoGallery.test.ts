import {
  PhotoGallerySchema,
  PhotoSchema,
  validatePhoto,
} from "./photoGallery.js";

describe("validatePhoto", () => {
  it("returns false for invalid photo objects", () => {
    expect(validatePhoto(undefined)).toBe(false);
    expect(validatePhoto({})).toBe(false);
    expect(validatePhoto({ image: {} })).toBe(false);
    expect(validatePhoto({ image: { url: 123 } })).toBe(false);
    expect(validatePhoto("string")).toBe(false);
  });

  it("should return true for valid photo objects", () => {
    expect(
      validatePhoto({ image: { url: "https://example.com/image.jpg" } })
    ).toBe(true);
    expect(
      validatePhoto({
        image: {
          url: "https://example.com/image.jpg",
          width: 800,
          height: 600,
        },
      })
    ).toBe(true);
  });
});

describe("PhotoGallerySchema", () => {
  it("returns an empty object if gallery is undefined or null", () => {
    expect(PhotoGallerySchema(undefined)).toEqual({});
    expect(PhotoGallerySchema(null as any)).toEqual({});
  });

  it("returns an empty array for an empty gallery", () => {
    expect(PhotoGallerySchema([])).toEqual({ image: [] });
  });

  it("returns an array of image urls for a valid gallery", () => {
    const gallery = [
      {
        image: {
          url: "https://example.com/photo1.jpg",
          width: 100,
          height: 100,
        },
      },
      {
        image: {
          url: "https://example.com/photo2.png",
          width: 100,
          height: 100,
        },
      },
    ];
    expect(PhotoGallerySchema(gallery)).toEqual({
      image: [
        "https://example.com/photo1.jpg",
        "https://example.com/photo2.png",
      ],
    });
  });

  it("filters out invalid photos from the gallery", () => {
    const gallery = [
      { image: { url: "https://valid.com/photo1.jpg" } },
      { image: {} },
      { image: { url: "https://valid.com/photo2.png" } },
      { invalid: "photo" as any },
      { image: { url: "https://valid.com/photo3.gif" } },
    ];
    expect(PhotoGallerySchema(gallery as any)).toEqual({
      image: [
        "https://valid.com/photo1.jpg",
        "https://valid.com/photo2.png",
        "https://valid.com/photo3.gif",
      ],
    });
  });
});

describe("PhotoSchema", () => {
  it("returns false for invalid photo input", () => {
    expect(PhotoSchema(undefined)).toBe(false);
    expect(PhotoSchema({} as any)).toBe(false);
    expect(PhotoSchema({ image: { url: 123 } } as any)).toBe(false);
  });

  it("returns the correct schema for a valid photo", () => {
    const photo = { image: { url: "https://example.com/single-photo.jpg" } };
    expect(PhotoSchema(photo as any)).toEqual({
      image: "https://example.com/single-photo.jpg",
    });

    const photoWithSize = {
      image: {
        url: "https://example.com/another.png",
        width: 1024,
        height: 768,
      },
    };
    expect(PhotoSchema(photoWithSize)).toEqual({
      image: "https://example.com/another.png",
    });
  });
});
