import { ImageType } from "../../image/types.js";

export type PhotoGallery = Photo[];

type Photo = {
  image: ImageType;
};

export const validatePhoto = (photo: any): photo is Photo => {
  if (typeof photo !== "object" || !("image" in photo)) {
    return false;
  }
  return "url" in photo.image && typeof photo.image.url === "string";
};

// takes in a list of Yext images and return a list of image urls
export const PhotoGallerySchema = (gallery?: PhotoGallery) => {
  if (!gallery) {
    return {};
  }

  const imageArray = new Array<string>();

  for (const photo of gallery) {
    if (validatePhoto(photo)) {
      imageArray.push(photo.image.url);
    }
  }

  return {
    image: imageArray,
  };
};

// takes in a single Yext image
export const PhotoSchema = (photo?: Photo) => {
  return (
    validatePhoto(photo) && {
      image: photo.image.url,
    }
  );
};
